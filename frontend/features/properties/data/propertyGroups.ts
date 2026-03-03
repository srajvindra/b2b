import type { AssignedTeamMember, Department, StaffMember } from "../types"

export const initialAssignedTeam: AssignedTeamMember[] = [
  { id: "1", name: "Richard Surovi", email: "richard.surovi@company.com", role: "CSR", assignedOn: "Jan 12, 2026" },
  { id: "2", name: "Nina Patel", email: "nina.patel@company.com", role: "Property Manager", assignedOn: "Jan 10, 2026" },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Maintenance Coordinator",
    assignedOn: "Jan 10, 2026",
  },
  { id: "4", name: "Mike Chen", email: "mike.chen@company.com", role: "Accountant", assignedOn: "Jan 8, 2026" },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Admin Assistant",
    assignedOn: "Jan 5, 2026",
  },
  { id: "6", name: "James Wilson", email: "james.wilson@company.com", role: "Leasing Agent", assignedOn: "Jan 3, 2026" },
]

export const allStaffMembers = [
  { id: "1", name: "Richard Surovi", email: "richard.surovi@company.com" },
  { id: "2", name: "Nina Patel", email: "nina.patel@company.com" },
  { id: "3", name: "Sarah Johnson", email: "sarah.johnson@company.com" },
  { id: "4", name: "Mike Chen", email: "mike.chen@company.com" },
  { id: "5", name: "Emily Davis", email: "emily.davis@company.com" },
  { id: "6", name: "James Wilson", email: "james.wilson@company.com" },
  { id: "7", name: "David Brown", email: "david.brown@company.com" },
  { id: "8", name: "Lisa Anderson", email: "lisa.anderson@company.com" },
  { id: "9", name: "Robert Taylor", email: "robert.taylor@company.com" },
  { id: "10", name: "Jennifer Martinez", email: "jennifer.martinez@company.com" },
]

export const departments: Department[] = [
  {
    id: "pm",
    name: "Property Management",
    staff: [
      { id: "pm1", name: "Nina Patel", email: "nina.patel@company.com", role: "Senior Property Manager" },
      { id: "pm2", name: "John Smith", email: "john.smith@company.com", role: "Property Manager" },
      { id: "pm3", name: "Sarah Mitchell", email: "sarah.mitchell@company.com", role: "Property Manager" },
      { id: "pm4", name: "David Chen", email: "david.chen@company.com", role: "Property Manager" },
    ],
  },
  {
    id: "maint",
    name: "Maintenance",
    staff: [
      { id: "m1", name: "Mike Johnson", email: "mike.johnson@company.com", role: "Maintenance Supervisor" },
      { id: "m2", name: "Robert Taylor", email: "robert.taylor@company.com", role: "Maintenance Technician" },
      { id: "m3", name: "James Brown", email: "james.brown@company.com", role: "Maintenance Technician" },
    ],
  },
  {
    id: "leasing",
    name: "Leasing",
    staff: [
      { id: "l1", name: "Emily Davis", email: "emily.davis@company.com", role: "Leasing Manager" },
      { id: "l2", name: "Lisa Thompson", email: "lisa.thompson@company.com", role: "Leasing Agent" },
      { id: "l3", name: "Amanda Wilson", email: "amanda.wilson@company.com", role: "Leasing Agent" },
    ],
  },
  {
    id: "accounting",
    name: "Accounting",
    staff: [
      { id: "a1", name: "Mike Chen", email: "mike.chen@company.com", role: "Senior Accountant" },
      { id: "a2", name: "Jennifer Martinez", email: "jennifer.martinez@company.com", role: "Accountant" },
      { id: "a3", name: "Kevin Lee", email: "kevin.lee@company.com", role: "Accounts Payable" },
    ],
  },
  {
    id: "admin",
    name: "Administration",
    staff: [
      { id: "ad1", name: "Richard Surovi", email: "richard.surovi@company.com", role: "CSR" },
      { id: "ad2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Administrative Assistant" },
      { id: "ad3", name: "David Brown", email: "david.brown@company.com", role: "Office Manager" },
    ],
  },
]

export const MOCK_STAFF: StaffMember[] = [
  { id: "1", name: "John Smith", email: "john.smith@heropm.com", phone: "+1 (555) 123-4567", role: "Property Manager" },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@heropm.com",
    phone: "+1 (555) 234-5678",
    role: "Senior Property Manager",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@heropm.com",
    phone: "+1 (555) 345-6789",
    role: "Property Manager",
  },
  {
    id: "4",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@heropm.com",
    phone: "+1 (555) 456-7890",
    role: "Property Manager",
  },
  {
    id: "5",
    name: "David Chen",
    email: "david.chen@heropm.com",
    phone: "+1 (555) 567-8901",
    role: "Senior Property Manager",
  },
  {
    id: "6",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@heropm.com",
    phone: "+1 (555) 678-9012",
    role: "Property Manager",
  },
  {
    id: "7",
    name: "James Wilson",
    email: "james.wilson@heropm.com",
    phone: "+1 (555) 789-0123",
    role: "Regional Manager",
  },
  {
    id: "8",
    name: "Lisa Thompson",
    email: "lisa.thompson@heropm.com",
    phone: "+1 (555) 890-1234",
    role: "Property Manager",
  },
]

