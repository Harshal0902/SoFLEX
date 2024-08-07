"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import LendingAssetDataType from './DeFiLending'
import DeFiLendingButton from './DeFiLendingButton'

export type LendingAssetDataType = {
    asset_name: string;
    asset_symbol: string;
    asset_logo: string;
    asset_price: string;
    asset_total_supply: string;
    asset_yield: string;
    asset_total_borrow: string;
    asset_ltv: string;
}

export const lendingAssetColumns = (t: (key: string) => string): ColumnDef<LendingAssetDataType>[] => [
    {
        accessorKey: 'asset_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('assetName')} />
        ),
    },
    {
        accessorKey: 'asset_total_supply',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('totalSupply')} info={t('totalSupplyInfo')} />
        ),
    },
    {
        accessorKey: 'asset_yield',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('assetYield')} info={t('assetYieldInfo')} />
        ),
    },
    {
        accessorKey: 'asset_total_borrow',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('totalBorrow')} info={t('totalBorrowInfo')} />
        ),
    },
    {
        accessorKey: 'asset_ltv',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('ltv')} info={t('ltvInfo')} />
        ),
    },
    {
        id: 'actions',
        cell: DeFiLendingButton,
    }
]
