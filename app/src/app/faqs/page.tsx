import React from 'react'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

interface FAQType {
    value: number;
    question: string;
    answer: string;
}

const faqItems = [
    {
        question: 'What is SoFLEX?',
        answer: 'SoFLEX is a platform built on Solana that facilitates lending and borrowing activities with compressed NFTs and synthetic assets. It offers a comprehensive solution to meet the liquidity needs within the Solana ecosystem.',
    },
    {
        question: 'How does SoFLEX work?',
        answer: 'SoFLEX operates on a peer-to-peer (P2P) and peer-to-pool model. Users can lend, borrow, or buy compressed NFTs and synthetic assets directly from other users or participate in pool-managed lending and borrowing against liquidity pools.',
    },
    {
        question: 'What assets can I lend or borrow on SoFLEX?',
        answer: 'SoFLEX allows users to engage with various compressed NFTs and synthetic assets within the Solana ecosystem. Users can borrow SOL tokens against their assets or vice versa, providing flexibility in accessing liquidity.',
    },
    {
        question: 'What are the interest rates offered on SoFLEX?',
        answer: 'SoFLEX offers competitive interest rates tailored to both borrowers and lenders. Borrowers can access loans at rates ranging from 5% to 10%, while lenders can earn yields ranging from 30% to 70% on their assets?',
    },
    {
        question: 'How does SoFLEX ensure security and transparency?',
        answer: 'SoFLEX leverages the security features of the Solana blockchain, ensuring the immutability and transparency of all transactions. Smart contracts govern lending and borrowing activities, providing users with trustless and reliable access to financial services.',
    },
    {
        question: 'Does SoFLEX offer any additional features?',
        answer: 'Yes, SoFLEX incorporates AI-powered credit assessment and portfolio management tools. These features enhance lending decisions by analyzing user data, transaction history, and asset characteristics, while also optimizing asset allocation and risk management strategies for users\' portfolios.',
    },
    {
        question: 'What are the benefits of using SoFLEX?',
        answer: 'SoFLEX empowers users to monetize their assets without selling, offers passive income opportunities for SOL token holders, enhances liquidity in the Solana ecosystem, and promotes financial inclusion by providing accessible lending solutions globally.',
    },
    {
        question: 'How can I get started with SoFLEX?',
        answer: 'To get started with SoFLEX, simply sign up for an account on the platform and connect your Solana wallet. From there, you can explore lending, borrowing, and trading activities with compressed NFTs and synthetic assets.',
    },
    {
        question: 'Is SoFLEX suitable for both experienced investors and newcomers?',
        answer: 'Yes, SoFLEX caters to a diverse range of users, from seasoned investors to newcomers in the compressed NFT and synthetic asset space. The platform provides the necessary tools and resources for users to thrive in decentralized finance on Solana.',
    },
    {
        question: 'Where can I learn more about SoFLEX?',
        answer: 'For more information about SoFLEX, including detailed guides, tutorials, and updates, visit our website or join our community channels on social media platforms.',
    },
]

const FAQsCard: React.FC<FAQType> = ({ value, question, answer }) => (
    <AccordionItem value={`item-${value + 1}`}>
        <AccordionTrigger className='hover:no-underline text-left text-xl font-semibold tracking-wide'>
            {question}
        </AccordionTrigger>
        <AccordionContent className='text-lg'>{answer}</AccordionContent>
    </AccordionItem>
);

export default function Page() {
    return (
        <Suspense fallback={<Preloader />}>
            <MaxWidthWrapper className='md:my-4'>
                <div className='flex items-center pb-4 justify-center'>
                    <h1 className='text-3xl md:text-4xl font-semibold tracking-wide text-center'>Frequently Asked Questions</h1>
                </div>

                <div>
                    <Accordion type='multiple' className='w-full px-4 md:px-[10vw]'>
                        {faqItems.map((item, index) => (
                            <FAQsCard key={index} value={index}  {...item} />
                        ))}
                        <AccordionItem value={`item-${faqItems.length + 1}`}>
                            <AccordionTrigger className='hover:no-underline text-left text-xl font-semibold tracking-wide'>How can I contact SoFLEX support?</AccordionTrigger>
                            <AccordionContent className='text-lg'>
                                For any inquiries or support, you can reach out to SoFLEX&apos;s customer support team through the provided contact details on the platform. Additionally, you can contact us by submitting the form on the <Link href='/contact-us' passHref className='text-primary underline'>Contact page</Link>, or feel free to send us an email at <a href='mailto:harshalraikwar07@gmail.com' className='text-primary underline'>harshalraikwar07@gmail.com</a>. Our team is ready to assist you with any questions or concerns.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </MaxWidthWrapper>
        </Suspense>
    )
}
