"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import type React from "react"

import { useMemo, useState } from "react"
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
import { SMSPopupModal } from "./sms-popup-modal"
import { EmailPopupModal } from "./email-popup-modal"
import { useNav } from "@/app/dashboard/page"
import { useQuickActions } from "@/context/QuickActionsContext"
import { getOwnerContactQuickActions } from "@/lib/quickActions"

type ContactType = "Owner" | "Tenant" | "Vendor" | "Property Technician" | "Leasing Agent"
type ContactStatus = "Active" | "Inactive" | "Pending"

interface Contact {
  id: string
  name: string
  type: ContactType
  email: string
  phone: string
  avatar?: string
  properties: string[]
  status: ContactStatus
  lastActive: string
  assignedStaff: string
  location: string
  source?: string
  specialty?: string
  company?: string
}

interface ContactOwnerDetailPageProps {
  contact: Contact
  onBack: () => void
  onNavigateToProperty?: (propertyName: string) => void
}

const STAFF_LIST = [
  { id: "1", name: "Richard Surovi", initials: "RS" },
  { id: "2", name: "Sarah Johnson", initials: "SJ" },
  { id: "3", name: "Mike Chen", initials: "MC" },
  { id: "4", name: "Emily Davis", initials: "ED" },
  { id: "5", name: "James Wilson", initials: "JW" },
  { id: "6", name: "Nina Patel", initials: "NP" },
]

// Owner Financial Data Constants
const FEDERAL_TAX_INFO = {
  taxpayerName: "Irtaza Ali khan",
  taxpayerId: "XXX-XX-9999",
  taxFormAccountNumber: "T81908155614330 9062",
  send1099: "Yes",
  ownerConsentedElectronic1099: "No",
  sending1099Preference: "Paper & Electronic",
}

const ACCOUNTING_INFO = {
  checkConsolidation: "All bills on single check (hide extra stub detail)",
  checkStubBreakdown: "List each bill detail line item (expanded view)",
  holdPayments: "No",
  emailECheckReceipt: "Yes",
  defaultCheckMemo: "--",
}

const BANK_ACCOUNT_INFO = {
  ownerPaidByACH: "No",
  bankRoutingNumber: "--",
  bankAccountNumber: "--",
  savingsAccount: "No",
}

const OWNER_STATEMENT_INFO = {
  showTransactionsDetail: "Yes",
  showUnpaidBillsDetail: "Yes",
  showTenantNames: "Yes",
  showSummary: "Yes",
  separateManagementFeesFromCashOut: "No",
  consolidateInHouseWorkOrderBillLineItems: "No",
  notesForTheOwner: "--",
}

const OWNER_PACKET_INFO = {
  sendViaEmail: "Yes",
  includePaidWorkOrders: "No",
  includePaidWorkOrdersAttachments: "No",
  includePaidBillsAttachments: "No",
  glAccountMap: "None",
  includedReports: "Owner Statement (Enhanced)",
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

type CommunicationType = "email" | "sms" | "call" | "note"

interface CommunicationItem {
  id: string
  type: CommunicationType
  timestamp: string
  fullDate: string
  date: Date
  isRead: boolean
  isIncoming: boolean
  isResponded?: boolean // For tracking if incoming communications have been responded to
  isGroupChat?: boolean // For filtering Private Chat vs Group Chat
  groupParticipants?: string[] // List of participants for group chats
  unreadCount?: number // Unread message count for group chats
  from: {
    name: string
    contact: string // phone or email
  }
  to: {
    name: string
    contact: string
  }
  // Content preview
  preview: string
  // Email specific
  subject?: string
  thread?: {
    id: string
    from: string
    email: string
    content: string
    timestamp: string
    fullDate: string
    isIncoming: boolean
    emailOpens?: { openedAt: string }[]
    attachments?: unknown[]
  }[]
  // SMS/Note specific
  content?: string
  fullContent?: string
  // Call specific
  duration?: string
  appfolioLink?: string
  notes?: string
}

const getCommunications = (ownerName: string, ownerPhone: string, ownerEmail: string): CommunicationItem[] => {
  const staffName = "Richard Surovi"
  const staffPhone = "(216) 810-2564"
  const staffEmail = "richard@b2bpm.com"

  return [
    {
      id: "s1",
      type: "sms",
      from: { name: staffName, contact: staffPhone },
      to: { name: ownerName, contact: ownerPhone },
      preview: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out of future messages.",
      content: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out of future messages.",
      timestamp: "12/4/2025, 12:24 PM",
      fullDate: "12/4/2025, 12:24 PM",
      date: new Date("2025-12-04T12:24:00"),
      isRead: true,
      isIncoming: false,
    },
    {
      id: "s2",
      type: "sms",
      from: { name: ownerName, contact: ownerPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon.",
      content: "Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon.",
      timestamp: "12/4/2025, 12:22 PM",
      fullDate: "12/4/2025, 12:22 PM",
      date: new Date("2025-12-04T12:22:00"),
      isRead: false,
      isIncoming: true,
    },
    {
      id: "n1",
      type: "note",
      from: { name: staffName, contact: "" },
      to: { name: ownerName, contact: "" },
      preview: "Sent text",
      content: "Sent text message to follow up on property management proposal.",
      timestamp: "12/4/2025, 11:46 AM",
      fullDate: "12/4/2025, 11:46 AM",
      date: new Date("2025-12-04T11:46:00"),
      isRead: true,
      isIncoming: false,
    },
    {
      id: "c1",
      type: "call",
      from: { name: staffName, contact: staffPhone },
      to: { name: ownerName, contact: ownerPhone },
      preview: "Left voicemail about property management services. Call lasted 2 minutes.",
      duration: "2 minutes",
      timestamp: "12/4/2025, 10:30 AM",
      fullDate: "12/4/2025, 10:30 AM",
      date: new Date("2025-12-04T10:30:00"),
      isRead: true,
      isIncoming: false,
      appfolioLink: "https://appfolio.com/calls/12345",
      notes:
        "Left voicemail about property management services. Mentioned our competitive rates and comprehensive services including tenant placement, maintenance coordination, and financial reporting.",
    },
    {
      id: "s3",
      type: "sms",
      from: { name: staffName, contact: staffPhone },
      to: { name: ownerName, contact: ownerPhone },
      preview: `Hi ${ownerName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday, indicating that if you w...`,
      content: `Hi ${ownerName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday, indicating that if you would like to discuss property management services, I would be happy to schedule a call at your convenience.`,
      timestamp: "11/29/2025, 9:50 PM",
      fullDate: "11/29/2025, 9:50 PM",
      date: new Date("2025-11-29T21:50:00"),
      isRead: true,
      isIncoming: false,
    },
    {
      id: "e1",
      type: "email",
      from: { name: staffName, contact: staffEmail },
      to: { name: ownerName, contact: ownerEmail },
      subject: "Follow-up: Property Management Proposal",
      preview: "Sent follow-up email regarding property management proposal and pricing details.",
      timestamp: "11/28/2025, 3:15 PM",
      fullDate: "11/28/2025, 3:15 PM",
      date: new Date("2025-11-28T15:15:00"),
      isRead: true,
      isIncoming: false,
      thread: [
        {
          id: "e1-1",
          from: staffName,
          email: staffEmail,
          content: `Hi ${ownerName.split(" ")[0]},

Thank you for your interest in our property management services. I wanted to follow up on our initial conversation and provide you with our pricing details.

Our standard management fee is 8% of monthly rent collected, which includes:
- Tenant screening and placement
- Rent collection
- Maintenance coordination
- Monthly financial statements
- 24/7 emergency support

Please let me know if you have any questions or would like to schedule a call to discuss further.

Best regards,
Richard Surovi
B2B Property Management`,
          timestamp: "11/28/2025, 3:15 PM",
          fullDate: "11/28/2025, 3:15 PM",
          isIncoming: false,
          emailOpens: [
            { openedAt: "11/28/2025, 4:32 PM" },
            { openedAt: "11/29/2025, 9:15 AM" },
          ],
        },
        {
          id: "e1-2",
          from: ownerName,
          email: ownerEmail,
          content: `Hi Richard,

Thank you for sending over the details. The pricing looks reasonable. I have a few questions:

1. What is your average time to fill a vacancy?
2. Do you handle evictions if needed?
3. Can I see sample monthly reports?

Looking forward to your response.

Best,
${ownerName}`,
          timestamp: "11/29/2025, 10:30 AM",
          fullDate: "11/29/2025, 10:30 AM",
          isIncoming: true,
        },
        {
          id: "e1-3",
          from: staffName,
          email: staffEmail,
          content: `Hi ${ownerName.split(" ")[0]},

Great questions! Here are the answers:

1. Our average vacancy fill time is 21 days
2. Yes, we handle the entire eviction process if needed
3. I've attached a sample monthly report for your review

Would you like to schedule a call this week to go over everything in detail?

Best,
Richard`,
          timestamp: "11/29/2025, 2:45 PM",
          fullDate: "11/29/2025, 2:45 PM",
          isIncoming: false,
          emailOpens: [{ openedAt: "11/29/2025, 3:10 PM" }],
        },
      ],
    },
    {
      id: "c2",
      type: "call",
      from: { name: staffName, contact: staffPhone },
      to: { name: ownerName, contact: ownerPhone },
      preview: "Initial discovery call - discussed property management needs.",
      duration: "15 minutes",
      timestamp: "11/25/2025, 11:00 AM",
      fullDate: "11/25/2025, 11:00:00",
      date: new Date("2025-11-25T11:00:00"),
      isRead: true,
      isIncoming: false,
      isResponded: true,
      appfolioLink: "https://appfolio.com/calls/12346",
      notes:
        "Initial discovery call with property owner. Discussed their portfolio of 2 rental properties in San Francisco. Owner expressed interest in full-service management including tenant placement, maintenance coordination, and financial reporting. Scheduled follow-up email with pricing details.",
    },
    // Additional communications for filter coverage
    {
      id: "e2",
      type: "email",
      from: { name: ownerName, contact: ownerEmail },
      to: { name: staffName, contact: staffEmail },
      subject: "Question about maintenance fees",
      preview: "Hi Richard, I have a question about the maintenance fees mentioned in the proposal...",
      timestamp: "12/5/2025, 9:30 AM",
      fullDate: "12/5/2025, 9:30 AM",
      date: new Date("2025-12-05T09:30:00"),
      isRead: false,
      isIncoming: true,
      isResponded: false,
      thread: [
        {
          id: "e2-1",
          from: ownerName,
          email: ownerEmail,
          content: `Hi Richard,

I have a question about the maintenance fees mentioned in the proposal. Are emergency repairs included in the 8% management fee, or is that billed separately?

Also, what is your typical response time for maintenance requests?

Thanks,
${ownerName}`,
          timestamp: "12/5/2025, 9:30 AM",
          fullDate: "12/5/2025, 9:30 AM",
          isIncoming: true,
        },
      ],
    },
    {
      id: "s4",
      type: "sms",
      from: { name: ownerName, contact: ownerPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Can we reschedule our call to tomorrow afternoon?",
      content: "Can we reschedule our call to tomorrow afternoon? Something came up today.",
      timestamp: "12/5/2025, 2:15 PM",
      fullDate: "12/5/2025, 2:15 PM",
      date: new Date("2025-12-05T14:15:00"),
      isRead: true,
      isIncoming: true,
      isResponded: false,
    },
    {
      id: "c3",
      type: "call",
      from: { name: ownerName, contact: ownerPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Missed call from owner - no voicemail left.",
      duration: "0 minutes",
      timestamp: "12/5/2025, 4:45 PM",
      fullDate: "12/5/2025, 4:45 PM",
      date: new Date("2025-12-05T16:45:00"),
      isRead: true,
      isIncoming: true,
      isResponded: false,
      notes: "Missed call from owner. Need to return call.",
    },
    {
      id: "n2",
      type: "note",
      from: { name: staffName, contact: "" },
      to: { name: ownerName, contact: "" },
      preview: "Owner interested in adding second property to management",
      content: "Owner mentioned during our last call that they have another property they may want us to manage. Follow up next week to discuss details.",
      timestamp: "12/3/2025, 3:00 PM",
      fullDate: "12/3/2025, 3:00 PM",
      date: new Date("2025-12-03T15:00:00"),
      isRead: true,
      isIncoming: false,
    },
    {
      id: "s5",
      type: "sms",
      from: { name: ownerName, contact: ownerPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Just received the inspection report. Thanks!",
      content: "Just received the inspection report. Thanks for getting that done so quickly!",
      timestamp: "12/2/2025, 11:20 AM",
      fullDate: "12/2/2025, 11:20 AM",
      date: new Date("2025-12-02T11:20:00"),
      isRead: false,
      isIncoming: true,
      isResponded: false,
    },
    // Group Chat Communications
    {
      id: "g1",
      type: "sms",
      from: { name: "Nina Patel", contact: "(216) 555-1234" },
      to: { name: "Property Team", contact: "" },
      preview: "Team, we need to coordinate the inspection schedule for the owner's properties.",
      content: "Team, we need to coordinate the inspection schedule for the owner's properties. Can everyone confirm their availability for next week?",
      timestamp: "12/6/2025, 10:00 AM",
      fullDate: "12/6/2025, 10:00 AM",
      date: new Date("2025-12-06T10:00:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", ownerName],
      unreadCount: 5,
    },
    {
      id: "g2",
      type: "sms",
      from: { name: staffName, contact: staffPhone },
      to: { name: "Property Team", contact: "" },
      preview: "I'm available Tuesday and Thursday afternoon.",
      content: "I'm available Tuesday and Thursday afternoon. Let me know what works best for everyone.",
      timestamp: "12/6/2025, 10:15 AM",
      fullDate: "12/6/2025, 10:15 AM",
      date: new Date("2025-12-06T10:15:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", ownerName],
      unreadCount: 0,
    },
    {
      id: "g3",
      type: "email",
      from: { name: "Sarah Johnson", contact: "sarah@b2bpm.com" },
      to: { name: "Property Management Team", contact: "" },
      subject: "Q4 Property Portfolio Review - Action Items",
      preview: "Hi team, following up on our meeting regarding the portfolio review...",
      timestamp: "12/5/2025, 3:30 PM",
      fullDate: "12/5/2025, 3:30 PM",
      date: new Date("2025-12-05T15:30:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Sarah Johnson", "Richard Surovi", "Nina Patel", "Mike Davis", ownerName],
      unreadCount: 8,
      thread: [
        {
          id: "g3-1",
          from: "Sarah Johnson",
          email: "sarah@b2bpm.com",
          content: `Hi team,

Following up on our meeting regarding the portfolio review. Here are the action items:

1. Richard - Schedule property inspections for next week
2. Nina - Prepare financial summaries for owner review
3. Mike - Coordinate with maintenance vendors

Please update the shared tracker by Friday.

Thanks,
Sarah`,
          timestamp: "12/5/2025, 3:30 PM",
          fullDate: "12/5/2025, 3:30 PM",
          isIncoming: false,
        },
      ],
    },
    {
      id: "g4",
      type: "sms",
      from: { name: ownerName, contact: ownerPhone },
      to: { name: "Property Team", contact: "" },
      preview: "Thanks for the update everyone. I'll be available on Thursday.",
      content: "Thanks for the update everyone. I'll be available on Thursday for the inspection. Please confirm the time.",
      timestamp: "12/6/2025, 11:30 AM",
      fullDate: "12/6/2025, 11:30 AM",
      date: new Date("2025-12-06T11:30:00"),
      isRead: false,
      isIncoming: true,
      isGroupChat: true,
      groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", ownerName],
      unreadCount: 2,
    },
    {
      id: "g5",
      type: "email",
      from: { name: "Mike Davis", contact: "mike@b2bpm.com" },
      to: { name: "Vendor Coordination Group", contact: "" },
      subject: "Re: HVAC Maintenance Schedule - Multiple Properties",
      preview: "The vendor has confirmed availability for all three properties...",
      timestamp: "12/4/2025, 2:00 PM",
      fullDate: "12/4/2025, 2:00 PM",
      date: new Date("2025-12-04T14:00:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Mike Davis", "Richard Surovi", "ABC HVAC Services", ownerName],
      unreadCount: 0,
      thread: [
        {
          id: "g5-1",
          from: "Mike Davis",
          email: "mike@b2bpm.com",
          content: `Team,

The vendor has confirmed availability for all three properties. Schedule as follows:
- Property A: Monday 9 AM
- Property B: Monday 2 PM  
- Property C: Tuesday 10 AM

${ownerName}, please ensure access is available at these times.

Best,
Mike`,
          timestamp: "12/4/2025, 2:00 PM",
          fullDate: "12/4/2025, 2:00 PM",
          isIncoming: false,
        },
      ],
    },
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
}

interface Document {
  id: string
  name: string
  receivedDate: string
  receivedTime: string
  type: string
  size: string
  url: string
  propertyName: string
  propertyAddress: string
}

const getDocuments = (): Document[] => [
  {
    id: "doc1",
    name: "Management Agreement - Signed.pdf",
    receivedDate: "12/03/2025",
    receivedTime: "2:30 PM",
    type: "PDF",
    size: "245 KB",
    url: "#",
    propertyName: "Oak Manor",
    propertyAddress: "123 Oak Street, San Francisco, CA",
  },
  {
    id: "doc2",
    name: "Property Inspection Report.pdf",
    receivedDate: "11/28/2025",
    receivedTime: "10:15 AM",
    type: "PDF",
    size: "1.2 MB",
    url: "#",
    propertyName: "Maple Heights",
    propertyAddress: "456 Maple Ave, San Francisco, CA",
  },
  {
    id: "doc3",
    name: "Insurance Certificate 2025.pdf",
    receivedDate: "11/25/2025",
    receivedTime: "4:45 PM",
    type: "PDF",
    size: "890 KB",
    url: "#",
    propertyName: "Pine View Apartments",
    propertyAddress: "789 Pine Road, San Francisco, CA",
  },
  {
    id: "doc4",
    name: "W-9 Form.pdf",
    receivedDate: "11/20/2025",
    receivedTime: "11:00 AM",
    type: "PDF",
    size: "156 KB",
    url: "#",
    propertyName: "Oak Manor",
    propertyAddress: "123 Oak Street, San Francisco, CA",
  },
]

interface Task {
  id: string
  title: string
  description?: string
  processName: string
  relatedEntityType: "Tenant" | "Property" | "Lease Prospect" | "Owner" | "Prospect Owner"
  relatedEntityName: string
  assignee: string
  assigneeAvatar?: string
  status: "Pending" | "In Progress" | "Completed" | "Skipped"
  priority: "Low" | "Medium" | "High"
  dueDate: string
  isOverdue: boolean
  autoCreated?: boolean
  createdDate?: string
  propertyName?: string
  propertyAddress?: string
}

const getTasks = (): Task[] => [
  {
    id: "task1",
    title: "Follow up with tenant - Unit 204 lease renewal",
    processName: "Lease Renewal Process",
    relatedEntityType: "Tenant",
    relatedEntityName: "John Smith",
    assignee: "Nina Patel",
    status: "Pending",
    priority: "High",
    dueDate: "2025-12-20",
    isOverdue: true,
  },
  {
    id: "task2",
    title: "Finish Move-out tenant in Appfolio and update property",
    processName: "Move Out for 123 Oak Street",
    relatedEntityType: "Property",
    relatedEntityName: "Maple Heights",
    assignee: "Richard Surovi",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-12-21",
    isOverdue: true,
  },
  {
    id: "task3",
    title: "Review rental application - Sarah Johnson",
    processName: "Lease Prospect Onboarding",
    relatedEntityType: "Lease Prospect",
    relatedEntityName: "Sarah Johnson",
    assignee: "Nina Patel",
    status: "Pending",
    priority: "High",
    dueDate: "2025-12-23",
    isOverdue: false,
  },
  {
    id: "task4",
    title: "Schedule maintenance for HVAC - Oak Manor",
    processName: "",
    relatedEntityType: "Property",
    relatedEntityName: "Oak Manor",
    assignee: "Mike Johnson",
    status: "Pending",
    priority: "Medium",
    dueDate: "2025-12-23",
    isOverdue: false,
  },
  {
    id: "task5",
    title: "Send lease agreement - Unit 305",
    processName: "New Lease Signing",
    relatedEntityType: "Lease Prospect",
    relatedEntityName: "Unit 305",
    assignee: "Sarah Chen",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-12-24",
    isOverdue: false,
  },
  {
    id: "task6",
    title: "Call owner about property updates",
    processName: "Owner Quarterly Review",
    relatedEntityType: "Owner",
    relatedEntityName: "Mike Davis",
    assignee: "Richard Surovi",
    status: "Skipped",
    priority: "Low",
    dueDate: "2025-12-25",
    isOverdue: false,
  },
  {
    id: "task7",
    title: "Process security deposit refund",
    processName: "Move Out Process",
    relatedEntityType: "Tenant",
    relatedEntityName: "Emily Brown",
    assignee: "Nina Patel",
    status: "Pending",
    priority: "Medium",
    dueDate: "2025-12-26",
    isOverdue: false,
  },
  {
    id: "task8",
    title: "Update property listing photos",
    processName: "",
    relatedEntityType: "Property",
    relatedEntityName: "Pine View Apts",
    assignee: "Mike Johnson",
    status: "Pending",
    priority: "Low",
    dueDate: "2025-12-27",
    isOverdue: false,
  },
  {
    id: "task9",
    title: "Follow up on unread email",
    processName: "Owner Prospect Outreach",
    relatedEntityType: "Prospect Owner",
    relatedEntityName: "James Wilson",
    assignee: "Sarah Chen",
    status: "Pending",
    priority: "Medium",
    dueDate: "2025-12-23",
    isOverdue: false,
    autoCreated: true,
  },
  {
    id: "task10",
    title: "Respond to SMS",
    processName: "",
    relatedEntityType: "Tenant",
    relatedEntityName: "Robert Garcia",
    assignee: "Nina Patel",
    status: "Pending",
    priority: "Low",
    dueDate: "2025-12-24",
    isOverdue: false,
    autoCreated: true,
  },
]

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

const teamMembers: TeamMember[] = [
  { id: "1", name: "Nina Patel", role: "Property Manager", avatar: "NP" },
  { id: "2", name: "Richard Surovi", role: "Leasing Agent", avatar: "RS" },
  { id: "3", name: "Sarah Johnson", role: "Maintenance Coordinator", avatar: "SJ" },
  { id: "4", name: "Mike Chen", role: "Accountant", avatar: "MC" },
  { id: "5", name: "Emily Davis", role: "Admin Assistant", avatar: "ED" },
]

interface Property {
  id: string
  name: string
  address: string
  type: "Single Family" | "Multi Family" | "Commercial" | "Condo"
  units: number
  monthlyRent: number
  status: "Active" | "Vacant" | "Under Maintenance"
  image?: string
  ownershipType?: "LLC" | "Partnership" | "Personal"
  ownershipEntity?: string
}

const getOwnerProperties = (): Property[] => [
  {
    id: "p1",
    name: "Sunset Villa",
    address: "123 Sunset Blvd, San Francisco, CA 94102",
    type: "Single Family",
    units: 1,
    monthlyRent: 4500,
    status: "Active",
    ownershipType: "LLC",
    ownershipEntity: "Sunset Holdings LLC",
  },
  {
    id: "p2",
    name: "Harbor View Apartments",
    address: "456 Harbor Way, San Francisco, CA 94103",
    type: "Multi Family",
    units: 8,
    monthlyRent: 24000,
    status: "Active",
    ownershipType: "LLC",
    ownershipEntity: "Bay Area Properties LLC",
  },
  {
    id: "p3",
    name: "Downtown Loft",
    address: "789 Market St, San Francisco, CA 94104",
    type: "Condo",
    units: 1,
    monthlyRent: 3200,
    status: "Vacant",
    ownershipType: "Partnership",
    ownershipEntity: "Anderson & Burke Partners",
  },
  {
    id: "p4",
    name: "Beach Condo",
    address: "101 Ocean Ave, San Francisco, CA 94112",
    type: "Condo",
    units: 1,
    monthlyRent: 3800,
    status: "Active",
  },
  {
    id: "p5",
    name: "Marina District Townhouse",
    address: "2250 Chestnut St, San Francisco, CA 94123",
    type: "Single Family",
    units: 1,
    monthlyRent: 5200,
    status: "Active",
    ownershipType: "LLC",
    ownershipEntity: "Sunset Holdings LLC",
  },
  {
    id: "p6",
    name: "Nob Hill Flats",
    address: "950 California St, San Francisco, CA 94108",
    type: "Multi Family",
    units: 4,
    monthlyRent: 14000,
    status: "Under Maintenance",
    ownershipType: "Partnership",
    ownershipEntity: "Anderson & Burke Partners",
  },
]

// Assigned team data for team management popup
interface AssignedTeamMember {
  id: string
  name: string
  email: string
  role: string
  assignedOn: string
}

const initialAssignedTeam: AssignedTeamMember[] = [
  { id: "1", name: "Richard Surovi", email: "richard.surovi@company.com", role: "CSR", assignedOn: "Jan 12, 2026" },
  { id: "2", name: "Nina Patel", email: "nina.patel@company.com", role: "Property Manager", assignedOn: "Jan 10, 2026" },
  { id: "3", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Maintenance Coordinator", assignedOn: "Jan 10, 2026" },
  { id: "4", name: "Mike Chen", email: "mike.chen@company.com", role: "Accountant", assignedOn: "Jan 8, 2026" },
  { id: "5", name: "Emily Davis", email: "emily.davis@company.com", role: "Admin Assistant", assignedOn: "Jan 5, 2026" },
  { id: "6", name: "James Wilson", email: "james.wilson@company.com", role: "Leasing Agent", assignedOn: "Jan 3, 2026" },
]

// All available staff for reassignment
const allStaffMembers = [
  { id: "1", name: "Richard Surovi", email: "richard.surovi@company.com" },
  { id: "2", name: "Nina Patel", email: "nina.patel@company.com" },
  { id: "3", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "4", name: "Mike Chen", email: "mike.chen@company.com" },
  { id: "5", name: "Emily Davis", email: "emily.davis@company.com" },
  { id: "6", name: "James Wilson", email: "james.wilson@company.com" },
  { id: "7", name: "David Brown", email: "david.brown@company.com" },
  { id: "8", name: "Lisa Anderson", email: "lisa.anderson@company.com" },
  { id: "9", name: "Robert Taylor", email: "robert.taylor@company.com" },
  { id: "10", name: "Jennifer Martinez", email: "jennifer.martinez@company.com" },
]

// Active processes data for Processes Summary section
interface ActiveProcess {
  id: string
  processName: string
  property: string
  currentStage: string
  assignedRole: string
  lastUpdated: string
}

const getActiveProcesses = (): ActiveProcess[] => [
  {
    id: "proc1",
    processName: "Owner Onboarding",
    property: "Sunset Villa",
    currentStage: "Financial Paperwork",
    assignedRole: "Accounting",
    lastUpdated: "Jan 12, 2026",
  },
  {
    id: "proc2",
    processName: "Maintenance Intake",
    property: "Harbor View Apartments",
    currentStage: "Work Order Review",
    assignedRole: "Operations",
    lastUpdated: "Jan 10, 2026",
  },
  {
    id: "proc3",
    processName: "Lease Renewal",
    property: "Downtown Loft",
    currentStage: "Tenant Notification",
    assignedRole: "Leasing",
    lastUpdated: "Jan 8, 2026",
  },
  {
    id: "proc4",
    processName: "Property Inspection",
    property: "Harbor View Apartments",
    currentStage: "Scheduling",
    assignedRole: "Property Management",
    lastUpdated: "Jan 6, 2026",
  },
]

const ownerProcesses = {
  inProgress: getActiveProcesses().slice(0, 2),
  upcoming: getActiveProcesses().slice(2, 3),
  completed: getActiveProcesses().slice(3),
}

// Audit log data for contact-related events
const contactAuditLogs = [
  {
    id: "1",
    dateTime: "Jan 18, 2026 – 10:42 AM",
    user: "Sarah Johnson",
    userRole: "Property Manager",
    actionType: "Updated",
    entity: "Contact Info",
    description: "Updated primary phone number from (555) 111-2222 to (555) 123-4567",
    source: "Web",
  },
  {
    id: "2",
    dateTime: "Jan 17, 2026 – 3:15 PM",
    user: "Richard Surovi",
    userRole: "Leasing Agent",
    actionType: "Updated",
    entity: "Assignee",
    description: "Changed assignee from Nina Patel to Richard Surovi",
    source: "Web",
  },
  {
    id: "3",
    dateTime: "Jan 16, 2026 – 11:30 AM",
    user: "Mike Davis",
    userRole: "Admin",
    actionType: "Created",
    entity: "Note",
    description: "Added internal note regarding property management discussion",
    source: "Web",
  },
  {
    id: "4",
    dateTime: "Jan 15, 2026 – 2:45 PM",
    user: "Nina Patel",
    userRole: "Property Manager",
    actionType: "Created",
    entity: "Document",
    description: "Uploaded Management Agreement - Signed.pdf",
    source: "Web",
  },
  {
    id: "5",
    dateTime: "Jan 14, 2026 – 9:00 AM",
    user: "System",
    userRole: "Automation",
    actionType: "Logged",
    entity: "Communication",
    description: "Email sent: Follow-up: Property Management Proposal",
    source: "System",
  },
  {
    id: "6",
    dateTime: "Jan 12, 2026 – 4:20 PM",
    user: "Richard Surovi",
    userRole: "Leasing Agent",
    actionType: "Logged",
    entity: "Communication",
    description: "Outbound call logged - Duration: 15 minutes",
    source: "Web",
  },
  {
    id: "7",
    dateTime: "Jan 10, 2026 – 10:00 AM",
    user: "Nina Patel",
    userRole: "Property Manager",
    actionType: "Created",
    entity: "Contact",
    description: "Contact record created",
    source: "Web",
  },
  {
    id: "8",
    dateTime: "Jan 11, 2026 – 2:30 PM",
    user: "Sarah Johnson",
    userRole: "Property Manager",
    actionType: "Deleted",
    entity: "Note",
    description: "Deleted note: 'Follow-up on property inspection'",
    source: "Web",
    deletedNoteContent: "Scheduled property inspection for next Tuesday at 2 PM. Owner mentioned concerns about HVAC system performance and requested a detailed report on the condition of all appliances. Need to coordinate with maintenance team to ensure all areas are accessible. Follow up with owner 24 hours before inspection to confirm.",
    deletedBy: "Sarah Johnson",
    deletedOn: "Jan 11, 2026 – 2:30 PM",
  },
  {
    id: "9",
    dateTime: "Jan 8, 2026 – 11:15 AM",
    user: "Richard Surovi",
    userRole: "Leasing Agent",
    actionType: "Deleted",
    entity: "Note",
    description: "Deleted note: 'Duplicate entry - rent increase discussion'",
    source: "Web",
    deletedNoteContent: "Discussed potential rent increase for next lease term with owner. Owner is open to 5% increase but wants to review market comparisons first. Note: This entry was a duplicate - original note with full details already exists in the system under Jan 5th entries.",
    deletedBy: "Richard Surovi",
    deletedOn: "Jan 8, 2026 – 11:15 AM",
  },
]



export default function ContactOwnerDetailPage({ contact, onBack, onNavigateToProperty }: ContactOwnerDetailPageProps) {
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
  const [tasks, setTasks] = useState<Task[]>(getTasks())
  const [viewTaskModalOpen, setViewTaskModalOpen] = useState(false)
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showDeletedNoteModal, setShowDeletedNoteModal] = useState(false)
  const [selectedDeletedNote, setSelectedDeletedNote] = useState<{
    content: string
    deletedBy: string
    deletedOn: string
  } | null>(null)

  const [isTasksExpanded, setIsTasksExpanded] = useState(true)
  const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(true)

  const ownerQuickActions = useMemo(
    () =>
      getOwnerContactQuickActions({
        onAddNote: () => setShowAddNoteModal(true),
      }),
    []
  )
  useQuickActions(ownerQuickActions, { subtitle: "Owner" })

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
  const [selectedSMSItem, setSelectedSMSItem] = useState<ReturnType<typeof getCommunications>[0] | null>(null)

  // Email Modal state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedEmailItem, setSelectedEmailItem] = useState<ReturnType<typeof getCommunications>[0] | null>(null)

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
  type CustomFieldType = "text" | "number" | "date" | "dropdown" | "yes_no"

  interface CustomField {
    id: string
    name: string
    type: CustomFieldType
    section: string
    value: string
    isMandatory: boolean
    options?: string[] // For dropdown fields
  }

  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false)
  const [customFieldSection, setCustomFieldSection] = useState("")
  const [newCustomField, setNewCustomField] = useState({
    name: "",
    type: "text" as CustomFieldType,
    isMandatory: false,
    options: "",
  })

  // Custom fields organized by section
  const [customFields, setCustomFields] = useState<CustomField[]>([
    // Sample custom fields to demonstrate the feature
    { id: "cf1", name: "Preferred Communication Time", type: "dropdown", section: "federal-tax", value: "Morning", isMandatory: false, options: ["Morning", "Afternoon", "Evening"] },
    { id: "cf2", name: "Property Management Start Date", type: "date", section: "accounting", value: "2024-01-15", isMandatory: true },
    { id: "cf3", name: "Owner Portal Access", type: "yes_no", section: "owner-packet", value: "Yes", isMandatory: false },
  ])

  const availableSections = [
    { id: "federal-tax", name: "Federal Tax" },
    { id: "accounting", name: "Accounting Information" },
    { id: "bank-account", name: "Bank Account Information" },
    { id: "owner-statement", name: "Owner Statement (Enhanced)" },
    { id: "owner-packet", name: "Owner Packet" },
    { id: "management-agreements", name: "Management Agreements" },
  ]

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

  const communications = getCommunications(contact.name, contact.phone, contact.email)
  const documents = getDocuments()

  const [activeTab, setActiveTab] = useState("overview")
  const [properties] = useState<Property[]>(getOwnerProperties())
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

  // Owner Processes Data
  const ownerProcesses = {
    inProgress: [
      {
        id: "proc-1",
        name: "Initial Outreach & Qualification",
        prospectingStage: "New Lead",
        startedOn: "01/10/2026",
        status: "In Progress",
        tasks: [
          { id: "t1", name: "Send welcome email", startDate: "01/10/2026", completedDate: "01/10/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t2", name: "Schedule discovery call", startDate: "01/11/2026", completedDate: "01/12/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t3", name: "Complete needs assessment", startDate: "01/13/2026", completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t4", name: "Verify property ownership", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        ],
      },
      {
        id: "proc-2",
        name: "Property Evaluation Process",
        prospectingStage: "Collecting Information",
        startedOn: "01/15/2026",
        status: "In Progress",
        tasks: [
          { id: "t5", name: "Request property details", startDate: "01/15/2026", completedDate: "01/15/2026", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
          { id: "t6", name: "Schedule property walkthrough", startDate: "01/16/2026", completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
          { id: "t7", name: "Prepare management proposal", startDate: null, completedDate: null, staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-7",
        name: "Rental Market Analysis",
        prospectingStage: "Collecting Information",
        startedOn: "01/17/2026",
        status: "In Progress",
        tasks: [
          { id: "t20", name: "Research comparable properties", startDate: "01/17/2026", completedDate: "01/17/2026", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
          { id: "t21", name: "Compile rental rate analysis", startDate: "01/18/2026", completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        ],
      },
      {
        id: "proc-8",
        name: "Insurance Verification",
        prospectingStage: "Collecting Information",
        startedOn: "01/14/2026",
        status: "In Progress",
        tasks: [
          { id: "t22", name: "Request insurance documentation", startDate: "01/14/2026", completedDate: "01/14/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t23", name: "Verify coverage limits", startDate: "01/15/2026", completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
      {
        id: "proc-9",
        name: "Tax Document Collection",
        prospectingStage: "New Lead",
        startedOn: "01/12/2026",
        status: "In Progress",
        tasks: [
          { id: "t24", name: "Request W-9 form", startDate: "01/12/2026", completedDate: "01/12/2026", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t25", name: "Verify tax ID number", startDate: "01/13/2026", completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-10",
        name: "HOA Compliance Check",
        prospectingStage: "Collecting Information",
        startedOn: "01/16/2026",
        status: "In Progress",
        tasks: [
          { id: "t26", name: "Obtain HOA rules and regulations", startDate: "01/16/2026", completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
          { id: "t27", name: "Review rental restrictions", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        ],
      },
      {
        id: "proc-11",
        name: "Property Condition Assessment",
        prospectingStage: "Proposal Sent",
        startedOn: "01/18/2026",
        status: "In Progress",
        tasks: [
          { id: "t28", name: "Schedule inspection", startDate: "01/18/2026", completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
          { id: "t29", name: "Document current condition", startDate: null, completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        ],
      },
    ],
    upcoming: [
      {
        id: "proc-3",
        name: "Contract Negotiation",
        prospectingStage: "Proposal Sent",
        status: "Upcoming",
        tasks: [
          { id: "t8", name: "Send management agreement", startDate: null, completedDate: null, staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t9", name: "Review contract terms", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
          { id: "t10", name: "Finalize fee structure", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
      {
        id: "proc-4",
        name: "Onboarding Preparation",
        prospectingStage: "Contract Signed",
        status: "Upcoming",
        tasks: [
          { id: "t11", name: "Collect owner documents", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t12", name: "Set up owner portal access", startDate: null, completedDate: null, staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
          { id: "t13", name: "Configure payment settings", startDate: null, completedDate: null, staffName: "Michael Chen", staffEmail: "michael.chen@heropm.com" },
        ],
      },
      {
        id: "proc-12",
        name: "Marketing Setup",
        prospectingStage: "Contract Signed",
        status: "Upcoming",
        tasks: [
          { id: "t30", name: "Take professional property photos", startDate: null, completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
          { id: "t31", name: "Create listing descriptions", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-13",
        name: "Maintenance Setup",
        prospectingStage: "Contract Signed",
        status: "Upcoming",
        tasks: [
          { id: "t32", name: "Assign maintenance vendors", startDate: null, completedDate: null, staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
          { id: "t33", name: "Set up maintenance request system", startDate: null, completedDate: null, staffName: "Michael Chen", staffEmail: "michael.chen@heropm.com" },
        ],
      },
      {
        id: "proc-14",
        name: "Bank Account Configuration",
        prospectingStage: "Contract Signed",
        status: "Upcoming",
        tasks: [
          { id: "t34", name: "Collect banking information", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t35", name: "Set up direct deposit", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        ],
      },
      {
        id: "proc-15",
        name: "Emergency Contact Setup",
        prospectingStage: "Contract Signed",
        status: "Upcoming",
        tasks: [
          { id: "t36", name: "Collect emergency contacts", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t37", name: "Document access information", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
    ],
    completed: [
      {
        id: "proc-5",
        name: "Lead Source Verification",
        prospectingStage: "New Lead",
        startedOn: "01/05/2026",
        completedOn: "01/08/2026",
        status: "Completed",
        tasks: [
          { id: "t14", name: "Verify contact information", startDate: "01/05/2026", completedDate: "01/05/2026", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t15", name: "Check for duplicate records", startDate: "01/06/2026", completedDate: "01/06/2026", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t16", name: "Assign to sales team", startDate: "01/07/2026", completedDate: "01/08/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-6",
        name: "Initial Contact Campaign",
        prospectingStage: "New Lead",
        startedOn: "01/02/2026",
        completedOn: "01/04/2026",
        status: "Completed",
        tasks: [
          { id: "t17", name: "Add to email sequence", startDate: "01/02/2026", completedDate: "01/02/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t18", name: "Send introductory materials", startDate: "01/03/2026", completedDate: "01/03/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
          { id: "t19", name: "Log initial response", startDate: "01/04/2026", completedDate: "01/04/2026", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-16",
        name: "Website Lead Capture",
        prospectingStage: "New Lead",
        startedOn: "12/28/2025",
        completedOn: "12/29/2025",
        status: "Completed",
        tasks: [
          { id: "t38", name: "Process website inquiry", startDate: "12/28/2025", completedDate: "12/28/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t39", name: "Send auto-response email", startDate: "12/28/2025", completedDate: "12/29/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-17",
        name: "Referral Source Tracking",
        prospectingStage: "New Lead",
        startedOn: "12/26/2025",
        completedOn: "12/27/2025",
        status: "Completed",
        tasks: [
          { id: "t40", name: "Document referral source", startDate: "12/26/2025", completedDate: "12/26/2025", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
          { id: "t41", name: "Send thank you to referrer", startDate: "12/27/2025", completedDate: "12/27/2025", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        ],
      },
      {
        id: "proc-18",
        name: "CRM Data Entry",
        prospectingStage: "New Lead",
        startedOn: "12/25/2025",
        completedOn: "12/25/2025",
        status: "Completed",
        tasks: [
          { id: "t42", name: "Create contact record", startDate: "12/25/2025", completedDate: "12/25/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
          { id: "t43", name: "Link to property records", startDate: "12/25/2025", completedDate: "12/25/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        ],
      },
      {
        id: "proc-19",
        name: "Service Area Verification",
        prospectingStage: "New Lead",
        startedOn: "12/27/2025",
        completedOn: "12/28/2025",
        status: "Completed",
        tasks: [
          { id: "t44", name: "Verify property location", startDate: "12/27/2025", completedDate: "12/27/2025", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
          { id: "t45", name: "Confirm service area coverage", startDate: "12/28/2025", completedDate: "12/28/2025", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        ],
      },
    ],
  }

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

  // Communications tab composer state
  const [commMessage, setCommMessage] = useState("")
  const [commChannel, setCommChannel] = useState<"email" | "sms" | "call">("email")

  // Inline email compose state for Communications tab
  const [emailComposeCc, setEmailComposeCc] = useState("")
  const [emailComposeBcc, setEmailComposeBcc] = useState("")
  const [emailComposeSubject, setEmailComposeSubject] = useState("")
  const [emailComposeBody, setEmailComposeBody] = useState("")
  const [showCcBcc, setShowCcBcc] = useState(false)

  // Communications tab sub-tab state (Private vs Group)
  const [commSubTab, setCommSubTab] = useState<"private" | "group">("private")
  const [expandedCommEmails, setExpandedCommEmails] = useState<Set<string>>(new Set())
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

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

  const renderTaskItem = (task: Task) => (
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

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setViewTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
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

  const getStatusBadgeStyle = (status: Task["status"]) => {
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

  const getPriorityBadgeStyle = (priority: Task["priority"]) => {
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
    const task: Task = {
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

  const getPropertyStatusBadge = (status: Property["status"]) => {
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

      <div className="space-y-4">
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

            {/* Overview Tab - Existing Activity Content */}
            <TabsContent value="overview" className="mt-4 space-y-4">

              {/* Processes Summary Section - Collapsible */}

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
                                    <div className="flex items-center gap-1">
                                      <Workflow className="h-3 w-3 text-teal-600" />
                                      <span className="text-xs text-teal-600">{task.processName}</span>
                                    </div>
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
                        id="owner-activity-all"
                        name="owner-activity-filter"
                        checked={activityRadioFilter === "all"}
                        onChange={() => setActivityRadioFilter("all")}
                        className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                      />
                      <label htmlFor="owner-activity-all" className="text-sm text-slate-700 cursor-pointer">All</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        id="owner-activity-unread"
                        name="owner-activity-filter"
                        checked={activityRadioFilter === "unread"}
                        onChange={() => setActivityRadioFilter("unread")}
                        className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                      />
                      <label htmlFor="owner-activity-unread" className="text-sm text-slate-700 cursor-pointer">Unread</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        id="owner-activity-unresponded"
                        name="owner-activity-filter"
                        checked={activityRadioFilter === "unresponded"}
                        onChange={() => setActivityRadioFilter("unresponded")}
                        className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                      />
                      <label htmlFor="owner-activity-unresponded" className="text-sm text-slate-700 cursor-pointer">Unresponded</label>
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

              {/* Owner KPI Dashboard Section - at bottom of Overview */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">Owner KPIs</h3>
                  <span className="text-xs text-muted-foreground">As of {new Date().toLocaleDateString()}</span>
                </div>

                {/* Summary Boxes - Top Row */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-slate-50/50">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Building2 className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Properties</p>
                        <p className="text-lg font-semibold text-slate-800">3</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50/50">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Home className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Units</p>
                        <p className="text-lg font-semibold text-slate-800">9</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50/50">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Active Leases</p>
                        <p className="text-lg font-semibold text-slate-800">9</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual KPIs - Below Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Occupancy Rate Gauge */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-700">% Occupied</h4>
                        <span className="text-xs text-muted-foreground">See More</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">9 of 9 units rented as of {new Date().toLocaleDateString()}</p>

                      {/* Semi-circular Gauge */}
                      <div className="relative flex flex-col items-center">
                        <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
                          {/* Background arc */}
                          <path
                            d="M 10 60 A 50 50 0 0 1 110 60"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          {/* Filled arc - 100% = full arc */}
                          <path
                            d="M 10 60 A 50 50 0 0 1 110 60"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="157"
                            strokeDashoffset="0"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-20%] text-center">
                          <span className="text-2xl font-bold text-slate-800">100%</span>
                          <p className="text-[10px] text-sky-500 font-medium uppercase tracking-wide">Occupied</p>
                        </div>
                        <div className="flex justify-between w-full max-w-[140px] mt-1 text-xs text-muted-foreground">
                          <span>0</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rent Collections Gauge */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Rent Collected</h4>
                      <p className="text-xs text-muted-foreground mb-3">77% of rent collected as of {new Date().toLocaleDateString()}</p>

                      {/* Semi-circular Gauge */}
                      <div className="relative flex flex-col items-center">
                        <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
                          {/* Background arc */}
                          <path
                            d="M 10 60 A 50 50 0 0 1 110 60"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          {/* Filled arc - 77% */}
                          <path
                            d="M 10 60 A 50 50 0 0 1 110 60"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="157"
                            strokeDashoffset="36"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-20%] text-center">
                          <span className="text-xl font-bold text-slate-800">$5,626.50</span>
                          <p className="text-[10px] text-green-500 font-medium uppercase tracking-wide">Collected</p>
                        </div>
                        <div className="flex justify-between w-full max-w-[140px] mt-1 text-xs text-muted-foreground">
                          <span>$0.00</span>
                          <span>$7,287.50</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Open Maintenance */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Open Maintenance</h4>
                      <p className="text-xs text-muted-foreground mb-3">Active maintenance requests</p>

                      <div className="flex items-center justify-center py-4">
                        <div className="text-center">
                          <span className="text-4xl font-bold text-slate-800">5</span>
                          <p className="text-sm text-muted-foreground mt-1">Open Requests</p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-muted-foreground">High Priority</span>
                          </div>
                          <span className="font-medium text-slate-700">2</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-muted-foreground">Medium Priority</span>
                          </div>
                          <span className="font-medium text-slate-700">3</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Income & Expense Summary */}
                  <Card className="bg-white">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Income & Expense (Owner View)</h4>
                      <p className="text-xs text-muted-foreground mb-3">Monthly snapshot</p>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Income</span>
                          <span className="text-sm font-semibold text-green-600">$12,450.00</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Expenses</span>
                          <span className="text-sm font-semibold text-red-500">$3,125.00</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Net Income</span>
                            <span className="text-sm font-bold text-slate-800">$9,325.00</span>
                          </div>
                        </div>
                      </div>

                      {/* Simple bar visualization */}
                      <div className="mt-4">
                        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
                          <div className="bg-green-500 h-full" style={{ width: "75%" }} />
                          <div className="bg-red-400 h-full" style={{ width: "25%" }} />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                          <span>Income 75%</span>
                          <span>Expenses 25%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab - Owner Configuration Sections */}
            <TabsContent value="details" className="mt-4 space-y-4">
              {/* Reporting Awareness Banner */}
              {/* <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FileBarChart className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">All fields are report-ready</p>
                  <p className="text-xs text-blue-600">When generating the Owner Directory report, you can choose which mandatory and optional fields to include.</p>
                </div>
              </div> */}

              {/* Federal Tax */}
              <CollapsibleSection
                title="Federal Tax"
                icon={FileText}
                defaultOpen={false}
                sectionId="federal-tax"
                onAddField={(id) => {
                  setCustomFieldSection(id)
                  setShowCustomFieldModal(true)
                }}
                customFieldCount={getFieldsForSection("federal-tax").length}
                actions={
                  <Button variant="link" className="text-primary p-0 h-auto text-sm">
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8">
                  <InfoRow label={<span className="flex items-center gap-1">Taxpayer Name <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={FEDERAL_TAX_INFO.taxpayerName} />
                  <InfoRow label={<span className="flex items-center gap-1">Taxpayer ID <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={FEDERAL_TAX_INFO.taxpayerId} />
                  <InfoRow label={<span className="flex items-center gap-1">Tax Form Account Number <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={FEDERAL_TAX_INFO.taxFormAccountNumber} />
                  <InfoRow label="Send 1099?" value={FEDERAL_TAX_INFO.send1099} />
                  <InfoRow label="Owner consented to receive electronic 1099?" value={FEDERAL_TAX_INFO.ownerConsentedElectronic1099} />
                  <InfoRow label="1099 Sending Preference" value={FEDERAL_TAX_INFO.sending1099Preference} />

                  {/* Custom Fields for this section */}
                  {getFieldsForSection("federal-tax").map((field) => (
                    <CustomFieldRow
                      key={field.id}
                      field={field}
                      onDelete={(id) => setCustomFields(customFields.filter(f => f.id !== id))}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Accounting Information */}
              <CollapsibleSection
                title="Accounting Information"
                icon={Clipboard}
                defaultOpen={false}
                sectionId="accounting"
                onAddField={(id) => {
                  setCustomFieldSection(id)
                  setShowCustomFieldModal(true)
                }}
                customFieldCount={getFieldsForSection("accounting").length}
                actions={
                  <Button variant="link" className="text-primary p-0 h-auto text-sm">
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8">
                  <InfoRow label="Check Consolidation" value={ACCOUNTING_INFO.checkConsolidation} />
                  <InfoRow label="Check Stub Breakdown" value={<span className="text-primary">{ACCOUNTING_INFO.checkStubBreakdown}</span>} />
                  <InfoRow label="Hold Payments?" value={ACCOUNTING_INFO.holdPayments} />
                  <InfoRow label={<span className="flex items-center gap-1">Email eCheck Receipt? <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={ACCOUNTING_INFO.emailECheckReceipt} />
                  <InfoRow label={<span className="flex items-center gap-1">Default Check Memo <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={ACCOUNTING_INFO.defaultCheckMemo} />

                  {/* Custom Fields for this section */}
                  {getFieldsForSection("accounting").map((field) => (
                    <CustomFieldRow
                      key={field.id}
                      field={field}
                      onDelete={(id) => setCustomFields(customFields.filter(f => f.id !== id))}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Bank Account Information */}
              <CollapsibleSection
                title="Bank Account Information"
                icon={CreditCard}
                defaultOpen={false}
                sectionId="bank-account"
                onAddField={(id) => {
                  setCustomFieldSection(id)
                  setShowCustomFieldModal(true)
                }}
                customFieldCount={getFieldsForSection("bank-account").length}
                actions={
                  <Button variant="link" className="text-primary p-0 h-auto text-sm">
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8">
                  <InfoRow label="Owner Paid by ACH?" value={BANK_ACCOUNT_INFO.ownerPaidByACH} />
                  <InfoRow label="Bank Routing Number" value={BANK_ACCOUNT_INFO.bankRoutingNumber} />
                  <InfoRow label="Bank Account Number" value={BANK_ACCOUNT_INFO.bankAccountNumber} />
                  <InfoRow label="Savings Account?" value={BANK_ACCOUNT_INFO.savingsAccount} />

                  {/* Custom Fields for this section */}
                  {getFieldsForSection("bank-account").map((field) => (
                    <CustomFieldRow
                      key={field.id}
                      field={field}
                      onDelete={(id) => setCustomFields(customFields.filter(f => f.id !== id))}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Owner Statement (Enhanced) */}
              <CollapsibleSection
                title="Owner Statement (Enhanced)"
                icon={FileBarChart}
                defaultOpen={false}
                sectionId="owner-statement"
                onAddField={(id) => {
                  setCustomFieldSection(id)
                  setShowCustomFieldModal(true)
                }}
                customFieldCount={getFieldsForSection("owner-statement").length}
                actions={
                  <Button variant="link" className="text-primary p-0 h-auto text-sm">
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8">
                  <InfoRow label="Show Transactions Detail" value={OWNER_STATEMENT_INFO.showTransactionsDetail} />
                  <InfoRow label={<span className="flex items-center gap-1">Show Unpaid Bills Detail <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={OWNER_STATEMENT_INFO.showUnpaidBillsDetail} />
                  <InfoRow label={<span className="flex items-center gap-1">Show Tenant Names <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={OWNER_STATEMENT_INFO.showTenantNames} />
                  <InfoRow label="Show Summary" value={OWNER_STATEMENT_INFO.showSummary} />
                  <InfoRow label="Separate Management Fees from Cash Out" value={OWNER_STATEMENT_INFO.separateManagementFeesFromCashOut} />
                  <InfoRow label={<span className="flex items-center gap-1">Consolidate In-house Work Order Bill Line Items <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={OWNER_STATEMENT_INFO.consolidateInHouseWorkOrderBillLineItems} />
                  <InfoRow label="Notes for the Owner" value={OWNER_STATEMENT_INFO.notesForTheOwner} />

                  {/* Custom Fields for this section */}
                  {getFieldsForSection("owner-statement").map((field) => (
                    <CustomFieldRow
                      key={field.id}
                      field={field}
                      onDelete={(id) => setCustomFields(customFields.filter(f => f.id !== id))}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Owner Packet */}
              <CollapsibleSection
                title="Owner Packet"
                icon={Package}
                defaultOpen={false}
                sectionId="owner-packet"
                onAddField={(id) => {
                  setCustomFieldSection(id)
                  setShowCustomFieldModal(true)
                }}
                customFieldCount={getFieldsForSection("owner-packet").length}
                actions={
                  <Button variant="link" className="text-primary p-0 h-auto text-sm">
                    Edit
                  </Button>
                }
              >
                <div className="grid grid-cols-1 gap-x-8">
                  <InfoRow label="Send via Email?" value={OWNER_PACKET_INFO.sendViaEmail} />
                  <InfoRow label="Include Paid Work Orders" value={OWNER_PACKET_INFO.includePaidWorkOrders} />
                  <InfoRow label="Include Paid Work Orders Attachments" value={OWNER_PACKET_INFO.includePaidWorkOrdersAttachments} />
                  <InfoRow label={<span className="flex items-center gap-1">Include Paid Bills Attachments <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={OWNER_PACKET_INFO.includePaidBillsAttachments} />
                  <InfoRow label="GL Account Map" value={OWNER_PACKET_INFO.glAccountMap} />
                  <InfoRow label="Included Reports" value={OWNER_PACKET_INFO.includedReports} />

                  {/* Custom Fields for this section */}
                  {getFieldsForSection("owner-packet").map((field) => (
                    <CustomFieldRow
                      key={field.id}
                      field={field}
                      onDelete={(id) => setCustomFields(customFields.filter(f => f.id !== id))}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Management Agreements Section */}
              <Card>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-base font-medium text-slate-800">
                    Management Agreements
                  </CardTitle>
                  <Button variant="outline" size="sm" className="h-8 text-sm bg-transparent">
                    <Upload className="h-4 w-4 mr-1.5" />
                    Upload Agreement
                  </Button>
                </CardHeader>
                <CardContent className="py-8 px-4">
                  <p className="text-sm text-slate-500 text-center">
                    There are no management agreements at this time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communications Tab Removed - Activity tab is the single communication surface */}
            {/* Communications Tab */}
            <TabsContent value="communications" className="mt-4 space-y-4">
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
                      {communications.some(c => !c.isGroupChat && !c.isRead && c.isIncoming) && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                          {communications.filter(c => !c.isGroupChat && !c.isRead && c.isIncoming).length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { setCommSubTab("group"); setSelectedGroupId(null) }}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${commSubTab === "group"
                        ? "border-teal-600 text-teal-700"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      Group
                      {communications.some(c => c.isGroupChat && (c.unreadCount ?? 0) > 0) && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                          {communications.filter(c => c.isGroupChat && (c.unreadCount ?? 0) > 0).reduce((sum, c) => sum + (c.unreadCount ?? 0), 0)}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* ======= PRIVATE SUB-TAB ======= */}
                  {commSubTab === "private" && (() => {
                    const privateComms = communications
                      .filter(c => !c.isGroupChat && c.type !== "note")
                      .sort((a, b) => a.date.getTime() - b.date.getTime())

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
                                const isOutgoing = !item.isIncoming
                                const contactName = contact.name
                                const staffName = "Richard Surovi"
                                const isEmailExpanded = expandedCommEmails.has(item.id)

                                return (
                                  <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[75%] ${isOutgoing
                                      ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                      : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                      } p-3 shadow-sm`}>
                                      {/* Sender & Channel Badge */}
                                      <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                        <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>
                                          {isOutgoing ? staffName : contactName}
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

                                      {/* Email: Collapsed by default */}
                                      {item.type === "email" ? (
                                        <div>
                                          {item.subject && (
                                            <button
                                              onClick={() => setExpandedCommEmails(prev => {
                                                const next = new Set(prev)
                                                next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                                                return next
                                              })}
                                              className={`text-sm font-medium mb-1 flex items-center gap-1 w-full text-left ${isOutgoing ? "text-white hover:text-teal-100" : "text-slate-800 hover:text-teal-600"}`}
                                            >
                                              <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${isEmailExpanded ? "rotate-0" : "-rotate-90"}`} />
                                              {item.subject}
                                            </button>
                                          )}
                                          {isEmailExpanded ? (
                                            <div className="space-y-2 mt-1">
                                              {item.thread ? item.thread.map((threadItem, idx) => (
                                                <div key={threadItem.id} className={idx > 0 ? "pt-2 border-t border-dashed border-opacity-30 " + (isOutgoing ? "border-teal-300" : "border-slate-300") : ""}>
                                                  {idx > 0 && (
                                                    <div className={`text-xs mb-1 ${isOutgoing ? "text-teal-200" : "text-slate-500"}`}>
                                                      {threadItem.isIncoming ? contactName : staffName} - {threadItem.timestamp}
                                                    </div>
                                                  )}
                                                  <p className={`text-sm whitespace-pre-line ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                                    {threadItem.content}
                                                  </p>
                                                  {threadItem.attachments && threadItem.attachments.length > 0 && (
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                      {threadItem.attachments.map((att: { name: string; size: string }, aIdx: number) => (
                                                        <span key={aIdx} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${isOutgoing ? "bg-teal-500/50 text-teal-100" : "bg-slate-100 text-slate-600"}`}>
                                                          <Paperclip className="h-2.5 w-2.5" />
                                                          {att.name} ({att.size})
                                                        </span>
                                                      ))}
                                                    </div>
                                                  )}
                                                  {!threadItem.isIncoming && threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
                                                    <div className={`flex items-center gap-1 text-[10px] mt-1 ${isOutgoing ? "text-teal-200" : "text-green-600"}`}>
                                                      <Eye className="h-3 w-3" />
                                                      Opened by owner at {threadItem.emailOpens[0].openedAt}
                                                    </div>
                                                  )}
                                                </div>
                                              )) : (
                                                <p className={`text-sm whitespace-pre-line ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                                  {item.content || item.preview}
                                                </p>
                                              )}
                                            </div>
                                          ) : (
                                            <p className={`text-xs mt-0.5 ${isOutgoing ? "text-teal-200" : "text-slate-400"}`}>
                                              {item.preview || (item.content ? item.content.slice(0, 80) + "..." : "")}
                                            </p>
                                          )}
                                          {/* Email open time (top-level) */}
                                          {!item.isIncoming && item.thread && item.thread[0]?.emailOpens && item.thread[0].emailOpens.length > 0 && !isEmailExpanded && (
                                            <div className={`flex items-center gap-1 text-[10px] mt-1 ${isOutgoing ? "text-teal-200" : "text-green-600"}`}>
                                              <Eye className="h-3 w-3" />
                                              Opened at {item.thread[0].emailOpens[0].openedAt}
                                            </div>
                                          )}
                                        </div>
                                      ) : item.type === "call" ? (
                                        <div className="space-y-1">
                                          <div className={`flex items-center gap-2 ${isOutgoing ? "text-teal-100" : "text-slate-600"}`}>
                                            <Phone className="h-4 w-4" />
                                            <span className="text-sm">
                                              {item.isIncoming ? "Incoming call" : "Outgoing call"} - {item.duration}
                                            </span>
                                          </div>
                                          {item.notes && (
                                            <p className={`text-sm ${isOutgoing ? "text-teal-50" : "text-slate-700"}`}>
                                              <span className="font-medium">Notes:</span> {item.notes}
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <p className={`text-sm ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                          {item.content || item.preview}
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
                          {/* Reply label + Channel Selector */}
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

                          {/* Email inline composer */}
                          {commChannel === "email" && (
                            <div>
                              <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                                <Label className="text-xs text-slate-500 w-12 shrink-0">To</Label>
                                <input type="text" defaultValue={contact.email} className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700" />
                                <button type="button" onClick={() => setShowCcBcc(!showCcBcc)} className="text-xs text-slate-500 hover:text-slate-700">
                                  Cc Bcc
                                </button>
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
                              <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-3 py-2 sticky bottom-0 bg-white">
                                <Button variant="outline" size="sm" onClick={() => setCommChannel("sms")}>Close</Button>
                                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5">
                                  <Send className="h-3.5 w-3.5" /> Send Email
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <ExternalLink className="h-3.5 w-3.5" /> View in Activity
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* SMS inline composer */}
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

                          {/* Call inline composer */}
                          {commChannel === "call" && (
                            <div className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Input
                                    placeholder="Enter phone number or use contact's number..."
                                    defaultValue={contact?.phone || ""}
                                    className="text-sm"
                                  />
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                  <PhoneCall className="h-4 w-4" />
                                  Start Call
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )
                  })()}

                  {/* ======= GROUP SUB-TAB ======= */}
                  {commSubTab === "group" && (() => {
                    const groupComms = communications.filter(c => c.isGroupChat)
                    // Build group list from unique groupParticipants sets
                    const groupMap = new Map<string, { name: string; participants: string[]; messages: typeof groupComms; unreadCount: number; lastMessage: typeof groupComms[0] }>()
                    groupComms.forEach(msg => {
                      const groupName = msg.to?.name || "Unknown Group"
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
                      if (msg.date > group.lastMessage.date) group.lastMessage = msg
                    })
                    const groups = Array.from(groupMap.values()).sort((a, b) => b.lastMessage.date.getTime() - a.lastMessage.date.getTime())

                    const selectedGroup = selectedGroupId ? groups.find(g => g.name === selectedGroupId) : null
                    const groupMessages = selectedGroup ? [...selectedGroup.messages].sort((a, b) => a.date.getTime() - b.date.getTime()) : []

                    return selectedGroup ? (
                      <>
                        {/* Group conversation header */}
                        <div className="flex items-center gap-3 mb-3">
                          <button onClick={() => setSelectedGroupId(null)} className="text-slate-500 hover:text-slate-700">
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <div>
                            <h3 className="font-semibold text-slate-800">{selectedGroup.name}</h3>
                            <p className="text-xs text-slate-500">{selectedGroup.participants.join(", ")}</p>
                          </div>
                        </div>

                        {/* Group Chat Messages */}
                        <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                          <div className="flex flex-col gap-3">
                            {groupMessages.map((item) => {
                              const isOutgoing = !item.isIncoming
                              const senderName = item.from?.name || "Unknown"
                              const isEmailExpanded2 = expandedCommEmails.has(item.id)

                              return (
                                <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                  <div className={`max-w-[75%] ${isOutgoing
                                    ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                    } p-3 shadow-sm`}>
                                    {/* Sender & Channel */}
                                    <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                      <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>
                                        {senderName}
                                      </span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.type === "email"
                                        ? isOutgoing ? "bg-teal-500 text-teal-100" : "bg-blue-100 text-blue-600"
                                        : isOutgoing ? "bg-teal-500 text-teal-100" : "bg-green-100 text-green-600"
                                        }`}>
                                        {item.type === "email" ? "Email" : "SMS"}
                                      </span>
                                    </div>

                                    {/* Email: Collapsed by default */}
                                    {item.type === "email" ? (
                                      <div>
                                        {item.subject && (
                                          <button
                                            onClick={() => setExpandedCommEmails(prev => {
                                              const next = new Set(prev)
                                              next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                                              return next
                                            })}
                                            className={`text-sm font-medium mb-1 flex items-center gap-1 w-full text-left ${isOutgoing ? "text-white hover:text-teal-100" : "text-slate-800 hover:text-teal-600"}`}
                                          >
                                            <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${isEmailExpanded2 ? "rotate-0" : "-rotate-90"}`} />
                                            {item.subject}
                                          </button>
                                        )}
                                        {isEmailExpanded2 ? (
                                          <div className="space-y-2 mt-1">
                                            {item.thread ? item.thread.map((threadItem, idx) => (
                                              <div key={threadItem.id} className={idx > 0 ? "pt-2 border-t border-dashed border-opacity-30 " + (isOutgoing ? "border-teal-300" : "border-slate-300") : ""}>
                                                <p className={`text-sm whitespace-pre-line ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                                  {threadItem.content}
                                                </p>
                                                {!threadItem.isIncoming && threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
                                                  <div className={`flex items-center gap-1 text-[10px] mt-1 ${isOutgoing ? "text-teal-200" : "text-green-600"}`}>
                                                    <Eye className="h-3 w-3" />
                                                    Opened at {threadItem.emailOpens[0].openedAt}
                                                  </div>
                                                )}
                                              </div>
                                            )) : (
                                              <p className={`text-sm ${isOutgoing ? "text-white" : "text-slate-700"}`}>{item.content || item.preview}</p>
                                            )}
                                          </div>
                                        ) : (
                                          <p className={`text-xs mt-0.5 ${isOutgoing ? "text-teal-200" : "text-slate-400"}`}>
                                            {item.preview || (item.content ? item.content.slice(0, 80) + "..." : "")}
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <p className={`text-sm ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                                        {item.content || item.preview}
                                      </p>
                                    )}

                                    <div className={`text-[10px] mt-2 ${isOutgoing ? "text-teal-200 text-right" : "text-slate-400"}`}>
                                      {item.timestamp}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Group Reply Composer */}
                        <div className="border rounded-lg bg-white shrink-0 max-h-[320px] overflow-y-auto">
                          {/* Reply label + Channel Selector */}
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

                          {/* Email inline composer */}
                          {commChannel === "email" && (
                            <div>
                              <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                                <Label className="text-xs text-slate-500 w-12 shrink-0">To</Label>
                                <input type="text" defaultValue={contact.email} className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700" />
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
                              <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-3 py-2 sticky bottom-0 bg-white">
                                <Button variant="outline" size="sm" onClick={() => setCommChannel("sms")}>Close</Button>
                                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5">
                                  <Send className="h-3.5 w-3.5" /> Send Email
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5">
                                  <ExternalLink className="h-3.5 w-3.5" /> View in Activity
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* SMS inline composer */}
                          {commChannel === "sms" && (
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
                          )}

                          {/* Call inline composer */}
                          {commChannel === "call" && (
                            <div className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <Input placeholder="Enter phone number..." className="text-sm" />
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                  <PhoneCall className="h-4 w-4" />
                                  Start Call
                                </Button>
                              </div>
                            </div>
                          )}
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
                                <p className="text-xs text-slate-400 truncate mt-0.5">{group.lastMessage.preview}</p>
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
            </TabsContent>

            {/* Properties Tab - Grouped by Ownership with Expand/Collapse */}
            <TabsContent value="properties" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-teal-600" />
                      Properties Owned ({properties.length})
                    </h3>
                  </div>

                  {/* Entity-Grouped Properties - Flat list by entity name */}
                  {(() => {
                    // Group properties by entity, flattening the ownership type level
                    const entities: { entityName: string; entityId: string; ownershipType: string; properties: Property[] }[] = []

                    for (const prop of properties) {
                      const oType = prop.ownershipType || "Personal"
                      const entityName = prop.ownershipEntity || ""
                      const entityId = oType === "Personal" ? `personal-${prop.id}` : (prop.ownershipEntity || `personal-${prop.id}`)

                      if (oType === "Personal" || !prop.ownershipEntity) {
                        // Each personal property is its own entry
                        entities.push({ entityName: prop.address, entityId: `personal-${prop.id}`, ownershipType: "Personal", properties: [prop] })
                      } else {
                        const existing = entities.find(e => e.entityId === entityId)
                        if (existing) {
                          existing.properties.push(prop)
                        } else {
                          entities.push({ entityName, entityId, ownershipType: oType, properties: [prop] })
                        }
                      }
                    }

                    const getOwnershipIcon = (type: string) => {
                      switch (type) {
                        case "LLC": return <Landmark className="h-4 w-4 text-blue-600" />
                        case "Partnership": return <Handshake className="h-4 w-4 text-violet-600" />
                        default: return <Home className="h-4 w-4 text-amber-600" />
                      }
                    }

                    const getOwnershipColor = (type: string) => {
                      switch (type) {
                        case "LLC": return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-100 text-blue-700 border-blue-200" }
                        case "Partnership": return { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", badge: "bg-violet-100 text-violet-700 border-violet-200" }
                        default: return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-100 text-amber-700 border-amber-200" }
                      }
                    }

                    return (
                      <div className="space-y-3">
                        {entities.map((entity, entityIndex) => {
                          const colors = getOwnershipColor(entity.ownershipType)
                          const isExpanded = expandedEntities.has(entity.entityId)

                          return (
                            <div key={entity.entityId} className={`rounded-lg border ${colors.border} overflow-hidden`}>
                              {/* Entity Header */}
                              <button
                                type="button"
                                onClick={() => toggleEntity(entity.entityId)}
                                className={`flex items-center gap-2.5 px-4 py-3 w-full text-left ${colors.bg} hover:brightness-95 transition-all`}
                              >
                                <ChevronRight className={`h-4 w-4 ${colors.text} shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                                {getOwnershipIcon(entity.ownershipType)}
                                <span className={`font-semibold text-sm ${colors.text}`}>
                                  {entityIndex + 1}. {entity.entityName}
                                </span>
                                {entity.ownershipType !== "Personal" && (
                                  <Badge variant="outline" className={`text-xs ml-1 ${colors.badge}`}>
                                    {entity.properties.length} {entity.properties.length === 1 ? "Property" : "Properties"}
                                  </Badge>
                                )}
                              </button>

                              {/* Properties - Collapsible */}
                              <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="divide-y divide-border/40">
                                  {entity.properties.map((property) => {
                                    const isPropertyExpanded = expandedOwnershipTypes.has(`prop-${property.id}`)
                                    return (
                                      <div key={property.id} className="bg-white">
                                        {/* Property Row - Clickable to expand (only for non-personal) */}
                                        {entity.ownershipType !== "Personal" && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setExpandedOwnershipTypes(prev => {
                                                const next = new Set(prev)
                                                const key = `prop-${property.id}`
                                                if (next.has(key)) next.delete(key)
                                                else next.add(key)
                                                return next
                                              })
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-gray-50 transition-colors"
                                          >
                                            <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${isPropertyExpanded ? "rotate-90" : ""}`} />
                                            <Home className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                            <span className="text-sm font-medium text-foreground">{property.name}</span>
                                            <span className="text-xs text-muted-foreground ml-1">{property.address}</span>
                                            <Badge variant="outline" className={`text-xs shrink-0 ml-auto ${getPropertyStatusBadge(property.status)}`}>
                                              {property.status}
                                            </Badge>
                                          </button>
                                        )}

                                        {/* Expanded Property Card */}
                                        <div className={`transition-all duration-200 ease-in-out overflow-hidden ${entity.ownershipType === "Personal" || isPropertyExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                                          <div className="border-t border-border/40 bg-white">
                                            <div className="flex gap-0">
                                              {/* Left: Image + Quick Links */}
                                              <div className="w-72 shrink-0 border-r border-border/40">
                                                <div className="h-44 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                                  <Building2 className="h-12 w-12 text-slate-400" />
                                                </div>
                                                <div className="p-3 space-y-1.5">


                                                  <button type="button" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline w-full">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Matterport Scan
                                                  </button>

                                                  <button type="button" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline w-full">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    Rental Comps
                                                  </button>
                                                </div>
                                              </div>

                                              {/* Right: Property Details */}
                                              <div className="flex-1 p-4">
                                                <div className="flex items-start justify-between mb-1">
                                                  <div>
                                                    <h4 className="text-lg font-semibold text-slate-800">{property.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{property.address}</p>
                                                    {property.units > 1 && (
                                                      <p className="text-sm text-muted-foreground mt-0.5">
                                                        {property.units} Units
                                                      </p>
                                                    )}
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={`text-xs ${getPropertyStatusBadge(property.status)}`}>
                                                      {property.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                      <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>

                                                {/* Property Specs */}
                                                <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                                                  <div className="flex items-center gap-1.5">
                                                    <Home className="h-3.5 w-3.5" />
                                                    <span>{property.type}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>Available Now</span>
                                                  </div>
                                                </div>

                                                {/* Rent Info Bar */}
                                                <div className="flex items-center gap-6 mt-3 px-4 py-2.5 rounded-lg border border-amber-200 bg-amber-50/60">
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-sm text-amber-800">Monthly Rent:</span>
                                                    <span className="text-sm font-bold text-amber-900">${property.monthlyRent.toLocaleString()}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1.5">
                                                    <span className="text-sm text-amber-800">Security Deposit:</span>
                                                    <span className="text-sm font-bold text-amber-900">${property.monthlyRent.toLocaleString()}</span>
                                                  </div>
                                                </div>

                                                {/* Amenities */}
                                                <div className="mt-3">
                                                  <p className="text-sm font-medium text-slate-700 mb-2">Amenities</p>
                                                  <div className="flex flex-wrap gap-2">
                                                    {["Pool", "Gym", "Parking", "Laundry"].map(a => (
                                                      <Badge key={a} variant="outline" className="text-xs font-normal">
                                                        {a}
                                                      </Badge>
                                                    ))}
                                                  </div>
                                                </div>

                                                {/* View Details Link */}
                                                <button
                                                  type="button"
                                                  className="flex items-center gap-1.5 mt-4 text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors"
                                                  onClick={() => onNavigateToProperty?.(property.name)}
                                                >
                                                  View Property Details
                                                  <ArrowRight className="h-3.5 w-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}

                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab - Moved existing content */}
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-600" />
                      Documents ({documents.length})
                    </h3>
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-teal-600 hover:bg-teal-700"
                      onClick={() => setShowUploadDocModal(true)}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload Document
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Document Name</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Property</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Received Date</th>
                          <th className="text-left text-xs font-medium text-muted-foreground p-3">Received Time</th>
                          <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {documents.map((doc) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">{doc.propertyName}</span>
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                  {doc.propertyAddress}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">{doc.receivedDate}</td>
                            <td className="p-3 text-sm text-muted-foreground">{doc.receivedTime}</td>
                            <td className="p-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View">
                                  <Eye className="h-4 w-4 text-slate-600" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                                  <Download className="h-4 w-4 text-slate-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Processes Tab */}
            <TabsContent value="processes" className="mt-4">
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
                    In Progress ({ownerProcesses.inProgress.length + newlyStartedProcesses.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProcessStatusFilter("completed")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${processStatusFilter === "completed"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Completed ({ownerProcesses.completed.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProcessStatusFilter("upcoming")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${processStatusFilter === "upcoming"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Upcoming ({ownerProcesses.upcoming.length})
                  </button>
                </div>

                <div className="space-y-6">
                  {/* In Progress Processes */}
                  {processStatusFilter === "in-progress" && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <PlayCircle className="h-4 w-4 text-amber-500" />
                        <h4 className="font-semibold text-foreground">In Progress ({ownerProcesses.inProgress.length + newlyStartedProcesses.length})</h4>
                      </div>
                      <div className="space-y-2">
                        {newlyStartedProcesses.map((process) => (
                          <div key={process.id} className="border rounded-lg overflow-hidden border-teal-200 bg-teal-50/30 cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}>
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
                                      {process.prospectingStage}
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
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: contact.name }) }}>
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
                                      Remove Process
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                        {ownerProcesses.inProgress.map((process) => (
                          <div key={process.id} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}>
                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-4 flex-1 text-left">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-foreground">{process.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                      {process.prospectingStage}
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
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: contact.name }) }}>
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
                        <h4 className="font-semibold text-foreground">Upcoming ({ownerProcesses.upcoming.length})</h4>
                      </div>
                      <div className="space-y-2">
                        {ownerProcesses.upcoming.map((process) => (
                          <div key={process.id} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}>
                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-4 flex-1 text-left">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-foreground">{process.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                      {process.prospectingStage}
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
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: contact.name }) }}>
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
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <h4 className="font-semibold text-foreground">Completed ({ownerProcesses.completed.length})</h4>
                      </div>
                      <div className="space-y-2">
                        {ownerProcesses.completed.map((process) => (
                          <div key={process.id} className="border rounded-lg overflow-hidden cursor-pointer" onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}>
                            <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-4 flex-1 text-left">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-foreground">{process.name}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">
                                      {process.prospectingStage}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">Started: {process.startedOn}</span>
                                    <span className="text-xs text-muted-foreground">Completed: {process.completedOn}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
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
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: contact.name }) }}>
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
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit-log" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="h-5 w-5 text-teal-600" />
                    <h3 className="text-lg font-semibold">Audit Log 1</h3>
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
                          <TableHead className="w-24">Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactAuditLogs.length > 0 ? (
                          contactAuditLogs.map((log) => {
                            const isDeletedNote = log.actionType === "Deleted" && log.entity === "Note" && "deletedNoteContent" in log
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
                                <TableCell className="text-sm text-muted-foreground">
                                  {log.dateTime}
                                </TableCell>
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
                                            : log.actionType === "Logged"
                                              ? "border-amber-300 bg-amber-50 text-amber-700"
                                              : "border-gray-300 bg-gray-50 text-gray-700"
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
                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-teal-600 hover:text-teal-700 hover:bg-transparent">
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
                              No activity recorded for this contact yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    value={selectedTask.status}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, status: value as Task["status"] })}
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
                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    value={selectedTask.priority}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, priority: value as Task["priority"] })}
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
        currentTimestamp={selectedSMSItem?.date || ""}
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
        currentTimestamp={selectedEmailItem?.date || ""}
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
