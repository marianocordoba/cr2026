'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'

import { ArtistDrawer } from '@/components/artist-drawer'
import { ArtistList } from '@/components/artist-list'
import { SearchBar } from '@/components/search-bar'
import { Spinner } from '@/components/ui/spinner'
import { BOTTOM_NAV_BAR_HEIGHT } from '@/constants'
import { db, type Artist } from '@/lib/db'

export function ArtistsView() {
  const [windowHeight, setWindowHeight] = useState(
    typeof window === 'undefined' ? 0 : window.innerHeight
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null)

  const artists = useLiveQuery(
    async () => {
      return await db.artists.orderBy('name').toArray()
    },
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

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtistId(artist.id)
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

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

      <ArtistDrawer
        artistId={selectedArtistId}
        onClose={() => setSelectedArtistId(null)}
      />
    </main>
  )
}
