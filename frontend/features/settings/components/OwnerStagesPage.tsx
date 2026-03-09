"use client"

import { useRouter } from "next/navigation"

import { StagesCategoriesPage } from "./StagesCategoriesPage"
import { initialOwnerCategories } from "../data/ownerStages"

export function OwnerStagesPage() {
  const router = useRouter()

  return (
    <StagesCategoriesPage
      title="Owner Categories"
      description="Select a category to view and manage leads"
      initialCategories={initialOwnerCategories}
      leadCountLabel="leads"
      onOpenStageEdit={(categoryId, categoryName, status) => {
        router.push(`/settings/stages/owners/${categoryId}/${status.id}`)
      }}
    />
  )
}

