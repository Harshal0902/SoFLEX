"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header-info'
import BorrowingAssetDataType from './DeFiBorrowing'
import BorrowButtonCell from './BorrowButtonCell'

export type BorrowingAssetDataType = {
    assetName: string;
    assetSymbol: string;
    assetLogo: string;
    assetPrice: string;
    totalSupply: string;
    assetYield: string;
    totalBorrow: string;
    LTV: string;
}

export const borrowingAssetColumns: ColumnDef<BorrowingAssetDataType>[] = [
    {
        accessorKey: 'assetPrice',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Name' info='The name of the asset available for lending.' />
        ),
    },
    {
        accessorKey: 'totalSupply',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total Supply' info='The total amount of the asset available for lending.' />
        ),
    },
    {
        accessorKey: 'assetYield',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Yield' info='The annual percentage yield (APY) earned for supplying the asset.' />
        ),
    },
    {
        accessorKey: 'totalBorrow',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total Borrow' info='The total amount of the asset borrowed from the lending pool.' />
        ),
    },
    {
        accessorKey: 'LTV',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='LTV' info='The Borrowed amount vs. collateral value indicates loan risk.' />
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: BorrowButtonCell,
    }
]
