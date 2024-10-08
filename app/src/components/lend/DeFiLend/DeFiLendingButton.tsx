import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
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
    const [tokenBalance, setTokenBalance] = useState<string>('0');
    const [sigValidation, setSigValidation] = useState<boolean>(false);
    const [open, setOpen] = useState(false);

    const t = useTranslations('DeFiLendPage');
    const order = row.original;
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const { connection } = useConnection();
    const wallet = useWallet();

    const FormSchema = z.object({
        lending_amount: z
            .string()
            .refine(value => !isNaN(Number(value)), {
                message: `${t('amountMessage1')}`,
            })
            .refine(value => Number(value) >= 0.00001, {
                message: `${t('amountMessage2')}`,
            })
            .refine(value => {
                const stringValue = String(value);
                const [integerPart, decimalPart] = stringValue.split('.');

                if (integerPart.length > 7 || (decimalPart && decimalPart.length > 6)) {
                    return false;
                }

                return true;
            }, {
                message: `${t('amountMessage3')}`,
            }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            lending_amount: ''
        },
    });

    useEffect(() => {
        const fetchTokenAccounts = async () => {
            if (open === true && publicKey) {
                try {
                    let tokenAddress;
                    let decimalPlaces;
                    if (order.asset_symbol === 'SOL') {
                        const walletAddress = publicKey;
                        const balance = await connection.getBalance(walletAddress);
                        setTokenBalance(((balance / 10 ** 9).toFixed(4)).toString());
                    } else {
                        if (order.asset_symbol === 'USDC') {
                            // tokenAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC token address on solana mainnet-beta
                            tokenAddress = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC token address on solana devnet
                            decimalPlaces = 6;
                        } else if (order.asset_symbol === 'USDT') {
                            // tokenAddress = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); // USDT token address on solana mainnet-beta
                            tokenAddress = new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS'); // USDT token address on solana devnet
                            decimalPlaces = 6;
                        } else if (order.asset_symbol === 'EURC') {
                            // tokenAddress = new PublicKey('HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'); // EURC token address on solana mainnet-beta
                            tokenAddress = new PublicKey('HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'); // EURC token address on solana devnet
                            decimalPlaces = 6;
                        } else if (order.asset_symbol === 'JUP') {
                            tokenAddress = new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'); // JUP token address on solana mainnet-beta
                            decimalPlaces = 6;
                        } else if (order.asset_symbol === 'PYTH') {
                            tokenAddress = new PublicKey('HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'); // PYTH token address on solana mainnet-beta
                            decimalPlaces = 6;
                        } else if (order.asset_symbol === 'RAY') {
                            tokenAddress = new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'); // RAY token address on solana mainnet-beta
                            decimalPlaces = 6;
                        } else if (order.asset_symbol === 'BLZE') {
                            tokenAddress = new PublicKey('BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA'); // BLZE token address on solana mainnet-beta
                            decimalPlaces = 9;
                        } else if (order.asset_symbol === 'tBTC') {
                            tokenAddress = new PublicKey('6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU'); // tBTC token address on solana mainnet-beta
                            decimalPlaces = 8;
                        } else if (order.asset_symbol === 'mSOL') {
                            tokenAddress = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'); // mSOLO token address on solana mainnet-beta
                            decimalPlaces = 9;
                        } else if (order.asset_symbol === 'JTO') {
                            tokenAddress = new PublicKey('jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL'); // JTO token address on solana mainnet-beta
                            decimalPlaces = 9;
                        }
                        if (tokenAddress && decimalPlaces) {
                            const associatedTokenFrom = await getAssociatedTokenAddress(
                                tokenAddress,
                                publicKey
                            );
                            const fromAccount = await getAccount(connection, associatedTokenFrom);
                            setTokenBalance(((parseFloat(fromAccount.amount.toString()) / 10 ** decimalPlaces).toFixed(4)).toString());
                        }
                    }
                } catch (error) {
                    if (error == 'TokenAccountNotFoundError') {
                        setTokenBalance('0');
                    }
                }
            }
        }

        fetchTokenAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, connection]);

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            if (!connection || !publicKey) {
                return toast.error(`${t('walletConnectError')}`);
            }

            setIsSubmitting(true);
            setSigValidation(false);

            const recipientPubKey = new PublicKey('Cq6JPmEspG6oNcUC47WHuEJWU1K4knsLzHYHSfvpnDHk');
            let tokenAddress: PublicKey;
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

                const tokenAddresses: { [key: string]: PublicKey } = {
                    // 'USDC': new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC token address on solana mainnet-beta
                    'USDC': new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // USDC token address on solana devnet
                    // 'USDT': new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'), // USDT token address on solana mainnet-beta
                    'USDT': new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS'), //USDT token address on solana devnet
                    'EURC': new PublicKey('HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'),
                    'JUP': new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'),
                    'PYTH': new PublicKey('HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'),
                    'RAY': new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'),
                    'BLZE': new PublicKey('BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA'),
                    'tBTC': new PublicKey('6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU'),
                    'mSOL': new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
                    'JTO': new PublicKey('jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL')
                };

                tokenAddress = tokenAddresses[order.asset_symbol];

                if (tokenAddress && signTransaction) {
                    const transactionInstructions: TransactionInstruction[] = [];
                    const associatedTokenFrom = await getAssociatedTokenAddress(tokenAddress, publicKey);
                    const fromAccount = await getAccount(connection, associatedTokenFrom);
                    const associatedTokenTo = await getAssociatedTokenAddress(tokenAddress, recipientPubKey);

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

            if (sig && wallet.publicKey) {
                setSigValidation(true);

                const timeout = 8000;
                const interval = 1000;
                const start = Date.now();

                const polling = setInterval(async () => {
                    if (!sig || !wallet.publicKey) {
                        clearInterval(polling);
                        toast.error(`${t('transactionFailed')}`);
                        setSigValidation(false);
                        setIsSubmitting(false);
                        return;
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
                            toast.success(`${t('lendingSuccess')}`);
                        } else {
                            toast.error(`${t('lendingError')}`);
                        }
                        setSigValidation(false);
                        setIsSubmitting(false);
                    } else if (Date.now() - start > timeout) {
                        clearInterval(polling);
                        setSigValidation(false);
                        setIsSubmitting(false);
                        toast.error(`${t('invalidTransaction')}`);
                    }
                }, interval);
            } else {
                setSigValidation(false);
                setIsSubmitting(false);
            }
        } catch (error) {
            if (error == 'TokenAccountNotFoundError') {
                toast.error(`${t('insufficientBalance')}`);
            } else {
                toast.error(`${t('lendingError')}`);
            }
            setSigValidation(false);
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={!publicKey}>
                    {publicKey ? `${t('lend')}` : `${t('connectWallet')}`}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <div>{t('lendToken')}</div>
                    </DialogTitle>
                    <DialogDescription>
                        {t('lendDialogDesc')}
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
                                        <FormLabel>{t('lendingAmount')} ({t('in')} {order.asset_symbol})</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={`${t('enterThe')} ${order.asset_symbol} ${t('youWantTo')} `} />
                                        </FormControl>
                                        <FormDescription>
                                            {t('enterAmount')}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex flex-col space-y-1 pt-2'>
                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>{t('currentPrice')}</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                    {t('currentPriceUSD')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>$ {order.asset_price}</div>
                                </div>
                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>{t('assetYield')}</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                    {t('apy')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>{order.asset_yield}</div>
                                </div>
                                <div className='flex flex-row items-center justify-between hover:bg-accent hover:rounded px-2'>
                                    <div className='flex flex-row items-center space-x-1'>
                                        <h1 className='font-semibold tracking-wide'>{t('tokenBalance')}</h1>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                    <span><Info className='h-4 w-4 ml-1 cursor-pointer' /></span>
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                                    {t('tokenBalanceDesc')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div>{tokenBalance} {order.asset_symbol}</div>
                                </div>
                            </div>

                            {isSubmitting && !sigValidation &&
                                <div className={`text-center px-2 ${isSubmitting ? 'animate-fade-in-up-short' : ''}`}>
                                    {t('transactionInProgress')}
                                </div>
                            }

                            {sigValidation &&
                                <div className={`text-center px-2 ${sigValidation ? 'animate-fade-in-up-short' : ''}`}>
                                    {t('validatingTransaction')}
                                </div>
                            }

                            {parseFloat(tokenBalance) >= parseFloat(form.watch('lending_amount')) && parseFloat(tokenBalance) > 0 ? (
                                <Button type='submit' className='w-full mt-4' disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                                    {isSubmitting ? `${t('lending')}` : `${t('lend')}`}
                                </Button>
                            ) : (
                                <Button className='w-full mt-4' disabled>
                                    {parseFloat(tokenBalance) <= 0 || parseFloat(tokenBalance) < parseFloat(form.watch('lending_amount')) ? `${t('insufficientBalanceText')}` : `${t('lend')}`}
                                </Button>
                            )}
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
