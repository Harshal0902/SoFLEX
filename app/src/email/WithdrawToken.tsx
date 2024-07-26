import React from 'react'
import { Tailwind, Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'

export function WithdrawToken({ user_address, token_name, token_amount }: { user_address: string, token_name: string, token_amount: string }) {
    return (
        <Html>
            <Head />
            <Preview>Withdraw request from the SoFLEX Portfolio page</Preview>
            <Tailwind>
                <Body className='bg-[#f3f3f5] font-sansSerif'>
                    <Container className='w-[680px] max-w-full mx-auto'>
                        <Section className='flex py-2'>
                            <Heading className='text-4xl font-bold text-[#020817] px-4'>
                                SoFLEX
                            </Heading>
                        </Section>

                        <Section className='rounded-t-md flex flex-col bg-[#3B82F6]'>
                            <Heading className='text-white text-4xl font-bold text-center p-4'>
                                Hello there 👋!
                            </Heading>
                        </Section>

                        <Section className='flex flex-col space-y-4 p-4 bg-white rounded-b-md'>
                            <Heading as='h2' className='m-0 mb-3.5 font-bold text-xl text-[#020817]'>
                                Withdraw request from {user_address} for {token_amount} {token_name} on SoFLEX Portfolio page
                            </Heading>

                            <Hr className='my-5' />

                            <Text className='text-[17px] leading-[17px] text-[#3c3f44]'>
                                User Address: {user_address}
                            </Text>

                            <Text className='text-[17px] leading-[17px] text-[#3c3f44]'>
                                Withdraw Token: {token_amount} {token_name}
                            </Text>

                            <Hr className='my-5' />

                            <Text className='text-[17px] leading-[17px] text-[#3c3f44]'>
                                This email was sent from the SoFLEX Portfolio page.
                            </Text>
                        </Section>
                    </Container>

                    <Section className='w-[680px] max-w-full mx-auto mt-4'>
                        <Text className='text-gray-500'>
                            You&apos;re receiving this email because someone requested withdraw from SoFLEX Portfolio page.
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
