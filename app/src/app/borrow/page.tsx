import React, { Suspense } from 'react'
import Loading from '@/components/Loading'
import BorrowPage from '@/components/borrow/BorrowPage'

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <BorrowPage />
        </Suspense>
    )
}
