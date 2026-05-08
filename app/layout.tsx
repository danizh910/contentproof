import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Nav } from '@/components/nav'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ContentProof — Verify digital files',
  description: 'Register your files, prove their integrity, detect any modification — in seconds.',
  openGraph: {
    title: 'ContentProof — Verify digital files',
    description: 'Register your files, prove their integrity, detect any modification — in seconds.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased">
          <Nav />
          <main>{children}</main>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}
