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
            'The SoFLEX platform facilitates lending and borrowing activities involving compressed NFTs and synthetic assets within the Solana ecosystem. Our platform offers a comprehensive solution to address the liquidity and financial flexibility needs of users in the compressed NFT and synthetic asset space. Whether you are looking to access funds or earn passive income through lending, SoFLEX provides a secure and seamless environment to meet your financial objectives. We support both peer-to-peer and peer-to-pool transactions.',
        ],
    },
    {
        title: '2. Registration and Account',
        content: [
            'To access certain features of the Platform, you may be required to register for an account. By registering, you agree to provide accurate, current, and complete information about yourself. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.',
        ],
    },
    {
        title: '3. Use of the Platform',
        content: [
            'a. You agree to use the Platform only for lawful purposes and in accordance with this Agreement.',
            'b. You agree not to engage in any activity that interferes with or disrupts the operation of the Platform or any servers or networks connected to the Platform.',
            'c. You acknowledge that SoFLEX does not provide financial advice, and any decisions you make based on information obtained from the Platform are at your own risk',
            'd.  You agree not to use the Platform for any fraudulent or illegal purposes.',
        ],
    },
    {
        title: '4. Intellectual Property',
        content: [
            'All content and materials available on the Platform, including but not limited to text, graphics, logos, images, and software, are the property of SoFLEX or its licensors and are protected by intellectual property laws.',
        ],
    },
    {
        title: '5. Privacy Policy',
        content: [
            'Your use of the Platform is subject to our Privacy Policy, which describes how we collect, use, and disclose your personal information. By using the Platform, you consent to the collection, use, and disclosure of your personal information as described in the Privacy Policy.',
        ],
    },
    {
        title: '6. Disclaimer of Warranties',
        content: [
            'THE PLATFORM IS PROVIDED ON AN "AS-IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. SOFLEX DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        ],
    },
    {
        title: '7. Limitation of Liability',
        content: [
            'TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, SOFLEX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM.',
        ],
    },
    {
        title: '8. Indemnification',
        content: [
            'You agree to indemnify, defend, and hold harmless SoFLEX and its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, liabilities, expenses, damages, and costs, including reasonable attorneys\' fees, arising out of or in any way connected with your use of the Platform or your violation of this Agreement.',
        ],
    },
    {
        title: '9. Governing Law',
        content: [
            'This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction where SoFLEX is located, without giving effect to any principles of conflicts of law.',
        ],
    },
    {
        title: '10. Changes to the Agreement',
        content: [
            'SoFLEX reserves the right to modify or update this Agreement at any time. We will notify you of any material changes to this Agreement by posting the updated version on the Platform. Your continued use of the Platform after such modifications will constitute your acceptance of the revised Agreement.',
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
                            If you have any questions or concerns about this Agreement, please contact us at {' '}
                            <a href='mailto:harshalraikwar07@gmail.com' className='text-blue-800 dark:text-blue-400 underline cursor-pointer'>
                                harshalraikwar07@gmail.com
                            </a>
                            .
                        </p>
                        <p className='text-lg'>By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by this Agreement.</p>
                    </div>

                </div>

            </div>
        </MaxWidthWrapper>
    )
}
