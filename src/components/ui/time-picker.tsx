"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TimePicker({ 
  value, 
  onChange, 
  placeholder = "Select time", 
  className,
  disabled = false 
}: TimePickerProps) {
  // Generate time options (00:00 to 23:30 in 30-minute intervals)
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayTime = new Date()
        displayTime.setHours(hour, minute)
        const displayString = displayTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        options.push({ value: timeString, label: displayString })
      }
    }
    return options
  }, [])

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full", className)}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <SelectValue placeholder={placeholder} className="truncate" />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {timeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
