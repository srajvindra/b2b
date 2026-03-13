"use client"

import type React from "react"
import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  Building2,
  FileText,
  Plus,
  Home,
  Users,
  CheckCircle2,
  Upload,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Clock,
  Paperclip,
  History,
  Camera,
  StickyNote,
  CheckSquare,
  Check,
  FolderPlus,
  Lock,
  Link2,
  BookOpen,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LayoutDashboard,
  ClipboardList,
  Eye,
  CheckCircle,
  Edit,
  Search,
  Trash2,
  DollarSign,
  CreditCard,
  Banknote,
  FileBarChart,
  Package,
  Wrench,
  Download,
  HelpCircle,
  Workflow,
  MoreVertical,
  MapPin,
  Mail,
  Phone,
  X,
  MessageSquare,
  AlertTriangle,
  ListTodo,
  RotateCcw,
  FileWarning,
  Megaphone,
  Info,
  ExternalLink,
  Share2,
  Copy,
  Minus,
  Maximize2,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar" // Import Avatar components

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useNav } from "@/components/dashboard-app"
import { useQuickActions } from "@/context/QuickActionsContext"
import { propertyDetailQuickActions } from "@/lib/quickActions"
import {
  PROPERTY_DATA,
  PROPERTY_TASKS,
  STAFF_MEMBERS,
  DOCUMENT_TYPES,
  SAMPLE_DOCUMENTS,
  FEDERAL_TAX_INFO,
  ACCOUNTING_INFO,
  BANK_ACCOUNT_INFO,
  OWNER_STATEMENT_INFO,
  OWNER_PACKET_INFO,
  MAINTENANCE_INFO_EXTENDED,
  PROPERTY_AUDIT_LOGS,
  ACTIVITY_LABELS,
  PROPERTY_PROCESSES,
} from "@/features/properties/data/propertyDetail"
import { PROPERTY_MISSING_FIELDS, PROPERTY_MISSING_DOCUMENTS } from "@/features/properties/data/propertyDetail"
import type { ProcessTask, PropertyProcess } from "@/features/properties/types"
import { useRouter } from "next/navigation"


interface PropertyDetailPageProps {
  propertyId?: string
  onBack?: () => void
  onUnitClick?: (unitNumber: string) => void // Added for consistency with usage
}

const PROPERTY_CUSTOM_FIELD_SECTIONS: { id: string; name: string }[] = [
  { id: "property-information", name: "Property Information" },
  { id: "maintenance-information", name: "Maintenance Information" },
  { id: "notes", name: "Notes" },
  { id: "rental-information", name: "Rental Information" },
  { id: "amenities", name: "Amenities" },
]

interface PropertyCustomField {
  id: string
  sectionId: string
  name: string
  type: string
  options?: string[]
  required: boolean
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  actions,
  headerColor = "bg-gray-100",
  sectionId,
  onAddField,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  actions?: React.ReactNode
  headerColor?: string
  sectionId?: string
  onAddField?: (sectionId: string) => void
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
      <div
        className={`flex items-center justify-between px-4 py-3 ${headerColor} text-foreground cursor-pointer hover:bg-gray-200/70 transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {sectionId && onAddField && (
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                onClick={() => onAddField(sectionId)}
              >
                <Plus className="h-3 w-3" />
                Add Field
              </Button>
            </div>
          )}
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  )
}

function SectionHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
      <h3 className="text-primary font-semibold">{title}</h3>
      {actions}
    </div>
  )
}

function InfoRow({ label, value, className = "" }: { label: React.ReactNode; value: React.ReactNode; className?: string }) {
  return (
    <div className={`flex justify-between py-2 border-b border-border/50 ${className}`}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground text-sm font-medium text-right">{value || "-"}</span>
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function PropertyDetailPage({ propertyId, onBack, onUnitClick }: PropertyDetailPageProps) {
  useQuickActions(propertyDetailQuickActions, {
    subtitle: "Property",
    aiSuggestedPrompts: [
      "Summarize this property",
      "List open tasks for this property",
      "Show unit occupancy",
    ],
    aiPlaceholder: "Ask about this property...",
  })
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "tasks" | "media" | "processes" | "marketing" | "maintenance" | "audit-log">("overview")
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
  })
  const [tasks, setTasks] = useState(PROPERTY_TASKS)

  // Property custom fields (Overview tab)
  const [showAddCustomFieldDialog, setShowAddCustomFieldDialog] = useState(false)
  const [customFieldSection, setCustomFieldSection] = useState<string>(PROPERTY_CUSTOM_FIELD_SECTIONS[0]?.id ?? "")
  const [customFieldName, setCustomFieldName] = useState("")
  const [customFieldType, setCustomFieldType] = useState("dropdown-multi")
  const [customFieldOptions, setCustomFieldOptions] = useState("")
  const [customFieldRequired, setCustomFieldRequired] = useState(false)
  const [propertyCustomFields, setPropertyCustomFields] = useState<PropertyCustomField[]>([])

  const handleOpenAddField = (sectionId: string) => {
    setCustomFieldSection(sectionId)
    setShowAddCustomFieldDialog(true)
  }

  const getFieldsForSection = (sectionId: string) =>
    propertyCustomFields.filter((f) => f.sectionId === sectionId)

  const [propertyProcesses, setPropertyProcesses] = useState<PropertyProcess[]>(PROPERTY_PROCESSES)

  const [processSubTab, setProcessSubTab] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<Set<string>>(new Set())
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)
  const [showCreateProcessModal, setShowCreateProcessModal] = useState(false)
  const [showEditProcessModal, setShowEditProcessModal] = useState(false)
  const [showDeleteProcessModal, setShowDeleteProcessModal] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<PropertyProcess | null>(null)
  const [processForm, setProcessForm] = useState({
    processName: "",
    unit: "",
    currentStage: "",
    assignedRole: "",
  })

  const PROCESS_TYPES = ["Tenant Onboarding", "Maintenance Workflow", "Lease Renewal", "Move-Out Inspection", "Property Evaluation Process", "Annual Property Review", "Insurance Renewal"]
  const PROPERTY_UNITS = ["DN", "UP"]
  const ASSIGNED_ROLES = ["Accounting", "Operations", "Leasing", "Property Management"]
  const PROCESS_STAGES = ["Scheduling", "Financial Paperwork", "Work Order Review", "Tenant Notification", "Collecting Information", "In Progress", "Pending Approval", "Completed"]

  const toggleProcessExpanded = (processId: string) => {
    setExpandedProcesses((prev) => {
      const next = new Set(prev)
      if (next.has(processId)) next.delete(processId)
      else next.add(processId)
      return next
    })
  }

  const [currentShareLink, setCurrentShareLink] = useState<string | null>(null)
  const [showShareLinksDialog, setShowShareLinksDialog] = useState(false)

  const handleShareLinkClick = (linkName: string) => {
    setCurrentShareLink(linkName)
    setShowShareLinksDialog(true)
  }

  const inProgressProcesses = propertyProcesses.filter((p) => p.status === "In Progress")
  const completedProcesses = propertyProcesses.filter((p) => p.status === "Completed")
  const upcomingProcesses = propertyProcesses.filter((p) => p.status === "Upcoming")

  const handleMarkTaskComplete = (processId: string, taskId: string) => {
    setPropertyProcesses((prevProcesses) => {
      return prevProcesses.map((process) => {
        if (process.id !== processId) return process

        const updatedTasks = process.tasks.map((task) => {
          if (task.id !== taskId) return task
          // Mark task as complete with current date/time
          const now = new Date()
          const completedDateTime = `${now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
          return { ...task, completedDate: completedDateTime }
        })

        // Check if all tasks are now completed
        const allTasksCompleted = updatedTasks.every((task) => task.completedDate !== "")

        return {
          ...process,
          tasks: updatedTasks,
          status: allTasksCompleted ? "Completed" as const : process.status,
          stageBadge: allTasksCompleted ? "Completed" : process.stageBadge,
          stageBadgeColor: allTasksCompleted ? "green" : process.stageBadgeColor,
        }
      })
    })
  }

  const handleCreateProcess = () => {
    const newProcess: PropertyProcess = {
      id: `proc${Date.now()}`,
      processName: processForm.processName,
      stageBadge: processForm.currentStage,
      stageBadgeColor: "amber",
      startedDate: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
      status: "In Progress",
      tasks: [],
    }
    setPropertyProcesses([...propertyProcesses, newProcess])
    setShowCreateProcessModal(false)
    setProcessForm({ processName: "", unit: "", currentStage: "", assignedRole: "" })
  }

  const handleEditProcess = () => {
    if (!selectedProcess) return
    setPropertyProcesses(propertyProcesses.map(p =>
      p.id === selectedProcess.id
        ? { ...p, stageBadge: processForm.currentStage }
        : p
    ))
    setShowEditProcessModal(false)
    setSelectedProcess(null)
    setProcessForm({ processName: "", unit: "", currentStage: "", assignedRole: "" })
  }

  const handleDeleteProcess = () => {
    if (!selectedProcess) return
    setPropertyProcesses(propertyProcesses.filter(p => p.id !== selectedProcess.id))
    setShowDeleteProcessModal(false)
    setSelectedProcess(null)
  }

  const openEditModal = (process: PropertyProcess) => {
    setSelectedProcess(process)
    setProcessForm({
      processName: process.processName,
      unit: "",
      currentStage: process.stageBadge,
      assignedRole: "",
    })
    setShowEditProcessModal(true)
  }

  const openDeleteModal = (process: PropertyProcess) => {
    setSelectedProcess(process)
    setShowDeleteProcessModal(true)
  }

  // Document upload state
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showOwnerInfoModal, setShowOwnerInfoModal] = useState(false)

  // Missing info modal state
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [missingInfoTab, setMissingInfoTab] = useState<"fields" | "documents">("fields")
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [documentForm, setDocumentForm] = useState({
    type: "",
    assignedTo: "",
    comments: "",
  })

  const nav = useNav()
  const router = useRouter()
  const handleUnitClick = (unitNumber: string) => {
    // Use the passed onUnitClick prop if available, otherwise use nav.go
    if (onUnitClick) {
      onUnitClick(unitNumber)
    } else {
      // nav.go("unitDetail", { id: unitNumber, propertyId })
      router.push(`/properties/${propertyId}/unit/${unitNumber}`)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 pt-2 overflow-auto">
        {/* Main Layout with Quick Actions Sidebar */}
        <div className="flex gap-6">
          {/* Left side - Main Content */}
          <div className="flex-1">
            {/* Back Button */}
            <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Properties</span>
            </button>

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

            {/* Information Bars */}
            <div className="space-y-2 mb-4">
              {/* Bar 1: Pending Actions */}
              <div className="flex items-center justify-between px-5 py-2.5 rounded-lg border border-amber-300 bg-amber-50/80">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Pending Actions</span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMissingInfoTab("fields")
                      setShowMissingInfoModal(true)
                    }}
                    className="flex items-center gap-1.5 px-3 border-r border-amber-300 hover:underline"
                  >
                    <FileWarning className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      {"Missing Fields: "}
                      <span className="font-semibold">{PROPERTY_MISSING_FIELDS.length}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMissingInfoTab("documents")
                      setShowMissingInfoModal(true)
                    }}
                    className="flex items-center gap-1.5 px-3 hover:underline"
                  >
                    <Upload className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      {"Missing Documents: "}
                      <span className="font-semibold">{PROPERTY_MISSING_DOCUMENTS.length}</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Bar 2: Task Overview */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("overview")
                  setTimeout(() => {
                    const tasksSection = document.getElementById("property-tasks-section")
                    if (tasksSection) tasksSection.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }}
                className="w-full flex items-center justify-between px-5 py-2.5 rounded-lg border border-amber-300 bg-amber-50/80 hover:bg-amber-100/60 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Task Overview</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                    <ListTodo className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      {"Pending Tasks: "}
                      <span className="font-semibold">{tasks.filter(t => t.status === "In Progress" || t.status === "Pending").length}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                    <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-sm text-amber-800">
                      {"Pending Processes: "}
                      <span className="font-semibold">{inProgressProcesses.length}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-sm text-amber-700">
                      {"Overdue Tasks: "}
                      <span className="font-semibold">0</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-sm text-red-700">
                      {"Overdue Processes: "}
                      <span className="font-semibold">{propertyProcesses.filter(p => p.status === "In Progress" && new Date(p.startedDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</span>
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex">
                {[
                  { id: "overview", label: "Overview", icon: LayoutDashboard },
                  { id: "units", label: "Units", icon: Building2 },
                  { id: "processes", label: "Processes", icon: Workflow },
                  { id: "marketing", label: "Marketing", icon: Megaphone },
                  { id: "maintenance", label: "Maintenance", icon: Wrench },
                  { id: "media", label: "Documents", icon: FileText },
                  { id: "audit-log", label: "Audit Log", icon: History },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                        ? "border-2 border-teal-600 text-slate-800 -mb-px"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div>
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Tasks Section */}
                  <div id="property-tasks-section" className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Tasks ({tasks.length})</h3>
                      </div>
                      <Button
                        onClick={() => setShowNewTaskModal(true)}
                        className="bg-teal-600 text-white hover:bg-teal-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="font-medium text-muted-foreground">Task</TableHead>
                            <TableHead className="font-medium text-muted-foreground">Related Entity</TableHead>
                            <TableHead className="font-medium text-muted-foreground">Due Date</TableHead>
                            <TableHead className="font-medium text-muted-foreground">Priority</TableHead>
                            <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                            <TableHead className="font-medium text-muted-foreground">Assigned To</TableHead>
                            <TableHead className="font-medium text-muted-foreground text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                      <div className="max-h-[280px] overflow-y-auto">
                        <Table>
                          <TableBody>
                            {tasks.length > 0 ? (
                              tasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-muted/30 border-b">
                                  <TableCell className="align-top py-3">
                                    <div>
                                      <p className="font-medium text-foreground">{task.title}</p>
                                      {task.processLink && (
                                        <p className="text-sm text-teal-600 flex items-center gap-1 mt-0.5">
                                          <Link2 className="h-3 w-3" />
                                          {task.processLink}
                                        </p>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="align-top py-3 text-sm text-muted-foreground">
                                    {task.relatedEntity}
                                  </TableCell>
                                  <TableCell className="align-top py-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className={task.isOverdue ? "text-red-600 font-medium" : "text-sm"}>
                                        {task.dueDate}
                                      </span>
                                      {task.isOverdue && (
                                        <span className="text-red-500 text-sm">(Overdue)</span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="align-top py-3">
                                    <Badge
                                      variant="outline"
                                      className={
                                        task.priority === "High"
                                          ? "bg-red-50 text-red-600 border-red-200"
                                          : task.priority === "Medium"
                                            ? "bg-teal-50 text-teal-600 border-teal-200"
                                            : "bg-gray-50 text-gray-600 border-gray-200"
                                      }
                                    >
                                      {task.priority}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="align-top py-3">
                                    <Badge
                                      variant="outline"
                                      className={
                                        task.status === "Pending"
                                          ? "bg-teal-50 text-teal-600 border-teal-300"
                                          : task.status === "In Progress"
                                            ? "bg-teal-600 text-white border-teal-600"
                                            : "bg-gray-100 text-gray-600 border-gray-300"
                                      }
                                    >
                                      {task.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="align-top py-3 text-sm">
                                    {task.assignedTo}
                                  </TableCell>
                                  <TableCell className="align-top py-3">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                  No tasks found for this property. Click "Add Task" to create one.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                  {/* Property Information - Expanded */}
                  <CollapsibleSection
                    title="Property Information"
                    icon={Building2}
                    defaultOpen={true}
                    sectionId="property-information"
                    onAddField={handleOpenAddField}
                    actions={
                      <Button size="sm" variant="outline" className="bg-white text-primary hover:bg-gray-50 h-7 border-gray-300">
                        Edit
                      </Button>
                    }
                  >
                    <div className="grid grid-cols-2 gap-x-8">
                      <div>
                        <InfoRow label="Description" value={PROPERTY_DATA.propertyInfo.description} />
                        <InfoRow label="Story Height" value={PROPERTY_DATA.propertyInfo.storyHeight} />
                        <InfoRow label="Year Built" value={PROPERTY_DATA.propertyInfo.yearBuilt} />
                        <InfoRow label="Purchase Date" value={PROPERTY_DATA.propertyInfo.purchaseDate} />
                        <InfoRow label="Purchase Price" value={PROPERTY_DATA.propertyInfo.purchasePrice} />
                        <InfoRow label="Finance Source" value={PROPERTY_DATA.propertyInfo.financeSource} />
                        <InfoRow label="Web Listing Display" value={PROPERTY_DATA.propertyInfo.webListingDisplay} />
                        <InfoRow label="Heat Type" value={PROPERTY_DATA.propertyInfo.heatType} />
                        <InfoRow label="Year Renovated" value={PROPERTY_DATA.propertyInfo.yearRenovated} />
                        <InfoRow label="Maintenance Notes" value={PROPERTY_DATA.propertyInfo.maintenanceNotes} />
                        <InfoRow label="Reserve Amount" value={PROPERTY_DATA.propertyInfo.reserveAmount} />
                        <InfoRow label="Reserve Floor Size" value={PROPERTY_DATA.propertyInfo.reserveFloorSize} />
                        <InfoRow label="Deposit Bank Account" value={PROPERTY_DATA.propertyInfo.depositBankAccount} />
                      </div>
                      <div>
                        <InfoRow label="Market Rent" value={PROPERTY_DATA.propertyInfo.marketRent} />
                        <InfoRow label="Rent Control" value={PROPERTY_DATA.propertyInfo.rentControl} />
                        <InfoRow label="Lot Size" value={PROPERTY_DATA.propertyInfo.lotSize} />
                        <InfoRow label="Living Area" value={PROPERTY_DATA.propertyInfo.livingArea} />
                        <InfoRow label="Living Area 2" value={PROPERTY_DATA.propertyInfo.livingArea2} />
                        <InfoRow label="Average Rent" value={PROPERTY_DATA.propertyInfo.averageRent} />
                        <InfoRow label="Tax Authority" value={PROPERTY_DATA.propertyInfo.taxAuthority} />
                        <InfoRow label="Account Number" value={PROPERTY_DATA.propertyInfo.accountNumber} />
                        <InfoRow label="Year Tax Bill" value={PROPERTY_DATA.propertyInfo.yearTaxBill} />
                        <InfoRow
                          label="Management Start Date"
                          value={PROPERTY_DATA.propertyInfo.managementStartDate}
                        />
                        <InfoRow label="Management End Date" value={PROPERTY_DATA.propertyInfo.managementEndDate} />
                        <InfoRow
                          label="Screening Fee Required"
                          value={PROPERTY_DATA.propertyInfo.screeningFeeRequired}
                        />
                        <InfoRow
                          label="Holding Deposit Amount"
                          value={PROPERTY_DATA.propertyInfo.holdingDepositAmount}
                        />
                      </div>
                    </div>
                    {getFieldsForSection("property-information").length > 0 && (
                      <div className="mt-4 space-y-1 border-t border-border/50 pt-3">
                        {getFieldsForSection("property-information").map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">Required</span>
                              )}
                            </span>
                            <span className="font-medium">--</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleSection>

                  {/* Maintenance Information */}
                  <CollapsibleSection
                    title="Maintenance Information"
                    icon={Wrench}
                    defaultOpen={true}
                    sectionId="maintenance-information"
                    onAddField={handleOpenAddField}
                    actions={
                      <Button variant="link" className="text-primary p-0 h-auto text-sm">
                        Edit
                      </Button>
                    }
                  >
                    <div className="grid grid-cols-1 gap-x-8">
                      <InfoRow label="Owner Specific Notes" value={MAINTENANCE_INFO_EXTENDED.ownerSpecificNotes} />
                    </div>
                    {getFieldsForSection("maintenance-information").length > 0 && (
                      <div className="mt-4 space-y-1 border-t border-border/50 pt-3">
                        {getFieldsForSection("maintenance-information").map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">Required</span>
                              )}
                            </span>
                            <span className="font-medium">--</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleSection>

                  {/* Notes */}
                  <CollapsibleSection
                    title="Notes"
                    icon={StickyNote}
                    defaultOpen={true}
                    sectionId="notes"
                    onAddField={handleOpenAddField}
                    actions={
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="bg-white text-primary hover:bg-gray-50 h-7 border-gray-300">
                          <Download className="h-4 w-4 mr-1" />
                          Download Notes
                        </Button>
                        <Button size="sm" variant="outline" className="bg-white text-primary hover:bg-gray-50 h-7 border-gray-300">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Note
                        </Button>
                      </div>
                    }
                  >
                    <p className="text-sm text-muted-foreground">No notes added</p>
                    {getFieldsForSection("notes").length > 0 && (
                      <div className="mt-4 space-y-1 border-t border-border/50 pt-3">
                        {getFieldsForSection("notes").map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">Required</span>
                              )}
                            </span>
                            <span className="font-medium">--</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleSection>

                  {/* Rental Information */}
                  <CollapsibleSection
                    title="Rental Information"
                    icon={Home}
                    defaultOpen={true}
                    sectionId="rental-information"
                    onAddField={handleOpenAddField}
                    actions={
                      <Button size="sm" variant="outline" className="bg-white text-primary hover:bg-gray-50 h-7 border-gray-300">
                        Edit
                      </Button>
                    }
                  >
                    <div className="flex gap-8">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Min Lease:</span>
                        <span className="font-medium">{PROPERTY_DATA.rentalInfo.minLease}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Max Lease:</span>
                        <span className="font-medium">{PROPERTY_DATA.rentalInfo.maxLease}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Price Range Min:</span>
                        <span className="font-medium">{PROPERTY_DATA.rentalInfo.priceRangeMin}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Price Range Max:</span>
                        <span className="font-medium">{PROPERTY_DATA.rentalInfo.priceRangeMax}</span>
                      </div>
                    </div>
                    {getFieldsForSection("rental-information").length > 0 && (
                      <div className="mt-4 space-y-1 border-t border-border/50 pt-3">
                        {getFieldsForSection("rental-information").map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">Required</span>
                              )}
                            </span>
                            <span className="font-medium">--</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleSection>

                  {/* Amenities */}
                  <CollapsibleSection
                    title="Amenities"
                    icon={CheckSquare}
                    defaultOpen={true}
                    sectionId="amenities"
                    onAddField={handleOpenAddField}
                    actions={
                      <Button size="sm" variant="outline" className="bg-white text-primary hover:bg-gray-50 h-7 border-gray-300">
                        Edit
                      </Button>
                    }
                  >
                    <div className="flex gap-4">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        Cats Allowed
                      </Badge>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        Dogs Allowed
                      </Badge>
                    </div>
                    {getFieldsForSection("amenities").length > 0 && (
                      <div className="mt-4 space-y-1 border-t border-border/50 pt-3">
                        {getFieldsForSection("amenities").map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">Required</span>
                              )}
                            </span>
                            <span className="font-medium">--</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleSection>
                </div>
              )}

              {/* Units Tab */}
              {activeTab === "units" && (
                <div className="space-y-4">
                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Units ({PROPERTY_DATA.units.length})</h3>
                      </div>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Unit
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Unit</TableHead>
                          <TableHead>BD/BA</TableHead>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Monthly Rent</TableHead>
                          <TableHead>Lease End/Start</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PROPERTY_DATA.units.map((unit) => (
                          <TableRow
                            key={unit.unit}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleUnitClick(unit.unit)}
                          >
                            <TableCell>
                              <span className="hover:underline font-medium text-[rgba(1,96,209,1)]">
                                {unit.unit}
                              </span>
                            </TableCell>
                            <TableCell>{unit.bdba}</TableCell>
                            <TableCell>{unit.tenant || "-"}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  unit.status === "Occupied"
                                    ? "bg-success/10 text-success border-success/30"
                                    : "bg-warning/10 text-warning border-warning/30"
                                }
                              >
                                {unit.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{unit.monthlyRent}</TableCell>
                            <TableCell className="text-sm">{unit.leaseEnd}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-4">
                      {PROPERTY_DATA.units.length} result from {PROPERTY_DATA.units.length} Rentable 0 Parking Units
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="bg-background border border-border rounded-lg p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-teal-600" />
                      <h3 className="text-lg font-semibold">Documents ({documents.length})</h3>
                    </div>
                    <Button
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => setShowUploadForm(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>

                  {/* Documents Table */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-xs font-medium text-muted-foreground">Document Name</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Property</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Received Date</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Received Time</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc) => (
                          <TableRow key={doc.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-red-400 shrink-0" />
                                <span className="text-sm font-medium text-teal-700">{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{doc.property}</p>
                                <p className="text-xs text-muted-foreground">{doc.propertyAddress}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{doc.receivedDate}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{doc.receivedTime}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {documents.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No documents uploaded yet. Click Upload Document to add documents.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Processes Tab */}
              {activeTab === "processes" && (
                <div className="space-y-4">
                  {selectedProcessId ? (
                    // Process Detail View
                    (() => {
                      const selectedProcess = propertyProcesses.find(p => p.id === selectedProcessId)
                      if (!selectedProcess) return null

                      const stageColors = ["bg-green-500", "bg-blue-500", "bg-orange-400", "bg-slate-200"]
                      const activityItems = [
                        { type: "email", user: "Sarah Johnson", initials: "SJ", action: "emailed", target: "Christopher Davis", subject: "Request for Required Information/Documents", preview: "Hi Christopher, I hope you are doing gre...", time: "Today, 7:21 PM" },
                        { type: "completed", user: "Sarah Johnson", action: "completed", task: "(Owner) Request for Required Information/Documents", time: "Today, 7:21 PM" },
                        { type: "completed", user: "Nina Patel", action: "completed", task: "Roles Assigned to Team? Signed PM agreement Attached to AF?", time: "Friday, 11:08 PM" },
                        { type: "opened", action: "A recipient opened the email", task: "Welcome to B2B Property Management!", time: "Friday, 10:14 PM" },
                        { type: "opened", action: "A recipient opened the email", task: "Welcome to B2B Property Management!", time: "Friday, 8:54 PM" },
                        { type: "completed", user: "Sarah Johnson", action: "completed", task: "Welcome message", time: "Friday, 8:52 PM" },
                        { type: "email", user: "Sarah Johnson", initials: "SJ", action: "emailed", target: "Christopher Davis, Nina Patel, Richard Surovi", subject: "Welcome to B2B Property Management!", preview: "Hi Christopher, First off, we'd like to welcome...", time: "Friday, 8:44 PM" },
                        { type: "completed", user: "Sarah Johnson", action: "completed", task: "(Owner) Welcome Email", time: "Friday, 8:44 PM" },
                        { type: "assigned", user: "Nina Patel", action: "assigned this process to", target: "Sarah Johnson", time: "Friday, 8:12 PM" },
                        { type: "note", user: "Richard Surovi", initials: "RS", title: "Note", address: "3576 E 104th St, Cleveland, OH 44105", content: "The owner is interested in Sec 8", time: "Friday, 7:23 PM" },
                      ]

                      return (
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedProcessId(null)}
                                className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <ArrowLeft className="h-5 w-5 text-slate-600" />
                              </button>
                              <h2 className="text-lg font-semibold text-slate-900">{selectedProcess.processName}</h2>
                            </div>
                            <button type="button" className="p-2 hover:bg-slate-100 rounded cursor-pointer">
                              <Workflow className="h-5 w-5 text-slate-500" />
                            </button>
                          </div>

                          {/* Stage Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">Stage:</span>
                              <button type="button" className="text-sm text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1">
                                {selectedProcess.stageBadge}
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex gap-1">
                              {stageColors.map((color, idx) => (
                                <div key={idx} className={`h-2 flex-1 rounded-full ${color}`} />
                              ))}
                            </div>
                          </div>

                          {/* Tasks Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-slate-900">Tasks</h3>
                              <Select defaultValue="upcoming">
                                <SelectTrigger className="w-32 h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="upcoming">Upcoming</SelectItem>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-3">
                              {selectedProcess.tasks.filter(t => !t.completedDate).map((task) => (
                                <div key={task.id} className="flex items-start gap-3 py-2">
                                  <button
                                    type="button"
                                    onClick={() => handleMarkTaskComplete(selectedProcess.id, task.id)}
                                    className="mt-0.5 cursor-pointer text-slate-400 hover:text-teal-600 transition-colors"
                                    title="Mark as Complete"
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{task.taskName}</p>
                                    <p className="text-xs text-amber-600">{selectedProcess.stageBadge}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button type="button" className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
                                      <FileText className="h-3.5 w-3.5" />
                                      Instructions
                                    </button>
                                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-700">
                                      {task.staffMember.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-xs text-slate-500">{task.startDate ? `${task.startDate}` : "Pending"}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <hr className="border-slate-200" />

                          {/* Activity Feed Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setSelectedProcessId(null)}
                                className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <ArrowLeft className="h-5 w-5 text-slate-600" />
                              </button>
                              <h2 className="text-lg font-semibold text-slate-900">{selectedProcess.processName}</h2>
                            </div>
                            <button type="button" className="p-2 hover:bg-slate-100 rounded cursor-pointer">
                              <Workflow className="h-5 w-5 text-slate-500" />
                            </button>
                          </div>

                          {/* Activity Feed */}
                          <div className="space-y-3">
                            {activityItems.map((item, idx) => (
                              <div key={idx}>
                                {item.type === "email" && (
                                  <div className="flex gap-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs font-medium text-amber-800 shrink-0">
                                      {item.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm">
                                        <span className="font-semibold">{item.user}</span>
                                        <span className="text-slate-600"> {item.action} </span>
                                        <span className="font-semibold">{item.target}</span>
                                      </p>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-900">{item.subject}</span>
                                      </div>
                                      <p className="text-sm text-slate-500 mt-0.5">{item.preview}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 shrink-0">{item.time}</span>
                                  </div>
                                )}
                                {item.type === "completed" && (
                                  <div className="flex items-center gap-2 py-2">
                                    <CheckCircle className="h-4 w-4 text-teal-500" />
                                    <p className="text-sm text-slate-600">
                                      <span className="font-medium text-slate-900">{item.user}</span> {item.action} "{item.task}" <span className="text-slate-400">{item.time}</span>
                                    </p>
                                  </div>
                                )}
                                {item.type === "opened" && (
                                  <div className="flex items-center gap-2 py-2">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <p className="text-sm text-slate-600">
                                      {item.action} "{item.task}" <span className="text-slate-400">{item.time}</span>
                                    </p>
                                  </div>
                                )}
                                {item.type === "assigned" && (
                                  <div className="flex items-center gap-2 py-2">
                                    <Phone className="h-4 w-4 text-amber-500" />
                                    <p className="text-sm text-slate-600">
                                      <span className="font-medium text-slate-900">{item.user}</span> {item.action} <span className="font-medium text-slate-900">{item.target}</span> <span className="text-slate-400">{item.time}</span>
                                    </p>
                                  </div>
                                )}
                                {item.type === "note" && (
                                  <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-700 shrink-0">
                                      {item.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm">
                                        <span className="font-semibold">{item.user}</span>
                                        <span className="text-slate-600"> left a </span>
                                        <span className="font-semibold">{item.title}</span>
                                      </p>
                                      <a href="#" className="text-sm text-blue-600 hover:underline">{item.address}</a>
                                      <p className="text-sm text-slate-700 mt-1">{item.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-xs text-slate-500">{item.time}</span>
                                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()
                  ) : (
                    // Process List View
                    <>
                      {/* Header */}
                      <div className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-teal-600" />
                        <h3 className="text-lg font-semibold">Processes</h3>
                      </div>

                      {/* Sub-tabs */}
                      <div className="border-b">
                        <div className="flex">
                          {([
                            { id: "in-progress" as const, label: "In Progress", count: inProgressProcesses.length },
                            { id: "completed" as const, label: "Completed", count: completedProcesses.length },
                            { id: "upcoming" as const, label: "Upcoming", count: upcomingProcesses.length },
                          ]).map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setProcessSubTab(tab.id)}
                              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${processSubTab === tab.id
                                  ? "border-teal-600 text-teal-600"
                                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                }`}
                            >
                              {tab.label} ({tab.count})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Process list by sub-tab */}
                      {(() => {
                        const currentProcesses = processSubTab === "in-progress" ? inProgressProcesses : processSubTab === "completed" ? completedProcesses : upcomingProcesses
                        const statusLabel = processSubTab === "in-progress" ? "In Progress" : processSubTab === "completed" ? "Completed" : "Upcoming"
                        const statusColor = processSubTab === "in-progress" ? "text-teal-600" : processSubTab === "completed" ? "text-emerald-600" : "text-slate-500"

                        return (
                          <div className="space-y-4">
                            {/* Section header */}
                            <div className="flex items-center gap-2">
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${processSubTab === "in-progress" ? "bg-teal-100" : processSubTab === "completed" ? "bg-emerald-100" : "bg-slate-100"
                                }`}>
                                <div className={`h-2 w-2 rounded-full ${processSubTab === "in-progress" ? "bg-teal-500" : processSubTab === "completed" ? "bg-emerald-500" : "bg-slate-400"
                                  }`} />
                              </div>
                              <span className={`font-semibold text-sm ${statusColor}`}>
                                {statusLabel} ({currentProcesses.length})
                              </span>
                            </div>

                            {currentProcesses.length === 0 ? (
                              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                                <Workflow className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                <p>No {statusLabel.toLowerCase()} processes.</p>
                              </div>
                            ) : (
                              currentProcesses.map((process) => {
                                const isExpanded = expandedProcesses.has(process.id)
                                const badgeBg = process.stageBadgeColor === "amber" ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : process.stageBadgeColor === "blue" ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : process.stageBadgeColor === "green" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"

                                return (
                                  <div key={process.id} className="border rounded-lg">
                                    {/* Process header row */}
                                    <div
                                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <button
                                          type="button"
                                          onClick={() => toggleProcessExpanded(process.id)}
                                          className="cursor-pointer p-1 hover:bg-slate-100 rounded transition-colors"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                          ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground -rotate-90 transition-transform" />
                                          )}
                                        </button>
                                        <div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              router.push(
                                                `/properties/${propertyId ?? PROPERTY_DATA.id}/process/${process.id}`
                                              )
                                            }
                                            className="font-semibold text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                                          >
                                            {process.processName}
                                          </button>
                                          <div className="flex items-center gap-2 mt-0.5">
                                            <Badge variant="outline" className={`text-xs ${badgeBg}`}>{process.stageBadge}</Badge>
                                            <span className="text-xs text-muted-foreground">Started: {process.startedDate}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                        <Badge variant="outline" className={`text-xs ${process.status === "In Progress" ? "bg-teal-50 text-teal-700 border-teal-200"
                                            : process.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                              : "bg-slate-50 text-slate-600 border-slate-200"
                                          }`}>
                                          <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${process.status === "In Progress" ? "bg-teal-500"
                                              : process.status === "Completed" ? "bg-emerald-500"
                                                : "bg-slate-400"
                                            }`} />
                                          {process.status}
                                        </Badge>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditModal(process)}>
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => openDeleteModal(process)}
                                              className="text-destructive focus:text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>

                                    {/* Expanded task table */}
                                    {isExpanded && (
                                      <div className="border-t">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-muted/40">
                                              <TableHead className="font-medium text-xs pl-12">Task Name</TableHead>
                                              <TableHead className="font-medium text-xs">Start Date</TableHead>
                                              <TableHead className="font-medium text-xs">Completed On</TableHead>
                                              <TableHead className="font-medium text-xs">Staff Member</TableHead>
                                              <TableHead className="font-medium text-xs w-[150px]">Actions</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {process.tasks.map((task) => (
                                              <TableRow key={task.id} className="hover:bg-muted/20">
                                                <TableCell className="text-sm pl-12">{task.taskName}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{task.startDate || "\u2014"}</TableCell>
                                                <TableCell className={`text-sm ${task.completedDate ? "text-teal-600 font-medium" : "text-muted-foreground"}`}>
                                                  {task.completedDate || "\u2014"}
                                                </TableCell>
                                                <TableCell>
                                                  <div>
                                                    <p className="text-sm font-medium text-foreground">{task.staffMember}</p>
                                                    <p className="text-xs text-muted-foreground">{task.staffEmail}</p>
                                                  </div>
                                                </TableCell>
                                                <TableCell>
                                                  <div className="flex items-center gap-2">
                                                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                                                      <Eye className="h-3.5 w-3.5" />
                                                      View
                                                    </button>
                                                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                                                      <Edit className="h-3.5 w-3.5" />
                                                      Edit
                                                    </button>
                                                    {!task.completedDate && (
                                                      <button
                                                        onClick={() => handleMarkTaskComplete(process.id, task.id)}
                                                        className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border border-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors"
                                                        title="Mark as Complete"
                                                      >
                                                        <Check className="h-4 w-4" />
                                                        Complete
                                                      </button>
                                                    )}
                                                    {task.completedDate && (
                                                      <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-200" title="Completed">
                                                        <Check className="h-4 w-4" />
                                                        Done
                                                      </span>
                                                    )}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}
                                  </div>
                                )
                              })
                            )}
                          </div>
                        )
                      })()}

                      {/* Create Process Modal */}
                      <Dialog open={showCreateProcessModal} onOpenChange={setShowCreateProcessModal}>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Create New Process</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Process Type</Label>
                              <Select
                                value={processForm.processName}
                                onValueChange={(value) => setProcessForm({ ...processForm, processName: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select process type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROCESS_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Unit</Label>
                              <Select
                                value={processForm.unit}
                                onValueChange={(value) => setProcessForm({ ...processForm, unit: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROPERTY_UNITS.map((unit) => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Assign Role / Team</Label>
                              <Select
                                value={processForm.assignedRole}
                                onValueChange={(value) => setProcessForm({ ...processForm, assignedRole: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role / team" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ASSIGNED_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Start Stage</Label>
                              <Select
                                value={processForm.currentStage}
                                onValueChange={(value) => setProcessForm({ ...processForm, currentStage: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select start stage" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROCESS_STAGES.map((stage) => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowCreateProcessModal(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={handleCreateProcess}
                              disabled={!processForm.processName || !processForm.unit || !processForm.assignedRole || !processForm.currentStage}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Create
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Process Modal */}
                      <Dialog open={showEditProcessModal} onOpenChange={setShowEditProcessModal}>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Process</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Process Type</Label>
                              <Input value={processForm.processName} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                              <Label>Unit</Label>
                              <Input value={processForm.unit} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                              <Label>Assign Role / Team</Label>
                              <Select
                                value={processForm.assignedRole}
                                onValueChange={(value) => setProcessForm({ ...processForm, assignedRole: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role / team" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ASSIGNED_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Current Stage</Label>
                              <Select
                                value={processForm.currentStage}
                                onValueChange={(value) => setProcessForm({ ...processForm, currentStage: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select stage" />
                                </SelectTrigger>
                                <SelectContent>
                                  {PROCESS_STAGES.map((stage) => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowEditProcessModal(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={handleEditProcess}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Save
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Confirmation Modal */}
                      <Dialog open={showDeleteProcessModal} onOpenChange={setShowDeleteProcessModal}>
                        <DialogContent className="sm:max-w-[400px]">
                          <DialogHeader>
                            <DialogTitle>Delete Process</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-muted-foreground">
                              Are you sure you want to delete this process? This action cannot be undone.
                            </p>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowDeleteProcessModal(false)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteProcess}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              )}


                        {/* Marketing Tab */}
          {activeTab === "marketing" && (
            <div className="space-y-6">
              {/* Marketing Information Card */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Marketing Information</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Posted to your Website</span>
                      <span className="text-sm font-medium text-gray-900">No</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Posted to the Internet</span>
                      <span className="text-sm font-medium text-gray-900">No</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        Premium Listing
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </span>
                      <span className="text-sm font-medium text-gray-900">Off</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Removed from Vacancies List</span>
                      <Checkbox id="removed-vacancies" disabled />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Available On</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div></div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Marketing Title</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div></div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Marketing Description</span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                    <div></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        YouTube Video URL
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </span>
                      <span className="text-sm text-gray-400">—</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit Images Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg">
                <div className="px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Unit Images</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <div className="px-6 pb-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 bg-white text-center">
                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm">
                      <span className="text-blue-600 hover:underline cursor-pointer">Drag images here</span>
                      <span className="text-gray-600"> or </span>
                      <span className="text-blue-600 hover:underline cursor-pointer">Choose files to upload</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG, WebP up to 10MB each</p>
                  </div>
                </div>
              </div>

              {/* Link Rows */}
              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-blue-600 underline cursor-pointer hover:text-blue-700">Application Link</span>
                  </div>
                  <button type="button" onClick={() => handleShareLinkClick("Application Link")}>
                    <Share2 className="h-5 w-5 text-green-500 cursor-pointer hover:text-green-600" />
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-blue-600 underline cursor-pointer hover:text-blue-700">Showing Link</span>
                  </div>
                  <button type="button" onClick={() => handleShareLinkClick("Showing Link")}>
                    <Share2 className="h-5 w-5 text-green-500 cursor-pointer hover:text-green-600" />
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-blue-600 underline cursor-pointer hover:text-blue-700">Matterport Scan</span>
                  </div>
                  <button type="button" onClick={() => handleShareLinkClick("Matterport Scan")}>
                    <Share2 className="h-5 w-5 text-green-500 cursor-pointer hover:text-green-600" />
                  </button>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-blue-600 underline cursor-pointer hover:text-blue-700">Rental Comps</span>
                  </div>
                  <button type="button" onClick={() => handleShareLinkClick("Rental Comps")}>
                    <Share2 className="h-5 w-5 text-green-500 cursor-pointer hover:text-green-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === "maintenance" && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Work Orders</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Work Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Closed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "WO-001", title: "HVAC System Repair", description: "Air conditioning unit not cooling properly", status: "In Progress", priority: "High", assignedTo: "John Martinez", unit: "Unit 101", category: "HVAC", createdDate: "2024-01-15", closedDate: null },
                      { id: "WO-002", title: "Plumbing Leak Fix", description: "Kitchen sink leak reported by tenant", status: "Completed", priority: "Medium", assignedTo: "Sarah Johnson", unit: "Unit 205", category: "Plumbing", createdDate: "2024-01-10", closedDate: "2024-01-12" },
                      { id: "WO-003", title: "Electrical Outlet Replacement", description: "Faulty outlet in living room", status: "Pending", priority: "Low", assignedTo: "Mike Chen", unit: "Unit 312", category: "Electrical", createdDate: "2024-01-18", closedDate: null },
                      { id: "WO-004", title: "Window Seal Repair", description: "Draft coming through bedroom window", status: "Completed", priority: "Medium", assignedTo: "John Martinez", unit: "Unit 408", category: "General", createdDate: "2024-01-05", closedDate: "2024-01-08" },
                      { id: "WO-005", title: "Appliance Replacement", description: "Dishwasher not draining, needs replacement", status: "In Progress", priority: "High", assignedTo: "Sarah Johnson", unit: "Unit 102", category: "Appliances", createdDate: "2024-01-20", closedDate: null },
                    ].map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{order.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{order.unit}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {order.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
                                {order.assignedTo.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{order.assignedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${order.status === "Completed"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : order.status === "In Progress"
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : "border-amber-300 bg-amber-50 text-amber-700"
                              }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${order.priority === "High"
                                ? "border-red-300 bg-red-50 text-red-700"
                                : order.priority === "Medium"
                                  ? "border-amber-300 bg-amber-50 text-amber-700"
                                  : "border-gray-300 bg-gray-50 text-gray-700"
                              }`}
                          >
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(order.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.closedDate ? new Date(order.closedDate).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
              {/* Upload Document Dialog */}
              <Dialog open={showUploadForm} onOpenChange={(open) => {
                setShowUploadForm(open)
                if (!open) {
                  setUploadingFile(null)
                  setDocumentForm({ type: "", assignedTo: "", comments: "" })
                }
              }}>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-teal-600" />
                      Upload Document
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 py-2">
                    {/* Upload File Area */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Upload File</Label>
                      {!uploadingFile ? (
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-colors"
                          onClick={() => document.getElementById('upload-dialog-file')?.click()}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.currentTarget.classList.add('border-teal-500', 'bg-teal-50/30')
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('border-teal-500', 'bg-teal-50/30')
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.currentTarget.classList.remove('border-teal-500', 'bg-teal-50/30')
                            if (e.dataTransfer.files.length > 0) {
                              setUploadingFile(e.dataTransfer.files[0])
                            }
                          }}
                        >
                          <Upload className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                          <FileText className="h-6 w-6 text-teal-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{uploadingFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(uploadingFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 shrink-0"
                            onClick={() => setUploadingFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <input
                        id="upload-dialog-file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setUploadingFile(e.target.files[0])
                          }
                          e.target.value = ''
                        }}
                      />
                    </div>

                    {/* Document Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Document Type</Label>
                      <Select
                        value={documentForm.type}
                        onValueChange={(value) => setDocumentForm({ ...documentForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Assign This Document */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Assign this document</Label>
                      <Select
                        value={documentForm.assignedTo}
                        onValueChange={(value) => setDocumentForm({ ...documentForm, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oak-manor">Oak Manor</SelectItem>
                          <SelectItem value="maple-heights">Maple Heights</SelectItem>
                          <SelectItem value="pine-view">Pine View Apartments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => {
                        setShowUploadForm(false)
                        setUploadingFile(null)
                        setDocumentForm({ type: "", assignedTo: "", comments: "" })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      disabled={!uploadingFile || !documentForm.type}
                      onClick={() => {
                        const newDoc = {
                          id: String(documents.length + 1),
                          name: uploadingFile?.name || "Document",
                          type: documentForm.type,
                          property: "Oak Manor",
                          propertyAddress: "123 Oak Street, San Francisco, CA",
                          receivedDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                          receivedTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                          uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          uploadedBy: "Current User",
                          assignedTo: null,
                        }
                        setDocuments([newDoc, ...documents])
                        setShowUploadForm(false)
                        setUploadingFile(null)
                        setDocumentForm({ type: "", assignedTo: "", comments: "" })
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Audit Log Tab */}
              {activeTab === "audit-log" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Audit Log</h3>
                  </div>

                  {/* Filter Controls */}
                  <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search logs..." className="w-48 h-9" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Action Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="created">Created</SelectItem>
                        <SelectItem value="updated">Updated</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                        <SelectItem value="viewed">Viewed</SelectItem>
                        <SelectItem value="status-changed">Status Changed</SelectItem>
                        <SelectItem value="assignment-changed">Assignment Changed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="User" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="sarah">Sarah M</SelectItem>
                        <SelectItem value="mike">Mike D</SelectItem>
                        <SelectItem value="nina">Nina P</SelectItem>
                        <SelectItem value="richard">Richard S</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="w-36 h-9" />
                      <span className="text-muted-foreground">to</span>
                      <Input type="date" className="w-36 h-9" />
                    </div>
                  </div>

                  {/* Audit Log Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-44">Date & Time</TableHead>
                          <TableHead className="w-32">User</TableHead>
                          <TableHead className="w-36">Action Type</TableHead>
                          <TableHead className="w-32">Entity / Section</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-32">Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {PROPERTY_AUDIT_LOGS.length > 0 ? (
                          PROPERTY_AUDIT_LOGS.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="text-sm text-muted-foreground">{log.dateTime}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{log.user}</span>
                                  <span className="text-xs text-muted-foreground">{log.userRole}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    log.actionType === "Created"
                                      ? "border-green-300 bg-green-50 text-green-700"
                                      : log.actionType === "Updated"
                                        ? "border-blue-300 bg-blue-50 text-blue-700"
                                        : log.actionType === "Deleted"
                                          ? "border-red-300 bg-red-50 text-red-700"
                                          : log.actionType === "Viewed"
                                            ? "border-gray-300 bg-gray-50 text-gray-700"
                                            : log.actionType === "Status Changed"
                                              ? "border-purple-300 bg-purple-50 text-purple-700"
                                              : "border-amber-300 bg-amber-50 text-amber-700"
                                  }
                                >
                                  {log.actionType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{log.entity}</TableCell>
                              <TableCell className="text-sm">{log.description}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {log.source}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No activity recorded for this property yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Owner Info Modal */}
        <Dialog open={showOwnerInfoModal} onOpenChange={setShowOwnerInfoModal}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Owner Information
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {PROPERTY_DATA.ownersAndFinancials.owners.map((owner, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <Avatar className="h-10 w-10 bg-teal-100 text-teal-600 border border-teal-200">
                    <AvatarFallback className="bg-teal-100 text-teal-600 text-sm font-semibold">
                      {getInitials(owner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{owner.name}</span>
                      <span className="text-xs text-muted-foreground">({owner.percentOwned})</span>
                      {owner.contractPayable && (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs h-5">
                          Contract Payable
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {owner.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-teal-600 hover:underline cursor-pointer">{owner.email}</span>
                        </span>
                      )}
                      {owner.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{owner.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Activity Dialog */}
        <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  New Activity
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-sm text-muted-foreground">Property:</span>
                <span className="ml-2 text-primary font-medium hover:underline cursor-pointer">
                  "{PROPERTY_DATA.name}" {PROPERTY_DATA.address}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-primary font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <Input type="date" className="border-border focus:border-primary focus:ring-primary" />
                </div>

                <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <Checkbox className="border-primary data-[state=checked]:bg-primary" />
                  <Label className="text-sm font-medium text-primary cursor-pointer">All Day</Label>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-primary font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input
                      type="text"
                      placeholder="HH:MM"
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-primary font-medium">AM/PM</Label>
                    <Select>
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    placeholder="e.g. Tenant Move Out & Walk-Through"
                    className="min-h-[100px] border-border focus:border-primary focus:ring-primary resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">0/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium">Label</Label>
                  <Select>
                    <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Type to search or add new" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_LABELS.map((label) => (
                        <SelectItem key={label.id} value={label.id}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${label.color === "blue"
                                  ? "bg-primary"
                                  : label.color === "red"
                                    ? "bg-destructive"
                                    : label.color === "amber"
                                      ? "bg-warning"
                                      : label.color === "emerald"
                                        ? "bg-success"
                                        : "bg-info"
                                }`}
                            />
                            {label.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">15 characters max</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Assign To
                  </Label>
                  <Select>
                    <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Start typing to search" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {getInitials(staff.name)}
                              </AvatarFallback>
                            </Avatar>
                            {staff.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium">Status</Label>
                  <Select>
                    <SelectTrigger className="w-48 border-border focus:border-primary focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-warning" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="in-progress">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-info" />
                          In Progress
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-success" />
                          Completed
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-destructive" />
                          Cancelled
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
              <Button variant="outline" onClick={() => setIsAddActivityOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 px-6">Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Task Modal */}
        <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary-foreground flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  New Task
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-sm text-muted-foreground">Property:</span>
                <span className="ml-2 text-primary font-medium">
                  "{PROPERTY_DATA.name}" {PROPERTY_DATA.address}
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-primary font-medium">
                    Task Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium">
                    Description
                  </Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    className="min-h-[80px] border-border focus:border-primary focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-primary font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="border-border focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-primary font-medium">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Assign To <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={newTask.assignedTo}
                    onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                  >
                    <SelectTrigger className="border-border focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.map((staff) => (
                        <SelectItem key={staff.id} value={staff.name}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {getInitials(staff.name)}
                              </AvatarFallback>
                            </Avatar>
                            {staff.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
              <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 px-6"
                onClick={() => {
                  if (newTask.title && newTask.dueDate && newTask.assignedTo) {
                    setTasks([
                      ...tasks,
                      {
                        id: tasks.length + 1,
                        title: newTask.title,
                        relatedEntity: "",
                        processLink: "",
                        assignedTo: newTask.assignedTo,
                        dueDate: newTask.dueDate,
                        isOverdue: false,
                        priority: newTask.priority as "High" | "Medium" | "Low",
                        status: "Pending",
                      },
                    ])
                    setNewTask({
                      title: "",
                      description: "",
                      assignedTo: "",
                      dueDate: "",
                      priority: "Medium",
                    })
                    setShowNewTaskModal(false)
                  }
                }}
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Custom Field Dialog */}
        <Dialog open={showAddCustomFieldDialog} onOpenChange={setShowAddCustomFieldDialog}>
          <DialogContent className="sm:max-w-md p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-teal-600" />
                <DialogTitle className="text-lg font-semibold text-slate-900">Add Custom Field</DialogTitle>
              </div>
              {/* <button
                type="button"
                onClick={() => setShowAddCustomFieldDialog(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button> */}
            </div>

            <div className="px-6 pb-2">
              <p className="text-sm text-slate-400">
                Add a new custom field to the{" "}
                {PROPERTY_CUSTOM_FIELD_SECTIONS.find((s) => s.id === customFieldSection)?.name ?? "selected"}{" "}
                section. All custom fields are available for reporting.
              </p>
            </div>

            <div className="px-6 py-4 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Section</Label>
                <Select value={customFieldSection} onValueChange={(v) => setCustomFieldSection(v)}>
                  <SelectTrigger className="w-48 border-teal-500 focus:ring-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_CUSTOM_FIELD_SECTIONS.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Field Name</Label>
                <Input
                  placeholder="Enter field name..."
                  value={customFieldName}
                  onChange={(e) => setCustomFieldName(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Field Type</Label>
                <Select value={customFieldType} onValueChange={setCustomFieldType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dropdown-multi">Dropdown / Multi-select</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {customFieldType === "dropdown-multi" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Options (comma separated)</Label>
                  <Input
                    placeholder="Option 1, Option 2, Option 3..."
                    value={customFieldOptions}
                    onChange={(e) => setCustomFieldOptions(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">Required Field</p>
                  <p className="text-xs text-teal-600">Mark this field as mandatory</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomFieldRequired(!customFieldRequired)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${customFieldRequired ? "bg-teal-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${customFieldRequired ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                <FileBarChart className="h-4 w-4 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-500">This field will be available in Property reports</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddCustomFieldDialog(false)
                  setCustomFieldName("")
                  setCustomFieldOptions("")
                  setCustomFieldRequired(false)
                }}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                disabled={!customFieldName.trim() || !customFieldSection}
                onClick={() => {
                  if (!customFieldName.trim() || !customFieldSection) return
                  const newField: PropertyCustomField = {
                    id: `property_cf_${Date.now()}`,
                    sectionId: customFieldSection,
                    name: customFieldName.trim(),
                    type: customFieldType,
                    options:
                      customFieldType === "dropdown-multi"
                        ? customFieldOptions.split(",").map((o) => o.trim()).filter(Boolean)
                        : undefined,
                    required: customFieldRequired,
                  }
                  setPropertyCustomFields((prev) => [...prev, newField])
                  setShowAddCustomFieldDialog(false)
                  setCustomFieldName("")
                  setCustomFieldOptions("")
                  setCustomFieldRequired(false)
                }}
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Missing Info Modal */}
        <Dialog open={showMissingInfoModal} onOpenChange={setShowMissingInfoModal}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-slate-800 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <span>Missing Information</span>
                    <p className="text-sm font-normal text-muted-foreground mt-0.5">Complete these items to ensure accurate records</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="p-6">
              {/* Tab buttons */}
              <div className="flex gap-2 mb-4 border-b">
                <button
                  onClick={() => setMissingInfoTab("fields")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${missingInfoTab === "fields"
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Missing Fields ({PROPERTY_MISSING_FIELDS.length})
                </button>
                <button
                  onClick={() => setMissingInfoTab("documents")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${missingInfoTab === "documents"
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Missing Documents ({PROPERTY_MISSING_DOCUMENTS.length})
                </button>
              </div>

              {/* Tab content */}
              {missingInfoTab === "fields" && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {PROPERTY_MISSING_FIELDS.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted/80 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{field.fieldName}</p>
                        <p className="text-xs text-muted-foreground">{field.section}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveTab(field.tab as typeof activeTab)
                          setShowMissingInfoModal(false)
                        }}
                        className="text-xs"
                      >
                        Go to field
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {missingInfoTab === "documents" && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {PROPERTY_MISSING_DOCUMENTS.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.documentName}</p>
                          {doc.required && (
                            <span className="text-xs text-red-600">Required</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActiveTab("media")
                          setShowMissingInfoModal(false)
                          setShowUploadForm(true)
                        }}
                        className="text-xs gap-1"
                      >
                        <Upload className="h-3 w-3" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border">
              <Button variant="outline" onClick={() => setShowMissingInfoModal(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default PropertyDetailPage
