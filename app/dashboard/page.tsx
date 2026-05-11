'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, FileText, Globe, Database } from 'lucide-react'
import { FileHasher } from '@/components/file-hasher'
import { ProofCard } from '@/components/proof-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { HashResult, Proof } from '@/lib/types'
import { formatFileSize } from '@/lib/hash'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function getOrCreateSessionId(): string {
  let id = localStorage.getItem('cp_session')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('cp_session', id)
  }
  return id
}

export default function DashboardPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [proofs, setProofs] = useState<Proof[]>([])
  const [loadingProofs, setLoadingProofs] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [hashResult, setHashResult] = useState<HashResult | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  const fetchProofs = useCallback(async (sid: string) => {
    setLoadingProofs(true)
    try {
      const res = await fetch(`/api/proofs?session=${sid}`)
      const data = await res.json()
      setProofs(data.proofs ?? [])
    } catch {
      toast.error('Failed to load proofs')
    } finally {
      setLoadingProofs(false)
    }
  }, [])

  useEffect(() => {
    if (sessionId) fetchProofs(sessionId)
  }, [sessionId, fetchProofs])

  const handleHash = (hr: HashResult) => {
    setHashResult(hr)
    setShowForm(true)
  }

  const handleClear = () => {
    setHashResult(null)
    setShowForm(false)
    setTitle('')
    setDescription('')
    setTags('')
    setIsPublic(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hashResult || !sessionId) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          file_name: hashResult.fileName,
          file_size: hashResult.fileSize,
          file_type: hashResult.fileType,
          sha256_hash: hashResult.hash,
          title: title || null,
          description: description || null,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          is_public: isPublic,
        }),
      })
      if (res.status === 409) {
        toast.error('This file has already been registered')
        return
      }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setProofs(prev => [data.proof, ...prev])
      toast.success('Proof registered successfully')
      handleClear()
    } catch {
      toast.error('Failed to register proof')
    } finally {
      setSubmitting(false)
    }
  }

  const totalSize = proofs.reduce((sum, p) => sum + p.file_size, 0)

  if (!sessionId) return <DashboardSkeleton />

  const stats = [
    {
      label: 'Total proofs',
      value: proofs.length,
      icon: <FileText className="h-4 w-4" />,
      iconBg: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Public',
      value: proofs.filter(p => p.is_public).length,
      icon: <Globe className="h-4 w-4" />,
      iconBg: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Storage tracked',
      value: formatFileSize(totalSize),
      icon: <Database className="h-4 w-4" />,
      iconBg: 'from-violet-500 to-violet-600',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">My Proofs</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Proofs are linked to this browser. Accounts &amp; sync coming soon.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-white ${stat.iconBg}`}>
                {stat.icon}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Upload */}
      <div className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-1.5 font-semibold text-zinc-900 dark:text-zinc-50">Register a new file</h2>
        <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
          Hash your file locally and anchor its fingerprint in the database.
        </p>
        <FileHasher onHash={handleHash} onClear={handleClear} />

        {showForm && hashResult && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title <span className="text-zinc-400">(optional)</span></Label>
                <Input
                  id="title"
                  placeholder={hashResult.fileName}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags <span className="text-zinc-400">(comma-separated, optional)</span></Label>
                <Input
                  id="tags"
                  placeholder="portfolio, certificate, contract"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description <span className="text-zinc-400">(optional)</span></Label>
              <Textarea
                id="description"
                placeholder="What is this file? Why are you registering it?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
              <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              <div>
                <Label htmlFor="public" className="cursor-pointer font-medium">
                  {isPublic ? 'Public' : 'Private'}
                </Label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {isPublic
                    ? 'Anyone with the link can verify this proof'
                    : 'Only you can see this proof'}
                </p>
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Register Proof
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Proof list */}
      <div>
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Registered proofs</h2>
        {loadingProofs ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : proofs.length === 0 ? (
          <div className={cn(
            'flex flex-col items-center gap-4 rounded-2xl border border-dashed py-16 text-center',
            'border-zinc-200 dark:border-zinc-800'
          )}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 dark:from-indigo-950/50 dark:to-violet-950/50 dark:border-indigo-900/50">
              <FileText className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">No proofs yet</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Register your first file using the form above.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {proofs.map(proof => <ProofCard key={proof.id} proof={proof} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="mb-8 h-4 w-64" />
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="mb-10 h-48 rounded-2xl" />
    </div>
  )
}
