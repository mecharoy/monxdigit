import type { Metadata } from 'next'
import { Outfit, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'monxdigit | Helping Niche Find Their Audience',
  description: 'Expert Meta & Google Ads management for small businesses and e-commerce brands. Data-driven campaigns that generate real leads and measurable ROI.',
  keywords: ['digital marketing', 'facebook ads', 'google ads', 'lead generation', 'social media marketing'],
  authors: [{ name: 'monxdigit' }],
  openGraph: {
    title: 'monxdigit | Helping Niche Find Their Audience',
    description: 'Expert Meta & Google Ads management for small businesses and e-commerce brands.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
