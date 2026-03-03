export type Property = {
  id: string
  name: string
  address: string
  type: "Multi-Family" | "Single-Family"
  units: number
  hasVacancy: boolean
  ownerName: string
  dateAdded: string
  staffName: string
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

