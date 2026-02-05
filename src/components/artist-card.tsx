'use client'

import { ChevronRightIcon } from 'lucide-react'
import { motion } from 'motion/react'

import { type Artist } from '@/lib/db'
import { cn } from '@/lib/utils'

type ArtistCardProps = Readonly<{
  artist: Artist
  onClick: () => void
  index?: number
}>

export function ArtistCard({ artist, onClick, index = 0 }: ArtistCardProps) {
  const initials = artist.name
    .split(' ')
    .map((word) => word[0])
    .join('')

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex w-full items-center gap-4 px-4 py-3',
        'transition-colors duration-150',
        'hover:bg-zinc-100/80 active:bg-zinc-200/60',
        'active:scale-[0.99] active:transition-transform'
      )}
    >
      {/* Avatar */}
      <div className="size-12 shrink-0 overflow-hidden rounded-xl shadow-md shadow-zinc-200">
        {artist.image ? (
          <img
            src={`/images/artists/${artist.image}`}
            alt={artist.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-zinc-600 to-zinc-800">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <span className="flex-1 text-left font-semibold tracking-tight text-zinc-900">
        {artist.name}
      </span>

      {/* Chevron */}
      <ChevronRightIcon className="size-5 text-zinc-300" />
    </motion.button>
  )
}
