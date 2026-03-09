"use client"

import type React from "react"
import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Calendar as CalendarWidget } from "@/components/ui/calendar"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
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
  BarChart3,
  Copy,
  QrCode,
  KeyRound,
} from "lucide-react"
import { SMSPopupModal } from "@/components/sms-popup-modal"
import { EmailPopupModal } from "@/components/email-popup-modal"
import { useNav } from "@/components/dashboard-app"

// Pipeline stages with colors (12-step lifecycle)
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
  "Lost/Not Interested",
  "Application Rejected",
]

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

// Stage progress bar colors (12 cubes: 1 amber, 9 greens, 2 reds)
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
  "#B71C1C",            // Cube 11 - Deep Red (Lost/Not Interested)
  "#E58A84",            // Cube 12 - Soft Coral Red (Application Rejected)
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
  "lost": 10,
  "disqualified": 11,
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
        content: `Hi ${prospectName.split(" ")[0]},

Thank you for your interest in our available rental units.

As discussed, here are some options that match your requirements:
- 2BR/2BA at Oak Street - $1,800/month
- 2BR/1BA at Maple Ave - $1,650/month
- 3BR/2BA at Pine Lane - $2,100/month

All units include water and trash. Let me know if you'd like to schedule a viewing.

Best regards,
Richard Surovi
B2B Property Management`,
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
        content: `Hi Richard,

Thank you for sending this over. I'm interested in the 2BR/2BA at Oak Street.

A few questions:
1. Is there parking available?
2. What's the lease term?
3. When can I schedule a viewing?

Looking forward to hearing from you.

${prospectName.split(" ")[0]}`,
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
        content: `Hi ${prospectName.split(" ")[0]},

Great choice! Here are the answers:

1. Yes, one covered parking spot is included, additional spots are $50/month.

2. Standard lease term is 12 months, but we can discuss shorter terms.

3. I'm available tomorrow at 2pm or Thursday at 10am for a viewing.

Let me know what works for you!

Best,
Richard`,
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
    callNotes: `Initial discovery call with prospect ${prospectName}.

Key Points Discussed:
- Looking for 2-bedroom apartment
- Preferred move-in date: First week of next month
- Budget: $1,500-$2,000/month
- Requirements: Pet-friendly, in-unit laundry preferred
- Current situation: Lease ending at current place

Next Steps:
- Send available listings by end of day
- Schedule viewing for this weekend

Call duration: 12 minutes 18 seconds`,
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
        content: `Hi team,

Following up on the new prospect application. Here are the action items:

1. Richard - Schedule showing for the Oak Street unit
2. Nina - Process background check
3. Verify employment and previous landlord references

${prospectName} is looking to move in by the first week of next month, so let's prioritize this.

Thanks,
Sarah`,
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
        content: `Team,

The cleaning crew has confirmed availability for the Oak Street unit. Schedule:
- Deep clean: Monday 9 AM - 1 PM
- Touch-up paint: Monday 2 PM
- Final inspection: Tuesday 10 AM

${prospectName}, the unit will be ready for your viewing on Thursday.

Best,
Mike`,
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
  // Communication filters
  const [commTypeFilter, setCommTypeFilter] = useState<"all" | "email" | "sms" | "call">("all")
  const [commDateRange, setCommDateRange] = useState<DateRange | undefined>(undefined)
  const [commDatePopoverOpen, setCommDatePopoverOpen] = useState(false)
  const [commSearchQuery, setCommSearchQuery] = useState("")

  // Share links dialog state
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLinkType, setShareLinkType] = useState("")
  
  // Add Custom Field modal state
  const [showAddCustomFieldModal, setShowAddCustomFieldModal] = useState(false)
  const [customFieldData, setCustomFieldData] = useState({
    section: "Federal Tax",
    fieldName: "",
    fieldType: "Text",
    isRequired: false
  })
  
  const [shareRecipients, setShareRecipients] = useState<Record<string, boolean>>({
    "Leasing Prospect": false,
    "Owner": false,
    "CSR": false,
    "CSM": false,
    "Leasing Coordinator (L)": false,
    "Leasing Coordinator (R)": false,
    "Leasing Manager": false,
  })
  const [shareMessage, setShareMessage] = useState("")

  const handleOpenShareDialog = (linkType: string) => {
    setShareLinkType(linkType)
    setShareRecipients({
      "Leasing Prospect": false,
      "Owner": false,
      "CSR": false,
      "CSM": false,
      "Leasing Coordinator (L)": false,
      "Leasing Coordinator (R)": false,
      "Leasing Manager": false,
    })
    setShareMessage("")
    setShowShareDialog(true)
  }

  const toggleShareRecipient = (key: string) => {
    setShareRecipients(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Access Information dialog state
  const [showAccessInfoDialog, setShowAccessInfoDialog] = useState(false)
  const [showGenerateCodeDialog, setShowGenerateCodeDialog] = useState(false)
  const [accessCodeType, setAccessCodeType] = useState<"lockbox" | "showmojo">("lockbox")
  const [lockboxCode] = useState("5893 2474")
  const [lockboxCopied, setLockboxCopied] = useState(false)
  const [showmojoStartDate, setShowmojoStartDate] = useState("")
  const [showmojoEndDate, setShowmojoEndDate] = useState("")
  const [showmojoGeneratedCode, setShowmojoGeneratedCode] = useState("")
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

  // Share Links dialog state
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

  // AI Chat state
  const [aiChatInput, setAiChatInput] = useState("")

  const handleAiChatSubmit = (query: string) => {
    // Handle AI chat submission - this would integrate with an AI service
    console.log("AI Chat query:", query)
    setAiChatInput("")
    // In a real implementation, this would call an AI API and display the response
  }

  const handleOpenShareLinksDialog = (type: "lockbox" | "showmojo") => {
    setShareLinksType(type)
    setShowShareLinksDialog(true)
  }

  const handleShareLinkRecipientToggle = (id: string) => {
    setShareLinkRecipients(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleShareLinkMethodToggle = (method: "email" | "sms") => {
    setShareLinkMethod(prev => ({ ...prev, [method]: !prev[method] }))
  }

  const handleSendShareLink = () => {
    // Handle sending the share link
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

  const handleCopyLockboxCode = () => {
    navigator.clipboard.writeText(lockboxCode)
    setLockboxCopied(true)
    setTimeout(() => setLockboxCopied(false), 2000)
  }

  const handleGenerateShowmojoCode = () => {
    if (showmojoStartDate && showmojoEndDate) {
      const code = Math.floor(1000 + Math.random() * 9000).toString()
      setShowmojoGeneratedCode(code)
    }
  }

  const handleOpenAccessInfo = () => {
    setAccessCodeType("lockbox")
    setLockboxCopied(false)
    setShowmojoStartDate("")
    setShowmojoEndDate("")
    setShowmojoGeneratedCode("")
    setShowAccessInfoDialog(true)
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
  // Highlight search matches in text
  const highlightText = (text: string | undefined | null): ReactNode => {
    if (!text) return text
    const q = commSearchQuery.trim()
    if (!q) return text
    try {
      const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
      const parts = text.split(regex)
      if (parts.length <= 1) return text
      return parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark>
          : part
      )
    } catch {
      return text
    }
  }

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
        return { icon: MessageSquare, color: "bg-green-50 border border-green-200", iconColor: "text-green-400" }
      case "email":
        return { icon: Mail, color: "bg-blue-50 border border-blue-200", iconColor: "text-blue-400" }
      case "call":
        return { icon: Phone, color: "bg-amber-50 border border-amber-200", iconColor: "text-amber-400" }
      case "note":
        return { icon: StickyNote, color: "bg-orange-50 border border-orange-200", iconColor: "text-orange-400" }
      default:
        return { icon: MessageSquare, color: "bg-gray-50 border border-gray-200", iconColor: "text-gray-400" }
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case "sms":
        return "text-green-400"
      case "email":
        return "text-blue-400"
      case "call":
        return "text-amber-400"
      case "note":
        return "text-orange-400"
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
          <div className="mt-4 pt-4 border-t border-blue-100">
            <div className="space-y-3 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                View full thread ({emailThread.length} previous messages)
              </p>
              {emailThread.map((email) => (
                <div
                  key={email.id}
                  className={`rounded-lg border transition-all cursor-pointer ${
                    expandedThreadMessage === email.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-border hover:border-blue-200 hover:bg-blue-50/30"
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

  const handleNavigateToProcess = (processName: string) => {
    setActiveMainTab("processes")
    const allProcesses = [
      ...leaseProspectProcesses.inProgress,
      ...leaseProspectProcesses.upcoming,
      ...leaseProspectProcesses.completed,
      ...newlyStartedProcesses,
    ]
    const match = allProcesses.find((p) => p.name === processName)
    if (match) {
      setExpandedProcesses((prev) => (prev.includes(match.id) ? prev : [...prev, match.id]))
    }
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
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
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
    // Process tasks - only from the single in-progress process "Application Review & Screening"
    {
      id: 1,
      title: "Contact previous landlord",
      source: "process" as const,
      processName: "Application Review & Screening",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Richard Surovi",
      createdBy: "",
      dueDate: "2026-01-15",
      priority: "High" as const,
      status: "In Progress" as const,
      isOverdue: false,
    },
    {
      id: 2,
      title: "Verify employment",
      source: "process" as const,
      processName: "Application Review & Screening",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Emily Davis",
      createdBy: "",
      dueDate: "2026-01-18",
      priority: "High" as const,
      status: "Pending" as const,
      isOverdue: false,
    },
    // Communication tasks - auto-created from unread/unresponded communications
    {
      id: 3,
      title: "Respond to unread email from Sarah Johnson",
      source: "communication" as const,
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Nina Patel",
      createdBy: "",
      dueDate: "2026-01-12",
      priority: "High" as const,
      status: "Pending" as const,
      isOverdue: true,
    },
    {
      id: 4,
      title: "Return missed call from Sarah Johnson",
      source: "communication" as const,
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Richard Surovi",
      createdBy: "",
      dueDate: "2026-01-13",
      priority: "Medium" as const,
      status: "Pending" as const,
      isOverdue: true,
    },
    {
      id: 5,
      title: "Follow up on unresponded SMS",
      source: "communication" as const,
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Nina Patel",
      createdBy: "",
      dueDate: "2026-01-14",
      priority: "Medium" as const,
      status: "Pending" as const,
      isOverdue: false,
    },
    // General tasks - created by one staff member for another
    {
      id: 6,
      title: "Verify employment documents",
      source: "general" as const,
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Mike Johnson",
      createdBy: "Nina Patel",
      dueDate: "2026-01-20",
      priority: "Medium" as const,
      status: "In Progress" as const,
      isOverdue: false,
    },
    {
      id: 7,
      title: "Prepare unit showing checklist",
      source: "general" as const,
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Emily Davis",
      createdBy: "Richard Surovi",
      dueDate: "2026-01-22",
      priority: "Low" as const,
      status: "Pending" as const,
      isOverdue: false,
    },
    {
      id: 8,
      title: "Check rental history references",
      source: "general" as const,
      processName: "",
      relatedEntityType: "Lease Prospect" as const,
      relatedEntityName: "Sarah Johnson",
      assignee: "Richard Surovi",
      createdBy: "Nina Patel",
      dueDate: "2026-01-25",
      priority: "Low" as const,
      status: "Skipped" as const,
      isOverdue: false,
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
                  {/* Add Field Button */}
                  <button
                    onClick={() => setShowAddCustomFieldModal(true)}
                    className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 transition-colors border border-teal-600 hover:border-teal-700 rounded-md px-2 py-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Field</span>
                  </button>
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
              onClick={() => {
                setShowMissingInfoModal(true)
              }}
              className="flex items-center gap-1.5 px-3 border-r border-amber-300 hover:underline"
            >
              
              
            </button>
            <button
              type="button"
              onClick={() => {
                setShowMissingInfoModal(true)
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
              <Workflow className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Process: "}
                <span className="font-semibold">{prospectTasks.filter(t => t.source === "process" && t.status !== "Completed").length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <Mail className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"Communication: "}
                <span className="font-semibold">{prospectTasks.filter(t => t.source === "communication" && t.status !== "Completed").length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <ListTodo className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">
                {"General: "}
                <span className="font-semibold">{prospectTasks.filter(t => t.source === "general" && t.status !== "Completed").length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-sm text-red-700">
                {"Overdue: "}
                <span className="font-semibold">{prospectTasks.filter(t => t.isOverdue).length}</span>
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
                className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeMainTab === tab.id
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
                <div className="max-h-[340px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-medium w-[80px]">Source</TableHead>
                      <TableHead className="font-medium">Task</TableHead>
                      <TableHead className="font-medium">Due Date</TableHead>
                      <TableHead className="font-medium">Priority</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Assigned To</TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Process Tasks */}
                    {prospectTasks.filter(t => t.source === "process").map((task) => (
                      <TableRow key={task.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-teal-500" />
                            <span className="text-xs text-teal-600">Process</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{task.title}</span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleNavigateToProcess(task.processName) }}
                              className="flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Workflow className="h-3 w-3 text-teal-600" />
                              <span className="text-xs text-teal-600">{task.processName}</span>
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>{task.dueDate}</span>
                            {task.isOverdue && <span className="text-xs text-red-500">(Overdue)</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.priority === "High" ? "bg-red-50 text-red-700 border-red-200" : task.priority === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.status === "In Progress" ? "bg-teal-50 text-teal-700 border-teal-200" : task.status === "Pending" ? "bg-yellow-50 text-yellow-600 border-yellow-200" : task.status === "Skipped" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{task.assignee}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="View Task"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" title="Edit Task"><Edit className="h-4 w-4" /></Button>
                            {task.status !== "Completed" && task.status !== "Skipped" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600" title="Mark Complete" onClick={() => handleMarkTaskComplete(task.id)}><Check className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Communication Tasks */}
                    {prospectTasks.filter(t => t.source === "communication").map((task) => (
                      <TableRow key={task.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-xs text-blue-600">Comms</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{task.title}</span>
                            <span className="text-xs text-blue-500">Auto-created</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>{task.dueDate}</span>
                            {task.isOverdue && <span className="text-xs text-red-500">(Overdue)</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.priority === "High" ? "bg-red-50 text-red-700 border-red-200" : task.priority === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.status === "In Progress" ? "bg-teal-50 text-teal-700 border-teal-200" : task.status === "Pending" ? "bg-yellow-50 text-yellow-600 border-yellow-200" : task.status === "Skipped" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{task.assignee}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="View Task"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" title="Edit Task"><Edit className="h-4 w-4" /></Button>
                            {task.status !== "Completed" && task.status !== "Skipped" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600" title="Mark Complete" onClick={() => handleMarkTaskComplete(task.id)}><Check className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* General Tasks */}
                    {prospectTasks.filter(t => t.source === "general").map((task) => (
                      <TableRow key={task.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                            <span className="text-xs text-slate-500">General</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{task.title}</span>
                            {task.createdBy && <span className="text-xs text-muted-foreground">Created by {task.createdBy}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>{task.dueDate}</span>
                            {task.isOverdue && <span className="text-xs text-red-500">(Overdue)</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.priority === "High" ? "bg-red-50 text-red-700 border-red-200" : task.priority === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={task.status === "In Progress" ? "bg-teal-50 text-teal-700 border-teal-200" : task.status === "Pending" ? "bg-yellow-50 text-yellow-600 border-yellow-200" : task.status === "Skipped" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{task.assignee}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="View Task"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" title="Edit Task"><Edit className="h-4 w-4" /></Button>
                            {task.status !== "Completed" && task.status !== "Skipped" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600" title="Mark Complete" onClick={() => handleMarkTaskComplete(task.id)}><Check className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {prospectTasks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No tasks yet. Click "New Task" to create one.
                        </TableCell>
                      </TableRow>
                    )}
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
                  const { icon: Icon, color, iconColor: actIconColor } = getActivityIcon(activity.type)
                  const isExpanded = expandedActivityId === activity.id
                  const isPinned = pinnedActivities.includes(activity.id)

                  const isNote = activity.isNote || activity.type === "note"

                  // Collapsed email header rendering
                  if (activity.type === "email" && !activity.isSystem) {
                    const emailSubject = activity.emailThread?.[0]?.subject || activity.emailSubject || "No Subject"
                    return (
                      <div key={activity.id} className="border-b last:border-b-0 bg-white border-border">
                        <div
                          className="px-4 py-3 cursor-pointer hover:bg-blue-50/60 transition-colors bg-blue-50/40"
                          onClick={() => handleActivityClick(activity)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                              <span className="text-sm font-medium text-foreground truncate">{emailSubject}</span>
                              {!activity.isRead && <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-2 ml-3 shrink-0">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 ${isPinned ? "text-blue-600" : "text-muted-foreground"}`}
                                onClick={(e) => { e.stopPropagation(); togglePin(activity.id) }}
                              >
                                <Pin className={`h-3 w-3 ${isPinned ? "fill-current" : ""}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-blue-100 bg-blue-50/20">
                            <div className="pt-4 space-y-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">{activity.userInitials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-foreground">{activity.user}</span>
                                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">To: {activity.target} {activity.targetPhone}</p>
                                </div>
                              </div>
                              {activity.message && <div className="text-sm text-foreground whitespace-pre-line pl-11">{activity.message}</div>}
                              {renderExpandedContent(activity)}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <div
                      key={activity.id}
                      className="border-b last:border-b-0 bg-white border-border"
                    >
                      <div
                        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/30"
                        onClick={() => handleActivityClick(activity)}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                              {activity.userInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 ${color} rounded-full flex items-center justify-center`}
                          >
                            <Icon className={`h-3 w-3 ${actIconColor}`} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {activity.phone && <span className="text-muted-foreground"> {activity.phone}</span>}
                            <span className={isNote ? "text-orange-400" : getActionColor(activity.type)}>
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
                            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                              {activity.unreadCount}
                            </span>
                          )}
                          {!activity.isRead && !activity.isGroupChat && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground ${isExpanded ? "rotate-180" : ""}`} />
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${isPinned ? "text-blue-600" : "text-muted-foreground"}`}
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
                const allPrivateComms = ACTIVITIES_DATA
                  .filter(a => !a.isGroupChat && !a.isNote && a.type !== "note")
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                const privateComms = allPrivateComms.filter(a => {
                  if (commTypeFilter !== "all" && a.type !== commTypeFilter) return false
                  if (commDateRange?.from) {
                    const msgDate = new Date(a.timestamp)
                    const from = startOfDay(commDateRange.from)
                    const to = commDateRange.to ? endOfDay(commDateRange.to) : endOfDay(commDateRange.from)
                    if (!isWithinInterval(msgDate, { start: from, end: to })) return false
                  }
                  return true
                })

                return (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">Private Conversation</h3>
                      <span className="text-xs text-muted-foreground">{privateComms.length} messages</span>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 mb-3 p-2.5 rounded-lg border border-slate-200 bg-white">
                      {/* Type radio buttons */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Type</span>
                        <div className="flex items-center gap-1">
                          {(["all", "email", "sms", "call"] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setCommTypeFilter(t)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                commTypeFilter === t
                                  ? t === "email"
                                    ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]"
                                    : t === "sms"
                                      ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]"
                                      : t === "call"
                                        ? "bg-[#E8EAF6] text-indigo-800 border border-[#c5cae9]"
                                        : "bg-teal-50 text-teal-700 border border-teal-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {t === "all" ? "All" : t === "email" ? "Emails" : t === "sms" ? "SMS" : "Calls"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-5 w-px bg-slate-200" />

                      {/* Date range picker */}
                      <Popover open={commDatePopoverOpen} onOpenChange={setCommDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              commDateRange?.from
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {commDateRange?.from ? (
                              commDateRange.to
                                ? `${format(commDateRange.from, "MMM d")} - ${format(commDateRange.to, "MMM d, yyyy")}`
                                : format(commDateRange.from, "MMM d, yyyy")
                            ) : (
                              "Date"
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarWidget
                            mode="range"
                            selected={commDateRange}
                            onSelect={(range) => {
                              setCommDateRange(range)
                              if (range?.to) setCommDatePopoverOpen(false)
                            }}
                            numberOfMonths={1}
                          />
                          {commDateRange?.from && (
                            <div className="border-t p-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => { setCommDateRange(undefined); setCommDatePopoverOpen(false) }}
                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>

                      <div className="h-5 w-px bg-slate-200" />

                      {/* Search bar */}
                      <div className="relative flex-1 min-w-[140px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={commSearchQuery}
                          onChange={(e) => setCommSearchQuery(e.target.value)}
                          placeholder="Search conversations..."
                          className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                        />
                        {commSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setCommSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {(commTypeFilter !== "all" || commDateRange?.from || commSearchQuery) && (
                        <button
                          type="button"
                          onClick={() => { setCommTypeFilter("all"); setCommDateRange(undefined); setCommSearchQuery("") }}
                          className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          Clear all
                        </button>
                      )}
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
                                    ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                    : "rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                } ${
                                  item.type === "email"
                                    ? "bg-[#E6F4EA] border border-[#c8e6cf]"
                                    : item.type === "sms"
                                      ? isOutgoing
                                        ? "bg-[#90CAF9] border border-[#64B5F6]"
                                        : "bg-[#E3F2FD] border border-[#BBDEFB]"
                                      : "bg-[#E0F7F6] border border-[#b8e8e6]"
                                } text-slate-900 p-3 shadow-sm`}>
                                  {/* Sender & Channel Badge */}
                                  <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                    <span className="text-xs font-medium text-slate-500">
                                      {item.user}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                      item.type === "email"
                                        ? "bg-[#c8e6cf] text-green-800"
                                        : item.type === "sms"
                                        ? isOutgoing
                                          ? "bg-[#64B5F6] text-blue-900"
                                          : "bg-[#BBDEFB] text-blue-800"
                                        : "bg-[#b8e8e6] text-teal-800"
                                    }`}>
                                      {item.type === "email" ? "Email" : item.type === "sms" ? "SMS" : "Call"}
                                    </span>
                                  </div>

                                  {/* Email - collapsed by default with subject header */}
                                  {item.type === "email" && item.emailThread ? (
                                    <div>
                                      {/* Collapsed header: subject + expand */}
                                      <button
                                        onClick={() => setExpandedCommEmails(prev => {
                                          const next = new Set(prev)
                                          const key = String(item.id)
                                          next.has(key) ? next.delete(key) : next.add(key)
                                          return next
                                        })}
                                        className="w-full text-left flex items-center justify-between gap-2 group"
                                      >
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <Mail className="h-3.5 w-3.5 shrink-0 text-green-700" />
                                          <span className="text-sm font-semibold text-slate-800 truncate">
                                            {highlightText(item.emailThread[0]?.subject || "Email")}
                                          </span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 transition-transform ${isEmailExp ? "rotate-180" : "rotate-0"}`} />
                                      </button>

                                      {!isEmailExp && (
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{highlightText(item.message)}</p>
                                      )}

                                      {/* Expanded: email content + thread */}
                                      {isEmailExp && (
                                        <div className="mt-2">
                                          {/* Main email content */}
                                          <p className="text-sm whitespace-pre-line text-slate-700">
                                            {highlightText(item.emailThread[0]?.content)}
                                          </p>
                                          {item.emailThread[0]?.emailOpens && item.emailThread[0].emailOpens.length > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] mt-1.5 text-green-600">
                                              <Eye className="h-3 w-3" />
                                              Opened at {item.emailThread[0].emailOpens[0].openedAt}
                                            </div>
                                          )}

                                          {/* Attachments */}
                                          {item.attachments && item.attachments.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                              {item.attachments.map((att: any, ai: number) => (
                                                <span key={ai} className="inline-flex items-center gap-1 text-xs bg-white/70 border border-[#c8e6cf] rounded px-2 py-1 text-slate-600">
                                                  <Paperclip className="h-3 w-3" />{att.name}
                                                </span>
                                              ))}
                                            </div>
                                          )}

                                          {/* Email thread at bottom */}
                                          {item.emailThread.length > 1 && (
                                            <div className="mt-3 pt-2 border-t border-[#c8e6cf]">
                                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Thread ({item.emailThread.length - 1} earlier)</p>
                                              <div className="space-y-1">
                                                {item.emailThread.slice(1).map((threadItem: any) => {
                                                  const isThreadExpanded = expandedCommEmails.has(`thread-${threadItem.id}`)
                                                  return (
                                                    <div key={threadItem.id} className="rounded-md bg-white/60 border border-[#c8e6cf]">
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          setExpandedCommEmails(prev => {
                                                            const next = new Set(prev)
                                                            const key = `thread-${threadItem.id}`
                                                            next.has(key) ? next.delete(key) : next.add(key)
                                                            return next
                                                          })
                                                        }}
                                                        className="w-full text-left px-2.5 py-1.5 flex items-center justify-between gap-2"
                                                      >
                                                        <div className="min-w-0">
                                                          <span className="text-xs font-medium text-slate-700">{threadItem.from}</span>
                                                          <span className="text-[10px] text-slate-400 ml-2">{threadItem.timestamp}</span>
                                                        </div>
                                                        <ChevronDown className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${isThreadExpanded ? "rotate-180" : "rotate-0"}`} />
                                                      </button>
                                                      {isThreadExpanded && (
                                                        <div className="px-2.5 pb-2">
                                                          <p className="text-sm whitespace-pre-line text-slate-700">{highlightText(threadItem.content)}</p>
                                                          {threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
                                                            <div className="flex items-center gap-1 text-[10px] mt-1 text-green-600">
                                                              <Eye className="h-3 w-3" />
                                                              Opened at {threadItem.emailOpens[0].openedAt}
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ) : item.type === "call" ? (
                                    <details className="group/call">
                                      <summary className="flex items-center gap-2 text-slate-600 cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        <span className="text-sm">
                                          {isOutgoing ? "Outgoing call" : "Incoming call"}
                                        </span>
                                        {item.callNotes && (
                                          <span className="text-sm text-slate-400 truncate ml-1">
                                            {"- " + (item.callNotes.length > 40 ? item.callNotes.slice(0, 40) + "..." : item.callNotes)}
                                          </span>
                                        )}
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open/call:rotate-180 shrink-0 ml-auto" />
                                      </summary>
                                      <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                                        {item.callNotes && (
                                          <p className="text-sm whitespace-pre-line text-slate-700">
                                            <span className="font-medium">Notes:</span> {highlightText(item.callNotes)}
                                          </p>
                                        )}
                                        {!item.callNotes && item.message && (
                                          <p className="text-sm text-slate-700">{highlightText(item.message)}</p>
                                        )}
                                        <button
                                          type="button"
                                          className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors mt-1"
                                        >
                                          <PlayCircle className="h-4 w-4" />
                                          Play Recording
                                        </button>
                                      </div>
                                    </details>
                                  ) : (
                                    <p className="text-sm text-slate-700">
                                      {highlightText(item.fullMessage || item.message)}
                                    </p>
                                  )}

                                  {/* Timestamp */}
                                  <div className={`text-[10px] mt-2 text-slate-400 ${isOutgoing ? "text-right" : ""}`}>
                                    {item.timestamp}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                            {commTypeFilter !== "all" || commDateRange?.from || commSearchQuery
                              ? "No messages match the selected filters."
                              : "No private communications yet."}
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "email" ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <Mail className="h-3.5 w-3.5" /> Email
                          </button>
                          <button type="button" onClick={() => setCommChannel("sms")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "sms" ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <MessageSquare className="h-3.5 w-3.5" /> SMS
                          </button>
                          <button type="button" onClick={() => setCommChannel("call")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "call" ? "bg-[#E0F7F6] text-teal-800 border border-[#b8e8e6]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
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
                const allGroupMessages = selectedGroup ? [...selectedGroup.messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : []
                const groupMessages = allGroupMessages.filter(a => {
                  if (commTypeFilter !== "all" && a.type !== commTypeFilter) return false
                  if (commDateRange?.from) {
                    const msgDate = new Date(a.timestamp)
                    const from = startOfDay(commDateRange.from)
                    const to = commDateRange.to ? endOfDay(commDateRange.to) : endOfDay(commDateRange.from)
                    if (!isWithinInterval(msgDate, { start: from, end: to })) return false
                  }
                  return true
                })

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

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3 mb-3 p-2.5 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Type</span>
                        <div className="flex items-center gap-1">
                          {(["all", "email", "sms", "call"] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setCommTypeFilter(t)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                commTypeFilter === t
                                  ? t === "email"
                                    ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]"
                                    : t === "sms"
                                      ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]"
                                      : t === "call"
                                        ? "bg-[#E8EAF6] text-indigo-800 border border-[#c5cae9]"
                                        : "bg-teal-50 text-teal-700 border border-teal-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {t === "all" ? "All" : t === "email" ? "Emails" : t === "sms" ? "SMS" : "Calls"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-5 w-px bg-slate-200" />
                      <Popover open={commDatePopoverOpen} onOpenChange={setCommDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              commDateRange?.from
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {commDateRange?.from ? (
                              commDateRange.to
                                ? `${format(commDateRange.from, "MMM d")} - ${format(commDateRange.to, "MMM d, yyyy")}`
                                : format(commDateRange.from, "MMM d, yyyy")
                            ) : (
                              "Date"
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarWidget
                            mode="range"
                            selected={commDateRange}
                            onSelect={(range) => {
                              setCommDateRange(range)
                              if (range?.to) setCommDatePopoverOpen(false)
                            }}
                            numberOfMonths={1}
                          />
                          {commDateRange?.from && (
                            <div className="border-t p-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => { setCommDateRange(undefined); setCommDatePopoverOpen(false) }}
                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                      <div className="h-5 w-px bg-slate-200" />
                      <div className="relative flex-1 min-w-[140px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={commSearchQuery}
                          onChange={(e) => setCommSearchQuery(e.target.value)}
                          placeholder="Search conversations..."
                          className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                        />
                        {commSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setCommSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {(commTypeFilter !== "all" || commDateRange?.from || commSearchQuery) && (
                        <button
                          type="button"
                          onClick={() => { setCommTypeFilter("all"); setCommDateRange(undefined); setCommSearchQuery("") }}
                          className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                      <div className="flex flex-col gap-3">
                        {groupMessages.length > 0 ? groupMessages.map((item) => {
                          const isOutgoing = item.user === "Richard Surovi"
                          return (
                            <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] ${
                                isOutgoing
                                  ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                  : "rounded-tl-xl rounded-tr-xl rounded-br-xl"
                              } ${
                                item.type === "email"
                                  ? "bg-[#E6F4EA] border border-[#c8e6cf]"
                                  : isOutgoing
                                  ? "bg-[#90CAF9] border border-[#64B5F6]"
                                  : "bg-[#E3F2FD] border border-[#BBDEFB]"
                              } text-slate-900 p-3 shadow-sm`}>
                                <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                  <span className="text-xs font-medium text-slate-500">{item.user}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    item.type === "email"
                                      ? "bg-[#c8e6cf] text-green-800"
                                      : isOutgoing
                                      ? "bg-[#64B5F6] text-blue-900"
                                      : "bg-[#BBDEFB] text-blue-800"
                                  }`}>
                                    {item.type === "email" ? "Email" : "SMS"}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700">{highlightText(item.fullMessage || item.message)}</p>
                                <div className={`text-[10px] mt-2 text-slate-400 ${isOutgoing ? "text-right" : ""}`}>{item.timestamp}</div>
                              </div>
                            </div>
                          )
                        }) : (
                          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                            {commTypeFilter !== "all" || commDateRange?.from || commSearchQuery
                              ? "No messages match the selected filters."
                              : "No group messages yet."}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Group Reply Composer */}
                    <div className="border rounded-lg bg-white shrink-0">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
                        <span className="text-sm font-medium text-slate-700">Reply</span>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setCommChannel("email")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "email" ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                            <Mail className="h-3.5 w-3.5" /> Email
                          </button>
                          <button type="button" onClick={() => setCommChannel("sms")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "sms" ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
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
                    <div key={process.id} className="border rounded-lg overflow-hidden border-teal-200 bg-teal-50/30">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleProcessExpanded(process.id) }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            {expandedProcesses.includes(process.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <p 
                                className="font-medium text-[rgba(1,96,209,1)] cursor-pointer hover:underline"
                                onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}
                              >
                                {process.name}
                              </p>
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
                      {/* Expanded tasks table for newly started processes */}
                      {expandedProcesses.includes(process.id) && process.tasks && process.tasks.length > 0 && (
                        <div className="border-t bg-white px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-semibold text-muted-foreground">Task Name</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Start Date</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Completed On</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Staff Member</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => {
                                const isCompleted = !!task.completedDate
                                return (
                                  <TableRow key={task.id} className="hover:bg-muted/30">
                                    <TableCell className="text-sm font-medium">{task.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{task.startDate || "—"}</TableCell>
                                    <TableCell className={`text-sm ${isCompleted ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                                      {task.completedDate || "—"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">{task.staffName}</span>
                                        <span className="text-xs text-muted-foreground">{task.staffEmail}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Eye className="h-3 w-3" /> View
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Edit className="h-3 w-3" /> Edit
                                        </Button>
                                        {isCompleted ? (
                                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 gap-1">
                                            <Check className="h-3 w-3" /> Done
                                          </Badge>
                                        ) : (
                                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
                                            <Check className="h-3 w-3" /> Complete
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Existing in-progress processes */}
                  {leaseProspectProcesses.inProgress.map((process) => (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleProcessExpanded(process.id) }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            {expandedProcesses.includes(process.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <p 
                              className="font-medium text-[rgba(1,96,209,1)] cursor-pointer hover:underline"
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}
                            >
                              {process.name}
                            </p>
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
                      {/* Expanded tasks table for in-progress processes */}
                      {expandedProcesses.includes(process.id) && process.tasks && process.tasks.length > 0 && (
                        <div className="border-t bg-white px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-semibold text-muted-foreground">Task Name</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Start Date</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Completed On</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Staff Member</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground text-center">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => {
                                const isCompleted = !!task.completedDate
                                return (
                                  <TableRow key={task.id} className="hover:bg-muted/30">
                                    <TableCell className="text-sm font-medium">{task.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{task.startDate || "—"}</TableCell>
                                    <TableCell className={`text-sm ${isCompleted ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                                      {task.completedDate || "—"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">{task.staffName}</span>
                                        <span className="text-xs text-muted-foreground">{task.staffEmail}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Eye className="h-3 w-3" /> View
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Edit className="h-3 w-3" /> Edit
                                        </Button>
                                        {isCompleted ? (
                                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 gap-1">
                                            <Check className="h-3 w-3" /> Done
                                          </Badge>
                                        ) : (
                                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
                                            <Check className="h-3 w-3" /> Complete
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
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
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleProcessExpanded(process.id) }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            {expandedProcesses.includes(process.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <p 
                              className="font-medium text-[rgba(1,96,209,1)] cursor-pointer hover:underline"
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}
                            >
                              {process.name}
                            </p>
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
                      {/* Expanded tasks table for upcoming processes */}
                      {expandedProcesses.includes(process.id) && process.tasks && process.tasks.length > 0 && (
                        <div className="border-t bg-white px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-semibold text-muted-foreground">Task Name</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Start Date</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Completed On</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Staff Member</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => {
                                const isCompleted = !!task.completedDate
                                return (
                                  <TableRow key={task.id} className="hover:bg-muted/30">
                                    <TableCell className="text-sm font-medium">{task.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{task.startDate || "—"}</TableCell>
                                    <TableCell className={`text-sm ${isCompleted ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                                      {task.completedDate || "—"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">{task.staffName}</span>
                                        <span className="text-xs text-muted-foreground">{task.staffEmail}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Eye className="h-3 w-3" /> View
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Edit className="h-3 w-3" /> Edit
                                        </Button>
                                        {isCompleted ? (
                                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 gap-1">
                                            <Check className="h-3 w-3" /> Done
                                          </Badge>
                                        ) : (
                                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
                                            <Check className="h-3 w-3" /> Complete
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
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
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleProcessExpanded(process.id) }}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            {expandedProcesses.includes(process.id) ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                          <div>
                            <p 
                              className="font-medium text-[rgba(1,96,209,1)] cursor-pointer hover:underline"
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Prospect" })}
                            >
                              {process.name}
                            </p>
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
                      {/* Expanded tasks table for completed processes */}
                      {expandedProcesses.includes(process.id) && process.tasks && process.tasks.length > 0 && (
                        <div className="border-t bg-white px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-semibold text-muted-foreground">Task Name</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Start Date</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Completed On</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Staff Member</TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => {
                                const isCompleted = !!task.completedDate
                                return (
                                  <TableRow key={task.id} className="hover:bg-muted/30">
                                    <TableCell className="text-sm font-medium">{task.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{task.startDate || "—"}</TableCell>
                                    <TableCell className={`text-sm ${isCompleted ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                                      {task.completedDate || "—"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">{task.staffName}</span>
                                        <span className="text-xs text-muted-foreground">{task.staffEmail}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Eye className="h-3 w-3" /> View
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                          <Edit className="h-3 w-3" /> Edit
                                        </Button>
                                        {isCompleted ? (
                                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 gap-1">
                                            <Check className="h-3 w-3" /> Done
                                          </Badge>
                                        ) : (
                                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
                                            <Check className="h-3 w-3" /> Complete
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
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
      <div className="w-64 border-l border-border bg-background flex-shrink-0 sticky top-0 self-start max-h-[calc(100vh-5rem)] flex flex-col">
        {/* Upper Section - 55% - Quick Actions */}
        <div className="flex flex-col" style={{ height: '55%' }}>
          <h3 className="font-semibold text-primary px-4 py-3 border-b border-gray-100 flex-shrink-0">Quick Actions</h3>
          <div className="flex flex-col overflow-y-auto flex-1">
            <button
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-gray-100"
              onClick={() => setShowEmailModal(true)}
            >
              <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Send Email</span>
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-gray-100"
              onClick={() => setShowSMSModal(true)}
            >
              <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Send SMS</span>
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-gray-100"
              onClick={() => setShowCallModal(true)}
            >
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Make Call</span>
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-gray-100"
              onClick={() => setShowAddNoteModal(true)}
            >
              <StickyNote className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Add Note</span>
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-gray-100"
              onClick={() => setShowMeetingModal(true)}
            >
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Schedule Meeting</span>
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
              onClick={() => setShowReassignModal(true)}
            >
              <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">Reassign Lead</span>
            </button>
          </div>
        </div>

        {/* Lower Section - 45% - AI Chat */}
        <div className="flex flex-col border-t border-gray-200" style={{ height: '45%' }}>
          <div className="px-3 py-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask..."
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiChatInput.trim()) {
                    handleAiChatSubmit(aiChatInput)
                  }
                }}
                className="flex-1 h-9 text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                className={`h-9 w-9 p-0 flex-shrink-0 transition-colors ${
                  aiChatInput.trim() 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => {
                  if (aiChatInput.trim()) {
                    handleAiChatSubmit(aiChatInput)
                  }
                }}
              >
                <Send className={`h-4 w-4 ${aiChatInput.trim() ? "text-white" : "text-blue-400"}`} />
              </Button>
            </div>
          </div>
          <div className="px-3 pb-3 flex flex-col gap-1.5 overflow-y-auto flex-1">
            <button
              className="text-left text-sm text-primary hover:underline"
              onClick={() => handleAiChatSubmit("What's the current application status?")}
            >
              {"What's the current application status?"}
            </button>
            <button
              className="text-left text-sm text-primary hover:underline"
              onClick={() => handleAiChatSubmit("What documents are missing?")}
            >
              What documents are missing?
            </button>
            <button
              className="text-left text-sm text-primary hover:underline"
              onClick={() => handleAiChatSubmit("Show me available units for this prospect")}
            >
              Show me available units for this prospect
            </button>
          </div>
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
                      ? "bg-teal-100 text-teal-700 border border-teal-300"
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
                      ? "bg-green-100 text-green-700 border border-green-300"
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

      {/* Access Information Dialog */}
      <Dialog open={showAccessInfoDialog} onOpenChange={setShowAccessInfoDialog}>
        <DialogContent className="sm:max-w-[380px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-4 pb-3 border-b border-border">
            <DialogTitle className="text-base font-semibold">Access Information</DialogTitle>
            <DialogDescription className="sr-only">Choose access code type</DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4">
            {/* Lockbox Code Option */}
            <div>
              <button
                type="button"
                onClick={() => setAccessCodeType("lockbox")}
                className="flex items-center gap-2.5 mb-3"
              >
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  accessCodeType === "lockbox" ? "border-green-600 bg-white" : "border-muted-foreground/40 bg-white"
                }`}>
                  {accessCodeType === "lockbox" && <div className="h-2 w-2 rounded-full bg-green-600" />}
                </div>
                <span className="text-sm font-medium text-foreground">Lockbox Code</span>
              </button>

              <div className="pl-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded border border-border bg-white flex-1">
                    <span className="text-sm font-mono font-semibold text-foreground tracking-wider">{lockboxCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyLockboxCode}
                      className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Copy className="h-3 w-3" />
                      {lockboxCopied ? "Copied!" : "Copy Lockbox Code"}
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded border border-border bg-white flex items-center justify-center shrink-0">
                    <QrCode className="h-8 w-8 text-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* ShowMojo Code Option */}
            <div>
              <button
                type="button"
                onClick={() => setAccessCodeType("showmojo")}
                className="flex items-center gap-2.5"
              >
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  accessCodeType === "showmojo" ? "border-green-600 bg-white" : "border-muted-foreground/40 bg-white"
                }`}>
                  {accessCodeType === "showmojo" && <div className="h-2 w-2 rounded-full bg-green-600" />}
                </div>
                <span className="text-sm font-medium text-foreground">ShowMojo Code</span>
              </button>

              <div className="pl-6 mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Expires on Feb 23, 2026<br />
                  5:00 AM EST
                </p>
                <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Generate New Code
                  </button>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-muted/30">
            <Button
              size="sm"
              onClick={handleCopyLockboxCode}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share Lockbox Code
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              Share Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generate New Code Dialog */}
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
            <DialogDescription className="sr-only">Select recipients and method to share {shareLinksType === "lockbox" ? "Lockbox Code" : "ShowMojo Code"}</DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Email To Section */}
            <div>
              
              <div className="grid grid-cols-2 gap-2">
                {shareRecipientOptions.map(({ id, label, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleShareLinkRecipientToggle(id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border transition-all text-left ${
                      shareLinkRecipients[id]
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm ${
                  shareLinkMethod.email
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-border bg-white text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm ${
                  shareLinkMethod.sms
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-border bg-white text-muted-foreground hover:bg-muted/30"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                SMS
              </button>
            </div>

            {/* Message */}
            <Textarea
              placeholder="Add message..."
              value={shareLinkMessage}
              onChange={(e) => setShareLinkMessage(e.target.value)}
              className="min-h-[80px] resize-none text-sm border-border"
            />
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30">
            <Button variant="outline" size="sm" onClick={() => setShowShareLinksDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSendShareLink}
              disabled={!Object.values(shareLinkRecipients).some(Boolean) || (!shareLinkMethod.email && !shareLinkMethod.sms)}
              className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
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
              Add a new custom field to the {customFieldData.section} section. All custom fields are available for reporting.
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
                onClick={() => setCustomFieldData({ ...customFieldData, isRequired: !customFieldData.isRequired })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  customFieldData.isRequired ? "bg-teal-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    customFieldData.isRequired ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-blue-700">This field will be available in Owner Directory reports</span>
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
                // Handle adding the custom field
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

      {/* Share Links Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
            <DialogTitle className="text-base font-semibold">Share Links</DialogTitle>
            <DialogDescription className="sr-only">Select recipients to share {shareLinkType}</DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Email To Section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">Email To:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "Leasing Prospect", label: "Leasing Prospect", color: "bg-success" },
                  { key: "Owner", label: "Owner", color: "bg-destructive" },
                  { key: "CSR", label: "CSR", color: "bg-muted-foreground" },
                  { key: "CSM", label: "CSM", color: "bg-warning" },
                  { key: "Leasing Coordinator (L)", label: "Leasing Coordinator", color: "bg-chart-2" },
                  { key: "Leasing Coordinator (R)", label: "Leasing Coordinator", color: "bg-chart-4" },
                  { key: "Leasing Manager", label: "Leasing Manager", color: "bg-muted-foreground/80" },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleShareRecipient(key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all text-left ${
                      shareRecipients[key]
                        ? "border-success/40 bg-success/5 shadow-sm"
                        : "border-border bg-background hover:border-muted-foreground/20 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full ${color} flex items-center justify-center shrink-0`}>
                      <User className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm text-foreground truncate flex-1">{label}</span>
                    <Checkbox
                      checked={shareRecipients[key]}
                      onCheckedChange={() => toggleShareRecipient(key)}
                      className="shrink-0 data-[state=checked]:bg-success data-[state=checked]:border-success"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <Textarea
              placeholder="Add message..."
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              className="min-h-[56px] resize-none text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/50">
            <Button variant="outline" size="sm" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => setShowShareDialog(false)}
              disabled={!Object.values(shareRecipients).some(Boolean)}
              className="bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TenantApplicationDetailView
