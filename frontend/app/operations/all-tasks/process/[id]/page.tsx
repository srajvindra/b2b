"use client"

import { useParams, useRouter } from "next/navigation"
import { ContactProcessDetailView } from "@/features/contacts/components/ContactProcessDetail"
import type { ProcessData } from "@/features/contacts/types"
import { leaseProspectProcesses } from "@/features/leads/data/tenantApplicationDetail"
import { PROSPECT_CATEGORY_LEADS } from "@/features/leads/data/mockLeads"

function findProcessById(processId: string): ProcessData | null {
  const all: ProcessData[] = [
    ...leaseProspectProcesses.inProgress,
    ...leaseProspectProcesses.completed,
    ...leaseProspectProcesses.upcoming,
  ]
  return all.find((p) => p.id === processId) ?? null
}

export default function LeaseProspectProcessDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const processId = params?.id as string

  const process = processId ? findProcessById(processId) : null

  if (!process) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push(`/operations/all-tasks`)}
        >
          Back to All Tasks
        </button>
        <p className="text-muted-foreground">Process not found.</p>
      </div>
    )
  }

  return (
    <ContactProcessDetailView
      process={process}
      contactName={"David Smith"}
      onBack={() => router.push(`/operations/all-tasks`)}
      ownerInfo={{
        name: "David Smith",
        primaryEmail: "david.smith@example.com",
        primaryPhone: "123-456-7890",
        address: "123 Main St, Anytown, USA",
        startDate: "2021-01-01",
        closeDate: "2021-01-01",
      }}
    />
  )
}
