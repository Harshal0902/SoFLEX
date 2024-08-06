import React from 'react'
import { BadgeInfo } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslations } from 'next-intl'

export default function InfoButton() {
    const t = useTranslations('InfoBtn');

    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <BadgeInfo className='h-5 w-5 text-primary cursor-pointer' />
                </TooltipTrigger>
                <TooltipContent className='max-w-[18rem] text-center tracking-wide'>
                    {t('title')}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
