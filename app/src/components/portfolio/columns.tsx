"use client"

import { ColumnDef, Cell, CellContext } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import LoanRepay from './LoanRepay'

export type LoanDataType = {
    borrow_id: string;
    borrow_user_address: string;
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

export const loanColumns = (onTrigger: () => void, t: (key: string) => string): ColumnDef<LoanDataType>[] => [
    {
        accessorKey: 'borrow_id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('loanId')} />
        ),
    },
    {
        accessorKey: 'borrowing_amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('borrowedAmount')} />
        ),
    },
    {
        accessorKey: 'borrowing_total',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('repaymentTotal')} info={t('repaymentTotalInfo')} />
        ),
    },
    {
        accessorKey: 'borrowing_due_by',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('dueBy')} info={t('dueByInfo')} />
        ),
    },
    {
        accessorKey: 'borrowing_status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('status')} />
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
