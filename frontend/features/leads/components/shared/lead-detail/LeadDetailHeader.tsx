"use client"

import type { Lead } from "@/features/leads/types"

export interface LeadDetailHeaderProps {
  lead: Lead
  /** Stage labels for progress bar */
  stages?: string[]
}

/**
 * Name, email, phone, lead source, and stage progress bar.
 * Used inside LeadDetailPage; owner/tenant detail pages may use their own header.
 */
export function LeadDetailHeader({ lead, stages }: LeadDetailHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {lead.email && <span>Primary: {lead.email}</span>}
        {lead.phone && <span>Primary: {lead.phone}</span>}
      </div>
      {lead.source && <p className="text-sm text-muted-foreground">Lead Source: {lead.source}</p>}
      {stages && stages.length > 0 && (
        <div className="flex gap-1 mt-2">
          {stages.map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded ${lead.stage === s ? "bg-primary" : "bg-muted"}`}
              title={s}
            />
          ))}
        </div>
      )}
    </div>
  )
}
