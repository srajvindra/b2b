"use client"

import { useState } from "react"
import {
  CheckSquare,
  FileText,
  Calendar,
  File,
  Plus,
  MoreHorizontal,
  Search,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  CalendarPlus,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface QuickActionsSidebarProps {
  contactFilter?: "all" | "owners" | "tenants"
}

export function QuickActionsSidebar({ contactFilter = "all" }: QuickActionsSidebarProps) {
  const [activeTab, setActiveTab] = useState("tasks")

  const quickActions = [
    { icon: Mail, label: "Send Email" },
    { icon: MessageSquare, label: "Send SMS" },
    { icon: Phone, label: "Log Call" },
    { icon: StickyNote, label: "Add Note" },
    { icon: CalendarPlus, label: "Schedule Meeting" },
    { icon: Users, label: "Reassign Lead" },
  ]

  return (
    <aside className="w-[280px] border-l bg-card/40 hidden xl:flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b flex items-center justify-between bg-background/50 backdrop-blur">
        <h2 className="font-semibold text-base text-gray-800">Quick Actions</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Action Tiles - teal to gray */}
      <div className="p-3 border-b">
        <div className="flex flex-col gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left transition-colors hover:bg-gray-50 hover:border-gray-400"
            >
              <action.icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-2">
        <Tabs defaultValue="tasks" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="tasks" title="Tasks">
              <CheckSquare className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="notes" title="Notes">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="calendar" title="Appointments">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="docs" title="Documents">
              <File className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {activeTab === "tasks" && <TasksSection filter={contactFilter} />}
          {activeTab === "notes" && <NotesSection />}
          {activeTab === "calendar" && <AppointmentsSection />}
          {activeTab === "docs" && <DocumentsSection />}
        </div>
      </ScrollArea>
    </aside>
  )
}

function TasksSection({ filter }: { filter: "all" | "owners" | "tenants" }) {
  const allTasks = [
    { id: 1, title: "Call owner about PMA", due: "Today", priority: "High", type: "owner" },
    { id: 2, title: "Schedule HVAC check", due: "Tomorrow", priority: "Medium", type: "tenant" },
    { id: 3, title: "Review lease renewal", due: "Nov 25", priority: "Low", type: "tenant" },
    { id: 4, title: "Send welcome packet", due: "Nov 26", priority: "Medium", type: "tenant" },
    { id: 5, title: "Owner distribution", due: "Nov 30", priority: "High", type: "owner" },
  ]

  const tasks = allTasks.filter((t) => {
    if (filter === "all") return true
    return t.type === filter.slice(0, -1)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-gray-600" />
          {filter === "all" ? "My Tasks" : filter === "owners" ? "Owner Tasks" : "Tenant Tasks"}
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
        <Input placeholder="Filter tasks..." className="h-8 pl-7 text-xs" />
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No tasks found for {filter}.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 group">
              <Checkbox id={`task-${task.id}`} className="mt-1" />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${task.priority === "High" ? "text-red-500" : "text-muted-foreground"}`}>
                    {task.due}
                  </span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
        View All Tasks
      </Button>
    </div>
  )
}

function NotesSection() {
  const notes = [
    { id: 1, title: "Meeting with Raj", preview: "Discussed Q4 goals and property...", date: "2h ago" },
    { id: 2, title: "Unit 4B Inspection", preview: "Carpet needs cleaning, paint...", date: "Yesterday" },
    { id: 3, title: "Vendor List Update", preview: "Added new plumbing service...", date: "Nov 20" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-600" />
          Recent Notes
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-medium">{note.title}</h4>
              <span className="text-[10px] text-muted-foreground">{note.date}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{note.preview}</p>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
        View All Notes
      </Button>
    </div>
  )
}

function AppointmentsSection() {
  const appointments = [
    { id: 1, title: "Property Viewing", time: "10:00 AM", loc: "14 Oak Ave" },
    { id: 2, title: "Staff Meeting", time: "2:00 PM", loc: "Conference Room A" },
    { id: 3, title: "Key Handover", time: "4:30 PM", loc: "Front Desk" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          Today's Schedule
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-0 relative border-l-2 border-muted ml-2 pl-4 py-1">
        {appointments.map((apt) => (
          <div key={apt.id} className="mb-6 last:mb-0 relative">
            <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gray-600 ring-4 ring-background" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600">{apt.time}</p>
              <h4 className="text-sm font-medium">{apt.title}</h4>
              <p className="text-xs text-muted-foreground">{apt.loc}</p>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
        Open Calendar
      </Button>
    </div>
  )
}

function DocumentsSection() {
  const docs = [
    { id: 1, name: "Lease_Agreement_v2.pdf", size: "2.4 MB", type: "PDF" },
    { id: 2, name: "Unit_Photos_Nov.zip", size: "15 MB", type: "ZIP" },
    { id: 3, name: "Insurance_Policy.pdf", size: "1.1 MB", type: "PDF" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <File className="h-4 w-4 text-gray-600" />
          Recent Documents
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {doc.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{doc.size}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
        File Manager
      </Button>
    </div>
  )
}
