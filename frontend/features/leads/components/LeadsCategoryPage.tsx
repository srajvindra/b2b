"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CategoryListView } from "@/features/leads/components/CategoryListView"
import { OWNER_CATEGORIES, OWNER_PROSPECT_CATEGORIES } from "@/features/leads/data/mockLeads"

export interface LeadsCategoryPageProps {
  mode: "owner-prospects" | "lease-prospects"
}

export function LeadsCategoryPage({ mode }: LeadsCategoryPageProps) {
  const router = useRouter()
  const [categorySearchQuery, setCategorySearchQuery] = useState("")

  // Inlined (duplicated) from features/leads/hooks/useLeads.ts by request
  const filteredCategories = OWNER_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )
  const filteredProspectCategories = OWNER_PROSPECT_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  const categories = mode === "owner-prospects" ? filteredCategories : filteredProspectCategories
  const basePath = `/leads/${mode}`

  const handleSelectCategory = (id: string) => {
    router.push(`${basePath}/${id}`)
  }

  if (mode === "owner-prospects") {
    return (
      <CategoryListView
        title="Owner Categories"
        subtitle="Select a category to view and manage leads"
        categories={categories}
        searchQuery={categorySearchQuery}
        onSearchChange={setCategorySearchQuery}
        onSelectCategory={handleSelectCategory}
      />
    )
  }

  return (
    <CategoryListView
      title="Lease Prospect Categories"
      subtitle="Select a category to view and manage lease prospects"
      categories={categories}
      searchQuery={categorySearchQuery}
      onSearchChange={setCategorySearchQuery}
      onSelectCategory={handleSelectCategory}
    />
  )
}
