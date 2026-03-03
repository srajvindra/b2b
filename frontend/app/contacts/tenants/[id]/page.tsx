"use client"

import { useParams, useRouter } from "next/navigation"
import { MOCK_CONTACTS } from "@/features/contacts/data/mockContacts"
import TenantContactDetailView from "@/features/contacts/components/TenantContactDetailView"

export default function TenantContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const contact = MOCK_CONTACTS.find((c) => c.id === id && c.type === "Tenant")

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

  return (
    <TenantContactDetailView
      contact={contact}
      onBack={() => router.push("/contacts/tenants")}
      onNavigateToUnitDetail={() => {}}
      onNavigateToProcess={(process) => router.push(`/contacts/tenants/${id}/process/${process.id}`)}
    />
  )
}

