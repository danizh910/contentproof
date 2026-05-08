'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  label?: string
  variant?: ButtonProps['variant']
  className?: string
}

export function CopyButton({ text, label = 'Copied', variant = 'ghost', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(`${label} copied`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={cn('gap-2', className)}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {label ? `Copy ${label}` : 'Copy'}
    </Button>
  )
}
