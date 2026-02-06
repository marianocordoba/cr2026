'use client'

import { Button } from '@/components/ui/button'
import { deleteDatabase } from '@/lib/idb'

const DebugPage = () => {
  const handleDeleteDatabase = () => {
    deleteDatabase()
  }
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <Button
        type="button"
        onClick={handleDeleteDatabase}
        className="h-12 w-full"
      >
        Eliminar base de datos
      </Button>
    </main>
  )
}

export default DebugPage
