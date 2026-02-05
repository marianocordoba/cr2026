import type { EntityTable } from 'dexie'
import Dexie from 'dexie'

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

export const db = new Dexie('cr2026', {
  cache: 'immutable',
}) as Dexie & {
  meta: EntityTable<Meta, 'key'>
  days: EntityTable<Day, 'id'>
  artists: EntityTable<Artist, 'id'>
  stages: EntityTable<Stage, 'id'>
  shows: EntityTable<Show, 'id'>
}

db.version(1).stores({
  artists: '++id,name,image,spotify',
  days: '++id,name,startsAt,endsAt',
  meta: '&key,value',
  shows: '++id,title,dayId,stageId,*artistIds,startsAt,endsAt,isFavorite',
  stages: '++id,name,*dayIds,order',
})
