'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Loader2, X, CheckCircle2 } from 'lucide-react'
import { hashFile, formatFileSize } from '@/lib/hash'
import { HashResult } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FileHasherProps {
  onHash: (result: HashResult) => void
  onClear?: () => void
  label?: string
  sublabel?: string
}

export function FileHasher({ onHash, onClear, label, sublabel }: FileHasherProps) {
  const [dragging, setDragging] = useState(false)
  const [hashing, setHashing] = useState(false)
  const [result, setResult] = useState<HashResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setHashing(true)
    try {
      const hash = await hashFile(file)
      const r: HashResult = {
        hash,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        computedAt: new Date(),
      }
      setResult(r)
      onHash(r)
    } finally {
      setHashing(false)
    }
  }, [onHash])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const clear = () => {
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear?.()
  }

  if (result) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 dark:border-emerald-900/60 dark:from-emerald-950/30 dark:to-zinc-950">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{result.fileName}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {formatFileSize(result.fileSize)} · {result.fileType}
              </p>
            </div>
          </div>
          <button
            onClick={clear}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            SHA-256 Hash
          </p>
          <p className="select-all break-all rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {result.hash}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200',
        dragging
          ? 'border-indigo-400 bg-indigo-50/60 dark:border-indigo-600 dark:bg-indigo-950/20 scale-[1.01]'
          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/30'
      )}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !hashing && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" className="sr-only" onChange={handleChange} />
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        {hashing ? (
          <>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
              <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Computing SHA-256 hash…</p>
            <p className="mt-1 text-xs text-zinc-400">Processing entirely in your browser</p>
          </>
        ) : (
          <>
            <div className={cn(
              'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200',
              dragging
                ? 'bg-indigo-100 dark:bg-indigo-900/40'
                : 'bg-zinc-100 dark:bg-zinc-800'
            )}>
              <Upload className={cn(
                'h-7 w-7 transition-colors duration-200',
                dragging ? 'text-indigo-500' : 'text-zinc-400'
              )} />
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label || 'Drop any file here or click to browse'}
            </p>
            <p className="mt-1.5 text-xs text-zinc-400">
              {sublabel || 'PDF, PNG, DOCX, MP4, ZIP — any format'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
