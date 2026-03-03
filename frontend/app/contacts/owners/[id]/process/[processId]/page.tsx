"use client"

import { useParams, useRouter } from "next/navigation"
import { MOCK_CONTACTS } from "@/features/contacts/data/mockContacts"
import { OWNER_PROCESSES } from "@/features/contacts/data/ownerDetailData"
import { ContactProcessDetailView } from "@/features/contacts/components/ContactProcessDetail"
import type { OwnerProcessItem } from "@/features/contacts/types"

function findProcessById(processId: string): OwnerProcessItem | null {
  const all = [
    ...OWNER_PROCESSES.inProgress,
    ...OWNER_PROCESSES.completed,
    ...OWNER_PROCESSES.upcoming,
  ]
  return all.find((p) => p.id === processId) ?? null
}

export default function OwnerProcessDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const processId = params?.processId as string

  const contact = MOCK_CONTACTS.find((c) => c.id === id && c.type === "Owner")
  const process = processId ? findProcessById(processId) : null

  if (!contact) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push("/contacts/owners")}
        >
          Back to Owners
        </button>
        <p className="text-muted-foreground">Owner not found.</p>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push(`/contacts/owners/${id}`)}
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
      onBack={() => router.push(`/contacts/owners/${id}`)}
    />
  )
}
