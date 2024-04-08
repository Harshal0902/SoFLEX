"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { User, Mail, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const FormSchema = z.object({
    name: z.string({
        required_error: 'Name is required.',
    }).min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string({
        required_error: 'Email is required.',
    }).email({
        message: 'Invalid email format.',
    }),
    message: z.string({
        required_error: 'Message is required.',
    }).min(6, {
        message: 'Message must be at least 6 characters.',
    }),
});

export default function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);

        fetch('/email-api/contact-form', {
            method: 'POST',
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((response) => {
                toast.success(response.message)
                form.reset();
            })
            .catch((error) => {
                toast.error('Uh oh! Something went wrong. Please try again.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    return (
        <MaxWidthWrapper className='md:px-36'>
            <Card className='animate-fade-in-down grid md:grid-cols-2 p-4 md:p-10 shadow-2xl gap-6'>

                <div className='flex flex-col justify-between'>
                    <div>
                        <CardTitle className='text-2xl font-semibold leading-tight tracking-wider lg:text-3xl'>Let&apos;s talk about everything!</CardTitle>
                        <div className='mt-4 tracking-wide'>
                            Hate forms? Send an <a href='mailto:harshalraikwar07@gmail.com' className='text-primary underline cursor-pointer'>email</a> instead.
                        </div>
                    </div>
                    <div className='mt-2 text-center'>
                        <Image className='w-full' src='/assets/contact/contact.svg' width='400' height='400' alt='Contact Me' />
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <div className='flex'>
                                            <div className='w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center'><User height={20} width={20} /></div>
                                            <Input className='w-full -ml-10 pl-10 pr-3 py-2' placeholder='Your Name' {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <div className='flex'>
                                            <div className='w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center'><Mail height={20} width={20} /></div>
                                            <Input className='w-full -ml-10 pl-10 pr-3 py-2' placeholder='Your Email' {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='message'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your message</FormLabel>
                                    <FormControl>
                                        <div className='flex'>
                                            <Textarea className='w-full min-h-[14rem]' placeholder='Your message'  {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' className='text-white w-full' disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' size={20} />}
                            {isSubmitting ? 'Submitting...' : 'Send'}
                        </Button>
                    </form>
                </Form>

            </Card>
        </MaxWidthWrapper>
    )
}