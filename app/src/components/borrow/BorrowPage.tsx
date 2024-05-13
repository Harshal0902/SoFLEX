"use client"

import React, { useState, useEffect } from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import DeFiBorrowing from './DeFiBorrow/DeFiBorrowing'
import P2PBorrowing from './P2PBorrow/P2PBorrowing'

type Tab = 'defi' | 'p2p';

export default function BorrowPage() {
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
            <div className='mx-auto my-4'>
                <h1 className='text-2xl font-bold text-center lg:text-4xl animate-fade-bottom-up'>
                    Explore Borrowing Options on SoFLEX
                </h1>
                <p className='mt-5 text-gray-600 sm:text-xl text-center md:px-[10vw]'>
                    Discover flexible borrowing solutions tailored to your needs on SoFLEX. Access decentralized finance (DeFi) borrowing for peer-to-pool opportunities or dive into peer-to-peer (P2P) borrowing. Whether you&apos;re seeking direct lending from peers or exploring DeFi protocols, SoFLEX offers a seamless experience for accessing funds against your compressed NFTs and synthetic assets within the Solana ecosystem.                </p>
            </div>

            <div className='grid place-items-center'>
                <div className='flex flex-row items-center justify-center bg-accent rounded-full py-2 px-8 md:px-12 space-x-4 md:space-x-12'>
                    <div onClick={() => handleTabClick('defi')} className={`px-4 py-1 rounded-full cursor-pointer text-center ${activeTab === 'defi' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>DeFi Borrowing</div>
                    <div onClick={() => handleTabClick('p2p')} className={`px-4 py-1 rounded-full cursor-pointer text-center ${activeTab === 'p2p' ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>P2P Borrowing</div>
                </div>
            </div>

            {activeTab === 'defi' && <DeFiBorrowing />}
            {activeTab === 'p2p' && <P2PBorrowing />}

        </MaxWidthWrapper>
    )
}
