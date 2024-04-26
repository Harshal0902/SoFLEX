import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as web3 from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { newDeFiLending } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Loader2, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export type LendingAssetDataType = {
    asset_name: string;
    asset_symbol: string;
    asset_logo: string;
    asset_price: string;
    asset_total_supply: string;
    asset_yield: string;
    asset_total_borrow: string;
    asset_ltv: string;
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

export default function DeFiLendingButton({ row }: { row: { original: LendingAssetDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const { publicKey, sendTransaction } = useWallet();

    const order = row.original;
    const { connection } = useConnection();
    const wallet = useWallet();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lending_amount: ''
        },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            if (!connection || !publicKey) {
                return;
            }

            setIsSubmitting(true);

            let sig;

            const recipientPubKey = new web3.PublicKey('Cq6JPmEspG6oNcUC47WHuEJWU1K4knsLzHYHSfvpnDHk');
            let amount;
            let tokenAddress;

            if (order.asset_symbol === 'SOL') {
                amount = LAMPORTS_PER_SOL * parseFloat(values.lending_amount);
                const transaction = new web3.Transaction();
                const sendSolInstruction = web3.SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports: amount
                });
                transaction.add(sendSolInstruction);
                sig = await sendTransaction(transaction, connection);
            } else {
                amount = parseFloat(values.lending_amount);
                if (order.asset_symbol === 'USDC') {
                    tokenAddress = new web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
                } else if (order.asset_symbol === 'USDT') {
                    tokenAddress = new web3.PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
                } else if (order.asset_symbol === 'JUP') {
                    tokenAddress = new web3.PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN');
                } else if (order.asset_symbol === 'PYTH') {
                    tokenAddress = new web3.PublicKey('HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3');
                } else if (order.asset_symbol === 'JTO') {
                    tokenAddress = new web3.PublicKey('jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL');
                } else if (order.asset_symbol === 'RAY') {
                    tokenAddress = new web3.PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R');
                } else if (order.asset_symbol === 'BLZE') {
                    tokenAddress = new web3.PublicKey('BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA');
                } else if (order.asset_symbol === 'tBTC') {
                    tokenAddress = new web3.PublicKey('6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU');
                } else if (order.asset_symbol === 'mSOL') {
                    tokenAddress = new web3.PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So');
                }

                if (tokenAddress) {
                    const transaction = new web3.Transaction();
                    const transferInstruction = Token.createTransferInstruction(
                        TOKEN_PROGRAM_ID,
                        tokenAddress,
                        recipientPubKey,
                        publicKey,
                        [],
                        amount
                    );

                    transaction.add(transferInstruction);
                    sig = await sendTransaction(transaction, connection);
                }
            }

            if (sig) {
                const data = await newDeFiLending({
                    walletAddress: wallet.publicKey?.toString(),
                    lendingAmount: values.lending_amount,
                    lendingToken: order.asset_symbol,
                    transactionSignature: sig
                });

                if (data) {
                    setOpen(false);
                    toast.success('Lending successful! Interest starts accruing.');
                } else {
                    toast.error('Error completing the process. Please try again!');
                }
            }
        } catch (error) {
            toast.error('Error completing the process. Please try again!');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='text-white' disabled={!publicKey}>
                    {publicKey ? 'Lend' : 'Connect Wallet'}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <h1>Lend Token</h1>
                    </DialogTitle>
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
                                        <FormLabel>Lending amount (in {order.asset_symbol})</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={`Enter the ${order.asset_symbol} you want to lend `} />
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
                                    <div>{order.asset_price}</div>
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
                                    <div>{order.asset_yield}</div>
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
