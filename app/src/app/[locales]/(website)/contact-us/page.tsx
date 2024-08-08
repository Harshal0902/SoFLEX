"use client"

import React, { useState } from 'react'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import { useTranslations } from 'next-intl'
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

export default function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = useTranslations('ContactUsPage');

    const FormSchema = z.object({
        name: z.string({
            required_error: `${t('nameRequired')}`,
        }).min(2, {
            message: `${t('nameMin')}`,
        }),
        email: z.string({
            required_error: `${t('emailRequired')}`,
        }).email({
            message: `${t('emailInvalid')}`,
        }),
        message: z.string({
            required_error: `${t('messageRequired')}`,
        }).min(6, {
            message: `${t('messageMin')}`,
        }),
    });

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

        fetch('/api-route/email-api/contact-form', {
            method: 'POST',
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.message === 'Message sent successfully!') {
                    toast.success(`${t('toastSuccess')}`);
                }
                form.reset();
            })
            .catch((error) => {
                toast.error(`${t('toastError')}`);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }

    return (
        <Suspense fallback={<Preloader />}>
            <MaxWidthWrapper className='py-4 md:px-36'>
                <Card className='animate-fade-in-down grid md:grid-cols-2 p-4 md:p-10 shadow-2xl gap-6'>
                    <div className='flex flex-col justify-between'>
                        <div>
                            <CardTitle className='text-2xl font-semibold leading-tight tracking-wider lg:text-3xl'>{t('title')}</CardTitle>
                            <div className='mt-4 tracking-wide'>
                                {t('hateForms')} <a href='mailto:harshalraikwar07@gmail.com' className='text-primary underline cursor-pointer'>{t('email')}</a> {t('instead')}
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
                                        <FormLabel>{t('yourName')}</FormLabel>
                                        <FormControl>
                                            <div className='flex'>
                                                <div className='w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center'><User height={20} width={20} /></div>
                                                <Input className='w-full -ml-10 pl-10 pr-3 py-2' placeholder={`${t('yourName')}`} {...field} />
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
                                        <FormLabel>{t('yourEmail')}</FormLabel>
                                        <FormControl>
                                            <div className='flex'>
                                                <div className='w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center'><Mail height={20} width={20} /></div>
                                                <Input className='w-full -ml-10 pl-10 pr-3 py-2' placeholder={`${t('yourEmail')}`} {...field} />
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
                                        <FormLabel>{t('yourMessage')}</FormLabel>
                                        <FormControl>
                                            <div className='flex'>
                                                <Textarea className='w-full min-h-[14rem]' placeholder={`${t('yourMessage')}`}  {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='flex flex-row items-center justify-center w-full' disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' size={20} />}
                                {isSubmitting ? `${t('sending')}` : `${t('send')}`}
                            </Button>
                        </form>
                    </Form>
                </Card>
            </MaxWidthWrapper>
        </Suspense>
    )
}
