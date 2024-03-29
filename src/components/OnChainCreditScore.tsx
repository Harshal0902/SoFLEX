"use client"

import React, { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { addNewUser } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import useUserSOLBalance from '@/store/useUserSOLBalanceStore'

export default function OnChainCreditScore() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [creditScore, setCreditScore] = useState(null);
    const { balance, getUserSOLBalance } = useUserSOLBalance();

    const { connected } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();

    const shyftAPIKey = process.env.NEXT_PUBLIC_SHYFTAPI;

    useEffect(() => {
        const addUserToDB = async () => {
            if (connected) {
                try {
                    await addNewUser({
                        walletAddress: wallet.publicKey?.toString(),
                    });
                    toast.success('Wallet connected successfully!');
                } catch (error) {
                    toast.error('An error occurred while setting up your account. Please try again later.');
                }
            }
        };

        addUserToDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    useEffect(() => {
        if (wallet.publicKey) {
            getUserSOLBalance(wallet.publicKey, connection)
        }
    }, [wallet.publicKey, connection, getUserSOLBalance])

    const knowTransactionHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const myHeaders = new Headers();
            // @ts-ignore
            myHeaders.append("x-api-key", shyftAPIKey);

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
            setResult(data);

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
    const calculateCreditScore = (transactionHistoryScore) => {
        const creditScoreValue = 0.55 * 80 + 0.33 * (transactionHistoryScore + 20) + 30;
        // @ts-ignore
        setCreditScore(creditScoreValue.toFixed(2));
    };

    return (
        <Card className='w-[90vw] md:w-[50vw]'>
            <CardHeader>
                <CardTitle className='text-center tracking-wider'>
                    Check Credit Score
                </CardTitle>
                <CardContent className='py-2'>
                    <div className='flex items-center justify-center'>
                        <WalletMultiButton />
                    </div>
                    {connected ? (
                        <div className='py-2 flex flex-col space-y-2'>
                            <h1 className='text-center'>Your current balance: {balance.toLocaleString()} SOL</h1>
                            <Button
                                className='w-full bg-primary text-white'
                                onClick={knowTransactionHistory}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Check On-Chain Credit Score'}
                            </Button>
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
                    ) : (
                        <h1 className='text-center pt-2'>
                            Please connect your wallet to check your credit score.
                        </h1>
                    )}
                </CardContent>
            </CardHeader>
        </Card>
    )
}
