"use client"

import type { Lead } from "@/features/leads/types"

export interface ProcessesTabProps {
  lead: Lead
}

export function ProcessesTab({ lead }: ProcessesTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Processes for {lead.name}</p>
    </div>
  )
}
