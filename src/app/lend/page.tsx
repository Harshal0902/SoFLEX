import React, { Suspense } from 'react'
import Loading from '@/components/Loading'
import LendPage from '@/components/lend/LendPage'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LendPage />
    </Suspense>
  )
}
