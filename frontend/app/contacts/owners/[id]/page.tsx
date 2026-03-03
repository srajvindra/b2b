"use client"

import { useParams, useRouter } from "next/navigation"
import { MOCK_CONTACTS } from "@/features/contacts/data/mockContacts"
import OwnerContactDetailView from "@/features/contacts/components/OwnerContactDetailView"

export default function OwnerContactDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const contact = MOCK_CONTACTS.find((c) => c.id === id && c.type === "Owner")

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

  return (
    <OwnerContactDetailView
      contact={contact}
      onBack={() => router.push("/contacts/owners")}
      onNavigateToProcess={(process) => router.push(`/contacts/owners/${id}/process/${process.id}`)}
    />
  )
}


