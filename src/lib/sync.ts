import { isBefore } from 'date-fns'

import { env } from '@/env'

import { db, Show } from './db'

const TIMEOUT = 10000

// Fetch functions
async function $fetch(url: string) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
    })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

// Fetch from bundled data (always available offline)
async function fetchBundledData(filename: string) {
  try {
    const response = await fetch(`/data/${filename}`)
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

// Sync functions
export async function checkNeedsSync() {
  // Always sync if database is empty (first run or failed previous sync)
  const dayCount = await db.days.count()
  if (dayCount === 0) return true

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
  const existingShows = await db.shows.toArray()

  const showFavorites = new Map(existingShows.map((s) => [s.id, s.isFavorite]))

  // Fetch from API (with bundled data fallback)
  const [days, stages, artists, shows] = await Promise.all([
    fetchDays(),
    fetchStages(),
    fetchArtists(),
    fetchShows(),
  ])

  // If all fetches failed, abort sync
  if (!days || !stages || !artists || !shows) {
    throw new Error('Failed to fetch data from API and bundled sources')
  }

  const mergedShows = shows.map((show: Show) => ({
    ...show,
    isFavorite: showFavorites.get(show.id) ?? show.isFavorite,
  }))

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Sync transaction timeout')), TIMEOUT)
  })

  const transactionPromise = db.transaction(
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

  await Promise.race([transactionPromise, timeoutPromise])

  await db.meta.put({ key: 'lastSync', value: new Date().toISOString() })
}
