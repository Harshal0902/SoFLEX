import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const t = useTranslations('DataTable');
    const { pageIndex, pageSize } = table.getState().pagination;
    const rowCount = table.getRowCount();
    const startIndex = pageIndex * pageSize + 1;
    const endIndex = Math.min((pageIndex + 1) * pageSize, rowCount);

    return (
        <>
            {rowCount > 0 && (
                <div className='flex flex-col md:flex-row items-center justify-between px-2 md:px-4 py-2 w-full'>
                    <div className='flex-1 text-sm text-muted-foreground'>
                        {t('showing')} <strong>{startIndex}-{endIndex}</strong> {t('of')} <strong>{rowCount}</strong> {t('borrowings')}
                    </div>
                    <div className='flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-6 lg:space-x-8'>
                        <div className='flex items-center space-x-2 py-2'>
                            <p className='text-sm font-medium'>{t('rowsPerPage')}</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className='h-8 w-[70px]'>
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side='top'>
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                            {t('page')} {table.getState().pagination.pageIndex + 1} {t('of')}{' '}
                            {table.getPageCount()}
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Button
                                variant='outline'
                                className='h-8 w-8 p-0'
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronsLeft className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='outline'
                                className='h-8 w-8 p-0'
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='outline'
                                className='h-8 w-8 p-0'
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='outline'
                                className='h-8 w-8 p-0'
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronsRight className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
