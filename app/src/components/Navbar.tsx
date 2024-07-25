"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { addNewUser } from '@/actions/dbActions'
import { toast } from 'sonner'
import ResponsiveNavbar from './ResponsiveNavbar'
import { Button } from './ui/button'
import { Badge } from '@/components/ui/badge'
import { WalletMinimal, Triangle, Bell, User, LogOut } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Notifications from './Notifications'
import ModeToggle from './ModeToggle'

export default function Navbar() {
    const [isHidden, setIsHidden] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [open, setOpen] = useState<boolean>(false);
    const [isMoreOption, setIsMoreOption] = useState<boolean>(false);

    const { select, wallets, publicKey, disconnect, connected } = useWallet();
    const wallet = useWallet();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setIsHidden(currentScrollPos > prevScrollPos && currentScrollPos > 0);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    useEffect(() => {
        const addUserToDB = async () => {
            if (wallet.publicKey) {
                try {
                    const result = await addNewUser({
                        walletAddress: wallet.publicKey.toString(),
                    });
                    if (result === 'Error adding new user') {
                        toast.error('An error occurred while setting up your account. Please try again!.');
                    }
                    // toast.success('Wallet connected successfully!');
                } catch (error) {
                    toast.error('An error occurred while setting up your account. Please try again!.');
                }
            }
        };

        addUserToDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey]);

    const formatWalletAddress = (address: string | undefined): string => {
        if (!address || address.length <= 8) {
            return address || '';
        }
        const start = address.substring(0, 6);
        const end = address.substring(address.length - 6);
        return `${start}.....${end}`;
    };

    const handleWalletSelect = async (walletName: any) => {
        if (walletName) {
            try {
                select(walletName);
                setOpen(false);
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
        toast.success('Wallet disconnected successfully!');
    };

    return (
        <div className={`backdrop-blur-3xl fixed top-0 z-50 w-full transition-all duration-200 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
            <nav className='flex items-center py-2 flex-wrap px-2.5 md:px-12 tracking-wider justify-between'>
                <Link href='/' passHref>
                    <div className='inline-flex items-center justify-center text-2xl md:text-5xl cursor-pointer'>
                        SoFLEX
                        <Badge variant='outline' className='ml-2 text-primary border-primary'>Devnet Beta</Badge>
                    </div>
                </Link>

                <div className='hidden top-navbar w-full lg:inline-flex lg:flex-grow lg:w-auto'>
                    <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start flex flex-col lg:h-auto lg:space-x-4'>
                        <Button variant='ghost' className='hover:bg-primary hover:text-white text-md' asChild>
                            <Link href='/borrow' passHref>
                                Borrow
                            </Link>
                        </Button>
                        <Button variant='ghost' className='hover:bg-primary hover:text-white text-md' asChild>
                            <Link href='/lend' passHref>
                                Lend
                            </Link>
                        </Button>
                        {publicKey ? (
                            <>
                                <Popover>
                                    <PopoverTrigger>
                                        <div className='relative'>
                                            <Bell className='hover:text-primary' />
                                            <div className='w-2.5 h-2.5 absolute -top-0.5 right-1 bg-green-600 rounded-full'></div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent align='end' className='mt-2 hidden lg:block w-full'>
                                        <Notifications />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger>
                                        <User className='hover:text-primary' />
                                    </PopoverTrigger>
                                    <PopoverContent align='end' className='mt-2 hidden lg:block max-w-[12rem]'>
                                        <div className='flex flex-row pb-2 space-x-1 font-semibold tracking-wider'>
                                            {formatWalletAddress(wallet?.publicKey?.toString())}
                                        </div>
                                        <Link href='/portfolio' passHref>
                                            <div className='pb-[0.4rem] pr-1 hover:text-primary text-[0.95rem]' >
                                                My Portfolio
                                            </div>
                                        </Link>
                                        <Link href='/check-credit-score' passHref>
                                            <div className='pb-[0.4rem] pr-1 hover:text-primary text-[0.95rem]' >
                                                Check Credit Score
                                            </div>
                                        </Link>
                                        <div className='flex flex-row justify-between items-center text-destructive cursor-pointer' onClick={handleDisconnect}>
                                            Disconnect Wallet
                                            <div>
                                                <LogOut size={16} />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </>
                        ) : (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className=' text-md'>
                                        Connect Wallet
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-[90vw] md:max-w-[380px]'>
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
                                                        <Button className='w-full px-20'>Get Wallet</Button>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        <div className={`flex flex-col space-y-2 transition-all overflow-hidden ${isMoreOption ? 'max-h-screen duration-200' : 'max-h-0 duration-200'}`}>
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
                                                <Triangle fill={`text-foreground`} className={`dark:hidden h-3 w-3 transform transition-transform duration-200 ${isMoreOption ? '' : 'rotate-180'}`} />
                                                <Triangle fill={`white`} className={`hidden dark:block h-3 w-3 transform transition-transform duration-200 ${isMoreOption ? '' : 'rotate-180'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <p className='px-2 text-center'>By connecting a wallet, you agree to SoFLEX&apos;s <a href='/tos' target='_blank'><span className='underline'>Terms of Service</span></a>, <a href='/ua' target='_blank'><span className='underline'>User Agreement</span></a>, and consent to its <a href='/privacy' target='_blank'><span className='underline'>Privacy Policy</span></a>.</p>
                                </DialogContent>
                            </Dialog>
                        )}
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
