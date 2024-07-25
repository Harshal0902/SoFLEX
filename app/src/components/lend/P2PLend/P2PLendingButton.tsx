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
    nft_name: string;
    nft_logo: string;
    nft_pool: string;
    nft_best_offer: string;
    nft_intrest: string;
    nft_apy: string;
    nft_duration: string;
    nft_floor_price: string;
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
    const { publicKey } = useWallet();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lending_amount: order.nft_best_offer ? parseFloat(order.nft_best_offer) : 0,
        },
    });

    const lendingAmount = form.watch('lending_amount');
    const nft_floor_price = parseFloat(order.nft_floor_price);
    const threshold = nft_floor_price * 0.9;

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
                <Button disabled={!publicKey}>
                    {publicKey ? 'Lend' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <div>Lend SOL</div>
                        <InfoButton />
                    </DialogTitle>
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
                                    <h1 className='text-[0.6rem] lg:text-sm tracking-wider break-words'>Floor</h1>
                                    <p className='text-[0.5rem] lg:text-sm'>{order.nft_floor_price} SOL</p>
                                </div>
                                <div className='flex flex-col items-center justify-center py-3 border rounded w-full h-full'>
                                    <h1 className='text-[0.6rem] lg:text-sm tracking-wider break-words'>APY</h1>
                                    <p className='text-[0.5rem] lg:text-sm'>{order.nft_apy}</p>
                                </div>
                                <div className='flex flex-col items-center justify-center py-3 border rounded w-full h-full'>
                                    <h1 className='text-[0.6rem] lg:text-sm tracking-wider break-words'>Duration</h1>
                                    <p className='text-[0.5rem] lg:text-sm'>{order.nft_duration}</p>
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
                                                <Input type='number' max={parseFloat(order.nft_floor_price)} placeholder='Offer Amount' {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the amount you want to lend
                                            </FormDescription>
                                            {lendingAmount >= threshold && (
                                                <p className='text-sm text-destructive'>This offer amount is close to the current floor price!</p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='w-full'>
                                    <h1 className='text-sm font-medium leading-none md:pt-2'>Total Intrest (in SOL)</h1>
                                    <h1 className='text-lg md:text-2xl py-1 md:py-3'>{((parseFloat(order.nft_intrest) / 100) * (form.watch('lending_amount') * offerCount)).toFixed(4)} SOL</h1>
                                    <p className='text-sm text-muted-foreground'>{order.nft_intrest} x {offerCount}</p>
                                </div>
                            </div>

                            <div>
                                <h1 className='text-sm font-medium leading-none py-2'>Number of Offers</h1>
                                <div className='grid grid-cols-5 gap-2 items-center justify-center'>
                                    <div className='col-span-1 border rounded p-2 grid place-items-center cursor-pointer' onClick={handleDecrease}>
                                        <Minus className='h-5 w-5 md:h-6 md:w-6' />
                                    </div>
                                    <div className='col-span-3 border rounded p-2 md:p-1.5 grid place-items-center text-sm md:text-lg'>{offerCount}</div>
                                    <div className='col-span-1 border rounded p-2 grid place-items-center cursor-pointer' onClick={handleIncrease}>
                                        <Plus className='h-5 w-5 md:h-6 md:w-6' />
                                    </div>
                                </div>
                            </div>

                            <div className='py-2'>
                                <p className='text-lg'>Your total is {(form.watch('lending_amount') * offerCount).toFixed(4)} SOL</p>
                            </div>

                            {/* <Button type='submit' className='w-full mt-4' disabled={isSubmitting}> */}
                            <Button type='submit' className='w-full mt-4' disabled>
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
