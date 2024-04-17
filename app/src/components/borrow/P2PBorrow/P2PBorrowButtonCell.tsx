import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { Loader2, ExternalLink } from 'lucide-react'
import InfoButton from '@/components/InfoButton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Loading from '@/components/Loading'

export type BorrowingNFTCollectionDataType = {
    nftName: string;
    nftLogo: string;
    nftPool: string;
    neftBestOffer?: string;
    nftIntrest?: string;
    nftAPY?: string;
    nftDuration: string;
}

type CollectionType = {
    name: string;
    nfts: { name: string; metadata_uri: string; mint: string }[];
};

export default function P2PBorrowButtonCell({ row }: { row: { original: BorrowingNFTCollectionDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
    const [NFTLoading, setNFTLoading] = useState<boolean>(false);
    const [nftImages, setNftImages] = useState<string[]>([]);

    const order = row.original;
    const { connected } = useWallet();
    const wallet = useWallet();

    const shyft_api_key = process.env.NEXT_PUBLIC_SHYFTAPI!;

    const fetchNFTData = async (metadataUri: string) => {
        try {
            const response = await fetch(metadataUri);
            const metadata = await response.json();
            return metadata.image;
        } catch (error) {
            toast.error(`Error fetching NFT data: ${error}`);
            return null;
        }
    };

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
                    const data = await response.json();
                    const collections: CollectionType[] = data.result.collections;
                    let filteredCollections;
                    if (order.nftName === 'Degods') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('DeGod')));
                    } else if (order.nftName === 'Taiyo Robotics') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Taiyo')));
                    } else if (order.nftName === 'Cyber Frogs') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Cyber Frogs')));
                    } else if (order.nftName === 'The Lowlifes [0.G]') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('The Lowlifes')));
                    } else if (order.nftName === 'SMB Gen2') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('SMB')));
                    } else if (order.nftName === 'Quekz') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Quekz')));
                    } else if (order.nftName === 'Photo Finish PFP Collection') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('PFL')));
                    } else if (order.nftName === 'Kanpai Pandas') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Kanpai')));
                    } else if (order.nftName === 'Homeowners Association (Parcl)') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Homeowners')));
                    } else if (order.nftName === 'Enigma Ventures') {
                        filteredCollections = collections.filter(collection => collection.nfts.some(nft => nft.name.includes('Enigma')));
                    } else if (order.nftName === 'Gaimin Gladiators') {
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
                    toast.error(`Error fetching NFT collections: ${error}`);
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
                <Button className='text-white' disabled={!connected}>
                    {connected ? 'Borrow' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <h1>Borrow SOL</h1>
                        <InfoButton />
                    </DialogTitle>
                    <DialogDescription>
                        Borrow SOL against your NFT from Collection.
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[45vh] md:max-h-[60vh] overflow-y-auto px-2'>
                    <div className='flex flex-row space-x-2 mt-2'>
                        <div className='relative h-20 w-16 md:h-24 md:w-36'>
                            <Image src={order.nftLogo} alt={order.nftName} className='rounded object-cover' fill priority />
                        </div>
                        <div className='flex flex-col items-start w-full mt-1'>
                            <div className='text-xl tracking-wide break-words'>{order.nftName}</div>
                            <div className='grid grid-flow-col justify-between items-center col-span-3 w-full pt-1.5'>
                                <div className='border rounded p-2 flex flex-col items-center justify-center px-[3vw] md:px-10'>
                                    <h1 className='text-[0.6rem] md:text-sm tracking-wider break-words'>Offer</h1>
                                    <p className='text-[0.5rem] md:text-sm'>{order.neftBestOffer}</p>
                                </div>
                                <div className='border rounded p-2 flex flex-col items-center justify-center px-[3vw] md:px-10'>
                                    <h1 className='text-[0.6rem] md:text-sm tracking-wider break-words'>Rate</h1>
                                    <p className='text-[0.5rem] md:text-sm'>{order.nftIntrest}</p>
                                </div>
                                <div className='border rounded p-2 flex flex-col items-center justify-center px-[3vw] md:px-10'>
                                    <h1 className='text-[0.6rem] md:text-sm tracking-wider break-words'>Duration</h1>
                                    <p className='text-[0.5rem] md:text-sm'>{order.nftDuration}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Accordion type='multiple' defaultValue={['NFT']}>
                        <AccordionItem value='NFT'>
                            <AccordionTrigger className='hover:no-underline text-left font-semibold tracking-wide'>Select NFT(s) for Collateral</AccordionTrigger>
                            <AccordionContent>
                                {NFTLoading ? <Loading /> : (
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
                                {/* @ts-ignore */}
                                Repay {(parseFloat(order.neftBestOffer) + ((parseFloat(order.nftIntrest) / 100) * parseFloat(order.neftBestOffer))).toFixed(4)} SOL within {order.nftDuration}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='flex flex-row items-center justify-between text-sm md:text-lg'>
                                    <h1>Loan amount</h1>
                                    <h1>{order.neftBestOffer}</h1>
                                </div>
                                <div className='flex flex-row items-center justify-between text-sm md:text-lg'>
                                    <h1>Interest</h1>
                                    {/* @ts-ignore */}
                                    <h1>{order.nftIntrest} ~ {((parseFloat(order.nftIntrest) / 100) * parseFloat(order.neftBestOffer)).toFixed(4)} SOL</h1>
                                </div>
                                <div className='flex flex-row items-center justify-between text-sm md:text-lg'>
                                    <h1>Due by</h1>
                                    <h1>{order.nftDuration}</h1>
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
