import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateUserCreditScore, newDeFiBorrowing } from '@/actions/dbActions'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import { ChevronRight, ChevronLeft, Loader2, Info, ExternalLink } from 'lucide-react'
import InfoButton from '@/components/InfoButton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Loading from '@/components/Loading'
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

const FormSchema = z.object({
    borrowing_amount: z
        .string()
        .refine(value => {
            const parsedValue = parseFloat(value);
            return !isNaN(parsedValue);
        }, {
            message: 'Borrow amount must be a number.',
        })
        .refine(value => {
            const parsedValue = parseFloat(value);
            return parsedValue > 0;
        }, {
            message: 'Borrow amount must be a positive number.',
        })
        .refine(value => {
            const stringValue = String(value);
            const [integerPart, decimalPart] = stringValue.split('.');

            if (integerPart.length > 7 || (decimalPart && decimalPart.length > 6)) {
                return false;
            }

            return true;
        }, {
            message: 'Borrow amount must have up to 6 digits before the decimal point.',
        }),
    borrowing_duration: z.string({
        required_error: 'Borrowing duration is required.',
    }),
    agree_terms: z.boolean()
        .refine(value => value === true, {
            message: 'You must agree to the Terms of Service and Privacy Policy.',
            path: ['agree_terms']
        }),
});

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

    const shyft_api_key = process.env.NEXT_PUBLIC_SHYFTAPI!;

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
                        toast.error('An error occurred while fetching cNFT(s) for the wallet. Please try again!');
                    }
                } catch (error) {
                    toast.error(`An error occurred while fetching cNFT(s) for the wallet. Please try again!`);
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
                        toast.error('An error occurred while fetching NFT(s) for the wallet. Please try again!');
                    }
                } catch (error) {
                    toast.error(`An error occurred while fetching NFT(s) for the wallet. Please try again!`);
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
            toast.error('An error occurred while fetching transaction history. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    const calculateCreditScore = async (transactionHistoryScore: string) => {
        const creditScoreValue = 0.55 * 80 + 0.33 * (parseFloat(transactionHistoryScore) + 20) + 30;
        setCreditScore(parseFloat(creditScoreValue.toFixed(2)));
        calculateInterestRate(creditScoreValue.toFixed(2));
        if (wallet.publicKey) {
            const result = await updateUserCreditScore({
                walletAddress: wallet.publicKey.toString(),
                creditScore: parseFloat(creditScoreValue.toFixed(2)),
            });
            if (result === 'Error updating user credit score') {
                toast.error('An error occurred while updating credit score. Please try again!');
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
                    toast.success('Borrowing successful! Assets will be credited to your wallet shortly.');
                    form.reset();
                } else {
                    setCurrentSection(2);
                    setIsSubmitting(false);
                    toast.error('An error occurred while borrowing. Please try again!');
                }
            }
        } catch (error) {
            toast.error('An error occurred while borrowing. Please try again!');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='text-white' disabled={!publicKey}>
                    {publicKey ? 'Borrow' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <div>Borrow Token</div>
                        <InfoButton />
                    </DialogTitle>
                    <DialogDescription>
                        Borrow token from the lending pool.
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
                                            <FormLabel>Borrowing amount (in {order.asset_symbol})</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the amount you want to borrow.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>Current Price</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    The current price of the asset in USD.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>$ {order.asset_price}</div>
                                </div>

                                <div>
                                    <Accordion type='multiple' defaultValue={['cNFT', 'NFT']} className='px-2'>
                                        <AccordionItem value='cNFT'>
                                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>Select cNFT(s) or Synthetic Asset(s) for Collateral</AccordionTrigger>
                                            <AccordionContent>
                                                {cNFTLoading ? <Loading /> : (
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
                                                                                        <a href={nft.external_url} target='_blank' className='text-primary'>View collection</a>
                                                                                        <ExternalLink className='h-4 w-4' />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            <div className='flex flex-row items-center justify-center space-x-2'>
                                                                                <a href={`https://solscan.io/token/${nft.mint}`} target='_blank' className='text-primary'>View on Solscan</a>
                                                                                <ExternalLink className='h-4 w-4' />
                                                                            </div>
                                                                            {nft.floorprice && nft.floorprice > 0 ? (
                                                                                <p className='text-center'>cNFT Price: {formatAsset_price(nft.floorprice)} SOL</p>
                                                                            ) : (
                                                                                <p className='text-center'>cNFT Price: 0 SOL</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ))
                                                        ) : (
                                                            <p>No cNFT(s) or Synthetic Asset(s) found for you wallet.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value='NFT'>
                                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>Select NFT(s) for Collateral</AccordionTrigger>
                                            <AccordionContent>
                                                {NFTLoading ? <Loading /> : (
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
                                                                                        <a href={nft.external_url} target='_blank' className='text-primary'>View collection</a>
                                                                                        <ExternalLink className='h-4 w-4' />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            <div className='flex flex-row items-center justify-center space-x-2'>
                                                                                <a href={`https://solscan.io/token/${nft.mint}`} target='_blank' className='text-primary'>View on Solscan</a>
                                                                                <ExternalLink className='h-4 w-4' />
                                                                            </div>
                                                                            {nft.floorprice && nft.floorprice > 0 ? (
                                                                                <p className='text-center'>NFT Price: {formatAsset_price(nft.floorprice)} SOL</p>
                                                                            ) : (
                                                                                <p className='text-center'>NFT Price: 0 SOL</p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ))
                                                        ) : (
                                                            <p>No NFT(s) found for you wallet.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>

                                <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2 mt-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>Total Collateral Value</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    The total value of the collateral in SOL.
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
                                            <FormLabel>Borrow Duration</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select borrow duration' />
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
                                                Select the duration for borrowing the asset.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    {parseFloat(formatAsset_price(totalCNFTPrice + totalNFTPrice)) < parseFloat(form.watch('borrowing_amount')) &&
                                        <p className='text-destructive text-center px-2'>The value of the collateral must be greater than the amount borrowed.</p>
                                    }
                                </div>

                                {((parseFloat(formatAsset_price(totalCNFTPrice + totalNFTPrice)) + (0.4 * parseFloat(formatAsset_price(totalCNFTPrice + totalNFTPrice)))) > parseFloat(form.watch('borrowing_amount'))) && form.watch('borrowing_duration') &&
                                    <div className='flex flex-col items-end justify-center px-2'>
                                        <div className='group border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded cursor-pointer text-sm py-2.5 px-4 w-full md:w-auto flex flex-row items-center justify-center' onClick={handleSubmitSection}>
                                            Calculate Interest Rate
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
                                                <h1 className='tracking-wide'>Credit Score</h1>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='max-w-[18rem] md:max-w-[26rem]'>
                                                            How we calculate credit score:
                                                            <p className='text-center'>a x BH  +  b x (TH + CD) + c</p>
                                                            <div className='py-1'>
                                                                <p>Where:</p>
                                                                <p>BH: Borrower History Score (0-100)</p>
                                                                <p>TH: Transaction History Score (0-100)</p>
                                                                <p>CD: Collateral Diversity Score (0-100)</p>
                                                                <p>a: 0.55 (Moderate weight on BH)</p>
                                                                <p>b: 0.35 (Moderate weight on combined TH + CD)</p>
                                                                <p>c: 30 (Constant value to adjust score range)</p>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div>{isNaN(creditScore) ? '36.48' : creditScore}</div>
                                        </div>

                                        <div className='flex flex-row items-center justify-between text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                            <div className='flex flex-row items-center space-x-1'>
                                                <h1 className='tracking-wide'>Interest Rate</h1>
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger asChild>
                                                            <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className='max-w-[18rem] md:max-w-[26rem]'>
                                                            How we calculate interest rate:
                                                            <p className='text-center'>Cost x ( BR + RP  + DA)</p>
                                                            <div className='py-1'>
                                                                <p>Where:</p>
                                                                <p>Cost: Requested Loan Amount</p>
                                                                <p>Base Rate: 0.05  (Minimum interest rate)</p>
                                                                <p>Risk Premium: (155 - OCS) x (RF / (155 - 30))</p>
                                                                <p>OCS: On-Chain Credit Score</p>
                                                                <p>Duration Adjustment = Duration(in months) x DF</p>
                                                                <p>Duration_Factor (DF) = 0.5 ( To Adjust Duration)</p>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div>{interestRate} %</div>
                                        </div>

                                        <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                            <div className='flex flex-row items-center space-x-1'>
                                                <h1 className='tracking-wide'>Due By</h1>
                                            </div>
                                            <div>{dueByDate}</div>
                                        </div>

                                        <Accordion type='multiple' className='px-2'>
                                            <AccordionItem value='summary'>
                                                <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>Borrow Summary</AccordionTrigger>
                                                <AccordionContent className='flex flex-col space-y-2'>
                                                    <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                                        <div className='flex flex-row items-center space-x-1'>
                                                            <h1 className='tracking-wide'>Borrowing Amount</h1>
                                                            <TooltipProvider>
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                                        The total amount you are borrowing.
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div>{parseFloat(form.watch('borrowing_amount'))} {order.asset_symbol}</div>
                                                    </div>

                                                    <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                                        <div className='flex flex-row items-center space-x-1'>
                                                            <h1 className='tracking-wide'>Borrowing Duration</h1>
                                                            <TooltipProvider>
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                                        The total duration for borrowing the asset.
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div>{form.watch('borrowing_duration')}</div>
                                                    </div>

                                                    <div className='flex flex-row items-center justify-between flex-wrap text-sm md:text-lg hover:bg-accent hover:rounded px-2'>
                                                        <div className='flex flex-row items-center space-x-1'>
                                                            <h1 className='tracking-wide'>Borrowing Interest</h1>
                                                            <TooltipProvider>
                                                                <Tooltip delayDuration={300}>
                                                                    <TooltipTrigger asChild>
                                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                                        The interest rate for borrowing the asset.
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <div>{interestRate} % ~ {((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))).toFixed(4)} {order.asset_symbol}</div>
                                                    </div>

                                                    <div>
                                                        <div className='text-sm md:text-lg px-2'>Selected NFT(s) and cNFT(s) for Collateral</div>
                                                        <div className='flex flex-row space-x-2 flex-wrap justify-evenly py-2'>
                                                            {combinedCollateralList.map((item, index) => (
                                                                <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
                                                                    <div className='flex items-center justify-center'>
                                                                        <Image src={item.image_uri} width={180} height={40} alt={item.image_uri} className='rounded' />
                                                                    </div>
                                                                    <p className='text-center'>{item.name}</p>
                                                                    <div className='flex flex-row items-center justify-center space-x-2'>
                                                                        <a href={item.external_url} target='_blank' className='text-primary'>View collection</a>
                                                                        <ExternalLink className='h-4 w-4' />
                                                                    </div>
                                                                    <div className='flex flex-row items-center justify-center space-x-2'>
                                                                        <a href={`https://solscan.io/token/${item.mint}`} target='_blank' className='text-primary'>View on Solscan</a>
                                                                        <ExternalLink className='h-4 w-4' />
                                                                    </div>
                                                                    <p className='text-center'>cNFT Price: {formatAsset_price(item.floorprice)} SOL</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <div className='text-center py-2'>
                                            Repay {(parseFloat(form.watch('borrowing_amount')) + ((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))))} {order.asset_symbol} within {form.watch('borrowing_duration')} (by {dueByDate})
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
                                                                By checking this box, you agree to the terms: failure to repay {(parseFloat(form.watch('borrowing_amount')) + ((interestRate / 100) * parseFloat(form.watch('borrowing_amount'))))} {order.asset_symbol} within {form.watch('borrowing_duration')} results in default. In such cases, the pool may claim collateral. Manage loans on the portfolio page.
                                                            </FormLabel>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <Loading />
                                )}

                                {!loading &&
                                    <div className='flex flex-col md:flex-row items-center justify-between md:pt-2 space-y-2 md:space-y-0 px-2'>
                                        <div className='group border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded cursor-pointer text-sm py-2.5 px-4 w-full md:w-auto flex flex-row items-center justify-center' onClick={handleNFTSection}>
                                            <ChevronLeft className='w-4 h-4 mr-1 group-hover:-translate-x-1 duration-300 ease-in-out' />
                                            Edit borrow details
                                        </div>
                                        <Button type='submit' className='text-white px-16 w-full md:w-auto' disabled={isSubmitting || loading}>
                                            {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                                            {isSubmitting ? 'Borrowing...' : 'Borrow'}
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
