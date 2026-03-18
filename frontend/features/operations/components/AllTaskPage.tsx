"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckSquare,
  Workflow,
  Eye,
  Edit,
  Check,
  Search,
  Filter,
  Plus,
  X,
  ChevronsUpDown,
  MoreVertical,
  StickyNote,
  TriangleAlert,
  Upload,
  FileIcon,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react"
import { getTasks } from "@/features/contacts/data/ownerDetailData"
import type { OwnerTask } from "@/features/contacts/types"
import { useRouter } from "next/navigation"
import { CommunicationModal } from "@/features/dashboard/components/CommunicationModal"
import type { Communication } from "@/features/dashboard/types"

type EntityType = "Tenant" | "Owner" | "Prospect Owner" | "Lease Prospect" | "Property"

const ENTITY_OPTIONS: EntityType[] = ["Tenant", "Owner", "Prospect Owner", "Lease Prospect", "Property"]

const STAFF_MEMBERS = [
  { id: 1, name: "Nina Patel", role: "Leasing Manager" },
  { id: 2, name: "Richard Surovi", role: "Property Manager" },
  { id: 3, name: "Mike Johnson", role: "Maintenance Tech" },
  { id: 4, name: "Sarah Chen", role: "Leasing Agent" },
  { id: 5, name: "David Wilson", role: "Operations Manager" },
]

const ESCALATION_STAFF = [
  { id: 1, name: "David Wilson", role: "CSM" },
  { id: 2, name: "Oliver Torres", role: "VP" },
  { id: 3, name: "Taylor Johnson", role: "GM" },
  { id: 4, name: "Kimberly Johnson", role: "Executive/MD" },
  { id: 5, name: "David Kim", role: "CSM" },
]

const RISK_OPTIONS = [
  { value: "Revenue", label: "Revenue" },
  { value: "SLA Breach", label: "SLA Breach" },
  { value: "Operational", label: "Operational" },
  { value: "Legal", label: "Legal" },
] as const

function getRiskStyles(risk: string) {
  switch (risk) {
    case "Revenue":
      return "bg-[#FCE7F3] text-[#BE185D] border-[#F9A8D4]"
    case "SLA Breach":
      return "bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]"
    case "Operational":
      return "bg-[#DCFCE7] text-[#166534] border-[#86EFAC]"
    case "Legal":
      return "bg-[#EDE9FE] text-[#5B21B6] border-[#C4B5FD]"
    default:
      return "bg-[#F5F0EB] text-[#78594A] border-[#D6C4B6]"
  }
}

const getStatusBadgeStyle = (status: OwnerTask["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Skipped":
      return "bg-orange-100 text-orange-700 border-orange-200"
    case "Pending":
      return "bg-gray-100 text-gray-700 border-gray-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getPriorityBadgeStyle = (priority: OwnerTask["priority"]) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 border-red-200"
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export function AllTaskPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<OwnerTask[]>(getTasks())
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)

  // Column filter state
  const [entityFilterOpen, setEntityFilterOpen] = useState(false)
  const [dueDateFilterOpen, setDueDateFilterOpen] = useState(false)
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(false)
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [assigneeFilterOpen, setAssigneeFilterOpen] = useState(false)

  const [selectedEntities, setSelectedEntities] = useState<EntityType[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<OwnerTask["priority"][]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<OwnerTask["status"][]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])

  const [entityFilterSearch, setEntityFilterSearch] = useState("")
  const [assigneeFilterSearch, setAssigneeFilterSearch] = useState("")
  const [dueDateFrom, setDueDateFrom] = useState("")
  const [dueDateTo, setDueDateTo] = useState("")

  const [activeTab, setActiveTab] = useState<"escalated" | "all">("escalated")

  const [contractFilterOpen, setContractFilterOpen] = useState(false)
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [contractFilterSearch, setContractFilterSearch] = useState("")

  const [riskColumnFilterOpen, setRiskColumnFilterOpen] = useState(false)
  const [selectedRiskFilters, setSelectedRiskFilters] = useState<string[]>([])

  const [assignedToFilterOpen, setAssignedToFilterOpen] = useState(false)
  const [assignedToFilterSearch, setAssignedToFilterSearch] = useState("")

  const [escalatedToFilterOpen, setEscalatedToFilterOpen] = useState(false)
  const [selectedEscalatedToFilters, setSelectedEscalatedToFilters] = useState<string[]>([])
  const [escalatedToFilterSearch, setEscalatedToFilterSearch] = useState("")

  const [riskOverrides, setRiskOverrides] = useState<Record<string, string>>({})
  const [assignOverrides, setAssignOverrides] = useState<Record<string, string>>({})
  const [noteOverrides, setNoteOverrides] = useState<Record<string, string>>({})

  const [riskPopoverOpen, setRiskPopoverOpen] = useState<string | null>(null)
  const [assignPopoverOpen, setAssignPopoverOpen] = useState<string | null>(null)
  const [escalatePopoverOpen, setEscalatePopoverOpen] = useState<string | null>(null)

  const [noteDialogOpen, setNoteDialogOpen] = useState(false)
  const [noteDialogTaskId, setNoteDialogTaskId] = useState<string | null>(null)
  const [noteDialogValue, setNoteDialogValue] = useState("")

  const [viewTaskModalOpen, setViewTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<OwnerTask | null>(null)
  const [showCommModal, setShowCommModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null)

  const [taskDialogMode, setTaskDialogMode] = useState<"edit" | "add" | null>(null)
  const [taskForm, setTaskForm] = useState({
    id: "",
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    status: "Pending" as OwnerTask["status"],
    priority: "Medium" as "High" | "Medium" | "Low",
    relatedEntityType: "" as string,
    relatedEntityName: "",
  })
  const [taskDialogFiles, setTaskDialogFiles] = useState<File[]>([])
  const [dialogAssigneeOpen, setDialogAssigneeOpen] = useState(false)

  const toggleEntity = (entity: EntityType) => {
    setSelectedEntities((prev) =>
      prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity],
    )
  }

  const togglePriority = (priority: OwnerTask["priority"]) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
    )
  }

  const toggleStatus = (status: OwnerTask["status"]) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    )
  }

  const toggleAssignee = (assignee: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(assignee) ? prev.filter((a) => a !== assignee) : [...prev, assignee],
    )
  }

  const clearEntityFilter = () => {
    setSelectedEntities([])
    setEntityFilterSearch("")
  }

  const clearDueDateFilter = () => {
    setDueDateFrom("")
    setDueDateTo("")
  }

  const clearPriorityFilter = () => {
    setSelectedPriorities([])
  }

  const clearStatusFilter = () => {
    setSelectedStatuses([])
  }

  const clearAssigneeFilter = () => {
    setSelectedAssignees([])
    setAssigneeFilterSearch("")
  }

  const uniqueContracts = useMemo(() => {
    const names = new Set<string>()
    tasks.forEach((t) => {
      if (t.relatedEntityName) names.add(t.relatedEntityName)
    })
    return Array.from(names).sort()
  }, [tasks])

  const uniqueAssignees = useMemo(() => {
    const names = new Set<string>()
    tasks.forEach((t) => {
      if (t.assignee) names.add(t.assignee)
    })
    return Array.from(names).sort()
  }, [tasks])

  const uniqueEscalatedTo = useMemo(() => {
    const names = new Set<string>()
    tasks.forEach((t) => {
      if (t.escalatedTo) names.add(t.escalatedTo)
    })
    return Array.from(names).sort()
  }, [tasks])

  const toggleContract = (name: string) => {
    setSelectedContracts((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    )
  }
  const clearContractFilter = () => {
    setSelectedContracts([])
    setContractFilterSearch("")
  }

  const toggleRiskFilter = (risk: string) => {
    setSelectedRiskFilters((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk],
    )
  }
  const clearRiskFilter = () => setSelectedRiskFilters([])

  const toggleAssignedToFilter = (name: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    )
  }
  const clearAssignedToFilter = () => {
    setSelectedAssignees([])
    setAssignedToFilterSearch("")
  }

  const toggleEscalatedToFilter = (name: string) => {
    setSelectedEscalatedToFilters((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name],
    )
  }
  const clearEscalatedToFilter = () => {
    setSelectedEscalatedToFilters([])
    setEscalatedToFilterSearch("")
  }

  const parseDueDate = (value: string) => {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeTab === "escalated" && !task.escalatedTo) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          task.title.toLowerCase().includes(q) ||
          (task.processName && task.processName.toLowerCase().includes(q)) ||
          task.assignee.toLowerCase().includes(q) ||
          (task.relatedEntityName && task.relatedEntityName.toLowerCase().includes(q))
        if (!matchesSearch) return false
      }

      if (selectedEntities.length > 0) {
        if (!task.relatedEntityType || !selectedEntities.includes(task.relatedEntityType as EntityType)) {
          return false
        }
      }

      if (selectedContracts.length > 0) {
        if (!task.relatedEntityName || !selectedContracts.includes(task.relatedEntityName)) {
          return false
        }
      }

      if (selectedRiskFilters.length > 0) {
        const taskRisk = riskOverrides[task.id] || task.risk || "Operational"
        if (!selectedRiskFilters.includes(taskRisk)) return false
      }

      if (selectedPriorities.length > 0 && !selectedPriorities.includes(task.priority)) {
        return false
      }

      if (selectedStatuses.length > 0 && !selectedStatuses.includes(task.status)) {
        return false
      }

      if (selectedAssignees.length > 0) {
        const taskAssignee = assignOverrides[task.id] || task.assignee
        if (!selectedAssignees.includes(taskAssignee)) return false
      }

      if (selectedEscalatedToFilters.length > 0) {
        if (!task.escalatedTo || !selectedEscalatedToFilters.includes(task.escalatedTo)) {
          return false
        }
      }

      if (dueDateFrom || dueDateTo) {
        const taskDate = parseDueDate(task.dueDate)
        if (!taskDate) return false

        if (dueDateFrom) {
          const from = parseDueDate(dueDateFrom)
          if (from && taskDate < from) return false
        }

        if (dueDateTo) {
          const to = parseDueDate(dueDateTo)
          if (to && taskDate > to) return false
        }
      }

      return true
    })
  }, [tasks, activeTab, searchQuery, selectedEntities, selectedContracts, selectedRiskFilters, selectedPriorities, selectedStatuses, selectedAssignees, selectedEscalatedToFilters, dueDateFrom, dueDateTo, riskOverrides, assignOverrides])

  const hasActiveFilters =
    selectedEntities.length > 0 ||
    selectedContracts.length > 0 ||
    selectedRiskFilters.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedAssignees.length > 0 ||
    selectedEscalatedToFilters.length > 0 ||
    !!dueDateFrom ||
    !!dueDateTo

  // Reset visible rows when filters or search change
  useEffect(() => {
    setVisibleCount(10)
  }, [activeTab, searchQuery, selectedEntities, selectedContracts, selectedRiskFilters, selectedPriorities, selectedStatuses, selectedAssignees, selectedEscalatedToFilters, dueDateFrom, dueDateTo])

  const clearFilters = () => {
    clearEntityFilter()
    clearContractFilter()
    clearRiskFilter()
    clearDueDateFilter()
    clearPriorityFilter()
    clearStatusFilter()
    clearAssignedToFilter()
    clearEscalatedToFilter()
    setSearchQuery("")
  }

  const openAutoCreatedCommunication = (task: OwnerTask) => {
    const title = task.title?.toLowerCase?.() ?? ""
    const commType: Communication["type"] = title.includes("call")
      ? "call"
      : title.includes("email")
        ? "email"
        : "text"

    setSelectedCommunication({
      id: Number(task.id.replace(/\D/g, "")) || Date.now(),
      from: task.relatedEntityName || task.title,
      type: commType,
      preview: task.title,
      fullMessage: task.description || task.title,
      timestamp: task.dueDate,
      read: true,
      responded: false,
      receivedAt: new Date(`${task.dueDate}T12:00:00`),
      assignedTo: task.assignee || "—",
    })
    setShowCommModal(true)
  }

  const handleViewTask = (task: OwnerTask) => {
    if (task.autoCreated) {
      openAutoCreatedCommunication(task)
      return
    }
    setSelectedTask(task)
    setViewTaskModalOpen(true)
  }

  const handleEditTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setTaskForm({
      id: task.id,
      title: task.title,
      description: task.description || "",
      assignee: task.assignee,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      relatedEntityType: task.relatedEntityType || "",
      relatedEntityName: task.relatedEntityName || "",
    })
    setTaskDialogFiles([])
    setTaskDialogMode("edit")
  }

  const handleOpenAddTask = () => {
    setSelectedTask(null)
    setTaskForm({
      id: "",
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      status: "Pending",
      priority: "Medium",
      relatedEntityType: "",
      relatedEntityName: "",
    })
    setTaskDialogFiles([])
    setTaskDialogMode("add")
  }

  const handleAssignTask = (taskId: string, staffName: string) => {
    setAssignOverrides((prev) => ({ ...prev, [taskId]: staffName }))
    setAssignPopoverOpen(null)
  }

  const handleUpdateRisk = (taskId: string, risk: string) => {
    setRiskOverrides((prev) => ({ ...prev, [taskId]: risk }))
    setRiskPopoverOpen(null)
  }

  const handleEscalateTask = (taskId: string, staffName: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, escalatedTo: staffName } : task)))
    setEscalatePopoverOpen(null)
  }

  const handleOpenNote = (taskId: string) => {
    setNoteDialogTaskId(taskId)
    setNoteDialogValue(noteOverrides[taskId] || "")
    setNoteDialogOpen(true)
  }

  const handleSaveNote = () => {
    if (noteDialogTaskId) {
      setNoteOverrides((prev) => ({ ...prev, [noteDialogTaskId]: noteDialogValue }))
    }
    setNoteDialogOpen(false)
    setNoteDialogTaskId(null)
    setNoteDialogValue("")
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "Completed" as const } : task)))
  }

  const handleSaveTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)))
      setViewTaskModalOpen(false)
      setSelectedTask(null)
    }
  }

  const handleTaskDialogSave = () => {
    if (!taskForm.title.trim()) return

    if (taskDialogMode === "edit" && taskForm.id) {
      setTasks(tasks.map((t) =>
        t.id === taskForm.id
          ? {
            ...t,
            title: taskForm.title,
            description: taskForm.description,
            assignee: taskForm.assignee,
            dueDate: taskForm.dueDate,
            status: taskForm.status,
            priority: taskForm.priority,
          }
          : t,
      ))
    } else {
      const task: OwnerTask = {
        id: `t${Date.now()}`,
        title: taskForm.title,
        description: taskForm.description,
        assignee: taskForm.assignee,
        dueDate: taskForm.dueDate,
        status: "Pending",
        priority: taskForm.priority,
        risk: "Operational",
        relatedEntityType: (taskForm.relatedEntityType as OwnerTask["relatedEntityType"]) || undefined,
        relatedEntityName: taskForm.relatedEntityName || undefined,
        createdDate: new Date().toLocaleDateString(),
      }
      setTasks([...tasks, task])
    }

    setTaskDialogMode(null)
    setTaskDialogFiles([])
    setSelectedTask(null)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, assign, and manage all tasks across your properties and contracts. Use the tabs below to view escalated items or browse all tasks.
          </p>
        </div>

        <div className="">
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-1 shrink-0" onClick={handleOpenAddTask}>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "escalated" | "all")} className="w-full">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between gap-4 px-4 pt-4 border-b border-slate-200">
              <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="escalated"
                  className="gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-slate-900 data-[state=active]:font-medium"
                >
                  <TriangleAlert className="h-3.5 w-3.5" />
                  Escalated Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-slate-900 data-[state=active]:font-medium"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  All Tasks
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-4 mt-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  {activeTab === "escalated" ? (
                    <><TriangleAlert className="h-4 w-4 text-amber-600" /> Escalated Tasks ({filteredTasks.length})</>
                  ) : (
                    <><CheckSquare className="h-4 w-4 text-teal-600" /> All Tasks ({filteredTasks.length})</>
                  )}
                </h3>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground gap-1 ml-auto" onClick={clearFilters}>
                    <X className="h-3.5 w-3.5" />
                    Clear all filters
                  </Button>
                )}
              </div>

              {/* Tasks Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b sticky top-0 z-10">
                      <tr>
                        <th className="text-left text-sm font-medium text-muted-foreground p-3">Task</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-0">
                          <Popover open={contractFilterOpen} onOpenChange={setContractFilterOpen}>
                            <PopoverTrigger asChild>
                              <button className="w-full flex items-center gap-1 p-3 text-left hover:bg-gray-100">
                                <span>Contract</span>
                                <Filter className={`h-3 w-3 ${selectedContracts.length > 0 ? "text-teal-600" : "text-slate-400"}`} />
                                {selectedContracts.length > 0 && (
                                  <span className="ml-1 text-[10px] rounded-full bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-200">
                                    {selectedContracts.length}
                                  </span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="start">
                              <div className="mb-2">
                                <Input
                                  placeholder="Search contracts..."
                                  value={contractFilterSearch}
                                  onChange={(e) => setContractFilterSearch(e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {uniqueContracts
                                  .filter((c) => c.toLowerCase().includes(contractFilterSearch.toLowerCase()))
                                  .map((contract) => (
                                    <label
                                      key={contract}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                                    >
                                      <Checkbox
                                        checked={selectedContracts.includes(contract)}
                                        onCheckedChange={() => toggleContract(contract)}
                                      />
                                      <span className="truncate">{contract}</span>
                                    </label>
                                  ))}
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearContractFilter} disabled={selectedContracts.length === 0}>
                                  Clear
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setContractFilterOpen(false)}>
                                  Close
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-0">
                          <Popover open={riskColumnFilterOpen} onOpenChange={setRiskColumnFilterOpen}>
                            <PopoverTrigger asChild>
                              <button className="w-full flex items-center gap-1 p-3 text-left hover:bg-gray-100">
                                <span>Risk</span>
                                <Filter className={`h-3 w-3 ${selectedRiskFilters.length > 0 ? "text-teal-600" : "text-slate-400"}`} />
                                {selectedRiskFilters.length > 0 && (
                                  <span className="ml-1 text-[10px] rounded-full bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-200">
                                    {selectedRiskFilters.length}
                                  </span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-52 p-2" align="start">
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {RISK_OPTIONS.map((opt) => (
                                  <label
                                    key={opt.value}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                                  >
                                    <Checkbox
                                      checked={selectedRiskFilters.includes(opt.value)}
                                      onCheckedChange={() => toggleRiskFilter(opt.value)}
                                    />
                                    <Badge variant="outline" className={`text-xs ${getRiskStyles(opt.value)}`}>
                                      {opt.label}
                                    </Badge>
                                  </label>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearRiskFilter} disabled={selectedRiskFilters.length === 0}>
                                  Clear
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setRiskColumnFilterOpen(false)}>
                                  Close
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-0">
                          <Popover open={dueDateFilterOpen} onOpenChange={setDueDateFilterOpen}>
                            <PopoverTrigger asChild>
                              <button className="w-full flex items-center gap-1 p-3 text-left hover:bg-gray-100">
                                <span>SLA Due Date</span>
                                <Filter className={`h-3 w-3 ${(dueDateFrom || dueDateTo) ? "text-teal-600" : "text-slate-400"}`} />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3" align="start">
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground">Date range</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-[10px] text-muted-foreground">From</Label>
                                    <Input
                                      type="date"
                                      value={dueDateFrom}
                                      onChange={(e) => setDueDateFrom(e.target.value)}
                                      className="h-8 text-xs mt-0.5"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-muted-foreground">To</Label>
                                    <Input
                                      type="date"
                                      value={dueDateTo}
                                      onChange={(e) => setDueDateTo(e.target.value)}
                                      className="h-8 text-xs mt-0.5"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={clearDueDateFilter}
                                    disabled={!dueDateFrom && !dueDateTo}
                                  >
                                    Clear
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={() => setDueDateFilterOpen(false)}
                                  >
                                    Close
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                        {/* <th className="text-left text-xs font-medium text-muted-foreground p-0">
                      <Popover open={priorityFilterOpen} onOpenChange={setPriorityFilterOpen}>
                        <PopoverTrigger asChild>
                          <button className="w-full flex items-center gap-1 p-3 text-left hover:bg-gray-100">
                            <span>Priority</span>
                            <Filter className={`h-3 w-3 ${selectedPriorities.length > 0 ? "text-teal-600" : "text-slate-400"}`} />
                            {selectedPriorities.length > 0 && (
                              <span className="ml-1 text-[10px] rounded-full bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-200">
                                {selectedPriorities.length}
                              </span>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 p-2" align="start">
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {(["High", "Medium", "Low"] as OwnerTask["priority"][]).map((priority) => (
                              <label
                                key={priority}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                              >
                                <Checkbox
                                  checked={selectedPriorities.includes(priority)}
                                  onCheckedChange={() => togglePriority(priority)}
                                />
                                {priority}
                              </label>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={clearPriorityFilter}
                              disabled={selectedPriorities.length === 0}
                            >
                              Clear
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => setPriorityFilterOpen(false)}
                            >
                              Close
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </th> */}
                        <th className="text-left text-sm font-medium text-muted-foreground p-0">
                          <Popover open={assignedToFilterOpen} onOpenChange={setAssignedToFilterOpen}>
                            <PopoverTrigger asChild>
                              <button className="w-full flex items-center gap-1 p-3 text-left hover:bg-gray-100">
                                <span>Assigned To</span>
                                <Filter className={`h-3 w-3 ${selectedAssignees.length > 0 ? "text-teal-600" : "text-slate-400"}`} />
                                {selectedAssignees.length > 0 && (
                                  <span className="ml-1 text-[10px] rounded-full bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-200">
                                    {selectedAssignees.length}
                                  </span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="start">
                              <div className="mb-2">
                                <Input
                                  placeholder="Search assignees..."
                                  value={assignedToFilterSearch}
                                  onChange={(e) => setAssignedToFilterSearch(e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {uniqueAssignees
                                  .filter((a) => a.toLowerCase().includes(assignedToFilterSearch.toLowerCase()))
                                  .map((assignee) => (
                                    <label
                                      key={assignee}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                                    >
                                      <Checkbox
                                        checked={selectedAssignees.includes(assignee)}
                                        onCheckedChange={() => toggleAssignedToFilter(assignee)}
                                      />
                                      <span className="truncate">{assignee}</span>
                                    </label>
                                  ))}
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearAssignedToFilter} disabled={selectedAssignees.length === 0}>
                                  Clear
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setAssignedToFilterOpen(false)}>
                                  Close
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-0">
                          <Popover open={escalatedToFilterOpen} onOpenChange={setEscalatedToFilterOpen}>
                            <PopoverTrigger asChild>
                              <button className="w-full flex items-center gap-1 p-3 text-left hover:bg-gray-100">
                                <span>Escalated To</span>
                                <Filter className={`h-3 w-3 ${selectedEscalatedToFilters.length > 0 ? "text-teal-600" : "text-slate-400"}`} />
                                {selectedEscalatedToFilters.length > 0 && (
                                  <span className="ml-1 text-[10px] rounded-full bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-200">
                                    {selectedEscalatedToFilters.length}
                                  </span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="start">
                              <div className="mb-2">
                                <Input
                                  placeholder="Search escalated to..."
                                  value={escalatedToFilterSearch}
                                  onChange={(e) => setEscalatedToFilterSearch(e.target.value)}
                                  className="h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1 max-h-40 overflow-y-auto">
                                {uniqueEscalatedTo
                                  .filter((e) => e.toLowerCase().includes(escalatedToFilterSearch.toLowerCase()))
                                  .map((name) => (
                                    <label
                                      key={name}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                                    >
                                      <Checkbox
                                        checked={selectedEscalatedToFilters.includes(name)}
                                        onCheckedChange={() => toggleEscalatedToFilter(name)}
                                      />
                                      <span className="truncate">{name}</span>
                                    </label>
                                  ))}
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearEscalatedToFilter} disabled={selectedEscalatedToFilters.length === 0}>
                                  Clear
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setEscalatedToFilterOpen(false)}>
                                  Close
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTasks.slice(0, visibleCount).map((task) => {
                        const currentRisk = riskOverrides[task.id] || task.risk || "Operational"
                        const currentAssignee = assignOverrides[task.id] || task.assignee
                        const currentEscalatedTo = task.escalatedTo || ""
                        const currentNote = noteOverrides[task.id] || ""

                        return (
                          <tr key={task.id} className="">
                            {/* Task */}
                            <td className="p-3">
                              <div
                                className="flex items-start gap-2 min-w-0 cursor-pointer"
                                onClick={() => (task.autoCreated ? openAutoCreatedCommunication(task) : handleViewTask(task))}
                              >
                                <div
                                  className="p-2 rounded-full relative shrink-0"
                                  style={{
                                    backgroundColor: task.autoCreated
                                      ? (() => {
                                        const t = (task.title ?? "").toLowerCase()
                                        if (t.includes("email")) return "#c8e6cc"
                                        if (t.includes("call")) return "#b3e8e5"
                                        return "#E3F2FD"
                                      })()
                                      : "#f1f5f9",
                                  }}
                                >
                                  {task.autoCreated ? (
                                    (() => {
                                      const t = (task.title ?? "").toLowerCase()
                                      if (t.includes("email")) return <Mail className="h-4 w-4 text-green-800" />
                                      if (t.includes("call")) return <Phone className="h-4 w-4 text-teal-800" />
                                      return <MessageSquare className="h-4 w-4 text-blue-800" />
                                    })()
                                  ) : (
                                    <CheckSquare className="h-4 w-4 text-slate-600" />
                                  )}
                                </div>

                                <div className="flex flex-col gap-1 min-w-0">
                                  <span className="text-sm font-medium text-slate-800">
                                    {task.title}
                                  </span>
                                  {task.processName && (
                                    <div
                                      className="flex items-center gap-1 cursor-pointer hover:underline text-teal-600"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/operations/all-tasks/process/proc-1`)
                                      }}
                                    >
                                      <Workflow className="h-3 w-3 text-teal-600" />
                                      <span className="text-xs text-teal-600">{task.processName}</span>
                                    </div>
                                  )}
                                  {task.autoCreated && (
                                    <span className="text-xs text-muted-foreground">Auto-created</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            {/* Contract */}
                            <td className="p-3">
                              <span className="text-sm text-slate-600">
                                {task.relatedEntityName} ({task.relatedEntityType})
                              </span>
                            </td>
                            {/* Risk */}
                            <td className="p-3">
                              <Popover
                                open={riskPopoverOpen === task.id}
                                onOpenChange={(open) => setRiskPopoverOpen(open ? task.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1.5 group"
                                  >
                                    <Badge
                                      variant="outline"
                                      className={`text-xs cursor-pointer ${getRiskStyles(currentRisk)}`}
                                    >
                                      {currentRisk}
                                    </Badge>
                                    <ChevronsUpDown className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder="Search risk..." />
                                    <CommandList>
                                      <CommandEmpty>No risk found.</CommandEmpty>
                                      <CommandGroup>
                                        {RISK_OPTIONS.map((opt) => (
                                          <CommandItem
                                            key={opt.value}
                                            value={opt.value}
                                            onSelect={() => handleUpdateRisk(task.id, opt.value)}
                                            className="flex items-center gap-2"
                                          >
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getRiskStyles(opt.value)}`}
                                            >
                                              {opt.label}
                                            </Badge>
                                            {currentRisk === opt.value && (
                                              <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                                            )}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </td>
                            {/* SLA Due Date */}
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-slate-600"}`}>{task.dueDate}</span>
                                {task.isOverdue && <span className="text-xs text-red-500">(Overdue)</span>}
                              </div>
                            </td>
                            {/* Priority */}
                            {/* <td className="p-3">
                          <Badge variant="outline" className={`text-xs ${getPriorityBadgeStyle(task.priority)}`}>
                            {task.priority}
                          </Badge>
                        </td> */}
                            {/* Assigned To */}
                            <td className="p-3">
                              <Popover
                                open={assignPopoverOpen === task.id}
                                onOpenChange={(open) => setAssignPopoverOpen(open ? task.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700 w-full text-left"
                                  >
                                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                      {currentAssignee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <span className="truncate">{currentAssignee}</span>
                                    <ChevronsUpDown className="h-3 w-3 text-slate-400 shrink-0 ml-auto" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[220px] p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder="Search staff..." />
                                    <CommandList>
                                      <CommandEmpty>No staff found.</CommandEmpty>
                                      <CommandGroup>
                                        {STAFF_MEMBERS.map((staff) => (
                                          <CommandItem
                                            key={staff.id}
                                            value={staff.name}
                                            onSelect={() => handleAssignTask(task.id, staff.name)}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                              {staff.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-sm text-slate-900">{staff.name}</span>
                                              <span className="text-[10px] text-slate-500">{staff.role}</span>
                                            </div>
                                            {currentAssignee === staff.name && (
                                              <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                                            )}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </td>
                            {/* Escalated To */}
                            <td className="p-3">
                              <Popover
                                open={escalatePopoverOpen === task.id}
                                onOpenChange={(open) => setEscalatePopoverOpen(open ? task.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700 w-full text-left"
                                  >
                                    {currentEscalatedTo ? (
                                      <>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                          {currentEscalatedTo
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </div>
                                        <span className="truncate">{currentEscalatedTo}</span>
                                      </>
                                    ) : (
                                      <span className="text-slate-400">None</span>
                                    )}
                                    <ChevronsUpDown className="h-3 w-3 text-slate-400 shrink-0 ml-auto" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[220px] p-0" align="start">
                                  <Command>
                                    <CommandInput placeholder="Search staff..." />
                                    <CommandList>
                                      <CommandEmpty>No staff found.</CommandEmpty>
                                      <CommandGroup>
                                        {ESCALATION_STAFF.map((staff) => (
                                          <CommandItem
                                            key={staff.id}
                                            value={staff.name}
                                            onSelect={() => handleEscalateTask(task.id, `${staff.name} (${staff.role})`)}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                              {staff.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-sm text-slate-900">{staff.name}</span>
                                              <span className="text-[10px] text-slate-500">{staff.role}</span>
                                            </div>
                                            {currentEscalatedTo.startsWith(staff.name) && (
                                              <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                                            )}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </td>
                            {/* Actions */}
                            <td className="p-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-44">

                                  {
                                    task.processName === "" && (
                                      <DropdownMenuItem onClick={() => handleViewTask(task)} className="gap-2">
                                        <Eye className="h-3.5 w-3.5" /> View Task
                                      </DropdownMenuItem>
                                    )
                                  }
                                  <DropdownMenuItem onClick={() => handleEditTask(task)} className="gap-2">
                                    <Edit className="h-3.5 w-3.5" /> Edit Task
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenNote(task.id)} className="gap-2">
                                    <StickyNote className="h-3.5 w-3.5" /> Add Note
                                  </DropdownMenuItem>
                                  {task.status !== "Completed" && task.status !== "Skipped" && (
                                    <DropdownMenuItem onClick={() => handleMarkComplete(task.id)} className="gap-2">
                                      <Check className="h-3.5 w-3.5" /> Mark Complete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {currentNote && (
                                <div className="mt-1">
                                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                                    <StickyNote className="h-2.5 w-2.5" /> Note added
                                  </span>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      {filteredTasks.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">
                            {hasActiveFilters || searchQuery
                              ? "No tasks match your filters."
                              : "No tasks yet."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Load more pagination */}
              {filteredTasks.length > 0 && (
                <div className="flex flex-col items-center mt-3 gap-1">
                  <span className="text-xs text-muted-foreground">
                    Showing {Math.min(visibleCount, filteredTasks.length)} of {filteredTasks.length} tasks
                  </span>
                  {filteredTasks.length > visibleCount && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setVisibleCount((prev) => Math.min(prev + 10, filteredTasks.length))}
                    >
                      View More
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Tabs>

      <CommunicationModal
        communication={selectedCommunication}
        open={showCommModal}
        onOpenChange={(open) => {
          setShowCommModal(open)
          if (!open) setSelectedCommunication(null)
        }}
      />

      {/* View Task Dialog */}
      <Dialog open={viewTaskModalOpen} onOpenChange={setViewTaskModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-slate-600" />
              Task Details
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Task Title</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{selectedTask.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <p className="text-sm text-slate-600 mt-1">{selectedTask.description || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {selectedTask.assignee.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm text-slate-700">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`text-xs ${getStatusBadgeStyle(selectedTask.status)}`}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                  <p className="text-sm text-slate-700 mt-1">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`text-xs ${getPriorityBadgeStyle(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {selectedTask.relatedEntityType && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Related Entity</label>
                    <p className="text-sm text-slate-700 mt-1">
                      {selectedTask.relatedEntityType}: {selectedTask.relatedEntityName}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Escalated To</label>
                  <p className="text-sm text-slate-700 mt-1">{selectedTask.escalatedTo || "—"}</p>
                </div>
              </div>
              {selectedTask.createdDate && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Created Date</label>
                  <p className="text-sm text-slate-700 mt-1">{selectedTask.createdDate}</p>
                </div>
              )}
              {selectedTask.propertyName && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Property</label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTask.propertyName}{selectedTask.propertyAddress ? ` - ${selectedTask.propertyAddress}` : ""}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTaskModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-amber-600" />
              {noteDialogTaskId && noteOverrides[noteDialogTaskId] ? "Edit Note" : "Add Note"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your note..."
              value={noteDialogValue}
              onChange={(e) => setNoteDialogValue(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} className="bg-slate-800 hover:bg-slate-700 text-white">
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified Add/Edit Task Dialog */}
      <Dialog open={taskDialogMode !== null} onOpenChange={(open) => { if (!open) { setTaskDialogMode(null); setDialogAssigneeOpen(false) } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {taskDialogMode === "edit" ? (
                <><Edit className="h-5 w-5 text-slate-600" /> Edit Task</>
              ) : (
                <><CheckSquare className="h-5 w-5 text-teal-600" /> Add Task</>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
              <Input
                className="mt-1"
                placeholder="Enter task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea
                className="mt-1"
                placeholder="Enter task description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
              {/* {taskDialogMode === "edit" && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                  <Select
                    value={taskForm.status}
                    onValueChange={(value) => setTaskForm({ ...taskForm, status: value as OwnerTask["status"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Skipped">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )} */}
              {/* <div>
                <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) => setTaskForm({ ...taskForm, priority: value as "High" | "Medium" | "Low" })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Assignee</Label>
                <Popover open={dialogAssigneeOpen} onOpenChange={setDialogAssigneeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full mt-1 justify-between font-normal"
                    >
                      {taskForm.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                            {taskForm.assignee.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="truncate">{taskForm.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Select assignee...</span>
                      )}
                      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search staff..." />
                      <CommandList>
                        <CommandEmpty>No staff found.</CommandEmpty>
                        <CommandGroup>
                          {STAFF_MEMBERS.map((staff) => (
                            <CommandItem
                              key={staff.id}
                              value={staff.name}
                              onSelect={() => {
                                setTaskForm({ ...taskForm, assignee: staff.name })
                                setDialogAssigneeOpen(false)
                              }}
                              className="flex items-center gap-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                {staff.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-slate-900">{staff.name}</span>
                                <span className="text-[10px] text-slate-500">{staff.role}</span>
                              </div>
                              {taskForm.assignee === staff.name && (
                                <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Upload Files</Label>
              <label
                htmlFor="task-dialog-file-upload"
                className="mt-1 flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-colors"
              >
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-xs text-slate-500">Click to upload or drag & drop</span>
                <span className="text-[10px] text-slate-400">PDF, DOC, XLS, JPG, PNG up to 10MB</span>
                <input
                  id="task-dialog-file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files) {
                      setTaskDialogFiles((prev) => [...prev, ...Array.from(e.target.files!)])
                    }
                    e.target.value = ""
                  }}
                />
              </label>
              {taskDialogFiles.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {taskDialogFiles.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5">
                      <FileIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-700 truncate flex-1">{file.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                      <button
                        type="button"
                        onClick={() => setTaskDialogFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setTaskDialogMode(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleTaskDialogSave}
              disabled={!taskForm.title.trim()}
              className={taskDialogMode === "edit" ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"}
            >
              {taskDialogMode === "edit" ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
