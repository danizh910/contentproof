'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ExternalLink, FileText } from 'lucide-react'
import { Proof } from '@/lib/types'
import { truncateHash, formatFileSize } from '@/lib/hash'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function ProofCard({ proof }: { proof: Proof }) {
  const [copied, setCopied] = useState<'hash' | 'link' | null>(null)

  const copy = async (type: 'hash' | 'link') => {
    const text = type === 'hash' ? proof.sha256_hash : `${window.location.origin}/proof/${proof.short_id}`
    await navigator.clipboard.writeText(text)
    setCopied(type)
    toast.success(type === 'hash' ? 'Hash copied' : 'Link copied')
    setTimeout(() => setCopied(null), 2000)
  }

  const date = new Date(proof.registered_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <FileText className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {proof.title || proof.file_name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {proof.file_name} · {formatFileSize(proof.file_size)} · {date}
            </p>
          </div>
        </div>
        <Badge variant={proof.is_public ? 'success' : 'secondary'}>
          {proof.is_public ? 'Public' : 'Private'}
        </Badge>
      </div>

      <div className="mt-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded px-2 py-1.5 truncate">
        {truncateHash(proof.sha256_hash)}
      </div>

      {proof.tags && proof.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {proof.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => copy('hash')}
        >
          {copied === 'hash' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span className="ml-1">Hash</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => copy('link')}
        >
          {copied === 'link' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span className="ml-1">Link</span>
        </Button>
        <Link href={`/proof/${proof.short_id}`} target="_blank">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <ExternalLink className="h-3 w-3" />
            <span className="ml-1">View proof</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
