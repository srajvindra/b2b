"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckSquare,
  AlertCircle,
  Clock,
  Eye,
  StickyNote,
  Check,
  Workflow,
  Plus,
  Search,
  ChevronsUpDown,
  MoreVertical,
  TriangleAlert,
  MessageSquare,
  Mail,
  Phone,
  Users,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import type { Communication, Task, TaskSummary } from "../types"
import { AddTaskDialog } from "../../../components/shared/AddTaskDialog"
import { EscalateDialog } from "../../../components/shared/EscalateDialog"
import { CommunicationModal } from "./CommunicationModal"


function getPriorityStyles(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200"
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Skipped":
      return "bg-purple-50 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100"
    default:
      return "bg-gray-50 text-gray-600 border-gray-200"
  }
}

export interface StaffMember {
  id: number
  name: string
  role: string
}

const RISK_OPTIONS = [
  { value: "Revenue", label: "Revenue" },
  { value: "SLA Breach", label: "SLA Breach" },
  { value: "Operational", label: "Operational" },
  { value: "Legal", label: "Legal" },
  // { value: "Org Task", label: "Org Task" },
] as const

interface TasksCardProps {
  filteredTasks: Task[]
  taskSummary: TaskSummary
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedStaff: string | null
  staffMembers: StaffMember[]
  onAssignTask: (taskId: number, staffName: string) => void
  onUpdateRisk: (taskId: number, risk: string) => void
  onEscalateTask: (taskId: number, staffName: string) => void
  onUpdateNote: (taskId: number, note: string) => void
  onAddTask?: (task: Task) => void
  escalatedToStaffMembers: StaffMember[]
  escalatedTo: Record<number, string>
  processRoute?: {
    basePath: string
    categoryId?: string
    leadId?: string
  }
  maxHeight?: string
}

export function TasksCard({
  filteredTasks,
  taskSummary,
  searchQuery,
  setSearchQuery,
  selectedStaff,
  staffMembers,
  onAssignTask,
  onUpdateRisk,
  onEscalateTask,
  onUpdateNote,
  onAddTask,
  escalatedToStaffMembers,
  escalatedTo,
  processRoute,
  maxHeight = "260px",
}: TasksCardProps) {
  const router = useRouter()
  const [showSkippedModal, setShowSkippedModal] = useState(false)
  const [selectedSkippedTask, setSelectedSkippedTask] = useState<{
    title: string
    skippedComment: string
  } | null>(null)
  const [assignPopoverOpen, setAssignPopoverOpen] = useState<number | null>(null)
  const [riskPopoverOpen, setRiskPopoverOpen] = useState<number | null>(null)
  const [escalatedToPopoverOpen, setEscalatedToPopoverOpen] = useState<number | null>(null)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteTask, setNoteTask] = useState<Task | null>(null)
  const [noteText, setNoteText] = useState("")
  const [escalateModalOpen, setEscalateModalOpen] = useState(false)
  const [escalateTask, setEscalateTask] = useState<Task | null>(null)
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null)

  const openAutoCreatedCommunication = (task: Task) => {
    // Auto-created items represent inbound/outbound comms (email/call/sms).
    // Map task -> CommunicationModal input shape.
    const commType: Communication["type"] =
      task.type === "sms" ? "text" : (task.type as Communication["type"])

    setSelectedCommunication({
      id: task.id,
      from: task.entity || task.title,
      type: commType,
      preview: task.title,
      fullMessage: task.notes || task.title,
      timestamp: task.dueDate,
      read: true,
      responded: false,
      receivedAt: new Date(`${task.dueDate}T12:00:00`),
      assignedTo: task.assignedTo || "—",
    })
    setShowModal(true)
  }
  const handleTaskClick = (task: Task) => {
    if (task.entityType === "tenant") router.push("/contacts/tenants")
    else if (task.entityType === "owner") router.push("/contacts/owners")
    else if (task.entityType === "property") router.push("/properties")
    else if (task.entityType === "lease") router.push("/operations/projects")
    else if (task.entityType === "lead") router.push("/leads/owners")
    else if (task.entityType === "prospectOwner") router.push("/leads/owners")
    else if (task.entityType === "leaseProspect") router.push("/leads/tenants")
  }

  const handleProcessClick = (task: Task) => {
    if (!processRoute) return
    const { basePath, categoryId, leadId } = processRoute
    if (basePath === 'leads/owner-prospects') {
      router.push(`/leads/owner-prospects/${categoryId}/lead/${leadId}/process/proc-1`)
    }
    else if (basePath === 'leads/lease-prospects') {
      router.push(`/leads/lease-prospects/${categoryId}/lead/${leadId}/process/proc-1`)
    }
    else if (basePath === 'contacts/owners') {
      router.push(`/contacts/owners/${leadId}/process/proc-1`)
    }
    else if (basePath === 'contacts/tenants') {
      router.push(`/contacts/tenants/${leadId}/process/proc-1`)
    }
    else if (basePath === 'properties') {
      router.push(`/properties/${leadId}/process/proc-1`)
    }
    else if (basePath === 'properties/unit') {
      router.push(`/properties/${categoryId}/unit/${leadId}/process/proc-1`)
    }
    else {
      router.push(`/dashboard/process/proc-1`)
    }
  }

  const getRiskStyles = (risk: string) => {
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
  const handleSkippedClick = (task: Task) => {
    if (task.status === "Skipped" && task.skippedComment) {
      setSelectedSkippedTask({
        title: task.title,
        skippedComment: task.skippedComment,
      })
      setShowSkippedModal(true)
    }
  }

  // ----- Column filters (same pattern as Combined) -----
  const [contractFilterOpen, setContractFilterOpen] = useState(false)
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [contractFilterSearch, setContractFilterSearch] = useState("")

  const [riskColumnFilterOpen, setRiskColumnFilterOpen] = useState(false)
  const [selectedRiskFilters, setSelectedRiskFilters] = useState<string[]>([])

  const [dueDateFilterOpen, setDueDateFilterOpen] = useState(false)
  const [dueDateFrom, setDueDateFrom] = useState("")
  const [dueDateTo, setDueDateTo] = useState("")

  const [assignedToFilterOpen, setAssignedToFilterOpen] = useState(false)
  const [selectedAssignedToFilters, setSelectedAssignedToFilters] = useState<string[]>([])
  const [assignedToFilterSearch, setAssignedToFilterSearch] = useState("")

  const [escalatedToFilterOpen, setEscalatedToFilterOpen] = useState(false)
  const [selectedEscalatedToFilters, setSelectedEscalatedToFilters] = useState<string[]>([])
  const [escalatedToFilterSearch, setEscalatedToFilterSearch] = useState("")
  const [taskTypeFilter, setTaskTypeFilter] = useState<"open" | "overdue">("open")

  const uniqueContracts = useMemo(() => {
    return Array.from(new Set(filteredTasks.map((t) => t.entity))).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [filteredTasks])

  const uniqueAssignedTo = useMemo(() => {
    return Array.from(new Set(filteredTasks.map((t) => t.assignedTo))).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [filteredTasks])

  const uniqueEscalatedTo = useMemo(() => {
    return Array.from(new Set(filteredTasks.map((t) => t.escalatedTo).filter(Boolean))).sort((a, b) => a.localeCompare(b))
  }, [filteredTasks])

  const toggleContract = (value: string) => {
    setSelectedContracts((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }
  const toggleRiskFilter = (value: string) => {
    setSelectedRiskFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }
  const toggleAssignedToFilter = (value: string) => {
    setSelectedAssignedToFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }
  const toggleEscalatedToFilter = (value: string) => {
    setSelectedEscalatedToFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const clearContractFilter = () => {
    setSelectedContracts([])
    setContractFilterSearch("")
  }
  const clearRiskFilter = () => setSelectedRiskFilters([])
  const clearDueDateFilter = () => {
    setDueDateFrom("")
    setDueDateTo("")
  }
  const clearAssignedToFilter = () => {
    setSelectedAssignedToFilters([])
    setAssignedToFilterSearch("")
  }
  const clearEscalatedToFilter = () => {
    setSelectedEscalatedToFilters([])
    setEscalatedToFilterSearch("")
  }

  const baseVisibleTasks = useMemo(() => {
    return filteredTasks.filter((t) => {
      if (selectedContracts.length > 0 && !selectedContracts.includes(t.entity)) return false

      if (selectedRiskFilters.length > 0 && !selectedRiskFilters.includes(t.risk)) return false

      if (dueDateFrom && t.dueDate < dueDateFrom) return false
      if (dueDateTo && t.dueDate > dueDateTo) return false

      if (selectedAssignedToFilters.length > 0 && !selectedAssignedToFilters.includes(t.assignedTo)) return false

      const escalatedToValue = t.escalatedTo || ""
      if (selectedEscalatedToFilters.length > 0 && !selectedEscalatedToFilters.includes(escalatedToValue)) return false

      return true
    })
  }, [
    filteredTasks,
    dueDateFrom,
    dueDateTo,
    selectedAssignedToFilters,
    selectedContracts,
    selectedEscalatedToFilters,
    selectedRiskFilters,
  ])

  const summary = useMemo(() => {
    const open = baseVisibleTasks.filter((t) => t.status !== "Completed" && t.status !== "Skipped").length
    const overdue = baseVisibleTasks.filter((t) => t.overdue).length
    const dueToday = taskSummary.dueToday

    return { open, overdue, dueToday }
  }, [baseVisibleTasks, taskSummary.dueToday])

  const visibleTasks = useMemo(() => {
    return baseVisibleTasks.filter((t) => {
      if (taskTypeFilter === "open") return t.status !== "Completed" && t.status !== "Skipped"
      if (taskTypeFilter === "overdue") return t.overdue
      return t.status !== "Completed" && t.status !== "Skipped"
    })
  }, [baseVisibleTasks, taskTypeFilter])

  const isOpenSelected = taskTypeFilter === "open"
  const isOverdueSelected = taskTypeFilter === "overdue"


  function formatDateTime(value: Date) {
    return new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      month: "short",
    }).format(value)
  }
  return (
    <>
      <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded">
                  <CheckSquare className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Tasks
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${isOpenSelected
                    ? "bg-teal-600 border-teal-600"
                    : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  onClick={() => setTaskTypeFilter("open")}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOpenSelected ? "bg-teal-500" : "bg-slate-100"}`}>
                    <CheckSquare className={`h-4.5 w-4.5 ${isOpenSelected ? "text-white" : "text-slate-600"}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-lg font-bold leading-none ${isOpenSelected ? "text-white" : "text-slate-900"}`}>
                      {summary.open}
                    </span>
                    <span className={`text-[11px] uppercase tracking-wide font-medium ${isOpenSelected ? "text-teal-100" : "text-slate-500"}`}>
                      Open
                    </span>
                  </div>
                </button>
                {summary.overdue > 0 && (
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${isOverdueSelected
                      ? "bg-teal-600 border-teal-600"
                      : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    onClick={() => setTaskTypeFilter("overdue")}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOverdueSelected ? "bg-teal-500" : "bg-slate-100"}`}>
                      <AlertCircle className={`h-4.5 w-4.5 ${isOverdueSelected ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${isOverdueSelected ? "text-white" : "text-slate-900"}`}>
                        {summary.overdue}
                      </span>
                      <span className={`text-[11px] uppercase tracking-wide font-medium ${isOverdueSelected ? "text-teal-100" : "text-slate-500"}`}>
                        Overdue
                      </span>
                    </div>
                  </button>
                )}
                {summary.dueToday > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Clock className="h-4.5 w-4.5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-slate-900 leading-none">
                        {summary.dueToday}
                      </span>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">
                        Today
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button
              size="sm"
              className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => setAddTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </Button>
          </div>
          <div className="relative flex items-center justify-between">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by task..."
              className="h-9 w-full border-slate-200 bg-white pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="w-full overflow-x-auto">
              {/* Single horizontal scroll container; vertical scroll lives here (header is sticky) */}
              <div className="min-w-full overflow-y-auto" style={{ maxHeight }}>
                <table className="min-w-full w-full caption-bottom text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-slate-50">
                    <TableRow className="border-b bg-slate-50">
                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap">
                        <Popover open={contractFilterOpen} onOpenChange={setContractFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100"
                            >
                              <span>Contact</span>
                              <Filter
                                className={`h-3 w-3 ${selectedContracts.length > 0 ? "text-teal-600" : "text-slate-400"}`}
                              />
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={clearContractFilter}
                                disabled={selectedContracts.length === 0}
                              >
                                Clear
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => setContractFilterOpen(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-10 px-2 text-left align-middle font-medium text-slate-700 whitespace-nowrap">
                        Task
                      </TableHead>



                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap">
                        <Popover open={assignedToFilterOpen} onOpenChange={setAssignedToFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100"
                            >
                              <span>Assigned To</span>
                              <Filter
                                className={`h-3 w-3 ${selectedAssignedToFilters.length > 0 ? "text-teal-600" : "text-slate-400"}`}
                              />
                              {selectedAssignedToFilters.length > 0 && (
                                <span className="ml-1 text-[10px] rounded-full bg-teal-50 text-teal-700 px-1.5 py-0.5 border border-teal-200">
                                  {selectedAssignedToFilters.length}
                                </span>
                              )}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2" align="start">
                            <div className="mb-2">
                              <Input
                                placeholder="Search staff..."
                                value={assignedToFilterSearch}
                                onChange={(e) => setAssignedToFilterSearch(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {uniqueAssignedTo
                                .filter((n) => n.toLowerCase().includes(assignedToFilterSearch.toLowerCase()))
                                .map((name) => (
                                  <label
                                    key={name}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                                  >
                                    <Checkbox
                                      checked={selectedAssignedToFilters.includes(name)}
                                      onCheckedChange={() => toggleAssignedToFilter(name)}
                                    />
                                    <span className="truncate">{name}</span>
                                  </label>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={clearAssignedToFilter}
                                disabled={selectedAssignedToFilters.length === 0}
                              >
                                Clear
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => setAssignedToFilterOpen(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap">
                        <Popover open={riskColumnFilterOpen} onOpenChange={setRiskColumnFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100"
                            >
                              <span>Risk</span>
                              <Filter
                                className={`h-3 w-3 ${selectedRiskFilters.length > 0 ? "text-teal-600" : "text-slate-400"}`}
                              />
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={clearRiskFilter}
                                disabled={selectedRiskFilters.length === 0}
                              >
                                Clear
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => setRiskColumnFilterOpen(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>

                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap">
                        <Popover open={dueDateFilterOpen} onOpenChange={setDueDateFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100"
                            >
                              <span>SLA Due Date</span>
                              <Filter
                                className={`h-3 w-3 ${(dueDateFrom || dueDateTo) ? "text-teal-600" : "text-slate-400"}`}
                              />
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
                      </TableHead>

                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap">
                        <Popover open={escalatedToFilterOpen} onOpenChange={setEscalatedToFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100"
                            >
                              <span>Escalated To</span>
                              <Filter
                                className={`h-3 w-3 ${selectedEscalatedToFilters.length > 0 ? "text-teal-600" : "text-slate-400"}`}
                              />
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
                                placeholder="Search staff..."
                                value={escalatedToFilterSearch}
                                onChange={(e) => setEscalatedToFilterSearch(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {uniqueEscalatedTo
                                .filter((n) => n.toLowerCase().includes(escalatedToFilterSearch.toLowerCase()))
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={clearEscalatedToFilter}
                                disabled={selectedEscalatedToFilters.length === 0}
                              >
                                Clear
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => setEscalatedToFilterOpen(false)}
                              >
                                Close
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-10 px-2 text-right align-middle font-medium text-slate-700 whitespace-nowrap">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {visibleTasks.length > 0 ? (
                      visibleTasks.map((task) => {
                        const taskEscalatedToNameFromValue = task.escalatedTo?.includes(" (")
                          ? task.escalatedTo.split(" (")[0]
                          : (task.escalatedTo ?? "")
                        const taskEscalatedStaff =
                          escalatedToStaffMembers.find((staff) => staff.name === taskEscalatedToNameFromValue) ??
                          escalatedToStaffMembers.find(
                            (staff) => `${staff.name} (${staff.role})` === (task.escalatedTo ?? ""),
                          )
                        const taskEscalatedToName = taskEscalatedStaff?.name ?? taskEscalatedToNameFromValue
                        const taskEscalatedToRole =
                          taskEscalatedStaff?.role ??
                          (task.escalatedTo?.match(/\(([^)]+)\)/)?.[1] ?? task.escalatedToRole ?? "")
                        return (
                          <TableRow key={task.id} className="hover:bg-slate-50">
                            <TableCell className="py-3 overflow-hidden">
                              <div className="flex items-center gap-2">
                                <div
                                  className="p-2 rounded-full relative shrink-0"
                                  style={{
                                    backgroundColor: task.type === "email" ? "#c8e6cc" : task.type === "call" ? "#b3e8e5" : "#BBDEFB",
                                  }}
                                >
                                  {task.type === "email" ? (
                                    <Mail className="h-4 w-4 text-green-800" />
                                  ) : task.type === "call" ? (
                                    <Phone className="h-4 w-4 text-teal-800" />
                                  ) : task.type === "sms" ? (
                                    <MessageSquare className="h-4 w-4 text-blue-800" />
                                  ) : (
                                    <CheckSquare className="h-4 w-4 text-blue-800" />
                                  )}
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="text-sm font-medium truncate text-slate-800">{task.entityTitle}</span>
                                  <span className="text-sm text-slate-500">({task.entity})</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 overflow-hidden">
                              <div
                                className="flex flex-col gap-0.5 min-w-0 cursor-pointer"
                                onClick={() => {
                                  if (task.autoCreated) openAutoCreatedCommunication(task)
                                }}
                              >
                                <span
                                  className="block max-w-[260px] text-sm font-medium truncate text-slate-800"
                                  title={task.title}
                                >
                                  {task.title}
                                </span>
                                <div className="flex items-center gap-1">
                                  {task.processName && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        handleProcessClick(task)
                                      }}
                                      className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 hover:underline w-fit"
                                    >
                                      <Workflow className="h-3 w-3" />
                                      {task.processName}
                                    </button>
                                  )}
                                  {task.autoCreated && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                                      Auto-created
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1 text-[12px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit">{formatDateTime(new Date(task.dueDate))}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 overflow-hidden">
                              <Popover
                                open={assignPopoverOpen === task.id}
                                onOpenChange={(open) =>
                                  setAssignPopoverOpen(open ? task.id : null)
                                }
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700 w-full text-left"
                                  >
                                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                      {(() => {
                                        const [firstName, lastName] = task.assignedTo.split(" ");
                                        return (firstName?.[0] ?? "") + (lastName?.[0] ?? "");
                                      })()}
                                    </div>
                                    <span className="whitespace-nowrap overflow-hidden">{task.assignedTo}</span>
                                    <ChevronsUpDown className="h-3 w-3 text-slate-400 shrink-0 ml-auto" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-[220px] p-0"
                                  align="start"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Command>
                                    <CommandInput placeholder="Search staff..." />
                                    <CommandList>
                                      <CommandEmpty>No staff found.</CommandEmpty>
                                      <CommandGroup>
                                        {staffMembers.map((staff) => (
                                          <CommandItem
                                            key={staff.id}
                                            value={staff.name}
                                            onSelect={() => {
                                              onAssignTask(task.id, staff.name)
                                              setAssignPopoverOpen(null)
                                            }}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                              {(() => {
                                                const [firstName, lastName] = staff.name.split(" ");
                                                return (firstName?.[0] ?? "") + (lastName?.[0] ?? "");
                                              })()}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-sm text-slate-900">
                                                {staff.name}
                                              </span>
                                              <span className="text-[11px] text-slate-500">
                                                {staff.role}
                                              </span>
                                            </div>
                                            {task.assignedTo === staff.name && (
                                              <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                                            )}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              <Popover
                                open={riskPopoverOpen === task.id}
                                onOpenChange={(open) =>
                                  setRiskPopoverOpen(open ? task.id : null)
                                }
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-left"
                                  >
                                    <Badge
                                      variant="outline"
                                      className={`text-xs font-medium capitalize ${getRiskStyles(task.risk)}`}
                                    >
                                      {task.risk}
                                      <ChevronsUpDown className="h-3 w-3 ml-1 opacity-50" />
                                    </Badge>
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-[180px] p-0"
                                  align="start"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Command>
                                    <CommandInput placeholder="Search risk..." />
                                    <CommandList>
                                      <CommandEmpty>No risk found.</CommandEmpty>
                                      <CommandGroup>
                                        {RISK_OPTIONS.map((option) => (
                                          <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => {
                                              onUpdateRisk(task.id, option.value)
                                              setRiskPopoverOpen(null)
                                            }}
                                            className="flex items-center gap-2"
                                          >
                                            <Badge
                                              variant="outline"
                                              className={`text-xs font-medium ${getRiskStyles(option.value)}`}
                                            >
                                              {option.label}
                                            </Badge>
                                            {task.risk === option.value && (
                                              <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                                            )}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-sm ${task.overdue
                                  ? "text-red-600 font-medium"
                                  : "text-slate-600"
                                  }`}
                              >
                                {task.dueDate && new Intl.DateTimeFormat('en-US', {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }).format(new Date(task.dueDate))}
                                {task.overdue && (
                                  <span className="ml-1.5 text-xs text-red-500">
                                    (Overdue)
                                  </span>
                                )}
                              </span>
                            </TableCell>
                            {/* <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium capitalize ${getPriorityStyles(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </TableCell> */}
                            {/* <TableCell>
                          {task.status === "Skipped" ? (
                            <button
                              type="button"
                              onClick={() => handleSkippedClick(task)}
                              className="inline-flex"
                            >
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${getStatusStyles(task.status)}`}
                              >
                                {task.status}
                              </Badge>
                            </button>
                          ) : (
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${getStatusStyles(task.status)}`}
                            >
                              {task.status}
                            </Badge>
                          )}
                        </TableCell> */}
                            <TableCell className="text-sm text-slate-600 overflow-hidden">
                              <Popover
                                open={escalatedToPopoverOpen === task.id}
                                onOpenChange={(open) =>
                                  setEscalatedToPopoverOpen(open ? task.id : null)
                                }
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700 w-full text-left"
                                  >
                                    {task.escalatedTo ? (
                                      <>
                                        {/* <TriangleAlert className="h-4 w-4 text-amber-500 shrink-0" /> */}
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                          {(() => {
                                            const [firstName, lastName] = taskEscalatedToName.split(" ");
                                            return (firstName?.[0] ?? "") + (lastName?.[0] ?? "");
                                          })()}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">{taskEscalatedToName}</span>
                                          {task.escalatedToRole && (
                                            <span className="text-[11px] text-slate-500 truncate">
                                              ({taskEscalatedToRole})
                                            </span>
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <TriangleAlert className="h-4 w-4 text-slate-300 shrink-0" />
                                        <span className="text-slate-400">None</span>
                                      </>
                                    )}
                                    <ChevronsUpDown className="h-3 w-3 text-slate-400 shrink-0 ml-auto" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-[220px] p-0"
                                  align="start"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Command>
                                    <CommandInput placeholder="Search staff..." />
                                    <CommandList>
                                      <CommandEmpty>No staff found.</CommandEmpty>
                                      <CommandGroup>
                                        {escalatedToStaffMembers.map((staff) => {
                                          const displayValue = `${staff.name} (${staff.role})`
                                          const isSelected = task.escalatedTo === displayValue || task.escalatedTo === staff.name
                                          return (
                                            <CommandItem
                                              key={staff.id}
                                              value={staff.name}
                                              onSelect={() => {
                                                onEscalateTask(task.id, displayValue)
                                                setEscalatedToPopoverOpen(null)
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                                {(() => {
                                                  const [firstName, lastName] = staff.name.split(" ");
                                                  return (firstName?.[0] ?? "") + (lastName?.[0] ?? "");
                                                })()}
                                              </div>
                                              <div className="flex flex-col">
                                                <span className="text-sm text-slate-900">
                                                  {staff.name}
                                                </span>
                                                <span className="text-[11px] text-slate-500">
                                                  {staff.role}
                                                </span>
                                              </div>
                                              {isSelected && (
                                                <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                                              )}
                                            </CommandItem>
                                          )
                                        })}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleTaskClick(task)
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setNoteTask(task)
                                      setNoteText(task.notes || "")
                                      setNoteModalOpen(true)
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <StickyNote className={`h-4 w-4 ${task.notes ? "text-teal-600" : ""}`} />
                                    {task.notes ? "Edit Note" : "Add Note"}
                                  </DropdownMenuItem>
                                  {task.status !== "Completed" && (
                                    <DropdownMenuItem
                                      onClick={(e) => e.stopPropagation()}
                                      className="gap-2 cursor-pointer"
                                    >
                                      <Check className="h-4 w-4" />
                                      Complete
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEscalateTask(task)
                                      setEscalateModalOpen(true)
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <TriangleAlert className={`h-4 w-4 ${task.escalatedTo ? "text-amber-500" : ""}`} />
                                    Escalate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          No tasks found
                          {selectedStaff ? ` for ${selectedStaff}` : ""}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {onAddTask && (
        <AddTaskDialog
          open={addTaskOpen}
          onOpenChange={setAddTaskOpen}
          staffMembers={staffMembers}
          defaultAssignee={selectedStaff}
          onAddTask={onAddTask}
        />
      )
      }

      <Dialog open={showSkippedModal} onOpenChange={setShowSkippedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSkippedTask?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {selectedSkippedTask?.skippedComment}
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-slate-600" />
              {noteTask?.notes ? "Edit Note" : "Add Note"}
            </DialogTitle>
            {noteTask && (
              <p className="text-sm text-slate-500 mt-1">{noteTask.title}</p>
            )}
          </DialogHeader>
          <Textarea
            placeholder="Write a note for this task..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                if (noteTask) {
                  onUpdateNote(noteTask.id, noteText)
                }
                setNoteModalOpen(false)
              }}
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EscalateDialog
        open={escalateModalOpen}
        onOpenChange={(open) => {
          setEscalateModalOpen(open)
          if (!open) setEscalateTask(null)
        }}
        title="Escalate Task"
        subtitle={escalateTask?.title}
        staffMembers={escalatedToStaffMembers}
        value={escalateTask ? (escalatedTo[escalateTask.id] || escalateTask.escalatedTo || "") : ""}
        onConfirm={(staffName) => {
          if (escalateTask) onEscalateTask(escalateTask.id, staffName)
          setEscalateModalOpen(false)
        }}
      />
      <CommunicationModal
        communication={selectedCommunication}
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open)
          if (!open) setSelectedCommunication(null)
        }}
      />
    </>
  )
}
