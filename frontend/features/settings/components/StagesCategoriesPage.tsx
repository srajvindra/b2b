"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, X, Check, FolderOpen, Search, ChevronRight, GripVertical, Pencil, Trash2, MoreVertical, AlertTriangle, Settings } from "lucide-react"
import type { StageCategory, StageStatus } from "../types"

export interface StagesCategoriesPageProps {
  title: string
  description: string
  initialCategories: StageCategory[]
  leadCountLabel?: string
  showConfigureWorkflow?: boolean
  onOpenStageEdit?: (categoryId: string, categoryName: string, status: StageStatus) => void
}

export function StagesCategoriesPage({
  title,
  description,
  initialCategories,
  leadCountLabel = "leads",
  showConfigureWorkflow = false,
  onOpenStageEdit,
}: StagesCategoriesPageProps) {
  const [categories, setCategories] = useState<StageCategory[]>(initialCategories)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null)
  const [editingStatusName, setEditingStatusName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingStatusToCategoryId, setAddingStatusToCategoryId] = useState<string | null>(null)
  const [newStatusName, setNewStatusName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = (Math.max(...categories.map((c) => Number.parseInt(c.id, 10)), 0) + 1).toString()
      setCategories([...categories, { id: newId, name: newCategoryName.trim(), statuses: [] }])
      setNewCategoryName("")
      setIsAddingCategory(false)
      setExpandedCategories((prev) => [...prev, newId])
    }
  }

  const handleEditCategory = (category: { id: string; name: string }) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const handleSaveCategoryEdit = () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      setCategories(
        categories.map((c) => (c.id === editingCategoryId ? { ...c, name: editingCategoryName.trim() } : c)),
      )
    }
    setEditingCategoryId(null)
    setEditingCategoryName("")
  }

  const handleDeleteCategoryConfirm = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((c) => c.id !== categoryToDelete))
      setExpandedCategories((prev) => prev.filter((id) => id !== categoryToDelete))
    }
    setDeleteConfirmOpen(false)
    setCategoryToDelete(null)
  }

  const handleAddStatus = (categoryId: string) => {
    if (newStatusName.trim()) {
      setCategories(
        categories.map((c) => {
          if (c.id === categoryId) {
            const newStatusId = `${categoryId}-${c.statuses.length + 1}`
            return {
              ...c,
              statuses: [
                ...c.statuses,
                { id: newStatusId, name: newStatusName.trim(), steps: 0, days: 0, processes: 0 },
              ],
            }
          }
          return c
        }),
      )
      setNewStatusName("")
      setAddingStatusToCategoryId(null)
    }
  }

  const handleEditStatus = (status: { id: string; name: string }) => {
    setEditingStatusId(status.id)
    setEditingStatusName(status.name)
  }

  const handleSaveStatusEdit = (categoryId: string) => {
    if (editingStatusId && editingStatusName.trim()) {
      setCategories(
        categories.map((c) => {
          if (c.id === categoryId) {
            return {
              ...c,
              statuses: c.statuses.map((s) =>
                s.id === editingStatusId ? { ...s, name: editingStatusName.trim() } : s,
              ),
            }
          }
          return c
        }),
      )
    }
    setEditingStatusId(null)
    setEditingStatusName("")
  }

  const handleDeleteStatus = (categoryId: string, statusId: string) => {
    setCategories(
      categories.map((c) => {
        if (c.id === categoryId) {
          return { ...c, statuses: c.statuses.filter((s) => s.id !== statusId) }
        }
        return c
      }),
    )
  }

  const filteredCategories = searchQuery.trim()
    ? categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : categories

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAddingCategory && (
        <Card className="border border-border mb-4">
          <div className="p-4 flex items-center gap-4 bg-muted">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name..."
              className="flex-1 border-border focus:border-ring focus:ring-ring"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory()
                if (e.key === "Escape") {
                  setIsAddingCategory(false)
                  setNewCategoryName("")
                }
              }}
            />
            <Button size="icon" className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background" onClick={handleAddCategory}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => {
                setIsAddingCategory(false)
                setNewCategoryName("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Category Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Lead Count</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-teal-600">
                            <FolderOpen className="h-5 w-5 text-white" />
                          </div>
                          {editingCategoryId === category.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="max-w-xs border-border focus:border-ring focus:ring-ring"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCategoryEdit()
                                  if (e.key === "Escape") {
                                    setEditingCategoryId(null)
                                    setEditingCategoryName("")
                                  }
                                }}
                              />
                              <Button size="icon" className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background" onClick={handleSaveCategoryEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={() => {
                                  setEditingCategoryId(null)
                                  setEditingCategoryName("")
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-medium text-foreground">{category.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="font-normal">
                          {category.statuses.length} {leadCountLabel}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCategory(category.id)
                            }}
                          >
                            View Leads
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCategory(category)
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCategoryConfirm(category.id)
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>

                    {expandedCategories.includes(category.id) && (
                      <>
                        {category.statuses.map((status, index) => (
                          <tr
                            key={status.id}
                            className={`border-b transition-all duration-150 ${
                              editingStatusId === status.id ? "bg-muted" : "bg-card hover:bg-muted/50"
                            }`}
                          >
                            <td colSpan={4} className="p-0">
                              <div className="p-4 pl-16 flex items-center gap-4">
                                <div className="text-muted-foreground hover:text-foreground transition-colors cursor-grab">
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-xs shrink-0">
                                  {index + 1}
                                </div>
                                {editingStatusId === status.id ? (
                                  <>
                                    <Input
                                      value={editingStatusName}
                                      onChange={(e) => setEditingStatusName(e.target.value)}
                                      className="flex-1 border-border focus:border-ring focus:ring-ring"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveStatusEdit(category.id)
                                        if (e.key === "Escape") {
                                          setEditingStatusId(null)
                                          setEditingStatusName("")
                                        }
                                      }}
                                    />
                                    <Button
                                      size="icon"
                                      className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
                                      onClick={() => handleSaveStatusEdit(category.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDeleteStatus(category.id, status.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex-1">
                                      <button
                                        type="button"
                                        onClick={() => onOpenStageEdit?.(category.id, category.name, status)}
                                        className="text-sm font-medium text-foreground hover:text-primary hover:underline transition-colors text-left"
                                      >
                                        {status.name}
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.steps}</span>
                                        <span>Steps</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.days}</span>
                                        <span>Days</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.processes}</span>
                                        <span>Processes</span>
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-48">
                                        {showConfigureWorkflow && onOpenStageEdit && (
                                          <DropdownMenuItem
                                            onClick={() => onOpenStageEdit(category.id, category.name, status)}
                                          >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Configure Workflow
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => handleEditStatus(status)}>
                                          <Pencil className="h-4 w-4 mr-2" />
                                          Edit Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteStatus(category.id, status.id)}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Status
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}

                        <tr className="border-b">
                          <td colSpan={4} className="p-0">
                            {addingStatusToCategoryId === category.id ? (
                              <div className="p-4 pl-16 flex items-center gap-4 bg-muted">
                                <div className="w-5" />
                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-xs">
                                  {category.statuses.length + 1}
                                </div>
                                <Input
                                  value={newStatusName}
                                  onChange={(e) => setNewStatusName(e.target.value)}
                                  placeholder="Enter status name..."
                                  className="flex-1 border-border focus:border-ring focus:ring-ring"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddStatus(category.id)
                                    if (e.key === "Escape") {
                                      setAddingStatusToCategoryId(null)
                                      setNewStatusName("")
                                    }
                                  }}
                                />
                                <Button
                                  size="icon"
                                  className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
                                  onClick={() => handleAddStatus(category.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => {
                                    setAddingStatusToCategoryId(null)
                                    setNewStatusName("")
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="p-3 pl-16">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => setAddingStatusToCategoryId(category.id)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Stage
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground">Add a category to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will also remove all statuses within this category.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
