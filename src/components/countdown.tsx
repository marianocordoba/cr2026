'use client'

import { differenceInSeconds } from 'date-fns'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

/** Cosquín Rock 2026 — Day 1 gates open (Argentina, UTC-3) */
const EVENT_START = new Date('2026-02-14T17:00:00-03:00')

const EASE = [0.25, 0.1, 0.25, 1] as const

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeTimeLeft(): TimeLeft | null {
  const diff = differenceInSeconds(EVENT_START, new Date())
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
  }
}

const UNITS = [
  { key: 'days', label: 'días' },
  { key: 'hours', label: 'horas' },
  { key: 'minutes', label: 'min' },
  { key: 'seconds', label: 'seg' },
] as const

function DigitTile({
  value,
  label,
  index,
}: Readonly<{ value: number; label: string; index: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.05 + index * 0.08, ease: EASE }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="countdown-tile relative flex size-17 items-center justify-center overflow-hidden rounded-xl">
        {/* Inner glow */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[ellipse_70%_60%_at_50%_0%] from-[#DD5227]/10 to-transparent" />
        <span className="relative z-10 font-sans text-2xl font-bold text-[#DD5227] tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[0.625rem] font-medium tracking-[0.15em] text-zinc-500 uppercase">
        {label}
      </span>
    </motion.div>
  )
}

function Separator({ index }: Readonly<{ index: number }>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.08, ease: EASE }}
      className="countdown-separator flex flex-col items-center gap-1.5 pt-1"
    >
      <div className="flex h-17 flex-col items-center justify-center gap-1.5">
        <div className="size-1 rounded-full bg-[#DD5227]/50" />
        <div className="size-1 rounded-full bg-[#DD5227]/50" />
      </div>
    </motion.div>
  )
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | 'pending'>(
    'pending'
  )

  useEffect(() => {
    setTimeLeft(computeTimeLeft())
    const interval = setInterval(() => {
      const next = computeTimeLeft()
      if (next === null) {
        clearInterval(interval)
      }
      setTimeLeft(next)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // SSR / hydration: render nothing until mounted
  if (timeLeft === 'pending') return null

  // Event has started — hide countdown
  if (timeLeft === null) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="relative z-10 mt-5 flex flex-col items-center gap-2"
    >
      <span className="text-[0.625rem] font-semibold tracking-[0.35em] text-zinc-500 uppercase">
        Faltan
      </span>
      <div className="flex items-start gap-2">
        {UNITS.map((unit, i) => (
          <div key={unit.key} className="flex items-start gap-2">
            {i > 0 && <Separator index={i} />}
            <DigitTile
              value={timeLeft[unit.key]}
              label={unit.label}
              index={i}
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}
