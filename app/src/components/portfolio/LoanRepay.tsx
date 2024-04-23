import React from 'react'
import { Button } from '@/components/ui/button'

export type LoanDataType = {
    loanId: string;
    assetName: string;
    amount: string;
    interestRate: number;
    duration: number;
    due_by: Date;
    status: 'Active' | 'Repaid' | 'Defaulted' | 'Pending' | 'Cancelled' | 'Expired' | 'Closed';
}

export default function LoanRepay({ row }: { row: { original: LoanDataType } }) {
    const order = row.original;

    return (
        <Button className='text-white' disabled={order.status !== 'Active'}>
            Repay
        </Button>
    )
}
