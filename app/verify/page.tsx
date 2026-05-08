'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react'
import { FileHasher } from '@/components/file-hasher'
import { Button } from '@/components/ui/button'
import { HashResult, VerifyResult } from '@/lib/types'
import { formatFileSize, truncateHash } from '@/lib/hash'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function VerifyPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [copied, setCopied] = useState(false)

  const handleHash = async (hr: HashResult) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: hr.hash }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      toast.error('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyHash = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.submittedHash)
    setCopied(true)
    toast.success('Hash copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Verify a file
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Drop the file you want to check. We'll compare its fingerprint against all registered proofs.
        </p>
      </div>

      <FileHasher
        onHash={handleHash}
        onClear={() => setResult(null)}
        label="Drop the file you want to verify"
        sublabel="The file is hashed in your browser — nothing is uploaded"
      />

      {loading && (
        <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
          <div className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
          Looking up hash in database…
        </div>
      )}

      {result && !loading && <VerifyResultCard result={result} copied={copied} onCopy={copyHash} />}
    </div>
  )
}

function VerifyResultCard({
  result,
  copied,
  onCopy,
}: {
  result: VerifyResult
  copied: boolean
  onCopy: () => void
}) {
  const config = {
    match: {
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'File matches a registered proof',
      bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800',
      titleColor: 'text-emerald-900 dark:text-emerald-200',
    },
    not_found: {
      icon: <HelpCircle className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />,
      title: 'No proof found for this file',
      bg: 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800',
      titleColor: 'text-zinc-900 dark:text-zinc-50',
    },
    mismatch: {
      icon: <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />,
      title: 'This file has been modified',
      bg: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
      titleColor: 'text-red-900 dark:text-red-200',
    },
  }[result.status]

  const proof = result.proof
  const registeredDate = proof
    ? new Date(proof.registered_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className={cn('mt-6 rounded-xl border p-6', config.bg)}>
      <div className="flex items-center gap-3">
        {config.icon}
        <h2 className={cn('text-lg font-semibold', config.titleColor)}>{config.title}</h2>
      </div>

      {result.status === 'match' && proof && (
        <div className="mt-5 space-y-3 text-sm">
          <Row label="File" value={proof.file_name} />
          <Row label="Size" value={formatFileSize(proof.file_size)} />
          <Row label="Registered" value={registeredDate!} />
          {proof.user_name && <Row label="By" value={proof.user_name} />}
          {proof.description && <Row label="Description" value={proof.description} />}
          <div className="pt-2 flex gap-2">
            <Link href={`/proof/${proof.short_id}`} target="_blank">
              <Button size="sm" variant="outline" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                View proof page
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={onCopy} className="gap-1">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              Copy hash
            </Button>
          </div>
        </div>
      )}

      {result.status === 'not_found' && (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">Computed hash</p>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 break-all bg-white dark:bg-zinc-950 rounded p-2 border border-zinc-200 dark:border-zinc-800 select-all">
              {result.submittedHash}
            </p>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This file hasn't been registered yet. Want to anchor it?
          </p>
          <Link href="/dashboard">
            <Button size="sm" className="gap-1">
              Register it now
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500 dark:text-zinc-400 shrink-0">{label}</span>
      <span className="text-zinc-900 dark:text-zinc-50 text-right">{value}</span>
    </div>
  )
}
