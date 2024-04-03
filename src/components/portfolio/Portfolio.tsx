"use client"

import React, { useState, useEffect } from 'react'
import { userPortfolioDetails, updateUserData } from '@/lib/supabaseRequests'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import Loading from '@/components/Loading'
import { Loader2, HelpCircle, DollarSign, Landmark, BriefcaseBusiness, Banknote, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoanDataType, loanColumns } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface UserType {
    walletAddress: string;
    name: string;
    email: string;
}

interface BillingsType {
    name: string;
    primary_role: string;
}

const loanData: LoanDataType[] = [
    {
        loanID: 'loan_sgvdfbhsdk1623',
        assetName: 'Kevington NFT Collection',
        assetType: 'NFT',
        amount: 4,
        interestRate: 4.66,
        duration: 56,
        status: 'Active'
    },
    {
        loanID: 'loan_tghytdfgh8912',
        assetName: 'Solana Land Plot #123',
        assetType: 'Synthetic Asset',
        amount: 10,
        interestRate: 5.25,
        duration: 90,
        status: 'Active'
    },
    {
        loanID: 'loan_jhgfdswert3214',
        assetName: 'Digital Artwork "Sunrise"',
        assetType: 'NFT',
        amount: 2,
        interestRate: 3.75,
        duration: 30,
        status: 'Repaid'
    },
    {
        loanID: 'loan_qwertzxcv4567',
        assetName: 'Cryptocurrency Portfolio',
        assetType: 'NFT',
        amount: 20,
        interestRate: 6.10,
        duration: 120,
        status: 'Defaulted'
    },
    {
        loanID: 'loan_uioplkjhgf2345',
        assetName: 'Virtual Reality Game License',
        assetType: 'NFT',
        amount: 8,
        interestRate: 4.95,
        duration: 75,
        status: 'Active'
    }
]

const FormSchema = z.object({
    name: z.string({
        required_error: 'Name is required.',
    }).min(2, {
        message: 'Name must be at least 2 characters.',
    }).optional().nullable().or(z.literal('')),
    email: z.string({
        required_error: 'Email is required.',
    }).email({
        message: 'Invalid email address.',
    }).optional().nullable().or(z.literal(''))
})

export default function Portfolio({ walletAddress }: { walletAddress?: string }) {
    const [loading, setLoading] = useState(true);
    const [userPortfolio, setUserPortfolio] = useState<UserType[]>([]);
    const [saveData, setSaveData] = useState(false);

    const fetchUserPortfolio = async () => {
        try {
            const userPortfolioData = await userPortfolioDetails({ walletAddress: walletAddress });
            setUserPortfolio(userPortfolioData as UserType[]);
            setLoading(false);
        } catch (error) {
            toast.error('Error fetching user portfolio. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPortfolio();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (userPortfolio) {
            form.setValue('name', userPortfolio[0]?.name);
            form.setValue('email', userPortfolio[0]?.email);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPortfolio]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    const onSubmitUpdateUserData = async (data: z.infer<typeof FormSchema>) => {
        setSaveData(true);
        try {
            await updateUserData({
                walletAddress: walletAddress,
                name: data.name,
                email: data.email,
            });
            setSaveData(false);
            toast.success('Portfolio updated successfully!');
            await fetchUserPortfolio();
        } catch (error) {
            toast.error('Error updating portfolio. Please try again.');
        }
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <Card className='relative md:my-4'>
                    <TooltipProvider>
                        <CardHeader>
                            <div className='text-2xl md:text-4xl'>My Portfolio</div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitUpdateUserData)} autoComplete='off'>
                                    <div className='flex flex-col md:flex-row w-full items-center justify-between space-x-0 md:space-x-4 space-y-4 md:space-y-0 py-2'>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Your Name' {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is an optional field.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Your Email' {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This is an optional field.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type='submit' className='bg-success hover:bg-green-800 w-full md:w-1/2 text-white'>
                                            {saveData && <Loader2 className='mr-2 h-4 w-4 animate-spin' size={20} />}
                                            {saveData ? 'Saving...' : 'Save Details'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5'>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1'>
                                            <p>Interest Earned</p>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger>
                                                    <HelpCircle className='h-4 w-4 text-zinc-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    Track your net SOL interest earned from completed loans.
                                                </TooltipContent>
                                            </Tooltip>
                                        </CardTitle>
                                        <DollarSign className='h-5 w-5 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>45 SOL</div>
                                        <p className='text-muted-foreground'>
                                            +20.1% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1'>
                                            <p>Completed Loans</p>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger>
                                                    <HelpCircle className='h-4 w-4 text-zinc-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    Monitor the number of loans successfully repaid or liquidated.
                                                </TooltipContent>
                                            </Tooltip>
                                        </CardTitle>
                                        <Landmark className='h-5 w-5 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>22</div>
                                        <p className='text-muted-foreground'>
                                            +80% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1'>
                                            <p>Active Loans</p>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger>
                                                    <HelpCircle className='h-4 w-4 text-zinc-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    Stay updated on the number of ongoing active loans and borrowings.
                                                </TooltipContent>
                                            </Tooltip>
                                        </CardTitle>
                                        <BriefcaseBusiness className='h-5 w-5 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>2</div>
                                        <p className='text-muted-foreground'>
                                            +36% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1'>
                                            <p>Active Borrowings Value</p>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger>
                                                    <HelpCircle className='h-4 w-4 text-zinc-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    View the SOL value of all your current active borrowings.
                                                </TooltipContent>
                                            </Tooltip>
                                        </CardTitle>
                                        <Banknote className='h-5 w-5 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>56 SOL</div>
                                        <p className='text-muted-foreground'>
                                            +55.4% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium flex flex-1 flex-row items-center space-x-1'>
                                            <p>Active Lending Value</p>
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger>
                                                    <HelpCircle className='h-4 w-4 text-zinc-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent className='max-w-[18rem] md:max-w-[26rem] text-center'>
                                                    See the SOL value of your active lending portfolio.
                                                </TooltipContent>
                                            </Tooltip>
                                        </CardTitle>
                                        <Activity className='h-5 w-5 text-muted-foreground' />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>366 SOL</div>
                                        <p className='text-muted-foreground'>
                                            +44.96% from last month
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className='pt-2'>
                                <h1 className='text-xl py-2'>Loan History</h1>
                                <DataTable
                                    columns={loanColumns}
                                    data={loanData}
                                    userSearchColumn='assetName'
                                    inputPlaceHolder='Search by Asset Name'
                                />
                            </div>
                        </CardContent>
                    </TooltipProvider>
                </Card>
            )}
        </div>
    )
}
