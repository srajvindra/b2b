"use client"

import { DialogDescription } from "@/components/ui/dialog"

import { Checkbox } from "@/components/ui/checkbox"

import { useState, type ReactNode } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Check,
  Pin,
  Printer,
  Send,
  ExternalLink,
  ChevronUp,
  User,
  PhoneCall,
  StickyNote,
  Building2,
  Landmark,
  Handshake,
  Home,
  FileText,
  ListTodo,
  AlertTriangle,
  RotateCcw,
  Plus,
  Download,
  Eye,
  Edit,
  Globe,
  History,
  Search,
  Calendar,
  Upload,
  Link2,
  HelpCircle,
  X,
  Users,
  Workflow,
  CheckCircle2,
  Clock,
  PlayCircle,
  MoreHorizontal,
  Trash2,
  FolderOpen,
  ArrowRight,
  Paperclip,
  Bell,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Smile,
  Type,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { OwnerDetailQuickActions } from "./owner-detail-quick-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Lead } from "@/components/leads-page/leads-data"
import { SMSPopupModal } from "./sms-popup-modal"
import { EmailPopupModal } from "./email-popup-modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarWidget } from "@/components/ui/calendar"
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useNav } from "./dashboard-app"

// Pipeline stages with colors
const STAGES = ["New Lead", "Attempting to Contact", "Schedule Intro Call", "Working", "Under Review", "New Client", "Lost", "Terminated", "Disqualified"]

// Stage progress bar colors
const STAGE_PROGRESS_COLORS = [
  "#E8A830", // Block 1 - Mustard Gold (New Lead)
  "#A8E6CF", // Block 2 - Soft Mint (Attempting to Contact)
  "#6FCF97", // Block 3 - Fresh Green (Schedule Intro Call)
  "#3BB273", // Block 4 - Emerald Green (Working)
  "#27AE60", // Block 5 - Primary Green (Under Review)
  "#1E8449", // Block 6 - Deep Forest Green (New Client)
  "#E74C3C", // Block 7 - Strong Red (Lost)
  "#EE6A5C", // Block 8 - Lighter Strong Red (Terminated)
  "#F5918A", // Block 9 - Soft Coral (Disqualified)
]

// Tasks associated with each stage
const STAGE_TASKS: Record<string, { icon: string; label: string }[]> = {
  "New Lead": [
    { icon: "call", label: "Make introductory call" },
    { icon: "email", label: "Send welcome email" },
  ],
  "Attempting to Contact": [
    { icon: "call", label: "Follow-up call" },
    { icon: "sms", label: "Send follow-up SMS" },
    { icon: "email", label: "Send introduction email" },
  ],
  "Schedule Intro Call": [
    { icon: "call", label: "Schedule discovery call" },
    { icon: "email", label: "Send meeting invite" },
    { icon: "video", label: "Set up video meeting" },
  ],
  "Working": [
    { icon: "todo", label: "Prepare property proposal" },
    { icon: "email", label: "Send proposal document" },
    { icon: "call", label: "Review call with owner" },
  ],
  "Under Review": [
    { icon: "todo", label: "Review submitted documents" },
    { icon: "email", label: "Request additional info" },
    { icon: "video", label: "Schedule review meeting" },
  ],
  "New Client": [
    { icon: "email", label: "Send onboarding package" },
    { icon: "call", label: "Welcome call" },
    { icon: "todo", label: "Complete onboarding checklist" },
  ],
}

const STAGE_REASONS: Record<string, string> = {
  "Lost": "Owner chose another provider",
  "Terminated": "Contract terminated by mutual agreement",
  "Disqualified": "Did not meet qualification criteria",
}

const STAFF_MEMBERS = [
  { id: "1", name: "Richard Surovi", initials: "RS", color: "bg-primary/10 text-primary", department: "Sales" },
  { id: "2", name: "Sarah Johnson", initials: "SJ", color: "bg-success/10 text-success", department: "Accounting" },
  { id: "3", name: "Michael Chen", initials: "MC", color: "bg-chart-4/10 text-chart-4", department: "Property Management" },
  { id: "4", name: "Emily Davis", initials: "ED", color: "bg-warning/10 text-warning", department: "Leasing" },
  { id: "5", name: "James Wilson", initials: "JW", color: "bg-info/10 text-info", department: "Maintenance" },
  { id: "6", name: "Nina Patel", initials: "NP", color: "bg-destructive/10 text-destructive", department: "Sales" },
  { id: "7", name: "Laura Taylor", initials: "LT", color: "bg-success/10 text-success", department: "Accounting" },
  { id: "8", name: "David Brown", initials: "DB", color: "bg-chart-4/10 text-chart-4", department: "Property Management" },
]

const DEPARTMENTS = ["Sales", "Accounting", "Property Management", "Leasing", "Maintenance"]

const ownerProperties = [
  {
    id: "1",
    name: "Sunset Villa",
    address: "123 Sunset Blvd, San Francisco, CA 94102",
    type: "Single Family",
    units: 1,
    monthlyRent: 4500,
    status: "Active",
    llcId: "llc-1",
  },
  {
    id: "2",
    name: "Harbor View Apartments",
    address: "456 Harbor Way, San Francisco, CA 94103",
    type: "Multi Family",
    units: 8,
    monthlyRent: 24000,
    status: "Active",
    llcId: "llc-1",
  },
  {
    id: "3",
    name: "Downtown Loft",
    address: "789 Market St, San Francisco, CA 94104",
    type: "Condo",
    units: 1,
    monthlyRent: 3200,
    status: "Vacant",
    llcId: "llc-3",
  },
  {
    id: "4",
    name: "Beach Condo",
    address: "101 Ocean Ave, San Francisco, CA 94112",
    type: "Condo",
    units: 1,
    monthlyRent: 3800,
    status: "Active",
    llcId: "",
  },
  {
    id: "5",
    name: "Marina District Townhouse",
    address: "2250 Chestnut St, San Francisco, CA 94123",
    type: "Single Family",
    units: 1,
    monthlyRent: 5200,
    status: "Active",
    llcId: "llc-1",
  },
  {
    id: "6",
    name: "Nob Hill Flats",
    address: "950 California St, San Francisco, CA 94108",
    type: "Multi Family",
    units: 4,
    monthlyRent: 14000,
    status: "Under Maintenance",
    llcId: "llc-3",
  },
]

const initialLLCs: { id: string; name: string; ownershipType: "LLC" | "Partnership" }[] = [
  { id: "llc-1", name: "Davis Property Holdings LLC", ownershipType: "LLC" },
  { id: "llc-2", name: "Bay Area Investments LLC", ownershipType: "LLC" },
  { id: "llc-3", name: "Anderson & Burke Partners", ownershipType: "Partnership" },
]

// Units per property for task creation
const propertyUnits: Record<string, string[]> = {
  "Sunset Villa": [],
  "Harbor View Apartments": ["Unit 101", "Unit 102", "Unit 201", "Unit 202", "Unit 301", "Unit 302", "Unit 401", "Unit 402"],
  "Downtown Loft": [],
  "Beach Condo": [],
  "Marina District Townhouse": [],
  "Nob Hill Flats": ["Unit 1A", "Unit 1B", "Unit 2A", "Unit 2B"],
}

// Staff members for task assignment
const taskStaffMembers = [
  { id: "1", name: "Nina Patel", role: "Leasing Agent" },
  { id: "2", name: "John Smith", role: "CSR" },
  { id: "3", name: "Sarah Johnson", role: "Property Manager" },
  { id: "4", name: "Michael Chen", role: "Maintenance Coordinator" },
  { id: "5", name: "Emily Davis", role: "CSR" },
  { id: "6", name: "Richard Surovi", role: "Leasing Agent" },
]

const ownerTasks = [
  // Process tasks - only from the single in-progress process "Initial Outreach & Qualification"
  {
    id: "1",
    title: "Complete needs assessment",
    source: "process" as const,
    processName: "Initial Outreach & Qualification",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Nina Patel",
    createdBy: "",
    dueDate: "2026-01-15",
    priority: "High" as const,
    status: "In Progress" as const,
    isOverdue: false,
  },
  {
    id: "2",
    title: "Verify property ownership",
    source: "process" as const,
    processName: "Initial Outreach & Qualification",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Richard Surovi",
    createdBy: "",
    dueDate: "2026-01-18",
    priority: "High" as const,
    status: "Pending" as const,
    isOverdue: false,
  },
  // Communication tasks - auto-created from unread/unresponded communications
  {
    id: "3",
    title: "Respond to unread email from James Wilson",
    source: "communication" as const,
    processName: "",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Sarah Johnson",
    createdBy: "",
    dueDate: "2026-01-12",
    priority: "High" as const,
    status: "Pending" as const,
    isOverdue: true,
  },
  {
    id: "4",
    title: "Return missed call from James Wilson",
    source: "communication" as const,
    processName: "",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Nina Patel",
    createdBy: "",
    dueDate: "2026-01-13",
    priority: "Medium" as const,
    status: "Pending" as const,
    isOverdue: true,
  },
  {
    id: "5",
    title: "Follow up on unresponded SMS",
    source: "communication" as const,
    processName: "",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Sarah Johnson",
    createdBy: "",
    dueDate: "2026-01-14",
    priority: "Medium" as const,
    status: "Pending" as const,
    isOverdue: false,
  },
  // General tasks - created by one staff member for another
  {
    id: "6",
    title: "Review management agreement draft",
    source: "general" as const,
    processName: "",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Mike Johnson",
    createdBy: "Sarah Johnson",
    dueDate: "2026-01-20",
    priority: "Medium" as const,
    status: "Pending" as const,
    isOverdue: false,
  },
  {
    id: "7",
    title: "Prepare comparable market analysis",
    source: "general" as const,
    processName: "",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Nina Patel",
    createdBy: "Richard Surovi",
    dueDate: "2026-01-22",
    priority: "Low" as const,
    status: "Pending" as const,
    isOverdue: false,
  },
  {
    id: "8",
    title: "Update insurance documents",
    source: "general" as const,
    processName: "",
    relatedEntityType: "Owner Prospect" as const,
    relatedEntityName: "James Wilson",
    assignee: "Richard Surovi",
    createdBy: "Nina Patel",
    dueDate: "2026-01-25",
    priority: "Low" as const,
    status: "Skipped" as const,
    isOverdue: false,
  },
]

// Owner Prospect Processes Data
const prospectProcesses = {
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
      name: "Marketing Material Preparation",
      prospectingStage: "Proposal Sent",
      status: "Upcoming",
      tasks: [
        { id: "t34", name: "Gather property photos", startDate: null, completedDate: null, staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        { id: "t35", name: "Create property listings", startDate: null, completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
      ],
    },
    {
      id: "proc-13",
      name: "Tenant Communication Setup",
      prospectingStage: "Contract Signed",
      status: "Upcoming",
      tasks: [
        { id: "t36", name: "Draft tenant notification letter", startDate: null, completedDate: null, staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        { id: "t37", name: "Set up communication templates", startDate: null, completedDate: null, staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
      ],
    },
    {
      id: "proc-14",
      name: "Property Inspection Schedule",
      prospectingStage: "Contract Signed",
      status: "Upcoming",
      tasks: [
        { id: "t38", name: "Schedule initial property inspection", startDate: null, completedDate: null, staffName: "James Wilson", staffEmail: "james.wilson@heropm.com" },
        { id: "t39", name: "Create inspection checklist", startDate: null, completedDate: null, staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
      ],
    },
    {
      id: "proc-15",
      name: "Rent Analysis Review",
      prospectingStage: "Proposal Sent",
      status: "Upcoming",
      tasks: [
        { id: "t40", name: "Run comparable market analysis", startDate: null, completedDate: null, staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        { id: "t41", name: "Recommend rental pricing", startDate: null, completedDate: null, staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
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
      name: "Background Research",
      prospectingStage: "New Lead",
      startedOn: "12/28/2025",
      completedOn: "12/30/2025",
      status: "Completed",
      tasks: [
        { id: "t42", name: "Research property portfolio", startDate: "12/28/2025", completedDate: "12/28/2025", staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
        { id: "t43", name: "Analyze market positioning", startDate: "12/29/2025", completedDate: "12/30/2025", staffName: "Nina Patel", staffEmail: "nina.patel@heropm.com" },
      ],
    },
    {
      id: "proc-17",
      name: "CRM Data Entry",
      prospectingStage: "New Lead",
      startedOn: "12/26/2025",
      completedOn: "12/27/2025",
      status: "Completed",
      tasks: [
        { id: "t44", name: "Enter prospect details in CRM", startDate: "12/26/2025", completedDate: "12/26/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
        { id: "t45", name: "Tag and categorize lead", startDate: "12/27/2025", completedDate: "12/27/2025", staffName: "Emily Davis", staffEmail: "emily.davis@heropm.com" },
      ],
    },
    {
      id: "proc-18",
      name: "Referral Follow-Up",
      prospectingStage: "New Lead",
      startedOn: "12/22/2025",
      completedOn: "12/24/2025",
      status: "Completed",
      tasks: [
        { id: "t46", name: "Thank referral source", startDate: "12/22/2025", completedDate: "12/22/2025", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
        { id: "t47", name: "Send referral acknowledgment", startDate: "12/23/2025", completedDate: "12/24/2025", staffName: "Sarah Johnson", staffEmail: "sarah.johnson@heropm.com" },
      ],
    },
    {
      id: "proc-19",
      name: "Initial Property Assessment",
      prospectingStage: "New Lead",
      startedOn: "12/20/2025",
      completedOn: "12/22/2025",
      status: "Completed",
      tasks: [
        { id: "t48", name: "Review public property records", startDate: "12/20/2025", completedDate: "12/20/2025", staffName: "Mike Davis", staffEmail: "mike.davis@heropm.com" },
        { id: "t49", name: "Estimate property value", startDate: "12/21/2025", completedDate: "12/22/2025", staffName: "Richard Surovi", staffEmail: "richard.surovi@heropm.com" },
      ],
    },
  ],
}

// Available process types to start (from Operations > Processes)
const AVAILABLE_PROCESS_TYPES = [
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

const ownerAuditLogs = [
  {
    id: "1",
    dateTime: "Jan 18, 2026 – 10:42 AM",
    user: "Sarah M",
    userRole: "CSR",
    actionType: "Updated",
    entity: "Owner Profile",
    description: "Updated primary phone number from (555) 111-2222 to (555) 123-4567",
    source: "Web App",
  },
  {
    id: "2",
    dateTime: "Jan 17, 2026 – 3:15 PM",
    user: "System",
    userRole: "Automation",
    actionType: "Status Changed",
    entity: "Owner Profile",
    description: "Owner converted from Lead to Active Owner",
    source: "System Automation",
  },
  {
    id: "3",
    dateTime: "Jan 16, 2026 – 11:30 AM",
    user: "Mike D",
    userRole: "Property Manager",
    actionType: "Created",
    entity: "Attachments",
    description: "Uploaded W-9 form document",
    source: "Web App",
  },
  {
    id: "4",
    dateTime: "Jan 15, 2026 – 2:45 PM",
    user: "Nina P",
    userRole: "Admin",
    actionType: "Updated",
    entity: "Banking Info",
    description: "Added new bank account ending in ****4521 for direct deposits",
    source: "Web App",
  },
  {
    id: "5",
    dateTime: "Jan 14, 2026 – 9:20 AM",
    user: "Richard S",
    userRole: "Leasing Agent",
    actionType: "Assignment Changed",
    entity: "Tasks",
    description: "Reassigned task 'Schedule property inspection' to Sarah M",
    source: "Mobile App",
  },
  {
    id: "6",
    dateTime: "Jan 12, 2026 – 4:30 PM",
    user: "Sarah M",
    userRole: "CSR",
    actionType: "Created",
    entity: "Properties",
    description: "Linked property 'Sunset Villa' to this owner",
    source: "Web App",
  },
  {
    id: "7",
    dateTime: "Jan 10, 2026 – 10:15 AM",
    user: "Mike D",
    userRole: "Property Manager",
    actionType: "Updated",
    entity: "Notes",
    description: "Edited note regarding maintenance preferences",
    source: "Web App",
  },
  {
    id: "8",
    dateTime: "Jan 8, 2026 – 1:00 PM",
    user: "Nina P",
    userRole: "Admin",
    actionType: "Deleted",
    entity: "Attachments",
    description: "Removed outdated insurance certificate (expired 2024)",
    source: "Web App",
  },
  {
    id: "9",
    dateTime: "Jan 5, 2026 – 11:45 AM",
    user: "System",
    userRole: "Automation",
    actionType: "Viewed",
    entity: "Owner Profile",
    description: "Owner profile accessed via owner portal login",
    source: "System Automation",
  },
  {
    id: "10",
    dateTime: "Jan 3, 2026 – 9:00 AM",
    user: "Richard S",
    userRole: "Leasing Agent",
    actionType: "Created",
    entity: "Owner Profile",
    description: "Owner record created from lead conversion",
    source: "Web App",
  },
]

const ownerDocuments = [
  {
    id: "1",
    name: "Property Management Agreement",
    type: "Management Agreement",
    uploadedDate: "11/01/2025",
    uploadedBy: "Sarah Johnson",
    assignedStaff: "Richard Surovi",
  },
  {
    id: "2",
    name: "W-9 Form 2025",
    type: "W-9",
    uploadedDate: "10/28/2025",
    uploadedBy: "Mike Davis",
    assignedStaff: null,
  },
  {
    id: "3",
    name: "Insurance Certificate - Harbor View",
    type: "Insurance",
    uploadedDate: "09/20/2025",
    uploadedBy: "Sarah Johnson",
    assignedStaff: "Nina Patel",
  },
  {
    id: "4",
    name: "Owner ID Verification",
    type: "ID Verification",
    uploadedDate: "09/15/2025",
    uploadedBy: "Richard Surovi",
    assignedStaff: null,
  },
  {
    id: "5",
    name: "Financial Statement Q3 2025",
    type: "Financial Document",
    uploadedDate: "10/05/2025",
    uploadedBy: "Nina Patel",
    assignedStaff: "Sarah Johnson",
  },
]

// Document types with field-linked indicators
const DOCUMENT_TYPES = [
  { value: "w9", label: "W-9", linkedField: true },
  { value: "insurance", label: "Insurance", linkedField: true },
  { value: "management-agreement", label: "Management Agreement", linkedField: false },
  { value: "id-verification", label: "ID Verification", linkedField: true },
  { value: "financial-document", label: "Financial Document", linkedField: false },
  { value: "other", label: "Other", linkedField: false },
]

const getActivitiesData = (ownerName: string, ownerPhone: string, ownerEmail: string) => [
  {
    id: 1,
    type: "sms",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "texted",
    target: ownerName,
    targetPhone: ownerPhone,
    message: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out of future messages.",
    fullMessage: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out of future messages.",
    timestamp: "12/4/2025, 12:24 PM",
    isNote: false,
    isRead: true,
  },
  {
    id: 2,
    type: "sms",
    user: ownerName,
    userInitials: ownerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    phone: ownerPhone,
    action: "texted",
    target: "Richard Surovi",
    targetPhone: "(216) 810-2564",
    message: "Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon.",
    fullMessage: `Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon. I appreciate your patience and will reach out once I've made a decision. Best regards, ${ownerName.split(" ")[0]}`,
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
    target: ownerName,
    targetPhone: ownerPhone,
    message: "Left voicemail about property management services. Call lasted 2 minutes.",
    callNotes: `Called to follow up on property management proposal. Owner was not available, left voicemail explaining our services and competitive rates. Mentioned we specialize in multi-family properties. ${ownerName} has properties in the portfolio. Call duration: 2 minutes 34 seconds.`,
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
    target: ownerName,
    targetPhone: ownerPhone,
    message: `Hi ${ownerName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday, indicating that if you w...`,
    fullMessage: `Hi ${ownerName.split(" ")[0]}. Richard Surovi here from B2B Property Management. Just want to make sure you received my voicemail yesterday, indicating that if you would like to discuss our property management services, I'm available anytime. We offer competitive rates and have extensive experience with properties like yours. Please let me know if you'd like to schedule a call.`,
    timestamp: "11/29/2025, 9:50 PM",
    isNote: false,
    isSystem: true,
    isRead: true,
  },
  {
    id: 6,
    type: "email",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "",
    action: "emailed",
    target: ownerName,
    targetPhone: ownerEmail,
    message: "Sent follow-up email regarding property management proposal and pricing details.",
    timestamp: "11/28/2025, 3:15 PM",
    isNote: false,
    isRead: true,
    emailThread: [
      {
        id: "e1",
        from: "Richard Surovi",
        fromEmail: "richard@b2bpm.com",
        to: ownerName,
        toEmail: ownerEmail,
        subject: "Property Management Proposal - B2B Property Management",
        content: `Hi ${ownerName.split(" ")[0]},\n\nThank you for taking the time to speak with me yesterday about your property management needs.\n\nAs discussed, I'm attaching our proposal which includes:\n- Monthly management fee: 8% of collected rent\n- Tenant placement fee: One month's rent\n- 24/7 maintenance coordination\n- Monthly financial reporting\n\nPlease let me know if you have any questions or would like to discuss further.\n\nBest regards,\nRichard Surovi\nB2B Property Management`,
        timestamp: "11/28/2025, 3:15 PM",
        isFromMe: true,
        emailOpens: [
          { openedAt: "11/28/2025, 4:32 PM" },
          { openedAt: "11/29/2025, 9:15 AM" },
        ],
      },
      {
        id: "e2",
        from: ownerName,
        fromEmail: ownerEmail,
        to: "Richard Surovi",
        toEmail: "richard@b2bpm.com",
        subject: "RE: Property Management Proposal - B2B Property Management",
        content: `Hi Richard,\n\nThank you for sending this over. The proposal looks good overall.\n\nI have a few questions:\n1. What is your response time for maintenance emergencies?\n2. Do you handle eviction proceedings if needed?\n3. Can you provide references from other property owners?\n\nLooking forward to hearing from you.\n\n${ownerName.split(" ")[0]}`,
        timestamp: "11/29/2025, 10:30 AM",
        isFromMe: false,
      },
      {
        id: "e3",
        from: "Richard Surovi",
        fromEmail: "richard@b2bpm.com",
        to: ownerName,
        toEmail: ownerEmail,
        subject: "RE: Property Management Proposal - B2B Property Management",
        content: `Hi ${ownerName.split(" ")[0]},\n\nGreat questions! Here are the answers:\n\n1. Emergency response time: We guarantee a 30-minute response for emergencies, with a contractor on-site within 2 hours.\n\n2. Evictions: Yes, we handle the entire eviction process, including legal filings and court appearances. This is included in our management fee.\n\n3. References: I'll send over contact information for 3 property owners who have been with us for 2+ years.\n\nWould you like to schedule a call to discuss further?\n\nBest,\nRichard`,
        timestamp: "11/29/2025, 2:45 PM",
        isFromMe: true,
        emailOpens: [
          { openedAt: "11/29/2025, 3:10 PM" },
        ],
      },
    ],
  },
  {
    id: 8,
    type: "call",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "called",
    target: ownerName,
    targetPhone: ownerPhone,
    message: "Initial discovery call - discussed property portfolio and management needs.",
    callNotes: `Initial discovery call with property owner ${ownerName}.\n\nKey Points Discussed:\n- Owner has properties in portfolio\n- Currently self-managing but struggling with time\n- Main pain points: tenant screening, maintenance coordination\n- Budget: Looking for fees under 10%\n- Timeline: Wants to transition within 30 days\n\nNext Steps:\n- Send proposal by end of week\n- Schedule follow-up call for next Tuesday\n\nCall duration: 18 minutes 42 seconds`,
    appfolioLink: "https://appfolio.com/calls/recording/def456uvw",
    timestamp: "11/25/2025, 11:00 AM",
    isNote: false,
    isRead: true,
  },
  // Group Chat Communications
  {
    id: 9,
    type: "sms",
    user: "Nina Patel",
    userInitials: "NP",
    phone: "(216) 555-1234",
    action: "texted",
    target: "Property Team",
    targetPhone: "",
    message: "Team, we need to coordinate the property inspection schedule for the prospect's properties.",
    fullMessage: "Team, we need to coordinate the property inspection schedule for the prospect's properties. Can everyone confirm their availability for next week?",
    timestamp: "12/6/2025, 10:00 AM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", ownerName],
    unreadCount: 5,
  },
  {
    id: 10,
    type: "sms",
    user: "Richard Surovi",
    userInitials: "RS",
    phone: "(216) 810-2564",
    action: "texted",
    target: "Property Team",
    targetPhone: "",
    message: "I'm available Tuesday and Thursday afternoon for the inspections.",
    fullMessage: "I'm available Tuesday and Thursday afternoon for the inspections. Let me know what works best for everyone.",
    timestamp: "12/6/2025, 10:15 AM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", ownerName],
    unreadCount: 0,
  },
  {
    id: 11,
    type: "email",
    user: "Sarah Johnson",
    userInitials: "SJ",
    phone: "",
    action: "emailed",
    target: "Property Management Team",
    targetPhone: "",
    message: "Q4 Property Acquisition Review - Action Items for the prospect's portfolio.",
    timestamp: "12/5/2025, 3:30 PM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Sarah Johnson", "Richard Surovi", "Nina Patel", "Mike Davis", ownerName],
    unreadCount: 8,
    emailThread: [
      {
        id: "g1",
        from: "Sarah Johnson",
        fromEmail: "sarah@b2bpm.com",
        to: "Property Management Team",
        toEmail: "team@b2bpm.com",
        subject: "Q4 Property Acquisition Review - Action Items",
        content: `Hi team,\n\nFollowing up on our meeting regarding the new prospect. Here are the action items:\n\n1. Richard - Schedule property inspections for next week\n2. Nina - Prepare financial analysis for the portfolio\n3. Mike - Coordinate with maintenance vendors for estimates\n\nPlease update the shared tracker by Friday.\n\nThanks,\nSarah`,
        timestamp: "12/5/2025, 3:30 PM",
        isFromMe: false,
      },
    ],
  },
  {
    id: 12,
    type: "sms",
    user: ownerName,
    userInitials: ownerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    phone: ownerPhone,
    action: "texted",
    target: "Property Team",
    targetPhone: "",
    message: "Thanks for the update everyone. I'll be available on Thursday for the inspection.",
    fullMessage: "Thanks for the update everyone. I'll be available on Thursday for the inspection. Please confirm the time.",
    timestamp: "12/6/2025, 11:30 AM",
    isNote: false,
    isRead: false,
    isGroupChat: true,
    groupParticipants: ["Nina Patel", "Richard Surovi", "Sarah Johnson", ownerName],
    unreadCount: 2,
  },
  {
    id: 13,
    type: "email",
    user: "Mike Davis",
    userInitials: "MD",
    phone: "",
    action: "emailed",
    target: "Vendor Coordination Group",
    targetPhone: "",
    message: "HVAC and plumbing vendor quotes for the prospect properties.",
    timestamp: "12/4/2025, 2:00 PM",
    isNote: false,
    isRead: true,
    isGroupChat: true,
    groupParticipants: ["Mike Davis", "Richard Surovi", "ABC HVAC Services", ownerName],
    unreadCount: 0,
    emailThread: [
      {
        id: "g2",
        from: "Mike Davis",
        fromEmail: "mike@b2bpm.com",
        to: "Vendor Coordination Group",
        toEmail: "vendors@b2bpm.com",
        subject: "Re: HVAC Maintenance Schedule - Multiple Properties",
        content: `Team,\n\nThe vendor has confirmed availability for inspections at all properties. Schedule as follows:\n- Property A: Monday 9 AM\n- Property B: Monday 2 PM\n- Property C: Tuesday 10 AM\n\n${ownerName}, please ensure access is available at these times.\n\nBest,\nMike`,
        timestamp: "12/4/2025, 2:00 PM",
        isFromMe: false,
      },
    ],
  },
]

interface OwnerDetailPageProps {
  lead?: Lead | null
  onBack: () => void
  onNavigateToProperty?: (propertyName: string) => void
}

export function OwnerDetailPage({ lead, onBack, onNavigateToProperty }: OwnerDetailPageProps) {
  const ACTIVITIES_DATA = getActivitiesData(lead?.name || "", lead?.phone || "", lead?.email || "")

  const stageIndex = STAGES.findIndex((s) => s.toLowerCase() === lead?.stage?.toLowerCase())
  const [currentStage, setCurrentStage] = useState(stageIndex >= 0 ? stageIndex : 0)
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null)
  const [expandedThreadMessage, setExpandedThreadMessage] = useState<number | null>(null)
  const [pinnedActivities, setPinnedActivities] = useState<number[]>([])
  const [readStatusFilter, setReadStatusFilter] = useState<"all" | "read" | "unread">("all")
  const [typeFilter, setTypeFilter] = useState<"all" | "sms" | "email" | "call">("all")
  const [activityChatTab, setActivityChatTab] = useState<"private" | "group">("private")
  const [activityTileFilter, setActivityTileFilter] = useState<"all" | "emails" | "sms" | "notes">("all")
  const [activityRadioFilter, setActivityRadioFilter] = useState<"all" | "unread" | "unresponded">("all")
  const [replyText, setReplyText] = useState("")
  const [staffOpen, setStaffOpen] = useState(false)
  const [assignedStaff, setAssignedStaff] = useState(STAFF_MEMBERS[0])

  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  
  // Communication Thread Modal State
  const [showThreadModal, setShowThreadModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<typeof ACTIVITIES_DATA[0] | null>(null)
  const [expandedEmails, setExpandedEmails] = useState<string[]>([])
  const [threadReplyText, setThreadReplyText] = useState("")
  const [threadReplyChannel, setThreadReplyChannel] = useState<"email" | "sms">("email")
  const [threadEmailCC, setThreadEmailCC] = useState("")
  const [threadEmailBCC, setThreadEmailBCC] = useState("")
  const [showCCBCC, setShowCCBCC] = useState(false)
  const [threadEmailSubject, setThreadEmailSubject] = useState("")
  const [showUploadDocModal, setShowUploadDocModal] = useState(false)
  const [showRequestDocModal, setShowRequestDocModal] = useState(false)
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false)
  const [showPropertyPopup, setShowPropertyPopup] = useState(false)
  const [showPmaModal, setShowPmaModal] = useState(false)
  const [llcs, setLlcs] = useState(initialLLCs)
  const [selectedPmaLlc, setSelectedPmaLlc] = useState<string>("")

  // Properties tab expand/collapse
  const [expandedOwnershipTypes, setExpandedOwnershipTypes] = useState<Set<string>>(new Set())
  // Entity level: tracks collapsed entities (empty = all expanded by default)
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

  // PMA property-level selection
  const [pmaSelectedProperties, setPmaSelectedProperties] = useState<Set<string>>(new Set())
  const [newPropertyLlc, setNewPropertyLlc] = useState<string>("")
  const [showCreateLlcInline, setShowCreateLlcInline] = useState(false)
  const [newLlcName, setNewLlcName] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<typeof ownerProperties[0] | null>(null)
  const [propertyFormData, setPropertyFormData] = useState({
    yearBuilt: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    lotSize: "",
    hoa: "",
    petPolicy: "",
    laundry: "",
    notes: ""
  })
  const [newTask, setNewTask] = useState({ title: "", property: "", unit: "", dueDate: "", priority: "Medium", assignTo: "", description: "" })
  const [newDocUpload, setNewDocUpload] = useState({ 
    file: null as File | null, 
    type: "", 
    comments: "", 
    assignTo: "" 
  })
  const [newDocRequest, setNewDocRequest] = useState({ name: "", type: "", property: "" })
  const [dragActive, setDragActive] = useState(false)

  const [assignedTeam, setAssignedTeam] = useState([STAFF_MEMBERS[0]])
  const [teamPopoverOpen, setTeamPopoverOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  // State for the task modal
  const [showTaskModal, setShowTaskModal] = useState(false)

  // SMS Modal state
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [selectedSMSActivity, setSelectedSMSActivity] = useState<(typeof ACTIVITIES_DATA)[0] | null>(null)
  
  // Email Modal state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedEmailActivity, setSelectedEmailActivity] = useState<(typeof ACTIVITIES_DATA)[0] | null>(null)

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

  // State for tabs
  const [activeTab, setActiveTab] = useState("overview")
  
  // State for processes in Processes tab
  const [processStatusFilter, setProcessStatusFilter] = useState<"in-progress" | "completed" | "upcoming">("in-progress")
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([])
  const nav = useNav()

  const handleNavigateToProcess = (processName: string) => {
    setActiveTab("processes")
    const allProcesses = [
      ...prospectProcesses.inProgress,
      ...prospectProcesses.upcoming,
      ...prospectProcesses.completed,
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

  // State for Create/Edit Process panel
  const [showProcessPanel, setShowProcessPanel] = useState(false)
  const [editingProcess, setEditingProcess] = useState<{
    id: string
    name: string
    prospectingStage: string
    status: string
    startedOn?: string
    description?: string
  } | null>(null)

  const ownerInfo = {
    name: lead?.name || "N/A",
    primaryEmail: lead?.email || "",
    secondaryEmail: lead?.secondaryEmail || "",
    primaryPhone: lead?.phone || "",
    secondaryPhone: lead?.secondaryPhone || "",
    leadSource: lead?.source || "Website Inquiry",
  }

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

  const togglePin = (activityId: number) => {
    setPinnedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const toggleExpand = (activityId: number, activityType?: string) => {
    // For SMS, open the modal instead of inline expansion
    if (activityType === "sms") {
      const activity = ACTIVITIES_DATA.find((a) => a.id === activityId)
      if (activity) {
        setSelectedSMSActivity(activity)
        setShowSMSModal(true)
      }
      return
    }
    
    // For Email, open the email modal
    if (activityType === "email") {
      const activity = ACTIVITIES_DATA.find((a) => a.id === activityId)
      if (activity) {
        setSelectedEmailActivity(activity)
        setShowEmailModal(true)
      }
      return
    }

    if (expandedActivity === activityId) {
      setExpandedActivity(null)
      setExpandedThreadMessage(null)
      setReplyText("")
    } else {
      setExpandedActivity(activityId)
      setExpandedThreadMessage(null)
      setReplyText("")
    }
  }

  const handleSendReply = () => {
    if (replyText.trim()) {
      // In a real app, this would send the reply
      console.log("Sending reply:", replyText)
      setReplyText("")
    }
  }

  // Open communication thread modal
  const openThreadModal = (activity: typeof ACTIVITIES_DATA[0]) => {
    if (activity.type === "sms" || activity.type === "email") {
      setSelectedCommunication(activity)
      setExpandedEmails([])
      setThreadReplyText("")
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

  // Filter by chat tab (Private vs Group)
  const chatTabFilteredActivities = ACTIVITIES_DATA.filter((activity) => {
    if (activityChatTab === "private") {
      return !activity.isGroupChat // Private: one-to-one communications
    } else {
      return activity.isGroupChat === true // Group: multi-party communications
    }
  })
  
  // Calculate activity summary counts (filtered by chat tab)
  const activitySummary = {
    emails: chatTabFilteredActivities.filter(a => a.type === "email" || a.type === "email_open").length,
    sms: chatTabFilteredActivities.filter(a => a.type === "sms").length,
    notes: chatTabFilteredActivities.filter(a => a.type === "note" || a.isNote).length,
    calls: chatTabFilteredActivities.filter(a => a.type === "call").length,
    get all() { return chatTabFilteredActivities.length },
  }
  
  const filteredActivities = chatTabFilteredActivities.filter((activity) => {
    // Filter by tile selection
    if (activityTileFilter === "emails" && activity.type !== "email" && activity.type !== "email_open") return false
    if (activityTileFilter === "sms" && activity.type !== "sms") return false
    if (activityTileFilter === "notes" && activity.type !== "note" && !activity.isNote) return false
    
    // Filter by radio selection
    if (activityRadioFilter === "unread" && activity.isRead) return false
    if (activityRadioFilter === "unresponded" && (activity.isRead || !activity.isRead)) {
      // For unresponded, we'd need an isResponded field - for now just show unread incoming
      if (activity.isRead) return false
    }
    
    // Legacy filters (keep for backward compatibility)
    if (readStatusFilter === "read" && !activity.isRead) return false
    if (readStatusFilter === "unread" && activity.isRead) return false

    // Filter by type
    if (typeFilter !== "all") {
      // Show email_open items when filtering by email
      if (typeFilter === "email" && activity.type !== "email" && activity.type !== "email_open") return false
      if (typeFilter !== "email" && activity.type !== typeFilter) return false
    }

    return true
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sms":
        return { icon: MessageSquare, color: "bg-green-50 border border-green-200", iconColor: "text-green-400" }
      case "email":
        return { icon: Mail, color: "bg-blue-50 border border-blue-200", iconColor: "text-blue-400" }
      case "email_open":
        return { icon: User, color: "bg-gray-50 border border-gray-200", iconColor: "text-muted-foreground" }
      case "call":
        return { icon: Phone, color: "bg-amber-50 border border-amber-200", iconColor: "text-amber-400" }
      case "note":
        return { icon: StickyNote, color: "bg-orange-50 border border-orange-200", iconColor: "text-orange-400" }
      default:
        return { icon: MessageSquare, color: "bg-gray-50 border border-gray-200", iconColor: "text-gray-400" }
    }
  }

  const getActionVerbColor = (type: string) => {
    switch (type) {
      case "sms":
        return "text-green-400"
      case "email":
        return "text-blue-400"
      case "call":
        return "text-amber-400"
      default:
        return "text-blue-400"
    }
  }

  const renderExpandedContent = (activity: (typeof ACTIVITIES_DATA)[0]) => {
    const isExpanded = expandedActivity === activity.id

    if (!isExpanded) return null

    switch (activity.type) {
      case "sms":
        return (
          <div className="mt-4 pt-4 border-t border-border">
            {/* Full SMS Message */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground whitespace-pre-wrap">{activity.fullMessage || activity.message}</p>
            </div>
            {/* Reply Input */}
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
        if (activity.isSystem) return null
        const emailThread = activity.emailThread || []
        return (
          <div className="mt-4 pt-4 border-t border-border">
            {/* Email Thread */}
            <div className="space-y-3 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email Thread ({emailThread.length} messages)
              </p>
              {emailThread.map((email, index) => (
                <div
                  key={email.id}
                  className={`rounded-lg border transition-all cursor-pointer ${
                    expandedThreadMessage === email.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-border hover:border-blue-200 hover:bg-muted/30"
                  }`}
                  onClick={() => setExpandedThreadMessage(expandedThreadMessage === email.id ? null : email.id)}
                >
                  {/* Email Header */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className={`text-xs ${email.isFromMe ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
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

                  {/* Email Content (shown when selected) */}
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
                                        {/* Email Opens */}
                                        {email.isFromMe && email.emailOpens && email.emailOpens.length > 0 && (
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
                      {/* Reply to this email */}
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
            {/* Call Notes */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Call Notes</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">{activity.callNotes || activity.message}</p>
              </div>
            </div>
            {/* Appfolio Link */}
            {activity.appfolioLink && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Call Recording Available</p>
                    <p className="text-sm text-blue-700 mt-1">
                      This call recording is stored in Appfolio. Click the link below to access the full recording and
                      additional call details.
                    </p>
                    <a
                      href={activity.appfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
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

  const toggleProcessExpanded = (processId: string) => {
    setExpandedProcesses(prev => 
      prev.includes(processId) 
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    )
  }

  const handleCreateProcess = () => {
    setEditingProcess(null)
    setShowProcessPanel(true)
  }

  const handleEditProcess = (process: { id: string; name: string; prospectingStage: string; status: string; startedOn?: string }) => {
    setEditingProcess({
      ...process,
      description: "Sample process description for editing purposes."
    })
    setShowProcessPanel(true)
  }

  const handleStartNewProcess = (processType: { id: string; name: string; stages: number }) => {
    const today = new Date()
    const dateStr = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`
    const newProcess = {
      id: `proc-new-${Date.now()}`,
      name: processType.name,
      prospectingStage: "Working",
      startedOn: dateStr,
      status: "In Progress",
      tasks: [] as Array<{ id: string; name: string; startDate: string | null; completedDate: string | null; staffName: string; staffEmail: string }>,
    }
    setNewlyStartedProcesses(prev => [...prev, newProcess])
    setShowStartProcessModal(false)
    setProcessSearchQuery("")
    setProcessStatusFilter("in-progress")
  }

  const handleCloseProcessPanel = () => {
    setShowProcessPanel(false)
    setEditingProcess(null)
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 pt-2 overflow-auto">
        {/* Back Button */}
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 text-[rgba(10,10,10,1)]" />
          <span className="text-[rgba(0,0,0,1)]">Back to Owners</span>
        </button>

        {/* Owner Info Card */}
        <div className="rounded-lg p-4 mb-6 bg-[rgba(248,245,245,1)]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-teal-100 text-teal-600">
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{ownerInfo.name}</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Primary:</span>
                    <a href={`mailto:${ownerInfo.primaryEmail}`} className="text-teal-600 hover:underline">
                      {ownerInfo.primaryEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Primary:</span>
                    <a href={`tel:${ownerInfo.primaryPhone}`} className="text-teal-600 hover:underline">
                      {ownerInfo.primaryPhone}
                    </a>
                  </div>
                  {ownerInfo.secondaryEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground opacity-0" />
                      <span className="text-muted-foreground">Secondary:</span>
                      <a href={`mailto:${ownerInfo.secondaryEmail}`} className="text-teal-600 hover:underline">
                        {ownerInfo.secondaryEmail}
                      </a>
                    </div>
                  )}
                  {ownerInfo.secondaryPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground opacity-0" />
                      <span className="text-muted-foreground">Secondary:</span>
                      <a href={`tel:${ownerInfo.secondaryPhone}`} className="text-teal-600 hover:underline">
                        {ownerInfo.secondaryPhone}
                      </a>
                    </div>
                  )}
                </div>
                {/* Lead Source */}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Lead Source:</span>
                  <span className="text-foreground">{ownerInfo.leadSource}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Popover open={teamPopoverOpen} onOpenChange={setTeamPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent h-8">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Richard Surovi</span>
                      
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[340px] p-0" align="start">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Assigned Team Members</h4>
                        {assignedTeam.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
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
                                  <AvatarFallback className={`text-xs ${member.color}`}>{member.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{member.name}</p>
                                  <p className="text-xs text-muted-foreground">{member.department}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
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
                            {STAFF_MEMBERS
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
                                    <AvatarFallback className={`text-xs ${staff.color}`}>{staff.initials}</AvatarFallback>
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

            </div>
          </div>

          {/* Stage Progress Rectangles */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1 flex-1">
              {STAGES.map((stage, index) => {
                const tasks = STAGE_TASKS[stage] || []
                return (
                  <TooltipProvider key={stage} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-7 flex-1 rounded-sm flex items-center justify-center transition-all hover:opacity-80 hover:scale-y-110"
                          style={{ backgroundColor: STAGE_PROGRESS_COLORS[index] }}
                        >
                          {index === currentStage && (
                            <Check className="h-4 w-4 text-white drop-shadow-sm" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-white text-foreground border border-border shadow-lg rounded-md px-3 py-2.5 max-w-[220px]">
                        <p className="font-semibold text-[13px] text-foreground">{stage}</p>
                        {STAGE_REASONS[stage] ? (
                          <p className="text-[12px] text-foreground/70 mt-1.5 italic">{STAGE_REASONS[stage]}</p>
                        ) : tasks.length > 0 ? (
                          <div className="flex flex-col gap-1.5 mt-1.5">
                            {tasks.map((task, taskIdx) => (
                              <div key={taskIdx} className="flex items-center gap-2 text-[12px] text-foreground/70">
                                {task.icon === "call" && <Phone className="h-3.5 w-3.5 shrink-0" />}
                                {task.icon === "email" && <Mail className="h-3.5 w-3.5 shrink-0" />}
                                {task.icon === "sms" && <MessageSquare className="h-3.5 w-3.5 shrink-0" />}
                                {task.icon === "todo" && <ListTodo className="h-3.5 w-3.5 shrink-0" />}
                                {task.icon === "video" && <PlayCircle className="h-3.5 w-3.5 shrink-0" />}
                                <span>{task.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[12px] text-foreground/60 mt-1.5">No tasks assigned</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
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
            <span className="text-sm font-semibold text-green-800">Pending Communications</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <Mail className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"Unread Emails: "}
                <span className="font-semibold">1</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"Unread SMS: "}
                <span className="font-semibold">3</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3">
              <Phone className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"Pending Calls: "}
                <span className="font-semibold">2</span>
              </span>
            </div>
          </div>
        </button>

        {/* Bar 2: Pending Actions */}
        <div className="flex items-center justify-between px-5 py-2.5 rounded-lg border border-amber-300 bg-amber-50/80">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-green-800">Pending Actions</span>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                setShowMissingInfoModal?.(true)
              }}
              className="flex items-center gap-1.5 px-3 border-r border-amber-300 hover:underline"
            >
              
              
            </button>
            <button
              type="button"
              onClick={() => {
                setShowMissingInfoModal?.(true)
              }}
              className="flex items-center gap-1.5 px-3 hover:underline"
            >
              <Upload className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"Missing Documents: "}
                <span className="font-semibold">3</span>
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
            <span className="text-sm font-semibold text-green-800">Task Overview</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <Workflow className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"Process: "}
                <span className="font-semibold">{ownerTasks.filter(t => t.source === "process" && t.status !== "Completed").length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <Mail className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"Communication: "}
                <span className="font-semibold">{ownerTasks.filter(t => t.source === "communication" && t.status !== "Completed").length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <ListTodo className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-green-800">
                {"General: "}
                <span className="font-semibold">{ownerTasks.filter(t => t.source === "general" && t.status !== "Completed").length}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-sm text-red-700">
                {"Overdue: "}
                <span className="font-semibold">{ownerTasks.filter(t => t.isOverdue).length}</span>
              </span>
            </div>
          </div>
        </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Properties
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                {ownerProperties.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="communications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Communications
            </TabsTrigger>
            <TabsTrigger
              value="processes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Processes
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                {prospectProcesses.inProgress.length + prospectProcesses.upcoming.length + prospectProcesses.completed.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
            >
              Documents
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                {ownerDocuments.length}
              </Badge>
            </TabsTrigger>
              <TabsTrigger
                value="audit-log"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Audit Log
              </TabsTrigger>
            </TabsList>

          {/* Overview Tab - existing content */}
          <TabsContent value="overview" className="mt-6">
            {/* Tasks Section */}
            <div id="tasks-section" className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-teal-600" />
                  <h3 className="text-lg font-semibold">Tasks ({ownerTasks.length})</h3>
                </div>
                <Button onClick={() => setShowNewTaskModal(true)} className="bg-teal-600 hover:bg-teal-700">
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
                    {ownerTasks.filter(t => t.source === "process").map((task) => (
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
                            <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                              {task.dueDate}
                            </span>
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
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600" onClick={() => setShowTaskModal(true)} title="Edit Task"><Edit className="h-4 w-4" /></Button>
                            {task.status !== "Completed" && task.status !== "Skipped" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600" title="Mark Complete"><Check className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Communication Tasks */}
                    {ownerTasks.filter(t => t.source === "communication").map((task) => (
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
                            <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                              {task.dueDate}
                            </span>
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
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600" onClick={() => setShowTaskModal(true)} title="Edit Task"><Edit className="h-4 w-4" /></Button>
                            {task.status !== "Completed" && task.status !== "Skipped" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600" title="Mark Complete"><Check className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* General Tasks */}
                    {ownerTasks.filter(t => t.source === "general").map((task) => (
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
                            <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                              {task.dueDate}
                            </span>
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
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600" onClick={() => setShowTaskModal(true)} title="Edit Task"><Edit className="h-4 w-4" /></Button>
                            {task.status !== "Completed" && task.status !== "Skipped" && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600" title="Mark Complete"><Check className="h-4 w-4" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {ownerTasks.length === 0 && (
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

            {/* Pinned Activity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Pinned Activity</h3>
              <p className="text-sm text-muted-foreground italic">
                Click the pin icon on the activities below to keep them here at the top.
              </p>
            </div>

            {/* Activity Section */}
            <div id="activity-section" className="flex-1 rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Activity</h3>
              
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
                      {activitySummary.emails}
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
                      {activitySummary.sms}
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
              
              {/* Radio Filters */}
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="activityRadioFilter"
                    checked={activityRadioFilter === "all"}
                    onChange={() => setActivityRadioFilter("all")}
                    className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-600">All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="activityRadioFilter"
                    checked={activityRadioFilter === "unread"}
                    onChange={() => setActivityRadioFilter("unread")}
                    className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-600">Unread</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="activityRadioFilter"
                    checked={activityRadioFilter === "unresponded"}
                    onChange={() => setActivityRadioFilter("unresponded")}
                    className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-600">Unresponded</span>
                </label>
              </div>

              <div className="divide-y border rounded-lg max-h-[320px] overflow-y-auto">
                {filteredActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No activities match your filters.</p>
                ) : (
                  filteredActivities.map((activity) => {
                    const { icon: ActivityIcon, color: activityBg, iconColor: activityIconColor } = getActivityIcon(activity.type)
                    const isExpanded = expandedActivity === activity.id
                    const isExpandable =
                      activity.type === "sms" || activity.type === "email" || activity.type === "call" || activity.type === "email_open"

                    // Collapsed email header rendering
                    if (activity.type === "email" && !activity.isSystem) {
                      const emailSubject = activity.emailThread?.[0]?.subject || activity.emailSubject || "No Subject"
                      return (
                        <div key={activity.id} className="bg-white">
                          <div
                            className="px-4 py-3 cursor-pointer hover:bg-blue-50/60 transition-colors bg-blue-50/40"
                            onClick={() => toggleExpand(activity.id, activity.type)}
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
                                  className={`p-1 ${pinnedActivities.includes(activity.id) ? "text-blue-600" : "text-muted-foreground"}`}
                                  onClick={(e) => { e.stopPropagation(); togglePin(activity.id) }}
                                >
                                  <Pin className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-blue-100 bg-blue-50/20">
                              <div className="pt-4 space-y-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs bg-gray-100 text-gray-600">{activity.userInitials}</AvatarFallback>
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
                        className={`transition-all bg-white ${isExpandable && !activity.isSystem ? "cursor-pointer hover:bg-slate-50" : ""}`}
                      >
                        <div
                          className="p-4"
                          onClick={() => {
                            if (isExpandable && !activity.isSystem) {
                              if (activity.type === "sms") {
                                openThreadModal(activity)
                              } else {
                                toggleExpand(activity.id, activity.type)
                              }
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {activity.type === "email_open" ? (
                              <div className="h-10 w-10 flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            ) : (
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="text-sm bg-gray-100 text-gray-600">
                                    {activity.userInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ${activityBg}`}
                                >
                                  <ActivityIcon className={`h-3 w-3 ${activityIconColor}`} />
                                </div>
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              {activity.type === "email_open" ? (
                                <p className="text-sm text-amber-500">
                                  A recipient opened the email "{activity.emailSubject}" {activity.timestamp}
                                </p>
                              ) : activity.isNote ? (
                                <>
                                  <p className="text-sm font-medium">{activity.user} <span className="text-orange-400">left a Note</span></p>
                                  <p className="text-sm text-muted-foreground mt-1">{activity.message}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm">
                                    <span className="font-medium">{activity.user}</span>{" "}
                                    {activity.phone && <span className="text-muted-foreground">{activity.phone}</span>}{" "}
                                    <span className={getActionVerbColor(activity.type)}>{activity.action}</span>{" "}
                                    <span className="font-medium">{activity.target}</span>{" "}
                                    {activity.targetPhone && (
                                      <span className="text-muted-foreground">{activity.targetPhone}</span>
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
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {activity.message}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {activity.isGroupChat && activity.unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                                  {activity.unreadCount}
                                </span>
                              )}
                              {!activity.isRead && !activity.isGroupChat && <div className="h-2 w-2 rounded-full bg-blue-400" />}
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {activity.timestamp}
                              </span>
                              {isExpandable && !activity.isSystem && (
                                <div className="text-muted-foreground">
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`p-1 ${pinnedActivities.includes(activity.id) ? "text-blue-600" : "text-muted-foreground"}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  togglePin(activity.id)
                                }}
                              >
                                <Pin className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {isExpanded && <div className="px-4 pb-4">{renderExpandedContent(activity)}</div>}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold">Properties Owned ({ownerProperties.length})</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => { setPmaSelectedProperties(new Set()); setShowPmaModal(true) }}
                  className="bg-transparent border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PMA
                </Button>
                <Button onClick={() => { setNewPropertyLlc(""); setShowCreateLlcInline(false); setNewLlcName(""); setShowNewPropertyModal(true) }} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </div>

            {/* Entity-Grouped Properties - Flat list by entity name */}
            {(() => {
              // Group properties by entity, flattening the ownership type level
              const entities: { entityName: string; entityId: string; ownershipType: string; properties: typeof ownerProperties }[] = []

              for (const prop of ownerProperties) {
                const matchedLlc = llcs.find(l => l.id === prop.llcId)
                const oType = matchedLlc ? matchedLlc.ownershipType : "Personal"
                const entityName = matchedLlc ? matchedLlc.name : ""
                const entityId = matchedLlc ? matchedLlc.id : `personal-${prop.id}`

                if (oType === "Personal") {
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
                  default: return { bg: "bg-amber-50", border: "border-amber-200", text: "text-green-800", badge: "bg-amber-100 text-amber-700 border-amber-200" }
                }
              }

              const getStatusBadge = (status: string) => {
                switch (status) {
                  case "Active": return "bg-green-50 text-green-700 border-green-200"
                  case "Vacant": return "bg-orange-50 text-orange-700 border-orange-200"
                  default: return "bg-yellow-50 text-yellow-700 border-yellow-200"
                }
              }

              const handlePropertyClick = (property: typeof ownerProperties[0]) => {
                setSelectedProperty(property)
                setPropertyFormData({
                  yearBuilt: property.id === "1" ? "2018" : property.id === "2" ? "1995" : "2010",
                  sqft: property.id === "1" ? "2,450" : property.id === "2" ? "8,500" : "1,200",
                  bedrooms: property.id === "1" ? "4" : property.id === "2" ? "" : "2",
                  bathrooms: property.id === "1" ? "3" : property.id === "2" ? "" : "2",
                  parkingSpaces: property.id === "1" ? "2" : property.id === "2" ? "12" : "1",
                  lotSize: property.id === "1" ? "0.25 acres" : property.id === "2" ? "0.5 acres" : "",
                  hoa: property.id === "1" ? "$150/month" : property.id === "2" ? "N/A" : "$350/month",
                  petPolicy: property.id === "1" ? "Allowed" : property.id === "2" ? "" : "Small pets only",
                  laundry: property.id === "1" ? "In-unit" : property.id === "2" ? "Common area" : "In-unit",
                  notes: ""
                })
                setShowPropertyPopup(true)
              }

              return (
                <div className="space-y-3">
                  {entities.map((entity, entityIndex) => {
                    const colors = getOwnershipColor(entity.ownershipType)
                    const isExpanded = !expandedEntities.has(entity.entityId)

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
                                  {/* Property Row - Clickable to expand */}
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
                                      <Badge variant="outline" className={`text-xs shrink-0 ml-auto ${getStatusBadge(property.status)}`}>
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
                                              <Badge variant="outline" className={`text-xs ${getStatusBadge(property.status)}`}>
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
                                              <span className="text-sm text-green-800">Monthly Rent:</span>
                                              <span className="text-sm font-bold text-amber-900">${property.monthlyRent.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-sm text-green-800">Security Deposit:</span>
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
                                            onClick={() => handlePropertyClick(property)}
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
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="mt-4 space-y-4">
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
                              const contactName = lead?.name || "Prospect"
                              const staffName = "Richard Surovi"
                              const isEmailExp = expandedCommEmails.has(String(item.id))

                              return (
                                <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                  <div className={`max-w-[75%] ${
                                    isOutgoing
                                      ? item.type === "email"
                                        ? "text-slate-900 rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                        : item.type === "sms"
                                          ? "text-slate-900 rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                          : "text-slate-900 rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                      : item.type === "email"
                                        ? "text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                        : item.type === "sms"
                                          ? "text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                          : "text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                  } ${
                                    item.type === "email"
                                      ? "bg-[#E6F4EA] border border-[#c8e6cf]"
                                      : item.type === "sms"
                                        ? isOutgoing
                                          ? "bg-[#90CAF9] border border-[#64B5F6]"
                                          : "bg-[#E3F2FD] border border-[#BBDEFB]"
                                        : "bg-[#E0F7F6] border border-[#b8e8e6]"
                                  } p-3 shadow-sm`}>
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
                                        {/* Collapsed header: subject + expand button */}
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

                                            {/* Attachments placeholder */}
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
                                          <Phone className="h-4 w-4" />
                                          <span className="text-sm">
                                            {isOutgoing ? "Outgoing call" : "Incoming call"}
                                          </span>
                                          <span className="text-sm text-slate-400 ml-auto">
                                            {item.callNotes ? "- " + (item.callNotes.length > 40 ? item.callNotes.slice(0, 40) + "..." : item.callNotes) : ""}
                                          </span>
                                          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-open/call:rotate-180 shrink-0" />
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
                                    <div className={`text-[10px] mt-2 ${isOutgoing ? "text-right" : ""} text-slate-400`}>
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
                              <input type="text" defaultValue={lead?.email || ""} className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700" />
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
                                <Input placeholder="Enter phone number or use prospect's number..." defaultValue={lead?.phone || ""} className="text-sm" />
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

                      <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                        <div className="flex flex-col gap-3">
                          {groupMessages.length > 0 ? groupMessages.map((item) => {
                            const isOutgoing = item.user === "Richard Surovi"
                            const isEmailExp2 = expandedCommEmails.has(String(item.id))
                            return (
                              <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] ${
                                  isOutgoing
                                    ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                    : "rounded-tl-xl rounded-tr-xl rounded-br-xl"
                                } ${
                                  item.type === "email"
                                    ? "bg-[#E6F4EA] border border-[#c8e6cf]"
                                    : "bg-[#E3F2FD] border border-[#bbdefb]"
                                } text-slate-900 p-3 shadow-sm`}>
                                  <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
                                    <span className="text-xs font-medium text-slate-500">{item.user}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                      item.type === "email"
                                        ? "bg-[#c8e6cf] text-green-800"
                                        : "bg-[#bbdefb] text-blue-800"
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
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="mt-6">
            <div className="flex items-center justify-between mb-6">
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
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
              <button
                type="button"
                onClick={() => setProcessStatusFilter("in-progress")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  processStatusFilter === "in-progress"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                In Progress ({prospectProcesses.inProgress.length + newlyStartedProcesses.length})
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
                Completed ({prospectProcesses.completed.length})
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
                Upcoming ({prospectProcesses.upcoming.length})
              </button>
            </div>

            <div className="space-y-6">
              {/* In Progress Processes */}
              {processStatusFilter === "in-progress" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PlayCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="font-semibold text-foreground">In Progress ({prospectProcesses.inProgress.length + newlyStartedProcesses.length})</h4>
                </div>
                <div className="space-y-2">
                  {/* Newly started processes */}
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
                                onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" })}
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" }) }}>
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
                  {/* Existing in-progress processes */}
                  {prospectProcesses.inProgress.map((process) => {
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
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" })}
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" }) }}>
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
                  <h4 className="font-semibold text-foreground">Upcoming ({prospectProcesses.upcoming.length})</h4>
                </div>
                <div className="space-y-2">
                  {prospectProcesses.upcoming.map((process) => {
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
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" })}
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" }) }}>
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
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <h4 className="font-semibold text-foreground">Completed ({prospectProcesses.completed.length})</h4>
                </div>
                <div className="space-y-2">
                  {prospectProcesses.completed.map((process) => {
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
                              onClick={() => nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" })}
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); nav.go("contactProcessDetail", { process, contactName: lead?.name || "Owner" }) }}>
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
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-semibold">Documents ({ownerDocuments.length})</h3>
              </div>
              <Button onClick={() => setShowUploadDocModal(true)} className="bg-teal-600 hover:bg-teal-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Assigned Staff</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ownerDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-primary">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/50">
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.uploadedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 bg-primary/15 text-primary border border-primary/30">
                            <AvatarFallback className="bg-primary/15 text-primary text-xs">
                              {doc.uploadedBy.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{doc.uploadedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.assignedStaff ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 bg-primary/15 text-primary border border-primary/30">
                              <AvatarFallback className="bg-primary/15 text-primary text-xs">
                                {doc.assignedStaff.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{doc.assignedStaff}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit-log" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold">Audit Log</h3>
            </div>

            {/* Filter Controls (UI Only - Non-functional) */}
            <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="w-48 h-9"
                />
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
                <Input
                  type="date"
                  className="w-36 h-9"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  className="w-36 h-9"
                />
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
                  {ownerAuditLogs.length > 0 ? (
                    ownerAuditLogs.map((log) => (
                      <TableRow key={log.id}>
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
                        No activity recorded for this owner yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions Sidebar */}
      <div className="w-64 flex-shrink-0 border-l pl-6 sticky top-0 self-start max-h-[calc(100vh-5rem)] overflow-y-auto">
        <OwnerDetailQuickActions />
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
              Select a process to start for this owner prospect. It will appear under In Progress.
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
                    prospectProcesses.inProgress.some(p => p.name === processType.name) ||
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

      {/* New Task Modal */}
      <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Title</Label>
              <Input
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Property</Label>
              <Select
                value={newTask.property}
                onValueChange={(value) => setNewTask({ ...newTask, property: value, unit: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property..." />
                </SelectTrigger>
                <SelectContent>
                  {ownerProperties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.name}>
                      {prop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Unit Selection - Conditional */}
            {newTask.property && (
              <div className="space-y-2">
                <Label>Unit</Label>
                {propertyUnits[newTask.property]?.length > 0 ? (
                  <Select
                    value={newTask.unit}
                    onValueChange={(value) => setNewTask({ ...newTask, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyUnits[newTask.property].map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : ownerProperties.find((p) => p.name === newTask.property)?.units === 1 ? (
                  <Input value="Unit 1 (Single Unit Property)" disabled className="bg-muted" />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No units associated with this property</p>
                )}
              </div>
            )}
            {/* Assign To and Due Date - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assign To - Left */}
              <div className="space-y-2">
                <Label>
                  Assign To <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newTask.assignTo}
                  onValueChange={(value) => setNewTask({ ...newTask, assignTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStaffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 bg-primary/15 text-primary border border-primary/30">
                            <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
                              {staff.name.split(" ").map(n => n[0]).join("")}
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
              {/* Due Date - Right */}
              <div className="space-y-2">
                <Label>
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            {/* Priority - Full Width */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter task description..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowNewTaskModal(false)}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Property Modal */}
      <Dialog open={showNewPropertyModal} onOpenChange={setShowNewPropertyModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-primary" />
              New Property
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* LLC Assignment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">LLC Assignment</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Assign to LLC <span className="text-destructive">*</span></Label>
                    <Select value={newPropertyLlc} onValueChange={(val) => { if (val === "__create_new__") { setShowCreateLlcInline(true); setNewPropertyLlc("") } else { setShowCreateLlcInline(false); setNewPropertyLlc(val) } }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an LLC..." />
                      </SelectTrigger>
                      <SelectContent>
                        {llcs.map((llc) => (
                          <SelectItem key={llc.id} value={llc.id}>{llc.name}</SelectItem>
                        ))}
                        <SelectItem value="__create_new__">+ Create New LLC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {showCreateLlcInline && (
                    <div className="flex items-end gap-2 p-3 rounded-lg bg-teal-50 border border-teal-200">
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm">New LLC Name <span className="text-destructive">*</span></Label>
                        <Input
                          value={newLlcName}
                          onChange={(e) => setNewLlcName(e.target.value)}
                          placeholder="Enter LLC name..."
                        />
                      </div>
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                        disabled={!newLlcName.trim()}
                        onClick={() => {
                          const newId = `llc-${Date.now()}`
                          setLlcs((prev) => [...prev, { id: newId, name: newLlcName.trim() }])
                          setNewPropertyLlc(newId)
                          setNewLlcName("")
                          setShowCreateLlcInline(false)
                        }}
                      >
                        Create
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => { setShowCreateLlcInline(false); setNewLlcName("") }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Name and Address */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Property Name and Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Type <span className="text-destructive">*</span></Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="multi-family">Multi-Family</SelectItem>
                        <SelectItem value="single-family">Single Family</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Property Name</Label>
                    <Input placeholder="Enter property name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address <span className="text-destructive">*</span></Label>
                  <Input placeholder="Address 1" />
                </div>
                <div className="space-y-2">
                  <Input placeholder="Address 2" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label>Zip</Label>
                    <Input placeholder="Zip" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input placeholder="Country" />
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Property Information</h3>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter property description..." className="min-h-[80px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tax Authority</Label>
                    <Input placeholder="Begin typing to search" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year Built</Label>
                    <Input placeholder="Year Built" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Site Manager</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">Mr.</SelectItem>
                        <SelectItem value="mrs">Mrs.</SelectItem>
                        <SelectItem value="ms">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="invisible">First Name</Label>
                    <Input placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="invisible">Last Name</Label>
                    <Input placeholder="Last Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="Phone Number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Management Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amenities..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pool">Pool</SelectItem>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="laundry">Laundry</SelectItem>
                      <SelectItem value="ac">Air Conditioning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="link" className="px-0 h-auto text-primary text-sm">
                    Manage Amenity Tags
                  </Button>
                </div>
              </div>

              {/* Rental Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Rental Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>NSF Fee</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">$</span>
                      <Input className="rounded-l-none" placeholder="0.00" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lease Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Lease Settings</h3>
                <div className="space-y-2">
                  <Label>Select a Default Lease Generation Method <span className="text-destructive">*</span></Label>
                  <RadioGroup defaultValue="appfolio">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="appfolio" id="appfolio" />
                      <Label htmlFor="appfolio" className="font-normal">AppFolio Lease Templates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="font-normal">PDF Form Templates</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-4 pl-4 border-l-2 border-muted">
                  <h4 className="font-medium text-sm">Default New Lease Templates</h4>
                  <div className="space-y-2">
                    <Label>Lease Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Lease</SelectItem>
                        <SelectItem value="month-to-month">Month-to-Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Addenda Template(s)</Label>
                    <Input placeholder="Click to add addenda" />
                  </div>
                  <div className="space-y-2">
                    <Label>Lease Attachment(s)</Label>
                    <Input placeholder="Click to add attachments" />
                  </div>
                </div>
              </div>

              {/* Management Fees */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Management Fees</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Jan" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                            <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="2026" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2024, 2025, 2026, 2027].map((y) => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Fee Type <span className="text-destructive">*</span></Label>
                    <RadioGroup defaultValue="percent" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flat" id="fee-flat" />
                        <Label htmlFor="fee-flat" className="font-normal">Flat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="fee-percent" />
                        <Label htmlFor="fee-percent" className="font-normal">Percent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="waive-fees" />
                  <Label htmlFor="waive-fees" className="font-normal">Waive Fees when Vacant</Label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Management Fee Percent <span className="text-destructive">*</span></Label>
                    <div className="flex">
                      <Input placeholder="0.0" />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Management Fee <span className="text-destructive">*</span></Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">$</span>
                      <Input className="rounded-l-none" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Management Fee</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">$</span>
                      <Input className="rounded-l-none" placeholder="0.00" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Fees */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Additional Fees</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">Lease Fee <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
                    <RadioGroup defaultValue="percent" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flat" id="lease-flat" />
                        <Label htmlFor="lease-flat" className="font-normal">Flat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="lease-percent" />
                        <Label htmlFor="lease-percent" className="font-normal">Percent</Label>
                      </div>
                    </RadioGroup>
                    <div className="flex w-48">
                      <Input placeholder="0.0" />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">Renewal Fee <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
                    <RadioGroup defaultValue="percent" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flat" id="renewal-flat" />
                        <Label htmlFor="renewal-flat" className="font-normal">Flat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="renewal-percent" />
                        <Label htmlFor="renewal-percent" className="font-normal">Percent</Label>
                      </div>
                    </RadioGroup>
                    <div className="flex w-48">
                      <Input placeholder="0.0" />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Late Fee Policy Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground border-b pb-2 flex-1">Late Fee Policy Details</h3>
                  <Button variant="link" className="text-primary text-sm">Policy walk through</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Late Fee Type <span className="text-destructive">*</span></Label>
                    <RadioGroup defaultValue="flat" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flat" id="late-flat" />
                        <Label htmlFor="late-flat" className="font-normal">Flat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percent" id="late-percent" />
                        <Label htmlFor="late-percent" className="font-normal">Percent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Base Late Fee <span className="text-destructive">*</span></Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">$</span>
                      <Input className="rounded-l-none" placeholder="0.00" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Eligible Charges <span className="text-destructive">*</span></Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Every charge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="every">Every charge</SelectItem>
                        <SelectItem value="rent">Rent only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grace Period <span className="text-destructive">*</span></Label>
                    <div className="flex items-center gap-2">
                      <RadioGroup defaultValue="after" className="flex gap-2">
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="after" id="grace-after" />
                          <Label htmlFor="grace-after" className="font-normal">After</Label>
                        </div>
                      </RadioGroup>
                      <Input className="w-16" placeholder="4" />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Maintenance Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maintenance Limit</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">$</span>
                      <Input className="rounded-l-none" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Expiration</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="home-warranty" />
                    <Label htmlFor="home-warranty" className="font-normal">Is it covered by home warranty?</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="unit-entry" />
                    <Label htmlFor="unit-entry" className="font-normal flex items-center gap-1">Unit Entry Pre-authorized? <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Notes</Label>
                  <Textarea placeholder="Enter maintenance notes..." className="min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">Online Maintenance Request Instructions <HelpCircle className="h-3 w-3 text-muted-foreground" /></Label>
                  <Textarea placeholder="e.g. In case of water leaks, do not file a maintenance request, call (888) 555-1955." className="min-h-[80px]" />
                </div>
              </div>

              {/* Property Groups */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Property Groups</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property groups..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="downtown">Downtown Properties</SelectItem>
                    <SelectItem value="suburban">Suburban Properties</SelectItem>
                    <SelectItem value="commercial">Commercial Properties</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Another Property Group
                </Button>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Bank Accounts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cash GL Account <span className="text-destructive">*</span></Label>
                    <div className="text-sm text-muted-foreground">1100: Cash in Bank</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Account <span className="text-destructive">*</span></Label>
                    <div className="text-sm text-muted-foreground mb-1">Operating Cash Account</div>
                    <Input placeholder="Start typing to search" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">1160: Escrow Cash</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground mb-1">Escrow Account</div>
                    <Input placeholder="Start typing to search" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Another Bank Account
                </Button>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground border-b pb-2 flex-1">Photos</h3>
                  <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                  Drag files here to upload.
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground border-b pb-2 flex-1 flex items-center gap-1">Notes <HelpCircle className="h-3 w-3 text-muted-foreground" /></h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Download Notes</Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Plus className="h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b pb-2">Attachments</h3>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-muted-foreground">Drag Files Here</span>
                    <span className="text-muted-foreground">or</span>
                    <Button variant="outline" size="sm">Choose Files to Add</Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setShowNewPropertyModal(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowNewPropertyModal(false)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Process Sheet */}
      <Sheet open={showProcessPanel} onOpenChange={setShowProcessPanel}>
        <SheetContent className="w-[500px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              {editingProcess ? "Edit Process" : "Create Process"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="process-name">Process Name <span className="text-destructive">*</span></Label>
              <Input 
                id="process-name" 
                placeholder="Enter process name..."
                defaultValue={editingProcess?.name || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prospecting-stage">Prospecting Stage <span className="text-destructive">*</span></Label>
              <Select defaultValue={editingProcess?.prospectingStage || ""}>
                <SelectTrigger id="prospecting-stage">
                  <SelectValue placeholder="Select prospecting stage..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Lead">New Lead</SelectItem>
                  <SelectItem value="Attempting to Contact">Attempting to Contact</SelectItem>
                  <SelectItem value="Collecting Information">Collecting Information</SelectItem>
                  <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                  <SelectItem value="Contract Signed">Contract Signed</SelectItem>
                  <SelectItem value="Onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="process-status">Process Status <span className="text-destructive">*</span></Label>
              <Select defaultValue={editingProcess?.status || "Upcoming"}>
                <SelectTrigger id="process-status">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input 
                id="start-date" 
                type="date"
                defaultValue={editingProcess?.startedOn ? new Date(editingProcess.startedOn).toISOString().split('T')[0] : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="process-description">Description (Optional)</Label>
              <Textarea 
                id="process-description" 
                placeholder="Enter process description..."
                className="min-h-[100px]"
                defaultValue={editingProcess?.description || ""}
              />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseProcessPanel}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleCloseProcessPanel}>
              {editingProcess ? "Save Changes" : "Create Process"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Property Info Popup Modal */}
      <Dialog open={showPropertyPopup} onOpenChange={setShowPropertyPopup}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-teal-600" />
              {selectedProperty?.name || "Property Details"}
            </DialogTitle>
            <DialogDescription>
              View and update property information
            </DialogDescription>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-6 py-4">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Property Name</Label>
                    <p className="font-medium">{selectedProperty.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge className={selectedProperty.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                      {selectedProperty.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    <p className="font-medium">{selectedProperty.address}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Property Type</Label>
                    <p className="font-medium">{selectedProperty.type}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Units</Label>
                    <p className="font-medium">{selectedProperty.units}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Monthly Rent</Label>
                    <p className="font-medium text-teal-600">${selectedProperty.monthlyRent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Property Details Section - Editable Fields */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Property Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Year Built</Label>
                    <Input 
                      value={propertyFormData.yearBuilt} 
                      onChange={(e) => setPropertyFormData({...propertyFormData, yearBuilt: e.target.value})}
                      placeholder="Enter year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Square Footage</Label>
                    <Input 
                      value={propertyFormData.sqft}
                      onChange={(e) => setPropertyFormData({...propertyFormData, sqft: e.target.value})}
                      placeholder="Enter sq ft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Lot Size</Label>
                    <Input 
                      value={propertyFormData.lotSize}
                      onChange={(e) => setPropertyFormData({...propertyFormData, lotSize: e.target.value})}
                      placeholder="Enter lot size"
                      className={!propertyFormData.lotSize ? "border-amber-300 bg-amber-50/50" : ""}
                    />
                    {!propertyFormData.lotSize && <span className="text-[10px] text-amber-600">Missing</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Bedrooms</Label>
                    <Input 
                      value={propertyFormData.bedrooms}
                      onChange={(e) => setPropertyFormData({...propertyFormData, bedrooms: e.target.value})}
                      placeholder="Enter bedrooms"
                      className={!propertyFormData.bedrooms ? "border-amber-300 bg-amber-50/50" : ""}
                    />
                    {!propertyFormData.bedrooms && <span className="text-[10px] text-amber-600">Missing</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Bathrooms</Label>
                    <Input 
                      value={propertyFormData.bathrooms}
                      onChange={(e) => setPropertyFormData({...propertyFormData, bathrooms: e.target.value})}
                      placeholder="Enter bathrooms"
                      className={!propertyFormData.bathrooms ? "border-amber-300 bg-amber-50/50" : ""}
                    />
                    {!propertyFormData.bathrooms && <span className="text-[10px] text-amber-600">Missing</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Parking Spaces</Label>
                    <Input 
                      value={propertyFormData.parkingSpaces}
                      onChange={(e) => setPropertyFormData({...propertyFormData, parkingSpaces: e.target.value})}
                      placeholder="Enter parking"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities & Policies Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Amenities & Policies</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">HOA Fees</Label>
                    <Input 
                      value={propertyFormData.hoa}
                      onChange={(e) => setPropertyFormData({...propertyFormData, hoa: e.target.value})}
                      placeholder="Enter HOA fees"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Pet Policy</Label>
                    <Select 
                      value={propertyFormData.petPolicy} 
                      onValueChange={(value) => setPropertyFormData({...propertyFormData, petPolicy: value})}
                    >
                      <SelectTrigger className={!propertyFormData.petPolicy ? "border-amber-300 bg-amber-50/50" : ""}>
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Allowed">Allowed</SelectItem>
                        <SelectItem value="Small pets only">Small pets only</SelectItem>
                        <SelectItem value="No pets">No pets</SelectItem>
                        <SelectItem value="Case by case">Case by case</SelectItem>
                      </SelectContent>
                    </Select>
                    {!propertyFormData.petPolicy && <span className="text-[10px] text-amber-600">Missing</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Laundry</Label>
                    <Select 
                      value={propertyFormData.laundry}
                      onValueChange={(value) => setPropertyFormData({...propertyFormData, laundry: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In-unit">In-unit</SelectItem>
                        <SelectItem value="Common area">Common area</SelectItem>
                        <SelectItem value="Hookups only">Hookups only</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2">
                <Label className="text-xs">Notes</Label>
                <Textarea 
                  value={propertyFormData.notes}
                  onChange={(e) => setPropertyFormData({...propertyFormData, notes: e.target.value})}
                  placeholder="Add any additional notes about the property..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => setShowPropertyPopup(false)}
              className="bg-transparent"
            >
              Close
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  // Generate PMA logic - would send to owner's email
                  // In a real app, this would generate and email the PMA
                  setShowPropertyPopup(false)
                }}
                className="bg-transparent border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate PMA
              </Button>
              <Button 
                onClick={() => {
                  setShowPropertyPopup(false)
                  onNavigateToProperty?.(selectedProperty?.name || "")
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate PMA Modal - Property-Level Selection */}
      <Dialog open={showPmaModal} onOpenChange={setShowPmaModal}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Generate Property Management Agreement
            </DialogTitle>
            <DialogDescription>
              Select specific properties to include in the PMA for <span className="font-semibold">{lead?.name}</span>. You can select individual properties or entire ownership entities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[400px] overflow-y-auto">
            {(() => {
              const ownershipOrder: Array<"LLC" | "Partnership" | "Personal"> = ["LLC", "Partnership", "Personal"]
              const pmaGrouped: Record<string, { entityName: string; entityId: string; properties: typeof ownerProperties }[]> = {}

              for (const prop of ownerProperties) {
                const matchedLlc = llcs.find(l => l.id === prop.llcId)
                const oType = matchedLlc ? matchedLlc.ownershipType : "Personal"
                const entityName = matchedLlc ? matchedLlc.name : "Unassigned Ownership"
                const entityId = matchedLlc ? matchedLlc.id : "unassigned"
                if (!pmaGrouped[oType]) pmaGrouped[oType] = []
                const existing = pmaGrouped[oType].find(e => e.entityId === entityId)
                if (existing) existing.properties.push(prop)
                else pmaGrouped[oType].push({ entityName, entityId, properties: [prop] })
              }

              const getPmaOwnershipIcon = (type: string) => {
                switch (type) {
                  case "LLC": return <Landmark className="h-3.5 w-3.5 text-blue-600" />
                  case "Partnership": return <Handshake className="h-3.5 w-3.5 text-violet-600" />
                  default: return <User className="h-3.5 w-3.5 text-amber-600" />
                }
              }

              const getPmaColor = (type: string) => {
                switch (type) {
                  case "LLC": return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", entityBg: "bg-blue-50/50", entityBorder: "border-blue-100" }
                  case "Partnership": return { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", entityBg: "bg-violet-50/50", entityBorder: "border-violet-100" }
                  default: return { bg: "bg-amber-50", border: "border-amber-200", text: "text-green-800", entityBg: "bg-amber-50/50", entityBorder: "border-amber-100" }
                }
              }

              const toggleEntitySelection = (entityProps: typeof ownerProperties) => {
                const entityPropIds = entityProps.map(p => p.id)
                const allSelected = entityPropIds.every(id => pmaSelectedProperties.has(id))
                setPmaSelectedProperties(prev => {
                  const next = new Set(prev)
                  if (allSelected) {
                    entityPropIds.forEach(id => next.delete(id))
                  } else {
                    entityPropIds.forEach(id => next.add(id))
                  }
                  return next
                })
              }

              const togglePropertySelection = (propId: string) => {
                setPmaSelectedProperties(prev => {
                  const next = new Set(prev)
                  if (next.has(propId)) next.delete(propId)
                  else next.add(propId)
                  return next
                })
              }

              return (
                <div className="space-y-3">
                  {ownershipOrder.map((oType) => {
                    if (!pmaGrouped[oType]) return null
                    const colors = getPmaColor(oType)
                    return (
                      <div key={oType} className={`rounded-lg border ${colors.border} overflow-hidden`}>
                        <div className={`flex items-center gap-2 px-3 py-2 ${colors.bg}`}>
                          {getPmaOwnershipIcon(oType)}
                          <span className={`text-xs font-semibold ${colors.text}`}>{oType === "Personal" ? "Personal / Unassigned" : oType}</span>
                        </div>
                        <div className="divide-y divide-border/40">
                          {pmaGrouped[oType].map((entity) => {
                            const entityPropIds = entity.properties.map(p => p.id)
                            const allSelected = entityPropIds.every(id => pmaSelectedProperties.has(id))
                            const someSelected = entityPropIds.some(id => pmaSelectedProperties.has(id))

                            return (
                              <div key={entity.entityId}>
                                {/* Entity header with select-all checkbox */}
                                <div className={`flex items-center gap-2.5 px-3 py-2 ${colors.entityBg} border-t ${colors.entityBorder}`}>
                                  <Checkbox
                                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                    onCheckedChange={() => toggleEntitySelection(entity.properties)}
                                    className="h-4 w-4"
                                  />
                                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-sm font-medium text-foreground">{entity.entityName}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {entity.properties.length} {entity.properties.length === 1 ? "property" : "properties"}
                                  </span>
                                </div>
                                {/* Individual property checkboxes */}
                                <div className="px-3 py-1.5 space-y-0.5 bg-background">
                                  {entity.properties.map((property) => (
                                    <label
                                      key={property.id}
                                      className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                      <Checkbox
                                        checked={pmaSelectedProperties.has(property.id)}
                                        onCheckedChange={() => togglePropertySelection(property.id)}
                                        className="h-4 w-4"
                                      />
                                      <Home className="h-4 w-4 text-teal-600 shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{property.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{property.address}</p>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                                        <span>{property.units} {property.units === 1 ? "Unit" : "Units"}</span>
                                        <span className="font-medium text-foreground">${property.monthlyRent.toLocaleString()}/mo</span>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* Selection summary */}
          {pmaSelectedProperties.size > 0 && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-teal-50 border border-teal-200 text-sm">
              <Check className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="text-teal-800">
                <span className="font-semibold">{pmaSelectedProperties.size}</span> {pmaSelectedProperties.size === 1 ? "property" : "properties"} selected
                {" "}&middot;{" "}
                <span className="font-semibold">
                  ${ownerProperties.filter(p => pmaSelectedProperties.has(p.id)).reduce((sum, p) => sum + p.monthlyRent, 0).toLocaleString()}
                </span>/mo total rent
              </span>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPmaModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              disabled={pmaSelectedProperties.size === 0}
              onClick={() => {
                setShowPmaModal(false)
              }}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate PMA ({pmaSelectedProperties.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={showUploadDocModal} onOpenChange={setShowUploadDocModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-teal-600" />
              Upload Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Document Upload Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Document Upload <span className="text-destructive">*</span>
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-teal-500 bg-teal-50"
                    : newDocUpload.file
                      ? "border-teal-500 bg-teal-50/50"
                      : "border-border hover:border-teal-400 hover:bg-muted/50"
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
                    setNewDocUpload({ ...newDocUpload, file })
                  }
                }}
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      setNewDocUpload({ ...newDocUpload, file })
                    }
                  }
                  input.click()
                }}
              >
                {newDocUpload.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 text-teal-600" />
                    <p className="text-sm font-medium text-foreground">{newDocUpload.file.name}</p>
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

            {/* Document Type and Assign To - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assign To (Optional) - Left */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Assign To <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Select
                  value={newDocUpload.assignTo}
                  onValueChange={(value) => setNewDocUpload({ ...newDocUpload, assignTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStaffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5 bg-primary/15 text-primary border border-primary/30">
                            <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
                              {staff.name.split(" ").map(n => n[0]).join("")}
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
                  value={newDocUpload.type}
                  onValueChange={(value) => setNewDocUpload({ ...newDocUpload, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((docType) => (
                      <SelectItem key={docType.value} value={docType.value}>
                        <div className="flex items-center gap-2">
                          <span>{docType.label}</span>
                          {docType.linkedField && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <Link2 className="h-3 w-3" />
                              Linked
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newDocUpload.type && DOCUMENT_TYPES.find(t => t.value === newDocUpload.type)?.linkedField && (
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <HelpCircle className="h-3 w-3" />
                    This document is linked to a required owner field
                  </p>
                )}
              </div>
            </div>

            {/* Comments (Optional) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Comments <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Textarea
                placeholder="Add notes or context for this document..."
                value={newDocUpload.comments}
                onChange={(e) => setNewDocUpload({ ...newDocUpload, comments: e.target.value })}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowUploadDocModal(false)
                setNewDocUpload({ file: null, type: "", comments: "", assignTo: "" })
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700" 
              onClick={() => {
                setShowUploadDocModal(false)
                setNewDocUpload({ file: null, type: "", comments: "", assignTo: "" })
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Modal for Editing/Viewing */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Task details would go here, similar to New Task Modal */}
            <p>Task details will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskModal(false)}>
              Close
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
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
              const isFromOwner = item.user === lead?.name
              
              return (
                <div key={item.id} className="space-y-2">
                  {/* SMS Item */}
                  {isSMS && (
                    <div className={`flex ${isFromOwner ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isFromOwner
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
                    <div className={`flex ${isFromOwner ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[90%] rounded-lg border ${
                          isFromOwner
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
                            {item.emailThread?.[0]?.subject || "No Subject"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            From: {item.user} • {item.timestamp}
                          </p>
                        </div>
                        
                        {/* Email Body - Expanded */}
                        {expandedEmails.includes(`thread-${item.id}`) && item.emailThread && (
                          <div className="border-t border-blue-200 p-3 space-y-3">
                            {item.emailThread.map((email, idx) => (
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
                                
                                {/* Attachments placeholder */}
                                {idx === 0 && (
                                  <div className="mt-2 pt-2 border-t border-blue-100">
                                    <div className="flex items-center gap-2">
                                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        Attachments: Property_Proposal.pdf (245 KB)
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
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

            {/* SMS Reply UI (unchanged) */}
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
    </div>
  )
}

export default OwnerDetailPage
