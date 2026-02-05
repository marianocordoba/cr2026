'use client'

import {
  DownloadIcon,
  HomeIcon,
  ListMusicIcon,
  MicVocalIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { InstallDrawer } from '@/components/install-drawer'
import { usePWAInstall } from '@/hooks/use-pwa-install'

const BottomNavBarItem = ({
  title,
  icon,
  href,
  isActive,
}: Readonly<{
  title: string
  icon: React.ReactNode
  href: string
  isActive: boolean
}>) => {
  return (
    <Link href={href}>
      <div className="relative flex size-14 flex-col items-center justify-center rounded-lg text-white">
        {isActive && (
          <motion.div
            className="bg-primary absolute inset-0 -z-10 rounded-lg"
            layoutId="bottom-nav-indicator"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        {icon}
        <span className="text-[10px]">{title}</span>
      </div>
    </Link>
  )
}

const BottomNavBarAction = ({
  title,
  icon,
  onClick,
}: Readonly<{
  title: string
  icon: React.ReactNode
  onClick: () => void
}>) => {
  return (
    <button onClick={onClick} type="button" aria-label={title}>
      <div className="relative flex size-14 flex-col items-center justify-center rounded-lg text-white">
        {icon}
        <span className="text-[10px]">{title}</span>
      </div>
    </button>
  )
}

export const BottomNavBar = () => {
  const pathname = usePathname()
  const activeIndex = ['/', '/schedule', '/artists'].indexOf(pathname)

  const { canInstall, isInstalled, platformType, promptInstall } =
    usePWAInstall()
  const [showInstallDrawer, setShowInstallDrawer] = useState(false)

  const handleInstallClick = async () => {
    if (canInstall) {
      try {
        await promptInstall()
      } catch {
        // If native prompt fails, show instructions
        setShowInstallDrawer(true)
      }
    } else {
      setShowInstallDrawer(true)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 z-50 h-(--bottom-nav-bar-height) w-full bg-linear-to-br from-zinc-800 to-zinc-950 px-8 py-4">
        <nav className="relative mx-auto flex h-full w-full items-center justify-evenly lg:max-w-5xl">
          <BottomNavBarItem
            title="Inicio"
            icon={<HomeIcon />}
            href="/"
            isActive={activeIndex === 0}
          />
          <BottomNavBarItem
            title="Grilla"
            icon={<ListMusicIcon />}
            href="/schedule"
            isActive={activeIndex === 1}
          />
          <BottomNavBarItem
            title="Artistas"
            icon={<MicVocalIcon />}
            href="/artists"
            isActive={activeIndex === 2}
          />
          {!isInstalled && (
            <BottomNavBarAction
              title="Instalar"
              icon={<DownloadIcon />}
              onClick={handleInstallClick}
            />
          )}
        </nav>
      </div>
      <InstallDrawer
        isOpen={showInstallDrawer}
        onClose={() => setShowInstallDrawer(false)}
        platformType={platformType}
      />
    </>
  )
}
