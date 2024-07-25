import React, { useEffect, useState } from 'react'
import { newAssetOrCollectionRequest, nftCollectionDetails } from '@/actions/dbActions'
import { useWallet } from '@solana/wallet-adapter-react'
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

const FormSchema = z.object({
    nftCollectionName: z.string({
        required_error: 'Name is required',
    }).min(3, {
        message: 'Name must be at least 3 characters long',
    }).optional()
})

export default function P2PLending() {
    const [open, setOpen] = useState(false);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [lendingNFTCollectionData, setLendingNFTCollectionData] = useState<LendingNFTCollectionDataType[]>([]);

    const { publicKey } = useWallet();
    const wallet = useWallet();

    useEffect(() => {
        const fetchNFTCollectionData = async () => {
            const result = await nftCollectionDetails();
            if (Array.isArray(result)) {
                setLendingNFTCollectionData(result);
            } else {
                toast.error('An error occurred while fetching NFT Collection data. Please try again!');
            }
            setLoadingData(false);
        };

        fetchNFTCollectionData();
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
                toast.success('Request sent successfully!');
                setOpen(false);
                form.reset();
            } else {
                toast.error('An error occurred while sending request. Please try again!');
            }
        }
    }

    return (
        <div className='py-2 md:py-4'>
            <Card>
                <CardHeader>
                    <div className='flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0'>
                        <div className='text-center md:text-start text-2xl md:text-4xl'>All NFT Collection</div>
                        {publicKey && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='outline' className='w-full md:w-auto'>Request new NFT Collection for lending</Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                                    <DialogHeader>
                                        <DialogTitle>Request for new NFT Collection</DialogTitle>
                                        <DialogDescription>
                                            Make request for new NFT Collection for lending.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-4 pt-2'>
                                            <FormField
                                                control={form.control}
                                                name='nftCollectionName'
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
                            inputPlaceHolder='Search for NFT Collection'
                            noResultsMessage='No NFT Collection found'
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
