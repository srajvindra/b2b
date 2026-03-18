"use client"

import { useMemo, useState } from "react"
import { Bell, Filter, Mail, MessageSquare, Phone, Plus, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommunicationModal } from "./CommunicationModal"
import type { Communication, CommSummary, Task } from "../types"
import { Button } from "@/components/ui/button"
import { AddTaskDialog, type StaffMember } from "../../../components/shared/AddTaskDialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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
  onAddTask: (task: Task) => void
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
  onAddTask,
  maxHeight = "260px",
}: CommunicationsCardProps) {
  const [selectedCommunication, setSelectedCommunication] =
    useState<Communication | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [addTaskOpen, setAddTaskOpen] = useState(false)

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

      return true
    })
  }, [filteredCommunications, selectedContracts, selectedAssignedToFilters, dateFrom, dateTo])

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
        </CardHeader>
        {/* <CardContent className="px-4 pb-4">
          <div className="max-h-[240px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredCommunications.length > 0 ? (
                filteredCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCommunicationClick(comm)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCommunicationClick(comm)
                    }
                    className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-white border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full relative ${
                          comm.type === "text" && comm.isGroupSms
                            ? "bg-purple-100"
                            : "bg-slate-100"
                        }`}
                      >
                        {comm.type === "email" ? (
                          <Mail className="h-4 w-4 text-slate-600" />
                        ) : comm.type === "call" ? (
                          <Phone className="h-4 w-4 text-slate-600" />
                        ) : comm.isGroupSms ? (
                          <Users className="h-4 w-4 text-purple-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <p className="text-sm font-medium truncate text-slate-800">
                              {comm.from}
                            </p>
                            {comm.type === "text" && comm.isGroupSms && (
                              <span
                                className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex-shrink-0"
                                title={comm.groupParticipants?.join(", ")}
                              >
                                Group
                              </span>
                            )}
                          </div>
                          {!comm.read && (
                            <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {comm.preview}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-400">
                            {comm.timestamp}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-slate-400">
                            {comm.assignedTo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-slate-500">
                  No communications found
                  {selectedStaff ? ` for ${selectedStaff}` : ""}
                </div>
              )}
            </div>
          </div>
        </CardContent> */}
        <CardContent className="px-4 pb-4">
          <div className="overflow-y-auto pr-1 relative" style={{ maxHeight }}>
            {visibleCommunications.length > 0 ? (
              <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                <div className="grid grid-cols-4 px-3 py-2 bg-slate-50 text-[14px] font-bold text-slate-600 tracking-wide sticky top-0 z-20 border-b border-slate-200">
                  <Popover open={contractFilterOpen} onOpenChange={setContractFilterOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-left hover:text-slate-800"
                      >
                        <span>Contract</span>
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
                          .filter((v) =>
                            v.toLowerCase().includes(contractFilterSearch.toLowerCase()),
                          )
                          .map((value) => (
                            <label
                              key={value}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                            >
                              <Checkbox
                                checked={selectedContracts.includes(value)}
                                onCheckedChange={() => toggleContract(value)}
                              />
                              <span className="truncate">{value}</span>
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
                  <span >Content</span>
                  <span className="text-right">
                    <Popover open={assignedToFilterOpen} onOpenChange={setAssignedToFilterOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-800"
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
                      <PopoverContent className="w-56 p-2" align="end">
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
                            .filter((n) =>
                              n.toLowerCase().includes(assignedToFilterSearch.toLowerCase()),
                            )
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
                  </span>
                  <span className="text-right mr-20">
                    <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-800"
                        >
                          <span>Date</span>
                          <Filter
                            className={`h-3 w-3 ${(dateFrom || dateTo) ? "text-teal-600" : "text-slate-400"}`}
                          />
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
                  </span>
                </div>
                <div className="divide-y divide-white">
                  {visibleCommunications.map((comm) => (
                    <button
                      key={comm.id}
                      type="button"
                      onClick={() => handleCommunicationClick(comm)}
                      className="w-full text-left px-3 py-4 hover:bg-slate-50 transition-colors"
                      style={{
                        backgroundColor:
                          comm.type === "email"
                            ? "#E6F4EA"
                            : comm.type === "call"
                              ? "#E0F7F6"
                              : "#E3F2FD",
                      }}
                    >
                      <div className="grid grid-cols-4 items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1.5 rounded-full relative shrink-0"
                            style={{
                              backgroundColor:
                                comm.type === "email"
                                  ? "#c8e6cc"
                                  : comm.type === "call"
                                    ? "#b3e8e5"
                                    : "#E3F2FD",
                            }}
                          >
                            {comm.type === "email" ? (
                              <Mail className="h-3.5 w-3.5 text-green-800" />
                            ) : comm.type === "call" ? (
                              <Phone className="h-3.5 w-3.5 text-teal-800" />
                            ) : comm.isGroupSms ? (
                              <Users className="h-3.5 w-3.5 text-blue-800" />
                            ) : (
                              <MessageSquare className="h-3.5 w-3.5 text-blue-800" />
                            )}
                          </div>
                          {!comm.read && (
                            <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate text-slate-800">
                              {comm.from} {comm.entityType ? `(${comm.entityType})` : ""}
                            </span>
                            {comm.type === "text" && comm.isGroupSms && (
                              <span
                                className="text-[9px] text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full mt-0.5 w-max"
                                title={`Group SMS: ${comm.groupParticipants?.join(", ")}`}
                              >
                                Group
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="">
                          <p className="text-xs text-slate-700 truncate">
                            {comm.preview}
                          </p>
                        </div>
                        <div className="min-w-0 ml-45">
                          <p className="text-xs text-slate-700 truncate">
                            {comm.assignedTo}
                          </p>
                        </div>
                        <div className="flex ml-38">
                          <span className="text-[11px] text-slate-600 whitespace-nowrap">
                            {comm.timestamp}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No communications found for {selectedStaff}
              </div>
            )}
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
    </>
  )
}
