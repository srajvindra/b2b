"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ChevronDown,
  Mail,
  Phone,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Settings2,
  User,
  MapPin,
  ExternalLink,
  Plus,
  Calendar,
  Users,
  X,
  Search,
  Check,
  ListTodo,
  PlayCircle,
  AlertTriangle,
  HelpCircle,
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ProcessData, ActivityItem, ContactProcessDetailViewProps } from "../types"
import { stageColors } from "../data/contactDetailMock"
import { Input } from "@/components/ui/input"
import type { AssignedTeamMember } from "@/features/contacts/types"


function generateActivities(process: ProcessData, contactName: string): ActivityItem[] {
  const staffNames = [...new Set(process.tasks.map(t => t.staffName))]
  const primaryStaff = staffNames[0] || "Amanda Harris"
  const primaryInitials = primaryStaff.split(" ").map(n => n[0]).join("")

  const activities: ActivityItem[] = [
    {
      id: "act-1",
      type: "email",
      actor: primaryStaff,
      actorInitials: primaryInitials,
      target: contactName,
      subject: "Request for Required Information/Documents",
      preview: `Hi ${contactName.split(" ")[0]}, I hope you are doing gre...`,
      timestamp: "Today, 7:21 PM",
    },
    {
      id: "act-2",
      type: "task_completed",
      actor: primaryStaff,
      actorInitials: primaryInitials,
      detail: `${primaryStaff} completed "(Owner) Request for Required Information/Documents" Today, 7:21 PM`,
      timestamp: "Today, 7:21 PM",
    },
  ]

  if (staffNames[1]) {
    activities.push({
      id: "act-3",
      type: "task_completed",
      actor: staffNames[1],
      actorInitials: staffNames[1].split(" ").map(n => n[0]).join(""),
      detail: `${staffNames[1]} completed "Roles Assigned to Team? Signed PM agreement Attached to AF?" Friday, 11:08 PM`,
      timestamp: "Friday, 11:08 PM",
    })
  }

  activities.push(
    {
      id: "act-4",
      type: "email_opened",
      actor: "A recipient",
      actorInitials: "",
      detail: `A recipient opened the email "Welcome to B2B Property Management!" Friday, 10:14 PM`,
      timestamp: "Friday, 10:14 PM",
    },
    {
      id: "act-5",
      type: "email_opened",
      actor: "A recipient",
      actorInitials: "",
      detail: `A recipient opened the email "Welcome to B2B Property Management!" Friday, 8:54 PM`,
      timestamp: "Friday, 8:54 PM",
    },
    {
      id: "act-6",
      type: "task_completed",
      actor: primaryStaff,
      actorInitials: primaryInitials,
      detail: `${primaryStaff} completed "Welcome message" Friday, 8:52 PM`,
      timestamp: "Friday, 8:52 PM",
    },
  )

  const recipientList = [contactName, ...(staffNames.length > 1 ? staffNames.slice(1, 3) : ["Daniel", "Ralph"])]
  activities.push(
    {
      id: "act-7",
      type: "email",
      actor: primaryStaff,
      actorInitials: primaryInitials,
      target: recipientList.join(", "),
      subject: "Welcome to B2B Property Management!",
      preview: `Hi ${contactName.split(" ")[0]}, First off, we'd like to welcome...`,
      timestamp: "Friday, 8:44 PM",
    },
    {
      id: "act-8",
      type: "task_completed",
      actor: primaryStaff,
      actorInitials: primaryInitials,
      detail: `${primaryStaff} completed "(Owner) Welcome Email" Friday, 8:44 PM`,
      timestamp: "Friday, 8:44 PM",
    },
  )

  if (staffNames[1]) {
    activities.push({
      id: "act-9",
      type: "process_assigned",
      actor: staffNames[1],
      actorInitials: staffNames[1].split(" ").map(n => n[0]).join(""),
      detail: `${staffNames[1]} assigned this process to ${primaryStaff} Friday, 8:12 PM`,
      timestamp: "Friday, 8:12 PM",
    })
  }

  activities.push({
    id: "act-10",
    type: "note",
    actor: staffNames[staffNames.length - 1] || "Alex Rehman",
    actorInitials: (staffNames[staffNames.length - 1] || "Alex Rehman").split(" ").map(n => n[0]).join(""),
    address: "3576 E 104th St, Cleveland, OH 44105",
    noteText: "The owner is interested in Sec 8",
    timestamp: "Friday, 7:23 PM",
  })

  return activities
}
import {
  STAGES,
  STAGE_PROGRESS_COLORS,
  STAGE_TASKS,
  STAGE_REASONS,
  STAFF_MEMBERS,
  DEPARTMENTS,

} from "@/features/leads/data/ownerDetailData"

export function ContactProcessDetailView({ process, contactName, onBack, ownerInfo: ownerInfoProp }: ContactProcessDetailViewProps) {
  const [taskFilter, setTaskFilter] = useState("upcoming")
  const [tasks, setTasks] = useState(process.tasks)
  const activities = generateActivities(process, contactName)

  const [teamPopoverOpen, setTeamPopoverOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const stageIndex = STAGES.findIndex(
    (s) => s.toLowerCase() === (process.prospectingStage || process.leaseProspectStage || "").toLowerCase()
  )

  const [currentStage, setCurrentStage] = useState(stageIndex >= 0 ? stageIndex : 0)
  const ownerInfo = {
    name: ownerInfoProp?.name ?? contactName,
    primaryEmail: ownerInfoProp?.primaryEmail ?? "",
    secondaryEmail: ownerInfoProp?.secondaryEmail ?? "",
    primaryPhone: ownerInfoProp?.primaryPhone ?? "",
    secondaryPhone: ownerInfoProp?.secondaryPhone ?? "",
    leadSource: ownerInfoProp?.leadSource ?? "",
    address: ownerInfoProp?.address ?? "",
    startDate: ownerInfoProp?.startDate ?? "",
    closeDate: ownerInfoProp?.closeDate ?? "",
  }

  const toDateInputValue = (s: string | undefined): string => {
    if (!s) return ""
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
    const d = new Date(s)
    if (Number.isNaN(d.getTime())) return ""
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const [assignedTeam, setAssignedTeam] = useState([STAFF_MEMBERS[0]])

  const [editableCreatedAt, setEditableCreatedAt] = useState(() => toDateInputValue(ownerInfo.startDate))
  const [editableClosedAt, setEditableClosedAt] = useState(() => toDateInputValue(ownerInfo.closeDate))

  const stageName = process.prospectingStage || process.leaseProspectStage || "In Progress"
  const totalStages = 4
  const completedTasks = tasks.filter(t => t.completedDate).length
  const totalTasks = tasks.length
  const currentStageIndex = Math.min(
    Math.floor((completedTasks / Math.max(totalTasks, 1)) * totalStages),
    totalStages - 1
  )

  const filteredTasks = tasks.filter(task => {
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

  const hasOverdueTasks = filteredTasks.some(task => !task.completedDate)
  const sidebarDueDate =
    process.completedOn ||
    process.startedOn ||
    tasks.find(t => t.startDate)?.startDate ||
    editableClosedAt ||
    editableCreatedAt ||
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
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{process.name} for {contactName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings2 className="h-4 w-4" />
          </Button>

        </div>
      </div>

      {/* Stage Progress */}
      {/* <div className="py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-teal-600 font-medium">Stage: {stageName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-teal-600" />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalStages }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-sm ${
                i <= currentStageIndex ? stageColors[i % stageColors.length] : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div> */}
      {/* Owner Info Card */}
      <div className="rounded-lg p-4 mb-6 bg-[rgba(248,245,245,1)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-teal-100 text-teal-600">
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{ownerInfo.name}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Primary:</span>
                  <a href={`mailto:${ownerInfo.primaryEmail}`} className="text-teal-600 hover:underline">
                    {ownerInfo.primaryEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Primary:</span>
                  <a href={`tel:${ownerInfo.primaryPhone}`} className="text-teal-600 hover:underline">
                    {ownerInfo.primaryPhone}
                  </a>
                </div>
                {ownerInfo.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{ownerInfo.address}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ownerInfo.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Open address in maps"
                    >
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Source:</span>
                  <span className="text-foreground">{ownerInfo.leadSource}</span>
                </div>
                {ownerInfo.secondaryEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground opacity-0" />
                    <span className="text-muted-foreground">Secondary:</span>
                    <a href={`mailto:${ownerInfo.secondaryEmail}`} className="text-teal-600 hover:underline">
                      {ownerInfo.secondaryEmail}
                    </a>
                  </div>
                )}
                {ownerInfo.secondaryPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground opacity-0" />
                    <span className="text-muted-foreground">Secondary:</span>
                    <a href={`tel:${ownerInfo.secondaryPhone}`} className="text-teal-600 hover:underline">
                      {ownerInfo.secondaryPhone}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm items-center">

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground shrink-0">Created at:</span>
                  <Input
                    type="date"
                    value={editableCreatedAt}
                    onChange={(e) => setEditableCreatedAt(e.target.value)}
                    className="h-9 w-[140px] text-blue-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground shrink-0">Closed at:</span>
                  <Input
                    type="date"
                    value={editableClosedAt}
                    onChange={(e) => setEditableClosedAt(e.target.value)}
                    className="h-9 w-[140px] text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Popover open={teamPopoverOpen} onOpenChange={setTeamPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent h-8">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Richard Surovi</span>

                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[340px] p-0" align="start">
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Assigned Team Members</h4>
                      {assignedTeam.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => setAssignedTeam([])}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    {/* Currently Assigned */}
                    {assignedTeam.length > 0 ? (
                      <div className="space-y-2">
                        {assignedTeam.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className={`text-xs ${member.color}`}>{member.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.department}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => setAssignedTeam(assignedTeam.filter(t => t.id !== member.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">No team members assigned</p>
                    )}
                  </div>

                  {/* Add Team Member */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Add Team Member</h4>
                      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-[130px] h-7 text-xs">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Command className="border rounded-md">
                      <CommandInput placeholder="Search staff..." className="h-8" />
                      <CommandList className="max-h-[180px]">
                        <CommandEmpty>No staff found.</CommandEmpty>
                        <CommandGroup>
                          {STAFF_MEMBERS
                            .filter(staff => !assignedTeam.some(t => t.id === staff.id))
                            .filter(staff => departmentFilter === "all" || staff.department === departmentFilter)
                            .map((staff) => (
                              <CommandItem
                                key={staff.id}
                                value={staff.name}
                                onSelect={() => {
                                  setAssignedTeam([...assignedTeam, staff])
                                }}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className={`text-xs ${staff.color}`}>{staff.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm">{staff.name}</p>
                                  <p className="text-xs text-muted-foreground">{staff.department}</p>
                                </div>
                                <Plus className="h-4 w-4 text-muted-foreground" />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

          </div>
        </div>

        {/* Stage Progress Rectangles */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1 flex-1">
            {STAGES.map((stage, index) => {
              const tasks = STAGE_TASKS[stage] || []
              return (
                <TooltipProvider key={stage} delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-7 flex-1 rounded-sm flex items-center justify-center transition-all hover:opacity-80 hover:scale-y-110"
                        style={{ backgroundColor: STAGE_PROGRESS_COLORS[index] }}
                      >
                        {index === currentStage && (
                          <Check className="h-4 w-4 text-white drop-shadow-sm" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-white text-foreground border border-border shadow-lg rounded-md px-3 py-2.5 max-w-[220px]">
                      <p className="font-semibold text-[13px] text-foreground">{stage}</p>
                      {STAGE_REASONS[stage] ? (
                        <p className="text-[12px] text-foreground/70 mt-1.5 italic">{STAGE_REASONS[stage]}</p>
                      ) : tasks.length > 0 ? (
                        <div className="flex flex-col gap-1.5 mt-1.5">
                          {tasks.map((task, taskIdx) => (
                            <div key={taskIdx} className="flex items-center gap-2 text-[12px] text-foreground/70">
                              {task.icon === "call" && <Phone className="h-3.5 w-3.5 shrink-0" />}
                              {task.icon === "email" && <Mail className="h-3.5 w-3.5 shrink-0" />}
                              {task.icon === "sms" && <MessageSquare className="h-3.5 w-3.5 shrink-0" />}
                              {task.icon === "todo" && <ListTodo className="h-3.5 w-3.5 shrink-0" />}
                              {task.icon === "video" && <PlayCircle className="h-3.5 w-3.5 shrink-0" />}
                              <span>{task.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] text-foreground/60 mt-1.5">No tasks assigned</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>

          {/* Stage Dropdown */}
          <Select value={currentStage.toString()} onValueChange={(value) => setCurrentStage(Number.parseInt(value))}>
            <SelectTrigger className="w-[160px] h-9 bg-white border-slate-200">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((stage, index) => (
                <SelectItem key={stage} value={index.toString()}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: STAGE_PROGRESS_COLORS[index] }}
                    />
                    {stage}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
            const initials = task.staffName.split(" ").map(n => n[0]).join("")
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
                    {task.name}
                  </p>
                  {!isCompleted && (
                    <p className="text-xs text-amber-600 mt-0.5">{process.name}</p>
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
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="border-t pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            {/* <ArrowLeft className="h-4 w-4" /> */}
            {process.name} for {contactName}
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

            if (activity.type === "task_completed" || activity.type === "email_opened" || activity.type === "process_assigned") {
              const iconColor = activity.type === "task_completed" ? "text-green-500"
                : activity.type === "email_opened" ? "text-blue-400"
                  : "text-rose-400"
              const Icon = activity.type === "task_completed" ? CheckCircle2
                : activity.type === "email_opened" ? Mail
                  : Phone
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
                        <a href="#" className="text-sm text-blue-600 underline mt-1 block">{activity.address}</a>
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
                          {/* <CommandGroup heading="Actions">
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
                          </CommandGroup> */}
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
