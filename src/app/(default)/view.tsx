'use client'

import { DisclaimerFooter } from '@/components/disclaimer-footer'
import { Hero } from '@/components/hero'
import { UpcomingFavoritesCard } from '@/components/upcoming-favorites-card'

export default function HomeView() {
  return (
    <main className="flex min-h-dvh flex-col items-stretch pb-(--bottom-nav-bar-height)">
      <Hero />
      <div className="mx-auto flex w-full flex-col gap-6 p-4 lg:max-w-5xl">
        <UpcomingFavoritesCard />
      </div>
      <DisclaimerFooter />
    </main>
  )
}
