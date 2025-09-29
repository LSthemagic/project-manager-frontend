"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
  disabled?: (date: Date) => boolean
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  disabled,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate
  let formattedDate = ""

  // Dias da semana
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      const isDisabled = disabled ? disabled(cloneDay) : false
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isSelected = selected && isSameDay(day, selected)
      const isTodayDate = isToday(day)

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "h-9 w-9 flex items-center justify-center text-sm cursor-pointer rounded-md transition-colors",
            !isCurrentMonth && "text-muted-foreground opacity-50",
            isSelected && "bg-primary text-primary-foreground",
            isTodayDate && !isSelected && "bg-accent text-accent-foreground",
            !isSelected && !isTodayDate && "hover:bg-accent hover:text-accent-foreground",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (!isDisabled && onSelect) {
              onSelect(cloneDay)
            }
          }}
        >
          <span>{formattedDate}</span>
        </div>
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    )
    days = []
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-9 w-9 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        {rows}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }