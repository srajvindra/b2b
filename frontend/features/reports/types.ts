export interface StaffMember {
  id: string
  name: string
  role: string
  initials: string
}

export interface TasksMonthlyDatum {
  month: string
  completed: number
  pending: number
}

export interface TaskHistoryItem {
  id: number
  task: string
  staff: string
  property: string
  date: string
  status: "Completed" | "Pending" | "Overdue"
}

export interface TasksData {
  total: number
  completed: number
  pending: number
  overdue: number
  monthlyData: TasksMonthlyDatum[]
  history: TaskHistoryItem[]
}

export interface SalesMonthlyDatum {
  month: string
  revenue: number
  leases: number
}

export interface SalesHistoryItem {
  id: number
  activity: string
  staff: string
  property: string
  amount: number
  date: string
}

export interface SalesData {
  totalRevenue: number
  leasesSigned: number
  avgLeaseValue: number
  conversionRate: number
  monthlyData: SalesMonthlyDatum[]
  history: SalesHistoryItem[]
}

export interface OperationsMonthlyDatum {
  month: string
  inspections: number
  moveIns: number
  moveOuts: number
}

export interface OperationHistoryItem {
  id: number
  operation: string
  staff: string
  property: string
  unit: string
  date: string
}

export interface OperationsData {
  totalOperations: number
  inspections: number
  moveIns: number
  moveOuts: number
  monthlyData: OperationsMonthlyDatum[]
  history: OperationHistoryItem[]
}

export interface MaintenanceMonthlyDatum {
  month: string
  completed: number
  inProgress: number
}

export type MaintenancePriority = "Urgent" | "High" | "Medium" | "Low"
export type MaintenanceStatus = "Completed" | "In Progress" | "Pending"

export interface MaintenanceHistoryItem {
  id: number
  request: string
  staff: string
  property: string
  unit: string
  priority: MaintenancePriority
  date: string
  status: MaintenanceStatus
}

export interface MaintenanceData {
  totalRequests: number
  completed: number
  inProgress: number
  pending: number
  monthlyData: MaintenanceMonthlyDatum[]
  history: MaintenanceHistoryItem[]
}

