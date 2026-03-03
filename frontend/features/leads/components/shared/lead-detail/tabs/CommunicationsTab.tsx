"use client"

import type { Lead } from "@/features/leads/types"

export interface CommunicationsTabProps {
  lead: Lead
}

export function CommunicationsTab({ lead }: CommunicationsTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Communications for {lead.name}</p>
    </div>
  )
}
