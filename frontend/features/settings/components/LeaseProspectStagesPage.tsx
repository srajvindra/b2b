"use client"

import { useRouter } from "next/navigation"

import { StagesCategoriesPage } from "./StagesCategoriesPage"
import { initialLeaseProspectCategories } from "../data/leaseProspectStages"

export function LeaseProspectStagesPage() {
  const router = useRouter()

  return (
    <StagesCategoriesPage
      title="Lease Prospect Categories"
      description="Select a category to view and manage lease prospects"
      initialCategories={initialLeaseProspectCategories}
      leadCountLabel="leads"
      showConfigureWorkflow
      onOpenStageEdit={(categoryId, _categoryName, status) => {
        router.push(`/settings/stages/tenants/${categoryId}/${status.id}`)
      }}
    />
  )
}

