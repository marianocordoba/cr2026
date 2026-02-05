'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState, useTransition } from 'react'

import { ArtistList } from '@/components/artist-list'
import { SearchBar } from '@/components/search-bar'
import { Spinner } from '@/components/ui/spinner'
import { BOTTOM_NAV_BAR_HEIGHT } from '@/constants'
import { db, type Artist } from '@/lib/db'

// Lazy load drawer - only loads when user clicks an artist
const ArtistDrawer = dynamic(
  () =>
    import('@/components/artist-drawer').then((mod) => ({
      default: mod.ArtistDrawer,
    })),
  { ssr: false }
)

export const ArtistsView = () => {
  const [windowHeight, setWindowHeight] = useState(
    typeof window === 'undefined' ? 0 : window.innerHeight
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null)

  // Use transition for non-urgent search updates
  const [isPending, startTransition] = useTransition()

  const artists = useLiveQuery(
    async () => await db.artists.orderBy('name').toArray(),
    [],
    []
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!artists) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <Spinner className="text-primary size-6" />
      </div>
    )
  }

  // Memoize the expensive filter operation
  const filteredArtists = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    return artists.filter((artist) =>
      artist.name.toLowerCase().includes(lowerSearch)
    )
  }, [artists, searchTerm])

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtistId(artist.id)
  }

  // Wrap search updates in transition
  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchTerm(value)
    })
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <SearchBar value={searchTerm} onChange={handleSearchChange} />

      <div
        className="relative left-0 w-dvw overflow-y-auto"
        style={{
          height: windowHeight - BOTTOM_NAV_BAR_HEIGHT - 96,
          top: 96,
        }}
      >
        <ArtistList
          artists={filteredArtists}
          onArtistClick={handleArtistClick}
          searchTerm={searchTerm}
        />
      </div>

      {selectedArtistId !== null && (
        <ArtistDrawer
          artistId={selectedArtistId}
          onClose={() => setSelectedArtistId(null)}
        />
      )}
    </main>
  )
}
