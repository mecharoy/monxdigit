import type { Metadata } from 'next'
import { Syne, Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
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
    <html lang="en" className={`${syne.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
