"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import BorrowingNFTCollectionDataType from './P2PBorrowing'
import P2PBorrowButtonCell from './P2PBorrowButtonCell'

export type BorrowingNFTCollectionDataType = {
    nftName: string;
    nftLogo: string;
    nftPool: string;
    neftBestOffer?: string;
    nftIntrest?: string;
    nftAPY?: string;
    nftDuration: string;
}

export const borrowingNFTCollectionColumns: ColumnDef<BorrowingNFTCollectionDataType>[] = [
    {
        accessorKey: 'nftName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NFT Collection Name'/>
        ),
    },
    {
        accessorKey: 'nftPool',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Avaliable Supply' info='The total amount of the pool available for borrowing.' />
        ),
    },
    {
        accessorKey: 'neftBestOffer',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Best Offer' info='The Offer offered for NFT collection.' />
        ),
    },
    {
        accessorKey: 'nftIntrest',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Interest' info='The available on borrowing the NFT collection.' />
        ),
    },
    {
        accessorKey: 'nftDuration',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Duration' info='The duration you can borrow.' />
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: P2PBorrowButtonCell
    }
]
