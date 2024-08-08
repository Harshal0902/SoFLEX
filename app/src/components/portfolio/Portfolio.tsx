"use client"

import React, { useState, useEffect } from 'react'
import { userPortfolioDetails, updateUserData, userStatsDetails, userLoanDetails } from '@/actions/dbActions'
import { useTranslations } from 'next-intl'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { icons, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoanDataType, loanColumns } from './columns'
import { DataTable } from '@/components/ui/data-table-portfolio'

interface UserType {
    walletAddress: string;
    name: string;
    email: string;
}

interface LoanCount {
    count: number;
}

interface BorrowingTotal {
    borrowing_total: string;
}

interface LendingAmount {
    lending_amount: string;
    lending_token: string;
}

interface UserStatsType {
    completedLoans: LoanCount[];
    activeLoans: LoanCount[];
    activeBorrowingValue: BorrowingTotal[];
    activeLendingingValue: LendingAmount[];
}

interface CardData {
    title: string;
    tooltipContent: string;
    icon: string;
    currentData?: string | number;
    lastMonthData?: string | number;
    extraTooltipContent?: string;
}

export default function Portfolio({ walletAddress }: { walletAddress: string }) {
    const [loading, setLoading] = useState(true);
    const [userPortfolio, setUserPortfolio] = useState<UserType[]>([]);
    const [withdrawToken, setWithdrawToken] = useState(false);
    const [lendingValues, setLendingValues] = useState<{ token: string; total: number }[]>([]);
    const [selectedToken, setSelectedToken] = useState<string>('');
    const [tokenBalance, setTokenBalance] = useState<number>(0);
    const [saveData, setSaveData] = useState(false);
    const [userStats, setUserStats] = useState<UserStatsType | null>(null);
    const [loadingUserStats, setLoadingUserStats] = useState(true);
    const [maxBorrowing, setMaxBorrowing] = useState<string>('');
    const [otherBorrowings, setOtherBorrowings] = useState<{ token: string; total: number }[]>([]);
    const [maxLending, setMaxLending] = useState<string>('');
    const [otherLendings, setOtherLendings] = useState<{ token: string; total: number }[]>([]);
    const [maxInterest, setMaxInterest] = useState<string>('');
    const [otherInterests, setOtherInterests] = useState<{ token: string; total: number }[]>([]);
    const [loadingLoanHistory, setLoadingLoanHistory] = useState(true);
    const [loanHistoryData, setLoanHistoryData] = useState<LoanDataType[]>([]);

    const t = useTranslations('PortfolioPage');

    const FormSchema = z.object({
        name: z.string({
            required_error: `${t('nameRequired')}`,
        }).min(2, {
            message: `${t('nameMin')}`,
        }).optional().nullable().or(z.literal('')),
        email: z.string({
            required_error: `${t('emailRequired')}`,
        }).email({
            message: `${t('invalidEmail')}`,
        }).optional().nullable().or(z.literal(''))
    })

    const WithdrawTokenSchema = z.object({
        tokenName: z.string({
            required_error: `${t('tokenNameRequired')}`,
        }).min(2, {
            message: `${t('tokenNameRequired')}`,
        }).optional().nullable().or(z.literal('')),
        tokenAmount: z.string()
            .refine(value => !isNaN(Number(value)), {
                message: `${t('tokenAmountMessage1')}`,
            })
            .refine(value => Number(value) > 0, {
                message: `${t('tokenAmountMessage2')}`,
            })
            .refine(value => {
                const stringValue = String(value);
                const [integerPart, decimalPart] = stringValue.split('.');

                if (integerPart.length > 26 || (decimalPart && decimalPart.length > 26)) {
                    return false;
                }

                return true;
            }, {
                message: `${t('tokenAmountMessage3')}`,
            }),
    })

    useEffect(() => {
        const fetchUserPortfolio = async () => {
            try {
                const result = await userPortfolioDetails({ walletAddress: walletAddress });
                setUserPortfolio(result as UserType[]);
                setLoading(false);
                if (result === 'Error fetching user portfolio details') {
                    toast.error(`${t('portfolioError')}`);
                    setLoading(false);
                }
            } catch (error) {
                toast.error(`${t('portfolioError')}`);
                setLoading(false);
            }
        };

        fetchUserPortfolio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUserStatsData = async () => {
        try {
            const result = await userStatsDetails({ walletAddress });
            if (typeof result === 'string') {
                throw new Error(result);
            }

            if (result) {
                setUserStats(result);

                // Handle case when activeBorrowingValue or activeLendingingValue is empty
                const borrowingAggregation: { [key: string]: number[] } = {};
                if (result.activeBorrowingValue.length > 0) {
                    result.activeBorrowingValue.forEach(({ borrowing_total }) => {
                        const [amount, token] = borrowing_total.split(' ');
                        const numericAmount = parseFloat(amount);
                        if (borrowingAggregation[token]) {
                            borrowingAggregation[token].push(numericAmount);
                        } else {
                            borrowingAggregation[token] = [numericAmount];
                        }
                    });
                }

                const aggregatedBorrowingArray = Object.entries(borrowingAggregation).map(([token, amounts]) => {
                    const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0);
                    return {
                        token,
                        totalAmount,
                    };
                });

                aggregatedBorrowingArray.sort((a, b) => b.totalAmount - a.totalAmount);
                const highestBorrowing = aggregatedBorrowingArray[0] || { token: '', totalAmount: 0 };
                const otherBorrowings = aggregatedBorrowingArray.slice(1);

                setMaxBorrowing(`${highestBorrowing.totalAmount.toFixed(4)} ${highestBorrowing.token}`);
                setOtherBorrowings(otherBorrowings.map(({ token, totalAmount }) => ({
                    token,
                    total: totalAmount,
                })));

                const lendingAggregation: { [key: string]: number[] } = {};
                const interestAggregation: { [key: string]: number[] } = {};
                if (result.activeLendingingValue.length > 0) {
                    result.activeLendingingValue.forEach(({ lending_amount, lending_token }) => {
                        const numericAmount = parseFloat(lending_amount);
                        if (lendingAggregation[lending_token]) {
                            lendingAggregation[lending_token].push(numericAmount);
                        } else {
                            lendingAggregation[lending_token] = [numericAmount];
                        }

                        // Calculate 10% interest
                        const interestAmount = numericAmount * 0.1;
                        if (interestAggregation[lending_token]) {
                            interestAggregation[lending_token].push(interestAmount);
                        } else {
                            interestAggregation[lending_token] = [interestAmount];
                        }
                    });
                }

                const aggregatedLendingArray = Object.entries(lendingAggregation).map(([token, amounts]) => {
                    const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0);
                    return {
                        token,
                        totalAmount,
                    };
                });

                aggregatedLendingArray.sort((a, b) => b.totalAmount - a.totalAmount);
                const highestLending = aggregatedLendingArray[0] || { token: '', totalAmount: 0 };
                const otherLendings = aggregatedLendingArray.slice(1);

                setMaxLending(`${highestLending.totalAmount.toFixed(4)} ${highestLending.token}`);
                setOtherLendings(otherLendings.map(({ token, totalAmount }) => ({
                    token,
                    total: totalAmount,
                })));

                const aggregatedInterestArray = Object.entries(interestAggregation).map(([token, amounts]) => {
                    const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0);
                    return {
                        token,
                        totalAmount,
                    };
                });

                aggregatedInterestArray.sort((a, b) => b.totalAmount - a.totalAmount);
                const highestInterest = aggregatedInterestArray[0] || { token: '', totalAmount: 0 };
                const otherInterests = aggregatedInterestArray.slice(1);


                // result.activeLendingingValue.forEach(({ lending_amount, lending_token }) => {
                //     const numericAmount = parseFloat(lending_amount);
                //     if (lendingAggregation[lending_token]) {
                //         lendingAggregation[lending_token].push(numericAmount);
                //     } else {
                //         lendingAggregation[lending_token] = [numericAmount];
                //     }
                // });

                const aggregatedLendingArrayForWithdraw = Object.entries(lendingAggregation).map(([token, amounts]) => {
                    const totalAmount = amounts.reduce((acc, amount) => acc + amount, 0);
                    return {
                        token,
                        total: totalAmount,
                    };
                });

                setLendingValues(aggregatedLendingArrayForWithdraw);

                setMaxInterest(`${highestInterest.totalAmount.toFixed(4)} ${highestInterest.token}`);
                setOtherInterests(otherInterests.map(({ token, totalAmount }) => ({
                    token,
                    total: totalAmount,
                })));
            } else {
                setUserStats(null);
            }
            setLoadingUserStats(false);
        } catch (error) {
            toast.error(`${t('portfolioStatsError')}`);
            setLoadingUserStats(false);
        }
    };

    useEffect(() => {
        fetchUserStatsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress]);

    useEffect(() => {
        if (userPortfolio) {
            form.setValue('name', userPortfolio[0]?.name);
            form.setValue('email', userPortfolio[0]?.email);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPortfolio]);

    useEffect(() => {
        const token = lendingValues.find(t => t.token === selectedToken);
        if (token) {
            setTokenBalance(token.total);
        }
    }, [selectedToken, lendingValues]);

    const fetchLoanHistoryData = async () => {
        const result = await userLoanDetails({ walletAddress: walletAddress });
        setLoanHistoryData(result as LoanDataType[]);
        setLoadingLoanHistory(false);
        if (result === 'Error fetching user loan details') {
            toast.error(`${t('portfolioLoanError')}`);
            setLoadingLoanHistory(false);
        }
    };

    useEffect(() => {
        fetchLoanHistoryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const withdrawForm = useForm<z.infer<typeof WithdrawTokenSchema>>({
        resolver: zodResolver(WithdrawTokenSchema),
        defaultValues: {
            // tokenName: lendingValues.length > 0 ? lendingValues[0].token : '',
            tokenName: '',
            tokenAmount: ''
        },
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmitWithdrawTokens = async (data: z.infer<typeof WithdrawTokenSchema>) => {
        setWithdrawToken(true);
        const values = {
            user_address: walletAddress,
            token_name: data.tokenName,
            token_amount: data.tokenAmount,
        }
        try {
            fetch('/api-route/withdraw-email-api', {
                method: 'POST',
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((response) => {
                    toast.success(`${t('withdrawSuccess')}`);
                    form.reset();
                })
                .catch((error) => {
                    toast.error(`${t('withdrawError')}`);
                })
                .finally(() => {
                    setWithdrawToken(false);
                });
        } catch (error) {
            toast.error(`${t('withdrawError')}`);
        }
    };

    const onSubmitUpdateUserData = async (data: z.infer<typeof FormSchema>) => {
        setSaveData(true);
        try {
            const result = await updateUserData({
                walletAddress: walletAddress,
                name: data.name,
                email: data.email,
            });
            if (result === 'User data updated') {
                setSaveData(false);
                toast.success(`${t('portfolioUpdateSuccess')}`);
            } else {
                setSaveData(false);
                toast.error(`${t('portfolioUpdateError')}`);
            }
        } catch (error) {
            toast.error(`${t('portfolioUpdateError')}`);
        }
    };

    const onTrigger = () => {
        fetchUserStatsData();
        fetchLoanHistoryData();
    };

    const renderIcon = ({ name }: { name: string }) => {
        const LucideIcon = (icons as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[name];
        return <LucideIcon className='h-5 w-5 text-muted-foreground' />
    };

    const cardData: CardData[] = [
        {
            title: `${t('card1Title')}`,
            tooltipContent: `${t('card1TooltipContent')}`,
            icon: 'Activity',
            currentData: maxLending,
            extraTooltipContent: otherLendings.map(b => `${b.total.toFixed(4)} ${b.token}`).join(', '),
        },
        {
            title: `${t('card2Title')}`,
            tooltipContent: `${t('card2TooltipContent')}`,
            icon: 'DollarSign',
            currentData: maxInterest,
            extraTooltipContent: otherInterests.map(b => `${b.total.toFixed(4)} ${b.token}`).join(', '),
        },
        {
            title: `${t('card3Title')}`,
            tooltipContent: `${t('card3TooltipContent')}`,
            icon: 'Landmark',
            currentData: userStats?.completedLoans[0]?.count ?? '0',
        },
        {
            title: `${t('card4Title')}`,
            tooltipContent: `${t('card4TooltipContent')}`,
            icon: 'BriefcaseBusiness',
            currentData: userStats?.activeLoans[0]?.count ?? '0',
        },
        {
            title: `${t('card5Title')}`,
            tooltipContent: `${t('card5TooltipContent')}`,
            icon: 'Banknote',
            currentData: maxBorrowing,
            extraTooltipContent: otherBorrowings.map(b => `${b.total.toFixed(4)} ${b.token}`).join(', '),
        },
    ];

    return (
        <div className='my-4'>
            {loading ? (
                <Card>
                    <CardHeader>
                        <Skeleton className='self-center md:self-start h-8 md:h-16 w-3/4' />
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col h-full space-y-2'>
                            {['h-24 w-full', 'h-8 w-1/2', 'h-8 w-1/4', 'h-8 w-3/4'].map((classes, index) => (
                                <Skeleton key={index} className={classes} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <TooltipProvider>
                        <CardHeader>
                            <div className='flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0'>
                                <div className='text-center md:text-start text-2xl md:text-4xl'>{t('title')}</div>
                                {/* {cardData[0].currentData !== undefined && typeof cardData[0].currentData === 'string' && parseFloat(cardData[0].currentData) > 0 && */}
                                <Dialog>
                                    <div className='w-full md:w-auto'>
                                        <DialogTrigger asChild>
                                            <Button className='w-full md:w-auto'>{t('withdrawToken')}</Button>
                                        </DialogTrigger>
                                    </div>
                                    <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                                        <DialogHeader>
                                            <DialogTitle className='tracking-wide'>{t('withdrawDialogTitle')}</DialogTitle>
                                            <DialogDescription>
                                                {t('withdrawDialogDesc')}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='grid gap-1'>
                                            {lendingValues.length > 0 ? (
                                                <Form {...withdrawForm}>
                                                    <form onSubmit={withdrawForm.handleSubmit(onSubmitWithdrawTokens)} className='w-full space-y-2'>
                                                        <FormField
                                                            control={withdrawForm.control}
                                                            name='tokenName'
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>{t('tokenName')}</FormLabel>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            field.onChange(value);
                                                                            setSelectedToken(value);
                                                                        }}
                                                                    // value={field.value || lendingValues[0]?.token}
                                                                    >
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder={`${t('selectTokenName')}`} />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {lendingValues.map(({ token }) => (
                                                                                <SelectItem key={token} value={token}>
                                                                                    {token}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormDescription>
                                                                        {t('tokenNameDesc')}
                                                                    </FormDescription>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={withdrawForm.control}
                                                            name='tokenAmount'
                                                            render={({ field }) => (
                                                                <FormItem className='w-full pb-2'>
                                                                    <FormLabel>{t('withdrawAmount')}</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder={`${t('tokenWithdrawAmount')}`} {...field} value={field.value || ''} type='number' step='any' min='0' max={tokenBalance} />
                                                                    </FormControl>
                                                                    {tokenBalance > 0 &&
                                                                        <FormDescription>
                                                                            {t('currentBalance')}: {tokenBalance} {withdrawForm.watch('tokenName')}
                                                                        </FormDescription>
                                                                    }
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <Button type='submit' className='w-full' disabled={withdrawToken}>
                                                            {withdrawToken && <Loader2 className='mr-2 h-4 w-4 animate-spin' size={20} />}
                                                            {withdrawToken ? `${t('requesting')}` : `${t('withdrawToken')}`}
                                                        </Button>
                                                    </form>
                                                </Form>
                                            ) : (
                                                <div className='text-center'>{t('noLendingFound')}</div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {/* } */}
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitUpdateUserData)} autoComplete='off'>
                                    <div className='flex flex-col md:flex-row w-full items-center justify-start space-x-0 md:space-x-4 space-y-4 md:space-y-0 py-2'>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>{t('yourName')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={`${t('yourName')}`} {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        {t('optionalField')}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>{t('yourEmail')}</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={`${t('yourEmail')}`} {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        {t('optionalField')}
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type='submit' className='bg-success hover:bg-green-800 w-full md:w-1/2' disabled={saveData}>
                                            {saveData && <Loader2 className='mr-2 h-4 w-4 animate-spin' size={20} />}
                                            {saveData ? `${t('saving')}` : `${t('saveDetails')}`}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5 lg:grid-flow-row lg:grid-rows-auto lg:align-content-start'>
                                {loadingUserStats ? (
                                    <>
                                        {cardData.map((card: CardData, index: number) => (
                                            <div className='flex flex-col h-full space-y-2' key={index}>
                                                {['h-24', 'h-3', 'h-3 w-3/4'].map((classes, index) => (
                                                    <Skeleton key={index} className={classes} />
                                                ))}
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {cardData.map((card: CardData, index: number) => (
                                            <Tooltip delayDuration={300} key={index}>
                                                <TooltipTrigger>
                                                    <Card className='flex flex-col h-full'>
                                                        <CardHeader className='flex flex-row items-center justify-between pb-2'>
                                                            <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1 text-start'>
                                                                <p>{card.title}</p>
                                                            </CardTitle>
                                                            {renderIcon({ name: card.icon })}
                                                        </CardHeader>
                                                        <CardContent className='text-start'>
                                                            <p className='text-2xl font-bold'>
                                                                {card.currentData !== '' && card.currentData !== 0 ? card.currentData : '0'}
                                                            </p>
                                                            {(card.title === `${t('card5Title')}` && otherBorrowings.length > 0) ||
                                                                (card.title === `${t('card1Title')}` && otherLendings.length > 0) ||
                                                                (card.title === `${t('card2Title')}` && otherInterests.length > 0) ? (
                                                                <p className='text-muted-foreground'>
                                                                    +{card.title === `${t('card5Title')}` ? otherBorrowings.length
                                                                        : card.title === `${t('card1Title')}` ? otherLendings.length
                                                                            : card.title === `${t('card2Title')}` ? otherInterests.length
                                                                                : 0} {(card.title === `${t('card5Title')}` ? otherBorrowings.length
                                                                                    : card.title === `${t('card1Title')}` ? otherLendings.length
                                                                                        : card.title === `${t('card2Title')}` ? otherInterests.length
                                                                                            : 0) > 1 ? `${t('others')}` : `${t('other')}`}
                                                                </p>
                                                            ) : null}
                                                        </CardContent>
                                                    </Card>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                    {card.tooltipContent}
                                                    {card.extraTooltipContent && (
                                                        <div className='flex flex-col space-y-2 pt-2'>
                                                            <div className='text-left font-semibold tracking-wide'>{t('otherTokens')}:</div>
                                                            <div className='grid grid-cols-2 gap-1 justify-center'>
                                                                {card.extraTooltipContent.split(', ').map((item, idx) => (
                                                                    <div className='text-left' key={idx}>{item}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className='pt-2'>
                                <h1 className='text-xl py-2'>{t('loanHistory')}</h1>
                                {loadingLoanHistory ? (
                                    <div className='flex flex-col h-full space-y-2'>
                                        {['h-9 md:w-1/3', 'h-10', 'h-12', 'h-12', 'h-12', 'h-12'].map((classes, index) => (
                                            <Skeleton key={index} className={classes} />
                                        ))}
                                    </div>
                                ) : (
                                    <DataTable
                                        columns={loanColumns(onTrigger, t)}
                                        data={loanHistoryData}
                                        userSearchColumn='borrowing_amount'
                                        inputPlaceHolder={t('searchLoan')}
                                        noResultsMessage={t('noLoan')}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </TooltipProvider>
                </Card>
            )}
        </div>
    )
}
