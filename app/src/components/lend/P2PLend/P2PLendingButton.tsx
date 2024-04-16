import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { Loader2, ExternalLink } from 'lucide-react'
import InfoButton from '@/components/InfoButton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Loading from '@/components/Loading'

export type LendingNFTCollectionDataType = {
    nftName: string;
    nftLogo: string;
    nftPool: string;
    neftBestOffer?: string;
    nftIntrest?: string;
    nftAPY?: string;
    nftDuration: string;
    nftFloorPrice?: string;
}

export default function P2PLendingButton({ row }: { row: { original: LendingNFTCollectionDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const order = row.original;
    const { connected } = useWallet();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='text-white' disabled={!connected}>
                    {connected ? 'Lend' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <h1>Lend SOL</h1>
                        <InfoButton />
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
