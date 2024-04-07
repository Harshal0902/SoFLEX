import React, { useEffect, useState } from 'react'
import { newAssetLendingRequest } from '@/lib/supabaseRequests'
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
import { DataTable } from '@/components/ui/data-table-p2p'

const borrowingAssetData: BorrowingAssetDataType[] = [
    {
        nftName: 'Cyber Frogs',
        nftLogo: '/assets/borrow/Cyber Frogs.webp',
        nftPool: '36 SOL',
        neftBestOffer: '6.4 SOL',
        nftIntrest: '14 %',
        nftDuration: '5 days',
    },
    {
        nftName: 'Degods',
        nftLogo: '/assets/borrow/Degods.webp',
        nftPool: '12 SOL',
        neftBestOffer: '2.6 SOL',
        nftIntrest: '33.56 %',
        nftDuration: '15 days',
    },
    {
        nftName: 'Enigma Ventures',
        nftLogo: '/assets/borrow/Enigma_Ventures.webp',
        nftPool: '66 SOL',
        neftBestOffer: '5.6 SOL',
        nftIntrest: '5.65 %',
        nftDuration: '10 days',
    },
    {
        nftName: 'Gaimin Gladiators',
        nftLogo: '/assets/borrow/Gaimin_Gladiators.webp',
        nftPool: '12 SOL',
        neftBestOffer: '2.44 SOL',
        nftIntrest: '15.66 %',
        nftDuration: '5 days',
    },
    {
        nftName: 'Homeowners Association (Parcl)',
        nftLogo: '/assets/borrow/Homeowners Association (Parcl).webp',
        nftPool: '33 SOL',
        neftBestOffer: '7.2 SOL',
        nftIntrest: '38.5 %',
        nftDuration: '30 days',
    },
    {
        nftName: 'Kanpai Pandas',
        nftLogo: '/assets/borrow/Kanpai_Pandas.webp',
        nftPool: '25 SOL',
        neftBestOffer: '1.22 SOL',
        nftIntrest: '56.9 %',
        nftDuration: '25 days',
    },
    {
        nftName: 'Photo Finish PFP Collection',
        nftLogo: '/assets/borrow/Photo_Finish_PFP_Collection.webp',
        nftPool: '26 SOL',
        neftBestOffer: '8.21 SOL',
        nftIntrest: '46 %',
        nftDuration: '15 days',
    },
    {
        nftName: 'Quekz',
        nftLogo: '/assets/borrow/Quekz.webp',
        nftPool: '42.56 SOL',
        neftBestOffer: '3.22 SOL',
        nftIntrest: '12 %',
        nftDuration: '10 days',
    },
    {
        nftName: 'SMB Gen2',
        nftLogo: '/assets/borrow/SMB_Gen2.webp',
        nftPool: '150 SOL',
        neftBestOffer: '32.22 SOL',
        nftIntrest: '38.5 %',
        nftDuration: '10 days',
    },
    {
        nftName: 'Taiyo Robotics',
        nftLogo: '/assets/borrow/Taiyo_Robotics.webp',
        nftPool: '109.55 SOL',
        neftBestOffer: '10.22 SOL',
        nftIntrest: '52.33 %',
        nftDuration: '15 days',
    },
]

const FormSchema = z.object({
    assetName: z.string({
        required_error: 'Name is required',
    }).min(3, {
        message: 'Name must be at least 3 characters long',
    }).optional()
})

export default function P2PBorrowing() {
    const { connected } = useWallet();
    const wallet = useWallet();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            assetName: '',
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const assetName = data.assetName;

        if (assetName) {
            const result = await newAssetLendingRequest({ walletAddress: wallet.publicKey?.toString(), requestedAssetname: assetName });

            if (result) {
                if (result instanceof Response && result.status === 409) {
                    toast.info('Request sent successfully!');
                } else {
                    toast.success('Request sent successfully!');
                    form.reset();
                }
            }
        }
    }

    return (
        <div className='py-2 md:py-4'>
            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
                        <div className='text-2xl md:text-4xl'>All NFT Collection</div>
                        {connected && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant='outline' className='px-4'>Request new NFT Collection for borrowing</Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                                    <DialogHeader>
                                        <DialogTitle>Request for new NFT Collection</DialogTitle>
                                        <DialogDescription>
                                            Make request for new NFT Collection for borrowing.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-4 pt-2'>
                                            <FormField
                                                control={form.control}
                                                name='assetName'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>NFT Collection Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className='w-full' placeholder='NFT Collection Name' />
                                                        </FormControl>
                                                        <FormMessage className='text-destructive tracking-wide' />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type='submit' className='text-white bg-primary hover:bg-primary/90'>
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
                    <DataTable
                        columns={borrowingAssetColumns}
                        data={borrowingAssetData.map(asset => ({
                            ...asset,
                        }))}
                        userSearchColumn='nftName'
                        inputPlaceHolder='Search for NFT Collection'
                    />
                </CardContent>
            </Card>
        </div>
    )
}
