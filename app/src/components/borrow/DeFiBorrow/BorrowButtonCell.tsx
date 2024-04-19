import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateUserCreditScore, newDeFiBorrowing } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2, Info, ExternalLink } from 'lucide-react'
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

export type BorrowingAssetDataType = {
    assetName: string;
    assetSymbol: string;
    assetLogo: string;
    assetPrice: string;
    totalSupply: string;
    assetYield: string;
    totalBorrow: string;
    ltv: string;
}

interface NFTType {
    image_uri?: string;
    name?: string;
    floorprice?: number;
    external_url?: string;
    mint?: string;
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
        .refine(value => !isNaN(Number(value)), {
            message: 'Amount must be a number.',
        })
        .refine(value => Number(value) > 0, {
            message: 'Amount must be a positive number.',
        })
        .refine(value => {
            const stringValue = String(value);
            const [integerPart, decimalPart] = stringValue.split('.');

            if (integerPart.length > 7 || (decimalPart && decimalPart.length > 8)) {
                return false;
            }

            return true;
        }, {
            message: 'Amount must have up to 7 digits before the decimal point and up to 8 digits after the decimal point.',
        }),
    borrowing_duration: z.string({
        required_error: 'Borrowing duration is required.',
    }),
});

export default function BorrowButtonCell({ row }: { row: { original: BorrowingAssetDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [cNFTResult, setcNFTResult] = useState<NFTType[]>([]);
    const [cNFTLoading, setcNFTLoading] = useState<boolean>(false);
    const [NFTResult, setNFTResult] = useState<NFTType[]>([]);
    const [NFTLoading, setNFTLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [creditScore, setCreditScore] = useState(null);
    const [interestRate, setInterestRate] = useState(undefined);

    const order = row.original;
    const { connected } = useWallet();
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
                        const formattedResult = result.result.nfts.map((nft: any) => ({
                            image_uri: nft.image_uri,
                            name: nft.name,
                            external_url: nft.external_url,
                            mint: nft.mint,
                            floorprice: nft.royalty
                        }));
                        setcNFTResult(formattedResult);
                    } else {
                        toast.error('No cNFT(s) found for the wallet.');
                    }
                } catch (error) {
                    toast.error(`Got error: ${error}`);
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
                        const formattedResult = result.result.map((nft: any) => ({
                            image_uri: nft.image_uri,
                            name: nft.name,
                            external_url: nft.external_url,
                            mint: nft.mint,
                            floorprice: nft.royalty
                        }));
                        setNFTResult(formattedResult);
                    } else {
                        toast.error('No NFT(s) found for the wallet.');
                    }
                } catch (error) {
                    toast.error(`Got error: ${error}`);
                } finally {
                    setNFTLoading(false);
                }
            }
        }

        fetchData();
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    function formatAssetPrice(value: number): string {
        return (value / 100).toFixed(5);
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            borrowing_amount: '1',
            borrowing_duration: '15 days',
        },
    });

    const knowTransactionHistory = async () => {
        setLoading(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append('x-api-key', shyft_api_key);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(
                `https://api.shyft.to/sol/v1/transaction/history?network=mainnet-beta&tx_num=2&account=${wallet.publicKey?.toString()}&enable_raw=true`,
                // @ts-ignore
                requestOptions
            );

            const data = await response.json();

            let sentTransactions = 0;
            let receivedTransactions = 0;

            data.result.forEach((transaction: { actions: string | any[] }) => {
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
            toast.error('An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    };

    // @ts-ignore
    const calculateCreditScore = async (transactionHistoryScore) => {
        const creditScoreValue = 0.55 * 80 + 0.33 * (transactionHistoryScore + 20) + 30;
        // @ts-ignore
        setCreditScore(creditScoreValue.toFixed(2));
        calculateInterestRate(creditScoreValue.toFixed(2));
        await updateUserCreditScore({
            walletAddress: wallet.publicKey?.toString(),
            creditScore: creditScoreValue.toFixed(2),
        });
    };

    // @ts-ignore
    const calculateInterestRate = (userCreditScore) => {
        const borrowingAmount = parseFloat(form.watch('borrowing_amount'));
        const borrowingDuration = parseFloat(form.watch('borrowing_duration'));
        const borrowingDurationInMonths = borrowingDuration / 30.4;
        let interestRate: number = borrowingAmount * (0.05 + Math.max(0, Math.min(125 / (155 - userCreditScore), 1)) * 2 + borrowingDurationInMonths * 0.5);
        interestRate = Math.max(10.22, Math.min(interestRate, 54.21));
        // @ts-ignore
        setInterestRate(interestRate.toFixed(2));
    };

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            const data = await newDeFiBorrowing({
                walletAddress: wallet.publicKey?.toString(),
                borrowingAmount: values.borrowing_amount,
                borrowingToken: order.assetSymbol,
                collateralizationAssets: ['none'],
                borrowingDuration: values.borrowing_duration,
                borrowingInterestRate: interestRate,
            });

            setIsSubmitting(true);
            if (data) {
                setIsSubmitting(false);
                setOpen(false);
                toast.success('Borrowing successful! Assets will be credited to your wallet shortly.');
            } else {
                toast.error('Error completing the process. Please try again!');
            }
        } catch (error) {
            toast.error('Error completing the process. Please try again!');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='text-white' disabled={!connected}>
                    {connected ? 'Borrow' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[60vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <h1>Borrow Token</h1>
                        <InfoButton />
                    </DialogTitle>
                    <DialogDescription>
                        Borrow token from the lending pool.
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[45vh] md:max-h-[60vh] px-2 md:px-4 overflow-y-auto'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-2'>

                            <FormField
                                control={form.control}
                                name='borrowing_amount'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Borrowing amount (in {order.assetSymbol})</FormLabel>
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

                            <div className='flex flex-row items-center justify-between'>
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
                                <div>{order.assetPrice}</div>
                            </div>

                            <div>
                                <Accordion type='multiple' defaultValue={['cNFT', 'NFT']}>
                                    <AccordionItem value='cNFT'>
                                        <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>Select cNFT(s) or Synthetic Asset(s) for Collateral</AccordionTrigger>
                                        <AccordionContent>
                                            {cNFTLoading ? <Loading /> : (
                                                <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                                    {cNFTResult.length ? (
                                                        cNFTResult.map((nft, index) => (
                                                            <>
                                                                {nft.image_uri && nft.image_uri.startsWith('http') && (
                                                                    <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
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
                                                                            <p className='text-center'>cNFT Price: {formatAssetPrice(nft.floorprice)} SOL</p>
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
                                                                    <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
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
                                                                            <p className='text-center'>NFT Price: {formatAssetPrice(nft.floorprice)} SOL</p>
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

                            <FormField
                                control={form.control}
                                name='borrowing_duration'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Borrow Duration</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue='15 days'>
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

                            {creditScore && (
                                <>
                                    <div className='flex flex-row items-center justify-between'>
                                        <div className='flex flex-row items-center space-x-1'>
                                            <h1 className='font-semibold tracking-wide'>Credit Score</h1>
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

                                    <div className='flex flex-row items-center justify-between'>
                                        <div className='flex flex-row items-center space-x-1'>
                                            <h1 className='font-semibold tracking-wide'>Intrest Rate</h1>
                                            <TooltipProvider>
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem]'>
                                                        How we calculate intrest rate:
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

                                </>
                            )}
                            {creditScore && interestRate && (
                                <Button type='submit' className='text-white w-full mt-4' disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                                    {isSubmitting ? 'Borrowing...' : 'Borrow'}
                                </Button>
                            )}
                        </form>
                    </Form>

                    {!creditScore ? (
                        <Button className='text-white w-full mt-4' onClick={knowTransactionHistory} disabled={loading} >
                            {loading ? 'Calculating...' : 'Calculate Intrest Rate'}
                        </Button>
                    ) : (
                        <Button variant='outline' className='w-full mt-4' onClick={knowTransactionHistory} disabled={loading} >
                            {loading ? 'Calculating...' : 'Re-Calculate Intrest Rate'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
