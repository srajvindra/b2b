import type { StageCategory, StageStatus } from "../types"

const leaseProspectStageTemplate = [
  { name: "New Prospects", steps: 3, days: 2, processes: 2 },
  { name: "Appointment Booked with LC", steps: 4, days: 3, processes: 2 },
  { name: "Scheduled Showing", steps: 3, days: 2, processes: 1 },
  { name: "No Show – Prospect", steps: 2, days: 1, processes: 1 },
  { name: "Showing Agent – No Show", steps: 2, days: 1, processes: 1 },
  { name: "Showing Completed – Awaiting Feedback", steps: 4, days: 3, processes: 2 },
  { name: "Not Interested / Disliked Property", steps: 2, days: 1, processes: 1 },
  { name: "Interested – Application Sent", steps: 5, days: 5, processes: 3 },
  { name: "Application Received – Under Review", steps: 6, days: 5, processes: 3 },
  { name: "Application Rejected", steps: 2, days: 1, processes: 1 },
  { name: "Application Approved – Lease Sent", steps: 5, days: 3, processes: 2 },
  { name: "Lease Signed – Schedule Move In", steps: 6, days: 7, processes: 3 },
  { name: "Move In – Completed and Feedback", steps: 4, days: 3, processes: 2 },
  { name: "Tenant – Lost or Backed Out", steps: 2, days: 1, processes: 1 },
]

function generateStatuses(categoryId: string): StageStatus[] {
  return leaseProspectStageTemplate.map((stage, index) => ({
    id: `${categoryId}-${index + 1}`,
    name: stage.name,
    steps: stage.steps,
    days: stage.days,
    processes: stage.processes,
  }))
}

const categoryNames = [
  "Acquisition Leads",
  "Acquisition Prospects",
  "Agents Referral",
  "AppFolio Owner Contracts",
  "AppFolio Tenant Applicants",
  "AppFolio Tenants",
  "AppFolio Vendors",
  "Global Investments Leads",
  "New Prospect Leads",
  "New Tenant Leads",
  "NEW TENANTS",
  "NEW TENANTS LEADS",
  "New Vendor Leads",
  "PMC Leads",
  "Realty Buyer Leads",
  "Realty Seller Leads",
]

export const initialLeaseProspectCategories: StageCategory[] = categoryNames.map((name, i) => ({
  id: String(i + 1),
  name,
  statuses: generateStatuses(String(i + 1)),
}))
