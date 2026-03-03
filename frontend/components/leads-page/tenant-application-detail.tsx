"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { SMSPopupModal } from "@/components/sms-popup-modal"
import { EmailPopupModal } from "@/components/email-popup-modal"
import { useNav } from "@/app/dashboard/page"

// Pipeline stages with colors (13-step lifecycle)
const STAGES = [
  "Attempting to Contact (Call / Email / Message)",
  "Scheduled Showing",
  "No Show - Prospect",
  "Showing Agent - No Show",
  "Showing Completed - Awaiting Feedback",
  "Interested - Application Sent",
  "Application Received - Under Review",
  "Application Approved - Lease Sent",
  "Lease Signed - Schedule Move In",
  "Move In - Completed and Feedback",
  "Not Interested / Disliked Property",
  "Application Rejected",
  "Tenant - Lost or Backed Out",
]

const getStageColor = (index: number) => {
  const colors = [
    "bg-info",
    "bg-warning",
    "bg-warning",
    "bg-chart-4",
    "bg-primary",
    "bg-success",
    "bg-destructive",
  ]
  return colors[index] || "bg-muted"
}

// Available process types to start (from Operations > Processes)
const AVAILABLE_PROCESS_TYPES = [
  { id: "apt-1", name: "2 Property Onboarding Process", stages: 7 },
  { id: "apt-2", name: "Accounting Mistakes", stages: 4 },
  { id: "apt-3", name: "Applications screening process", stages: 11 },
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

// Stage progress bar colors (13 cubes: 1 amber, 9 greens, 3 reds)
const STAGE_PROGRESS_COLORS = [
  "rgb(235, 186, 93)",  // Cube 1  - Warm golden-amber
  "#D5F5E3",            // Cube 2  - Lightest green
  "#ABEBC6",            // Cube 3  - Very light green
  "#82E0AA",            // Cube 4  - Light green
  "#58D68D",            // Cube 5  - Light-medium green
  "#2ECC71",            // Cube 6  - Medium green
  "#27AE60",            // Cube 7  - Medium-dark green
  "#1E8449",            // Cube 8  - Dark green
  "#196F3D",            // Cube 9  - Darker green
  "#145A32",            // Cube 10 - Darkest green
  "#F5918A",            // Cube 11 - Lightest red
  "#E74C3C",            // Cube 12 - Medium red
  "#B71C1C",            // Cube 13 - Darkest red
]

// Map legacy stage names to new 13-step indices
const LEGACY_STAGE_MAP: Record<string, number> = {
  "new lead": 0,
  "new prospects": 0,
  "attempting to contact": 0,
  "scheduled intro call": 1,
  "scheduled showing": 1,
  "working": 4,
  "under review": 6,
  "closing": 8,
  "new client": 9,
  "lost": 12,
  "disqualified": 12,
  "application approved – lease sent": 7,
  "application approved - lease sent": 7,
}

const resolveStageIndex = (stageName: string): number => {
  // First try exact match against new STAGES
  const exactIndex = STAGES.findIndex((s) => s.toLowerCase() === stageName.toLowerCase())
  if (exactIndex >= 0) return exactIndex
  // Then try legacy mapping
  const legacyIndex = LEGACY_STAGE_MAP[stageName.toLowerCase()]
  if (legacyIndex !== undefined) return legacyIndex
  return 0
}

const STAFF_LIST = [
  { id: "1", name: "Richard Surovi", initials: "RS", role: "Lead Agent", department: "Sales" },
  { id: "2", name: "Sarah Johnson", initials: "SJ", role: "Property Manager", department: "Property Management" },
  { id: "3", name: "Michael Chen", initials: "MC", role: "Sales Associate", department: "Sales" },
  { id: "4", name: "Emily Davis", initials: "ED", role: "Leasing Agent", department: "Leasing" },
  { id: "5", name: "James Wilson", initials: "JW", role: "Marketing Specialist", department: "Marketing" },
  { id: "6", name: "Nina Patel", initials: "NP", role: "Accountant", department: "Accounting" },
  { id: "7", name: "Laura Taylor", initials: "LT", role: "Senior Accountant", department: "Accounting" },
  { id: "8", name: "David Brown", initials: "DB", role: "Maintenance Lead", department: "Maintenance" },
]

const DEPARTMENTS = ["Sales", "Accounting", "Property Management", "Leasing", "Marketing", "Maintenance"]

// Generate activities data for the prospect
const getActivitiesData = (prospectName: string, prospectPhone: string, prospectEmail: string) => [
  {
    id: 1,
    type: "sms",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "texted",
    target: prospectName,
    targetPhone: prospectPhone,
    message: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out of future messages.",
    fullMessage: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out of future messages.",
    timestamp: "12/4/2025, 12:24 PM",
    isNote: false,
    isRead: true,
  },
  {
    id: 2,
    type: "sms",
    user: prospectName,
    userInitials: prospectName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    phone: prospectPhone,
    action: "texted",
    target: "Richard Surovi",
    targetPhone: "(216) 810-2564",
    message: "Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon.",
    fullMessage: `Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon. I appreciate your patience and will reach out once I've made a decision. Best regards, ${prospectName.split(" ")[0]}`,
    timestamp: "12/4/2025, 12:22 PM",
    isNote: false,
    isRead: false,
  },
  {
    id: 3,
    type: "note",
    user: "Richard Surovi",
    userInitials: "RS",
    action: "left a Note",
    message: "Sent text",
    timestamp: "12/4/2025, 11:46 AM",
    isNote: true,
    isRead: true,
  },
  {
    id: 4,
    type: "call",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "called",
    target: prospectName,
    targetPhone: prospectPhone,
    message: "Left voicemail about property management services. Call lasted 2 minutes.",
    callNotes: `Called to follow up on rental inquiry. Prospect was not available, left voicemail about available units and scheduling a viewing. ${prospectName} is interested in a 2-bedroom unit. Call duration: 2 minutes 34 seconds.`,
    appfolioLink: "https://appfolio.com/calls/recording/abc123xyz",
    timestamp: "12/4/2025, 10:30 AM",
    isNote: false,
    isRead: true,
  },
  {
    id: 5,
    type: "sms",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "texted",
    target: prospectName,
    targetPhone: prospectPhone,
    message: `Hi ${prospectName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday, indicating that if you w...`,
    fullMessage: `Hi ${prospectName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday, indicating that if you would like to schedule a tour of the available units, I'm available anytime. We have great options that match your requirements. Please let me know if you'd like to schedule a viewing.`,
    timestamp: "11/29/2025, 9:50 PM",
    isNote: false,
    isRead: true,
  },
  {
    id: 6,
    type: "email",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "",
    action: "emailed",
    target: prospectName,
    targetPhone: prospectEmail,
    message: "Sent follow-up email regarding property management proposal and pricing details.",
    timestamp: "11/28/2025, 3:15 PM",
    isNote: false,
    isRead: true,
    emailThread: [
      {
        id: "e1",
        from: "Richard Surovi",
        fromEmail: "richard@b2bpm.com",
        to: prospectName,
        toEmail: prospectEmail,
        subject: "Available Units - B2B Property Management",
        content: `Hi ${prospectName.split(" ")[0]},\n\nThank you for your interest in our available rental units.\n\nAs discussed, here are some options that match your requirements:\n- 2BR/2BA at Oak Street - $1,800/month\n- 2BR/1BA at Maple Ave - $1,650/month\n- 3BR/2BA at Pine Lane - $2,100/month\n\nAll units include water and trash. Let me know if you'd like to schedule a viewing.\n\nBest regards,\nRichard Surovi\nB2B Property Management`,
        timestamp: "11/28/2025, 3:15 PM",
        isFromMe: true,
      },
      {
        id: "e2",
        from: prospectName,
        fromEmail: prospectEmail,
        to: "Richard Surovi",
        toEmail: "richard@b2bpm.com",
        subject: "RE: Available Units - B2B Property Management",
        content: `Hi Richard,\n\nThank you for sending this over. I'm interested in the 2BR/2BA at Oak Street.\n\nA few questions:\n1. Is there parking available?\n2. What's the lease term?\n3. When can I schedule a viewing?\n\nLooking forward to hearing from you.\n\n${prospectName.split(" ")[0]}`,
        timestamp: "11/29/2025, 10:30 AM",
        isFromMe: false,
      },
      {
        id: "e3",
        from: "Richard Surovi",
        fromEmail: "richard@b2bpm.com",
        to: prospectName,
        toEmail: prospectEmail,
        subject: "RE: Available Units - B2B Property Management",
        content: `Hi ${prospectName.split(" ")[0]},\n\nGreat choice! Here are the answers:\n\n1. Yes, one covered parking spot is included, additional spots are $50/month.\n\n2. Standard lease term is 12 months, but we can discuss shorter terms.\n\n3. I'm available tomorrow at 2pm or Thursday at 10am for a viewing.\n\nLet me know what works for you!\n\nBest,\nRichard`,
        timestamp: "11/29/2025, 2:45 PM",
        isFromMe: true,
      },
    ],
  },
  {
    id: 7,
    type: "call",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "called",
    target: prospectName,
    targetPhone: prospectPhone,
    message: "Initial discovery call - discussed property portfolio and management needs.",
    callNotes: `Initial discovery call with prospect ${prospectName}.\n\nKey Points Discussed:\n- Looking for 2-bedroom apartment\n- Preferred move-in date: First week of next month\n- Budget: $1,500-$2,000/month\n- Requirements: Pet-friendly, in-unit laundry preferred\n- Current situation: Lease ending at current place\n\nNext Steps:\n- Send available listings by end of day\n- Schedule viewing for this weekend\n\nCall duration: 12 minutes 18 seconds`,
    appfolioLink: "https://appfolio.com/calls/recording/def456uvw",
    timestamp: "11/25/2025, 11:00 AM",
    isNote: false,
    isRead: true,
  },
  // Group Chat Communications
  {
    id: 8,
    type: "sms",
    user: "Nina Patel",
    userInitials: "NP",
    phone: "(216) 555-1234",
    action: "texted",
    target: "Leasing Team",
    targetPhone: "",
    message: "Team, we have a new prospect interested in the Oak Street 2BR. Can we coordinate availability for showings?",
    fullMessage: "Team, we have a new prospect interested in the Oak Street 2BR. Can we coordinate availability for showings this week?",
    timestamp: "12/6/2025, 10:00 AM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", prospectName],
    unreadCount: 3,
  },
  {
    id: 9,
    type: "sms",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "texted",
    target: "Leasing Team",
    targetPhone: "",
    message: "I'm available Tuesday and Thursday afternoon for showings.",
    fullMessage: "I'm available Tuesday and Thursday afternoon for showings. Let me know what works best.",
    timestamp: "12/6/2025, 10:15 AM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", prospectName],
    unreadCount: 0,
  },
  {
    id: 10,
    type: "email",
    user: "Sarah Johnson",
    userInitials: "SJ",
    phone: "",
    action: "emailed",
    target: "Leasing Team",
    targetPhone: "",
    message: "Prospect Application Review - Action Items for scheduling and verification.",
    timestamp: "12/5/2025, 3:30 PM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Sarah Johnson", "Richard Surovi", "Nina Patel", prospectName],
    unreadCount: 8,
    emailThread: [
      {
        id: "g1",
        from: "Sarah Johnson",
        fromEmail: "sarah@b2bpm.com",
        to: "Leasing Team",
        toEmail: "leasing@b2bpm.com",
        subject: "Prospect Application Review - Action Items",
        content: `Hi team,\n\nFollowing up on the new prospect application. Here are the action items:\n\n1. Richard - Schedule showing for the Oak Street unit\n2. Nina - Process background check\n3. Verify employment and previous landlord references\n\n${prospectName} is looking to move in by the first week of next month, so let's prioritize this.\n\nThanks,\nSarah`,
        timestamp: "12/5/2025, 3:30 PM",
        isFromMe: false,
      },
    ],
  },
  {
    id: 11,
    type: "sms",
    user: prospectName,
    userInitials: prospectName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    phone: prospectPhone,
    action: "texted",
    target: "Leasing Team",
    targetPhone: "",
    message: "Thanks for the update everyone. Thursday at 2pm works great for me.",
    fullMessage: "Thanks for the update everyone. Thursday at 2pm works great for me. Looking forward to seeing the unit!",
    timestamp: "12/6/2025, 11:30 AM",
    isNote: false,
    isRead: false,
    isGroupChat: true,
    groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", prospectName],
    unreadCount: 2,
  },
  {
    id: 12,
    type: "email",
    user: "Mike Davis",
    userInitials: "MD",
    phone: "",
    action: "emailed",
    target: "Unit Preparation Group",
    targetPhone: "",
    message: "Unit turnover coordination for the prospect's potential move-in.",
    timestamp: "12/4/2025, 2:00 PM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Mike Davis", "Richard Surovi", "Cleaning Services", prospectName],
    unreadCount: 0,
    emailThread: [
      {
        id: "g2",
        from: "Mike Davis",
        fromEmail: "mike@b2bpm.com",
        to: "Unit Preparation Group",
        toEmail: "maintenance@b2bpm.com",
        subject: "Re: Oak Street Unit Turnover - Coordination",
        content: `Team,\n\nThe cleaning crew has confirmed availability for the Oak Street unit. Schedule:\n- Deep clean: Monday 9 AM - 1 PM\n- Touch-up paint: Monday 2 PM\n- Final inspection: Tuesday 10 AM\n\n${prospectName}, the unit will be ready for your viewing on Thursday.\n\nBest,\nMike`,
        timestamp: "12/4/2025, 2:00 PM",
        isFromMe: false,
      },
    ],
  },
]

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
  const [taggedUsers, setTaggedUsers] = useState<typeof STAFF_LIST>([])
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionFilter, setMentionFilter] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [assignedTeam, setAssignedTeam] = useState([STAFF_LIST[0]])
  const [teamPopoverOpen, setTeamPopoverOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  
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

  // Share link dialog state
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
      (a) => !a.isGroupChat && !a.isNote && (a.type === "sms" || a.type === "email" || a.type === "call")
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

  const handleSelectMention = (member: (typeof STAFF_LIST)[0]) => {
    const textBeforeCursor = noteText.substring(0, cursorPosition)
    const atIndex = textBeforeCursor.lastIndexOf("@")
    const textAfterCursor = noteText.substring(cursorPosition)

    const newText = noteText.substring(0, atIndex) + `@${member.name} ` + textAfterCursor
    setNoteText(newText)

    if (!taggedUsers.find((u) => u.id === member.id)) {
      setTaggedUsers([...taggedUsers, member])
    }

    setShowMentionDropdown(false)
    setMentionFilter("")
  }

  const removeTaggedUser = (userId: number) => {
    setTaggedUsers(taggedUsers.filter((u) => u.id !== userId))
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
    (member) => member.name.toLowerCase().includes(mentionFilter) && !taggedUsers.find((u) => u.id === member.id),
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
                  className={`rounded-lg border transition-all cursor-pointer ${
                    expandedThreadMessage === email.id
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

  // Existing Applicant Data (kept for structure if needed, but new logic uses lead prop)
  const [applicant] = useState({
    name: "Diana Prince",
    type: "Financially Responsible",
    phone: "9876543210",
    email: "dprince@mail.com",
    status: "Decision Pending",
    unit: "8 SH - 3 - 8",
    listingStatus: "Not Posted",
    vacantOn: "Not Vacant",
    desiredMoveIn: "12/01/2025",
    screeningStatus: "Not Done",
    assignedUser: "--",
    receivedDate: "11/18/2025 12:34 AM",
    receivedBy: "George Guraya",
    residentialHistory: "almost 45 years provided",
    totalMonthlyIncome: "None provided",
    dependents: "No",
    pets: "No",
    attachments: "No",
    dob: "09/04/1995",
    ssn: "XXX-XX-9854",
    governmentId: "--",
    issuingState: "--",
  })

  const [residentialHistory] = useState({
    occupancyType: "Owner",
    currentAddress: "1234 Elm Street Springfield\nSpringfield, IL 62704",
    resided: "From February 1981 to Present",
    monthlyPayment: "--",
    landlord: "N/A - Owner at this address",
    reasonForLeaving: "--",
  })

  const [bankAccounts] = useState([
    { name: "John brown", type: "Savings", accountNumber: "22990015090090448", balance: "50,000.00" },
  ])

  const [creditCards] = useState([{ issuer: "American Bank", balance: "100,000.00" }])

  const auditLog = [
    { date: "11/18/2025 12:34 AM", action: "Changed Status from New to Decision Pending", by: "George Guraya" },
    { date: "11/18/2025 12:34 AM", action: "Created Rental Application for Diana Prince", by: "George Guraya" },
  ]

  // Keeping recentMessages for comparison, but new logic uses ACTIVITIES_DATA
  const recentMessages = [
    {
      id: 1,
      type: "sms",
      sender: "Diana Prince",
      senderType: "prospect", // Added senderType field to distinguish between prospect and staff
      message: "Thank you for the update on the application...",
      time: "2h ago",
    },
    {
      id: 2,
      type: "email",
      sender: "Diana Prince",
      senderType: "prospect", // Added senderType field
      message: "RE: Application Status - I have reviewed the charges and...",
      time: "1d ago",
    },
    {
      id: 3,
      type: "call",
      sender: "Nina Patel",
      senderType: "staff", // Added senderType field to identify staff messages
      message: "Discussed document requirements for the application",
      time: "3d ago",
    },
    {
      id: 4,
      type: "sms",
      sender: "Diana Prince",
      senderType: "prospect", // Added senderType field
      message: "Can I schedule a viewing for next week?",
      time: "5d ago",
    },
  ]

  // Tabs definition (might be replaced by new structure)
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "background", label: "Background & Screening" },
    { id: "financial", label: "Financial" },
    { id: "household", label: "Household" },
    { id: "activity", label: "Activity & History" },
  ]

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

  const ALL_AVAILABLE_PROPERTIES = [
    {
      id: 1,
      name: "Sunset Apartments",
      address: "1234 Sunset Blvd, Los Angeles, CA 90028",
      type: "Multi Family",
      bedrooms: 2,
      bathrooms: 1,
      sqft: 950,
      rent: 2400,
      available: "Available Now",
      unit: "Unit 12B",
      image: "/sunset-apartment-building.jpg",
      amenities: ["Pool", "Gym", "Parking"],
      ownerName: "Emma Wilson",
      deposit: 2400,
      status: "Available",
    },
    {
      id: 2,
      name: "Oakwood Residence",
      address: "567 Oak Street, San Francisco, CA 94102",
      type: "Multi Family",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 750,
      rent: 2100,
      available: "Available 02/01",
      unit: "Unit 3A",
      image: "/oakwood-residence-building.jpg",
      amenities: ["Laundry", "Parking", "Pet Friendly"],
      ownerName: "Sarah Lee",
      deposit: 2100,
      status: "Pending",
    },
    {
      id: 3,
      name: "Metro Plaza",
      address: "456 Metro Blvd, Portland, OR 97201",
      type: "Multi Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1050,
      rent: 2600,
      available: "Available Now",
      unit: "Unit 507",
      image: "/metro-plaza-apartment.jpg",
      amenities: ["Gym", "Rooftop", "Concierge"],
      ownerName: "Sarah Lee",
      deposit: 2600,
      status: "Available",
    },
    {
      id: 4,
      name: "Harbor View Complex",
      address: "321 Harbor Dr, San Diego, CA 92101",
      type: "Multi Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      rent: 2800,
      available: "Available Now",
      unit: "Unit 405",
      image: "/modern-apartment-building-harbor-view.jpg",
      amenities: ["Pool", "Gym", "Parking", "Laundry"],
      ownerName: "Emma Wilson",
      deposit: 2800,
      status: "Available",
    },
    {
      id: 5,
      name: "Riverside Apartments",
      address: "789 River Rd, Austin, TX 78701",
      type: "Multi Family",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1400,
      rent: 3200,
      available: "Available 01/15",
      unit: "Unit 201",
      image: "/riverside-apartments.png",
      amenities: ["Pool", "Gym", "Pet Friendly", "Balcony"],
      ownerName: "Linda Martinez",
      deposit: 3200,
      status: "Available",
    },
    {
      id: 6,
      name: "Lakeside Villas",
      address: "234 Lake Dr, Chicago, IL 60601",
      type: "Multi Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      rent: 2900,
      available: "Available Now",
      unit: "Unit 1102",
      image: "/lakeside-villas.jpg",
      amenities: ["Pool", "Gym", "Concierge", "Parking"],
      ownerName: "Robert Taylor",
      deposit: 2900,
      status: "Available",
    },
    {
      id: 9,
      name: "Downtown Lofts",
      address: "890 Main St, Boston, MA 02108",
      type: "Multi Family",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 850,
      rent: 2200,
      available: "Available 01/15",
      unit: "Unit 302",
      image: "/modern-downtown-loft.png",
      amenities: ["Rooftop", "Concierge", "Parking"],
      ownerName: "Michael Chen",
      deposit: 2200,
      status: "Pending",
    },
    {
      id: 10,
      name: "Skyline Towers",
      address: "321 Sky Blvd, Dallas, TX 75201",
      type: "Multi Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1150,
      rent: 2700,
      available: "Available Now",
      unit: "Unit 2401",
      image: "/skyline-towers-dallas.jpg",
      amenities: ["Pool", "Gym", "Rooftop", "Concierge"],
      ownerName: "Emma Wilson",
      deposit: 2700,
      status: "Available",
    },
  ]

  const [interestedProperties, setInterestedProperties] = useState([
    {
      id: 4,
      name: "Harbor View Complex",
      address: "321 Harbor Dr, San Diego, CA 92101",
      type: "Multi Family",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      rent: 2800,
      available: "Available Now",
      unit: "Unit 405",
      image: "/modern-apartment-building-harbor-view.jpg",
      amenities: ["Pool", "Gym", "Parking", "Laundry"],
      ownerName: "Emma Wilson",
      deposit: 2800,
      status: "Available",
    },
    {
      id: 9,
      name: "Downtown Lofts",
      address: "890 Main St, Boston, MA 02108",
      type: "Multi Family",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 850,
      rent: 2200,
      available: "Available 01/15",
      unit: "Unit 302",
      image: "/modern-downtown-loft.png",
      amenities: ["Rooftop", "Concierge", "Parking"],
      ownerName: "Michael Chen",
      deposit: 2200,
      status: "Pending",
    },
  ])

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

  const [prospectTasks, setProspectTasks] = useState([
    {
      id: 1,
      title: "Review rental application - Sarah Johnson",
      processName: "Lease Prospect Onboarding",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Nina Patel",
      dueDate: "2025-12-20",
      priority: "High" as const,
      status: "Pending" as const,
      isOverdue: true,
    },
    {
      id: 2,
      title: "Send lease agreement - Unit 305",
      processName: "New Lease Signing",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Unit 305",
      assignee: "Sarah Chen",
      dueDate: "2025-12-21",
      priority: "High" as const,
      status: "In Progress" as const,
      isOverdue: true,
    },
    {
      id: 3,
      title: "Schedule property showing",
      processName: "Lease Prospect Onboarding",
      relatedEntityType: "Property" as const,
      relatedEntityName: "Sunset Villa",
      assignee: "Richard Surovi",
      dueDate: "2025-12-23",
      priority: "High" as const,
      status: "Pending" as const,
      isOverdue: false,
    },
    {
      id: 4,
      title: "Follow up with prospect - Unit 204",
      processName: "Lease Renewal Process",
      relatedEntityType: "Tenant" as const,
      relatedEntityName: "John Smith",
      assignee: "Nina Patel",
      dueDate: "2025-12-23",
      priority: "Medium" as const,
      status: "Pending" as const,
      isOverdue: false,
    },
    {
      id: 5,
      title: "Verify employment documents",
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Mike Johnson",
      dueDate: "2025-12-24",
      priority: "Medium" as const,
      status: "In Progress" as const,
      isOverdue: false,
    },
    {
      id: 6,
      title: "Call about viewing feedback",
      processName: "Lease Prospect Outreach",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Emily Brown",
      assignee: "Richard Surovi",
      dueDate: "2025-12-25",
      priority: "Low" as const,
      status: "Skipped" as const,
      isOverdue: false,
    },
    {
      id: 7,
      title: "Respond to inquiry",
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Robert Garcia",
      assignee: "Nina Patel",
      dueDate: "2025-12-24",
      priority: "Low" as const,
      status: "Pending" as const,
      isOverdue: false,
      autoCreated: true,
    },
  ])

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

  // Keeping recentMessages for comparison, but new logic uses ACTIVITIES_DATA
  const prospectDocuments = [
    {
      id: 1,
      name: "Rental Application",
      type: "Application",
      property: "Harbor View Apartments",
      dateShared: "12/20/2025",
      status: "Submitted",
    },
    {
      id: 2,
      name: "Proof of Income",
      type: "Financial",
      property: "Harbor View Apartments",
      dateShared: "12/22/2025",
      status: "Pending Review",
    },
    {
      id: 3,
      name: "ID Verification",
      type: "Identity",
      property: "Downtown Loft",
      dateShared: "12/18/2025",
      status: "Verified",
    },
    {
      id: 4,
      name: "Employment Letter",
      type: "Financial",
      property: "Harbor View Apartments",
      dateShared: "12/23/2025",
      status: "Requested",
    },
  ]

  // Lease Prospect Processes Data
  const leaseProspectProcesses = {
    inProgress: [
      {
        id: "proc-1",
        name: "Application Review & Screening",
        leaseProspectStage: "Working",
        startedOn: "01/10/2026",
        status: "In Progress",
        tasks: [
          { id: "t1", name: "Verify applicant identity", startDate: "01/10/2026", completedDate: "01/10/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t2", name: "Run credit check", startDate: "01/11/2026", completedDate: "01/12/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t3", name: "Contact previous landlord", startDate: "01/13/2026", completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
          { id: "t4", name: "Verify employment", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-2",
        name: "Property Tour & Selection",
        leaseProspectStage: "Scheduled Intro call",
        startedOn: "01/08/2026",
        status: "In Progress",
        tasks: [
          { id: "t5", name: "Schedule property tour", startDate: "01/08/2026", completedDate: "01/08/2026", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t6", name: "Conduct property showing", startDate: "01/09/2026", completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t7", name: "Collect tour feedback", startDate: null, completedDate: null, staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-7",
        name: "Income & Employment Verification",
        leaseProspectStage: "Working",
        startedOn: "01/12/2026",
        status: "In Progress",
        tasks: [
          { id: "t20", name: "Request pay stubs", startDate: "01/12/2026", completedDate: "01/12/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t21", name: "Contact employer HR", startDate: "01/13/2026", completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t22", name: "Calculate income-to-rent ratio", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        ],
      },
      {
        id: "proc-8",
        name: "Background Check Process",
        leaseProspectStage: "Under review",
        startedOn: "01/14/2026",
        status: "In Progress",
        tasks: [
          { id: "t23", name: "Run criminal background check", startDate: "01/14/2026", completedDate: "01/14/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t24", name: "Check eviction history", startDate: "01/15/2026", completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t25", name: "Compile screening report", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
      {
        id: "proc-9",
        name: "Rental History Verification",
        leaseProspectStage: "Attempting to contact",
        startedOn: "01/11/2026",
        status: "In Progress",
        tasks: [
          { id: "t26", name: "Contact current landlord", startDate: "01/11/2026", completedDate: "01/11/2026", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t27", name: "Contact previous landlord", startDate: "01/12/2026", completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-10",
        name: "Pet Screening",
        leaseProspectStage: "Working",
        startedOn: "01/15/2026",
        status: "In Progress",
        tasks: [
          { id: "t28", name: "Collect pet documentation", startDate: "01/15/2026", completedDate: null, staffName: "Mike Johnson", staffEmail: "mike.johnson@heropm.com" },
          { id: "t29", name: "Verify pet breed and weight", startDate: null, completedDate: null, staffName: "Mike Johnson", staffEmail: "mike.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-11",
        name: "Co-Signer Evaluation",
        leaseProspectStage: "Under review",
        startedOn: "01/16/2026",
        status: "In Progress",
        tasks: [
          { id: "t30", name: "Request co-signer application", startDate: "01/16/2026", completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
          { id: "t31", name: "Run co-signer credit check", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
    ],
    upcoming: [
      {
        id: "proc-3",
        name: "Lease Preparation",
        leaseProspectStage: "Closing",
        status: "Upcoming",
        tasks: [
          { id: "t8", name: "Prepare lease agreement", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t9", name: "Review lease terms with prospect", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
          { id: "t10", name: "Collect security deposit", startDate: null, completedDate: null, staffName: "Laura Taylor", staffEmail: "laura.taylor@heropm.com" },
        ],
      },
      {
        id: "proc-4",
        name: "Move-In Coordination",
        leaseProspectStage: "New client",
        status: "Upcoming",
        tasks: [
          { id: "t11", name: "Schedule move-in inspection", startDate: null, completedDate: null, staffName: "Mike Johnson", staffEmail: "mike.johnson@heropm.com" },
          { id: "t12", name: "Prepare welcome package", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t13", name: "Set up tenant portal access", startDate: null, completedDate: null, staffName: "Michael Chen", staffEmail: "michael.chen@heropm.com" },
        ],
      },
      {
        id: "proc-12",
        name: "Utility Transfer Setup",
        leaseProspectStage: "New client",
        status: "Upcoming",
        tasks: [
          { id: "t32", name: "Provide utility transfer instructions", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t33", name: "Verify utility account setup", startDate: null, completedDate: null, staffName: "Mike Johnson", staffEmail: "mike.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-13",
        name: "Renter's Insurance Verification",
        leaseProspectStage: "Closing",
        status: "Upcoming",
        tasks: [
          { id: "t34", name: "Request proof of renter's insurance", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t35", name: "Verify coverage meets requirements", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
      {
        id: "proc-14",
        name: "Key and Access Distribution",
        leaseProspectStage: "New client",
        status: "Upcoming",
        tasks: [
          { id: "t36", name: "Prepare key sets", startDate: null, completedDate: null, staffName: "Mike Johnson", staffEmail: "mike.johnson@heropm.com" },
          { id: "t37", name: "Program access codes", startDate: null, completedDate: null, staffName: "Michael Chen", staffEmail: "michael.chen@heropm.com" },
        ],
      },
      {
        id: "proc-15",
        name: "Parking Assignment",
        leaseProspectStage: "New client",
        status: "Upcoming",
        tasks: [
          { id: "t38", name: "Assign parking space", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t39", name: "Issue parking permit", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
    ],
    completed: [
      {
        id: "proc-5",
        name: "Initial Contact & Qualification",
        leaseProspectStage: "New lead",
        startedOn: "01/02/2026",
        completedOn: "01/05/2026",
        status: "Completed",
        tasks: [
          { id: "t14", name: "Send welcome email", startDate: "01/02/2026", completedDate: "01/02/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t15", name: "Conduct initial phone screening", startDate: "01/03/2026", completedDate: "01/03/2026", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t16", name: "Collect rental requirements", startDate: "01/04/2026", completedDate: "01/05/2026", staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        ],
      },
      {
        id: "proc-6",
        name: "Document Collection",
        leaseProspectStage: "Attempting to contact",
        startedOn: "01/05/2026",
        completedOn: "01/08/2026",
        status: "Completed",
        tasks: [
          { id: "t17", name: "Request proof of income", startDate: "01/05/2026", completedDate: "01/05/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t18", name: "Request ID documents", startDate: "01/06/2026", completedDate: "01/06/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t19", name: "Verify documents received", startDate: "01/07/2026", completedDate: "01/08/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-16",
        name: "Inquiry Response",
        leaseProspectStage: "New lead",
        startedOn: "12/28/2025",
        completedOn: "12/30/2025",
        status: "Completed",
        tasks: [
          { id: "t40", name: "Respond to initial inquiry", startDate: "12/28/2025", completedDate: "12/28/2025", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t41", name: "Send property details", startDate: "12/29/2025", completedDate: "12/30/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-17",
        name: "Pre-Qualification Check",
        leaseProspectStage: "New lead",
        startedOn: "12/30/2025",
        completedOn: "01/01/2026",
        status: "Completed",
        tasks: [
          { id: "t42", name: "Verify basic eligibility", startDate: "12/30/2025", completedDate: "12/30/2025", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t43", name: "Confirm income threshold met", startDate: "12/31/2025", completedDate: "01/01/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
      {
        id: "proc-18",
        name: "CRM Lead Entry",
        leaseProspectStage: "New lead",
        startedOn: "12/26/2025",
        completedOn: "12/26/2025",
        status: "Completed",
        tasks: [
          { id: "t44", name: "Create prospect record", startDate: "12/26/2025", completedDate: "12/26/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t45", name: "Assign to leasing agent", startDate: "12/26/2025", completedDate: "12/26/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-19",
        name: "Preferred Property Matching",
        leaseProspectStage: "Attempting to contact",
        startedOn: "12/27/2025",
        completedOn: "12/29/2025",
        status: "Completed",
        tasks: [
          { id: "t46", name: "Analyze preferences", startDate: "12/27/2025", completedDate: "12/27/2025", staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
          { id: "t47", name: "Match available units", startDate: "12/28/2025", completedDate: "12/29/2025", staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        ],
      },
    ],
  }

  const prospectAuditLogs = [
    {
      id: "1",
      dateTime: "Jan 18, 2026 – 10:42 AM",
      user: "Sarah M",
      userRole: "CSR",
      actionType: "Updated",
      entity: "Prospect Profile",
      description: "Updated primary phone number from (555) 111-2222 to (555) 123-4567",
      source: "Web App",
    },
    {
      id: "2",
      dateTime: "Jan 17, 2026 – 3:15 PM",
      user: "System",
      userRole: "Automation",
      actionType: "Status Changed",
      entity: "Prospect Profile",
      description: "Prospect moved from New Lead to Working stage",
      source: "System Automation",
    },
    {
      id: "3",
      dateTime: "Jan 16, 2026 – 11:30 AM",
      user: "Mike D",
      userRole: "Property Manager",
      actionType: "Created",
      entity: "Attachments",
      description: "Uploaded proof of income document",
      source: "Web App",
    },
    {
      id: "4",
      dateTime: "Jan 15, 2026 – 2:45 PM",
      user: "Nina P",
      userRole: "Admin",
      actionType: "Updated",
      entity: "Application",
      description: "Updated rental application with co-signer information",
      source: "Web App",
    },
    {
      id: "5",
      dateTime: "Jan 14, 2026 – 9:20 AM",
      user: "Richard S",
      userRole: "Leasing Agent",
      actionType: "Assignment Changed",
      entity: "Tasks",
      description: "Reassigned task 'Schedule property tour' to Sarah M",
      source: "Mobile App",
    },
    {
      id: "6",
      dateTime: "Jan 12, 2026 – 4:30 PM",
      user: "Sarah M",
      userRole: "CSR",
      actionType: "Created",
      entity: "Properties",
      description: "Added property interest 'Harbor View Apartments'",
      source: "Web App",
    },
    {
      id: "7",
      dateTime: "Jan 10, 2026 – 10:15 AM",
      user: "Mike D",
      userRole: "Property Manager",
      actionType: "Updated",
      entity: "Notes",
      description: "Edited note regarding move-in date preferences",
      source: "Web App",
    },
    {
      id: "8",
      dateTime: "Jan 8, 2026 – 1:00 PM",
      user: "Nina P",
      userRole: "Admin",
      actionType: "Deleted",
      entity: "Attachments",
      description: "Removed duplicate ID document upload",
      source: "Web App",
    },
    {
      id: "9",
      dateTime: "Jan 5, 2026 – 11:45 AM",
      user: "System",
      userRole: "Automation",
      actionType: "Viewed",
      entity: "Prospect Profile",
      description: "Prospect profile accessed via tenant portal",
      source: "System Automation",
    },
    {
      id: "10",
      dateTime: "Jan 3, 2026 – 9:00 AM",
      user: "Richard S",
      userRole: "Leasing Agent",
      actionType: "Created",
      entity: "Prospect Profile",
      description: "Prospect record created from website inquiry",
      source: "Web App",
    },
    {
      id: "11",
      dateTime: "Jan 11, 2026 – 2:18 PM",
      user: "Sarah M",
      userRole: "CSR",
      actionType: "Deleted",
      entity: "Notes",
      description: "Deleted note: 'Follow-up reminder for property tour'",
      source: "Web App",
      deletedNoteContent: "Follow-up reminder for property tour scheduled for next Tuesday at 3 PM. Prospect mentioned they are also considering two other properties in the downtown area. Need to highlight our amenities and competitive pricing. Contact before end of day Friday to confirm.",
      deletedBy: "Sarah M",
      deletedOn: "Jan 11, 2026 – 2:18 PM",
    },
    {
      id: "12",
      dateTime: "Jan 6, 2026 – 9:45 AM",
      user: "Richard S",
      userRole: "Leasing Agent",
      actionType: "Deleted",
      entity: "Notes",
      description: "Deleted note: 'Initial contact notes - incorrect information'",
      source: "Mobile App",
      deletedNoteContent: "Initial contact via phone. Prospect expressed interest in 2BR units at Harbor View. Budget mentioned was $2,500/month but later corrected to $2,200/month in subsequent call. Pet owner - has one small dog (under 25 lbs). Current lease ends March 2026. Prefers ground floor unit if available.",
      deletedBy: "Richard S",
      deletedOn: "Jan 6, 2026 – 9:45 AM",
    },
    {
      id: "13",
      dateTime: "Dec 28, 2025 – 4:30 PM",
      user: "Mike D",
      userRole: "Property Manager",
      actionType: "Deleted",
      entity: "Notes",
      description: "Deleted note: 'Duplicate entry - income verification'",
      source: "Web App",
      deletedNoteContent: "Income verification received. Prospect provided pay stubs showing monthly income of $6,800. Debt-to-income ratio appears favorable. Note: This was a duplicate entry - original note already captured this information with additional details about employment history.",
      deletedBy: "Mike D",
      deletedOn: "Dec 28, 2025 – 4:30 PM",
    },
  ]

  // Units per property for task creation
  const prospectPropertyUnits: Record<string, string[]> = {
    "Harbor View Complex": ["Unit 101", "Unit 102", "Unit 201", "Unit 202", "Unit 301", "Unit 302"],
    "Downtown Lofts": ["Unit 301", "Unit 302", "Unit 401", "Unit 402"],
    "Sunset Apartments": ["Unit A", "Unit B", "Unit C"],
    "Skyline Towers": [], // Single unit - Unit 2401 already specified
  }

  // Staff members for task assignment
  const prospectTaskStaffMembers = [
    { id: "1", name: "Nina Patel", role: "Leasing Agent" },
    { id: "2", name: "John Smith", role: "CSR" },
    { id: "3", name: "Sarah Johnson", role: "Property Manager" },
    { id: "4", name: "Michael Chen", role: "Maintenance Coordinator" },
    { id: "5", name: "Emily Davis", role: "CSR" },
    { id: "6", name: "Richard Surovi", role: "Leasing Agent" },
  ]

  // State for task modal fields
  const [taskProperty, setTaskProperty] = useState("")
  const [taskUnit, setTaskUnit] = useState("")
  const [taskAssignTo, setTaskAssignTo] = useState("")

  // Merged code starts here, replacing the original structure with the new layout
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 pt-2 overflow-auto">
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
                      <p>{stage}</p>
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
              onClick={() => {
                setShowMissingInfoModal?.(true)
              }}
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
              onClick={() => {
                setShowMissingInfoModal?.(true)
              }}
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
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveMainTab("overview")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeMainTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveMainTab("property")} // Changed from "properties" to "property"
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeMainTab === "property" // Changed from "properties" to "property"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Property Information
              <Badge variant="secondary" className="text-xs">
                {interestedProperties.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveMainTab("communications")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeMainTab === "communications"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Communications
            </button>
            <button
              onClick={() => setActiveMainTab("processes")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeMainTab === "processes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Processes
              <Badge variant="secondary" className="text-xs">
                {leaseProspectProcesses.inProgress.length + leaseProspectProcesses.upcoming.length + leaseProspectProcesses.completed.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveMainTab("tasks-docs")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeMainTab === "tasks-docs"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Documents
              <Badge variant="secondary" className="text-xs">
                {prospectDocuments.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveMainTab("audit-log")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeMainTab === "audit-log"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Audit Log
            </button>
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
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activityChatTab === "private"
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
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activityChatTab === "group"
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      activityTileFilter === "all"
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      activityTileFilter === "emails"
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      activityTileFilter === "sms"
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      activityTileFilter === "notes"
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
                    className={`border rounded-lg overflow-hidden hover:border-primary/30 transition-colors relative ${
                      finalizedPropertyId === property.id ? "border-success border-2 bg-success/5" : ""
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
                        <div className="px-2 py-2 border-r border-border flex flex-col gap-1.5">
                          {[
                            { label: "Application Link", href: "#" },
                            { label: "Showing Link", href: "#" },
                            { label: "Matterport Scan", href: "#" },
                            { label: "Rental Comps", href: "#" },
                            { label: "Access Information", href: "#" },
                          ].map(({ label, href }) => (
                            <div
                              key={label}
                              className="flex items-center justify-between gap-1 px-2 py-1.5 rounded-md border border-border hover:border-teal-300 hover:bg-teal-50/40 transition-colors"
                            >
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:underline transition-colors text-xs text-[rgba(1,96,209,1)] min-w-0 truncate"
                              >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span className="truncate">{label}</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleShareLink(label)}
                                className="p-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
                                title={`Share ${label}`}
                              >
                                <Share2 className="h-3 w-3" />
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

                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                          <Button
                            size="sm"
                            variant="link"
                            className="text-primary hover:text-primary/80 p-0"
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
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    commSubTab === "private"
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
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    commSubTab === "group"
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
                                <div className={`max-w-[75%] ${
                                  isOutgoing
                                    ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                } p-3 shadow-sm`}>
                                  {/* Sender & Channel Badge */}
                                  <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                    <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>
                                      {item.user}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                      item.type === "email"
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
                              <div className={`max-w-[75%] ${
                                isOutgoing
                                  ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                  : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                              } p-3 shadow-sm`}>
                                <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                  <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>{item.user}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                    item.type === "email"
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
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  processStatusFilter === "in-progress"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                In Progress ({leaseProspectProcesses.inProgress.length + newlyStartedProcesses.length})
              </button>
              <button
                type="button"
                onClick={() => setProcessStatusFilter("completed")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  processStatusFilter === "completed"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Completed ({leaseProspectProcesses.completed.length})
              </button>
              <button
                type="button"
                onClick={() => setProcessStatusFilter("upcoming")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  processStatusFilter === "upcoming"
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

      {/* Quick Actions Sidebar */}
      <div className="w-64 border-l border-border p-4 bg-background flex-shrink-0">
        <h3 className="font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-lg border border-border hover:bg-muted/50 px-3 py-2 bg-transparent"
            onClick={() => setShowEmailModal(true)}
          >
            <Mail className="h-4 w-4 text-primary" />
            <span className="text-sm">Send Email</span>
          </Button>
          <Button
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-lg border border-border hover:bg-muted/50 px-3 py-2 bg-transparent"
            onClick={() => setShowSMSModal(true)}
          >
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-sm">Send SMS</span>
          </Button>
          <Button
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-lg border border-border hover:bg-muted/50 px-3 py-2 bg-transparent"
            onClick={() => setShowCallModal(true)}
          >
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm">Log Call</span>
          </Button>
          <Button
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-lg border border-border hover:bg-muted/50 px-3 py-2 bg-transparent"
            onClick={() => setShowAddNoteModal(true)}
          >
            <StickyNote className="h-4 w-4 text-primary" />
            <span className="text-sm">Add Note</span>
          </Button>
          <Button
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-lg border border-border hover:bg-muted/50 px-3 py-2 bg-transparent"
            onClick={() => setShowMeetingModal(true)}
          >
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm">Schedule Meeting</span>
          </Button>
          <Button
            variant="outline"
            className="flex w-full justify-start gap-2 rounded-lg border border-border hover:bg-muted/50 px-3 py-2 bg-transparent"
            onClick={() => setShowReassignModal(true)}
          >
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">Reassign Lead</span>
          </Button>
        </div>
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
                      className={`flex items-center gap-4 w-full text-left py-3.5 px-4 transition-colors ${
                        alreadyStarted
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
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
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
        currentSubject={selectedEmailActivity?.emailSubject || "Property Inquiry"}
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
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isFromProspect
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
                        className={`max-w-[90%] rounded-lg border ${
                          isFromProspect
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
                            {item.emailThread?.[0]?.subject || item.emailSubject || "No Subject"}
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
                                  {email.emailOpens && email.emailOpens.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-blue-100">
                                      <p className="text-xs text-amber-600 flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Opened: {email.emailOpens.map((o, i) => (
                                          <span key={i}>
                                            {o.openedAt}{i < email.emailOpens.length - 1 ? ", " : ""}
                                          </span>
                                        ))}
                                      </p>
                                    </div>
                                  )}
                                  
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    threadReplyChannel === "email"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    threadReplyChannel === "sms"
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
    </div>
  )
}

export default TenantApplicationDetailView
