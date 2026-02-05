import { BottomNavBar } from '@/components/bottom-nav-bar'
import { DisclaimerDrawer } from '@/components/disclaimer-drawer'
import { SyncOverlay } from '@/components/sync-overlay'

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50">
      {children}
      <BottomNavBar />
      <SyncOverlay />
      <DisclaimerDrawer />
    </div>
  )
}
