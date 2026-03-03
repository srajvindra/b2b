// Template Management
export interface TemplateCreatedBy {
  name: string
  role: string
}

export interface EmailTemplate {
  id: string
  name: string
  type: "email"
  subject?: string
  content: string
  createdBy: TemplateCreatedBy
  createdOn: string
}

export interface SmsTemplate {
  id: string
  name: string
  type: "sms"
  content: string
  createdBy: TemplateCreatedBy
  createdOn: string
}

export type Template = EmailTemplate | SmsTemplate

export type DateFilterType = "all" | "today" | "week" | "month"

// Custom Fields
export interface CustomField {
  id: number
  label: string
  dataType: string
  defaultValues: string[]
  processTypes: string[]
}

// Property Tags
export interface PropertyTag {
  id: string
  name: string
  description: string
}

// Stages (Owner / Lease Prospect categories)
export interface StageStatus {
  id: string
  name: string
  steps: number
  days: number
  processes: number
}

export interface StageCategory {
  id: string
  name: string
  statuses: StageStatus[]
}

// Staff Management
export interface StaffMember {
  id: string
  name: string
  initials: string
  avatar: string
  email: string
  phone: string
  role: string
  dateAdded: string
  status: "Active" | "Inactive"
  ownersHandling: { id: string; name: string }[]
  tenantsHandling: { id: string; name: string }[]
  propertiesManaging: { id: string; name: string; units: number }[]
  tasksAssigned: { id: string; title: string; status: string }[]
}

export type RoleAssignment = Record<string, string | null>

export interface CSRPortfolio {
  id: string
  name: string
  assignments: RoleAssignment
}

export interface PortfolioStaffItem {
  id: string
  name: string
  avatar: string
  initials: string
}
