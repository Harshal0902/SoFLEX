"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header-info'
import BorrowingAssetDataType from './P2PBorrowing'
import { Button } from '@/components/ui/button'

export type BorrowingAssetDataType = {
    nftName: string;
    nftLogo: string;
    nftPool: string;
    neftBestOffer?: string;
    nftIntrest?: string;
    nftAPY?: string;
    nftDuration: string;
}

export const borrowingAssetColumns: ColumnDef<BorrowingAssetDataType>[] = [
    {
        accessorKey: 'nftName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NFT Collection Name' info='The name of the NFT Collection available for borrowing.' />
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
        cell: ({ row }) => {
            const order = row.original

            return (
                <Button className='text-white'>Borrow</Button>
            )
        }
    }
]
