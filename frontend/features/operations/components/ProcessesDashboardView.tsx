"use client"

import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronUp, Bell, Settings, X, AlertTriangle, CheckCircle, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  onStartProcess,
  onSaveView,
  onStageChange,
  onAssigneeChange,
}: ProcessesDashboardViewProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">All Processes</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setShowStartProcessModal(true)}
            >
              <Plus className="h-4 w-4" />
              Start Process
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
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
              className={`text-sm pb-2 border-b-2 transition-colors ${
                activeTeamTab === tab.id
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
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => onRemoveSummaryCard(card.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-3">
        {activeFilters.map((filter, index) => (
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
        {activeFilters.length > 0 && (
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={onClearAllFilters}
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
                <td className="py-3 px-2" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Start Process Modal */}
      <Dialog open={showStartProcessModal} onOpenChange={setShowStartProcessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Process</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Process Type</Label>
              <Select>
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
            <div className="space-y-2">
              <Label>Property (Optional)</Label>
              <Input placeholder="Search for a property..." />
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select>
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
            </div>
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
