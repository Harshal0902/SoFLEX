import React from 'react'
import { BadgeInfo } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function DummyDataInfoButton() {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <BadgeInfo className='h-5 w-5 text-primary cursor-pointer' />
                </TooltipTrigger>
                <TooltipContent className='max-w-[18rem] text-center tracking-wide'>
                    Submit functionality is disabled in the live beta demo version.
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
