"use client"

import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import OwnerDetailPage from "@/components/owner-detail-page"
import { TenantApplicationDetailView } from "@/features/leads/components/TenantApplicationDetailView"
import { initialLeadsData, CATEGORY_LEADS, PROSPECT_CATEGORY_LEADS } from "@/features/leads/data/mockLeads"
import type { Lead } from "@/features/leads/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { useNav } from "@/app/dashboard/page"

export interface LeadDetailPageProps {
  mode: "owner-prospects" | "lease-prospects"
  /** When not provided, read from useParams() */
  categoryId?: string
  /** When not provided, read from useParams() */
  leadId?: string
}

function findLeadById(leadId: string, mode: string, categoryId?: string): Lead | null {
  const id = Number(leadId)
  if (Number.isNaN(id)) return null

  const fromCategory =
    mode === "owner-prospects" && categoryId
      ? CATEGORY_LEADS[categoryId]
      : mode === "lease-prospects" && categoryId
        ? PROSPECT_CATEGORY_LEADS[categoryId]
        : null
  const lead = fromCategory?.find((l) => l.id === id) ?? initialLeadsData.find((l) => l.id === id)
  return lead ?? null
}

/**
 * Screen 3: Single lead detail. Uses URL params for categoryId and leadId.
 * Renders shared owner or tenant detail; Back goes to leads list for category.
 */
export function LeadDetailPage({ mode, categoryId: categoryIdProp, leadId: leadIdProp }: LeadDetailPageProps) {
  const params = useParams()
  const router = useRouter()
  const nav = useNav()
  const categoryId = categoryIdProp ?? (params?.categoryId as string | undefined)
  const leadIdParam = leadIdProp ?? (params?.leadId as string | undefined)

  const lead = useMemo(
    () => (leadIdParam ? findLeadById(leadIdParam, mode, categoryId) : null),
    [leadIdParam, mode, categoryId],
  )

  const listPath = categoryId ? `/leads/${mode}/${categoryId}` : `/leads/${mode}`

  if (!leadIdParam || !lead) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(listPath)} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
        <p className="text-muted-foreground">Lead not found.</p>
      </div>
    )
  }

  if (mode === "owner-prospects") {
    return (
      <OwnerDetailPage
        lead={lead}
        onBack={() => router.push(listPath)}
        onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
      />
    )
  }

  return (
    <TenantApplicationDetailView
      lead={lead}
      onBack={() => router.push(listPath)}
      defaultTab={undefined}
      onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
      onConvertToTenant={(convertedLead, finalizedProperty) => {
        toast({
          title: "Prospect Converted to Tenant",
          description: `${convertedLead.name} has been moved to Tenants with ${finalizedProperty.name} as their assigned property.`,
        })
        router.push(listPath)
      }}
    />
  )
}
