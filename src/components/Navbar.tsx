"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from './ui/button'
import ResponsiveNavbar from './ResponsiveNavbar'
import ModeToggle from './ModeToggle'
import { Bell, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import Notifications from './Notifications'

export default function Navbar() {
    const { connected } = useWallet();
    const wallet = useWallet();

    useEffect(() => {
        const addUserToWaitlistAsync = async () => {
            if (connected) {
                try {
                    // await addUserToWaitlist({
                    //     address: address,
                    // });
                    console.log(wallet.publicKey?.toString());
                } catch (error) {
                    console.error('Error setting your account. Please try again.');
                }
            }
        };

        addUserToWaitlistAsync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    return (
        <div className='backdrop-blur-3xl fixed z-50 w-full'>
            <nav className='flex items-center py-2 flex-wrap px-2.5 md:px-16 tracking-wider justify-between'>
                <Link href='/' passHref>
                    <div className='inline-flex items-center justify-center text-2xl md:text-5xl cursor-pointer'>
                        SoFLEX
                        <Badge variant='outline' className='ml-2 text-primary border-primary'>Beta</Badge>
                    </div>
                </Link>

                <div className='hidden top-navbar w-full lg:inline-flex lg:flex-grow lg:w-auto'>
                    <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto lg:space-x-4'>
                        <Button variant='ghost' className='hover:bg-primary text-md' asChild>
                            <Link href='/borrow' passHref>
                                Borrow
                            </Link>
                        </Button>
                        <Button variant='ghost' className='hover:bg-primary text-md' asChild>
                            <Link href='/lend' passHref>
                                Lend
                            </Link>
                        </Button>
                        {connected ?
                            <>
                                <Popover>
                                    <PopoverTrigger>
                                        <div className='relative'>
                                            <Bell className='cursor-pointer hover:text-primary' />
                                            <div className='w-2.5 h-2.5 absolute -top-0.5 right-1 bg-green-600 rounded-full'></div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent align='end' className='mt-2 hidden lg:block w-full'>
                                        <Notifications />
                                    </PopoverContent>
                                </Popover>
                                <Link href='/my-portfolio'>
                                    <User />
                                </Link>
                                <div className='relative'>
                                    <Button variant='destructive' className='text-md'>
                                        Disconnect Wallet
                                    </Button>
                                    <div className='absolute top-0 right-0 w-[133px] h-[40px] opacity-0'>
                                        <WalletDisconnectButton />
                                    </div>
                                </div>
                            </> :
                            <div className='relative'>
                                <Button className='text-white text-md'>
                                    Connect Wallet
                                </Button>
                                <div className='absolute top-0 right-0 w-[133px] h-[40px] opacity-0'>
                                    <WalletMultiButton />
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className='flex space-x-2 justify-between items-center ml-2'>
                    <ModeToggle />
                    <ResponsiveNavbar isWallet={connected} />
                </div>

            </nav>
        </div>
    )
}
