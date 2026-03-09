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
import type { ProcessData, ActivityItem, ContactProcessDetailViewProps } from "../types"
import { stageColors } from "../data/contactDetailMock"

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

export function ContactProcessDetailView({ process, contactName, onBack }: ContactProcessDetailViewProps) {
  const [taskFilter, setTaskFilter] = useState("upcoming")
  const activities = generateActivities(process, contactName)

  const stageName = process.prospectingStage || process.leaseProspectStage || "In Progress"
  const totalStages = 4
  const completedTasks = process.tasks.filter(t => t.completedDate).length
  const totalTasks = process.tasks.length
  const currentStageIndex = Math.min(
    Math.floor((completedTasks / Math.max(totalTasks, 1)) * totalStages),
    totalStages - 1
  )

  const filteredTasks = process.tasks.filter(task => {
    if (taskFilter === "upcoming") return !task.completedDate
    if (taskFilter === "completed") return !!task.completedDate
    return true
  })

  return (
    <div className="space-y-0">
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
      <div className="py-5">
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
      </div>

      {/* Tasks Section */}
      <div className="border-t pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Tasks</h3>
          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
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
                <div className="flex items-center gap-2 shrink-0">
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
                </div>

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
      <div className="border-t pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
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
  )
}
