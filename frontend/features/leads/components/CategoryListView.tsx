"use client"

import { Search, FolderOpen, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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

export function CategoryListView({
  title,
  subtitle,
  categories,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  addButtonLabel = "Add Category",
}: CategoryListViewProps) {
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
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
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
                {categories.map((category) => (
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

          {categories.length === 0 && (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
