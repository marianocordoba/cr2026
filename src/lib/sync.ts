import { isBefore } from 'date-fns'

import { env } from '@/env'

import { Artist, db, Show } from './db'

// Fetch functions
async function $fetch(url: string) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

async function fetchMeta() {
  return await $fetch(`${env.NEXT_PUBLIC_API_URL}/meta.json`)
}

async function fetchDays() {
  return await $fetch(`${env.NEXT_PUBLIC_API_URL}/days.json`)
}

async function fetchStages() {
  return await $fetch(`${env.NEXT_PUBLIC_API_URL}/stages.json`)
}

async function fetchArtists() {
  return await $fetch(`${env.NEXT_PUBLIC_API_URL}/artists.json`)
}

async function fetchShows() {
  return await $fetch(`${env.NEXT_PUBLIC_API_URL}/shows.json`)
}

// Sync functions
export async function checkNeedsSync() {
  if (!navigator.onLine) return false

  const remoteMeta = await fetchMeta()
  const lastSync = await db.meta.get('lastSync')

  if (!remoteMeta) return false
  if (!lastSync) return true

  if (isBefore(new Date(lastSync.value), new Date(remoteMeta.lastUpdate))) {
    return true
  }
}

export async function sync() {
  if (!navigator.onLine) return

  const existingShows = await db.shows.toArray()

  const showFavorites = new Map(existingShows.map((s) => [s.id, s.isFavorite]))

  const [days, stages, artists, shows] = await Promise.all([
    fetchDays(),
    fetchStages(),
    fetchArtists(),
    fetchShows(),
  ])

  const mergedShows = shows.map((show: Show) => ({
    ...show,
    isFavorite: showFavorites.get(show.id) ?? show.isFavorite,
  }))

  await db.transaction(
    'rw',
    db.days,
    db.stages,
    db.artists,
    db.shows,
    async () => {
      await Promise.all([
        db.days.bulkPut(days, { allKeys: true }),
        db.stages.bulkPut(stages, { allKeys: true }),
        db.artists.bulkPut(artists, { allKeys: true }),
        db.shows.bulkPut(mergedShows, { allKeys: true }),
      ])
    }
  )

  await db.meta.put({ key: 'lastSync', value: new Date().toISOString() })
}
