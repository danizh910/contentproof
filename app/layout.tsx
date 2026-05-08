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

// NEXT_PUBLIC_ vars are embedded at build time — check once at module level
const CLERK_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const html = (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased">
        <Nav clerkEnabled={CLERK_ENABLED} />
        <main>{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )

  // Only wrap with ClerkProvider if the publishable key is present —
  // without it ClerkProvider throws and crashes every page at runtime.
  if (!CLERK_ENABLED) return html
  return <ClerkProvider>{html}</ClerkProvider>
}
