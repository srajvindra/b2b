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
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

import { useNav } from "@/app/dashboard/page"
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
} from "@/features/properties/data/propertyDetail"

interface PropertyDetailPageProps {
  propertyId?: string
  onBack?: () => void
  onUnitClick?: (unitNumber: string) => void // Added for consistency with usage
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  actions,
  headerColor = "bg-gray-100",
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  actions?: React.ReactNode
  headerColor?: string
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
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "tasks" | "media" | "processes" | "audit-log">("overview")
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
  })
  const [tasks, setTasks] = useState(PROPERTY_TASKS)

  // Process management state
  interface ProcessTask {
    id: string
    taskName: string
    startDate: string
    completedDate: string
    staffMember: string
    staffEmail: string
  }

  interface PropertyProcess {
    id: string
    processName: string
    stageBadge: string
    stageBadgeColor: string
    startedDate: string
    status: "In Progress" | "Completed" | "Upcoming"
    tasks: ProcessTask[]
  }

  const [propertyProcesses, setPropertyProcesses] = useState<PropertyProcess[]>([
    {
      id: "proc1",
      processName: "Tenant Onboarding",
      stageBadge: "Financial Paperwork",
      stageBadgeColor: "amber",
      startedDate: "01/10/2026",
      status: "In Progress",
      tasks: [
        { id: "t1", taskName: "Send welcome email", startDate: "01/10/2026", completedDate: "01/10/2026", staffMember: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        { id: "t2", taskName: "Schedule discovery call", startDate: "01/11/2026", completedDate: "01/12/2026", staffMember: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        { id: "t3", taskName: "Complete needs assessment", startDate: "01/13/2026", completedDate: "", staffMember: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        { id: "t4", taskName: "Verify property ownership", startDate: "", completedDate: "", staffMember: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
      ],
    },
    {
      id: "proc2",
      processName: "Property Evaluation Process",
      stageBadge: "Collecting Information",
      stageBadgeColor: "blue",
      startedDate: "01/15/2026",
      status: "In Progress",
      tasks: [
        { id: "t5", taskName: "Request property details", startDate: "01/15/2026", completedDate: "01/15/2026", staffMember: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t6", taskName: "Schedule property walkthrough", startDate: "01/16/2026", completedDate: "", staffMember: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t7", taskName: "Prepare management proposal", startDate: "", completedDate: "", staffMember: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
      ],
    },
    {
      id: "proc3",
      processName: "Lease Renewal",
      stageBadge: "Completed",
      stageBadgeColor: "green",
      startedDate: "12/01/2025",
      status: "Completed",
      tasks: [
        { id: "t8", taskName: "Send renewal notice", startDate: "12/01/2025", completedDate: "12/01/2025", staffMember: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        { id: "t9", taskName: "Negotiate terms", startDate: "12/05/2025", completedDate: "12/10/2025", staffMember: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
      ],
    },
    {
      id: "proc4",
      processName: "Move-Out Inspection",
      stageBadge: "Completed",
      stageBadgeColor: "green",
      startedDate: "11/15/2025",
      status: "Completed",
      tasks: [
        { id: "t10", taskName: "Schedule inspection", startDate: "11/15/2025", completedDate: "11/16/2025", staffMember: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        { id: "t11", taskName: "Conduct walkthrough", startDate: "11/18/2025", completedDate: "11/18/2025", staffMember: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
      ],
    },
    {
      id: "proc5",
      processName: "Annual Property Review",
      stageBadge: "Scheduled",
      stageBadgeColor: "slate",
      startedDate: "02/01/2026",
      status: "Upcoming",
      tasks: [
        { id: "t12", taskName: "Gather financial reports", startDate: "", completedDate: "", staffMember: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        { id: "t13", taskName: "Review maintenance history", startDate: "", completedDate: "", staffMember: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
      ],
    },
    {
      id: "proc6",
      processName: "Insurance Renewal",
      stageBadge: "Pending",
      stageBadgeColor: "slate",
      startedDate: "03/01/2026",
      status: "Upcoming",
      tasks: [
        { id: "t14", taskName: "Request updated quotes", startDate: "", completedDate: "", staffMember: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t15", taskName: "Compare coverage options", startDate: "", completedDate: "", staffMember: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
      ],
    },
  ])

  const [processSubTab, setProcessSubTab] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<Set<string>>(new Set(["proc1", "proc2"]))
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

  const inProgressProcesses = propertyProcesses.filter((p) => p.status === "In Progress")
  const completedProcesses = propertyProcesses.filter((p) => p.status === "Completed")
  const upcomingProcesses = propertyProcesses.filter((p) => p.status === "Upcoming")

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
  const [uploadingFile, setUploadingFile] = useState<File | null>(null)
  const [documentForm, setDocumentForm] = useState({
    type: "",
    assignedTo: "",
    comments: "",
  })

  const nav = useNav()

  const handleUnitClick = (unitNumber: string) => {
    // Use the passed onUnitClick prop if available, otherwise use nav.go
    if (onUnitClick) {
      onUnitClick(unitNumber)
    } else {
      nav.go("unitDetail", { id: unitNumber, propertyId })
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 pt-2 overflow-auto">
        {/* Back Button */}
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Properties</span>
        </button>

        {/* Property Header Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-slate-800">
                      {`"${PROPERTY_DATA.name}" ${PROPERTY_DATA.address}`}
                    </h1>
                    <Badge
                      variant="outline"
                      className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                    >
                      {PROPERTY_DATA.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {PROPERTY_DATA.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {PROPERTY_DATA.address}, {PROPERTY_DATA.city}, {PROPERTY_DATA.state} {PROPERTY_DATA.zip}
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

            {/* Property Information */}
            <div className="border-t border-border mt-3 pt-3">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  
                  
                </div>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <span>Year Built: <span className="font-medium text-foreground">{PROPERTY_DATA.propertyInfo.yearBuilt}</span></span>
                  <span>Heat Type: <span className="font-medium text-foreground">{PROPERTY_DATA.propertyInfo.heatType}</span></span>
                  <span>Living Area: <span className="font-medium text-foreground">{PROPERTY_DATA.propertyInfo.livingArea} sqft</span></span>
                  <span>Avg Rent: <span className="font-medium text-foreground">${PROPERTY_DATA.propertyInfo.averageRent}</span></span>
                  <span>Mgmt Start: <span className="font-medium text-foreground">{PROPERTY_DATA.propertyInfo.managementStartDate}</span></span>
                </div>
              </div>
            </div>

            {/* Units */}
            <div className="border-t border-border mt-3 pt-3">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-semibold text-foreground">Units ({PROPERTY_DATA.units.length})</span>
                </div>
                <div className="flex items-center gap-4">
                  {PROPERTY_DATA.units.map((unit) => (
                    <div key={unit.unit} className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => handleUnitClick(unit.unit)}
                        className="text-teal-600 hover:underline font-medium"
                      >
                        {unit.unit}
                      </button>
                      <Badge
                        variant="outline"
                        className={`text-xs h-5 ${
                          unit.status === "Occupied"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >
                        {unit.status}
                      </Badge>
                      <span className="text-muted-foreground">{unit.monthlyRent}</span>
                    </div>
                  ))}
                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "units", label: "Units", icon: Building2 },
              { id: "processes", label: "Processes", icon: Workflow },
              { id: "media", label: "Documents", icon: FileText },
              { id: "audit-log", label: "Audit Log", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
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
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
                  {/* Tasks Section */}
                  <div className="bg-white border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Tasks ({tasks.length})</h3>
                      </div>
                      <Button 
                        onClick={() => setShowNewTaskModal(true)} 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Task</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tasks.length > 0 ? (
                            tasks.map((task) => (
                              <TableRow key={task.id} className="hover:bg-muted/50">
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-primary">{task.title}</p>
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7 bg-primary/15 text-primary border border-primary/30">
                                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                                        {getInitials(task.assignedTo)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{task.assignedTo}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {task.dueDate}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      task.status === "Completed"
                                        ? "bg-success/10 text-success border-success/30"
                                        : task.status === "In Progress"
                                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                                          : "bg-gray-100 text-gray-600 border-gray-300"
                                    }
                                  >
                                    {task.status === "Completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {task.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No tasks found for this property. Click "Add Task" to create one.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                    {/* Property Information - Expanded */}
                    <CollapsibleSection
                      title="Property Information"
                      icon={Building2}
                      defaultOpen={true}
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
                    </CollapsibleSection>

                    {/* Maintenance Information */}
                    <CollapsibleSection
                      title="Maintenance Information"
                      icon={Wrench}
                      defaultOpen={false}
                      actions={
                        <Button variant="link" className="text-primary p-0 h-auto text-sm">
                          Edit
                        </Button>
                      }
                    >
                      <div className="grid grid-cols-1 gap-x-8">
                        <InfoRow label="Owner Specific Notes" value={MAINTENANCE_INFO_EXTENDED.ownerSpecificNotes} />
                      </div>
                    </CollapsibleSection>

                    {/* Notes */}
                    <CollapsibleSection
                      title="Notes"
                      icon={StickyNote}
                      defaultOpen={false}
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
                    </CollapsibleSection>

                    {/* Rental Information */}
                    <CollapsibleSection
                      title="Rental Information"
                      icon={Home}
                      defaultOpen={false}
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
                    </CollapsibleSection>

                    {/* Amenities */}
                    <CollapsibleSection
                      title="Amenities"
                      icon={CheckSquare}
                      defaultOpen={false}
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
                    </CollapsibleSection>
                </div>

{/* Quick Actions Sidebar */}
                <div className="w-56 shrink-0 self-start">
                  <div className="sticky top-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Quick Actions
                      </h3>

                      {/* Tasks */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Tasks
                        </h4>
                        <div className="flex flex-col gap-2">
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">New Property</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <FolderPlus className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">New Property Group</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Manage Lockboxes</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">New Association</span>
                          </button>
                        </div>
                      </div>

                      {/* Reports */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Reports
                        </h4>
                        <div className="flex flex-col gap-2">
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Property Directory</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Unit Directory</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Rent Roll</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Unit Vacancy Detail</span>
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <Clipboard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">General Ledger</span>
                          </button>
                        </div>
                      </div>

                      {/* Statements */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Statements
                        </h4>
                        <div className="flex flex-col gap-2">
                          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">Bulk Update Statement Settings</span>
                          </button>
                        </div>
                      </div>
                </div>
</div>
          </div>
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
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="bg-white border border-border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Upload Documents</h3>
                  </div>
                  
                  {!showUploadForm ? (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.add('border-primary', 'bg-primary/5')
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
                        const files = e.dataTransfer.files
                        if (files.length > 0) {
                          setUploadingFile(files[0])
                          setShowUploadForm(true)
                        }
                      }}
                    >
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">Drag & drop files here or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, JPG, PNG, ZIP</p>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            setUploadingFile(files[0])
                            setShowUploadForm(true)
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* File Info */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{uploadingFile?.name}</p>
                          <p className="text-xs text-muted-foreground">{uploadingFile?.size ? `${(uploadingFile.size / 1024).toFixed(1)} KB` : ''}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setUploadingFile(null)
                            setShowUploadForm(false)
                            setDocumentForm({ type: "", assignedTo: "", comments: "" })
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      
                      {/* Form Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="doc-type">File Type <span className="text-red-500">*</span></Label>
                          <Select 
                            value={documentForm.type} 
                            onValueChange={(value) => setDocumentForm({...documentForm, type: value})}
                          >
                            <SelectTrigger id="doc-type">
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              {DOCUMENT_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="assign-to">Assign To (Optional)</Label>
                          <Select 
                            value={documentForm.assignedTo} 
                            onValueChange={(value) => setDocumentForm({...documentForm, assignedTo: value})}
                          >
                            <SelectTrigger id="assign-to">
                              <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                            <SelectContent>
                              {STAFF_MEMBERS.map((staff) => (
                                <SelectItem key={staff.id} value={staff.name}>
                                  <div className="flex flex-col">
                                    <span>{staff.name}</span>
                                    <span className="text-xs text-muted-foreground">{staff.role}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="comments">Comments (Optional)</Label>
                        <Textarea
                          id="comments"
                          placeholder="Add notes or context for this document..."
                          value={documentForm.comments}
                          onChange={(e) => setDocumentForm({...documentForm, comments: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <Button 
                          className="bg-primary hover:bg-primary/90"
                          disabled={!documentForm.type}
                          onClick={() => {
                            // Add new document to list
                            const newDoc = {
                              id: String(documents.length + 1),
                              name: uploadingFile?.name || "Document",
                              type: documentForm.type,
                              uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                              uploadedBy: "Current User",
                              assignedTo: documentForm.assignedTo || null,
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
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Documents List */}
                <div className="bg-white border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Uploaded Documents ({documents.length})</span>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Document Name</TableHead>
                        <TableHead>File Type</TableHead>
                        <TableHead>Uploaded Date</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="font-medium text-foreground">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                              {doc.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{doc.uploadedDate}</TableCell>
                          <TableCell className="text-muted-foreground">{doc.uploadedBy}</TableCell>
                          <TableCell className="text-muted-foreground">{doc.assignedTo || "-"}</TableCell>
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
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No documents uploaded yet. Use the upload area above to add documents.
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
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                          processSubTab === tab.id
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
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                          processSubTab === "in-progress" ? "bg-teal-100" : processSubTab === "completed" ? "bg-emerald-100" : "bg-slate-100"
                        }`}>
                          <div className={`h-2 w-2 rounded-full ${
                            processSubTab === "in-progress" ? "bg-teal-500" : processSubTab === "completed" ? "bg-emerald-500" : "bg-slate-400"
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
                                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                                onClick={() => toggleProcessExpanded(process.id)}
                              >
                                <div className="flex items-center gap-3">
                                  {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground -rotate-90 transition-transform" />}
                                  <div>
                                    <p className="font-semibold text-sm text-foreground">{process.processName}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <Badge variant="outline" className={`text-xs ${badgeBg}`}>{process.stageBadge}</Badge>
                                      <span className="text-xs text-muted-foreground">Started: {process.startedDate}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                  <Badge variant="outline" className={`text-xs ${
                                    process.status === "In Progress" ? "bg-teal-50 text-teal-700 border-teal-200"
                                    : process.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                                  }`}>
                                    <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                                      process.status === "In Progress" ? "bg-teal-500"
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
                                        <TableHead className="font-medium text-xs">Completed Date</TableHead>
                                        <TableHead className="font-medium text-xs">Staff Member</TableHead>
                                        <TableHead className="font-medium text-xs w-[120px]">Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {process.tasks.map((task) => (
                                        <TableRow key={task.id} className="hover:bg-muted/20">
                                          <TableCell className="text-sm pl-12">{task.taskName}</TableCell>
                                          <TableCell className="text-sm text-muted-foreground">{task.startDate || "\u2014"}</TableCell>
                                          <TableCell className={`text-sm ${task.completedDate ? "text-teal-600" : "text-muted-foreground"}`}>
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
                                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                              </button>
                                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                                                <Edit className="h-3.5 w-3.5" />
                                                Edit
                                              </button>
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
              </div>
            )}

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
                            className={`w-2 h-2 rounded-full ${
                              label.color === "blue"
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
                      description: newTask.description,
                      assignedTo: newTask.assignedTo,
                      dueDate: newTask.dueDate,
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
      </div>
    </div>
  )
}

export default PropertyDetailPage
