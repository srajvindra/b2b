"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ChevronRight,
  ChevronDown,
  Plus,
  MoreVertical,
  ClipboardList,
  GripVertical,
  Pencil,
  Trash2,
  Search,
  X,
  Code,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { LoadMorePagination } from "@/components/shared/LoadMorePagination"

// Merge tags & categories reused from GeneralSettingsTab
const MERGE_TAGS = [
  "Property.Name",
  "Property.Street",
  "Existing Tenant.First Name",
  "Existing Tenant.Full Name",
  "Owners.First Name",
  "Owners.Full Name",
  "Tenants.First Name",
  "Tenants.Full Name",
  "Future Tenants.First Name",
  "Future Tenants.Full Name",
]

const CATEGORY_OPTIONS: { value: string; label: string; prefix: string }[] = [
  { value: "property-onboarding", label: "Property Onboarding", prefix: "Property Onboarding" },
  { value: "lease-renewal", label: "Lease Renewal", prefix: "Lease Renewal" },
  { value: "make-ready", label: "Make Ready", prefix: "Make Ready" },
  { value: "delinquency", label: "Delinquency", prefix: "Delinquency" },
  { value: "eviction", label: "Eviction", prefix: "Eviction" },
]

function MergeTagPicker({ onSelect }: { onSelect: (tag: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = MERGE_TAGS.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0"
          title="Insert merge tag"
        >
          <Code className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 z-[60]"
        align="end"
        sideOffset={4}
        onWheel={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => {
          const target = e.target as HTMLElement
          if (target.closest("[role='dialog']")) e.preventDefault()
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search available merge tags"
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        <div
          className="max-h-64 overflow-y-auto py-1"
          onWheel={(e) => e.stopPropagation()}
        >
          {filtered.map((tag) => (
            <button
              key={tag}
              type="button"
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/70"
              onClick={() => {
                onSelect(tag)
                setOpen(false)
              }}
            >
              {tag}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No tags match your search.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}


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
  const [processData, setProcessData] = useState<ProcessGroup[]>([
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
        { id: "process-2", icon: "clipboard", name: "Accounting Mistakes", badge: "Draft", stages: [], stageCount: 4 },
        { id: "process-3", icon: "clipboard", name: "Applications screening process", stages: [], stageCount: 11 },
        { id: "process-4", icon: "clipboard", name: "Delinquency Process", stages: [], stageCount: 10 },
        { id: "process-5", icon: "clipboard", name: "Employee Onboarding Process", stages: [], stageCount: 5 },
        { id: "process-6", icon: "clipboard", name: "Employee Termination Process", badge: "Draft", stages: [], stageCount: 3 },
        { id: "process-7", icon: "clipboard", name: "Employee Training Process", badge: "Draft", stages: [], stageCount: 21 },
        { id: "process-8", icon: "clipboard", name: "EOM Accounting Process for Month", badge: "Draft", stages: [], stageCount: 4 },
        { id: "process-9", icon: "clipboard", name: "Escalated Owner Funds Collection Process", badge: "Draft", stages: [], stageCount: 5 },
        { id: "process-10", icon: "clipboard", name: "Eviction Process", stages: [], stageCount: 10 },
        { id: "process-11", icon: "clipboard", name: "Haro PM", badge: "Draft", stages: [], stageCount: 3 },
        { id: "process-12", icon: "clipboard", name: "Hiring Requisition Process", badge: "Draft", stages: [], stageCount: 8 },
        { id: "process-13", icon: "clipboard", name: "Lease Renewal Process", stages: [], stageCount: 10 },
        { id: "process-14", icon: "clipboard", name: "Legal Cases Complaints and Notices", badge: "Draft", stages: [], stageCount: 8 },
        { id: "process-15", icon: "clipboard", name: "Make Ready Process", stages: [], stageCount: 9 },
      ],
    },
  ])

  const router = useRouter()
  const [editingStageId, setEditingStageId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [addingStageForProcess, setAddingStageForProcess] = useState<string | null>(null)
  const [newStageName, setNewStageName] = useState("")
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const dragProcessId = useRef<string | null>(null)

  const [visibleCount, setVisibleCount] = useState(10)

  // Add Process Type dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newProcessTypeName, setNewProcessTypeName] = useState("")
  const [newCategory, setNewCategory] = useState<string>(CATEGORY_OPTIONS[0]?.value ?? "make-ready")
  const [newMergeTag, setNewMergeTag] = useState<string>("Property.Street")

  const newCategoryPrefix = CATEGORY_OPTIONS.find((c) => c.value === newCategory)?.prefix ?? ""
  const newItemName = `${newCategoryPrefix} for ${newMergeTag}`

  const openAddDialog = () => {
    setNewProcessTypeName("")
    setNewCategory(CATEGORY_OPTIONS[0]?.value ?? "make-ready")
    setNewMergeTag("Property.Street")
    setAddDialogOpen(true)
  }

  const handleSelectNewMergeTag = (tag: string) => {
    setNewMergeTag(tag)
  }

  const saveNewProcessType = () => {
    if (!newProcessTypeName.trim()) return

    setProcessData((prev) =>
      prev.map((group) =>
        group.name === "Unassigned Processes"
          ? {
              ...group,
              processes: [
                {
                  id: `process-new-${Date.now()}`,
                  icon: "clipboard",
                  name: newProcessTypeName.trim(),
                  badge: "Draft",
                  stages: [],
                  stageCount: 0,
                },
                ...group.processes,
              ],
            }
          : group,
      ),
    )

    setAddDialogOpen(false)
  }

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

  const updateProcessStages = (processId: string, newStages: Stage[]) => {
    setProcessData((prev) =>
      prev.map((group) => ({
        ...group,
        processes: group.processes.map((p) =>
          p.id === processId ? { ...p, stages: newStages, stageCount: newStages.length } : p
        ),
      }))
    )
  }

  const startEdit = (stage: Stage) => {
    setEditingStageId(stage.id)
    setEditName(stage.name)
  }

  const saveEdit = (processId: string, stages: Stage[]) => {
    if (!editingStageId || !editName.trim()) return
    updateProcessStages(
      processId,
      stages.map((s) =>
        s.id === editingStageId ? { ...s, name: editName.trim() } : s
      )
    )
    setEditingStageId(null)
  }

  const cancelEdit = () => setEditingStageId(null)

  const deleteStage = (processId: string, stageId: string, stages: Stage[]) => {
    updateProcessStages(processId, stages.filter((s) => s.id !== stageId))
  }

  const addStage = (processId: string, stages: Stage[]) => {
    if (!newStageName.trim()) return
    const newId = `${processId}-new-${Date.now()}`
    updateProcessStages(processId, [
      ...stages,
      { id: newId, name: newStageName.trim(), steps: 0, days: 0, processes: 0 },
    ])
    setNewStageName("")
    setAddingStageForProcess(null)
  }

  const handleDragStart = (processId: string, index: number) => {
    dragProcessId.current = processId
    dragItem.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = (processId: string, stages: Stage[]) => {
    if (dragProcessId.current !== processId || dragItem.current === null || dragOverItem.current === null) return
    const reordered = [...stages]
    const [removed] = reordered.splice(dragItem.current, 1)
    reordered.splice(dragOverItem.current, 0, removed)
    updateProcessStages(processId, reordered)
    dragItem.current = null
    dragOverItem.current = null
    dragProcessId.current = null
  }

  const totalProcesses = processData.reduce((sum, group) => sum + group.processes.length, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Processes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Processes are workflows that help you achieve goals for your owners and tenants.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Process Type
        </Button>
      </div>

      <div className="space-y-6">
        {processData.map((group) => {
          const visibleProcesses = group.processes.slice(0, visibleCount)
          return (
          <div key={group.name} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{group.name}</h2>
              <span className="text-sm text-muted-foreground">{group.processes.length} processes</span>
            </div>

            <div className="space-y-2">
              {visibleProcesses.map((process) => {
                const isExpanded = expandedProcesses.has(process.id)

                return (
                  <div key={process.id} className="border rounded-lg">
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

                    {isExpanded && (
                      <div className="border-t bg-muted/30 p-4 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold text-sm text-foreground">Stages</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => { setAddingStageForProcess(process.id); setEditingStageId(null) }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Stage
                          </Button>
                        </div>

                        {process.stages.length === 0 && addingStageForProcess !== process.id && (
                          <p className="text-sm text-muted-foreground text-center py-4">No stages yet. Click &quot;Add Stage&quot; to create one.</p>
                        )}

                        <div className="space-y-2">
                          {process.stages.map((stage, idx) => (
                            <div
                              key={stage.id}
                              draggable={editingStageId !== stage.id}
                              onDragStart={() => handleDragStart(process.id, idx)}
                              onDragEnter={() => handleDragEnter(idx)}
                              onDragEnd={() => handleDragEnd(process.id, process.stages)}
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
                                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(process.id, process.stages); if (e.key === "Escape") cancelEdit() }}
                                  />
                                  <Button size="sm" variant="ghost" className="text-xs" onClick={cancelEdit}>Cancel</Button>
                                  <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => saveEdit(process.id, process.stages)}>Save</Button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
                                    <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                                      {idx + 1}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/settings/manage-processes/${process.id}/${stage.id}`)
                                      }}
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
                                      <DropdownMenuItem onClick={() => deleteStage(process.id, stage.id, process.stages)} className="text-red-600 focus:text-red-600">
                                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                            </div>
                          ))}

                          {addingStageForProcess === process.id && (
                            <div className="flex items-center gap-3 p-3 bg-background border rounded border-blue-300">
                              <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                                {process.stages.length + 1}
                              </div>
                              <Input
                                value={newStageName}
                                onChange={(e) => setNewStageName(e.target.value)}
                                placeholder="Stage name"
                                className="h-8 text-sm flex-1"
                                autoFocus
                                onKeyDown={(e) => { if (e.key === "Enter") addStage(process.id, process.stages); if (e.key === "Escape") setAddingStageForProcess(null) }}
                              />
                              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setAddingStageForProcess(null)}>Cancel</Button>
                              <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => addStage(process.id, process.stages)}>Save</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )})}
      </div>

      {/* Add Process Type Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Process Type</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Process Type Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-blue-600">Process Type Name *</Label>
              <Input
                value={newProcessTypeName}
                onChange={(e) => setNewProcessTypeName(e.target.value)}
              />
            </div>

            {/* Item Name — dynamic: prefix from category + merge tag */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-blue-600">Item Name</Label>
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex items-center h-9 px-3 border border-input rounded-md bg-muted/30 text-sm">
                  <span className="text-muted-foreground shrink-0">{newCategoryPrefix} for&nbsp;</span>
                  <span className="text-foreground font-medium">{newMergeTag}</span>
                </div>
                <MergeTagPicker onSelect={handleSelectNewMergeTag} />
              </div>
              <p className="text-xs text-muted-foreground">
                The name of individual processes in this process type. Use the{" "}
                <Code className="inline h-3 w-3" /> button to select a merge tag. The prefix updates
                automatically based on the category.
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-blue-600">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Categories are used to provide you with contextual information about how to make
                better use of your process types. We'll try to infer the best category for you, but
                you can also choose a different category and override our choice.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={saveNewProcessType}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newProcessTypeName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LoadMorePagination
        total={totalProcesses}
        visibleCount={visibleCount}
        label="processes"
        onLoadMore={() =>
          setVisibleCount((prev) => Math.min(prev + 10, totalProcesses))
        }
      />
    </div>
  )
}
