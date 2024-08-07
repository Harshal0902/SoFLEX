"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import BorrowingNFTCollectionDataType from './P2PBorrowing'
import P2PBorrowingButton from './P2PBorrowingButton'

export type BorrowingNFTCollectionDataType = {
    nft_name: string;
    nft_logo: string;
    nft_pool: string;
    nft_best_offer: string;
    nft_intrest: string;
    nft_apy: string;
    nft_duration: string;
    nft_floor_price: string;
}

export const borrowingNFTCollectionColumns = (t: (key: string) => string): ColumnDef<BorrowingNFTCollectionDataType>[] => [
    {
        accessorKey: 'nft_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('nftCollectionName')} />
        ),
    },
    {
        accessorKey: 'nft_pool',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('availableSupply')} info={t('availableSupplyInfo')} />
        ),
    },
    {
        accessorKey: 'nft_best_offer',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('bestOffer')} info={t('bestOfferInfo')} />
        ),
    },
    {
        accessorKey: 'nft_intrest',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('interest')} info={t('interestInfo')} />
        ),
    },
    {
        accessorKey: 'nft_duration',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('duration')} info={t('durationInfo')} />
        ),
    },
    {
        id: 'actions',
        cell: P2PBorrowingButton
    }
]
