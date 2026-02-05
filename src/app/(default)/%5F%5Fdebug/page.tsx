'use client'

import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'

const DebugPage = () => {
  const deleteDatabase = () => {
    db.delete()
  }
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <Button type="button" onClick={deleteDatabase} className="h-12 w-full">
        Eliminar base de datos
      </Button>
    </main>
  )
}

export default DebugPage
