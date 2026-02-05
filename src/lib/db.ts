import Dexie, { EntityTable } from 'dexie'

export type Meta = {
  key: string
  value: string
}

export type Day = {
  id: number
  name: string
  startsAt: string
  endsAt: string
}

export type Artist = {
  id: number
  name: string
  image: string
  spotify: string
}

export type Stage = {
  id: number
  name: string
  dayIds: number[]
  order: number
}

export type Show = {
  id: number
  title: string
  dayId: number
  stageId: number
  artistIds: number[]
  startsAt: string
  endsAt: string
  isFavorite: number
}

export const db = new Dexie('cr2026') as Dexie & {
  meta: EntityTable<Meta, 'key'>
  days: EntityTable<Day, 'id'>
  artists: EntityTable<Artist, 'id'>
  stages: EntityTable<Stage, 'id'>
  shows: EntityTable<Show, 'id'>
}

db.version(1).stores({
  meta: '&key,value',
  days: '++id,name,startsAt,endsAt',
  artists: '++id,name,image,spotify',
  stages: '++id,name,*dayIds,order',
  shows: '++id,title,dayId,stageId,*artistIds,startsAt,endsAt,isFavorite',
})
