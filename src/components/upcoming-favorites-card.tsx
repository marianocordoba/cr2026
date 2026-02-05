'use client'

import {
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CalendarIcon,
  HeartIcon,
  MapPinIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'

import { ShowDrawer } from '@/components/show-drawer'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { db, type Artist, type Day, type Show, type Stage } from '@/lib/db'
import { cn } from '@/lib/utils'

type UpcomingFavoriteShow = {
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

function useUpcomingFavorites(): FavoriteResult {
  const result = useLiveQuery(async () => {
    const favoriteShows = await db.shows.where('isFavorite').equals(1).toArray()
    const sortedShows = favoriteShows.toSorted(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    )

    if (favoriteShows.length === 0) {
      return { status: 'no-favorites' as const }
    }

    const now = new Date()
    const upcomingShows = sortedShows
      .filter((show) => {
        const showDate = new Date(show.startsAt)

        return differenceInMinutes(showDate, now) > -60
      })
      .slice(0, 10)

    if (upcomingShows.length === 0) {
      return { status: 'all-past' as const }
    }

    const enriched = await Promise.all(
      upcomingShows.map(async (show) => {
        const [day, stage, artists] = await Promise.all([
          db.days.get(show.dayId),
          db.stages.get(show.stageId),
          db.artists.where('id').anyOf(show.artistIds).toArray(),
        ])
        return { show, day: day!, stage: stage!, artists }
      })
    )

    return { status: 'has-upcoming' as const, shows: enriched }
  }, [])

  if (result === undefined) {
    return { status: 'loading' }
  }

  return result
}

function FavoriteShowItem({
  data,
  index,
  onClick,
}: Readonly<{
  data: UpcomingFavoriteShow
  index: number
  onClick: () => void
}>) {
  const { show, day, stage, artists } = data
  const firstArtist = artists[0]

  const startsAtDate = new Date(show.startsAt)
  const isPast = startsAtDate < new Date()
  const relativeTime = formatDistanceToNowStrict(startsAtDate, {
    addSuffix: true,
    locale: es,
  })

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.25),
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
          <img
            src={`/images/artists/${firstArtist.image}`}
            alt={firstArtist.name}
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

function NoFavoritesState() {
  return (
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
}

function AllPastState() {
  return (
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
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <Spinner className="text-muted-foreground size-6" />
    </div>
  )
}

export function UpcomingFavoritesCard({
  className,
}: Readonly<{ className?: string }>) {
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null)
  const result = useUpcomingFavorites()

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
                  onClick={() => setSelectedShowId(item.show.id)}
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

      <ShowDrawer
        showId={selectedShowId}
        onClose={() => setSelectedShowId(null)}
      />
    </>
  )
}
