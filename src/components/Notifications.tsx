import { BellRing } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

interface Notification {
    title: string
    noteficationTime: string
}

const notifications: Notification[] = [
    {
        title: 'Subscribe to our newsletter for updates!',
        noteficationTime: '1 hour ago'
    },
    {
        title: 'Welcome to the Beta Version!',
        noteficationTime: '1 hour ago'
    },
    {
        title: 'Welcome to SoFLEX!',
        noteficationTime: '2 hours ago'
    }
]

type CardProps = React.ComponentProps<typeof Card>

export default function Notifications({ className, ...props }: CardProps) {
    return (
        <div className={cn('w-[250px]', className)} {...props}>
            <h1 className='text-xl font-semibold tracking-wide'>Notifications</h1>
            <p className='text-muted-foreground'>You have 3 unread messages.</p>
            <div className='py-2 grid gap-y-5'>
                <div className='flex items-center space-x-4 rounded-md border p-4'>
                    <BellRing />
                    <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            Push Notifications
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
                                    {notification.noteficationTime}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <Button className='w-full text-white' asChild>
                    <Link href='/notifications'>
                        See All Notifications
                    </Link>
                </Button>
            </div>
        </div>
    )
}
