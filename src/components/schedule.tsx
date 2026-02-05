'use client'

import {
  addMinutes,
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'motion/react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Show, Stage } from '@/lib/db'
import { cn } from '@/lib/utils'

export const Schedule = ({
  height,
  offset = 0,
  slotDuration = 30,
  slotWidth = 100,
  timelineHeight = 32,
  startsAt,
  endsAt,
  stages = [],
  shows = [],
  onShowClick,
}: {
  height: number
  offset?: number
  slotDuration?: number
  slotWidth?: number
  timelineHeight?: number
  startsAt: string
  endsAt: string
  stages: Stage[]
  shows: Show[]
  onShowClick?: (show: Show) => void
}) => {
  const laneHeight = useMemo(() => {
    return (height - timelineHeight) / stages.length
  }, [height, stages.length, timelineHeight])

  const minutes = useMemo(() => {
    return differenceInMinutes(new Date(endsAt), new Date(startsAt))
  }, [startsAt, endsAt])

  const slots = useMemo(() => {
    return Array.from({ length: Math.ceil(minutes / 30) + 1 }).map((_, i) => {
      const date = addMinutes(startsAt, i * 30)
      return {
        start: date,
        end: addMinutes(date, 30),
        label: format(date, 'HH:mm'),
      }
    })
  }, [minutes, startsAt])

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const nowLeft = useMemo(() => {
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    if (now < start || now > end) return null
    return (
      differenceInMinutes(now, start) * (slotWidth / slotDuration) +
      laneHeight +
      slotWidth / 2
    )
  }, [now, startsAt, endsAt, slotWidth, slotDuration, laneHeight])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (nowLeft !== null && scrollRef.current) {
      scrollRef.current.scrollLeft = nowLeft - scrollRef.current.clientWidth / 2
    }
  }, [nowLeft === null])

  const showsGroupedByStage = useMemo(() => {
    return stages.map((stage) => {
      return {
        stage,
        shows: shows.filter((show) => show.stageId === stage.id),
      }
    })
  }, [stages, shows])

  let x = 0
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    x = e.clientX

    window.addEventListener('mousemove', handleDrag)
    window.addEventListener('mouseup', handleDragEnd)
  }

  const handleDrag = (e: MouseEvent) => {
    if (!scrollRef.current) {
      return
    }

    const dx = x - e.clientX
    x = e.clientX
    scrollRef.current.scrollLeft += dx
  }

  const handleDragEnd = () => {
    window.removeEventListener('mousemove', handleDrag)
    window.removeEventListener('mouseup', handleDrag)
  }

  return (
    <div
      ref={scrollRef}
      className="w-dvw overflow-x-auto overflow-y-hidden select-none [&::-webkit-scrollbar]:hidden"
      style={{ height }}
      onMouseDown={handleDragStart}
    >
      <div className="relative h-full">
        {/* Slots */}
        {slots.map((slot, index) => {
          const left = index * slotWidth + laneHeight

          return (
            <React.Fragment key={slot.label}>
              <div
                className="absolute top-0 flex h-8 items-center justify-center bg-white"
                style={{
                  left,
                  width: slotWidth,
                }}
              >
                <span className="text-xs text-neutral-950">{slot.label}</span>
              </div>

              <div
                className="absolute top-8 z-10 h-full w-px bg-zinc-200"
                style={{ left: left + slotWidth / 2 }}
              />
            </React.Fragment>
          )
        })}

        {/* Stages */}
        <aside
          className="fixed left-0 z-20 h-full bg-white"
          style={{
            width: laneHeight,
            top: offset,
          }}
        >
          <div className="bg-primary/80" style={{ height: timelineHeight }} />
          <div className="absolute top-0 -right-4 h-full w-4 bg-linear-to-r from-white/50 to-transparent" />
        </aside>

        {showsGroupedByStage.map(({ stage, shows }, index) => (
          <React.Fragment key={stage.id}>
            <div
              className={cn(
                'fixed left-0 z-20 flex flex-col items-center justify-center px-2',
                index % 2 === 0 ? 'bg-primary' : 'bg-primary/80'
              )}
              style={{
                width: laneHeight,
                height: laneHeight,
                top: index * laneHeight + timelineHeight + offset,
              }}
            >
              <span className="text-center text-[10px] tracking-wide text-white">
                Escenario
              </span>
              <span className="text-center text-xs leading-tight font-bold text-white">
                {stage.name}
              </span>
            </div>

            <div
              className={cn(
                'absolute top-0 left-0 flex flex-col items-center justify-center px-2',
                index % 2 === 0 ? 'bg-zinc-50' : 'bg-white'
              )}
              style={{
                width: slots.length * slotWidth + laneHeight,
                height: laneHeight,
                top: index * laneHeight + timelineHeight,
              }}
            ></div>

            {shows.map((show) => {
              const top = index * laneHeight + timelineHeight + 4
              const left =
                differenceInMinutes(
                  new Date(show.startsAt),
                  new Date(startsAt)
                ) *
                  (slotWidth / slotDuration) +
                laneHeight +
                slotWidth / 2

              const height = laneHeight - 8
              const width =
                (differenceInMinutes(
                  new Date(show.endsAt),
                  new Date(show.startsAt)
                ) /
                  slotDuration) *
                slotWidth

              return (
                <motion.button
                  key={show.id}
                  initial={{ opacity: 0, translateX: -25 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05 * index,
                  }}
                  type="button"
                  onClick={() => onShowClick?.(show)}
                  className={cn(
                    'absolute z-10 flex w-32 flex-col rounded-lg border bg-white px-2 py-1 shadow-lg shadow-black/5',
                    show.isFavorite
                      ? 'bg-linear-to-br from-zinc-600 to-zinc-800 dark'
                      : 'border-border'
                  )}
                  style={{ top, left, height, width }}
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
            })}
          </React.Fragment>
        ))}

        {nowLeft !== null && (
          <div
            className="absolute z-15 flex flex-col items-center"
            style={{ left: nowLeft, top: 0, height: '100%' }}
          >
            <div className="size-2 rounded-b-full bg-red-500" />
            <div className="w-0.5 flex-1 bg-red-500" />
          </div>
        )}
      </div>
    </div>
  )
}
