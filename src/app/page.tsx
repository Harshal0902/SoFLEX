"use client"

import React from 'react'
import { addUserWaitlist } from '@/lib/supabaseRequests'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormLabel, FormControl, FormField, FormItem, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const FormSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email({
    message: 'Invalid email format',
  })
})

export default function Page() {
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
          toast.info('User already added to the Waitlist.');
        } else {
          toast.success('User added to Waitlist.');
          form.reset();
        }
      }
    }
  }
  return (
    <div className='h-screen flex justify-center items-center'>
      <Card className="w-[90vw] md:w-[500px]">
        <CardHeader>
          <CardTitle className='tracking-wider'>Join the Waitlist</CardTitle>
          <CardDescription>Join the waitlist for early access.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=''>What you will get:</p>
          <ul className='pb-4'>
            <li className='list-disc ml-5'>Early access to our platform.</li>
            <li className='list-disc ml-5'>Gain access to an exclusive Discord private channel.</li>
            <li className='list-disc ml-5'>Waitlist rewards in form of platform exclusive token.</li>
            <li className='list-disc ml-5'>Exclusive NFT for waitlist members.</li>
            <li className='list-disc ml-5'>Stay informed with regular updates on development progress, new features, and upcoming events.</li>
          </ul>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='grid w-full items-center gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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

              <Button type='submit' className='text-white bg-primary hover:bg-primary/90 w-full'>
                Join Waitlist
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
