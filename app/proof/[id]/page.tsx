import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Calendar, FileType, HardDrive, User, Tag, ArrowRight } from 'lucide-react'
import { TrustBadge } from '@/components/trust-badge'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-zinc-400" />
        <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">ContentProof · Verified Document</span>
      </div>

      {/* Title + badge */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {proof.title || proof.file_name}
          </h1>
          <TrustBadge valid={!isExpired} expired={isExpired} />
        </div>
        {proof.description && (
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 leading-relaxed">{proof.description}</p>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Details */}
      <div className="space-y-4 mb-8">
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
        <DetailRow
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Verifications"
          value={`${verification_count} time${verification_count !== 1 ? 's' : ''}`}
        />
      </div>

      {/* Tags */}
      {proof.tags && proof.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Tag className="h-3 w-3" />
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {proof.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* SHA-256 hash */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            SHA-256 Hash
          </p>
          <CopyButton text={proof.sha256_hash} label="Hash" />
        </div>
        <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 break-all select-all leading-relaxed">
          {proof.sha256_hash}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/verify`} className="flex-1">
          <Button className="w-full gap-2">
            Verify your copy
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <CopyButton text={proofUrl} label="Proof link" variant="outline" className="flex-1" />
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          Powered by{' '}
          <Link href="/" className="hover:underline">
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
      <div className="text-zinc-400 dark:text-zinc-600 shrink-0">{icon}</div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400 w-32 shrink-0">{label}</span>
      <span className="text-sm text-zinc-900 dark:text-zinc-50 font-medium">{value}</span>
    </div>
  )
}
