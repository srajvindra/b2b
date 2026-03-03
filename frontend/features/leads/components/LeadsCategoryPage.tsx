"use client"

import { useRouter } from "next/navigation"
import { useLeads } from "@/features/leads/hooks/useLeads"
import { CategoryListView } from "@/features/leads/components/CategoryListView"

export interface LeadsCategoryPageProps {
  mode: "owner-prospects" | "lease-prospects"
}

export function LeadsCategoryPage({ mode }: LeadsCategoryPageProps) {
  const router = useRouter()
  const view = mode === "owner-prospects" ? "owners" : "lease-prospects"
  const params = { view }
  const {
    categorySearchQuery,
    setCategorySearchQuery,
    filteredCategories,
    filteredProspectCategories,
  } = useLeads({ params })

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
