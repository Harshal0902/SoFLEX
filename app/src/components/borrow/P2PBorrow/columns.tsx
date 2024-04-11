"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header-info'
import BorrowingNFTCollectionDataType from './P2PBorrowing'
import { useWallet } from '@solana/wallet-adapter-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export type BorrowingNFTCollectionDataType = {
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
        original: BorrowingNFTCollectionDataType;
    };
}

const Cell: React.FC<CellProps> = ({ row }) => {
    const { connected } = useWallet();

    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button className='text-white' disabled={!connected}>
                        {connected ? 'Borrow' : 'Connect Wallet'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='max-w-[18rem] text-center'>
                    This functionality is disabled in the live beta demo version.
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const borrowingNFTCollectionColumns: ColumnDef<BorrowingNFTCollectionDataType>[] = [
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
        cell: Cell
    }
]
