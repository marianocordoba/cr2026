import { type DBSchema, type IDBPDatabase, openDB } from 'idb'

export interface Meta {
  key: string
  value: string
}

export interface Day {
  id: number
  name: string
  startsAt: string
  endsAt: string
}

export interface Artist {
  id: number
  name: string
  image: string
  spotify: string
}

export interface Stage {
  id: number
  name: string
  dayIds: number[]
  order: number
}

export interface Show {
  id: number
  title: string
  dayId: number
  stageId: number
  artistIds: number[]
  startsAt: string
  endsAt: string
  isFavorite: number
}

interface CR2026DB extends DBSchema {
  meta: {
    key: string
    value: Meta
  }
  days: {
    key: number
    value: Day
  }
  artists: {
    key: number
    value: Artist
    indexes: { 'by-name': string }
  }
  stages: {
    key: number
    value: Stage
    indexes: { 'by-order': number }
  }
  shows: {
    key: number
    value: Show
    indexes: {
      'by-dayId': number
      'by-isFavorite': number
    }
  }
}

const DB_NAME = 'cr2026'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<CR2026DB> | null = null

export async function getDB(): Promise<IDBPDatabase<CR2026DB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<CR2026DB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' })
      }

      if (!db.objectStoreNames.contains('days')) {
        db.createObjectStore('days', { keyPath: 'id' })
      }

      if (!db.objectStoreNames.contains('artists')) {
        const artistStore = db.createObjectStore('artists', { keyPath: 'id' })
        artistStore.createIndex('by-name', 'name')
      }

      if (!db.objectStoreNames.contains('stages')) {
        const stageStore = db.createObjectStore('stages', { keyPath: 'id' })
        stageStore.createIndex('by-order', 'order')
      }

      if (!db.objectStoreNames.contains('shows')) {
        const showStore = db.createObjectStore('shows', { keyPath: 'id' })
        showStore.createIndex('by-dayId', 'dayId')
        showStore.createIndex('by-isFavorite', 'isFavorite')
      }
    },
  })

  return dbInstance
}

export async function deleteDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
  const { deleteDB } = await import('idb')
  await deleteDB(DB_NAME)
}
