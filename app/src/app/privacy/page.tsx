import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

interface PrivacyContentType {
    title: string;
    content: string[];
}

const privacyContent: PrivacyContentType[] = [
    {
        title: '1. Information We Collect',
        content: [
            'We may collect the following types of information when you use SoFLEX:',
            'Personal Information: Information that can be used to identify you, such as your name, email address, and payment information.',
            'Usage Information: Information about how you interact with SoFLEX, including your loan history and cookies.',
        ],
    },
    {
        title: '2. How We Use Your Information',
        content: [
            'We may use the information we collect for the following purposes:',
            'To provide and maintain SoFLEX.',
            'To process transactions and provide customer support.',
            'To personalize your experience and improve our services.',
            'To communicate with you about updates, promotions, and other relevant information.',
        ],
    },
    {
        title: '3. Information Sharing',
        content: [
            'We may share your information with third parties under the following circumstances:',
            'With your consent or at your direction.',
            'With service providers who assist us in operating SoFLEX and delivering our services.',
            'When required by law or to protect our rights and safety.',
        ],
    },
    {
        title: '4. Data Security',
        content: [
            'We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.',
        ],
    },
    {
        title: '5. Third-Party Links',
        content: [
            'SoFLEX may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices or content of these third parties.',
        ],
    },
    {
        title: '6. Children\'s Privacy',
        content: [
            'SoFLEX is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.',
        ],
    },
    {
        title: '7. Changes to This Privacy Policy',
        content: [
            'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.',
        ],
    },
]

const PrivacySection: React.FC<PrivacyContentType> = ({ title, content }) => (
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
                <h1 className='text-3xl md:text-4xl font-semibold tracking-wide'>Privacy Policy</h1>
            </div>

            <div className='py-4 w-full'>
                <h1 className='font-semibold text-xl tracking-wide'>Last Updated: 26 March, 2024</h1>

                <div className='flex items-center justify-center py-2'>
                    <p className='text-lg md:text-xl text-center max-w-5xl'>Thank you for choosing SoFLEX. This Privacy Policy describes how SoFLEX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares your information when you use our platform. By accessing or using SoFLEX, you agree to the terms of this Privacy Policy.</p>
                </div>

                <div className='w-full flex flex-col items-start justify-center space-y-4 px-2 md:px-[5vw]'>
                    {privacyContent.map((section, index) => (
                        <PrivacySection key={index} title={section.title} content={section.content} />
                    ))}

                    <div className='gap-1'>
                        <h1 className='text-xl md:text-2xl font-semibold tracking-wide'>Contact Us</h1>
                        <p className='text-lg'>
                        If you have any questions or concerns about this Privacy Policy, please contact us at{' '}
                            <a href='mailto:harshalraikwar07@gmail.com' className='text-blue-800 dark:text-blue-400 underline cursor-pointer'>
                                harshalraikwar07@gmail.com
                            </a>
                            .
                        </p>
                        <p className='text-lg'>By using SoFLEX, you consent to the terms of this Privacy Policy. Thank you for trusting SoFLEX with your information.</p>
                    </div>

                </div>

            </div>
        </MaxWidthWrapper>
    )
}
