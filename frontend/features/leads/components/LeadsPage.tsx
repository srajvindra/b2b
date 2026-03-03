"use client"

import LeadsPageContent from "@/features/leads/components/LeadsPageContent"

export interface LeadsPageProps {
  /** 'owner-prospects' for Owner Prospects, 'lease-prospects' for Lease Prospects */
  mode: "owner-prospects" | "lease-prospects"
}

/**
 * Thin wrapper for the leads page. It maps route mode into the internal
 * `params.view` expected by the legacy implementation, and keeps the app
 * routes very small (they just pass the mode).
 */
export function LeadsPage({ mode }: LeadsPageProps) {
  const view = mode === "owner-prospects" ? "owners" : "lease-prospects"
  const params = { view }
  return <LeadsPageContent params={params} />
}

