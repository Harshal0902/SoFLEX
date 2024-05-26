import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { Loader2, ExternalLink } from 'lucide-react'
import InfoButton from '@/components/InfoButton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'

export type BorrowingNFTCollectionDataType = {
    nft_name: string;
    nft_logo: string;
    nft_pool: string;
    nft_best_offer: string;
    nft_intrest: string;
    nft_apy: string;
    nft_duration: string;
    nft_floor_price: string;
}

type CollectionType = {
    name: string;
    nfts: { name: string; metadata_uri: string; mint: string }[];
};

export default function P2PBorrowingButton({ row }: { row: { original: BorrowingNFTCollectionDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
    const [NFTLoading, setNFTLoading] = useState<boolean>(false);
    const [nftImages, setNftImages] = useState<string[]>([]);

    const order = row.original;
    const { publicKey } = useWallet();
    const wallet = useWallet();

    const shyft_api_key = process.env.NEXT_PUBLIC_SHYFTAPI!;

    const fetchNFTData = async (metadataUri: string) => {
        try {
            const response = await fetch(metadataUri);
            const metadata = await response.json();
            return metadata.image;
        } catch (error) {
            toast.error(`An error occurred while fetching NFT data. Please try again!`);
            return null;
        }
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
    futureDate.setDate(futureDate.getDate() + parseInt(order.nft_duration));

    const dueByDate = `${addOrdinalSuffix(futureDate.getDate())} ${futureDate.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })}`;

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
                    const response = await fetch(`https://api.shyft.to/sol/v1/wallet/collections?network=mainnet-beta&wallet_address=${wallet.publicKey?.toString()}`, requestOptions);
                    const result = await response.json();
                    const collections: CollectionType[] = result.result.collections;
                    let filteredCollections;
                    if (order.nft_name === 'Degods') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('DeGod')));
                    } else if (order.nft_name === 'Taiyo Robotics') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Taiyo')));
                    } else if (order.nft_name === 'Cyber Frogs') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Cyber Frogs')));
                    } else if (order.nft_name === 'The Lowlifes [0.G]') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('The Lowlifes')));
                    } else if (order.nft_name === 'SMB Gen2') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('SMB')));
                    } else if (order.nft_name === 'Quekz') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Quekz')));
                    } else if (order.nft_name === 'Photo Finish PFP Collection') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('PFL')));
                    } else if (order.nft_name === 'Kanpai Pandas') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Kanpai')));
                    } else if (order.nft_name === 'Homeowners Association (Parcl)') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Homeowners')));
                    } else if (order.nft_name === 'Enigma Ventures') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Enigma')));
                    } else if (order.nft_name === 'Gaimin Gladiators') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Gladiators')));
                    } else {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name));
                    }
                    setFilteredCollections(filteredCollections);

                    const imagesPromises = filteredCollections.flatMap(collection =>
                        collection.nfts.map(nft =>
                            fetchNFTData(nft.metadata_uri)
                        )
                    );
                    const images = await Promise.all(imagesPromises);
                    setNftImages(images);
                } catch (error) {
                    toast.error(`An error occurred while fetching NFT data. Please try again!`);
                } finally {
                    setNFTLoading(false);
                }
            }
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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
                        <div>Borrow SOL</div>
                        <InfoButton />
                    </DialogTitle>
                    <DialogDescription>
                        Borrow SOL against your NFT from Collection.
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[45vh] md:max-h-[60vh] overflow-y-auto px-2'>
                    <div className='flex flex-row space-x-2 mt-2'>
                        <div className='relative h-20 w-16 md:h-24 md:w-36'>
                            <Image src={order.nft_logo} alt={order.nft_name} className='rounded object-cover' fill priority />
                        </div>
                        <div className='flex flex-col items-start w-full'>
                            <div className='text-xl tracking-wide break-words'>{order.nft_name}</div>
                            <div className='grid grid-cols-3 gap-x-2 w-full pt-0.5'>
                                <div className='flex flex-col items-center justify-center py-3 border rounded w-full h-full'>
                                    <h1 className='text-[0.6rem] lg:text-sm tracking-wider break-words'>Offer</h1>
                                    <p className='text-[0.5rem] lg:text-sm'>{order.nft_best_offer}</p>
                                </div>
                                <div className='flex flex-col items-center justify-center py-3 border rounded w-full h-full'>
                                    <h1 className='text-[0.6rem] lg:text-sm tracking-wider break-words'>Rate</h1>
                                    <p className='text-[0.5rem] lg:text-sm'>{order.nft_intrest}</p>
                                </div>
                                <div className='flex flex-col items-center justify-center py-3 border rounded w-full h-full'>
                                    <h1 className='text-[0.6rem] lg:text-sm tracking-wider break-words'>Duration</h1>
                                    <p className='text-[0.5rem] lg:text-sm'>{order.nft_duration}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Accordion type='multiple' defaultValue={['NFT']}>
                        <AccordionItem value='NFT'>
                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>Select NFT(s) for Collateral</AccordionTrigger>
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
                                        {filteredCollections.length ? (
                                            filteredCollections.map((collection, index) => (
                                                <React.Fragment key={index}>
                                                    {collection.nfts
                                                        .filter(nft => nft.name)
                                                        .map((nft, index) => (
                                                            <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
                                                                <div className='flex items-center justify-center'>
                                                                    <Image src={nftImages[index]} width={180} height={40} alt={nft.name} />
                                                                </div>
                                                                <p className='text-center'>{nft.name}</p>
                                                                <div className='flex flex-row items-center justify-center space-x-2'>
                                                                    <a href={`https://solscan.io/token/${nft.mint}`} target='_blank' className='text-primary'>View on Solscan</a>
                                                                    <ExternalLink className='h-4 w-4' />
                                                                </div>
                                                            </div>
                                                        ))}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <p>You don&apos;t have any NFT(s) for this collection.</p>
                                        )}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='Return'>
                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>
                                Repay {(parseFloat(order.nft_best_offer) + ((parseFloat(order.nft_intrest) / 100) * parseFloat(order.nft_best_offer))).toFixed(4)} SOL within {(order.nft_duration)}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='flex flex-row items-center justify-between text-sm md:text-lg'>
                                    <h1>Loan amount</h1>
                                    <h1>{order.nft_best_offer}</h1>
                                </div>
                                <div className='flex flex-row items-center justify-between text-sm md:text-lg'>
                                    <h1>Interest</h1>
                                    <h1>{order.nft_intrest} ~ {((parseFloat(order.nft_intrest) / 100) * parseFloat(order.nft_best_offer)).toFixed(4)} SOL</h1>
                                </div>
                                <div className='flex flex-row items-center justify-between text-sm md:text-lg'>
                                    <h1>Due by</h1>
                                    <h1>{dueByDate}</h1>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    {/* <Button type='submit' className='text-white w-full mt-4' disabled={isSubmitting || filteredCollections.length === 0}> */}
                    <Button type='submit' className='text-white w-full mt-4' disabled>
                        {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                        {isSubmitting ? 'Borrowing...' : 'Borrow'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
