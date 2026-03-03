"use client"

import { useParams, useRouter } from "next/navigation"
import { MOCK_CONTACTS } from "@/features/contacts/data/mockContacts"
import { TENANT_PROCESSES } from "@/features/contacts/tenant/data"
import { ContactProcessDetailView } from "@/features/contacts/components/ContactProcessDetail"
import type { OwnerProcessItem } from "@/features/contacts/types"

function findProcessById(processId: string): OwnerProcessItem | null {
  const all = [
    ...TENANT_PROCESSES.inProgress,
    ...TENANT_PROCESSES.completed,
    ...TENANT_PROCESSES.upcoming,
  ]
  return all.find((p) => p.id === processId) ?? null
}

export default function TenantProcessDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const processId = params?.processId as string

  const contact = MOCK_CONTACTS.find((c) => c.id === id && c.type === "Tenant")
  const process = processId ? findProcessById(processId) : null

  if (!contact) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push("/contacts/tenants")}
        >
          Back to Tenants
        </button>
        <p className="text-muted-foreground">Tenant not found.</p>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push(`/contacts/tenants/${id}`)}
        >
          Back to {contact.name}
        </button>
        <p className="text-muted-foreground">Process not found.</p>
      </div>
    )
  }

  return (
    <ContactProcessDetailView
      process={process}
      contactName={contact.name}
      onBack={() => router.push(`/contacts/tenants/${id}`)}
    />
  )
}
