"use client"

import { useMemo } from "react"
import { useQuickActions } from "@/context/QuickActionsContext"
import { getCalendarQuickActions } from "@/lib/quickActions"
import CalendarContent from "@/features/calendar/components/CalendarContent"
import { toast } from "@/components/ui/toast"

export default function Page() {
  const calendarQuickActions = useMemo(
    () =>
      getCalendarQuickActions({
        onSetAvailability: () => toast({ title: "Set showing availability" }),
        onAddPersonalCalendar: () => toast({ title: "Add Personal calendar" }),
      }),
    []
  )
  useQuickActions(calendarQuickActions, { subtitle: "Calendar" })

  return (
    <div className="p-6">
      <CalendarContent calendarType="staff-calendar" />
    </div>
  )
}
