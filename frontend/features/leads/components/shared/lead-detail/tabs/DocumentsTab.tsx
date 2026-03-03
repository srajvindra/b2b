"use client"

import type { Lead } from "@/features/leads/types"

export interface DocumentsTabProps {
  lead: Lead
}

export function DocumentsTab({ lead }: DocumentsTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Documents for {lead.name}</p>
    </div>
  )
}
