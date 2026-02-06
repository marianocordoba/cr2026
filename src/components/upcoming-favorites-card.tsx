'use client'

import {
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
} from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CalendarIcon,
  HeartIcon,
  MapPinIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'

import type { Artist, Day, Show, Stage } from '@/lib/idb'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useDataStore } from '@/contexts/data-store-context'
import { useFavoriteShows } from '@/hooks/use-data'
import { cn } from '@/lib/utils'

const ShowDrawer = dynamic(
  async () => {
    const mod = await import('@/components/show-drawer')
    return { default: mod.ShowDrawer }
  },
  { ssr: false }
)

interface UpcomingFavoriteShow {
  show: Show
  day: Day
  stage: Stage
  artists: Artist[]
}

type FavoriteResult =
  | { status: 'loading' }
  | { status: 'no-favorites' }
  | { status: 'all-past' }
  | { status: 'has-upcoming'; shows: UpcomingFavoriteShow[] }

const useUpcomingFavorites = (): FavoriteResult => {
  const { favoriteShows, isLoading } = useFavoriteShows()
  const { days, stages, artists } = useDataStore()

  return useMemo(() => {
    if (isLoading) {
      return { status: 'loading' }
    }

    if (favoriteShows.length === 0) {
      return { status: 'no-favorites' }
    }

    const now = new Date()
    const upcomingShows = favoriteShows
      .filter((show) => {
        const showDate = new Date(show.startsAt)
        return differenceInMinutes(showDate, now) > -60
      })
      .slice(0, 10)

    if (upcomingShows.length === 0) {
      return { status: 'all-past' }
    }

    const enriched = upcomingShows
      .map((show) => {
        const day = days.find((d) => d.id === show.dayId)
        const stage = stages.find((s) => s.id === show.stageId)
        const showArtists = artists.filter((a) => show.artistIds.includes(a.id))

        if (!day || !stage) {
          return null
        }

        return { artists: showArtists, day, show, stage }
      })
      .filter((item): item is UpcomingFavoriteShow => item !== null)

    return { shows: enriched, status: 'has-upcoming' }
  }, [favoriteShows, isLoading, days, stages, artists])
}

const FavoriteShowItem = ({
  data,
  index,
  onClick,
}: Readonly<{
  data: UpcomingFavoriteShow
  index: number
  onClick: () => void
}>) => {
  const { show, day, stage, artists } = data
  const [firstArtist] = artists

  const startsAtDate = new Date(show.startsAt)
  const isPast = startsAtDate < new Date()
  const relativeTime = formatDistanceToNowStrict(startsAtDate, {
    addSuffix: true,
    locale: es,
  })

  const handleMouseEnter = useCallback(() => {
    import('@/components/show-drawer')
  }, [])

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.25),
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl p-3',
        'bg-secondary/50 hover:bg-secondary transition-colors',
        'active:scale-[1.02] active:transition-transform'
      )}
    >
      <div className="size-11 shrink-0 overflow-hidden rounded-lg shadow-sm">
        {firstArtist?.image ? (
          <Image
            src={`/images/artists/${firstArtist.image}`}
            alt={firstArtist.name}
            width={44}
            height={44}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-zinc-600 to-zinc-800">
            <span className="text-xs font-bold text-white">
              {firstArtist?.name
                .split(' ')
                .map((word) => word[0])
                .join('') || '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="text-foreground w-full truncate text-left font-semibold">
          {show.title}
        </span>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <MapPinIcon className="size-3" />
          <span>{stage.name}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <CalendarIcon className="size-3" />
          <span>{day.name}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{format(startsAtDate, 'HH:mm')}</span>
        </div>
      </div>

      <div
        className={cn(
          'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
          isPast ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'
        )}
      >
        {relativeTime}
      </div>
    </motion.button>
  )
}

const NoFavoritesState = () => (
  <div className="flex flex-col items-center gap-3 py-6 text-center">
    <div className="bg-muted flex size-12 items-center justify-center rounded-full">
      <HeartIcon className="text-muted-foreground size-6" />
    </div>
    <div className="space-y-1">
      <p className="text-foreground font-medium">Sin favoritos</p>
      <p className="text-muted-foreground text-sm">
        Agregá shows desde la grilla para verlos acá
      </p>
    </div>
  </div>
)

const AllPastState = () => (
  <div className="flex flex-col items-center gap-3 py-6 text-center">
    <div className="bg-muted flex size-12 items-center justify-center rounded-full">
      <CalendarCheckIcon className="text-muted-foreground size-6" />
    </div>
    <div className="space-y-1">
      <p className="text-foreground font-medium">Tus favoritos ya tocaron</p>
      <p className="text-muted-foreground text-sm">
        Explorá la grilla para agregar nuevos shows
      </p>
    </div>
  </div>
)

const LoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <Spinner className="text-muted-foreground size-6" />
  </div>
)

export const UpcomingFavoritesCard = ({
  className,
}: Readonly<{ className?: string }>) => {
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null)
  const result = useUpcomingFavorites()

  const handleShowClick = useCallback((showId: number) => {
    setSelectedShowId(showId)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setSelectedShowId(null)
  }, [])

  return (
    <>
      <Card className={cn('gap-4 py-4', className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-sm font-semibold tracking-wider text-zinc-500 uppercase">
            Favoritos
          </CardTitle>
        </CardHeader>

        <CardContent>
          {result.status === 'loading' && <LoadingState />}
          {result.status === 'no-favorites' && <NoFavoritesState />}
          {result.status === 'all-past' && <AllPastState />}
          {result.status === 'has-upcoming' && (
            <div className="flex flex-col gap-2">
              {result.shows.map((item, index) => (
                <FavoriteShowItem
                  key={item.show.id}
                  data={item}
                  index={index}
                  onClick={() => handleShowClick(item.show.id)}
                />
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <Button>
            <Link href="/schedule" className="flex items-center gap-2">
              Ver grilla completa
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {selectedShowId !== null && (
        <ShowDrawer showId={selectedShowId} onClose={handleDrawerClose} />
      )}
    </>
  )
}
