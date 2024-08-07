"use client"

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { useTranslations } from 'next-intl'
import { Settings2 } from 'lucide-react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

const formatColumnName = (columnName: string, t: (key: string) => string): string => {
    if (columnName === 'borrow_id') {
        return `${t('PortfolioPage.loanId')}`;
    } else if (columnName === 'borrowing_amount') {
        return `${t('PortfolioPage.borrowedAmount')}`;
    } else if (columnName === 'borrowing_total') {
        return `${t('PortfolioPage.repaymentTotal')}`;
    } else if (columnName === 'borrowing_due_by') {
        return `${t('PortfolioPage.dueBy')}`;
    } else if (columnName === 'borrowing_status') {
        return `${t('PortfolioPage.status')}`;
    }

    return columnName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
    const t = useTranslations();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto hidden h-8 lg:flex'
                >
                    <Settings2 className='mr-2 h-4 w-4' />
                    {t('DataTable.view')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[180px]'>
                <DropdownMenuLabel>{t('DataTable.viewColumns')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== 'undefined' && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className='capitalize'
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {formatColumnName(column.id, t)}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
