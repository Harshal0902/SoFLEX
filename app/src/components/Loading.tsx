import React from 'react'
import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className='flex flex-row items-center justify-center py-16 text-xl'>
            <Loader2 className='text-xl mr-2 mt-0.5 font-extrabold animate-spin' />
            Loading...
        </div>
    )
}
