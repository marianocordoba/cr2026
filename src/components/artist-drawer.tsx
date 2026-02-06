'use client'

import { format } from 'date-fns'
import {
  CalendarIcon,
  HeartCrackIcon,
  HeartIcon,
  MapPinIcon,
  XIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

import { SpotifyIcon } from '@/components/icons/spotify'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useDataStore } from '@/contexts/data-store-context'
import {
  useArtist,
  useShowsForArtist,
  useToggleFavorite,
} from '@/hooks/use-data'
import { cn } from '@/lib/utils'

type ArtistDrawerProps = Readonly<{
  artistId: number | null
  onClose: () => void
}>

export const ArtistDrawer = ({ artistId, onClose }: ArtistDrawerProps) => {
  const artist = useArtist(artistId)
  const artistShows = useShowsForArtist(artistId)
  const { days, stages } = useDataStore()
  const toggleFavorite = useToggleFavorite()

  const showsWithDetails = useMemo(
    () =>
      artistShows.map((show) => ({
        day: days.find((d) => d.id === show.dayId),
        show,
        stage: stages.find((s) => s.id === show.stageId),
      })),
    [artistShows, days, stages]
  )

  if (!artist) {
    return null
  }

  const initials = artist.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <Drawer open={artistId !== null} onOpenChange={onClose}>
      <DrawerContent className="from-card to-background mx-auto max-w-lg overflow-hidden border-0! bg-linear-to-b">
        <DrawerClose className="bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors">
          <XIcon className="size-4" />
        </DrawerClose>

        <DrawerTitle className="text-foreground mt-6 text-center text-2xl font-bold tracking-tight">
          {artist.name}
        </DrawerTitle>

        <div className="relative p-6 pt-8">
          <div className="flex justify-center">
            <div className="size-32 overflow-hidden rounded-2xl shadow-2xl">
              {artist.image === null ? (
                <div className="flex size-full items-center justify-center bg-linear-to-b from-zinc-600 to-zinc-800">
                  <span className="text-4xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              ) : (
                <Image
                  src={`/images/artists/${artist.image}`}
                  alt={artist.name}
                  width={128}
                  height={128}
                  className="size-full object-cover"
                />
              )}
            </div>
          </div>

          {artist.spotify && (
            <div className="mt-4 flex justify-center">
              <Link
                href={artist.spotify}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-medium text-black transition-all hover:scale-105 active:scale-95"
              >
                <SpotifyIcon className="size-4" />
                <span>Escuchar</span>
              </Link>
            </div>
          )}

          {showsWithDetails.length > 0 && (
            <div className="mt-8">
              <div className="space-y-3">
                {showsWithDetails.map(({ show, day, stage }) => (
                  <div
                    key={show.id}
                    className="overflow-hidden rounded-xl bg-zinc-100/80"
                  >
                    <div className="flex items-center gap-4 px-4 py-3">
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-zinc-700">
                          <MapPinIcon className="size-3.5" />
                          <span className="font-medium">{stage?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <CalendarIcon className="size-3.5" />
                          <span>
                            {day?.name} ·{' '}
                            {format(new Date(show.startsAt), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(show.id)}
                      className={cn(
                        'flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all duration-200',
                        show.isFavorite
                          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          : 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[1.02]'
                      )}
                    >
                      {show.isFavorite ? (
                        <HeartCrackIcon className="size-4" />
                      ) : (
                        <HeartIcon className="size-4" />
                      )}
                      <span>
                        {show.isFavorite
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
