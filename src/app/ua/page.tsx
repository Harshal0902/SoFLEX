import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

interface UserContentType {
    title: string;
    content: string[];
}

const userContent: UserContentType[] = [
    {
        title: '1. Overview of SoFLEX Platform',
        content: [
            'The SoFLEX platform facilitates lending and borrowing activities involving compressed NFTs and synthetic assets within the Solana ecosystem. Our platform offers a comprehensive solution to address the liquidity and financial flexibility needs of users in the compressed NFT and synthetic asset space. Whether you are looking to access funds or earn passive income through lending, SoFLEX provides a secure and seamless environment to meet your financial objectives. We support both peer-to-peer and peer-to-protocol transactions.',
        ],
    },
]

const UserSection: React.FC<UserContentType> = ({ title, content }) => (
    <div className='gap-1'>
        <h1 className='text-xl md:text-2xl font-semibold tracking-wide'>{title}</h1>
        {content.map((paragraph, index) => (
            <p key={index} className='text-lg'>
                {paragraph}
            </p>
        ))}
    </div>
);

export default function Page() {
    return (
        <MaxWidthWrapper>
            <div className='flex items-center pb-4 justify-center'>
                <h1 className='text-3xl md:text-4xl font-semibold tracking-wide'>User Agreement</h1>
            </div>

            <div className='py-4 w-full'>
                <h1 className='font-semibold text-xl tracking-wide'>Last Updated: 26 March, 2024</h1>

                <div className='flex items-center justify-center py-2'>
                    <p className='text-lg md:text-xl text-center max-w-5xl'>Welcome to SoFLEX! This User Agreement (&quot;Agreement&quot;) governs your use of the SoFLEX platform (the &quot;Platform&quot;), provided by SoFLEX Inc. (&quot;SoFLEX,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the Platform, you agree to comply with and be bound by this Agreement. If you do not agree with these terms, please do not access or use the Platform.</p>
                </div>

                <div className='w-full flex flex-col items-start justify-center space-y-4 px-2 md:px-[5vw]'>
                    {userContent.map((section, index) => (
                        <UserSection key={index} title={section.title} content={section.content} />
                    ))}

                    <div className='gap-1'>
                        <h1 className='text-xl md:text-2xl font-semibold tracking-wide'>Contact Us</h1>
                        <p className='text-lg'>
                            If you have any questions or concerns about these Terms or the SoFLEX Platform, please contact us at{' '}
                            <a href='mailto:harshalraikwar07@gmail.com' className='text-blue-800 dark:text-blue-400 underline cursor-pointer'>
                                harshalraikwar07@gmail.com
                            </a>
                            .
                        </p>
                        <p className='text-lg'>By accessing or using the SoFLEX Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. Thank you for using SoFLEX!</p>
                    </div>

                </div>

            </div>
        </MaxWidthWrapper>
    )
}
