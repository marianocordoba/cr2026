'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Artist, Day, Meta, Show, Stage } from '@/lib/idb'

import { getDB } from '@/lib/idb'

interface DataStoreState {
  isLoading: boolean
  isInitialized: boolean
  meta: Map<string, string>
  days: Day[]
  artists: Artist[]
  stages: Stage[]
  shows: Show[]
}

interface DataStoreActions {
  getMeta: (key: string) => string | undefined
  setMeta: (key: string, value: string) => Promise<void>
  updateShowFavorite: (showId: number, isFavorite: number) => Promise<void>
  bulkUpdate: (data: {
    days?: Day[]
    artists?: Artist[]
    stages?: Stage[]
    shows?: Show[]
  }) => Promise<void>
  reloadFromDB: () => Promise<void>
}

type DataStoreContextValue = DataStoreState & DataStoreActions

const DataStoreContext = createContext<DataStoreContextValue | null>(null)

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataStoreState>({
    artists: [],
    days: [],
    isInitialized: false,
    isLoading: true,
    meta: new Map(),
    shows: [],
    stages: [],
  })

  const loadFromDB = useCallback(async () => {
    const db = await getDB()

    const [metaRecords, days, artists, stages, shows] = await Promise.all([
      db.getAll('meta'),
      db.getAll('days'),
      db.getAll('artists'),
      db.getAll('stages'),
      db.getAll('shows'),
    ])

    const metaMap = new Map(metaRecords.map((m) => [m.key, m.value]))

    setState({
      artists,
      days,
      isInitialized: true,
      isLoading: false,
      meta: metaMap,
      shows,
      stages,
    })
  }, [])

  useEffect(() => {
    loadFromDB()
  }, [loadFromDB])

  const getMeta = useCallback(
    (key: string) => state.meta.get(key),
    [state.meta]
  )

  const setMeta = useCallback(async (key: string, value: string) => {
    const db = await getDB()
    await db.put('meta', { key, value })

    setState((prev) => ({
      ...prev,
      meta: new Map(prev.meta).set(key, value),
    }))
  }, [])

  const updateShowFavorite = useCallback(
    async (showId: number, isFavorite: number) => {
      const db = await getDB()
      const show = await db.get('shows', showId)

      if (show) {
        await db.put('shows', { ...show, isFavorite })

        setState((prev) => ({
          ...prev,
          shows: prev.shows.map((s) =>
            s.id === showId ? { ...s, isFavorite } : s
          ),
        }))
      }
    },
    []
  )

  const bulkUpdate = useCallback(
    async (data: {
      days?: Day[]
      artists?: Artist[]
      stages?: Stage[]
      shows?: Show[]
    }) => {
      const db = await getDB()

      const tx = db.transaction(
        ['days', 'artists', 'stages', 'shows'],
        'readwrite'
      )

      const operations: Promise<unknown>[] = []

      if (data.days) {
        for (const day of data.days) {
          operations.push(tx.objectStore('days').put(day))
        }
      }
      if (data.artists) {
        for (const artist of data.artists) {
          operations.push(tx.objectStore('artists').put(artist))
        }
      }
      if (data.stages) {
        for (const stage of data.stages) {
          operations.push(tx.objectStore('stages').put(stage))
        }
      }
      if (data.shows) {
        for (const show of data.shows) {
          operations.push(tx.objectStore('shows').put(show))
        }
      }

      await Promise.all(operations)
      await tx.done

      setState((prev) => ({
        ...prev,
        days: data.days ?? prev.days,
        artists: data.artists ?? prev.artists,
        stages: data.stages ?? prev.stages,
        shows: data.shows ?? prev.shows,
      }))
    },
    []
  )

  const reloadFromDB = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    await loadFromDB()
  }, [loadFromDB])

  const value = useMemo<DataStoreContextValue>(
    () => ({
      ...state,
      getMeta,
      setMeta,
      updateShowFavorite,
      bulkUpdate,
      reloadFromDB,
    }),
    [state, getMeta, setMeta, updateShowFavorite, bulkUpdate, reloadFromDB]
  )

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  )
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider')
  }
  return context
}
