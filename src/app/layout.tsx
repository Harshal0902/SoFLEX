import './globals.css'
import { cn, constructMetadata } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
// import AuthProvider from '@/context/AuthProvider'
// import { Web3Modal } from '@/context/Web3Modal'
// import BetaModal from '@/components/BetaModal'
// import Navbar from '@/components/Navbar'
import { Suspense } from 'react'
import Preloader from '@/components/Preloader'
import { Toaster } from '@/components/ui/sonner'
// import ScrollToTopBtn from '@/components/ScrollToTopBtn'
// import Footer from '@/components/Footer'

export const metadata = constructMetadata();

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background antialiased font-sansSerif')}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
        {/* <main className='flex-grow flex-1 pt-20'> */}
        <main className='flex-grow flex-1'>
          <Suspense fallback={<Preloader />}>
            {children}
          </Suspense>
        </main>
        <Toaster richColors closeButton />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
