import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Minus, Plus, Loader2 } from 'lucide-react'
import InfoButton from '@/components/InfoButton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

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

const FormSchema = z.object({
    lending_amount: z.string().refine((value) => {
        const parsedValue = parseFloat(value);
        return !isNaN(parsedValue) && parsedValue >= 0;
    }, {
        message: 'Lending Amount must be a valid non-negative number',
    }).refine((value) => {
        return parseFloat(value) > 0;
    }, {
        message: 'Lending Amount must be greater than 0',
    }).transform((value) => parseFloat(value))
});

export default function P2PLendingButton({ row }: { row: { original: LendingNFTCollectionDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [offerCount, setOfferCount] = useState<number>(1);

    const order = row.original;
    const { connected } = useWallet();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lending_amount: order.nftFloorPrice ? parseFloat(order.nftFloorPrice) : 0,
        },
    });

    const handleIncrease = () => {
        if (offerCount < 9) {
            setOfferCount(offerCount + 1);
        }
    };

    const handleDecrease = () => {
        if (offerCount > 1) {
            setOfferCount(offerCount - 1);
        }
    };

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        toast(JSON.stringify(values));
    }

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
                <div className='max-h-[45vh] md:max-h-[60vh] overflow-y-auto px-2'>
                    <div className='flex flex-row space-x-2 mt-2'>
                        <div className='relative h-20 w-16 md:h-24 md:w-36'>
                            <Image src={order.nftLogo} alt={order.nftName} className='rounded object-cover' fill priority />
                        </div>
                        <div className='flex flex-col items-start w-full mt-1'>
                            <div className='text-xl tracking-wide break-words'>{order.nftName} llll</div>
                            <div className='grid grid-flow-col justify-between items-center col-span-3 w-full pt-1.5'>
                                <div className='border rounded p-2 flex flex-col items-center justify-center px-[3vw] md:px-10'>
                                    <h1 className='text-[0.6rem] md:text-sm tracking-wider break-words'>Floor</h1>
                                    <p className='text-[0.5rem] md:text-sm'>{order.nftFloorPrice} SOL</p>
                                </div>
                                <div className='border rounded p-2 flex flex-col items-center justify-center px-[3vw] md:px-10'>
                                    <h1 className='text-[0.6rem] md:text-sm tracking-wider break-words'>APY</h1>
                                    <p className='text-[0.5rem] md:text-sm'>{order.nftAPY}</p>
                                </div>
                                <div className='border rounded p-2 flex flex-col items-center justify-center px-[3vw] md:px-10'>
                                    <h1 className='text-[0.6rem] md:text-sm tracking-wider break-words'>Duration</h1>
                                    <p className='text-[0.5rem] md:text-sm'>{order.nftDuration}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-2 pt-2'>

                            <div className='w-full flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-8 md:items-center'>

                                <FormField
                                    control={form.control}
                                    name='lending_amount'
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Offer Amount (in SOL)</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder='Offer Amount' {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the amount you want to lend
                                            </FormDescription>
                                            {/* <p className='text-sm text-destructive'>This offer amount is more than the current floor price!</p> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='w-full'>
                                    <h1 className='text-sm font-medium leading-none md:pt-2'>Total Intrest (in SOL)</h1>
                                    {/* @ts-ignore */}
                                    <h1 className='text-lg md:text-2xl py-1 md:py-3'>{(parseFloat(order.nftIntrest) / 100) * parseFloat(form.watch('lending_amount') * offerCount).toFixed(4)} SOL</h1>
                                    <p className='text-sm text-muted-foreground'>{order.nftIntrest} x {offerCount}</p>
                                </div>
                            </div>

                            <div className='grid grid-cols-5 gap-2 items-center justify-center'>
                                <div className='col-span-1 border rounded p-2 grid place-items-center cursor-pointer' onClick={handleDecrease}>
                                    <Minus className='h-5 w-5 md:h-6 md:w-6' />
                                </div>
                                <div className='col-span-3 border rounded p-2 md:p-1.5 grid place-items-center text-sm md:text-lg'>{offerCount}</div>
                                <div className='col-span-1 border rounded p-2 grid place-items-center cursor-pointer' onClick={handleIncrease}>
                                    <Plus className='h-5 w-5 md:h-6 md:w-6' />
                                </div>
                            </div>

                            {/* <Button type='submit' className='text-white w-full mt-4' disabled={isSubmitting}> */}
                            <Button type='submit' className='text-white w-full mt-4' disabled>
                                {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                                {isSubmitting ? 'Borrowing...' : 'Borrow'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog >
    )
}
