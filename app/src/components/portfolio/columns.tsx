"use client"

import { ColumnDef, Cell, CellContext } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import LoanRepay from './LoanRepay'

export type LoanDataType = {
    borrow_id: string;
    borrowing_amount: string;
    borrowing_total: string;
    borrowing_due_by: Date | string;
    borrowing_status: 'Active' | 'Repaid' | 'Defaulted' | 'Pending' | 'Cancelled' | 'Expired' | 'Closed';
    borrowing_interest_rate: string;
    borrowing_duration: string;
    borrowing_submitted_at: Date | string;
    borrowing_collateralization_assets: string;
    borrowing_token: string;
}

// Active: The loan is currently active and ongoing.
// Repaid: The loan has been fully repaid.
// Defaulted: The borrower has failed to repay the loan according to the terms, and it's considered defaulted.
// Pending: The loan application is pending approval or processing.
// Cancelled: The loan application was cancelled before approval or disbursement.
// Expired: The loan offer has expired without being accepted or disbursed.
// Closed: The loan has been closed for reasons such as early repayment or administrative closure.

export const loanColumns = (onTrigger: () => void): ColumnDef<LoanDataType>[] => [
    {
        accessorKey: 'borrow_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Loan ID' />
        ),
    },
    {
        accessorKey: 'borrowing_amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Borrowed Amount' />
        ),
    },
    {
        accessorKey: 'borrowing_total',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Repayment Total' info='Total Repayment Amount (Borrowed Amount + Interest).' />
        ),
    },
    {
        accessorKey: 'borrowing_due_by',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Due By' info='Deadline for repayment.' />
        ),
    },
    {
        accessorKey: 'borrowing_status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
    },
    {
        id: 'actions',
        cell: (props: CellContext<LoanDataType, unknown>) => {
            const cell = props.cell as Cell<LoanDataType, LoanDataType>;
            return <LoanRepay row={cell.row} onTrigger={onTrigger} />;
        }
    }
];
