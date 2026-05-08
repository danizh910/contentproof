import Link from 'next/link'
import { ArrowRight, ShieldCheck, Search, Share2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-24 pt-20 text-center sm:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <Lock className="h-3 w-3" />
          SHA-256 · processed entirely in your browser · no uploads
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Verify digital files{' '}
          <span className="text-zinc-400 dark:text-zinc-500">before you trust them.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
          Register your files, prove their integrity, detect any modification — in seconds.
          No account needed to verify.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Register a file
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/verify">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Verify a file
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-t border-zinc-100 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 sm:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Register"
              description="Hash your file with SHA-256 and anchor it permanently in our database. Proof of existence, tied to a timestamp."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Verify"
              description="Drop any file to instantly check if it matches a registered proof. Detect tampering down to a single changed byte."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Share"
              description="Generate a public proof link anyone can open — no account needed. Works like a digital certificate."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-4xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-12">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: '01', title: 'Drop your file', body: 'Your browser computes a SHA-256 fingerprint. The file never leaves your device.' },
            { step: '02', title: 'Register the hash', body: 'We store the hash, filename, size, and a timestamp. Anyone can verify it later.' },
            { step: '03', title: 'Share the proof', body: 'Copy a short link. Whoever has the original file can confirm it matches — instantly.' },
          ].map(item => (
            <div key={item.step} className="flex flex-col gap-2">
              <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-600">{item.step}</span>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Ready to protect your work?
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Free for individuals. No credit card required.
            </p>
          </div>
          <Link href="/dashboard">
            <Button size="lg" className="shrink-0">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 dark:border-zinc-900">
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} ContentProof. Hashing powered by the Web Crypto API.
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}
