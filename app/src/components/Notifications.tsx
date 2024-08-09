import { BellRing } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
// import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
// import Link from 'next/link'

interface Notification {
    title: string
    notificationTime: string
}

type CardProps = React.ComponentProps<typeof Card>

export default function Notifications({ className, ...props }: CardProps) {
    const t = useTranslations('Notifications');

    const notifications: Notification[] = [
        {
            title: `${t('notification1')}`,
            notificationTime: `${t('notificationTime')}`
        },
        {
            title: `${t('notification2')}`,
            notificationTime: `${t('notificationTime')}`
        },
        {
            title: `${t('notification3')}`,
            notificationTime: `${t('notificationTime')}`
        }
    ]

    return (
        <div className={cn('w-[250px]', className)} {...props}>
            <h1 className='text-xl font-semibold tracking-wide'>{t('title')}</h1>
            <p className='text-muted-foreground'>{t('description')}</p>
            <div className='py-2 grid gap-y-5'>
                <div className='flex items-center space-x-4 rounded-md border p-4'>
                    <BellRing />
                    <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {t('pushNotification')}
                        </p>
                    </div>
                    <Switch />
                </div>
                <div>
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className='mb-4 grid grid-cols-[15px_1fr] items-start pb-0 last:mb-0 last:pb-0'
                        >
                            <span className='flex h-2 w-2 translate-y-1 rounded-full bg-sky-500' />
                            <div className='space-y-1'>
                                <p className='text-sm font-medium leading-none'>
                                    {notification.title}
                                </p>
                                <p className='text-sm text-muted-foreground'>
                                    {notification.notificationTime}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <Button className='w-full' asChild>
                    <Link href='/notifications'>
                        {t('allNotifications)}
                    </Link>
                </Button> */}
            </div>
        </div>
    )
}
