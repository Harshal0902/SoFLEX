"use client"

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

export type LoanDataType = {
    loanID: string;
    assetName: string;
    assetType: 'NFT' | 'Synthetic Asset';
    amount: number;
    interestRate: number;
    duration: number;
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
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <div className='h-4'>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'loanID',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Loan ID' />
        ),
    },
    {
        accessorKey: 'assetName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Name' />
        ),
    },
    {
        accessorKey: 'assetType',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Type' />
        ),
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Amount (in SOL)' />
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
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.loanID)}
                            className='cursor-pointer'
                        >
                            Copy Loan ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
]
