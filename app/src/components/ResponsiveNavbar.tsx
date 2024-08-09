"use client"

import React, { useState, useEffect, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useRouter, usePathname } from '@/navigation'
import { Locale } from '@/config'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { Menu, X, Home, HandCoins, Gem, Triangle, WalletMinimal, Bell, BellRing, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image'

interface Notification {
    title: string
    notificationTime: string
}

interface DropdownState {
    notification: boolean;
    profile: boolean;
    language: boolean;
}

interface Language {
    value: string;
    label: string;
}

const languages: Language[] = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' }
]

export default function ResponsiveNavbar({ isWallet }: { isWallet: boolean }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [isMoreOption, setIsMoreOption] = useState<boolean>(false);
    const [dropdownVisible, setDropdownVisible] = useState<DropdownState>({ notification: false, profile: false, language: false });
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    const toggleDropdown = (dropdown: keyof DropdownState) => setDropdownVisible((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
    const toggleDropdownNotification = () => toggleDropdown('notification');
    const toggleDropdownProfile = () => toggleDropdown('profile');
    const toggleDropdownLanguage = () => toggleDropdown('language');

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

    const router = useRouter();
    const params = useParams();
    const t = useTranslations();
    const locale = useLocale();

    useEffect(() => {
        if (isOpen) toggleOpen()
        setSelectedLanguage(locale)
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pathname, locale])

    const closeOnCurrent = (href: string) => {
        if (pathname === href) {
            toggleOpen()
        }
    }

    function handleLanguageChange(value: string) {
        const nextLocale = value as Locale;
        startTransition(() => {
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: nextLocale }
            );
        });
    }

    const { select, wallets, disconnect } = useWallet();
    const wallet = useWallet();

    const formatWalletAddress = (address: string | undefined): string => {
        if (!address || address.length <= 8) {
            return address || '';
        }
        const start = address.substring(0, 4);
        const end = address.substring(address.length - 4);
        return `${start}...${end}`;
    };

    const notifications: Notification[] = [
        {
            title: `${t('Notifications.notification1')}`,
            notificationTime: `${t('Notifications.notificationTime')}`
        },
        {
            title: `${t('Notifications.notification2')}`,
            notificationTime: `${t('Notifications.notificationTime')}`
        },
        {
            title: `${t('Notifications.notification3')}`,
            notificationTime: `${t('Notifications.notificationTime')}`
        }
    ]

    const handleWalletSelect = async (walletName: any) => {
        if (walletName) {
            try {
                select(walletName);
                setOpen(false);
                setIsOpen(false);
            } catch (error) {
                toast.error(`${t('Navbar.walletConnectError')}`);
            }
        }
    };

    const toggleMoreOption = () => {
        setIsMoreOption(!isMoreOption);
    };

    const handleDisconnect = async () => {
        disconnect();
        setIsOpen(false);
        toast.success(`${t('Navbar.walletDisconnectSuccess')}`);
    };

    return (
        <div className='lg:hidden'>
            <button type='button' onClick={toggleOpen} aria-hidden='false' aria-label='button' className='pt-1'>
                <Menu className='h-7 w-7' aria-hidden='false' />
            </button>

            {isOpen && (
                <div>
                    <div className={`flex overflow-x-hidden mx-2 -mt-2 h-screen overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none lg:hidden transition-all duration-200 ${isClosing ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}>
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
                                                {t('Navbar.home')}
                                                <Home />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                        <Link onClick={() => closeOnCurrent('/borrow')} href='/borrow'>
                                            <div className='flex flex-row justify-between items-center'>
                                                {t('Navbar.borrow')}
                                                <HandCoins />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                        <Link onClick={() => closeOnCurrent('/lend')} href='/lend'>
                                            <div className='flex flex-row justify-between items-center'>
                                                {t('Navbar.lend')}
                                                <Gem />
                                            </div>
                                        </Link>
                                    </div>

                                    <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                        <div className='flex flex-row justify-between items-center' onClick={toggleDropdownLanguage}>
                                            {t('Navbar.language')}
                                            <div className={`transform ${dropdownVisible.language ? 'rotate-180 ease-in-out' : ''} transition-transform`}>
                                                <ChevronDown />
                                            </div>
                                        </div>
                                        <div className={`grid space-y-1 text-lg items-start pl-2 animate-fade-in-down-nav ${dropdownVisible.language ? 'block' : 'hidden'}`}>
                                            <div className='grid grid-cols-3 space-x-1 items-center'>
                                                {languages.map((lang) => (
                                                    <Button
                                                        disabled={isPending}
                                                        variant='ghost'
                                                        key={lang.value}
                                                        onClick={() => { handleLanguageChange(lang.value); setSelectedLanguage(lang.value); }}
                                                        className={`${lang.value === selectedLanguage && 'border-b-2 rounded-none'}`}>
                                                        {lang.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {isWallet ? (
                                        <>
                                            <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                                <div className='flex flex-row justify-between items-center' onClick={toggleDropdownNotification}>
                                                    {t('Notifications.title')}
                                                    <div className='relative'>
                                                        <Bell className='cursor-pointer' />
                                                        <div className='w-2.5 h-2.5 absolute -top-0.5 right-1 bg-green-600 rounded-full'></div>
                                                    </div>
                                                </div>
                                                <div className={`grid space-y-1 text-lg items-start pl-2 animate-fade-in-down-nav ${dropdownVisible.notification ? 'block' : 'hidden'}`}>
                                                    <p className='text-muted-foreground text-sm'>{t('Notifications.description')}</p>
                                                    <div className='py-2 grid gap-y-5'>
                                                        <div className='flex items-center space-x-1 rounded-md border p-4'>
                                                            <BellRing />
                                                            <div className='flex-1 space-y-1'>
                                                                <p className='text-sm font-medium leading-none'>
                                                                    {t('Notifications.pushNotification')}
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
                                                                            {notification.notificationTime}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {/* <Button className='w-full' asChild>
                                                            <Link href='/notifications'>
                                                                {t('Notifications.allNotifications')}
                                                            </Link>
                                                        </Button> */}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='border-t-2 pt-2 px-2 cursor-pointer w-full'>
                                                <div className='flex flex-row justify-between items-center' onClick={toggleDropdownProfile}>
                                                    {t('Navbar.profile')}
                                                    <div className={`transform ${dropdownVisible.profile ? 'rotate-180 ease-in-out' : ''} transition-transform`}>
                                                        <ChevronDown />
                                                    </div>
                                                </div>
                                                <div className={`grid space-y-1 text-lg items-start pl-2 animate-fade-in-down-nav ${dropdownVisible.profile ? 'block' : 'hidden'}`}>
                                                    <div className='flex flex-row space-x-1 font-semibold tracking-wide'>
                                                        {formatWalletAddress(wallet?.publicKey?.toString())}
                                                    </div>
                                                    <Link onClick={() => closeOnCurrent('/portfolio')} href='/portfolio' passHref>
                                                        {t('Navbar.myPortfolio')}
                                                    </Link>
                                                    <Link onClick={() => closeOnCurrent('/check-credit-score')} href='/check-credit-score' passHref>
                                                        {t('Navbar.checkCreditScore')}
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className='border-y-2 py-2 px-2 cursor-pointer w-full'>
                                                <Button variant='destructive' className='text-md w-full' onClick={handleDisconnect}>
                                                    {t('Navbar.disconnectWallet')}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='border-y-2 w-full p-2'>
                                            <Dialog open={open} onOpenChange={setOpen}>
                                                <DialogTrigger asChild>
                                                    <Button className='text-md w-full'>
                                                        {t('Navbar.connectWallet')}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className='max-w-[90vw] md:max-w-[450px]'>
                                                    {wallets.some((wallet) => wallet.readyState === 'Installed') &&
                                                        <DialogTitle className='text-xl md:text-2xl tracking-wide text-center'>{t('Navbar.walletConnectTitle')}</DialogTitle>
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
                                                                        {t('Navbar.detected')}
                                                                    </div>
                                                                </Button>
                                                            ))}
                                                        {!wallets.some((wallet) => wallet.readyState === 'Installed') && (
                                                            <div className='flex flex-col space-y-2 items-center justify-center'>
                                                                <h1 className='text-xl md:text-2xl tracking-wide text-center'>{t('Navbar.noWalletMessage')}</h1>
                                                                <div className='p-4 rounded-full border-2'>
                                                                    <WalletMinimal strokeWidth={1} className='h-16 w-16 font-light' />
                                                                </div>
                                                                <div className='flex flex-row justify-center py-2'>
                                                                    <a href='https://phantom.app' target='_blank'>
                                                                        <Button className='w-full px-20'>{t('Navbar.getWallet')}</Button>
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
                                                                <h1>{isMoreOption ? `${t('Navbar.less')}` : `${t('Navbar.more')}`} {t('Navbar.options')}</h1>
                                                                <Triangle fill={`text-foreground`} className={`dark:hidden h-3 w-3 transform transition-transform duration-200 ${isMoreOption ? '' : 'rotate-180'}`} />
                                                                <Triangle fill={`white`} className={`hidden dark:block h-3 w-3 transform transition-transform duration-200 ${isMoreOption ? '' : 'rotate-180'}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className='px-2 text-center'>{t('Navbar.acceptTerms1')} <a href='/tos' target='_blank'><span className='underline'>{t('Navbar.acceptTerms2')}</span></a>, <a href='/ua' target='_blank'><span className='underline'>{t('Navbar.acceptTerms3')}</span></a>, {t('Navbar.acceptTerms4')} <a href='/privacy' target='_blank'><span className='underline'>{t('Navbar.acceptTerms5')}</span></a>.</p>
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
