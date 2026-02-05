'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'

import { DaySelector } from '@/components/day-selector'
import { Schedule } from '@/components/schedule'
import { Spinner } from '@/components/ui/spinner'
import { BOTTOM_NAV_BAR_HEIGHT, NAV_BAR_HEIGHT } from '@/constants'
import { db } from '@/lib/db'

// Lazy load drawer - only loads when user clicks a show
const ShowDrawer = dynamic(
  () =>
    import('@/components/show-drawer').then((mod) => ({
      default: mod.ShowDrawer,
    })),
  { ssr: false }
)

export const ScheduleView = () => {
  const [windowHeight, setWindowHeight] = useState(
    typeof window === 'undefined' ? 0 : window.innerHeight
  )
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null)

  const days = useLiveQuery(async () => await db.days.toArray(), [], [])

  const selectedDay = useLiveQuery(async () => {
    if (!selectedDayId) {
      return null
    }
    return await db.days.get(selectedDayId)
  }, [selectedDayId])

  // Derive primitive ID instead of passing entire object
  const selectedDayIdForQuery = useMemo(
    () => selectedDay?.id,
    [selectedDay?.id]
  )

  const stages = useLiveQuery(
    async () => {
      if (!selectedDayIdForQuery) {
        return []
      }
      return await db.stages
        .where('dayIds')
        .anyOf(selectedDayIdForQuery)
        .sortBy('order')
    },
    [selectedDayIdForQuery],
    []
  )

  const shows = useLiveQuery(
    async () => {
      if (!selectedDayIdForQuery) {
        return []
      }
      return await db.shows
        .where('dayId')
        .equals(selectedDayIdForQuery)
        .toArray()
    },
    [selectedDayIdForQuery],
    []
  )

  useEffect(() => {
    if (days.length === 0 || selectedDayId !== null) {
      return
    }
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const currentDay = days.find((day) => day.startsAt.startsWith(today))
    setSelectedDayId(currentDay?.id ?? days[0].id)
  }, [days, selectedDayId])

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (
    !selectedDayId ||
    !selectedDay ||
    days.length === 0 ||
    stages.length === 0 ||
    shows.length === 0
  ) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <Spinner className="text-primary size-6" />
      </div>
    )
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <DaySelector
        selectedDayId={selectedDayId}
        onDayChange={setSelectedDayId}
      />

      <Schedule
        key={selectedDay.id}
        height={windowHeight - NAV_BAR_HEIGHT - BOTTOM_NAV_BAR_HEIGHT}
        offset={NAV_BAR_HEIGHT}
        startsAt={selectedDay.startsAt}
        endsAt={selectedDay.endsAt}
        stages={stages}
        shows={shows}
        onShowClick={(show) => setSelectedShowId(show.id)}
      />

      {selectedShowId !== null && (
        <ShowDrawer
          showId={selectedShowId}
          onClose={() => setSelectedShowId(null)}
        />
      )}
    </main>
  )
}
