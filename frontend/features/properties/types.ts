export type Property = {
  id: string
  name: string
  address: string
  /**
   * Optional, only used in detailed listings that show unit-level address.
   */
  unitAddress?: string
  /**
   * Combined union to support both simple and detailed property views.
   */
  type: "Multi-Family" | "Single-Family" | "Single" | "Multi" | "Apartment"
  units: number
  hasVacancy: boolean
  ownerName: string
  /**
   * Optional, only used where tenant context is needed.
   */
  tenantName?: string
  /**
   * Optional, only used in detailed listing views.
   */
  occupancyStatus?: "Occupied" | "Vacant"
  /**
   * Optional staff assignment fields specific to some UIs.
   */
  csr?: string
  csm?: string
  agm?: string
  lc?: string
  fc?: string
  mrs?: string
  dateAdded: string
  staffName: string
  /**
   * Optional grouping and tagging metadata.
   */
  portfolioGroup?: string
  propertyGroup?: string
  tags?: string[]
  assigneeRole?: string
  propertyStatus?: "Active" | "Under Termination" | "Hidden" | "Under Retention"
}

export type StaffMember = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
}

export interface AssignedTeamMember {
  id: string
  name: string
  email: string
  role: string
  assignedOn: string
}

export interface DepartmentStaff {
  id: string
  name: string
  email: string
  role: string
}

export interface Department {
  id: string
  name: string
  staff: DepartmentStaff[]
}

export interface SelectedTeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
}

export interface ProcessTask {
  id: string
  taskName: string
  startDate: string
  completedDate: string
  staffMember: string
  staffEmail: string
}

export interface PropertyProcess {
  id: string
  processName: string
  stageBadge: string
  stageBadgeColor: string
  startedDate: string
  status: string
  tasks: ProcessTask[]
}


