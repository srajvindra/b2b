"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import type { Task, TaskSummary } from "../types"

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
  escalatedToStaffMembers: StaffMember[]
  escalatedTo: Record<number, string>
  processRoute?: {
    basePath: string
    categoryId?: string
    leadId?: string
  }
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
  escalatedToStaffMembers,
  escalatedTo,
  processRoute,
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
  const [escalateSelectedStaff, setEscalateSelectedStaff] = useState("")
  const [escalateStaffPopoverOpen, setEscalateStaffPopoverOpen] = useState(false)
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
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <CheckSquare className="h-4.5 w-4.5 text-slate-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 leading-none">
                      {taskSummary.total}
                    </span>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">
                      Open
                    </span>
                  </div>
                </div>
                {taskSummary.overdue > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <AlertCircle className="h-4.5 w-4.5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-slate-900 leading-none">
                        {taskSummary.overdue}
                      </span>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">
                        Overdue
                      </span>
                    </div>
                  </div>
                )}
                {taskSummary.dueToday > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Clock className="h-4.5 w-4.5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-slate-900 leading-none">
                        {taskSummary.dueToday}
                      </span>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">
                        Today
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative ml-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by staff name..."
                  className="h-9 w-48 border-slate-200 bg-white pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button
              size="sm"
              className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => router.push("/operations/projects")}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="max-h-[260px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-slate-50">
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-medium text-slate-700">
                      Task
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      Contract
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      Risk
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      SLA Due Date
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      Priority
                    </TableHead>
                    {/* <TableHead className="font-medium text-slate-700">
                      Status
                    </TableHead> */}
                    <TableHead className="font-medium text-slate-700">
                      Assigned To
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      Escalated To
                    </TableHead>
                    <TableHead className="font-medium text-slate-700 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-slate-50">
                        <TableCell className="py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-slate-800">
                              {task.title}
                            </span>
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
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {task.entity}
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
                            className={`text-sm ${
                              task.overdue
                                ? "text-red-600 font-medium"
                                : "text-slate-600"
                            }`}
                          >
                            {task.dueDate}
                            {task.overdue && (
                              <span className="ml-1.5 text-xs text-red-500">
                                (Overdue)
                              </span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium capitalize ${getPriorityStyles(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
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
                        <TableCell className="text-sm text-slate-600">
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
                                  {task.assignedTo
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
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
                                          onAssignTask(task.id, staff.name)
                                          setAssignPopoverOpen(null)
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                                          {staff.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
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
                                    <span className="truncate">{task.escalatedTo}</span>
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
                                            {staff.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
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
                                  setEscalateSelectedStaff(task.escalatedTo || "")
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-slate-500"
                      >
                        No tasks found
                        {selectedStaff ? ` for ${selectedStaff}` : ""}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <Dialog open={escalateModalOpen} onOpenChange={setEscalateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-amber-500" />
              Escalate Task
            </DialogTitle>
            {escalateTask && (
              <p className="text-sm text-slate-500 mt-1">{escalateTask.title}</p>
            )}
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Select a staff member to escalate this task to:
            </p>
            <Popover open={escalateStaffPopoverOpen} onOpenChange={setEscalateStaffPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                >
                  {escalateSelectedStaff ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                        {escalateSelectedStaff
                          .replace(/\s*\(.*?\)\s*/g, " ")
                          .trim()
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span>{escalateSelectedStaff}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Select staff member...</span>
                  )}
                  <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search staff..." />
                  <CommandList>
                    <CommandEmpty>No staff found.</CommandEmpty>
                    <CommandGroup>
                      {escalatedToStaffMembers.map((staff) => {
                        const displayValue = `${staff.name} (${staff.role})`
                        const isSelected = escalateSelectedStaff === displayValue || escalateSelectedStaff === staff.name
                        return (
                          <CommandItem
                            key={staff.id}
                            value={staff.name}
                            onSelect={() => {
                              setEscalateSelectedStaff(displayValue)
                              setEscalateStaffPopoverOpen(false)
                            }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
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
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEscalateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white"
              disabled={!escalateSelectedStaff}
              onClick={() => {
                if (escalateTask && escalateSelectedStaff) {
                  onEscalateTask(escalateTask.id, escalateSelectedStaff)
                }
                setEscalateModalOpen(false)
              }}
            >
              Confirm Escalation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
