"use client"

import type { Lead } from "@/features/leads/types"

export interface AuditLogTabProps {
  lead: Lead
}

export function AuditLogTab({ lead }: AuditLogTabProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Audit log for {lead.name}</p>
    </div>
  )
}
