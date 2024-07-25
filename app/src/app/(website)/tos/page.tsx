import React from 'react'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

interface TermContentType {
    title: string;
    content: string[];
}

const termsContent: TermContentType[] = [
    {
        title: '1. Acceptance of Terms',
        content: [
            'By accessing or using the SoFLEX Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Platform.',
        ],
    },
    {
        title: '2. Description of Service',
        content: [
            'SoFLEX provides a comprehensive solution for lending and borrowing compressed NFTs and synthetic assets within the Solana ecosystem. Our Platform enables users to leverage their assets efficiently, whether for accessing funds or earning passive income through lending. We facilitate both peer-to-peer and peer-to-pool transactions in a seamless and secure environment.',
        ],
    },
    {
        title: '3. Eligibility',
        content: [
            'You must be at least 18 years old and have the legal capacity to enter into these Terms to access and use the SoFLEX Platform. By accessing or using our services, you represent and warrant that you meet these eligibility requirements.',
        ],
    },
    {
        title: '4. User Accounts',
        content: [
            'To access certain features of the SoFLEX Platform, you may need to create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.',
        ],
    },
    {
        title: '5. Prohibited Activities',
        content: [
            'When using the SoFLEX Platform, you agree not to engage in any of the following prohibited activities:',
            'a. Violating any applicable laws or regulations',
            'b. Impersonating any person or entity',
            'c. Interfering with the proper functioning of the Platform',
            'd. Engaging in fraudulent or deceptive activities',
            'e. Breaching the security or integrity of the Platform',
            'f. Using the Platform for any illegal or unauthorized purpose',
        ],
    },
    {
        title: '6. Intellectual Property',
        content: [
            'All content and materials available on the SoFLEX Platform, including but not limited to text, graphics, logos, images, and software, are the intellectual property of SoFLEX or its licensors. You may not use, reproduce, modify, or distribute any content from the Platform without prior written consent from SoFLEX.',
        ],
    },
    {
        title: '7. Disclaimer of Warranties',
        content: [
            'The SoFLEX Platform is provided on an "as is" and "as available" basis, without any warranties of any kind, express or implied. SoFLEX makes no representations or warranties regarding the accuracy, completeness, or reliability of any information or content available on the Platform.',
        ],
    },
    {
        title: '8. Limitation of Liability',
        content: [
            'To the fullest extent permitted by law, SoFLEX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the SoFLEX Platform. In no event shall SoFLEX\'s total liability exceed the amount paid by you, if any, for accessing or using the Platform.',
        ],
    },
    {
        title: '9. Indemnification',
        content: [
            'You agree to indemnify and hold SoFLEX harmless from and against any claims, liabilities, damages, losses, costs, or expenses arising out of or related to your use of the SoFLEX Platform or any violation of these Terms.',
        ],
    },
    {
        title: '10. Governing Law',
        content: [
            'These Terms shall be governed by and construed in accordance with the laws of Denver, without regard to its conflict of law principles.',
        ],
    },
    {
        title: '11. Changes to Terms',
        content: [
            'SoFLEX reserves the right to modify or update these Terms at any time without prior notice. Your continued use of the Platform after any such changes constitutes your acceptance of the modified Terms.',
        ],
    },
];

const TermSection: React.FC<TermContentType> = ({ title, content }) => (
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
        <Suspense fallback={<Preloader />}>
            <MaxWidthWrapper className='my-4'>
                <div className='flex items-center pb-4 justify-center'>
                    <h1 className='text-3xl md:text-4xl font-semibold tracking-wide'>Terms of Service</h1>
                </div>

                <div className='py-4 w-full'>
                    <h1 className='font-semibold text-xl tracking-wide'>Last Updated: 26 March, 2024</h1>

                    <div className='flex items-center justify-center py-2'>
                        <p className='text-lg md:text-xl text-center max-w-5xl'>Welcome to SoFLEX! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the SoFLEX platform (&quot;Platform&quot;), provided by SoFLEX Inc. (&quot;SoFLEX,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using our Platform, you agree to comply with these Terms. Please read them carefully before using our services.</p>
                    </div>

                    <div className='w-full flex flex-col items-start justify-center space-y-4 px-2 md:px-[5vw]'>
                        {termsContent.map((section, index) => (
                            <TermSection key={index} title={section.title} content={section.content} />
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
        </Suspense>
    )
}
