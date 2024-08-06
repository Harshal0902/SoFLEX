import React from 'react'
import { useTranslations } from 'next-intl'
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

const FAQsCard: React.FC<FAQType> = ({ value, question, answer }) => (
    <AccordionItem value={`item-${value + 1}`}>
        <AccordionTrigger className='hover:no-underline text-left text-xl font-semibold tracking-wide'>
            {question}
        </AccordionTrigger>
        <AccordionContent className='text-lg'>{answer}</AccordionContent>
    </AccordionItem>
);

export default function Page() {
    const t = useTranslations('FAQsPage');

    const faqItems = [
        {
            question: `${t('quest1')}`,
            answer: `${t('ans1')}`,
        },
        {
            question: `${t('quest2')}`,
            answer: `${t('ans2')}`,
        },
        {
            question: `${t('quest3')}`,
            answer: `${t('ans3')}`,
        },
        {
            question: `${t('quest4')}`,
            answer: `${t('ans4')}`,
        },
        {
            question: `${t('quest5')}`,
            answer: `${t('ans5')}`,
        },
        {
            question: `${t('quest6')}`,
            answer: `${t('ans6')}`,
        },
        {
            question: `${t('quest7')}`,
            answer: `${t('ans7')}`,
        },
        {
            question: `${t('quest8')}`,
            answer: `${t('ans8')}`,
        },
        {
            question: `${t('quest9')}`,
            answer: `${t('ans9')}`,
        },
        {
            question: `${t('quest10')}`,
            answer: `${t('ans10')}`,
        },
    ]

    return (
        <Suspense fallback={<Preloader />}>
            <MaxWidthWrapper className='my-4'>
                <div className='flex items-center pb-4 justify-center'>
                    <h1 className='text-3xl md:text-4xl font-semibold tracking-wide text-center'>{t('title')}</h1>
                </div>

                <div>
                    <Accordion type='multiple' className='w-full px-4 md:px-[10vw]'>
                        {faqItems.map((item, index) => (
                            <FAQsCard key={index} value={index}  {...item} />
                        ))}
                        <AccordionItem value={`item-${faqItems.length + 1}`}>
                            <AccordionTrigger className='hover:no-underline text-left text-xl font-semibold tracking-wide'>{t('quest11')}</AccordionTrigger>
                            <AccordionContent className='text-lg'>
                                {t('ans11a')} <Link href='/contact-us' passHref className='text-primary underline'>{t('ans11b')}</Link>, {t('ans11c')} <a href='mailto:harshalraikwar07@gmail.com' className='text-primary underline'>harshalraikwar07@gmail.com</a>. {t('ans11d')}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </MaxWidthWrapper>
        </Suspense>
    )
}
