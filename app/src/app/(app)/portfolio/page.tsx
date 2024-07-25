"use client"

import React, { Suspense } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Preloader from '@/components/Preloader'
import Portfolio from '@/components/portfolio/Portfolio'
import InformationCard from '@/components/InformationCard'

export default function Page() {
    const wallet = useWallet();

    return (
        <MaxWidthWrapper>
            {wallet.publicKey ? (
                <Suspense fallback={<Preloader />}>
                    <Portfolio walletAddress={wallet.publicKey.toString()} />
                </Suspense>
            ) : (
                <Suspense fallback={<Preloader />}>
                    <InformationCard message='Connect your wallet view the portfolio' />
                </Suspense>
            )}
        </MaxWidthWrapper>
    )
}
