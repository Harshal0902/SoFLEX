import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function constructMetadata({
  title = 'SoFLEX',
  description = 'Solana NFT and Synthetic Asset Lending and Borrowing Platform',
  image = '/assets/thumbnails/thumbnail.png',
  icons = '/logo/favicon.ico',
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@SoFLEX'
    },
    icons,
    metadataBase: new URL('https://www.soflex.fi'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
