"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Plus, MoreVertical, ClipboardList, Search, GripVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"

interface Stage {
  id: string
  name: string
  steps: number
  days: number
  processes: number
}

interface Process {
  id: string
  name: string
  stages: Stage[]
}

const initialProcesses: Process[] = [
  {
    id: "process-1",
    name: "Property Onboarding Process",
    stages: [
      { id: "s1-1", name: "Initial Contact", steps: 3, days: 2, processes: 2 },
      { id: "s1-2", name: "Document Collection", steps: 5, days: 5, processes: 3 },
      { id: "s1-3", name: "Property Inspection", steps: 2, days: 3, processes: 1 },
      { id: "s1-4", name: "System Setup", steps: 8, days: 14, processes: 4 },
      { id: "s1-5", name: "Final Review", steps: 4, days: 9, processes: 2 },
      { id: "s1-6", name: "Go Live", steps: 1, days: 1, processes: 1 },
      { id: "s1-7", name: "Post Launch", steps: 2, days: 7, processes: 1 },
    ],
  },
  {
    id: "process-2",
    name: "Delinquency Process",
    stages: [
      { id: "s2-1", name: "Late Notice Sent", steps: 2, days: 1, processes: 1 },
      { id: "s2-2", name: "Grace Period", steps: 1, days: 5, processes: 1 },
      { id: "s2-3", name: "Demand Letter", steps: 3, days: 3, processes: 2 },
      { id: "s2-4", name: "Payment Plan Negotiation", steps: 4, days: 7, processes: 2 },
      { id: "s2-5", name: "Final Warning", steps: 2, days: 3, processes: 1 },
      { id: "s2-6", name: "Legal Referral", steps: 3, days: 5, processes: 3 },
    ],
  },
  {
    id: "process-3",
    name: "Eviction Process",
    stages: [
      { id: "s3-1", name: "Notice to Vacate", steps: 2, days: 3, processes: 1 },
      { id: "s3-2", name: "Filing with Court", steps: 4, days: 5, processes: 2 },
      { id: "s3-3", name: "Court Hearing", steps: 3, days: 14, processes: 1 },
      { id: "s3-4", name: "Judgment & Writ", steps: 2, days: 7, processes: 1 },
      { id: "s3-5", name: "Move-Out Coordination", steps: 5, days: 10, processes: 3 },
    ],
  },
  {
    id: "process-4",
    name: "Lease Renewal Process",
    stages: [
      { id: "s4-1", name: "Renewal Eligibility Check", steps: 2, days: 2, processes: 1 },
      { id: "s4-2", name: "Market Rent Analysis", steps: 3, days: 3, processes: 2 },
      { id: "s4-3", name: "Offer Sent", steps: 2, days: 1, processes: 1 },
      { id: "s4-4", name: "Negotiation", steps: 4, days: 7, processes: 2 },
      { id: "s4-5", name: "Lease Signed", steps: 3, days: 5, processes: 1 },
      { id: "s4-6", name: "System Update", steps: 2, days: 2, processes: 1 },
    ],
  },
  {
    id: "process-5",
    name: "Make Ready Process",
    stages: [
      { id: "s5-1", name: "Move-Out Inspection", steps: 3, days: 2, processes: 1 },
      { id: "s5-2", name: "Vendor Coordination", steps: 5, days: 3, processes: 3 },
      { id: "s5-3", name: "Repairs & Maintenance", steps: 8, days: 14, processes: 4 },
      { id: "s5-4", name: "Cleaning", steps: 2, days: 2, processes: 1 },
      { id: "s5-5", name: "Final Walkthrough", steps: 3, days: 1, processes: 1 },
      { id: "s5-6", name: "Photography & Listing", steps: 4, days: 3, processes: 2 },
      { id: "s5-7", name: "Market Ready", steps: 1, days: 1, processes: 1 },
    ],
  },
  {
    id: "process-6",
    name: "Owner Onboarding Process",
    stages: [
      { id: "s6-1", name: "Initial Meeting", steps: 2, days: 1, processes: 1 },
      { id: "s6-2", name: "Agreement Signing", steps: 3, days: 3, processes: 2 },
      { id: "s6-3", name: "Account Setup", steps: 5, days: 5, processes: 3 },
      { id: "s6-4", name: "Property Assessment", steps: 4, days: 7, processes: 2 },
      { id: "s6-5", name: "Welcome Package", steps: 2, days: 2, processes: 1 },
    ],
  },
  {
    id: "process-7",
    name: "Property Termination Process",
    stages: [
      { id: "s7-1", name: "Termination Notice", steps: 2, days: 1, processes: 1 },
      { id: "s7-2", name: "Final Accounting", steps: 4, days: 7, processes: 2 },
      { id: "s7-3", name: "Key & Document Return", steps: 3, days: 3, processes: 1 },
      { id: "s7-4", name: "System Deactivation", steps: 2, days: 2, processes: 1 },
    ],
  },
]

interface StageWorkflowProps {
  currentProcessName?: string
}

export default function StageWorkflow({ currentProcessName }: StageWorkflowProps) {
  const defaultProcess = initialProcesses.find(
    (p) => p.name.toLowerCase() === currentProcessName?.toLowerCase()
  ) ?? initialProcesses[0]

  const [processes, setProcesses] = useState<Process[]>(initialProcesses)
  const [selectedProcessId, setSelectedProcessId] = useState<string>(defaultProcess.id)
  const [filterSearch, setFilterSearch] = useState("")
  const [editingStageId, setEditingStageId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [addingStage, setAddingStage] = useState(false)
  const [newStageName, setNewStageName] = useState("")
  const [viewingStage, setViewingStage] = useState<Stage | null>(null)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  const filteredDropdownProcesses = filterSearch.trim()
    ? processes.filter((p) => p.name.toLowerCase().includes(filterSearch.toLowerCase()))
    : processes

  const selectedProcess = processes.find((p) => p.id === selectedProcessId) ?? processes[0]

  const updateStages = (newStages: Stage[]) => {
    setProcesses((prev) =>
      prev.map((p) => (p.id === selectedProcessId ? { ...p, stages: newStages } : p))
    )
  }

  const startEdit = (stage: Stage) => {
    setEditingStageId(stage.id)
    setEditName(stage.name)
  }

  const saveEdit = () => {
    if (!editingStageId || !editName.trim()) return
    updateStages(
      selectedProcess.stages.map((s) =>
        s.id === editingStageId ? { ...s, name: editName.trim() } : s
      )
    )
    setEditingStageId(null)
  }

  const cancelEdit = () => setEditingStageId(null)

  const deleteStage = (stageId: string) => {
    updateStages(selectedProcess.stages.filter((s) => s.id !== stageId))
  }

  const addStage = () => {
    if (!newStageName.trim()) return
    const newId = `${selectedProcessId}-new-${Date.now()}`
    updateStages([
      ...selectedProcess.stages,
      { id: newId, name: newStageName.trim(), steps: 0, days: 0, processes: 0 },
    ])
    setNewStageName("")
    setAddingStage(false)
  }

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    const reordered = [...selectedProcess.stages]
    const [removed] = reordered.splice(dragItem.current, 1)
    reordered.splice(dragOverItem.current, 0, removed)
    updateStages(reordered)
    dragItem.current = null
    dragOverItem.current = null
  }

  if (viewingStage) {
    return (
      <StageWorkflowPage
        categoryName={selectedProcess.name}
        stage={{ id: viewingStage.id, name: viewingStage.name, steps: viewingStage.steps, days: viewingStage.days, processes: viewingStage.processes }}
        onBack={() => setViewingStage(null)}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Processes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Processes are workflows that help you achieve goals for your owners and tenants.
          </p>
        </div>
      </div>

      {/* Process Selector */}
      <div>
        <DropdownMenu onOpenChange={(open) => { if (!open) setFilterSearch("") }}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 min-w-[260px] rounded-md border border-blue-600 bg-transparent px-3 py-2 text-sm shadow-sm hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
            >
              <span className="flex-1 text-left font-medium truncate">{selectedProcess.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80">
            <div className="px-3 py-2 border-b">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Search processes..."
                  className="w-full text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                />
              </div>
            </div>
            {filteredDropdownProcesses.map((p) => (
              <DropdownMenuItem
                key={p.id}
                className={`flex items-center gap-2 ${p.id === selectedProcessId ? "bg-blue-50 text-blue-700 font-medium" : ""}`}
                onSelect={() => { setSelectedProcessId(p.id); setEditingStageId(null); setAddingStage(false) }}
              >
                <span className="text-sm">{p.name}</span>
              </DropdownMenuItem>
            ))}
            {filteredDropdownProcesses.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No processes found</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Process Stages */}
      <div className="border rounded-lg">
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="h-10 w-10 rounded-lg bg-teal-500 flex items-center justify-center text-white shrink-0">
            <ClipboardList className="h-5 w-5" />
          </div>
          <span className="font-medium text-foreground">{selectedProcess.name}</span>
          <span className="ml-auto text-sm text-muted-foreground">{selectedProcess.stages.length} stages</span>
        </div>

        <div className="bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm text-foreground">Stages</span>
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => { setAddingStage(true); setEditingStageId(null) }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Stage
            </Button>
          </div>

          <div className="space-y-2">
            {selectedProcess.stages.map((stage, idx) => (
              <div
                key={stage.id}
                draggable={editingStageId !== stage.id}
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center justify-between p-3 bg-background border rounded hover:bg-muted/50 transition-colors group"
              >
                {editingStageId === stage.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                      {idx + 1}
                    </div>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 text-sm flex-1"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit() }}
                    />
                    <Button size="sm" variant="ghost" className="text-xs" onClick={cancelEdit}>Cancel</Button>
                    <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={saveEdit}>Save</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
                      <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                        {idx + 1}
                      </div>
                      <button
                        onClick={() => setViewingStage(stage)}
                        className="text-sm font-medium text-blue-600 hover:underline text-left"
                      >
                        {stage.name}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground ml-2 shrink-0">
                      <span>{stage.steps} Steps</span>
                      <span>{stage.days} Days</span>
                      <span>{stage.processes} Processes</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 ml-2 shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEdit(stage)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteStage(stage.id)} className="text-red-600 focus:text-red-600">
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            ))}

            {/* Add Stage Row */}
            {addingStage && (
              <div className="flex items-center gap-3 p-3 bg-background border rounded border-blue-300">
                <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                  {selectedProcess.stages.length + 1}
                </div>
                <Input
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="Stage name"
                  className="h-8 text-sm flex-1"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") addStage(); if (e.key === "Escape") setAddingStage(false) }}
                />
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setAddingStage(false)}>Cancel</Button>
                <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={addStage}>Save</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
