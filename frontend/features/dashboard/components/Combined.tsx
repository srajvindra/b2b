"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  Mail,
  Phone,
  MessageSquare,
  Bell,
  Users,
  CheckSquare,
  Workflow,
  LayoutList,
  AlertCircle,
  Filter,
  X,
  ChevronsUpDown,
  Check,
  Eye,
  StickyNote,
  MoreVertical,
  TriangleAlert,
  Plus,
  Search,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Communication, Task } from "../types"
import { CommunicationModal } from "./CommunicationModal"
import { AddTaskDialog } from "../../../components/shared/AddTaskDialog"
import { EscalateDialog } from "../../../components/shared/EscalateDialog"

type StaffMember = { id: number; name: string; role: string }

export type CombinedItem =
  | { kind: "comm"; sortDate: Date; comm: Communication }
  | { kind: "task"; sortDate: Date; task: Task }

export interface CombinedProps {
  combinedItems: CombinedItem[]
  onCommunicationClick?: (comm: Communication) => void
  onTaskClick?: (task: Task) => void
  onProcessClick?: (task: Task) => void
  getPriorityStyles?: (priority: string) => string
  getStatusStyles?: (status: string) => string
  staffMembers?: StaffMember[]
  escalatedToStaffMembers?: StaffMember[]
  commEscalatedOverrides?: Record<number, string>
  onAssignTask?: (taskId: number, staffName: string) => void
  onUpdateRisk?: (taskId: number, risk: string) => void
  onEscalateTask?: (taskId: number, staffName: string) => void
  onUpdateNote?: (taskId: number, note: string) => void
  onAddTask?: (task: Task) => void
  onAssignCommunication?: (commId: number, staffName: string) => void
  onEscalateCommunication?: (commId: number, staffName: string) => void
  onUpdateCommunicationNote?: (commId: number, note: string) => void
  maxHeight?: string
}

const defaultPriorityStyles = (_priority: string) => "bg-gray-100 text-gray-700 border-gray-200"
const defaultStatusStyles = (_status: string) => "bg-gray-50 text-gray-600 border-gray-200"

const RISK_OPTIONS = [
  { value: "Revenue", label: "Revenue" },
  { value: "SLA Breach", label: "SLA Breach" },
  { value: "Operational", label: "Operational" },
  { value: "Legal", label: "Legal" },
] as const

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
  }).format(value)
}

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

export function Combined({
  combinedItems,
  onCommunicationClick,
  onTaskClick,
  onProcessClick,
  getPriorityStyles = defaultPriorityStyles,
  getStatusStyles = defaultStatusStyles,
  staffMembers = [],
  escalatedToStaffMembers = [],
  commEscalatedOverrides: commEscalatedOverridesProp,
  onAssignTask,
  onUpdateRisk,
  onEscalateTask,
  onUpdateNote,
  onAddTask,
  onAssignCommunication,
  onEscalateCommunication,
  onUpdateCommunicationNote,
  maxHeight = "250px",
}: CombinedProps) {
  /** Disambiguate task vs comm rows — they reuse numeric ids (e.g. task 5 and comm 5). */
  const [assignPopoverOpen, setAssignPopoverOpen] = useState<string | null>(null)
  const [riskPopoverOpen, setRiskPopoverOpen] = useState<string | null>(null)
  const [escalatedToPopoverOpen, setEscalatedToPopoverOpen] = useState<string | null>(null)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteTask, setNoteTask] = useState<Task | null>(null)
  const [noteText, setNoteText] = useState("")
  const [escalateModalOpen, setEscalateModalOpen] = useState(false)
  const [escalateTask, setEscalateTask] = useState<Task | null>(null)

  const [commAssignOverrides, setCommAssignOverrides] = useState<Record<number, string>>({})
  const [commEscalatedOverridesLocal, setCommEscalatedOverridesLocal] = useState<Record<number, string>>({})
  const commEscalatedOverrides = commEscalatedOverridesProp ?? commEscalatedOverridesLocal
  const applyCommEscalation = (commId: number, staffName: string) => {
    if (commEscalatedOverridesProp !== undefined) {
      onEscalateCommunication?.(commId, staffName)
    } else {
      setCommEscalatedOverridesLocal((prev) => ({ ...prev, [commId]: staffName }))
      onEscalateCommunication?.(commId, staffName)
    }
  }
  const [commNoteOverrides, setCommNoteOverrides] = useState<Record<number, string>>({})

  const [commNoteModalOpen, setCommNoteModalOpen] = useState(false)
  const [noteComm, setNoteComm] = useState<Communication | null>(null)
  const [commNoteText, setCommNoteText] = useState("")

  const [commEscalateModalOpen, setCommEscalateModalOpen] = useState(false)
  const [escalateComm, setEscalateComm] = useState<Communication | null>(null)
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [showCommModal, setShowCommModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null)

  const openAutoCreatedCommunication = (task: Task) => {
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
    setShowCommModal(true)
  }

  // ----- Column filters (same pattern as AllTaskPage) -----
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

  const [dateTimeFilterOpen, setDateTimeFilterOpen] = useState(false)
  const [dateTimeFrom, setDateTimeFrom] = useState("")
  const [dateTimeTo, setDateTimeTo] = useState("")
  const [activityTypeFilter, setActivityTypeFilter] = useState<
    "all" | "tasks-open" | "tasks-overdue" | "comm-emails" | "comm-sms" | "comm-calls"
  >("all")

  const [searchQuery, setSearchQuery] = useState("")

  const uniqueContracts = useMemo(() => {
    const values = combinedItems.map((i) => (i.kind === "task" ? i.task.entity : i.comm.from))
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [combinedItems])

  const uniqueAssignedTo = useMemo(() => {
    const values = combinedItems.map((i) => {
      if (i.kind === "task") return i.task.assignedTo
      return commAssignOverrides[i.comm.id] ?? i.comm.assignedTo
    })
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [combinedItems, commAssignOverrides])

  const uniqueEscalatedTo = useMemo(() => {
    const values = combinedItems.flatMap((i) => {
      if (i.kind === "task") return i.task.escalatedTo ? [i.task.escalatedTo] : []
      const v = commEscalatedOverrides[i.comm.id]
      return v ? [v] : []
    })
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [combinedItems, commEscalatedOverrides])

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
  const clearDateTimeFilter = () => {
    setDateTimeFrom("")
    setDateTimeTo("")
  }

  const toggleSummaryFilter = (
    value: "all" | "tasks-open" | "tasks-overdue" | "comm-emails" | "comm-sms" | "comm-calls",
  ) => {
    setActivityTypeFilter((prev) => (prev === value ? "all" : value))
  }

  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      const contractValue = item.kind === "task" ? item.task.entity : item.comm.preview
      if (selectedContracts.length > 0 && !selectedContracts.includes(contractValue)) return false

      if (selectedRiskFilters.length > 0) {
        if (item.kind !== "task") return false
        if (!selectedRiskFilters.includes(item.task.risk)) return false
      }

      if (dueDateFrom || dueDateTo) {
        if (item.kind === "task") {
          if (dueDateFrom && item.task.dueDate < dueDateFrom) return false
          if (dueDateTo && item.task.dueDate > dueDateTo) return false
        }
      }

      const assignedToValue =
        item.kind === "task" ? item.task.assignedTo : (commAssignOverrides[item.comm.id] ?? item.comm.assignedTo)
      if (selectedAssignedToFilters.length > 0 && !selectedAssignedToFilters.includes(assignedToValue)) return false

      const escalatedToValue =
        item.kind === "task" ? item.task.escalatedTo : (commEscalatedOverrides[item.comm.id] ?? "")


      if (selectedEscalatedToFilters.length > 0 && !selectedEscalatedToFilters.includes(escalatedToValue)) return false

      if (dateTimeFrom || dateTimeTo) {
        const t = item.sortDate.getTime()
        if (dateTimeFrom) {
          const fromMs = new Date(dateTimeFrom + "T00:00:00").getTime()
          if (t < fromMs) return false
        }
        if (dateTimeTo) {
          const toMs = new Date(dateTimeTo + "T23:59:59").getTime()
          if (t > toMs) return false
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        if (item.kind === "task") {
          const taskText = `${item.task.title} ${item.task.entity} ${item.task.assignedTo} ${item.task.status} ${item.task.notes ?? ""}`.toLowerCase()
          if (!taskText.includes(query)) return false
        } else {
          const commText = `${item.comm.preview} ${item.comm.from} ${item.comm.fullMessage ?? ""} ${item.comm.assignedTo}`.toLowerCase()
          if (!commText.includes(query)) return false
        }
      }

      return true
    })
  }, [
    combinedItems,
    commAssignOverrides,
    commEscalatedOverrides,
    dateTimeFrom,
    dateTimeTo,
    dueDateFrom,
    dueDateTo,
    selectedAssignedToFilters,
    selectedContracts,
    selectedEscalatedToFilters,
    selectedRiskFilters,
    searchQuery,
  ])

  const visibleItems = useMemo(() => {
    return filteredItems.filter((item) => {
      if (
        activityTypeFilter === "tasks-open" &&
        !(item.kind === "task" && item.task.status !== "Completed" && item.task.status !== "Skipped")
      ) {
        return false
      }

      if (activityTypeFilter === "tasks-overdue" && !(item.kind === "task" && item.task.overdue)) return false
      if (activityTypeFilter === "comm-emails" && !(item.kind === "comm" && item.comm.type === "email")) return false
      if (activityTypeFilter === "comm-sms" && !(item.kind === "comm" && item.comm.type === "text")) return false
      if (activityTypeFilter === "comm-calls" && !(item.kind === "comm" && item.comm.type === "call")) return false

      return true
    })
  }, [activityTypeFilter, filteredItems])

  const summary = useMemo(() => {
    const tasks = filteredItems.filter((i) => i.kind === "task").map((i) => i.task)
    const comms = filteredItems.filter((i) => i.kind === "comm").map((i) => i.comm)

    const openTasks = tasks.filter((t) => t.status !== "Completed" && t.status !== "Skipped").length
    const overdueTasks = tasks.filter((t) => t.overdue).length

    const commAll = comms.length
    const commEmail = comms.filter((c) => c.type === "email").length
    const commSms = comms.filter((c) => c.type === "text").length
    const commCall = comms.filter((c) => c.type === "call").length

    return {
      total: filteredItems.length,
      tasks: { open: openTasks, overdue: overdueTasks },
      comms: { all: commAll, email: commEmail, sms: commSms, call: commCall },
    }
  }, [filteredItems])

  const isAllSelected = activityTypeFilter === "all"
  const isTasksOpenSelected = activityTypeFilter === "tasks-open"
  const isTasksOverdueSelected = activityTypeFilter === "tasks-overdue"
  const isCommEmailsSelected = activityTypeFilter === "comm-emails"
  const isCommSmsSelected = activityTypeFilter === "comm-sms"
  const isCommCallsSelected = activityTypeFilter === "comm-calls"

  return (
    <>
      <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-800 rounded">
                <LayoutList className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900">All Activity</CardTitle>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-fit rounded-lg border border-slate-200 bg-white overflow-hidden">

                <div className="grid grid-cols-[auto_auto_auto]">

                  <div className="px-3 py-2 text-left bg-white">
                    <div className="text-xs font-semibold mb-1 text-slate-600">ALL</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer ${isAllSelected ? "bg-slate-700 border-slate-600" : "bg-white border-slate-200"}`}
                        onClick={() => toggleSummaryFilter("all")}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isAllSelected ? "bg-slate-600" : "bg-slate-100"}`}>
                          <Bell className={`h-4.5 w-4.5 ${isAllSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold leading-none ${isAllSelected ? "text-white" : "text-slate-900"}`}>
                            {summary.total}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wide font-medium ${isAllSelected ? "text-slate-200" : "text-slate-500"}`}>
                            All
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="border-l border-slate-200 px-3 py-2 text-left bg-white">
                    <div className="text-xs font-semibold mb-1 text-slate-600">Tasks</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer ${isTasksOpenSelected ? "bg-teal-500 border-teal-400" : "bg-white border-slate-200"}`}
                        onClick={() => toggleSummaryFilter("tasks-open")}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isTasksOpenSelected ? "bg-teal-400" : "bg-slate-100"}`}>
                          <CheckSquare className={`h-4.5 w-4.5 ${isTasksOpenSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold leading-none ${isTasksOpenSelected ? "text-white" : "text-slate-900"}`}>
                            {summary.tasks.open}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wide font-medium ${isTasksOpenSelected ? "text-teal-100" : "text-slate-500"}`}>
                            Open
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer ${isTasksOverdueSelected ? "bg-teal-500 border-teal-400" : "bg-white border-slate-200"}`}
                        onClick={() => toggleSummaryFilter("tasks-overdue")}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isTasksOverdueSelected ? "bg-teal-400" : "bg-slate-100"}`}>
                          <AlertCircle className={`h-4.5 w-4.5 ${isTasksOverdueSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold leading-none ${isTasksOverdueSelected ? "text-white" : "text-slate-900"}`}>
                            {summary.tasks.overdue}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wide font-medium ${isTasksOverdueSelected ? "text-teal-100" : "text-slate-500"}`}>
                            Overdue
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="border-l border-slate-200 px-3 py-2 text-left bg-white">
                    <div className="text-xs font-semibold mb-1 text-slate-600">Communication</div>
                    <div className="flex items-center gap-3 flex-wrap">

                      <button
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer ${isCommEmailsSelected ? "bg-teal-500 border-teal-400" : "bg-white border-slate-200"}`}
                        onClick={() => toggleSummaryFilter("comm-emails")}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isCommEmailsSelected ? "bg-teal-400" : "bg-slate-100"}`}>
                          <Mail className={`h-4.5 w-4.5 ${isCommEmailsSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold leading-none ${isCommEmailsSelected ? "text-white" : "text-slate-900"}`}>
                            {summary.comms.email}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wide font-medium ${isCommEmailsSelected ? "text-teal-100" : "text-slate-500"}`}>
                            Emails
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer ${isCommSmsSelected ? "bg-teal-500 border-teal-400" : "bg-white border-slate-200"}`}
                        onClick={() => toggleSummaryFilter("comm-sms")}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isCommSmsSelected ? "bg-teal-400" : "bg-slate-100"}`}>
                          <MessageSquare className={`h-4.5 w-4.5 ${isCommSmsSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold leading-none ${isCommSmsSelected ? "text-white" : "text-slate-900"}`}>
                            {summary.comms.sms}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wide font-medium ${isCommSmsSelected ? "text-teal-100" : "text-slate-500"}`}>
                            SMS
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer ${isCommCallsSelected ? "bg-teal-500 border-teal-400" : "bg-white border-slate-200"}`}
                        onClick={() => toggleSummaryFilter("comm-calls")}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isCommCallsSelected ? "bg-teal-400" : "bg-slate-100"}`}>
                          <Phone className={`h-4.5 w-4.5 ${isCommCallsSelected ? "text-white" : "text-slate-600"}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold leading-none ${isCommCallsSelected ? "text-white" : "text-slate-900"}`}>
                            {summary.comms.call}
                          </span>
                          <span className={`text-[11px] uppercase tracking-wide font-medium ${isCommCallsSelected ? "text-teal-100" : "text-slate-500"}`}>
                            Calls
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {/* <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">{visibleItems.length} items</span> */}
              <Button
                size="sm"
                className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => setAddTaskOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
            </div>
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
              <div className="min-w-full overflow-y-auto relative" style={{ maxHeight }}>
                <table className="min-w-full w-full">
                  <TableHeader className="sticky top-0 z-10 bg-slate-50 text-sm">
                    <TableRow className="border-b bg-slate-50">
                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        <Popover open={contractFilterOpen} onOpenChange={setContractFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100 text-sm"
                            >
                              <span>Contact</span>
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
                      <TableHead className="h-10 px-2 text-left align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        Task
                      </TableHead>

                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        <Popover open={assignedToFilterOpen} onOpenChange={setAssignedToFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100 text-sm"
                            >
                              <span>Assigned To</span>
                              <Filter className={`h-3 w-3 ${selectedAssignedToFilters.length > 0 ? "text-teal-600" : "text-slate-400"}`} />
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
                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        <Popover open={riskColumnFilterOpen} onOpenChange={setRiskColumnFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100 text-sm"
                            >
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

                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        <Popover open={dueDateFilterOpen} onOpenChange={setDueDateFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100 text-sm"
                            >
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
                      </TableHead>

                      <TableHead className="h-10 p-0 text-left align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        <Popover open={escalatedToFilterOpen} onOpenChange={setEscalatedToFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100 text-sm"
                            >
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

                      {/* <TableHead className="h-10 p-0 align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        <Popover open={dateTimeFilterOpen} onOpenChange={setDateTimeFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex gap-1 px-3 py-2 text-right hover:bg-slate-100 text-sm"
                            >
                              <span>Date/Time</span>
                              <Filter className={`h-3 w-3 ${(dateTimeFrom || dateTimeTo) ? "text-teal-600" : "text-slate-400"}`} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3" align="end">
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">Date range</div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[10px] text-muted-foreground">From</Label>
                                  <Input
                                    type="date"
                                    value={dateTimeFrom}
                                    onChange={(e) => setDateTimeFrom(e.target.value)}
                                    className="h-8 text-xs mt-0.5"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-muted-foreground">To</Label>
                                  <Input
                                    type="date"
                                    value={dateTimeTo}
                                    onChange={(e) => setDateTimeTo(e.target.value)}
                                    className="h-8 text-xs mt-0.5"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs px-2"
                                  onClick={clearDateTimeFilter}
                                  disabled={!dateTimeFrom && !dateTimeTo}
                                >
                                  Clear
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs px-2"
                                  onClick={() => setDateTimeFilterOpen(false)}
                                >
                                  Close
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead> */}
                      <TableHead className="h-10 px-2 text-right align-middle font-medium text-slate-700 whitespace-nowrap text-sm">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleItems.length > 0 ? (
                      visibleItems.map((item) => {
                        if (item.kind === "comm") {
                          const comm = item.comm
                          const commAssignedTo = commAssignOverrides[comm.id] ?? comm.assignedTo
                          const commEscalatedTo = commEscalatedOverrides[comm.id] ?? ""
                          const commEscalatedToNameFromValue = commEscalatedTo.includes(" (")
                            ? commEscalatedTo.split(" (")[0]
                            : commEscalatedTo
                          const commEscalatedStaff =
                            escalatedToStaffMembers.find((staff) => staff.name === commEscalatedToNameFromValue) ??
                            escalatedToStaffMembers.find(
                              (staff) => `${staff.name} (${staff.role})` === commEscalatedTo,
                            )
                          const commEscalatedToName = commEscalatedStaff?.name ?? commEscalatedToNameFromValue
                          const commEscalatedToRole =
                            commEscalatedStaff?.role ?? (commEscalatedTo.match(/\(([^)]+)\)/)?.[1] ?? "")
                          const commNote = commNoteOverrides[comm.id]
                          return (
                            <TableRow
                              key={`comm-${comm.id}`}
                              className="hover:bg-slate-50 cursor-pointer"
                              onClick={() => onCommunicationClick?.(comm)}
                              style={{
                                backgroundColor:
                                  comm.type === "email"
                                    ? "#E6F4EA"
                                    : comm.type === "call"
                                      ? "#E0F7F6"
                                      : "#E3F2FD",
                              }}
                            >
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="p-2 rounded-full relative shrink-0"
                                    style={{
                                      backgroundColor:
                                        comm.type === "email"
                                          ? "#c8e6cc"
                                          : comm.type === "call"
                                            ? "#b3e8e5"
                                            : "#BBDEFB",
                                    }}
                                  >
                                    {comm.type === "email" ? (
                                      <Mail className="h-4 w-4 text-green-800" />
                                    ) : comm.type === "call" ? (
                                      <Phone className="h-4 w-4 text-teal-800" />
                                    ) : comm.isGroupSms ? (
                                      <Users className="h-4 w-4 text-blue-800" />
                                    ) : (
                                      <MessageSquare className="h-4 w-4 text-blue-800" />
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-0">
                                    <span className="text-sm font-medium truncate text-slate-800">
                                      {comm.from}
                                    </span>
                                    {comm.type === "text" && comm.isGroupSms && (
                                      <span className="text-[10px] text-purple-700 truncate">
                                        Group SMS
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex flex-col min-w-0">

                                  {/* {!comm.read && (
                                    <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                                  )} */}
                                  <span className="block max-w-[260px] text-sm font-medium truncate text-slate-800"
                                    title={comm.preview}>
                                    {comm.preview}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {formatDateTime(new Date(comm.timestamp))}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-slate-600">
                                <Popover
                                  open={assignPopoverOpen === `comm-${comm.id}`}
                                  onOpenChange={(open) =>
                                    setAssignPopoverOpen(open ? `comm-${comm.id}` : null)
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
                                          const [firstName, lastName] = commAssignedTo.split(" ")
                                          return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                                        })()}
                                      </div>
                                      <span className="truncate">{commAssignedTo}</span>
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
                                                onAssignCommunication?.(comm.id, staff.name)
                                                setCommAssignOverrides((prev) => ({
                                                  ...prev,
                                                  [comm.id]: staff.name,
                                                }))
                                                setAssignPopoverOpen(null)
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                                {(() => {
                                                  const [firstName, lastName] = staff.name.split(" ")
                                                  return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
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
                                              {commAssignedTo === staff.name && (
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

                              <TableCell><span className="text-sm text-slate-400">—</span></TableCell>
                              <TableCell><span className="text-sm text-slate-400">—</span></TableCell>
                              <TableCell className="text-sm text-slate-600">
                                <Popover
                                  open={escalatedToPopoverOpen === `comm-${comm.id}`}
                                  onOpenChange={(open) =>
                                    setEscalatedToPopoverOpen(open ? `comm-${comm.id}` : null)
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700 w-full text-left"
                                    >
                                      {commEscalatedTo ? (
                                        <>
                                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                            {(() => {
                                              const [firstName, lastName] = commEscalatedToName.split(" ")
                                              return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                                            })()}
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-sm text-slate-900">{commEscalatedToName}</span>
                                            {commEscalatedToRole && (
                                              <span className="text-[11px] text-slate-500">
                                                {commEscalatedToRole}
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
                                            const isSelected =
                                              commEscalatedTo === displayValue ||
                                              commEscalatedTo === staff.name
                                            return (
                                              <CommandItem
                                                key={staff.id}
                                                value={staff.name}
                                                onSelect={() => {
                                                  applyCommEscalation(comm.id, displayValue)
                                                  setEscalatedToPopoverOpen(null)
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                                  {(() => {
                                                    const [firstName, lastName] = staff.name.split(" ")
                                                    return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
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
                              {/* <TableCell className="text-right text-sm text-slate-600 whitespace-nowrap">
                                {formatDateTime(item.sortDate)}
                              </TableCell> */}
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
                                        onCommunicationClick?.(comm)
                                      }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setNoteComm(comm)
                                        setCommNoteText(commNote ?? "")
                                        setCommNoteModalOpen(true)
                                      }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      <StickyNote className={`h-4 w-4 ${commNote ? "text-teal-600" : ""}`} />
                                      {commNote ? "Edit Note" : "Add Note"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // placeholder: no completion state for comms in this mock UI
                                      }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      <Check className="h-4 w-4" />
                                      Complete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setEscalateComm(comm)
                                        setCommEscalateModalOpen(true)
                                      }}
                                      className="gap-2 cursor-pointer"
                                    >
                                      <TriangleAlert className={`h-4 w-4 ${commEscalatedTo ? "text-amber-500" : ""}`} />
                                      Escalate
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        }

                        const task = item.task
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
                          <TableRow
                            key={`task-${task.id}`}
                            className="hover:bg-slate-50 "
                            onClick={() => {
                              if (task.autoCreated) {
                                openAutoCreatedCommunication(task)
                              } else {
                                onTaskClick?.(task)
                              }
                            }}
                          >
                            <TableCell className="py-3">
                              <div className={`flex items-center gap-2 min-w-0 ${task.autoCreated ? "cursor-pointer" : ""}`}>
                                <div className="p-2 rounded-full shrink-0 bg-slate-100">
                                  {task.type === "email" ? (
                                    <Mail className="h-4 w-4 text-green-800" />
                                  ) : task.type === "call" ? (
                                    <Phone className="h-4 w-4 text-teal-800" />
                                  ) : task.type === "sms" ? (
                                    <MessageSquare className="h-4 w-4 text-blue-800" />
                                  ) : (
                                    <CheckSquare className="h-4 w-4 text-slate-600" />
                                  )}
                                </div>
                                <div className="flex flex-col gap-0">
                                  <span className="text-sm font-medium truncate text-slate-800">{task.entityTitle}</span>
                                  <span className="text-sm text-slate-500">({task.entity})</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              <div className={`flex items-center gap-2 min-w-0 ${task.autoCreated ? "cursor-pointer" : ""}`}>
                                <div className="flex flex-col gap-0 min-w-0">
                                  <span
                                    className="block max-w-[260px] text-sm font-medium truncate text-slate-800"
                                    title={task.title}
                                  >
                                    {task.title}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {task.processName && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          onProcessClick ? onProcessClick(task) : null
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
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              <Popover
                                open={assignPopoverOpen === `task-${task.id}`}
                                onOpenChange={(open) =>
                                  setAssignPopoverOpen(open ? `task-${task.id}` : null)
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
                                        const [firstName, lastName] = task.assignedTo.split(" ")
                                        return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                                      })()}
                                    </div>
                                    <span className="truncate">{task.assignedTo}</span>
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
                                              onAssignTask?.(task.id, staff.name)
                                              setAssignPopoverOpen(null)
                                            }}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                              {(() => {
                                                const [firstName, lastName] = staff.name.split(" ")
                                                return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
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
                                open={riskPopoverOpen === `task-${task.id}`}
                                onOpenChange={(open) =>
                                  setRiskPopoverOpen(open ? `task-${task.id}` : null)
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
                                              onUpdateRisk?.(task.id, option.value)
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
                            <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                              <div className="flex flex-col items-center justify-center gap-0">
                                <span className={task.overdue ? "text-red-600 font-medium" : undefined}>
                                  {task.dueDate && new Intl.DateTimeFormat('en-US', {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }).format(new Date(task.dueDate))}
                                </span>
                                {task.overdue && (
                                  <span className="text-xs text-red-500 mt-0.5">(Overdue)</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              <Popover
                                open={escalatedToPopoverOpen === `task-${task.id}`}
                                onOpenChange={(open) =>
                                  setEscalatedToPopoverOpen(open ? `task-${task.id}` : null)
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
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                          {(() => {
                                            const [firstName, lastName] = taskEscalatedToName.split(" ")
                                            return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                                          })()}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm text-slate-900">{taskEscalatedToName}</span>
                                          {taskEscalatedToRole && (
                                            <span className="text-[11px] text-slate-500">
                                              {taskEscalatedToRole}
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
                                          const isSelected =
                                            task.escalatedTo === displayValue ||
                                            task.escalatedTo === staff.name
                                          return (
                                            <CommandItem
                                              key={staff.id}
                                              value={staff.name}
                                              onSelect={() => {
                                                onEscalateTask?.(task.id, displayValue)
                                                setEscalatedToPopoverOpen(null)
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                                {(() => {
                                                  const [firstName, lastName] = staff.name.split(" ")
                                                  return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
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
                            {/* <TableCell className="text-right text-sm text-slate-600 whitespace-nowrap">
                              {formatDateTime(item.sortDate)}
                            </TableCell> */}
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
                                      if (task.autoCreated) {
                                        openAutoCreatedCommunication(task)
                                      } else {
                                        onTaskClick?.(task)
                                      }
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
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                          No activity found
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
          onAddTask={onAddTask}
        />
      )}

      <CommunicationModal
        communication={selectedCommunication}
        open={showCommModal}
        onOpenChange={(open) => {
          setShowCommModal(open)
          if (!open) setSelectedCommunication(null)
        }}
      />

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
            className="min-h-[120px]"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setNoteModalOpen(false)
                setNoteTask(null)
                setNoteText("")
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                if (!noteTask) return
                onUpdateNote?.(noteTask.id, noteText)
                setNoteModalOpen(false)
              }}
            >
              Save
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
        value={escalateTask ? (escalateTask.escalatedTo || "") : ""}
        onConfirm={(staffName) => {
          if (escalateTask) onEscalateTask?.(escalateTask.id, staffName)
          setEscalateModalOpen(false)
        }}
        confirmLabel="Escalate"
      />

      <Dialog open={commNoteModalOpen} onOpenChange={setCommNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-slate-600" />
              {noteComm && (commNoteOverrides[noteComm.id] ? "Edit Note" : "Add Note")}
            </DialogTitle>
            {noteComm && (
              <p className="text-sm text-slate-500 mt-1">{noteComm.from}</p>
            )}
          </DialogHeader>
          <Textarea
            placeholder="Write a note for this communication..."
            value={commNoteText}
            onChange={(e) => setCommNoteText(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setCommNoteModalOpen(false)
                setNoteComm(null)
                setCommNoteText("")
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                if (!noteComm) return
                onUpdateCommunicationNote?.(noteComm.id, commNoteText)
                setCommNoteOverrides((prev) => ({ ...prev, [noteComm.id]: commNoteText }))
                setCommNoteModalOpen(false)
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EscalateDialog
        open={commEscalateModalOpen}
        onOpenChange={(open) => {
          setCommEscalateModalOpen(open)
          if (!open) setEscalateComm(null)
        }}
        title="Escalate Communication"
        subtitle={escalateComm?.from}
        staffMembers={escalatedToStaffMembers}
        value={escalateComm ? (commEscalatedOverrides[escalateComm.id] ?? "") : ""}
        onConfirm={(staffName) => {
          if (escalateComm) applyCommEscalation(escalateComm.id, staffName)
          setCommEscalateModalOpen(false)
        }}
        confirmLabel="Escalate"
      />
    </>
  )
}

