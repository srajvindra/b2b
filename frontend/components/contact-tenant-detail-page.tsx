"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import type React from "react"

import { useState, type ReactNode } from "react"
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
  Check,
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
  FileWarning,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Calendar as CalendarWidget } from "@/components/ui/calendar"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { SMSPopupModal } from "./sms-popup-modal"
import { EmailPopupModal } from "./email-popup-modal"
import { useNav } from "./dashboard-app"

type ContactStatus = "Active" | "Inactive" | "Pending"

interface Contact {
  id: string
  name: string
  type: string
  email: string
  phone: string
  avatar?: string
  properties: string[]
  status: ContactStatus
  lastActive: string
  assignedStaff: string
  location: string
  source?: string
}

interface ContactTenantDetailPageProps {
  contact: Contact
  onBack: () => void
  onNavigateToUnitDetail?: (unitId: string, propertyId: string) => void
}

type CommunicationType = "email" | "sms" | "call" | "note" | "email_open"

interface CommunicationItem {
  id: string
  type: CommunicationType
  timestamp: string
  fullDate: string
  date: Date
  isRead: boolean
  isIncoming: boolean
  isResponded?: boolean
  isGroupChat?: boolean
  groupParticipants?: string[]
  unreadCount?: number
  unreadCount?: number
  from: {
    name: string
    contact: string
  }
  to: {
    name: string
    contact: string
  }
  preview: string
  subject?: string
  emailSubject?: string
  thread?: {
    id: string
    from: string
    email: string
    content: string
    timestamp: string
    fullDate: string
    isIncoming: boolean
  }[]
  content?: string
  duration?: string
  appfolioLink?: string
  notes?: string
}

const getCommunications = (tenantName: string, tenantPhone: string, tenantEmail: string): CommunicationItem[] => {
  const staffName = "Richard Surovi"
  const staffPhone = "(216) 810-2564"
  const staffEmail = "richard@b2bpm.com"

  return [
    {
      id: "s1",
      type: "sms",
      from: { name: staffName, contact: staffPhone },
      to: { name: tenantName, contact: tenantPhone },
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
      from: { name: tenantName, contact: tenantPhone },
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
      to: { name: tenantName, contact: "" },
      preview: "Sent text",
      content: "Sent text message to follow up on lease renewal.",
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
      to: { name: tenantName, contact: tenantPhone },
      preview: "Left voicemail about property management services. Call lasted 2 minutes.",
      duration: "2 minutes",
      timestamp: "12/4/2025, 10:30 AM",
      fullDate: "12/4/2025, 10:30 AM",
      date: new Date("2025-12-04T10:30:00"),
      isRead: true,
      isIncoming: false,
      appfolioLink: "https://appfolio.com/calls/12345",
      notes: "Left voicemail about lease renewal options and upcoming maintenance schedule.",
    },
    {
      id: "s3",
      type: "sms",
      from: { name: staffName, contact: staffPhone },
      to: { name: tenantName, contact: tenantPhone },
      preview: `Hi ${tenantName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday...`,
      content: `Hi ${tenantName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday about the lease renewal options.`,
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
      to: { name: tenantName, contact: tenantEmail },
      subject: "Follow-up: Lease Renewal Options",
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
          content: `Hi ${tenantName.split(" ")[0]},

Thank you for being a valued tenant. I wanted to reach out about your upcoming lease renewal.

We have the following options available:
- 12-month renewal at current rate
- 24-month renewal with 2% discount
- Month-to-month at 5% premium

Please let me know if you have any questions.

Best regards,
Richard Surovi
B2B Property Management`,
          timestamp: "11/28/2025, 3:15 PM",
          fullDate: "11/28/2025, 3:15 PM",
          isIncoming: false,
          emailOpens: [
            { openedAt: "11/28/2025, 4:45 PM" },
            { openedAt: "11/29/2025, 10:20 AM" },
          ],
        },
      ],
    },
    {
      id: "c2",
      type: "call",
      from: { name: staffName, contact: staffPhone },
      to: { name: tenantName, contact: tenantPhone },
      preview: "Initial discovery call - discussed property management services.",
      duration: "15 minutes",
      timestamp: "11/25/2025, 11:00 AM",
      fullDate: "11/25/2025, 11:00:00",
      date: new Date("2025-11-25T11:00:00"),
      isRead: true,
      isIncoming: false,
      isResponded: true,
      appfolioLink: "https://appfolio.com/calls/12346",
      notes: "Initial call with tenant about maintenance request and upcoming property inspection.",
    },
    // Additional communications for filter coverage
    {
      id: "e2",
      type: "email",
      from: { name: tenantName, contact: tenantEmail },
      to: { name: staffName, contact: staffEmail },
      subject: "Question about maintenance request",
      preview: "Hi, I submitted a maintenance request last week but haven't heard back...",
      timestamp: "12/5/2025, 10:15 AM",
      fullDate: "12/5/2025, 10:15 AM",
      date: new Date("2025-12-05T10:15:00"),
      isRead: false,
      isIncoming: true,
      isResponded: false,
      thread: [
        {
          id: "e2-1",
          from: tenantName,
          email: tenantEmail,
          content: `Hi,

I submitted a maintenance request last week for the leaking faucet in the kitchen but haven't heard back yet. Could you please provide an update on when someone will be able to come take a look?

Thank you,
${tenantName}`,
          timestamp: "12/5/2025, 10:15 AM",
          fullDate: "12/5/2025, 10:15 AM",
          isIncoming: true,
        },
      ],
    },
    {
      id: "s4",
      type: "sms",
      from: { name: tenantName, contact: tenantPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Is it possible to pay rent a few days late this month?",
      content: "Hi, is it possible to pay rent a few days late this month? I had an unexpected expense come up.",
      timestamp: "12/5/2025, 3:30 PM",
      fullDate: "12/5/2025, 3:30 PM",
      date: new Date("2025-12-05T15:30:00"),
      isRead: true,
      isIncoming: true,
      isResponded: false,
    },
    {
      id: "c3",
      type: "call",
      from: { name: tenantName, contact: tenantPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Missed call from tenant - need to return call.",
      duration: "0 minutes",
      timestamp: "12/5/2025, 5:00 PM",
      fullDate: "12/5/2025, 5:00 PM",
      date: new Date("2025-12-05T17:00:00"),
      isRead: true,
      isIncoming: true,
      isResponded: false,
      notes: "Missed call from tenant. Left voicemail about parking issue.",
    },
    {
      id: "n2",
      type: "note",
      from: { name: staffName, contact: "" },
      to: { name: tenantName, contact: "" },
      preview: "Tenant mentioned interest in longer lease term",
      content: "Tenant expressed interest in signing a 24-month lease for the 2% discount. Will follow up after the holidays.",
      timestamp: "12/3/2025, 2:00 PM",
      fullDate: "12/3/2025, 2:00 PM",
      date: new Date("2025-12-03T14:00:00"),
      isRead: true,
      isIncoming: false,
    },
    {
      id: "s5",
      type: "sms",
      from: { name: tenantName, contact: tenantPhone },
      to: { name: staffName, contact: staffPhone },
      preview: "Thanks for getting the heater fixed so quickly!",
      content: "Thanks for getting the heater fixed so quickly! Really appreciate it.",
      timestamp: "12/2/2025, 4:45 PM",
      fullDate: "12/2/2025, 4:45 PM",
      date: new Date("2025-12-02T16:45:00"),
      isRead: false,
      isIncoming: true,
      isResponded: false,
    },
    // Group Chat Communications
    {
      id: "g1",
      type: "sms",
      from: { name: "Mike Davis", contact: "(216) 555-4567" },
      to: { name: "Building Residents", contact: "" },
      preview: "Building maintenance notice: Water will be shut off on Monday 9-11 AM.",
      content: "Building maintenance notice: Water will be shut off on Monday 9-11 AM for pipe repairs. Please plan accordingly.",
      timestamp: "12/6/2025, 9:00 AM",
      fullDate: "12/6/2025, 9:00 AM",
      date: new Date("2025-12-06T09:00:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Mike Davis", tenantName, "John Smith", "Emily Chen", "David Wilson"],
      unreadCount: 3,
    },
    {
      id: "g2",
      type: "sms",
      from: { name: tenantName, contact: tenantPhone },
      to: { name: "Building Residents", contact: "" },
      preview: "Thanks for the heads up! Will make sure to fill some water containers.",
      content: "Thanks for the heads up! Will make sure to fill some water containers beforehand.",
      timestamp: "12/6/2025, 9:30 AM",
      fullDate: "12/6/2025, 9:30 AM",
      date: new Date("2025-12-06T09:30:00"),
      isRead: true,
      isIncoming: true,
      isGroupChat: true,
      groupParticipants: ["Mike Davis", tenantName, "John Smith", "Emily Chen", "David Wilson"],
      unreadCount: 0,
    },
    {
      id: "g3",
      type: "email",
      from: { name: "Sarah Johnson", contact: "sarah@b2bpm.com" },
      to: { name: "Building A Tenants", contact: "" },
      subject: "Holiday Parking Guidelines - Please Read",
      preview: "Dear tenants, as we approach the holiday season...",
      timestamp: "12/5/2025, 2:00 PM",
      fullDate: "12/5/2025, 2:00 PM",
      date: new Date("2025-12-05T14:00:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Sarah Johnson", tenantName, "Multiple Building A Residents"],
      unreadCount: 8,
      thread: [
        {
          id: "g3-1",
          from: "Sarah Johnson",
          email: "sarah@b2bpm.com",
          content: `Dear tenants,

As we approach the holiday season, please be reminded of our parking guidelines:

1. Guest parking is limited to spots 50-65
2. No overnight parking in fire lanes
3. Snow removal begins at 5 AM - please move vehicles

If you're expecting multiple guests, please notify the office in advance.

Happy Holidays!
Sarah Johnson
Property Management`,
          timestamp: "12/5/2025, 2:00 PM",
          fullDate: "12/5/2025, 2:00 PM",
          isIncoming: false,
        },
      ],
    },
    {
      id: "g4",
      type: "sms",
      from: { name: staffName, contact: staffPhone },
      to: { name: "Lease Renewal Group", contact: "" },
      preview: "Reminder: Lease renewal discussions available. Contact us to schedule.",
      content: "Reminder: It's time to discuss lease renewals for units expiring in Q1. Please contact us to schedule a meeting at your convenience.",
      timestamp: "12/4/2025, 11:00 AM",
      fullDate: "12/4/2025, 11:00 AM",
      date: new Date("2025-12-04T11:00:00"),
      isRead: false,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: [staffName, tenantName, "Lisa Wong", "Michael Brown"],
      unreadCount: 2,
    },
    {
      id: "g5",
      type: "email",
      from: { name: "Nina Patel", contact: "nina@b2bpm.com" },
      to: { name: "Maintenance Coordination", contact: "" },
      subject: "Re: Unit 204 Maintenance - Coordination Required",
      preview: "Following up on the maintenance request for Unit 204...",
      timestamp: "12/3/2025, 4:30 PM",
      fullDate: "12/3/2025, 4:30 PM",
      date: new Date("2025-12-03T16:30:00"),
      isRead: true,
      isIncoming: false,
      isGroupChat: true,
      groupParticipants: ["Nina Patel", staffName, "ABC Plumbing Services", tenantName],
      unreadCount: 0,
      thread: [
        {
          id: "g5-1",
          from: "Nina Patel",
          email: "nina@b2bpm.com",
          content: `Team,

Following up on the maintenance request for Unit 204. The plumber has confirmed availability for Thursday between 10 AM - 12 PM.

${tenantName}, please ensure someone is home to provide access.

Richard, can you coordinate with the vendor on arrival time?

Thanks,
Nina`,
          timestamp: "12/3/2025, 4:30 PM",
          fullDate: "12/3/2025, 4:30 PM",
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
    name: "Lease Agreement - Signed.pdf",
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
    name: "Move-in Inspection Report.pdf",
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
    name: "Renters Insurance Certificate.pdf",
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
    name: "ID Verification.pdf",
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
  processName: string
  relatedEntityType: "Tenant" | "Property" | "Lease Prospect" | "Owner" | "Owner Prospect"
  relatedEntityName: string
  assignee: string
  assigneeAvatar?: string
  status: "Pending" | "In Progress" | "Completed" | "Skipped"
  priority: "Low" | "Medium" | "High"
  dueDate: string
  isOverdue: boolean
  autoCreated?: boolean
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
    title: "Inspect unit condition - Unit 108",
    processName: "Move Out for 456 Elm Ave",
    relatedEntityType: "Property",
    relatedEntityName: "Elm Court",
    assignee: "Mike Johnson",
    status: "Pending",
    priority: "Medium",
    dueDate: "2025-12-26",
    isOverdue: false,
  },
  {
    id: "task7",
    title: "Process security deposit return - Unit 204",
    processName: "Move Out for 123 Oak Street",
    relatedEntityType: "Tenant",
    relatedEntityName: "John Smith",
    assignee: "Nina Patel",
    status: "Pending",
    priority: "Low",
    dueDate: "2025-12-28",
    isOverdue: false,
  },
  {
    id: "task8",
    title: "Update tenant contact info in system",
    processName: "",
    relatedEntityType: "Tenant",
    relatedEntityName: "Lisa Chen",
    assignee: "Richard Surovi",
    status: "Pending",
    priority: "Low",
    dueDate: "2025-12-30",
    isOverdue: false,
  },
]

// Tenant Processes Data
const tenantProcesses = {
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
      name: "Lease Renewal Assessment",
      prospectingStage: "Active Tenant",
      startedOn: "01/12/2026",
      status: "In Progress",
      tasks: [
        { id: "t20", name: "Review current lease terms", startDate: "01/12/2026", completedDate: "01/12/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        { id: "t21", name: "Assess market rental rates", startDate: "01/13/2026", completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t22", name: "Prepare renewal offer", startDate: null, completedDate: null, staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
      ],
    },
    {
      id: "proc-8",
      name: "Maintenance Request Follow-Up",
      prospectingStage: "Active Tenant",
      startedOn: "01/14/2026",
      status: "In Progress",
      tasks: [
        { id: "t23", name: "Review open maintenance tickets", startDate: "01/14/2026", completedDate: "01/14/2026", staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
        { id: "t24", name: "Schedule vendor appointments", startDate: "01/15/2026", completedDate: null, staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
        { id: "t25", name: "Confirm completion with tenant", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
      ],
    },
    {
      id: "proc-9",
      name: "Rent Payment Verification",
      prospectingStage: "Active Tenant",
      startedOn: "01/11/2026",
      status: "In Progress",
      tasks: [
        { id: "t26", name: "Verify January payment received", startDate: "01/11/2026", completedDate: "01/11/2026", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        { id: "t27", name: "Update payment ledger", startDate: "01/12/2026", completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
      ],
    },
    {
      id: "proc-10",
      name: "Pet Policy Compliance Check",
      prospectingStage: "Active Tenant",
      startedOn: "01/16/2026",
      status: "In Progress",
      tasks: [
        { id: "t28", name: "Review pet registration records", startDate: "01/16/2026", completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        { id: "t29", name: "Verify vaccination documents", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
      ],
    },
    {
      id: "proc-11",
      name: "Insurance Renewal Tracking",
      prospectingStage: "Active Tenant",
      startedOn: "01/17/2026",
      status: "In Progress",
      tasks: [
        { id: "t30", name: "Check renter's insurance expiry", startDate: "01/17/2026", completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        { id: "t31", name: "Send renewal reminder", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
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
      name: "Annual Property Inspection",
      prospectingStage: "Active Tenant",
      status: "Upcoming",
      tasks: [
        { id: "t32", name: "Schedule inspection date", startDate: null, completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t33", name: "Conduct walk-through", startDate: null, completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t34", name: "File inspection report", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
      ],
    },
    {
      id: "proc-13",
      name: "Emergency Contact Update",
      prospectingStage: "Active Tenant",
      status: "Upcoming",
      tasks: [
        { id: "t35", name: "Request updated contacts", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        { id: "t36", name: "Update records in system", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
      ],
    },
    {
      id: "proc-14",
      name: "Parking Permit Renewal",
      prospectingStage: "Active Tenant",
      status: "Upcoming",
      tasks: [
        { id: "t37", name: "Verify vehicle registration", startDate: null, completedDate: null, staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
        { id: "t38", name: "Issue new parking permit", startDate: null, completedDate: null, staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
      ],
    },
    {
      id: "proc-15",
      name: "Utility Account Audit",
      prospectingStage: "Active Tenant",
      status: "Upcoming",
      tasks: [
        { id: "t39", name: "Verify utility accounts in tenant name", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        { id: "t40", name: "Reconcile shared utility costs", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
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
      name: "Move-In Documentation",
      prospectingStage: "New Lead",
      startedOn: "12/28/2025",
      completedOn: "12/30/2025",
      status: "Completed",
      tasks: [
        { id: "t41", name: "Complete move-in checklist", startDate: "12/28/2025", completedDate: "12/28/2025", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t42", name: "Document pre-existing conditions", startDate: "12/29/2025", completedDate: "12/30/2025", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
      ],
    },
    {
      id: "proc-17",
      name: "Security Deposit Processing",
      prospectingStage: "New Lead",
      startedOn: "12/26/2025",
      completedOn: "12/27/2025",
      status: "Completed",
      tasks: [
        { id: "t43", name: "Collect security deposit", startDate: "12/26/2025", completedDate: "12/26/2025", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
        { id: "t44", name: "Deposit into trust account", startDate: "12/27/2025", completedDate: "12/27/2025", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
      ],
    },
    {
      id: "proc-18",
      name: "Key and Access Distribution",
      prospectingStage: "New Lead",
      startedOn: "12/30/2025",
      completedOn: "12/31/2025",
      status: "Completed",
      tasks: [
        { id: "t45", name: "Prepare key sets", startDate: "12/30/2025", completedDate: "12/30/2025", staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
        { id: "t46", name: "Issue access cards and codes", startDate: "12/31/2025", completedDate: "12/31/2025", staffName: "John Smith", staffEmail: "john.smith@heropm.com" },
      ],
    },
    {
      id: "proc-19",
      name: "Tenant Portal Setup",
      prospectingStage: "New Lead",
      startedOn: "12/25/2025",
      completedOn: "12/26/2025",
      status: "Completed",
      tasks: [
        { id: "t47", name: "Create tenant portal account", startDate: "12/25/2025", completedDate: "12/25/2025", staffName: "Michael Chen", staffEmail: "michael.chen@heropm.com" },
        { id: "t48", name: "Send login credentials", startDate: "12/26/2025", completedDate: "12/26/2025", staffName: "Michael Chen", staffEmail: "michael.chen@heropm.com" },
      ],
    },
  ],
}

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

// Audit log data for tenant contact-related events
const tenantAuditLogs = [
  {
    id: "1",
    dateTime: "Jan 18, 2026 – 10:42 AM",
    user: "Nina Patel",
    userRole: "Property Manager",
    actionType: "Updated",
    entity: "Contact Info",
    description: "Updated email address from old@email.com to john.smith@example.com",
    source: "Web",
  },
  {
    id: "2",
    dateTime: "Jan 17, 2026 – 3:15 PM",
    user: "Sarah Johnson",
    userRole: "Maintenance Coordinator",
    actionType: "Updated",
    entity: "Assignee",
    description: "Changed assignee from Raj Patel to Nina Patel",
    source: "Web",
  },
  {
    id: "3",
    dateTime: "Jan 16, 2026 – 11:30 AM",
    user: "Richard Surovi",
    userRole: "Leasing Agent",
    actionType: "Created",
    entity: "Note",
    description: "Added note regarding lease renewal discussion",
    source: "Web",
  },
  {
    id: "4",
    dateTime: "Jan 15, 2026 – 2:45 PM",
    user: "Mike Chen",
    userRole: "Accountant",
    actionType: "Created",
    entity: "Document",
    description: "Uploaded Lease Agreement - Signed.pdf",
    source: "Web",
  },
  {
    id: "5",
    dateTime: "Jan 14, 2026 – 9:00 AM",
    user: "System",
    userRole: "Automation",
    actionType: "Logged",
    entity: "Communication",
    description: "Email sent: Follow-up: Lease Renewal Options",
    source: "System",
  },
  {
    id: "6",
    dateTime: "Jan 12, 2026 – 4:20 PM",
    user: "Richard Surovi",
    userRole: "Leasing Agent",
    actionType: "Logged",
    entity: "Communication",
    description: "Outbound call logged - Duration: 2 minutes",
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
    dateTime: "Jan 13, 2026 – 4:45 PM",
    user: "Nina Patel",
    userRole: "Property Manager",
    actionType: "Deleted",
    entity: "Note",
    description: "Deleted note: 'Maintenance request follow-up'",
    source: "Web",
    deletedNoteContent: "Tenant reported minor leak under kitchen sink on Jan 12. Maintenance scheduled for Jan 15 between 10 AM - 12 PM. Tenant confirmed they will be home. Need to follow up after repair to ensure issue is resolved. If leak persists, may need to escalate to plumbing contractor.",
    deletedBy: "Nina Patel",
    deletedOn: "Jan 13, 2026 – 4:45 PM",
  },
  {
    id: "9",
    dateTime: "Jan 9, 2026 – 10:30 AM",
    user: "Richard Surovi",
    userRole: "Leasing Agent",
    actionType: "Deleted",
    entity: "Note",
    description: "Deleted note: 'Incorrect lease renewal date'",
    source: "Web",
    deletedNoteContent: "Lease renewal discussion scheduled for Feb 15. Note: This entry contained incorrect date - actual renewal discussion is Feb 20. See updated note for correct information.",
    deletedBy: "Richard Surovi",
    deletedOn: "Jan 9, 2026 – 10:30 AM",
  },
]

export default function ContactTenantDetailPage({ contact, onBack, onNavigateToUnitDetail }: ContactTenantDetailPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null)
  const [selectedThreadEmailId, setSelectedThreadEmailId] = useState<string | null>(null)
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


  const [activeTab, setActiveTab] = useState<"overview" | "tenant-info" | "property" | "processes" | "communications" | "documents" | "audit-log">("overview")

  // Tenant stage state
  const [tenantStage, setTenantStage] = useState<string>("current")

  // Processes tab state
  const [processStatusFilter, setProcessStatusFilter] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([])
  const nav = useNav()

  const handleNavigateToProcess = (processName: string) => {
    setActiveTab("processes")
    const allProcesses = [
      ...tenantProcesses.inProgress,
      ...tenantProcesses.upcoming,
      ...tenantProcesses.completed,
      ...newlyStartedProcesses,
    ]
    const match = allProcesses.find((p) => p.name === processName)
    if (match) {
      setExpandedProcesses((prev) => (prev.includes(match.id) ? prev : [...prev, match.id]))
    }
  }

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
  
  // Tenant-specific missing information data
  const tenantMissingFields = [
    { id: 1, fieldName: "Emergency Contact", section: "Tenant Information", tab: "tenant-info" },
    { id: 2, fieldName: "Date of Birth", section: "Screening", tab: "tenant-info" },
    { id: 3, fieldName: "Driver's License", section: "Screening", tab: "tenant-info" },
    { id: 4, fieldName: "Vehicle Information", section: "Additional Info", tab: "tenant-info" },
    { id: 5, fieldName: "Employer Details", section: "Employment", tab: "tenant-info" },
  ]
  
  const tenantMissingDocuments = [
    { id: 1, documentName: "Renter's Insurance", status: "Not uploaded", section: "Documents" },
    { id: 2, documentName: "Photo ID", status: "Not uploaded", section: "Documents" },
    { id: 3, documentName: "Proof of Income", status: "Not uploaded", section: "Documents" },
    { id: 4, documentName: "Signed Lease Agreement", status: "Not uploaded", section: "Documents" },
  ]
  
  // Notes modal state
  const [selectedNote, setSelectedNote] = useState<{
    id: number
    title: string
    content: string
    createdBy: string
    createdAt: string
  } | null>(null)
  const [showNoteModal, setShowNoteModal] = useState(false)
  
  // Dummy notes data
  const tenantNotes = [
    {
      id: 1,
      title: "Lease Renewal Discussion",
      content: "Spoke with tenant about upcoming lease renewal. They expressed interest in a 12-month extension with current terms. Tenant mentioned they may have a roommate moving in - reminded them of the guest policy and that any additional occupants need to be added to the lease. Follow up scheduled for next week to finalize paperwork.",
      createdBy: "Richard Surovi",
      createdAt: "01/15/2026, 2:30 PM"
    },
    {
      id: 2,
      title: "Maintenance Request Follow-up",
      content: "Called tenant to confirm HVAC repair was completed satisfactorily. Tenant confirmed the AC is now working properly and thanked us for the quick response. No further issues reported at this time.",
      createdBy: "Nina Patel",
      createdAt: "01/10/2026, 11:45 AM"
    },
    {
      id: 3,
      title: "Payment Plan Agreement",
      content: "Tenant requested a payment plan for January rent due to unexpected medical expenses. Agreed to split January rent into two payments: $1,000 due by 01/15 and remaining $650 due by 01/31. Tenant signed payment agreement form. Will waive late fee this one time as tenant has otherwise been in good standing for 2+ years.",
      createdBy: "Richard Surovi",
      createdAt: "01/05/2026, 9:15 AM"
    }
  ]
  
  // Dummy letters data
  const tenantLetters = [
    {
      id: 1,
      title: "3 Day Notice Non Payment Of Rent (B2 B Format)",
      createdOn: "08/08/2025",
      createdTime: "08:26 AM"
    },
    {
      id: 2,
      title: "Lease Renewal Offer Letter",
      createdOn: "12/15/2025",
      createdTime: "10:30 AM"
    },
    {
      id: 3,
      title: "Move-In Inspection Report",
      createdOn: "06/01/2024",
      createdTime: "02:15 PM"
    }
  ]

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "Medium" as Task["priority"],
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
  // Activity date + search filters
  const [activityDateRange, setActivityDateRange] = useState<DateRange | undefined>(undefined)
  const [activityDatePopoverOpen, setActivityDatePopoverOpen] = useState(false)
  const [activitySearchQuery, setActivitySearchQuery] = useState("")

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
  // Communications Tab filters (type, date, search)
  const [commTabTypeFilter, setCommTabTypeFilter] = useState<"all" | "email" | "sms" | "call">("all")
  const [commTabDateRange, setCommTabDateRange] = useState<DateRange | undefined>(undefined)
  const [commTabDatePopoverOpen, setCommTabDatePopoverOpen] = useState(false)
  const [commTabSearchQuery, setCommTabSearchQuery] = useState("")
  const [emailComposeCc, setEmailComposeCc] = useState("")
  const [emailComposeBcc, setEmailComposeBcc] = useState("")
  const [emailComposeSubject, setEmailComposeSubject] = useState("")
  const [emailComposeBody, setEmailComposeBody] = useState("")
  const [showCcBcc, setShowCcBcc] = useState(false)

  const communications = getCommunications(contact.name, contact.phone, contact.email)
  const documents = getDocuments()

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

  // Highlight search matches in text
  const highlightText = (text: string | undefined | null): ReactNode => {
    if (!text) return text
    const q = activitySearchQuery.trim()
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
  
  // Highlight search matches for Communications Tab
  const highlightCommTabText = (text: string | undefined | null): ReactNode => {
    if (!text) return text
    const q = commTabSearchQuery.trim()
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

  // Filter unpinned communications based on tile, radio, and date filters
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
    .filter((item) => {
      // Date range filter
      if (activityDateRange?.from) {
        const msgDate = item.date
        const from = startOfDay(activityDateRange.from)
        const to = activityDateRange.to ? endOfDay(activityDateRange.to) : endOfDay(activityDateRange.from)
        if (!isWithinInterval(msgDate, { start: from, end: to })) return false
      }
      return true
    })

  const propertyInfo = {
    name: "Sunset Apartments",
    address: "123 Sunset Blvd, Unit 4B, San Francisco, CA 94102",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    yearBuilt: 2015,
    amenities: ["WiFi", "Parking", "Gym", "Pool", "Security"],
    owner: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(415) 555-1234",
    },
    leaseInfo: {
      startDate: "01/01/2024",
      endDate: "12/31/2024",
      term: "12 months",
      status: "Active",
    },
    rentInfo: {
      monthlyRent: 2500,
      securityDeposit: 2500,
      dueDate: "1st of each month",
      paymentMethod: "Bank Transfer",
      lastPayment: "12/01/2025",
      nextDue: "01/01/2026",
    },
  }

  const tenantSummary = {
    propertyLabel: `${propertyInfo.name} - ${propertyInfo.address.split(",")[0]}`,
    fullAddress: propertyInfo.address,
    recurringCharges: propertyInfo.rentInfo.monthlyRent,
    currentBalance: 3743,
    depositPaid: propertyInfo.rentInfo.securityDeposit > 0 ? propertyInfo.rentInfo.securityDeposit : 0,
    lastReceipt: "01/30/2026",
    leaseEndDate: propertyInfo.leaseInfo.endDate,
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
        return "text-blue-400"
      case "sms":
        return "text-green-400"
      case "call":
        return "text-amber-400"
      case "note":
        return "text-orange-400"
    }
  }

  const getStatusBadgeStyle = (status: Task["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "In Progress":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Pending":
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setViewTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setEditTaskModalOpen(true)
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "Completed" as const } : t)))
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
      const task: Task = {
        id: `task${tasks.length + 1}`,
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee || "Unassigned",
        status: "Pending",
        priority: newTask.priority,
        dueDate: newTask.dueDate || "TBD",
        createdDate: new Date().toLocaleDateString(),
        propertyName: propertyInfo.name,
        propertyAddress: propertyInfo.address,
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
        <div key={item.id} className="bg-white">
          <div className="p-4">
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

  // Collapsed email header rendering
  if (item.type === "email") {
    const emailSubject = item.subject || item.emailSubject || "No Subject"
    const isExpanded = expandedId === item.id
    const threadCount = item.thread ? item.thread.length : 0

    return (
      <div key={item.id} className="bg-white">
        {/* Collapsed email header bar */}
        <div
          className="px-4 py-3 cursor-pointer hover:bg-blue-50/60 transition-colors bg-blue-50/40"
          onClick={() => setExpandedId(isExpanded ? null : item.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Mail className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{highlightText(emailSubject)}</span>
              {!item.isRead && <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              <button
                onClick={(e) => handleTogglePin(e, item.id)}
                className={`p-1 rounded hover:bg-blue-100 ${pinnedIds.has(item.id) ? "text-blue-600" : "text-muted-foreground"}`}
              >
                <Pin className={`h-4 w-4 ${pinnedIds.has(item.id) ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded email content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-blue-100 bg-blue-50/20">
            <div className="pt-4 space-y-4">
              {/* Sender info */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium bg-slate-200 text-slate-700">
                  {getInitials(item.from.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{item.from.name}</span>
                    <span className="text-xs text-muted-foreground">{item.fullDate}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">To: {item.to.name} ({item.to.contact})</p>
                </div>
              </div>

              {/* Email body */}
              <div className="text-sm text-foreground whitespace-pre-line pl-11">{highlightText(item.content || item.preview)}</div>

              {/* Reply action */}
              <div className="pl-11">
                {replyingToId === item.id ? (
                  <div className="space-y-2">
                    <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary bg-white">
                      <Textarea
                        placeholder="Reply via email..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[80px] border-0 focus-visible:ring-0 resize-none"
                      />
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
                  <Button size="sm" variant="outline" onClick={() => setReplyingToId(item.id)}>
                    <Send className="h-3 w-3 mr-1" /> Reply
                  </Button>
                )}
              </div>

              {/* Email thread */}
              {item.thread && threadCount > 0 && (
                <div className="border-t border-blue-100 pt-3 pl-11">
                  <button
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedThreadId(expandedThreadId === item.id ? null : item.id)
                    }}
                  >
                    <ChevronDown className={`h-3 w-3 transition-transform ${expandedThreadId === item.id ? "rotate-180" : ""}`} />
                    <span>View full thread ({threadCount} previous messages)</span>
                  </button>
                  {expandedThreadId === item.id && (
                    <div className="mt-3 space-y-2">
                      {item.thread.map((email) => (
                        <div
                          key={email.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedThreadEmailId === email.id
                              ? "border-blue-300 bg-blue-50 border"
                              : "border hover:border-blue-200 hover:bg-blue-50/30"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedThreadEmailId(selectedThreadEmailId === email.id ? null : email.id)
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs">{email.from}</span>
                              <span className="text-xs text-muted-foreground">{email.email}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                          </div>
                          {selectedThreadEmailId === email.id ? (
                            <p className="text-sm whitespace-pre-line mt-2">{highlightText(email.content)}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground line-clamp-1">{highlightText(email.content)}</p>
                          )}
                          {/* Email Opens */}
                          {selectedThreadEmailId === email.id && !email.isIncoming && email.emailOpens && email.emailOpens.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-dashed">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Email Opened</p>
                              <div className="space-y-1">
                                {email.emailOpens.map((open: { openedAt: string }, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-amber-500">
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Non-email items (SMS, call, note)
  return (
  <div key={item.id} className="bg-white">
  <div
  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
  onClick={() => {
  if (item.type === "sms") {
  openThreadModal()
  return
  }
  setExpandedId(expandedId === item.id ? null : item.id)
  }}
  >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  item.isIncoming ? "bg-gray-200 text-gray-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {getInitials(item.from.name)}
              </div>
                  <div
                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ${
                  item.type === "sms"
                  ? "bg-green-50 border border-green-200"
                  : item.type === "call"
                  ? "bg-amber-50 border border-amber-200"
                  : item.type === "note"
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-gray-50 border border-gray-200"
                  }`}
                  >
                {item.type === "sms" && <MessageSquare className="h-3 w-3 text-green-400" />}
                {item.type === "note" && <MessageSquare className="h-3 w-3 text-orange-400" />}
                {item.type === "call" && <PhoneCall className="h-3 w-3 text-amber-400" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 text-sm">
                {item.type === "note" ? (
                  <>
                    <span className="font-medium text-slate-800">{item.from.name}</span>
                    <span className="text-orange-400 font-medium">left a Note</span>
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
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{highlightText(item.preview)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            {item.isGroupChat && (item.unreadCount ?? 0) > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                {item.unreadCount}
              </span>
            )}
            {!item.isRead && !item.isGroupChat && <div className="h-2 w-2 rounded-full bg-blue-400" />}
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
            {item.type === "sms" && <p className="text-sm">{highlightText(item.content)}</p>}

            {item.type === "call" && (
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{item.duration}</span>
                </div>
                {item.notes && (
                  <div>
                    <span className="text-sm text-muted-foreground">Notes:</span>
                    <p className="text-sm mt-1">{highlightText(item.notes)}</p>
                  </div>
                )}
              </div>
            )}

            {item.type === "note" && <p className="text-sm">{highlightText(item.content)}</p>}

            {replyingToId === item.id ? (
              <div className="space-y-2">
                <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary bg-white">
                  <Textarea
                    placeholder="Reply via SMS..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px] border-0 focus-visible:ring-0 resize-none"
                  />
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
              item.type === "sms" && (
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

  // Communications Tab: precomputed filtered message lists
  const commTabAllPrivate = communications
    .filter(c => !c.isGroupChat && c.type !== "note")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
  const commTabPrivateFiltered = commTabAllPrivate.filter(c => {
    if (commTabTypeFilter !== "all" && c.type !== commTabTypeFilter) return false
    if (commTabDateRange?.from) {
      const from = startOfDay(commTabDateRange.from)
      const to = commTabDateRange.to ? endOfDay(commTabDateRange.to) : endOfDay(commTabDateRange.from)
      if (!isWithinInterval(c.date, { start: from, end: to })) return false
    }
    return true
  })

  // Communications Tab: precomputed group data
  const commTabGroupComms = communications.filter(c => c.isGroupChat)
  const commTabGroupMap = new Map<string, { name: string; participants: string[]; messages: typeof commTabGroupComms; unreadCount: number; lastMessage: typeof commTabGroupComms[0] }>()
  commTabGroupComms.forEach(msg => {
    const groupName = msg.to?.name || "Unknown Group"
    if (!commTabGroupMap.has(groupName)) {
      commTabGroupMap.set(groupName, {
        name: groupName,
        participants: msg.to?.participants || [],
        messages: [],
        unreadCount: 0,
        lastMessage: msg
      })
    }
    const group = commTabGroupMap.get(groupName)!
    group.messages.push(msg)
    group.unreadCount += msg.unreadCount ?? 0
    if (msg.date.getTime() > group.lastMessage.date.getTime()) {
      group.lastMessage = msg
    }
  })
  const commTabGroups = Array.from(commTabGroupMap.values()).sort((a, b) => b.lastMessage.date.getTime() - a.lastMessage.date.getTime())
  const commTabSelectedGroup = selectedGroupId ? commTabGroups.find(g => g.name === selectedGroupId) : null
  const commTabGroupFiltered = commTabSelectedGroup
    ? commTabSelectedGroup.messages.filter(c => {
        if (commTabTypeFilter !== "all" && c.type !== commTabTypeFilter) return false
        if (commTabDateRange?.from) {
          const from = startOfDay(commTabDateRange.from)
          const to = commTabDateRange.to ? endOfDay(commTabDateRange.to) : endOfDay(commTabDateRange.from)
          if (!isWithinInterval(c.date, { start: from, end: to })) return false
        }
        return true
      }).sort((a, b) => a.date.getTime() - b.date.getTime())
    : []

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
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
            {/* Stage Color Bar */}
            <div className="flex items-center gap-1 mb-4">
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
            </div>

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
              <FileWarning className="h-3.5 w-3.5 text-amber-600" />
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
                <span className="font-semibold">{tenantMissingDocuments.length}</span>
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

        <div className="flex items-stretch border-b border-border">
          {[
            { id: "overview", label: "Overview" },
            { id: "tenant-info", label: "Details" },
            { id: "property", label: "Properties" },
            { id: "communications", label: "Communications", count: communications.filter(c => c.type !== "note").length },
            { id: "processes", label: "Processes", count: tenantProcesses.inProgress.length + tenantProcesses.upcoming.length + tenantProcesses.completed.length },
            { id: "documents", label: "Documents", count: documents.length },
            { id: "audit-log", label: "Audit Log" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
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
                <div className="border rounded-lg overflow-hidden max-h-[360px] overflow-y-auto">
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
                                  onClick={(e) => { e.stopPropagation(); handleNavigateToProcess(task.processName) }}
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
                              className={`text-xs ${
                                task.priority === "High" 
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
                              className={`text-xs ${
                                task.status === "In Progress" 
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
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activityChatTab === "private"
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
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activityChatTab === "group"
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
                        {activitySummary.all}
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
                        {activitySummary.emailsTotal}
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
                        {activitySummary.smsTotal}
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

                {/* Date Filter + Search Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-4 p-2.5 rounded-lg border border-slate-200 bg-white">
                  {/* Date range picker */}
                  <Popover open={activityDatePopoverOpen} onOpenChange={setActivityDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          activityDateRange?.from
                            ? "bg-teal-50 text-teal-700 border-teal-200"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        {activityDateRange?.from ? (
                          activityDateRange.to
                            ? `${format(activityDateRange.from, "MMM d")} - ${format(activityDateRange.to, "MMM d, yyyy")}`
                            : format(activityDateRange.from, "MMM d, yyyy")
                        ) : (
                          "Date"
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarWidget
                        mode="range"
                        selected={activityDateRange}
                        onSelect={(range) => {
                          setActivityDateRange(range)
                          if (range?.to) setActivityDatePopoverOpen(false)
                        }}
                        numberOfMonths={1}
                      />
                      {activityDateRange?.from && (
                        <div className="border-t p-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => { setActivityDateRange(undefined); setActivityDatePopoverOpen(false) }}
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
                      value={activitySearchQuery}
                      onChange={(e) => setActivitySearchQuery(e.target.value)}
                      placeholder="Search conversations..."
                      className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                    />
                    {activitySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setActivitySearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {(activityDateRange?.from || activitySearchQuery) && (
                    <button
                      type="button"
                      onClick={() => { setActivityDateRange(undefined); setActivitySearchQuery("") }}
                      className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="divide-y border rounded-lg max-h-[360px] overflow-y-auto">
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
          <div className="space-y-6">
            {/* Two Column Layout - Status/Portal and Contact/Tenant Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Status Section */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                    <CardTitle className="text-base font-semibold text-slate-800">Status</CardTitle>
                    <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Balance</span>
                        <span className="font-medium text-teal-600">$2,325.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          Delinquency Notes <HelpCircle className="h-3 w-3" />
                        </span>
                        <span className="text-teal-600 cursor-pointer hover:underline">Add delinquency note</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Last Receipt</span>
                        <span className="font-medium text-teal-600">12/11/2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Evicting</span>
                        <span className="font-medium">No</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">In Collections</span>
                        <span className="font-medium">No</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Certified Funds Only</span>
                        <span className="font-medium">No</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Require Online Payments In Full</span>
                        <span className="font-medium">No</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Eligible for Renewal</span>
                        <span className="font-medium">Yes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Online Portal Status Section - Moved to left column */}
                

                {/* Tags Section */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                    <CardTitle className="text-base font-semibold text-slate-800">Tags</CardTitle>
                    <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="bg-slate-50 rounded-lg p-4 border">
                      <h4 className="font-semibold text-slate-800 mb-2">FolioGuard Smart Ensure</h4>
                      <p className="text-sm text-slate-600 mb-3">
                        Unlock new revenue streams with Smart Ensure while protecting your properties. 
                        Automatically track and enforce your insurance requirements - let the system do the heavy lifting.
                      </p>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Contact Me</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Section */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                    <CardTitle className="text-base font-semibold text-slate-800">Contact</CardTitle>
                    <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Phone Numbers</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          <span className="text-slate-500">Home</span>{" "}
                          <span className="font-medium">987654321</span>
                        </span>
                        <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                          Text
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Emails</h4>
                      <p className="text-sm text-slate-500 italic">Click edit to add emails.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Addresses</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex">
                          <span className="text-slate-500 w-28">Primary Address</span>
                          <span className="font-medium">1000 NELAVIEW RD CLEVELAND HEIGHTS, OH. 44112<br />CLEVELAND, OH 1000</span>
                        </div>
                        <div className="flex">
                          <span className="text-slate-500 w-28">Primary Tenant</span>
                          <span className="font-medium">No</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tenant Status Section */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                    <CardTitle className="text-base font-semibold text-slate-800">Tenant Status</CardTitle>
                    <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-slate-500 w-36">Type</span>
                        <span className="font-medium text-teal-600">Financially Responsible</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-36">Status</span>
                        <span className="font-medium">Current</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-36">Move In</span>
                        <span className="font-medium text-teal-600">06/18/2024</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-36">Move Out</span>
                        <span className="font-medium">--</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-36">Notice</span>
                        <span className="font-medium">--</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-36">Move Out Reason</span>
                        <span className="font-medium">--</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-36 flex items-center gap-1">
                          Send Rent Reminders <HelpCircle className="h-3 w-3" />
                        </span>
                        <span className="font-medium">No</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Screening Section */}
            <Card>
              <CardHeader 
                className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setScreeningExpanded(!screeningExpanded)}
              >
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <ChevronRight className={`h-4 w-4 transition-transform ${screeningExpanded ? "rotate-90" : ""}`} />
                  Screening
                </CardTitle>
                <Button 
                  variant="link" 
                  className="text-teal-600 h-auto p-0 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Edit
                </Button>
              </CardHeader>
              {screeningExpanded && (
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Date Of Birth</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">SSN</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Drivers License</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">State</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Credit Report Date</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Credit Score</span>
                      <span className="font-medium">--</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Emergency Contact Section */}
            <Card>
              <CardHeader 
                className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setEmergencyContactExpanded(!emergencyContactExpanded)}
              >
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <ChevronRight className={`h-4 w-4 transition-transform ${emergencyContactExpanded ? "rotate-90" : ""}`} />
                  Emergency Contact
                </CardTitle>
                <Button 
                  variant="link" 
                  className="text-teal-600 h-auto p-0 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Edit
                </Button>
              </CardHeader>
              {emergencyContactExpanded && (
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Name</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Address</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Phone Number</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Email Address</span>
                      <span className="font-medium">--</span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 w-36 text-right pr-4">Relationship</span>
                      <span className="font-medium">--</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Upcoming Activities Section */}
            

            {/* Insurance Coverage Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Insurance Coverage</CardTitle>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-teal-600">Insurance Requirement</span>
                  <HelpCircle className="h-3 w-3 text-slate-400" />
                  <span className="font-medium">No</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-sm font-medium">Insurance Policies</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Policy
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500">No policies found.</p>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-1">
                  Notes <HelpCircle className="h-4 w-4 text-slate-400" />
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                    <Download className="h-3 w-3 mr-1" />
                    Download Notes
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Note
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="divide-y">
                  {tenantNotes.map((note) => (
                    <div key={note.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedNote(note)
                              setShowNoteModal(true)
                            }}
                            className="text-sm font-medium text-teal-600 hover:underline text-left"
                          >
                            {note.title}
                          </button>
                          <div className="text-xs text-slate-500 mt-1">
                            Created by {note.createdBy} on {note.createdAt}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-teal-600">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-600">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Letters Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Letters</CardTitle>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="divide-y">
                  {tenantLetters.map((letter) => (
                    <div key={letter.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <span className="text-sm text-teal-600 cursor-pointer hover:underline">
                        {letter.title}
                      </span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500 text-right text-xs">
                          Created on: {letter.createdOn}<br />{letter.createdTime}
                        </span>
                        <span className="text-teal-600 cursor-pointer hover:underline flex items-center gap-1 text-xs">
                          Preview <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Charges Section */}
            <Card>
              <CardHeader className="py-3 px-4 border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Monthly Charges</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Recurring Charges</h4>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                    <Plus className="h-3 w-3 mr-1" />
                    Add New Charge
                  </Button>
                </div>
                <p className="text-center text-sm font-medium">Total Charges For February: $1,100.00</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-semibold text-sm">$500.00</span>
                      <div className="text-sm">
                        <span className="font-medium">4101: Section 8 Income</span><br />
                        <span className="text-slate-500">08/01/2025 to (no end date)</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-slate-500">Next Charge</span><br />
                      <span className="font-medium">$500.00 on 03/01/2026</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-semibold text-sm">$600.00</span>
                      <div className="text-sm">
                        <span className="font-medium">4100: Rent Income</span><br />
                        <span className="text-slate-500">08/01/2025 to (no end date)</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-slate-500">Next Charge</span><br />
                      <span className="font-medium">$600.00 on 03/01/2026</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lease Information Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Lease Information</CardTitle>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex">
                    <span className="text-slate-500 w-36">Lease Signed</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-36">Month To Month</span>
                    <span className="font-medium">No</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-36">Lease From</span>
                    <span className="font-medium">06/18/2024</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-36">Lease To</span>
                    <span className="font-medium">06/17/2025</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-36">Last Lease Renewal</span>
                    <span className="font-medium">08/18/2026</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">Lease Documents</h4>
                  <p className="text-sm text-slate-500 italic text-center py-2">There are no lease documents at this time.</p>
                </div>
              </CardContent>
            </Card>

            {/* Financials Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Financials</CardTitle>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-slate-500 w-48">Deposit Paid</span>
                    <span className="font-medium">0.00</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-48">Utility Billing (RUBS) Enabled</span>
                    <span className="font-medium text-teal-600">No</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-48">NSF Fee</span>
                    <span className="font-medium">30.00</span>
                  </div>
                  <div className="flex">
                    <span className="text-slate-500 w-48">Eligible For Rent Increase On</span>
                    <span className="font-medium">08/01/2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Late Fee Policy Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Late Fee Policy</CardTitle>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
              </CardHeader>
              <CardContent className="p-4">
                <h4 className="font-medium text-sm mb-3">Current Late Fee Policy</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    The late fee policy for this tenant is set by the{" "}
                    <span className="text-teal-600 cursor-pointer hover:underline">property</span>.{" "}
                    <span className="text-teal-600 cursor-pointer hover:underline">Create a policy</span> for this tenant.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Animals Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Animals</CardTitle>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-medium text-slate-600">Name</TableHead>
                      <TableHead className="font-medium text-slate-600">Type / Breed</TableHead>
                      <TableHead className="font-medium text-slate-600">Weight</TableHead>
                      <TableHead className="font-medium text-slate-600">Age</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Xerxes</TableCell>
                      <TableCell>Dog/Labrador Retriever</TableCell>
                      <TableCell>45.0 lbs</TableCell>
                      <TableCell>2 years</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Vehicles Section */}
            <Card>
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
                <CardTitle className="text-base font-semibold text-slate-800">Vehicles</CardTitle>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">Edit</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-medium text-slate-600">Make</TableHead>
                      <TableHead className="font-medium text-slate-600">Model</TableHead>
                      <TableHead className="font-medium text-slate-600">Color</TableHead>
                      <TableHead className="font-medium text-slate-600">License Plate</TableHead>
                      <TableHead className="font-medium text-slate-600">Year</TableHead>
                      <TableHead className="font-medium text-slate-600">Permit Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ford</TableCell>
                      <TableCell>1967</TableCell>
                      <TableCell>Black</TableCell>
                      <TableCell>JKLM2390</TableCell>
                      <TableCell>2022</TableCell>
                      <TableCell>5452407DH</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Communications Tab */}
        {activeTab === "communications" && (
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
                  {communications.some(c => !c.isGroupChat && !c.isRead && c.isIncoming) && (
                    <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                      {communications.filter(c => !c.isGroupChat && !c.isRead && c.isIncoming).length}
                    </span>
                  )}
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
                  {communications.some(c => c.isGroupChat && (c.unreadCount ?? 0) > 0) && (
                    <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                      {communications.filter(c => c.isGroupChat && (c.unreadCount ?? 0) > 0).reduce((sum, c) => sum + (c.unreadCount ?? 0), 0)}
                    </span>
                  )}
                </button>
              </div>

              {/* ======= PRIVATE SUB-TAB ======= */}
              {commSubTab === "private" && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">Private Conversation</h3>
                      <span className="text-xs text-muted-foreground">{commTabPrivateFiltered.length} messages</span>
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
                              onClick={() => setCommTabTypeFilter(t)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                commTabTypeFilter === t
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
                      <Popover open={commTabDatePopoverOpen} onOpenChange={setCommTabDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              commTabDateRange?.from
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {commTabDateRange?.from ? (
                              commTabDateRange.to
                                ? `${format(commTabDateRange.from, "MMM d")} - ${format(commTabDateRange.to, "MMM d, yyyy")}`
                                : format(commTabDateRange.from, "MMM d, yyyy")
                            ) : (
                              "Date"
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarWidget
                            mode="range"
                            selected={commTabDateRange}
                            onSelect={(range) => {
                              setCommTabDateRange(range)
                              if (range?.to) setCommTabDatePopoverOpen(false)
                            }}
                            numberOfMonths={1}
                          />
                          {commTabDateRange?.from && (
                            <div className="border-t p-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => { setCommTabDateRange(undefined); setCommTabDatePopoverOpen(false) }}
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
                          value={commTabSearchQuery}
                          onChange={(e) => setCommTabSearchQuery(e.target.value)}
                          placeholder="Search conversations..."
                          className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                        />
                        {commTabSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setCommTabSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {(commTabTypeFilter !== "all" || commTabDateRange?.from || commTabSearchQuery) && (
                        <button
                          type="button"
                          onClick={() => { setCommTabTypeFilter("all"); setCommTabDateRange(undefined); setCommTabSearchQuery("") }}
                          className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Chat Messages */}
                    <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                      <div className="flex flex-col gap-3">
                        {commTabPrivateFiltered.length > 0 ? (
                          commTabPrivateFiltered.map((item) => {
                            const isOutgoing = !item.isIncoming
                            const contactName = contact.name
                            const staffName = "Richard Surovi"
                            const isEmailExpanded = expandedCommEmails.has(item.id)
                            
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
                                        ? "bg-[#BBDEFB] border border-[#90CAF9]"
                                        : "bg-[#E3F2FD] border border-[#BBDEFB]"
                                      : "bg-[#E0F7F6] border border-[#b8e8e6]"
                                } text-slate-900 p-3 shadow-sm`}>
                                  {/* Sender & Channel Badge */}
                                  <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                    <span className="text-xs font-medium text-slate-500">
                                      {isOutgoing ? staffName : contactName}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                      item.type === "email"
                                        ? "bg-[#c8e6cf] text-green-800"
                                        : item.type === "sms"
                                        ? isOutgoing
                                          ? "bg-[#90CAF9] text-blue-900"
                                          : "bg-[#BBDEFB] text-blue-800"
                                        : "bg-[#b8e8e6] text-teal-800"
                                    }`}>
                                      {item.type === "email" ? "Email" : item.type === "sms" ? "SMS" : "Call"}
                                    </span>
                                  </div>

                                  {/* Email - collapsed by default with subject header */}
                                  {item.type === "email" ? (
                                    <div>
                                      <button
                                        onClick={() => setExpandedCommEmails(prev => {
                                          const next = new Set(prev)
                                          next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                                          return next
                                        })}
                                        className="w-full text-left flex items-center justify-between gap-2 group"
                                      >
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <Mail className="h-3.5 w-3.5 shrink-0 text-green-700" />
                                          <span className="text-sm font-semibold text-slate-800 truncate">
                                            {highlightCommTabText(item.subject || "Email")}
                                          </span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 transition-transform ${isEmailExpanded ? "rotate-180" : "rotate-0"}`} />
                                      </button>

                                      {!isEmailExpanded && (
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                          {highlightCommTabText(item.preview || (item.content ? item.content.slice(0, 80) + "..." : ""))}
                                        </p>
                                      )}
                                      {!isEmailExpanded && !item.isIncoming && item.thread && item.thread[0]?.emailOpens && item.thread[0].emailOpens.length > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] mt-1 text-green-600">
                                          <Eye className="h-3 w-3" />
                                          Opened at {item.thread[0].emailOpens[0].openedAt}
                                        </div>
                                      )}

                                      {/* Expanded: email content + attachments + thread */}
                                      {isEmailExpanded && (
                                        <div className="mt-2">
                                          {/* Main email content */}
                                          <p className="text-sm whitespace-pre-line text-slate-700">
                                            {highlightCommTabText(item.thread ? item.thread[0]?.content : (item.content || item.preview))}
                                          </p>
                                          {item.thread && item.thread[0]?.attachments && item.thread[0].attachments.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                              {item.thread[0].attachments.map((att: { name: string; size: string }, ai: number) => (
                                                <span key={ai} className="inline-flex items-center gap-1 text-xs bg-white/70 border border-[#c8e6cf] rounded px-2 py-1 text-slate-600">
                                                  <Paperclip className="h-3 w-3" />{att.name} ({att.size})
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                          {item.thread && !item.thread[0]?.isIncoming && item.thread[0]?.emailOpens && item.thread[0].emailOpens.length > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] mt-1.5 text-green-600">
                                              <Eye className="h-3 w-3" />
                                              Opened by tenant at {item.thread[0].emailOpens[0].openedAt}
                                            </div>
                                          )}

                                          {/* Email thread at bottom */}
                                          {item.thread && item.thread.length > 1 && (
                                            <div className="mt-3 pt-2 border-t border-[#c8e6cf]">
                                              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Thread ({item.thread.length - 1} earlier)</p>
                                              <div className="space-y-1">
                                                {item.thread.slice(1).map((threadItem) => {
                                                  const isThreadExp = expandedCommEmails.has(`thread-${threadItem.id}`)
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
                                                          <span className="text-xs font-medium text-slate-700">{threadItem.isIncoming ? contactName : staffName}</span>
                                                          <span className="text-[10px] text-slate-400 ml-2">{threadItem.timestamp}</span>
                                                        </div>
                                                        <ChevronDown className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${isThreadExp ? "rotate-180" : "rotate-0"}`} />
                                                      </button>
                                                      {isThreadExp && (
                                                        <div className="px-2.5 pb-2">
                                                          <p className="text-sm whitespace-pre-line text-slate-700">{highlightCommTabText(threadItem.content)}</p>
                                                          {threadItem.attachments && threadItem.attachments.length > 0 && (
                                                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                              {threadItem.attachments.map((att: { name: string; size: string }, ai: number) => (
                                                                <span key={ai} className="inline-flex items-center gap-1 text-xs bg-white/70 border border-[#c8e6cf] rounded px-2 py-1 text-slate-600">
                                                                  <Paperclip className="h-3 w-3" />{att.name} ({att.size})
                                                                </span>
                                                              ))}
                                                            </div>
                                                          )}
                                                          {!threadItem.isIncoming && threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
                                                            <div className="flex items-center gap-1 text-[10px] mt-1 text-green-600">
                                                              <Eye className="h-3 w-3" />
                                                              Opened by tenant at {threadItem.emailOpens[0].openedAt}
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
                                          {item.isIncoming ? "Incoming call" : "Outgoing call"} - {item.duration}
                                        </span>
                                        {item.notes && (
                                          <span className="text-sm text-slate-400 truncate ml-1">
                                            {"- " + (item.notes.length > 40 ? item.notes.slice(0, 40) + "..." : item.notes)}
                                          </span>
                                        )}
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open/call:rotate-180 shrink-0 ml-auto" />
                                      </summary>
                                      <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                                        {item.notes && (
                                          <p className="text-sm text-slate-700">
                                            <span className="font-medium">Notes:</span> {highlightCommTabText(item.notes)}
                                          </p>
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
                                      {highlightCommTabText(item.content || item.preview)}
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
                            {commTabTypeFilter !== "all" || commTabDateRange?.from || commTabSearchQuery
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
                              <Input placeholder="Enter phone number or use contact's number..." defaultValue={contact?.phone || ""} className="text-sm" />
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                              <PhoneCall className="h-4 w-4" /> Start Call
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
              )}

              {/* ======= GROUP SUB-TAB ======= */}
              {commSubTab === "group" && commTabSelectedGroup && (
                  <>
                    {/* Group conversation header */}
                    <div className="flex items-center gap-3 mb-3">
                      <button onClick={() => setSelectedGroupId(null)} className="text-slate-500 hover:text-slate-700">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <div>
                        <h3 className="font-semibold text-slate-800">{commTabSelectedGroup.name}</h3>
                        <p className="text-xs text-slate-500">{commTabSelectedGroup.participants.join(", ")}</p>
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
                              onClick={() => setCommTabTypeFilter(t)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                commTabTypeFilter === t
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
                      <Popover open={commTabDatePopoverOpen} onOpenChange={setCommTabDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              commTabDateRange?.from
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            {commTabDateRange?.from ? (
                              commTabDateRange.to
                                ? `${format(commTabDateRange.from, "MMM d")} - ${format(commTabDateRange.to, "MMM d, yyyy")}`
                                : format(commTabDateRange.from, "MMM d, yyyy")
                            ) : (
                              "Date"
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarWidget
                            mode="range"
                            selected={commTabDateRange}
                            onSelect={(range) => {
                              setCommTabDateRange(range)
                              if (range?.to) setCommTabDatePopoverOpen(false)
                            }}
                            numberOfMonths={1}
                          />
                          {commTabDateRange?.from && (
                            <div className="border-t p-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => { setCommTabDateRange(undefined); setCommTabDatePopoverOpen(false) }}
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
                          value={commTabSearchQuery}
                          onChange={(e) => setCommTabSearchQuery(e.target.value)}
                          placeholder="Search conversations..."
                          className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                        />
                        {commTabSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setCommTabSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {(commTabTypeFilter !== "all" || commTabDateRange?.from || commTabSearchQuery) && (
                        <button
                          type="button"
                          onClick={() => { setCommTabTypeFilter("all"); setCommTabDateRange(undefined); setCommTabSearchQuery("") }}
                          className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Group Chat Messages */}
                    <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                      <div className="flex flex-col gap-3">
                        {commTabGroupFiltered.length > 0 ? commTabGroupFiltered.map((item) => {
                          const isOutgoing = !item.isIncoming
                          const senderName = item.from?.name || "Unknown"
                          const isEmailExpanded2 = expandedCommEmails.has(item.id)

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
                                      ? "bg-[#BBDEFB] border border-[#90CAF9]"
                                      : "bg-[#E3F2FD] border border-[#BBDEFB]"
                                    : "bg-[#E0F7F6] border border-[#b8e8e6]"
                              } text-slate-900 p-3 shadow-sm`}>
                                <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                  <span className="text-xs font-medium text-slate-500">
                                    {senderName}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    item.type === "email"
                                      ? "bg-[#c8e6cf] text-green-800"
                                      : item.type === "sms"
                                      ? isOutgoing
                                        ? "bg-[#90CAF9] text-blue-900"
                                        : "bg-[#BBDEFB] text-blue-800"
                                      : "bg-[#b8e8e6] text-teal-800"
                                  }`}>
                                    {item.type === "email" ? "Email" : item.type === "sms" ? "SMS" : "Call"}
                                  </span>
                                </div>

                                {item.type === "email" ? (
                                  <div>
                                    <button
                                      onClick={() => setExpandedCommEmails(prev => {
                                        const next = new Set(prev)
                                        next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                                        return next
                                      })}
                                      className="w-full text-left flex items-center justify-between gap-2 group"
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <Mail className="h-3.5 w-3.5 shrink-0 text-green-700" />
                                        <span className="text-sm font-semibold text-slate-800 truncate">
                                          {highlightCommTabText(item.subject || "Email")}
                                        </span>
                                      </div>
                                      <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 transition-transform ${isEmailExpanded2 ? "rotate-180" : "rotate-0"}`} />
                                    </button>

                                    {!isEmailExpanded2 && (
                                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                        {highlightCommTabText(item.preview || (item.content ? item.content.slice(0, 80) + "..." : ""))}
                                      </p>
                                    )}

                                    {isEmailExpanded2 && (
                                      <div className="mt-2">
                                        <p className="text-sm whitespace-pre-line text-slate-700">
                                          {highlightCommTabText(item.thread ? item.thread[0]?.content : (item.content || item.preview))}
                                        </p>
                                        {item.thread && !item.thread[0]?.isIncoming && item.thread[0]?.emailOpens && item.thread[0].emailOpens.length > 0 && (
                                          <div className="flex items-center gap-1 text-[10px] mt-1.5 text-green-600">
                                            <Eye className="h-3 w-3" />
                                            Opened at {item.thread[0].emailOpens[0].openedAt}
                                          </div>
                                        )}

                                        {item.thread && item.thread.length > 1 && (
                                          <div className="mt-3 pt-2 border-t border-[#c8e6cf]">
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Thread ({item.thread.length - 1} earlier)</p>
                                            <div className="space-y-1">
                                              {item.thread.slice(1).map((threadItem) => {
                                                const isThreadExp = expandedCommEmails.has(`thread-${threadItem.id}`)
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
                                                        <span className="text-xs font-medium text-slate-700">{threadItem.isIncoming ? senderName : "You"}</span>
                                                        <span className="text-[10px] text-slate-400 ml-2">{threadItem.timestamp}</span>
                                                      </div>
                                                      <ChevronDown className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${isThreadExp ? "rotate-180" : "rotate-0"}`} />
                                                    </button>
                                                    {isThreadExp && (
                                                      <div className="px-2.5 pb-2">
                                                        <p className="text-sm whitespace-pre-line text-slate-700">{highlightCommTabText(threadItem.content)}</p>
                                                        {!threadItem.isIncoming && threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
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
                                        {item.isIncoming ? "Incoming call" : "Outgoing call"} - {item.duration}
                                      </span>
                                      {item.notes && (
                                        <span className="text-sm text-slate-400 truncate ml-1">
                                          {"- " + (item.notes.length > 40 ? item.notes.slice(0, 40) + "..." : item.notes)}
                                        </span>
                                      )}
                                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open/call:rotate-180 shrink-0 ml-auto" />
                                    </summary>
                                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                                      {item.notes && (
                                        <p className="text-sm text-slate-700">
                                          <span className="font-medium">Notes:</span> {highlightCommTabText(item.notes)}
                                        </p>
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
                                    {highlightCommTabText(item.content || item.preview)}
                                  </p>
                                )}

                                <div className={`text-[10px] mt-2 text-slate-400 ${isOutgoing ? "text-right" : ""}`}>
                                  {item.timestamp}
                                </div>
                              </div>
                            </div>
                          )
                        }) : (
                          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                            {commTabTypeFilter !== "all" || commTabDateRange?.from || commTabSearchQuery
                              ? "No messages match the selected filters."
                              : "No group messages yet."}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Group Reply Composer */}
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

                      {commChannel === "call" && (
                        <div className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Input placeholder="Enter phone number..." className="text-sm" />
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                              <PhoneCall className="h-4 w-4" /> Start Call
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
              )}

              {commSubTab === "group" && !commTabSelectedGroup && (
                  <>
                    <h3 className="font-semibold text-slate-800 mb-3">Communication Groups</h3>
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {commTabGroups.length > 0 ? commTabGroups.map((group) => (
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
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "property" && (
          <div className="space-y-6">
            {/* Property Details Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5 text-teal-600" />
                  <h3 className="font-semibold text-slate-800">Property Details</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-muted-foreground text-xs">Property Name</Label>
                    <p className="font-medium">{propertyInfo.name}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">Address</Label>
                    <p className="font-medium">{propertyInfo.address}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Type</Label>
                    <p className="font-medium">{propertyInfo.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Bedrooms</Label>
                    <p className="font-medium">{propertyInfo.bedrooms}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Bathrooms</Label>
                    <p className="font-medium">{propertyInfo.bathrooms}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Square Feet</Label>
                    <p className="font-medium">{propertyInfo.sqft} sq ft</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Year Built</Label>
                    <p className="font-medium">{propertyInfo.yearBuilt}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    className="text-teal-600 border-teal-200 hover:bg-teal-50 bg-transparent"
                    onClick={() => onNavigateToUnitDetail?.("unit-204", "prop-1")}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "processes" && (
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
                In Progress ({tenantProcesses.inProgress.length + newlyStartedProcesses.length})
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
                Completed ({tenantProcesses.completed.length})
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
                Upcoming ({tenantProcesses.upcoming.length})
              </button>
            </div>

            <div className="space-y-6">
              {/* In Progress Processes */}
              {processStatusFilter === "in-progress" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PlayCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="font-semibold text-foreground">In Progress ({tenantProcesses.inProgress.length + newlyStartedProcesses.length})</h4>
                </div>
                <div className="space-y-2">
                  {newlyStartedProcesses.map((process) => {
                    const isExpanded = expandedProcesses.includes(process.id)
                    return (
                    <div key={process.id} className="border rounded-lg overflow-hidden border-teal-200 bg-teal-50/30">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => setExpandedProcesses(prev => prev.includes(process.id) ? prev.filter(id => id !== process.id) : [...prev, process.id])}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}
                                className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                              >
                                {process.name}
                              </button>
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
                      {/* Tasks Table */}
                      {isExpanded && process.tasks && (
                        <div className="border-t bg-muted/20 px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/40">
                                <TableHead className="font-medium text-xs pl-12">Task Name</TableHead>
                                <TableHead className="font-medium text-xs">Start Date</TableHead>
                                <TableHead className="font-medium text-xs">Completed On</TableHead>
                                <TableHead className="font-medium text-xs">Staff Member</TableHead>
                                <TableHead className="font-medium text-xs w-[180px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task: { id: string; name: string; startDate: string | null; completedDate: string | null; staffName: string; staffEmail: string }) => (
                                <TableRow key={task.id} className="hover:bg-muted/20">
                                  <TableCell className="text-sm pl-12">{task.name}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{task.startDate || "\u2014"}</TableCell>
                                  <TableCell className={`text-sm ${task.completedDate ? "text-teal-600 font-medium" : "text-muted-foreground"}`}>
                                    {task.completedDate || "\u2014"}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{task.staffName}</p>
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
                  })}
                  {tenantProcesses.inProgress.map((process) => {
                    const isExpanded = expandedProcesses.includes(process.id)
                    return (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => setExpandedProcesses(prev => prev.includes(process.id) ? prev.filter(id => id !== process.id) : [...prev, process.id])}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}
                              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                            >
                              {process.name}
                            </button>
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
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
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
                      {/* Tasks Table */}
                      {isExpanded && process.tasks && (
                        <div className="border-t bg-muted/20 px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/40">
                                <TableHead className="font-medium text-xs pl-12">Task Name</TableHead>
                                <TableHead className="font-medium text-xs">Start Date</TableHead>
                                <TableHead className="font-medium text-xs">Completed On</TableHead>
                                <TableHead className="font-medium text-xs">Staff Member</TableHead>
                                <TableHead className="font-medium text-xs w-[180px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-muted/20">
                                  <TableCell className="text-sm pl-12">{task.name}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{task.startDate || "\u2014"}</TableCell>
                                  <TableCell className={`text-sm ${task.completedDate ? "text-teal-600 font-medium" : "text-muted-foreground"}`}>
                                    {task.completedDate || "\u2014"}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{task.staffName}</p>
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
                  })}
                </div>
              </div>
              )}

              {/* Upcoming Processes */}
              {processStatusFilter === "upcoming" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold text-foreground">Upcoming ({tenantProcesses.upcoming.length})</h4>
                </div>
                <div className="space-y-2">
                  {tenantProcesses.upcoming.map((process) => {
                    const isExpanded = expandedProcesses.includes(process.id)
                    return (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => setExpandedProcesses(prev => prev.includes(process.id) ? prev.filter(id => id !== process.id) : [...prev, process.id])}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}
                              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                            >
                              {process.name}
                            </button>
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
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
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
                      {/* Tasks Table */}
                      {isExpanded && process.tasks && (
                        <div className="border-t bg-muted/20 px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/40">
                                <TableHead className="font-medium text-xs pl-12">Task Name</TableHead>
                                <TableHead className="font-medium text-xs">Start Date</TableHead>
                                <TableHead className="font-medium text-xs">Completed On</TableHead>
                                <TableHead className="font-medium text-xs">Staff Member</TableHead>
                                <TableHead className="font-medium text-xs w-[180px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-muted/20">
                                  <TableCell className="text-sm pl-12">{task.name}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{task.startDate || "\u2014"}</TableCell>
                                  <TableCell className={`text-sm ${task.completedDate ? "text-teal-600 font-medium" : "text-muted-foreground"}`}>
                                    {task.completedDate || "\u2014"}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{task.staffName}</p>
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
                  })}
                </div>
              </div>
              )}

              {/* Completed Processes */}
              {processStatusFilter === "completed" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <h4 className="font-semibold text-foreground">Completed ({tenantProcesses.completed.length})</h4>
                </div>
                <div className="space-y-2">
                  {tenantProcesses.completed.map((process) => {
                    const isExpanded = expandedProcesses.includes(process.id)
                    return (
                    <div key={process.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <button
                            type="button"
                            onClick={() => setExpandedProcesses(prev => prev.includes(process.id) ? prev.filter(id => id !== process.id) : [...prev, process.id])}
                            className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: contact.name })}
                              className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer text-left"
                            >
                              {process.name}
                            </button>
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
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
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
                      {/* Tasks Table */}
                      {isExpanded && process.tasks && (
                        <div className="border-t bg-muted/20 px-4 py-3">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/40">
                                <TableHead className="font-medium text-xs pl-12">Task Name</TableHead>
                                <TableHead className="font-medium text-xs">Start Date</TableHead>
                                <TableHead className="font-medium text-xs">Completed On</TableHead>
                                <TableHead className="font-medium text-xs">Staff Member</TableHead>
                                <TableHead className="font-medium text-xs w-[180px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {process.tasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-muted/20">
                                  <TableCell className="text-sm pl-12">{task.name}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{task.startDate || "\u2014"}</TableCell>
                                  <TableCell className={`text-sm ${task.completedDate ? "text-teal-600 font-medium" : "text-muted-foreground"}`}>
                                    {task.completedDate || "\u2014"}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{task.staffName}</p>
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
                  })}
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  Documents ({documents.length})
                </h3>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => setShowUploadDocModal(true)}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Document
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-medium">Document Name</TableHead>
                      <TableHead className="text-xs font-medium">Property</TableHead>
                      <TableHead className="text-xs font-medium">Received Date</TableHead>
                      <TableHead className="text-xs font-medium">Received Time</TableHead>
                      <TableHead className="text-xs font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{doc.propertyName}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{doc.propertyAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.receivedDate}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.receivedTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View">
                              <Eye className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                              <Download className="h-4 w-4 text-slate-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audit Log Tab */}
        {activeTab === "audit-log" && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold">Audit Log</h3>
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
                    {tenantAuditLogs.length > 0 ? (
                      tenantAuditLogs.map((log) => {
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
        )}
      </div>

      {/* Quick Actions Sidebar */}
      <div className="w-full lg:w-56 shrink-0 sticky top-0 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-base font-semibold text-foreground mb-5">Quick Actions</h3>

            {/* Tasks subsection */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-semibold text-foreground">Tasks</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: ArrowLeftRight, label: "Transfer Tenant", disabled: false },
                  { icon: FileText, label: "Send Lease or Addendum", disabled: false },
                  { icon: FileText, label: "NYC Lease Renewal", disabled: true },
                  { icon: TrendingUp, label: "Increase Rent", disabled: false },
                  { icon: Wrench, label: "New Service Request", disabled: false },
                  { icon: Wrench, label: "Work Orders", disabled: false },
                  { icon: Receipt, label: "Tenant Payable", disabled: false },
                  { icon: UserPlus, label: "Add Additional Tenant", disabled: false },
                  { icon: EyeOff, label: "Hide Tenant", disabled: false },
                  { icon: SearchCheck, label: "New Inspection", disabled: false },
                  { icon: SearchCheck, label: "View Inspections", disabled: false },
                  { icon: Layers, label: "View Unit Turn Board", disabled: false },
                  { icon: Building, label: "Manage Subsidy Programs", disabled: false, isNew: true },
                  { icon: Mail, label: "Send Email", disabled: false },
                  { icon: MessageSquare, label: "Send SMS", disabled: false },
                  { icon: Phone, label: "Make Call", disabled: false },
                  { icon: Globe, label: "View Online Portal", disabled: false },
                  { icon: Download, label: "Download Text History", disabled: false },
                  { icon: Send, label: "Send Resident Form to Unit", disabled: false },
                ].map(({ icon: Icon, label, disabled, isNew }) => (
                  <button
                    key={label}
                    disabled={disabled}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                      disabled
                        ? "border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                        : "border-border bg-background font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 cursor-pointer"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${disabled ? "text-muted-foreground/40" : "text-muted-foreground"}`} />
                    <span className="flex items-center gap-1.5">
                      {label}
                      {isNew && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700">
                          NEW
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reports subsection */}
            <div className="pt-4 border-t border-border mb-5">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Reports</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: FileText, label: "Tenant Ledger" },
                  { icon: DollarSign, label: "Tenant Unpaid Charges" },
                  { icon: Wrench, label: "Work Order" },
                  { icon: BarChart3, label: "Activities Summary" },
                  { icon: AlertTriangle, label: "Debt Collections Status" },
                  { icon: Shield, label: "Tenant Insurance Coverage" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors text-left cursor-pointer"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Letters subsection */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Letters</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: FileText, label: "3-Day Notice" },
                  { icon: Printer, label: "Print Envelope" },
                  { icon: Send, label: "Send Statement" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors text-left cursor-pointer"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
                    tenantProcesses.inProgress.some(p => p.name === processType.name) ||
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
                    onValueChange={(value: Task["status"]) => setSelectedTask({ ...selectedTask, status: value })}
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
                  onValueChange={(value: Task["priority"]) => setSelectedTask({ ...selectedTask, priority: value })}
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
                  onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
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
        contactName={selectedSMSItem?.from || contact.name}
        contactPhone={selectedSMSItem?.phone || contact.phone || ""}
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
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                missingInfoTab === "fields"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Missing Fields ({tenantMissingFields.length})
            </button>
            <button
              type="button"
              onClick={() => setMissingInfoTab("documents")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                missingInfoTab === "documents"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Missing Documents ({tenantMissingDocuments.length})
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
                {tenantMissingDocuments.map((doc) => (
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
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isFromTenant
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
                        className={`max-w-[90%] rounded-lg border ${
                          isFromTenant
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
    </div>
  )
}
