import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { newDeFiLending } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { useWallet } from '@solana/wallet-adapter-react'
import { Loader2, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export type LendingAssetDataType = {
    assetName: string;
    assetSymbol: string;
    assetLogo: string;
    assetPrice: string;
    totalSupply: string;
    assetYield: string;
    totalBorrow: string;
    LTV: string;
}

interface CellProps {
    row: {
        original: LendingAssetDataType;
    };
}

const FormSchema = z.object({
    lending_amount: z
        .string()
        .refine(value => !isNaN(Number(value)), {
            message: 'Amount must be a number.',
        })
        .refine(value => Number(value) > 0, {
            message: 'Amount must be a positive number.',
        })
        .refine(value => {
            const stringValue = String(value);
            const [integerPart, decimalPart] = stringValue.split('.');

            if (integerPart.length > 7 || (decimalPart && decimalPart.length > 8)) {
                return false;
            }

            return true;
        }, {
            message: 'Amount must have up to 7 digits before the decimal point and up to 8 digits after the decimal point.',
        }),
});

export default function LendButtonCell({ row }: { row: { original: LendingAssetDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const order = row.original;
    const { connected } = useWallet();
    const wallet = useWallet();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lending_amount: ''
        },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            const data = await newDeFiLending({
                walletAddress: wallet.publicKey?.toString(),
                lendingAmount: values.lending_amount,
                lendingToken: order.assetSymbol
            });

            setIsSubmitting(true);
            if (data) {
                setIsSubmitting(false);
                setOpen(false);
                toast.success('Lending successful! Interest starts accruing.');
            } else {
                toast.error('Error completing the process. Please try again!');
            }
        } catch (error) {
            toast.error('Error completing the process. Please try again!');
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='text-white' disabled={!connected}>
                    {connected ? 'Lend' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Lend Token</DialogTitle>
                    <DialogDescription>
                        Lend your token to earn interest.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off'>

                            <FormField
                                control={form.control}
                                name='lending_amount'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Lending amount (in {order.assetSymbol})</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={`Enter the ${order.assetSymbol} you want to lend `} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the amount you want to lend.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex flex-col space-y-1 pt-2'>
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>Current Price</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    The current price of the asset in USD.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>{order.assetPrice}</div>
                                </div>
                                <div className='flex flex-row items-center justify-between'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>Asset Yield</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    The annual percentage yield (APY) earned for supplying the asset.
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>{order.assetYield}</div>
                                </div>
                            </div>

                            <Button type='submit' className='text-white w-full mt-4' disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                                {isSubmitting ? 'Lending...' : 'Lend'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
