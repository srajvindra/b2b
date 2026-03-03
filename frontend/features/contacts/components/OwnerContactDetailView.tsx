"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import type React from "react"

import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  PhoneCall,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
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
  User,
  Building2,
  Landmark,
  Handshake,
  Home,
  Plus,
  History,
  Search,
  Upload,
  Workflow,
  AlertTriangle,
  ListTodo,
  RotateCcw,
  Settings,
  Filter,
  CreditCard,
  Clipboard,
  FileBarChart,
  Package,
  HelpCircle,
  PlayCircle,
  Trash2,
  FolderOpen,
  Paperclip,
  ListChecks,
  Bell,
  ArrowRight,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Smile,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Minus, Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, ChevronsUpDown } from "lucide-react"
import { SMSPopupModal } from "@/components/sms-popup-modal"
import { EmailPopupModal } from "@/components/email-popup-modal"
import { useNav } from "@/app/dashboard/page"
import { useQuickActions } from "@/context/QuickActionsContext"
import { getOwnerContactQuickActions } from "@/lib/quickActions"
import type {
  Contact,
  CommunicationItem,
  CommunicationType,
  CustomField,
  CustomFieldType,
  OwnerDocument,
  OwnerTask,
  TeamMember,
  OwnerProperty,
  AssignedTeamMember,
  OwnerProcessItem,
} from "@/features/contacts/types"
import {
  ACCOUNTING_INFO,
  BANK_ACCOUNT_INFO,
  FEDERAL_TAX_INFO,
  OWNER_PACKET_INFO,
  OWNER_STATEMENT_INFO,
  STAFF_LIST,
} from "@/features/contacts/data/ownerDetail"
import {
  getOwnerCommunications,
  getDocuments,
  getTasks,
  teamMembers,
  getOwnerProperties,
  initialAssignedTeam,
  allStaffMembers,
  INITIAL_CUSTOM_FIELDS,
  AVAILABLE_SECTIONS,
  contactAuditLogs,
  OWNER_PROCESSES,
} from "@/features/contacts/data/ownerDetailData"
import {
  OwnerOverview,
  OwnerDetailsTab,
  OwnerPropertyTab,
  OwnerCommunicationTab,
  OwnerProcessesTab,
  OwnerDocumentTab,
  OwnerAuditLogTab,
} from "@/features/contacts/owner/components"

interface ContactOwnerDetailPageProps {
  contact: Contact
  onBack: () => void
  onNavigateToProperty?: (propertyName: string) => void
  /** When provided (e.g. on /contacts/owners/[id]), process row clicks navigate to the process detail page. */
  onNavigateToProcess?: (process: OwnerProcessItem, contactName: string) => void
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  actions,
  sectionId,
  onAddField,
  customFieldCount = 0,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  actions?: React.ReactNode
  sectionId?: string
  onAddField?: (sectionId: string) => void
  customFieldCount?: number
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 text-foreground cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold">{title}</span>
          {customFieldCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-teal-100 text-teal-700 rounded">
              +{customFieldCount} custom
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {sectionId && onAddField && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 gap-1"
              onClick={(e) => {
                e.stopPropagation()
                onAddField(sectionId)
              }}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
          )}
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
          {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
        </div>
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  )
}

// Info Row Component
function InfoRow({ label, value, isMandatory, isCustom, isReportable = true }: {
  label: React.ReactNode
  value: React.ReactNode
  isMandatory?: boolean
  isCustom?: boolean
  isReportable?: boolean
}) {
  return (
    <div className="flex justify-between py-2 border-b border-border/50 group">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">{label}</span>
        {isCustom && (
          <>
            {isMandatory ? (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">Required</span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">Optional</span>
            )}
          </>
        )}
        {isReportable && isCustom && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <FileBarChart className="h-2.5 w-2.5" />
            Reportable
          </span>
        )}
      </div>
      <span className="text-foreground text-sm font-medium text-right">{value || "--"}</span>
    </div>
  )
}

// Custom Field Row Component
function CustomFieldRow({
  field,
  onDelete
}: {
  field: {
    id: string
    name: string
    type: string
    value: string
    isMandatory: boolean
    options?: string[]
  }
  onDelete: (id: string) => void
}) {
  const [value, setValue] = useState(field.value)

  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
        return <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm w-40" />
      case "number":
        return <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm w-40" />
      case "date":
        return <Input type="date" value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm w-40" />
      case "dropdown":
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="h-7 text-sm w-40">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "yes_no":
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="h-7 text-sm w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        )
      default:
        return <span className="text-sm font-medium">{value || "--"}</span>
    }
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 group">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">{field.name}</span>
        {field.isMandatory ? (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">Required</span>
        ) : (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">Optional</span>
        )}
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded flex items-center gap-0.5">
          <FileBarChart className="h-2.5 w-2.5" />
          Reportable
        </span>
      </div>
      <div className="flex items-center gap-2">
        {renderFieldInput()}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
          onClick={() => onDelete(field.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}



export default function ContactOwnerDetailPage({ contact, onBack, onNavigateToProperty, onNavigateToProcess }: ContactOwnerDetailPageProps) {
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
  const [tasks, setTasks] = useState<OwnerTask[]>(getTasks())
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

  // Properties tab expand/collapse state
  // Entity level: collapsed by default
  const [expandedOwnershipTypes, setExpandedOwnershipTypes] = useState<Set<string>>(new Set())
  // Property level: collapsed by default
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set())

  const toggleOwnershipType = (type: string) => {
    setExpandedOwnershipTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const toggleEntity = (entityKey: string) => {
    setExpandedEntities(prev => {
      const next = new Set(prev)
      if (next.has(entityKey)) next.delete(entityKey)
      else next.add(entityKey)
      return next
    })
  }

  // SMS Modal state
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [selectedSMSItem, setSelectedSMSItem] = useState<ReturnType<typeof getOwnerCommunications>[0] | null>(null)

  // Email Modal state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedEmailItem, setSelectedEmailItem] = useState<ReturnType<typeof getOwnerCommunications>[0] | null>(null)

  // Missing Information Modal state
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [missingInfoTab, setMissingInfoTab] = useState<"fields" | "documents">("fields")

  // Owner-specific missing information data
  const ownerMissingFields = [
    { id: 1, fieldName: "Banking Details", section: "Financials", tab: "details" },
    { id: 2, fieldName: "Tax ID / EIN", section: "Tax Information", tab: "details" },
    { id: 3, fieldName: "Mailing Address", section: "Contact Information", tab: "overview" },
    { id: 4, fieldName: "Preferred Contact Method", section: "Contact Information", tab: "overview" },
  ]

  const ownerMissingDocuments = [
    { id: 1, documentName: "W-9 Form", status: "Not uploaded", section: "Documents" },
    { id: 2, documentName: "Property Management Agreement", status: "Not uploaded", section: "Documents" },
    { id: 3, documentName: "Insurance Certificate", status: "Not uploaded", section: "Documents" },
  ]

  // Custom Fields Management
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false)
  const [customFieldSection, setCustomFieldSection] = useState("")
  const [newCustomField, setNewCustomField] = useState({
    name: "",
    type: "text" as CustomFieldType,
    isMandatory: false,
    options: "",
  })

  const [customFields, setCustomFields] = useState<CustomField[]>(INITIAL_CUSTOM_FIELDS)
  const availableSections = AVAILABLE_SECTIONS

  const handleAddCustomField = () => {
    if (!newCustomField.name.trim() || !customFieldSection) return

    const field: CustomField = {
      id: `cf${Date.now()}`,
      name: newCustomField.name,
      type: newCustomField.type,
      section: customFieldSection,
      value: newCustomField.type === "yes_no" ? "No" : "",
      isMandatory: newCustomField.isMandatory,
      options: newCustomField.type === "dropdown" ? newCustomField.options.split(",").map(o => o.trim()).filter(Boolean) : undefined,
    }

    setCustomFields([...customFields, field])
    setNewCustomField({ name: "", type: "text", isMandatory: false, options: "" })
    setShowCustomFieldModal(false)
  }

  const getFieldsForSection = (sectionId: string) => customFields.filter(f => f.section === sectionId)

  const communications = getOwnerCommunications(contact.name, contact.phone, contact.email)
  const documents = getDocuments()

  const [activeTab, setActiveTab] = useState("overview")
  const [properties] = useState<OwnerProperty[]>(getOwnerProperties())
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [showUploadDocModal, setShowUploadDocModal] = useState(false)
  const [showRequestDocModal, setShowRequestDocModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    property: "",
    assignee: "",
    dueDate: "",
    priority: "Medium" as "High" | "Medium" | "Low",
  })
  const [uploadDoc, setUploadDoc] = useState({
    file: null as File | null,
    documentType: "",
    assignee: "",
    comments: "",
  })
  const [newDocRequest, setNewDocRequest] = useState({
    documentType: "",
    property: "",
    notes: "",
  })

  const [assignedStaff, setAssignedStaff] = useState(contact.assignedStaff || "Richard Surovi")
  const [staffOpen, setStaffOpen] = useState(false)

  // Processes Summary collapsed state
  const [isProcessesSummaryExpanded, setIsProcessesSummaryExpanded] = useState(false)

  // Processes tab state
  const [processStatusFilter, setProcessStatusFilter] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([])
  const nav = useNav()
  const ownerQuickActions = useMemo(
    () =>
      getOwnerContactQuickActions({
        onAddNote: () => setShowAddNoteModal(true),
      }),
    []
  )
  useQuickActions(ownerQuickActions, { subtitle: "Owner" })

  const [showProcessPanel, setShowProcessPanel] = useState(false)
  const [editingProcess, setEditingProcess] = useState<{
    id: string
    name: string
    prospectingStage: string
    status: string
    startedOn?: string
  } | null>(null)

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

  const handleCreateProcess = () => {
    setEditingProcess(null)
    setShowProcessPanel(true)
  }

  const handleEditProcess = (process: {
    id: string
    name: string
    prospectingStage: string
    status: string
    startedOn?: string
  }) => {
    setEditingProcess(process)
    setShowProcessPanel(true)
  }

  const handleStartNewProcess = (processType: { id: string; name: string; stages: number }) => {
    const today = new Date()
    const dateStr = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`
    setNewlyStartedProcesses(prev => [...prev, {
      id: `proc-new-${Date.now()}`,
      name: processType.name,
      prospectingStage: "Working",
      startedOn: dateStr,
      status: "In Progress",
      tasks: [],
    }])
    setShowStartProcessModal(false)
    setProcessSearchQuery("")
    setProcessStatusFilter("in-progress")
  }

  const ownerProcesses = OWNER_PROCESSES

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
  const [selectedCommunication, setSelectedCommunication] = useState<typeof communications[0] | null>(null)
  const [expandedEmails, setExpandedEmails] = useState<string[]>([])
  const [threadReplyText, setThreadReplyText] = useState("")
  const [threadReplyChannel, setThreadReplyChannel] = useState<"email" | "sms" | "call">("email")
  const [threadEmailCC, setThreadEmailCC] = useState("")
  const [threadEmailBCC, setThreadEmailBCC] = useState("")
  const [showCCBCC, setShowCCBCC] = useState(false)
  const [threadEmailSubject, setThreadEmailSubject] = useState("")

  // Communications tab filter state (separate from Activity section)
  const [commTileFilter, setCommTileFilter] = useState<"all" | "emails" | "sms">("all")
  const [commRadioFilter, setCommRadioFilter] = useState<"all" | "unread" | "unresponded">("all")

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

      // Then filter by radio selection (only applies to emails and sms, not notes)
      if (activityRadioFilter === "unread") {
        if (item.type === "note") return false // Notes don't have unread state
        if (item.type === "call") return false // Calls don't have unread state
        return !item.isRead && item.isIncoming
      }
      if (activityRadioFilter === "unresponded") {
        if (item.type === "note") return false // Notes don't have responded state
        return item.isIncoming && item.isRead && !item.isResponded
      }

      return true // "all" radio filter shows everything
    })

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
  const openThreadModal = (item: typeof communications[0]) => {
    if (item.type === "sms" || item.type === "email") {
      setSelectedCommunication(item)
      setExpandedEmails([])
      setThreadReplyText("")
      setShowCCBCC(false)
      setThreadEmailCC("")
      setThreadEmailBCC("")
      setShowThreadModal(true)
    }
  }

  // Toggle email expansion in thread
  const toggleEmailExpand = (emailId: string) => {
    setExpandedEmails((prev) =>
      prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]
    )
  }

  // Get combined communication thread (all emails, SMS, calls in chronological order)
  const getCommunicationThread = () => {
    // Filter only private chat communications (not group chat) and exclude notes
    const threadItems = communications.filter(
      (c) => !c.isGroupChat && c.type !== "note" && (c.type === "sms" || c.type === "email" || c.type === "call")
    )

    // Sort by date (oldest first for thread view)
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

  const handleSendReply = (id: string, type: CommunicationType) => {
    if (replyContent.trim()) {
      console.log(`Sending ${type} reply to ${id}: ${replyContent}`)
      setReplyContent("")
      setReplyingToId(null)
    }
  }

  const getActionVerb = (type: CommunicationType) => {
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

  const getActionVerbColor = (type: CommunicationType) => {
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

  const renderCommunicationItem = (item: CommunicationItem, index: number, isPinned = false) => (
    <div key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
      <div
        className={`p-4 cursor-pointer hover:bg-slate-100 transition-colors ${isPinned ? "border-l-4 border-teal-500" : ""}`}
        onClick={() => {
          // For SMS and Email, open the thread modal
          if (item.type === "sms" || item.type === "email") {
            openThreadModal(item)
            return
          }
          // For calls and notes, toggle inline expansion
          setExpandedId(expandedId === item.id ? null : item.id)
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Avatar with type icon overlay */}
            <div className="relative">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${item.isIncoming ? "bg-gray-200 text-gray-700" : "bg-teal-100 text-teal-700"
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
                    <span
                      className={`font-medium ${item.type === "email"
                        ? "text-emerald-600"
                        : item.type === "sms"
                          ? "text-amber-600"
                          : "text-emerald-600"
                        }`}
                    >
                      {item.type === "email" ? "emailed" : item.type === "sms" ? "texted" : "called"}
                    </span>
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

          {/* Right side: timestamp, unread indicator, chevron, pin */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {item.isGroupChat && (item.unreadCount ?? 0) > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-500 text-white text-xs font-medium">
                {item.unreadCount}
              </span>
            )}
            {!item.isRead && !item.isGroupChat && <div className="h-2 w-2 rounded-full bg-blue-500" />}
            <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
            {expandedId === item.id ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
            <button
              onClick={(e) => handleTogglePin(e, item.id)}
              className={`p-1 rounded hover:bg-slate-200 transition-colors ${pinnedIds.has(item.id) ? "text-teal-600" : "text-muted-foreground"}`}
              title={pinnedIds.has(item.id) ? "Unpin" : "Pin to top"}
            >
              <Pin className={`h-4 w-4 ${pinnedIds.has(item.id) ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expandedId === item.id && renderExpandedContent(item)}
    </div>
  )

  const renderExpandedContent = (item: CommunicationItem) => {
    if (item.type === "email" && item.thread) {
      return (
        <div className="border-t bg-gray-50 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">EMAIL THREAD ({item.thread.length} MESSAGES)</p>
          <div className="space-y-2">
            {item.thread.map((message) => (
              <div key={message.id} className="bg-white border rounded-lg overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedThreadId(expandedThreadId === message.id ? null : message.id)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${message.isIncoming ? "bg-gray-200 text-gray-700" : "bg-teal-100 text-teal-700"
                        }`}
                    >
                      {getInitials(message.from)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{message.from}</p>
                      <p className="text-xs text-muted-foreground">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{message.fullDate}</span>
                    {expandedThreadId === message.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                {expandedThreadId === message.id && (
                  <div className="border-t p-4 bg-gray-50">
                    <div className="text-sm text-slate-700 whitespace-pre-line mb-4">{message.content}</div>
                    {/* Email Opens */}
                    {!message.isIncoming && message.emailOpens && message.emailOpens.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-dashed">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Email Opened</p>
                        <div className="space-y-1">
                          {message.emailOpens.map((open, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-amber-600">
                              <Eye className="h-3 w-3" />
                              <span>Recipient opened this email on {open.openedAt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {replyingToId === message.id ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 bg-white">
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px] text-sm bg-white border-0 focus-visible:ring-0 resize-none"
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
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 h-8"
                            onClick={() => handleSendReply(item.id, "email")}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 bg-transparent"
                            onClick={() => {
                              setReplyingToId(null)
                              setReplyContent("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          setReplyingToId(message.id)
                        }}
                      >
                        Reply
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (item.type === "sms" || item.type === "note") {
      return (
        <div className="border-t bg-gray-50 p-4">
          <div className="bg-white border rounded-lg p-4 mb-3">
            <p className="text-sm text-slate-700">{item.content}</p>
          </div>
          {item.type === "sms" && (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 bg-white">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] text-sm bg-white border-0 focus-visible:ring-0 resize-none"
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
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 h-8"
                onClick={() => handleSendReply(item.id, "sms")}
              >
                <Send className="h-3 w-3 mr-1" />
                Send SMS
              </Button>
            </div>
          )}
        </div>
      )
    }

    if (item.type === "call") {
      return (
        <div className="border-t bg-gray-50 p-4">
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Call Notes</p>
              <p className="text-sm text-slate-700">{item.notes}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                Call recordings are managed in Appfolio. Click the link below to access the full recording.
              </p>
              <a
                href={item.appfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
                Open in Appfolio
              </a>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  const renderTaskItem = (task: OwnerTask) => (
    <div key={task.id} className="p-4 bg-white border rounded-lg mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${task.assigneeAvatar ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"
              }`}
          >
            {task.assigneeAvatar || getInitials(task.assignee)}
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-800">{task.title}</h3>
            <p className="text-xs text-muted-foreground">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeStyle(task.status)}>{task.status}</Badge>
          <Badge className={getPriorityBadgeStyle(task.priority)}>{task.priority}</Badge>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{task.dueDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
      </div>
    </div>
  )

  const handleViewTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setViewTaskModalOpen(true)
  }

  const handleEditTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setEditTaskModalOpen(true)
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "Completed" as const } : task)))
  }

  const handleSaveTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)))
      setEditTaskModalOpen(false)
      setViewTaskModalOpen(false) // Also close view modal if edit was initiated from it
      setSelectedTask(null)
    }
  }

  const getStatusBadgeStyle = (status: OwnerTask["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Pending":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getPriorityBadgeStyle = (priority: OwnerTask["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200"
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Low":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const handleCreateTask = () => {
    const task: OwnerTask = {
      id: `t${tasks.length + 1}`,
      title: newTask.title,
      description: newTask.description,
      propertyName: properties.find((p) => p.id === newTask.property)?.name || "",
      propertyAddress: properties.find((p) => p.id === newTask.property)?.address || "",
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      status: "Pending",
      priority: newTask.priority,
      createdDate: new Date().toLocaleDateString(),
    }
    setTasks([...tasks, task])
    setShowNewTaskModal(false)
    setNewTask({ title: "", description: "", property: "", assignee: "", dueDate: "", priority: "Medium" })
  }

  const handleRequestDocument = () => {
    // In a real app, this would send a request to the backend
    console.log("Document requested:", newDocRequest)
    setShowRequestDocModal(false)
    setNewDocRequest({ documentType: "", property: "", notes: "" })
  }

  const getPropertyStatusBadge = (status: OwnerProperty["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200"
      case "Vacant":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Under Maintenance":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="flex-1 overflow-auto px-6 pb-6 pt-2">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Owners
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Main content: Owner header + Tabs (Quick Actions from global context) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Owner Header */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                {getInitials(contact.name)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-slate-800">{contact.name}</h1>
                  <Badge
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
            <div className="flex items-center gap-3">
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
                  <span className="font-semibold">{ownerMissingFields.length}</span>
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
                  <span className="font-semibold">{ownerMissingDocuments.length}</span>
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Details
              </TabsTrigger>

              <TabsTrigger
                value="properties"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Properties
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {properties.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="communications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Communications
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {communications.filter(c => c.type !== "note").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="processes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Processes
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {ownerProcesses.inProgress.length + ownerProcesses.upcoming.length + ownerProcesses.completed.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Documents
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {documents.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="audit-log"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Audit Log
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <OwnerOverview
                tasks={tasks}
                onNewTask={() => setShowNewTaskModal(true)}
                onViewTask={handleViewTask}
                onEditTask={handleEditTask}
                onMarkComplete={handleMarkComplete}
                getStatusBadgeStyle={getStatusBadgeStyle}
                getPriorityBadgeStyle={getPriorityBadgeStyle}
                pinnedCommunications={pinnedCommunications}
                unpinnedCommunications={unpinnedCommunications}
                renderCommunicationItem={renderCommunicationItem}
                activityTileFilter={activityTileFilter}
                setActivityTileFilter={setActivityTileFilter}
                activityRadioFilter={activityRadioFilter}
                setActivityRadioFilter={setActivityRadioFilter}
                activityChatTab={activityChatTab}
                setActivityChatTab={setActivityChatTab}
                activitySummary={activitySummary}
                hasUnreadPrivate={communications.some(a => !a.isGroupChat && !a.isRead)}
                hasUnreadGroup={communications.some(a => a.isGroupChat && (a.unreadCount ?? 0) > 0)}
              />
            </TabsContent>


            {/* Details Tab */}
            <TabsContent value="details" className="mt-4 space-y-4">
              <OwnerDetailsTab
                sectionConfig={{
                  federalTax: FEDERAL_TAX_INFO as Record<string, string>,
                  accounting: ACCOUNTING_INFO as Record<string, string>,
                  bankAccount: BANK_ACCOUNT_INFO as Record<string, string>,
                  ownerStatement: OWNER_STATEMENT_INFO as Record<string, string>,
                  ownerPacket: OWNER_PACKET_INFO as Record<string, string>,
                }}
                customFields={customFields}
                getFieldsForSection={getFieldsForSection}
                onAddField={(id) => { setCustomFieldSection(id); setShowCustomFieldModal(true) }}
                onDeleteField={(id) => setCustomFields(customFields.filter(f => f.id !== id))}
              />
            </TabsContent>

            {/* Communications Tab */}
            <TabsContent value="communications" className="mt-4 space-y-4">
              <OwnerCommunicationTab
                communications={communications}
                contact={{ name: contact.name, email: contact.email, phone: contact.phone }}
              />
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties" className="mt-4">
              <OwnerPropertyTab
                properties={properties}
                getPropertyStatusBadge={getPropertyStatusBadge}
                onNavigateToProperty={onNavigateToProperty}
              />
            </TabsContent>


            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-4">
              <OwnerDocumentTab documents={documents} onUploadClick={() => setShowUploadDocModal(true)} />
            </TabsContent>

            {/* Processes Tab */}
            <TabsContent value="processes" className="mt-4">
              <OwnerProcessesTab
                ownerProcesses={ownerProcesses}
                newlyStartedProcesses={newlyStartedProcesses}
                processStatusFilter={processStatusFilter}
                onProcessStatusFilterChange={setProcessStatusFilter}
                onStartProcessClick={() => { setProcessSearchQuery(""); setShowStartProcessModal(true) }}
                onProcessClick={onNavigateToProcess ?? ((process, contactName) => nav.go("contactProcessDetail", { process, contactName }))}
                onEditProcess={handleEditProcess}
                onRemoveNewProcess={(id) => setNewlyStartedProcesses(prev => prev.filter(p => p.id !== id))}
                contactName={contact.name}
              />
            </TabsContent>


            {/* Audit Log Tab */}
            <TabsContent value="audit-log" className="mt-4">
              <OwnerAuditLogTab
                logs={contactAuditLogs}
                onDeletedNoteClick={(entry) => {
                setSelectedDeletedNote(entry)
                                    setShowDeletedNoteModal(true)
              }}
            />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={viewTaskModalOpen} onOpenChange={setViewTaskModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-slate-600" />
              Task Details
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Task Title</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{selectedTask.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <p className="text-sm text-slate-600 mt-1">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {selectedTask.assignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-sm text-slate-700">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`text-xs ${getStatusBadgeStyle(selectedTask.status)}`}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                  <p className="text-sm text-slate-700 mt-1">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`text-xs ${getPriorityBadgeStyle(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Created Date</label>
                <p className="text-sm text-slate-700 mt-1">{selectedTask.createdDate}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Property</label>
                <p className="text-sm text-slate-700 mt-1">
                  {selectedTask.propertyName} - {selectedTask.propertyAddress}
                </p>
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

      <Dialog open={editTaskModalOpen} onOpenChange={setEditTaskModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-slate-600" />
              Edit Task
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter task title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                <Textarea
                  className="mt-1"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    value={selectedTask.dueDate}
                    onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, status: value as OwnerTask["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
                  <Select
                    value={selectedTask.priority}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, priority: value as OwnerTask["priority"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Property</Label>
                  <Input
                    className="mt-1"
                    placeholder="Enter property name"
                    value={selectedTask.propertyName}
                    onChange={(e) => setSelectedTask({ ...selectedTask, propertyName: e.target.value })}
                  />
                  <Input
                    className="mt-1"
                    placeholder="Enter property address"
                    value={selectedTask.propertyAddress}
                    onChange={(e) => setSelectedTask({ ...selectedTask, propertyAddress: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} className="bg-slate-800 hover:bg-slate-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              Select a process to start for this owner. It will appear under In Progress.
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
                    ownerProcesses.inProgress.some(p => p.name === processType.name) ||
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Tagged users */}
            {taggedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs"
                  >
                    @{user.name}
                    <button onClick={() => handleRemoveTag(user.id)} className="hover:text-teal-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Note textarea with @ mention dropdown */}
            <div className="relative">
              <Textarea
                placeholder="Write your note here... Use @ to tag colleagues"
                value={noteContent}
                onChange={handleNoteContentChange}
                className="min-h-[150px]"
              />
              {showMentionDropdown && filteredMentions.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 w-64 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                  {filteredMentions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectMention(user)}
                      className="flex items-center gap-2 w-full p-2 hover:bg-slate-50 text-left"
                    >
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">Tip: Type @ to mention and notify team members</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddNoteModal(false)
                setNoteContent("")
                setTaggedUsers([])
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNote} className="bg-teal-600 hover:bg-teal-700" disabled={!noteContent.trim()}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-teal-600" />
              Create New Task
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
              <Input
                className="mt-1"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea
                className="mt-1"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Property</Label>
              <Select value={newTask.property} onValueChange={(value) => setNewTask({ ...newTask, property: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Assignee</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter assignee name"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "High" | "Medium" | "Low") => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDocModal} onOpenChange={setShowUploadDocModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-teal-600" />
              Upload Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Upload File</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 transition-colors">
                <input
                  type="file"
                  id="owner-doc-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setUploadDoc({ ...uploadDoc, file })
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="owner-doc-upload" className="cursor-pointer">
                  {uploadDoc.file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-teal-600" />
                      <span className="text-sm text-slate-700">{uploadDoc.file.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Document Type</Label>
              <Select
                value={uploadDoc.documentType}
                onValueChange={(value) => setUploadDoc({ ...uploadDoc, documentType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property-deed">Property Deed</SelectItem>
                  <SelectItem value="insurance-certificate">Insurance Certificate</SelectItem>
                  <SelectItem value="tax-document">Tax Document</SelectItem>
                  <SelectItem value="w9-form">W-9 Form</SelectItem>
                  <SelectItem value="bank-statement">Bank Statement</SelectItem>
                  <SelectItem value="lease-agreement">Lease Agreement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Assignee (Optional)</Label>
              <Select
                value={uploadDoc.assignee}
                onValueChange={(value) => setUploadDoc({ ...uploadDoc, assignee: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_LIST.map((staff) => (
                    <SelectItem key={staff.id} value={staff.name}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Comments (Optional)</Label>
              <Textarea
                className="mt-1"
                placeholder="Add any comments about this document"
                value={uploadDoc.comments}
                onChange={(e) => setUploadDoc({ ...uploadDoc, comments: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowUploadDocModal(false)
              setUploadDoc({ file: null, documentType: "", assignee: "", comments: "" })
            }}>
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              disabled={!uploadDoc.file}
              onClick={() => {
                console.log("Uploading document:", uploadDoc)
                setShowUploadDocModal(false)
                setUploadDoc({ file: null, documentType: "", assignee: "", comments: "" })
              }}
            >
              Upload Document
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

      {/* Email compose is now inline in the Communications tab */}

      {/* SMS Popup Modal */}
      <SMSPopupModal
        isOpen={showSMSModal}
        onClose={() => {
          setShowSMSModal(false)
          setSelectedSMSItem(null)
        }}
        contactName={selectedSMSItem?.from.name || contact.name}
        contactPhone={selectedSMSItem?.from.contact || contact.phone}
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
        currentBody={selectedEmailItem?.fullContent || selectedEmailItem?.content || ""}
        currentTimestamp={selectedEmailItem?.timestamp || ""}
      />

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
              Missing Fields ({ownerMissingFields.length})
            </button>
            <button
              type="button"
              onClick={() => setMissingInfoTab("documents")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${missingInfoTab === "documents"
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              Missing Documents ({ownerMissingDocuments.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {missingInfoTab === "fields" ? (
              <div className="space-y-3">
                {ownerMissingFields.map((field) => (
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
                        setActiveTab(field.tab)
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
                {ownerMissingDocuments.map((doc) => (
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
                        setActiveTab("overview")
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

      {/* Add Custom Field Modal */}
      <Dialog open={showCustomFieldModal} onOpenChange={setShowCustomFieldModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-teal-600" />
              Add Custom Field
            </DialogTitle>
            <p className="text-sm text-slate-500">
              Add a new custom field to the {availableSections.find(s => s.id === customFieldSection)?.name || "selected"} section.
              All custom fields are available for reporting.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Section Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Section</Label>
              <Select value={customFieldSection} onValueChange={setCustomFieldSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Field Name</Label>
              <Input
                placeholder="Enter field name..."
                value={newCustomField.name}
                onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
              />
            </div>

            {/* Field Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Field Type</Label>
              <Select
                value={newCustomField.type}
                onValueChange={(val) => setNewCustomField({ ...newCustomField, type: val as CustomFieldType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="dropdown">Dropdown / Multi-select</SelectItem>
                  <SelectItem value="yes_no">Yes / No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dropdown Options (conditional) */}
            {newCustomField.type === "dropdown" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Options (comma separated)</Label>
                <Input
                  placeholder="Option 1, Option 2, Option 3..."
                  value={newCustomField.options}
                  onChange={(e) => setNewCustomField({ ...newCustomField, options: e.target.value })}
                />
              </div>
            )}

            {/* Mandatory Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
              <div>
                <p className="text-sm font-medium">Required Field</p>
                <p className="text-xs text-slate-500">Mark this field as mandatory</p>
              </div>
              <button
                type="button"
                onClick={() => setNewCustomField({ ...newCustomField, isMandatory: !newCustomField.isMandatory })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newCustomField.isMandatory ? "bg-teal-600" : "bg-slate-200"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCustomField.isMandatory ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {/* Reporting Awareness */}
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <FileBarChart className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700">This field will be available in Owner Directory reports</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomFieldModal(false)
                setNewCustomField({ name: "", type: "text", isMandatory: false, options: "" })
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleAddCustomField}
              disabled={!newCustomField.name.trim() || !customFieldSection}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Field
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
              const isFromOwner = item.isIncoming

              return (
                <div key={item.id} className="space-y-2">
                  {/* SMS Item */}
                  {isSMS && (
                    <div className={`flex ${isFromOwner ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${isFromOwner
                          ? "bg-slate-100 border border-slate-200"
                          : "bg-teal-50 border border-teal-200"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-medium text-teal-700">SMS</span>
                          <span className="text-xs text-muted-foreground">
                            {isFromOwner ? "Received" : "Sent"}
                          </span>
                        </div>
                        <p className="text-sm">{item.content}</p>
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
                    <div className={`flex ${isFromOwner ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[90%] rounded-lg border ${isFromOwner
                          ? "bg-blue-50 border-blue-200"
                          : "bg-indigo-50 border-indigo-200"
                          }`}
                      >
                        {/* Email Header - Always Visible */}
                        <div
                          className="p-3 cursor-pointer hover:bg-opacity-80 transition-colors"
                          onClick={() => toggleEmailExpand(`thread-${item.id}`)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-blue-600" />
                              <span className="text-xs font-medium text-blue-700">Email</span>
                              <span className="text-xs text-muted-foreground">
                                {isFromOwner ? "Received" : "Sent"}
                              </span>
                            </div>
                            {expandedEmails.includes(`thread-${item.id}`) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1">
                            {item.subject || "No Subject"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            From: {item.from.name} • {item.timestamp}
                          </p>
                        </div>

                        {/* Email Body - Expanded */}
                        {expandedEmails.includes(`thread-${item.id}`) && (
                          <div className="border-t border-blue-200 p-3 space-y-3">
                            {item.thread && item.thread.length > 0 ? (
                              item.thread.map((email, idx) => (
                                <div key={email.id} className={idx > 0 ? "border-t border-blue-100 pt-3" : ""}>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <span>From: {email.from} ({email.email})</span>
                                    <span>{email.timestamp}</span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{email.content}</p>

                                  {/* Email Opens (only for sent emails) */}
                                  {email.emailOpens && email.emailOpens.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-blue-100">
                                      <p className="text-xs text-amber-600 flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Opened: {email.emailOpens.map((o, i) => (
                                          <span key={i}>
                                            {o.openedAt}{i < (email.emailOpens?.length ?? 0) - 1 ? ", " : ""}
                                          </span>
                                        ))}
                                      </p>
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Reply</span>
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
                  onClick={() => setThreadReplyChannel("call")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${threadReplyChannel === "call"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  <PhoneCall className="h-3.5 w-3.5" />
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
                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-3 py-2">
                  <Button variant="outline" size="sm" onClick={() => setShowThreadModal(false)}>Close</Button>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5">
                    <Send className="h-3.5 w-3.5" /> Send Email
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> View in Activity
                  </Button>
                </div>
              </div>
            )}

            {/* SMS Reply UI */}
            {threadReplyChannel === "sms" && (
              <div className="space-y-3">
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
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowThreadModal(false)}>Close</Button>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 gap-1.5"
                    onClick={() => {
                      if (threadReplyText.trim()) {
                        setThreadReplyText("")
                      }
                    }}
                  >
                    <Send className="h-3.5 w-3.5" /> Send SMS
                  </Button>
                </div>
              </div>
            )}

            {/* Call UI */}
            {threadReplyChannel === "call" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter phone number or use contact's number..."
                      defaultValue={contact?.phone || ""}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowThreadModal(false)}>Close</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                    <PhoneCall className="h-3.5 w-3.5" /> Start Call
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
