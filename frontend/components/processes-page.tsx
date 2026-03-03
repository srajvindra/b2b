"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus, Pencil, ChevronDown, ChevronUp, Bell, Settings, X, AlertTriangle, CheckCircle, Filter, FolderPlus, Copy, Users, Trash2, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProcessType {
  id: string
  name: string
  isDraft: boolean
  stages: number
  folder?: string
  team?: string
}

interface ProcessInstance {
  id: string
  name: string
  property: string
  onTrack: "no_overdue" | "tasks_overdue" | "overdue_date"
  overdueDate?: string
  stage: string
  assignee: string
  dueAt: string
  createdAt: string
  // New fields for enhanced listing
  relatedEntity: {
    type: "Owner" | "Property" | "Tenant" | "Prospect"
    name: string
  }
  processType: string
  status: "Open" | "In-Progress" | "Overdue" | "Completed"
  assignedTeam?: string
  lastTouched: string
}

interface SummaryCard {
  id: string
  label: string
  value: string | number
  visible: boolean
}

const initialProcessTypes: ProcessType[] = [
  { id: "1", name: "2 Property Onboarding Process", isDraft: false, stages: 7 },
  { id: "2", name: "Accounting Mistakes", isDraft: true, stages: 4 },
  { id: "3", name: "Applications screening process", isDraft: false, stages: 11 },
  { id: "4", name: "Delinquency Process", isDraft: false, stages: 10 },
  { id: "5", name: "Employee Onboarding Process", isDraft: false, stages: 5 },
  { id: "6", name: "Employee Termination Process", isDraft: true, stages: 3 },
  { id: "7", name: "Employee Training Process", isDraft: true, stages: 21 },
  { id: "8", name: "EOM Accounting Process for Month", isDraft: true, stages: 4 },
  { id: "9", name: "Escalated Owner Funds Collection Process", isDraft: true, stages: 5 },
  { id: "10", name: "Eviction Process", isDraft: false, stages: 10 },
  { id: "11", name: "Haro PM", isDraft: true, stages: 3 },
  { id: "12", name: "Hiring Requisition Process", isDraft: true, stages: 8 },
  { id: "13", name: "Lease Renewal Process", isDraft: false, stages: 10 },
  { id: "14", name: "Legal Cases Complaints and Notices", isDraft: true, stages: 8 },
  { id: "15", name: "Make Ready Process", isDraft: false, stages: 9 },
]

const initialProcessInstances: ProcessInstance[] = [
  { id: "p1", name: "Property Onboarding for 1903 W Grand Ave", property: "1903 W Grand Ave, Dayton, OH, 45402", onTrack: "no_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Devin Clarke", dueAt: "3/4/26 8:00 PM", createdAt: "2/12/26 8:46 AM", relatedEntity: { type: "Owner", name: "John Martinez" }, processType: "Property Onboarding Process", status: "In-Progress", assignedTeam: "Daniel Team", lastTouched: "2/12/26 8:46 AM" },
  { id: "p2", name: "Make Ready for 3715 W 39th St - DN Unit", property: "3715 W 39th St, Cleveland, OH, 44109 - Unit #DN Unit", onTrack: "no_overdue", stage: "Inspection & Estimation", assignee: "Zam", dueAt: "2/27/26 6:00 PM", createdAt: "2/12/26 5:34 AM", relatedEntity: { type: "Property", name: "3715 W 39th St" }, processType: "Make Ready Process", status: "In-Progress", assignedTeam: "Tee Team", lastTouched: "2/12/26 5:34 AM" },
  { id: "p3", name: "Owner Onboarding Process for Gilbert Victorino", property: "3988 W 48th St., Cleveland Ohio 44102", onTrack: "tasks_overdue", stage: "Info Collection & Onboarding", assignee: "Monica Shaw", dueAt: "2/20/28 6:00 PM", createdAt: "1/30/26 4:37 PM", relatedEntity: { type: "Owner", name: "Gilbert Victorino" }, processType: "Owner Onboarding Process", status: "Overdue", assignedTeam: "Seth Team", lastTouched: "1/30/26 4:37 PM" },
  { id: "p4", name: "Eviction Process for 13701 CLAIBORNE RD - Down unit", property: "13701 CLAIBORNE RD - 13701 CLAIBORNE RD, East Cleveland, OH, 44112 - Unit...", onTrack: "tasks_overdue", stage: "Filing Fee Eviction", assignee: "Tabitha Allan", dueAt: "2/31/26 6:00 PM", createdAt: "1/30/26 10:19 AM", relatedEntity: { type: "Tenant", name: "James Wilson" }, processType: "Eviction Process", status: "Overdue", assignedTeam: "Bisma Team", lastTouched: "1/30/26 10:19 AM" },
  { id: "p5", name: "Property Onboarding for 10314 HARVARD AVE, CLEVELAND, OH 44105", property: "10314 HARVARD AVE, CLEVELAND, OH 44105", onTrack: "no_overdue", stage: "Information & Add Property In AF", assignee: "Tabitha Allan", dueAt: "3/31/26 6:00 PM", createdAt: "1/30/26 11:00 AM", relatedEntity: { type: "Owner", name: "Sarah Chen" }, processType: "Property Onboarding Process", status: "In-Progress", assignedTeam: "Daniel Team", lastTouched: "1/30/26 11:00 AM" },
  { id: "p6", name: "Lease Renewal for 4648 E. 173rd St.", property: "4648 E. 173rd St., Cleveland, OH, 44128 - 4648 E. 173rd St.., Cleveland., OH...", onTrack: "overdue_date", overdueDate: "Dec 9 '25", stage: "Upcoming", assignee: "Mason Ryan", dueAt: "12/5/25 6:00 PM", createdAt: "9/12/26 10:06 AM", relatedEntity: { type: "Tenant", name: "Emily Davis" }, processType: "Lease Renewal Process", status: "Overdue", assignedTeam: "Tee Team", lastTouched: "9/12/26 10:06 AM" },
  { id: "p7", name: "Lease Renewal for 10502 Lamontier Ave - DN unit", property: "10502 Lamontier Ave., Cleveland., OH, 44104 - Unit #DN unit", onTrack: "overdue_date", overdueDate: "Jan 18 '26", stage: "Upcoming", assignee: "Kevn Rojs", dueAt: "1/18/26 6:00 PM", createdAt: "1/29/26 4:45 PM", relatedEntity: { type: "Tenant", name: "Michael Brown" }, processType: "Lease Renewal Process", status: "Overdue", assignedTeam: "Seth Team", lastTouched: "1/29/26 4:45 PM" },
  { id: "p8", name: "Eviction Process for 1355-57 WEST BLVD - Unit 3 - Third Floor", property: "1355-57 WEST BLVD, OHIO CLEVELAND, OH, 44102 - Unit #Unit...", onTrack: "tasks_overdue", stage: "Filing For Eviction", assignee: "Jason Egerton", dueAt: "3/30/26 6:00 PM", createdAt: "1/28/26 4:40 PM", relatedEntity: { type: "Tenant", name: "Robert Johnson" }, processType: "Eviction Process", status: "Overdue", assignedTeam: "Bisma Team", lastTouched: "1/28/26 4:40 PM" },
  { id: "p9", name: "Property Onboarding for 10404 South Blvd, Cleveland, Ohio 44108", property: "10404 South Blvd, Cleveland, Ohio 44108", onTrack: "tasks_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Rose Avery", dueAt: "3/30/26 6:00 PM", createdAt: "1/29/26 3:53 PM", relatedEntity: { type: "Prospect", name: "David Lee" }, processType: "Property Onboarding Process", status: "Overdue", assignedTeam: "Daniel Team", lastTouched: "1/29/26 3:53 PM" },
  { id: "p10", name: "Lease Renewal for 8814 Vineyard Ave - 8814 Vineyard Ave - Up", property: "8814 Vineyard Ave, Cleveland., OH, 44105 - Unit #8814 Vineyard Ave - Up", onTrack: "overdue_date", overdueDate: "Jul 8 '25", stage: "Send Lease", assignee: "Kevn Rojs", dueAt: "7/8/25 6:00 PM", createdAt: "1/29/26 3:50 PM", relatedEntity: { type: "Tenant", name: "Jennifer White" }, processType: "Lease Renewal Process", status: "Overdue", assignedTeam: "Tee Team", lastTouched: "1/29/26 3:50 PM" },
  { id: "p11", name: "Property Onboarding for 6703 Elwell Ave, Cleveland, Ohio 44104", property: "9703 Elwell Ave, Cleveland, Ohio 44104", onTrack: "tasks_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Rose Avery", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 3:41 PM", relatedEntity: { type: "Owner", name: "Thomas Anderson" }, processType: "Property Onboarding Process", status: "Overdue", assignedTeam: "Seth Team", lastTouched: "1/29/26 3:41 PM" },
  { id: "p12", name: "Property Termination for 8010 CORY AVE", property: "8010 CORY AVE, Cleveland, OH, 44103", onTrack: "tasks_overdue", stage: "Owner Account", assignee: "Brett Anderson", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 2:42 PM", relatedEntity: { type: "Property", name: "8010 CORY AVE" }, processType: "Property Termination Process", status: "Overdue", assignedTeam: "Bisma Team", lastTouched: "1/29/26 2:42 PM" },
  { id: "p13", name: "Property Termination for 4 Privat Drive", property: "4 Privat Drive, Little Whinging, South Dakota, 57326", onTrack: "tasks_overdue", stage: "Tenants Accounts", assignee: "Amanda Harris", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 2:26 PM", relatedEntity: { type: "Property", name: "4 Privat Drive" }, processType: "Property Termination Process", status: "Overdue", assignedTeam: "Daniel Team", lastTouched: "1/29/26 2:26 PM" },
  { id: "p14", name: "Property Onboarding for 12003 SAYWELL AVE, CLEVELAND, OH 44108", property: "12003 SAYWELL AVE - 12003 SAYWELL AVE, CLEVELAND, OH 44108, Clevela...", onTrack: "tasks_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Aiden Brooks", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 1:18 PM", relatedEntity: { type: "Owner", name: "Lisa Garcia" }, processType: "Property Onboarding Process", status: "Overdue", assignedTeam: "Tee Team", lastTouched: "1/29/26 1:18 PM" },
  { id: "p15", name: "Delinquency Process for Unit 5A", property: "1234 Main St, Cleveland, OH 44101", onTrack: "tasks_overdue", stage: "Late Notice Sent", assignee: "Monica Shaw", dueAt: "2/15/26 6:00 PM", createdAt: "1/25/26 9:00 AM", relatedEntity: { type: "Tenant", name: "Chris Taylor" }, processType: "Delinquency Process", status: "In-Progress", assignedTeam: "Seth Team", lastTouched: "2/1/26 3:00 PM" },
  { id: "p16", name: "Owner Onboarding for Patricia Mills", property: "5678 Oak Ave, Cleveland, OH 44102", onTrack: "no_overdue", stage: "Welcome Call", assignee: "Devin Clarke", dueAt: "3/1/26 6:00 PM", createdAt: "2/10/26 2:00 PM", relatedEntity: { type: "Owner", name: "Patricia Mills" }, processType: "Owner Onboarding Process", status: "Open", assignedTeam: "Daniel Team", lastTouched: "2/10/26 2:00 PM" },
]

const teamTabs = [
  { id: "assigned", label: "Active: Assigned To Me" },
  { id: "daniel", label: "Daniel Team" },
  { id: "tee", label: "Tee Team" },
  { id: "seth", label: "Seth Team" },
  { id: "bisma", label: "Bisma Team" },
  { id: "custom", label: "Custom" },
]

const availableStages = [
  "Collecting Information & Add Property In AF",
  "Info Collection & Onboarding",
  "Inspection & Estimation",
  "Filing Fee Eviction",
  "Filing For Eviction",
  "Upcoming",
  "Send Lease",
  "Owner Account",
  "Tenants Accounts",
  "Communication For Funds Contribution - Active",
  "Start Process For Section 8/EDEN Residents",
  "Scheduling - Pre Move Out",
]

const availableAssignees = [
  "Devin Clarke",
  "Zam",
  "Monica Shaw",
  "Tabitha Allan",
  "Mason Ryan",
  "Kevn Rojs",
  "Jason Egerton",
  "Rose Avery",
  "Brett Anderson",
  "Amanda Harris",
  "Aiden Brooks",
  "Michael Drew",
  "Ralph",
]

const teams = [
  { id: "daniel", name: "Daniel Team" },
  { id: "tee", name: "Tee Team" },
  { id: "seth", name: "Seth Team" },
  { id: "bisma", name: "Bisma Team" },
]

const folders = [
  { id: "onboarding", name: "Onboarding" },
  { id: "termination", name: "Termination" },
  { id: "renewal", name: "Lease Renewal" },
  { id: "eviction", name: "Eviction" },
]

type FilterType = "status" | "assignee" | "stage" | "onTrack" | "processes" | "property" | "createdAt" | "processName" | "processType" | "assignedTeam" | "relatedEntity"

interface ActiveFilter {
  type: FilterType
  value: string
  label: string
  stageValue?: string // For processes filter
}

interface SavedView {
  id: string
  name: string
  filters: ActiveFilter[]
  isDefault?: boolean
}

// Initial saved views
const initialSavedViews: SavedView[] = [
  { id: "v1", name: "My Overdue Processes", filters: [{ type: "status", value: "Overdue", label: "Overdue" }, { type: "assignee", value: "Devin Clarke", label: "Devin Clarke" }] },
  { id: "v2", name: "Leasing Team - In Progress", filters: [{ type: "assignedTeam", value: "Tee Team", label: "Tee Team" }, { type: "status", value: "In-Progress", label: "In-Progress" }] },
  { id: "v3", name: "All Open Tasks", filters: [{ type: "status", value: "Open", label: "Open" }] },
]

// Available process types for filter
const availableProcessTypes = [
  "Property Onboarding Process",
  "Owner Onboarding Process",
  "Lease Renewal Process",
  "Eviction Process",
  "Make Ready Process",
  "Property Termination Process",
  "Delinquency Process",
]

// Available properties for filter
const availableProperties = [
  "1903 W Grand Ave, Dayton, OH, 45402",
  "3715 W 39th St, Cleveland, OH, 44109",
  "3988 W 48th St., Cleveland Ohio 44102",
  "13701 CLAIBORNE RD, East Cleveland, OH, 44112",
  "10314 HARVARD AVE, CLEVELAND, OH 44105",
  "4648 E. 173rd St., Cleveland, OH, 44128",
  "10502 Lamontier Ave., Cleveland., OH, 44104",
  "8010 CORY AVE, Cleveland, OH, 44103",
]

export function ProcessesPage() {
  // Listing page state
  const [processTypes, setProcessTypes] = useState<ProcessType[]>(initialProcessTypes)
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  
  // Dashboard state
  const [activeTeamTab, setActiveTeamTab] = useState("assigned")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [processInstances, setProcessInstances] = useState<ProcessInstance[]>(initialProcessInstances)
  const [sortField, setSortField] = useState<"dueAt" | "createdAt">("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "status", value: "working", label: "Working" }
  ])
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([
    { id: "count", label: "Count", value: 768, visible: true },
    { id: "overdue", label: "Overdue", value: 526, visible: true },
    { id: "offTrack", label: "# Off Track", value: 221, visible: true },
    { id: "completed", label: "# Completed", value: 0, visible: true },
    { id: "timeToComplete", label: "Time To Complete", value: "n/a", visible: true },
  ])
  
  // Modal states
  const [showNewProcessModal, setShowNewProcessModal] = useState(false)
  const [showStartProcessModal, setShowStartProcessModal] = useState(false)
  const [showMoveToFolderModal, setShowMoveToFolderModal] = useState(false)
  const [showAssignToTeamModal, setShowAssignToTeamModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [showAddFilterModal, setShowAddFilterModal] = useState(false)
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showSaveViewModal, setShowSaveViewModal] = useState(false)
  
  // Form states
  const [newProcessName, setNewProcessName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedProcessForAction, setSelectedProcessForAction] = useState<ProcessType | null>(null)
  const [newFilterType, setNewFilterType] = useState<FilterType>("status")
  const [newFilterValue, setNewFilterValue] = useState("")
  const [newFilterStage, setNewFilterStage] = useState("") // For processes filter
  const [newFolderName, setNewFolderName] = useState("")
  const [newViewName, setNewViewName] = useState("")
  
  // Saved views state
  const [savedViews, setSavedViews] = useState<SavedView[]>(initialSavedViews)
  const [activeView, setActiveView] = useState<string | null>(null)
  const [processNameSearch, setProcessNameSearch] = useState("")

  // Handlers
  const handleViewDashboard = () => {
    setShowDashboard(true)
  }

  const handleBackToList = () => {
    setShowDashboard(false)
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === processInstances.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(processInstances.map(p => p.id))
    }
  }

  const handleSort = (field: "dueAt" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleRemoveSummaryCard = (cardId: string) => {
    setSummaryCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, visible: false } : card
    ))
  }

  const handleAddFilter = () => {
    if (newFilterValue) {
      const filterLabels: Record<FilterType, string> = {
        status: newFilterValue,
        assignee: newFilterValue,
        stage: newFilterValue,
        onTrack: newFilterValue === "no_overdue" ? "No overdue" : "Overdue",
        processes: newFilterStage ? `${newFilterValue} - ${newFilterStage}` : newFilterValue,
        property: newFilterValue,
        createdAt: newFilterValue,
      }
      setActiveFilters(prev => [...prev, {
        type: newFilterType,
        value: newFilterValue,
        label: filterLabels[newFilterType],
        stageValue: newFilterType === "processes" ? newFilterStage : undefined,
      }])
      setShowAddFilterModal(false)
      setNewFilterType("status")
      setNewFilterValue("")
      setNewFilterStage("")
    }
  }

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index))
  }

  const handleClearAllFilters = () => {
    setActiveFilters([])
  }

  const handleCreateProcessType = () => {
    if (newProcessName.trim()) {
      const newProcess: ProcessType = {
        id: `new-${Date.now()}`,
        name: newProcessName,
        isDraft: true,
        stages: 0,
      }
      setProcessTypes(prev => [...prev, newProcess])
      setNewProcessName("")
      setShowNewProcessModal(false)
    }
  }

  const handleDuplicateProcess = (process: ProcessType) => {
    const duplicate: ProcessType = {
      ...process,
      id: `dup-${Date.now()}`,
      name: `${process.name} (Copy)`,
    }
    setProcessTypes(prev => [...prev, duplicate])
  }

  const handleMoveToFolder = () => {
    if (selectedProcessForAction && selectedFolder) {
      setProcessTypes(prev => prev.map(p => 
        p.id === selectedProcessForAction.id ? { ...p, folder: selectedFolder } : p
      ))
      setShowMoveToFolderModal(false)
      setSelectedFolder("")
      setSelectedProcessForAction(null)
    }
  }

  const handleAssignToTeam = () => {
    if (selectedProcessForAction && selectedTeam) {
      setProcessTypes(prev => prev.map(p => 
        p.id === selectedProcessForAction.id ? { ...p, team: selectedTeam } : p
      ))
      setShowAssignToTeamModal(false)
      setSelectedTeam("")
      setSelectedProcessForAction(null)
    }
  }

  const handleDeleteProcess = () => {
    if (selectedProcessForAction) {
      setProcessTypes(prev => prev.filter(p => p.id !== selectedProcessForAction.id))
      setShowDeleteConfirmModal(false)
      setSelectedProcessForAction(null)
    }
  }

  const handleStageChange = (instanceId: string, newStage: string) => {
    setProcessInstances(prev => prev.map(p => 
      p.id === instanceId ? { ...p, stage: newStage } : p
    ))
  }

  const handleAssigneeChange = (instanceId: string, newAssignee: string) => {
    setProcessInstances(prev => prev.map(p => 
      p.id === instanceId ? { ...p, assignee: newAssignee } : p
    ))
  }

  const handleStartProcess = () => {
    setShowStartProcessModal(false)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // In real app, this would add to folders list
      setNewFolderName("")
      setShowNewFolderModal(false)
    }
  }

  const handleSaveView = () => {
    if (newViewName.trim()) {
      // In real app, this would save the current view configuration
      setNewViewName("")
      setShowSaveViewModal(false)
    }
  }

  // Filter instances based on active filters
  const filteredInstances = processInstances.filter((instance) => {
    return activeFilters.every((filter) => {
      switch (filter.type) {
        case "status":
          // Status filter - all working instances match "working"
          return filter.value === "working" || filter.value === "completed" || filter.value === "on_hold"
        case "assignee":
          return instance.assignee === filter.value
        case "stage":
          return instance.stage === filter.value
        case "onTrack":
          return instance.onTrack === filter.value || 
            (filter.value === "tasks_overdue" && (instance.onTrack === "tasks_overdue" || instance.onTrack === "overdue_date"))
        case "processes":
          // Filter by process type name
          const matchesProcess = instance.name.toLowerCase().includes(filter.value.toLowerCase().replace(" Process", ""))
          // If stage is also specified, filter by that too
          if (filter.stageValue && filter.stageValue !== "" && filter.stageValue !== "all") {
            return matchesProcess && instance.stage === filter.stageValue
          }
          return matchesProcess
        case "property":
          return instance.property.includes(filter.value)
        case "createdAt":
          // Simplified date filtering
          const today = new Date()
          const instanceDate = new Date(instance.createdAt)
          switch (filter.value) {
            case "today":
              return instanceDate.toDateString() === today.toDateString()
            case "yesterday":
              const yesterday = new Date(today)
              yesterday.setDate(yesterday.getDate() - 1)
              return instanceDate.toDateString() === yesterday.toDateString()
            case "last7days":
              const last7 = new Date(today)
              last7.setDate(last7.getDate() - 7)
              return instanceDate >= last7
            case "last30days":
              const last30 = new Date(today)
              last30.setDate(last30.getDate() - 30)
              return instanceDate >= last30
            default:
              return true
          }
        default:
          return true
      }
    })
  })

  // Sort filtered instances
  const sortedInstances = [...filteredInstances].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    if (sortDirection === "asc") {
      return aVal.localeCompare(bVal)
    }
    return bVal.localeCompare(aVal)
  })

  // All Processes Dashboard View
  if (showDashboard) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">All Processes</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-transparent"
                onClick={() => setShowStartProcessModal(true)}
              >
                <Plus className="h-4 w-4" />
                Start Process
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Team Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {teamTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTeamTab(tab.id)}
                className={`text-sm pb-2 border-b-2 transition-colors ${
                  activeTeamTab === tab.id
                    ? "text-gray-900 border-gray-900 font-medium"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowSaveViewModal(true)}
          >
            Save View
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4">
            {summaryCards.filter(card => card.visible).map((card) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">{card.label}</span>
                  <button 
                    type="button" 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleRemoveSummaryCard(card.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-3">
          {activeFilters.map((filter, index) => {
            const filterTypeLabels: Record<FilterType, string> = {
              status: "Status",
              assignee: "Assignee",
              stage: "Stage",
              onTrack: "On Track",
              processes: "Processes",
              property: "Property",
              createdAt: "Created At",
            }
            return (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full">
                <span className="text-sm text-gray-700">{filterTypeLabels[filter.type]}:</span>
                <span className="text-sm text-orange-600 font-medium">{filter.label}</span>
                <button 
                  type="button" 
                  className="text-orange-400 hover:text-orange-600"
                  onClick={() => handleRemoveFilter(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 bg-transparent"
            onClick={() => setShowAddFilterModal(true)}
          >
            <Filter className="h-3 w-3" />
            Add Filter
          </Button>
          {activeFilters.length > 0 && (
            <button 
              type="button" 
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={handleClearAllFilters}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Data Table */}
        <div className="px-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-2 text-left w-10">
                  <Checkbox 
                    checked={selectedRows.length === processInstances.length}
                    onCheckedChange={toggleAllRows}
                  />
                </th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Name</th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Properties</th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">On Track</th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">Stage</th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Assignee</th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  <button 
                    type="button"
                    onClick={() => handleSort("dueAt")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Due At 
                    {sortField === "dueAt" ? (
                      sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  <button 
                    type="button"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Created At 
                    {sortField === "createdAt" ? (
                      sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-2 text-center w-10">
                  <Settings className="h-4 w-4 text-gray-400" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInstances.map((instance) => (
                <tr key={instance.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <Checkbox 
                      checked={selectedRows.includes(instance.id)}
                      onCheckedChange={() => toggleRowSelection(instance.id)}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-900">{instance.name}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600 truncate block max-w-xs">{instance.property}</span>
                  </td>
                  <td className="py-3 px-2">
                    {instance.onTrack === "no_overdue" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        No overdue tasks
                      </span>
                    ) : instance.onTrack === "overdue_date" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                        <AlertTriangle className="h-3 w-3" />
                        Overdue! Due {instance.overdueDate}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                        <AlertTriangle className="h-3 w-3" />
                        Tasks overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="text-sm text-teal-600 hover:underline flex items-center gap-1 text-left">
                          {instance.stage}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-72">
                        {availableStages.map((stage) => (
                          <DropdownMenuItem 
                            key={stage}
                            onClick={() => handleStageChange(instance.id, stage)}
                            className={instance.stage === stage ? "bg-teal-50" : ""}
                          >
                            {stage}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="py-3 px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="text-sm text-gray-700 flex items-center gap-1">
                          {instance.assignee}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {availableAssignees.map((assignee) => (
                          <DropdownMenuItem 
                            key={assignee}
                            onClick={() => handleAssigneeChange(instance.id, assignee)}
                            className={instance.assignee === assignee ? "bg-blue-50" : ""}
                          >
                            {assignee}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600">{instance.dueAt}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm text-gray-600">{instance.createdAt}</span>
                  </td>
                  <td className="py-3 px-2" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Start Process Modal */}
        <Dialog open={showStartProcessModal} onOpenChange={setShowStartProcessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Process</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Process Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a process type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {processTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property (Optional)</Label>
                <Input placeholder="Search for a property..." />
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStartProcessModal(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleStartProcess} className="bg-blue-600 hover:bg-blue-700">Start Process</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Filter Modal */}
        <Dialog open={showAddFilterModal} onOpenChange={setShowAddFilterModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Filter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Filter Type</Label>
                <Select value={newFilterType} onValueChange={(val) => {
                  setNewFilterType(val as FilterType)
                  setNewFilterValue("")
                  setNewFilterStage("")
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="assignee">Assignee</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="onTrack">On Track</SelectItem>
                    <SelectItem value="processes">Processes</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="createdAt">Created At</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                {newFilterType === "assignee" ? (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : newFilterType === "stage" ? (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : newFilterType === "onTrack" ? (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_overdue">No overdue tasks</SelectItem>
                      <SelectItem value="tasks_overdue">Tasks overdue</SelectItem>
                    </SelectContent>
                  </Select>
                ) : newFilterType === "processes" ? (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProcessTypes.map((processType) => (
                        <SelectItem key={processType} value={processType}>{processType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : newFilterType === "property" ? (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProperties.map((property) => (
                        <SelectItem key={property} value={property}>{property}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : newFilterType === "createdAt" ? (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={newFilterValue} onValueChange={setNewFilterValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {/* Stage selection for Processes filter */}
              {newFilterType === "processes" && newFilterValue && (
                <div className="space-y-2">
                  <Label>Stage (Optional)</Label>
                  <Select value={newFilterStage} onValueChange={setNewFilterStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      {availableStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddFilterModal(false)
                setNewFilterType("status")
                setNewFilterValue("")
                setNewFilterStage("")
              }} className="bg-transparent">Cancel</Button>
              <Button onClick={handleAddFilter} className="bg-blue-600 hover:bg-blue-700">Add Filter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Save View Modal */}
        <Dialog open={showSaveViewModal} onOpenChange={setShowSaveViewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current View</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>View Name</Label>
                <Input 
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="Enter view name..."
                />
              </div>
              <p className="text-sm text-gray-500">
                This will save your current filters, sorting, and visible columns.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveViewModal(false)} className="bg-transparent">Cancel</Button>
              <Button onClick={handleSaveView} className="bg-blue-600 hover:bg-blue-700">Save View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Process List View
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 px-6 py-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded">
              Processes
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="text-sm text-gray-600 hover:text-gray-800">
                  Assign
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {teams.map((team) => (
                  <DropdownMenuItem key={team.id}>{team.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button 
              type="button" 
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              onClick={() => setShowNewProcessModal(true)}
            >
              <Pencil className="h-3 w-3 text-gray-400" />
              New
            </button>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">Processes</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm bg-white border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={handleViewDashboard}
            >
              All Processes Dashboard
            </Button>
            <Button 
              size="sm" 
              className="text-sm bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowNewProcessModal(true)}
            >
              New Process Type
            </Button>
          </div>
          <button 
            type="button" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            onClick={() => setShowNewFolderModal(true)}
          >
            New Filter 
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Processes are workflows that help you achieve goals for your owners and tenants.
        </p>
      </div>

      {/* Unassigned Processes Section */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Unassigned Processes</h2>
          <span className="text-sm text-gray-500">{processTypes.length} processes</span>
        </div>

        {/* Process List */}
        <div className="divide-y divide-gray-200 border-t border-gray-200">
          {processTypes.map((process) => (
            <div
              key={process.id}
              className={`flex items-center justify-between py-4 px-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedProcess === process.id ? "bg-teal-50/40" : ""
              }`}
              onClick={() => setSelectedProcess(process.id)}
            >
              <div className="flex items-center gap-4">
                {/* Teal folder icon */}
                <div className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                
                {/* Process name - clickable */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDashboard()
                    }}
                    className="text-[15px] font-semibold text-gray-900 hover:text-teal-700 text-left transition-colors"
                  >
                    {process.name}
                  </button>
                  
                  {/* Draft badge */}
                  {process.isDraft && (
                    <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                      Draft
                    </span>
                  )}

                  {/* Team badge */}
                  {process.team && (
                    <span className="px-2 py-0.5 text-xs text-teal-600 bg-teal-50 rounded">
                      {teams.find(t => t.id === process.team)?.name}
                    </span>
                  )}

                  {/* Folder badge */}
                  {process.folder && (
                    <span className="px-2 py-0.5 text-xs text-purple-600 bg-purple-50 rounded">
                      {folders.find(f => f.id === process.folder)?.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Stages count */}
                <span className="text-sm text-gray-400">{process.stages} stages</span>
                
                {/* More menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDashboard()}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Process
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateProcess(process)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      setSelectedProcessForAction(process)
                      setShowMoveToFolderModal(true)
                    }}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Move to Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedProcessForAction(process)
                      setShowAssignToTeamModal(true)
                    }}>
                      <Users className="h-4 w-4 mr-2" />
                      Assign to Team
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => {
                        setSelectedProcessForAction(process)
                        setShowDeleteConfirmModal(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Process Type Modal */}
      <Dialog open={showNewProcessModal} onOpenChange={setShowNewProcessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Process Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Process Name</Label>
              <Input 
                value={newProcessName}
                onChange={(e) => setNewProcessName(e.target.value)}
                placeholder="Enter process name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProcessModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleCreateProcessType} className="bg-blue-600 hover:bg-blue-700">Create Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Folder Modal */}
      <Dialog open={showMoveToFolderModal} onOpenChange={setShowMoveToFolderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Move "{selectedProcessForAction?.name}" to a folder
            </p>
            <div className="space-y-2">
              <Label>Select Folder</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a folder..." />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveToFolderModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleMoveToFolder} className="bg-blue-600 hover:bg-blue-700">Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign to Team Modal */}
      <Dialog open={showAssignToTeamModal} onOpenChange={setShowAssignToTeamModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">
              Assign "{selectedProcessForAction?.name}" to a team
            </p>
            <div className="space-y-2">
              <Label>Select Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team..." />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignToTeamModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleAssignToTeam} className="bg-blue-600 hover:bg-blue-700">Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Process</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete "{selectedProcessForAction?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleDeleteProcess} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Modal */}
      <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Folder Name</Label>
              <Input 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderModal(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleCreateFolder} className="bg-blue-600 hover:bg-blue-700">Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
