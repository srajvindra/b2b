"use client"

import { useParams, useRouter } from "next/navigation"
import { ContactProcessDetailView } from "@/features/contacts/components/ContactProcessDetail"
import type { ProcessData } from "@/features/contacts/types"
import { prospectProcesses } from "@/features/leads/data/ownerDetailData"
import { CATEGORY_LEADS } from "@/features/leads/data/mockLeads"

function findProcessById(processId: string): ProcessData | null {
  const all = [
    ...prospectProcesses.inProgress,
    ...prospectProcesses.completed,
    ...prospectProcesses.upcoming,
  ]
  return all.find((p) => p.id === processId) ?? null
}

export default function OwnerProspectProcessDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params?.categoryId as string
  const leadId = params?.leadId as string
  const processId = params?.processId as string

  const leadsInCategory = CATEGORY_LEADS[categoryId] ?? []
  const lead = leadsInCategory.find((l) => String(l.id) === String(leadId))
  const process = processId ? findProcessById(processId) : null

  if (!lead) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push(`/leads/owner-prospects/${categoryId}/lead/${leadId}`)}
        >
          Back to Owner Prospects
        </button>
        <p className="text-muted-foreground">Owner prospect not found.</p>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push(`/leads/owner-prospects/${categoryId}/lead/${leadId}`)}
        >
          Back to Owner Prospects
        </button>
        <p className="text-muted-foreground">Owner prospect process not found.</p>
      </div>
    )
  }

  return (
    <ContactProcessDetailView
      process={process}
      contactName={lead.name}
      onBack={() => router.push(`/leads/owner-prospects/${categoryId}/lead/${leadId}`)}
      ownerInfo={{
        name: lead.name,
        primaryEmail: lead.email,
        secondaryEmail: lead.secondaryEmail,
        primaryPhone: lead.phone,
        secondaryPhone: lead.secondaryPhone,
        leadSource: lead.source,
        address: lead.address ?? lead.property,
        startDate: lead.createdAt,
        closeDate: lead.lastTouch,
      }}
    />
  )
}
