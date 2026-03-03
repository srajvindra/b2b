"use client"

import type { Lead } from "@/features/leads/types"

export interface OverviewTabProps {
  lead: Lead
}

export function OverviewTab({ lead }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-medium text-foreground mb-2">Tasks</h3>
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      </section>
      <section>
        <h3 className="font-medium text-foreground mb-2">Activity</h3>
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      </section>
    </div>
  )
}
