"use client"

import { useMemo, useState } from "react"
import { useQuickActions } from "@/context/QuickActionsContext"
import { getCalendarQuickActions } from "@/lib/quickActions"
import CalendarContent from "@/features/calendar/components/CalendarContent"
import { toast } from "@/components/ui/toast"

export default function Page() {
  const [viewMode, setViewMode] = useState<"default" | "availability">("default")

  const calendarQuickActions = useMemo(
    () =>
      getCalendarQuickActions({
        onSetAvailability: () => setViewMode("availability"),
        onAddPersonalCalendar: () => toast({ title: "Add Personal calendar" }),
      }),
    []
  )
  useQuickActions(calendarQuickActions, {
    subtitle: "Calendar",
    aiSuggestedPrompts: [
      "What showings are scheduled today?",
      "Block time for a showing",
      "Sync with my calendar",
    ],
    aiPlaceholder: "Ask about calendar...",
  })

  return (
    <div className="p-6">
      <CalendarContent
        calendarType="property-calendar"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  )
}
