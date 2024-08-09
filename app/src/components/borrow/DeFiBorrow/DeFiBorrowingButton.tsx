import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateUserCreditScore, newDeFiBorrowing } from '@/actions/dbActions'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import { ChevronRight, ChevronLeft, Loader2, Info, ExternalLink } from 'lucide-react'
// import InfoButton from '@/components/InfoButton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export type BorrowingAssetDataType = {
    asset_name: string;
    asset_symbol: string;
    asset_logo: string;
    asset_price: string;
    asset_total_supply: string;
    asset_yield: string;
    asset_total_borrow: string;
    asset_ltv: string;
}

interface Transaction {
    actions: {
        info: {
            sender: string;
        };
    }[];
}

interface NFTType {
    image_uri: string;
    name: string;
    floorprice: number;
    external_url: string;
    mint: string;
    royalty: number;
}

const borrowDuration = [
    '5 days',
    '10 days',
    '15 days',
    '20 days',
    '25 days',
    '30 days',
]

export default function DeFiBorrowingButton({ row }: { row: { original: BorrowingAssetDataType } }) {
    const [open, setOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cNFTResult, setcNFTResult] = useState<NFTType[]>([]);
    const [cNFTLoading, setcNFTLoading] = useState<boolean>(false);
    const [NFTResult, setNFTResult] = useState<NFTType[]>([]);
    const [NFTLoading, setNFTLoading] = useState<boolean>(false);
    const [selectedCNFT, setSelectedCNFT] = useState<number[]>([]);
    const [selectedNFT, setSelectedNFT] = useState<number[]>([]);
    const [totalCNFTPrice, setTotalCNFTPrice] = useState<number>(0);
    const [totalNFTPrice, setTotalNFTPrice] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [creditScore, setCreditScore] = useState<number | null>(null);
    const [interestRate, setInterestRate] = useState<number | undefined>(undefined);

    const order = row.original;
    const { publicKey } = useWallet();
    const wallet = useWallet();
    const t = useTranslations('DeFiBorrowPage');

    const shyft_api_key = process.env.NEXT_PUBLIC_SHYFTAPI!;

    const FormSchema = z.object({
        borrowing_amount: z
            .string()
            .refine(value => {
                const parsedValue = parseFloat(value);
                return !isNaN(parsedValue);
            }, {
                message: `${t('borrowAmountMsg1')}`,
            })
            .refine(value => {
                const parsedValue = parseFloat(value);
                return parsedValue >= 0.00001;
            }, {
                message: `${t('borrowAmountMsg2')}`,
            })
            .refine(value => {
                const stringValue = String(value);
                const [integerPart, decimalPart] = stringValue.split('.');

                if (integerPart.length > 7 || (decimalPart && decimalPart.length > 6)) {
                    return false;
                }

                return true;
            }, {
                message: `${t('borrowAmountMsg3')}`,
            }),
        borrowing_duration: z.string({
            required_error: `${t('borrowDurationMsg')}`,
        }),
        agree_terms: z.boolean()
            .refine(value => value === true, {
                message: `${t('agreeTermsMsg')}`,
                // path: ['agree_terms']
            }),
    });

    useEffect(() => {
        async function fetchData() {
            if (open) {
                setcNFTLoading(true);

                var myHeaders = new Headers();
                myHeaders.append('x-api-key', shyft_api_key);

                var requestOptions: RequestInit = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                try {
                    const response = await fetch(`https://api.shyft.to/sol/v1/nft/compressed/read_all?network=mainnet-beta&wallet_address=${wallet.publicKey?.toString()}`, requestOptions);
                    const result = await response.json();
                    if (result && result.success && result.result && result.result.nfts) {
                        const formattedResult = result.result.nfts.map((nft: NFTType) => ({
                            image_uri: nft.image_uri,
                            name: nft.name,
                            external_url: nft.external_url,
                            mint: nft.mint,
                            floorprice: nft.royalty / 100
                        }));
                        setcNFTResult(formattedResult);
                    } else {
                        toast.error(`${t('cNFTError')}`);
                    }
                } catch (error) {
                    toast.error(`${t('cNFTError')}`);
                } finally {
                    setcNFTLoading(false);
                }
            }
        }

        fetchData();
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        async function fetchData() {
            if (open) {
                setNFTLoading(true);

                var myHeaders = new Headers();
                myHeaders.append('x-api-key', shyft_api_key);

                var requestOptions: RequestInit = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                try {
                    const response = await fetch(`https://api.shyft.to/sol/v1/nft/read_all?network=mainnet-beta&address=${wallet.publicKey?.toString()}`, requestOptions);
                    const result = await response.json();
                    if (result && result.success && result.result) {
                        const formattedResult = result.result.map((nft: NFTType) => ({
                            image_uri: nft.image_uri,
                            name: nft.name,
                            external_url: nft.external_url,
                            mint: nft.mint,
                            floorprice: nft.royalty / 100
                        }));
                        setNFTResult(formattedResult);
                    } else {
                        toast.error(`${t('nftError')}`);
                    }
                } catch (error) {
                    toast.error(`${t('nftError')}`);
                } finally {
                    setNFTLoading(false);
                }
            }
        }

        fetchData();
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const totalCNFT = selectedCNFT.reduce((acc, index) => acc + (cNFTResult[index]?.floorprice || 0), 0);
        setTotalCNFTPrice(totalCNFT);
    }, [selectedCNFT, cNFTResult]);

    useEffect(() => {
        const totalNFT = selectedNFT.reduce((acc, index) => acc + (NFTResult[index]?.floorprice || 0), 0);
        setTotalNFTPrice(totalNFT);
    }, [selectedNFT, NFTResult]);

    const handleSubmitSection = () => {
        setCurrentSection((prevSection) => prevSection + 1);
        knowTransactionHistory();
    };

    const handleNFTSection = () => {
        setCurrentSection((prevSection) => prevSection - 1);
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function formatAsset_price(value: number): string {
        return (value / 100).toFixed(5);
    }

    const toggleCNFTSelection = (index: number) => {
        setSelectedCNFT(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const toggleNFTSelection = (index: number) => {
        setSelectedNFT(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const knowTransactionHistory = async () => {
        setLoading(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append('x-api-key', shyft_api_key);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            const response = await fetch(
                `https://api.shyft.to/sol/v1/transaction/history?network=mainnet-beta&tx_num=2&account=${wallet.publicKey?.toString()}&enable_raw=true`,
                requestOptions
            );

            const result = await response.json();

            let sentTransactions = 0;
            let receivedTransactions = 0;

            result.result.forEach((transaction: Transaction) => {
                if (transaction.actions.length > 0 && transaction.actions[0].info.sender === wallet.publicKey?.toString()) {
                    sentTransactions++;
                } else {
                    receivedTransactions++;
                }
            });

            const totalTransactions = sentTransactions + receivedTransactions;
            const sentPercentage = (sentTransactions / totalTransactions) * 100;
            const receivedPercentage = (receivedTransactions / totalTransactions) * 100;

            const transactionHistoryScore = ((sentPercentage - receivedPercentage) / 100).toFixed(2);
            calculateCreditScore(transactionHistoryScore);
        } catch (error) {
            toast.error(`${t('transactionHistoryError')}`);
        } finally {
            setLoading(false);
        }
    };

    const calculateCreditScore = async (transactionHistoryScore: string) => {
        let newTransactionHistoryScore;
        if (transactionHistoryScore === 'NaN') {
            newTransactionHistoryScore = '0';
        } else {
            newTransactionHistoryScore = transactionHistoryScore;
        }
        const creditScoreValue = 0.55 * 80 + 0.33 * (parseFloat(newTransactionHistoryScore) + 20) + 30;
        setCreditScore(parseFloat(creditScoreValue.toFixed(2)));
        calculateInterestRate(creditScoreValue.toFixed(2));
        if (wallet.publicKey) {
            const result = await updateUserCreditScore({
                walletAddress: wallet.publicKey.toString(),
                creditScore: parseFloat(creditScoreValue.toFixed(2)),
            });
            if (result === 'Error updating user credit score') {
                toast.error(`${t('creditScoreHistoryError')}`);
            }
        }
    };

    const calculateInterestRate = (userCreditScore: string) => {
        const borrowingAmount = parseFloat(form.watch('borrowing_amount'));
        const borrowingDuration = parseFloat(form.watch('borrowing_duration'));
        const borrowingDurationInMonths = borrowingDuration / 30.4;
        let calculatedInterestRate: number = borrowingAmount * (0.05 + Math.max(0, Math.min(125 / (155 - parseFloat(userCreditScore)), 1)) * 2 + borrowingDurationInMonths * 0.5);
        calculatedInterestRate = Math.max(10.22, Math.min(calculatedInterestRate, 54.21));
        const formattedInterestRate = parseFloat(calculatedInterestRate.toFixed(2));
        setInterestRate(formattedInterestRate);
    };

    const addOrdinalSuffix = (day: number) => {
        if (day >= 11 && day <= 13) {
            return `${day}th`;
        }
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    }

    const today = new Date();

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + parseInt(form.watch('borrowing_duration')));

    const dueByDate = `${addOrdinalSuffix(futureDate.getDate())} ${futureDate.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })}`;

    const combinedCollateralList = [...selectedCNFT.map(index => cNFTResult[index]), ...selectedNFT.map(index => NFTResult[index])];

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            if (wallet.publicKey && interestRate) {
                const result = await newDeFiBorrowing({
                    walletAddress: wallet.publicKey.toString(),
                    borrowingAmount: `${values.borrowing_amount} ${order.asset_symbol}`,
                    borrowingToken: order.asset_symbol,
                    collateralizationAssets: combinedCollateralList,
                    borrowingDuration: values.borrowing_duration,
                    borrowingInterestRate: interestRate.toString(),
                    borrowingDueBy: futureDate.toISOString(),
                    borrowingTotal: `${(parseFloat(form.watch('borrowing_amount')) + ((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))))} ${order.asset_symbol}`,
                });

                setIsSubmitting(true);
                setCurrentSection(1);
                if (result === 'Request for new DeFi Borrowing sent successfully') {
                    setIsSubmitting(false);
                    setOpen(false);
                    toast.success(`${t('borrowingSuccess')}`);
                    form.reset();
                } else {
                    setCurrentSection(2);
                    setIsSubmitting(false);
                    toast.error(`${t('borrowingError')}`);
                }
            }
        } catch (error) {
            toast.error(`${t('borrowingError')}`);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!publicKey}>
                    {publicKey ? `${t('borrow')}` : `${t('connectWallet')}`}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <div>{t('borrowToken')}</div>
                        {/* <InfoButton /> */}
                    </DialogTitle>
                    <DialogDescription>
                        {t('borrowTokenDesc')}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off'>

                        {currentSection === 1 && (
                            <div className='w-full flex flex-col space-y-2 max-h-[45vh] md:max-h-[60vh] overflow-y-auto'>

                                <FormField
                                    control={form.control}
                                    name='borrowing_amount'
                                    render={({ field }) => (
                                        <FormItem className='w-full px-2'>
                                            <FormLabel>{t('borrowingAmount')} ({t('in')} {order.asset_symbol})</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {t('borrowAmount')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>{t('currentPrice')}</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                    {t('priceInUSD')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>$ {order.asset_price}</div>
                                </div>

                                <div>
                                    <Accordion type='multiple' defaultValue={['cNFT', 'NFT']} className='px-2'>
                                        <AccordionItem value='cNFT'>
                                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>{t('selectCollateral')}</AccordionTrigger>
                                            <AccordionContent>
                                                {cNFTLoading ? (
                                                    <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className='border rounded mt-4 p-2 flex flex-col items-center space-y-2'>
                                                                {['h-44 w-36', 'h-3 w-1/2', 'h-3 w-3/4'].map((classes, index) => (
                                                                    <Skeleton key={index} className={classes} />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                                        {cNFTResult.length ? (
                                                            cNFTResult.map((nft, index) => (
                                                                <>
                                                                    {nft.image_uri && nft.image_uri.startsWith('http') && (
                                                                        <div className={`border rounded mt-4 p-2 flex flex-col space-y-2 cursor-pointer ${selectedCNFT.includes(index) ? 'border-primary' : ''}`} key={index} onClick={() => toggleCNFTSelection(index)}>
                                                                            <div className='flex items-center justify-center'>
                                                                                <Image src={nft.image_uri} width={150} height={40} alt={nft.image_uri} />
                                                                            </div>
                                                                            <p className='text-center'>{nft.name}</p>
                                                                            {
                                                                                nft.external_url !== undefined && nft.external_url !== null && nft.external_url !== '' && (
                                                                                    <div className='flex flex-row items-center justify-center space-x-2'>
                                                                                        <a href={nft.external_url} target='_blank' className='text-primary'>{t('viewCollection')}</a>
                                                                                        <ExternalLink className='h-4 w-4' />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            <div className='flex flex-row items-center justify-center space-x-2'>
                                                                                <a href={`https://solscan.io/token/${nft.mint}`} target='_blank' className='text-primary'>{t('viewOnSolscan')}</a>
                                                                                <ExternalLink className='h-4 w-4' />
                                                                            </div>
                                                                            {nft.floorprice && nft.floorprice > 0 ? (
                                                                                <p className='text-center'>{t('cNFTPrice')}: {formatAsset_price(nft.floorprice)} SOL</p>
                                                                            ) : (
                                                                                <p className='text-center'>{t('cNFTPrice')}: 0 SOL</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ))
                                                        ) : (
                                                            <p>{t('nocNFT')}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value='NFT'>
                                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>{t('selectNFT')}</AccordionTrigger>
                                            <AccordionContent>
                                                {NFTLoading ? (
                                                    <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className='border rounded mt-4 p-2 flex flex-col items-center space-y-2'>
                                                                {['h-44 w-36', 'h-3 w-1/2', 'h-3 w-3/4'].map((classes, index) => (
                                                                    <Skeleton key={index} className={classes} />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                                        {NFTResult.length ? (
                                                            NFTResult.map((nft, index) => (
                                                                <>
                                                                    {nft.image_uri && nft.image_uri.startsWith('http') && (
                                                                        <div className={`border rounded mt-4 p-2 flex flex-col space-y-2 cursor-pointer ${selectedNFT.includes(index) ? 'border-primary' : ''}`} key={index} onClick={() => toggleNFTSelection(index)}>
                                                                            <div className='flex items-center justify-center'>
                                                                                <Image src={nft.image_uri} width={180} height={40} alt={nft.image_uri} />
                                                                            </div>
                                                                            <p className='text-center'>{nft.name}</p>
                                                                            {
                                                                                nft.external_url !== undefined && nft.external_url !== null && nft.external_url !== '' && (
                                                                                    <div className='flex flex-row items-center justify-center space-x-2'>
                                                                                        <a href={nft.external_url} target='_blank' className='text-primary'>{t('viewCollection')}</a>
                                                                                        <ExternalLink className='h-4 w-4' />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            <div className='flex flex-row items-center justify-center space-x-2'>
                                                                                <a href={`https://solscan.io/token/${nft.mint}`} target='_blank' className='text-primary'>{t('viewOnSolscan')}</a>
                                                                                <ExternalLink className='h-4 w-4' />
                                                                            </div>
                                                                            {nft.floorprice && nft.floorprice > 0 ? (
                                                                                <p className='text-center'>{t('nftPrice')}: {formatAsset_price(nft.floorprice)} SOL</p>
                                                                            ) : (
                                                                                <p className='text-center'>{t('nftPrice')}: 0 SOL</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ))
                                                        ) : (
                                                            <p>{t('noNFT')}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>

                                <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2 mt-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>{t('totalCollateral')}</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                    {t('totalCollateralValue')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>{formatAsset_price(totalCNFTPrice + totalNFTPrice)} SOL</div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name='borrowing_duration'
                                    render={({ field }) => (
                                        <FormItem className='w-full px-2'>
                                            <FormLabel>{t('borrowDuration')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={`${t('selectDuration')}`} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {borrowDuration.map((days) => (
                                                        <SelectItem key={days} value={days}>
                                                            {days}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                {t('selectDurationDesc')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    {parseFloat(formatAsset_price(totalCNFTPrice + totalNFTPrice)) < parseFloat(form.watch('borrowing_amount')) &&
                                        <p className='text-destructive text-center px-2'>{t('greaterValue')}</p>
                                    }
                                </div>

                                {((parseFloat(formatAsset_price(totalCNFTPrice + totalNFTPrice)) + (0.4 * parseFloat(formatAsset_price(totalCNFTPrice + totalNFTPrice)))) > parseFloat(form.watch('borrowing_amount'))) && form.watch('borrowing_duration') &&
                                    <div className='flex flex-col items-end justify-center px-2'>
                                        <div className='group border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded cursor-pointer text-sm py-2.5 px-4 w-full md:w-auto flex flex-row items-center justify-center' onClick={handleSubmitSection}>
                                            {t('calculateInterest')}
                                            <ChevronRight className='w-4 h-4 ml-1 group-hover:transform group-hover:translate-x-1 duration-300 ease-in-out' />
                                        </div>
                                    </div>
                                }
                            </div>
                        )}
                        {currentSection === 2 && (
                            <div className='w-full flex flex-col space-y-2 max-h-[45vh] md:max-h-[60vh] overflow-y-auto'>

                                {interestRate && creditScore && !loading ? (
                                    <>
                                        <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
                                            <div className='flex flex-row items-center space-x-1 text-sm md:text-lg'>
                                                <h1 className='tracking-wide'>{t('creditScore')}</h1>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='max-w-[18rem] md:max-w-[26rem]'>
                                                            {t('howWeCalculate')}:
                                                            <p className='text-center'>{t('formulaUsed')}</p>
                                                            <div className='py-1'>
                                                                <p>{t('where')}:</p>
                                                                <p>{t('formula1')}</p>
                                                                <p>{t('formula2')}</p>
                                                                <p>{t('formula3')}</p>
                                                                <p>{t('formula4')}</p>
                                                                <p>{t('formula5')}</p>
                                                                <p>{t('formula6')}</p>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div>{isNaN(creditScore) ? '36.48' : creditScore}</div>
                                        </div>

                                        <div className='flex flex-row items-center justify-between text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                            <div className='flex flex-row items-center space-x-1'>
                                                <h1 className='tracking-wide'>{t('interestRate')}</h1>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='max-w-[18rem] md:max-w-[26rem]'>
                                                            {t('interestRateFormula')}:
                                                            <p className='text-center'>{t('interestFormula')}</p>
                                                            <div className='py-1'>
                                                                <p>{t('where')}:</p>
                                                                <p>{t('interestFormula')}</p>
                                                                <p>{t('interestFormula1')}</p>
                                                                <p>{t('interestFormula2')}</p>
                                                                <p>{t('interestFormula3')}</p>
                                                                <p>{t('interestFormula4')}</p>
                                                                <p>{t('interestFormula5')}</p>
                                                                <p>{t('interestFormula6')}</p>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div>{interestRate} %</div>
                                        </div>

                                        <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                            <div className='flex flex-row items-center space-x-1'>
                                                <h1 className='tracking-wide'>{t('dueBy')}</h1>
                                            </div>
                                            <div>{dueByDate}</div>
                                        </div>

                                        <Accordion type='multiple' className='px-2'>
                                            <AccordionItem value='summary'>
                                                <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>{t('borrowSummary')}</AccordionTrigger>
                                                <AccordionContent className='flex flex-col space-y-2'>
                                                    <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                                        <div className='flex flex-row items-center space-x-1'>
                                                            <h1 className='tracking-wide'>{t('borrowingAmount')}</h1>
                                                            <TooltipProvider>
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                                        {t('borrowingTotal')}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div>{parseFloat(form.watch('borrowing_amount'))} {order.asset_symbol}</div>
                                                    </div>

                                                    <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                                        <div className='flex flex-row items-center space-x-1'>
                                                            <h1 className='tracking-wide'>{t('borrowingDuration')}</h1>
                                                            <TooltipProvider>
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                                        {t('borrowingTotalDuration')}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div>{form.watch('borrowing_duration')}</div>
                                                    </div>

                                                    <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                                        <div className='flex flex-row items-center space-x-1'>
                                                            <h1 className='tracking-wide'>{t('borrowingInterest')}</h1>
                                                            <TooltipProvider>
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                                        {t('borrowingTotalInterest')}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div>{interestRate} % ~ {((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))).toFixed(4)} {order.asset_symbol}</div>
                                                    </div>

                                                    <div>
                                                        <div className='text-sm md:text-lg px-2'>{t('selectedCollateral')}</div>
                                                        <div className='flex flex-row space-x-2 flex-wrap justify-evenly py-2'>
                                                            {combinedCollateralList.map((item, index) => (
                                                                <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
                                                                    <div className='flex items-center justify-center'>
                                                                        <Image src={item.image_uri} width={180} height={40} alt={item.image_uri} className='rounded' />
                                                                    </div>
                                                                    <p className='text-center'>{item.name}</p>
                                                                    <div className='flex flex-row items-center justify-center space-x-2'>
                                                                        <a href={item.external_url} target='_blank' className='text-primary'>{t('viewCollection')}</a>
                                                                        <ExternalLink className='h-4 w-4' />
                                                                    </div>
                                                                    <div className='flex flex-row items-center justify-center space-x-2'>
                                                                        <a href={`https://solscan.io/token/${item.mint}`} target='_blank' className='text-primary'>{t('viewOnSolscan')}</a>
                                                                        <ExternalLink className='h-4 w-4' />
                                                                    </div>
                                                                    <p className='text-center'>{t('price')}: {formatAsset_price(item.floorprice)} SOL</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <div className='text-center py-2'>
                                            {t('repay')} {(parseFloat(form.watch('borrowing_amount')) + ((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))))} {order.asset_symbol} {t('within')} {form.watch('borrowing_duration')} ({t('by')} {dueByDate})
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name='borrowing_amount'
                                            render={({ field }) => (
                                                <FormItem className='w-full px-2'>
                                                    <FormControl>
                                                        <Input {...field} className='hidden' disabled />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div>
                                            <FormField
                                                control={form.control}
                                                name='agree_terms'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className='flex flex-row space-x-2 justify-start px-2'>
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                            <FormLabel>
                                                                {t('terms1')} {(parseFloat(form.watch('borrowing_amount')) + ((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))))} {order.asset_symbol} {t('within')} {form.watch('borrowing_duration')} {t('terms2')}
                                                            </FormLabel>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className='flex flex-row items-center justify-center py-16 text-xl'>
                                        <Loader2 className='text-xl mr-2 mt-0.5 font-extrabold animate-spin' />
                                        {t('loading')}
                                    </div>
                                )}

                                {!loading &&
                                    <div className='flex flex-col md:flex-row items-center justify-between md:pt-2 space-y-2 md:space-y-0 px-2'>
                                        {!isSubmitting &&
                                            <div className='group border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded cursor-pointer text-sm py-2.5 px-4 w-full md:w-auto flex flex-row items-center justify-center' onClick={handleNFTSection}>
                                                <ChevronLeft className='w-4 h-4 mr-1 group-hover:-translate-x-1 duration-300 ease-in-out' />
                                                {t('editDetails')}
                                            </div>
                                        }
                                        <Button type='submit' className='px-16 w-full md:w-auto' disabled={isSubmitting || loading}>
                                            {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                                            {isSubmitting ? `${t('borrowing')}` : `${t('borrow')}`}
                                        </Button>
                                    </div>
                                }
                            </div>
                        )}

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
