'use client'

import { MusicIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { memo } from 'react'

import  { type Artist } from '@/lib/idb'

import { ArtistCard } from '@/components/artist-card'

type ArtistListProps = Readonly<{
  artists: Artist[]
  onArtistClick: (artist: Artist) => void
  searchTerm: string
}>

type GroupedArtists = Record<string, Artist[]>

function groupArtistsByLetter(artists: Artist[]): GroupedArtists {
  return artists.reduce((acc, artist) => {
    const firstChar = artist.name[0].toUpperCase()
    const letter = /[A-Z]/.test(firstChar) ? firstChar : '#'
    acc[letter] = [...(acc[letter] ?? []), artist]
    return acc
  }, {} as GroupedArtists)
}

// Memoized to prevent re-creation
const StickyHeader = memo(function StickyHeader({
  letter,
}: {
  letter: string
}) {
  return (
    <div className="sticky top-0 h-12">
      <div className="absolute inset-0 h-full w-full bg-white" />
      <div className="bg-primary absolute inset-0 z-10 h-full w-full px-4 py-2">
        <span className="text-2xl font-bold tracking-tight text-white">
          {letter}
        </span>
      </div>
    </div>
  )
})

// Memoized to prevent re-creation
const EmptyState = memo(function EmptyState({
  searchTerm,
}: {
  searchTerm: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center px-8 py-16 text-center"
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-zinc-100">
        <MusicIcon className="size-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900">Sin resultados</h3>
      <p className="mt-1 text-sm text-zinc-500">
        No encontramos artistas con "{searchTerm}"
      </p>
    </motion.div>
  )
})

export const ArtistList = ({
  artists,
  onArtistClick,
  searchTerm,
}: ArtistListProps) => {
  if (artists.length === 0 && searchTerm.length > 0) {
    return <EmptyState searchTerm={searchTerm} />
  }

  const grouped = groupArtistsByLetter(artists)
  const letters = Object.keys(grouped).toSorted((a, b) => {
    if (a === '#') {
      return 1
    }
    if (b === '#') {
      return -1
    }
    return a.localeCompare(b)
  })

  let globalIndex = 0

  return (
    <div>
      {letters.map((letter) => (
        <section
          key={letter}
          aria-label={`Artistas que empiezan con ${letter}`}
          style={{ containIntrinsicSize: '0 500px', contentVisibility: 'auto' }}
        >
          <StickyHeader letter={letter} />
          <div>
            {grouped[letter].map((artist) => {
              const currentIndex = globalIndex
              globalIndex++
              return (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onClick={() => onArtistClick(artist)}
                  index={currentIndex}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
