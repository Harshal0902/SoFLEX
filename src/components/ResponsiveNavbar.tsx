"use client"

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { addNewUser } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { Menu, X, Home, HandCoins, Gem, Bell, BellRing, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import useUserSOLBalance from '@/store/useUserSOLBalanceStore'

interface Notification {
    title: string
    noteficationTime: string
}

const notifications: Notification[] = [
    {
        title: 'Subscribe to our newsletter for updates!',
        noteficationTime: '1 hour ago'
    },
    {
        title: 'Welcome to the Beta Version!',
        noteficationTime: '1 hour ago'
    },
    {
        title: 'Welcome to SoFLEX!',
        noteficationTime: '2 hours ago'
    }
]

export default function ResponsiveNavbar({ isWallet }: { isWallet: boolean }) {
    const [isOpen, setOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState({
        notification: false,
        profile: false
    });

    // @ts-ignore
    const toggleDropdown = (dropdown) => setDropdownVisible((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
    const toggleDropdownNotification = () => toggleDropdown('notification');
    const toggleDropdownProfile = () => toggleDropdown('profile');

    const toggleOpen = () => setOpen((prev) => !prev);

    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) toggleOpen()
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pathname])

    const closeOnCurrent = (href: string) => {
        if (pathname === href) {
            toggleOpen()
        }
    }

    const { connected } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();
    const { balance, getUserSOLBalance } = useUserSOLBalance();

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

    return (
        <div className='lg:hidden'>

            <button type='button' onClick={toggleOpen} aria-hidden='false' aria-label='button' className='pt-1'>
                <Menu className='h-7 w-7' aria-hidden='false' />
            </button>

            {isOpen ? (
                <div>
                    <div className='animate-fade-in-down flex overflow-x-hidden mx-2 -mt-2 h-screen overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none lg:hidden'>
                        <div className='relative my-4 mx-auto w-screen'>
                            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-background outline-none focus:outline-none'>
                                <div className='flex items-start justify-between p-5 border-solid rounded-t'>
                                    <Link href='/' passHref>
                                        <div className='inline-flex items-center text-3xl font-base tracking-wide cursor-pointer'>
                                            SoFLEX
                                        </div>
                                    </Link>

                                    <button className='absolute right-6' onClick={toggleOpen} aria-hidden='false' aria-label='button'>
                                        <X className='h-7 w-7' aria-hidden='false' />
                                    </button>
                                </div>

                                <div className='grid justify-center'>
                                    <div className='inline-flex w-64 h-1 bg-indigo-500 rounded-full'></div>
                                </div>

                                <div className='grid place-items-center px-8 text-xl py-2 gap-2 w-full mb-4'>

                                    <div className='pt-2 px-2 cursor-pointer w-full'>
                                        <Link onClick={() => closeOnCurrent('/')} href='/'>
                                            <div className='flex flex-row justify-between items-center'>
                                                Home
                                                <Home />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                        <Link onClick={() => closeOnCurrent('/borrow')} href='/borrow'>
                                            <div className='flex flex-row justify-between items-center'>
                                                Borrow
                                                <HandCoins />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                        <Link onClick={() => closeOnCurrent('/lend')} href='/lend'>
                                            <div className='flex flex-row justify-between items-center'>
                                                Lend
                                                <Gem />
                                            </div>
                                        </Link>
                                    </div>

                                    {!isWallet ? (
                                        <div className='border-y-2 py-2 px-2 cursor-pointer w-full'>
                                            <div className='relative'>
                                                <Button className='text-white text-md w-full'>
                                                    Connect Wallet
                                                </Button>
                                                <div className='absolute top-0 right-0 w-[133px] h-[40px] opacity-0'>
                                                    <WalletMultiButton />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                                <div className='flex flex-row justify-between items-center' onClick={toggleDropdownNotification}>
                                                    Notification
                                                    <div className='relative'>
                                                        <Bell className='cursor-pointer' />
                                                        <div className='w-2.5 h-2.5 absolute -top-0.5 right-1 bg-green-600 rounded-full'></div>
                                                    </div>
                                                </div>
                                                <div className={`grid space-y-1 text-lg items-start pl-2 animate-fade-in-down-nav ${dropdownVisible.notification ? 'block' : 'hidden'}`}>
                                                    <p className='text-muted-foreground text-sm'>You have 3 unread messages.</p>
                                                    <div className='py-2 grid gap-y-5'>
                                                        <div className='flex items-center space-x-1 rounded-md border p-4'>
                                                            <BellRing />
                                                            <div className='flex-1 space-y-1'>
                                                                <p className='text-sm font-medium leading-none'>
                                                                    Push Notifications
                                                                </p>
                                                            </div>
                                                            <Switch />
                                                        </div>
                                                        <div>
                                                            {notifications.map((notification, index) => (
                                                                <div
                                                                    key={index}
                                                                    className='mb-4 grid grid-cols-[15px_1fr] items-start pb-0 last:mb-0 last:pb-0'
                                                                >
                                                                    <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
                                                                    <div className='space-y-1'>
                                                                        <p className='text-sm font-medium leading-none'>
                                                                            {notification.title}
                                                                        </p>
                                                                        <p className='text-sm text-muted-foreground'>
                                                                            {notification.noteficationTime}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <Button className='w-full text-white'>
                                                            Load More Notifications
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                                <div className='flex flex-row justify-between items-center' onClick={toggleDropdownProfile}>
                                                    Profile
                                                    <div className={`transform ${dropdownVisible.profile ? 'rotate-180 ease-in-out' : ''} transition-transform`}>
                                                        <ChevronDown />
                                                    </div>
                                                </div>
                                                <div className={`grid space-y-1 text-lg items-start pl-2 animate-fade-in-down-nav ${dropdownVisible.profile ? 'block' : 'hidden'}`}>
                                                    <div className='flex flex-row'>
                                                        <div>
                                                            Balance: {balance.toLocaleString()}
                                                        </div>
                                                        <div className='text-slate-600 ml-2'>
                                                            SOL
                                                        </div>
                                                    </div>
                                                    <Link onClick={() => closeOnCurrent('/portfolio')} href='/portfolio' passHref>
                                                        My Portfolio
                                                    </Link>
                                                    <Link onClick={() => closeOnCurrent('/check-credit-score')} href='/check-credit-score' passHref>
                                                        Check Credit Score
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className='border-y-2 py-2 px-2 cursor-pointer w-full'>
                                                <div className='relative'>
                                                    <Button variant='destructive' className='text-md w-full'>
                                                        Disconnect Wallet
                                                    </Button>
                                                    <div className='absolute top-0 right-0 w-[133px] h-[40px] opacity-0'>
                                                        <WalletDisconnectButton />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='opacity-25 fixed inset-0 z-40 h-screen bg-black md:hidden'></div>
                </div>
            ) : null}

        </div>
    )
}
