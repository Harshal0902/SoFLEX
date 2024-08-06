"use client"

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslations } from 'next-intl'
import { updateUserCreditScore } from '@/actions/dbActions'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Transaction {
    actions: {
        info: {
            sender: string;
        };
    }[];
}

export default function CheckCreditScorePage({ walletAddress }: { walletAddress: string }) {
    const [loading, setLoading] = useState(false);
    const [creditScore, setCreditScore] = useState<number | null>(null);

    const wallet = useWallet();
    const t = useTranslations('CheckCreditScorePage');

    const NEXT_PUBLIC_SHYFTAPIKey = process.env.NEXT_PUBLIC_SHYFTAPI!;

    const knowTransactionHistory = async () => {
        setLoading(true);
        try {
            const myHeaders = new Headers();
            myHeaders.append('x-api-key', NEXT_PUBLIC_SHYFTAPIKey);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            const response = await fetch(
                `https://api.shyft.to/sol/v1/transaction/history?network=mainnet-beta&tx_num=2&account=${wallet.publicKey?.toString()}&enable_raw=true`,
                requestOptions
            );

            const result = await response.json();

            let sentTransactions = 0;
            let receivedTransactions = 0;

            result.result.forEach((transaction: Transaction) => {
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
            toast.error(`${t('transactionHistoryError')}`);
        } finally {
            setLoading(false);
        }
    };

    const calculateCreditScore = async (transactionHistoryScore: string) => {
        let newTransactionHistoryScore;
        if (transactionHistoryScore === 'NaN') {
            newTransactionHistoryScore = '0';
        } else {
            newTransactionHistoryScore = transactionHistoryScore;
        }
        const creditScoreValue = 0.55 * 80 + 0.33 * (parseFloat(newTransactionHistoryScore) + 20) + 30;
        setCreditScore(parseFloat(creditScoreValue.toFixed(2)));
        const result = await updateUserCreditScore({
            walletAddress: walletAddress,
            creditScore: parseFloat(creditScoreValue.toFixed(2)),
        });
        if (result === 'Error updating user credit score') {
            toast.error(`${t('updateCreditScoreError')}`);
        }
    };

    return (
        <Card className='my-4'>
            <CardHeader>
                <div>
                    <div className='text-center font-medium text-2xl md:text-4xl'>{t('title')}</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col space-y-2'>
                    <div className='flex items-center justify-center'>
                        <Button className='px-8' onClick={knowTransactionHistory} disabled={loading}>
                            {loading && <Loader2 className='animate-spin mr-2' size={15} />}
                            {loading ? `${t('calculating')}` : `${t('checkCreditScore')}`}
                        </Button>
                    </div>
                    {creditScore && (
                        <h1 className='text-center pt-2 font-semibold tracking-wider'>{t('yourCreditScore')}: {isNaN(creditScore) ? '36.48' : creditScore}</h1>
                    )}
                    <div className='py-2'>
                        <p className='font-semibold'>{t('formulaUsed')}</p>
                        <ul>
                            <p>{t('where')}:</p>
                            <li className='list-disc ml-5'>{t('formula1')}</li>
                            <li className='list-disc ml-5'>{t('formula2')}</li>
                            <li className='list-disc ml-5'>{t('formula3')}</li>
                            <li className='list-disc ml-5'>{t('formula4')}</li>
                            <li className='list-disc ml-5'>{t('formula5')}</li>
                            <li className='list-disc ml-5'>{t('formula6')}</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
