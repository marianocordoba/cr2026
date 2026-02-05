'use client'

import { addMinutes, differenceInMinutes, format } from 'date-fns'
import { motion } from 'motion/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ScheduleShowCard } from '@/components/schedule-show-card'
import type { Show, Stage } from '@/lib/db'
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
  const laneHeight = useMemo(
    () => (height - timelineHeight) / stages.length,
    [height, stages.length, timelineHeight]
  )

  const minutes = useMemo(
    () => differenceInMinutes(new Date(endsAt), new Date(startsAt)),
    [startsAt, endsAt]
  )

  const slots = useMemo(
    () =>
      Array.from({ length: Math.ceil(minutes / 30) + 1 }).map((_, i) => {
        const date = addMinutes(startsAt, i * 30)
        return {
          end: addMinutes(date, 30),
          label: format(date, 'HH:mm'),
          start: date,
        }
      }),
    [minutes, startsAt]
  )

  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const nowLeft = useMemo(() => {
    const start = new Date(startsAt)
    const end = new Date(endsAt)
    if (now < start || now > end) {
      return null
    }
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

  const showsGroupedByStage = useMemo(
    () =>
      stages.map((stage) => ({
        shows: shows.filter((show) => show.stageId === stage.id),
        stage,
      })),
    [stages, shows]
  )

  // Use ref to track drag position
  const dragX = useRef(0)

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!scrollRef.current) {
      return
    }

    const dx = dragX.current - e.clientX
    dragX.current = e.clientX
    scrollRef.current.scrollLeft += dx
  }, [])

  const handleDragEnd = useCallback(() => {
    window.removeEventListener('mousemove', handleDrag)
    window.removeEventListener('mouseup', handleDragEnd)
  }, [handleDrag])

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      dragX.current = e.clientX

      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', handleDragEnd)
    },
    [handleDrag, handleDragEnd]
  )

  // Cleanup on unmount
  useEffect(
    () => () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
    },
    [handleDrag, handleDragEnd]
  )

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
            top: offset,
            width: laneHeight,
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
                height: laneHeight,
                top: index * laneHeight + timelineHeight + offset,
                width: laneHeight,
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
                height: laneHeight,
                top: index * laneHeight + timelineHeight,
                width: slots.length * slotWidth + laneHeight,
              }}
            />

            {shows.map((show) => (
              <ScheduleShowCard
                key={show.id}
                show={show}
                index={index}
                startsAt={startsAt}
                slotWidth={slotWidth}
                slotDuration={slotDuration}
                laneHeight={laneHeight}
                timelineHeight={timelineHeight}
                onClick={() => onShowClick?.(show)}
              />
            ))}
          </React.Fragment>
        ))}

        {nowLeft !== null && (
          <div
            className="absolute z-15 flex flex-col items-center"
            style={{ height: '100%', left: nowLeft, top: 0 }}
          >
            <div className="size-2 rounded-b-full bg-red-500" />
            <div className="w-0.5 flex-1 bg-red-500" />
          </div>
        )}
      </div>
    </div>
  )
}
