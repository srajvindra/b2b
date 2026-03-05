"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Workflow,
  Plus,
  PlayCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { OwnerProcessesData, OwnerProcessItem, OwnerProcessTaskItem } from "../types"

export interface OwnerProcessesTabNewProcess extends OwnerProcessItem {}

export interface OwnerProcessesTabProps {
  ownerProcesses: OwnerProcessesData
  newlyStartedProcesses: OwnerProcessesTabNewProcess[]
  processStatusFilter: "in-progress" | "completed" | "upcoming"
  onProcessStatusFilterChange: (v: "in-progress" | "completed" | "upcoming") => void
  onStartProcessClick: () => void
  onProcessClick: (process: OwnerProcessItem, contactName: string) => void
  onEditProcess: (process: OwnerProcessItem) => void
  onRemoveNewProcess: (processId: string) => void
  expandedProcesses: string[]
  onToggleProcessExpanded: (id: string) => void
  contactName: string
}

export function OwnerProcessesTab({
  ownerProcesses,
  newlyStartedProcesses,
  processStatusFilter,
  onProcessStatusFilterChange,
  onStartProcessClick,
  onProcessClick,
  onEditProcess,
  onRemoveNewProcess,
  expandedProcesses,
  onToggleProcessExpanded,
  contactName,
}: OwnerProcessesTabProps) {
  return (
    <div className="mt-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold">Processes</h3>
          </div>
          <Button onClick={onStartProcessClick} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Start Process
          </Button>
        </div>

        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
          <button
            type="button"
            onClick={() => onProcessStatusFilterChange("in-progress")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              processStatusFilter === "in-progress" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            In Progress ({ownerProcesses.inProgress.length + newlyStartedProcesses.length})
          </button>
          <button
            type="button"
            onClick={() => onProcessStatusFilterChange("completed")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              processStatusFilter === "completed" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Completed ({ownerProcesses.completed.length})
          </button>
          <button
            type="button"
            onClick={() => onProcessStatusFilterChange("upcoming")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              processStatusFilter === "upcoming" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming ({ownerProcesses.upcoming.length})
          </button>
        </div>

        <div className="space-y-6">
          {processStatusFilter === "in-progress" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle className="h-4 w-4 text-amber-500" />
                <h4 className="font-semibold text-foreground">
                  In Progress ({ownerProcesses.inProgress.length + newlyStartedProcesses.length})
                </h4>
              </div>
              <div className="space-y-2">
                {newlyStartedProcesses.map((process) => {
                  const isExpanded = expandedProcesses.includes(process.id)
                  return (
                    <div key={process.id} className="border rounded-lg overflow-hidden border-teal-200 bg-teal-50/30">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => onToggleProcessExpanded(process.id)}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onProcessClick(process, contactName)}
                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                              >
                                {process.name}
                              </button>
                              <Badge
                                variant="outline"
                                className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                              >
                                New
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {process.prospectingStage}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Started: {process.startedOn}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {process.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProcessClick(process, contactName)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditProcess(process)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Process
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onRemoveNewProcess(process.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Process
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {isExpanded && process.tasks && process.tasks.length > 0 && (
                        <OwnerProcessTasksTable tasks={process.tasks} />
                      )}
                    </div>
                  )
                })}
                {ownerProcesses.inProgress.map((process) => {
                  const isExpanded = expandedProcesses.includes(process.id)
                  return (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => onToggleProcessExpanded(process.id)}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => onProcessClick(process, contactName)}
                              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                            >
                              {process.name}
                            </button>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {process.prospectingStage}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Started: {process.startedOn}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {process.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProcessClick(process, contactName)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditProcess(process)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Process
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Process
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {isExpanded && process.tasks && process.tasks.length > 0 && (
                        <OwnerProcessTasksTable tasks={process.tasks} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {processStatusFilter === "upcoming" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold text-foreground">Upcoming ({ownerProcesses.upcoming.length})</h4>
              </div>
              <div className="space-y-2">
                {ownerProcesses.upcoming.map((process) => {
                  const isExpanded = expandedProcesses.includes(process.id)
                  return (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => onToggleProcessExpanded(process.id)}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => onProcessClick(process, contactName)}
                              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                            >
                              {process.name}
                            </button>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {process.prospectingStage}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            {process.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProcessClick(process, contactName)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditProcess({ ...process, startedOn: undefined })
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Process
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Process
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {isExpanded && process.tasks && process.tasks.length > 0 && (
                        <OwnerProcessTasksTable tasks={process.tasks} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {processStatusFilter === "completed" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <h4 className="font-semibold text-foreground">Completed ({ownerProcesses.completed.length})</h4>
              </div>
              <div className="space-y-2">
                {ownerProcesses.completed.map((process) => {
                  const isExpanded = expandedProcesses.includes(process.id)
                  return (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => onToggleProcessExpanded(process.id)}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => onProcessClick(process, contactName)}
                              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                            >
                              {process.name}
                            </button>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {process.prospectingStage}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Started: {process.startedOn}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Completed: {process.completedOn}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {process.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onProcessClick(process, contactName)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEditProcess(process)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Process
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Process
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {isExpanded && process.tasks && process.tasks.length > 0 && (
                        <OwnerProcessTasksTable tasks={process.tasks} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface OwnerProcessTasksTableProps {
  tasks: OwnerProcessTaskItem[]
}

function OwnerProcessTasksTable({ tasks }: OwnerProcessTasksTableProps) {
  return (
    <div className="border-t bg-muted/20 px-4 py-3">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="font-medium text-xs pl-12">Task Name</TableHead>
            <TableHead className="font-medium text-xs">Start Date</TableHead>
            <TableHead className="font-medium text-xs">Completed On</TableHead>
            <TableHead className="font-medium text-xs">Staff Member</TableHead>
            <TableHead className="font-medium text-xs w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-muted/20">
              <TableCell className="text-sm pl-12">{task.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {task.startDate || "\u2014"}
              </TableCell>
              <TableCell
                className={`text-sm ${
                  task.completedDate ? "text-teal-600 font-medium" : "text-muted-foreground"
                }`}
              >
                {task.completedDate || "\u2014"}
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-foreground">{task.staffName}</p>
                  <p className="text-xs text-muted-foreground">{task.staffEmail}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  {!task.completedDate && (
                    <button
                      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border border-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors"
                      title="Mark as Complete"
                    >
                      <Check className="h-4 w-4" />
                      Complete
                    </button>
                  )}
                  {task.completedDate && (
                    <span
                      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-200"
                      title="Completed"
                    >
                      <Check className="h-4 w-4" />
                      Done
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
