import React, { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import LendPage from '@/components/lend/LendPage'

export default function Page() {
    return (
        <Suspense fallback={<Preloader />}>
            <LendPage />
        </Suspense>
    )
}
