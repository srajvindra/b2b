"use client"

import { CalendarCheck, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export interface CalendarPanelProps {
  /** When provided, "Set showing availability" opens the availability view instead of toasting */
  onSetAvailability?: () => void
}

export function CalendarPanel({ onSetAvailability }: CalendarPanelProps) {
  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b bg-background flex-shrink-0">
        <h2 className="font-semibold text-base text-gray-800">Quick Actions</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 bg-[rgba(248,245,245,1)]">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-start bg-white hover:bg-gray-50"
            onClick={() => (onSetAvailability ? onSetAvailability() : toast({ title: "Set showing availability" }))}
          >
            <CalendarCheck className="h-4 w-4 mr-2" />
            Set showing availability
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-white hover:bg-gray-50"
            onClick={() => toast({ title: "Add Personal calendar" })}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add Personal calendar
          </Button>
        </div>
      </div>
    </div>
  )
}
