"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronUp, Bell, Settings, X, AlertTriangle, CheckCircle, Filter, Download, Calendar, Search, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProcessType, ProcessInstance, SummaryCard, FilterType, ActiveFilter } from "../types"
import {
  teamTabs,
  availableStages,
  availableAssignees,
  availableProcessTypes,
  availableProperties,
} from "../data/processes"

const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  status: "Status",
  assignee: "Assignee",
  stage: "Stage",
  onTrack: "On Track",
  processes: "Processes",
  property: "Property",
  createdAt: "Created At",
  processName: "Process Name",
  processType: "Process Type",
  assignedTeam: "Assigned Team",
  relatedEntity: "Related Entity",
}

export interface ProcessesDashboardViewProps {
  onBack: () => void
  processTypes: ProcessType[]
  processInstances: ProcessInstance[]
  sortedInstances: ProcessInstance[]
  activeTeamTab: string
  setActiveTeamTab: (id: string) => void
  selectedRows: string[]
  toggleRowSelection: (id: string) => void
  toggleAllRows: () => void
  sortField: "dueAt" | "createdAt"
  sortDirection: "asc" | "desc"
  onSort: (field: "dueAt" | "createdAt") => void
  summaryCards: SummaryCard[]
  onRemoveSummaryCard: (cardId: string) => void
  activeFilters: ActiveFilter[]
  onRemoveFilter: (index: number) => void
  onClearAllFilters: () => void
  onClearBottomFilters: () => void
  showStartProcessModal: boolean
  setShowStartProcessModal: (v: boolean) => void
  showAddFilterModal: boolean
  setShowAddFilterModal: (v: boolean) => void
  showSaveViewModal: boolean
  setShowSaveViewModal: (v: boolean) => void
  newFilterType: FilterType
  setNewFilterType: (v: FilterType) => void
  newFilterValue: string
  setNewFilterValue: (v: string) => void
  newFilterStage: string
  setNewFilterStage: (v: string) => void
  newViewName: string
  setNewViewName: (v: string) => void
  onAddFilter: () => void
  onQuickAddFilter: (filter: ActiveFilter) => void
  onStartProcess: () => void
  onSaveView: () => void
  onStageChange: (instanceId: string, newStage: string) => void
  onAssigneeChange: (instanceId: string, newAssignee: string) => void
}

export function ProcessesDashboardView({
  onBack,
  processTypes,
  processInstances,
  sortedInstances,
  activeTeamTab,
  setActiveTeamTab,
  selectedRows,
  toggleRowSelection,
  toggleAllRows,
  sortField,
  sortDirection,
  onSort,
  summaryCards,
  onRemoveSummaryCard,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
  onClearBottomFilters,
  showStartProcessModal,
  setShowStartProcessModal,
  showAddFilterModal,
  setShowAddFilterModal,
  showSaveViewModal,
  setShowSaveViewModal,
  newFilterType,
  setNewFilterType,
  newFilterValue,
  setNewFilterValue,
  newFilterStage,
  setNewFilterStage,
  newViewName,
  setNewViewName,
  onAddFilter,
  onQuickAddFilter,
  onStartProcess,
  onSaveView,
  onStageChange,
  onAssigneeChange,
}: ProcessesDashboardViewProps) {
  const router = useRouter()
  const [startProcessTypeId, setStartProcessTypeId] = useState<string>("")
  const [startProperty, setStartProperty] = useState("")
  const [startDueAt, setStartDueAt] = useState("2026-04-07T18:00")
  const [startName, setStartName] = useState("")
  const [startStage, setStartStage] = useState("")
  const [startTags, setStartTags] = useState("")
  const [startComments, setStartComments] = useState("")
  const [customFieldsOpen, setCustomFieldsOpen] = useState(false)
  const [startAssignees, setStartAssignees] = useState<Record<string, string>>({})
  const [openAddRows, setOpenAddRows] = useState<string[]>([])
  const [addRowSearches, setAddRowSearches] = useState<Record<string, string>>({})
  const [addRowSelections, setAddRowSelections] = useState<Record<string, string[]>>({})

  const selectedStartProcessType = useMemo(
    () => processTypes.find((p) => p.id === startProcessTypeId) ?? null,
    [processTypes, startProcessTypeId],
  )

  const assigneeSlots = useMemo(
    () => [
      "Process Owner",
      "AGM",
      "BC",
      "CSM",
      "Leasing Coordinator (LC)",
      "Maintenance Coordinator (CSR)",
      "Operations Hero",
      "Property Manager (CSR)",
      "QA-Coordinator",
      "QA/JA",
    ],
    [],
  )

  const startProcessRows = useMemo(
    () => [
      { id: "property", label: "Property", action: "Add a property to this process", items: availableProperties },
      { id: "existing-tenant", label: "Existing Tenant", action: "Add Existing Tenant to this process", items: ["James Wilson", "Emily Davis", "Michael Brown", "Jennifer White", "Chris Taylor", "Robert Johnson"] },
      { id: "future-tenant", label: "Future tenants", action: "Add Future tenants to this process", items: ["David Lee", "Patricia Mills", "Lisa Garcia"] },
      { id: "owners-1", label: "Owners", action: "Add Owners to this process", items: ["John Martinez", "Gilbert Victorino", "Sarah Chen", "Thomas Anderson"] },
      { id: "owners-2", label: "Owners", action: "Add Owners to this process", items: ["John Martinez", "Gilbert Victorino", "Sarah Chen", "Thomas Anderson"] },
      { id: "tenants", label: "Tenants", action: "Add Tenants to this process", items: ["James Wilson", "Emily Davis", "Michael Brown", "Jennifer White", "Chris Taylor", "Robert Johnson"] },
    ],
    [],
  )

  const activeProcessTypeFilters = activeFilters
    .map((f, index) => ({ ...f, index }))
    .filter((f) => f.type === "processType")

  const clearProcessTypeFilters = () => {
    const indices = activeProcessTypeFilters.map((f) => f.index).sort((a, b) => b - a)
    for (const idx of indices) onRemoveFilter(idx)
  }

  const toggleProcessTypeFilter = (processTypeName: string) => {
    const idx = activeFilters.findIndex((f) => f.type === "processType" && f.value === processTypeName)
    if (idx >= 0) {
      onRemoveFilter(idx)
      return
    }
    onQuickAddFilter({ type: "processType", value: processTypeName, label: processTypeName })
  }

  const handleExportCsv = () => {
    const headers = ["Name", "Property", "On Track", "Stage", "Assignee", "Due", "Created", "Status"]
    const escape = (value: unknown) => {
      const s = String(value ?? "")
      return `"${s.replaceAll("\"", "\"\"")}"`
    }

    const rows = sortedInstances.map((i) => [
      i.name,
      i.property,
      i.onTrack,
      i.stage,
      i.assignee,
      i.dueAt,
      i.createdAt,
      i.status,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map(escape).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `processes-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">All Processes</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter Processes
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Processes</div>

                {availableProcessTypes.map((p) => {
                  const checked = activeFilters.some((f) => f.type === "processType" && f.value === p)
                  return (
                    <DropdownMenuItem
                      key={p}
                      className="flex items-center gap-2"
                      onSelect={(e) => {
                        e.preventDefault()
                        toggleProcessTypeFilter(p)
                      }}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleProcessTypeFilter(p)} />
                      <span className="text-sm">{p}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {activeProcessTypeFilters.length > 0 && (
              <div className="flex items-center gap-2 max-w-[520px]">
                {/* Show first selected chip + compact “+N” summary to avoid huge header */}
                {(() => {
                  const first = activeProcessTypeFilters[0]
                  const extraCount = activeProcessTypeFilters.length - 1
                  return (
                    <>
                      <div
                        key={`${first.type}-${first.value}`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full max-w-[340px]"
                        title={first.label}
                      >
                        <span className="text-xs text-orange-700 font-medium truncate">{first.label}</span>
                        <button
                          type="button"
                          className="text-orange-400 hover:text-orange-600 shrink-0"
                          onClick={() => onRemoveFilter(first.index)}
                          aria-label={`Remove ${first.label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {extraCount > 0 && (
                        <>
                          <div className="text-xs text-muted-foreground px-2 py-1 border border-gray-200 rounded-full bg-white">
                            +{extraCount} more
                          </div>
                          <button
                            type="button"
                            className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
                            onClick={clearProcessTypeFilters}
                          >
                            Clear All
                          </button>
                        </>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700  text-white"
              onClick={() => setShowStartProcessModal(true)}
            >
              <Plus className="h-4 w-4" />
              Start Process
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={handleExportCsv}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            {/* <Button className="bg-gray-800 hover:bg-gray-900 text-white gap-2" onClick={() => router.push("/operations/processes-workflow")}>
              <Settings className="h-4 w-4" />
              Workflow Settings
            </Button> */}
          </div>
        </div>
      </div>

      {/* Team Tabs */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {teamTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTeamTab(tab.id)}
              className={`text-sm pb-2 border-b-2 transition-colors ${activeTeamTab === tab.id
                  ? "text-gray-900 border-gray-900 font-medium"
                  : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setShowSaveViewModal(true)}
        >
          Save View
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4">
          {summaryCards.filter((card) => card.visible).map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">{card.label}</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-3">
        {activeFilters
          .map((filter, index) => ({ filter, index }))
          .filter(({ filter }) => filter.type !== "processType")
          .map(({ filter, index }) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full"
            >
              <span className="text-sm text-gray-700">{FILTER_TYPE_LABELS[filter.type]}:</span>
              <span className="text-sm text-orange-600 font-medium">{filter.label}</span>
              <button
                type="button"
                className="text-orange-400 hover:text-orange-600"
                onClick={() => onRemoveFilter(index)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        <Button
          variant="outline"
          size="sm"
          className="gap-1 bg-transparent"
          onClick={() => setShowAddFilterModal(true)}
        >
          <Filter className="h-3 w-3" />
          Add Filter
        </Button>
        {activeFilters.some((f) => f.type !== "processType") && (
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={onClearBottomFilters}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="px-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-2 text-left w-10">
                <Checkbox
                  checked={selectedRows.length === processInstances.length}
                  onCheckedChange={toggleAllRows}
                />
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Name
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Properties
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                On Track
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                Stage
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Assignee
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                <button
                  type="button"
                  onClick={() => onSort("dueAt")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Due At
                  {sortField === "dueAt" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  ) : (
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  )}
                </button>
              </th>
              <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                <button
                  type="button"
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Created At
                  {sortField === "createdAt" ? (
                    sortDirection === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  ) : (
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  )}
                </button>
              </th>
              <th className="py-3 px-2 text-center w-10">
                <Settings className="h-4 w-4 text-gray-400" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInstances.map((instance) => (
              <tr key={instance.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <Checkbox
                    checked={selectedRows.includes(instance.id)}
                    onCheckedChange={() => toggleRowSelection(instance.id)}
                  />
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-gray-900">{instance.name}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-gray-600 truncate block max-w-xs">
                    {instance.property}
                  </span>
                </td>
                <td className="py-3 px-2">
                  {instance.onTrack === "no_overdue" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      No overdue tasks
                    </span>
                  ) : instance.onTrack === "overdue_date" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue! Due {instance.overdueDate}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                      <AlertTriangle className="h-3 w-3" />
                      Tasks overdue
                    </span>
                  )}
                </td>
                <td className="py-3 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="text-sm text-teal-600 hover:underline flex items-center gap-1 text-left"
                      >
                        {instance.stage}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72">
                      {availableStages.map((stage) => (
                        <DropdownMenuItem
                          key={stage}
                          onClick={() => onStageChange(instance.id, stage)}
                          className={instance.stage === stage ? "bg-teal-50" : ""}
                        >
                          {stage}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="py-3 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="text-sm text-gray-700 flex items-center gap-1"
                      >
                        {instance.assignee}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {availableAssignees.map((assignee) => (
                        <DropdownMenuItem
                          key={assignee}
                          onClick={() => onAssigneeChange(instance.id, assignee)}
                          className={instance.assignee === assignee ? "bg-blue-50" : ""}
                        >
                          {assignee}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-gray-600">{instance.dueAt}</span>
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-gray-600">{instance.createdAt}</span>
                </td>
                <td className="py-3 px-2">
                  <Button variant="outline" onClick={() => router.push(`/operations/processes-workflow?processId=${instance.id}&name=${encodeURIComponent(instance.processType)}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Start Process Modal */}
      <Dialog open={showStartProcessModal} onOpenChange={setShowStartProcessModal}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Start New Process</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label>Select Process Type</Label>
              <Select
                value={startProcessTypeId}
                onValueChange={(val) => {
                  setStartProcessTypeId(val)
                  const typeName = processTypes.find((t) => t.id === val)?.name ?? ""
                  // Mirror screenshot: “<type> for [property/street]”
                  if (!startName) setStartName(typeName ? `${typeName} for [property/street]` : "")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a process type..." />
                </SelectTrigger>
                <SelectContent>
                  {processTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add-to-process rows */}
            <div className="space-y-2">
              {startProcessRows.map((row) => {
                const isOpen = openAddRows.includes(row.id)
                const query = addRowSearches[row.id] ?? ""
                const filtered = query.trim()
                  ? row.items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                  : []
                const selected = addRowSelections[row.id] ?? []

                const toggleItem = (item: string) => {
                  setAddRowSelections((prev) => {
                    const current = prev[row.id] ?? []
                    return {
                      ...prev,
                      [row.id]: current.includes(item)
                        ? current.filter((i) => i !== item)
                        : [...current, item],
                    }
                  })
                }

                const toggleOpen = () => {
                  if (isOpen) {
                    setOpenAddRows((prev) => prev.filter((id) => id !== row.id))
                    setAddRowSearches((prev) => { const next = { ...prev }; delete next[row.id]; return next })
                  } else {
                    setOpenAddRows((prev) => [...prev, row.id])
                    setAddRowSearches((prev) => ({ ...prev, [row.id]: "" }))
                  }
                }

                return (
                  <div key={row.id} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{row.label}</Label>

                    {selected.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {selected.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5"
                          >
                            {s}
                            <button type="button" onClick={() => toggleItem(s)} className="hover:text-blue-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={toggleOpen}
                      className="w-full h-10 px-3 rounded-md border bg-muted/20 hover:bg-muted/30 text-sm text-blue-600 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {row.action}
                      {isOpen ? (
                        <X className="h-4 w-4 ml-auto text-muted-foreground" />
                      ) : (
                        <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="rounded-md border bg-white">
                        <div className="flex items-center gap-2 px-3 py-2 border-b">
                          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                          <Input
                            autoFocus
                            value={query}
                            onChange={(e) => setAddRowSearches((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            placeholder={`Search ${row.label.toLowerCase()}...`}
                            className="border-0 shadow-none h-8 p-0 focus-visible:ring-0"
                          />
                        </div>
                        {query.trim() && (
                          <div className="max-h-40 overflow-y-auto">
                            {filtered.length > 0 ? (
                              filtered.map((item) => (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleItem(item)}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted/40 transition-colors flex items-center gap-2"
                                >
                                  <Checkbox checked={selected.includes(item)} className="pointer-events-none" />
                                  {item}
                                </button>
                              ))
                            ) : (
                              <p className="px-3 py-2 text-sm text-muted-foreground">No results found</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Assignees */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Assignees</Label>
              <div className="grid grid-cols-2 gap-2">
                {assigneeSlots.map((slot) => (
                  <div key={slot} className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">{slot}</Label>
                    <Select
                      value={startAssignees[slot] ?? ""}
                      onValueChange={(val) => setStartAssignees((prev) => ({ ...prev, [slot]: val }))}
                    >
                      <SelectTrigger className="h-9 w-full bg-muted/20">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAssignees.map((assignee) => (
                          <SelectItem key={`${slot}-${assignee}`} value={assignee}>
                            {assignee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Due At */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Due At</Label>
                <span className="text-[11px] text-muted-foreground">(optional)</span>
              </div>
              <div className="relative">
                <Input
                  type="datetime-local"
                  value={startDueAt}
                  onChange={(e) => setStartDueAt(e.target.value)}
                  className="pr-10"
                />
                <Calendar className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-muted-foreground">
                You can edit or change your selected due date for this process in the process home settings
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground">Details</Label>
              <div className="space-y-2">
                <Label className="text-[11px] text-muted-foreground">Name</Label>
                <Input
                  value={startName}
                  onChange={(e) => setStartName(e.target.value)}
                  placeholder={selectedStartProcessType?.name ? `${selectedStartProcessType.name} for [property/street]` : "Process name"}
                  className="bg-muted/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] text-muted-foreground">Stage</Label>
                <Select value={startStage} onValueChange={setStartStage}>
                  <SelectTrigger className="bg-muted/20">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  You can edit or change the default initial stage in the process home settings
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] text-muted-foreground">Tags</Label>
                <Input
                  value={startTags}
                  onChange={(e) => setStartTags(e.target.value)}
                  placeholder="Select..."
                  className="bg-muted/20"
                />
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Comments</Label>
              <Textarea
                value={startComments}
                onChange={(e) => setStartComments(e.target.value)}
                placeholder=""
                className="bg-muted/10"
              />
            </div>

            {/* Custom Fields */}
            <Collapsible open={customFieldsOpen} onOpenChange={setCustomFieldsOpen}>
              <CollapsibleTrigger asChild>
                <button type="button" className="w-full flex items-center justify-between text-sm text-gray-700 py-2">
                  <span className="font-medium text-muted-foreground">Custom Fields</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${customFieldsOpen ? "rotate-180" : ""}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="border rounded-md p-3 bg-muted/10 text-xs text-muted-foreground">
                  Custom fields UI can be added here.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStartProcessModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={onStartProcess} className="bg-blue-600 hover:bg-blue-700">
              Start Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Filter Modal */}
      <Dialog open={showAddFilterModal} onOpenChange={setShowAddFilterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Filter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Filter Type</Label>
              <Select
                value={newFilterType}
                onValueChange={(val) => {
                  setNewFilterType(val as FilterType)
                  setNewFilterValue("")
                  setNewFilterStage("")
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="onTrack">On Track</SelectItem>
                  <SelectItem value="processes">Processes</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              {newFilterType === "assignee" ? (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : newFilterType === "stage" ? (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : newFilterType === "onTrack" ? (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_overdue">No overdue tasks</SelectItem>
                    <SelectItem value="tasks_overdue">Tasks overdue</SelectItem>
                  </SelectContent>
                </Select>
              ) : newFilterType === "processes" ? (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select process type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProcessTypes.map((processType) => (
                      <SelectItem key={processType} value={processType}>
                        {processType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : newFilterType === "property" ? (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProperties.map((property) => (
                      <SelectItem key={property} value={property}>
                        {property}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : newFilterType === "createdAt" ? (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working">Working</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {newFilterType === "processes" && newFilterValue && (
              <div className="space-y-2">
                <Label>Stage (Optional)</Label>
                <Select value={newFilterStage} onValueChange={setNewFilterStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {availableStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddFilterModal(false)
                setNewFilterType("status")
                setNewFilterValue("")
                setNewFilterStage("")
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={onAddFilter} className="bg-blue-600 hover:bg-blue-700">
              Add Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save View Modal */}
      <Dialog open={showSaveViewModal} onOpenChange={setShowSaveViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>View Name</Label>
              <Input
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="Enter view name..."
              />
            </div>
            <p className="text-sm text-gray-500">
              This will save your current filters, sorting, and visible columns.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveViewModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={onSaveView} className="bg-blue-600 hover:bg-blue-700">
              Save View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
