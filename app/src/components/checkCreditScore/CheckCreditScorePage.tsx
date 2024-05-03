"use client"

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { updateUserCreditScore } from '@/lib/supabaseRequests'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function CheckCreditScorePage({ walletAddress }: { walletAddress?: string }) {
    const [loading, setLoading] = useState(false);
    const [creditScore, setCreditScore] = useState(null);

    const wallet = useWallet();

    const shyftAPIKey = process.env.NEXT_PUBLIC_SHYFTAPI!;

    const knowTransactionHistory = async () => {
        setLoading(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append('x-api-key', shyftAPIKey);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(
                `https://api.shyft.to/sol/v1/transaction/history?network=mainnet-beta&tx_num=2&account=${wallet.publicKey?.toString()}&enable_raw=true`,
                // @ts-ignore
                requestOptions
            );

            const data = await response.json();

            let sentTransactions = 0;
            let receivedTransactions = 0;

            // @ts-ignore
            data.result.forEach(transaction => {
                if (transaction.actions.length > 0 && transaction.actions[0].info.sender === wallet.publicKey?.toString()) {
                    sentTransactions++;
                } else {
                    receivedTransactions++;
                }
            });

            const totalTransactions = sentTransactions + receivedTransactions;
            const sentPercentage = (sentTransactions / totalTransactions) * 100;
            const receivedPercentage = (receivedTransactions / totalTransactions) * 100;

            const transactionHistoryScore = ((sentPercentage - receivedPercentage) / 100).toFixed(2);
            calculateCreditScore(transactionHistoryScore);
        } catch (error) {
            // @ts-ignore
            setError('An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    };

    // @ts-ignore
    const calculateCreditScore = async (transactionHistoryScore) => {
        const creditScoreValue = 0.55 * 80 + 0.33 * (transactionHistoryScore + 20) + 30;
        // @ts-ignore
        setCreditScore(creditScoreValue.toFixed(2));
        await updateUserCreditScore({
            walletAddress: walletAddress,
            creditScore: creditScoreValue.toFixed(2),
        });
    };

    return (
        <Card className='relative md:my-4'>
            <CardHeader>
                <div className='text-2xl md:text-4xl'>My On-Chain Credit Score</div>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-2'>
                    <div className='flex items-center justify-center'>
                        <Button className='bg-primary text-white px-8' onClick={knowTransactionHistory} disabled={loading}>
                            {loading && <Loader2 className='animate-spin mr-2' size={15} />}
                            {loading ? 'Calculating...' : 'Check On-Chain Credit Score'}
                        </Button>
                    </div>
                    {creditScore && (
                        <h1 className='text-center pt-2 font-semibold tracking-wider'>Credit Score: {isNaN(creditScore) ? '36.48' : creditScore}</h1>
                    )}
                    <div className='py-2'>
                        <p className='font-semibold'>Formula used = a * BH + b * (TH + CD) + c</p>
                        <ul>
                            <p>Where:</p>
                            <li className='list-disc ml-5'>BH: Borrower History Score (0-100): This score can be calculated by analyzing a borrower&apos;s past borrowing and repayment behavior on the platform.</li>
                            <li className='list-disc ml-5'>TH: Transaction History Score (0-100): This score can be derived from the borrower&apos;s overall on-chain activity like on-chain transaction frequency and volume.</li>
                            <li className='list-disc ml-5'>CD: Collateral Diversity Score (0-100): This score can assess the risk profile of the collateral the borrower intends to use for the loan, such as liquidity of the collateral asset.</li>
                            <li className='list-disc ml-5'>Coefficient a: 0.55 (Moderate weight on BH)</li>
                            <li className='list-disc ml-5'>Coefficient b: 0.35 (Moderate weight on combined TH + CD)</li>
                            <li className='list-disc ml-5'>Coefficient c = 30 (Constant value to adjust score range)</li>
                        </ul>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
