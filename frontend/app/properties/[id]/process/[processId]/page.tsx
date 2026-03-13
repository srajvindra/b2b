"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Settings2,
  Building2,
  Home,
  Users,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { STAFF_MEMBERS } from "@/features/leads/data/ownerDetailData"
import { PROPERTY_DATA, PROPERTY_TASKS, PROPERTY_PROCESSES } from "@/features/properties/data/propertyDetail"
import { useParams, useRouter } from "next/navigation"
import type { PropertyProcess } from "@/features/properties/types"

interface ActivityItem {
  id: string
  type: "email" | "task_completed" | "process_assigned" | "email_opened" | "note"
  actor: string
  actorInitials: string
  target?: string
  subject?: string
  preview?: string
  detail?: string
  timestamp: string
  address?: string
  noteText?: string
}

function generateActivities(propertyName: string): ActivityItem[] {
  const primaryActor = "Sarah Johnson"
  const primaryInitials = "SJ"

  const activities: ActivityItem[] = [
    {
      id: "act-1",
      type: "email",
      actor: primaryActor,
      actorInitials: primaryInitials,
      target: "Jordan Kim",
      subject: "Request for Required Information/Documents",
      preview: "Hi Jordan, I hope you are doing gre...",
      timestamp: "Today, 7:21 PM",
    },
    {
      id: "act-2",
      type: "task_completed",
      actor: primaryActor,
      actorInitials: primaryInitials,
      detail: `${primaryActor} completed "(Owner) Request for Required Information/Documents" Today, 7:21 PM`,
      timestamp: "Today, 7:21 PM",
    },
    {
      id: "act-3",
      type: "task_completed",
      actor: "Nina Patel",
      actorInitials: "NP",
      detail:
        'Nina Patel completed "Roles Assigned to Team? Signed PM agreement Attached to AF?" Friday, 11:08 PM',
      timestamp: "Friday, 11:08 PM",
    },
    {
      id: "act-4",
      type: "email_opened",
      actor: "A recipient",
      actorInitials: "",
      detail: 'A recipient opened the email "Welcome to B2B Property Management!" Friday, 10:14 PM',
      timestamp: "Friday, 10:14 PM",
    },
    {
      id: "act-5",
      type: "email_opened",
      actor: "A recipient",
      actorInitials: "",
      detail: 'A recipient opened the email "Welcome to B2B Property Management!" Friday, 8:54 PM',
      timestamp: "Friday, 8:54 PM",
    },
    {
      id: "act-6",
      type: "task_completed",
      actor: primaryActor,
      actorInitials: primaryInitials,
      detail: `${primaryActor} completed "Welcome message" Friday, 8:52 PM`,
      timestamp: "Friday, 8:52 PM",
    },
    {
      id: "act-7",
      type: "email",
      actor: primaryActor,
      actorInitials: primaryInitials,
      target: "Jordan Kim, Nina Patel, Richard Surovi",
      subject: "Welcome to B2B Property Management!",
      preview: "Hi Jordan, First off, we'd like to welcome...",
      timestamp: "Friday, 8:44 PM",
    },
    {
      id: "act-8",
      type: "task_completed",
      actor: primaryActor,
      actorInitials: primaryInitials,
      detail: `${primaryActor} completed "(Owner) Welcome Email" Friday, 8:44 PM`,
      timestamp: "Friday, 8:44 PM",
    },
    {
      id: "act-9",
      type: "process_assigned",
      actor: "Nina Patel",
      actorInitials: "NP",
      detail: "Nina Patel assigned this process to Sarah Johnson Friday, 8:12 PM",
      timestamp: "Friday, 8:12 PM",
    },
    {
      id: "act-10",
      type: "note",
      actor: "Emily Davis",
      actorInitials: "ED",
      address: propertyName || "3576 E 104th St, Cleveland, OH 44105",
      noteText: "The owner is interested in Sec 8",
      timestamp: "Friday, 7:23 PM",
    },
  ]

  return activities
}

export default function PropertyProcessDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const [showOwnerInfoModal, setShowOwnerInfoModal] = useState(false)
  const propertyId = params?.id as string
  const processId = params?.processId as string
  const [taskFilter, setTaskFilter] = useState("upcoming")
  const property = (Array.isArray(PROPERTY_DATA) ? PROPERTY_DATA : [PROPERTY_DATA]).find(
    (p) => p.id === propertyId
  ) ?? null
  const process: PropertyProcess | null =
    PROPERTY_PROCESSES.find((p: PropertyProcess) => p.id === processId) ?? null
  const activities = generateActivities(property?.name ?? "")
  const [tasks, setTasks] = useState(process?.tasks ?? [])

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter === "upcoming") return !task.completedDate
    if (taskFilter === "completed") return !!task.completedDate
    return true
  })

  type SidebarStaff = { id: string; name: string; initials: string }

  const findStaffByName = (name: string): SidebarStaff | null => {
    const match = (STAFF_MEMBERS as any[]).find((s) => s.name === name)
    if (!match) return null
    return { id: match.id, name: match.name, initials: match.initials }
  }

  const hasOverdueTasks = filteredTasks.some((task) => !task.completedDate)
  const sidebarDueDate =
    process?.tasks.find((t) => t.startDate)?.startDate ||
    process?.startedDate ||
    "2026-03-20"

  const sidebarAssignees = [
    { id: "process-owner", role: "Process Owner", defaultName: "Jason Egerton", defaultInitials: "JE" },
    { id: "agm", role: "AGM", defaultName: "Ralph", defaultInitials: "R" },
    { id: "csm", role: "CSM", defaultName: "Daniel", defaultInitials: "D" },
    { id: "lc", role: "Leasing Coordinator (LC)", defaultName: "Not Assigned", defaultInitials: "NA" },
    { id: "pm", role: "Property Manager (CSM)", defaultName: "Jason Egerton", defaultInitials: "JE" },
    { id: "qa-coordinator", role: "QA-Coordinator", defaultName: "Petra", defaultInitials: "P" },
    { id: "qa-ja", role: "QA/JA", defaultName: "You", defaultInitials: "Y" },
  ]

  const [sidebarAssignments, setSidebarAssignments] = useState<Record<string, SidebarStaff | null>>({
    "process-owner": findStaffByName("Jason Egerton"),
    agm: findStaffByName("Ralph"),
    csm: findStaffByName("Daniel"),
    lc: null,
    pm: findStaffByName("Jason Egerton"),
    "qa-coordinator": findStaffByName("Petra"),
    "qa-ja": null,
  })
  const [activeSidebarPopover, setActiveSidebarPopover] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6 h-[calc(100vh-112px)]">
      <div className="min-w-0 space-y-0 overflow-y-auto pr-2">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/properties/${propertyId}`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            {process?.processName ?? "Process"} for {PROPERTY_DATA.name ?? ""}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings2 className="h-4 w-4" />
          </Button>

        </div>
      </div>

      {/* Property Header Card */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-800">
                    {PROPERTY_DATA.address}, {PROPERTY_DATA.city}, {PROPERTY_DATA.state} {PROPERTY_DATA.zip}
                  </h1>
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                  >
                    {PROPERTY_DATA.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    {PROPERTY_DATA.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <span>Total Units: <span className="font-medium text-foreground">{PROPERTY_DATA.units.length}</span></span>
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <span>Occupied: <span className="font-medium text-emerald-600">{PROPERTY_DATA.units.filter(u => u.status === "Occupied").length}</span></span>
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <span>Vacant: <span className="font-medium text-amber-600">{PROPERTY_DATA.units.filter(u => u.status !== "Occupied").length}</span></span>
                  </span>
                </div>
              </div>
            </div>
            {/* Right-aligned actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent h-8" onClick={() => setShowOwnerInfoModal(true)}>
                <Users className="h-4 w-4 text-teal-600" />
                <span>Owner Info</span>
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>


      {/* Tasks Section */}
      <div className="border-t pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Tasks</h3>
          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="w-[130px] h-8 text-sm justify-between text-left">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          {filteredTasks.map((task) => {
            const initials = (task.staffMember || "")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
            const isCompleted = !!task.completedDate
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <button
                  type="button"
                  className="flex items-center gap-2 shrink-0 cursor-pointer"
                  onClick={() => {
                    if (isCompleted) return
                    const today = new Date().toISOString().split("T")[0]
                    setTasks(prev =>
                      prev.map(t =>
                        t.id === task.id ? { ...t, completedDate: t.completedDate || today } : t,
                      ),
                    )
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                  {isCompleted ? (
                    <Mail className="h-4 w-4 text-blue-500" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {task.taskName}
                  </p>
                  {!isCompleted && process && (
                    <p className="text-xs text-amber-600 mt-0.5">{process.processName}</p>
                  )}
                </div>

                {!isCompleted && (
                  <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0">
                    <FileText className="h-3.5 w-3.5" />
                    Instructions
                  </button>
                )}

                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[10px] bg-amber-100 text-amber-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 w-[80px]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{task.completedDate || task.startDate || "Pending"}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}

          {filteredTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No {taskFilter} tasks.</p>
          )}

          {/* Static property-level tasks */}
          {/* <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-semibold text-foreground mb-3">Related Property Tasks</h4>
            <div className="space-y-1">
              {PROPERTY_TASKS.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <Circle className="h-4 w-4 text-gray-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {task.relatedEntity} {task.processLink ? `• ${task.processLink}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 text-xs">
                    <span className="text-muted-foreground">
                      Due:{" "}
                      <span className="font-medium">
                        {task.dueDate}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Assigned to: <span className="font-medium">{task.assignedTo}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="border-t pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            {/* <ArrowLeft className="h-4 w-4" /> */}
            {process?.processName ?? "Process"} for {property?.name ?? ""}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          {activities.map((activity) => {
            if (activity.type === "email") {
              return (
                <div key={activity.id} className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 mb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                      <AvatarFallback className="text-xs bg-amber-100 text-amber-700">
                        {activity.actorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.actor}</span>
                          <span className="text-muted-foreground"> emailed </span>
                          <span className="font-semibold">{activity.target}</span>
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{activity.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <p className="text-sm text-foreground font-medium">{activity.subject}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.preview}</p>
                    </div>
                  </div>
                </div>
              )
            }

            if (
              activity.type === "task_completed" ||
              activity.type === "email_opened" ||
              activity.type === "process_assigned"
            ) {
              const iconColor =
                activity.type === "task_completed"
                  ? "text-green-500"
                  : activity.type === "email_opened"
                    ? "text-blue-400"
                    : "text-rose-400"
              const Icon =
                activity.type === "task_completed" ? CheckCircle2 : activity.type === "email_opened" ? Mail : Phone
              return (
                <div key={activity.id} className="flex items-center gap-3 py-2 px-4">
                  <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
                  <p className="text-xs text-muted-foreground">{activity.detail}</p>
                </div>
              )
            }

            if (activity.type === "note") {
              return (
                <div key={activity.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 mb-3 mt-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                      <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                        {activity.actorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.actor}</span>
                          <span className="text-muted-foreground"> left a </span>
                          <span className="font-semibold">Note</span>
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{activity.timestamp}</span>
                      </div>
                      {activity.address && (
                        <a href="#" className="text-sm text-blue-600 underline mt-1 block">
                          {activity.address}
                        </a>
                      )}
                      {activity.noteText && (
                        <p className="text-sm text-foreground mt-0.5">{activity.noteText}</p>
                      )}
                    </div>
                    <div className="shrink-0 mt-0.5">
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              )
            }

            return null
          })}
        </div>
      </div>

      </div>

      {/* Right sidebar */}
      <div className="w-[320px] shrink-0 hidden xl:block">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Due Dates</h3>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {hasOverdueTasks ? "Tasks Overdue" : "On Track"}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-slate-700">Due At</span>
                <span className="text-slate-900 text-sm">{sidebarDueDate || "Not set"}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                Why?
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-slate-900">Assignees</h3>
                <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <span className="text-[11px] text-slate-500">Why?</span>
            </div>
            <div className="space-y-1.5 text-sm">
              {sidebarAssignees.map((assignee) => {
                const current = sidebarAssignments[assignee.id]
                const displayName = current?.name ?? assignee.defaultName
                const displayInitials = current?.initials ?? assignee.defaultInitials

                return (
                  <Popover
                    key={assignee.id}
                    open={activeSidebarPopover === assignee.id}
                    onOpenChange={(open) =>
                      setActiveSidebarPopover(open ? assignee.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-slate-50 text-left"
                      >
                        <div className="flex items-center gap-2 text-left">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[11px] bg-slate-100 text-slate-700">
                              {displayInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col leading-tight text-left items-start">
                            <span className="text-xs text-slate-500 text-left">{assignee.role}</span>
                            <span className="text-sm font-medium text-slate-900 text-left">{displayName}</span>
                          </div>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search staff..." className="h-8" />
                        <CommandList className="max-h-56">
                          <CommandEmpty>No staff found.</CommandEmpty>
                          <CommandGroup heading="Staff">
                            {(STAFF_MEMBERS as any[]).map((staff) => (
                              <CommandItem
                                key={staff.id}
                                value={staff.name}
                                onSelect={() => {
                                  setSidebarAssignments((prev) => ({
                                    ...prev,
                                    [assignee.id]: {
                                      id: staff.id,
                                      name: staff.name,
                                      initials: staff.initials,
                                    },
                                  }))
                                  setActiveSidebarPopover(null)
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-[11px] bg-slate-100 text-slate-700">
                                    {staff.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm">{staff.name}</span>
                                  {staff.department && (
                                    <span className="text-[11px] text-muted-foreground">
                                      {staff.department}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandGroup heading="Actions">
                            <CommandItem
                              value="not-assigned"
                              onSelect={() => {
                                setSidebarAssignments((prev) => ({
                                  ...prev,
                                  [assignee.id]: null,
                                }))
                                setActiveSidebarPopover(null)
                              }}
                            >
                              <span className="text-sm text-muted-foreground">Clear (Not Assigned)</span>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
