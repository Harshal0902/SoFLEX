import React, { useState, useEffect } from 'react'
import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import { createTransferInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, Connection, TransactionInstruction, SystemProgram } from '@solana/web3.js'
import { updateUserBorrowStatus } from '@/actions/dbActions'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Loader2, Info, ExternalLink } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Image from 'next/image'

export type LoanDataType = {
    borrow_id: string;
    borrow_user_address: string;
    borrowing_amount: string;
    borrowing_total: string;
    borrowing_due_by: Date | string;
    borrowing_status: 'Active' | 'Repaid' | 'Defaulted' | 'Pending' | 'Cancelled' | 'Expired' | 'Closed';
    borrowing_interest_rate: string;
    borrowing_duration: string;
    borrowing_submitted_at: Date | string;
    borrowing_collateralization_assets: string;
    borrowing_token: string;
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

export default function LoanRepay({ row, onTrigger }: { row: { original: LoanDataType }, onTrigger: () => void }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tokenBalance, setTokenBalance] = useState<string>('0');
    const [sigValidation, setSigValidation] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<boolean>(false);

    const order = row.original;
    const { publicKey, sendTransaction, signTransaction } = useWallet();
    const { connection } = useConnection();
    const wallet = useWallet();
    const t = useTranslations('PortfolioPage');

    useEffect(() => {
        const fetchTokenAccounts = async () => {
            if (open === true && publicKey) {
                try {
                    let tokenAddress;
                    let decimalPlaces;
                    if (order.borrowing_token === 'SOL') {
                        const walletAddress = publicKey;
                        const balance = await connection.getBalance(walletAddress);
                        setTokenBalance(((balance / 10 ** 9).toFixed(4)).toString());
                    } else {
                        if (order.borrowing_token === 'USDC') {
                            // tokenAddress = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC token address on solana mainnet-beta
                            tokenAddress = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC token address on solana devnet
                            decimalPlaces = 6;
                        } else if (order.borrowing_token === 'USDT') {
                            // tokenAddress = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); // USDT token address on solana mainnet-beta
                            tokenAddress = new PublicKey('EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS'); // USDT token address on solana devnet
                            decimalPlaces = 6;
                        } else if (order.borrowing_token === 'EURC') {
                            // tokenAddress = new PublicKey('HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'); // EURC token address on solana mainnet-beta
                            tokenAddress = new PublicKey('HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr'); // EURC token address on solana devnet
                            decimalPlaces = 6;
                        } else if (order.borrowing_token === 'JUP') {
                            tokenAddress = new PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'); // JUP token address on solana mainnet-beta
                            decimalPlaces = 6;
                        } else if (order.borrowing_token === 'PYTH') {
                            tokenAddress = new PublicKey('HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'); // PYTH token address on solana mainnet-beta
                            decimalPlaces = 6;
                        } else if (order.borrowing_token === 'RAY') {
                            tokenAddress = new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'); // RAY token address on solana mainnet-beta
                            decimalPlaces = 6;
                        } else if (order.borrowing_token === 'BLZE') {
                            tokenAddress = new PublicKey('BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA'); // BLZE token address on solana mainnet-beta
                            decimalPlaces = 9;
                        } else if (order.borrowing_token === 'tBTC') {
                            tokenAddress = new PublicKey('6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU'); // tBTC token address on solana mainnet-beta
                            decimalPlaces = 8;
                        } else if (order.borrowing_token === 'mSOL') {
                            tokenAddress = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'); // mSOLO token address on solana mainnet-beta
                            decimalPlaces = 9;
                        } else if (order.borrowing_token === 'JTO') {
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

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const addOrdinalSuffix = (day: number): string => {
            if (day >= 11 && day <= 13) {
                return day + 'th';
            }
            switch (day % 10) {
                case 1: return day + 'st';
                case 2: return day + 'nd';
                case 3: return day + 'rd';
                default: return day + 'th';
            }
        };
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const formattedDay = addOrdinalSuffix(day);
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedDate = `${formattedDay} ${month} ${year} at ${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;

        return formattedDate;
    };

    async function onRepay() {
        try {
            if (!connection || !publicKey) {
                return toast.error(`${t('walletNotConnected')}`);
            }

            setIsSubmitting(true);
            setSigValidation(false);

            const userAddress = new PublicKey(order.borrow_user_address);
            const recipientPubKey = new PublicKey('Cq6JPmEspG6oNcUC47WHuEJWU1K4knsLzHYHSfvpnDHk');
            let tokenAddress: PublicKey;
            let sig: string | undefined;

            if (order.borrowing_token === 'SOL') {
                let amount = LAMPORTS_PER_SOL * parseFloat(order.borrowing_total);
                const transaction = new Transaction();
                const sendSolInstruction = SystemProgram.transfer({
                    fromPubkey: userAddress,
                    toPubkey: recipientPubKey,
                    lamports: amount
                });
                transaction.add(sendSolInstruction);
                sig = await sendTransaction(transaction, connection);
            } else {
                let amount = 1000000 * parseFloat(order.borrowing_total);
                amount = parseInt(amount.toFixed(6));

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

                tokenAddress = tokenAddresses[order.borrowing_token];

                if (tokenAddress && signTransaction) {
                    const transactionInstructions: TransactionInstruction[] = [];
                    const associatedTokenFrom = await getAssociatedTokenAddress(tokenAddress, userAddress);
                    const fromAccount = await getAccount(connection, associatedTokenFrom);
                    const associatedTokenTo = await getAssociatedTokenAddress(tokenAddress, recipientPubKey);

                    if (!(await connection.getAccountInfo(associatedTokenTo))) {
                        transactionInstructions.push(
                            createAssociatedTokenAccountInstruction(
                                userAddress,
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
                    if (!sig) {
                        clearInterval(polling);
                        toast.error(`${t('transactionFailed')}`);
                        setSigValidation(false);
                        setIsSubmitting(false);
                        return;
                    }

                    const transaction = await connection.getParsedTransaction(sig);

                    if (transaction?.meta?.err === null) {
                        clearInterval(polling);
                        const result = await updateUserBorrowStatus({
                            borrowId: order.borrow_id,
                            borrowStatus: 'Repaid',
                            transactionSignature: sig
                        });

                        if (result === 'User borrow status updated') {
                            setOpen(false);
                            setTrigger(true);
                            setSigValidation(true);
                            onTrigger();
                            toast.success(`${t('loanRepaySuccess')}`);
                        } else {
                            toast.error(`${t('loanUpdateError')}`);
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
                setIsSubmitting(false);
                setSigValidation(false);
            }
        } catch (error) {
            if (error == 'TokenAccountNotFoundError') {
                toast.error(`${t('insufficientBalance')}`);
            } else if (error == 'WalletSendTransactionError: invalid account') {
                toast.error(`${t('invalidWallet')}`);
            } else {
                toast.error(`${t('repayLoanError')}`);
            }
            setSigValidation(false);
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    {t('loanDetails')}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle>
                        {t('repayLoan')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('dialogDesc')}
                    </DialogDescription>
                </DialogHeader>

                <div className='w-full flex flex-col space-y-2 max-h-[45vh] md:max-h-[60vh] overflow-y-auto'>
                    <h1 className='flex flex-row flex-wrap space-x-2 px-2'>{t('loanDetailsId')}: <span className='block md:hidden font-semibold tracking-wide'>{order.borrow_id.slice(0, 8)}...{order.borrow_id.slice(-8)}</span> <span className='hidden md:block font-semibold tracking-wide'>{order.borrow_id}</span></h1>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('borrowAmount')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('amountBorrowed')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_amount}</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('borrowedAt')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('borrowedDateAndTime')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{formatDate(`${order.borrowing_submitted_at}`)}</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('interestRate')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('interestRateDesc')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_interest_rate} %</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('repaymentTotal')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('totalAmountToRepay')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_total}</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('borrowDuration')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('durationOfBorrowing')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_duration}</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('dueBy')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('deadline')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{formatDate(`${order.borrowing_due_by}`)}</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between hover:bg-accent hover:rounded px-2'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>{t('borrowStatus')}</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center text-wrap'>
                                        {t('statusOfBorrowing')}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_status}</div>
                    </div>

                    <div>
                        <Accordion type='multiple' className='px-2'>
                            <AccordionItem value='collateral'>
                                <AccordionTrigger className='hover:no-underline text-left font-medium tracking-wide'>{t('selectedCollateral')}</AccordionTrigger>
                                <AccordionContent>
                                    <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                        {JSON.parse(order.borrowing_collateralization_assets).map((asset: { image_uri: string; name: string; external_url: string; mint: string; floorprice: string }, index: React.Key) => (
                                            <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
                                                <div className='flex items-center justify-center'>
                                                    <Image src={asset.image_uri} width={180} height={40} alt={asset.image_uri} className='rounded' />
                                                </div>
                                                <p className='text-center'>{asset.name}</p>
                                                <div className='flex flex-row items-center justify-center space-x-2'>
                                                    <a href={asset.external_url} target='_blank' className='text-primary'>{t('viewCollection')}</a>
                                                    <ExternalLink className='h-4 w-4' />
                                                </div>
                                                <div className='flex flex-row items-center justify-center space-x-2'>
                                                    <a href={`https://solscan.io/token/${asset.mint}`} target='_blank' className='text-primary'>{t('viewOnSolscan')}</a>
                                                    <ExternalLink className='h-4 w-4' />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {isSubmitting && !sigValidation &&
                        <div className={`text-center px-2 ${isSubmitting && 'animate-fade-in-up-short'}`}>
                            {t('transactionInProgress')}
                        </div>
                    }

                    {sigValidation &&
                        <div className={`text-center px-2 ${sigValidation && 'animate-fade-in-up-short'}`}>
                            {t('validatingTransaction')}
                        </div>
                    }

                    {parseFloat(tokenBalance) >= parseFloat(order.borrowing_total) && parseFloat(tokenBalance) > 0 && order.borrowing_status || order.borrowing_status !== 'Active' ? (
                        <Button className='mx-2' disabled={order.borrowing_status !== 'Active' || isSubmitting} onClick={onRepay}>
                            {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                            {order.borrowing_status === 'Active' ? 'Repay' : order.borrowing_status}
                        </Button>
                    ) : (
                        <Button className='w-full mt-4' disabled>
                            {parseFloat(tokenBalance) <= 0 || parseFloat(tokenBalance) < parseFloat(order.borrowing_total) ? `${t('insufficientBalanceMsg')}` : order.borrowing_status === 'Active' ? 'Repay' : order.borrowing_status}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
