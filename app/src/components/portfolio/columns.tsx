"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import LoanRepay from './LoanRepay'

export type LoanDataType = {
    loanId: string;
    assetName: string;
    amount: string;
    interestRate: number;
    duration: number;
    due_by: Date;
    status: 'Active' | 'Repaid' | 'Defaulted' | 'Pending' | 'Cancelled' | 'Expired' | 'Closed';
}

// Active: The loan is currently active and ongoing.
// Repaid: The loan has been fully repaid.
// Defaulted: The borrower has failed to repay the loan according to the terms, and it's considered defaulted.
// Pending: The loan application is pending approval or processing.
// Cancelled: The loan application was cancelled before approval or disbursement.
// Expired: The loan offer has expired without being accepted or disbursed.
// Closed: The loan has been closed for reasons such as early repayment or administrative closure.

export const loanColumns: ColumnDef<LoanDataType>[] = [
    {
        accessorKey: 'loanId',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Loan ID' />
        ),
    },
    {
        accessorKey: 'assetName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Name(s)' />
        ),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Amount Borrowed' />
        ),
    },
    {
        accessorKey: 'interestRate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Interest Rate (in %)' />
        ),
    },
    {
        accessorKey: 'duration',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Duration (in Days)' />
        ),
    },
    {
        accessorKey: 'due_by',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Due By' />
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
    },
    {
        id: 'actions',
        cell: LoanRepay
    }
]
