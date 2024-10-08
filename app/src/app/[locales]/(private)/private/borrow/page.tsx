"use client"

import React, { useEffect, useState } from 'react'
import { newAssetOrCollectionRequest, assetDetails } from '@/actions/dbActions'
import { useWallet } from '@solana/wallet-adapter-react'
import { BorrowingAssetDataType, borrowingAssetColumns } from './columns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Preloader from '@/components/Preloader'
import { DataTable } from '@/components/ui/data-table-defi'

const FormSchema = z.object({
    assetName: z.string({
        required_error: 'Name is required',
    }).min(3, {
        message: 'Name must be at least 3 characters long',
    }).optional()
})

export default function DeFiBorrowing() {
    const [open, setOpen] = useState(false);
    const [assetPrices, setAssetPrices] = useState<{ [key: string]: string }>({});
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [borrowingAssetData, setBorrowingAssetData] = useState<BorrowingAssetDataType[]>([]);

    const { publicKey } = useWallet();
    const wallet = useWallet();

    useEffect(() => {
        const fetchAssetData = async () => {
            const result = await assetDetails();
            if (Array.isArray(result)) {
                setBorrowingAssetData(result);
            } else {
                toast.error('An error occurred while fetching asset data. Please try again!');
            }
            setLoadingData(false);
        };

        fetchAssetData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const tokens = ['SOL', 'USDC', 'USDT', 'JTO', 'RAY', 'tBTC', 'mSOL'];
            for (const token of tokens) {
                try {
                    const response = await fetch(`https://api.coinbase.com/v2/prices/${token}-USD/buy`);
                    const result = await response.json();
                    setAssetPrices(prevState => ({
                        ...prevState,
                        [token]: result.data.amount
                    }));
                } catch (error) {
                    toast.error(`An error occurred while fetching ${token} price. Please try again!`);
                }
            }
        };

        fetchData();

        // const intervalId = setInterval(fetchData, 10000);

        // return () => clearInterval(intervalId);
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            assetName: '',
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const assetName = data.assetName;

        if (assetName && wallet.publicKey) {
            const result = await newAssetOrCollectionRequest({ walletAddress: wallet.publicKey.toString(), requestedAssetOrCollectionName: assetName, assetOrCollection: 'Asset' });
            if (result === 'Request for new Asset or Collection sent successfully') {
                toast.success('Request sent successfully!');
                setOpen(false);
                form.reset();
            } else {
                toast.error('An error occurred while sending request. Please try again!');
            }
        }
    }

    const formatPrice = (price: number | string): string => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (!isNaN(numericPrice)) {
            return `${numericPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
        } else {
            return price.toString();
        }
    };

    return (
        <div className='py-2 md:py-4'>
            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0'>
                        <div className='text-center md:text-start text-2xl md:text-4xl'>All Assets for DeFi Borrowing</div>
                        {publicKey && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='outline' className='w-full sm:w-auto'>Request new Asset for borrowing</Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                                    <DialogHeader>
                                        <DialogTitle>Request for new assets</DialogTitle>
                                        <DialogDescription>
                                            Make request for new assets for borrowing.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-4 pt-2'>
                                            <FormField
                                                control={form.control}
                                                name='assetName'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Asset Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className='w-full' placeholder='Asset Name' />
                                                        </FormControl>
                                                        <FormMessage className='text-destructive tracking-wide' />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type='submit'>
                                                Submit Request
                                            </Button>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingData ? (
                        <Preloader />
                    ) : (
                        <DataTable
                            columns={borrowingAssetColumns}
                            data={borrowingAssetData.map(asset => ({
                                ...asset,
                                asset_price: assetPrices[asset.asset_symbol] ? formatPrice(assetPrices[asset.asset_symbol]) : asset.asset_price
                            }))}
                            userSearchColumn='asset_total_supply'
                            inputPlaceHolder='Search by token'
                            noResultsMessage='No assets found'
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
