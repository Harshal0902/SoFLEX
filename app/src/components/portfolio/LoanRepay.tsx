import React, { useState } from 'react'
import * as web3 from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { updateUserBorrowStatus } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Loader2, Info, ExternalLink } from 'lucide-react'
import InfoButton from '@/components/InfoButton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Image from 'next/image'

export type LoanDataType = {
    borrow_id: string;
    borrowing_amount: string;
    borrowing_total: string;
    borrowing_due_by: Date;
    borrowing_status: 'Active' | 'Repaid' | 'Defaulted' | 'Pending' | 'Cancelled' | 'Expired' | 'Closed';
    borrowing_interest_rate: string;
    borrowing_duration: string;
    borrowing_submitted_at: Date;
    borrowing_collateralization_assets: string;
    borrowing_token: string;
}

export default function LoanRepay({ row }: { row: { original: LoanDataType } }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const order = row.original;
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const wallet = useWallet();

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
                return;
            }

            setIsSubmitting(true);

            let sig;

            const recipientPubKey = new web3.PublicKey('Cq6JPmEspG6oNcUC47WHuEJWU1K4knsLzHYHSfvpnDHk');
            let amount;
            let tokenAddress;

            if (order.borrowing_token === 'SOL') {
                amount = LAMPORTS_PER_SOL * parseFloat(order.borrowing_amount);
                const transaction = new web3.Transaction();
                const sendSolInstruction = web3.SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubKey,
                    lamports: amount
                });
                transaction.add(sendSolInstruction);
                sig = await sendTransaction(transaction, connection);
            } else {
                amount = parseFloat(order.borrowing_amount);
                if (order.borrowing_token === 'USDC') {
                    tokenAddress = new web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
                } else if (order.borrowing_token === 'USDT') {
                    tokenAddress = new web3.PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
                } else if (order.borrowing_token === 'JUP') {
                    tokenAddress = new web3.PublicKey('JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN');
                } else if (order.borrowing_token === 'PYTH') {
                    tokenAddress = new web3.PublicKey('HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3');
                } else if (order.borrowing_token === 'JTO') {
                    tokenAddress = new web3.PublicKey('jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL');
                } else if (order.borrowing_token === 'RAY') {
                    tokenAddress = new web3.PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R');
                } else if (order.borrowing_token === 'BLZE') {
                    tokenAddress = new web3.PublicKey('BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA');
                } else if (order.borrowing_token === 'tBTC') {
                    tokenAddress = new web3.PublicKey('6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU');
                } else if (order.borrowing_token === 'mSOL') {
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
                const data = await updateUserBorrowStatus({
                    walletAddress: wallet.publicKey?.toString(),
                    borrowId: order.borrow_id,
                    borrowStatus: 'Repaid',
                    transactionSignature: sig
                });

                if (data) {
                    setOpen(false);
                    toast.success('Loan repaid successfully. Refreshing...');
                    window.location.reload();
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
                <Button className='text-white'>
                    Loan Details
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-[90vw] md:max-w-[40vw]'>
                <DialogHeader>
                    <DialogTitle className='flex flex-row space-x-1 items-center'>
                        <h1>Repay Loan</h1>
                        <InfoButton />
                    </DialogTitle>
                    <DialogDescription>
                        Repay your loan with the amount you borrowed and the interest rate.
                    </DialogDescription>
                </DialogHeader>

                <div className='w-full flex flex-col space-y-2 max-h-[45vh] md:max-h-[60vh] overflow-y-auto px-2'>
                    <h1 className='flex flex-row flex-wrap space-x-2'>Loan details for Loan ID: <span className='block md:hidden font-semibold tracking-wide'>{order.borrow_id.slice(0, 8)}...{order.borrow_id.slice(-8)}</span> <span className='hidden md:block font-semibold tracking-wide'>{order.borrow_id}</span></h1>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Borrow Amount</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        The amount you borrowed.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_amount}</div>
                    </div>

                    <div className='flex flex-row flex-wrap items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Borrowed at</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        The date and time you borrowed the amount.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{formatDate(`${order.borrowing_submitted_at}`)}</div>
                    </div>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Interest Rate</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        The interest rate for the loan.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_interest_rate}</div>
                    </div>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Repayment Total</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        Total Repayment Amount (Borrowed Amount + Interest).
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_total}</div>
                    </div>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Borrow Duration</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        The duration of the loan.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_duration}</div>
                    </div>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Due By</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        Deadline for repayment.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{formatDate(`${order.borrowing_due_by}`)}</div>
                    </div>

                    <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <h1 className='font-semibold tracking-wide'>Borrow Status</h1>
                            <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <span><Info className='h-4 w-4 ml-0.5 cursor-pointer hidden md:block' /></span>
                                    </TooltipTrigger>
                                    <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                        The status of your loan.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div>{order.borrowing_status}</div>
                    </div>

                    <div>
                        <Accordion type='multiple'>
                            <AccordionItem value='collateral'>
                                <AccordionTrigger className='hover:no-underline text-left font-medium tracking-wide'>Selected NFT(s) and cNFT(s) for Collateral</AccordionTrigger>
                                <AccordionContent>
                                    <div className='flex flex-row space-x-2 flex-wrap justify-evenly'>
                                        {JSON.parse(order.borrowing_collateralization_assets).map((asset: { image_uri: string; name: string; external_url: string; mint: string; floorprice: string }, index: React.Key) => (
                                            <div className='border rounded mt-4 p-2 flex flex-col space-y-2' key={index}>
                                                <div className='flex items-center justify-center'>
                                                    <Image src={asset.image_uri} width={180} height={40} alt={asset.image_uri} className='rounded' />
                                                </div>
                                                <p className='text-center'>{asset.name}</p>
                                                <div className='flex flex-row items-center justify-center space-x-2'>
                                                    <a href={asset.external_url} target='_blank' className='text-primary'>View collection</a>
                                                    <ExternalLink className='h-4 w-4' />
                                                </div>
                                                <div className='flex flex-row items-center justify-center space-x-2'>
                                                    <a href={`https://solscan.io/token/${asset.mint}`} target='_blank' className='text-primary'>View on Solscan</a>
                                                    <ExternalLink className='h-4 w-4' />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <Button className='text-white' disabled={order.borrowing_status !== 'Active' || isSubmitting} onClick={onRepay}>
                        {isSubmitting && <Loader2 className='animate-spin mr-2' size={15} />}
                        {order.borrowing_status === 'Active' ? 'Repay' : order.borrowing_status}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
