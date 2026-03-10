"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Plus, MoreVertical, ClipboardList } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface Stage {
  id: string
  name: string
  steps: number
  days: number
  processes: number
}

interface Process {
  id: string
  icon: string
  name: string
  badge?: string
  stages: Stage[]
  stageCount: number
}

interface ProcessGroup {
  name: string
  processes: Process[]
}

export default function ManageProcessPage() {
  const [expandedProcesses, setExpandedProcesses] = useState<Set<string>>(new Set())
  const router = useRouter()
  const processData: ProcessGroup[] = [
    {
      name: "Unassigned Processes",
      processes: [
        {
          id: "process-1",
          icon: "clipboard",
          name: "2 Property Onboarding Process",
          stages: [
            { id: "stage-1", name: "Initial Contact", steps: 3, days: 2, processes: 2 },
            { id: "stage-2", name: "Document Collection", steps: 5, days: 5, processes: 3 },
            { id: "stage-3", name: "Property Inspection", steps: 2, days: 3, processes: 1 },
            { id: "stage-4", name: "System Setup", steps: 8, days: 14, processes: 4 },
            { id: "stage-5", name: "Final Review", steps: 4, days: 9, processes: 2 },
            { id: "stage-6", name: "Go Live", steps: 1, days: 1, processes: 1 },
            { id: "stage-7", name: "Post Launch", steps: 2, days: 7, processes: 1 },
          ],
          stageCount: 7,
        },
        {
          id: "process-2",
          icon: "clipboard",
          name: "Accounting Mistakes",
          badge: "Draft",
          stages: [],
          stageCount: 4,
        },
        {
          id: "process-3",
          icon: "clipboard",
          name: "Applications screening process",
          stages: [],
          stageCount: 11,
        },
        {
          id: "process-4",
          icon: "clipboard",
          name: "Delinquency Process",
          stages: [],
          stageCount: 10,
        },
        {
          id: "process-5",
          icon: "clipboard",
          name: "Employee Onboarding Process",
          stages: [],
          stageCount: 5,
        },
        {
          id: "process-6",
          icon: "clipboard",
          name: "Employee Termination Process",
          badge: "Draft",
          stages: [],
          stageCount: 3,
        },
        {
          id: "process-7",
          icon: "clipboard",
          name: "Employee Training Process",
          badge: "Draft",
          stages: [],
          stageCount: 21,
        },
        {
          id: "process-8",
          icon: "clipboard",
          name: "EOM Accounting Process for Month",
          badge: "Draft",
          stages: [],
          stageCount: 4,
        },
        {
          id: "process-9",
          icon: "clipboard",
          name: "Escalated Owner Funds Collection Process",
          badge: "Draft",
          stages: [],
          stageCount: 5,
        },
        {
          id: "process-10",
          icon: "clipboard",
          name: "Eviction Process",
          stages: [],
          stageCount: 10,
        },
        {
          id: "process-11",
          icon: "clipboard",
          name: "Haro PM",
          badge: "Draft",
          stages: [],
          stageCount: 3,
        },
        {
          id: "process-12",
          icon: "clipboard",
          name: "Hiring Requisition Process",
          badge: "Draft",
          stages: [],
          stageCount: 8,
        },
        {
          id: "process-13",
          icon: "clipboard",
          name: "Lease Renewal Process",
          stages: [],
          stageCount: 10,
        },
        {
          id: "process-14",
          icon: "clipboard",
          name: "Legal Cases Complaints and Notices",
          badge: "Draft",
          stages: [],
          stageCount: 8,
        },
        {
          id: "process-15",
          icon: "clipboard",
          name: "Make Ready Process",
          stages: [],
          stageCount: 9,
        },
      ],
    },
  ]

  const toggleProcess = (processId: string) => {
    setExpandedProcesses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(processId)) {
        newSet.delete(processId)
      } else {
        newSet.add(processId)
      }
      return newSet
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Processes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Processes are workflows that help you achieve goals for your owners and tenants.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Process Type
        </Button>
      </div>

      {/* Process Groups */}
      <div className="space-y-6">
        {processData.map((group) => (
          <div key={group.name} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{group.name}</h2>
              <span className="text-sm text-muted-foreground">{group.processes.length} processes</span>
            </div>

            <div className="space-y-2">
              {group.processes.map((process) => {
                const isExpanded = expandedProcesses.has(process.id)

                return (
                  <div key={process.id} className="border rounded-lg">
                    {/* Process Header */}
                    <button
                      onClick={() => toggleProcess(process.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <div className="h-10 w-10 rounded-lg bg-teal-500 flex items-center justify-center text-white shrink-0">
                          <ClipboardList className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{process.name}</span>
                            {process.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {process.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{process.stageCount} stages</span>
                      </div>
                    </button>

                    {/* Process Details - Stages */}
                    {isExpanded && process.stages.length > 0 && (
                      <div className="border-t bg-muted/30 p-4 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-sm text-foreground">Stages</span>
                          <Button size="sm" variant="outline" className="text-xs bg-[rgba(1,96,209,1)] text-[rgba(255,255,255,1)]">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Stage
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {process.stages.map((stage) => (
                            <div
                              key={stage.id}
                              className="flex items-center justify-between p-3 bg-background border rounded hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                                  {stage.id.split("-")[1]}
                                </div>
                                <div className="text-left min-w-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      router.push(`/settings/stages/owners/${stage.id}/${stage.name}`)
                                    }}
                                    className="text-sm font-medium text-[rgba(1,96,209,1)] hover:underline text-left"
                                  >
                                    {stage.name}
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground ml-2 shrink-0">
                                <span>{stage.steps} Steps</span>
                                <span>{stage.days} Days</span>
                                <span>{stage.processes} Processes</span>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 ml-2 shrink-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
