import type {
  CommunicationItem,
  OwnerDocument,
  OwnerProcessesData,
  ContactAuditLogEntry,
} from "@/features/contacts/types"
import type { TenantPropertyInfo, TenantNote, TenantLetter, TenantMissingDocument } from "../types"

export function getTenantDocuments(): OwnerDocument[] {
  return [
    { id: "doc1", name: "Lease Agreement - Signed.pdf", receivedDate: "12/03/2025", receivedTime: "2:30 PM", type: "PDF", size: "245 KB", url: "#", propertyName: "Oak Manor", propertyAddress: "123 Oak Street, San Francisco, CA" },
    { id: "doc2", name: "Move-in Inspection Report.pdf", receivedDate: "11/28/2025", receivedTime: "10:15 AM", type: "PDF", size: "1.2 MB", url: "#", propertyName: "Maple Heights", propertyAddress: "456 Maple Ave, San Francisco, CA" },
    { id: "doc3", name: "Renters Insurance Certificate.pdf", receivedDate: "11/25/2025", receivedTime: "4:45 PM", type: "PDF", size: "890 KB", url: "#", propertyName: "Pine View Apartments", propertyAddress: "789 Pine Road, San Francisco, CA" },
    { id: "doc4", name: "ID Verification.pdf", receivedDate: "11/20/2025", receivedTime: "11:00 AM", type: "PDF", size: "156 KB", url: "#", propertyName: "Oak Manor", propertyAddress: "123 Oak Street, San Francisco, CA" },
  ]
}

export const TENANT_PROPERTY_INFO: TenantPropertyInfo = {
  name: "Sunset Apartments",
  address: "123 Sunset Blvd, Unit 4B, San Francisco, CA 94102",
  type: "Apartment",
  bedrooms: 2,
  bathrooms: 1,
  sqft: 950,
  yearBuilt: 2015,
  amenities: ["WiFi", "Parking", "Gym", "Pool", "Security"],
  owner: { name: "John Smith", email: "john.smith@email.com", phone: "(415) 555-1234" },
  leaseInfo: { startDate: "01/01/2024", endDate: "12/31/2024", term: "12 months", status: "Active" },
  rentInfo: { monthlyRent: 2500, securityDeposit: 2500, dueDate: "1st of each month", paymentMethod: "Bank Transfer", lastPayment: "12/01/2025", nextDue: "01/01/2026" },
}

export const TENANT_NOTES: TenantNote[] = [
  { id: 1, title: "Lease Renewal Discussion", content: "Spoke with tenant about upcoming lease renewal.", createdBy: "Richard Surovi", createdAt: "01/15/2026, 2:30 PM" },
  { id: 2, title: "Maintenance Request Follow-up", content: "Called tenant to confirm HVAC repair was completed satisfactorily.", createdBy: "Nina Patel", createdAt: "01/10/2026, 11:45 AM" },
  { id: 3, title: "Payment Plan Agreement", content: "Tenant requested a payment plan for January rent.", createdBy: "Richard Surovi", createdAt: "01/05/2026, 9:15 AM" },
]

export const TENANT_LETTERS: TenantLetter[] = [
  { id: 1, title: "3 Day Notice Non Payment Of Rent (B2 B Format)", createdOn: "08/08/2025", createdTime: "08:26 AM" },
  { id: 2, title: "Lease Renewal Offer Letter", createdOn: "12/15/2025", createdTime: "10:30 AM" },
  { id: 3, title: "Move-In Inspection Report", createdOn: "06/01/2024", createdTime: "02:15 PM" },
]

export const TENANT_MISSING_DOCUMENTS: TenantMissingDocument[] = [
  { id: 1, documentName: "Renter's Insurance", status: "Not uploaded", section: "Documents" },
  { id: 2, documentName: "Photo ID", status: "Not uploaded", section: "Documents" },
  { id: 3, documentName: "Proof of Income", status: "Not uploaded", section: "Documents" },
  { id: 4, documentName: "Signed Lease Agreement", status: "Not uploaded", section: "Documents" },
]

export const TENANT_AUDIT_LOGS: ContactAuditLogEntry[] = [
  { id: "1", dateTime: "Jan 18, 2026 – 10:42 AM", user: "Nina Patel", userRole: "Property Manager", actionType: "Updated", entity: "Contact Info", description: "Updated email address from old@email.com to john.smith@example.com", source: "Web" },
  { id: "2", dateTime: "Jan 17, 2026 – 3:15 PM", user: "Sarah Johnson", userRole: "Maintenance Coordinator", actionType: "Updated", entity: "Assignee", description: "Changed assignee from Raj Patel to Nina Patel", source: "Web" },
  { id: "3", dateTime: "Jan 16, 2026 – 11:30 AM", user: "Richard Surovi", userRole: "Leasing Agent", actionType: "Created", entity: "Note", description: "Added note regarding lease renewal discussion", source: "Web" },
  { id: "4", dateTime: "Jan 15, 2026 – 2:45 PM", user: "Mike Chen", userRole: "Accountant", actionType: "Created", entity: "Document", description: "Uploaded Lease Agreement - Signed.pdf", source: "Web" },
  { id: "5", dateTime: "Jan 14, 2026 – 9:00 AM", user: "System", userRole: "Automation", actionType: "Logged", entity: "Communication", description: "Email sent: Follow-up: Lease Renewal Options", source: "System" },
  { id: "6", dateTime: "Jan 12, 2026 – 4:20 PM", user: "Richard Surovi", userRole: "Leasing Agent", actionType: "Logged", entity: "Communication", description: "Outbound call logged - Duration: 2 minutes", source: "Web" },
  { id: "7", dateTime: "Jan 10, 2026 – 10:00 AM", user: "Nina Patel", userRole: "Property Manager", actionType: "Created", entity: "Contact", description: "Contact record created", source: "Web" },
  { id: "8", dateTime: "Jan 13, 2026 – 4:45 PM", user: "Nina Patel", userRole: "Property Manager", actionType: "Deleted", entity: "Note", description: "Deleted note: 'Maintenance request follow-up'", source: "Web", deletedNoteContent: "Tenant reported minor leak under kitchen sink.", deletedBy: "Nina Patel", deletedOn: "Jan 13, 2026 – 4:45 PM" },
  { id: "9", dateTime: "Jan 9, 2026 – 10:30 AM", user: "Richard Surovi", userRole: "Leasing Agent", actionType: "Deleted", entity: "Note", description: "Deleted note: 'Incorrect lease renewal date'", source: "Web", deletedNoteContent: "Lease renewal discussion scheduled for Feb 15.", deletedBy: "Richard Surovi", deletedOn: "Jan 9, 2026 – 10:30 AM" },
]

// Re-export tenant processes from a shared shape (same as OwnerProcessesData)
export { TENANT_PROCESSES } from "./tenantProcesses"
export { getTenantCommunications } from "./tenantCommunications"
export { getTenantTasks } from "./tenantTasks"
