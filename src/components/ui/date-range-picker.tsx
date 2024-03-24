"use client"

import * as React from 'react'
import { CalendarRange } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function CalendarDateRangePicker({ className, }: React.HTMLAttributes<HTMLDivElement>) {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDate = new Date(oneWeekLater.getFullYear(), oneWeekLater.getMonth(), oneWeekLater.getDate());

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: startDate,
        to: endDate,
    })

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id='date'
                        variant={'outline'}
                        className={cn(
                            'w-[220px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarRange className='mr-2 h-4 w-4' />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'dd LLL, y')} -{' '}
                                    {format(date.to, 'dd LLL, y')}
                                </>
                            ) : (
                                format(date.from, 'dd LLL, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='end'>
                    <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
