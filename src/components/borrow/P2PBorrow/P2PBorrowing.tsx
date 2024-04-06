"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import Image from 'next/image'

export default function P2PBorrowing() {  
    return (
        <div className='py-2'>
            <div className='flex w-full items-center'>
                <div className='w-10 z-20 pl-1 text-center pointer-events-none flex items-center justify-center'><Search height={20} width={20} /></div>
                <Input className='w-full md:max-w-md -mx-10 pl-10 pr-8 py-2 z-10' placeholder='Search for NFTs' />
                <div className='ml-2 z-20 cursor-pointer'>
                    <X />
                </div>
            </div>

            <div className='flex flex-col space-y-2 py-2'>
                <div className='flex flex-row items-center justify-between border-2 rounded-xl py-2 px-4'>
                    <Image src='https://arweave.net/nhReCVRMsqkXTC695BcR2s2OFnWHQzdiqpP5OCw1X54?ext=gif' alt='img' width={80} height={200} className='rounded' />
                    <h1>Best Offer</h1>
                    <h1>Floor</h1>
                    <h1>LTV Ratio</h1>
                    <h1>Duration</h1>
                    <h1>Intrest Rate</h1>
                </div>
            </div>
        </div>
    )
}
