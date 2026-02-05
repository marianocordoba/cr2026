'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { checkNeedsSync, sync } from '@/lib/sync'

import { Spinner } from './ui/spinner'

export const SyncOverlay = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState(false)

  const handleRetry = () => {
    setSyncError(false)
    setIsSyncing(true)

    Promise.all([sync(), new Promise((resolve) => setTimeout(resolve, 1000))])
      .catch(() => {
        setSyncError(true)
      })
      .finally(() => {
        setIsSyncing(false)
      })
  }

  useEffect(() => {
    checkNeedsSync()
      .then((needsSync) => {
        if (needsSync) {
          setIsSyncing(true)
          return Promise.all([
            sync(),
            // Ensure the syncing indicator is visible for at least 1 second
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ])
        }
      })
      .catch(() => {
        setSyncError(true)
      })
      .finally(() => {
        setIsSyncing(false)
      })
  }, [])

  return (
    <AnimatePresence>
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          className="bg-primary/20 shadow-primary/25 fixed top-2 left-[50%] z-50 flex h-8 w-32 -translate-x-[50%] items-center justify-center gap-2 rounded-full text-xs text-white shadow-2xl backdrop-blur-xs backdrop-contrast-75"
        >
          <span>Sincronizando</span>
          <Spinner />
        </motion.div>
      )}
      {syncError && (
        <motion.div
          initial={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          className="fixed top-2 left-[50%] z-50 flex h-8 -translate-x-[50%] items-center justify-center gap-2 rounded-full bg-red-500/20 px-4 text-xs text-white shadow-2xl shadow-red-500/25 backdrop-blur-xs backdrop-contrast-75"
        >
          <span>Error de sincronización</span>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded bg-white/20 px-2 py-0.5 hover:bg-white/30"
          >
            Reintentar
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
