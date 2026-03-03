// Processes
export interface ProcessType {
  id: string
  name: string
  isDraft: boolean
  stages: number
  folder?: string
  team?: string
}

export interface ProcessInstance {
  id: string
  name: string
  property: string
  onTrack: "no_overdue" | "tasks_overdue" | "overdue_date"
  overdueDate?: string
  stage: string
  assignee: string
  dueAt: string
  createdAt: string
  relatedEntity: {
    type: "Owner" | "Property" | "Tenant" | "Prospect"
    name: string
  }
  processType: string
  status: "Open" | "In-Progress" | "Overdue" | "Completed"
  assignedTeam?: string
  lastTouched: string
}

export interface SummaryCard {
  id: string
  label: string
  value: string | number
  visible: boolean
}

export type FilterType =
  | "status"
  | "assignee"
  | "stage"
  | "onTrack"
  | "processes"
  | "property"
  | "createdAt"
  | "processName"
  | "processType"
  | "assignedTeam"
  | "relatedEntity"

export interface ActiveFilter {
  type: FilterType
  value: string
  label: string
  stageValue?: string
}

export interface SavedView {
  id: string
  name: string
  filters: ActiveFilter[]
  isDefault?: boolean
}

// Automations
export interface AutomationsPageProps {
  onNewAutomation?: () => void
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  status: "active" | "paused" | "draft"
  lastRun?: string
  runCount: number
  category?: "communications" | "leasing" | "maintenance" | "payments" | "general"
}

export type SequenceItem = {
  id: string
  type: "email" | "sms" | "task"
  title: string
  subject?: string
  content: string
  timing: string
}

export type AutomationSequenceItem = SequenceItem

export interface AutomationDetail extends Automation {
  leadSource?: string
  campaignGroup?: string
  assignedStaff?: string[]
  smsOptIn?: boolean
  smsPermission?: boolean
  sequence?: AutomationSequenceItem[]
}

// Projects
export interface Task {
  id: string
  name: string
  description: string
  createdDate: string
  dueDate: string
  assignedTo: string
  assignedToRole: string
  property: string
  status: "upcoming" | "completed" | "overdue"
  notes: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
}

export interface Property {
  id: string
  name: string
}
