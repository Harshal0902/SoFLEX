"use client"

import React, { useState, useEffect } from 'react'
import { addUserWaitlist } from '@/lib/supabaseRequests'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { z, ZodError } from 'zod'

const emailSchema = z.string().email();

export default function BetaModal() {
    const [showModal, setShowModal] = useState(true);
    const [email, setEmail] = useState('');
    const [waitlist, setWaitlist] = useState([]);
    const [inputError, setInputError] = useState<string | null>(null);

    const errorMessage = '';

    const handleClose = () => {
        setShowModal(false);
        localStorage.setItem('betaModalClosedSoFLEX', 'true');
    }

    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const inputValue = e.target.value;

        try {
            emailSchema.parse(inputValue);
            setInputError(null);
        } catch (error) {
            if (error instanceof ZodError) {
                setInputError(error.errors[0].message);
            }
        }

        setEmail(inputValue);
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (inputError) {
            return;
        }

        if (email) {
            const result = await addUserWaitlist({ email });

            if (result) {
                if (result) {
                    toast.success('You have successfully subscribed to our newsletter!');
                    handleClose();
                } else {
                    toast.error('Something went wrong. Please try again later.');
                    handleClose();
                }
            }
        }
    }

    useEffect(() => {
        const isClosed = localStorage.getItem('betaModalClosedSoFLEX') === 'true';
        setShowModal(!isClosed);
        const storedWaitlist = localStorage.getItem('waitlist');
        if (storedWaitlist) {
            setWaitlist(JSON.parse(storedWaitlist));
        }
    }, [])

    if (!showModal) {
        return null;
    }

    return (
        <div className='flex overflow-x-hidden backdrop-blur-sm overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative flex justify-center items-center py-6 mx-auto w-[90vw] md:w-1/2'>
                <div className='border-0 relative flex flex-col space-y-5 w-full px-2 py-4 md:px-8 md:py-8 text-gray-800 bg-gray-300 rounded shadow-xl outline-none focus:outline-none'>
                    <h1 className='text-2xl md:text-4xl font-semibold text-center pt-4'>🎉 Welcome to the Beta Version 🎉</h1>
                    <p className='md:text-lg text-center'>
                        We&apos;re thrilled to have you here as part of our beta community. Help us shape the future of our product!
                    </p>
                    <p className='text-center mt-2'>
                        Be the first to know when we release our alpha version. Subscribe to our newsletter for the latest updates, news, and exciting features.
                    </p>
                    <form onSubmit={handleSubmit} className='w-full'>
                        <div className='flex justify-center space-x-2'>
                            <Input
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className={`bg-white focus:ring-1 border outline-none ${inputError ? 'border-destructive' : 'outline-0'}`}
                            />
                            <Button type='submit' className='text-white'>Subscribe</Button>
                        </div>
                    </form>

                    {errorMessage && (
                        <div className='text-center text-destructive'>{errorMessage}</div>
                    )}

                    <div className='absolute -top-2 right-2'>
                        <button onClick={handleClose}>
                            <X className='text-2xl font-extrabold' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
