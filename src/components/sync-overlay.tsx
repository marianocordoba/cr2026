'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { checkNeedsSync, sync } from '@/lib/sync'

import { Spinner } from './ui/spinner'

export const SyncOverlay = () => {
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    checkNeedsSync().then((needsSync) => {
      if (needsSync) {
        setIsSyncing(true)
        Promise.all([
          sync(),
          // Ensure the syncing indicator is visible for at least 1 second
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]).finally(() => {
          setIsSyncing(false)
        })
      }
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
    </AnimatePresence>
  )
}
