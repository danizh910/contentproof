'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { SignInButton } from '@clerk/nextjs'
import { Plus, FileText, ShieldCheck } from 'lucide-react'
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

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return <DashboardSkeleton />

  if (!isSignedIn) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-6 py-32 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <ShieldCheck className="h-7 w-7 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Sign in to continue</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            You need to be signed in to register and manage your proofs.
          </p>
        </div>
        <SignInButton mode="modal">
          <Button size="lg" className="w-full">Sign in</Button>
        </SignInButton>
      </div>
    )
  }

  return <DashboardContent />
}

function DashboardContent() {
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
    fetchProofs()
  }, [])

  const fetchProofs = async () => {
    setLoadingProofs(true)
    try {
      const res = await fetch('/api/proofs')
      const data = await res.json()
      setProofs(data.proofs ?? [])
    } catch {
      toast.error('Failed to load proofs')
    } finally {
      setLoadingProofs(false)
    }
  }

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
    if (!hashResult) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">My Proofs</h1>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Total proofs', value: proofs.length },
          { label: 'Public', value: proofs.filter(p => p.is_public).length },
          { label: 'Storage tracked', value: formatFileSize(totalSize) },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upload section */}
      <div className="mb-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Register a new file</h2>
        <FileHasher onHash={handleHash} onClear={handleClear} />

        {showForm && hashResult && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  placeholder={hashResult.fileName}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
                <Input
                  id="tags"
                  placeholder="portfolio, certificate, contract"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this file? Why are you registering it?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public" className="cursor-pointer">
                Public — anyone with the link can verify this proof
              </Label>
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
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : proofs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              'bg-zinc-100 dark:bg-zinc-800'
            )}>
              <FileText className="h-6 w-6 text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">No proofs yet</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Register your first file using the form above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {proofs.map(proof => (
              <ProofCard key={proof.id} proof={proof} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Skeleton className="mb-8 h-8 w-32" />
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
      </div>
      <Skeleton className="mb-10 h-40 rounded-xl" />
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
    </div>
  )
}
