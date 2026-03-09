"use client"

import { Textarea } from "@/components/ui/textarea"

import { AlertDialogAction } from "@/components/ui/alert-dialog"

import { AlertDialogCancel } from "@/components/ui/alert-dialog"

import { AlertDialogFooter } from "@/components/ui/alert-dialog"

import { AlertDialogDescription } from "@/components/ui/alert-dialog"

import { AlertDialogTitle } from "@/components/ui/alert-dialog"

import { AlertDialogHeader } from "@/components/ui/alert-dialog"

import { AlertDialogContent } from "@/components/ui/alert-dialog"

import { AlertDialog } from "@/components/ui/alert-dialog"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, GripVertical, Pencil, Check, X, Trash2, ChevronDown, ChevronRight, FolderOpen, AlertTriangle, ArrowLeft, Flag, Mail, Phone, MessageSquare, CheckSquare, Video, Settings, Clock, User, Users, Asterisk, Hand, Search, Eye, Link2, Zap, FileText, Download, Play, Timer, Network, Bold, Italic, Underline, Code, List, ListOrdered, MoreVertical, AtSign, Building2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for portfolios and users
const portfolios = [
  { id: "1", name: "CSR - Legna Portfolio" },
  { id: "2", name: "CSR - Jason Portfolio" },
  { id: "3", name: "CSR - Matthew Portfolio" },
  { id: "4", name: "CSR - Zoey Portfolio" },
  { id: "5", name: "CSR - Megan Portfolio" },
]

const users = [
  { id: "1", name: "Legna Lira", initials: "LL", color: "bg-primary" },
  { id: "2", name: "Jason Egerton", initials: "JE", color: "bg-chart-4" },
  {
    id: "3",
    name: "Matthew Trent",
    initials: "MT",
    color: "bg-muted-foreground",
    avatar: "/matthew-professional-headshot.jpg",
  },
  { id: "4", name: "Zoey Tabb", initials: "ZT", color: "bg-muted-foreground", avatar: "/zoey-professional-woman-headshot.jpg" },
  { id: "5", name: "Megan Alston", initials: "MA", color: "bg-chart-5" },
  { id: "6", name: "Simon", initials: "S", color: "bg-muted-foreground", avatar: "/simon-professional-man-headshot.jpg" },
]

// Initial assignments data
const initialAssignments = [
  { portfolioId: "1", processOwner: "1", accountant: "6", acquisitionManager: "" },
  { portfolioId: "2", processOwner: "2", accountant: "6", acquisitionManager: "" },
  { portfolioId: "3", processOwner: "3", accountant: "6", acquisitionManager: "" },
  { portfolioId: "4", processOwner: "4", accountant: "6", acquisitionManager: "" },
  { portfolioId: "5", processOwner: "5", accountant: "6", acquisitionManager: "" },
]

function UserSelector({
  value,
  onChange,
  placeholder = "Select user",
  variant = "default",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  variant?: "default" | "primary" | "secondary"
}) {
  const selectedUser = users.find((u) => u.id === value)

  const getVariantStyles = () => {
    if (!selectedUser) return "bg-muted border-border"
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-foreground border-primary"
      case "secondary":
        return "bg-secondary border-border"
      default:
        return "bg-muted border-border"
    }
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`w-[180px] ${getVariantStyles()} ${selectedUser && variant === "primary" ? "text-white" : ""}`}
      >
        <SelectValue placeholder={placeholder}>
          {selectedUser && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {selectedUser.avatar ? (
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                ) : null}
                <AvatarFallback className={`${selectedUser.color} text-primary-foreground text-xs`}>
                  {selectedUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className={variant === "primary" && selectedUser ? "text-white" : ""}>{selectedUser.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {user.avatar ? <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} /> : null}
                <AvatarFallback className={`${user.color} text-primary-foreground text-xs`}>{user.initials}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function UserRolesAndAssignments() {
  const [assignments, setAssignments] = useState(initialAssignments)

  const updateAssignment = (portfolioId: string, field: string, value: string) => {
    setAssignments((prev) => prev.map((a) => (a.portfolioId === portfolioId ? { ...a, [field]: value } : a)))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Roles and Assignments</h1>
        <p className="text-muted-foreground mt-1">
          You can auto-assign users to these roles based on the{" "}
          <a href="#" className="text-primary hover:underline">
            Property Groups
          </a>{" "}
          that the property belongs to.
        </p>
      </div>

      <Button variant="ghost" className="text-primary hover:text-primary/90 hover:bg-primary/10 -ml-2">
        <Plus className="h-4 w-4 mr-2" />
        Add Auto-Assignment Rule
      </Button>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground w-[250px]"></th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Process Owner</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Accountant</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Acquisition Manager</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => {
                  const portfolio = portfolios.find((p) => p.id === assignment.portfolioId)
                  return (
                    <tr key={assignment.portfolioId} className="border-b last:border-b-0 hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <span className="font-medium">{portfolio?.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <UserSelector
                            value={assignment.processOwner}
                            onChange={(value) => updateAssignment(assignment.portfolioId, "processOwner", value)}
                            variant="primary"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <UserSelector
                            value={assignment.accountant}
                            onChange={(value) => updateAssignment(assignment.portfolioId, "accountant", value)}
                            variant="secondary"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <UserSelector
                            value={assignment.acquisitionManager}
                            onChange={(value) => updateAssignment(assignment.portfolioId, "acquisitionManager", value)}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StagesOwnersPage() {
  // Category-based structure with statuses - matches all 16 categories from Leads > Owners
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Acquisition Leads",
      statuses: [
        { id: "1-1", name: "New Lead", steps: 3, days: 2, processes: 2 },
        { id: "1-2", name: "Attempting to Contact", steps: 5, days: 5, processes: 3 },
        { id: "1-3", name: "Scheduled Intro Call", steps: 2, days: 3, processes: 1 },
        { id: "1-4", name: "Working", steps: 8, days: 14, processes: 4 },
        { id: "1-5", name: "Closing", steps: 6, days: 7, processes: 3 },
        { id: "1-6", name: "New Client", steps: 4, days: 5, processes: 2 },
        { id: "1-7", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "2",
      name: "Acquisition Owners",
      statuses: [
        { id: "2-1", name: "New Lead", steps: 3, days: 2, processes: 2 },
        { id: "2-2", name: "Initial Contact", steps: 4, days: 3, processes: 2 },
        { id: "2-3", name: "Property Evaluation", steps: 6, days: 7, processes: 3 },
        { id: "2-4", name: "Proposal Sent", steps: 3, days: 5, processes: 2 },
        { id: "2-5", name: "Negotiation", steps: 5, days: 10, processes: 3 },
        { id: "2-6", name: "Contract Signed", steps: 4, days: 3, processes: 2 },
        { id: "2-7", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "3",
      name: "Agents Referral",
      statuses: [
        { id: "3-1", name: "New Referral", steps: 2, days: 1, processes: 1 },
        { id: "3-2", name: "Contacted", steps: 3, days: 3, processes: 2 },
        { id: "3-3", name: "Qualifying", steps: 4, days: 5, processes: 2 },
        { id: "3-4", name: "Active", steps: 6, days: 14, processes: 3 },
        { id: "3-5", name: "Converted", steps: 3, days: 2, processes: 2 },
        { id: "3-6", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "4",
      name: "AppFolio Owner Contracts",
      statuses: [
        { id: "4-1", name: "Imported", steps: 2, days: 1, processes: 1 },
        { id: "4-2", name: "Under Review", steps: 5, days: 5, processes: 3 },
        { id: "4-3", name: "Active", steps: 3, days: 0, processes: 2 },
        { id: "4-4", name: "Renewal Pending", steps: 4, days: 30, processes: 2 },
        { id: "4-5", name: "Terminated", steps: 2, days: 1, processes: 1 },
      ],
    },
    {
      id: "5",
      name: "AppFolio Tenant Applicants",
      statuses: [
        { id: "5-1", name: "Application Received", steps: 2, days: 1, processes: 1 },
        { id: "5-2", name: "Screening", steps: 5, days: 3, processes: 3 },
        { id: "5-3", name: "Approved", steps: 3, days: 2, processes: 2 },
        { id: "5-4", name: "Denied", steps: 2, days: 1, processes: 1 },
        { id: "5-5", name: "Lease Signed", steps: 4, days: 3, processes: 2 },
      ],
    },
    {
      id: "6",
      name: "AppFolio Tenants",
      statuses: [
        { id: "6-1", name: "Active Tenant", steps: 2, days: 0, processes: 1 },
        { id: "6-2", name: "Notice Given", steps: 4, days: 30, processes: 2 },
        { id: "6-3", name: "Move-out Scheduled", steps: 6, days: 14, processes: 3 },
        { id: "6-4", name: "Past Tenant", steps: 3, days: 7, processes: 2 },
      ],
    },
    {
      id: "7",
      name: "AppFolio Vendors",
      statuses: [
        { id: "7-1", name: "New Vendor", steps: 3, days: 2, processes: 2 },
        { id: "7-2", name: "Verified", steps: 5, days: 5, processes: 3 },
        { id: "7-3", name: "Active", steps: 2, days: 0, processes: 1 },
        { id: "7-4", name: "Preferred", steps: 3, days: 0, processes: 2 },
        { id: "7-5", name: "Inactive", steps: 2, days: 1, processes: 1 },
      ],
    },
    {
      id: "8",
      name: "Global Investments Leads",
      statuses: [
        { id: "8-1", name: "New Inquiry", steps: 3, days: 2, processes: 2 },
        { id: "8-2", name: "Qualified", steps: 5, days: 7, processes: 3 },
        { id: "8-3", name: "Proposal Stage", steps: 6, days: 10, processes: 4 },
        { id: "8-4", name: "Due Diligence", steps: 8, days: 21, processes: 5 },
        { id: "8-5", name: "Closed", steps: 4, days: 5, processes: 3 },
        { id: "8-6", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "9",
      name: "New Owner Leads",
      statuses: [
        { id: "9-1", name: "New Lead", steps: 3, days: 2, processes: 2 },
        { id: "9-2", name: "Attempting to Contact", steps: 5, days: 5, processes: 3 },
        { id: "9-3", name: "Scheduled Intro Call", steps: 2, days: 3, processes: 1 },
        { id: "9-4", name: "Working", steps: 8, days: 14, processes: 4 },
        { id: "9-5", name: "Closing", steps: 6, days: 7, processes: 3 },
        { id: "9-6", name: "New Client", steps: 4, days: 5, processes: 2 },
        { id: "9-7", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "10",
      name: "New Tenant Leads",
      statuses: [
        { id: "10-1", name: "New Inquiry", steps: 2, days: 1, processes: 1 },
        { id: "10-2", name: "Tour Scheduled", steps: 3, days: 3, processes: 2 },
        { id: "10-3", name: "Application Pending", steps: 4, days: 5, processes: 2 },
        { id: "10-4", name: "Approved", steps: 3, days: 2, processes: 2 },
        { id: "10-5", name: "Lease Signed", steps: 4, days: 3, processes: 2 },
        { id: "10-6", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "11",
      name: "NEW TENANTS",
      statuses: [
        { id: "11-1", name: "Move-in Pending", steps: 5, days: 7, processes: 3 },
        { id: "11-2", name: "Onboarding", steps: 6, days: 14, processes: 4 },
        { id: "11-3", name: "Active", steps: 2, days: 0, processes: 1 },
        { id: "11-4", name: "Settled", steps: 3, days: 30, processes: 2 },
      ],
    },
    {
      id: "12",
      name: "NEW TENANTS LEADS",
      statuses: [
        { id: "12-1", name: "New Lead", steps: 2, days: 1, processes: 1 },
        { id: "12-2", name: "Contacted", steps: 4, days: 3, processes: 2 },
        { id: "12-3", name: "Showing Scheduled", steps: 3, days: 5, processes: 2 },
        { id: "12-4", name: "Application Sent", steps: 4, days: 3, processes: 2 },
        { id: "12-5", name: "Converted", steps: 3, days: 2, processes: 2 },
        { id: "12-6", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "13",
      name: "New Vendor Leads",
      statuses: [
        { id: "13-1", name: "New Lead", steps: 2, days: 1, processes: 1 },
        { id: "13-2", name: "Vetting", steps: 5, days: 7, processes: 3 },
        { id: "13-3", name: "Approved", steps: 3, days: 2, processes: 2 },
        { id: "13-4", name: "Active", steps: 2, days: 0, processes: 1 },
        { id: "13-5", name: "Rejected", steps: 2, days: 1, processes: 1 },
      ],
    },
    {
      id: "14",
      name: "PMC Leads",
      statuses: [
        { id: "14-1", name: "New Lead", steps: 3, days: 2, processes: 2 },
        { id: "14-2", name: "Initial Discussion", steps: 4, days: 5, processes: 2 },
        { id: "14-3", name: "Proposal Sent", steps: 5, days: 7, processes: 3 },
        { id: "14-4", name: "Negotiation", steps: 6, days: 14, processes: 4 },
        { id: "14-5", name: "Partnership Active", steps: 3, days: 0, processes: 2 },
        { id: "14-6", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "15",
      name: "Realty Buyer Leads",
      statuses: [
        { id: "15-1", name: "New Inquiry", steps: 2, days: 1, processes: 1 },
        { id: "15-2", name: "Pre-Qualified", steps: 4, days: 5, processes: 2 },
        { id: "15-3", name: "Property Search", steps: 6, days: 30, processes: 3 },
        { id: "15-4", name: "Offer Made", steps: 5, days: 7, processes: 3 },
        { id: "15-5", name: "Under Contract", steps: 8, days: 45, processes: 5 },
        { id: "15-6", name: "Closed", steps: 4, days: 3, processes: 2 },
        { id: "15-7", name: "Lost", steps: 1, days: 1, processes: 1 },
      ],
    },
    {
      id: "16",
      name: "Realty Seller Leads",
      statuses: [
        { id: "16-1", name: "New Lead", steps: 2, days: 1, processes: 1 },
        { id: "16-2", name: "Listing Consultation", steps: 4, days: 5, processes: 2 },
        { id: "16-3", name: "Listing Agreement Signed", steps: 5, days: 3, processes: 3 },
        { id: "16-4", name: "Active Listing", steps: 6, days: 60, processes: 4 },
        { id: "16-5", name: "Under Contract", steps: 8, days: 45, processes: 5 },
        { id: "16-6", name: "Sold", steps: 4, days: 3, processes: 2 },
        { id: "16-7", name: "Withdrawn", steps: 2, days: 1, processes: 1 },
      ],
    },
  ])

  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null)
  const [editingStatusName, setEditingStatusName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingStatusToCategoryId, setAddingStatusToCategoryId] = useState<string | null>(null)
  const [newStatusName, setNewStatusName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  
  // Stage Edit View state
  const [selectedStageForEdit, setSelectedStageForEdit] = useState<{
    categoryId: string
    categoryName: string
    status: { id: string; name: string; steps: number; days: number; processes: number }
  } | null>(null)

  // Dummy workflow steps for the stage edit view
  const [stageWorkflowSteps, setStageWorkflowSteps] = useState<
    { id: string; name: string; timing: string; day: number; completed: boolean; type: string; template?: string; assignee?: string; autoSend?: boolean; processName?: string }[]
  >([
    { id: "1", name: "Banking", timing: "immediately", day: 1, completed: true, type: "email", assignee: "Nina Patel", autoSend: true },
    { id: "2", name: "W-9", timing: "immediately", day: 1, completed: true, type: "text", autoSend: false },
    { id: "3", name: "Insurance", timing: "immediately", day: 1, completed: true, type: "call", assignee: "John Smith" },
    { id: "4", name: "Test banking info", timing: "immediately", day: 1, completed: true, type: "todo" },
    { id: "5", name: "Onboarding Meeting", timing: "1 day after previous step", day: 2, completed: false, type: "meet", assignee: "Sarah Johnson" },
    { id: "6", name: "Document Review", timing: "2 hours after previous step", day: 2, completed: false, type: "process", processName: "Document Verification" },
  ])
  
  // Available processes for linking
  const availableProcesses = [
    { id: "proc-1", name: "Document Verification" },
    { id: "proc-2", name: "Background Check" },
    { id: "proc-3", name: "Credit Review" },
    { id: "proc-4", name: "Tenant Onboarding" },
    { id: "proc-5", name: "Lease Signing" },
  ]

  // Sample staff members for assignment
  const staffMembers = [
    { id: "staff-1", name: "Nina Patel", role: "Admin" },
    { id: "staff-2", name: "John Smith", role: "Property Manager" },
    { id: "staff-3", name: "Sarah Johnson", role: "Leasing Agent" },
    { id: "staff-4", name: "Mike Davis", role: "Maintenance Supervisor" },
    { id: "staff-5", name: "Emily Chen", role: "Accountant" },
  ]

  // Template selection dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [templateDialogType, setTemplateDialogType] = useState<"email" | "text">("email")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [newTemplateName, setNewTemplateName] = useState("")
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)

  // Delay configuration state
  const [delayValue, setDelayValue] = useState(1)
  const [delayUnit, setDelayUnit] = useState<"minutes" | "hours" | "days">("minutes")
  const [delayReference, setDelayReference] = useState<"previous" | "stage-entry">("previous")

  // Simple action dialog (for Call, Todo, Meet, etc.)
  const [simpleActionDialogOpen, setSimpleActionDialogOpen] = useState(false)
  const [simpleActionType, setSimpleActionType] = useState<string>("")
  const [simpleActionName, setSimpleActionName] = useState("")

  // Staff assignment state
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")
  
  // Auto-send toggle for email/text
  const [autoSendEnabled, setAutoSendEnabled] = useState(false)
  
  // Process selection for Create Process
  const [selectedProcessForStep, setSelectedProcessForStep] = useState<string>("")
  
  // Linking dialog state
  const [linkingDialogOpen, setLinkingDialogOpen] = useState(false)
  const [linkingStepId, setLinkingStepId] = useState<string | null>(null)
  const [linkedSteps, setLinkedSteps] = useState<{ [stepId: string]: string[] }>({})
  const [selectedLinkedSteps, setSelectedLinkedSteps] = useState<string[]>([])
  
  // Custom fields for Todo tasks (Owner-related processes only)
  const [selectedTodoCustomFields, setSelectedTodoCustomFields] = useState<string[]>([])
  
  // Instructions dialog state
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false)
  const [instructionsStepId, setInstructionsStepId] = useState<string | null>(null)
  const [instructionsText, setInstructionsText] = useState("")
  const [stepInstructions, setStepInstructions] = useState<{ [stepId: string]: string }>({})
  
  // Step Conditions dialog state
  const [conditionsDialogOpen, setConditionsDialogOpen] = useState(false)
  const [conditionsStepId, setConditionsStepId] = useState<string | null>(null)
  const [displayConditionType, setDisplayConditionType] = useState<string>("any")
  const [stepConditions, setStepConditions] = useState<Array<{ field: string; operator: string; value: string }>>([
    { field: "", operator: "is", value: "" }
  ])
  const [savedStepConditions, setSavedStepConditions] = useState<{ [stepId: string]: { type: string; conditions: Array<{ field: string; operator: string; value: string }> } }>({})
  
  // Available condition fields (from Custom Fields)
  const conditionFields = [
    { value: "any_occupied_units", label: "Any Occupied Units", options: ["Yes", "No"] },
    { value: "any_vacant_unit", label: "Any Vacant Unit", options: ["Yes", "No"] },
    { value: "existing_tenant_moving_out", label: "Existing Tenant Moving Out?", options: ["Yes", "No"] },
    { value: "existing_owner_or_new", label: "Existing Owner or New Owner?", options: ["New Owner", "Existing Owner"] },
    { value: "any_information_missing", label: "Any Information Missing?", options: ["Yes", "No"] },
    { value: "property_condition_rating", label: "Property Condition Rating", options: ["Excellent", "Good", "Fair", "Poor"] },
  ]
  
  const conditionOperators = [
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "contains", label: "contains" },
    { value: "does_not_contain", label: "does not contain" },
  ]
  
  // Available field tags for instructions
  const availableFieldTags = [
    { tag: "process.no_of_units", label: "No of Units" },
    { tag: "process.any_occupied_units", label: "Any Occupied Units" },
    { tag: "process.any_vacant_unit", label: "Any Vacant Unit" },
    { tag: "process.owner_name", label: "Owner Name" },
    { tag: "process.property_address", label: "Property Address" },
    { tag: "process.existing_tenant_moving_out", label: "Existing Tenant Moving Out?" },
    { tag: "process.existing_owner_or_new", label: "Existing Owner or New Owner?" },
    { tag: "process.walkthrough_scheduled", label: "Walkthrough Scheduled?" },
    { tag: "process.any_information_missing", label: "Any Information Missing?" },
    { tag: "process.property_condition_rating", label: "Property Condition Rating" },
  ]
  
  const ownerCustomFields = [
    { id: "cf-1", label: "Existing Tenant Moving Out?", dataType: "Multiple Choice", processTypes: ["2 Property Onboarding Process"] },
    { id: "cf-2", label: "Existing Owner or New Owner?", dataType: "Multiple Choice", processTypes: ["2 Property Onboarding Process"] },
    { id: "cf-3", label: "Walkthrough Scheduled?", dataType: "Date", processTypes: ["2 Property Onboarding Process"] },
    { id: "cf-4", label: "Any Information Missing?", dataType: "Multiple Choice", processTypes: ["2 Property Onboarding Process", "Owner Onboarding Process"] },
    { id: "cf-5", label: "Property Condition Rating", dataType: "Multiple Choice", processTypes: ["Property Inspection Process"] },
    { id: "cf-6", label: "Additional Notes", dataType: "Text", processTypes: ["2 Property Onboarding Process", "Owner Onboarding Process"] },
    { id: "cf-7", label: "Preferred Contact Time", dataType: "Time", processTypes: ["Owner Onboarding Process"] },
  ]

  // Sample templates
  const emailTemplates = [
    { id: "email-1", name: "Welcome Email" },
    { id: "email-2", name: "Follow-up Email" },
    { id: "email-3", name: "Document Request" },
    { id: "email-4", name: "Meeting Confirmation" },
  ]

  const textTemplates = [
    { id: "text-1", name: "Appointment Reminder" },
    { id: "text-2", name: "Quick Check-in" },
    { id: "text-3", name: "Document Received" },
  ]

  // Reset delay and assignee to defaults
  const resetFormState = () => {
    setDelayValue(1)
    setDelayUnit("minutes")
    setDelayReference("previous")
    setSelectedAssignee("")
    setSelectedTodoCustomFields([])
  }

  // Get timing string from delay settings
  const getTimingString = () => {
    if (delayValue === 0) return "immediately"
    return `${delayValue} ${delayUnit} after ${delayReference === "previous" ? "previous step" : "stage entry"}`
  }

  // Add workflow step handlers
  const handleAddWorkflowStep = (type: string, name: string, template?: string, processName?: string) => {
    const newId = (Math.max(...stageWorkflowSteps.map((s) => Number.parseInt(s.id)), 0) + 1).toString()
    const timing = getTimingString()
    const assignee = selectedAssignee ? staffMembers.find((s) => s.id === selectedAssignee)?.name : undefined
    const shouldAutoSend = (type === "email" || type === "text") ? autoSendEnabled : undefined
    setStageWorkflowSteps((prev) => [
      ...prev,
      { id: newId, name, timing, day: 1, completed: false, type, template, assignee, autoSend: shouldAutoSend, processName },
    ])
  }

  const handleEmailClick = () => {
    setTemplateDialogType("email")
    setSelectedTemplate("")
    setIsCreatingTemplate(false)
    setNewTemplateName("")
    setAutoSendEnabled(false)
    resetFormState()
    setTemplateDialogOpen(true)
  }

  const handleTextMessageClick = () => {
    setTemplateDialogType("text")
    setSelectedTemplate("")
    setIsCreatingTemplate(false)
    setNewTemplateName("")
    setAutoSendEnabled(false)
    resetFormState()
    setTemplateDialogOpen(true)
  }

  const handleTemplateConfirm = () => {
    if (isCreatingTemplate && newTemplateName.trim()) {
      handleAddWorkflowStep(
        templateDialogType,
        `${templateDialogType === "email" ? "Email" : "Text"}: ${newTemplateName.trim()}`,
        newTemplateName.trim(),
      )
    } else if (selectedTemplate) {
      const templates = templateDialogType === "email" ? emailTemplates : textTemplates
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) {
        handleAddWorkflowStep(templateDialogType, `${templateDialogType === "email" ? "Email" : "Text"}: ${template.name}`, template.name)
      }
    }
    setTemplateDialogOpen(false)
  }

  const openSimpleActionDialog = (type: string, defaultName: string) => {
    setSimpleActionType(type)
    setSimpleActionName(defaultName)
    resetFormState()
    setSimpleActionDialogOpen(true)
  }

  const handleSimpleActionConfirm = () => {
    if (simpleActionName.trim()) {
      const processName = simpleActionType === "process" && selectedProcessForStep 
        ? availableProcesses.find(p => p.id === selectedProcessForStep)?.name 
        : undefined
      handleAddWorkflowStep(simpleActionType, simpleActionName.trim(), undefined, processName)
    }
    setSimpleActionDialogOpen(false)
  }
  
  // Linking handlers
  const openLinkingDialog = (stepId: string) => {
    setLinkingStepId(stepId)
    setSelectedLinkedSteps(linkedSteps[stepId] || [])
    setLinkingDialogOpen(true)
  }
  
  const handleLinkingConfirm = () => {
    if (linkingStepId) {
      setLinkedSteps(prev => ({ ...prev, [linkingStepId]: selectedLinkedSteps }))
    }
    setLinkingDialogOpen(false)
    setLinkingStepId(null)
  }
  
  const toggleLinkedStep = (stepId: string) => {
    setSelectedLinkedSteps(prev => 
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    )
  }
  
  // Get type icon for workflow step
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4 text-chart-1" />
      case "text": return <MessageSquare className="h-4 w-4 text-chart-2" />
      case "call": return <Phone className="h-4 w-4 text-chart-4" />
      case "todo": return <CheckSquare className="h-4 w-4 text-chart-5" />
      case "meet": return <Video className="h-4 w-4 text-chart-3" />
      case "process": return <Settings className="h-4 w-4 text-primary" />
      default: return <CheckSquare className="h-4 w-4 text-muted-foreground" />
    }
  }

  const handleCallClick = () => {
    openSimpleActionDialog("call", "Schedule Call")
  }

  const handleTodoClick = () => {
    openSimpleActionDialog("todo", "New Task")
  }

  const handleMeetClick = () => {
    openSimpleActionDialog("meet", "Schedule Meeting")
  }

  const handleCreateProcessClick = () => {
    setSelectedProcessForStep("")
    openSimpleActionDialog("process", "Create Process")
  }

  const handleStageChangeClick = () => {
    openSimpleActionDialog("stage-change", "Stage Change")
  }

  const handleOpenStageEdit = (
    categoryId: string,
    categoryName: string,
    status: { id: string; name: string; steps: number; days: number; processes: number },
  ) => {
    setSelectedStageForEdit({ categoryId, categoryName, status })
  }

  const handleCloseStageEdit = () => {
    setSelectedStageForEdit(null)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Category handlers
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = (Math.max(...categories.map((c) => Number.parseInt(c.id)), 0) + 1).toString()
      setCategories([...categories, { id: newId, name: newCategoryName.trim(), statuses: [] }])
      setNewCategoryName("")
      setIsAddingCategory(false)
      setExpandedCategories((prev) => [...prev, newId])
    }
  }

  const handleEditCategory = (category: { id: string; name: string }) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const handleSaveCategoryEdit = () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      setCategories(
        categories.map((c) => (c.id === editingCategoryId ? { ...c, name: editingCategoryName.trim() } : c)),
      )
    }
    setEditingCategoryId(null)
    setEditingCategoryName("")
  }

  const handleDeleteCategoryConfirm = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((c) => c.id !== categoryToDelete))
      setExpandedCategories((prev) => prev.filter((id) => id !== categoryToDelete))
    }
    setDeleteConfirmOpen(false)
    setCategoryToDelete(null)
  }

  // Status handlers
  const handleAddStatus = (categoryId: string) => {
    if (newStatusName.trim()) {
      setCategories(
        categories.map((c) => {
          if (c.id === categoryId) {
            const newStatusId = `${categoryId}-${c.statuses.length + 1}`
            return { ...c, statuses: [...c.statuses, { id: newStatusId, name: newStatusName.trim() }] }
          }
          return c
        }),
      )
      setNewStatusName("")
      setAddingStatusToCategoryId(null)
    }
  }

  const handleEditStatus = (status: { id: string; name: string }) => {
    setEditingStatusId(status.id)
    setEditingStatusName(status.name)
  }

  const handleSaveStatusEdit = (categoryId: string) => {
    if (editingStatusId && editingStatusName.trim()) {
      setCategories(
        categories.map((c) => {
          if (c.id === categoryId) {
            return {
              ...c,
              statuses: c.statuses.map((s) => (s.id === editingStatusId ? { ...s, name: editingStatusName.trim() } : s)),
            }
          }
          return c
        }),
      )
    }
    setEditingStatusId(null)
    setEditingStatusName("")
  }

  const handleDeleteStatus = (categoryId: string, statusId: string) => {
    setCategories(
      categories.map((c) => {
        if (c.id === categoryId) {
          return { ...c, statuses: c.statuses.filter((s) => s.id !== statusId) }
        }
        return c
      }),
    )
  }

  const totalStatuses = categories.reduce((acc, c) => acc + c.statuses.length, 0)

  // Stage Edit View
  if (selectedStageForEdit) {
    return (
      <div className="p-6 bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseStageEdit}
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <Input
                defaultValue={selectedStageForEdit.status.name}
                className="text-xl font-bold text-foreground border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {selectedStageForEdit.categoryName}
              </p>
            </div>
          </div>
          <Button variant="outline" className="bg-foreground text-background hover:bg-foreground/90 border-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Workflow Settings
          </Button>
        </div>

        {/* Process enters stage indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded bg-[#6B8E23] flex items-center justify-center">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm text-foreground/80">
            Process enters stage <span className="text-primary font-medium">{selectedStageForEdit.status.name}</span>.
          </span>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-0 mb-6">
          {stageWorkflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-start">
              {/* Timing column */}
              <div className="w-24 text-right pr-4 pt-4">
                <p className="text-xs text-muted-foreground font-medium">{step.timing}</p>
                <p className="text-xs text-muted-foreground/70">day {step.day}</p>
              </div>

              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                {index < stageWorkflowSteps.length - 1 && <div className="w-0.5 h-12 bg-border" />}
              </div>

{/* Step content */}
                  <div className="flex-1 ml-4">
                    <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-center gap-2">
                        {/* Type Icon */}
                        <span title={step.type.charAt(0).toUpperCase() + step.type.slice(1)}>
                          {getTypeIcon(step.type)}
                        </span>
                        {/* Auto-send lightning icon for email/text */}
                        {(step.type === "email" || step.type === "text") && step.autoSend && (
                          <span title="Auto-send enabled" className="text-chart-4">
                            <Zap className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <button
                          type="button"
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                          onClick={() => {
                            alert(`Edit step: ${step.name}`)
                          }}
                        >
                          {step.name}
                        </button>
                        {/* Process name badge aligned to the right of step name */}
                        {step.processName && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                            {step.processName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:bg-primary/10" 
                          title="Instructions"
                          onClick={() => {
                            setInstructionsStepId(step.id)
                            setInstructionsText(stepInstructions[step.id] || "")
                            setInstructionsDialogOpen(true)
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Manual Action">
                          <Hand className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Required">
                          <Asterisk className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" title="Run Process">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                            <span className="text-xs font-semibold text-primary">P</span>
                          </div>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Set Timer">
                          <Timer className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" 
                          title="Step Conditions"
                          onClick={() => {
                            setConditionsStepId(step.id)
                            const saved = savedStepConditions[step.id]
                            if (saved) {
                              setDisplayConditionType(saved.type)
                              setStepConditions(saved.conditions)
                            } else {
                              setDisplayConditionType("any")
                              setStepConditions([{ field: "", operator: "is", value: "" }])
                            }
                            setConditionsDialogOpen(true)
                          }}
                        >
                          <Network className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete Step"
                          onClick={() => {
                            setStageWorkflowSteps((prev) => prev.filter((s) => s.id !== step.id))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
            </div>
          ))}
        </div>

        {/* Add Action Controls */}
        <div className="flex items-start">
          <div className="w-24" />
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-foreground text-foreground hover:bg-muted bg-transparent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 ml-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={handleEmailClick}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={handleCallClick}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={handleTextMessageClick}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Text Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={handleTodoClick}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Todo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={handleMeetClick}
              >
                <Video className="h-4 w-4 mr-2" />
                Meet
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-primary border-primary/30 hover:bg-primary/10"
                onClick={handleCreateProcessClick}
              >
                <Settings className="h-4 w-4 mr-2" />
                Create Process
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-primary border-primary/30 hover:bg-primary/10"
                onClick={handleStageChangeClick}
              >
                <Flag className="h-4 w-4 mr-2" />
                Stage Change
              </Button>
            </div>
          </div>
        </div>

        {/* Template Selection Dialog */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {templateDialogType === "email" ? <Mail className="h-5 w-5 text-primary" /> : <MessageSquare className="h-5 w-5 text-primary" />}
                {templateDialogType === "email" ? "Add Email Step" : "Add Text Message Step"}
              </DialogTitle>
              <DialogDescription>
                Select an existing template or create a new one.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Template Selection Dropdown */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Select Template</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={(value) => {
                    if (value === "create-new") {
                      setIsCreatingTemplate(true)
                      setSelectedTemplate("")
                    } else {
                      setSelectedTemplate(value)
                      setIsCreatingTemplate(false)
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search and select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(templateDialogType === "email" ? emailTemplates : textTemplates).map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="create-new" className="text-primary font-medium">
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Template
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* New Template Name Input */}
              {isCreatingTemplate && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">New Template Name</Label>
                  <Input
                    placeholder="Enter template name..."
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
<span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Set Delay</span>
                </div>
              </div>

              {/* Delay Configuration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">This step should be due</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Input
                    type="number"
                    min={0}
                    value={delayValue}
                    onChange={(e) => setDelayValue(Number.parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Select value={delayUnit} onValueChange={(v: "minutes" | "hours" | "days") => setDelayUnit(v)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">minutes</SelectItem>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="days">days</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">after</span>
                  <Select value={delayReference} onValueChange={(v: "previous" | "stage-entry") => setDelayReference(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="previous">The previous step</SelectItem>
                      <SelectItem value="stage-entry">Stage entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Staff Assignment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Assign to Staff Member (Optional)</Label>
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a staff member..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Auto-send Toggle */}
              <div className="flex items-center justify-between p-3 bg-chart-4/10 border border-chart-4/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-chart-4" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-send</p>
                    <p className="text-xs text-muted-foreground">Automatically send this {templateDialogType === "email" ? "email" : "text"} when step is reached</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSendEnabled(!autoSendEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-[rgba(124,123,123,1)] ${autoSendEnabled ? "bg-chart-4" : "bg-muted"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSendEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTemplateDialogOpen(false)} className="bg-muted">
                Cancel
              </Button>
              <Button
                onClick={handleTemplateConfirm}
                disabled={!selectedTemplate && (!isCreatingTemplate || !newTemplateName.trim())}
                className="text-primary-foreground hover:bg-primary/90 bg-primary"
              >
                Add Step
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Simple Action Dialog (Call, Todo, Meet, etc.) */}
        <Dialog open={simpleActionDialogOpen} onOpenChange={setSimpleActionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {simpleActionType === "call" && <Phone className="h-5 w-5 text-primary" />}
                {simpleActionType === "todo" && <CheckSquare className="h-5 w-5 text-primary" />}
                {simpleActionType === "meet" && <Video className="h-5 w-5 text-primary" />}
                {simpleActionType === "process" && <Settings className="h-5 w-5 text-primary" />}
                {simpleActionType === "stage-change" && <Flag className="h-5 w-5 text-primary" />}
                Add {simpleActionType === "call" ? "Call" : simpleActionType === "todo" ? "Todo" : simpleActionType === "meet" ? "Meeting" : simpleActionType === "process" ? "Process" : "Stage Change"} Step
              </DialogTitle>
              <DialogDescription>
                Configure this workflow step.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Step Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Step Name</Label>
                <Input
                  value={simpleActionName}
                  onChange={(e) => setSimpleActionName(e.target.value)}
                  placeholder="Enter step name..."
                  autoFocus
                />
              </div>
              
              {/* Process Selection - only shown for Create Process */}
              {simpleActionType === "process" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Select Process to Initiate</Label>
                  <Select value={selectedProcessForStep} onValueChange={setSelectedProcessForStep}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a process..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProcesses.map((process) => (
                        <SelectItem key={process.id} value={process.id}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">The selected process will be initiated when this step is executed.</p>
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
<span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Set Delay</span>
                </div>
              </div>

              {/* Delay Configuration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">This step should be due</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Input
                    type="number"
                    min={0}
                    value={delayValue}
                    onChange={(e) => setDelayValue(Number.parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                  <Select value={delayUnit} onValueChange={(v: "minutes" | "hours" | "days") => setDelayUnit(v)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">minutes</SelectItem>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="days">days</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">after</span>
                  <Select value={delayReference} onValueChange={(v: "previous" | "stage-entry") => setDelayReference(v)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="previous">The previous step</SelectItem>
                      <SelectItem value="stage-entry">Stage entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Staff Assignment */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Assign to Staff Member (Optional)</Label>
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a staff member..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Fields Section - Only for Todo */}
              {simpleActionType === "todo" && (
                <>
                  {/* Divider */}
                  <div className="relative pt-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Include Custom Fields (Optional)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Select custom fields to attach to this task. Users will need to fill these fields when completing the task.
                    </p>
                    <div className="border rounded-lg max-h-48 overflow-y-auto">
                      {ownerCustomFields.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-start gap-3 p-3 hover:bg-muted/30 cursor-pointer border-b last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-gray-300"
                            checked={selectedTodoCustomFields.includes(field.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTodoCustomFields([...selectedTodoCustomFields, field.id])
                              } else {
                                setSelectedTodoCustomFields(selectedTodoCustomFields.filter((id) => id !== field.id))
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">{field.label}</div>
                            <div className="text-xs text-muted-foreground">{field.dataType}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {selectedTodoCustomFields.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {selectedTodoCustomFields.length} field{selectedTodoCustomFields.length > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSimpleActionDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleSimpleActionConfirm}
                disabled={!simpleActionName.trim()}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Add Step
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Linking Dialog */}
        <Dialog open={linkingDialogOpen} onOpenChange={setLinkingDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Link Steps
              </DialogTitle>
              <DialogDescription>
                Select which steps this action should be linked to. Linked steps will be triggered or depend on this step.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Available Steps to Link</Label>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  {stageWorkflowSteps
                    .filter(step => step.id !== linkingStepId)
                    .map((step) => (
                      <div 
                        key={step.id}
                        className={`flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted transition-colors ${
                          selectedLinkedSteps.includes(step.id) ? "bg-primary/10 border-l-2 border-l-primary" : ""
                        }`}
                        onClick={() => toggleLinkedStep(step.id)}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedLinkedSteps.includes(step.id) 
                            ? "bg-primary border-primary" 
                            : "border-border"
                        }`}>
                          {selectedLinkedSteps.includes(step.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          {getTypeIcon(step.type)}
                          <span className="text-sm font-medium text-foreground">{step.name}</span>
                          {step.processName && (
                            <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                              {step.processName}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{step.timing}</span>
                      </div>
                    ))}
                  {stageWorkflowSteps.filter(step => step.id !== linkingStepId).length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No other steps available to link.
                    </div>
                  )}
                </div>
              </div>
              
              {selectedLinkedSteps.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{selectedLinkedSteps.length}</strong> step(s) selected for linking
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setLinkingDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleLinkingConfirm}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Save Links
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Instructions Dialog */}
        <Dialog open={instructionsDialogOpen} onOpenChange={setInstructionsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Instructions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Instructions Label */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Instructions</Label>
                <div className="border rounded-lg overflow-hidden">
                  <textarea
                    className="w-full min-h-[200px] p-3 text-sm resize-none focus:outline-none bg-background"
                    placeholder="Enter instructions here. Use {{field_name}} to reference custom fields..."
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                  />
                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 p-2 border-t bg-muted/30">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Code">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Underline">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-5 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Numbered List">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Bullet List">
                      <List className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-5 bg-border mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="More Options">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Insert Field Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AtSign className="h-4 w-4" />
                  Insert Field Tag
                </Label>
                <div className="flex flex-wrap gap-2">
                  {availableFieldTags.map((field) => (
                    <Button
                      key={field.tag}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary"
                      onClick={() => {
                        setInstructionsText((prev) => prev + `{{${field.tag}}}`)
                      }}
                    >
                      {field.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click a tag to insert it at the end of your instructions. Tags will be replaced with actual values when the process runs.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setInstructionsDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (instructionsStepId) {
                    setStepInstructions((prev) => ({
                      ...prev,
                      [instructionsStepId]: instructionsText,
                    }))
                  }
                  setInstructionsDialogOpen(false)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Step Conditions Dialog */}
        <Dialog open={conditionsDialogOpen} onOpenChange={setConditionsDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Step Conditions</DialogTitle>
              <DialogDescription>
                Define what conditions must be true for this task to be displayed.{" "}
                <span className="text-primary cursor-pointer hover:underline">
                  Learn more about how to add custom field options here.
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Display task when dropdown */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Display task when?</Label>
                <Select value={displayConditionType} onValueChange={setDisplayConditionType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any condition is true</SelectItem>
                    <SelectItem value="all">All conditions are true</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditions List */}
              <div className="space-y-3">
                {stepConditions.map((condition, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Field</Label>
                      <Select 
                        value={condition.field} 
                        onValueChange={(value) => {
                          const updated = [...stepConditions]
                          updated[index].field = value
                          updated[index].value = ""
                          setStepConditions(updated)
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionFields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs text-muted-foreground">Operator</Label>
                      <Select 
                        value={condition.operator} 
                        onValueChange={(value) => {
                          const updated = [...stepConditions]
                          updated[index].operator = value
                          setStepConditions(updated)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOperators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs text-muted-foreground">Value</Label>
                      <Select 
                        value={condition.value} 
                        onValueChange={(value) => {
                          const updated = [...stepConditions]
                          updated[index].value = value
                          setStepConditions(updated)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {condition.field && conditionFields.find(f => f.value === condition.field)?.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => {
                        if (stepConditions.length > 1) {
                          setStepConditions(stepConditions.filter((_, i) => i !== index))
                        }
                      }}
                      disabled={stepConditions.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Condition Button */}
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setStepConditions([...stepConditions, { field: "", operator: "is", value: "" }])
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConditionsDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (conditionsStepId) {
                    setSavedStepConditions((prev) => ({
                      ...prev,
                      [conditionsStepId]: {
                        type: displayConditionType,
                        conditions: stepConditions,
                      },
                    }))
                  }
                  setConditionsDialogOpen(false)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Owner Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a category to view and manage leads
          </p>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add New Category Input */}
      {isAddingCategory && (
        <Card className="border border-border mb-4">
          <div className="p-4 flex items-center gap-4 bg-muted">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name..."
              className="flex-1 border-border focus:border-ring focus:ring-ring"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory()
                if (e.key === "Escape") {
                  setIsAddingCategory(false)
                  setNewCategoryName("")
                }
              }}
            />
            <Button size="icon" className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background" onClick={handleAddCategory}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => {
                setIsAddingCategory(false)
                setNewCategoryName("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={editingCategoryName && editingCategoryId === null ? editingCategoryName : ""}
              onChange={() => {}}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Category Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Lead Count</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-teal-600">
                            <FolderOpen className="h-5 w-5 text-white" />
                          </div>
                          {editingCategoryId === category.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="max-w-xs border-border focus:border-ring focus:ring-ring"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCategoryEdit()
                                  if (e.key === "Escape") {
                                    setEditingCategoryId(null)
                                    setEditingCategoryName("")
                                  }
                                }}
                              />
                              <Button size="icon" className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background" onClick={handleSaveCategoryEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={() => { setEditingCategoryId(null); setEditingCategoryName("") }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-medium text-foreground">{category.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="font-normal">
                          {category.statuses.length} leads
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCategory(category.id)
                            }}
                          >
                            View Leads
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCategory(category)
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCategoryConfirm(category.id)
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Statuses */}
                    {expandedCategories.includes(category.id) && (
                      <>
                        {category.statuses.map((status, index) => (
                          <tr
                            key={status.id}
                            className={`border-b transition-all duration-150 ${
                              editingStatusId === status.id ? "bg-muted" : "bg-card hover:bg-muted/50"
                            }`}
                          >
                            <td colSpan={4} className="p-0">
                              <div className="p-4 pl-16 flex items-center gap-4">
                                <div className="text-muted-foreground hover:text-foreground transition-colors cursor-grab">
                                  <GripVertical className="h-5 w-5" />
                                </div>

                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-xs shrink-0">
                                  {index + 1}
                                </div>

                                {editingStatusId === status.id ? (
                                  <>
                                    <Input
                                      value={editingStatusName}
                                      onChange={(e) => setEditingStatusName(e.target.value)}
                                      className="flex-1 border-border focus:border-ring focus:ring-ring"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveStatusEdit(category.id)
                                        if (e.key === "Escape") {
                                          setEditingStatusId(null)
                                          setEditingStatusName("")
                                        }
                                      }}
                                    />
                                    <Button
                                      size="icon"
                                      className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
                                      onClick={() => handleSaveStatusEdit(category.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDeleteStatus(category.id, status.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex-1">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenStageEdit(category.id, category.name, status)}
                                        className="text-sm font-medium text-foreground hover:text-primary hover:underline transition-colors text-left"
                                      >
                                        {status.name}
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.steps}</span>
                                        <span>Steps</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.days}</span>
                                        <span>Days</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.processes}</span>
                                        <span>Processes</span>
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-48">
                                        <DropdownMenuItem onClick={() => handleEditStatus(status)}>
                                          <Pencil className="h-4 w-4 mr-2" />
                                          Edit Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteStatus(category.id, status.id)}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Status
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}

                        {/* Add New Status Row */}
                        <tr className="border-b">
                          <td colSpan={4} className="p-0">
                            {addingStatusToCategoryId === category.id ? (
                              <div className="p-4 pl-16 flex items-center gap-4 bg-muted">
                                <div className="w-5" />
                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-xs">
                                  {category.statuses.length + 1}
                                </div>
                                <Input
                                  value={newStatusName}
                                  onChange={(e) => setNewStatusName(e.target.value)}
                                  placeholder="Enter status name..."
                                  className="flex-1 border-border focus:border-ring focus:ring-ring"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddStatus(category.id)
                                    if (e.key === "Escape") {
                                      setAddingStatusToCategoryId(null)
                                      setNewStatusName("")
                                    }
                                  }}
                                />
                                <Button
                                  size="icon"
                                  className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
                                  onClick={() => handleAddStatus(category.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => {
                                    setAddingStatusToCategoryId(null)
                                    setNewStatusName("")
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="p-3 pl-16">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => setAddingStatusToCategoryId(category.id)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Status
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground">Add a category to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will also remove all statuses within this category.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StagesTenantsPage() {
  // Standard Lease Prospect stages for all categories
  const leaseProspectStages = [
    { name: "New Prospects", steps: 3, days: 2, processes: 2 },
    { name: "Appointment Booked with LC", steps: 4, days: 3, processes: 2 },
    { name: "Scheduled Showing", steps: 3, days: 2, processes: 1 },
    { name: "No Show – Prospect", steps: 2, days: 1, processes: 1 },
    { name: "Showing Agent – No Show", steps: 2, days: 1, processes: 1 },
    { name: "Showing Completed – Awaiting Feedback", steps: 4, days: 3, processes: 2 },
    { name: "Not Interested / Disliked Property", steps: 2, days: 1, processes: 1 },
    { name: "Interested – Application Sent", steps: 5, days: 5, processes: 3 },
    { name: "Application Received – Under Review", steps: 6, days: 5, processes: 3 },
    { name: "Application Rejected", steps: 2, days: 1, processes: 1 },
    { name: "Application Approved – Lease Sent", steps: 5, days: 3, processes: 2 },
    { name: "Lease Signed – Schedule Move In", steps: 6, days: 7, processes: 3 },
    { name: "Move In – Completed and Feedback", steps: 4, days: 3, processes: 2 },
    { name: "Tenant – Lost or Backed Out", steps: 2, days: 1, processes: 1 },
  ]

  // Helper to generate statuses for a category
  const generateStatuses = (categoryId: string) =>
    leaseProspectStages.map((stage, index) => ({
      id: `${categoryId}-${index + 1}`,
      name: stage.name,
      steps: stage.steps,
      days: stage.days,
      processes: stage.processes,
    }))

  // Category-based structure with standardized Lease Prospect statuses
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Acquisition Leads",
      statuses: generateStatuses("1"),
    },
    {
      id: "2",
      name: "Acquisition Prospects",
      statuses: generateStatuses("2"),
    },
    {
      id: "3",
      name: "Agents Referral",
      statuses: generateStatuses("3"),
    },
    {
      id: "4",
      name: "AppFolio Owner Contracts",
      statuses: generateStatuses("4"),
    },
    {
      id: "5",
      name: "AppFolio Tenant Applicants",
      statuses: generateStatuses("5"),
    },
    {
      id: "6",
      name: "AppFolio Tenants",
      statuses: generateStatuses("6"),
    },
    {
      id: "7",
      name: "AppFolio Vendors",
      statuses: generateStatuses("7"),
    },
    {
      id: "8",
      name: "Global Investments Leads",
      statuses: generateStatuses("8"),
    },
    {
      id: "9",
      name: "New Prospect Leads",
      statuses: generateStatuses("9"),
    },
    {
      id: "10",
      name: "New Tenant Leads",
      statuses: generateStatuses("10"),
    },
    {
      id: "11",
      name: "NEW TENANTS",
      statuses: generateStatuses("11"),
    },
    {
      id: "12",
      name: "NEW TENANTS LEADS",
      statuses: generateStatuses("12"),
    },
    {
      id: "13",
      name: "New Vendor Leads",
      statuses: generateStatuses("13"),
    },
    {
      id: "14",
      name: "PMC Leads",
      statuses: generateStatuses("14"),
    },
    {
      id: "15",
      name: "Realty Buyer Leads",
      statuses: generateStatuses("15"),
    },
    {
      id: "16",
      name: "Realty Seller Leads",
      statuses: generateStatuses("16"),
    },
  ])

  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null)
  const [editingStatusName, setEditingStatusName] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingStatusToCategoryId, setAddingStatusToCategoryId] = useState<string | null>(null)
  const [newStatusName, setNewStatusName] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  
  // Workflow view state
  const [selectedStageForEdit, setSelectedStageForEdit] = useState<{
    categoryId: string
    categoryName: string
    status: { id: string; name: string; steps: number; days: number; processes: number }
  } | null>(null)
  
  // Workflow steps for the selected stage
  const [stageWorkflowSteps, setStageWorkflowSteps] = useState([
    { id: "1", type: "email", name: "Banking", timing: "immediately", day: 1, autoSend: true, processName: null, instructions: "" },
    { id: "2", type: "text", name: "W-9", timing: "immediately", day: 1, autoSend: false, processName: null, instructions: "" },
    { id: "3", type: "call", name: "Insurance", timing: "immediately", day: 1, autoSend: false, processName: null, instructions: "" },
    { id: "4", type: "todo", name: "Test banking info", timing: "immediately", day: 1, autoSend: false, processName: null, instructions: "" },
    { id: "5", type: "meet", name: "Onboarding Meeting", timing: "1 day after previous step", day: 2, autoSend: false, processName: null, instructions: "" },
    { id: "6", type: "process", name: "Document Review", timing: "2 hours after previous step", day: 2, autoSend: false, processName: "Document Verification", instructions: "" },
  ])

  // Instructions dialog state
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false)
  const [instructionsStepId, setInstructionsStepId] = useState<string | null>(null)
  const [instructionsText, setInstructionsText] = useState("")

  // Custom field tags for instructions
  const customFieldTags = [
    "No of Units",
    "Any Occupied Units",
    "Any Vacant Unit",
    "Owner Name",
    "Property Address",
    "Existing Tenant Moving Out?",
    "Existing Owner or New Owner?",
    "Walkthrough Scheduled?",
    "Any Information Missing?",
    "Property Condition Rating",
  ]

  const handleOpenInstructions = (stepId: string) => {
    const step = stageWorkflowSteps.find((s) => s.id === stepId)
    setInstructionsStepId(stepId)
    setInstructionsText(step?.instructions || "")
    setInstructionsDialogOpen(true)
  }

  const handleSaveInstructions = () => {
    if (instructionsStepId) {
      setStageWorkflowSteps((prev) =>
        prev.map((s) => (s.id === instructionsStepId ? { ...s, instructions: instructionsText } : s)),
      )
    }
    setInstructionsDialogOpen(false)
    setInstructionsStepId(null)
    setInstructionsText("")
  }

  const handleInsertFieldTag = (tag: string) => {
    setInstructionsText((prev) => `${prev}{{${tag}}}`)
  }

  const handleOpenStageEdit = (
    categoryId: string,
    categoryName: string,
    status: { id: string; name: string; steps: number; days: number; processes: number },
  ) => {
    setSelectedStageForEdit({ categoryId, categoryName, status })
  }

  const handleCloseStageEdit = () => {
    setSelectedStageForEdit(null)
  }

  // Get icon for workflow step type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />
      case "text":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      case "todo":
        return <CheckSquare className="h-4 w-4 text-teal-500" />
      case "meet":
        return <Video className="h-4 w-4 text-orange-500" />
      case "process":
        return <Settings className="h-4 w-4 text-primary" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Add workflow step handlers
  const handleAddWorkflowStep = (type: string, name: string) => {
    const newStep = {
      id: `${Date.now()}`,
      type,
      name,
      timing: "immediately",
      day: 1,
      autoSend: false,
      processName: type === "process" ? "New Process" : null,
    }
    setStageWorkflowSteps((prev) => [...prev, newStep])
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Category handlers
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newId = (Math.max(...categories.map((c) => Number.parseInt(c.id)), 0) + 1).toString()
      setCategories([...categories, { id: newId, name: newCategoryName.trim(), statuses: [] }])
      setNewCategoryName("")
      setIsAddingCategory(false)
      setExpandedCategories((prev) => [...prev, newId])
    }
  }

  const handleEditCategory = (category: { id: string; name: string }) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const handleSaveCategoryEdit = () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      setCategories(
        categories.map((c) => (c.id === editingCategoryId ? { ...c, name: editingCategoryName.trim() } : c)),
      )
    }
    setEditingCategoryId(null)
    setEditingCategoryName("")
  }

  const handleDeleteCategoryConfirm = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((c) => c.id !== categoryToDelete))
      setExpandedCategories((prev) => prev.filter((id) => id !== categoryToDelete))
    }
    setDeleteConfirmOpen(false)
    setCategoryToDelete(null)
  }

  // Status handlers
  const handleAddStatus = (categoryId: string) => {
    if (newStatusName.trim()) {
      setCategories(
        categories.map((c) => {
          if (c.id === categoryId) {
            const newStatusId = `${categoryId}-${c.statuses.length + 1}`
            return { ...c, statuses: [...c.statuses, { id: newStatusId, name: newStatusName.trim(), steps: 0, days: 0, processes: 0 }] }
          }
          return c
        }),
      )
      setNewStatusName("")
      setAddingStatusToCategoryId(null)
    }
  }

  const handleEditStatus = (status: { id: string; name: string }) => {
    setEditingStatusId(status.id)
    setEditingStatusName(status.name)
  }

  const handleSaveStatusEdit = (categoryId: string) => {
    if (editingStatusId && editingStatusName.trim()) {
      setCategories(
        categories.map((c) => {
          if (c.id === categoryId) {
            return {
              ...c,
              statuses: c.statuses.map((s) => (s.id === editingStatusId ? { ...s, name: editingStatusName.trim() } : s)),
            }
          }
          return c
        }),
      )
    }
    setEditingStatusId(null)
    setEditingStatusName("")
  }

  const handleDeleteStatus = (categoryId: string, statusId: string) => {
    setCategories(
      categories.map((c) => {
        if (c.id === categoryId) {
          return { ...c, statuses: c.statuses.filter((s) => s.id !== statusId) }
        }
        return c
      }),
    )
  }

  const totalStatuses = categories.reduce((acc, c) => acc + c.statuses.length, 0)

  // Stage Edit / Workflow View
  if (selectedStageForEdit) {
    return (
      <div className="p-6 bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseStageEdit}
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <Input
                defaultValue={selectedStageForEdit.status.name}
                className="text-xl font-bold text-foreground border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {selectedStageForEdit.categoryName}
              </p>
            </div>
          </div>
          <Button variant="outline" className="bg-foreground text-background hover:bg-foreground/90 border-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Workflow Settings
          </Button>
        </div>

        {/* Process enters stage indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded bg-[#6B8E23] flex items-center justify-center">
            <Flag className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm text-foreground/80">
            Process enters stage <span className="text-primary font-medium">{selectedStageForEdit.status.name}</span>.
          </span>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-0 mb-6">
          {stageWorkflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-start">
              {/* Timing column */}
              <div className="w-24 text-right pr-4 pt-4">
                <p className="text-xs text-muted-foreground font-medium">{step.timing}</p>
                <p className="text-xs text-muted-foreground/70">day {step.day}</p>
              </div>

              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                {index < stageWorkflowSteps.length - 1 && <div className="w-0.5 h-12 bg-border" />}
              </div>

              {/* Step content */}
              <div className="flex-1 ml-4">
                <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-2">
                    {/* Type Icon */}
                    <span title={step.type.charAt(0).toUpperCase() + step.type.slice(1)}>
                      {getTypeIcon(step.type)}
                    </span>
                    {/* Auto-send lightning icon for email/text */}
                    {(step.type === "email" || step.type === "text") && step.autoSend && (
                      <span title="Auto-send enabled" className="text-chart-4">
                        <Zap className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {step.name}
                    </span>
                    {/* Process name badge */}
                    {step.processName && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                        {step.processName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      title="Instructions"
                      onClick={() => handleOpenInstructions(step.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Manual Action">
                      <Hand className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Required">
                      <Asterisk className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" title="Run Process">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/5">
                        <span className="text-xs font-semibold text-primary">P</span>
                      </div>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Set Timer">
                      <Timer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" title="Step Conditions">
                      <Network className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete Step"
                      onClick={() => {
                        setStageWorkflowSteps((prev) => prev.filter((s) => s.id !== step.id))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Action Controls */}
        <div className="flex items-start">
          <div className="w-24" />
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-foreground text-foreground hover:bg-muted bg-transparent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 ml-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={() => handleAddWorkflowStep("email", "New Email")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={() => handleAddWorkflowStep("call", "New Call")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={() => handleAddWorkflowStep("text", "New Text Message")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Text Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={() => handleAddWorkflowStep("todo", "New Todo")}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Todo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-foreground/80 border-border hover:bg-muted"
                onClick={() => handleAddWorkflowStep("meet", "New Meeting")}
              >
                <Video className="h-4 w-4 mr-2" />
                Meet
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-primary border-primary/30 hover:bg-primary/10"
                onClick={() => handleAddWorkflowStep("process", "New Process")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Create Process
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-primary border-primary/30 hover:bg-primary/10"
              >
                <Flag className="h-4 w-4 mr-2" />
                Stage Change
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions Dialog */}
        <Dialog open={instructionsDialogOpen} onOpenChange={setInstructionsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground">Instructions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Instructions Label */}
              <div>
                <Label className="text-sm font-medium text-foreground">Instructions</Label>
                <div className="mt-2 border border-border rounded-lg overflow-hidden">
                  <Textarea
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    placeholder="Enter instructions here. Use {{field_name}} to reference custom fields..."
                    className="min-h-[120px] border-0 focus-visible:ring-0 resize-none"
                  />
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-1 px-3 py-2 border-t border-border bg-muted/30">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground font-bold">
                      B
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground italic">
                      I
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground underline">
                      U
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Insert Field Tag */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Insert Field Tag</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customFieldTags.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-transparent border-border text-foreground hover:bg-muted"
                      onClick={() => handleInsertFieldTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Click a tag to insert it at the end of your instructions. Tags will be replaced with actual values when the process runs.
                </p>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setInstructionsDialogOpen(false)
                  setInstructionsStepId(null)
                  setInstructionsText("")
                }}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveInstructions} className="bg-foreground text-background hover:bg-foreground/90">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lease Prospect Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a category to view and manage lease prospects
          </p>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add New Category Input */}
      {isAddingCategory && (
        <Card className="border border-border mb-4">
          <div className="p-4 flex items-center gap-4 bg-muted">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name..."
              className="flex-1 border-border focus:border-ring focus:ring-ring"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory()
                if (e.key === "Escape") {
                  setIsAddingCategory(false)
                  setNewCategoryName("")
                }
              }}
            />
            <Button size="icon" className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background" onClick={handleAddCategory}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => {
                setIsAddingCategory(false)
                setNewCategoryName("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={editingCategoryName && editingCategoryId === null ? editingCategoryName : ""}
              onChange={() => {}}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Category Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Lead Count</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="p-4 font-medium text-muted-foreground text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-teal-600">
                            <FolderOpen className="h-5 w-5 text-white" />
                          </div>
                          {editingCategoryId === category.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="max-w-xs border-border focus:border-ring focus:ring-ring"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveCategoryEdit()
                                  if (e.key === "Escape") {
                                    setEditingCategoryId(null)
                                    setEditingCategoryName("")
                                  }
                                }}
                              />
                              <Button size="icon" className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background" onClick={handleSaveCategoryEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={() => { setEditingCategoryId(null); setEditingCategoryName("") }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-medium text-foreground">{category.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="font-normal">
                          {category.statuses.length} leads
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleCategory(category.id)
                            }}
                          >
                            View Leads
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCategory(category)
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteCategoryConfirm(category.id)
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Statuses */}
                    {expandedCategories.includes(category.id) && (
                      <>
                        {category.statuses.map((status, index) => (
                          <tr
                            key={status.id}
                            className={`border-b transition-all duration-150 ${
                              editingStatusId === status.id ? "bg-muted" : "bg-card hover:bg-muted/50"
                            }`}
                          >
                            <td colSpan={4} className="p-0">
                              <div className="p-4 pl-16 flex items-center gap-4">
                                <div className="text-muted-foreground hover:text-foreground transition-colors cursor-grab">
                                  <GripVertical className="h-5 w-5" />
                                </div>

                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-xs shrink-0">
                                  {index + 1}
                                </div>

                                {editingStatusId === status.id ? (
                                  <>
                                    <Input
                                      value={editingStatusName}
                                      onChange={(e) => setEditingStatusName(e.target.value)}
                                      className="flex-1 border-border focus:border-ring focus:ring-ring"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveStatusEdit(category.id)
                                        if (e.key === "Escape") {
                                          setEditingStatusId(null)
                                          setEditingStatusName("")
                                        }
                                      }}
                                    />
                                    <Button
                                      size="icon"
                                      className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
                                      onClick={() => handleSaveStatusEdit(category.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDeleteStatus(category.id, status.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex-1">
                                      <button
                                        type="button"
                                        className="text-sm font-medium text-foreground hover:text-primary hover:underline transition-colors cursor-pointer text-left"
                                        onClick={() => handleOpenStageEdit(category.id, category.name, status)}
                                      >
                                        {status.name}
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.steps}</span>
                                        <span>Steps</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.days}</span>
                                        <span>Days</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium text-foreground/80">{status.processes}</span>
                                        <span>Processes</span>
                                      </div>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-48">
                                        <DropdownMenuItem onClick={() => handleOpenStageEdit(category.id, category.name, status)}>
                                          <Settings className="h-4 w-4 mr-2" />
                                          Configure Workflow
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditStatus(status)}>
                                          <Pencil className="h-4 w-4 mr-2" />
                                          Edit Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleDeleteStatus(category.id, status.id)}
                                          className="text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete Status
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}

                        {/* Add New Status Row - Lease Prospects */}
                        <tr className="border-b">
                          <td colSpan={4} className="p-0">
                            {addingStatusToCategoryId === category.id ? (
                              <div className="p-4 pl-16 flex items-center gap-4 bg-muted">
                                <div className="w-5" />
                                <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-semibold text-xs">
                                  {category.statuses.length + 1}
                                </div>
                                <Input
                                  value={newStatusName}
                                  onChange={(e) => setNewStatusName(e.target.value)}
                                  placeholder="Enter status name..."
                                  className="flex-1 border-border focus:border-ring focus:ring-ring"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddStatus(category.id)
                                    if (e.key === "Escape") {
                                      setAddingStatusToCategoryId(null)
                                      setNewStatusName("")
                                    }
                                  }}
                                />
                                <Button
                                  size="icon"
                                  className="h-8 w-8 bg-foreground hover:bg-foreground/90 text-background"
                                  onClick={() => handleAddStatus(category.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                  onClick={() => {
                                    setAddingStatusToCategoryId(null)
                                    setNewStatusName("")
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="p-3 pl-16">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => setAddingStatusToCategoryId(category.id)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Status
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground">Add a category to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This will also remove all statuses within this category.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const INITIAL_PROPERTY_TAGS = [
  { id: "1", name: "Parking", description: "Property has parking available" },
  { id: "2", name: "Cats Allowed", description: "Cats are permitted" },
  { id: "3", name: "Dogs Allowed", description: "Dogs are permitted" },
  { id: "4", name: "No Pets", description: "No pets allowed" },
  { id: "5", name: "Pool", description: "Property has a pool" },
  { id: "6", name: "Gym", description: "Property has gym access" },
  { id: "7", name: "Laundry In-Unit", description: "In-unit washer/dryer" },
  { id: "8", name: "Laundry On-Site", description: "Shared laundry facilities" },
  { id: "9", name: "Furnished", description: "Property comes furnished" },
  { id: "10", name: "Utilities Included", description: "Utilities included in rent" },
  { id: "11", name: "Storage", description: "Storage space available" },
  { id: "12", name: "Wheelchair Accessible", description: "ADA accessible property" },
]

function PropertyTagsPage() {
  const [tags, setTags] = useState(INITIAL_PROPERTY_TAGS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<(typeof INITIAL_PROPERTY_TAGS)[0] | null>(null)
  const [newTag, setNewTag] = useState({ name: "", description: "" })

  const filteredTags = tags.filter((tag) => {
    return (
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      setTags([
        ...tags,
        {
          id: String(tags.length + 1),
          name: newTag.name.trim(),
          description: newTag.description.trim(),
        },
      ])
      setNewTag({ name: "", description: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditTag = (tag: (typeof INITIAL_PROPERTY_TAGS)[0]) => {
    setEditingTag(tag)
  }

  const handleSaveEdit = () => {
    if (editingTag) {
      setTags(tags.map((t) => (t.id === editingTag.id ? editingTag : t)))
      setEditingTag(null)
    }
  }

  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Property Tags</h1>
          <p className="text-muted-foreground">Manage tags that can be attached to properties</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground hover:bg-foreground/90 text-background">
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>Create a new tag to attach to properties.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="e.g., Parking, Pool, Pet Friendly"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-description">Description</Label>
                <Input
                  id="tag-description"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="Brief description of the tag"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag} className="bg-foreground hover:bg-foreground/90 text-background">
                Add Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search only - no category filter */}
      <Card className="border border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card className="border border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Tag Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag, index) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingTag?.id === tag.id ? (
                      <Input
                        value={editingTag.name}
                        onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                        className="h-8"
                      />
                    ) : (
                      <span className="font-medium text-center">{tag.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingTag?.id === tag.id ? (
                      <Input
                        value={editingTag.description}
                        onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                        className="h-8"
                      />
                    ) : (
                      <span className="text-muted-foreground">{tag.description}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {editingTag?.id === tag.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingTag(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit} className="bg-foreground hover:bg-foreground/90 text-background">
                          Save
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditTag(tag)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Custom Fields Page
function CustomFieldsPage() {
  const [customFields, setCustomFields] = useState([
    {
      id: 1,
      label: "Existing Tenant Moving Out?",
      dataType: "Multiple Choice",
      defaultValues: ["Yes", "No"],
      processTypes: ["2 Property Onboarding Process"],
    },
    {
      id: 2,
      label: "Existing Owner or New Owner?",
      dataType: "Multiple Choice",
      defaultValues: ["New Owner", "Existing Owner"],
      processTypes: ["2 Property Onboarding Process"],
    },
    {
      id: 3,
      label: "Walkthrough Scheduled?",
      dataType: "Date",
      defaultValues: [],
      processTypes: ["2 Property Onboarding Process"],
    },
    {
      id: 4,
      label: "Any Information Missing?",
      dataType: "Multiple Choice",
      defaultValues: ["Yes", "No"],
      processTypes: ["2 Property Onboarding Process", "Owner Onboarding Process"],
    },
    {
      id: 5,
      label: "Move-in Date Confirmed?",
      dataType: "Date",
      defaultValues: [],
      processTypes: ["Tenant Onboarding Process"],
    },
    {
      id: 6,
      label: "Lease Term Length",
      dataType: "Multiple Choice",
      defaultValues: ["6 Months", "12 Months", "24 Months", "Month-to-Month"],
      processTypes: ["Lease Renewal Process", "New Lease Process"],
    },
    {
      id: 7,
      label: "Pet Policy Acknowledgement",
      dataType: "Multiple Choice",
      defaultValues: ["Yes", "No", "N/A"],
      processTypes: ["Tenant Onboarding Process", "Lease Renewal Process"],
    },
    {
      id: 8,
      label: "Preferred Contact Time",
      dataType: "Time",
      defaultValues: [],
      processTypes: ["Owner Onboarding Process", "Tenant Onboarding Process"],
    },
    {
      id: 9,
      label: "Additional Notes",
      dataType: "Text",
      defaultValues: [],
      processTypes: ["2 Property Onboarding Process", "Owner Onboarding Process", "Tenant Onboarding Process"],
    },
    {
      id: 10,
      label: "Property Condition Rating",
      dataType: "Multiple Choice",
      defaultValues: ["Excellent", "Good", "Fair", "Poor"],
      processTypes: ["Property Inspection Process"],
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFieldLabel, setNewFieldLabel] = useState("")
  const [newFieldType, setNewFieldType] = useState<string>("Multiple Choice")
  const [newFieldChoices, setNewFieldChoices] = useState<string[]>([""])
  const [newFieldProcessTypes, setNewFieldProcessTypes] = useState<string[]>([])

  const availableProcessTypes = [
    "2 Property Onboarding Process",
    "Owner Onboarding Process",
    "Tenant Onboarding Process",
    "Lease Renewal Process",
    "New Lease Process",
    "Property Inspection Process",
    "Maintenance Request Process",
    "Move-Out Process",
  ]

  const handleDeleteField = (fieldId: number) => {
    setCustomFields(customFields.filter((f) => f.id !== fieldId))
  }

  const handleAddChoice = () => {
    setNewFieldChoices([...newFieldChoices, ""])
  }

  const handleRemoveChoice = (index: number) => {
    setNewFieldChoices(newFieldChoices.filter((_, i) => i !== index))
  }

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...newFieldChoices]
    updated[index] = value
    setNewFieldChoices(updated)
  }

  const handleToggleProcessType = (processType: string) => {
    if (newFieldProcessTypes.includes(processType)) {
      setNewFieldProcessTypes(newFieldProcessTypes.filter((p) => p !== processType))
    } else {
      setNewFieldProcessTypes([...newFieldProcessTypes, processType])
    }
  }

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return

    const newField = {
      id: Math.max(...customFields.map((f) => f.id)) + 1,
      label: newFieldLabel,
      dataType: newFieldType,
      defaultValues: newFieldType === "Multiple Choice" ? newFieldChoices.filter((c) => c.trim()) : [],
      processTypes: newFieldProcessTypes,
    }

    setCustomFields([...customFields, newField])
    setIsAddDialogOpen(false)
    setNewFieldLabel("")
    setNewFieldType("Multiple Choice")
    setNewFieldChoices([""])
    setNewFieldProcessTypes([])
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Custom Fields</h1>
          <p className="text-muted-foreground">Manage custom fields for processes and workflows</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-foreground hover:bg-foreground/90 text-background">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Custom Field</DialogTitle>
              <DialogDescription>Create a new custom field for your processes and workflows.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Label Name */}
              <div className="grid gap-2">
                <Label htmlFor="field-label">Label Name</Label>
                <Input
                  id="field-label"
                  placeholder="Enter field label..."
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                />
              </div>

              {/* Field Type */}
              <div className="grid gap-2">
                <Label>Field Type</Label>
                <Select value={newFieldType} onValueChange={setNewFieldType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                    <SelectItem value="Date">Date</SelectItem>
                    <SelectItem value="Time">Time</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Multiple Choice Values */}
              {newFieldType === "Multiple Choice" && (
                <div className="grid gap-2">
                  <Label>Choice Values</Label>
                  <div className="space-y-2">
                    {newFieldChoices.map((choice, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={choice}
                          onChange={(e) => handleChoiceChange(index, e.target.value)}
                        />
                        {newFieldChoices.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveChoice(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddChoice}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              {/* Process Types */}
              <div className="grid gap-2">
                <Label>Process Types</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {availableProcessTypes.map((processType) => (
                    <label key={processType} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={newFieldProcessTypes.includes(processType)}
                        onChange={() => handleToggleProcessType(processType)}
                      />
                      <span className="text-sm">{processType}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddField} disabled={!newFieldLabel.trim()}>
                Add Field
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-foreground">Label</TableHead>
              <TableHead className="font-semibold text-foreground">Data Type</TableHead>
              <TableHead className="font-semibold text-foreground">Default / Value</TableHead>
              <TableHead className="font-semibold text-foreground">Process Types</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customFields.map((field) => (
              <TableRow key={field.id} className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">{field.label}</TableCell>
                <TableCell className="text-muted-foreground">{field.dataType}</TableCell>
                <TableCell>
                  {field.defaultValues.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {field.defaultValues.map((value, index) => (
                        <span key={index} className="text-muted-foreground">
                          {value}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {field.processTypes.join(", ")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Template Management Page
function TemplateManagementPage() {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email")
  const [searchQuery, setSearchQuery] = useState("")
  const [creatorFilter, setCreatorFilter] = useState("all-creators")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [editingTemplate, setEditingTemplate] = useState<{
    id: string
    name: string
    type: "email" | "sms"
    subject?: string
    content: string
    createdBy: { name: string; role: string }
    createdOn: string
  } | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  // Sample email templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: "e1",
      name: "Welcome Email",
      type: "email" as const,
      subject: "Welcome to Our Property Management Services",
      content: "Dear {{name}},\n\nWelcome to Hero PM! We're excited to have you as part of our community...",
      createdBy: { name: "Nina Patel", role: "Admin" },
      createdOn: "2025-01-15",
    },
    {
      id: "e2",
      name: "Follow-up Email",
      type: "email" as const,
      subject: "Following Up on Your Inquiry",
      content: "Hi {{name}},\n\nI wanted to follow up on our recent conversation about...",
      createdBy: { name: "John Smith", role: "Property Manager" },
      createdOn: "2025-01-10",
    },
    {
      id: "e3",
      name: "Document Request",
      type: "email" as const,
      subject: "Required Documents for Your Application",
      content: "Dear {{name}},\n\nTo proceed with your application, we need the following documents...",
      createdBy: { name: "Sarah Johnson", role: "Leasing Agent" },
      createdOn: "2025-01-08",
    },
    {
      id: "e4",
      name: "Meeting Confirmation",
      type: "email" as const,
      subject: "Your Meeting is Confirmed",
      content: "Hi {{name}},\n\nThis is to confirm your meeting scheduled for {{date}} at {{time}}...",
      createdBy: { name: "Nina Patel", role: "Admin" },
      createdOn: "2025-01-05",
    },
    {
      id: "e5",
      name: "Lease Renewal Notice",
      type: "email" as const,
      subject: "Your Lease Renewal is Coming Up",
      content: "Dear {{name}},\n\nYour current lease agreement will expire on {{date}}. We would like to offer you...",
      createdBy: { name: "Mike Davis", role: "Property Manager" },
      createdOn: "2024-12-20",
    },
  ])

  // Sample SMS templates
  const [smsTemplates, setSmsTemplates] = useState([
    {
      id: "s1",
      name: "Appointment Reminder",
      type: "sms" as const,
      content: "Hi {{name}}, this is a reminder for your appointment tomorrow at {{time}}. Reply Y to confirm or call us to reschedule.",
      createdBy: { name: "Nina Patel", role: "Admin" },
      createdOn: "2025-01-14",
    },
    {
      id: "s2",
      name: "Quick Check-in",
      type: "sms" as const,
      content: "Hi {{name}}, just checking in to see if you have any questions about your property. Feel free to reach out!",
      createdBy: { name: "John Smith", role: "Property Manager" },
      createdOn: "2025-01-12",
    },
    {
      id: "s3",
      name: "Document Received",
      type: "sms" as const,
      content: "Hi {{name}}, we've received your documents. Our team will review them and get back to you within 24-48 hours.",
      createdBy: { name: "Sarah Johnson", role: "Leasing Agent" },
      createdOn: "2025-01-09",
    },
    {
      id: "s4",
      name: "Maintenance Update",
      type: "sms" as const,
      content: "Hi {{name}}, your maintenance request #{{ticketId}} has been completed. Please let us know if you have any issues.",
      createdBy: { name: "Mike Davis", role: "Property Manager" },
      createdOn: "2025-01-06",
    },
  ])

  // Get unique creators for filter
  const allCreators = [...new Set([...emailTemplates, ...smsTemplates].map((t) => t.createdBy.name))]

  // Filter templates
  const filterTemplates = (templates: typeof emailTemplates) => {
    return templates.filter((template) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Creator filter
      const matchesCreator = creatorFilter === "all-creators" || template.createdBy.name === creatorFilter

      // Date filter
      let matchesDate = true
      if (dateFilter !== "all") {
        const templateDate = new Date(template.createdOn)
        const now = new Date()
        if (dateFilter === "today") {
          matchesDate = templateDate.toDateString() === now.toDateString()
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = templateDate >= weekAgo
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = templateDate >= monthAgo
        }
      }

      return matchesSearch && matchesCreator && matchesDate
    })
  }

  const filteredEmailTemplates = filterTemplates(emailTemplates)
  const filteredSmsTemplates = filterTemplates(smsTemplates)

  const handleViewTemplate = (template: typeof emailTemplates[0]) => {
    setEditingTemplate(template)
    setIsViewMode(true)
  }

  const handleEditTemplate = (template: typeof emailTemplates[0]) => {
    setEditingTemplate(template)
    setIsViewMode(false)
  }

  const handleSaveTemplate = () => {
    if (!editingTemplate) return

    if (editingTemplate.type === "email") {
      setEmailTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)),
      )
    } else {
      setSmsTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)),
      )
    }
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplateToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (!templateToDelete) return

    if (activeTab === "email") {
      setEmailTemplates((prev) => prev.filter((t) => t.id !== templateToDelete))
    } else {
      setSmsTemplates((prev) => prev.filter((t) => t.id !== templateToDelete))
    }
    setDeleteConfirmOpen(false)
    setTemplateToDelete(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Template Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage email and SMS templates for your workflows.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "email"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Templates
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {emailTemplates.length}
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sms")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "sms"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS Templates
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {smsTemplates.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by template name or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={creatorFilter} onValueChange={setCreatorFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by creator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-creators">All Creators</SelectItem>
            {allCreators.map((creator) => (
              <SelectItem key={creator} value={creator}>
                {creator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(v: "all" | "today" | "week" | "month") => setDateFilter(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        {(searchQuery || creatorFilter !== "all-creators" || dateFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setCreatorFilter("all-creators")
              setDateFilter("all")
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Templates Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Template Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Created By
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Created On
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(activeTab === "email" ? filteredEmailTemplates : filteredSmsTemplates).map((template) => (
              <tr key={template.id} className="hover:bg-muted transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeTab === "email" ? "bg-chart-1/20" : "bg-chart-2/20"
                    }`}>
                      {activeTab === "email" ? (
                        <Mail className="h-4 w-4 text-chart-1" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-chart-2" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{template.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <span className="text-foreground">{template.createdBy.name}</span>
                    <span className="text-muted-foreground"> - {template.createdBy.role}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {formatDate(template.createdOn)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTemplate(template)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {(activeTab === "email" ? filteredEmailTemplates : filteredSmsTemplates).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {activeTab === "email" ? (
                      <Mail className="h-8 w-8 text-muted-foreground/30" />
                    ) : (
                      <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                    )}
                    <p className="text-muted-foreground">No templates found</p>
                    <p className="text-muted-foreground/70 text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View/Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingTemplate?.type === "email" ? (
                <Mail className="h-5 w-5 text-chart-1" />
              ) : (
                <MessageSquare className="h-5 w-5 text-chart-2" />
              )}
              {isViewMode ? "View Template" : "Edit Template"}
            </DialogTitle>
            <DialogDescription>
              {isViewMode ? "Template details" : "Make changes to your template below."}
            </DialogDescription>
          </DialogHeader>

          {editingTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Template Name</Label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  disabled={isViewMode}
                  className={isViewMode ? "bg-muted" : ""}
                />
              </div>

              {editingTemplate.type === "email" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Subject Line</Label>
                  <Input
                    value={editingTemplate.subject || ""}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                    }
                    disabled={isViewMode}
                    className={isViewMode ? "bg-muted" : ""}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Content</Label>
                <textarea
                  value={editingTemplate.content}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, content: e.target.value })
                  }
                  disabled={isViewMode}
                  className={`w-full min-h-[200px] p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    isViewMode ? "bg-muted" : ""
                  }`}
                />
                {!isViewMode && (
                  <p className="text-xs text-muted-foreground">
                    Use {"{{variable}}"} syntax for dynamic content. E.g., {"{{name}}"}, {"{{date}}"}, {"{{time}}"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground/70">Created by:</span>{" "}
                  <span className="text-foreground/80">{editingTemplate.createdBy.name}</span>
                  <span className="text-muted-foreground/70"> ({editingTemplate.createdBy.role})</span>
                </div>
                <div>
                  <span className="text-muted-foreground/70">Created on:</span>{" "}
                  <span className="text-foreground/80">{formatDate(editingTemplate.createdOn)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {isViewMode ? (
              <>
                <Button variant="outline" onClick={() => setEditingTemplate(null)} className="bg-transparent">
                  Close
                </Button>
                <Button
                  onClick={() => setIsViewMode(false)}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditingTemplate(null)} className="bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Template
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Contacts Directory Page Component
function ContactsDirectoryPage() {
  const [activeTab, setActiveTab] = useState<"owners" | "tenants">("owners")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for inactive owners
  const inactiveOwners = [
    { id: "1", name: "James Wilson", email: "james.wilson@email.com", phone: "(555) 123-4567", propertyType: "Multi Family", createdDate: "2023-06-15", lastContact: "2024-01-10", status: "Inactive" },
    { id: "2", name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(555) 234-5678", propertyType: "Single Family", createdDate: "2023-04-22", lastContact: "2023-12-05", status: "Inactive" },
    { id: "3", name: "Robert Chen", email: "r.chen@email.com", phone: "(555) 345-6789", propertyType: "Apartment", createdDate: "2023-08-10", lastContact: "2024-02-15", status: "Inactive" },
    { id: "4", name: "Emily Parker", email: "emily.p@email.com", phone: "(555) 456-7890", propertyType: "Multi Family", createdDate: "2023-03-18", lastContact: "2023-11-20", status: "Inactive" },
    { id: "5", name: "Michael Brown", email: "m.brown@email.com", phone: "(555) 567-8901", propertyType: "Single Family", createdDate: "2023-09-05", lastContact: "2024-01-25", status: "Inactive" },
    { id: "6", name: "Jennifer Davis", email: "j.davis@email.com", phone: "(555) 678-9012", propertyType: "Apartment", createdDate: "2023-05-30", lastContact: "2023-10-15", status: "Inactive" },
  ]

  // Mock data for inactive tenants
  const inactiveTenants = [
    { id: "1", name: "David Thompson", email: "david.t@email.com", phone: "(555) 111-2222", propertyType: "Apartment", createdDate: "2023-07-12", lastContact: "2024-01-05", status: "Inactive" },
    { id: "2", name: "Lisa Anderson", email: "l.anderson@email.com", phone: "(555) 222-3333", propertyType: "Single Family", createdDate: "2023-05-20", lastContact: "2023-12-18", status: "Inactive" },
    { id: "3", name: "Kevin Martinez", email: "k.martinez@email.com", phone: "(555) 333-4444", propertyType: "Multi Family", createdDate: "2023-08-25", lastContact: "2024-02-01", status: "Inactive" },
    { id: "4", name: "Amanda White", email: "a.white@email.com", phone: "(555) 444-5555", propertyType: "Apartment", createdDate: "2023-04-10", lastContact: "2023-11-30", status: "Inactive" },
    { id: "5", name: "Chris Taylor", email: "c.taylor@email.com", phone: "(555) 555-6666", propertyType: "Single Family", createdDate: "2023-09-15", lastContact: "2024-01-20", status: "Inactive" },
  ]

  const currentData = activeTab === "owners" ? inactiveOwners : inactiveTenants

  const filteredData = currentData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone.includes(searchQuery)
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Contacts Directory</h1>
        <p className="text-muted-foreground">View and manage inactive prospects for potential re-engagement</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("owners")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
            activeTab === "owners"
              ? "text-teal-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Owners
          {activeTab === "owners" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("tenants")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
            activeTab === "tenants"
              ? "text-teal-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tenants
          {activeTab === "tenants" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredData.length} {activeTab === "owners" ? "Owners" : "Tenants"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Property Type</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="font-semibold">Last Contact</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                          {item.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.email}</TableCell>
                  <TableCell className="text-muted-foreground">{item.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.propertyType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.lastContact).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No {activeTab} found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Property Directory Page Component
function PropertyDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for properties related to inactive owners
  const properties = [
    { id: "1", name: "Sunset Apartments", address: "123 Sunset Blvd, Los Angeles, CA 90028", type: "Apartment", units: 24, owner: "James Wilson", status: "Inactive", createdDate: "2023-06-15" },
    { id: "2", name: "Oak Street Residence", address: "456 Oak Street, San Francisco, CA 94102", type: "Single Family", units: 1, owner: "Sarah Mitchell", status: "Inactive", createdDate: "2023-04-22" },
    { id: "3", name: "Harbor View Complex", address: "789 Harbor Way, San Diego, CA 92101", type: "Multi Family", units: 8, owner: "Robert Chen", status: "Inactive", createdDate: "2023-08-10" },
    { id: "4", name: "Maple Gardens", address: "321 Maple Ave, Sacramento, CA 95814", type: "Apartment", units: 32, owner: "Emily Parker", status: "Inactive", createdDate: "2023-03-18" },
    { id: "5", name: "Pine Valley Home", address: "654 Pine Valley Rd, Fresno, CA 93720", type: "Single Family", units: 1, owner: "Michael Brown", status: "Inactive", createdDate: "2023-09-05" },
    { id: "6", name: "Downtown Lofts", address: "987 Main Street, Oakland, CA 94612", type: "Apartment", units: 16, owner: "Jennifer Davis", status: "Inactive", createdDate: "2023-05-30" },
    { id: "7", name: "Riverside Duplex", address: "147 River Road, Riverside, CA 92501", type: "Multi Family", units: 4, owner: "James Wilson", status: "Inactive", createdDate: "2023-07-20" },
    { id: "8", name: "Coastal Retreat", address: "258 Beach Blvd, Santa Monica, CA 90401", type: "Single Family", units: 1, owner: "Sarah Mitchell", status: "Inactive", createdDate: "2023-02-14" },
  ]

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "Apartment":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Multi Family":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Single Family":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Property Directory</h1>
        <p className="text-muted-foreground">View properties associated with inactive owner prospects</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties by name, address, owner, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredProperties.length} Properties
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Property Name</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold text-center">Units</TableHead>
                <TableHead className="font-semibold">Owner</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-teal-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-teal-600" />
                      </div>
                      <span className="font-medium text-foreground">{property.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {property.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getPropertyTypeColor(property.type)}`}>
                      {property.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {property.units}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                          {property.owner.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{property.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(property.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      {property.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProperties.length === 0 && (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Roles & Permissions Page Component
function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [permissionSearch, setPermissionSearch] = useState("")

  const roles = [
    { id: "1", name: "Process Owner", description: "Manages and oversees business processes", usersCount: 4 },
    { id: "2", name: "Accountant", description: "Handles financial records and transactions", usersCount: 3 },
    { id: "3", name: "Acquisition Manager", description: "Manages property acquisition and owner prospects", usersCount: 2 },
    { id: "4", name: "Agent", description: "Handles leasing and tenant relations", usersCount: 8 },
    { id: "5", name: "AGM", description: "Assistant General Manager supporting operations", usersCount: 2 },
    { id: "6", name: "BC", description: "Business Coordinator managing day-to-day activities", usersCount: 3 },
    { id: "7", name: "CEO", description: "Chief Executive Officer with full system access", usersCount: 1 },
    { id: "8", name: "CSM", description: "Customer Success Manager for client relations", usersCount: 5 },
    { id: "9", name: "HR Executive", description: "Handles HR operations and employee management", usersCount: 2 },
    { id: "10", name: "HR Manager", description: "Oversees HR department and policies", usersCount: 1 },
    { id: "11", name: "Lead Coordinator", description: "Coordinates lead distribution and follow-ups", usersCount: 4 },
    { id: "12", name: "Lead Owner", description: "Owns and manages assigned leads", usersCount: 6 },
  ]

  const permissionCategories = [
    { id: "1", name: "Accounting - Advanced", isNew: false, sections: [
      { id: "1-1", name: "Bank Reconciliation" },
      { id: "1-2", name: "Budget Management" },
      { id: "1-3", name: "Financial Reports" },
    ]},
    { id: "2", name: "Accounting - Common Area Maintenance", isNew: false, sections: [
      { id: "2-1", name: "CAM Charges" },
      { id: "2-2", name: "CAM Reconciliation" },
    ]},
    { id: "3", name: "Accounting - Debt Collections", isNew: false, sections: [
      { id: "3-1", name: "Collection Letters" },
      { id: "3-2", name: "Payment Plans" },
      { id: "3-3", name: "Write-offs" },
    ]},
    { id: "4", name: "Accounting - General", isNew: false, sections: [
      { id: "4-1", name: "Chart of Accounts" },
      { id: "4-2", name: "General Ledger" },
      { id: "4-3", name: "Account Statements" },
    ]},
    { id: "5", name: "Accounting - Journal Entries", isNew: false, sections: [
      { id: "5-1", name: "Manual Entries" },
      { id: "5-2", name: "Recurring Entries" },
      { id: "5-3", name: "Adjusting Entries" },
    ]},
    { id: "6", name: "Accounting - Payables", isNew: false, sections: [
      { id: "6-1", name: "Vendor Bills" },
      { id: "6-2", name: "Bill Payments" },
      { id: "6-3", name: "Purchase Orders" },
    ]},
    { id: "7", name: "Accounting - Receivables", isNew: false, sections: [
      { id: "7-1", name: "Invoices" },
      { id: "7-2", name: "Payments Received" },
      { id: "7-3", name: "Credit Memos" },
    ]},
    { id: "8", name: "Accounting - Transactions", isNew: false, sections: [
      { id: "8-1", name: "Transaction History" },
      { id: "8-2", name: "Void Transactions" },
      { id: "8-3", name: "Transaction Reports" },
    ]},
    { id: "9", name: "Affordable Housing", isNew: false, sections: [
      { id: "9-1", name: "Compliance Reports" },
      { id: "9-2", name: "Income Certifications" },
      { id: "9-3", name: "HUD Forms" },
    ]},
    { id: "10", name: "Assigned Tasks", isNew: true, sections: [
      { id: "10-1", name: "Task List" },
      { id: "10-2", name: "Task Assignment" },
      { id: "10-3", name: "Task Templates" },
    ]},
    { id: "11", name: "Associations", isNew: false, sections: [
      { id: "11-1", name: "HOA Management" },
      { id: "11-2", name: "Meeting Minutes" },
      { id: "11-3", name: "Violation Tracking" },
    ]},
    { id: "12", name: "Bulk Workflows", isNew: false, sections: [
      { id: "12-1", name: "Bulk Communications" },
      { id: "12-2", name: "Bulk Updates" },
      { id: "12-3", name: "Import/Export" },
    ]},
    { id: "13", name: "Communication", isNew: false, sections: [
      { id: "13-1", name: "Email Templates" },
      { id: "13-2", name: "SMS Templates" },
      { id: "13-3", name: "Notification Settings" },
    ]},
    { id: "14", name: "Global", isNew: false, sections: [
      { id: "14-1", name: "System Settings" },
      { id: "14-2", name: "Company Profile" },
      { id: "14-3", name: "Integrations" },
    ]},
    { id: "15", name: "Information Security", isNew: false, sections: [
      { id: "15-1", name: "Audit Logs" },
      { id: "15-2", name: "Data Access" },
      { id: "15-3", name: "Security Settings" },
    ]},
    { id: "16", name: "Leasing", isNew: false, sections: [
      { id: "16-1", name: "Applications" },
      { id: "16-2", name: "Lease Agreements" },
      { id: "16-3", name: "Renewals" },
      { id: "16-4", name: "Move-in/Move-out" },
    ]},
    { id: "17", name: "Maintenance", isNew: false, sections: [
      { id: "17-1", name: "Work Orders" },
      { id: "17-2", name: "Vendor Management" },
      { id: "17-3", name: "Inspections" },
    ]},
    { id: "18", name: "Properties", isNew: false, sections: [
      { id: "18-1", name: "Property List" },
      { id: "18-2", name: "Unit Management" },
      { id: "18-3", name: "Amenities" },
    ]},
    { id: "19", name: "Reporting", isNew: true, sections: [
      { id: "19-1", name: "Financial Reports" },
      { id: "19-2", name: "Operational Reports" },
      { id: "19-3", name: "Custom Reports" },
    ]},
    { id: "20", name: "Tenant Management", isNew: false, sections: [
      { id: "20-1", name: "Tenant Profiles" },
      { id: "20-2", name: "Lease History" },
      { id: "20-3", name: "Tenant Communications" },
    ]},
  ]

  const getRoleColor = (index: number) => {
    const colors = [
      "bg-teal-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-green-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-violet-500",
    ]
    return colors[index % colors.length]
  }

  const currentRole = roles.find((r) => r.id === selectedRole)
  const currentCategory = permissionCategories.find((c) => c.id === selectedCategory)

  const filteredCategories = permissionCategories.filter((category) =>
    category.name.toLowerCase().includes(permissionSearch.toLowerCase())
  )

  // Category Detail View (Permission Sections Table)
  if (selectedRole && currentRole && selectedCategory && currentCategory) {
    return (
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {currentRole.name} Permissions</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">{currentCategory.name}</h1>
          <p className="text-muted-foreground">Manage permissions for {currentCategory.name}</p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(null)}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Permissions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-1/2">Permission</TableHead>
                  <TableHead className="font-semibold text-center">View/Read</TableHead>
                  <TableHead className="font-semibold text-center">Write</TableHead>
                  <TableHead className="font-semibold text-center">Delete</TableHead>
                  <TableHead className="font-semibold text-center">Add</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategory.sections.map((section) => (
                  <TableRow key={section.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{section.name}</TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        id={`${section.id}-view`}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        id={`${section.id}-write`}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        id={`${section.id}-delete`}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        id={`${section.id}-add`}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role Detail View (Permission Categories as Tiles)
  if (selectedRole && currentRole) {
    return (
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedRole(null)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Roles</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">{currentRole.name} Access Permissions</h1>
          <p className="text-muted-foreground">{currentRole.name}</p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Review Changes
            </Button>
            <Button
              variant="link"
              className="text-teal-600 hover:text-teal-700"
              onClick={() => setSelectedRole(null)}
            >
              Cancel
            </Button>
          </div>
          <div className="relative">
            <Input
              placeholder="Search for Permissions"
              value={permissionSearch}
              onChange={(e) => setPermissionSearch(e.target.value)}
              className="pl-3 pr-10 w-64"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Permission Categories as Tiles */}
        <div className="border rounded-lg divide-y">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{category.name}</span>
                {category.isNew && (
                  <Badge className="bg-teal-100 text-teal-700 text-xs ml-2">NEW</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{category.sections.length} permissions</span>
            </button>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="p-8 text-center border rounded-lg">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No permissions found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
          </div>
        )}
      </div>
    )
  }

  // Roles List View
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage user roles and their associated permissions</p>
      </div>

      {/* Roles List */}
      <div className="space-y-3">
        {roles.map((role, index) => (
          <Card
            key={role.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedRole(role.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Role Icon/Color */}
                <div className={`w-12 h-12 rounded-lg ${getRoleColor(index)} flex items-center justify-center flex-shrink-0`}>
                  <Users className="h-6 w-6 text-white" />
                </div>

                {/* Role Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{role.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{role.description}</p>
                </div>

                {/* Users Count */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {role.usersCount} {role.usersCount === 1 ? "user" : "users"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedRole(role.id)
                    }}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function SettingsPage({ params }: { params?: { view?: string } }) {
  const view = params?.view || "user-roles"

  return (
    <div className="min-h-screen bg-background">
      {view === "user-roles" && <UserRolesAndAssignments />}
      {view === "stages-owners" && <StagesOwnersPage />}
      {view === "stages-tenants" && <StagesTenantsPage />}
      {view === "template-management" && <TemplateManagementPage />}
      {view === "property-tags" && <PropertyTagsPage />}
      {view === "custom-fields" && <CustomFieldsPage />}
      {view === "contacts-directory" && <ContactsDirectoryPage />}
      {view === "property-directory" && <PropertyDirectoryPage />}
      {view === "roles-permissions" && <RolesPermissionsPage />}
    </div>
  )
}
