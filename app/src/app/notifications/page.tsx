import React from 'react'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import InformationCard from '@/components/InformationCard'

export default function Page() {
    return (
        <Suspense fallback={<Preloader />}>
            <MaxWidthWrapper className='md:my-4'>
                <InformationCard message='This page is under construction' />
            </MaxWidthWrapper>
        </Suspense>
    )
}
