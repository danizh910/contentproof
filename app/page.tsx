import Link from 'next/link'
import { ArrowRight, ShieldCheck, Search, Share2, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        {/* Subtle ambient glow — positioned low so it doesn't wash out the headline */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[700px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-300/20 via-violet-300/20 to-indigo-300/20 blur-3xl dark:from-indigo-700/15 dark:via-violet-700/15 dark:to-indigo-700/15" />

        {/* Top content */}
        <div className="text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Lock className="h-3 w-3" />
            SHA-256 · processed entirely in your browser · no uploads
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
            Verify digital files
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              before you trust them.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            Register your files, prove their integrity, detect any modification — in seconds.
            No account needed to verify.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-400 dark:text-zinc-600">
            {['SHA-256 cryptographic hashing', 'Zero uploads — 100% client-side', 'Free to use'].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-indigo-400 dark:bg-indigo-700" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Product mockup */}
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/80 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950/60">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
                contentproof.app/verify
              </div>
            </div>

            {/* App content preview */}
            <div className="p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Verify a file</p>
                  <p className="text-xs text-zinc-400">Drop a file to check its fingerprint</p>
                </div>
              </div>

              {/* Verified result card */}
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:to-zinc-950">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-100">File matches a registered proof</p>
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-500 mt-0.5">This file is authentic and unmodified.</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5 rounded-xl border border-white/70 bg-white/70 p-4 text-sm dark:border-zinc-800/70 dark:bg-zinc-950/70">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">File</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">contract_final_v3.pdf</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Size</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">2.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Registered</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">May 11, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-t border-zinc-100 bg-zinc-50/70 dark:border-zinc-900 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
              Everything you need
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Built for trust, not complexity
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-white" />}
              iconBg="from-indigo-500 to-indigo-600"
              title="Register"
              description="Hash your file with SHA-256 and anchor it permanently in our database. Proof of existence, tied to a timestamp."
            />
            <FeatureCard
              icon={<Search className="h-5 w-5 text-white" />}
              iconBg="from-violet-500 to-violet-600"
              title="Verify"
              description="Drop any file to instantly check if it matches a registered proof. Detect tampering down to a single changed byte."
            />
            <FeatureCard
              icon={<Share2 className="h-5 w-5 text-white" />}
              iconBg="from-blue-500 to-blue-600"
              title="Share"
              description="Generate a public proof link anyone can open — no account needed. Works like a digital certificate."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-4xl px-6 py-24">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3">
            Simple by design
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            How it works
          </h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-4">
          {[
            { step: '1', title: 'Drop your file', body: 'Your browser computes a SHA-256 fingerprint. The file never leaves your device.' },
            { step: '2', title: 'Register the hash', body: 'We store the hash, filename, size, and a timestamp. Anyone can verify it later.' },
            { step: '3', title: 'Share the proof', body: 'Copy a short link. Whoever has the original file can confirm it matches — instantly.' },
          ].map((item, i) => (
            <div key={item.step} className="relative flex flex-col gap-4">
              {i < 2 && (
                <div className="absolute top-5 left-12 right-0 hidden h-px bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800 sm:block" />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/20">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1.5">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700">
          <div className="relative px-8 py-12 text-center sm:py-14 sm:flex sm:items-center sm:justify-between sm:text-left">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative mb-6 sm:mb-0">
              <h2 className="text-2xl font-bold text-white">Ready to protect your work?</h2>
              <p className="mt-1.5 text-indigo-200 text-sm">Free for individuals. No credit card required.</p>
            </div>
            <Link href="/dashboard" className="relative shrink-0">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 from-white to-white shadow-lg font-semibold border-0">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 dark:border-zinc-900">
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} ContentProof · Hashing powered by the Web Crypto API
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-7 transition-all duration-200 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-zinc-900/50">
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-sm`}>
        {icon}
      </div>
      <h3 className="mb-2.5 font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}
