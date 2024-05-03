"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { addNewUser } from '@/lib/supabaseRequests'
import useUserSOLBalance from '@/store/useUserSOLBalanceStore'
import { toast } from 'sonner'
import ResponsiveNavbar from './ResponsiveNavbar'
import { Button } from './ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, User, LogOut } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Notifications from './Notifications'
import ModeToggle from './ModeToggle'

export default function Navbar() {
    const [open, setOpen] = useState<boolean>(false);

    const { select, wallets, publicKey, disconnect, connecting, connected } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();
    const { balance, getUserSOLBalance } = useUserSOLBalance();

    useEffect(() => {
        const addUserToDB = async () => {
            if (publicKey) {
                try {
                    await addNewUser({
                        walletAddress: wallet.publicKey?.toString(),
                    });
                    // toast.success('Wallet connected successfully!');
                } catch (error) {
                    toast.error('An error occurred while setting up your account. Please try again later.');
                }
            }
        };

        addUserToDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey]);

    useEffect(() => {
        if (wallet.publicKey) {
            getUserSOLBalance(wallet.publicKey, connection)
        }
    }, [wallet.publicKey, connection, getUserSOLBalance])

    const handleWalletSelect = async (walletName: any) => {
        if (walletName) {
            try {
                select(walletName);
                setOpen(false);
            } catch (error) {
                toast.error('An error occurred while connecting your wallet. Please try again later.');
            }
        }
    };

    const handleDisconnect = async () => {
        disconnect();
        toast.success('Wallet disconnected successfully!');
    };

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
                                        <div className='flex flex-row pb-2'>
                                            <div>
                                                Balance: {balance.toLocaleString()}
                                            </div>
                                            <div className='text-slate-600 ml-2'>
                                                SOL
                                            </div>
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
                                    <Button className='text-white text-md'>
                                        {connecting ? 'Connecting...' : 'Connect Wallet'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-[90vw] md:max-w-[380px]'>
                                    <DialogTitle className='text-xl md:text-2xl tracking-wide text-center'>Connect a wallet on Solana to continue</DialogTitle>
                                    <div className='flex flex-col space-y-2'>
                                        {wallets.map((wallet) => (
                                            <Button key={wallet.adapter.name} variant='ghost' className='flex flex-row space-x-2 w-full justify-start hover:bg-accent' onClick={() => handleWalletSelect(wallet.adapter.name)}>
                                                <Image height='20' width='20' src={wallet.adapter.icon} alt={wallet.adapter.name} />
                                                <div className='text-xl'>
                                                    {wallet.adapter.name}
                                                </div>
                                            </Button>
                                        ))}
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
