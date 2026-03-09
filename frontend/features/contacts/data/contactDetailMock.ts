import type { MissingFieldItem, MissingDocumentItem } from "../types"

export const stageColors = [
  "bg-green-500",
  "bg-teal-500",
  "bg-amber-500",
  "bg-orange-500",
] as const

export const tenantMissingFields: MissingFieldItem[] = [
  { id: 1, fieldName: "Emergency Contact", section: "Tenant Information", tab: "tenant-info" },
  { id: 2, fieldName: "Date of Birth", section: "Screening", tab: "tenant-info" },
  { id: 3, fieldName: "Driver's License", section: "Screening", tab: "tenant-info" },
  { id: 4, fieldName: "Vehicle Information", section: "Additional Info", tab: "tenant-info" },
  { id: 5, fieldName: "Employer Details", section: "Employment", tab: "tenant-info" },
]

export const ownerMissingFields: MissingFieldItem[] = [
  { id: 1, fieldName: "Banking Details", section: "Financials", tab: "details" },
  { id: 2, fieldName: "Tax ID / EIN", section: "Tax Information", tab: "details" },
  { id: 3, fieldName: "Mailing Address", section: "Contact Information", tab: "overview" },
  { id: 4, fieldName: "Preferred Contact Method", section: "Contact Information", tab: "overview" },
]

export const ownerMissingDocuments: MissingDocumentItem[] = [
  { id: 1, documentName: "W-9 Form", status: "Not uploaded", section: "Documents" },
  { id: 2, documentName: "Property Management Agreement", status: "Not uploaded", section: "Documents" },
  { id: 3, documentName: "Insurance Certificate", status: "Not uploaded", section: "Documents" },
]
