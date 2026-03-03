"use client"

import { StagesCategoriesPage } from "./StagesCategoriesPage"
import { initialOwnerCategories } from "../data/ownerStages"

export function OwnerStagesPage() {
  return (
    <StagesCategoriesPage
      title="Owner Categories"
      description="Select a category to view and manage leads"
      initialCategories={initialOwnerCategories}
      leadCountLabel="leads"
    />
  )
}
