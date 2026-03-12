"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  MoreHorizontal,
  Send,
  Pin,
  ChevronDown,
  Building2,
  Bed,
  Bath,
  Square,
  DollarSign,
  MapPin,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Shield,
  PawPrint,
  Wind,
  Sparkles,
  ArrowRight,
  Plus,
  Pencil,
  Check,
  Eye,
  Download,
  Star,
  Trash2,
  CheckCircle2,
  Search,
  AlertTriangle,
  StickyNote,
  PhoneCall,
  ExternalLink,
  User,
  ClipboardList,
  Users,
  CheckCircle,
  Upload,
  History,
  ListTodo,
  RotateCcw,
  Edit,
  Clock,
  X,
  Workflow,
  PlayCircle,
  FolderOpen,
  Bell,
  ChevronRight,
  Paperclip,
  ChevronUp,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Smile,
  Type,
  Share2,
  Copy,
  QrCode,
} from "lucide-react"
import { SMSPopupModal } from "@/components/sms-popup-modal"
import { EmailPopupModal } from "@/components/email-popup-modal"
import { useNav } from "@/app/dashboard/page"
import { useQuickActions } from "@/context/QuickActionsContext"
import { getLeadProspectQuickActions, getOwnerProspectQuickActions } from "@/lib/quickActions"
import { useRouter } from "next/navigation"
import {
  STAGES,
  getStageColor,
  getActivitiesData,
  AVAILABLE_PROCESS_TYPES,
  STAGE_PROGRESS_COLORS,
  resolveStageIndex,
  STAFF_LIST,
  type StaffListItem,
  DEPARTMENTS,
  prospectDetailTabs,
  recentMessagesMock,
  auditLogMock,
  prospectDocumentsMock,
  prospectAuditLogsMock,
  prospectTaskStaffMembersMock,
  prospectPropertyUnitsMock,
  ALL_AVAILABLE_PROPERTIES,
  initialApplicant,
  initialResidentialHistory,
  initialBankAccounts,
  initialCreditCards,
  initialInterestedProperties,
  initialProspectTasks,
  leaseProspectProcesses,
} from "@/features/leads/data/tenantApplicationDetail"

// All tasks or reasons for each stage (shown in tooltip)
// All tasks or reasons for each stage (shown in tooltip)
const STAGE_TASKS: Record<number, { type: "task" | "reason"; text: string }[]> = {
  0: [{ type: "task", text: "Send Email" }, { type: "task", text: "Make Call" }],
  1: [{ type: "task", text: "Make Call" }, { type: "task", text: "Send SMS" }],
  2: [{ type: "task", text: "Send SMS" }, { type: "task", text: "Send Email" }],
  3: [{ type: "task", text: "Make Call" }, { type: "task", text: "Todo points" }],
  4: [{ type: "task", text: "Todo points" }, { type: "task", text: "Send Email" }],
  5: [{ type: "task", text: "Send Email" }, { type: "task", text: "Set Video meeting" }],
  6: [{ type: "task", text: "Todo points" }, { type: "task", text: "Make Call" }],
  7: [{ type: "task", text: "Send Email" }, { type: "task", text: "Send SMS" }],
  8: [{ type: "task", text: "Set Video meeting" }, { type: "task", text: "Todo points" }],
  9: [{ type: "task", text: "Send SMS" }, { type: "task", text: "Send Email" }],
  10: [{ type: "reason", text: "Prospect not interested or property disliked" }],
  11: [{ type: "reason", text: "Application did not meet criteria" }],
}
import type { ProspectTaskStatus, ProspectTask } from "@/features/leads/types"

interface TenantApplicationDetailViewProps {
  lead: any
  onBack: () => void
  onNavigateToProperty?: (propertyName: string) => void
  onConvertToTenant?: (lead: any, finalizedProperty: any) => void
  defaultTab?: string
}

export function TenantApplicationDetailView({
  lead,
  onBack,
  onNavigateToProperty,
  onConvertToTenant,
  defaultTab,
}: TenantApplicationDetailViewProps) {
  const ACTIVITIES_DATA = getActivitiesData(lead.name, lead.phone, lead.email)

  const stageIndex = resolveStageIndex(lead.stage)
  const [currentStage, setCurrentStage] = useState(stageIndex)
  const [expandedActivityId, setExpandedActivityId] = useState<number | null>(null)
  const [staffOpen, setStaffOpen] = useState(false)
  const [assignedStaff, setAssignedStaff] = useState(STAFF_LIST[0])
  const [expandedThreadMessage, setExpandedThreadMessage] = useState<string | null>(null)
  const [pinnedActivities, setPinnedActivities] = useState<number[]>([])
  const [readStatusFilter, setReadStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [activityChatTab, setActivityChatTab] = useState<"private" | "group">("private")
  const [activityTileFilter, setActivityTileFilter] = useState<"all" | "emails" | "sms" | "notes">("all")
  const [activityRadioFilter, setActivityRadioFilter] = useState<"all" | "unread" | "unresponded">("all")
  const [replyText, setReplyText] = useState("")
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [taggedUsers, setTaggedUsers] = useState<StaffListItem[]>([])
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionFilter, setMentionFilter] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [assignedTeam, setAssignedTeam] = useState<StaffListItem[]>([STAFF_LIST[0]])
  const [teamPopoverOpen, setTeamPopoverOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const toDateInputValue = (s: string | undefined): string => {
    if (!s) return ""
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
    const d = new Date(s)
    if (Number.isNaN(d.getTime())) return ""
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  const [editableCreatedAt, setEditableCreatedAt] = useState(toDateInputValue(lead?.createdAt ?? ""))
  const [editableClosedAt, setEditableClosedAt] = useState(toDateInputValue(lead?.lastTouch ?? ""))
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [missingInfoTab, setMissingInfoTab] = useState<"fields" | "documents">("fields")
  const router = useRouter()
  // SMS & Email Modal state
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [selectedSMSActivity, setSelectedSMSActivity] = useState<(typeof ACTIVITIES_DATA)[0] | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedEmailActivity, setSelectedEmailActivity] = useState<(typeof ACTIVITIES_DATA)[0] | null>(null)

  // Communication Thread Modal State
  const [showThreadModal, setShowThreadModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<(typeof ACTIVITIES_DATA)[0] | null>(null)
  const [expandedEmails, setExpandedEmails] = useState<string[]>([])
  const [threadReplyText, setThreadReplyText] = useState("")
  const [threadReplyChannel, setThreadReplyChannel] = useState<"email" | "sms">("email")
  const [threadEmailCC, setThreadEmailCC] = useState("")
  const [threadEmailBCC, setThreadEmailBCC] = useState("")
  const [showCCBCC, setShowCCBCC] = useState(false)
  const [threadEmailSubject, setThreadEmailSubject] = useState("")

  // Communications tab state
  const [commSubTab, setCommSubTab] = useState<"private" | "group">("private")
  const [commChannel, setCommChannel] = useState<"email" | "sms" | "call">("email")
  const [commMessage, setCommMessage] = useState("")
  const [expandedCommEmails, setExpandedCommEmails] = useState<Set<string>>(new Set())
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [emailComposeCc, setEmailComposeCc] = useState("")
  const [emailComposeBcc, setEmailComposeBcc] = useState("")
  const [emailComposeSubject, setEmailComposeSubject] = useState("")
  const [emailComposeBody, setEmailComposeBody] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  // Add Custom Field modal state (Prospect Info card)
  const [showAddCustomFieldModal, setShowAddCustomFieldModal] = useState(false)
  const [customFieldData, setCustomFieldData] = useState({
    section: "Federal Tax",
    fieldName: "",
    fieldType: "Text",
    isRequired: false,
  })

  // Share link dialog state (property resource links)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLinkLabel, setShareLinkLabel] = useState("")
  const [shareLinkType, setShareLinkType] = useState<"prospect-only" | "choose-recipient">("prospect-only")
  const [shareConfirmed, setShareConfirmed] = useState(false)
  const [shareRecipient, setShareRecipient] = useState<"prospect" | "owner" | "both" | "">("")

  const handleShareLink = (label: string) => {
    setShareLinkLabel(label)
    setShareConfirmed(false)
    setShareRecipient("")
    if (label === "Matterport Scan") {
      setShareLinkType("choose-recipient")
    } else {
      setShareLinkType("prospect-only")
    }
    setShowShareDialog(true)
  }

  const handleConfirmShare = (recipient?: "prospect" | "owner" | "both") => {
    if (shareLinkType === "choose-recipient" && recipient) {
      setShareRecipient(recipient)
    }
    setShareConfirmed(true)
  }

  const handleOpenShareDialog = (linkType: string) => handleShareLink(linkType)

  // Access Information dialogs (Lockbox / ShowMojo)
  const [showGenerateCodeDialog, setShowGenerateCodeDialog] = useState(false)
  const [showShareLinksDialog, setShowShareLinksDialog] = useState(false)
  const [shareLinksType, setShareLinksType] = useState<"lockbox" | "showmojo">("lockbox")
  const [shareLinkRecipients, setShareLinkRecipients] = useState<Record<string, boolean>>({
    leasingProspect: false,
    owner: false,
    csr: false,
    csm: false,
    leasingCoordinator1: false,
    leasingCoordinator2: false,
    leasingManager: false,
  })
  const [shareLinkMethod, setShareLinkMethod] = useState<{ email: boolean; sms: boolean }>({
    email: false,
    sms: false,
  })
  const [shareLinkMessage, setShareLinkMessage] = useState("")

  const shareRecipientOptions = [
    { id: "leasingProspect", label: "Leasing Prospect", color: "bg-teal-500" },
    { id: "owner", label: "Owner", color: "bg-red-500" },
    { id: "csr", label: "CSR", color: "bg-gray-400" },
    { id: "csm", label: "CSM", color: "bg-orange-500" },
    { id: "leasingCoordinator1", label: "Leasing Coordinator", color: "bg-green-500" },
    { id: "leasingCoordinator2", label: "Leasing Coordinator", color: "bg-red-400" },
    { id: "leasingManager", label: "Leasing Manager", color: "bg-gray-400" },
  ]

  const [lockboxCode] = useState("5893 2474")
  const [lockboxCopied, setLockboxCopied] = useState(false)
  const [showmojoAccessOption, setShowmojoAccessOption] = useState("one-day")
  const [showmojoCodeDate, setShowmojoCodeDate] = useState("Feb 23, 2026")

  const showmojoAccessOptions = [
    { id: "one-day", label: "One day" },
    { id: "multiple-days", label: "Multiple days" },
    { id: "multiple-months", label: "Multiple months" },
    { id: "one-hour", label: "One hour" },
    { id: "two-hours", label: "Two hours" },
    { id: "three-hours", label: "Three hours" },
    { id: "four-hours", label: "Four hours" },
    { id: "five-hours", label: "Five hours" },
    { id: "six-hours", label: "Six hours" },
  ]

  const handleOpenShareLinksDialog = (type: "lockbox" | "showmojo") => {
    setShareLinksType(type)
    setShowShareLinksDialog(true)
  }

  const handleCopyLockboxCode = () => {
    navigator.clipboard.writeText(lockboxCode)
    setLockboxCopied(true)
    setTimeout(() => setLockboxCopied(false), 2000)
  }

  const handleShareLinkRecipientToggle = (id: string) => {
    setShareLinkRecipients((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleShareLinkMethodToggle = (method: "email" | "sms") => {
    setShareLinkMethod((prev) => ({ ...prev, [method]: !prev[method] }))
  }

  const handleSendShareLink = () => {
    // In this UI-only port we just close and reset; actual sending would be wired to backend later.
    setShowShareLinksDialog(false)
    setShareLinkRecipients({
      leasingProspect: false,
      owner: false,
      csr: false,
      csm: false,
      leasingCoordinator1: false,
      leasingCoordinator2: false,
      leasingManager: false,
    })
    setShareLinkMethod({ email: false, sms: false })
    setShareLinkMessage("")
  }

  // Handler to open modals for Activity items
  const handleActivityClick = (activity: (typeof ACTIVITIES_DATA)[0]) => {
    if (activity.type === "sms" || activity.type === "email") {
      // Open the thread modal for SMS and Email
      setSelectedCommunication(activity)
      setExpandedEmails([])
      setThreadReplyText("")
      setShowCCBCC(false)
      setThreadEmailCC("")
      setThreadEmailBCC("")
      setShowThreadModal(true)
    } else {
      // For other types (calls, notes), toggle expansion
      setExpandedActivityId(expandedActivityId === activity.id ? null : activity.id)
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
    // Filter only private chat activities (not group chat) and exclude notes
    const threadItems = ACTIVITIES_DATA.filter(
      (a) => !a.isGroupChat && !a.isNote && (a.type === "sms" || a.type === "email" || a.type === "call"),
    )

    // Sort by timestamp (oldest first for thread view)
    return threadItems.sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const prospectInfo = {
    name: lead.name,
    primaryEmail: lead.email,
    primaryPhone: lead.phone,
    location: "San Francisco, CA",
    source: "Zillow",
    startDate: editableCreatedAt,
    closeDate: editableClosedAt,
  }

  const togglePin = (activityId: number) => {
    setPinnedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log("Sending reply:", replyText)
      setReplyText("")
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sms":
        return { icon: MessageSquare, color: "bg-warning" }
      case "email":
        return { icon: Mail, color: "bg-success" }
      case "call":
        return { icon: Phone, color: "bg-success" }
      case "note":
        return { icon: StickyNote, color: "bg-warning" }
      default:
        return { icon: MessageSquare, color: "bg-muted" }
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "sms":
        return "text-warning"
      case "email":
        return "text-success"
      case "call":
        return "text-success"
      case "note":
        return "text-warning"
      default:
        return "text-muted-foreground"
    }
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const position = e.target.selectionStart || 0
    setNoteText(value)
    setCursorPosition(position)

    // Check for @ mention trigger
    const textBeforeCursor = value.substring(0, position)
    const atIndex = textBeforeCursor.lastIndexOf("@")

    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(atIndex + 1)
      // Only show dropdown if @ is followed by non-space characters or nothing
      if (!textAfterAt.includes(" ")) {
        setMentionFilter(textAfterAt.toLowerCase())
        setShowMentionDropdown(true)
        return
      }
    }
    setShowMentionDropdown(false)
    setMentionFilter("")
  }

  const handleSelectMention = (member: StaffListItem) => {
    const textBeforeCursor = noteText.substring(0, cursorPosition)
    const atIndex = textBeforeCursor.lastIndexOf("@")
    const textAfterCursor = noteText.substring(cursorPosition)

    const newText = noteText.substring(0, atIndex) + `@${member.name} ` + textAfterCursor
    setNoteText(newText)

    if (!taggedUsers.find((u) => u.id === member.id.toString())) {
      setTaggedUsers([...taggedUsers, member])
    }

    setShowMentionDropdown(false)
    setMentionFilter("")
  }

  const removeTaggedUser = (userId: number | string) => {
    setTaggedUsers(taggedUsers.filter((u) => u.id !== String(userId)))
  }

  const handleSaveNote = () => {
    if (noteText.trim()) {
      console.log("Saving note:", noteText, "Tagged users:", taggedUsers)
      setNoteText("")
      setTaggedUsers([])
      setShowAddNoteModal(false)
    }
  }

  // Modified TEAM_MEMBERS to STAFF_LIST and adjusted type
  const filteredMentionUsers = STAFF_LIST.filter(
    (member) => member.name.toLowerCase().includes(mentionFilter) && !taggedUsers.find((u) => u.id === member.id.toString()),
  )

  const renderExpandedContent = (activity: (typeof ACTIVITIES_DATA)[0]) => {
    const isExpanded = expandedActivityId === activity.id
    if (!isExpanded) return null

    switch (activity.type) {
      case "sms":
        return (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground whitespace-pre-wrap">{activity.fullMessage || activity.message}</p>
            </div>
            <div className="space-y-3">
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] resize-none border-0 focus-visible:ring-0"
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
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSendReply} disabled={!replyText.trim()} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )

      case "email":
        const emailThread = activity.emailThread || []
        return (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="space-y-3 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email Thread ({emailThread.length} messages)
              </p>
              {emailThread.map((email) => (
                <div
                  key={email.id}
                  className={`rounded-lg border transition-all cursor-pointer ${expandedThreadMessage === email.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-border hover:border-primary/20 hover:bg-muted/30"
                    }`}
                  onClick={() => setExpandedThreadMessage(expandedThreadMessage === email.id ? null : email.id)}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`text-xs ${email.isFromMe ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                          {email.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{email.from}</p>
                        <p className="text-xs text-muted-foreground">{email.fromEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{email.timestamp}</p>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground ml-auto mt-1 transition-transform ${expandedThreadMessage === email.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {expandedThreadMessage === email.id && (
                    <div className="px-3 pb-3">
                      <div className="bg-background rounded-lg p-4 border">
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-medium">To:</span> {email.to} ({email.toEmail})
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          <span className="font-medium">Subject:</span> {email.subject}
                        </p>
                        <div className="border-t pt-3">
                          <p className="text-sm whitespace-pre-wrap">{email.content}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                          <Textarea
                            placeholder={`Reply to ${email.from}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[80px] resize-none border-0 focus-visible:ring-0"
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
                        <div className="flex justify-end">
                          <Button size="sm" onClick={handleSendReply} disabled={!replyText.trim()} className="gap-2">
                            <Send className="h-4 w-4" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "call":
        return (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Call Notes</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">{activity.callNotes || activity.message}</p>
              </div>
            </div>
            {activity.appfolioLink && (
              <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-5 w-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Call Recording Available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This call recording is stored in Appfolio. Click the link below to access the full recording and
                      additional call details.
                    </p>
                    <a
                      href={activity.appfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-info hover:text-info/80 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Appfolio
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const [applicant] = useState(initialApplicant)
  const [residentialHistory] = useState(initialResidentialHistory)
  const [bankAccounts] = useState(initialBankAccounts)
  const [creditCards] = useState(initialCreditCards)

  const auditLog = auditLogMock
  const recentMessages = recentMessagesMock
  const tabs = prospectDetailTabs

  // State for modals (kept for potential fallback or if needed later)
  const [messageType, setMessageType] = useState("email")
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showCallModal, setShowCallModal] = useState(false)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadDocData, setUploadDocData] = useState({
    file: null as File | null,
    type: "",
    comments: "",
    assignTo: "",
  })
  const [dragActive, setDragActive] = useState(false)

  const [activeMainTab, setActiveMainTab] = useState(defaultTab || "overview")

  // Processes tab state
  const [processStatusFilter, setProcessStatusFilter] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([])
  const nav = useNav()

  const leadQuickActions = useMemo(
    () =>
      getLeadProspectQuickActions({
        onSendEmail: () => setShowEmailModal(true),
        onSendSMS: () => setShowSMSModal(true),
        onLogCall: () => setShowCallModal(true),
        onAddNote: () => setShowAddNoteModal(true),
        onScheduleMeeting: () => setShowMeetingModal(true),
        onReassign: () => setShowReassignModal(true),
      }),
    []
  )
  // Let the global Quick Actions panel subtitle follow the route name
  // (e.g. "Leads - Owner Prospects", "Leads - Lease Prospects").
  useQuickActions(leadQuickActions)

  const [showProcessPanel, setShowProcessPanel] = useState(false)
  const [editingProcess, setEditingProcess] = useState<{
    id: string
    name: string
    leaseProspectStage: string
    status: string
    startedOn?: string
  } | null>(null)

  // Start new process modal
  const [showStartProcessModal, setShowStartProcessModal] = useState(false)
  const [processSearchQuery, setProcessSearchQuery] = useState("")
  const [newlyStartedProcesses, setNewlyStartedProcesses] = useState<Array<{
    id: string
    name: string
    leaseProspectStage: string
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
    leaseProspectStage: string
    status: string
    startedOn?: string
  }) => {
    setEditingProcess(process)
    setShowProcessPanel(true)
  }

  const handleStartNewProcess = (processType: { id: string; name: string; stages: number }) => {
    const today = new Date()
    const dateStr = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`
    const newProcess = {
      id: `proc-new-${Date.now()}`,
      name: processType.name,
      leaseProspectStage: "Working",
      startedOn: dateStr,
      status: "In Progress",
      tasks: [] as Array<{ id: string; name: string; startDate: string | null; completedDate: string | null; staffName: string; staffEmail: string }>,
    }
    setNewlyStartedProcesses(prev => [...prev, newProcess])
    setShowStartProcessModal(false)
    setProcessSearchQuery("")
    setProcessStatusFilter("in-progress")
  }

  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [showRequestDocModal, setShowRequestDocModal] = useState(false)
  const [showViewTaskModal, setShowViewTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const [interestedProperties, setInterestedProperties] = useState(initialInterestedProperties)

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showFinalizeConfirmModal, setShowFinalizeConfirmModal] = useState(false)
  const [showDeletedNoteModal, setShowDeletedNoteModal] = useState(false)
  const [selectedDeletedNote, setSelectedDeletedNote] = useState<{
    content: string
    deletedBy: string
    deletedOn: string
  } | null>(null)
  const [finalizedPropertyId, setFinalizedPropertyId] = useState<number | null>(null)
  const [propertyToFinalize, setPropertyToFinalize] = useState<any>(null)
  const [propertySearchQuery, setPropertySearchQuery] = useState("")

  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Parking: <Car className="h-4 w-4" />,
      Gym: <Dumbbell className="h-4 w-4" />,
      Pool: <Waves className="h-4 w-4" />, // Changed to Waves for pool
      "In-unit Laundry": <Square className="h-4 w-4" />,
      "Central AC": <Wind className="h-4 w-4" />, // Changed to Wind for AC
      "High-speed Internet": <Wifi className="h-4 w-4" />,
      "Rooftop Deck": <Building2 className="h-4 w-4" />,
      Concierge: <Shield className="h-4 w-4" />,
      "Pet Friendly": <PawPrint className="h-4 w-4" />,
      Balcony: <Sparkles className="h-4 w-4" />, // Changed to Sparkles for balcony
    }
    return iconMap[amenity] || <Check className="h-4 w-4" />
  }

  const [prospectTasks, setProspectTasks] = useState<ProspectTask[]>(initialProspectTasks as ProspectTask[])

  const handleMarkTaskComplete = (taskId: number) => {
    setProspectTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "Completed" } : task)))
  }

  const handleAddProperty = (property: any) => {
    if (!interestedProperties.find((p) => p.id === property.id)) {
      setInterestedProperties([...interestedProperties, property])
    }
    setShowAddPropertyModal(false)
    setPropertySearchQuery("")
  }

  const handleRemoveProperty = (propertyId: number) => {
    setInterestedProperties(interestedProperties.filter((p) => p.id !== propertyId))
    if (finalizedPropertyId === propertyId) {
      setFinalizedPropertyId(null)
      setPropertyToFinalize(null) // Reset propertyToFinalize as well
    }
  }

  const handleMarkAsFinal = (property: any) => {
    setPropertyToFinalize(property)
    setShowFinalizeConfirmModal(true)
  }

  const handleConfirmFinalize = () => {
    if (propertyToFinalize) {
      setFinalizedPropertyId(propertyToFinalize.id)
      setShowFinalizeConfirmModal(false)
      // Call onConvertToTenant if provided
      if (onConvertToTenant) {
        onConvertToTenant(lead, propertyToFinalize)
      }
    }
  }

  const availablePropertiesToAdd = ALL_AVAILABLE_PROPERTIES.filter(
    (p) => !interestedProperties.find((ip) => ip.id === p.id),
  ).filter(
    (p) =>
      propertySearchQuery === "" ||
      p.name.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(propertySearchQuery.toLowerCase()),
  )

  const prospectDocuments = prospectDocumentsMock

  const prospectAuditLogs = prospectAuditLogsMock
  const prospectPropertyUnits = prospectPropertyUnitsMock
  const prospectTaskStaffMembers = prospectTaskStaffMembersMock

  // State for task modal fields
  const [taskProperty, setTaskProperty] = useState("")
  const [taskUnit, setTaskUnit] = useState("")
  const [taskAssignTo, setTaskAssignTo] = useState("")

  // Merged code starts here, replacing the original structure with the new layout
  return (
    <>
      <div className="px-6 pb-6 pt-2 overflow-auto">
        {/* Back Button */}
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 text-[rgba(10,10,10,1)]" />
          <span className="text-[rgba(0,0,0,1)]">Back to Lease Prospects</span>
        </button>

        {/* Prospect Info Card */}
        <div className="rounded-lg p-4 mb-6 bg-[rgba(248,245,245,1)]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{prospectInfo.name}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Primary:</span>
                    <a href={`mailto:${prospectInfo.primaryEmail}`} className="text-primary hover:underline">
                      {prospectInfo.primaryEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Primary:</span>
                    <a href={`tel:${prospectInfo.primaryPhone}`} className="text-primary hover:underline">
                      {prospectInfo.primaryPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{prospectInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Source:</span>
                    <span className="text-foreground">{prospectInfo.source}</span>
                  </div>
                  {/* Add Field Button */}
                  <button
                    onClick={() => setShowAddCustomFieldModal(true)}
                    className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 transition-colors border border-teal-600 hover:border-teal-700 rounded-md px-2 py-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Field</span>
                  </button>
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

            {/* Assigned Staff Dropdown */}
            <Popover open={teamPopoverOpen} onOpenChange={setTeamPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={teamPopoverOpen}
                  className="justify-between gap-2 bg-transparent px-3 py-2 h-10"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {assignedTeam.length > 0 ? assignedTeam[0].name : "Unassigned"}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0" align="end">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Assigned Team Members</h4>
                    {assignedTeam.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive bg-transparent"
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
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{member.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.department}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive bg-transparent"
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
                        {STAFF_LIST
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
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{staff.initials}</AvatarFallback>
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

          {/* Stage Progress Rectangles */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 flex-1">
              {STAGES.map((stage, index) => (
                <TooltipProvider key={stage}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-7 flex-1 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:opacity-80 hover:scale-y-110"
                        style={{ backgroundColor: STAGE_PROGRESS_COLORS[index] }}
                      >
                        {index === currentStage && (
                          <Check className="h-4 w-4 text-white drop-shadow-sm" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{stage}</p>
                      {STAGE_TASKS[index] && STAGE_TASKS[index].length > 0 && (
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {STAGE_TASKS[index].map((task, taskIdx) => (
                            <p key={taskIdx} className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                              {task.type === "reason" ? "Reason" : "Task"}:{" "}
                              {task.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
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

        <div className="flex flex-col gap-3 mb-4">
          {/* Bar 1: Pending Communications */}
          <button
            type="button"
            onClick={() => {
              setActiveMainTab("overview")
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
                  <span className="font-semibold">2</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-sm text-amber-800">
                  {"Unread SMS: "}
                  <span className="font-semibold">1</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3">
                <Phone className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-sm text-amber-800">
                  {"Pending Calls: "}
                  <span className="font-semibold">3</span>
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
                onClick={() => setShowMissingInfoModal(true)}
                className="flex items-center gap-1.5 px-3 border-r border-amber-300 hover:underline"
              >
                <FileText className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-sm text-amber-800">
                  {"Missing Fields: "}
                  <span className="font-semibold">2</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowMissingInfoModal(true)}
                className="flex items-center gap-1.5 px-3 hover:underline"
              >
                <Upload className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-sm text-amber-800">
                  {"Missing Documents: "}
                  <span className="font-semibold">1</span>
                </span>
              </button>
            </div>
          </div>

          {/* Bar 3: Task Overview */}
          <button
            type="button"
            onClick={() => {
              setActiveMainTab("overview")
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
                  <span className="font-semibold">{prospectTasks.filter(t => t.status === "Pending" && !t.processName).length}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-sm text-amber-800">
                  {"Pending Processes: "}
                  <span className="font-semibold">{prospectTasks.filter(t => t.status === "Pending" && !!t.processName).length}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-sm text-red-700">
                  {"Overdue Tasks: "}
                  <span className="font-semibold">{prospectTasks.filter(t => t.isOverdue && !t.processName).length}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-sm text-red-700">
                  {"Overdue Processes: "}
                  <span className="font-semibold">{prospectTasks.filter(t => t.isOverdue && !!t.processName).length}</span>
                </span>
              </div>
            </div>
          </button>
        </div>
        <div className="mb-6">
          <div className="flex items-stretch border-b border-border">
            {[
              { id: "overview", label: "Overview" },
              { id: "property", label: "Property Information", count: interestedProperties.length },
              { id: "communications", label: "Communications" },
              { id: "processes", label: "Processes", count: leaseProspectProcesses.inProgress.length + leaseProspectProcesses.upcoming.length + leaseProspectProcesses.completed.length },
              { id: "tasks-docs", label: "Documents", count: prospectDocuments.length },
              { id: "audit-log", label: "Audit Log" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as typeof activeMainTab)}
                className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeMainTab === tab.id
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
        </div>

        {activeMainTab === "overview" && (
          <>
            {/* Tasks Section */}
            <div id="tasks-section" className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Tasks ({prospectTasks.length})</h3>
                </div>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[280px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-white">
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-medium">Task</TableHead>
                        <TableHead className="font-medium">Related Entity</TableHead>
                        <TableHead className="font-medium">Due Date</TableHead>
                        <TableHead className="font-medium">Priority</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Assigned To</TableHead>
                        <TableHead className="font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prospectTasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-foreground">{task.title}</span>
                              {task.processName && (
                                <div className="flex items-center gap-1">
                                  <Workflow className="h-3 w-3 text-teal-600" />
                                  <span className="text-xs text-teal-600">{task.processName}</span>
                                </div>
                              )}
                              {task.autoCreated && (
                                <span className="text-xs text-muted-foreground">Auto-created</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {task.relatedEntityType}: {task.relatedEntityName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                                {task.dueDate}
                              </span>
                              {task.isOverdue && (
                                <span className="text-xs text-red-500">(Overdue)</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                task.priority === "High"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : task.priority === "Medium"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                task.status === "In Progress"
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : task.status === "Pending"
                                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                    : task.status === "Skipped"
                                      ? "bg-orange-50 text-orange-600 border-orange-200"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }
                            >
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{task.assignee}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                title="View Task"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                title="Edit Task"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {task.status !== "Completed" && task.status !== "Skipped" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-success"
                                  title="Mark Complete"
                                  onClick={() => handleMarkTaskComplete(task.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

            </div>

            {/* Pinned Activity Section */}
            <div id="activity-section" className="mb-6">
              <h3 className="font-semibold text-sm mb-1">Pinned Activity</h3>
              <p className="text-sm text-muted-foreground italic">
                Click the pin icon on the activities below to keep them here at the top.
              </p>
              {pinnedActivities.length > 0 && (
                <div className="mt-3 space-y-2">
                  {ACTIVITIES_DATA
                    .filter((a) => pinnedActivities.includes(a.id))
                    .filter((a) => activityChatTab === "private" ? !a.isGroupChat : a.isGroupChat === true)
                    .map((activity) => {
                      const { icon: Icon, color } = getActivityIcon(activity.type)
                      return (
                        <div
                          key={`pinned-${activity.id}`}
                          className="flex items-start gap-3 p-3 rounded-lg border border-warning/20 bg-warning/5"
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10 bg-primary/10">
                              <AvatarFallback className="text-sm font-medium text-primary">
                                {activity.userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 ${color} rounded-full flex items-center justify-center`}
                            >
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span>
                              {activity.phone && <span className="text-muted-foreground"> {activity.phone}</span>}
                              <span className="text-muted-foreground"> {activity.action} </span>
                              {activity.target && (
                                <>
                                  <span className="font-medium text-primary">{activity.target}</span>
                                  {activity.targetPhone && (
                                    <span className="text-muted-foreground"> {activity.targetPhone}</span>
                                  )}
                                </>
                              )}
                            </p>
                            {activity.message && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.message}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-warning"
                              onClick={() => togglePin(activity.id)}
                            >
                              <Pin className="h-3 w-3 fill-current" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Activity Section */}
            <div className="rounded-lg border border-border bg-card">
              <div className="p-4">
                <h3 className="font-semibold mb-3">Activity</h3>

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
                    {ACTIVITIES_DATA.some(a => !a.isGroupChat && !a.isRead) && (
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
                    {ACTIVITIES_DATA.some(a => a.isGroupChat && (a.unreadCount ?? 0) > 0) && (
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
                        {ACTIVITIES_DATA.filter(a => activityChatTab === "private" ? !a.isGroupChat : a.isGroupChat === true).length}
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
                        {ACTIVITIES_DATA.filter(a => (activityChatTab === "private" ? !a.isGroupChat : a.isGroupChat === true) && a.type === "email").length}
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
                        {ACTIVITIES_DATA.filter(a => (activityChatTab === "private" ? !a.isGroupChat : a.isGroupChat === true) && a.type === "sms").length}
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
                        {ACTIVITIES_DATA.filter(a => (activityChatTab === "private" ? !a.isGroupChat : a.isGroupChat === true) && (a.type === "note" || a.isNote)).length}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wide ${activityTileFilter === "notes" ? "text-slate-300" : "text-slate-500"}`}>
                        Notes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radio Filters */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="activityRadioFilterTenant"
                      checked={activityRadioFilter === "all"}
                      onChange={() => setActivityRadioFilter("all")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-600">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="activityRadioFilterTenant"
                      checked={activityRadioFilter === "unread"}
                      onChange={() => setActivityRadioFilter("unread")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-600">Unread</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="activityRadioFilterTenant"
                      checked={activityRadioFilter === "unresponded"}
                      onChange={() => setActivityRadioFilter("unresponded")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-600">Unresponded</span>
                  </label>
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {ACTIVITIES_DATA
                  .filter((activity) => {
                    // Filter by chat tab
                    if (activityChatTab === "private" && activity.isGroupChat) return false
                    if (activityChatTab === "group" && !activity.isGroupChat) return false

                    // Filter by tile selection
                    if (activityTileFilter === "emails" && activity.type !== "email") return false
                    if (activityTileFilter === "sms" && activity.type !== "sms") return false
                    if (activityTileFilter === "notes" && activity.type !== "note" && !activity.isNote) return false

                    // Filter by radio selection
                    if (activityRadioFilter === "unread" && activity.isRead) return false

                    return true
                  })
                  .map((activity) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type)
                    const isExpanded = expandedActivityId === activity.id
                    const isPinned = pinnedActivities.includes(activity.id)

                    return (
                      <div
                        key={activity.id}
                        className={`border-b border-border last:border-b-0 ${!activity.isRead ? "bg-info/5" : ""}`}
                      >
                        <div
                          className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/30"
                          onClick={() => handleActivityClick(activity)}
                        >
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-10 w-10 bg-primary/10">
                              <AvatarFallback className="text-sm font-medium text-primary">
                                {activity.userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 ${color} rounded-full flex items-center justify-center`}
                            >
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-medium">{activity.user}</span>
                              {activity.phone && <span className="text-muted-foreground"> {activity.phone}</span>}
                              <span className={`${activity.isNote ? "text-warning" : "text-muted-foreground"}`}>
                                {" "}
                                {activity.action}{" "}
                              </span>
                              {activity.target && (
                                <>
                                  <span className="font-medium text-primary">{activity.target}</span>
                                  {activity.targetPhone && (
                                    <span className="text-muted-foreground"> {activity.targetPhone}</span>
                                  )}
                                </>
                              )}
                            </p>
                            {activity.isGroupChat && activity.groupParticipants && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {activity.groupParticipants.length <= 3
                                  ? activity.groupParticipants.join(", ")
                                  : `${activity.groupParticipants[0]} + ${activity.groupParticipants.length - 1} others`}
                              </p>
                            )}
                            {activity.message && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.message}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {activity.isGroupChat && activity.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-500 text-white text-xs font-medium">
                                {activity.unreadCount}
                              </span>
                            )}
                            {!activity.isRead && !activity.isGroupChat && <div className="w-2 h-2 rounded-full bg-info" />}
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                            <ChevronDown className={`h-4 w-4 text-muted-foreground ${isExpanded ? "rotate-180" : ""}`} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 w-6 p-0 ${isPinned ? "text-warning" : "text-muted-foreground hover:text-warning"}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePin(activity.id)
                              }}
                            >
                              <Pin className={`h-3 w-3 ${isPinned ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                        </div>

                        {isExpanded && renderExpandedContent(activity)}
                      </div>
                    )
                  })}
              </div>
            </div>
          </>
        )}

        {/* Property Information Tab */}
        {activeMainTab === "property" && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Properties of Interest ({interestedProperties.length})
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setShowAddPropertyModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {interestedProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`border rounded-lg overflow-hidden hover:border-primary/30 transition-colors relative ${finalizedPropertyId === property.id ? "border-success border-2 bg-success/5" : ""
                      }`}
                  >
                    {finalizedPropertyId === property.id && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Final Selection
                        </Badge>
                      </div>
                    )}

                    <div className="flex">
                      {/* Property Image & Resource Links */}
                      <div className="w-72 shrink-0 flex flex-col">
                        <div
                          className="w-full h-48 bg-cover bg-center cursor-pointer"
                          style={{
                            backgroundImage: `url(${property.image || "/modern-apartment-building.png"})`,
                          }}
                          onClick={() => onNavigateToProperty?.(property.name)}
                        />
                        <div className="px-2 py-2 border-r border-border flex flex-col gap-1.5 flex-1">
                          {[
                            { label: "Application Link", href: "#" },
                            { label: "Showing Link", href: "#" },
                            { label: "Matterport Scan", href: "#" },
                            { label: "Rental Comps", href: "#" },
                          ].map(({ label, href }) => (
                            <div key={label} className="flex items-center rounded-md border border-border transition-colors flex-1">
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  if (href === "#") e.preventDefault()
                                }}
                                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-info hover:underline flex-1 min-w-0 cursor-pointer"
                              >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span className="truncate text-sm font-semibold">{label}</span>
                              </a>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleOpenShareDialog(label)
                                }}
                                className="flex items-center justify-center px-2 py-1.5 transition-colors shrink-0 cursor-pointer"
                                style={{ color: "#228B22" }}
                                title={`Share ${label}`}
                              >
                                <Share2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}

                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="cursor-pointer hover:text-primary"
                            onClick={() => onNavigateToProperty?.(property.name)}
                          >
                            <h4 className="text-lg font-semibold">{property.name}</h4>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                            <p className="text-sm text-primary font-medium mt-1">{property.unit}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                property.status === "Available"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              }
                            >
                              {property.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onNavigateToProperty?.(property.name)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {finalizedPropertyId !== property.id && (
                                  <DropdownMenuItem onClick={() => handleMarkAsFinal(property)}>
                                    <Star className="h-4 w-4 mr-2" />
                                    Mark as Final
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleRemoveProperty(property.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Property Specs */}
                        <div className="grid grid-cols-5 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{property.bedrooms} Bed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{property.bathrooms} Bath</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Square className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{property.sqft} sqft</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{property.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{property.available}</span>
                          </div>
                        </div>

                        {/* Rent Info */}
                        <div className="flex items-center gap-6 mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Monthly Rent:</span>
                            <span className="font-semibold">${property.rent.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Security Deposit:</span>
                            <span className="font-semibold">${property.deposit.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div>
                          <p className="text-sm font-medium mb-2">Amenities</p>
                          <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity: string, index: number) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                {getAmenityIcon(amenity)}
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Access Information */}
                        <div className="mt-4 border-t pt-4">
                          <p className="text-sm font-medium text-foreground mb-3">Access Information</p>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Lockbox Code Card */}
                            <div className="border border-border rounded-lg bg-white p-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-4 w-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-green-600" />
                                </div>
                                <span className="text-sm font-medium text-foreground">Lockbox Code</span>
                              </div>

                              <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-3 px-3 py-2 rounded border border-border bg-white flex-1">
                                  <span className="text-sm font-mono font-semibold text-foreground tracking-wider">{lockboxCode}</span>
                                  <button
                                    type="button"
                                    onClick={handleCopyLockboxCode}
                                    className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                  >
                                    <Copy className="h-3 w-3" />
                                    {lockboxCopied ? "Copied!" : "Copy Lockbox Code"}
                                  </button>
                                </div>
                                <div className="w-12 h-12 rounded border border-border bg-white flex items-center justify-center shrink-0">
                                  <QrCode className="h-8 w-8 text-foreground" />
                                </div>
                              </div>

                              <Button
                                size="sm"
                                className="w-full bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleOpenShareLinksDialog("lockbox")}
                              >
                                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                                Share Lockbox Code
                              </Button>
                            </div>

                            {/* ShowMojo Code Card */}
                            <div className="border border-border rounded-lg bg-white p-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-4 w-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-green-600" />
                                </div>
                                <span className="text-sm font-medium text-foreground">ShowMojo Code</span>
                              </div>

                              <div className="mb-4 space-y-1">
                                <p className="text-sm text-muted-foreground">Expires on Feb 23, 2026</p>
                                <p className="text-sm text-muted-foreground">5:00 AM EST</p>
                                <button
                                  type="button"
                                  onClick={() => setShowGenerateCodeDialog(true)}
                                  className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2 cursor-pointer"
                                >
                                  Generate New Code
                                </button>
                              </div>

                              <Button
                                size="sm"
                                className="w-full bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleOpenShareLinksDialog("showmojo")}
                              >
                                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                                Share ShowMojo Code
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* View Property Details + Actions */}
                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                          <Button
                            size="sm"
                            variant="link"
                            className="hover:text-primary/80 p-0 text-[rgba(1,96,209,1)]"
                            onClick={() => onNavigateToProperty?.(property.name)}
                          >
                            View Property Details <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                          <div className="flex items-center gap-2">
                            {finalizedPropertyId !== property.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-success text-success hover:bg-success/5 bg-transparent"
                                onClick={() => handleMarkAsFinal(property)}
                              >
                                <Star className="h-4 w-4 mr-2" />
                                Mark as Final
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive/30 text-destructive hover:bg-destructive/5 bg-transparent"
                              onClick={() => handleRemoveProperty(property.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {interestedProperties.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No properties of interest yet.</p>
                    <Button
                      size="sm"
                      className="mt-4 bg-primary hover:bg-primary/90"
                      onClick={() => setShowAddPropertyModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Communications Tab */}
        {activeMainTab === "communications" && (
          <Card className="flex flex-col h-[900px]">
            <CardContent className="p-4 flex flex-col h-full">
              {/* Private / Group Sub-tabs */}
              <div className="flex items-center gap-1 mb-4 border-b">
                <button
                  onClick={() => { setCommSubTab("private"); setSelectedGroupId(null) }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${commSubTab === "private"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Private
                  {(() => {
                    const unreadPrivate = ACTIVITIES_DATA.filter(a => !a.isGroupChat && !a.isRead && a.user !== "Richard Surovi" && !a.isNote).length
                    return unreadPrivate > 0 ? (
                      <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                        {unreadPrivate}
                      </span>
                    ) : null
                  })()}
                </button>
                <button
                  onClick={() => { setCommSubTab("group"); setSelectedGroupId(null) }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${commSubTab === "group"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Group
                  {(() => {
                    const unreadGroup = ACTIVITIES_DATA.filter(a => a.isGroupChat && (a.unreadCount ?? 0) > 0).reduce((sum, a) => sum + (a.unreadCount ?? 0), 0)
                    return unreadGroup > 0 ? (
                      <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                        {unreadGroup}
                      </span>
                    ) : null
                  })()}
                </button>
              </div>

              {/* PRIVATE SUB-TAB */}
              {commSubTab === "private" && (() => {
                const privateComms = ACTIVITIES_DATA
                  .filter(a => !a.isGroupChat && !a.isNote && a.type !== "note")
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">Private Conversation</h3>
                      <span className="text-xs text-muted-foreground">{privateComms.length} messages</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                      <div className="flex flex-col gap-3">
                        {privateComms.length > 0 ? (
                          privateComms.map((item) => {
                            const isOutgoing = item.user === "Richard Surovi"
                            const isEmailExp = expandedCommEmails.has(String(item.id))

                            return (
                              <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] ${isOutgoing
                                  ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                  : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                  } p-3 shadow-sm`}>
                                  {/* Sender & Channel Badge */}
                                  <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                    <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>
                                      {item.user}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.type === "email"
                                      ? isOutgoing ? "bg-teal-500 text-teal-100" : "bg-blue-100 text-blue-600"
                                      : item.type === "sms"
                                        ? isOutgoing ? "bg-teal-500 text-teal-100" : "bg-green-100 text-green-600"
                                        : isOutgoing ? "bg-teal-500 text-teal-100" : "bg-orange-100 text-orange-600"
                                      }`}>
                                      {item.type === "email" ? "Email" : item.type === "sms" ? "SMS" : "Call"}
                                    </span>
                                  </div>

                                  {/* Email with thread */}
                                  {item.type === "email" && item.emailThread ? (
                                    <div>
                                      <button
                                        onClick={() => setExpandedCommEmails(prev => {
                                          const next = new Set(prev)
                                          const key = String(item.id)
                                          next.has(key) ? next.delete(key) : next.add(key)
                                          return next
                                        })}
                                        className={`text-sm font-medium mb-1 flex items-center gap-1 w-full text-left ${isOutgoing ? "text-white hover:text-teal-100" : "text-slate-800 hover:text-teal-600"}`}
                                      >
                                        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${isEmailExp ? "rotate-0" : "-rotate-90"}`} />
                                        {item.emailThread[0]?.subject || "Email"}
                                      </button>
                                      {isEmailExp ? (
                                        <div className="space-y-2 mt-1">
                                          {item.emailThread.map((threadItem: any, idx: number) => (
                                            <div key={threadItem.id} className={idx > 0 ? "pt-2 border-t border-dashed border-opacity-30 " + (isOutgoing ? "border-teal-300" : "border-slate-300") : ""}>
                                              {idx > 0 && (
                                                <div className={`text-xs mb-1 ${isOutgoing ? "text-teal-200" : "text-slate-500"}`}>
                                                  {threadItem.from} - {threadItem.timestamp}
                                                </div>
                                              )}
                                              <p className={`text-sm whitespace-pre-line ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                                {threadItem.content}
                                              </p>
                                              {threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
                                                <div className={`flex items-center gap-1 text-[10px] mt-1 ${isOutgoing ? "text-teal-200" : "text-green-600"}`}>
                                                  <Eye className="h-3 w-3" />
                                                  Opened at {threadItem.emailOpens[0].openedAt}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className={`text-xs mt-0.5 ${isOutgoing ? "text-teal-200" : "text-slate-400"}`}>
                                          {item.message}
                                        </p>
                                      )}
                                    </div>
                                  ) : item.type === "call" ? (
                                    <div className="space-y-1">
                                      <div className={`flex items-center gap-2 ${isOutgoing ? "text-teal-100" : "text-slate-600"}`}>
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">
                                          {isOutgoing ? "Outgoing call" : "Incoming call"}
                                        </span>
                                      </div>
                                      {item.callNotes && (
                                        <p className={`text-sm whitespace-pre-line ${isOutgoing ? "text-teal-50" : "text-slate-700"}`}>
                                          <span className="font-medium">Notes:</span> {item.callNotes}
                                        </p>
                                      )}
                                      {!item.callNotes && item.message && (
                                        <p className={`text-sm ${isOutgoing ? "text-teal-50" : "text-slate-700"}`}>{item.message}</p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className={`text-sm ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                      {item.fullMessage || item.message}
                                    </p>
                                  )}

                                  {/* Timestamp */}
                                  <div className={`text-[10px] mt-2 ${isOutgoing ? "text-teal-200 text-right" : "text-slate-400"}`}>
                                    {item.timestamp}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                            No private communications yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reply Composer */}
                    <div className="border rounded-lg bg-white shrink-0 max-h-[320px] overflow-y-auto">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 sticky top-0 bg-white z-10">
                        <span className="text-sm font-medium text-slate-700">Reply</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setCommChannel("email")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "email" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <Mail className="h-3.5 w-3.5" /> Email
                          </button>
                          <button type="button" onClick={() => setCommChannel("sms")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "sms" ? "bg-teal-100 text-teal-700 border border-teal-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <MessageSquare className="h-3.5 w-3.5" /> SMS
                          </button>
                          <button type="button" onClick={() => setCommChannel("call")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "call" ? "bg-green-100 text-green-700 border border-green-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <PhoneCall className="h-3.5 w-3.5" /> Call
                          </button>
                        </div>
                      </div>

                      {commChannel === "email" && (
                        <div>
                          <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                            <Label className="text-xs text-slate-500 w-12 shrink-0">To</Label>
                            <input type="text" defaultValue={lead.email} className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700" />
                            <button type="button" onClick={() => setShowCcBcc(!showCcBcc)} className="text-xs text-slate-500 hover:text-slate-700">Cc Bcc</button>
                          </div>
                          {showCcBcc && (
                            <>
                              <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                                <Label className="text-xs text-slate-500 w-12 shrink-0">Cc</Label>
                                <input type="text" placeholder="Enter CC email addresses" value={emailComposeCc} onChange={(e) => setEmailComposeCc(e.target.value)} className="flex-1 text-sm bg-transparent border-none outline-none" />
                              </div>
                              <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                                <Label className="text-xs text-slate-500 w-12 shrink-0">Bcc</Label>
                                <input type="text" placeholder="Enter BCC email addresses" value={emailComposeBcc} onChange={(e) => setEmailComposeBcc(e.target.value)} className="flex-1 text-sm bg-transparent border-none outline-none" />
                              </div>
                            </>
                          )}
                          <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                            <Label className="text-xs text-slate-500 w-12 shrink-0">Subject</Label>
                            <input type="text" placeholder="Enter subject" value={emailComposeSubject} onChange={(e) => setEmailComposeSubject(e.target.value)} className="flex-1 text-sm bg-transparent border-none outline-none" />
                          </div>
                          <textarea placeholder="Compose email..." value={emailComposeBody} onChange={(e) => setEmailComposeBody(e.target.value)} className="w-full min-h-[80px] p-3 text-sm resize-none focus:outline-none bg-white border-none" />
                          <div className="flex items-center justify-between border-t border-slate-200 px-2 py-1.5">
                            <div className="flex items-center gap-0.5">
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Formatting"><Type className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Bold"><Bold className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Italic"><Italic className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Underline"><Underline className="h-4 w-4" /></button>
                              <div className="w-px h-4 bg-slate-200 mx-1" />
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Link"><Link className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Emoji"><Smile className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Image"><ImageIcon className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Attach"><Paperclip className="h-4 w-4" /></button>
                              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="More"><MoreHorizontal className="h-4 w-4" /></button>
                            </div>
                            <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Discard"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-3 py-2 sticky bottom-0 bg-white">
                            <Button variant="outline" size="sm">Close</Button>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5">
                              <Send className="h-3.5 w-3.5" /> Send Email
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" /> View in Activity
                            </Button>
                          </div>
                        </div>
                      )}

                      {commChannel === "sms" && (
                        <div className="p-3">
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <Textarea placeholder="Type your SMS message..." value={commMessage} onChange={(e) => setCommMessage(e.target.value)} className="min-h-[60px] resize-none" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent"><Paperclip className="h-4 w-4" /></Button>
                              <Button size="icon" className="h-8 w-8 bg-teal-600 hover:bg-teal-700"><Send className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {commChannel === "call" && (
                        <div className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Input placeholder="Enter phone number or use prospect's number..." defaultValue={lead.phone || ""} className="text-sm" />
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                              <PhoneCall className="h-4 w-4" /> Start Call
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}

              {/* GROUP SUB-TAB */}
              {commSubTab === "group" && (() => {
                const groupComms = ACTIVITIES_DATA.filter(a => a.isGroupChat)
                const groupMap = new Map<string, { name: string; participants: string[]; messages: typeof groupComms; unreadCount: number; lastMessage: typeof groupComms[0] }>()
                groupComms.forEach(msg => {
                  const groupName = msg.target || "Unknown Group"
                  if (!groupMap.has(groupName)) {
                    groupMap.set(groupName, {
                      name: groupName,
                      participants: msg.groupParticipants || [],
                      messages: [],
                      unreadCount: 0,
                      lastMessage: msg,
                    })
                  }
                  const group = groupMap.get(groupName)!
                  group.messages.push(msg)
                  if ((msg.unreadCount ?? 0) > 0) group.unreadCount += (msg.unreadCount ?? 0)
                  if (new Date(msg.timestamp).getTime() > new Date(group.lastMessage.timestamp).getTime()) group.lastMessage = msg
                })
                const groups = Array.from(groupMap.values()).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime())
                const selectedGroup = selectedGroupId ? groups.find(g => g.name === selectedGroupId) : null
                const groupMessages = selectedGroup ? [...selectedGroup.messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : []

                return selectedGroup ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <button onClick={() => setSelectedGroupId(null)} className="text-slate-500 hover:text-slate-700">
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <div>
                        <h3 className="font-semibold text-slate-800">{selectedGroup.name}</h3>
                        <p className="text-xs text-slate-500">{selectedGroup.participants.join(", ")}</p>
                      </div>
                    </div>

                    <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                      <div className="flex flex-col gap-3">
                        {groupMessages.map((item) => {
                          const isOutgoing = item.user === "Richard Surovi"
                          return (
                            <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] ${isOutgoing
                                ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                } p-3 shadow-sm`}>
                                <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                  <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>{item.user}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.type === "email"
                                    ? isOutgoing ? "bg-teal-500 text-teal-100" : "bg-blue-100 text-blue-600"
                                    : isOutgoing ? "bg-teal-500 text-teal-100" : "bg-green-100 text-green-600"
                                    }`}>
                                    {item.type === "email" ? "Email" : "SMS"}
                                  </span>
                                </div>
                                <p className={`text-sm ${isOutgoing ? "text-white" : "text-slate-700"}`}>{item.fullMessage || item.message}</p>
                                <div className={`text-[10px] mt-2 ${isOutgoing ? "text-teal-200 text-right" : "text-slate-400"}`}>{item.timestamp}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Group Reply Composer */}
                    <div className="border rounded-lg bg-white shrink-0">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
                        <span className="text-sm font-medium text-slate-700">Reply</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setCommChannel("email")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "email" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <Mail className="h-3.5 w-3.5" /> Email
                          </button>
                          <button type="button" onClick={() => setCommChannel("sms")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "sms" ? "bg-teal-100 text-teal-700 border border-teal-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <MessageSquare className="h-3.5 w-3.5" /> SMS
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Textarea placeholder="Type a message to the group..." value={commMessage} onChange={(e) => setCommMessage(e.target.value)} className="min-h-[60px] resize-none" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent"><Paperclip className="h-4 w-4" /></Button>
                            <Button size="icon" className="h-8 w-8 bg-teal-600 hover:bg-teal-700"><Send className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-slate-800 mb-3">Communication Groups</h3>
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {groups.length > 0 ? groups.map((group) => (
                        <button
                          key={group.name}
                          onClick={() => setSelectedGroupId(group.name)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left"
                        >
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm shrink-0">
                            {group.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-800 truncate">{group.name}</span>
                              {group.unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full shrink-0 ml-2">
                                  {group.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{group.participants.length} participants</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{group.lastMessage.message}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                        </button>
                      )) : (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          No group communications yet.
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Processes Tab */}
        {activeMainTab === "processes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold">Processes</h3>
              </div>
              <Button
                onClick={() => { setProcessSearchQuery(""); setShowStartProcessModal(true) }}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Process
              </Button>
            </div>

            {/* Process Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setProcessStatusFilter("in-progress")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${processStatusFilter === "in-progress"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                In Progress ({leaseProspectProcesses.inProgress.length + newlyStartedProcesses.length})
              </button>
              <button
                type="button"
                onClick={() => setProcessStatusFilter("completed")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${processStatusFilter === "completed"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Completed ({leaseProspectProcesses.completed.length})
              </button>
              <button
                type="button"
                onClick={() => setProcessStatusFilter("upcoming")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${processStatusFilter === "upcoming"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Upcoming ({leaseProspectProcesses.upcoming.length})
              </button>
            </div>

            <div className="space-y-6">
              {/* In Progress Processes */}
              {processStatusFilter === "in-progress" && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <PlayCircle className="h-4 w-4 text-amber-500" />
                    <h4 className="font-semibold text-foreground">In Progress ({leaseProspectProcesses.inProgress.length + newlyStartedProcesses.length})</h4>
                  </div>
                  <div className="space-y-2">
                    {/* Newly started processes */}
                    {newlyStartedProcesses.map((process) => (
                      <div key={process.id} className="border rounded-lg overflow-hidden border-teal-200 bg-teal-50/30 cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}>
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{process.name}</p>
                                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">New</Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                  {process.leaseProspectStage}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              {process.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" }) }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProcess(process) }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Process
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={(e) => {
                                  e.stopPropagation()
                                  setNewlyStartedProcesses(prev => prev.filter(p => p.id !== process.id))
                                }}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Process
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Existing in-progress processes */}
                    {leaseProspectProcesses.inProgress.map((process) => (
                      <div key={process.id} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}>
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{process.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                  {process.leaseProspectStage}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              {process.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" }) }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProcess(process) }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Process
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Process
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Processes */}
              {processStatusFilter === "upcoming" && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <h4 className="font-semibold text-foreground">Upcoming ({leaseProspectProcesses.upcoming.length})</h4>
                  </div>
                  <div className="space-y-2">
                    {leaseProspectProcesses.upcoming.map((process) => (
                      <div key={process.id} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}>
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{process.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                  {process.leaseProspectStage}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              {process.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" }) }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProcess({ ...process, startedOn: undefined }) }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Process
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Process
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Processes */}
              {processStatusFilter === "completed" && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <h4 className="font-semibold text-foreground">Completed ({leaseProspectProcesses.completed.length})</h4>
                  </div>
                  <div className="space-y-2">
                    {leaseProspectProcesses.completed.map((process) => (
                      <div key={process.id} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}>
                        <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{process.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                  {process.leaseProspectStage}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
                                <span className="text-xs text-muted-foreground">Completed: {process.completedOn}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-success/10 text-success border-success/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {process.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" }) }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditProcess(process) }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Process
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Process
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeMainTab === "tasks-docs" && (
          <div className="space-y-8">
            {/* Documents Section */}
            <div className="rounded-lg border border-border bg-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Documents ({prospectDocuments.length})</h3>
                </div>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 gap-2"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Date Shared</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospectDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.property}</TableCell>
                      <TableCell>{doc.dateShared}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-primary">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeMainTab === "audit-log" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Audit Log</h3>
            </div>

            {/* Filter Controls (UI Only - Non-functional) */}
            <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-muted/50 rounded-lg border">
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
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-44">Date & Time</TableHead>
                    <TableHead className="w-32">User</TableHead>
                    <TableHead className="w-36">Action Type</TableHead>
                    <TableHead className="w-32">Entity / Section</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-32">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospectAuditLogs.length > 0 ? (
                    prospectAuditLogs.map((log) => {
                      const isDeletedNote = log.actionType === "Deleted" && log.entity === "Notes" && "deletedNoteContent" in log
                      return (
                        <TableRow
                          key={log.id}
                          className={isDeletedNote ? "cursor-pointer hover:bg-muted/50" : ""}
                          onClick={() => {
                            if (isDeletedNote && "deletedNoteContent" in log) {
                              setSelectedDeletedNote({
                                content: log.deletedNoteContent as string,
                                deletedBy: log.deletedBy as string,
                                deletedOn: log.deletedOn as string,
                              })
                              setShowDeletedNoteModal(true)
                            }
                          }}
                        >
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
                                  ? "border-success/30 bg-success/10 text-success"
                                  : log.actionType === "Updated"
                                    ? "border-info/30 bg-info/10 text-info"
                                    : log.actionType === "Deleted"
                                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                                      : log.actionType === "Viewed"
                                        ? "border-border bg-muted/50 text-muted-foreground"
                                        : log.actionType === "Status Changed"
                                          ? "border-chart-4/30 bg-chart-4/10 text-chart-4"
                                          : "border-warning/30 bg-warning/10 text-warning"
                              }
                            >
                              {log.actionType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{log.entity}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <span>{log.description}</span>
                              {isDeletedNote && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary hover:text-primary/80">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {log.source}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No activity recorded for this lease prospect yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Start New Process Modal */}
      <Dialog open={showStartProcessModal} onOpenChange={setShowStartProcessModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-teal-600" />
              Start a New Process
            </DialogTitle>
            <DialogDescription>
              Select a process to start for this lease prospect. The process will be added to your In Progress list.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search processes..."
                value={processSearchQuery}
                onChange={(e) => setProcessSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* Process List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-200 border rounded-lg">
              {AVAILABLE_PROCESS_TYPES
                .filter(p => p.name.toLowerCase().includes(processSearchQuery.toLowerCase()))
                .map((processType) => {
                  const alreadyStarted =
                    leaseProspectProcesses.inProgress.some(p => p.name === processType.name) ||
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
              {AVAILABLE_PROCESS_TYPES.filter(p => p.name.toLowerCase().includes(processSearchQuery.toLowerCase())).length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No processes found matching your search.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals (kept from original, though many are not directly used by the new layout) */}
      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Input value={applicant.email} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Subject</Label>
              <Input placeholder="Enter subject..." className="mt-1" />
            </div>
            <div>
              <Label>Message</Label>
              <div className="mt-1 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                <Textarea
                  placeholder="Type your message..."
                  className="border-0 focus-visible:ring-0 resize-none min-h-[120px]"
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowEmailModal(false)}>
                <Send className="h-4 w-4 mr-2" /> Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SMS Modal */}
      <Dialog open={showSMSModal} onOpenChange={setShowSMSModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Input value={applicant.phone} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Message</Label>
              <div className="mt-1 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-info/20 focus-within:border-info">
                <Textarea
                  placeholder="Type your message..."
                  className="border-0 focus-visible:ring-0 resize-none min-h-[100px]"
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSMSModal(false)}>
                Cancel
              </Button>
              <Button className="bg-info hover:bg-info/90" onClick={() => setShowSMSModal(false)}>
                <Send className="h-4 w-4 mr-2" /> Send SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Log Modal */}
      <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Call With</Label>
              <Input value={applicant.name} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Call Type</Label>
              <Select defaultValue="outbound">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outbound">Outbound Call</SelectItem>
                  <SelectItem value="inbound">Inbound Call</SelectItem>
                  <SelectItem value="missed">Missed Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Call notes..." className="mt-1 min-h-[100px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCallModal(false)}>
                Cancel
              </Button>
              <Button className="bg-success hover:bg-success/90" onClick={() => setShowCallModal(false)}>
                <CheckCircle className="h-4 w-4 mr-2" /> Log Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={showMeetingModal} onOpenChange={setShowMeetingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Meeting Title</Label>
              <Input placeholder="Enter meeting title..." className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="Meeting location..." className="mt-1" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Meeting notes..." className="mt-1 min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMeetingModal(false)}>
                Cancel
              </Button>
              <Button className="bg-chart-4 hover:bg-chart-4/90" onClick={() => setShowMeetingModal(false)}>
                <Calendar className="h-4 w-4 mr-2" /> Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reassign Lead Modal */}
      <Dialog open={showReassignModal} onOpenChange={setShowReassignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Assignee</Label>
              <Input value={applicant.assignedUser || "Unassigned"} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Assign To</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nina">Nina Patel</SelectItem>
                  <SelectItem value="george">George Guraya</SelectItem>
                  <SelectItem value="sarah">Sarah Miller</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea placeholder="Reason for reassignment..." className="mt-1 min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReassignModal(false)}>
                Cancel
              </Button>
              <Button className="bg-warning hover:bg-warning/90" onClick={() => setShowReassignModal(false)}>
                <Users className="h-4 w-4 mr-2" /> Reassign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      \
      <Dialog open={showAddNoteModal} onOpenChange={setShowAddNoteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {taggedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    @{user.name}
                    <button onClick={() => removeTaggedUser(user.id)} className="hover:text-primary ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <Textarea
                placeholder="Type your note... Use @ to mention colleagues"
                value={noteText}
                onChange={handleNoteChange}
                className="min-h-[120px] resize-none"
                onKeyDown={(e) => {
                  // Handle Enter key to select mention if dropdown is visible
                  if (e.key === "Enter" && showMentionDropdown && filteredMentionUsers.length > 0) {
                    e.preventDefault()
                    handleSelectMention(filteredMentionUsers[0])
                  }
                }}
              />
              {showMentionDropdown && filteredMentionUsers.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 w-64 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                  {filteredMentionUsers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMention(member)}
                      className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Tip: Type @ to mention and notify team members</p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddNoteModal(false)
                  setNoteText("")
                  setTaggedUsers([])
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-warning hover:bg-warning/90"
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
              >
                <FileText className="h-4 w-4 mr-2" /> Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={(open) => {
        setShowUploadModal(open)
        if (!open) {
          setUploadDocData({ file: null, type: "", comments: "", assignTo: "" })
          setDragActive(false)
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Document Upload Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Document Upload <span className="text-destructive">*</span>
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive
                  ? "border-primary bg-primary/5"
                  : uploadDocData.file
                    ? "border-primary bg-primary/5/50"
                    : "border-primary/40 hover:border-primary hover:bg-muted/50"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    setUploadDocData({ ...uploadDocData, file })
                  }
                }}
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      setUploadDocData({ ...uploadDocData, file })
                    }
                  }
                  input.click()
                }}
              >
                {uploadDocData.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 text-primary" />
                    <p className="text-sm font-medium text-foreground">{uploadDocData.file.name}</p>
                    <p className="text-xs text-muted-foreground">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Drag and drop your file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-2">Accepted formats: PDF, DOC, JPG, PNG</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assign To and Document Type - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assign To - Left */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Assign To <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                  value={uploadDocData.assignTo}
                  onValueChange={(value) => setUploadDocData({ ...uploadDocData, assignTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_LIST.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 bg-primary/15 text-primary border border-primary/30">
                            <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
                              {staff.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{staff.name}</span>
                          <span className="text-muted-foreground">– {staff.role}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Type - Right */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Document Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={uploadDocData.type}
                  onValueChange={(value) => setUploadDocData({ ...uploadDocData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID Document</SelectItem>
                    <SelectItem value="income">Income Verification</SelectItem>
                    <SelectItem value="employment">Employment Letter</SelectItem>
                    <SelectItem value="reference">Reference Letter</SelectItem>
                    <SelectItem value="lease">Lease Agreement</SelectItem>
                    <SelectItem value="application">Application Form</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comments (Optional) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Comments <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Textarea
                placeholder="Add notes or context for this document..."
                value={uploadDocData.comments}
                onChange={(e) => setUploadDocData({ ...uploadDocData, comments: e.target.value })}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadModal(false)
                setUploadDocData({ file: null, type: "", comments: "", assignTo: "" })
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setShowUploadModal(false)
                setUploadDocData({ file: null, type: "", comments: "", assignTo: "" })
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewTaskModal} onOpenChange={(open) => {
        setShowNewTaskModal(open)
        if (!open) {
          setTaskProperty("")
          setTaskUnit("")
          setTaskAssignTo("")
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Task Title</Label>
              <Input placeholder="Enter task title..." className="mt-1" />
            </div>
            <div>
              <Label>Property</Label>
              <Select
                value={taskProperty}
                onValueChange={(value) => {
                  setTaskProperty(value)
                  setTaskUnit("")
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select property..." />
                </SelectTrigger>
                <SelectContent>
                  {interestedProperties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.name}>
                      {prop.name} - {prop.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Unit Selection - Conditional */}
            {taskProperty && (
              <div>
                <Label>Unit</Label>
                {prospectPropertyUnits[taskProperty]?.length > 0 ? (
                  <Select value={taskUnit} onValueChange={setTaskUnit}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {prospectPropertyUnits[taskProperty].map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={interestedProperties.find((p) => p.name === taskProperty)?.unit || "Single Unit Property"}
                    disabled
                    className="mt-1 bg-muted"
                  />
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Assign To - Staff Assignment */}
            <div>
              <Label>
                Assign To <span className="text-destructive">*</span>
              </Label>
              <Select value={taskAssignTo} onValueChange={setTaskAssignTo}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select staff member..." />
                </SelectTrigger>
                <SelectContent>
                  {prospectTaskStaffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} – {staff.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter task description..." className="mt-1 min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowNewTaskModal(false)}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewTaskModal} onOpenChange={setShowViewTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View/Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label>Task Title</Label>
                <Input defaultValue={selectedTask.task} className="mt-1" />
              </div>
              <div>
                <Label>Property</Label>
                <Select defaultValue={selectedTask.property}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interestedProperties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.name}>
                        {prop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" defaultValue="2026-01-10" className="mt-1" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select defaultValue={selectedTask.priority.toLowerCase()}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select defaultValue={selectedTask.status.toLowerCase().replace(" ", "-")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea defaultValue={selectedTask.description} className="mt-1 min-h-[80px]" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowViewTaskModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowViewTaskModal(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRequestDocModal} onOpenChange={setShowRequestDocModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Document Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select document type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Rental Application</SelectItem>
                  <SelectItem value="income">Proof of Income</SelectItem>
                  <SelectItem value="id">ID Verification</SelectItem>
                  <SelectItem value="employment">Employment Letter</SelectItem>
                  <SelectItem value="reference">Reference Letter</SelectItem>
                  <SelectItem value="bank">Bank Statement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Property</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select property..." />
                </SelectTrigger>
                <SelectContent>
                  {interestedProperties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.name}>
                      {prop.name} - {prop.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Add any notes for the prospect..." className="mt-1 min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRequestDocModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowRequestDocModal(false)}>
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddPropertyModal} onOpenChange={setShowAddPropertyModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Property to Interest List</DialogTitle>
            <DialogDescription>Search and select a property to add to this prospect's interest list.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties by name or address..."
                value={propertySearchQuery}
                onChange={(e) => setPropertySearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {availablePropertiesToAdd.length > 0 ? (
                availablePropertiesToAdd.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleAddProperty(property)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${property.image || "/modern-city-apartment.png"})`,
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{property.name}</h4>
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-primary font-medium">
                            ${property.rent.toLocaleString()}/mo
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {property.bedrooms} bed • {property.bathrooms} bath
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              property.status === "Available"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20"
                            }
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No properties found matching your search.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPropertyModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinalizeConfirmModal} onOpenChange={setShowFinalizeConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Confirm Final Property Selection
            </DialogTitle>
            <DialogDescription>
              This will mark the selected property as the final choice for this prospect.
            </DialogDescription>
          </DialogHeader>
          {propertyToFinalize && (
            <div className="py-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${propertyToFinalize.image || "/modern-city-apartment.png"})`,
                    }}
                  />
                  <div>
                    <h4 className="font-semibold">{propertyToFinalize.name}</h4>
                    <p className="text-sm text-muted-foreground">{propertyToFinalize.address}</p>
                    <p className="text-sm text-primary font-medium">{propertyToFinalize.unit}</p>
                    <p className="text-sm font-medium mt-1">${propertyToFinalize.rent.toLocaleString()}/month</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">
                      Important: This action will convert the prospect to a tenant
                    </p>
                    <p className="text-sm text-warning/80 mt-1">
                      Once confirmed, {lead.name} will be moved to the Tenants section under Contacts menu with this
                      property assigned to them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinalizeConfirmModal(false)}>
              Cancel
            </Button>
            <Button className="bg-success hover:bg-success/90" onClick={handleConfirmFinalize}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm & Convert to Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deleted Note View Modal */}
      <Dialog open={showDeletedNoteModal} onOpenChange={setShowDeletedNoteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Deleted Note
            </DialogTitle>
            <DialogDescription>
              This note was removed from the record. The content is shown below for audit purposes.
            </DialogDescription>
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
          setSelectedSMSActivity(null)
        }}
        contactName={selectedSMSActivity?.target || lead?.name || ""}
        contactPhone={selectedSMSActivity?.targetPhone || lead?.phone || ""}
        currentMessage={selectedSMSActivity?.fullMessage || selectedSMSActivity?.message || ""}
        currentTimestamp={selectedSMSActivity?.timestamp || ""}
      />

      {/* Email Popup Modal */}
      <EmailPopupModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false)
          setSelectedEmailActivity(null)
        }}
        contactName={selectedEmailActivity?.target || lead?.name || ""}
        contactEmail={lead?.email || "contact@example.com"}
        currentSubject={(selectedEmailActivity as { emailSubject?: string } | null)?.emailSubject ?? "Property Inquiry"}
        currentBody={selectedEmailActivity?.fullMessage || selectedEmailActivity?.message || ""}
        currentTimestamp={selectedEmailActivity?.timestamp || ""}
      />

      {/* Communication Thread Modal */}
      <Dialog open={showThreadModal} onOpenChange={setShowThreadModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              Communication Thread with {lead?.name || "Contact"}
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
              const isFromProspect = item.user === lead?.name

              return (
                <div key={item.id} className="space-y-2">
                  {/* SMS Item */}
                  {isSMS && (
                    <div className={`flex ${isFromProspect ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${isFromProspect
                          ? "bg-slate-100 border border-slate-200"
                          : "bg-teal-50 border border-teal-200"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-medium text-teal-700">SMS</span>
                          <span className="text-xs text-muted-foreground">
                            {isFromProspect ? "Received" : "Sent"}
                          </span>
                        </div>
                        <p className="text-sm">{item.fullMessage || item.message}</p>
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
                        </div>
                        <p className="text-sm">{item.message}</p>
                        {item.callNotes && (
                          <details className="mt-2">
                            <summary className="text-xs text-green-600 cursor-pointer hover:underline">
                              View call notes
                            </summary>
                            <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap border-t border-green-200 pt-2">
                              {item.callNotes}
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
                    <div className={`flex ${isFromProspect ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[90%] rounded-lg border ${isFromProspect
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
                                {isFromProspect ? "Received" : "Sent"}
                              </span>
                            </div>
                            {expandedEmails.includes(`thread-${item.id}`) ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1">
                            {item.emailThread?.[0]?.subject || (item as { emailSubject?: string }).emailSubject || "No Subject"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            From: {item.user} • {item.timestamp}
                          </p>
                        </div>

                        {/* Email Body - Expanded */}
                        {expandedEmails.includes(`thread-${item.id}`) && (
                          <div className="border-t border-blue-200 p-3 space-y-3">
                            {item.emailThread ? (
                              item.emailThread.map((email, idx) => (
                                <div key={email.id} className={idx > 0 ? "border-t border-blue-100 pt-3" : ""}>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <span>From: {email.from} ({email.fromEmail})</span>
                                    <span>{email.timestamp}</span>
                                  </div>
                                  <p className="text-sm whitespace-pre-wrap">{email.content}</p>

                                  {/* Email Opens (only for sent emails) */}
                                  {(() => {
                                    const opens = (email as unknown as { emailOpens?: { openedAt: string }[] }).emailOpens
                                    if (!opens?.length) return null
                                    return (
                                      <div className="mt-2 pt-2 border-t border-blue-100">
                                        <p className="text-xs text-amber-600 flex items-center gap-1">
                                          <Eye className="h-3 w-3" />
                                          Opened: {opens.map((o, i) => (
                                            <span key={i}>
                                              {o.openedAt}{i < opens.length - 1 ? ", " : ""}
                                            </span>
                                          ))}
                                        </p>
                                      </div>
                                    )
                                  })()}

                                  {/* Attachments */}
                                  {idx === 0 && (
                                    <div className="mt-2 pt-2 border-t border-blue-100">
                                      <div className="flex items-center gap-2">
                                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          Attachments: Application_Form.pdf (180 KB), ID_Document.jpg (95 KB)
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div>
                                <p className="text-sm whitespace-pre-wrap">{item.fullMessage || item.message}</p>
                                <div className="mt-2 pt-2 border-t border-blue-100">
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      Attachments: Application_Form.pdf (180 KB)
                                    </span>
                                  </div>
                                </div>
                              </div>
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
                  <input type="text" value={lead?.email || "contact@example.com"} readOnly className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700" />
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
                  className="bg-teal-600 hover:bg-teal-700 h-10"
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

      {/* Generate New Code Dialog (ShowMojo) */}
      <Dialog open={showGenerateCodeDialog} onOpenChange={setShowGenerateCodeDialog}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-4 pb-3 border-b border-border">
            <DialogTitle className="text-base font-semibold">Access Information</DialogTitle>
            <DialogDescription className="sr-only">Generate a new ShowMojo access code</DialogDescription>
          </DialogHeader>

          <div className="px-5 py-5 space-y-5">
            {/* ShowMojo Code Selected */}
            <div className="flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-green-600" />
              </div>
              <span className="text-sm font-medium text-foreground">ShowMojo Code</span>
            </div>

            <div className="pl-6 space-y-4">
              {/* One-time-use code link */}
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Get a one-time-use code (in EST)
              </button>

              {/* Other access options */}
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Other access options</label>
                <select
                  value={showmojoAccessOption}
                  onChange={(e) => setShowmojoAccessOption(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {showmojoAccessOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Get a code for date */}
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Get a code (in EST) for</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={showmojoCodeDate}
                    onChange={(e) => setShowmojoCodeDate(e.target.value)}
                    className="text-sm h-10 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Clear All Access Codes link */}
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Clear All Access Codes
              </button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenerateCodeDialog(false)}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowGenerateCodeDialog(false)}
            >
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Access Information Share Links Dialog */}
      <Dialog open={showShareLinksDialog} onOpenChange={setShowShareLinksDialog}>
        <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
            <DialogTitle className="text-base font-semibold">Share Links</DialogTitle>
            <DialogDescription className="sr-only">
              Select recipients and method to share {shareLinksType === "lockbox" ? "Lockbox Code" : "ShowMojo Code"}
            </DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Email To Section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                Email To:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {shareRecipientOptions.map(({ id, label, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleShareLinkRecipientToggle(id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border transition-all text-left ${shareLinkRecipients[id]
                      ? "border-green-500/40 bg-green-50 shadow-sm"
                      : "border-border bg-white hover:border-muted-foreground/20 hover:bg-muted/30"
                      }`}
                  >
                    <div className={`h-7 w-7 rounded-full ${color} flex items-center justify-center shrink-0`}>
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm text-foreground truncate flex-1">{label}</span>
                    <Checkbox
                      checked={shareLinkRecipients[id]}
                      onCheckedChange={() => handleShareLinkRecipientToggle(id)}
                      className="shrink-0 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Email/SMS Toggle Section */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="share-email"
                checked={shareLinkMethod.email}
                onCheckedChange={() => handleShareLinkMethodToggle("email")}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <button
                type="button"
                onClick={() => handleShareLinkMethodToggle("email")}
                className="text-sm text-foreground"
              >
                Email
              </button>

              <Checkbox
                id="share-sms"
                checked={shareLinkMethod.sms}
                onCheckedChange={() => handleShareLinkMethodToggle("sms")}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <button
                type="button"
                onClick={() => handleShareLinkMethodToggle("sms")}
                className="text-sm text-foreground"
              >
                SMS
              </button>
            </div>

            {/* Message Box */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
                Message
              </p>
              <Textarea
                value={shareLinkMessage}
                onChange={(e) => setShareLinkMessage(e.target.value)}
                placeholder={`Include a short message with the ${shareLinksType === "lockbox" ? "lockbox code" : "ShowMojo link"}...`}
                className="min-h-[100px] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareLinksDialog(false)}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSendShareLink}
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Custom Field Modal */}
      <Dialog open={showAddCustomFieldModal} onOpenChange={setShowAddCustomFieldModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Plus className="h-5 w-5 text-teal-600" />
              Add Custom Field
            </DialogTitle>
            <DialogDescription>
              Add a new custom field to the {customFieldData.section} section. All custom fields are available for
              reporting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Section</Label>
              <Select
                value={customFieldData.section}
                onValueChange={(value) => setCustomFieldData({ ...customFieldData, section: value })}
              >
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Federal Tax">Federal Tax</SelectItem>
                  <SelectItem value="Property Info">Property Info</SelectItem>
                  <SelectItem value="Tenant Info">Tenant Info</SelectItem>
                  <SelectItem value="Contact Info">Contact Info</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field Name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Field Name</Label>
              <Input
                placeholder="Enter field name..."
                value={customFieldData.fieldName}
                onChange={(e) => setCustomFieldData({ ...customFieldData, fieldName: e.target.value })}
              />
            </div>

            {/* Field Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Field Type</Label>
              <Select
                value={customFieldData.fieldType}
                onValueChange={(value) => setCustomFieldData({ ...customFieldData, fieldType: value })}
              >
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="Number">Number</SelectItem>
                  <SelectItem value="Date">Date</SelectItem>
                  <SelectItem value="Dropdown">Dropdown</SelectItem>
                  <SelectItem value="Checkbox">Checkbox</SelectItem>
                  <SelectItem value="Currency">Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Required Field Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium text-sm">Required Field</div>
                <div className="text-xs text-muted-foreground">Mark this field as mandatory</div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setCustomFieldData({ ...customFieldData, isRequired: !customFieldData.isRequired })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${customFieldData.isRequired ? "bg-teal-600" : "bg-gray-200"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${customFieldData.isRequired ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-blue-700">
                This field will be available in Owner Directory reports
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCustomFieldModal(false)
                setCustomFieldData({ section: "Federal Tax", fieldName: "", fieldType: "Text", isRequired: false })
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                // Handle adding the custom field (UI-only for now)
                setShowAddCustomFieldModal(false)
                setCustomFieldData({ section: "Federal Tax", fieldName: "", fieldType: "Text", isRequired: false })
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Link Dialog */}
      <Dialog open={showShareDialog} onOpenChange={(open) => { if (!open) { setShowShareDialog(false); setShareConfirmed(false); setShareRecipient(""); } }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-teal-600" />
              Share {shareLinkLabel}
            </DialogTitle>
            <DialogDescription>
              {shareConfirmed
                ? "The link has been shared successfully."
                : shareLinkType === "choose-recipient"
                  ? "Select who you would like to share this link with."
                  : `This link will be sent to the Lease Prospect.`}
            </DialogDescription>
          </DialogHeader>

          {/* Prospect-only links (Application, Showing, Access, Rental Comps) */}
          {shareLinkType === "prospect-only" && !shareConfirmed && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                The <span className="font-medium text-foreground">{shareLinkLabel}</span> will be sent to <span className="font-medium text-foreground">{lead.name}</span> (Lease Prospect).
              </p>
            </div>
          )}

          {/* Matterport Scan - choose recipient */}
          {shareLinkType === "choose-recipient" && !shareConfirmed && (
            <div className="py-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                Share the <span className="font-medium text-foreground">{shareLinkLabel}</span> with:
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmShare("prospect")}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-teal-300 hover:bg-teal-50/50 transition-colors text-left"
                >
                  <User className="h-4 w-4 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium">Lease Prospect</p>
                    <p className="text-xs text-muted-foreground">{lead.name}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmShare("owner")}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-teal-300 hover:bg-teal-50/50 transition-colors text-left"
                >
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Owner</p>
                    <p className="text-xs text-muted-foreground">Property Owner</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmShare("both")}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-teal-300 hover:bg-teal-50/50 transition-colors text-left"
                >
                  <Users className="h-4 w-4 text-violet-600" />
                  <div>
                    <p className="text-sm font-medium">Both</p>
                    <p className="text-xs text-muted-foreground">Send to both Lease Prospect and Owner</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Confirmation state */}
          {shareConfirmed && (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-center text-foreground">
                {shareLinkType === "choose-recipient" ? (
                  <>
                    The <span className="font-medium">{shareLinkLabel}</span> has been sent to{" "}
                    <span className="font-medium">
                      {shareRecipient === "prospect" ? `${lead.name} (Lease Prospect)` :
                        shareRecipient === "owner" ? "the Owner" :
                          `${lead.name} (Lease Prospect) and the Owner`}
                    </span>.
                  </>
                ) : (
                  <>
                    The <span className="font-medium">{shareLinkLabel}</span> has been sent to{" "}
                    <span className="font-medium">{lead.name}</span> (Lease Prospect).
                  </>
                )}
              </p>
            </div>
          )}

          <DialogFooter>
            {shareConfirmed ? (
              <Button onClick={() => { setShowShareDialog(false); setShareConfirmed(false); setShareRecipient(""); }}>
                Done
              </Button>
            ) : shareLinkType === "prospect-only" ? (
              <>
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleConfirmShare()} className="bg-teal-600 hover:bg-teal-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Link
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TenantApplicationDetailView
