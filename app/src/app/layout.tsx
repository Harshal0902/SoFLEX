import './globals.css'
import { cn, constructMetadata } from '@/lib/utils'
import { WalletConnect } from '@/context/WalletConnect'
import { ThemeProvider } from '@/components/theme-provider'
import BetaModal from '@/components/BetaModal'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import ScrollToTopBtn from '@/components/ScrollToTopBtn'
import Footer from '@/components/Footer'

export const metadata = constructMetadata();

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang='en'>
      <body className={cn('min-h-screen bg-background antialiased font-sansSerif')}>
        <WalletConnect>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <BetaModal />
            <Navbar />
            <main className='flex-grow flex-1 pt-20'>
              {children}
            </main>
            <Toaster richColors closeButton />
            <ScrollToTopBtn />
            <Footer />
          </ThemeProvider>
        </WalletConnect>
      </body>
    </html>
  );
}
