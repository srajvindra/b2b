"use client"

import { LeadDetailPage } from "@/features/leads/components/shared/lead-detail/LeadDetailPage"

/** Screen 3: Single lead detail. Back → /leads/owner-prospects/[categoryId] */
export default function OwnerProspectLeadDetailPage() {
  return <LeadDetailPage mode="owner-prospects" />
}
