'use client'

import { useMemo } from 'react'

import { useDataStore } from '@/contexts/data-store-context'

export function useDays() {
  const { days, isLoading } = useDataStore()
  return { days, isLoading }
}

export function useDay(dayId: number | null) {
  const { days } = useDataStore()
  return useMemo(
    () => (dayId ? days.find((d) => d.id === dayId) : undefined),
    [days, dayId]
  )
}

export function useArtists() {
  const { artists, isLoading } = useDataStore()
  const sortedArtists = useMemo(
    () => [...artists].toSorted((a, b) => a.name.localeCompare(b.name)),
    [artists]
  )
  return { artists: sortedArtists, isLoading }
}

export function useArtist(artistId: number | null) {
  const { artists } = useDataStore()
  return useMemo(
    () => (artistId ? artists.find((a) => a.id === artistId) : undefined),
    [artists, artistId]
  )
}

export function useArtistsByIds(artistIds: number[]) {
  const { artists } = useDataStore()
  return useMemo(
    () => artists.filter((a) => artistIds.includes(a.id)),
    [artists, artistIds]
  )
}

export function useStagesForDay(dayId: number | null) {
  const { stages } = useDataStore()
  return useMemo(() => {
    if (!dayId) {
      return []
    }
    return stages
      .filter((s) => s.dayIds.includes(dayId))
      .toSorted((a, b) => a.order - b.order)
  }, [stages, dayId])
}

export function useStage(stageId: number | null) {
  const { stages } = useDataStore()
  return useMemo(
    () => (stageId ? stages.find((s) => s.id === stageId) : undefined),
    [stages, stageId]
  )
}

export function useShowsForDay(dayId: number | null) {
  const { shows } = useDataStore()
  return useMemo(() => {
    if (!dayId) {
      return []
    }
    return shows.filter((s) => s.dayId === dayId)
  }, [shows, dayId])
}

export function useShow(showId: number | null) {
  const { shows } = useDataStore()
  return useMemo(
    () => (showId ? shows.find((s) => s.id === showId) : undefined),
    [shows, showId]
  )
}

export function useShowsForArtist(artistId: number | null) {
  const { shows } = useDataStore()
  return useMemo(() => {
    if (!artistId) {
      return []
    }
    return shows.filter((s) => s.artistIds.includes(artistId))
  }, [shows, artistId])
}

export function useFavoriteShows() {
  const { shows, isLoading } = useDataStore()
  const favoriteShows = useMemo(
    () =>
      shows
        .filter((s) => s.isFavorite === 1)
        .sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        ),
    [shows]
  )
  return { favoriteShows, isLoading }
}

export function useToggleFavorite() {
  const { updateShowFavorite, shows } = useDataStore()

  return async (showId: number) => {
    const show = shows.find((s) => s.id === showId)
    if (show) {
      await updateShowFavorite(showId, show.isFavorite ? 0 : 1)
    }
  }
}

export function useDisclaimer() {
  const { getMeta, setMeta, isLoading } = useDataStore()
  const acknowledged = getMeta('disclaimerAcknowledged')

  const acknowledge = async () => {
    await setMeta('disclaimerAcknowledged', new Date().toISOString())
  }

  return { acknowledge, acknowledged, isLoading }
}
