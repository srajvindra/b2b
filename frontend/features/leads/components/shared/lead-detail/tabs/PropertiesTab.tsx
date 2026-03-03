"use client"

import type { Lead } from "@/features/leads/types"

export interface PropertiesTabProps {
  lead: Lead
}

export function PropertiesTab({ lead }: PropertiesTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Properties for {lead.name}</p>
    </div>
  )
}
