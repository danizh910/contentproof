import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Auth is not yet enabled — will be wired up with Clerk once configured.
export default function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <ShieldCheck className="h-7 w-7 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Accounts coming soon
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            User accounts aren&apos;t enabled yet. You can still register and verify files from the dashboard — no account needed.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="w-full">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
