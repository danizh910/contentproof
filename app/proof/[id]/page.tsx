import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Calendar, FileType, HardDrive, User, Tag, ArrowRight, CheckCircle2 } from 'lucide-react'
import { TrustBadge } from '@/components/trust-badge'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Proof } from '@/lib/types'
import { formatFileSize } from '@/lib/hash'

interface ProofPageProps {
  params: Promise<{ id: string }>
}

async function getProofData(id: string): Promise<{ proof: Proof; verification_count: number } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/proof/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ProofPageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getProofData(id)
  if (!data) return { title: 'Proof not found — ContentProof' }
  const { proof } = data
  const title = `${proof.title || proof.file_name} — ContentProof`
  const description = `Verified proof for "${proof.file_name}". Registered on ${new Date(proof.registered_at).toLocaleDateString()}.`
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function ProofPage({ params }: ProofPageProps) {
  const { id } = await params
  const data = await getProofData(id)
  if (!data) notFound()

  const { proof, verification_count } = data
  const isExpired = proof.expires_at ? new Date(proof.expires_at) < new Date() : false

  const registeredDate = new Date(proof.registered_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const proofUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/proof/${proof.short_id}`

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Certificate card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950/50">
        {/* Gradient header strip */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-7 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">ContentProof</p>
                <p className="text-xs text-indigo-300">Verified Document</p>
              </div>
            </div>
            <TrustBadge valid={!isExpired} expired={isExpired} />
          </div>

          <div className="mt-5">
            <h1 className="text-xl font-bold text-white leading-tight">
              {proof.title || proof.file_name}
            </h1>
            {proof.description && (
              <p className="mt-2 text-sm text-indigo-200 leading-relaxed">{proof.description}</p>
            )}
          </div>
        </div>

        {/* Verified indicator */}
        <div className="border-b border-zinc-100 bg-emerald-50/60 px-7 py-3 dark:border-zinc-800 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-emerald-800 dark:text-emerald-300">
              Proof verified · {verification_count} verification{verification_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="px-7 py-6">
          <div className="space-y-3.5">
            <DetailRow icon={<FileType className="h-4 w-4" />} label="File name" value={proof.file_name} />
            <DetailRow icon={<HardDrive className="h-4 w-4" />} label="File size" value={formatFileSize(proof.file_size)} />
            <DetailRow icon={<FileType className="h-4 w-4" />} label="File type" value={proof.file_type || '—'} />
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Registered" value={registeredDate} />
            {proof.user_name && (
              <DetailRow icon={<User className="h-4 w-4" />} label="Registered by" value={proof.user_name} />
            )}
            {isExpired && proof.expires_at && (
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Expired"
                value={new Date(proof.expires_at).toLocaleDateString()}
              />
            )}
          </div>

          {/* Tags */}
          {proof.tags && proof.tags.length > 0 && (
            <div className="mt-5">
              <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                <Tag className="h-3 w-3" />
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {proof.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* SHA-256 hash */}
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                SHA-256 Hash
              </p>
              <CopyButton text={proof.sha256_hash} label="Hash" />
            </div>
            <p className="select-all break-all font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {proof.sha256_hash}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/verify" className="flex-1">
              <Button className="w-full gap-2">
                Verify your copy
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <CopyButton text={proofUrl} label="Proof link" variant="outline" className="flex-1" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Powered by{' '}
          <Link href="/" className="text-zinc-500 hover:underline dark:text-zinc-500">
            ContentProof
          </Link>
          {' '}· Proof ID: <span className="font-mono">{proof.short_id}</span>
        </p>
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-zinc-400 dark:text-zinc-600">{icon}</div>
      <span className="w-32 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{value}</span>
    </div>
  )
}
