"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, LayoutGrid, List, UserPlus, Settings, ChevronRight, ArrowLeft, FolderOpen, Plus, Users, TrendingUp, Filter, CalendarIcon, ChevronDown, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useNav, useView } from "@/app/dashboard/page"
import { BulkActionBar } from "@/components/bulk-action-bar"
import { TenantApplicationDetailView } from "@/features/leads/components/TenantApplicationDetailView"
import { CategoryListView } from "@/features/leads/components/CategoryListView"
import OwnerDetailPage from "@/components/owner-detail-page"
import { getStageCardStyle, getStageBadgeStyle, SOURCES, EMAIL_SENT_RANGES, UNITS_VALUES, LAST_TOUCH_RANGES, CREATED_RANGES, OWNER_CATEGORIES, OWNER_PROSPECT_CATEGORIES } from "@/features/leads/data/mockLeads"
import type { Lead } from "@/features/leads/types"
import { useLeads } from "@/features/leads/hooks/useLeads"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"



export interface LeadsPageContentProps {
  params?: { view?: string }
  /** When set, category is driven by URL (ID-based routing). No category list shown; Back uses onBackToCategories. */
  categoryIdFromUrl?: string
  /** Base path for links e.g. /leads/owner-prospects */
  basePath?: string
  /** When set, Back to Categories uses this instead of clearing state */
  onBackToCategories?: () => void
  /** When set, clicking a lead navigates via this instead of opening detail inline */
  onLeadClick?: (leadId: number) => void
}

export default function LeadsPageContent({
  params,
  categoryIdFromUrl,
  basePath,
  onBackToCategories,
  onLeadClick,
}: LeadsPageContentProps) {
  const { view } = useView()
  const nav = useNav()
  const initialCategoryId = categoryIdFromUrl ?? null
  const {
    leads,
    setLeads,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedProspectCategory,
    setSelectedProspectCategory,
    categorySearchQuery,
    setCategorySearchQuery,
    ownerType,
    setOwnerType,
    prospectType,
    setProspectType,
    selectedAssignees,
    setSelectedAssignees,
    selectedAssignee,
    setSelectedAssignee,
    assigneeSearchQuery,
    setAssigneeSearchQuery,
    tileStaffFilter,
    setTileStaffFilter,
    tileStaffSearch,
    setTileStaffSearch,
    tileStaffOpen,
    setTileStaffOpen,
    selectedLeadIds,
    setSelectedLeadIds,
    stageSearchQuery,
    setStageSearchQuery,
    sourceSearchQuery,
    setSourceSearchQuery,
    unitsSearchQuery,
    setUnitsSearchQuery,
    dateFilter,
    setDateFilter,
    showCustomDatePicker,
    setShowCustomDatePicker,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
    selectedType,
    setSelectedType,
    selectedStage,
    setSelectedStage,
    filterUnitType,
    setFilterUnitType,
    filterNumUnits,
    setFilterNumUnits,
    filterCallStatus,
    setFilterCallStatus,
    sortBy,
    setSortBy,
    selectedStages,
    setSelectedStages,
    selectedSources,
    setSelectedSources,
    selectedEmailsSent,
    setSelectedEmailsSent,
    selectedUnits,
    setSelectedUnits,
    selectedLastTouch,
    setSelectedLastTouch,
    selectedCreated,
    setSelectedCreated,
    lastTouchDateFilter,
    setLastTouchDateFilter,
    createdDateFilter,
    setCreatedDateFilter,
    dragOverStage,
    setDragOverStage,
    visibleCount,
    setVisibleCount,
    isLoadingMore,
    page,
    setPage,
    pageSize,
    filteredSortedLeads,
    totalItems,
    totalPages,
    pagedLeads,
    visibleLeads,
    hasMoreLeads,
    handleLoadMore,
    kanbanStages,
    leadsByStage,
    handleStageChange: hookHandleStageChange,
    filteredCategories,
    filteredProspectCategories,
    resetAllFilters,
    hasActiveFilters,
    ASSIGNEES,
  } = useLeads({ params, view, initialCategoryId })

  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [selectedLead, setSelectedLead] = useState<number | null>(null)
  const [selectedLeadDefaultTab, setSelectedLeadDefaultTab] = useState<string | undefined>(undefined)
  const [draggedLead, setDraggedLead] = useState<number | null>(null)
  const skipStepDialogInitialState = {
    open: false,
    leadId: null,
    leadName: "",
    currentStage: "",
    newStage: "",
    incompleteSteps: [],
  }
  const [skipStepDialog, setSkipStepDialog] = useState<{
    open: boolean
    leadId: number | null
    leadName: string
    currentStage: string
    newStage: string
    incompleteSteps: string[]
  }>(skipStepDialogInitialState)
  const [skipReason, setSkipReason] = useState<string>("")
  const [skipComments, setSkipComments] = useState<string>("")

  const handleStageChange = (leadId: number, newStage: string) => {
    const result = hookHandleStageChange(leadId, newStage)
    if (result) {
      setSkipStepDialog({
        open: true,
        leadId: result.lead.id,
        leadName: result.lead.name,
        currentStage: result.lead.stage,
        newStage: result.newStage,
        incompleteSteps: result.skippedStages,
      })
    }
  }

  const handleConfirmSkip = () => {
    if (skipStepDialog.leadId) {
      setLeads((prev) =>
        prev.map((l) => (l.id === skipStepDialog.leadId ? { ...l, stage: skipStepDialog.newStage } : l)),
      )
      toast({
        title: "Stage Updated",
        description: `${skipStepDialog.leadName} moved to ${skipStepDialog.newStage}. Reason: ${skipReason || skipComments || "Not specified"}`,
      })
    }
    setSkipStepDialog(skipStepDialogInitialState)
    setSkipReason("")
    setSkipComments("")
  }

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    setDraggedLead(leadId)
    e.dataTransfer.effectAllowed = "move"
  }
  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    setDragOverStage(stage)
  }
  const handleDragLeave = () => setDragOverStage(null)
  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    if (draggedLead !== null) handleStageChange(draggedLead, stage)
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const exportCSV = () => {
    const header = [
      "Name", "Type", "Property", "Stage", "Assigned", "Phone", "Email", "Created",
      "Unit Type", "# Units", "Last Call", "Next Follow-Up", "Emails Sent", "Deals", "Next Action", "Source", "Last Touch",
    ]
    const rows = filteredSortedLeads.map((l) => [
      l.name, l.userType, l.property, l.stage, l.assignedTo, l.phone, l.email, l.createdAt,
      l.unitDetails, l.numberOfUnits, l.lastCallStatus, l.nextFollowUp, l.emailsSent, l.deals, l.nextAction, l.source, l.lastTouch,
    ])
    const csvContent =
      header.join(",") +
      "\n" +
      rows.map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Export started", description: `Exporting ${filteredSortedLeads.length} rows` })
  }

  if (!onLeadClick && selectedLead !== null) {
    const lead = leads.find((l) => l.id === selectedLead)
    if (lead) {
      if (params?.view === "owners") {
        return (
          <OwnerDetailPage
            lead={lead}
            onBack={() => setSelectedLead(null)}
            onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
          />
        )
      }
      return (
        <TenantApplicationDetailView
          lead={lead}
          onBack={() => { setSelectedLead(null); setSelectedLeadDefaultTab(undefined) }}
          defaultTab={selectedLeadDefaultTab}
          onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
          onConvertToTenant={(convertedLead, finalizedProperty) => {
            setLeads((prevLeads) => prevLeads.filter((l) => l.id !== convertedLead.id))
            toast({
              title: "Prospect Converted to Tenant",
              description: `${convertedLead.name} has been moved to Tenants with ${finalizedProperty.name} as their assigned property.`,
            })
            setSelectedLead(null)
          }}
        />
      )
    }
  }

  if (!categoryIdFromUrl && params?.view === "owners" && !selectedCategory) {
    return (
      <CategoryListView
        title="Owner Categories"
        subtitle="Select a category to view and manage leads"
        categories={filteredCategories}
        searchQuery={categorySearchQuery}
        onSearchChange={setCategorySearchQuery}
        onSelectCategory={(id) => { setSelectedCategory(id); setSelectedLeadIds([]) }}
      />
    )
  }

  if (!categoryIdFromUrl && params?.view === "lease-prospects" && !selectedProspectCategory) {
    return (
      <CategoryListView
        title="Lease Prospect Categories"
        subtitle="Select a category to view and manage lease prospects"
        categories={filteredProspectCategories}
        searchQuery={categorySearchQuery}
        onSearchChange={setCategorySearchQuery}
        onSelectCategory={setSelectedProspectCategory}
      />
    )
  }

  const currentCategory = OWNER_CATEGORIES.find((c) => c.id === selectedCategory)
  const currentProspectCategory = OWNER_PROSPECT_CATEGORIES.find((c) => c.id === selectedProspectCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {params?.view === "owners" && selectedCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToCategories ?? (() => { setSelectedCategory(null); setSelectedLeadIds([]) })}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          )}
          {params?.view === "lease-prospects" && selectedProspectCategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToCategories ?? (() => setSelectedProspectCategory(null))}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {params?.view === "owners" && currentCategory
                ? currentCategory.name
                : params?.view === "lease-prospects" && currentProspectCategory
                  ? currentProspectCategory.name
                  : params?.view === "owners"
                    ? "Owners"
                    : params?.view === "lease-prospects"
                      ? "Lease Prospects"
                      : "All Leads"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {params?.view === "owners" && currentCategory
                ? `Manage leads in ${currentCategory.name}`
                : params?.view === "lease-prospects" && currentProspectCategory
                  ? `Manage lease prospects in ${currentProspectCategory.name}`
                  : "Manage and track leads"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV}>
            Export
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Add {params?.view === "owners" ? "Owner" : params?.view === "lease-prospects" ? "Prospect" : "Lead"}
          </Button>
        </div>
      </div>

      {/* KPI Summary Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Leads Button */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-teal-600"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{filteredSortedLeads.length.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {tileStaffFilter !== "all"
                    ? `Leads for ${ASSIGNEES.find(a => a.id === tileStaffFilter)?.name || "selected staff"}`
                    : "All active leads"}
                </p>
                {/* Staff Filter Dropdown */}
                <div className="mt-3">
                  <Popover open={tileStaffOpen} onOpenChange={setTileStaffOpen}>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground hover:bg-muted/50 transition-colors w-full max-w-[220px]">
                        <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate flex-1 text-left">
                          {tileStaffFilter === "all"
                            ? "Filter by staff member..."
                            : ASSIGNEES.find(a => a.id === tileStaffFilter)?.name}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-0" align="start">
                      <div className="p-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Staff Member</span>
                          {tileStaffFilter !== "all" && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs ml-auto" onClick={() => { setTileStaffFilter("all"); setTileStaffSearch(""); setTileStaffOpen(false) }}>
                              Clear
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Search staff..."
                          value={tileStaffSearch}
                          onChange={(e) => setTileStaffSearch(e.target.value)}
                          className="h-8 mt-2 text-xs"
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto p-1">
                        <button
                          className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 transition-colors ${tileStaffFilter === "all" ? "bg-teal-50 text-teal-700 font-medium" : ""}`}
                          onClick={() => { setTileStaffFilter("all"); setTileStaffSearch(""); setTileStaffOpen(false) }}
                        >
                          All Staff Members
                        </button>
                        {ASSIGNEES
                          .filter(a => a.name.toLowerCase().includes(tileStaffSearch.toLowerCase()))
                          .map((assignee) => (
                            <button
                              key={assignee.id}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted/50 transition-colors ${tileStaffFilter === assignee.id ? "bg-teal-50 text-teal-700 font-medium" : ""}`}
                              onClick={() => { setTileStaffFilter(assignee.id); setTileStaffSearch(""); setTileStaffOpen(false); setPage(1) }}
                            >
                              {assignee.name}
                            </button>
                          ))
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="p-3 bg-teal-50 rounded-full">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Ratio Button */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-emerald-500"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium text-muted-foreground">Conversion Ratio</span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {filteredSortedLeads.length > 0
                    ? `${Math.round((filteredSortedLeads.filter(l => l.stage === "Converted" || l.stage === "Client Won" || l.stage === "Closed Won").length / filteredSortedLeads.length) * 100)}%`
                    : "0%"}
                </p>
                <p className="text-xs text-muted-foreground">Leads converted to Owners / Clients</p>
                {/* Visual Progress Indicator */}
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: filteredSortedLeads.length > 0 ? `${Math.round((filteredSortedLeads.filter(l => l.stage === "Converted" || l.stage === "Client Won" || l.stage === "Closed Won").length / filteredSortedLeads.length) * 100)}%` : "0%" }} />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar + View Toggle Row */}
      <div className="flex items-center gap-3">
        {/* Prospect Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by prospect name, property address, or staff name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            className="pl-9 pr-9 h-10 w-full text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* View Toggle and Settings */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (params?.view === "owners") {
                nav.go("stages-owners")
              } else if (params?.view === "lease-prospects") {
                nav.go("stages-tenants")
              }
            }}
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedLeadIds.length}
        totalCount={filteredSortedLeads.length}
        onClearSelection={() => setSelectedLeadIds([])}
        onSelectAll={() => setSelectedLeadIds(filteredSortedLeads.map(l => l.id))}
        selectedNames={filteredSortedLeads.filter(l => selectedLeadIds.includes(l.id)).map(l => l.name)}
        selectedEmails={filteredSortedLeads.filter(l => selectedLeadIds.includes(l.id)).map(l => l.email)}
      />

      {/* Content */}
      {viewMode === "table" ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {/* Select All Checkbox */}
                    <th className="w-10 p-3">
                      <Checkbox
                        checked={visibleLeads.length > 0 && visibleLeads.every(l => selectedLeadIds.includes(l.id))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLeadIds(prev => [...new Set([...prev, ...visibleLeads.map(l => l.id)])])
                          } else {
                            const visibleIds = new Set(visibleLeads.map(l => l.id))
                            setSelectedLeadIds(prev => prev.filter(id => !visibleIds.has(id)))
                          }
                        }}
                      />
                    </th>
                    {/* Name Column - Plain Header */}
                    <th className="text-left p-3 font-medium text-muted-foreground">Name</th>

                    {/* Emails Sent Column Filter */}
                    <th className="text-left p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Emails Sent
                            <ChevronDown className={`h-3 w-3 ${selectedEmailsSent.length > 0 ? 'text-teal-600' : ''}`} />
                            {selectedEmailsSent.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                {selectedEmailsSent.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Emails Sent</span>
                              {selectedEmailsSent.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedEmailsSent([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {EMAIL_SENT_RANGES.map((range) => (
                              <div key={range.id} className="flex items-center space-x-2 py-1.5">
                                <Checkbox
                                  id={`th-email-${range.id}`}
                                  checked={selectedEmailsSent.includes(range.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedEmailsSent([...selectedEmailsSent, range.id])
                                    } else {
                                      setSelectedEmailsSent(selectedEmailsSent.filter((e) => e !== range.id))
                                    }
                                  }}
                                />
                                <label htmlFor={`th-email-${range.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                  {range.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>

                    {/* Units Column Filter - For Owners and Tenants (Lease Prospects) views */}
                    {(params?.view === "owners" || params?.view === "lease-prospects") && (
                      <th className="text-left p-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                              {selectedUnits.length > 0 ? (
                                <span>{params?.view === "lease-prospects" ? "Unit Address" : "Units"}: {selectedUnits.join(", ")}</span>
                              ) : (
                                <span>{params?.view === "lease-prospects" ? "Unit Address" : "Units"}</span>
                              )}
                              <ChevronDown className={`h-3 w-3 ${selectedUnits.length > 0 ? 'text-teal-600' : ''}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[180px] p-0" align="start">
                            <div className="p-2 border-b">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">{params?.view === "lease-prospects" ? "Unit Address" : "Units"}</span>
                                {selectedUnits.length > 0 && (
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedUnits([])}>
                                    Clear
                                  </Button>
                                )}
                              </div>
                              <Input
                                placeholder={`Search ${params?.view === "lease-prospects" ? "unit address" : "units"}...`}
                                value={unitsSearchQuery}
                                onChange={(e) => setUnitsSearchQuery(e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div className="max-h-[200px] overflow-y-auto p-2">
                              {UNITS_VALUES
                                .filter(unit => unit.name.includes(unitsSearchQuery))
                                .map((unit) => (
                                  <div key={unit.id} className="flex items-center space-x-2 py-1.5">
                                    <Checkbox
                                      id={`th-units-${unit.id}`}
                                      checked={selectedUnits.includes(unit.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedUnits([...selectedUnits, unit.id])
                                        } else {
                                          setSelectedUnits(selectedUnits.filter((u) => u !== unit.id))
                                        }
                                      }}
                                    />
                                    <label htmlFor={`th-units-${unit.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                      {unit.name}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </th>
                    )}

                    {/* Next Action Column - Plain Header */}
                    <th className="text-left p-3 font-medium text-muted-foreground">Next Action</th>

                    {/* Stage Column Filter */}
                    <th className="text-left p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Stage
                            <ChevronDown className={`h-3 w-3 ${selectedStages.length > 0 ? 'text-teal-600' : ''}`} />
                            {selectedStages.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                {selectedStages.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Stage</span>
                              {selectedStages.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedStages([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search stages..."
                              value={stageSearchQuery}
                              onChange={(e) => setStageSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {kanbanStages
                              .filter(stage => stage.toLowerCase().includes(stageSearchQuery.toLowerCase()))
                              .map((stage) => (
                                <div key={stage} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-stage-${stage}`}
                                    checked={selectedStages.includes(stage)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedStages([...selectedStages, stage])
                                      } else {
                                        setSelectedStages(selectedStages.filter((s) => s !== stage))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-stage-${stage}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {stage}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>

                    {/* Assignee Column Filter */}
                    <th className="text-left p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Assignee
                            <ChevronDown className={`h-3 w-3 ${selectedAssignees.length > 0 ? 'text-teal-600' : ''}`} />
                            {selectedAssignees.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                {selectedAssignees.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Assignee</span>
                              {selectedAssignees.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedAssignees([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search assignee..."
                              value={assigneeSearchQuery}
                              onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {ASSIGNEES
                              .filter(assignee => assignee.name.toLowerCase().includes(assigneeSearchQuery.toLowerCase()))
                              .map((assignee) => (
                                <div key={assignee.id} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-assignee-${assignee.id}`}
                                    checked={selectedAssignees.includes(assignee.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedAssignees([...selectedAssignees, assignee.id])
                                      } else {
                                        setSelectedAssignees(selectedAssignees.filter((a) => a !== assignee.id))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-assignee-${assignee.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {assignee.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>

                    {/* Source Column Filter */}
                    <th className="text-left p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Source
                            <ChevronDown className={`h-3 w-3 ${selectedSources.length > 0 ? 'text-teal-600' : ''}`} />
                            {selectedSources.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                {selectedSources.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Source</span>
                              {selectedSources.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedSources([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search source..."
                              value={sourceSearchQuery}
                              onChange={(e) => setSourceSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {SOURCES
                              .filter(source => source.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
                              .map((source) => (
                                <div key={source} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-source-${source}`}
                                    checked={selectedSources.includes(source)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedSources([...selectedSources, source])
                                      } else {
                                        setSelectedSources(selectedSources.filter((s) => s !== source))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-source-${source}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {source}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>

                    {/* Last Touch Column Filter */}
                    <th className="text-left p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Last Touch
                            <ChevronDown className={`h-3 w-3 ${selectedLastTouch.length > 0 ? 'text-teal-600' : ''}`} />
                            {selectedLastTouch.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                {selectedLastTouch.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Last Touch</span>
                              {selectedLastTouch.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedLastTouch([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {LAST_TOUCH_RANGES.map((range) => (
                              <div key={range.id} className="flex items-center space-x-2 py-1.5">
                                <Checkbox
                                  id={`th-lasttouch-${range.id}`}
                                  checked={selectedLastTouch.includes(range.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLastTouch([...selectedLastTouch, range.id])
                                    } else {
                                      setSelectedLastTouch(selectedLastTouch.filter((l) => l !== range.id))
                                    }
                                  }}
                                />
                                <label htmlFor={`th-lasttouch-${range.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                  {range.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>

                    {/* Created At Column Filter */}
                    <th className="text-left p-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Created At
                            <ChevronDown className={`h-3 w-3 ${selectedCreated.length > 0 ? 'text-teal-600' : ''}`} />
                            {selectedCreated.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                {selectedCreated.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Created</span>
                              {selectedCreated.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedCreated([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {CREATED_RANGES.map((range) => (
                              <div key={range.id} className="flex items-center space-x-2 py-1.5">
                                <Checkbox
                                  id={`th-created-${range.id}`}
                                  checked={selectedCreated.includes(range.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedCreated([...selectedCreated, range.id])
                                    } else {
                                      setSelectedCreated(selectedCreated.filter((c) => c !== range.id))
                                    }
                                  }}
                                />
                                <label htmlFor={`th-created-${range.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                  {range.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th>

                    {/* Actions Column with Reset Button */}
                    <th className="text-left p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">Actions</span>
                        {hasActiveFilters && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={resetAllFilters}
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Reset
                          </Button>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`border-b hover:bg-muted/50 cursor-pointer ${selectedLeadIds.includes(lead.id) ? "bg-primary/5" : ""}`}
                      onClick={() => onLeadClick ? onLeadClick(lead.id) : setSelectedLead(lead.id)}
                    >
                      <td className="p-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedLeadIds.includes(lead.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLeadIds(prev => [...prev, lead.id])
                            } else {
                              setSelectedLeadIds(prev => prev.filter(id => id !== lead.id))
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                              {lead.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {lead.emailsSent || 0}
                        </Badge>
                      </td>
                      {(params?.view === "owners" || params?.view === "tenants") && (
                        <td className="p-4">
                          {params?.view === "tenants" && lead.interestedUnits && lead.interestedUnits.length > 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedLeadDefaultTab("property")
                                if (onLeadClick) onLeadClick(lead.id)
                                else setSelectedLead(lead.id)
                              }}
                              className="text-left hover:underline"
                            >
                              <div className="flex flex-col gap-1.5">
                                {lead.interestedUnits.slice(0, 3).map((u: { address: string; unit: string }, idx: number) => (
                                  <div key={idx} className="text-xs text-muted-foreground leading-tight">
                                    <span className="text-foreground font-medium">{u.address}</span>
                                    <br />
                                    <span>{u.unit}</span>
                                  </div>
                                ))}
                                {lead.interestedUnits.length > 3 && (
                                  <span className="text-xs font-semibold text-teal-700">
                                    +{lead.interestedUnits.length - 3}
                                  </span>
                                )}
                              </div>
                            </button>
                          ) : (
                            <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                              {lead.numberOfUnits || 1}
                            </Badge>
                          )}
                        </td>
                      )}
                      <td className="p-4 text-sm text-muted-foreground">{lead.nextAction || lead.nextFollowUp}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={getStageBadgeStyle(lead.stage)}>
                          {lead.stage}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                              {lead.assignedTo
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{lead.assignedTo}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-xs">
                          {lead.source || "N/A"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{lead.lastTouch || "N/A"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{lead.createdAt}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center gap-2 p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(visibleCount, totalItems)} of {totalItems} leads
              </p>
              {hasMoreLeads && (
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="min-w-[120px] bg-transparent"
                >
                  {isLoadingMore ? "Loading..." : "View More"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Kanban View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanStages.map((stage) => (
            <div
              key={stage}
              className={`flex-shrink-0 w-[300px] rounded-lg border bg-card ${dragOverStage === stage ? "border-teal-500 bg-teal-50" : ""
                }`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="p-3 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-foreground">{stage}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {leadsByStage[stage]?.length || 0}
                  </Badge>
                </div>
              </div>
              <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                {leadsByStage[stage]?.map((lead) => (
                  <Card
                    key={lead.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${getStageCardStyle(lead.stage)}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onClick={() => onLeadClick ? onLeadClick(lead.id) : setSelectedLead(lead.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                            {lead.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-foreground">{lead.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{lead.property}</p>
                      <p className="text-xs text-muted-foreground">Assigned: {lead.assignedTo}</p>
                    </CardContent>
                  </Card>
                ))}
                {(!leadsByStage[stage] || leadsByStage[stage].length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-4">No leads in this stage</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skip Step Dialog */}
      <Dialog
        open={skipStepDialog.open}
        onOpenChange={(open) => !open && setSkipStepDialog({ ...skipStepDialog, open: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skip Steps Confirmation</DialogTitle>
            <DialogDescription>
              You are moving {skipStepDialog.leadName} from "{skipStepDialog.currentStage}" to "
              {skipStepDialog.newStage}". This will skip the following steps:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <ul className="list-disc list-inside text-sm text-amber-800">
                {skipStepDialog.incompleteSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Reason for skipping</Label>
              <Select value={skipReason} onValueChange={setSkipReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-request">Client Request</SelectItem>
                  <SelectItem value="expedited">Expedited Process</SelectItem>
                  <SelectItem value="already-completed">Steps Already Completed Offline</SelectItem>
                  <SelectItem value="not-applicable">Steps Not Applicable</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional Comments</Label>
              <Textarea
                placeholder="Add any additional notes..."
                value={skipComments}
                onChange={(e) => setSkipComments(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkipStepDialog({ ...skipStepDialog, open: false })}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleConfirmSkip}>
              Confirm Skip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
