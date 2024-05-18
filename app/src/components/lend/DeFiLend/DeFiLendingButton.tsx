import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import { createTransferInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, Connection, TransactionInstruction, SystemProgram } from '@solana/web3.js'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { newDeFiLending } from '@/actions/dbActions'
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

            if (integerPart.length > 7 || (decimalPart && decimalPart.length > 6)) {
                return false;
            }

            return true;
        }, {
            message: 'Amount must have up to 7 digits before the decimal point and up to 6 digits after the decimal point.',
        }),
});

export const configureAndSendCurrentTransaction = async (
    transaction: Transaction,
    connection: Connection,
    feePayer: PublicKey,
    signTransaction: SignerWalletAdapterProps['signTransaction']
) => {
    const blockHash = await connection.getLatestBlockhash();
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = blockHash.blockhash;
    const signed = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction({
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
        signature
    });
    return signature;
};

export default function DeFiLendingButton({ row }: { row: { original: LendingAssetDataType } }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sigValidation, setSigValidation] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const order = row.original;
    const { publicKey, sendTransaction, signTransaction } = useWallet();
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
                return toast.error('Wallet not connected. Please connect your wallet and try again!');
            }

            setIsSubmitting(true);

            const recipientPubKey = new PublicKey('Cq6JPmEspG6oNcUC47WHuEJWU1K4knsLzHYHSfvpnDHk');
            let tokenAddress;
            let sig: string | undefined;

            if (order.asset_symbol === 'SOL') {
                let amount = LAMPORTS_PER_SOL * parseFloat(values.lending_amount);
                const transaction = new Transaction();
                const sendSolInstruction = SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports: amount
                });
                transaction.add(sendSolInstruction);
                sig = await sendTransaction(transaction, connection);
            } else {
                let amount = 1000000 * parseFloat(values.lending_amount);
                amount = parseFloat(amount.toFixed(6));

                if (order.asset_symbol === 'USDC') {
                    // tokenAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC token address on solana mainnet-beta
                    tokenAddress = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC token address on solana devnet
                } else if (order.asset_symbol === 'USDT') {
                    // tokenAddress = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); // USDT token address on solana mainnet-beta
                    tokenAddress = new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS'); // USDT token address on solana devnet
                } else if (order.asset_symbol === 'JUP') {
                    tokenAddress = new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'); // JUP token address on solana mainnet-beta
                } else if (order.asset_symbol === 'PYTH') {
                    tokenAddress = new PublicKey('HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'); // PYTH token address on solana mainnet-beta
                } else if (order.asset_symbol === 'JTO') {
                    tokenAddress = new PublicKey('jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL'); // JTO token address on solana mainnet-beta
                } else if (order.asset_symbol === 'RAY') {
                    tokenAddress = new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'); // RAY token address on solana mainnet-beta
                } else if (order.asset_symbol === 'BLZE') {
                    tokenAddress = new PublicKey('BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA'); // BLZE token address on solana mainnet-beta
                } else if (order.asset_symbol === 'tBTC') {
                    tokenAddress = new PublicKey('6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU'); // tBTC token address on solana mainnet-beta
                } else if (order.asset_symbol === 'mSOL') {
                    tokenAddress = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'); // mSOLO token address on solana mainnet-beta
                }

                if (tokenAddress && signTransaction) {
                    const transactionInstructions: TransactionInstruction[] = [];
                    const associatedTokenFrom = await getAssociatedTokenAddress(
                        tokenAddress,
                        publicKey
                    );
                    const fromAccount = await getAccount(connection, associatedTokenFrom);
                    const associatedTokenTo = await getAssociatedTokenAddress(
                        tokenAddress,
                        recipientPubKey
                    );
                    if (!(await connection.getAccountInfo(associatedTokenTo))) {
                        transactionInstructions.push(
                            createAssociatedTokenAccountInstruction(
                                publicKey,
                                associatedTokenTo,
                                recipientPubKey,
                                tokenAddress
                            )
                        );
                    }
                    transactionInstructions.push(
                        createTransferInstruction(
                            fromAccount.address,
                            associatedTokenTo,
                            publicKey,
                            amount
                        )
                    );
                    const transaction = new Transaction().add(...transactionInstructions);
                    sig = await configureAndSendCurrentTransaction(
                        transaction,
                        connection,
                        publicKey,
                        signTransaction
                    );
                }
            }

            const timeout = 8000;
            const interval = 1000;
            const start = Date.now();

            if (sig && wallet.publicKey) {
                setSigValidation(true);

                const polling = setInterval(async () => {
                    if (!sig || !wallet.publicKey) {
                        clearInterval(polling);
                        return toast.error('Transaction failed. Please try again!');
                    }

                    const transaction = await connection.getParsedTransaction(sig);

                    if (transaction?.meta?.err === null) {
                        clearInterval(polling);
                        const result = await newDeFiLending({
                            walletAddress: wallet.publicKey.toString(),
                            lendingAmount: values.lending_amount,
                            lendingToken: order.asset_symbol,
                            transactionSignature: sig
                        });

                        if (result === 'Request for new DeFi Lending sent successfully') {
                            setOpen(false);
                            setSigValidation(true);
                            toast.success('Lending successful! Interest starts accruing.');
                        } else {
                            toast.error('An error occurred while lending. Please try again!');
                        }
                    } else if (Date.now() - start > timeout) {
                        clearInterval(polling);
                        setIsSubmitting(false);
                        setSigValidation(false);
                        toast.error('Invalid transaction. Please try again!');
                    } else {
                        clearInterval(polling);
                        setIsSubmitting(false);
                        setSigValidation(false);
                        toast.error('Invalid transaction. Please try again!');
                    }
                }, interval);
            }
        } catch (error) {
            if (error == 'TokenAccountNotFoundError') {
                toast.error('Insufficient balance in your wallet.');
            } else {
                toast.error('An error occurred while repaying the loan. Please try again!');
            }
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
                        <div>Lend Token</div>
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
                                    <FormItem className='w-full px-2'>
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
                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
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
                                    <div>$ {order.asset_price}</div>
                                </div>
                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
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

                            {isSubmitting && !sigValidation &&
                                <div className={`text-center px-2 ${isSubmitting ? 'animate-fade-in-up-short' : ''}`}>
                                    Transaction in progress. Please avoid refreshing or closing this tab.
                                </div>
                            }

                            {sigValidation &&
                                <div className={`text-center px-2 ${sigValidation ? 'animate-fade-in-up-short' : ''}`}>
                                    Validating transaction. Please avoid refreshing or closing this tab.
                                </div>
                            }

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
