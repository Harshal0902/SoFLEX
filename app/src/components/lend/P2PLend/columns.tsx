"use client"

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header-info'
import LendingNFTCollectionDataType from './P2PLending'
import { useWallet } from '@solana/wallet-adapter-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export type LendingNFTCollectionDataType = {
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
        original: LendingNFTCollectionDataType;
    };
}

const Cell: React.FC<CellProps> = ({ row }) => {
    const { connected } = useWallet();

    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <Button className='text-white' disabled={!connected}>
                        {connected ? 'Lend' : 'Connect Wallet'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='max-w-[18rem] text-center'>
                    This functionality is disabled in the live beta demo version.
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const lendingNFTCollectionColumns: ColumnDef<LendingNFTCollectionDataType>[] = [
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
