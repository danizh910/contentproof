'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Copy, Check, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react'
import { FileHasher } from '@/components/file-hasher'
import { Button } from '@/components/ui/button'
import { HashResult, VerifyResult } from '@/lib/types'
import { formatFileSize } from '@/lib/hash'
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
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/60 dark:text-indigo-400">
          <ShieldCheck className="h-3 w-3" />
          Instant verification
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Verify a file
        </h1>
        <p className="mt-3 leading-relaxed text-zinc-500 dark:text-zinc-400">
          Drop the file you want to check. We'll compare its fingerprint against all registered proofs instantly.
        </p>
      </div>

      <FileHasher
        onHash={handleHash}
        onClear={() => setResult(null)}
        label="Drop the file you want to verify"
        sublabel="The file is hashed in your browser — nothing is uploaded"
      />

      {loading && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
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
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      title: 'File matches a registered proof',
      subtitle: 'This file is authentic and unmodified.',
      border: 'border-emerald-200 dark:border-emerald-900',
      bg: 'bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-zinc-950',
      titleColor: 'text-emerald-900 dark:text-emerald-100',
      subtitleColor: 'text-emerald-700/80 dark:text-emerald-500',
    },
    not_found: {
      icon: <HelpCircle className="h-6 w-6 text-zinc-400" />,
      iconBg: 'bg-zinc-100 dark:bg-zinc-800',
      title: 'No proof found for this file',
      subtitle: 'This file has not been registered yet.',
      border: 'border-zinc-200 dark:border-zinc-800',
      bg: 'bg-zinc-50 dark:bg-zinc-900/50',
      titleColor: 'text-zinc-900 dark:text-zinc-50',
      subtitleColor: 'text-zinc-500 dark:text-zinc-400',
    },
    mismatch: {
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      title: 'File has been modified',
      subtitle: 'This file does not match any registered proof.',
      border: 'border-red-200 dark:border-red-900',
      bg: 'bg-gradient-to-br from-red-50/80 to-white dark:from-red-950/20 dark:to-zinc-950',
      titleColor: 'text-red-900 dark:text-red-100',
      subtitleColor: 'text-red-700/80 dark:text-red-500',
    },
  }[result.status]

  const proof = result.proof
  const registeredDate = proof
    ? new Date(proof.registered_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div className={cn('mt-5 rounded-2xl border p-6', config.border, config.bg)}>
      <div className="flex items-start gap-4">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', config.iconBg)}>
          {config.icon}
        </div>
        <div>
          <h2 className={cn('text-lg font-bold', config.titleColor)}>{config.title}</h2>
          <p className={cn('mt-0.5 text-sm', config.subtitleColor)}>{config.subtitle}</p>
        </div>
      </div>

      {result.status === 'match' && proof && (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-white/70 bg-white/70 p-4 dark:border-zinc-800/70 dark:bg-zinc-950/70">
            <div className="space-y-2.5">
              <Row label="File" value={proof.file_name} />
              <Row label="Size" value={formatFileSize(proof.file_size)} />
              <Row label="Registered" value={registeredDate!} />
              {proof.user_name && <Row label="By" value={proof.user_name} />}
              {proof.description && <Row label="Description" value={proof.description} />}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/proof/${proof.short_id}`} target="_blank">
              <Button size="sm" variant="outline" className="gap-1.5 bg-white/80 dark:bg-zinc-900/80">
                <ExternalLink className="h-3.5 w-3.5" />
                View proof page
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={onCopy} className="gap-1.5 bg-white/80 dark:bg-zinc-900/80">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy hash
            </Button>
          </div>
        </div>
      )}

      {result.status === 'not_found' && (
        <div className="mt-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Computed hash
            </p>
            <p className="select-all break-all rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              {result.submittedHash}
            </p>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This file hasn't been registered yet. Want to anchor it?
          </p>
          <Link href="/dashboard">
            <Button size="sm" className="gap-1.5">
              Register it now
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="shrink-0 text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-right font-medium text-zinc-900 dark:text-zinc-50">{value}</span>
    </div>
  )
}
