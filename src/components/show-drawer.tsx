'use client'

import { format } from 'date-fns'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  CalendarIcon,
  HeartCrackIcon,
  HeartIcon,
  MapPinIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'

import { SpotifyIcon } from '@/components/icons/spotify'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'

export function ShowDrawer({
  showId,
  onClose,
}: {
  showId: number | null
  onClose: () => void
}) {
  const data = useLiveQuery(async () => {
    if (!showId) return null

    const show = await db.shows.get(showId)
    if (!show) return null

    const [day, stage, artists] = await Promise.all([
      db.days.get(show.dayId),
      db.stages.get(show.stageId),
      db.artists.where('id').anyOf(show.artistIds).toArray(),
    ])

    return {
      show,
      day,
      stage,
      artists,
    }
  }, [showId])

  const toggleFavorite = async () => {
    if (!data?.show) return
    await db.shows.update(data.show.id, {
      isFavorite: data.show.isFavorite ? 0 : 1,
    })
  }

  const isFavorite = data?.show?.isFavorite

  if (!data?.show || !data?.day || !data?.stage || !data?.artists) return null

  return (
    <Drawer open={data !== null} onOpenChange={onClose}>
      <DrawerContent className="from-card to-background mx-auto max-w-lg overflow-hidden border-0! bg-linear-to-b">
        {/* Close button */}
        <DrawerClose className="bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors">
          <XIcon className="size-4" />
        </DrawerClose>

        <DrawerTitle className="text-foreground mt-8 px-10 text-center text-2xl font-bold tracking-tight">
          {data.show.title}
        </DrawerTitle>

        <div className="relative p-6">
          {/* Artist showcase */}
          <div className="flex justify-center gap-6">
            {data.artists.map((artist, index) => (
              <div
                key={artist.id}
                className="group flex flex-col items-center"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Artist image */}
                <div className="relative">
                  <div className="relative size-28 overflow-hidden rounded-2xl shadow-2xl">
                    {artist.image ? (
                      <img
                        src={`/images/artists/${artist.image}`}
                        alt={artist.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-linear-to-b from-zinc-600 to-zinc-800">
                        <span className="text-3xl font-bold text-white">
                          {artist.name
                            .split(' ')
                            .map((word) => word[0])
                            .join('')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Artist name */}
                <span className="text-foreground mt-3 text-center font-semibold tracking-tight">
                  {artist.name}
                </span>

                {/* Spotify link */}
                {artist.spotify && (
                  <Link
                    href={artist.spotify}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 flex items-center gap-1.5 rounded-full bg-[#1DB954] px-3 py-1.5 text-xs font-medium text-black transition-all"
                  >
                    <SpotifyIcon className="size-3.5" />
                    <span>Escuchar</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Show details card with favorite button */}
          <div className="mt-8 overflow-hidden rounded-xl bg-zinc-100/80">
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <MapPinIcon className="size-3.5" />
                  <span className="font-medium">{data.stage.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CalendarIcon className="size-3.5" />
                  <span>
                    {data.day.name} ·{' '}
                    {format(new Date(data.show.startsAt), 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleFavorite}
              className={cn(
                'flex w-full items-center justify-center gap-2 py-3 font-semibold transition-all duration-200',
                isFavorite
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]'
              )}
            >
              {isFavorite ? (
                <HeartCrackIcon className="size-5" />
              ) : (
                <HeartIcon className="size-5" />
              )}
              <span>
                {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </span>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
