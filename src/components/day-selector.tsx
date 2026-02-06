import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NAV_BAR_HEIGHT } from '@/constants'
import { useDays } from '@/hooks/use-data'

export const DaySelector = ({
  selectedDayId,
  onDayChange,
}: {
  selectedDayId: number
  onDayChange: (dayId: number) => void
}) => {
  const { days } = useDays()

  const selectedDay = days.find((day) => day.id === selectedDayId)
  const otherDay = days.find((day) => day.id !== selectedDayId)

  if (!selectedDay || !otherDay) {
    return null
  }

  return (
    <div
      className="flex w-full items-center justify-between bg-linear-to-tr from-zinc-800 to-zinc-950 px-4"
      style={{ height: NAV_BAR_HEIGHT }}
    >
      <h2 className="text-xl font-bold tracking-wider text-white uppercase">
        {selectedDay.name}
      </h2>
      <Button
        className="flex items-center gap-1 bg-white text-black hover:bg-white"
        onClick={() => onDayChange(otherDay.id)}
      >
        Ir al {otherDay.name}
        <ArrowRightIcon />
      </Button>
    </div>
  )
}
