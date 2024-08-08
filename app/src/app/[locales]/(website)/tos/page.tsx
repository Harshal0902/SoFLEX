import React from 'react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

interface TermContentType {
    section: string;
    content: string[];
}

const TermSection: React.FC<TermContentType> = ({ section, content }) => (
    <div className='gap-1'>
        <h1 className='text-xl md:text-2xl font-semibold tracking-wide'>{section}</h1>
        {content.map((paragraph, index) => (
            <p key={index} className='text-lg'>
                {paragraph}
            </p>
        ))}
    </div>
);

export default function Page() {
    const t = useTranslations('ToSPage');

    const termsContent: TermContentType[] = [
        {
            section: `${t('section1')}`,
            content: [
                `${t('section1Content1')}`,
            ],
        },
        {
            section: `${t('section2')}`,
            content: [
                `${t('section2Content1')}`,
            ],
        },
        {
            section: `${t('section3')}`,
            content: [
                `${t('section3Content1')}`,
            ],
        },
        {
            section: `${t('section4')}`,
            content: [
                `${t('section4Content1')}`,
            ],
        },
        {
            section: `${t('section5')}`,
            content: [
                `${t('section5Content1')}`,
                `${t('section5Content2')}`,
                `${t('section5Content3')}`,
                `${t('section5Content4')}`,
                `${t('section5Content5')}`,
                `${t('section5Content6')}`,
                `${t('section5Content7')}`,
            ],
        },
        {
            section: `${t('section6')}`,
            content: [
                `${t('section6Content1')}`,
            ],
        },
        {
            section: `${t('section7')}`,
            content: [
                `${t('section7Content1')}`,
            ],
        },
        {
            section: `${t('section8')}`,
            content: [
                `${t('section8Content1')}`,
            ],
        },
        {
            section: `${t('section9')}`,
            content: [
                `${t('section9Content1')}`,
            ],
        },
        {
            section: `${t('section10')}`,
            content: [
                `${t('section10Content1')}`,
            ],
        },
        {
            section: `${t('section11')}`,
            content: [
                `${t('section11Content1')}`,
            ],
        },
    ];

    return (
        <Suspense fallback={<Preloader />}>
            <MaxWidthWrapper className='my-4'>
                <div className='flex items-center pb-4 justify-center'>
                    <h1 className='text-3xl md:text-4xl font-semibold tracking-wide'>{t('title')}</h1>
                </div>

                <div className='py-4 w-full'>
                    <h1 className='font-semibold text-xl tracking-wide'>{t('lastUpdated')}</h1>

                    <div className='flex items-center justify-center py-2'>
                        <p className='text-lg md:text-xl text-center max-w-5xl'>{t('description')}</p>
                    </div>

                    <div className='w-full flex flex-col items-start justify-center space-y-4 px-2 md:px-[5vw]'>
                        {termsContent.map((section, index) => (
                            <TermSection key={index} section={section.section} content={section.content} />
                        ))}

                        <div className='gap-1'>
                            <h1 className='text-xl md:text-2xl font-semibold tracking-wide'>{t('contactUs')}</h1>
                            <p className='text-lg'>
                                {t('contactDesc')}{' '}
                                <a href='mailto:harshalraikwar07@gmail.com' className='text-blue-800 dark:text-blue-400 underline cursor-pointer'>
                                    harshalraikwar07@gmail.com
                                </a>
                                .
                            </p>
                            <p className='text-lg'>{t('acceptTos')}</p>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </Suspense>
    )
}