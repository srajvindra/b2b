export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Skipped"
export type TaskEntityType =
  | "tenant"
  | "owner"
  | "property"
  | "lead"
  | "lease"
  | "leaseProspect"
  | "prospectOwner"

export type TaskRiskTag = "revenueRisk" | "slaRisk" | "legalRisk" | "orgTask"

export interface Task {
  id: number
  title: string
  dueDate: string
  priority: string
  entity: string
  entityType: TaskEntityType
  risk: string
  overdue: boolean
  assignedTo: string
  status: TaskStatus
  processName?: string
  processEntityType?: TaskEntityType
  skippedComment?: string
  autoCreated?: boolean
  tags?: TaskRiskTag[]
}

export type CommunicationType = "email" | "text" | "call"

export interface CommunicationThreadItem {
  id: number
  type: CommunicationType
  sender: string
  direction: "incoming" | "outgoing"
  subject?: string
  message: string
  timestamp: string
  openedAt?: string
  notes?: string
  duration?: string
  attachments?: Array<{ name: string; size: string; type: string }>
}

export interface ConversationMessage {
  id: number
  sender: string
  direction: "incoming" | "outgoing"
  message: string
  timestamp: string
}

export interface EmailHistoryItem {
  id: number
  sender: string
  direction: "incoming" | "outgoing"
  subject?: string
  message: string
  timestamp: string
}

export interface Communication {
  id: number
  from: string
  type: CommunicationType
  entityType?: "tenant" | "owner" | "prospectTenant" | "prospectOwner"
  preview: string
  fullMessage?: string
  timestamp: string
  read: boolean
  responded?: boolean
  receivedAt: Date
  assignedTo: string
  isGroupSms?: boolean
  groupParticipants?: string[]
  contactId?: string
  communicationThread?: CommunicationThreadItem[]
  conversationHistory?: ConversationMessage[]
  emailHistory?: EmailHistoryItem[]
}

export interface CommSummary {
  pending: number
  emails: number
  emailsUnread: number
  emailsUnresponded: number
  sms: number
  smsUnread: number
  smsUnresponded: number
  calls: number
}

export interface TaskSummary {
  total: number
  overdue: number
  dueToday: number
  dueThisWeek: number
}

export type KPIViewMode = "table" | "chart"

// Key Performance Metrics
export interface KPITableRow {
  label: string
  value: number | string
  trend: string
}

export interface KPIHistoryPoint {
  month: string
  [key: string]: string | number
}

export interface KPISales {
  newLeads: number
  conversionRate: number
  newUnitAdditions: number
  avgResponseTime: string
  history: KPIHistoryPoint[]
}

export interface KPILeasing {
  newLeads: number
  conversionRate: number
  newApplications: number
  newLeasesSigned: number
  avgDaysOnMarket: number
  avgResponseTime: string
  history: KPIHistoryPoint[]
}

export interface KPIOperations {
  totalUnits: number
  churnRate: number
  occupancyRate: number
  rentCollections: number
  leasesRenewed: number
  openComplaints: number
  openTerminations: number
  newWorkOrders: number
  completedWorkOrders: number
  avgResponseTime: string
  history: KPIHistoryPoint[]
}

export interface KPIMaintenance {
  inspectionSpeed: string
  makeReadySpeed: string
  makeReadyConversionRate: number
  avgResponseTime: string
  history: KPIHistoryPoint[]
}

export interface KPIData {
  sales: KPISales
  leasing: KPILeasing
  operations: KPIOperations
  maintenance: KPIMaintenance
}


/**
 * Owner contact feature data.
 * Re-exports from shared contacts data for a single import surface.
 */
export {
  ACCOUNTING_INFO,
  BANK_ACCOUNT_INFO,
  FEDERAL_TAX_INFO,
  OWNER_PACKET_INFO,
  OWNER_STATEMENT_INFO,
  STAFF_LIST,
} from "@/features/contacts/data/ownerDetail"

export {
  getOwnerCommunications,
  getDocuments,
  getTasks,
  teamMembers,
  getOwnerProperties,
  initialAssignedTeam,
  allStaffMembers,
  INITIAL_CUSTOM_FIELDS,
  AVAILABLE_SECTIONS,
  contactAuditLogs,
  OWNER_PROCESSES,
} from "@/features/contacts/data/ownerDetailData"
