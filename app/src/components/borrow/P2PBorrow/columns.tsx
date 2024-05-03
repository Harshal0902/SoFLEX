"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import BorrowingNFTCollectionDataType from './P2PBorrowing'
import P2PBorrowingButton from './P2PBorrowingButton'

export type BorrowingNFTCollectionDataType = {
    nft_name: string;
    nft_logo: string;
    nft_pool: string;
    nft_best_offer?: string;
    nft_intrest?: string;
    nft_apy?: string;
    nft_duration: string;
}

export const borrowingNFTCollectionColumns: ColumnDef<BorrowingNFTCollectionDataType>[] = [
    {
        accessorKey: 'nft_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NFT Collection Name'/>
        ),
    },
    {
        accessorKey: 'nft_pool',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Avaliable Supply' info='The total amount of the pool available for borrowing.' />
        ),
    },
    {
        accessorKey: 'nft_best_offer',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Best Offer' info='The Offer offered for NFT collection.' />
        ),
    },
    {
        accessorKey: 'nft_intrest',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Interest' info='The available on borrowing the NFT collection.' />
        ),
    },
    {
        accessorKey: 'nft_duration',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Duration' info='The duration you can borrow.' />
        ),
    },
    {
        id: 'actions',
        cell: P2PBorrowingButton
    }
]
