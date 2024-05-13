"use client"

import React, { useState, useEffect } from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import DeFiLending from './DeFiLend/DeFiLending'
import P2PLending from './P2PLend/P2PLending'

type Tab = 'defi' | 'p2p';

export default function LendPage() {
    const [activeTab, setActiveTab] = useState<Tab>('defi');

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const roleParam = searchParams.get('model') as Tab | null;
        if (roleParam) {
            setActiveTab(roleParam);
        }
    }, [searchParams]);

    const handleTabClick = (tab: Tab) => {
        setActiveTab(tab);
        const search = tab;
        const query = search ? `${search}` : '';
        router.push(`${pathname}?model=${query}`);
    };

    return (
        <MaxWidthWrapper>
            <div className='mx-auto mb-4'>
                <h1 className='text-2xl font-bold text-center lg:text-4xl animate-fade-bottom-up'>
                    Unlock Lending Opportunities on SoFLEX
                </h1>
                <p className='mt-5 text-gray-600 sm:text-xl text-center md:px-[10vw]'>
                    Unlock opportunities to earn yields by lending your assets on SoFLEX. Engage in decentralized finance (DeFi) lending for peer-to-pool engagements or participate in peer-to-peer (P2P) lending. Whether you&apos;re interested in DeFi protocols or leveraging direct lending to peers, SoFLEX provides a secure platform for maximizing returns on your assets within the Solana ecosystem.                </p>
            </div>

            <div className='grid place-items-center'>
                <div className='flex flex-row items-center justify-center bg-accent rounded-full py-2 px-8 md:px-12 space-x-4 md:space-x-12'>
                    <div onClick={() => handleTabClick('defi')} className={`px-4 py-1 rounded-full cursor-pointer text-center ${activeTab === 'defi' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>DeFi Lending</div>
                    <div onClick={() => handleTabClick('p2p')} className={`px-4 py-1 rounded-full cursor-pointer text-center ${activeTab === 'p2p' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>P2P Lending</div>
                </div>
            </div>

            {activeTab === 'defi' && <DeFiLending />}
            {activeTab === 'p2p' && <P2PLending />}

        </MaxWidthWrapper>
    )
}
