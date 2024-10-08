"use client"

import React, { useState, useEffect } from 'react'
import { addUserWaitlist } from '@/actions/dbActions'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function BetaModal() {
    const [showModal, setShowModal] = useState(true);

    const t = useTranslations('BetaModal');

    const FormSchema = z.object({
        email: z.string({
            required_error: `${t('emailError')}`,
        }).email({
            message: `${t('invalidEmailError')}`,
        })
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
        }
    })

    useEffect(() => {
        const isClosed = localStorage.getItem('betaModalClosedSoFLEX') === 'true';
        setShowModal(!isClosed);
    }, [])

    if (!showModal) {
        return null;
    }

    const handleClose = () => {
        setShowModal(false);
        localStorage.setItem('betaModalClosedSoFLEX', 'true');
    }

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const email = data.email;

        if (email) {
            const result = await addUserWaitlist({ email });

            if (result) {
                if (result === 'Error adding user to waitlist') {
                    toast.info(`${t('toastInfo')}`);
                    handleClose();
                } else {
                    toast.success(`${t('toastSuccess')}`);
                    form.reset();
                    handleClose();
                }
            }
        }
    }

    return (
        <div className='flex overflow-x-hidden backdrop-blur-sm overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative flex justify-center items-center py-6 mx-auto w-[90vw] md:w-1/2'>
                <div className='border-0 relative flex flex-col space-y-5 w-full px-2 py-4 md:px-8 text-gray-800 bg-gray-300 rounded shadow-xl outline-none focus:outline-none'>

                    <div className='absolute top-4 right-4'>
                        <button onClick={handleClose}>
                            <X className='text-2xl font-extrabold' />
                        </button>
                    </div>

                    <h1 className='text-2xl md:text-4xl font-semibold text-center'>🎉 {t('title')} 🎉</h1>
                    <p className='md:text-lg text-center'>{t('desc1')}</p>
                    <p className='text-center mt-2'>{t('desc2')}</p>
                    <div className='w-full'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-row items-start justify-center space-x-2'>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormControl>
                                                <Input {...field} className=' bg-white focus:ring-1 border outline-none' placeholder={`${t('emailPlaceholder')}`} />
                                            </FormControl>
                                            <FormMessage className='text-destructive tracking-wide' />
                                        </FormItem>
                                    )}
                                />

                                <Button type='submit'>
                                    {t('subscribe')}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
