'use client'

import { SearchIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type SearchBarProps = Readonly<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}>

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar artistas...',
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'fixed w-dvw h-24 top-0 z-20 px-4 flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-950',
        className
      )}
    >
      <div
        className={cn(
          'relative flex items-center gap-3',
          'h-14 w-full rounded-2xl px-4',
          'bg-white backdrop-blur-md',
          'shadow-lg shadow-black/5',
          'transition-all duration-200',
          'focus-within:ring-primary/30 focus-within:shadow-xl focus-within:shadow-primary/10'
        )}
      >
        <SearchIcon className="size-5 shrink-0 text-zinc-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent text-base',
            'text-zinc-900 placeholder:text-zinc-400',
            'outline-none'
          )}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            className={cn(
              'flex size-7 items-center justify-center rounded-full',
              'bg-zinc-100 text-zinc-500',
              'hover:bg-zinc-200 hover:text-zinc-700',
              'transition-colors duration-150',
              'active:scale-95'
            )}
            aria-label="Limpiar búsqueda"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
