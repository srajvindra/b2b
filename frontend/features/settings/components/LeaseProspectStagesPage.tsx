"use client"

import { StagesCategoriesPage } from "./StagesCategoriesPage"
import { initialLeaseProspectCategories } from "../data/leaseProspectStages"

export function LeaseProspectStagesPage() {
  return (
    <StagesCategoriesPage
      title="Lease Prospect Categories"
      description="Select a category to view and manage lease prospects"
      initialCategories={initialLeaseProspectCategories}
      leadCountLabel="leads"
      showConfigureWorkflow
      onOpenStageEdit={() => {
        // TODO: open workflow config panel / route when implemented
      }}
    />
  )
}
