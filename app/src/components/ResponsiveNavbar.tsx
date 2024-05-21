"use client"

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { PublicKey } from '@solana/web3.js'
import { Menu, X, Home, HandCoins, Gem, Triangle, WalletMinimal, Bell, BellRing, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'

interface Notification {
    title: string
    noteficationTime: string
}

interface DropdownState {
    notification: boolean;
    profile: boolean;
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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [solBalance, setSolBalance] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [isMoreOption, setIsMoreOption] = useState<boolean>(false);
    const [dropdownVisible, setDropdownVisible] = useState<DropdownState>({ notification: false, profile: false });

    const toggleDropdown = (dropdown: keyof DropdownState) => setDropdownVisible((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
    const toggleDropdownNotification = () => toggleDropdown('notification');
    const toggleDropdownProfile = () => toggleDropdown('profile');

    const toggleOpen = () => {
        if (isOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 300);
        } else {
            setIsOpen(true);
        }
    };

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

    const { select, wallets, disconnect } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();

    useEffect(() => {
        const fetchSolBalance = async () => {
            try {
                if (wallet.publicKey) {
                    const walletAddress = new PublicKey(wallet.publicKey);
                    const balance = await connection.getBalance(walletAddress);
                    setSolBalance((balance / 10 ** 9).toFixed(4));
                }
            } catch (error) {
                toast.error('An error occurred while fetching your balance. Please try again!.');
            }
        };

        fetchSolBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.publicKey]);

    const handleWalletSelect = async (walletName: any) => {
        if (walletName) {
            try {
                select(walletName);
                setOpen(false);
                setIsOpen(false);
            } catch (error) {
                toast.error('An error occurred while connecting your wallet. Please try again!.');
            }
        }
    };

    const toggleMoreOption = () => {
        setIsMoreOption(!isMoreOption);
    };

    const handleDisconnect = async () => {
        disconnect();
        setIsOpen(false);
        toast.success('Wallet disconnected successfully!');
    };

    return (
        <div className='lg:hidden'>

            <button type='button' onClick={toggleOpen} aria-hidden='false' aria-label='button' className='pt-1'>
                <Menu className='h-7 w-7' aria-hidden='false' />
            </button>

            {isOpen && (
                <div>
                    <div className={`flex overflow-x-hidden mx-2 -mt-2 h-screen overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none lg:hidden transition-all duration-300 ${isClosing ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}>
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

                                    {isWallet ? (
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
                                                    <div className='flex flex-row space-x-1'>
                                                        <div>
                                                            Balance: {solBalance}
                                                        </div>
                                                        <div className='text-slate-600'>
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
                                                <Button variant='destructive' className='text-md w-full' onClick={handleDisconnect}>
                                                    Disconnect Wallet
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='border-y-2 w-full p-2'>
                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogTrigger asChild>
                                                    <Button className='text-white text-md w-full'>
                                                        Connect Wallet
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className='max-w-[90vw] md:max-w-[450px]'>
                                                    {wallets.some((wallet) => wallet.readyState === 'Installed') &&
                                                        <DialogTitle className='text-xl md:text-2xl tracking-wide text-center'>Connect a wallet on Solana to continue</DialogTitle>
                                                    }
                                                    <div className='flex flex-col space-y-2'>
                                                        {wallets
                                                            .filter((wallet) => wallet.readyState === 'Installed')
                                                            .map((wallet) => (
                                                                <Button key={wallet.adapter.name} variant='ghost' className='flex flex-row w-full justify-between items-center hover:bg-accent' onClick={() => handleWalletSelect(wallet.adapter.name)}>
                                                                    <div className='flex flex-row space-x-2 items-center'>
                                                                        <Image height='20' width='20' src={wallet.adapter.icon} alt={wallet.adapter.name} />
                                                                        <div className='text-lg md:text-xl'>
                                                                            {wallet.adapter.name}
                                                                        </div>
                                                                    </div>
                                                                    <div className='text-sm text-accent-foreground/80'>
                                                                        Detected
                                                                    </div>
                                                                </Button>
                                                            ))}
                                                        {!wallets.some((wallet) => wallet.readyState === 'Installed') && (
                                                            <div className='flex flex-col space-y-2 items-center justify-center'>
                                                                <h1 className='text-xl md:text-2xl tracking-wide text-center'>You&apos;ll need a wallet on Solana to continue</h1>
                                                                <div className='p-4 rounded-full border-2'>
                                                                    <WalletMinimal strokeWidth={1} className='h-16 w-16 font-light' />
                                                                </div>
                                                                <div className='flex flex-row justify-center py-2'>
                                                                    <a href='https://phantom.app' target='_blank'>
                                                                        <Button className='w-full px-20 text-white'>Get Wallet</Button>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className={`flex flex-col space-y-2 transition-all overflow-hidden ${isMoreOption ? 'max-h-screen duration-500' : 'max-h-0 duration-300'}`}>
                                                            {wallets
                                                                .filter((wallet) => wallet.readyState !== 'Installed')
                                                                .map((wallet) => (
                                                                    <Button key={wallet.adapter.name} variant='ghost' className='flex flex-row space-x-2 w-full justify-start items-center hover:bg-accent' onClick={() => handleWalletSelect(wallet.adapter.name)}>
                                                                        <Image height='20' width='20' src={wallet.adapter.icon} alt={wallet.adapter.name} />
                                                                        <div className='text-lg md:text-xl'>
                                                                            {wallet.adapter.name}
                                                                        </div>
                                                                    </Button>
                                                                ))}
                                                        </div>
                                                        <div className='flex justify-end px-2'>
                                                            <div className='flex flex-row space-x-2 items-center cursor-pointer px-2' onClick={toggleMoreOption}>
                                                                <h1>{isMoreOption ? 'Less' : 'More'} option</h1>
                                                                <Triangle fill={`text-foreground`} className={`dark:hidden h-3 w-3 transform transition-transform duration-300 ${isMoreOption ? '' : 'rotate-180'}`} />
                                                                <Triangle fill={`white`} className={`hidden dark:block h-3 w-3 transform transition-transform duration-300 ${isMoreOption ? '' : 'rotate-180'}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className='text-center text-sm'>By connecting a wallet, you agree to SoFLEX&apos;s <a href='/tos' target='_blank'><span className='underline'>Terms of Service</span></a>, <a href='/ua' target='_blank'><span className='underline'>User Agreement</span></a>, and consent to its <a href='/privacy' target='_blank'><span className='underline'>Privacy Policy</span></a>.</p>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='opacity-25 fixed inset-0 z-40 h-[200vh] bg-black md:hidden'></div>
                </div>
            )}

        </div>
    )
}
