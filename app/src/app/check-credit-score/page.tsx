"use client"

import React, { Suspense } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Loading from '@/components/Loading'
import CheckCreditScorePage from '@/components/checkCreditScore/CheckCreditScorePage'
import InformationCard from '@/components/InformationCard'

export default function Page() {
    const wallet = useWallet();

    return (
        <MaxWidthWrapper>
            {wallet.publicKey ? (
                <Suspense fallback={<Loading />}>
                    <CheckCreditScorePage walletAddress={wallet.publicKey.toString()} />
                </Suspense>
            ) : (
                <Suspense fallback={<Loading />}>
                    <InformationCard message='Connect your wallet view your On-Chain Credit Score' />
                </Suspense>
            )}
        </MaxWidthWrapper>
    )
}
