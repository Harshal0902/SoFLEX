"use client"

import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { useTypingEffect } from '@/components/useTypingEffect'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import BackgroundAnimation from '@/components/BackgroundAnimation'

interface FeatureType {
  logo: string;
  title: string;
  description: string;
}

const features: FeatureType[] = [
  {
    logo: 'p2p',
    title: 'Peer-to-Peer (P2P) Lending and Borrowing',
    description: 'Connect directly with other users to buy, lend, or borrow compressed NFTs and synthetic assets, fostering a vibrant marketplace for asset exchange. Borrowers can secure SOL token loans using their assets as collateral, while lenders can set competitive interest rates or bid on lending amounts.',
  },
  {
    logo: 'peer-to-protocol',
    title: 'Peer-to-Protocol Lending and Borrowing',
    description: 'Engage in lending and borrowing activities against protocol-managed liquidity pools, enhancing liquidity and earning opportunities in the Solana ecosystem.',
  },
  {
    logo: 'cross-assets',
    title: 'Cross-Asset Borrowing',
    description: 'Enjoy the flexibility to borrow SOL tokens against compressed NFT and synthetic asset holdings, or vice versa, without liquidating assets. This feature provides alternative investment opportunities for SOL token holders and convenient liquidity access for asset owners.',
  },
  {
    logo: 'interest-rates',
    title: 'Flexible Interest Rates',
    description: 'Tailored interest rates cater to both borrowers and lenders, ensuring accessibility and profitability. Borrowers benefit from low rates (5%-10%), while lenders can earn attractive yields (30%-70%) on compressed NFT and synthetic assets.',
  },
  {
    logo: 'security',
    title: 'Security and Transparency',
    description: 'Built on the Solana blockchain, our platform ensures secure, transparent, and immutable transactions. Smart contracts govern lending and borrowing activities, offering users trustless access to financial services',
  },
  {
    logo: 'ai',
    title: 'AI-Powered Credit Assessment',
    description: 'Utilize AI algorithms to analyze user data, transaction history, and asset characteristics for accurate credit assessments and risk profiling. AI enhances lending decisions by evaluating factors like repayment history and market trends, mitigating default risks.',
  },
  {
    logo: 'portfolio',
    title: 'AI-Driven Portfolio Management',
    description: 'Optimize asset allocation, rebalancing strategies, and risk management techniques with AI-driven portfolio management tools. Analyze portfolio performance and market trends to maximize returns while minimizing risks for NFT and synthetic asset portfolios.',
  },
  {
    logo: 'growth',
    title: 'Innovation and Growth',
    description: 'Empower compressed NFT and synthetic asset holders to monetize assets and access liquidity without selling, while providing SOL token holders with passive income opportunities. Our platform promotes financial inclusion and fosters innovation in the dynamic world of decentralized finance on Solana.',
  },
]

const FeatureCard: React.FC<FeatureType> = ({ logo, title, description }) => (
  <div className='relative w-64 p-6 my-4 bg-gray-200 shadow-xl rounded-3xl'>
    <div className='absolute flex items-center p-3 rounded-full shadow-xl bg-gradient-to-r from-[#016795] to-[#1E488F] left-4 -top-8'>
      <Image src={`/assets/home/${logo}.svg`} height={50} width={50} quality={100} alt='img' />
    </div>
    <div className='mt-8 text-gray-800'>
      <p className='my-2 text-xl font-semibold'>{title}</p>
      <div className='flex space-x-2 font-medium text-basic'>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default function Page() {
  const { typedMyService, selectedMyService } = useTypingEffect(['NFTs', 'Synthetic Assets', 'Tokens'])

  return (
    <MaxWidthWrapper>

      <div className='flex flex-wrap-reverse items-center justify-center md:grid md:grid-cols-2 py-8 md:px-24 px-4 z-20'>

        <div className='md:flex md:flex-col md:justify-center'>
          <h2 className='mb-4 font-semibold tracking-wider text-3xl md:text-4xl' aria-label={selectedMyService}>
            SoFLEX: Lend and Borrow <br /> <span className='text-primary hidden md:block'>{typedMyService}<span className='animate-pulse'>|</span></span> <span className='text-primary md:hidden block'>success stories begin</span>
          </h2>
          <p className='self-center text-lg md:text-xl tracking-wide text-left md:text-justify py-2'>
            SoFLEX introduces a comprehensive solution for lending and borrowing compressed NFTs and synthetic assets within the Solana ecosystem, addressing the increasing demand for liquidity and financial flexibility while empowering users to leverage assets efficiently and securely.
          </p>
          <div className='flex flex-col items-center md:flex-row space-y-2 md:space-y-0 space-x-0 md:space-x-4 justify-start'>
            <a href='https://gitbook.soflex.fi/' target='_blank' rel='noreferrer noopener'>
              <Button className='px-12 text-white tracking-wider w-full'>
                Read GitBook <ExternalLink className='ml-2 h-4 w-4' />
              </Button>
            </a>

            <Button variant='outline' className='tracking-wider' asChild>
              <Link href='/check-credit-score'>
                Check On-Chain Credit Score
              </Link>
            </Button>

          </div>
        </div>

        <div className='flex justify-center w-full'>
          <Image src='/assets/home/hero.svg' height={400} width={400} quality={100} alt='Hero Image' priority={true} />
        </div>

      </div>

      <div className='mb-12 md:mb-20 text-center relative'>
        <h1 className='mb-4 text-4xl font-bold leading-10 sm:text-5xl sm:leading-none md:text-6xl'>Why Choose Us?</h1>
        <div className='flex justify-center mt-2'>
          <div className='inline-flex h-1 bg-indigo-500 rounded-full w-52'></div>
        </div>

        <div className='absolute top-0 right-0 w-full -z-[1]'>
          <BackgroundAnimation />
        </div>
      </div>

      <div className='flex items-center justify-center pb-8'>
        <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      <div className='mb-4 md:mb-12 text-center relative'>
        <h1 className='mb-4 text-4xl font-bold leading-10 sm:text-5xl sm:leading-none md:text-6xl'>Backed By</h1>
        <div className='flex justify-center mt-2'>
          <div className='inline-flex h-1 bg-indigo-500 rounded-full w-36 md:w-52'></div>
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <div className='p-2 border-2 border-accent bg-white rounded'>
          <Image src='/assets/home/bsl.png' height={50} width={400} quality={100} alt='BSL' />
        </div>
      </div>

    </MaxWidthWrapper>
  )
}
