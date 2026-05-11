'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ExternalLink, FileText, Globe, Lock } from 'lucide-react'
import { Proof } from '@/lib/types'
import { truncateHash, formatFileSize } from '@/lib/hash'
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
    <div className="group rounded-xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 dark:border-indigo-900/50 dark:from-indigo-950/50 dark:to-violet-950/50">
            <FileText className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50 truncate leading-tight">
              {proof.title || proof.file_name}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
              <span>{formatFileSize(proof.file_size)}</span>
              <span className="text-zinc-200 dark:text-zinc-700">·</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        {proof.is_public ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Globe className="h-2.5 w-2.5" />
            Public
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-400">
            <Lock className="h-2.5 w-2.5" />
            Private
          </span>
        )}
      </div>

      <div className="mt-3 truncate rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
        {truncateHash(proof.sha256_hash)}
      </div>

      {proof.tags && proof.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {proof.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          onClick={() => copy('hash')}
        >
          {copied === 'hash' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          Copy hash
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          onClick={() => copy('link')}
        >
          {copied === 'link' ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          Copy link
        </Button>
        <Link href={`/proof/${proof.short_id}`} target="_blank" className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ExternalLink className="h-3 w-3" />
            View proof
          </Button>
        </Link>
      </div>
    </div>
  )
}
