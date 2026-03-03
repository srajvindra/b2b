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
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { OwnerProcessesData, OwnerProcessItem } from "../types"

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
                {newlyStartedProcesses.map((process) => (
                  <div
                    key={process.id}
                    className="border rounded-lg overflow-hidden border-teal-200 bg-teal-50/30 cursor-pointer"
                    onClick={() => onProcessClick(process, contactName)}
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{process.name}</p>
                            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                              New
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                              {process.prospectingStage}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
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
                  </div>
                ))}
                {ownerProcesses.inProgress.map((process) => (
                  <div
                    key={process.id}
                    className="border rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onProcessClick(process, contactName)}
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{process.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                              {process.prospectingStage}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
                            <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Process
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
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
                {ownerProcesses.upcoming.map((process) => (
                  <div
                    key={process.id}
                    className="border rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onProcessClick(process, contactName)}
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{process.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                              {process.prospectingStage}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">{process.status}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
                            <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Process
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
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
                {ownerProcesses.completed.map((process) => (
                  <div
                    key={process.id}
                    className="border rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onProcessClick(process, contactName)}
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{process.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                              {process.prospectingStage}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
                            <span className="text-xs text-muted-foreground">Completed: {process.completedOn}</span>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
                            <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Process
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
