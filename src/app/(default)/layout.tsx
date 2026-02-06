'use client'

import dynamic from 'next/dynamic'

import { BottomNavBar } from '@/components/bottom-nav-bar'
import { DataStoreProvider } from '@/contexts/data-store-context'

const SyncOverlay = dynamic(
  () =>
    import('@/components/sync-overlay').then((mod) => ({
      default: mod.SyncOverlay,
    })),
  { ssr: false }
)

const DisclaimerDrawer = dynamic(
  () =>
    import('@/components/disclaimer-drawer').then((mod) => ({
      default: mod.DisclaimerDrawer,
    })),
  { ssr: false }
)

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DataStoreProvider>
      <div className="flex min-h-dvh flex-col bg-zinc-50">
        {children}
        <BottomNavBar />
        <SyncOverlay />
        <DisclaimerDrawer />
      </div>
    </DataStoreProvider>
  )
}
