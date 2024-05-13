"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import LendingNFTCollectionDataType from './P2PLending'
import P2PLendingButton from './P2PLendingButton'

export type LendingNFTCollectionDataType = {
    nft_name: string;
    nft_logo: string;
    nft_pool: string;
    nft_best_offer: string;
    nft_intrest: string;
    nft_apy: string;
    nft_duration: string;
    nft_floor_price: string;
}

export const lendingNFTCollectionColumns: ColumnDef<LendingNFTCollectionDataType>[] = [
    {
        accessorKey: 'nft_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NFT Collection Name' />
        ),
    },
    {
        accessorKey: 'nft_pool',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Avaliable Supply' info='The total amount of the pool available for lending.' />
        ),
    },
    {
        accessorKey: 'nft_best_offer',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Best Offer' info='The Offer offered for NFT collection.' />
        ),
    },
    {
        accessorKey: 'nft_apy',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='APY' info='Earn competitive returns on your NFT assets with our innovative lending platform.' />
        ),
    },
    {
        accessorKey: 'nft_duration',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Duration' info='The duration you can lend.' />
        ),
    },
    {
        id: 'actions',
        cell: P2PLendingButton
    }
]
