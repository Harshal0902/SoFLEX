import React, { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import BorrowPage from '@/components/borrow/BorrowPage'

export default function Page() {
    return (
        <Suspense fallback={<Preloader />}>
            <BorrowPage />
        </Suspense>
    )
}
