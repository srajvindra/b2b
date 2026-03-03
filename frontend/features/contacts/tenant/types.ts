/**
 * Tenant contact feature types.
 * Re-exports from shared contacts types and adds tenant-specific types.
 */
export type {
  Contact,
  ContactStatus,
  CommunicationItem,
  ContactAuditLogEntry,
  OwnerDocument,
  OwnerTask,
  OwnerProcessesData,
  OwnerProcessItem,
  OwnerProcessTaskItem,
  TeamMember,
} from "@/features/contacts/types"

export interface TenantPropertyInfo {
  name: string
  address: string
  type: string
  bedrooms: number
  bathrooms: number
  sqft: number
  yearBuilt: number
  amenities: string[]
  owner: { name: string; email: string; phone: string }
  leaseInfo: { startDate: string; endDate: string; term: string; status: string }
  rentInfo: {
    monthlyRent: number
    securityDeposit: number
    dueDate: string
    paymentMethod: string
    lastPayment: string
    nextDue: string
  }
}

export interface TenantNote {
  id: number
  title: string
  content: string
  createdBy: string
  createdAt: string
}

export interface TenantLetter {
  id: number
  title: string
  createdOn: string
  createdTime: string
}

export interface TenantMissingDocument {
  id: number
  documentName: string
  status: string
  section: string
}
