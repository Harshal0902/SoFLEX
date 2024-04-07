"use client"

import React, { useState, useEffect } from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import P2PLending from './P2PLend/P2PLending'
import DeFiLending from './DeFiLend/DeFiLending'

type Tab = 'p2p' | 'defi';

export default function LendPage() {
    const [activeTab, setActiveTab] = useState<Tab>('p2p');

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
                    Unlock opportunities to earn yields by lending your assets on SoFLEX. Engage in peer-to-peer (P2P) lending or participate in decentralized finance (DeFi) lending for peer-to-pool engagements. Whether you&apos;re interested in direct lending to peers or leveraging DeFi protocols, SoFLEX provides a secure platform for maximizing returns on your assets within the Solana ecosystem.
                </p>
            </div>

            {/* <div className='py-4'>
                <h1 className='text-2xl font-bold lg:text-4xl animate-fade-bottom-up'>Unlock Lending Opportunities on SoFLEX</h1>
                <p className='pt-4 text-gray-600 sm:text-xl md:max-w-[75vw]'>Unlock opportunities to earn yields by lending your assets on SoFLEX. Engage in peer-to-peer (P2P) lending or participate in decentralized finance (DeFi) lending for peer-to-pool engagements. Whether you&apos;re interested in direct lending to peers or leveraging DeFi protocols, SoFLEX provides a secure platform for maximizing returns on your assets within the Solana ecosystem.</p>
            </div> */}

            <div className='grid place-items-center'>
                <div className='flex flex-row items-center justify-center bg-accent rounded-full py-2 px-8 md:px-12 space-x-4 md:space-x-12'>
                    <div onClick={() => handleTabClick('p2p')} className={`px-4 py-1 rounded-full cursor-pointer text-center ${activeTab === 'p2p' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>P2P Lending</div>
                    <div onClick={() => handleTabClick('defi')} className={`px-4 py-1 rounded-full cursor-pointer text-center ${activeTab === 'defi' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>DeFi Lending</div>
                </div>
            </div>

            {activeTab === 'p2p' && <P2PLending />}
            {activeTab === 'defi' && <DeFiLending />}

        </MaxWidthWrapper>
    )
}
