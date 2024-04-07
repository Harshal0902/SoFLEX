"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header-info'
import LendingAssetDataType from './P2PLending'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'

export type LendingAssetDataType = {
    nftName: string;
    nftLogo: string;
    nftPool: string;
    neftBestOffer?: string;
    nftIntrest?: string;
    nftAPY?: string;
    nftDuration: string;
}

interface CellProps {
    row: {
        original: LendingAssetDataType;
    };
}

const Cell: React.FC<CellProps> = ({ row }) => {
    const { connected } = useWallet();

    return (
        <Button className='text-white' disabled={!connected}>
            {connected ? 'Lend' : 'Connect Wallet'}
        </Button>
    );
};

export const lendingAssetColumns: ColumnDef<LendingAssetDataType>[] = [
    {
        accessorKey: 'nftName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NFT Collection Name' info='The name of the NFT Collection available for lending.' />
        ),
    },
    {
        accessorKey: 'nftPool',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Avaliable Supply' info='The total amount of the pool available for lending.' />
        ),
    },
    {
        accessorKey: 'neftBestOffer',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Best Offer' info='The Offer offered for NFT collection.' />
        ),
    },
    {
        accessorKey: 'nftAPY',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='APY' info='Earn competitive returns on your NFT assets with our innovative lending platform.' />
        ),
    },
    {
        accessorKey: 'nftDuration',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Duration' info='The duration you can lend.' />
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: Cell
    }
]
