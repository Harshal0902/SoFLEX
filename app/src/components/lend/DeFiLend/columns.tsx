"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import LendingAssetDataType from './DeFiLending'
import LendButtonCell from './LendButtonCell'

export type LendingAssetDataType = {
    asset_name: string;
    asset_symbol: string;
    asset_logo: string;
    asset_price: string;
    total_supply: string;
    asset_yield: string;
    total_borrow: string;
    ltv: string;
}

export const lendingAssetColumns: ColumnDef<LendingAssetDataType>[] = [
    {
        accessorKey: 'asset_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Name' />
        ),
    },
    {
        accessorKey: 'total_supply',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total Supply' info='The total amount of the asset available for lending.' />
        ),
    },
    {
        accessorKey: 'asset_yield',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Asset Yield' info='The annual percentage yield (APY) earned for supplying the asset.' />
        ),
    },
    {
        accessorKey: 'total_borrow',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total Borrow' info='The total amount of the asset borrowed from the lending pool.' />
        ),
    },
    {
        accessorKey: 'ltv',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='LTV' info='The Borrowed amount vs. collateral value indicates loan risk.' />
        ),
    },
    {
        id: 'actions',
        cell: LendButtonCell,
    }
]
