'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

import { ArtistDrawer } from '@/components/artist-drawer'
import { ArtistList } from '@/components/artist-list'
import { SearchBar } from '@/components/search-bar'
import { Spinner } from '@/components/ui/spinner'
import { BOTTOM_NAV_BAR_HEIGHT } from '@/constants'
import { db, type Artist } from '@/lib/db'

export function ArtistsView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null)

  const artists = useLiveQuery(async () => {
    return await db.artists.orderBy('name').toArray()
  })

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
          height: window.innerHeight - BOTTOM_NAV_BAR_HEIGHT - 96,
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
