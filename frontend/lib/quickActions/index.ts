/**
 * Shared quick action definitions for the global QuickActions system.
 * Pages register these via useQuickActions() so the right sidebar shows
 * one static panel while only the center content scrolls.
 */
import type { QuickActionGroup, QuickActionItem } from "@/components/quick-action/QuickActionSidebar"
import {
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  Calendar,
  ListChecks,
  CheckSquare,
  Building2,
  Settings,
  Send,
  FileText,
  UserPlus,
  Users,
  ArrowLeftRight,
  TrendingUp,
  Wrench,
  EyeOff,
  SearchCheck,
  Layers,
  Building,
  Globe,
  Download,
  Receipt,
  DollarSign,
  AlertTriangle,
  Shield,
  Lock,
  Printer,
  FolderPlus,
  Link2,
  BookOpen,
  BarChart3,
  FileSpreadsheet,
  Clipboard,
  CalendarCheck,
  CalendarPlus,
  Home,
  Landmark,
  Key,
  Wallet,
  CalendarDays,
  FileWarning,
  ClipboardList,
} from "lucide-react"

// ----- Dashboard -----
export const dashboardQuickActions: QuickActionGroup[] = [
  {
    id: "dashboard-main",
    actions: [
      { icon: Building2, label: "New Property" },
      { icon: UserPlus, label: "Move In Tenant" },
      { icon: Receipt, label: "Enter Bill" },
      { icon: Key, label: "New Owner" },
      { icon: Users, label: "New Vendor" },
      { icon: TrendingUp, label: "Rent Increase" },
      { icon: AlertTriangle, label: "Delinquency Report" },
      { icon: FileText, label: "Tenant Ledger" },
      { icon: DollarSign, label: "Income Statement" },
      { icon: Home, label: "Unit Vacancy Detail" },
      { icon: ClipboardList, label: "Rent Roll" },
      { icon: Wallet, label: "Cash Flow" },
      { icon: CalendarDays, label: "Lease Expiration" },
      { icon: FileWarning, label: "3-Day Notices" },
      { icon: Layers, label: "Property Groups" },
      { icon: Shield, label: "Auditing Center" },
    ],
  },
]

// ----- Owner contact (detail page) -----
export function getOwnerContactQuickActions(handlers: {
  onAddNote?: () => void
}): QuickActionGroup[] {
  const actions: QuickActionItem[] = [
    { icon: Mail, label: "Send Email" },
    { icon: MessageSquare, label: "Send SMS" },
    { icon: Phone, label: "Log Call" },
    {
      icon: StickyNote,
      label: "Add Note",
      onClick: () => handlers.onAddNote?.(),
    },
    { icon: Calendar, label: "Schedule Meeting" },
    { icon: ListChecks, label: "Initiate the New Process" },
    { icon: CheckSquare, label: "New Task" },
    { icon: Building2, label: "New Property" },
    { icon: Building2, label: "Owner ACH Setup" },
    { icon: Settings, label: "Owner Portal Activation" },
    { icon: Mail, label: "Send Owner Packets" },
    { icon: FileText, label: "New Management" },
    { icon: Send, label: "Send Form to Owner" },
    { icon: FileText, label: "Owner Statement" },
  ]
  return [{ id: "owner-contact", actions }]
}

// ----- Tenant contact (detail page) - Tasks, Reports, Letters -----
const tenantContactTasks = [
  { icon: ArrowLeftRight, label: "Transfer Tenant" },
  { icon: FileText, label: "Send Lease or Addendum" },
  { icon: FileText, label: "NYC Lease Renewal" },
  { icon: TrendingUp, label: "Increase Rent" },
  { icon: Wrench, label: "New Service Request" },
  { icon: Wrench, label: "Work Orders" },
  { icon: Receipt, label: "Tenant Payable" },
  { icon: UserPlus, label: "Add Additional Tenant" },
  { icon: EyeOff, label: "Hide Tenant" },
  { icon: SearchCheck, label: "New Inspection" },
  { icon: SearchCheck, label: "View Inspections" },
  { icon: Layers, label: "View Unit Turn Board" },
  { icon: Building, label: "Manage Subsidy Programs" },
  { icon: Mail, label: "Email Unit" },
  { icon: MessageSquare, label: "Text Unit" },
  { icon: Globe, label: "View Online Portal" },
  { icon: Download, label: "Download Text History" },
  { icon: Send, label: "Send Resident Form to Unit" },
]
const tenantContactReports = [
  { icon: FileText, label: "Tenant Ledger" },
  { icon: DollarSign, label: "Tenant Unpaid Charges" },
  { icon: BarChart3, label: "Work Order Activities Summary" },
  { icon: AlertTriangle, label: "Debt Collections Status" },
  { icon: Shield, label: "Tenant Insurance Coverage" },
]
const tenantContactLetters = [
  { icon: FileText, label: "3-Day Notice" },
  { icon: Printer, label: "Print Envelope" },
  { icon: Send, label: "Send Statement" },
]

export const tenantContactQuickActions: QuickActionGroup[] = [
  { id: "tasks", title: "Tasks", actions: tenantContactTasks.map((a) => ({ ...a })) },
  { id: "reports", title: "Reports", actions: tenantContactReports.map((a) => ({ ...a })) },
  { id: "letters", title: "Letters", actions: tenantContactLetters.map((a) => ({ ...a })) },
]

// ----- Property detail -----
const propertyTasks = [
  { icon: Building2, label: "New Property" },
  { icon: FolderPlus, label: "New Property Group" },
  { icon: Lock, label: "Manage Lockboxes" },
  { icon: Link2, label: "New Association" },
]
const propertyReports = [
  { icon: BookOpen, label: "Property Directory" },
  { icon: BarChart3, label: "Unit Directory" },
  { icon: FileSpreadsheet, label: "Rent Roll" },
  { icon: FileText, label: "Unit Vacancy Detail" },
  { icon: Clipboard, label: "General Ledger" },
]
const propertyStatements = [{ icon: Settings, label: "Bulk Update Statement Settings" }]

export const propertyDetailQuickActions: QuickActionGroup[] = [
  { id: "tasks", title: "Tasks", actions: propertyTasks },
  { id: "reports", title: "Reports", actions: propertyReports },
  { id: "statements", title: "Statements", actions: propertyStatements },
]

// ----- Lead / tenant application detail -----
export function getLeadQuickActions(handlers: {
  onSendEmail?: () => void
  onSendSMS?: () => void
  onLogCall?: () => void
  onAddNote?: () => void
  onScheduleMeeting?: () => void
  onReassign?: () => void
}): QuickActionGroup[] {
  const actions: QuickActionItem[] = [
    { icon: Mail, label: "Send Email", onClick: handlers.onSendEmail ? () => handlers.onSendEmail!() : undefined },
    { icon: MessageSquare, label: "Send SMS", onClick: handlers.onSendSMS ? () => handlers.onSendSMS!() : undefined },
    { icon: Phone, label: "Log Call", onClick: handlers.onLogCall ? () => handlers.onLogCall!() : undefined },
    { icon: StickyNote, label: "Add Note", onClick: handlers.onAddNote ? () => handlers.onAddNote!() : undefined },
    {
      icon: Calendar,
      label: "Schedule Meeting",
      onClick: handlers.onScheduleMeeting ? () => handlers.onScheduleMeeting!() : undefined,
    },
    { icon: Users, label: "Reassign Lead", onClick: handlers.onReassign ? () => handlers.onReassign!() : undefined },
  ]
  return [{ id: "lead", actions }]
}

// ----- Calendar -----
export function getCalendarQuickActions(handlers: {
  onSetAvailability?: () => void
  onAddPersonalCalendar?: () => void
}): QuickActionGroup[] {
  const actions: QuickActionItem[] = [
    {
      icon: CalendarCheck,
      label: "Set showing availability",
      onClick: handlers.onSetAvailability ? () => handlers.onSetAvailability!() : undefined,
    },
    {
      icon: CalendarPlus,
      label: "Add Personal calendar",
      onClick: handlers.onAddPersonalCalendar ? () => handlers.onAddPersonalCalendar!() : undefined,
    },
  ]
  return [{ id: "calendar", actions }]
}

// ----- Contacts list (owners tab) -----
export const contactsOwnersQuickActions: QuickActionGroup[] = [
  {
    id: "owners",
    title: "Quick Actions",
    actions: [
      { icon: Users, label: "New Owner" },
      { icon: Landmark, label: "Owner ACH Setup" },
      { icon: Settings, label: "Owner Portal Activation" },
      { icon: Mail, label: "Send Owner Packets" },
      { icon: FileText, label: "New Management Agreement" },
      { icon: FileText, label: "Management Agreements" },
      { icon: Send, label: "Send Form to Owner" },
      { icon: Settings, label: "Owner Portal Bulk Settings" },
    ],
  },
  {
    id: "letters",
    title: "Letters",
    actions: [
      { icon: FileText, label: "Owner Statement (Enhanced)" },
      { icon: FileText, label: "Owner Statement" },
    ],
  },
]

// ----- Contacts list (tenants tab) -----
export const contactsTenantsQuickActions: QuickActionGroup[] = [
  {
    id: "tasks",
    title: "Tasks",
    actions: [
      { icon: Home, label: "Move In Tenant" },
      { icon: Users, label: "New Owner" },
      { icon: UserPlus, label: "New Vendor" },
      { icon: Mail, label: "Email All Tenants" },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    actions: [
      { icon: BarChart3, label: "Rent Roll" },
      { icon: FileText, label: "Tenant Ledger" },
      { icon: Shield, label: "Tenant Insurance Coverage" },
    ],
  },
]
