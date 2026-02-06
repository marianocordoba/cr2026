'use client'

import {
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'motion/react'
import { memo, useCallback } from 'react'

import type { Show } from '@/lib/idb'
import { cn } from '@/lib/utils'

type ScheduleShowCardProps = Readonly<{
  show: Show
  index: number
  startsAt: string
  slotWidth: number
  slotDuration: number
  laneHeight: number
  timelineHeight: number
  onClick: (show: Show) => void
}>

// Memoized component - only re-renders if props change
export const ScheduleShowCard = memo(function ScheduleShowCard({
  show,
  index,
  startsAt,
  slotWidth,
  slotDuration,
  laneHeight,
  timelineHeight,
  onClick,
}: ScheduleShowCardProps) {
  const top = index * laneHeight + timelineHeight + 4
  const left =
    differenceInMinutes(new Date(show.startsAt), new Date(startsAt)) *
      (slotWidth / slotDuration) +
    laneHeight +
    slotWidth / 2

  const height = laneHeight - 8
  const width =
    (differenceInMinutes(new Date(show.endsAt), new Date(show.startsAt)) /
      slotDuration) *
    slotWidth

  // Preload show drawer on hover/focus
  const handleMouseEnter = useCallback(() => {
    import('@/components/show-drawer')
  }, [])

  return (
    <motion.button
      key={show.id}
      initial={{ opacity: 0, translateX: -25 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        delay: 0.05 * index,
        duration: 0.2,
      }}
      type="button"
      onClick={() => onClick(show)}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      className={cn(
        'absolute z-10 flex w-32 flex-col rounded-lg border bg-white px-2 py-1 shadow-lg shadow-black/5',
        show.isFavorite
          ? 'bg-linear-to-br from-zinc-600 to-zinc-800 dark'
          : 'border-border'
      )}
      style={{ height, left, top, width }}
    >
      <div className="flex w-full flex-1">
        <span className="text-foreground truncate font-medium">
          {show.title}
        </span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-foreground text-xs">
          {format(new Date(show.startsAt), 'HH:mm')}
        </span>
        <span className="text-foreground/60 truncate text-[10px]">
          (
          {formatDistanceToNowStrict(new Date(show.startsAt), {
            addSuffix: true,
            locale: es,
          })}
          )
        </span>
      </div>
    </motion.button>
  )
})
