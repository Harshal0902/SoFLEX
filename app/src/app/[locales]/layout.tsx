import './globals.css'
import { cn, constructMetadata } from '@/lib/utils'
import { WalletConnect } from '@/context/WalletConnect'
import { CSPostHogProvider } from '@/app/_analytics/provider'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from '@/components/theme-provider'
import BetaModal from '@/components/BetaModal'
import { Toaster } from '@/components/ui/sonner'
import ScrollToTopBtn from '@/components/ScrollToTopBtn'

export const metadata = constructMetadata();

export default async function RootLayout({ children, params: { locale } }: Readonly<{ children: React.ReactNode; params: { locale: string }; }>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={cn('min-h-screen bg-background antialiased font-sansSerif')}>
        <WalletConnect>
          <CSPostHogProvider>
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                <BetaModal />
                <main>
                  {children}
                </main>
                <Toaster richColors closeButton />
                <ScrollToTopBtn />
              </ThemeProvider>
            </NextIntlClientProvider>
          </CSPostHogProvider>
        </WalletConnect>
      </body>
    </html>
  );
}
