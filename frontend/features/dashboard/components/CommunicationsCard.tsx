"use client"

import { useMemo, useState } from "react"
import { Bell, Filter, Mail, MessageSquare, Phone, Plus, Search, Users, ChevronsUpDown, Check, TriangleAlert, MoreVertical, Eye, StickyNote } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommunicationModal } from "./CommunicationModal"
import type { Communication, CommSummary, Task } from "../types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddTaskDialog, type StaffMember } from "../../../components/shared/AddTaskDialog"
import { EscalateDialog } from "../../../components/shared/EscalateDialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

interface CommunicationsCardProps {
  filteredCommunications: Communication[]
  selectedTile: "emails" | "sms" | "calls" | null
  setSelectedTile: (tile: "emails" | "sms" | "calls" | null) => void
  subFilter: "all" | "unread" | "unresponded"
  setSubFilter: (f: "all" | "unread" | "unresponded") => void
  commSummary: CommSummary
  emailComms: Communication[]
  smsComms: Communication[]
  callComms: Communication[]
  isUnresponded: (c: Communication) => boolean
  isPending: (c: Communication) => boolean
  selectedStaff: string | null
  staffMembers: StaffMember[]
  escalatedToStaffMembers?: StaffMember[]
  commEscalatedOverrides?: Record<number, string>
  onAddTask: (task: Task) => void
  onEscalateCommunication?: (commId: number, staffName: string) => void
  onUpdateRisk?: (commId: number, risk: string) => void
  onUpdateNote?: (commId: number, note: string) => void
  maxHeight?: string
}

export function CommunicationsCard({
  filteredCommunications,
  selectedTile,
  setSelectedTile,
  subFilter,
  setSubFilter,
  commSummary,
  emailComms,
  smsComms,
  callComms,
  isUnresponded,
  isPending,
  selectedStaff,
  staffMembers,
  escalatedToStaffMembers = [],
  commEscalatedOverrides: commEscalatedOverridesProp,
  onAddTask,
  onEscalateCommunication,
  onUpdateRisk,
  onUpdateNote,
  maxHeight = "260px",
}: CommunicationsCardProps) {
  const [selectedCommunication, setSelectedCommunication] =
    useState<Communication | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  const [commEscalatedOverridesLocal, setCommEscalatedOverridesLocal] = useState<Record<number, string>>({})
  const commEscalatedOverrides = commEscalatedOverridesProp ?? commEscalatedOverridesLocal
  const applyEscalation = (commId: number, staffName: string) => {
    if (commEscalatedOverridesProp !== undefined) {
      onEscalateCommunication?.(commId, staffName)
    } else {
      setCommEscalatedOverridesLocal((prev) => ({ ...prev, [commId]: staffName }))
      onEscalateCommunication?.(commId, staffName)
    }
  }
  const [commRiskOverrides, setCommRiskOverrides] = useState<Record<number, string>>({})
  const [commNoteOverrides, setCommNoteOverrides] = useState<Record<number, string>>({})
  const [escalatedToPopoverOpen, setEscalatedToPopoverOpen] = useState<number | null>(null)
  const [riskPopoverOpen, setRiskPopoverOpen] = useState<number | null>(null)
  const [commNoteModalOpen, setCommNoteModalOpen] = useState(false)
  const [noteComm, setNoteComm] = useState<Communication | null>(null)
  const [commNoteText, setCommNoteText] = useState("")
  const [escalateCommModalOpen, setEscalateCommModalOpen] = useState(false)
  const [escalateComm, setEscalateComm] = useState<Communication | null>(null)

  // ----- Column filters (same pattern as TasksCard/Combined) -----
  const [contractFilterOpen, setContractFilterOpen] = useState(false)
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [contractFilterSearch, setContractFilterSearch] = useState("")

  const [assignedToFilterOpen, setAssignedToFilterOpen] = useState(false)
  const [selectedAssignedToFilters, setSelectedAssignedToFilters] = useState<string[]>([])
  const [assignedToFilterSearch, setAssignedToFilterSearch] = useState("")

  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const [escalatedToFilterOpen, setEscalatedToFilterOpen] = useState(false)
  const [selectedEscalatedToFilters, setSelectedEscalatedToFilters] = useState<string[]>([])
  const [escalatedToFilterSearch, setEscalatedToFilterSearch] = useState("")

  const [riskColumnFilterOpen, setRiskColumnFilterOpen] = useState(false)
  const [selectedRiskFilters, setSelectedRiskFilters] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState("")

  const uniqueContracts = useMemo(() => {
    const values = filteredCommunications.map((c) =>
      `${c.from}${c.entityType ? ` (${c.entityType})` : ""}`,
    )
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [filteredCommunications])

  const uniqueAssignedTo = useMemo(() => {
    const values = filteredCommunications.map((c) => c.assignedTo)
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [filteredCommunications])

  const uniqueEscalatedTo = useMemo(() => {
    const values = filteredCommunications.map(
      (c) => commEscalatedOverrides[c.id] ?? ""
    )
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b))
  }, [filteredCommunications, commEscalatedOverrides])

  const toggleContract = (value: string) => {
    setSelectedContracts((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const toggleAssignedToFilter = (value: string) => {
    setSelectedAssignedToFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const clearContractFilter = () => {
    setSelectedContracts([])
    setContractFilterSearch("")
  }

  const clearAssignedToFilter = () => {
    setSelectedAssignedToFilters([])
    setAssignedToFilterSearch("")
  }

  const clearDateFilter = () => {
    setDateFrom("")
    setDateTo("")
  }

  const toggleRiskFilter = (value: string) => {
    setSelectedRiskFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const toggleEscalatedToFilter = (value: string) => {
    setSelectedEscalatedToFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const clearRiskFilter = () => setSelectedRiskFilters([])
  const clearEscalatedToFilter = () => {
    setSelectedEscalatedToFilters([])
    setEscalatedToFilterSearch("")
  }

  const visibleCommunications = useMemo(() => {
    return filteredCommunications.filter((c) => {
      const contractValue = `${c.from}${c.entityType ? ` (${c.entityType})` : ""}`
      if (selectedContracts.length > 0 && !selectedContracts.includes(contractValue)) return false

      if (selectedAssignedToFilters.length > 0 && !selectedAssignedToFilters.includes(c.assignedTo)) return false

      if (dateFrom || dateTo) {
        const t = c.receivedAt.getTime()
        if (dateFrom) {
          const fromMs = new Date(dateFrom + "T00:00:00").getTime()
          if (t < fromMs) return false
        }
        if (dateTo) {
          const toMs = new Date(dateTo + "T23:59:59").getTime()
          if (t > toMs) return false
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const searchText = `${c.from} ${c.preview} ${c.assignedTo}`.toLowerCase()
        if (!searchText.includes(q)) return false
      }

      const commRisk = commRiskOverrides[c.id] ?? "None"
      if (selectedRiskFilters.length > 0 && !selectedRiskFilters.includes(commRisk)) return false

      const escalatedToValue = commEscalatedOverrides[c.id] ?? ""
      if (selectedEscalatedToFilters.length > 0 && !selectedEscalatedToFilters.includes(escalatedToValue)) return false

      return true
    })
  }, [filteredCommunications, selectedContracts, selectedAssignedToFilters, dateFrom, dateTo, searchQuery, selectedRiskFilters, selectedEscalatedToFilters, commRiskOverrides, commEscalatedOverrides])

  const handleCommunicationClick = (comm: Communication) => {
    setSelectedCommunication(comm)
    setShowModal(true)
  }

  const tileComms =
    selectedTile === "emails"
      ? emailComms
      : selectedTile === "sms"
        ? smsComms
        : selectedTile === "calls"
          ? callComms
          : filteredCommunications

  const allCount =
    selectedTile === "calls"
      ? tileComms.filter((c) => isUnresponded(c) || !c.read).length
      : tileComms.filter(isPending).length
  const unreadCount = tileComms.filter((c) => !c.read).length
  const unrespondedCount = tileComms.filter(isUnresponded).length

  return (
    <>
      <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Communications
                </CardTitle>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${selectedTile === null
                    ? "bg-slate-800 border border-slate-800"
                    : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                  onClick={() => {
                    setSelectedTile(null)
                    setSubFilter("all")
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedTile === null ? "bg-slate-700" : "bg-slate-100"
                      }`}
                  >
                    <Bell
                      className={`h-4.5 w-4.5 ${selectedTile === null ? "text-white" : "text-slate-600"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${selectedTile === null ? "text-white" : "text-slate-900"
                        }`}
                    >
                      {commSummary.pending}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${selectedTile === null ? "text-slate-300" : "text-slate-500"
                        }`}
                    >
                      All
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${selectedTile === "emails"
                    ? "bg-teal-600 border border-teal-600"
                    : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                  onClick={() => {
                    if (selectedTile === "emails") {
                      setSelectedTile(null)
                      setSubFilter("all")
                    } else {
                      setSelectedTile("emails")
                      setSubFilter("all")
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedTile === "emails" ? "bg-teal-500" : "bg-slate-100"
                      }`}
                  >
                    <Mail
                      className={`h-4.5 w-4.5 ${selectedTile === "emails"
                        ? "text-white"
                        : "text-slate-600"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${selectedTile === "emails"
                        ? "text-white"
                        : "text-slate-900"
                        }`}
                    >
                      {commSummary.emails}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${selectedTile === "emails"
                        ? "text-teal-100"
                        : "text-slate-500"
                        }`}
                    >
                      Emails
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${selectedTile === "sms"
                    ? "bg-teal-600 border border-teal-600"
                    : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                  onClick={() => {
                    if (selectedTile === "sms") {
                      setSelectedTile(null)
                      setSubFilter("all")
                    } else {
                      setSelectedTile("sms")
                      setSubFilter("all")
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedTile === "sms" ? "bg-teal-500" : "bg-slate-100"
                      }`}
                  >
                    <MessageSquare
                      className={`h-4.5 w-4.5 ${selectedTile === "sms" ? "text-white" : "text-slate-600"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${selectedTile === "sms"
                        ? "text-white"
                        : "text-slate-900"
                        }`}
                    >
                      {commSummary.sms}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${selectedTile === "sms"
                        ? "text-teal-100"
                        : "text-slate-500"
                        }`}
                    >
                      SMS
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${selectedTile === "calls"
                    ? "bg-teal-600 border border-teal-600"
                    : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                  onClick={() => {
                    if (selectedTile === "calls") {
                      setSelectedTile(null)
                    } else {
                      setSelectedTile("calls")
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedTile === "calls" ? "bg-teal-500" : "bg-slate-100"
                      }`}
                  >
                    <Phone
                      className={`h-4.5 w-4.5 ${selectedTile === "calls"
                        ? "text-white"
                        : "text-slate-600"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${selectedTile === "calls"
                        ? "text-white"
                        : "text-slate-900"
                        }`}
                    >
                      {commSummary.calls}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${selectedTile === "calls"
                        ? "text-teal-100"
                        : "text-slate-500"
                        }`}
                    >
                      Calls
                    </span>
                  </div>
                </button>
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

          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="comm-filter"
                checked={subFilter === "all"}
                onChange={() => setSubFilter("all")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 ml-1">
                All <span className="text-xs font-medium text-slate-500">({allCount})</span>
              </span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="comm-filter"
                checked={subFilter === "unread"}
                onChange={() => setSubFilter("unread")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 ml-1">
                Unread{" "}
                <span className="text-xs font-medium text-slate-500">({unreadCount})</span>
              </span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="comm-filter"
                checked={subFilter === "unresponded"}
                onChange={() => setSubFilter("unresponded")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 ml-1">
                Unresponded{" "}
                <span className="text-xs font-medium text-slate-500">({unrespondedCount})</span>
              </span>
            </label>
          </div>
          <div className="relative flex items-center justify-between mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by communication..."
              className="h-9 w-full border-slate-200 bg-white pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="w-full overflow-x-auto">
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
                              <label
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                              >
                                <Checkbox
                                  checked={selectedRiskFilters.includes("None")}
                                  onCheckedChange={() => toggleRiskFilter("None")}
                                />
                                <span className="truncate">None</span>
                              </label>
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
                        <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-full flex items-center gap-1 px-3 py-2 text-left hover:bg-slate-100"
                            >
                              <span>SLA Due Date</span>
                              <Filter
                                className={`h-3 w-3 ${(dateFrom || dateTo) ? "text-teal-600" : "text-slate-400"}`}
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
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="h-8 text-xs mt-0.5"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-muted-foreground">To</Label>
                                  <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="h-8 text-xs mt-0.5"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs px-2"
                                  onClick={clearDateFilter}
                                  disabled={!dateFrom && !dateTo}
                                >
                                  Clear
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs px-2"
                                  onClick={() => setDateFilterOpen(false)}
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
                    {visibleCommunications.length > 0 ? (
                      visibleCommunications.map((comm) => {
                        const assignedStaff = staffMembers.find((s) => s.name === comm.assignedTo)
                        return (
                          <TableRow
                            key={comm.id}
                            className="hover:bg-slate-50 cursor-pointer"
                            onClick={() => handleCommunicationClick(comm)}
                            style={{
                              backgroundColor:
                                comm.type === "email"
                                  ? "#E6F4EA"
                                  : comm.type === "call"
                                    ? "#E0F7F6"
                                    : "#E3F2FD",
                            }}
                          >
                            <TableCell className="py-3 overflow-hidden">
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
                                {/* {!comm.read && (
                                  <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                                )} */}
                                <div className="flex flex-col gap-0 min-w-0">
                                  <span className="text-sm font-medium truncate text-slate-800">
                                    {comm.from}
                                  </span>
                                  {comm.entityType && (
                                    <span className="text-sm text-slate-500">({comm.entityType})</span>
                                  )}
                                  {comm.type === "text" && comm.isGroupSms && (
                                    <span className="text-[9px] text-purple-700 truncate" title={comm.groupParticipants?.join(", ")}>
                                      Group
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              <span
                                className="block max-w-[260px] text-sm font-medium truncate text-slate-800"
                                title={comm.preview}
                              >
                                {comm.preview}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                  {(() => {
                                    const [firstName, lastName] = (comm.assignedTo || "").split(" ")
                                    return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                                  })()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm text-slate-900 truncate">{comm.assignedTo}</span>
                                  {/* {assignedStaff?.role && (
                                    <span className="text-[11px] text-slate-500">{assignedStaff.role}</span>
                                  )} */}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600" onClick={(e) => e.stopPropagation()}>
                              <Popover
                                open={riskPopoverOpen === comm.id}
                                onOpenChange={(open) => setRiskPopoverOpen(open ? comm.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1.5 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-left"
                                  >
                                    <Badge
                                      variant="outline"
                                      className={`text-xs font-medium capitalize ${getRiskStyles(commRiskOverrides[comm.id] ?? "None")}`}
                                    >
                                      {commRiskOverrides[comm.id] ?? "None"}
                                      <ChevronsUpDown className="h-3 w-3 ml-1 opacity-50" />
                                    </Badge>
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[180px] p-0" align="start" onClick={(e) => e.stopPropagation()}>
                                  <Command>
                                    <CommandInput placeholder="Search risk..." />
                                    <CommandList>
                                      <CommandEmpty>No risk found.</CommandEmpty>
                                      <CommandGroup>
                                        <CommandItem
                                          value="None"
                                          onSelect={() => {
                                            setCommRiskOverrides((prev) => {
                                              const next = { ...prev }; delete next[comm.id]; return next;
                                            })
                                            onUpdateRisk?.(comm.id, "None")
                                            setRiskPopoverOpen(null)
                                          }}
                                        >
                                          <Badge variant="outline" className={`text-xs font-medium ${getRiskStyles("None")}`}>
                                            None
                                          </Badge>
                                          {!(commRiskOverrides[comm.id]) && <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />}
                                        </CommandItem>
                                        {RISK_OPTIONS.map((option) => (
                                          <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => {
                                              setCommRiskOverrides((prev) => ({ ...prev, [comm.id]: option.value }))
                                              onUpdateRisk?.(comm.id, option.value)
                                              setRiskPopoverOpen(null)
                                            }}
                                          >
                                            <Badge variant="outline" className={`text-xs font-medium ${getRiskStyles(option.value)}`}>
                                              {option.label}
                                            </Badge>
                                            {commRiskOverrides[comm.id] === option.value && (
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
                              <span
                                className={`text-sm ${comm.receivedAt && new Date(comm.receivedAt) < new Date()
                                  ? "text-red-600 font-medium"
                                  : "text-slate-600"
                                  }`}
                              >
                                {comm.receivedAt && new Intl.DateTimeFormat('en-US', {

                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",

                                }).format(comm.receivedAt)}
                                {/* {comm.receivedAt && new Date(comm.receivedAt) < new Date() && (
                                  <span className="ml-1.5 text-xs text-red-500">
                                    (Overdue)
                                  </span>
                                )} */}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                              <Popover
                                open={escalatedToPopoverOpen === comm.id}
                                onOpenChange={(open) => setEscalatedToPopoverOpen(open ? comm.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors text-sm text-slate-700 w-full text-left"
                                  >
                                    {(commEscalatedOverrides[comm.id]) ? (
                                      <>
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                          {(() => {
                                            const name = commEscalatedOverrides[comm.id].includes(" (")
                                              ? commEscalatedOverrides[comm.id].split(" (")[0]
                                              : commEscalatedOverrides[comm.id]
                                            const [firstName, lastName] = name.split(" ")
                                            return (firstName?.[0] ?? "") + (lastName?.[0] ?? "")
                                          })()}
                                        </div>
                                        <span className="whitespace-nowrap overflow-hidden text-ellipsis text-slate-900">
                                          {commEscalatedOverrides[comm.id].includes(" (")
                                            ? commEscalatedOverrides[comm.id].split(" (")[0]
                                            : commEscalatedOverrides[comm.id]}
                                        </span>
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
                                <PopoverContent className="w-[220px] p-0" align="start" onClick={(e) => e.stopPropagation()}>
                                  <Command>
                                    <CommandInput placeholder="Search staff..." />
                                    <CommandList>
                                      <CommandEmpty>No staff found.</CommandEmpty>
                                      <CommandGroup>
                                        {escalatedToStaffMembers.map((staff) => {
                                          const displayValue = `${staff.name} (${staff.role})`
                                          const isSelected = commEscalatedOverrides[comm.id] === displayValue || commEscalatedOverrides[comm.id] === staff.name
                                          return (
                                            <CommandItem
                                              key={staff.id}
                                              value={staff.name}
                                              onSelect={() => {
                                                applyEscalation(comm.id, displayValue)
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
                                                <span className="text-sm text-slate-900">{staff.name}</span>
                                                <span className="text-[11px] text-slate-500">{staff.role}</span>
                                              </div>
                                              {isSelected && <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />}
                                            </CommandItem>
                                          )
                                        })}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  {/* <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCommunicationClick(comm)
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </DropdownMenuItem> */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setNoteComm(comm)
                                      setCommNoteText(commNoteOverrides[comm.id] ?? "")
                                      setCommNoteModalOpen(true)
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <StickyNote className={`h-4 w-4 ${commNoteOverrides[comm.id] ? "text-teal-600" : ""}`} />
                                    {commNoteOverrides[comm.id] ? "Edit Note" : "Add Note"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEscalateComm(comm)
                                      setEscalateCommModalOpen(true)
                                    }}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <TriangleAlert className={`h-4 w-4 ${commEscalatedOverrides[comm.id] ? "text-amber-500" : ""}`} />
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
                          No communications found
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

      <CommunicationModal
        communication={selectedCommunication}
        open={showModal}
        onOpenChange={setShowModal}
      />

      <AddTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        staffMembers={staffMembers}
        defaultAssignee={selectedStaff}
        onAddTask={onAddTask}
      />

      <EscalateDialog
        open={escalateCommModalOpen}
        onOpenChange={(open) => {
          setEscalateCommModalOpen(open)
          if (!open) setEscalateComm(null)
        }}
        title="Escalate Communication"
        subtitle={escalateComm ? `${escalateComm.from}: ${escalateComm.preview}` : undefined}
        staffMembers={escalatedToStaffMembers}
        value={escalateComm ? (commEscalatedOverrides[escalateComm.id] ?? "") : ""}
        onConfirm={(staffName) => {
          if (escalateComm) applyEscalation(escalateComm.id, staffName)
          setEscalateCommModalOpen(false)
        }}
      />

      <Dialog open={commNoteModalOpen} onOpenChange={setCommNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-slate-600" />
              {noteComm && commNoteOverrides[noteComm.id]
                ? "Edit Note"
                : "Add Note"}
            </DialogTitle>
            {noteComm && (
              <p className="text-sm text-slate-500 mt-1">{noteComm.from}: {noteComm.preview}</p>
            )}
          </DialogHeader>
          <Textarea
            placeholder="Write a note for this communication..."
            value={commNoteText}
            onChange={(e) => setCommNoteText(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCommNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                if (noteComm) {
                  setCommNoteOverrides((prev) => ({ ...prev, [noteComm.id]: commNoteText }))
                  onUpdateNote?.(noteComm.id, commNoteText)
                }
                setCommNoteModalOpen(false)
              }}
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
