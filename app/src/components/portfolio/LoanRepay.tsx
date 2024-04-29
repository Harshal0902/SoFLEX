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

    // // @ts-ignore
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     // @ts-ignore
    //     const addOrdinalSuffix = (day) => {
    //         if (day >= 11 && day <= 13) {
    //             return day + 'th';
    //         }
    //         switch (day % 10) {
    //             case 1: return day + 'st';
    //             case 2: return day + 'nd';
    //             case 3: return day + 'rd';
    //             default: return day + 'th';
    //         }
    //     };
    //     const day = date.getDate();
    //     const month = date.toLocaleString('default', { month: 'long' });
    //     const year = date.getFullYear();
    //     const hour = date.getHours();
    //     const minute = date.getMinutes();
    //     const formattedDay = addOrdinalSuffix(day);
    //     const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    //     const period = hour < 12 ? 'AM' : 'PM';
    //     const formattedDate = `${formattedDay} ${month} ${year} at ${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;

    //     return formattedDate;
    // };

    // const dateString = "2024-05-14 19:45:11.875+00";
    // console.log(formatDate(dateString));


    return (
        <Button className='text-white' disabled={order.status !== 'Active'}>
            Repay
        </Button>
    )
}
