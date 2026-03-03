"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Zap,
  Clock,
  Users,
  Building2,
  Mail,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowLeft,
  MessageSquare,
  FileText,
  Bold,
  Underline,
  Link,
  ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  Paperclip,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface AutomationsPageProps {
  onNewAutomation?: () => void
}

interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  status: "active" | "paused" | "draft"
  lastRun?: string
  runCount: number
  category?: "communications" | "leasing" | "maintenance" | "payments" | "general"
}

type SequenceItem = {
  id: string
  type: "email" | "sms" | "task"
  title: string
  subject?: string
  content: string
  timing: string
}

// Declare AutomationSequenceItem here to resolve the undeclared variable error.
// Assuming AutomationSequenceItem is a type alias for SequenceItem.
type AutomationSequenceItem = SequenceItem

interface AutomationDetail extends Automation {
  leadSource?: string
  campaignGroup?: string
  assignedStaff?: string[]
  smsOptIn?: boolean
  smsPermission?: boolean
  sequence?: AutomationSequenceItem[]
}

// Leads > Owners automations
const leadsOwnersAutomations: AutomationDetail[] = [
  {
    id: "lo1",
    name: "New Lead Welcome Email",
    description: "Send welcome email when a new owner lead is created",
    trigger: "New Lead Created",
    status: "active",
    lastRun: "2 hours ago",
    runCount: 234,
    leadSource: "Website",
    campaignGroup: "New Lead Campaigns",
    assignedStaff: ["Sarah Johnson", "Mike Davis"],
    smsOptIn: true,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Good News! - You Have A New Prospect!",
        subject: "Good News! - You Have A New Prospect!",
        content:
          "Please call your new prospect asap. We will be emailing and texting them shortly on your behalf as well.",
      },
      {
        id: "s2",
        type: "email",
        timing: "5 Minutes",
        title: "New Lead F/U Email #1, Day 1",
        subject: "RE: Saving {contact.firstName} Money on Property Management",
        content:
          "Hey {contact.firstName}, we're following up about your request for property management services from {Lead.source}.\n\nI want to reach out to say hello and let you know that we are getting to work for you!\n\nWe have helped a lot of property owners in {agency.state} already with their management needs.\n\nWe work with the best vendors, and we have competitive rates while ALSO having the strongest service (most companies can't do that). This way you {agency.email} can relax and we can take it from here.\n\nDo you prefer text, email or a phone call to get started?\n\nLooking forward to helping you have a more secure investment.",
      },
      {
        id: "s3",
        type: "sms",
        timing: "10 Minutes",
        title: "New Lead F/U SMS #1, Day 1",
        content:
          "Hey {contact.name}, {agent.name} here, following up for your request for property management. To help with the proposal, what is your zip code?",
      },
      {
        id: "s4",
        type: "email",
        timing: "1 Day",
        title: "New Lead F/U Email #2, Day 2",
        subject: "{contact.name} - Let's Connect",
        content:
          "Hi {contact.firstName},\n\nI wanted to follow up on my previous email. Have you had a chance to think about your property management needs?\n\nI'd love to schedule a quick call to discuss how we can help you maximize your investment returns.\n\nBest regards,\n{agent.name}",
      },
    ],
  },
  {
    id: "lo2",
    name: "Follow-up Reminder",
    description: "Send reminder to agent if no contact in 48 hours",
    trigger: "No Activity (48h)",
    status: "active",
    lastRun: "1 day ago",
    runCount: 156,
    leadSource: "Referral",
    campaignGroup: "Follow-up Campaigns",
    assignedStaff: ["John Smith"],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Reminder: Follow up with lead",
        subject: "Action Required: Lead needs follow-up",
        content:
          "Hi {agent.name},\n\nThis is a reminder that {contact.name} has not been contacted in 48 hours. Please reach out to them soon.\n\nLead Details:\nName: {contact.name}\nPhone: {contact.phone}\nEmail: {contact.email}",
      },
    ],
  },
  {
    id: "lo3",
    name: "Lead Qualification Alert",
    description: "Notify manager when lead is qualified",
    trigger: "Stage Changed to Qualified",
    status: "active",
    lastRun: "5 hours ago",
    runCount: 89,
    leadSource: "All Sources",
    campaignGroup: "Qualification Alerts",
    assignedStaff: ["Emily Brown", "Richard Surovi"],
    smsOptIn: true,
    smsPermission: true,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Lead Qualified Notification",
        subject: "New Qualified Lead: {contact.name}",
        content:
          "A lead has been qualified and is ready for the next step.\n\nLead: {contact.name}\nProperty Interest: {property.type}\nQualified by: {agent.name}",
      },
      {
        id: "s2",
        type: "task",
        timing: "Immediately",
        title: "Schedule intro call with qualified lead",
        content: "Create task for manager to schedule intro call with {contact.name}",
      },
    ],
  },
  {
    id: "lo4",
    name: "Lost Lead Survey",
    description: "Send feedback survey when lead is marked as lost",
    trigger: "Stage Changed to Lost",
    status: "paused",
    lastRun: "1 week ago",
    runCount: 45,
    leadSource: "All Sources",
    campaignGroup: "Feedback Campaigns",
    assignedStaff: [],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "1 Day",
        title: "Feedback Survey",
        subject: "We'd love your feedback",
        content:
          "Hi {contact.firstName},\n\nWe noticed you decided not to move forward with us. We'd appreciate if you could take a moment to share your feedback so we can improve.\n\n[Survey Link]\n\nThank you for considering us.",
      },
    ],
  },
]

// Leads > Leasing Prospects automations
const leadsProspectsAutomations: AutomationDetail[] = [
  {
    id: "lp1",
    name: "Guest Card Confirmation",
    description: "Send confirmation when guest card is submitted",
    trigger: "Guest Card Created",
    status: "active",
    lastRun: "30 minutes ago",
    runCount: 567,
    leadSource: "Website",
    campaignGroup: "Leasing Campaigns",
    assignedStaff: ["Lisa Chen"],
    smsOptIn: true,
    smsPermission: true,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Thank you for your interest!",
        subject: "Thank you for your interest in {property.name}",
        content:
          "Hi {contact.firstName},\n\nThank you for submitting your guest card for {property.name}. A leasing agent will be in touch with you shortly to schedule a showing.\n\nProperty Details:\nAddress: {property.address}\nBedrooms: {unit.bedrooms}\nRent: {unit.rent}/month",
      },
      {
        id: "s2",
        type: "sms",
        timing: "5 Minutes",
        title: "Quick follow-up SMS",
        content:
          "Hi {contact.firstName}! Thanks for your interest in {property.name}. When would be a good time for a showing? - {agent.name}",
      },
    ],
  },
  {
    id: "lp2",
    name: "Showing Reminder",
    description: "Send reminder 24 hours before scheduled showing",
    trigger: "24h Before Showing",
    status: "active",
    lastRun: "3 hours ago",
    runCount: 432,
    leadSource: "All Sources",
    campaignGroup: "Showing Reminders",
    assignedStaff: ["Sarah Johnson", "Mike Davis"],
    smsOptIn: true,
    smsPermission: true,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "24 Hours Before",
        title: "Showing Reminder",
        subject: "Reminder: Your showing tomorrow at {property.name}",
        content:
          "Hi {contact.firstName},\n\nThis is a friendly reminder about your scheduled showing tomorrow.\n\nDetails:\nProperty: {property.name}\nAddress: {property.address}\nDate: {showing.date}\nTime: {showing.time}\n\nSee you there!",
      },
      {
        id: "s2",
        type: "sms",
        timing: "24 Hours Before",
        title: "SMS Reminder",
        content:
          "Reminder: Your showing at {property.name} is tomorrow at {showing.time}. See you there! - {agent.name}",
      },
    ],
  },
  {
    id: "lp3",
    name: "Application Follow-up",
    description: "Follow up if application not completed in 72 hours",
    trigger: "Application Incomplete (72h)",
    status: "active",
    lastRun: "1 day ago",
    runCount: 123,
    leadSource: "All Sources",
    campaignGroup: "Application Follow-ups",
    assignedStaff: ["Emily Brown"],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "72 Hours",
        title: "Complete your application",
        subject: "Your application for {property.name} is waiting",
        content:
          "Hi {contact.firstName},\n\nWe noticed you started an application for {property.name} but haven't completed it yet.\n\nDon't miss out on this great property! Complete your application today.\n\n[Continue Application]",
      },
    ],
  },
  {
    id: "lp4",
    name: "No-Show Notification",
    description: "Notify leasing agent when prospect doesn't show",
    trigger: "Showing Missed",
    status: "draft",
    runCount: 0,
    leadSource: "All Sources",
    campaignGroup: "No-Show Alerts",
    assignedStaff: [],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Prospect No-Show Alert",
        subject: "No-Show: {contact.name} missed showing",
        content:
          "Hi {agent.name},\n\n{contact.name} did not show up for their scheduled showing at {property.name}.\n\nYou may want to follow up with them to reschedule.",
      },
    ],
  },
]

// Contacts > Owners automations
const contactsOwnersAutomations: AutomationDetail[] = [
  {
    id: "co1",
    name: "Monthly Statement",
    description: "Send monthly owner statement automatically",
    trigger: "1st of Month",
    status: "active",
    lastRun: "5 days ago",
    runCount: 1240,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "1st of Month",
        title: "Monthly Statement",
        subject: "Your Monthly Statement for {property.name}",
        content:
          "Dear {owner.name},\n\nPlease find attached your monthly statement for {property.name}.\n\nSummary:\nRent Collected: {statement.rentCollected}\nExpenses: {statement.expenses}\nNet Income: {statement.netIncome}\n\nThank you for choosing us.",
      },
    ],
  },
  {
    id: "co2",
    name: "Maintenance Update",
    description: "Notify owner when maintenance work is completed",
    trigger: "Work Order Completed",
    status: "active",
    lastRun: "4 hours ago",
    runCount: 356,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Maintenance Completed",
        subject: "Maintenance completed at {property.name}",
        content:
          "Dear {owner.name},\n\nThe maintenance work at {property.name} has been completed.\n\nWork Order: {workOrder.id}\nDescription: {workOrder.description}\nCost: {workOrder.cost}\n\nPlease let us know if you have any questions.",
      },
    ],
  },
  {
    id: "co3",
    name: "Lease Renewal Notice",
    description: "Send notice 90 days before lease renewal date",
    trigger: "90 Days Before Renewal",
    status: "active",
    lastRun: "2 days ago",
    runCount: 78,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "90 Days Before",
        title: "Lease Renewal Notice",
        subject: "Upcoming Lease Renewal at {property.name}",
        content:
          "Dear {owner.name},\n\nThe lease at {property.name} is due for renewal in 90 days.\n\nCurrent Tenant: {tenant.name}\nLease End Date: {lease.endDate}\n\nPlease let us know if you'd like to proceed with the renewal.",
      },
    ],
  },
  {
    id: "co4",
    name: "Vacancy Alert",
    description: "Alert owner when unit becomes vacant",
    trigger: "Unit Vacated",
    status: "paused",
    lastRun: "2 weeks ago",
    runCount: 34,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Vacancy Alert",
        subject: "Unit Vacated at {property.name}",
        content:
          "Dear {owner.name},\n\nThe unit at {property.name} is now vacant.\n\nWe will begin marketing the property immediately to find a new tenant.",
      },
    ],
  },
]

// Contacts > Tenants automations
const contactsTenantsAutomations: AutomationDetail[] = [
  {
    id: "ct1",
    name: "Welcome Email - New Tenant",
    description: "Send welcome email when a new tenant signs a lease",
    trigger: "Lease Signed",
    status: "active",
    lastRun: "2 hours ago",
    runCount: 156,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Welcome to Your New Home!",
        subject: "Welcome to {property.name}!",
        content:
          "Dear {tenant.name},\n\nWelcome to your new home at {property.name}!\n\nYour move-in date is: {lease.startDate}\n\nPlease find attached important information about your new home.",
      },
    ],
  },
  {
    id: "ct2",
    name: "Rent Reminder - 5 Days Before",
    description: "Send reminder email 5 days before rent is due",
    trigger: "Scheduled (Monthly)",
    status: "active",
    lastRun: "1 day ago",
    runCount: 2340,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "5 Days Before Due",
        title: "Rent Reminder",
        subject: "Rent Due Reminder - {property.name}",
        content:
          "Hi {tenant.firstName},\n\nThis is a friendly reminder that your rent of {rent.amount} is due on {rent.dueDate}.\n\nPay online: {payment.link}",
      },
    ],
  },
  {
    id: "ct3",
    name: "Late Payment Notice",
    description: "Send late payment notice after grace period",
    trigger: "Payment Overdue",
    status: "active",
    lastRun: "3 days ago",
    runCount: 178,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "After Grace Period",
        title: "Late Payment Notice",
        subject: "Late Payment Notice - {property.name}",
        content:
          "Dear {tenant.name},\n\nYour rent payment is past due. Please submit payment immediately to avoid late fees.\n\nAmount Due: {rent.amount}\nLate Fee: {rent.lateFee}",
      },
    ],
  },
  {
    id: "ct4",
    name: "Lease Renewal Reminder",
    description: "Notify tenants 90 days before lease expiration",
    trigger: "90 Days Before Lease End",
    status: "paused",
    lastRun: "1 week ago",
    runCount: 45,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "90 Days Before",
        title: "Lease Renewal Opportunity",
        subject: "Your Lease Renewal at {property.name}",
        content:
          "Dear {tenant.name},\n\nYour lease at {property.name} will expire in 90 days.\n\nWe'd love to have you stay! Please let us know if you'd like to renew.",
      },
    ],
  },
  {
    id: "ct5",
    name: "Move-Out Instructions",
    description: "Send move-out checklist when notice is submitted",
    trigger: "Move-Out Notice Submitted",
    status: "active",
    lastRun: "4 days ago",
    runCount: 67,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Move-Out Instructions",
        subject: "Move-Out Instructions for {property.name}",
        content:
          "Dear {tenant.name},\n\nWe've received your move-out notice. Here's what you need to know:\n\n1. Final walkthrough date: {moveout.date}\n2. Keys return location: {office.address}\n3. Cleaning checklist attached\n\nThank you for being a great tenant!",
      },
    ],
  },
]

function SequenceItemEditForm({
  item,
  onSave,
  onCancel,
}: {
  item: SequenceItem
  onSave: (updatedItem: SequenceItem) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)
  const [subject, setSubject] = useState(item.subject || "")
  const [assignOwner, setAssignOwner] = useState("Follow Relationship Routing Rules")
  const [taskCategory, setTaskCategory] = useState("")
  const [minutes, setMinutes] = useState(item.timing.split(" ")[0] || "0")
  const [hours, setHours] = useState(item.timing.split(" ")[1] || "0")
  const [days, setDays] = useState(item.timing.split(" ")[2] || "0")
  const [months, setMonths] = useState(item.timing.split(" ")[3] || "0")

  const generateTimingLabel = () => {
    const min = Number.parseInt(minutes) || 0
    const hr = Number.parseInt(hours) || 0
    const d = Number.parseInt(days) || 0
    const mo = Number.parseInt(months) || 0

    if (min === 0 && hr === 0 && d === 0 && mo === 0) {
      return "Immediately"
    }

    const parts = []
    if (mo > 0) parts.push(`${mo} Month${mo > 1 ? "s" : ""}`)
    if (d > 0) parts.push(`${d} Day${d > 1 ? "s" : ""}`)
    if (hr > 0) parts.push(`${hr} Hour${hr > 1 ? "s" : ""}`)
    if (min > 0) parts.push(`${min} Min`)

    return parts.join(" ")
  }

  const handleSave = () => {
    onSave({
      ...item,
      title,
      content,
      subject: subject || undefined,
      timing: generateTimingLabel(),
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Title */}
      <div className="p-4 border-b border-gray-100">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white" />
      </div>

      {/* Content Editor */}
      <div className="p-4 border-b border-gray-100">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Content</Label>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Underline className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Select defaultValue="sans-serif">
              <SelectTrigger className="h-7 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans-Se</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Mono</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="14">
              <SelectTrigger className="h-7 w-14 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7 bg-yellow-200">
              <span className="font-bold text-sm">A</span>
            </Button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Link className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ImageIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
          {/* Content area */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-0 rounded-none min-h-[100px] resize-none focus-visible:ring-0"
            placeholder="Enter content..."
          />
        </div>
      </div>

      {/* Timing Controls - Full width stretched layout */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 w-full">
          {/* Send after label */}
          <span className="text-sm text-gray-600 whitespace-nowrap">Send at</span>

          {/* Minutes dropdown */}
          <Select value={minutes} onValueChange={setMinutes}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 10, 15, 30, 45].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm whitespace-nowrap text-[rgba(18,18,18,1)]">min</span>

          {/* Hours dropdown */}
          <Select value={hours} onValueChange={setHours}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 4, 8, 12, 24].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">hr</span>

          {/* Days dropdown */}
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 7, 14, 30].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">days</span>

          {/* Months dropdown */}
          <Select value={months} onValueChange={setMonths}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 6, 12].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">month</span>

          {/* Between label */}
          <span className="text-sm text-gray-600 whitespace-nowrap ml-2">Between</span>

          {/* Start time dropdown */}
          <Select defaultValue="08:00 AM">
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-600 whitespace-nowrap">and</span>

          {/* End time dropdown */}
          <Select defaultValue="05:00 PM">
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assign Owner & Task Category */}
      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Assign Owner</Label>
            <Select value={assignOwner} onValueChange={setAssignOwner}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Follow Relationship Routing Rules">Follow Relationship Routing Rules</SelectItem>
                <SelectItem value="Assigned Staff">Assigned Staff</SelectItem>
                <SelectItem value="Round Robin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Task Category</Label>
            <Select value={taskCategory} onValueChange={setTaskCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Task Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="admin">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">Attachments</span>
          <Paperclip className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Footer Actions - removed Merge Field Options button */}
      <div className="flex items-center justify-end gap-2 p-4 bg-gray-50">
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
          Save
        </Button>
        <Button variant="ghost" onClick={onCancel} className="text-[rgba(255,255,255,1)] bg-[rgba(235,16,16,0.29)]">
          Cancel
        </Button>
      </div>
    </div>
  )
}

function AutomationDetailView({
  automation,
  onBack,
}: {
  automation: AutomationDetail
  onBack: () => void
}) {
  const [isActive, setIsActive] = useState(automation.status === "active")
  const [sequenceItems, setSequenceItems] = useState<SequenceItem[]>(automation.sequence || [])
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [assignedStaff, setAssignedStaff] = useState(automation.assignedStaff?.[0] || "Sarah Johnson")
  const [staffSearch, setStaffSearch] = useState("")
  const [showStaffDropdown, setShowStaffDropdown] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(automation.smsOptIn || false)
  const newItemRef = useRef<HTMLDivElement>(null)
  const [newItemId, setNewItemId] = useState<string | null>(null)

  const allStaff = ["Sarah Johnson", "Mike Davis", "Emily Brown", "John Smith", "Lisa Chen"]
  const filteredStaff = allStaff.filter((staff) => staff.toLowerCase().includes(staffSearch.toLowerCase()))

  const handleSaveSequenceItem = (updatedItem: SequenceItem) => {
    setSequenceItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItemId(null)
  }

  const handleAddStep = () => {
    const newId = `s${sequenceItems.length + 1}-${Date.now()}`
    const newItem: SequenceItem = {
      id: newId,
      type: "email",
      timing: "",
      title: "",
      subject: "",
      content: "",
    }
    setSequenceItems((prev) => [...prev, newItem])
    setEditingItemId(newId)
    setNewItemId(newId)
  }

  useEffect(() => {
    if (newItemId && newItemRef.current) {
      newItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      setNewItemId(null)
    }
  }, [newItemId, sequenceItems])

  return (
    <div className="p-6 space-y-4 bg-gray-50">
      {/* Header - more compact */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">{automation.name}</h1>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3">
              <Edit className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Turn Campaign On/Off</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-500" />
          </div>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-6">
            {/* Trigger Type */}
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trigger Type</Label>
              <Select defaultValue={automation.trigger}>
                <SelectTrigger className="mt-1.5 bg-white h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={automation.trigger}>{automation.trigger}</SelectItem>
                  <SelectItem value="New Lead Created">New Lead Created</SelectItem>
                  <SelectItem value="Stage Changed">Stage Changed</SelectItem>
                  <SelectItem value="No Activity">No Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned Staff - Single with search */}
            <div className="flex-1 min-w-[200px] relative">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Staff</Label>
              <div className="relative mt-1.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={staffSearch || assignedStaff}
                    onChange={(e) => {
                      setStaffSearch(e.target.value)
                      setShowStaffDropdown(true)
                    }}
                    onFocus={() => setShowStaffDropdown(true)}
                    className="pl-8 h-9 bg-white"
                  />
                </div>
                {showStaffDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredStaff.map((staff) => (
                      <div
                        key={staff}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                          staff === assignedStaff ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => {
                          setAssignedStaff(staff)
                          setStaffSearch("")
                          setShowStaffDropdown(false)
                        }}
                      >
                        {staff}
                      </div>
                    ))}
                    {filteredStaff.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-400">No staff found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Group */}
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Campaign Group</Label>
              <Select defaultValue={automation.campaignGroup || "Default"}>
                <SelectTrigger className="mt-1.5 bg-white h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Lead Campaigns">New Lead Campaigns</SelectItem>
                  <SelectItem value="Follow-up Campaigns">Follow-up Campaigns</SelectItem>
                  <SelectItem value="Leasing Campaigns">Leasing Campaigns</SelectItem>
                  <SelectItem value="Default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SMS Toggle */}
            <div className="flex flex-col items-start min-w-[160px]">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">SMS Campaign</Label>
              <div className="flex items-center gap-2 mt-2.5">
                <Switch
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <span className="text-sm text-gray-600">{smsEnabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email/SMS/Task Details Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-900 text-sm">Email/SMS/Task Details</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:text-gray-900 bg-[rgba(1,96,209,1)] text-[rgba(255,255,255,1)]"
              onClick={handleAddStep}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Step
            </Button>
          </div>

          {/* Timeline */}
          <div className="p-5">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[52px] top-4 bottom-4 w-px bg-gray-200" />

              <div className="space-y-4">
                {sequenceItems.map((item, index) => (
                  <div key={item.id} className="flex gap-4" ref={item.id === newItemId ? newItemRef : null}>
                    {/* Timing label */}
                    <div className="w-20 text-right pt-3 flex-shrink-0">
                      <span className={`text-xs font-medium ${item.timing ? "text-gray-500" : "text-gray-300 italic"}`}>
                        {item.timing || "Set timing"}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex-shrink-0 pt-3">
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                          item.type === "email" ? "bg-amber-400" : item.type === "sms" ? "bg-blue-400" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {editingItemId === item.id ? (
                      <div className="flex-1">
                        <SequenceItemEditForm
                          item={item}
                          onSave={handleSaveSequenceItem}
                          onCancel={() => setEditingItemId(null)}
                        />
                      </div>
                    ) : (
                      /* Content card */
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {item.type === "email" ? (
                                <Mail className="h-3.5 w-3.5 text-amber-500" />
                              ) : item.type === "sms" ? (
                                <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-gray-500" />
                              )}
                              <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                            </div>
                            {item.subject && <p className="text-xs text-gray-500 mb-2">Subject: {item.subject}</p>}
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{item.content}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-gray-600"
                              onClick={() => setEditingItemId(item.id)}
                            >
                              <Edit className="h-3.5 w-3.5 text-[rgba(1,96,209,1)]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500">
                              <Trash2 className="h-3.5 w-3.5 text-[rgba(247,7,7,1)]" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AutomationTable({
  automations,
  searchQuery,
  onViewAutomation,
}: {
  automations: AutomationDetail[]
  searchQuery: string
  onViewAutomation: (automation: AutomationDetail) => void
}) {
  const filteredAutomations = automations.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-100 bg-gray-50/50">
          <TableHead className="text-gray-600 font-medium pl-6">Automation Name</TableHead>
          <TableHead className="text-gray-600 font-medium">Trigger</TableHead>
          <TableHead className="text-gray-600 font-medium">Last Run</TableHead>
          <TableHead className="text-gray-600 font-medium">Runs</TableHead>
          <TableHead className="text-gray-600 font-medium">Status</TableHead>
          <TableHead className="text-gray-600 font-medium text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAutomations.map((automation) => (
          <TableRow key={automation.id} className="border-b border-gray-50 hover:bg-gray-50/50">
            <TableCell className="pl-6">
              <div>
                <p className="font-medium text-gray-900">{automation.name}</p>
                <p className="text-sm text-gray-500">{automation.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Zap className="h-3.5 w-3.5" />
                <span className="text-sm">{automation.trigger}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm">{automation.lastRun || "Never"}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">{automation.runCount.toLocaleString()}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch checked={automation.status === "active"} className="data-[state=checked]:bg-gray-900" />
                <Badge
                  variant="outline"
                  className={
                    automation.status === "active"
                      ? "bg-gray-100 text-gray-700 border-gray-300"
                      : automation.status === "paused"
                        ? "bg-gray-100 text-gray-500 border-gray-200"
                        : "bg-white text-gray-400 border-gray-200"
                  }
                >
                  {automation.status}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-right pr-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewAutomation(automation)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {filteredAutomations.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No automations found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default function AutomationsPage({ onNewAutomation }: AutomationsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"leads" | "contacts">("leads")
  const [showNewAutomationDialog, setShowNewAutomationDialog] = useState(false)
  const [automationDialogActiveTab, setAutomationDialogActiveTab] = useState("basics")
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationDetail | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    leadsOwners: true,
    leadsProspects: true,
    contactsOwners: true,
    contactsTenants: true,
  })
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    category: "",
    trigger: "",
    // Targets
    propertyTypes: [] as string[],
    userTypes: [] as string[],
    userJourney: [] as string[],
    tags: [] as string[],
    timezone: "America/New_York",
    // Content
    subject: "",
    messageContent: "",
    // Attachments
    attachments: [] as string[],
    // Schedule
    frequency: "once",
    scheduleTime: "",
    scheduleDay: "",
    startDate: "",
    endDate: "",
  })

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item)
    }
    return [...array, item]
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCreateAutomation = () => {
    console.log("Creating automation:", newAutomation)
    setShowNewAutomationDialog(false)
    setNewAutomation({
      name: "",
      description: "",
      category: "",
      trigger: "",
      propertyTypes: [],
      userTypes: [],
      userJourney: [],
      tags: [],
      timezone: "America/New_York",
      subject: "",
      messageContent: "",
      attachments: [],
      frequency: "once",
      scheduleTime: "",
      scheduleDay: "",
      startDate: "",
      endDate: "",
    })
    setAutomationDialogActiveTab("basics")
  }

  if (selectedAutomation) {
    return <AutomationDetailView automation={selectedAutomation} onBack={() => setSelectedAutomation(null)} />
  }

  return (
    <div className="p-8 space-y-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-500 mt-1">Automate repetitive tasks and workflows</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={() => setShowNewAutomationDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Automation
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search automations..."
          className="pl-10 bg-white border-gray-200 focus-visible:ring-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-1 pb-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "leads"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="h-4 w-4" />
          Leads
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-1 pb-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "contacts"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Contacts
        </button>
      </div>

      {/* Leads Tab Content */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          {/* Owners Section */}
          <Collapsible open={expandedSections.leadsOwners} onOpenChange={() => toggleSection("leadsOwners")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Owners</h3>
                      <p className="text-sm text-gray-500">Automations for owner leads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{leadsOwnersAutomations.length} automations</span>
                    {expandedSections.leadsOwners ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={leadsOwnersAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={setSelectedAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Leasing Prospects Section */}
          <Collapsible open={expandedSections.leadsProspects} onOpenChange={() => toggleSection("leadsProspects")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Leasing Prospects</h3>
                      <p className="text-sm text-gray-500">Automations for leasing prospects</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{leadsProspectsAutomations.length} automations</span>
                    {expandedSections.leadsProspects ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={leadsProspectsAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={setSelectedAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      )}

      {/* Contacts Tab Content */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          {/* Owners Section */}
          <Collapsible open={expandedSections.contactsOwners} onOpenChange={() => toggleSection("contactsOwners")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Owners</h3>
                      <p className="text-sm text-gray-500">Automations for owner contacts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{contactsOwnersAutomations.length} automations</span>
                    {expandedSections.contactsOwners ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={contactsOwnersAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={setSelectedAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Tenants Section */}
          <Collapsible open={expandedSections.contactsTenants} onOpenChange={() => toggleSection("contactsTenants")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Tenants</h3>
                      <p className="text-sm text-gray-500">Automations for tenant contacts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{contactsTenantsAutomations.length} automations</span>
                    {expandedSections.contactsTenants ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={contactsTenantsAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={setSelectedAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      )}

      {/* New Automation Dialog */}
      <Dialog open={showNewAutomationDialog} onOpenChange={setShowNewAutomationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-bold">Create New Automation</DialogTitle>

          {/* Dialog tabs */}
          <div className="flex gap-1 border-b border-gray-200 mt-4">
            {["basics", "targets", "content", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setAutomationDialogActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                  automationDialogActiveTab === tab
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {/* Basics Tab */}
            {automationDialogActiveTab === "basics" && (
              <div className="space-y-4">
                <div>
                  <Label>Automation Name</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="e.g., Welcome Email Sequence"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    className="mt-1.5"
                    placeholder="Describe what this automation does..."
                    value={newAutomation.description}
                    onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newAutomation.category}
                      onValueChange={(value) => setNewAutomation({ ...newAutomation, category: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communications">Communications</SelectItem>
                        <SelectItem value="leasing">Leasing</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Trigger</Label>
                    <Select
                      value={newAutomation.trigger}
                      onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_lead">New Lead Created</SelectItem>
                        <SelectItem value="stage_change">Stage Changed</SelectItem>
                        <SelectItem value="lease_signed">Lease Signed</SelectItem>
                        <SelectItem value="payment_received">Payment Received</SelectItem>
                        <SelectItem value="work_order">Work Order Created</SelectItem>
                        <SelectItem value="scheduled">Scheduled Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Targets Tab */}
            {automationDialogActiveTab === "targets" && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Property Types</Label>
                  <p className="text-sm text-gray-500 mb-3">Select which property types this automation applies to</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Single Family", "Multi-Family", "Commercial", "Condo", "Townhouse", "Apartment"].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={type}
                          checked={newAutomation.propertyTypes.includes(type)}
                          onCheckedChange={() =>
                            setNewAutomation({
                              ...newAutomation,
                              propertyTypes: toggleArrayItem(newAutomation.propertyTypes, type),
                            })
                          }
                        />
                        <Label htmlFor={type} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold">User Types</Label>
                  <p className="text-sm text-gray-500 mb-3">Select which user types will receive this automation</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Owners", "Tenants", "Prospects", "Vendors", "Staff"].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={type}
                          checked={newAutomation.userTypes.includes(type)}
                          onCheckedChange={() =>
                            setNewAutomation({
                              ...newAutomation,
                              userTypes: toggleArrayItem(newAutomation.userTypes, type),
                            })
                          }
                        />
                        <Label htmlFor={type} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={newAutomation.timezone}
                    onValueChange={(value) => setNewAutomation({ ...newAutomation, timezone: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {automationDialogActiveTab === "content" && (
              <div className="space-y-4">
                <div>
                  <Label>Subject Line</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="Email subject..."
                    value={newAutomation.subject}
                    onChange={(e) => setNewAutomation({ ...newAutomation, subject: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available variables: {"{contact.firstName}"}, {"{property.name}"}, {"{company.name}"}
                  </p>
                </div>
                <div>
                  <Label>Message Content</Label>
                  <Textarea
                    className="mt-1.5 min-h-[200px]"
                    placeholder="Write your message here..."
                    value={newAutomation.messageContent}
                    onChange={(e) => setNewAutomation({ ...newAutomation, messageContent: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Attachments</Label>
                  <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {automationDialogActiveTab === "schedule" && (
              <div className="space-y-4">
                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={newAutomation.frequency}
                    onValueChange={(value) => setNewAutomation({ ...newAutomation, frequency: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once (on trigger)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={newAutomation.startDate}
                      onChange={(e) => setNewAutomation({ ...newAutomation, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={newAutomation.endDate}
                      onChange={(e) => setNewAutomation({ ...newAutomation, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Send Time</Label>
                  <Input
                    type="time"
                    className="mt-1.5"
                    value={newAutomation.scheduleTime}
                    onChange={(e) => setNewAutomation({ ...newAutomation, scheduleTime: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowNewAutomationDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleCreateAutomation}>
              Create Automation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
