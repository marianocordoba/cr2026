'use client'

import { format } from 'date-fns'
import {
  CalendarIcon,
  HeartCrackIcon,
  HeartIcon,
  MapPinIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { SpotifyIcon } from '@/components/icons/spotify'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  useArtistsByIds,
  useDay,
  useShow,
  useStage,
  useToggleFavorite,
} from '@/hooks/use-data'
import { cn } from '@/lib/utils'

export const ShowDrawer = ({
  showId,
  onClose,
}: {
  showId: number | null
  onClose: () => void
}) => {
  const show = useShow(showId)
  const day = useDay(show?.dayId ?? null)
  const stage = useStage(show?.stageId ?? null)
  const artists = useArtistsByIds(show?.artistIds ?? [])
  const toggleFavoriteAction = useToggleFavorite()

  const handleToggleFavorite = async () => {
    if (!show) {
      return
    }

    try {
      await toggleFavoriteAction(show.id)
    } catch (error: unknown) {
      toast.error(String(error))
    }
  }

  const isFavorite = show?.isFavorite

  if (!show || !day || !stage || artists.length === 0) {
    return null
  }

  return (
    <Drawer open={show !== null} onOpenChange={onClose}>
      <DrawerContent className="from-card to-background mx-auto max-w-lg overflow-hidden border-0! bg-linear-to-b">
        <DrawerClose className="bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors">
          <XIcon className="size-4" />
        </DrawerClose>

        <DrawerTitle className="text-foreground mt-8 px-10 text-center text-2xl font-bold tracking-tight">
          {show.title}
        </DrawerTitle>

        <div className="relative p-6">
          <div className="flex justify-center gap-6">
            {artists.map((artist, index) => (
              <div
                key={artist.id}
                className="group flex flex-col items-center"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
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

                <span className="text-foreground mt-3 text-center font-semibold tracking-tight">
                  {artist.name}
                </span>

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

          <div className="mt-8 overflow-hidden rounded-xl bg-zinc-100/80">
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <MapPinIcon className="size-3.5" />
                  <span className="font-medium">{stage.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CalendarIcon className="size-3.5" />
                  <span>
                    {day.name} · {format(new Date(show.startsAt), 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={cn(
                'flex w-full items-center justify-center gap-2 py-3 font-semibold transition-all duration-200',
                isFavorite
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[1.02]'
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
