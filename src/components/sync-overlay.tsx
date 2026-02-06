'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { useDataStore } from '@/contexts/data-store-context'
import { checkNeedsSync, saveLastSync, syncData } from '@/lib/sync'

import { Spinner } from './ui/spinner'

export const SyncOverlay = () => {
  const [isSyncing, setIsSyncing] = useState(false)
  const { bulkUpdate } = useDataStore()

  useEffect(() => {
    const performSync = async () => {
      const needsSync = await checkNeedsSync()

      if (needsSync) {
        setIsSyncing(true)

        try {
          const [data] = await Promise.all([
            syncData(),
            new Promise((resolve) => setTimeout(resolve, 1000)),
          ])

          await bulkUpdate(data)
          await saveLastSync()
        } finally {
          setIsSyncing(false)
        }
      }
    }

    performSync()
  }, [bulkUpdate])

  return (
    <AnimatePresence>
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          className="bg-primary/20 shadow-primary/25 fixed top-4 left-[50%] z-50 flex h-8 w-32 -translate-x-[50%] items-center justify-center gap-2 rounded-full text-xs text-white shadow-2xl backdrop-blur-xs backdrop-contrast-75"
        >
          <span>Actualizando</span>
          <Spinner />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
