'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

const EASE = [0.25, 0.1, 0.25, 1] as const

export function Hero() {
  return (
    <section className="hero-noise relative flex flex-col items-center overflow-hidden rounded-b-[2rem] bg-linear-to-br from-zinc-800 to-zinc-950 px-6 py-6">
      {/* Radial spotlight behind logo */}
      <div className="hero-spotlight pointer-events-none absolute inset-0 z-2" />

      {/* Decorative accent lines */}
      <div className="pointer-events-none absolute top-6 left-4 z-2 h-16 w-px bg-linear-to-b from-[#DD5227]/40 to-transparent" />
      <div className="pointer-events-none absolute top-4 right-6 z-2 h-12 w-px rotate-20 bg-linear-to-b from-[#3D15B8]/30 to-transparent" />
      <div className="pointer-events-none absolute right-10 bottom-16 z-2 h-10 w-px -rotate-15 bg-linear-to-b from-[#193E85]/25 to-transparent" />

      {/* Small dot accents */}
      <div className="pointer-events-none absolute top-12 right-12 z-2 size-1.5 rounded-full bg-[#DD5227]/30" />
      <div className="pointer-events-none absolute bottom-20 left-10 z-2 size-1 rounded-full bg-[#3D15B8]/25" />

      {/* Title label */}
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="relative z-10 text-xs font-semibold tracking-[0.3em] text-[#DD5227] uppercase"
      >
        Grilla
      </motion.span>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative z-10 my-4"
      >
        <Image
          src="/images/cr-logo.png"
          alt="Logo Cosquín Rock 2026"
          width={200}
          height={200}
          priority
        />
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="relative z-10 max-w-xs text-center text-sm leading-relaxed text-zinc-400"
      >
        ¡Accedé a la grilla de artistas del Cosquín Rock 2026 y creá tu propio
        cronograma de shows!
      </motion.p>

      {/* Bottom decorative gradient line */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-3 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-[#DD5227]/30 to-transparent" />
    </section>
  )
}
