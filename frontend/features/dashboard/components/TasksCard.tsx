"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckSquare,
  AlertCircle,
  Clock,
  Eye,
  Pencil,
  Check,
  Workflow,
  Plus,
  Search,
  ChevronsUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

interface TasksCardProps {
  filteredTasks: Task[]
  taskSummary: TaskSummary
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedStaff: string | null
  staffMembers: StaffMember[]
  onAssignTask: (taskId: number, staffName: string) => void
}

export function TasksCard({
  filteredTasks,
  taskSummary,
  searchQuery,
  setSearchQuery,
  selectedStaff,
  staffMembers,
  onAssignTask,
}: TasksCardProps) {
  const router = useRouter()
  const [showSkippedModal, setShowSkippedModal] = useState(false)
  const [selectedSkippedTask, setSelectedSkippedTask] = useState<{
    title: string
    skippedComment: string
  } | null>(null)
  const [assignPopoverOpen, setAssignPopoverOpen] = useState<number | null>(null)

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
    if (!task.processEntityType) return
    if (task.processEntityType === "tenant")
      router.push("/contacts/tenants?tab=processes")
    else if (task.processEntityType === "owner")
      router.push("/contacts/owners?tab=processes")
    else if (task.processEntityType === "prospectOwner")
      router.push("/leads/owners?tab=processes")
    else if (task.processEntityType === "leaseProspect")
      router.push("/leads/tenants?tab=processes")
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
                    <TableHead className="font-medium text-slate-700">
                      Status
                    </TableHead>
                    <TableHead className="font-medium text-slate-700">
                      Assigned To
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
                                  e.stopPropagation()
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
                          {task.risk}
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
                        <TableCell>
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
                        </TableCell>
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
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTaskClick(task)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {task.status !== "Completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-500 hover:text-emerald-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
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
    </>
  )
}
