'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Loader2, FileText, X } from 'lucide-react'
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
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
              <FileText className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{result.fileName}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatFileSize(result.fileSize)} · {result.fileType}
              </p>
            </div>
          </div>
          <button onClick={clear} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">SHA-256</p>
          <p className="font-mono text-xs break-all text-zinc-700 dark:text-zinc-300 select-all bg-white dark:bg-zinc-950 rounded p-2 border border-zinc-200 dark:border-zinc-800">
            {result.hash}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-colors cursor-pointer',
        dragging
          ? 'border-zinc-600 bg-zinc-100 dark:border-zinc-400 dark:bg-zinc-900'
          : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50'
      )}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !hashing && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" className="sr-only" onChange={handleChange} />
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {hashing ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-zinc-400 mb-4" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Computing SHA-256 hash…</p>
            <p className="text-xs text-zinc-400 mt-1">Processing entirely in your browser</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-zinc-400 mb-4" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label || 'Drop any file here or click to browse'}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {sublabel || 'PDF, PNG, DOCX, MP4, ZIP — any format'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
