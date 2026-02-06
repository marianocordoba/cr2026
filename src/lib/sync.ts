import { isBefore } from 'date-fns'

import { env } from '@/env'

import { getDB, type Artist, type Day, type Show, type Stage } from './idb'

const TIMEOUT = 10_000

async function $fetch(url: string) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

async function fetchBundledData(filename: string) {
  try {
    const response = await fetch(`/data/${filename}`)
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch {
    return null
  }
}

async function fetchMeta() {
  return await $fetch(`${env.NEXT_PUBLIC_API_URL}/meta.json`)
}

async function fetchDays() {
  const data = await $fetch(`${env.NEXT_PUBLIC_API_URL}/days.json`)
  return data ?? (await fetchBundledData('days.json'))
}

async function fetchStages() {
  const data = await $fetch(`${env.NEXT_PUBLIC_API_URL}/stages.json`)
  return data ?? (await fetchBundledData('stages.json'))
}

async function fetchArtists() {
  const data = await $fetch(`${env.NEXT_PUBLIC_API_URL}/artists.json`)
  return data ?? (await fetchBundledData('artists.json'))
}

async function fetchShows() {
  const data = await $fetch(`${env.NEXT_PUBLIC_API_URL}/shows.json`)
  return data ?? (await fetchBundledData('shows.json'))
}

export async function checkNeedsSync(): Promise<boolean> {
  const db = await getDB()

  const dayCount = await db.count('days')
  if (dayCount === 0) {
    return true
  }

  if (!navigator.onLine) {
    return false
  }

  const remoteMeta = await fetchMeta()
  const lastSyncRecord = await db.get('meta', 'lastSync')

  if (!remoteMeta) {
    return false
  }
  if (!lastSyncRecord) {
    return true
  }

  return isBefore(
    new Date(lastSyncRecord.value),
    new Date(remoteMeta.lastUpdate)
  )
}

export async function syncData(): Promise<{
  days: Day[]
  artists: Artist[]
  stages: Stage[]
  shows: Show[]
}> {
  const db = await getDB()

  const existingShows = await db.getAll('shows')
  const showFavorites = new Map(existingShows.map((s) => [s.id, s.isFavorite]))

  const [days, stages, artists, shows] = await Promise.all([
    fetchDays(),
    fetchStages(),
    fetchArtists(),
    fetchShows(),
  ])

  if (!days || !stages || !artists || !shows) {
    throw new Error('Failed to fetch data from API and bundled sources')
  }

  const mergedShows = shows.map((show: Show) => ({
    ...show,
    isFavorite: showFavorites.get(show.id) ?? show.isFavorite,
  }))

  return {
    artists,
    days,
    shows: mergedShows,
    stages,
  }
}

export async function saveLastSync(): Promise<void> {
  const db = await getDB()
  await db.put('meta', { key: 'lastSync', value: new Date().toISOString() })
}
