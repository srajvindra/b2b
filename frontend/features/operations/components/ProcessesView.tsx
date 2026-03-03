"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Pencil, ChevronDown, FolderPlus, Copy, Users, Trash2 } from "lucide-react"
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

      {/* Unassigned Processes Section */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Unassigned Processes</h2>
          <span className="text-sm text-gray-500">{processTypes.length} processes</span>
        </div>

        {/* Process List */}
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {processTypes.map((process) => (
            <div
              key={process.id}
              className={`group flex items-center justify-between py-4 px-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedProcess === process.id ? "bg-teal-50/40" : ""
              }`}
              onClick={() => setSelectedProcess(process.id)}
            >
              <div className="flex items-center gap-4">
                {/* Teal folder icon */}
                <div className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                
                {/* Process name - clickable */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDashboard()
                    }}
                    className="text-[15px] font-semibold text-gray-900 hover:text-teal-700 text-left transition-colors"
                  >
                    {process.name}
                  </button>
                  
                  {/* Draft badge */}
                  {process.isDraft && (
                    <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                      Draft
                    </span>
                  )}

                  {/* Team badge */}
                  {process.team && (
                    <span className="px-2 py-0.5 text-xs text-teal-600 bg-teal-50 rounded">
                      {teams.find(t => t.id === process.team)?.name}
                    </span>
                  )}

                  {/* Folder badge */}
                  {process.folder && (
                    <span className="px-2 py-0.5 text-xs text-purple-600 bg-purple-50 rounded">
                      {folders.find(f => f.id === process.folder)?.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Stages count */}
                <span className="text-sm text-gray-400">{process.stages} stages</span>
                
                {/* More menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDashboard()}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Process
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateProcess(process)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setSelectedProcessForAction(process)
                      setShowMoveToFolderModal(true)
                    }}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Move to Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedProcessForAction(process)
                      setShowAssignToTeamModal(true)
                    }}>
                      <Users className="h-4 w-4 mr-2" />
                      Assign to Team
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => {
                        setSelectedProcessForAction(process)
                        setShowDeleteConfirmModal(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
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