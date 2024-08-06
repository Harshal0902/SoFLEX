import React, { useEffect, useState } from 'react'
import { newAssetOrCollectionRequest, nftCollectionDetails } from '@/actions/dbActions'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslations } from 'next-intl'
import { LendingNFTCollectionDataType, lendingNFTCollectionColumns } from './columns'
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
import { DataTable } from '@/components/ui/data-table-p2p'

export default function P2PLending() {
    const [open, setOpen] = useState(false);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [lendingNFTCollectionData, setLendingNFTCollectionData] = useState<LendingNFTCollectionDataType[]>([]);

    const t = useTranslations('P2PLendPage');
    const { publicKey } = useWallet();
    const wallet = useWallet();

    const FormSchema = z.object({
        nftCollectionName: z.string({
            required_error: `${t('nameRequired')}`,
        }).min(3, {
            message: `${t('nameMin')}`,
        }).optional()
    })

    useEffect(() => {
        const fetchNFTCollectionData = async () => {
            const result = await nftCollectionDetails();
            if (Array.isArray(result)) {
                setLendingNFTCollectionData(result);
            } else {
                toast.error(`${t('nftFetchError')}`);
            }
            setLoadingData(false);
        };

        fetchNFTCollectionData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nftCollectionName: '',
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const nftCollectionName = data.nftCollectionName;

        if (nftCollectionName && wallet.publicKey) {
            const result = await newAssetOrCollectionRequest({ walletAddress: wallet.publicKey.toString(), requestedAssetOrCollectionName: nftCollectionName, assetOrCollection: 'NFT Collectiion' });
            if (result === 'Request for new Asset or Collection sent successfully') {
                toast.success(`${t('requestSuccess')}`);
                setOpen(false);
                form.reset();
            } else {
                toast.error(`${t('requestError')}`);
            }
        }
    }

    return (
        <div className='py-2 md:py-4'>
            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0'>
                        <div className='text-center md:text-start text-2xl md:text-4xl'>{t('title')}</div>
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
                                                name='nftCollectionName'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{t('nftCollectionName')}</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className='w-full' placeholder={`${t('nftCollectionName')}`} />
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
                            columns={lendingNFTCollectionColumns}
                            data={lendingNFTCollectionData.map(nftCollection => ({
                                ...nftCollection,
                            }))}
                            userSearchColumn='nft_name'
                            inputPlaceHolder={t('searchCollection')}
                            noResultsMessage={t('noCollection')}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
