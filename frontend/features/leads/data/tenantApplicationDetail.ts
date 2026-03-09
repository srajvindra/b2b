// Pipeline stages with colors (13-step lifecycle)
export const STAGES = [
  "Attempting to Contact (Call / Email / Message)",
  "Scheduled Showing",
  "No Show - Prospect",
  "Showing Agent - No Show",
  "Showing Completed - Awaiting Feedback",
  "Interested - Application Sent",
  "Application Received - Under Review",
  "Application Approved - Lease Sent",
  "Lease Signed - Schedule Move In",
  "Move In - Completed and Feedback",
  "Not Interested / Disliked Property",
  "Application Rejected",
] as const

const stageColors = [
  "bg-info",
  "bg-warning",
  "bg-warning",
  "bg-chart-4",
  "bg-primary",
  "bg-success",
  "bg-destructive",
]

export function getStageColor(index: number): string {
  return stageColors[index] || "bg-muted"
}

// Available process types to start (from Operations > Processes)
export const AVAILABLE_PROCESS_TYPES = [
  { id: "apt-1", name: "2 Property Onboarding Process", stages: 7 },
  { id: "apt-2", name: "Accounting Mistakes", stages: 4 },
  { id: "apt-3", name: "Applications screening process", stages: 11 },
  { id: "apt-4", name: "Delinquency Process", stages: 10 },
  { id: "apt-5", name: "Employee Onboarding Process", stages: 5 },
  { id: "apt-6", name: "Employee Termination Process", stages: 3 },
  { id: "apt-7", name: "Employee Training Process", stages: 21 },
  { id: "apt-8", name: "EOM Accounting Process for Month", stages: 4 },
  { id: "apt-9", name: "Escalated Owner Funds Collection Process", stages: 5 },
  { id: "apt-10", name: "Eviction Process", stages: 10 },
  { id: "apt-11", name: "Haro PM", stages: 3 },
  { id: "apt-12", name: "Hiring Requisition Process", stages: 8 },
  { id: "apt-13", name: "Lease Renewal Process", stages: 10 },
  { id: "apt-14", name: "Legal Cases Complaints and Notices", stages: 8 },
  { id: "apt-15", name: "Make Ready Process", stages: 9 },
] as const

// Stage progress bar colors (13 cubes: 1 amber, 9 greens, 3 reds)
export const STAGE_PROGRESS_COLORS = [
  "rgb(235, 186, 93)",
  "#D5F5E3",
  "#ABEBC6",
  "#82E0AA",
  "#58D68D",
  "#2ECC71",
  "#27AE60",
  "#1E8449",
  "#196F3D",
  "#145A32",
  "#F5918A",
  "#E74C3C",
  "#B71C1C",
] as const

// Map legacy stage names to new 13-step indices
export const LEGACY_STAGE_MAP: Record<string, number> = {
  "new lead": 0,
  "new prospects": 0,
  "attempting to contact": 0,
  "scheduled intro call": 1,
  "scheduled showing": 1,
  "working": 4,
  "under review": 6,
  "closing": 8,
  "new client": 9,
  "lost": 12,
  "disqualified": 12,
  "application approved – lease sent": 7,
  "application approved - lease sent": 7,
}

export function resolveStageIndex(stageName: string): number {
  const exactIndex = STAGES.findIndex((s) => s.toLowerCase() === stageName.toLowerCase())
  if (exactIndex >= 0) return exactIndex
  const legacyIndex = LEGACY_STAGE_MAP[stageName.toLowerCase()]
  if (legacyIndex !== undefined) return legacyIndex
  return 0
}

export interface StaffListItem {
  id: string
  name: string
  initials: string
  role: string
  department: string
}

export const STAFF_LIST: StaffListItem[] = [
  { id: "1", name: "Richard Surovi", initials: "RS", role: "Lead Agent", department: "Sales" },
  { id: "2", name: "Sarah Johnson", initials: "SJ", role: "Property Manager", department: "Property Management" },
  { id: "3", name: "Michael Chen", initials: "MC", role: "Sales Associate", department: "Sales" },
  { id: "4", name: "Emily Davis", initials: "ED", role: "Leasing Agent", department: "Leasing" },
  { id: "5", name: "James Wilson", initials: "JW", role: "Marketing Specialist", department: "Marketing" },
  { id: "6", name: "Nina Patel", initials: "NP", role: "Accountant", department: "Accounting" },
  { id: "7", name: "Laura Taylor", initials: "LT", role: "Senior Accountant", department: "Accounting" },
  { id: "8", name: "David Brown", initials: "DB", role: "Maintenance Lead", department: "Maintenance" },
]

export const DEPARTMENTS = ["Sales", "Accounting", "Property Management", "Leasing", "Marketing", "Maintenance"] as const

export const prospectDetailTabs = [
  { id: "overview", label: "Overview" },
  { id: "background", label: "Background & Screening" },
  { id: "financial", label: "Financial" },
  { id: "household", label: "Household" },
  { id: "activity", label: "Activity & History" },
] as const

export const recentMessagesMock = [
  { id: 1, type: "sms", sender: "Diana Prince", senderType: "prospect", message: "Thank you for the update on the application...", time: "2h ago" },
  { id: 2, type: "email", sender: "Diana Prince", senderType: "prospect", message: "RE: Application Status - I have reviewed the charges and...", time: "1d ago" },
  { id: 3, type: "call", sender: "Nina Patel", senderType: "staff", message: "Discussed document requirements for the application", time: "3d ago" },
  { id: 4, type: "sms", sender: "Diana Prince", senderType: "prospect", message: "Can I schedule a viewing for next week?", time: "5d ago" },
] as const

export const auditLogMock = [
  { date: "11/18/2025 12:34 AM", action: "Changed Status from New to Decision Pending", by: "George Guraya" },
  { date: "11/18/2025 12:34 AM", action: "Created Rental Application for Diana Prince", by: "George Guraya" },
] as const

export const prospectDocumentsMock = [
  { id: 1, name: "Rental Application", type: "Application", property: "Harbor View Apartments", dateShared: "12/20/2025", status: "Submitted" },
  { id: 2, name: "Proof of Income", type: "Financial", property: "Harbor View Apartments", dateShared: "12/22/2025", status: "Pending Review" },
  { id: 3, name: "ID Verification", type: "Identity", property: "Downtown Loft", dateShared: "12/18/2025", status: "Verified" },
  { id: 4, name: "Employment Letter", type: "Financial", property: "Harbor View Apartments", dateShared: "12/23/2025", status: "Requested" },
] as const

export const prospectAuditLogsMock = [
  { id: "1", dateTime: "Jan 18, 2026 – 10:42 AM", user: "Sarah M", userRole: "CSR", actionType: "Updated", entity: "Prospect Profile", description: "Updated primary phone number from (555) 111-2222 to (555) 123-4567", source: "Web App" },
  { id: "2", dateTime: "Jan 17, 2026 – 3:15 PM", user: "System", userRole: "Automation", actionType: "Status Changed", entity: "Prospect Profile", description: "Prospect moved from New Lead to Working stage", source: "System Automation" },
  { id: "3", dateTime: "Jan 16, 2026 – 11:30 AM", user: "Mike D", userRole: "Property Manager", actionType: "Created", entity: "Attachments", description: "Uploaded proof of income document", source: "Web App" },
  { id: "4", dateTime: "Jan 15, 2026 – 2:45 PM", user: "Nina P", userRole: "Admin", actionType: "Updated", entity: "Application", description: "Updated rental application with co-signer information", source: "Web App" },
  { id: "5", dateTime: "Jan 14, 2026 – 9:20 AM", user: "Richard S", userRole: "Leasing Agent", actionType: "Assignment Changed", entity: "Tasks", description: "Reassigned task 'Schedule property tour' to Sarah M", source: "Mobile App" },
  { id: "6", dateTime: "Jan 12, 2026 – 4:30 PM", user: "Sarah M", userRole: "CSR", actionType: "Created", entity: "Properties", description: "Added property interest 'Harbor View Apartments'", source: "Web App" },
  { id: "7", dateTime: "Jan 10, 2026 – 10:15 AM", user: "Mike D", userRole: "Property Manager", actionType: "Updated", entity: "Notes", description: "Edited note regarding move-in date preferences", source: "Web App" },
  { id: "8", dateTime: "Jan 8, 2026 – 1:00 PM", user: "Nina P", userRole: "Admin", actionType: "Deleted", entity: "Attachments", description: "Removed duplicate ID document upload", source: "Web App" },
  { id: "9", dateTime: "Jan 5, 2026 – 11:45 AM", user: "System", userRole: "Automation", actionType: "Viewed", entity: "Prospect Profile", description: "Prospect profile accessed via tenant portal", source: "System Automation" },
  { id: "10", dateTime: "Jan 3, 2026 – 9:00 AM", user: "Richard S", userRole: "Leasing Agent", actionType: "Created", entity: "Prospect Profile", description: "Prospect record created from website inquiry", source: "Web App" },
  { id: "11", dateTime: "Jan 11, 2026 – 2:18 PM", user: "Sarah M", userRole: "CSR", actionType: "Deleted", entity: "Notes", description: "Deleted note: 'Follow-up reminder for property tour'", source: "Web App", deletedNoteContent: "Follow-up reminder for property tour scheduled for next Tuesday at 3 PM.", deletedBy: "Sarah M", deletedOn: "Jan 11, 2026 – 2:18 PM" },
  { id: "12", dateTime: "Jan 6, 2026 – 9:45 AM", user: "Richard S", userRole: "Leasing Agent", actionType: "Deleted", entity: "Notes", description: "Deleted note: 'Initial contact notes - incorrect information'", source: "Mobile App", deletedNoteContent: "Initial contact via phone. Prospect expressed interest in 2BR units at Harbor View.", deletedBy: "Richard S", deletedOn: "Jan 6, 2026 – 9:45 AM" },
  { id: "13", dateTime: "Dec 28, 2025 – 4:30 PM", user: "Mike D", userRole: "Property Manager", actionType: "Deleted", entity: "Notes", description: "Deleted note: 'Duplicate entry - income verification'", source: "Web App", deletedNoteContent: "Income verification received.", deletedBy: "Mike D", deletedOn: "Dec 28, 2025 – 4:30 PM" },
]

export const prospectTaskStaffMembersMock = [
  { id: "1", name: "Nina Patel", role: "Leasing Agent" },
  { id: "2", name: "John Smith", role: "CSR" },
  { id: "3", name: "Sarah Johnson", role: "Property Manager" },
  { id: "4", name: "Michael Chen", role: "Maintenance Coordinator" },
  { id: "5", name: "Emily Davis", role: "CSR" },
  { id: "6", name: "Richard Surovi", role: "Leasing Agent" },
] as const

export const prospectPropertyUnitsMock: Record<string, string[]> = {
  "Harbor View Complex": ["Unit 101", "Unit 102", "Unit 201", "Unit 202", "Unit 301", "Unit 302"],
  "Downtown Lofts": ["Unit 301", "Unit 302", "Unit 401", "Unit 402"],
  "Sunset Apartments": ["Unit A", "Unit B", "Unit C"],
  "Skyline Towers": [],
}

// Available properties for lease prospect "interested properties" and add-property modal
export const ALL_AVAILABLE_PROPERTIES = [
  { id: 1, name: "Sunset Apartments", address: "1234 Sunset Blvd, Los Angeles, CA 90028", type: "Multi Family", bedrooms: 2, bathrooms: 1, sqft: 950, rent: 2400, available: "Available Now", unit: "Unit 12B", image: "/sunset-apartment-building.jpg", amenities: ["Pool", "Gym", "Parking"], ownerName: "Emma Wilson", deposit: 2400, status: "Available" },
  { id: 2, name: "Oakwood Residence", address: "567 Oak Street, San Francisco, CA 94102", type: "Multi Family", bedrooms: 1, bathrooms: 1, sqft: 750, rent: 2100, available: "Available 02/01", unit: "Unit 3A", image: "/oakwood-residence-building.jpg", amenities: ["Laundry", "Parking", "Pet Friendly"], ownerName: "Sarah Lee", deposit: 2100, status: "Pending" },
  { id: 3, name: "Metro Plaza", address: "456 Metro Blvd, Portland, OR 97201", type: "Multi Family", bedrooms: 2, bathrooms: 2, sqft: 1050, rent: 2600, available: "Available Now", unit: "Unit 507", image: "/metro-plaza-apartment.jpg", amenities: ["Gym", "Rooftop", "Concierge"], ownerName: "Sarah Lee", deposit: 2600, status: "Available" },
  { id: 4, name: "Harbor View Complex", address: "321 Harbor Dr, San Diego, CA 92101", type: "Multi Family", bedrooms: 2, bathrooms: 2, sqft: 1100, rent: 2800, available: "Available Now", unit: "Unit 405", image: "/modern-apartment-building-harbor-view.jpg", amenities: ["Pool", "Gym", "Parking", "Laundry"], ownerName: "Emma Wilson", deposit: 2800, status: "Available" },
  { id: 5, name: "Riverside Apartments", address: "789 River Rd, Austin, TX 78701", type: "Multi Family", bedrooms: 3, bathrooms: 2, sqft: 1400, rent: 3200, available: "Available 01/15", unit: "Unit 201", image: "/riverside-apartments.png", amenities: ["Pool", "Gym", "Pet Friendly", "Balcony"], ownerName: "Linda Martinez", deposit: 3200, status: "Available" },
  { id: 6, name: "Lakeside Villas", address: "234 Lake Dr, Chicago, IL 60601", type: "Multi Family", bedrooms: 2, bathrooms: 2, sqft: 1200, rent: 2900, available: "Available Now", unit: "Unit 1102", image: "/lakeside-villas.jpg", amenities: ["Pool", "Gym", "Concierge", "Parking"], ownerName: "Robert Taylor", deposit: 2900, status: "Available" },
  { id: 9, name: "Downtown Lofts", address: "890 Main St, Boston, MA 02108", type: "Multi Family", bedrooms: 1, bathrooms: 1, sqft: 850, rent: 2200, available: "Available 01/15", unit: "Unit 302", image: "/modern-downtown-loft.png", amenities: ["Rooftop", "Concierge", "Parking"], ownerName: "Michael Chen", deposit: 2200, status: "Pending" },
  { id: 10, name: "Skyline Towers", address: "321 Sky Blvd, Dallas, TX 75201", type: "Multi Family", bedrooms: 2, bathrooms: 2, sqft: 1150, rent: 2700, available: "Available Now", unit: "Unit 2401", image: "/skyline-towers-dallas.jpg", amenities: ["Pool", "Gym", "Rooftop", "Concierge"], ownerName: "Emma Wilson", deposit: 2700, status: "Available" },
]

export const initialApplicant = {
  name: "Diana Prince",
  type: "Financially Responsible",
  phone: "9876543210",
  email: "dprince@mail.com",
  status: "Decision Pending",
  unit: "8 SH - 3 - 8",
  listingStatus: "Not Posted",
  vacantOn: "Not Vacant",
  desiredMoveIn: "12/01/2025",
  screeningStatus: "Not Done",
  assignedUser: "--",
  receivedDate: "11/18/2025 12:34 AM",
  receivedBy: "George Guraya",
  residentialHistory: "almost 45 years provided",
  totalMonthlyIncome: "None provided",
  dependents: "No",
  pets: "No",
  attachments: "No",
  dob: "09/04/1995",
  ssn: "XXX-XX-9854",
  governmentId: "--",
  issuingState: "--",
}

export const initialResidentialHistory = {
  occupancyType: "Owner",
  currentAddress: "1234 Elm Street Springfield\nSpringfield, IL 62704",
  resided: "From February 1981 to Present",
  monthlyPayment: "--",
  landlord: "N/A - Owner at this address",
  reasonForLeaving: "--",
}

export const initialBankAccounts = [
  { name: "John brown", type: "Savings", accountNumber: "22990015090090448", balance: "50,000.00" },
]

export const initialCreditCards = [{ issuer: "American Bank", balance: "100,000.00" }]

export const initialInterestedProperties = [
  { id: 4, name: "Harbor View Complex", address: "321 Harbor Dr, San Diego, CA 92101", type: "Multi Family", bedrooms: 2, bathrooms: 2, sqft: 1100, rent: 2800, available: "Available Now", unit: "Unit 405", image: "/modern-apartment-building-harbor-view.jpg", amenities: ["Pool", "Gym", "Parking", "Laundry"], ownerName: "Emma Wilson", deposit: 2800, status: "Available" },
  { id: 9, name: "Downtown Lofts", address: "890 Main St, Boston, MA 02108", type: "Multi Family", bedrooms: 1, bathrooms: 1, sqft: 850, rent: 2200, available: "Available 01/15", unit: "Unit 302", image: "/modern-downtown-loft.png", amenities: ["Rooftop", "Concierge", "Parking"], ownerName: "Michael Chen", deposit: 2200, status: "Pending" },
]

export const initialProspectTasks = [
  { id: 1, title: "Review rental application - Sarah Johnson", processName: "Lease Prospect Onboarding", relatedEntityType: "Lease Prospect", relatedEntityName: "Sarah Johnson", assignee: "Nina Patel", dueDate: "2025-12-20", priority: "High", status: "Pending" as const, isOverdue: true },
  { id: 2, title: "Send lease agreement - Unit 305", processName: "New Lease Signing", relatedEntityType: "Lease Prospect", relatedEntityName: "Unit 305", assignee: "Sarah Chen", dueDate: "2025-12-21", priority: "High", status: "In Progress" as const, isOverdue: true },
  { id: 3, title: "Schedule property showing", processName: "Lease Prospect Onboarding", relatedEntityType: "Property", relatedEntityName: "Sunset Villa", assignee: "Richard Surovi", dueDate: "2025-12-23", priority: "High", status: "Pending" as const, isOverdue: false },
  { id: 4, title: "Follow up with prospect - Unit 204", processName: "Lease Renewal Process", relatedEntityType: "Tenant", relatedEntityName: "John Smith", assignee: "Nina Patel", dueDate: "2025-12-23", priority: "Medium", status: "Pending" as const, isOverdue: false },
  { id: 5, title: "Verify employment documents", processName: "", relatedEntityType: "Lease Prospect", relatedEntityName: "Sarah Johnson", assignee: "Mike Johnson", dueDate: "2025-12-24", priority: "Medium", status: "In Progress" as const, isOverdue: false },
  { id: 6, title: "Call about viewing feedback", processName: "Lease Prospect Outreach", relatedEntityType: "Lease Prospect", relatedEntityName: "Emily Brown", assignee: "Richard Surovi", dueDate: "2025-12-25", priority: "Low", status: "Skipped" as const, isOverdue: false },
  { id: 7, title: "Respond to inquiry", processName: "", relatedEntityType: "Lease Prospect", relatedEntityName: "Robert Garcia", assignee: "Nina Patel", dueDate: "2025-12-24", priority: "Low", status: "Pending" as const, isOverdue: false, autoCreated: true },
]

// Re-export for convenience
export { getActivitiesData } from "./getActivitiesData"
export { leaseProspectProcesses } from "./leaseProspectProcesses"
