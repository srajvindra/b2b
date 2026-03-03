"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  leadsOwnersAutomations,
  leadsProspectsAutomations,
  contactsOwnersAutomations,
  contactsTenantsAutomations,
} from "@/features/operations/data/automations"
import { AutomationDetailPage } from "@/features/operations/components/AutomationDetailPage"
import { Button } from "@/components/ui/button"

const allAutomations = [
  ...leadsOwnersAutomations,
  ...leadsProspectsAutomations,
  ...contactsOwnersAutomations,
  ...contactsTenantsAutomations,
]

export default function AutomationDetailRoute() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? params.id : params.id?.[0]
  const automation = id ? allAutomations.find((a) => a.id === id) : undefined

  if (!automation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Automation not found</h1>
        <p className="text-gray-500 mb-4">The automation you’re looking for doesn’t exist or was removed.</p>
        <Button asChild variant="outline">
          <Link href="/operations/automations">Back to Automations</Link>
        </Button>
      </div>
    )
  }

  return (
    <AutomationDetailPage
      automation={automation}
      onBack={() => router.push("/operations/automations")}
    />
  )
}
