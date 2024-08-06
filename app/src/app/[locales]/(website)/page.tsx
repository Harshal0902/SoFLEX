"use client"

import React from 'react'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import { Spotlight } from '@/components/ui/spotlight'
import { useTranslations } from 'next-intl'
import { useTypingEffect } from '@/components/useTypingEffect'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Image from 'next/image'
import BackgroundAnimation from '@/components/BackgroundAnimation'

interface FeatureType {
  logo: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureType> = ({ logo, title, description }) => (
  <div className='relative w-64 md:w-72 p-6 my-4 bg-gray-200 shadow-xl rounded-3xl'>
    <div className='absolute flex items-center p-3 rounded-full shadow-xl bg-gradient-to-r from-[#016795] to-[#1E488F] left-4 -top-8'>
      <Image src={`/assets/home/${logo}.svg`} height={50} width={50} quality={100} alt='img' />
    </div>
    <div className='mt-8 text-gray-800 text-left'>
      <h1 className='my-2 text-xl font-bold'>{title}</h1>
      <div className='flex space-x-2 font-medium'>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default function Page() {
  const t = useTranslations('HomePage');

  const { typedMyService, selectedMyService } = useTypingEffect([`${t('service1')}`, `${t('service2')}`, `${t('service3')}`]);

  const features: FeatureType[] = [
    {
      logo: 'p2p',
      title: `${t('reasonTitle1')}`,
      description: `${t('reasonDesc1')}`,
    },
    {
      logo: 'peer-to-protocol',
      title: `${t('reasonTitle2')}`,
      description: `${t('reasonDesc2')}`,
    },
    {
      logo: 'cross-assets',
      title: `${t('reasonTitle3')}`,
      description: `${t('reasonDesc3')}`,
    },
    {
      logo: 'interest-rates',
      title: `${t('reasonTitle4')}`,
      description: `${t('reasonDesc4')}`,
    },
    {
      logo: 'security',
      title: `${t('reasonTitle5')}`,
      description: `${t('reasonDesc5')}`,
    },
    {
      logo: 'ai',
      title: `${t('reasonTitle6')}`,
      description: `${t('reasonDesc6')}`,
    },
    {
      logo: 'portfolio',
      title: `${t('reasonTitle7')}`,
      description: `${t('reasonDesc7')}`,
    },
    {
      logo: 'growth',
      title: `${t('reasonTitle8')}`,
      description: `${t('reasonDesc8')}`,
    },
  ]

  return (
    <Suspense fallback={<Preloader />}>
      <div className='md:h-[30rem] w-full flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden'>
        <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white' />
        <Spotlight className='left-80 top-28 h-[80vh] w-[50vw]' fill='blue' />
        {/* <Spotlight className='h-[80vh] w-[50vw] top-10 left-full' fill='#ff99ff' /> */}
        <div className='p-4 max-w-7xl mx-auto relative z-10 w-full pt-8 md:pt-0'>
          <h1 className='pb-3 text-4xl md:text-6xl font-bold text-center bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50' aria-label={selectedMyService}>
            {t('title')} <br /> <span className='italic'><span className='text-primary'>{typedMyService}<span className='animate-pulse'>|</span></span></span>
          </h1>
          <p className='py-2 font-normal text-lg max-w-4xl text-center mx-auto'>
            {t('description')}
          </p>
          <div className='flex flex-col md:flex-row space-x-0 space-y-2 md:space-x-2 md:space-y-0 py-2 items-center justify-center'>
            <a href='https://gitbook.soflex.fi' target='_blank' rel='noreferrer noopener' className='w-3/4 md:w-auto'>
              <Button className='tracking-wider px-10 w-full'>
                {t('readGitbook')} <ExternalLink className='ml-2 h-4 w-4' />
              </Button>
            </a>
            <Button variant='outline' className='px-10 w-3/4 md:w-auto' asChild>
              <Link href='/check-credit-score'>
                {t('checkCreditScore')}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <MaxWidthWrapper>
        <div className='flex flex-col space-y-4 py-3 relative'>
          <div className='relative'>
            <h1 className='mb-4 text-4xl text-center font-bold leading-10 tracking-wide sm:text-5xl sm:leading-none md:text-6xl'>{t('whyChooseUs')}</h1>
            <div className='flex justify-center mt-2'>
              <div className='inline-flex h-1 bg-indigo-500 rounded-full w-52'></div>
            </div>
          </div>

          <div className='absolute top-0 right-0 w-full -z-[1]'>
            <BackgroundAnimation />
          </div>

          <div className='flex items-center justify-center py-6'>
            <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-6 py-3'>
          <div className='relative'>
            <h1 className='mb-4 text-4xl text-center font-bold leading-10 sm:text-5xl sm:leading-none md:text-6xl'>{t('backedBy')}</h1>
            <div className='flex justify-center mt-2'>
              <div className='inline-flex h-1 bg-indigo-500 rounded-full w-36 md:w-52'></div>
            </div>
          </div>

          <div className='flex items-center justify-center'>
            <div className='p-2 border-2 border-accent bg-black rounded'>
              <Image src='/assets/home/bsl.png' height={50} width={400} quality={100} alt='BSL' />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </Suspense>
  )
}
