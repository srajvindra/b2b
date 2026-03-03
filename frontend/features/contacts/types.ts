export type ContactPageType = "owner" | "tenant" | "vendor" | "property-technician" | "leasing-agent"

export type ContactTypeDisplay = "Owner" | "Tenant" | "Vendor" | "Property Technician" | "Leasing Agent"
export type ContactStatus = "Active" | "Inactive" | "Pending"

export interface Contact {
  id: string
  name: string
  type: ContactTypeDisplay
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
  units?: number
  companyLlc?: string
  csm?: string
  tags?: string[]
  pendingTasks?: number
  pendingProcesses?: number
  terminationStatus?: "Under Termination" | "Terminated Hidden"
  tenantTags?: string[]
  tenantPendingTasks?: number
  tenantPendingProcesses?: number
  moveOutStatus?: "Pending" | "Completed"
  evictionStatus?: "Pending" | "Completed"
  tenantType?: "Self Paying" | "Section 8"
}

export interface Vendor {
  id: string
  name: string
  address: string
  trades: string
  phone: string
  email: string
}

export type ContactFilterValue = "all" | "owners" | "tenants" | "vendors" | "property-technician" | "leasing-agent"

export interface ContactsPageProps {
  filter?: ContactFilterValue
  onFilterChange?: (filter: ContactFilterValue) => void
  onContactClick?: (contact: Contact) => void
  onTenantClick?: (contact: Contact) => void
  onNavigateToUnitDetail?: (unitId: string, propertyId: string) => void
}

export interface ContactActivity {
  id: number
  type: string
  description: string
  date: string
  user: string
}

export interface ContactPayment {
  id: number
  date: string
  amount: string
  type: string
  status: string
}

export interface ContactNote {
  id: number
  content: string
  author: string
  date: string
}

export type CommunicationType = string

export interface CommunicationItem {
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
    emailOpens?: { openedAt: string }[]
    attachments?: { name: string; size: string }[]
  }[]
  content?: string
  duration?: string
  appfolioLink?: string
  notes?: string
  fullContent?: string
  phone?: string
}

// Owner contact detail types
export interface OwnerDocument {
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

export interface OwnerTask {
  id: string
  title: string
  processName?: string
  relatedEntityType?: "Tenant" | "Property" | "Lease Prospect" | "Owner" | "Prospect Owner"
  relatedEntityName?: string
  assignee: string
  assigneeAvatar?: string
  status: "Pending" | "In Progress" | "Completed" | "Skipped"
  priority: "Low" | "Medium" | "High"
  dueDate: string
  isOverdue?: boolean
  autoCreated?: boolean
  description?: string
  propertyName?: string
  propertyAddress?: string
  createdDate?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

export interface OwnerProperty {
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

export interface AssignedTeamMember {
  id: string
  name: string
  email: string
  role: string
  assignedOn: string
}

export interface ActiveProcess {
  id: string
  processName: string
  property: string
  currentStage: string
  assignedRole: string
  lastUpdated: string
}

export type CustomFieldType = "text" | "number" | "date" | "dropdown" | "yes_no"

export interface CustomField {
  id: string
  name: string
  type: CustomFieldType
  section: string
  value: string
  isMandatory: boolean
  options?: string[]
}

export interface CustomFieldSection {
  id: string
  name: string
}

// Owner processes (prospecting) with tasks
export interface OwnerProcessTaskItem {
  id: string
  name: string
  startDate: string | null
  completedDate: string | null
  staffName: string
  staffEmail: string
}

export interface OwnerProcessItem {
  id: string
  name: string
  prospectingStage: string
  startedOn?: string
  completedOn?: string
  status: string
  tasks: OwnerProcessTaskItem[]
}

export interface OwnerProcessesData {
  inProgress: OwnerProcessItem[]
  upcoming: OwnerProcessItem[]
  completed: OwnerProcessItem[]
}

export interface ContactAuditLogEntry {
  id: string
  dateTime: string
  user: string
  userRole: string
  actionType: string
  entity: string
  description: string
  source: string
  deletedNoteContent?: string
  deletedBy?: string
  deletedOn?: string
}
