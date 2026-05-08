import { ShieldCheck, ShieldX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrustBadgeProps {
  valid: boolean
  expired?: boolean
  className?: string
}

export function TrustBadge({ valid, expired, className }: TrustBadgeProps) {
  const isValid = valid && !expired

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-sm',
        isValid
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        className
      )}
    >
      {isValid ? (
        <ShieldCheck className="h-4 w-4" />
      ) : (
        <ShieldX className="h-4 w-4" />
      )}
      {expired ? 'Expired' : isValid ? 'Verified' : 'Invalid'}
    </div>
  )
}
