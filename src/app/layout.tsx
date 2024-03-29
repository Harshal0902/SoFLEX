import './globals.css'
import { cn, constructMetadata } from '@/lib/utils'
import { WalletConnect } from '@/context/WalletConnect'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import { Toaster } from '@/components/ui/sonner'

export const metadata = constructMetadata();

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background antialiased font-sansSerif')}>
        <WalletConnect>
          <main className='flex-grow flex-1'>
            <Suspense fallback={<Preloader />}>
              {children}
            </Suspense>
          </main>
          <Toaster richColors closeButton />
        </WalletConnect>
      </body>
    </html>
  );
}
