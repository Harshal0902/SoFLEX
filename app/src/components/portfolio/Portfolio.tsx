"use client"

import React, { useState, useEffect } from 'react'
import { userPortfolioDetails, updateUserData, teUserStatsDetails, teUserLoanDetails } from '@/lib/supabaseRequests'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import Loading from '@/components/Loading'
import { Loader2, DollarSign, Landmark, BriefcaseBusiness, Banknote, Activity } from 'lucide-react'
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

interface UserStatsType {
    user_address: string,
    interestearned: string;
    interestearnedlastmonth: string;
    completedloans: string;
    completedloanslastmonth: string;
    activeloans: string;
    activeloanslastmonth: string;
    activeborrowingsvalue: string;
    activeborrowingsvaluelastmonth: string;
    activelendingvalue: string;
    activelendingvaluelastmonth: string;
}

interface CardData {
    title: string;
    tooltipContent: string;
    icon: React.ComponentType<any>;
    currentData?: string | number;
    lastMonthData?: string | number;
}

const FormSchema = z.object({
    name: z.string({
        required_error: 'Name is required.',
    }).min(2, {
        message: 'Name must be at least 2 characters.',
    }).optional().nullable().or(z.literal('')),
    email: z.string({
        required_error: 'Email is required.',
    }).email({
        message: 'Invalid email address.',
    }).optional().nullable().or(z.literal(''))
})

export default function Portfolio({ walletAddress }: { walletAddress?: string }) {
    const [loading, setLoading] = useState(true);
    const [userPortfolio, setUserPortfolio] = useState<UserType[]>([]);
    const [saveData, setSaveData] = useState(false);
    const [userStats, setUserStats] = useState<UserStatsType[]>([]);
    const [loanHistoryData, setLoanHistoryData] = useState<LoanDataType[]>([]);

    const fetchUserPortfolio = async () => {
        try {
            const userPortfolioData = await userPortfolioDetails({ walletAddress: walletAddress });
            setUserPortfolio(userPortfolioData as UserType[]);
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching user portfolio. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPortfolio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchUserStatsData = async () => {
            const data = await teUserStatsDetails({ walletAddress: walletAddress });
            setUserStats(data as UserStatsType[]);
            setLoading(false);
        };
        fetchUserStatsData();
    }, [walletAddress]);

    useEffect(() => {
        if (userPortfolio) {
            form.setValue('name', userPortfolio[0]?.name);
            form.setValue('email', userPortfolio[0]?.email);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPortfolio]);

    useEffect(() => {
        const fetchLoanHistoryData = async () => {
            const result = await teUserLoanDetails({ walletAddress: walletAddress });
            setLoanHistoryData(result as LoanDataType[]);
            setLoading(false);
        };

        fetchLoanHistoryData();
    }, [walletAddress]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    const onSubmitUpdateUserData = async (data: z.infer<typeof FormSchema>) => {
        setSaveData(true);
        try {
            await updateUserData({
                walletAddress: walletAddress,
                name: data.name,
                email: data.email,
            });
            setSaveData(false);
            toast.success('Portfolio updated successfully!');
            await fetchUserPortfolio();
        } catch (error) {
            toast.error('Error updating portfolio. Please try again.');
        }
    };

    const renderIcon = (IconComponent: React.ComponentType<any>) => {
        const Icon = <IconComponent className='h-5 w-5 text-muted-foreground' />;
        return Icon;
    };

    const cardData: CardData[] = [
        {
            title: 'Active Lending Value',
            tooltipContent: 'See the SOL value of your active lending portfolio.',
            icon: Activity,
            currentData: userStats[0]?.activelendingvalue,
            lastMonthData: userStats[0]?.activelendingvaluelastmonth
        },
        {
            title: 'Interest Earned',
            tooltipContent: 'Track your net SOL interest earned from completed loans.',
            icon: DollarSign,
            currentData: userStats[0]?.interestearned,
            lastMonthData: userStats[0]?.interestearnedlastmonth
        },
        {
            title: 'Completed Loans',
            tooltipContent: 'Monitor the number of loans successfully repaid or liquidated.',
            icon: Landmark,
            currentData: userStats[0]?.completedloans,
            lastMonthData: userStats[0]?.completedloanslastmonth
        },
        {
            title: 'Active Loans',
            tooltipContent: 'Stay updated on the number of ongoing active loans and borrowings.',
            icon: BriefcaseBusiness,
            currentData: userStats[0]?.activeloans,
            lastMonthData: userStats[0]?.activeloanslastmonth
        },
        {
            title: 'Active Borrowings Value',
            tooltipContent: 'View the SOL value of all your current active borrowings.',
            icon: Banknote,
            currentData: userStats[0]?.activeborrowingsvalue,
            lastMonthData: userStats[0]?.activeborrowingsvaluelastmonth
        },
    ];

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <Card className='relative md:my-4'>
                    <TooltipProvider>
                        <CardHeader>
                            <div className='text-2xl md:text-4xl'>My Portfolio</div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitUpdateUserData)} autoComplete='off'>
                                    <div className='flex flex-col md:flex-row w-full items-center justify-between space-x-0 md:space-x-4 space-y-4 md:space-y-0 py-2'>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Your Name' {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is an optional field.
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
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Your Email' {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is an optional field.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type='submit' className='bg-success hover:bg-green-800 w-full md:w-1/2 text-white'>
                                            {saveData && <Loader2 className='mr-2 h-4 w-4 animate-spin' size={20} />}
                                            {saveData ? 'Saving...' : 'Save Details'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardHeader>
                        <CardContent>
                            {userStats && (
                                <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5'>
                                    {cardData.map((card: CardData, index: number) => (
                                        <Tooltip delayDuration={300} key={index}>
                                            <TooltipTrigger>
                                                <Card>
                                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                                        <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1 text-start'>
                                                            <p>{card.title}</p>
                                                        </CardTitle>
                                                        {renderIcon(card.icon)}
                                                    </CardHeader>
                                                    <CardContent className='text-start'>
                                                        <p className='text-2xl font-bold'>
                                                            {card.currentData !== undefined ? card.currentData : 'No data available'}
                                                        </p>
                                                        {card.lastMonthData !== undefined &&
                                                            <p className='text-muted-foreground'>
                                                                {card.lastMonthData} from last month
                                                            </p>
                                                        }
                                                    </CardContent>
                                                </Card>
                                            </TooltipTrigger>
                                            <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                {card.tooltipContent}
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            )}
                            <div className='pt-2'>
                                <h1 className='text-xl py-2'>Loan History</h1>
                                <DataTable
                                    columns={loanColumns}
                                    data={loanHistoryData}
                                    userSearchColumn='assetName'
                                    inputPlaceHolder='Search by Asset Name'
                                    noResultsMessage='No loan found.'
                                />
                            </div>
                        </CardContent>
                    </TooltipProvider>
                </Card>
            )}
        </div>
    )
}
