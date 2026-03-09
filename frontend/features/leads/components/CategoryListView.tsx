"use client"

import { useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { Search, FolderOpen, Plus, ChevronRight, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useQuickActions } from "@/context/QuickActionsContext"
import { ownerProspectsCategoriesQuickActions } from "@/lib/quickActions"

const EMPTY_QUICK_ACTIONS: [] = []

export interface CategoryItem {
  id: string
  name: string
  count: number
  color: string
}

export interface CategoryListViewProps {
  title: string
  subtitle: string
  categories: CategoryItem[]
  searchQuery: string
  onSearchChange: (value: string) => void
  onSelectCategory: (id: string) => void
  addButtonLabel?: string
}

const CATEGORY_FILTER_FIELDS = [
  { id: "name", label: "Category Name" },
  { id: "leadCount", label: "Lead Count" },
] as const

type CategoryFilterFieldId = (typeof CATEGORY_FILTER_FIELDS)[number]["id"]

function getLeadCountBucket(count: number): string {
  if (count >= 20) return "20+"
  if (count >= 10) return "10–19"
  return "0–9"
}

export function CategoryListView({
  title,
  subtitle,
  categories,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  addButtonLabel = "Add Category",
}: CategoryListViewProps) {
  const pathname = usePathname()
  const isOwnerProspectsCategories = pathname === "/leads/owner-prospects"
  useQuickActions(isOwnerProspectsCategories ? ownerProspectsCategoriesQuickActions : EMPTY_QUICK_ACTIONS)

  const [appliedFilters, setAppliedFilters] = useState<{ field: CategoryFilterFieldId; values: string[] }[]>([])
  const [showAddFilterModal, setShowAddFilterModal] = useState(false)
  const [modalFilterField, setModalFilterField] = useState<CategoryFilterFieldId | "">("")
  const [modalFilterValues, setModalFilterValues] = useState<string[]>([])

  const hasActiveFilters = appliedFilters.length > 0

  const uniqueNameOptions = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name))).sort(),
    [categories],
  )

  const uniqueLeadCountBuckets = useMemo(
    () => Array.from(new Set(categories.map((c) => getLeadCountBucket(c.count)))),
    [categories],
  )

  const displayedCategories = useMemo(() => {
    if (!hasActiveFilters) return categories
    return categories.filter((cat) => {
      return appliedFilters.every((filter) => {
        if (filter.field === "name") {
          return filter.values.includes(cat.name)
        }
        if (filter.field === "leadCount") {
          const bucket = getLeadCountBucket(cat.count)
          return filter.values.includes(bucket)
        }
        return true
      })
    })
  }, [appliedFilters, categories, hasActiveFilters])

  const resetAllFilters = () => {
    setAppliedFilters([])
  }

  const removeFilter = (index: number) => {
    setAppliedFilters((prev) => prev.filter((_, i) => i !== index))
  }

  const applyModalFilter = () => {
    if (!modalFilterField || modalFilterValues.length === 0) return
    setAppliedFilters((prev) => [...prev, { field: modalFilterField, values: modalFilterValues }])
    setModalFilterField("")
    setModalFilterValues([])
    setShowAddFilterModal(false)
  }

  const startAddFilter = () => {
    setModalFilterField("")
    setModalFilterValues([])
    setShowAddFilterModal(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {addButtonLabel}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={startAddFilter}
            >
              <Filter className="h-3.5 w-3.5" />
              Add Filter
            </Button>

            {appliedFilters.map((filter, index) => (
              <div
                key={`${filter.field}-${index}`}
                className="flex items-center gap-1 h-8 px-2.5 rounded-md border border-teal-300 bg-teal-50 text-teal-700 text-xs font-medium"
              >
                <span>
                  {CATEGORY_FILTER_FIELDS.find((f) => f.id === filter.field)?.label ?? filter.field}:
                </span>
                <span className="font-semibold max-w-[150px] truncate">
                  {filter.values.join(", ")}
                </span>
                <button
                  type="button"
                  onClick={() => removeFilter(index)}
                  className="ml-1 hover:text-teal-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="h-8 gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear all
              </Button>
            )}
          </div> */}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Category Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Lead Count</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="p-4 font-medium text-muted-foreground text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onSelectCategory(category.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <FolderOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="font-normal">
                        {category.count} leads
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectCategory(category.id)
                        }}
                      >
                        View Leads
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {displayedCategories.length === 0 && (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddFilterModal} onOpenChange={setShowAddFilterModal}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Add Filter</DialogTitle>
            <DialogDescription>Choose what you want to filter categories by.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                What do you want to filter by?
              </Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTER_FIELDS.map((field) => (
                  <Button
                    key={field.id}
                    type="button"
                    variant={modalFilterField === field.id ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={() =>
                      setModalFilterField((prev) => (prev === field.id ? "" : field.id))
                    }
                  >
                    {field.label}
                  </Button>
                ))}
              </div>
            </div>

            {modalFilterField && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Select filter option(s)
                </Label>
                <div className="max-h-48 overflow-y-auto rounded-md border p-2 space-y-1">
                  {(modalFilterField === "name" ? uniqueNameOptions : uniqueLeadCountBuckets).map(
                    (value) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 px-1 py-1.5 text-sm cursor-pointer hover:bg-muted/60 rounded"
                      >
                        <Checkbox
                          checked={modalFilterValues.includes(value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setModalFilterValues((prev) =>
                                prev.includes(value) ? prev : [...prev, value],
                              )
                            } else {
                              setModalFilterValues((prev) => prev.filter((v) => v !== value))
                            }
                          }}
                        />
                        <span>{value}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddFilterModal(false)
                setModalFilterField("")
                setModalFilterValues([])
              }}
            >
              Cancel
            </Button>
            <Button onClick={applyModalFilter} disabled={!modalFilterField || modalFilterValues.length === 0}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
