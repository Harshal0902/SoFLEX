import React, { useEffect, useState } from 'react'
import { newAssetOrCollectionRequest, assetDetails } from '@/actions/dbActions'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslations } from 'next-intl'
import { LendingAssetDataType, lendingAssetColumns } from './columns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/ui/data-table-defi'

export default function DeFiLending() {
    const [open, setOpen] = useState(false);
    const [assetPrices, setAssetPrices] = useState<{ [key: string]: string }>({});
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [lendingAssetData, setLendingAssetData] = useState<LendingAssetDataType[]>([]);

    const t = useTranslations('DeFiLendPage');
    const { publicKey } = useWallet();
    const wallet = useWallet();

    const FormSchema = z.object({
        assetName: z.string({
            required_error: `${t('nameRequired')}`,
        }).min(3, {
            message: `${t('nameMin')}`,
        }).optional()
    })

    useEffect(() => {
        const fetchAssetData = async () => {
            const result = await assetDetails();
            if (Array.isArray(result)) {
                setLendingAssetData(result);
            } else {
                toast.error(`${t('assetFetchError')}`);
            }
            setLoadingData(false);
        };

        fetchAssetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    toast.error(`${t('priceFetchError1')} ${token} ${t('priceFetchError2')}`);
                }
            }
        };

        fetchData();

        // const intervalId = setInterval(fetchData, 30000);

        // return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                toast.success(`${t('requestSuccess')}`);
                setOpen(false);
                form.reset();
            } else {
                toast.error(`${t('requestError')}`);
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
                        <div className='text-center md:text-start text-2xl md:text-4xl'>{t('allAssets')}</div>
                        {publicKey && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='outline' className='w-full md:w-auto'>{t('requestBtn')}</Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                                    <DialogHeader>
                                        <DialogTitle>{t('requestDialogTitle')}</DialogTitle>
                                        <DialogDescription>
                                            {t('requestDialogDesc')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-4 pt-2'>
                                            <FormField
                                                control={form.control}
                                                name='assetName'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('assetName')}</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className='w-full' placeholder={`${t('assetName')}`} />
                                                        </FormControl>
                                                        <FormMessage className='text-destructive tracking-wide' />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type='submit'>
                                                {t('submitRequest')}
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
                        <div className="flex flex-col h-full space-y-2">
                            {['h-9 md:w-1/3', 'h-10', 'h-12', 'h-12', 'h-12', 'h-12'].map((classes, index) => (
                                <Skeleton key={index} className={classes} />
                            ))}
                        </div>
                    ) : (
                        <DataTable
                            columns={lendingAssetColumns(t)}
                            data={lendingAssetData.map(asset => ({
                                ...asset,
                                asset_price: assetPrices[asset.asset_symbol] ? formatPrice(assetPrices[asset.asset_symbol]) : asset.asset_price
                            }))}
                            userSearchColumn='asset_total_supply'
                            inputPlaceHolder={t('searchToken')}
                            noResultsMessage={t('noToken')}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
