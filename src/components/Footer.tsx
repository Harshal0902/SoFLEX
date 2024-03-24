"use client"

import React from 'react'
import { addUserWaitlist } from '@/lib/supabaseRequests'
import MaxWidthWrapper from './MaxWidthWrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface FooterLinkType {
    title: string;
    link: string;
}

interface SocialLinkType {
    link: string;
    imageName: string;
}

const forCompany: FooterLinkType[] = [
    {
        title: 'About Us',
        link: '/'
    },
    {
        title: 'Contact Us',
        link: '/contact-us'
    },
    {
        title: 'Frequently Asked Questions',
        link: '/faqs'
    }
]

const forLegal: FooterLinkType[] = [
    {
        title: 'Terms of Service',
        link: 'tos'
    },
    {
        title: 'User Agreement',
        link: 'ua'
    },
    {
        title: 'Privacy Policy',
        link: 'privacy'
    }
]

const companySocial: SocialLinkType[] = [
    {
        link: 'https://twitter.com/SoFLEX',
        imageName: 'twitter.svg',
    },
    {
        link: 'https://discord.gg/mjDAEa32XC',
        imageName: 'discord.svg',
    },
    {
        // link: 'https://www.youtube.com/@SoFLEX', // Channel Link
        link: 'https://youtu.be/se0QgRyTaEg',
        imageName: 'youtube.svg',
    },
    // {
    //     link: '#',
    //     imageName: 'linkedin.svg',
    // },
    {
        link: 'https://github.com/SoFLEX',
        imageName: 'github.svg',
    },
    // {
    //     link: '#',
    //     imageName: 'reddit.svg',
    // }
]

const FormSchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    }).email({
        message: 'Invalid email format',
    })
})

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const email = data.email;

        if (email) {
            const result = await addUserWaitlist({ email });

            if (result) {
                if (result instanceof Response && result.status === 409) {
                    toast.info('User already added to the newsletter.');
                } else {
                    toast.success('User added to newslette.');
                    form.reset();
                }
            }
        }
    }

    return (
        <MaxWidthWrapper>
            <footer className='bg-blue-100/80 dark:bg-gray-900 my-2.5 md:my-6 rounded backdrop-blur-0'>
                <div className='container p-6 mx-auto'>

                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-y-10 lg:grid-cols-5'>
                        <div className='sm:col-span-2'>
                            <h1 className='max-w-lg text-xl font-semibold tracking-wide text-gray-800 dark:text-white'>Subscribe to Our Newsletter to Get Updates:</h1>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col mx-auto mt-6 md:space-x-2 space-y-3 md:space-y-0 md:flex-row'>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} className='w-full' placeholder='Email Address' />
                                                </FormControl>
                                                <FormDescription>
                                                    Don&apos;t worry we will not send you spam emails.
                                                </FormDescription>
                                                <FormMessage className='text-destructive tracking-wide' />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type='submit' className='text-white bg-primary hover:bg-primary/90'>
                                        Subscribe
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <div>
                            <p className='font-semibold tracking-wide'>Legal</p>

                            <div className='flex flex-col items-start mt-5 space-y-2'>
                                {forLegal.map((link, index) => (
                                    <Link href={link.link} key={index} passHref>
                                        <p className='transition-colors duration-300 hover:text-primary hover:cursor-pointer'>{link.title}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>


                        <div>
                            <p className='font-semibold tracking-wide'>Company</p>

                            <div className='flex flex-col items-start mt-5 space-y-2'>
                                {forCompany.map((link, index) => (
                                    <Link href={link.link} key={index} passHref>
                                        <p className='transition-colors duration-300 hover:text-primary hover:cursor-pointer'>{link.title}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr className='my-6 border-gray-200 dark:border-gray-700 h-2' />

                    <div className='sm:flex sm:items-center sm:justify-between'>
                        <div className='flex flex-col space-y-2'>
                            <h1 className='text-lg'>Connect with us on:</h1>
                            <div className='flex gap-2 hover:cursor-pointer items-center'>
                                {companySocial.map((social, index) => (
                                    <a href={social.link} target='_blank' rel='noopener noreferrer' key={index} className='p-2 flex items-center justify-center rounded-full bg-gray-100 border-2 border-primary'>
                                        <Image src={`/assets/footer/${social.imageName}`} height={20} width={20} quality={100} alt={social.imageName} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className='flex flex-wrap justify-center items-center py-2 text-center text-xl w-full mx-auto'>&copy; {currentYear} SoFLEX, Inc. All rights reserved.</p>
                </div>
            </footer>
        </MaxWidthWrapper>
    )
}
