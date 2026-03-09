"use client"

import { useParams, useRouter } from "next/navigation"
import LeadsPageContent from "@/features/leads/components/LeadsPageContent"
import { useQuickActions } from "@/context/QuickActionsContext"
import { ownerProspectsCategoryQuickActions } from "@/lib/quickActions"

const EMPTY_QUICK_ACTIONS: [] = []

export interface LeadsListPageProps {
  mode: "owner-prospects" | "lease-prospects"
  /** When not provided, read from useParams() */
  categoryId?: string
}

/**
 * Screen 2: Leads list for a category. Back goes to /leads/{mode}. Lead row click goes to /leads/{mode}/{categoryId}/lead/{leadId}.
 */
export function LeadsListPage({ mode, categoryId: categoryIdProp }: LeadsListPageProps) {
  const params = useParams()
  const router = useRouter()
  const categoryId = categoryIdProp ?? (params?.categoryId as string | undefined)
  const view = mode === "owner-prospects" ? "owners" : "lease-prospects"

  useQuickActions(mode === "owner-prospects" ? ownerProspectsCategoryQuickActions : EMPTY_QUICK_ACTIONS)

  return (
    <LeadsPageContent
      params={{ view }}
      categoryIdFromUrl={categoryId}
      basePath={`/leads/${mode}`}
      onBackToCategories={() => router.push(`/leads/${mode}`)}
      onLeadClick={(leadId) => categoryId && router.push(`/leads/${mode}/${categoryId}/lead/${leadId}`)}
    />
  )
}
