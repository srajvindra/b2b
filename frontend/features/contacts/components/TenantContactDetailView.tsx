import { useState } from "react"
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  PhoneCall,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Pin,
  Calendar,
  Users,
  StickyNote,
  FileText,
  Download,
  Eye,
  X,
  CheckSquare,
  Edit,
  CheckCircle2,
  Circle,
  Clock,
  Home,
  DollarSign,
  User,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Shield,
  Plus,
  History,
  Upload,
  Workflow,
  PlayCircle,
  Trash2,
  FolderOpen,
  Search,
  Paperclip,
  ExternalLink,
  HelpCircle,
  Info,
  Bell,
  Pencil,
  AlertTriangle,
  ListTodo,
  RotateCcw,
  ArrowRight,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Smile,
  Type,
  ArrowLeftRight,
  Wrench,
  EyeOff,
  ClipboardList,
  Lock,
  Printer,
  UserPlus,
  BarChart3,
  TrendingUp,
  Sparkles,
  Star,
  Globe,
  Receipt,
  SearchCheck,
  Layers,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check } from "lucide-react"
import { SMSPopupModal } from "@/components/sms-popup-modal"
import { EmailPopupModal } from "@/components/email-popup-modal"
import { useNav } from "@/app/dashboard/page"
import { useQuickActions } from "@/context/QuickActionsContext"
import { tenantContactQuickActions } from "@/lib/quickActions"
import type {
  Contact,
  ContactStatus,
  CommunicationItem,
  OwnerTask,
  OwnerProcessItem,
  TeamMember,
  AssignedTeamMember,
} from "@/features/contacts/types"
import {
  getTenantCommunications,
  getTenantDocuments,
  getTenantTasks,
  TENANT_PROCESSES,
  TENANT_PROPERTY_INFO,
  TENANT_NOTES,
  TENANT_LETTERS,
  TENANT_MISSING_DOCUMENTS,
  TENANT_AUDIT_LOGS,
} from "@/features/contacts/tenant/data"
import { teamMembers, initialAssignedTeam, allStaffMembers } from "@/features/contacts/data/ownerDetailData"
import { tenantMissingFields } from "@/features/contacts/data/contactDetailMock"
import {
  TenantInformationTab,
  TenantUnitInformationTab,
  OwnerCommunicationTab,
  OwnerProcessesTab,
  OwnerDocumentTab,
  OwnerAuditLogTab,
} from "@/features/contacts/tenant/components"

interface ContactTenantDetailPageProps {
  contact: Contact
  onBack: () => void
  onNavigateToUnitDetail?: (unitId: string, propertyId: string) => void
  /** When provided (e.g. on /contacts/tenants/[id]), process row clicks navigate to the process detail page by id. */
  onNavigateToProcess?: (process: OwnerProcessItem, contactName: string) => void
}

// Communications, documents, tasks, processes, audit logs, property, notes, letters moved to @/features/contacts/tenant/data
export default function ContactTenantDetailPage({ contact, onBack, onNavigateToUnitDetail, onNavigateToProcess }: ContactTenantDetailPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null)
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set())
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [taggedUsers, setTaggedUsers] = useState<TeamMember[]>([])
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const [tasks, setTasks] = useState<OwnerTask[]>(getTenantTasks())
  const [viewTaskModalOpen, setViewTaskModalOpen] = useState(false)
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<OwnerTask | null>(null)
  const [showDeletedNoteModal, setShowDeletedNoteModal] = useState(false)
  const [selectedDeletedNote, setSelectedDeletedNote] = useState<{
    content: string
    deletedBy: string
    deletedOn: string
  } | null>(null)

  const [isTasksExpanded, setIsTasksExpanded] = useState(true)
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(true)
  const [tasksToShow, setTasksToShow] = useState(5)

  const [activeTab, setActiveTab] = useState<"overview" | "tenant-info" | "property" | "processes" | "communications" | "documents" | "audit-log">("overview")

  // Tenant stage state
  const [tenantStage, setTenantStage] = useState<string>("current")

  // Processes tab state
  const [processStatusFilter, setProcessStatusFilter] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([])
  const nav = useNav()

  useQuickActions(tenantContactQuickActions, {
    subtitle: "Tenant",
    aiSuggestedPrompts: [
      "Summarize this tenant",
      "Open tasks for this tenant",
      "Lease and payment history",
    ],
    aiPlaceholder: "Ask about this tenant...",
  })

  // Start new process modal
  const [showStartProcessModal, setShowStartProcessModal] = useState(false)
  const [processSearchQuery, setProcessSearchQuery] = useState("")
  const [newlyStartedProcesses, setNewlyStartedProcesses] = useState<Array<{
    id: string
    name: string
    prospectingStage: string
    startedOn: string
    status: string
    tasks: Array<{ id: string; name: string; startDate: string | null; completedDate: string | null; staffName: string; staffEmail: string }>
  }>>([])

  const toggleProcessExpanded = (processId: string) => {
    setExpandedProcesses((prev) =>
      prev.includes(processId) ? prev.filter((id) => id !== processId) : [...prev, processId],
    )
  }

  const handleStartNewProcess = (processType: { id: string; name: string; stages: number }) => {
    const today = new Date()
    const dateStr = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`
    setNewlyStartedProcesses(prev => [...prev, {
      id: `proc-new-${Date.now()}`,
      name: processType.name,
      prospectingStage: "Active",
      startedOn: dateStr,
      status: "In Progress",
      tasks: [],
    }])
    setShowStartProcessModal(false)
    setProcessSearchQuery("")
    setProcessStatusFilter("in-progress")
  }

  const handleNavigateToProcess = (processName: string) => {
    setActiveTab("processes")
    const allProcesses = [
      ...TENANT_PROCESSES.inProgress,
      ...TENANT_PROCESSES.upcoming,
      ...TENANT_PROCESSES.completed,
      ...newlyStartedProcesses,
    ]
    const match = allProcesses.find((p) => p.name === processName)
    if (match) {
      setExpandedProcesses((prev) => (prev.includes(match.id) ? prev : [...prev, match.id]))
    }
  }

  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

  // SMS Modal state
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [selectedSMSItem, setSelectedSMSItem] = useState<CommunicationItem | null>(null)

  // Email Modal state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedEmailItem, setSelectedEmailItem] = useState<CommunicationItem | null>(null)

  // Tenant Information collapsible sections
  const [screeningExpanded, setScreeningExpanded] = useState(false)
  const [emergencyContactExpanded, setEmergencyContactExpanded] = useState(false)

  // Missing Information Modal state
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [missingInfoTab, setMissingInfoTab] = useState<"fields" | "documents">("fields")

  // Notes modal state
  const [selectedNote, setSelectedNote] = useState<{
    id: number
    title: string
    content: string
    createdBy: string
    createdAt: string
  } | null>(null)
  const [showNoteModal, setShowNoteModal] = useState(false)

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium" as OwnerTask["priority"],
    dueDate: "",
  })

  const [showUploadDocModal, setShowUploadDocModal] = useState(false)
  const [uploadDoc, setUploadDoc] = useState({
    file: null as File | null,
    documentType: "",
    assignee: "",
    comments: "",
  })

  const [showRequestDocModal, setShowRequestDocModal] = useState(false)
  const [requestedDoc, setRequestedDoc] = useState({
    name: "",
    type: "",
    notes: "",
  })

  // Team management modal state
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [assignedTeam, setAssignedTeam] = useState<AssignedTeamMember[]>(initialAssignedTeam)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [staffSearchQuery, setStaffSearchQuery] = useState("")

  // Activity section filter state
  const [activityTileFilter, setActivityTileFilter] = useState<"all" | "emails" | "sms" | "notes">("all")
  const [activityRadioFilter, setActivityRadioFilter] = useState<"all" | "unread" | "unresponded">("all")
  const [activityChatTab, setActivityChatTab] = useState<"private" | "group">("private")

  // Communication Thread Modal State
  const [showThreadModal, setShowThreadModal] = useState(false)
  const [expandedThreadEmails, setExpandedThreadEmails] = useState<string[]>([])
  const [threadReplyText, setThreadReplyText] = useState("")
  const [threadReplyChannel, setThreadReplyChannel] = useState<"email" | "sms">("email")
  const [threadEmailCC, setThreadEmailCC] = useState("")
  const [threadEmailBCC, setThreadEmailBCC] = useState("")
  const [showCCBCC, setShowCCBCC] = useState(false)
  const [threadEmailSubject, setThreadEmailSubject] = useState("")

  // Communications tab filter state (separate from Activity section)
  const [commTileFilter, setCommTileFilter] = useState<"all" | "emails" | "sms">("all")
  const [commRadioFilter, setCommRadioFilter] = useState<"all" | "unread" | "unresponded">("all")

  // Communications tab composer state
  const [commMessage, setCommMessage] = useState("")
  const [commChannel, setCommChannel] = useState<"email" | "sms" | "call">("email")
  const [commSubTab, setCommSubTab] = useState<"private" | "group">("private")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [expandedCommEmails, setExpandedCommEmails] = useState<Set<string>>(new Set())
  const [emailComposeCc, setEmailComposeCc] = useState("")
  const [emailComposeBcc, setEmailComposeBcc] = useState("")
  const [emailComposeSubject, setEmailComposeSubject] = useState("")
  const [emailComposeBody, setEmailComposeBody] = useState("")
  const [showCcBcc, setShowCcBcc] = useState(false)

  const communications = getTenantCommunications(contact.name, contact.phone, contact.email)
  const documents = getTenantDocuments()

  // Calculate Communications tab summary counts (excludes notes)
  const commSummary = {
    emails: {
      unread: communications.filter(c => c.type === "email" && !c.isRead && c.isIncoming).length,
      unresponded: communications.filter(c => c.type === "email" && c.isRead && c.isIncoming && !c.isResponded).length,
    },
    sms: {
      unread: communications.filter(c => c.type === "sms" && !c.isRead && c.isIncoming).length,
      unresponded: communications.filter(c => c.type === "sms" && c.isRead && c.isIncoming && !c.isResponded).length,
    },
    calls: communications.filter(c => c.type === "call").length,
    get emailsTotal() { return this.emails.unread + this.emails.unresponded },
    get smsTotal() { return this.sms.unread + this.sms.unresponded },
    get all() { return this.emailsTotal + this.smsTotal + this.calls },
  }

  // Filter communications for Communications tab (emails, SMS, calls only - no notes)
  const filteredCommsForTab = communications
    .filter((item) => item.type === "email" || item.type === "sms" || item.type === "call")
    .filter((item) => {
      // Filter by tile selection
      if (commTileFilter === "emails" && item.type !== "email") return false
      if (commTileFilter === "sms" && item.type !== "sms") return false

      // Filter by radio selection
      if (commRadioFilter === "unread") {
        if (item.type === "call") return false
        return !item.isRead && item.isIncoming
      }
      if (commRadioFilter === "unresponded") {
        return item.isIncoming && item.isRead && !item.isResponded
      }

      return true
    })

  // Filter communications by chat tab (Private vs Group)
  const chatTabFilteredComms = communications.filter((item) => {
    if (activityChatTab === "private") {
      return !item.isGroupChat // Private: one-to-one communications
    } else {
      return item.isGroupChat === true // Group: multi-party communications
    }
  })

  // Calculate activity summary counts (filtered by chat tab)
  const activitySummary = {
    emails: {
      unread: chatTabFilteredComms.filter(c => c.type === "email" && !c.isRead && c.isIncoming).length,
      unresponded: chatTabFilteredComms.filter(c => c.type === "email" && c.isRead && c.isIncoming && !c.isResponded).length,
    },
    sms: {
      unread: chatTabFilteredComms.filter(c => c.type === "sms" && !c.isRead && c.isIncoming).length,
      unresponded: chatTabFilteredComms.filter(c => c.type === "sms" && c.isRead && c.isIncoming && !c.isResponded).length,
    },
    calls: chatTabFilteredComms.filter(c => c.type === "call").length,
    notes: chatTabFilteredComms.filter(c => c.type === "note").length,
    get emailsTotal() { return this.emails.unread + this.emails.unresponded },
    get smsTotal() { return this.sms.unread + this.sms.unresponded },
    get all() { return this.emailsTotal + this.smsTotal + this.calls + this.notes },
  }

  const pinnedCommunications = chatTabFilteredComms.filter((item) => pinnedIds.has(item.id))

  // Filter unpinned communications based on tile and radio filters
  const unpinnedCommunications = chatTabFilteredComms
    .filter((item) => !pinnedIds.has(item.id))
    .filter((item) => {
      // First filter by tile selection
      if (activityTileFilter === "emails" && item.type !== "email") return false
      if (activityTileFilter === "sms" && item.type !== "sms") return false
      if (activityTileFilter === "notes" && item.type !== "note") return false

      // Then filter by radio selection
      if (activityRadioFilter === "unread") {
        if (item.type === "note") return false
        if (item.type === "call") return false
        return !item.isRead && item.isIncoming
      }
      if (activityRadioFilter === "unresponded") {
        if (item.type === "note") return false
        return item.isIncoming && item.isRead && !item.isResponded
      }

      return true
    })

  const tenantSummary = {
    propertyLabel: `${TENANT_PROPERTY_INFO.name} - ${TENANT_PROPERTY_INFO.address.split(",")[0]}`,
    fullAddress: TENANT_PROPERTY_INFO.address,
    recurringCharges: TENANT_PROPERTY_INFO.rentInfo.monthlyRent,
    currentBalance: 3743,
    depositPaid: TENANT_PROPERTY_INFO.rentInfo.securityDeposit > 0 ? TENANT_PROPERTY_INFO.rentInfo.securityDeposit : 0,
    lastReceipt: "01/30/2026",
    leaseEndDate: TENANT_PROPERTY_INFO.leaseInfo.endDate,
    activePortals: 3,
    totalPortals: 3,
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setPinnedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Open communication thread modal
  const openThreadModal = () => {
    setExpandedThreadEmails([])
    setThreadReplyText("")
    setShowCCBCC(false)
    setThreadEmailCC("")
    setThreadEmailBCC("")
    setThreadReplyChannel("email")
    setShowThreadModal(true)
  }

  // Toggle email expansion in thread
  const toggleThreadEmailExpand = (emailId: string) => {
    setExpandedThreadEmails((prev) =>
      prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]
    )
  }

  // Get combined communication thread (all emails, SMS, calls in chronological order)
  const getCommunicationThread = () => {
    const threadItems = communications.filter(
      (c) => !c.isGroupChat && c.type !== "note" && (c.type === "sms" || c.type === "email" || c.type === "call")
    )
    return threadItems.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const handleNoteContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNoteContent(value)

    const lastAtIndex = value.lastIndexOf("@")
    if (lastAtIndex !== -1) {
      const textAfterAt = value.slice(lastAtIndex + 1)
      if (!textAfterAt.includes(" ")) {
        setMentionSearch(textAfterAt.toLowerCase())
        setShowMentionDropdown(true)
      } else {
        setShowMentionDropdown(false)
      }
    } else {
      setShowMentionDropdown(false)
    }
  }

  const handleSelectMention = (user: TeamMember) => {
    const lastAtIndex = noteContent.lastIndexOf("@")
    const newContent = noteContent.slice(0, lastAtIndex) + `@${user.name} `
    setNoteContent(newContent)
    if (!taggedUsers.find((u) => u.id === user.id)) {
      setTaggedUsers([...taggedUsers, user])
    }
    setShowMentionDropdown(false)
  }

  const handleRemoveTag = (userId: string) => {
    setTaggedUsers(taggedUsers.filter((u) => u.id !== userId))
  }

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      console.log("Saving note:", noteContent, "Tagged users:", taggedUsers)
      setNoteContent("")
      setTaggedUsers([])
      setShowAddNoteModal(false)
    }
  }

  const filteredMentions = teamMembers.filter(
    (user) => user.name.toLowerCase().includes(mentionSearch) && !taggedUsers.find((u) => u.id === user.id),
  )

  const handleSendReply = (id: string, type: CommunicationItem["type"]) => {
    if (replyContent.trim()) {
      console.log(`Sending ${type} reply to ${id}: ${replyContent}`)
      setReplyContent("")
      setReplyingToId(null)
    }
  }

  const getActionVerb = (type: CommunicationItem["type"]) => {
    switch (type) {
      case "email":
        return "emailed"
      case "sms":
        return "texted"
      case "call":
        return "called"
      case "note":
        return "left a Note"
    }
  }

  const getActionVerbColor = (type: CommunicationItem["type"]) => {
    switch (type) {
      case "email":
        return "text-emerald-600"
      case "sms":
        return "text-amber-600"
      case "call":
        return "text-emerald-600"
      case "note":
        return "text-amber-600"
    }
  }

  const getStatusBadgeStyle = (status: OwnerTask["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "In Progress":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Pending":
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const handleViewTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setViewTaskModalOpen(true)
  }

  const handleEditTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setEditTaskModalOpen(true)
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "Completed" as OwnerTask["status"] } : t)))
  }

  const handleSaveTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? selectedTask : t)))
      setEditTaskModalOpen(false)
      setSelectedTask(null)
    }
  }

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      const task: OwnerTask = {
        id: `task${tasks.length + 1}`,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee || "Unassigned",
        status: "Pending",
        priority: newTask.priority,
        dueDate: newTask.dueDate || "TBD",
        createdDate: new Date().toLocaleDateString(),
        propertyName: TENANT_PROPERTY_INFO.name,
        propertyAddress: TENANT_PROPERTY_INFO.address,
      }
      setTasks([...tasks, task])
      setNewTask({ title: "", description: "", assignee: "", priority: "Medium", dueDate: "" })
      setShowNewTaskModal(false)
    }
  }

  const handleRequestDocument = () => {
    if (requestedDoc.name.trim()) {
      console.log("Document requested:", requestedDoc)
      setRequestedDoc({ name: "", type: "", notes: "" })
      setShowRequestDocModal(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "gym":
        return <Dumbbell className="h-4 w-4" />
      case "pool":
        return <Waves className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      default:
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const renderCommunicationItem = (item: CommunicationItem, index: number, isPinned = false) => {
    // Special rendering for email_open type
    if (item.type === "email_open") {
      return (
        <div key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
          <div className={`p-4 ${isPinned ? "border-l-4 border-slate-500" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-amber-600">
                    A recipient opened the email "{item.emailSubject}" {item.timestamp}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <button
                  onClick={(e) => handleTogglePin(e, item.id)}
                  className={`p-1 rounded hover:bg-slate-200 ${pinnedIds.has(item.id) ? "text-slate-600" : "text-muted-foreground"}`}
                >
                  <Pin className={`h-4 w-4 ${pinnedIds.has(item.id) ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
        <div
          className={`p-4 cursor-pointer hover:bg-slate-100 transition-colors ${isPinned ? "border-l-4 border-slate-500" : ""}`}
          onClick={() => {
            // For SMS and Email, open the thread modal
            if (item.type === "sms" || item.type === "email") {
              openThreadModal()
              return
            }
            // For calls and notes, toggle inline expansion
            setExpandedId(expandedId === item.id ? null : item.id)
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${item.isIncoming ? "bg-gray-200 text-gray-700" : "bg-slate-200 text-slate-700"
                    }`}
                >
                  {getInitials(item.from.name)}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ${item.type === "email"
                    ? "bg-emerald-500"
                    : item.type === "sms" || item.type === "note"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                    }`}
                >
                  {item.type === "email" && <Mail className="h-3 w-3 text-white" />}
                  {(item.type === "sms" || item.type === "note") && <MessageSquare className="h-3 w-3 text-white" />}
                  {item.type === "call" && <PhoneCall className="h-3 w-3 text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-1 text-sm">
                  {item.type === "note" ? (
                    <>
                      <span className="font-medium text-slate-800">{item.from.name}</span>
                      <span className="text-amber-600 font-medium">left a Note</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-slate-800">{item.from.name}</span>
                      <span className="text-muted-foreground">{item.from.contact}</span>
                      <span className={`font-medium ${getActionVerbColor(item.type)}`}>{getActionVerb(item.type)}</span>
                      <span className="font-medium text-slate-800">{item.to.name}</span>
                      <span className="text-muted-foreground">{item.to.contact}</span>
                    </>
                  )}
                </div>
                {item.isGroupChat && item.groupParticipants && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.groupParticipants.length <= 3
                      ? item.groupParticipants.join(", ")
                      : `${item.groupParticipants[0]} + ${item.groupParticipants.length - 1} others`}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.preview}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 shrink-0">
              {item.isGroupChat && (item.unreadCount ?? 0) > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-500 text-white text-xs font-medium">
                  {item.unreadCount}
                </span>
              )}
              {!item.isRead && !item.isGroupChat && <div className="h-2 w-2 rounded-full bg-blue-500" />}
              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${expandedId === item.id ? "rotate-180" : ""}`}
              />
              <button
                onClick={(e) => handleTogglePin(e, item.id)}
                className={`p-1 rounded hover:bg-slate-200 ${pinnedIds.has(item.id) ? "text-slate-600" : "text-muted-foreground"}`}
              >
                <Pin className={`h-4 w-4 ${pinnedIds.has(item.id) ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {expandedId === item.id && (
          <div className="px-4 pb-4 border-t bg-slate-50">
            <div className="pt-4 pl-12 space-y-4">
              {item.type === "email" && item.thread && (
                <div className="space-y-3">
                  {item.thread.map((email, idx) => (
                    <div
                      key={email.id}
                      className={`p-3 rounded-lg ${email.isIncoming ? "bg-white border" : "bg-slate-100"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{email.from}</span>
                          <span className="text-xs text-muted-foreground">{email.email}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{email.content}</p>
                      {/* Email Opens */}
                      {!email.isIncoming && email.emailOpens && email.emailOpens.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-dashed">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Email Opened</p>
                          <div className="space-y-1">
                            {email.emailOpens.map((open: { openedAt: string }, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-amber-600">
                                <Eye className="h-3 w-3" />
                                <span>Recipient opened this email on {open.openedAt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {item.type === "sms" && <p className="text-sm">{item.content}</p>}

              {item.type === "call" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{item.duration}</span>
                  </div>
                  {item.notes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Notes:</span>
                      <p className="text-sm mt-1">{item.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {item.type === "note" && <p className="text-sm">{item.content}</p>}

              {replyingToId === item.id ? (
                <div className="space-y-2">
                  <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary bg-white">
                    <Textarea
                      placeholder={`Reply via ${item.type === "email" ? "email" : "SMS"}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] border-0 focus-visible:ring-0 resize-none"
                    />
                    {/* Attachment Toolbar */}
                    <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
                      <label className="cursor-pointer">
                        <input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx" />
                        <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-xs">Attach files</span>
                        </div>
                      </label>
                      <span className="text-xs text-muted-foreground">Attach documents, images, or PDFs</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSendReply(item.id, item.type)}>
                      <Send className="h-3 w-3 mr-1" /> Send
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setReplyingToId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                (item.type === "email" || item.type === "sms") && (
                  <Button size="sm" variant="outline" onClick={() => setReplyingToId(item.id)}>
                    <Send className="h-3 w-3 mr-1" /> Reply
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenants
        </button>

        {/* Header Card - Tenant Information */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-medium text-slate-700">
                  {getInitials(contact.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-slate-800">{contact.name}</h1>
                    <Badge
                      variant="outline"
                      className={
                        contact.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs"
                          : contact.status === "Pending"
                            ? "bg-amber-100 text-amber-700 border-amber-200 text-xs"
                            : "bg-slate-100 text-slate-600 border-slate-200 text-xs"
                      }
                    >
                      {contact.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {contact.location}
                    </span>
                    {contact.source && (
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span className="text-muted-foreground">Source:</span>
                        <span>{contact.source}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Assigned Team Button */}
              <div className="flex items-center gap-3">

                {/* Stage Color Bar */}
                {[
                  { id: "move-in", label: "Move-in", color: "bg-orange-300" },
                  { id: "current", label: "Current", color: "bg-amber-500" },
                  { id: "delinquent", label: "Delinquent", color: "bg-lime-600" },
                  { id: "eviction", label: "Eviction", color: "bg-green-500" },
                  { id: "move-out", label: "Move-out", color: "bg-emerald-400" },
                  { id: "past-tenant", label: "Past Tenant", color: "bg-rose-300" },
                ].map((stage) => (
                  null
                ))}
                <Select value={tenantStage} onValueChange={setTenantStage}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="move-in">Move-in</SelectItem>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="delinquent">Delinquent</SelectItem>
                    <SelectItem value="eviction">Eviction</SelectItem>
                    <SelectItem value="move-out">Move-out</SelectItem>
                    <SelectItem value="past-tenant">Past Tenant</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowTeamModal(true)}
                  className="h-8 gap-2 text-sm font-normal bg-transparent"
                >
                  <Users className="h-4 w-4 text-teal-600" />
                  <span>Assigned Team</span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                    {assignedTeam.length}
                  </Badge>
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Summary Bar */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-muted/30">
            <p className="text-sm font-semibold text-foreground">
              {tenantSummary.propertyLabel}
              <span className="font-normal text-muted-foreground">{" | "}{tenantSummary.fullAddress}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
            {[
              { label: "RECURRING CHARGES", value: `$${tenantSummary.recurringCharges.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
              { label: "CURRENT BALANCE", value: `$${tenantSummary.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
              { label: "DEPOSIT PAID", value: `$${tenantSummary.depositPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
              { label: "LAST RECEIPT", value: tenantSummary.lastReceipt },
              { label: "LEASE END DATE", value: tenantSummary.leaseEndDate },
              { label: "ONLINE PORTAL STATUS", value: `${tenantSummary.activePortals}/${tenantSummary.totalPortals} Active Portals` },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-3 text-center">
                <p className="text-sm font-bold text-primary">{value}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bar 1: Pending Communications */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("overview")
            setTimeout(() => {
              const activitySection = document.getElementById("activity-section")
              if (activitySection) activitySection.scrollIntoView({ behavior: "smooth" })
            }, 100)
          }}
          className="w-full flex items-center justify-between px-5 py-2.5 rounded-lg border border-amber-300 bg-amber-50/80 hover:bg-amber-100/60 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Pending Communications</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <Mail className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Unread Emails: "}
                <span className="font-semibold">{commSummary.emails.unread}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Unread SMS: "}
                <span className="font-semibold">{commSummary.sms.unread}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3">
              <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Pending Calls: "}
                <span className="font-semibold">{commSummary.calls}</span>
              </span>
            </div>
          </div>
        </button>

        {/* Bar 2: Pending Actions */}
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
              <FileText className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Missing Fields: "}
                <span className="font-semibold">{tenantMissingFields.length}</span>
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
                <span className="font-semibold">{TENANT_MISSING_DOCUMENTS.length}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Bar 3: Task Overview */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("overview")
            setTimeout(() => {
              const tasksSection = document.getElementById("tasks-section")
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
                <span className="font-semibold">{tasks.filter(t => t.status === "Pending" && !t.processName).length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Pending Processes: "}
                <span className="font-semibold">{tasks.filter(t => t.status === "Pending" && !!t.processName).length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-sm text-red-700">
                {"Overdue Tasks: "}
                <span className="font-semibold">{tasks.filter(t => t.isOverdue && !t.processName).length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-sm text-red-700">
                {"Overdue Processes: "}
                <span className="font-semibold">{tasks.filter(t => t.isOverdue && !!t.processName).length}</span>
              </span>
            </div>
          </div>
        </button>

        {/* <div className="border-b">
          <div className="flex">
            {[
              { id: "overview", label: "Overview" },
              { id: "tenant-info", label: "Tenant Information" },
              { id: "property", label: "Unit Information" },
              { id: "communications", label: "Communications", count: communications.filter(c => c.type !== "note").length },
              { id: "processes", label: "Processes", count: TENANT_PROCESSES.inProgress.length + TENANT_PROCESSES.upcoming.length + TENANT_PROCESSES.completed.length },
              { id: "documents", label: "Documents", count: documents.length },
              { id: "audit-log", label: "Audit Log" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div> */}
        <div className="flex items-stretch border-b border-border">
          {[
            { id: "overview", label: "Overview" },
            { id: "tenant-info", label: "Details" },
            { id: "property", label: "Properties" },
            { id: "communications", label: "Communications", count: communications.filter(c => c.type !== "note").length },
            { id: "processes", label: "Processes", count: TENANT_PROCESSES.inProgress.length + TENANT_PROCESSES.upcoming.length + TENANT_PROCESSES.completed.length },
            { id: "documents", label: "Documents", count: documents.length },
            { id: "audit-log", label: "Audit Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id
                ? "border border-success text-foreground bg-background"
                : "border border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-xs text-muted-foreground">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Tasks Section */}
            <Card id="tasks-section">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-teal-600" />
                    Tasks ({tasks.length})
                  </h3>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-teal-600 hover:bg-teal-700"
                    onClick={() => setShowNewTaskModal(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New Task
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[320px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b sticky top-0 z-10">
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Task</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Related Entity</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Due Date</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Priority</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Assigned To</th>
                          <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-slate-800">{task.title}</span>
                                {task.processName && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleNavigateToProcess(task.processName || "") }}
                                    className="flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <Workflow className="h-3 w-3 text-teal-600" />
                                    <span className="text-xs text-teal-600">{task.processName}</span>
                                  </button>
                                )}
                                {task.autoCreated && (
                                  <span className="text-xs text-muted-foreground">Auto-created</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-sm text-slate-600">
                                {task.relatedEntityType}: {task.relatedEntityName}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-slate-600"}`}>
                                  {task.dueDate}
                                </span>
                                {task.isOverdue && (
                                  <span className="text-xs text-red-500">(Overdue)</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={`text-xs ${task.priority === "High"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : task.priority === "Medium"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                                  }`}
                              >
                                {task.priority}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={`text-xs ${task.status === "In Progress"
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : task.status === "Pending"
                                    ? "bg-teal-50 text-teal-600 border-teal-200"
                                    : task.status === "Skipped"
                                      ? "bg-gray-100 text-gray-600 border-gray-300"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  }`}
                              >
                                {task.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <span className="text-sm text-slate-600">{task.assignee}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="View Task"
                                  onClick={() => handleViewTask(task)}
                                >
                                  <Eye className="h-4 w-4 text-slate-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="Edit Task"
                                  onClick={() => handleEditTask(task)}
                                >
                                  <Edit className="h-4 w-4 text-slate-500" />
                                </Button>
                                {task.status !== "Completed" && task.status !== "Skipped" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    title="Mark Complete"
                                    onClick={() => handleMarkComplete(task.id)}
                                  >
                                    <Check className="h-4 w-4 text-slate-500" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {tasks.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-sm text-muted-foreground">
                              No tasks yet. Click "New Task" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Pinned Activity Section */}
            <div id="activity-section">
              <h3 className="font-semibold text-slate-800 mb-1">Pinned Activity</h3>
              {pinnedCommunications.length > 0 ? (
                <div className="divide-y border rounded-lg overflow-hidden">
                  {pinnedCommunications.map((item, index) => renderCommunicationItem(item, index, true))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Click the pin icon on the activities below to keep them here at the top.
                </p>
              )}
            </div>

            {/* Communication Section */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Activity</h3>

                {/* Private Chat / Group Chat Sub-tabs */}
                <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActivityChatTab("private")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activityChatTab === "private"
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    Private Chat
                    {communications.some(a => !a.isGroupChat && !a.isRead) && (
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityChatTab("group")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activityChatTab === "group"
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    Group Chat
                    {communications.some(a => a.isGroupChat && (a.unreadCount ?? 0) > 0) && (
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1.5" />
                    )}
                  </button>
                </div>

                {/* Summary Tiles */}
                <div className="flex items-center gap-2 mb-4">
                  {/* All Tile */}
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${activityTileFilter === "all"
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    onClick={() => setActivityTileFilter("all")}
                  >
                    <Bell className={`h-4 w-4 ${activityTileFilter === "all" ? "text-white" : "text-slate-500"}`} />
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${activityTileFilter === "all" ? "text-white" : "text-slate-900"}`}>
                        {activitySummary.all}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wide ${activityTileFilter === "all" ? "text-slate-300" : "text-slate-500"}`}>
                        All
                      </span>
                    </div>
                  </div>

                  {/* Emails Tile */}
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${activityTileFilter === "emails"
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    onClick={() => setActivityTileFilter("emails")}
                  >
                    <Mail className={`h-4 w-4 ${activityTileFilter === "emails" ? "text-white" : "text-slate-500"}`} />
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${activityTileFilter === "emails" ? "text-white" : "text-slate-900"}`}>
                        {activitySummary.emailsTotal}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wide ${activityTileFilter === "emails" ? "text-slate-300" : "text-slate-500"}`}>
                        Emails
                      </span>
                    </div>
                  </div>

                  {/* SMS Tile */}
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${activityTileFilter === "sms"
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    onClick={() => setActivityTileFilter("sms")}
                  >
                    <MessageSquare className={`h-4 w-4 ${activityTileFilter === "sms" ? "text-white" : "text-slate-500"}`} />
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${activityTileFilter === "sms" ? "text-white" : "text-slate-900"}`}>
                        {activitySummary.smsTotal}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wide ${activityTileFilter === "sms" ? "text-slate-300" : "text-slate-500"}`}>
                        SMS
                      </span>
                    </div>
                  </div>

                  {/* Notes Tile */}
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${activityTileFilter === "notes"
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    onClick={() => setActivityTileFilter("notes")}
                  >
                    <FileText className={`h-4 w-4 ${activityTileFilter === "notes" ? "text-white" : "text-slate-500"}`} />
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${activityTileFilter === "notes" ? "text-white" : "text-slate-900"}`}>
                        {activitySummary.notes}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wide ${activityTileFilter === "notes" ? "text-slate-300" : "text-slate-500"}`}>
                        Notes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radio Button Filters */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      id="tenant-activity-all"
                      name="tenant-activity-filter"
                      checked={activityRadioFilter === "all"}
                      onChange={() => setActivityRadioFilter("all")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="tenant-activity-all" className="text-sm text-slate-700 cursor-pointer">All</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      id="tenant-activity-unread"
                      name="tenant-activity-filter"
                      checked={activityRadioFilter === "unread"}
                      onChange={() => setActivityRadioFilter("unread")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="tenant-activity-unread" className="text-sm text-slate-700 cursor-pointer">Unread</label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      id="tenant-activity-unresponded"
                      name="tenant-activity-filter"
                      checked={activityRadioFilter === "unresponded"}
                      onChange={() => setActivityRadioFilter("unresponded")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="tenant-activity-unresponded" className="text-sm text-slate-700 cursor-pointer">Unresponded</label>
                  </div>
                </div>

                <div className="divide-y border rounded-lg max-h-[500px] overflow-y-auto">
                  {unpinnedCommunications.length > 0 ? (
                    unpinnedCommunications.map((item, index) => renderCommunicationItem(item, index))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No activities match the selected filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "tenant-info" && (
          <TenantInformationTab
            notes={TENANT_NOTES}
            letters={TENANT_LETTERS}
            onNoteClick={(note) => { setSelectedNote(note); setShowNoteModal(true) }}
          />
        )}

        {activeTab === "communications" && (
          <OwnerCommunicationTab
            communications={communications}
            contact={{ name: contact.name, email: contact.email, phone: contact.phone }}
          />
        )}

        {activeTab === "property" && (
          <TenantUnitInformationTab
            propertyInfo={TENANT_PROPERTY_INFO}
            onNavigateToUnitDetail={onNavigateToUnitDetail}
          />
        )}

        {activeTab === "processes" && (
          <OwnerProcessesTab
            ownerProcesses={TENANT_PROCESSES}
            newlyStartedProcesses={newlyStartedProcesses}
            processStatusFilter={processStatusFilter}
            onProcessStatusFilterChange={setProcessStatusFilter}
            onStartProcessClick={() => { setProcessSearchQuery(""); setShowStartProcessModal(true) }}
            onProcessClick={onNavigateToProcess ?? ((process, contactName) => nav.go("contactProcessDetail", { process, contactName }))}
            onEditProcess={() => { }}
            onRemoveNewProcess={(processId) => setNewlyStartedProcesses((prev) => prev.filter((p) => p.id !== processId))}
            expandedProcesses={expandedProcesses}
            onToggleProcessExpanded={toggleProcessExpanded}
            contactName={contact.name}
          />
        )}

        {activeTab === "documents" && (
          <OwnerDocumentTab documents={documents} onUploadClick={() => setShowUploadDocModal(true)} />
        )}

        {activeTab === "audit-log" && (
          <OwnerAuditLogTab
            logs={TENANT_AUDIT_LOGS}
            onDeletedNoteClick={(entry) => {
              setSelectedDeletedNote(entry)
              setShowDeletedNoteModal(true)
            }}
          />
        )}
      </div>

      {/* Add Note Modal */}
      {/* Start New Process Modal */}
      <Dialog open={showStartProcessModal} onOpenChange={setShowStartProcessModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-teal-600" />
              Start a New Process
            </DialogTitle>
            <DialogDescription>
              Select a process to start for this tenant. It will appear under In Progress.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search processes..."
                value={processSearchQuery}
                onChange={(e) => setProcessSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-200 border rounded-lg">
              {[
                { id: "apt-1", name: "2 Property Onboarding Process", stages: 7 },
                { id: "apt-2", name: "Accounting Mistakes", stages: 4 },
                { id: "apt-3", name: "Applications Screening Process", stages: 11 },
                { id: "apt-4", name: "Delinquency Process", stages: 10 },
                { id: "apt-5", name: "Employee Onboarding Process", stages: 5 },
                { id: "apt-6", name: "Employee Termination Process", stages: 3 },
                { id: "apt-7", name: "Employee Training Process", stages: 21 },
                { id: "apt-8", name: "EOM Accounting Process for Month", stages: 4 },
                { id: "apt-9", name: "Escalated Owner Funds Collection Process", stages: 5 },
                { id: "apt-10", name: "Eviction Process", stages: 10 },
                { id: "apt-11", name: "Haro PM", stages: 3 },
                { id: "apt-12", name: "Hiring Requisition Process", stages: 8 },
                { id: "apt-13", name: "Lease Renewal Process", stages: 10 },
                { id: "apt-14", name: "Legal Cases Complaints and Notices", stages: 8 },
                { id: "apt-15", name: "Make Ready Process", stages: 9 },
              ]
                .filter(p => p.name.toLowerCase().includes(processSearchQuery.toLowerCase()))
                .map((processType) => {
                  const alreadyStarted =
                    TENANT_PROCESSES.inProgress.some(p => p.name === processType.name) ||
                    newlyStartedProcesses.some(p => p.name === processType.name)
                  return (
                    <button
                      key={processType.id}
                      type="button"
                      disabled={alreadyStarted}
                      onClick={() => handleStartNewProcess(processType)}
                      className={`flex items-center gap-4 w-full text-left py-3.5 px-4 transition-colors ${alreadyStarted
                        ? "opacity-50 cursor-not-allowed bg-gray-50"
                        : "hover:bg-teal-50 cursor-pointer"
                        }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
                        <FolderOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-gray-900 truncate">{processType.name}</p>
                        <p className="text-xs text-muted-foreground">{processType.stages} stages</p>
                      </div>
                      {alreadyStarted ? (
                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 border-gray-200 shrink-0">Already Started</Badge>
                      ) : (
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                  )
                })}
              {[
                { id: "apt-1", name: "2 Property Onboarding Process" },
                { id: "apt-2", name: "Accounting Mistakes" },
                { id: "apt-3", name: "Applications Screening Process" },
                { id: "apt-4", name: "Delinquency Process" },
                { id: "apt-5", name: "Employee Onboarding Process" },
                { id: "apt-6", name: "Employee Termination Process" },
                { id: "apt-7", name: "Employee Training Process" },
                { id: "apt-8", name: "EOM Accounting Process for Month" },
                { id: "apt-9", name: "Escalated Owner Funds Collection Process" },
                { id: "apt-10", name: "Eviction Process" },
                { id: "apt-11", name: "Haro PM" },
                { id: "apt-12", name: "Hiring Requisition Process" },
                { id: "apt-13", name: "Lease Renewal Process" },
                { id: "apt-14", name: "Legal Cases Complaints and Notices" },
                { id: "apt-15", name: "Make Ready Process" },
              ].filter(p => p.name.toLowerCase().includes(processSearchQuery.toLowerCase())).length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No processes found matching your search.
                  </div>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Type @ to mention a team member..."
                value={noteContent}
                onChange={handleNoteContentChange}
                className="min-h-[120px]"
              />
              {showMentionDropdown && filteredMentions.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 w-64 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {filteredMentions.map((user) => (
                    <button
                      key={user.id}
                      className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2"
                      onClick={() => handleSelectMention(user)}
                    >
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {taggedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                    {user.name}
                    <button onClick={() => handleRemoveTag(user.id)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNoteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNote} disabled={!noteContent.trim()}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Task Modal */}
      <Dialog open={viewTaskModalOpen} onOpenChange={setViewTaskModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedTask.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p>{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Property</Label>
                  <p className="font-medium">{selectedTask.propertyName}</p>
                  <p className="text-sm text-muted-foreground">{selectedTask.propertyAddress}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p>{selectedTask.assignee}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{selectedTask.dueDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={getStatusBadgeStyle(selectedTask.status)}>
                    {selectedTask.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Priority</Label>
                <p>{selectedTask.priority}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTaskModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={editTaskModalOpen} onOpenChange={setEditTaskModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={selectedTask.dueDate.split("/").reverse().join("-")}
                    onChange={(e) => {
                      const [y, m, d] = e.target.value.split("-")
                      setSelectedTask({ ...selectedTask, dueDate: `${m}/${d}/${y}` })
                    }}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value: OwnerTask["status"]) => setSelectedTask(selectedTask ? { ...selectedTask, status: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={selectedTask.priority}
                  onValueChange={(value: OwnerTask["priority"]) => setSelectedTask(selectedTask ? { ...selectedTask, priority: value } : null)}
                >
                  <SelectTrigger>
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assignee</Label>
                <Select value={newTask.assignee} onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: OwnerTask["priority"]) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
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
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRequestDocModal} onOpenChange={setShowRequestDocModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Document Name</Label>
              <Input
                value={requestedDoc.name}
                onChange={(e) => setRequestedDoc({ ...requestedDoc, name: e.target.value })}
                placeholder="Enter document name"
              />
            </div>
            <div>
              <Label>Document Type</Label>
              <Select
                value={requestedDoc.type}
                onValueChange={(value) => setRequestedDoc({ ...requestedDoc, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lease">Lease Agreement</SelectItem>
                  <SelectItem value="id">ID Verification</SelectItem>
                  <SelectItem value="income">Proof of Income</SelectItem>
                  <SelectItem value="insurance">Renter's Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={requestedDoc.notes}
                onChange={(e) => setRequestedDoc({ ...requestedDoc, notes: e.target.value })}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDocModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestDocument} disabled={!requestedDoc.name.trim()}>
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Management Modal */}
      <Dialog open={showTeamModal} onOpenChange={(open) => {
        setShowTeamModal(open)
        if (!open) {
          setEditingMemberId(null)
          setStaffSearchQuery("")
        }
      }}>
        <DialogContent className="w-[900px] max-w-[95vw] sm:max-w-[900px] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Assigned Team
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                <colgroup>
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "15%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">User Role</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Assigned On</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assignedTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-medium flex-shrink-0">
                            {getInitials(member.name)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-3 align-middle">
                        <span className="text-sm text-slate-600 block truncate">{member.email}</span>
                      </td>
                      <td className="p-3 align-middle">
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground align-middle">{member.assignedOn}</td>
                      <td className="p-3 text-right align-middle">
                        {editingMemberId === member.id ? (
                          <Popover open={true} onOpenChange={(open) => {
                            if (!open) {
                              setEditingMemberId(null)
                              setStaffSearchQuery("")
                            }
                          }}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                Select
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[260px] p-0" align="end">
                              <Command>
                                <CommandInput
                                  placeholder="Search by name or email..."
                                  value={staffSearchQuery}
                                  onValueChange={setStaffSearchQuery}
                                />
                                <CommandList>
                                  <CommandEmpty>No staff found.</CommandEmpty>
                                  <CommandGroup>
                                    {allStaffMembers
                                      .filter(staff =>
                                        staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                                        staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase())
                                      )
                                      .map((staff) => (
                                        <CommandItem
                                          key={staff.id}
                                          value={`${staff.name} ${staff.email}`}
                                          onSelect={() => {
                                            setAssignedTeam(assignedTeam.map(m =>
                                              m.id === member.id
                                                ? { ...m, name: staff.name, email: staff.email }
                                                : m
                                            ))
                                            setEditingMemberId(null)
                                            setStaffSearchQuery("")
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium">{staff.name}</span>
                                            <span className="text-xs text-muted-foreground">{staff.email}</span>
                                          </div>
                                          {member.name === staff.name && (
                                            <Check className="ml-auto h-4 w-4 text-teal-600" />
                                          )}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <button
                            type="button"
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            onClick={() => setEditingMemberId(member.id)}
                          >
                            Change
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setShowTeamModal(false)
              setEditingMemberId(null)
              setStaffSearchQuery("")
            }}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                setShowTeamModal(false)
                setEditingMemberId(null)
                setStaffSearchQuery("")
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deleted Note View Modal */}
      <Dialog open={showDeletedNoteModal} onOpenChange={setShowDeletedNoteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Deleted Note
            </DialogTitle>
          </DialogHeader>
          {selectedDeletedNote && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">Note Content</Label>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedDeletedNote.content}</p>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground border-t pt-4">
                <div>
                  <span className="font-medium text-foreground">Deleted by:</span>{" "}
                  {selectedDeletedNote.deletedBy}
                </div>
                <div>
                  <span className="font-medium text-foreground">Deleted on:</span>{" "}
                  {selectedDeletedNote.deletedOn}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeletedNoteModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMS Popup Modal */}
      <SMSPopupModal
        isOpen={showSMSModal}
        onClose={() => {
          setShowSMSModal(false)
          setSelectedSMSItem(null)
        }}
        contactName={selectedSMSItem?.from?.name || contact.name}
        contactPhone={selectedSMSItem?.from?.contact || contact.phone || ""}
        currentMessage={selectedSMSItem?.fullContent || selectedSMSItem?.content || ""}
        currentTimestamp={selectedSMSItem?.timestamp || ""}
      />

      {/* Email Popup Modal */}
      <EmailPopupModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false)
          setSelectedEmailItem(null)
        }}
        contactName={selectedEmailItem?.from.name || contact.name}
        contactEmail={selectedEmailItem?.from.contact || contact.email}
        currentSubject={selectedEmailItem?.subject || "Property Inquiry"}
        currentBody={selectedEmailItem?.thread?.[0]?.content || selectedEmailItem?.content || ""}
        currentTimestamp={selectedEmailItem?.timestamp || ""}
      />

      {/* Note View Modal */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-800">
              {selectedNote?.title}
            </DialogTitle>
            <p className="text-sm text-slate-500">
              Created by {selectedNote?.createdBy} on {selectedNote?.createdAt}
            </p>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedNote?.content}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowNoteModal(false)} className="bg-transparent">
              Close
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Pencil className="h-4 w-4 mr-1" />
              Edit Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Missing Information Modal */}
      <Dialog open={showMissingInfoModal} onOpenChange={setShowMissingInfoModal}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-amber-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-800">
                  Missing Information
                </DialogTitle>
                <p className="text-sm text-slate-500">
                  Complete these items to ensure accurate records
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Tab Switcher */}
          <div className="flex border-b px-6 flex-shrink-0">
            <button
              type="button"
              onClick={() => setMissingInfoTab("fields")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${missingInfoTab === "fields"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              Missing Fields ({tenantMissingFields.length})
            </button>
            <button
              type="button"
              onClick={() => setMissingInfoTab("documents")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${missingInfoTab === "documents"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              Missing Documents ({TENANT_MISSING_DOCUMENTS.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {missingInfoTab === "fields" ? (
              <div className="space-y-3">
                {tenantMissingFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{field.fieldName}</p>
                      <p className="text-xs text-slate-500">{field.section}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 bg-transparent"
                      onClick={() => {
                        setActiveTab(field.tab as typeof activeTab)
                        setShowMissingInfoModal(false)
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Go to field
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {TENANT_MISSING_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{doc.documentName}</p>
                      <p className="text-xs text-amber-600">{doc.status}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 bg-transparent"
                      onClick={() => {
                        setActiveTab("documents")
                        setShowMissingInfoModal(false)
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload document
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => setShowMissingInfoModal(false)} className="bg-transparent">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Communication Thread Modal */}
      <Dialog open={showThreadModal} onOpenChange={setShowThreadModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              Communication Thread with {contact.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Complete communication history including emails, SMS, and calls
            </DialogDescription>
          </DialogHeader>

          {/* Thread Content */}
          <div ref={(el) => { if (el) { requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; }); } }} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {getCommunicationThread().map((item) => {
              const isEmail = item.type === "email"
              const isSMS = item.type === "sms"
              const isCall = item.type === "call"
              const isFromTenant = item.isIncoming

              return (
                <div key={item.id} className="space-y-2">
                  {/* SMS Item */}
                  {isSMS && (
                    <div className={`flex ${isFromTenant ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${isFromTenant
                          ? "bg-slate-100 border border-slate-200"
                          : "bg-teal-50 border border-teal-200"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-medium text-teal-700">SMS</span>
                          <span className="text-xs text-muted-foreground">
                            {isFromTenant ? "Received" : "Sent"}
                          </span>
                        </div>
                        <p className="text-sm">{item.content || item.preview}</p>
                        <p className="text-xs text-muted-foreground mt-2">{item.timestamp}</p>
                      </div>
                    </div>
                  )}

                  {/* Call Item */}
                  {isCall && (
                    <div className="flex justify-center">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-[90%]">
                        <div className="flex items-center gap-2 mb-1">
                          <PhoneCall className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Call</span>
                          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                          {item.duration && (
                            <span className="text-xs text-muted-foreground">({item.duration})</span>
                          )}
                        </div>
                        <p className="text-sm">{item.preview}</p>
                        {item.notes && (
                          <details className="mt-2">
                            <summary className="text-xs text-green-600 cursor-pointer hover:underline">
                              View call notes
                            </summary>
                            <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap border-t border-green-200 pt-2">
                              {item.notes}
                            </p>
                          </details>
                        )}
                        {item.appfolioLink && (
                          <a
                            href={item.appfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Listen to recording
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email Item - Collapsed by Default */}
                  {isEmail && (
                    <div className={`flex ${isFromTenant ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[90%] rounded-lg border ${isFromTenant
                          ? "bg-blue-50 border-blue-200"
                          : "bg-indigo-50 border-indigo-200"
                          }`}
                      >
                        {/* Email Header - Always Visible */}
                        <div
                          className="p-3 cursor-pointer hover:bg-opacity-80 transition-colors"
                          onClick={() => toggleThreadEmailExpand(`thread-${item.id}`)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-blue-600" />
                              <span className="text-xs font-medium text-blue-700">Email</span>
                              <span className="text-xs text-muted-foreground">
                                {isFromTenant ? "Received" : "Sent"}
                              </span>
                            </div>
                            {expandedThreadEmails.includes(`thread-${item.id}`) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1">
                            {item.subject || "No Subject"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            From: {item.from.name} &bull; {item.timestamp}
                          </p>
                        </div>

                        {/* Email Body - Expanded */}
                        {expandedThreadEmails.includes(`thread-${item.id}`) && (
                          <div className="border-t border-blue-200 p-3 space-y-3">
                            {item.thread && item.thread.length > 0 ? (
                              item.thread.map((email, idx) => (
                                <div key={email.id} className={idx > 0 ? "border-t border-blue-100 pt-3" : ""}>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <span>From: {email.from} ({email.email})</span>
                                    <span>{email.timestamp}</span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{email.content}</p>

                                  {/* Email Opens - only for emails */}
                                  {"emailOpens" in email && (email as { emailOpens?: { openedAt: string }[] }).emailOpens && ((email as { emailOpens: { openedAt: string }[] }).emailOpens.length > 0) && (
                                    <div className="mt-2 pt-2 border-t border-blue-100">
                                      <p className="text-xs text-amber-600 flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Opened: {(email as { emailOpens: { openedAt: string }[] }).emailOpens.map((o, i) => (
                                          <span key={i}>
                                            {o.openedAt}{i < (email as { emailOpens: { openedAt: string }[] }).emailOpens.length - 1 ? ", " : ""}
                                          </span>
                                        ))}
                                      </p>
                                    </div>
                                  )}

                                  {/* Attachments placeholder */}
                                  {idx === 0 && (
                                    <div className="mt-2 pt-2 border-t border-blue-100">
                                      <div className="flex items-center gap-2">
                                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          Attachments: Lease_Renewal_Options.pdf (245 KB)
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{item.preview}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Reply Area */}
          <div className="border-t px-6 py-4 space-y-3">
            {/* Channel Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Reply via:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setThreadReplyChannel("email")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${threadReplyChannel === "email"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setThreadReplyChannel("sms")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${threadReplyChannel === "sms"
                    ? "bg-teal-100 text-teal-700 border border-teal-300"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  SMS
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-slate-100 text-slate-600 border border-slate-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call
                </button>
              </div>
            </div>

            {/* Email Composer UI */}
            {threadReplyChannel === "email" && (
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                  <Label className="text-xs text-slate-500 w-8 shrink-0">To</Label>
                  <input type="text" value={contact.email} readOnly className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700" />
                  <button type="button" onClick={() => setShowCCBCC(!showCCBCC)} className="text-xs text-slate-500 hover:text-slate-700">
                    {showCCBCC ? "Hide" : "Cc Bcc"}
                  </button>
                </div>
                {showCCBCC && (
                  <>
                    <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                      <Label className="text-xs text-slate-500 w-8 shrink-0">Cc</Label>
                      <input type="text" placeholder="Enter CC email addresses" value={threadEmailCC} onChange={(e) => setThreadEmailCC(e.target.value)} className="flex-1 text-sm bg-transparent border-none outline-none" />
                    </div>
                    <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                      <Label className="text-xs text-slate-500 w-8 shrink-0">Bcc</Label>
                      <input type="text" placeholder="Enter BCC email addresses" value={threadEmailBCC} onChange={(e) => setThreadEmailBCC(e.target.value)} className="flex-1 text-sm bg-transparent border-none outline-none" />
                    </div>
                  </>
                )}
                <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                  <Label className="text-xs text-slate-500 w-14 shrink-0">Subject</Label>
                  <input type="text" placeholder="Enter subject" value={threadEmailSubject} onChange={(e) => setThreadEmailSubject(e.target.value)} className="flex-1 text-sm bg-transparent border-none outline-none" />
                </div>
                <textarea placeholder="Compose email..." value={threadReplyText} onChange={(e) => setThreadReplyText(e.target.value)} className="w-full min-h-[120px] p-3 text-sm resize-none focus:outline-none bg-white border-none" />
                <div className="flex items-center justify-between border-t border-slate-200 px-2 py-1.5">
                  <div className="flex items-center gap-0.5">
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Formatting options"><Type className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Bold"><Bold className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Italic"><Italic className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Underline"><Underline className="h-4 w-4" /></button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert link"><Link className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert emoji"><Smile className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert image"><ImageIcon className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Attach file"><Paperclip className="h-4 w-4" /></button>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="More options"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Discard"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            {/* SMS Reply UI */}
            {threadReplyChannel !== "email" && (
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type your message..."
                    value={threadReplyText}
                    onChange={(e) => setThreadReplyText(e.target.value)}
                    className="min-h-[80px] pr-10 resize-none"
                  />
                  <button type="button" className="absolute bottom-2 right-2 p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Attach file">
                    <Paperclip className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white h-10"
                  onClick={() => {
                    if (threadReplyText.trim()) {
                      setThreadReplyText("")
                    }
                  }}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
