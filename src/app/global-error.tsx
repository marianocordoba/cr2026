'use client'

import { BugIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useCallback } from 'react'

import { Button } from '@/components/ui/button'

export default function GlobalError({ reset }: { reset: () => void }) {
  const router = useRouter()

  const handleRetry = useCallback(() => {
    router.refresh()
    startTransition(reset)
  }, [reset, router])

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-8">
      <div className="flex w-full flex-col items-center gap-4">
        <BugIcon className="text-muted-foreground size-24 stroke-1" />
        <span className="flex items-center justify-center gap-2 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
          Algo salió mal
        </span>
        <Button type="button" onClick={handleRetry} className="h-12 w-full">
          Reintentar
        </Button>
      </div>
    </main>
  )
}
