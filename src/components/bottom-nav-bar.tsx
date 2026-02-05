'use client'

import { HomeIcon, ListMusicIcon, MicVocalIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export const BottomNavBar = () => {
  const pathname = usePathname()
  const activeIndex = ['/', '/schedule', '/artists'].indexOf(pathname)

  return (
    <div className="fixed bottom-0 z-50 h-(--bottom-nav-bar-height) w-full bg-linear-to-br from-zinc-800 to-zinc-950 px-8 py-4">
      <nav className="relative flex h-full items-center justify-evenly">
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
      </nav>
    </div>
  )
}
