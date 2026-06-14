import type { Metadata } from 'next'
import { Bodoni_Moda, Jost } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/hooks/use-language'
import { Toaster } from '@/components/ui/toaster'
import { MotionProvider } from '@/components/providers/motion-provider'

// Bodoni Moda — luxury serif display, high-contrast elegance matching the handcrafted bronze coin identity
const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Jost — geometric sans for body text, UI, navigation — refined and clean
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mr. Ismail Trading LLC - Wholesale Mobile Phones & Accessories Dubai',
    template: '%s | Mr. Ismail Trading LLC',
  },
  description:
    'Leading B2B wholesale supplier of mobile phones and accessories in Dubai, UAE. Serving retailers across the GCC with competitive pricing.',
  keywords: [
    'wholesale mobile phones Dubai',
    'B2B mobile accessories UAE',
    'bulk smartphones supplier',
    'mobile trading company Dubai',
    'wholesale accessories GCC',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Mr. Ismail Trading LLC',
    title: 'Mr. Ismail Trading LLC - Wholesale Mobile Phones & Accessories Dubai',
    description: 'Leading B2B wholesale supplier of mobile phones and accessories in Dubai, UAE.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${bodoniModa.variable} ${jost.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <LanguageProvider>
          <MotionProvider>
            {children}
            <Toaster />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
