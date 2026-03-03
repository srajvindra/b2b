"use client"

import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone, StickyNote, Calendar, UserCog } from "lucide-react"

export function LeadQuickActions() {
  const items = [
    { label: "Send Email", icon: Mail },
    { label: "Send SMS", icon: MessageSquare },
    { label: "Log Call", icon: Phone },
    { label: "Add Note", icon: StickyNote },
    { label: "Schedule Meeting", icon: Calendar },
    { label: "Reassign Lead", icon: UserCog },
  ]
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {items.map(({ label, icon: Icon }) => (
          <Button key={label} variant="outline" className="justify-start w-full">
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
