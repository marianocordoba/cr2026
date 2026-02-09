'use client'

import { useEffect, useRef, useState } from 'react'

import { getDB } from '@/lib/idb'

type PlatformType = 'ios' | 'android' | 'desktop' | 'unknown'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface UsePWAInstallReturn {
  canInstall: boolean
  isInstalled: boolean
  platformType: PlatformType
  promptInstall: () => Promise<void>
}

export function usePWAInstall(): UsePWAInstallReturn {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platformType, setPlatformType] = useState<PlatformType>('unknown')
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') {
      return
    }

    // Check if already installed (sync checks)
    const checkInstalled = (): boolean => {
      // Check display-mode: standalone (covers PWA and most TWAs)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true
      }

      // Check iOS standalone mode
      if ('standalone' in navigator && navigator.standalone === true) {
        return true
      }

      return false
    }

    // Check if running as a TWA and persist the flag
    const checkTWA = async (): Promise<boolean> => {
      const db = await getDB()
      const twa = await db.get('meta', 'twa')

      if (twa) {
        return true
      }

      if (document.referrer.startsWith('android-app://')) {
        await db.put('meta', { key: 'twa', value: '1' })
        return true
      }

      return false
    }

    // Detect platform type
    const detectPlatform = (): PlatformType => {
      const userAgent = navigator.userAgent.toLowerCase()

      // iOS detection
      const isIOS =
        /ipad|iphone|ipod/.test(userAgent) &&
        !('MSStream' in window) &&
        !checkInstalled()

      if (isIOS) {
        return 'ios'
      }

      // Android detection
      const isAndroid = /android/.test(userAgent)
      if (isAndroid) {
        return 'android'
      }

      // Desktop detection (Chrome/Edge)
      const isDesktop = !isAndroid && !isIOS
      if (isDesktop) {
        return 'desktop'
      }

      return 'unknown'
    }

    const installed = checkInstalled()
    setIsInstalled(installed)
    setPlatformType(detectPlatform())

    if (!installed) {
      checkTWA().then((isTWA) => {
        if (isTWA) {
          setIsInstalled(true)
        }
      })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default browser install prompt
      e.preventDefault()

      // Store the event for later use
      deferredPrompt.current = e as BeforeInstallPromptEvent
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      deferredPrompt.current = null
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async (): Promise<void> => {
    if (!deferredPrompt.current) {
      throw new Error('Install prompt not available')
    }

    // Show the install prompt
    await deferredPrompt.current.prompt()

    // Wait for user choice
    const { outcome } = await deferredPrompt.current.userChoice

    if (outcome === 'accepted') {
      setCanInstall(false)
      deferredPrompt.current = null
    }
  }

  return {
    canInstall,
    isInstalled,
    platformType,
    promptInstall,
  }
}
