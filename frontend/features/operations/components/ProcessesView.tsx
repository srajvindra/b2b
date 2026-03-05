"use client"

import { Fragment, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Plus,
  Pencil,
  ChevronDown,
  FolderPlus,
  Copy,
  Users,
  Trash2,
  FolderOpen,
  ChevronRight,
  GripVertical,
  MoreVertical,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProcessType, ProcessInstance, SummaryCard, FilterType, ActiveFilter, SavedView } from "../types"
import {
  initialProcessTypes,
  initialProcessInstances,
  teamTabs,
  availableStages,
  availableAssignees,
  teams,
  folders,
  initialSavedViews,
  availableProcessTypes,
  availableProperties,
} from "../data/processes"
import { ProcessesDashboardView } from "./ProcessesDashboardView"

export function ProcessesView() {
  // Listing page state
  const [processTypes, setProcessTypes] = useState<ProcessType[]>(initialProcessTypes)
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  
  // Dashboard state
  const [activeTeamTab, setActiveTeamTab] = useState("assigned")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [processInstances, setProcessInstances] = useState<ProcessInstance[]>(initialProcessInstances)
  const [sortField, setSortField] = useState<"dueAt" | "createdAt">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "status", value: "working", label: "Working" }
  ])
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([
    { id: "count", label: "Count", value: 768, visible: true },
    { id: "overdue", label: "Overdue", value: 526, visible: true },
    { id: "offTrack", label: "# Off Track", value: 221, visible: true },
    { id: "completed", label: "# Completed", value: 0, visible: true },
    { id: "timeToComplete", label: "Time To Complete", value: "n/a", visible: true },
  ])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null)
  const [editingProcessName, setEditingProcessName] = useState("")
  
  // Modal states
  const [showNewProcessModal, setShowNewProcessModal] = useState(false)
  const [showStartProcessModal, setShowStartProcessModal] = useState(false)
  const [showMoveToFolderModal, setShowMoveToFolderModal] = useState(false)
  const [showAssignToTeamModal, setShowAssignToTeamModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [showAddFilterModal, setShowAddFilterModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showSaveViewModal, setShowSaveViewModal] = useState(false)
  
  // Form states
  const [newProcessName, setNewProcessName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedProcessForAction, setSelectedProcessForAction] = useState<ProcessType | null>(null)
  const [newFilterType, setNewFilterType] = useState<FilterType>("status")
  const [newFilterValue, setNewFilterValue] = useState("")
  const [newFilterStage, setNewFilterStage] = useState("") // For processes filter
  const [newFolderName, setNewFolderName] = useState("")
  const [newViewName, setNewViewName] = useState("")
  
  // Saved views state
  const [savedViews, setSavedViews] = useState<SavedView[]>(initialSavedViews)
  const [activeView, setActiveView] = useState<string | null>(null)
  const [processNameSearch, setProcessNameSearch] = useState("")

  // Handlers
  const handleViewDashboard = () => {
    setShowDashboard(true)
  }

  const handleBackToList = () => {
    setShowDashboard(false)
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === processInstances.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(processInstances.map(p => p.id))
    }
  }

  const handleSort = (field: "dueAt" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleRemoveSummaryCard = (cardId: string) => {
    setSummaryCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, visible: false } : card
    ))
  }

  const handleAddFilter = () => {
    if (newFilterValue) {
      const filterLabels: Record<FilterType, string> = {
        status: newFilterValue,
        assignee: newFilterValue,
        stage: newFilterValue,
        onTrack: newFilterValue === "no_overdue" ? "No overdue" : "Overdue",
        processes: newFilterStage ? `${newFilterValue} - ${newFilterStage}` : newFilterValue,
        property: newFilterValue,
        createdAt: newFilterValue,
        processName: newFilterValue,
        processType: newFilterValue,
        assignedTeam: newFilterValue,
        relatedEntity: newFilterValue,
      }
      setActiveFilters(prev => [...prev, {
        type: newFilterType,
        value: newFilterValue,
        label: filterLabels[newFilterType],
        stageValue: newFilterType === "processes" ? newFilterStage : undefined,
      }])
      setShowAddFilterModal(false)
      setNewFilterType("status")
      setNewFilterValue("")
      setNewFilterStage("")
    }
  }

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index))
  }

  const handleClearAllFilters = () => {
    setActiveFilters([])
  }

  const handleCreateProcessType = () => {
    if (newProcessName.trim()) {
      const newProcess: ProcessType = {
        id: `new-${Date.now()}`,
        name: newProcessName,
        isDraft: true,
        stages: 0,
      }
      setProcessTypes(prev => [...prev, newProcess])
      setNewProcessName("")
      setShowNewProcessModal(false)
    }
  }

  const handleDuplicateProcess = (process: ProcessType) => {
    const duplicate: ProcessType = {
      ...process,
      id: `dup-${Date.now()}`,
      name: `${process.name} (Copy)`,
    }
    setProcessTypes(prev => [...prev, duplicate])
  }

  const handleMoveToFolder = () => {
    if (selectedProcessForAction && selectedFolder) {
      setProcessTypes(prev => prev.map(p => 
        p.id === selectedProcessForAction.id ? { ...p, folder: selectedFolder } : p
      ))
      setShowMoveToFolderModal(false)
      setSelectedFolder("")
      setSelectedProcessForAction(null)
    }
  }

  const handleAssignToTeam = () => {
    if (selectedProcessForAction && selectedTeam) {
      setProcessTypes(prev => prev.map(p => 
        p.id === selectedProcessForAction.id ? { ...p, team: selectedTeam } : p
      ))
      setShowAssignToTeamModal(false)
      setSelectedTeam("")
      setSelectedProcessForAction(null)
    }
  }

  const handleDeleteProcess = () => {
    if (selectedProcessForAction) {
      setProcessTypes(prev => prev.filter(p => p.id !== selectedProcessForAction.id))
      setShowDeleteConfirmModal(false)
      setSelectedProcessForAction(null)
    }
  }

  const startInlineEditProcess = (process: ProcessType) => {
    setEditingProcessId(process.id)
    setEditingProcessName(process.name)
  }

  const saveInlineEditProcess = () => {
    if (!editingProcessId || !editingProcessName.trim()) {
      setEditingProcessId(null)
      setEditingProcessName("")
      return
    }
    setProcessTypes(prev =>
      prev.map(p => (p.id === editingProcessId ? { ...p, name: editingProcessName.trim() } : p)),
    )
    setEditingProcessId(null)
    setEditingProcessName("")
  }

  const cancelInlineEditProcess = () => {
    setEditingProcessId(null)
    setEditingProcessName("")
  }

  const deleteInlineProcess = (processId: string) => {
    setProcessTypes(prev => prev.filter(p => p.id !== processId))
    if (editingProcessId === processId) {
      setEditingProcessId(null)
      setEditingProcessName("")
    }
  }

  const handleStageChange = (instanceId: string, newStage: string) => {
    setProcessInstances(prev => prev.map(p => 
      p.id === instanceId ? { ...p, stage: newStage } : p
    ))
  }

  const handleAssigneeChange = (instanceId: string, newAssignee: string) => {
    setProcessInstances(prev => prev.map(p => 
      p.id === instanceId ? { ...p, assignee: newAssignee } : p
    ))
  }

  const handleStartProcess = () => {
    setShowStartProcessModal(false)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // In real app, this would add to folders list
      setNewFolderName("")
      setShowNewFolderModal(false)
    }
  }

  const handleSaveView = () => {
    if (newViewName.trim()) {
      // In real app, this would save the current view configuration
      setNewViewName("")
      setShowSaveViewModal(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Filter instances based on active filters
  const filteredInstances = processInstances.filter((instance) => {
    return activeFilters.every((filter) => {
      switch (filter.type) {
        case "status":
          // Status filter - all working instances match "working"
          return filter.value === "working" || filter.value === "completed" || filter.value === "on_hold"
        case "assignee":
          return instance.assignee === filter.value
        case "stage":
          return instance.stage === filter.value
        case "onTrack":
          return instance.onTrack === filter.value || 
            (filter.value === "tasks_overdue" && (instance.onTrack === "tasks_overdue" || instance.onTrack === "overdue_date"))
        case "processes":
          // Filter by process type name
          const matchesProcess = instance.name.toLowerCase().includes(filter.value.toLowerCase().replace(" Process", ""))
          // If stage is also specified, filter by that too
          if (filter.stageValue && filter.stageValue !== "" && filter.stageValue !== "all") {
            return matchesProcess && instance.stage === filter.stageValue
          }
          return matchesProcess
        case "property":
          return instance.property.includes(filter.value)
        case "createdAt":
          // Simplified date filtering
          const today = new Date()
          const instanceDate = new Date(instance.createdAt)
          switch (filter.value) {
            case "today":
              return instanceDate.toDateString() === today.toDateString()
            case "yesterday":
              const yesterday = new Date(today)
              yesterday.setDate(yesterday.getDate() - 1)
              return instanceDate.toDateString() === yesterday.toDateString()
            case "last7days":
              const last7 = new Date(today)
              last7.setDate(last7.getDate() - 7)
              return instanceDate >= last7
            case "last30days":
              const last30 = new Date(today)
              last30.setDate(last30.getDate() - 30)
              return instanceDate >= last30
            default:
              return true
          }
        default:
          return true
      }
    })
  })

  // Sort filtered instances
  const sortedInstances = [...filteredInstances].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (sortDirection === "asc") {
      return aVal.localeCompare(bVal)
    }
    return bVal.localeCompare(aVal)
  })

  // Derive high-level process categories (for collapsible view like lead stages)
  const processCategories = [
    {
      id: "onboarding",
      name: "Onboarding Processes",
      matcher: (p: ProcessType) => p.name.toLowerCase().includes("onboarding"),
    },
    {
      id: "lease-renewal",
      name: "Lease Renewal Processes",
      matcher: (p: ProcessType) => p.name.toLowerCase().includes("lease renewal"),
    },
    {
      id: "termination",
      name: "Termination / Offboarding",
      matcher: (p: ProcessType) =>
        p.name.toLowerCase().includes("termination") || p.name.toLowerCase().includes("termination process"),
    },
    {
      id: "eviction",
      name: "Eviction / Delinquency",
      matcher: (p: ProcessType) =>
        p.name.toLowerCase().includes("eviction") || p.name.toLowerCase().includes("delinquency"),
    },
    {
      id: "accounting",
      name: "Accounting / Month End",
      matcher: (p: ProcessType) => p.name.toLowerCase().includes("accounting"),
    },
    {
      id: "people",
      name: "People / HR Processes",
      matcher: (p: ProcessType) =>
        p.name.toLowerCase().includes("employee") || p.name.toLowerCase().includes("hiring"),
    },
    {
      id: "make-ready",
      name: "Make Ready / Turns",
      matcher: (p: ProcessType) => p.name.toLowerCase().includes("make ready"),
    },
  ]
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      processes: processTypes.filter(cat.matcher),
    }))
    .filter((cat) => cat.processes.length > 0)

    

  // All Processes Dashboard View
  if (showDashboard) {
    return (
      <ProcessesDashboardView
        onBack={handleBackToList}
        processTypes={processTypes}
        processInstances={processInstances}
        sortedInstances={sortedInstances}
        activeTeamTab={activeTeamTab}
        setActiveTeamTab={setActiveTeamTab}
        selectedRows={selectedRows}
        toggleRowSelection={toggleRowSelection}
        toggleAllRows={toggleAllRows}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        summaryCards={summaryCards}
        onRemoveSummaryCard={handleRemoveSummaryCard}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        showStartProcessModal={showStartProcessModal}
        setShowStartProcessModal={setShowStartProcessModal}
        showAddFilterModal={showAddFilterModal}
        setShowAddFilterModal={setShowAddFilterModal}
        showSaveViewModal={showSaveViewModal}
        setShowSaveViewModal={setShowSaveViewModal}
        newFilterType={newFilterType}
        setNewFilterType={setNewFilterType}
        newFilterValue={newFilterValue}
        setNewFilterValue={setNewFilterValue}
        newFilterStage={newFilterStage}
        setNewFilterStage={setNewFilterStage}
        newViewName={newViewName}
        setNewViewName={setNewViewName}
        onAddFilter={handleAddFilter}
        onStartProcess={handleStartProcess}
        onSaveView={handleSaveView}
        onStageChange={handleStageChange}
        onAssigneeChange={handleAssigneeChange}
      />
    )
  }

  // Process List View
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 px-6 py-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded">
              Processes
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="text-sm text-gray-600 hover:text-gray-800">
                  Assign
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {teams.map((team) => (
                  <DropdownMenuItem key={team.id}>{team.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button 
              type="button" 
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              onClick={() => setShowNewProcessModal(true)}
            >
              <Pencil className="h-3 w-3 text-gray-400" />
              New
            </button>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Processes</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm bg-white border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={handleViewDashboard}
            >
              All Processes Dashboard
            </Button>
            <Button 
              size="sm" 
              className="text-sm bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowNewProcessModal(true)}
            >
              New Process Type
            </Button>
          </div>
          <button 
            type="button" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            onClick={() => setShowNewFolderModal(true)}
          >
            New Filter 
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Processes are workflows that help you achieve goals for your owners and tenants.
        </p>
      </div>

      {/* Process Categories - collapsible groups (like lead stages view) */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Process Categories</h2>
          <span className="text-sm text-gray-500">
            {processCategories.reduce((sum, cat) => sum + cat.processes.length, 0)} process types
          </span>
        </div>
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 text-xs font-medium text-gray-500">Category Name</th>
                <th className="text-left p-3 text-xs font-medium text-gray-500">Process Count</th>
                <th className="text-left p-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right p-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processCategories.map((category) => (
                <Fragment key={category.id}>
                  <tr
                    className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-600">
                          <FolderOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                        {category.processes.length} processes
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                        Active
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCategory(category.id)
                        }}
                      >
                        View Processes
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>

                  {expandedCategories.includes(category.id) &&
                    category.processes.map((process, index) => (
                      <tr
                        key={`${category.id}-${process.id}`}
                        className="border-b bg-card hover:bg-muted/40 transition-colors"
                      >
                        <td colSpan={4} className="p-0">
                          <div className="flex items-center gap-4 px-8 py-3">
                            <div className="text-muted-foreground hover:text-foreground cursor-grab">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0 flex items-center gap-3">
                              {editingProcessId === process.id ? (
                                <>
                                  <Input
                                    value={editingProcessName}
                                    onChange={(e) => setEditingProcessName(e.target.value)}
                                    className="flex-1 h-8 text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveInlineEditProcess()
                                      if (e.key === "Escape") cancelInlineEditProcess()
                                    }}
                                  />
                                  <Button
                                    size="icon"
                                    className="h-7 w-7 bg-foreground text-background hover:bg-foreground/90"
                                    onClick={saveInlineEditProcess}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => deleteInlineProcess(process.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="text-sm font-medium text-foreground hover:text-teal-700 hover:underline text-left truncate"
                                    onClick={() => handleViewDashboard()}
                                  >
                                    {process.name}
                                  </button>
                                  <div className="ml-auto flex items-center gap-6 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium text-foreground/80">{process.stages}</span>
                                      <span>Steps</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium text-foreground/80">7</span>
                                      <span>Days</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-medium text-foreground/80">2</span>
                                      <span>Processes</span>
                                    </div>
                                    {/* {process.isDraft && (
                                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                                        Draft
                                      </span>
                                    )} */}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          startInlineEditProcess(process)
                                        }}
                                      >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit Name
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleViewDashboard()
                                        }}
                                      >
                                        <ChevronRight className="h-4 w-4 mr-2" />
                                        Open Process
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          deleteInlineProcess(process.id)
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Process
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

  

      {/* New Process Type Modal */}
      <Dialog open={showNewProcessModal} onOpenChange={setShowNewProcessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Process Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Process Name</Label>
              <Input 
                value={newProcessName}
                onChange={(e) => setNewProcessName(e.target.value)}
                placeholder="Enter process name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProcessModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleCreateProcessType} className="bg-blue-600 hover:bg-blue-700">Create Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Folder Modal */}
      <Dialog open={showMoveToFolderModal} onOpenChange={setShowMoveToFolderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Move "{selectedProcessForAction?.name}" to a folder
            </p>
            <div className="space-y-2">
              <Label>Select Folder</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a folder..." />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveToFolderModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleMoveToFolder} className="bg-blue-600 hover:bg-blue-700">Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Team Modal */}
      <Dialog open={showAssignToTeamModal} onOpenChange={setShowAssignToTeamModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Assign "{selectedProcessForAction?.name}" to a team
            </p>
            <div className="space-y-2">
              <Label>Select Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team..." />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignToTeamModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleAssignToTeam} className="bg-blue-600 hover:bg-blue-700">Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Process</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete "{selectedProcessForAction?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleDeleteProcess} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Modal */}
      <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Folder Name</Label>
              <Input 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleCreateFolder} className="bg-blue-600 hover:bg-blue-700">Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>  
  )
}