'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignOutButton, useAuth } from '@clerk/nextjs'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Nav() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/verify', label: 'Verify' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <ShieldCheck className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
          ContentProof
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 sm:flex">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                pathname === link.href
                  ? 'text-zinc-900 font-medium dark:text-zinc-50'
                  : 'text-zinc-500 dark:text-zinc-400'
              )}
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn ? (
            <SignOutButton>
              <Button variant="outline" size="sm">Sign out</Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Sign in</Button>
            </SignInButton>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="sm:hidden p-2 text-zinc-500"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950 sm:hidden">
          <div className="flex flex-col gap-3">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-700 dark:text-zinc-300"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isSignedIn ? (
              <SignOutButton>
                <Button variant="outline" size="sm" className="w-full">Sign out</Button>
              </SignOutButton>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="w-full">Sign in</Button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
