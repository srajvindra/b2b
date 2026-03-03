"use client"

import React from "react"

import { useState } from "react"
import {
  Search,
  Building2,
  MapPin,
  Users,
  Home,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Mail,
  Phone,
  Check,
  Plus,
  ArrowLeft,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useNav } from "@/app/dashboard/page"

type Property = {
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

type StaffMember = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string
}

// Assigned team member type for the popup
interface AssignedTeamMember {
  id: string
  name: string
  email: string
  role: string
  assignedOn: string
}

// Get area/city from address
const getAreaFromAddress = (address: string): string => {
  const parts = address.split(",")
  if (parts.length >= 2) {
    return parts[1].trim() // Return city name
  }
  return "Other"
}

// Initial assigned team for properties
const initialAssignedTeam: AssignedTeamMember[] = [
  { id: "1", name: "Richard Surovi", email: "richard.surovi@company.com", role: "CSR", assignedOn: "Jan 12, 2026" },
  { id: "2", name: "Nina Patel", email: "nina.patel@company.com", role: "Property Manager", assignedOn: "Jan 10, 2026" },
  { id: "3", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Maintenance Coordinator", assignedOn: "Jan 10, 2026" },
  { id: "4", name: "Mike Chen", email: "mike.chen@company.com", role: "Accountant", assignedOn: "Jan 8, 2026" },
  { id: "5", name: "Emily Davis", email: "emily.davis@company.com", role: "Admin Assistant", assignedOn: "Jan 5, 2026" },
  { id: "6", name: "James Wilson", email: "james.wilson@company.com", role: "Leasing Agent", assignedOn: "Jan 3, 2026" },
]

// All available staff for reassignment
const allStaffMembers = [
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

// Departments with staff members
interface DepartmentStaff {
  id: string
  name: string
  email: string
  role: string
}

interface Department {
  id: string
  name: string
  staff: DepartmentStaff[]
}

const departments: Department[] = [
  {
    id: "pm",
    name: "Property Management",
    staff: [
      { id: "pm1", name: "Nina Patel", email: "nina.patel@company.com", role: "Senior Property Manager" },
      { id: "pm2", name: "John Smith", email: "john.smith@company.com", role: "Property Manager" },
      { id: "pm3", name: "Sarah Mitchell", email: "sarah.mitchell@company.com", role: "Property Manager" },
      { id: "pm4", name: "David Chen", email: "david.chen@company.com", role: "Property Manager" },
    ]
  },
  {
    id: "maint",
    name: "Maintenance",
    staff: [
      { id: "m1", name: "Mike Johnson", email: "mike.johnson@company.com", role: "Maintenance Supervisor" },
      { id: "m2", name: "Robert Taylor", email: "robert.taylor@company.com", role: "Maintenance Technician" },
      { id: "m3", name: "James Brown", email: "james.brown@company.com", role: "Maintenance Technician" },
    ]
  },
  {
    id: "leasing",
    name: "Leasing",
    staff: [
      { id: "l1", name: "Emily Davis", email: "emily.davis@company.com", role: "Leasing Manager" },
      { id: "l2", name: "Lisa Thompson", email: "lisa.thompson@company.com", role: "Leasing Agent" },
      { id: "l3", name: "Amanda Wilson", email: "amanda.wilson@company.com", role: "Leasing Agent" },
    ]
  },
  {
    id: "accounting",
    name: "Accounting",
    staff: [
      { id: "a1", name: "Mike Chen", email: "mike.chen@company.com", role: "Senior Accountant" },
      { id: "a2", name: "Jennifer Martinez", email: "jennifer.martinez@company.com", role: "Accountant" },
      { id: "a3", name: "Kevin Lee", email: "kevin.lee@company.com", role: "Accounts Payable" },
    ]
  },
  {
    id: "admin",
    name: "Administration",
    staff: [
      { id: "ad1", name: "Richard Surovi", email: "richard.surovi@company.com", role: "CSR" },
      { id: "ad2", name: "Sarah Johnson", email: "sarah.johnson@company.com", role: "Administrative Assistant" },
      { id: "ad3", name: "David Brown", email: "david.brown@company.com", role: "Office Manager" },
    ]
  },
]

// Helper to get initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const MOCK_STAFF: StaffMember[] = [
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

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "1234 Sunset Blvd, Los Angeles, CA 90028",
    type: "Multi-Family",
    units: 24,
    hasVacancy: true,
    ownerName: "Emma Wilson",
    dateAdded: "2024-01-15",
    staffName: "John Smith",
  },
  {
    id: "2",
    name: "Oakwood Residence",
    address: "567 Oak Street, San Francisco, CA 94102",
    type: "Multi-Family",
    units: 12,
    hasVacancy: true,
    ownerName: "Sarah Lee",
    dateAdded: "2024-02-20",
    staffName: "Jane Doe",
  },
  {
    id: "3",
    name: "Pine Street Homes",
    address: "890 Pine Ave, Seattle, WA 98101",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "Linda Martinez",
    dateAdded: "2024-03-10",
    staffName: "Mike Johnson",
  },
  {
    id: "4",
    name: "Harbor View Complex",
    address: "321 Harbor Dr, San Diego, CA 92101",
    type: "Multi-Family",
    units: 36,
    hasVacancy: false,
    ownerName: "Emma Wilson",
    dateAdded: "2023-11-05",
    staffName: "John Smith",
  },
  {
    id: "5",
    name: "Metro Plaza",
    address: "456 Metro Blvd, Portland, OR 97201",
    type: "Multi-Family",
    units: 18,
    hasVacancy: true,
    ownerName: "Sarah Lee",
    dateAdded: "2024-04-01",
    staffName: "Jane Doe",
  },
  {
    id: "6",
    name: "Riverside Apartments",
    address: "789 River Rd, Austin, TX 78701",
    type: "Multi-Family",
    units: 28,
    hasVacancy: true,
    ownerName: "Linda Martinez",
    dateAdded: "2024-05-12",
    staffName: "Mike Johnson",
  },
  {
    id: "7",
    name: "Lakeside Villas",
    address: "234 Lake Dr, Chicago, IL 60601",
    type: "Multi-Family",
    units: 45,
    hasVacancy: true,
    ownerName: "Robert Taylor",
    dateAdded: "2023-09-18",
    staffName: "Sarah Mitchell",
  },
  {
    id: "8",
    name: "Mountain View Estates",
    address: "567 Summit Rd, Denver, CO 80202",
    type: "Multi-Family",
    units: 32,
    hasVacancy: false,
    ownerName: "Emma Wilson",
    dateAdded: "2024-01-28",
    staffName: "John Smith",
  },
  {
    id: "9",
    name: "Downtown Lofts",
    address: "890 Main St, Boston, MA 02108",
    type: "Multi-Family",
    units: 16,
    hasVacancy: true,
    ownerName: "Michael Chen",
    dateAdded: "2024-06-05",
    staffName: "Jane Doe",
  },
  {
    id: "10",
    name: "Coastal Residences",
    address: "123 Beach Blvd, Miami, FL 33139",
    type: "Multi-Family",
    units: 52,
    hasVacancy: false,
    ownerName: "Sarah Lee",
    dateAdded: "2023-12-20",
    staffName: "Mike Johnson",
  },
  {
    id: "11",
    name: "Garden Terrace",
    address: "456 Garden Way, Phoenix, AZ 85001",
    type: "Multi-Family",
    units: 20,
    hasVacancy: true,
    ownerName: "Linda Martinez",
    dateAdded: "2024-02-14",
    staffName: "Sarah Mitchell",
  },
  {
    id: "12",
    name: "Heritage Manor",
    address: "789 Heritage Ave, Philadelphia, PA 19102",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "Robert Taylor",
    dateAdded: "2024-03-22",
    staffName: "John Smith",
  },
  {
    id: "13",
    name: "Skyline Towers",
    address: "321 Sky Blvd, Dallas, TX 75201",
    type: "Multi-Family",
    units: 64,
    hasVacancy: true,
    ownerName: "Emma Wilson",
    dateAdded: "2023-10-10",
    staffName: "Jane Doe",
  },
  {
    id: "14",
    name: "Willow Creek",
    address: "654 Willow Ln, Nashville, TN 37201",
    type: "Multi-Family",
    units: 14,
    hasVacancy: false,
    ownerName: "Michael Chen",
    dateAdded: "2024-04-18",
    staffName: "Mike Johnson",
  },
  {
    id: "15",
    name: "Valley View Apartments",
    address: "369 Valley Rd, Las Vegas, NV 89101",
    type: "Multi-Family",
    units: 42,
    hasVacancy: true,
    ownerName: "Sarah Lee",
    dateAdded: "2024-05-25",
    staffName: "Mike Johnson",
  },
  {
    id: "16",
    name: "Spring Gardens",
    address: "987 Spring St, Atlanta, GA 30301",
    type: "Multi-Family",
    units: 22,
    hasVacancy: true,
    ownerName: "Linda Martinez",
    dateAdded: "2024-06-10",
    staffName: "Sarah Mitchell",
  },
  {
    id: "17",
    name: "Parkside Commons",
    address: "147 Park Ave, Minneapolis, MN 55401",
    type: "Multi-Family",
    units: 38,
    hasVacancy: false,
    ownerName: "Robert Taylor",
    dateAdded: "2024-01-05",
    staffName: "John Smith",
  },
  {
    id: "18",
    name: "Broadway Plaza",
    address: "852 Broadway, New York, NY 10003",
    type: "Multi-Family",
    units: 58,
    hasVacancy: true,
    ownerName: "Emma Wilson",
    dateAdded: "2023-08-15",
    staffName: "John Smith",
  },
  {
    id: "19",
    name: "Summit Place",
    address: "486 Summit Ave, Columbus, OH 43201",
    type: "Multi-Family",
    units: 34,
    hasVacancy: false,
    ownerName: "Michael Chen",
    dateAdded: "2024-07-01",
    staffName: "John Smith",
  },
  {
    id: "20",
    name: "Maple Ridge",
    address: "258 Maple Dr, Detroit, MI 48201",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "Sarah Lee",
    dateAdded: "2024-03-30",
    staffName: "Jane Doe",
  },
  {
    id: "21",
    name: "Cedar Point",
    address: "963 Cedar Ave, Charlotte, NC 28201",
    type: "Multi-Family",
    units: 30,
    hasVacancy: false,
    ownerName: "Linda Martinez",
    dateAdded: "2024-02-28",
    staffName: "Jane Doe",
  },
  {
    id: "22",
    name: "Hillside Residence",
    address: "159 Hill St, Salt Lake City, UT 84101",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "Robert Taylor",
    dateAdded: "2024-04-22",
    staffName: "Mike Johnson",
  },
  {
    id: "23",
    name: "Riverside Heights",
    address: "741 River View, Portland, OR 97204",
    type: "Multi-Family",
    units: 26,
    hasVacancy: true,
    ownerName: "Emma Wilson",
    dateAdded: "2024-05-08",
    staffName: "Sarah Mitchell",
  },
  {
    id: "24",
    name: "Bay Shore Complex",
    address: "357 Bay Shore Dr, Tampa, FL 33602",
    type: "Multi-Family",
    units: 48,
    hasVacancy: true,
    ownerName: "Michael Chen",
    dateAdded: "2024-06-18",
    staffName: "Sarah Mitchell",
  },
  // Properties for David Chen
  {
    id: "25",
    name: "Pacific Heights Towers",
    address: "1200 Pacific Ave, San Francisco, CA 94115",
    type: "Multi-Family",
    units: 72,
    hasVacancy: true,
    ownerName: "William Park",
    dateAdded: "2024-01-10",
    staffName: "David Chen",
  },
  {
    id: "26",
    name: "Marina Bay Condos",
    address: "450 Marina Blvd, San Diego, CA 92101",
    type: "Multi-Family",
    units: 56,
    hasVacancy: false,
    ownerName: "Jennifer Liu",
    dateAdded: "2024-02-15",
    staffName: "David Chen",
  },
  {
    id: "27",
    name: "Golden Gate Apartments",
    address: "888 Golden Gate Ave, San Francisco, CA 94102",
    type: "Multi-Family",
    units: 40,
    hasVacancy: true,
    ownerName: "Robert Kim",
    dateAdded: "2024-03-20",
    staffName: "David Chen",
  },
  {
    id: "28",
    name: "Nob Hill Residence",
    address: "1500 Nob Hill Rd, San Francisco, CA 94109",
    type: "Multi-Family",
    units: 28,
    hasVacancy: false,
    ownerName: "Amanda Wong",
    dateAdded: "2024-04-05",
    staffName: "David Chen",
  },
  {
    id: "29",
    name: "Silicon Valley Suites",
    address: "2200 Tech Park Dr, San Jose, CA 95110",
    type: "Multi-Family",
    units: 64,
    hasVacancy: true,
    ownerName: "Steven Zhang",
    dateAdded: "2024-05-12",
    staffName: "David Chen",
  },
  // Properties for Emily Rodriguez
  {
    id: "30",
    name: "Desert Oasis",
    address: "3300 Desert Springs Rd, Phoenix, AZ 85004",
    type: "Multi-Family",
    units: 32,
    hasVacancy: true,
    ownerName: "Maria Garcia",
    dateAdded: "2024-01-22",
    staffName: "Emily Rodriguez",
  },
  {
    id: "31",
    name: "Sonoran Vista",
    address: "1800 Sonoran Blvd, Scottsdale, AZ 85251",
    type: "Multi-Family",
    units: 24,
    hasVacancy: false,
    ownerName: "Carlos Mendez",
    dateAdded: "2024-02-28",
    staffName: "Emily Rodriguez",
  },
  {
    id: "32",
    name: "Camelback Manor",
    address: "4500 Camelback Rd, Phoenix, AZ 85018",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "Isabella Torres",
    dateAdded: "2024-03-15",
    staffName: "Emily Rodriguez",
  },
  {
    id: "33",
    name: "Mesa Verde Apartments",
    address: "2100 Mesa Verde Way, Mesa, AZ 85201",
    type: "Multi-Family",
    units: 36,
    hasVacancy: true,
    ownerName: "Diego Ramirez",
    dateAdded: "2024-04-10",
    staffName: "Emily Rodriguez",
  },
  // Properties for James Wilson
  {
    id: "34",
    name: "Manhattan Heights",
    address: "500 Park Ave, New York, NY 10022",
    type: "Multi-Family",
    units: 120,
    hasVacancy: true,
    ownerName: "Alexander Sterling",
    dateAdded: "2023-11-15",
    staffName: "James Wilson",
  },
  {
    id: "35",
    name: "Brooklyn Bridge Lofts",
    address: "200 Water St, Brooklyn, NY 11201",
    type: "Multi-Family",
    units: 85,
    hasVacancy: false,
    ownerName: "Victoria Hayes",
    dateAdded: "2023-12-20",
    staffName: "James Wilson",
  },
  {
    id: "36",
    name: "Hudson River Towers",
    address: "100 Hudson St, Jersey City, NJ 07302",
    type: "Multi-Family",
    units: 96,
    hasVacancy: true,
    ownerName: "Benjamin Cole",
    dateAdded: "2024-01-25",
    staffName: "James Wilson",
  },
  {
    id: "37",
    name: "Central Park View",
    address: "750 Central Park West, New York, NY 10025",
    type: "Multi-Family",
    units: 68,
    hasVacancy: false,
    ownerName: "Olivia Martin",
    dateAdded: "2024-02-10",
    staffName: "James Wilson",
  },
  {
    id: "38",
    name: "SoHo Grand Apartments",
    address: "350 Broadway, New York, NY 10013",
    type: "Multi-Family",
    units: 44,
    hasVacancy: true,
    ownerName: "Daniel Foster",
    dateAdded: "2024-03-05",
    staffName: "James Wilson",
  },
  {
    id: "39",
    name: "Tribeca Terrace",
    address: "180 Greenwich St, New York, NY 10007",
    type: "Multi-Family",
    units: 52,
    hasVacancy: false,
    ownerName: "Sophie Anderson",
    dateAdded: "2024-04-12",
    staffName: "James Wilson",
  },
  // Properties for Lisa Thompson
  {
    id: "40",
    name: "Midwest Plaza",
    address: "800 Michigan Ave, Chicago, IL 60611",
    type: "Multi-Family",
    units: 38,
    hasVacancy: true,
    ownerName: "Thomas Baker",
    dateAdded: "2024-01-18",
    staffName: "Lisa Thompson",
  },
  {
    id: "41",
    name: "Lincoln Park Homes",
    address: "2400 Lincoln Ave, Chicago, IL 60614",
    type: "Multi-Family",
    units: 22,
    hasVacancy: false,
    ownerName: "Rachel Green",
    dateAdded: "2024-02-22",
    staffName: "Lisa Thompson",
  },
  {
    id: "42",
    name: "Wicker Park Studios",
    address: "1600 Milwaukee Ave, Chicago, IL 60622",
    type: "Multi-Family",
    units: 16,
    hasVacancy: true,
    ownerName: "Kevin Miller",
    dateAdded: "2024-03-28",
    staffName: "Lisa Thompson",
  },
  {
    id: "43",
    name: "River North Condos",
    address: "500 Orleans St, Chicago, IL 60654",
    type: "Multi-Family",
    units: 48,
    hasVacancy: false,
    ownerName: "Nancy Davis",
    dateAdded: "2024-04-15",
    staffName: "Lisa Thompson",
  },
  {
    id: "44",
    name: "Hyde Park Manor",
    address: "5500 Hyde Park Blvd, Chicago, IL 60615",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "George Clark",
    dateAdded: "2024-05-20",
    staffName: "Lisa Thompson",
  },
  // Additional properties (45-55) to reach ~50 total
  {
    id: "45",
    name: "South Beach Towers",
    address: "500 Ocean Dr, Miami, FL 33139",
    type: "Multi-Family",
    units: 88,
    hasVacancy: true,
    ownerName: "Isabella Sanchez",
    dateAdded: "2024-01-08",
    staffName: "John Smith",
  },
  {
    id: "46",
    name: "Brickell Heights",
    address: "1100 Brickell Ave, Miami, FL 33131",
    type: "Multi-Family",
    units: 76,
    hasVacancy: false,
    ownerName: "Marcus Johnson",
    dateAdded: "2024-02-12",
    staffName: "Jane Doe",
  },
  {
    id: "47",
    name: "Coconut Grove Villas",
    address: "3400 Main Hwy, Miami, FL 33133",
    type: "Multi-Family",
    units: 32,
    hasVacancy: true,
    ownerName: "Victoria Lee",
    dateAdded: "2024-03-18",
    staffName: "Mike Johnson",
  },
  {
    id: "48",
    name: "Wynwood Lofts",
    address: "2500 NW 2nd Ave, Miami, FL 33127",
    type: "Multi-Family",
    units: 48,
    hasVacancy: true,
    ownerName: "David Rodriguez",
    dateAdded: "2024-04-22",
    staffName: "Sarah Mitchell",
  },
  {
    id: "49",
    name: "Capitol Hill Apartments",
    address: "1000 E Pike St, Seattle, WA 98122",
    type: "Multi-Family",
    units: 54,
    hasVacancy: false,
    ownerName: "Rachel Kim",
    dateAdded: "2024-01-30",
    staffName: "John Smith",
  },
  {
    id: "50",
    name: "Belltown Residences",
    address: "2100 1st Ave, Seattle, WA 98121",
    type: "Multi-Family",
    units: 42,
    hasVacancy: true,
    ownerName: "Nathan Park",
    dateAdded: "2024-02-25",
    staffName: "Jane Doe",
  },
  {
    id: "51",
    name: "Fremont Flats",
    address: "3500 Fremont Ave N, Seattle, WA 98103",
    type: "Multi-Family",
    units: 26,
    hasVacancy: true,
    ownerName: "Amanda Chen",
    dateAdded: "2024-03-30",
    staffName: "Mike Johnson",
  },
  {
    id: "52",
    name: "Queen Anne Townhomes",
    address: "600 Queen Anne Ave N, Seattle, WA 98109",
    type: "Single-Family",
    units: 1,
    hasVacancy: false,
    ownerName: "Brian Walsh",
    dateAdded: "2024-04-28",
    staffName: "Sarah Mitchell",
  },
  {
    id: "53",
    name: "Pearl District Lofts",
    address: "1200 NW Glisan St, Portland, OR 97209",
    type: "Multi-Family",
    units: 46,
    hasVacancy: true,
    ownerName: "Michelle Taylor",
    dateAdded: "2024-01-15",
    staffName: "David Chen",
  },
  {
    id: "54",
    name: "Alberta Arts Apartments",
    address: "2800 NE Alberta St, Portland, OR 97211",
    type: "Multi-Family",
    units: 30,
    hasVacancy: false,
    ownerName: "Kevin Brown",
    dateAdded: "2024-02-18",
    staffName: "Emily Rodriguez",
  },
  {
    id: "55",
    name: "Hawthorne Commons",
    address: "3200 SE Hawthorne Blvd, Portland, OR 97214",
    type: "Multi-Family",
    units: 24,
    hasVacancy: true,
    ownerName: "Lisa Peterson",
    dateAdded: "2024-03-22",
    staffName: "James Wilson",
  },
]

// Selected team member for group creation
interface SelectedTeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
}

export default function PropertyGroupsPage() {
  const nav = useNav()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStaff, setExpandedStaff] = useState<string[]>(MOCK_STAFF.map((s) => s.id))
  
  // Team management modal state
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [assignedTeam, setAssignedTeam] = useState<AssignedTeamMember[]>(initialAssignedTeam)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  
  // Create new group state
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [propertySearchQuery, setPropertySearchQuery] = useState("")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<SelectedTeamMember[]>([])
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showTeamDropdown, setShowTeamDropdown] = useState(false)
  
  // Get unique areas from properties
  const getUniqueAreas = () => {
    const areas = new Set<string>()
    MOCK_PROPERTIES.forEach(p => {
      areas.add(getAreaFromAddress(p.address))
    })
    return Array.from(areas).sort()
  }
  
  // Get properties by area
  const getPropertiesByArea = (area: string) => {
    return MOCK_PROPERTIES.filter(p => getAreaFromAddress(p.address) === area)
  }
  
  // Expanded areas state
  const [expandedAreas, setExpandedAreas] = useState<string[]>(getUniqueAreas())
  
  const toggleAreaExpanded = (area: string) => {
    setExpandedAreas((prev) => 
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }
  
  const openTeamModal = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPropertyId(propertyId)
    setShowTeamModal(true)
  }

  const getPropertiesByStaff = (staffName: string) => {
    return MOCK_PROPERTIES.filter((p) => p.staffName === staffName)
  }

  const filteredStaff = MOCK_STAFF.filter((staff) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    const staffProperties = getPropertiesByStaff(staff.name)
    return (
      staff.name.toLowerCase().includes(searchLower) ||
      staff.email.toLowerCase().includes(searchLower) ||
      staffProperties.some(
        (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower),
      )
    )
  })

  const toggleExpanded = (staffId: string) => {
    setExpandedStaff((prev) => (prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]))
  }

  const handlePropertyClick = (propertyId: string) => {
    nav.go("propertyDetail", { id: propertyId })
  }

  const totalProperties = MOCK_PROPERTIES.length
  const totalUnits = MOCK_PROPERTIES.reduce((sum, p) => sum + p.units, 0)
  const totalVacancies = MOCK_PROPERTIES.filter((p) => p.hasVacancy).length

  // Filter properties for the dropdown
  const filteredPropertiesForSelection = MOCK_PROPERTIES.filter((p) => {
    if (!propertySearchQuery) return true
    const searchLower = propertySearchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(searchLower) ||
      p.address.toLowerCase().includes(searchLower)
    )
  })

  // Filter departments and staff for the dropdown
  const filteredDepartments = departments.filter((dept) => {
    if (!departmentSearchQuery) return true
    const searchLower = departmentSearchQuery.toLowerCase()
    return (
      dept.name.toLowerCase().includes(searchLower) ||
      dept.staff.some((s) => s.name.toLowerCase().includes(searchLower))
    )
  })

  // Toggle property selection
  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  // Add team member
  const addTeamMember = (staff: DepartmentStaff, departmentName: string) => {
    if (!selectedTeamMembers.find((m) => m.id === staff.id)) {
      setSelectedTeamMembers((prev) => [
        ...prev,
        { ...staff, department: departmentName },
      ])
    }
    setShowTeamDropdown(false)
    setDepartmentSearchQuery("")
    setSelectedDepartment(null)
  }

  // Remove team member
  const removeTeamMember = (memberId: string) => {
    setSelectedTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  // Handle create group
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name")
      return
    }
    if (selectedProperties.length === 0) {
      alert("Please select at least one property")
      return
    }
    // In a real app, this would save to the backend
    alert(`Group "${newGroupName}" created with ${selectedProperties.length} properties and ${selectedTeamMembers.length} team members!`)
    setShowCreateGroup(false)
    setNewGroupName("")
    setSelectedProperties([])
    setSelectedTeamMembers([])
  }

  // Create Group View
  if (showCreateGroup) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowCreateGroup(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-xl font-semibold">Create New Property Group</h1>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                placeholder="Enter property group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Properties Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Properties</label>
              <p className="text-sm text-muted-foreground">Search and select properties to add to this group</p>
              
              {/* Selected Properties Tags */}
              {selectedProperties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedProperties.map((propId) => {
                    const property = MOCK_PROPERTIES.find((p) => p.id === propId)
                    return property ? (
                      <Badge key={propId} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                        {property.name}
                        <button
                          type="button"
                          onClick={() => togglePropertySelection(propId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}

              {/* Property Search Dropdown */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={propertySearchQuery}
                    onChange={(e) => setPropertySearchQuery(e.target.value)}
                    onFocus={() => setShowPropertyDropdown(true)}
                    className="pl-9"
                  />
                </div>
                {showPropertyDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-64 overflow-auto">
                    {filteredPropertiesForSelection.length > 0 ? (
                      filteredPropertiesForSelection.map((property) => (
                        <div
                          key={property.id}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent ${
                            selectedProperties.includes(property.id) ? "bg-accent/50" : ""
                          }`}
                          onClick={() => togglePropertySelection(property.id)}
                        >
                          <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                            selectedProperties.includes(property.id) 
                              ? "bg-primary border-primary text-primary-foreground" 
                              : "border-input"
                          }`}>
                            {selectedProperties.includes(property.id) && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{property.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{property.address}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{property.units} Units</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No properties found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {showPropertyDropdown && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowPropertyDropdown(false)}
                >
                  Close dropdown
                </button>
              )}
            </div>

            {/* Team Assignment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Team Members</label>
              <p className="text-sm text-muted-foreground">Select department and staff members to assign to this group</p>
              
              {/* Selected Team Members */}
              {selectedTeamMembers.length > 0 && (
                <div className="space-y-2 mb-3">
                  {selectedTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{getInitials(member.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role} - {member.department}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Department/Staff Dropdown */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search departments or staff members..."
                    value={departmentSearchQuery}
                    onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                    onFocus={() => setShowTeamDropdown(true)}
                    className="pl-9"
                  />
                </div>
                {showTeamDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-80 overflow-auto">
                    {selectedDepartment ? (
                      // Show staff from selected department
                      <>
                        <div className="sticky top-0 bg-popover border-b px-3 py-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDepartment(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium">
                            {departments.find((d) => d.id === selectedDepartment)?.name}
                          </span>
                        </div>
                        {departments
                          .find((d) => d.id === selectedDepartment)
                          ?.staff.map((staff) => {
                            const isSelected = selectedTeamMembers.some((m) => m.id === staff.id)
                            return (
                              <div
                                key={staff.id}
                                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent ${
                                  isSelected ? "opacity-50" : ""
                                }`}
                                onClick={() => {
                                  if (!isSelected) {
                                    addTeamMember(staff, departments.find((d) => d.id === selectedDepartment)?.name || "")
                                  }
                                }}
                              >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">{getInitials(staff.name)}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{staff.name}</p>
                                  <p className="text-xs text-muted-foreground">{staff.role}</p>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                              </div>
                            )
                          })}
                      </>
                    ) : (
                      // Show departments
                      filteredDepartments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent"
                          onClick={() => setSelectedDepartment(dept.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{dept.name}</p>
                              <p className="text-xs text-muted-foreground">{dept.staff.length} members</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {showTeamDropdown && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    setShowTeamDropdown(false)
                    setSelectedDepartment(null)
                  }}
                >
                  Close dropdown
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowCreateGroup(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} className="bg-teal-600 hover:bg-teal-700 text-white">
                Create Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Property Groups</h1>
            <p className="text-sm text-muted-foreground">Properties organized by area/location</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Create new Group</span>
            </Button>
            <Button variant="outline" onClick={() => setExpandedAreas(getUniqueAreas())} className="bg-transparent">
              Expand All
            </Button>
            <Button variant="outline" onClick={() => setExpandedAreas([])} className="bg-transparent">
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b bg-card p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members or properties..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="space-y-4">
          {getUniqueAreas().filter(area => {
            if (!searchQuery) return true
            const searchLower = searchQuery.toLowerCase()
            const areaProperties = getPropertiesByArea(area)
            return (
              area.toLowerCase().includes(searchLower) ||
              areaProperties.some(
                (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
              )
            )
          }).map((area) => {
            const areaProperties = getPropertiesByArea(area)
            const isExpanded = expandedAreas.includes(area)
            const areaUnits = areaProperties.reduce((sum, p) => sum + p.units, 0)
            const areaVacancies = areaProperties.filter((p) => p.hasVacancy).length

            return (
              <Card key={area} className="overflow-hidden bg-[rgba(248,245,245,1)]">
                <CardHeader
                  className="cursor-pointer bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 hover:from-gray-100 hover:via-gray-150 hover:to-gray-100 transition-colors bg-[rgba(255,255,255,1)]"
                  onClick={() => toggleAreaExpanded(area)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-teal-600 text-white">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{area}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-muted-foreground">{areaProperties.length} properties in this area</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => openTeamModal(area, e)}
                            className="h-7 gap-1.5 text-xs font-normal bg-transparent"
                          >
                            <Users className="h-3.5 w-3.5 text-teal-600" />
                            <span>Assigned Team</span>
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-teal-100 text-teal-700">
                              {assignedTeam.length}
                            </Badge>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex gap-4 text-center">
                        <div className="px-4 py-2 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground">Properties</p>
                          <p className="text-xl font-bold text-gray-900">{areaProperties.length}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground">Units</p>
                          <p className="text-xl font-bold text-gray-900">{areaUnits}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground">Vacancies</p>
                          <p className="text-xl font-bold text-gray-900">{areaVacancies}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-4 bg-muted/30">
                    {areaProperties.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto mb-2 opacity-40" />
                        <p>No properties in this area</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {areaProperties.map((property) => (
                          <div
                            key={property.id}
                            onClick={() => handlePropertyClick(property.id)}
                            className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md bg-white border-gray-200 hover:border-gray-400"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{property.name}</h4>
                                <p className="text-xs flex items-center gap-1 text-gray-600 mt-1">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="line-clamp-1">{property.address}</span>
                                </p>
                              </div>
                              {property.hasVacancy ? (
                                <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 ml-2" />
                              ) : (
                                <XCircle className="h-5 w-5 shrink-0 text-gray-300 ml-2" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className="text-xs bg-gray-800 text-white hover:bg-gray-700">
                                {property.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Home className="h-3 w-3 mr-1" />
                                {property.units} {property.units === 1 ? "Unit" : "Units"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}

          {getUniqueAreas().filter(area => {
            if (!searchQuery) return true
            const searchLower = searchQuery.toLowerCase()
            const areaProperties = getPropertiesByArea(area)
            return (
              area.toLowerCase().includes(searchLower) ||
              areaProperties.some(
                (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
              )
            )
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No areas found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Management Modal */}
      <Dialog open={showTeamModal} onOpenChange={(open) => {
        setShowTeamModal(open)
        if (!open) {
          setEditingMemberId(null)
          setStaffSearchQuery("")
          setSelectedPropertyId(null)
        }
      }}>
        <DialogContent className="w-[900px] max-w-[95vw] sm:max-w-[900px] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Assigned Team
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                <colgroup>
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "15%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">User Role</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Assigned On</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assignedTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-medium flex-shrink-0">
                            {getInitials(member.name)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-3 align-middle">
                        <span className="text-sm text-slate-600 block truncate">{member.email}</span>
                      </td>
                      <td className="p-3 align-middle">
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground align-middle">{member.assignedOn}</td>
                      <td className="p-3 text-right align-middle">
                        {editingMemberId === member.id ? (
                          <Popover open={true} onOpenChange={(open) => {
                            if (!open) {
                              setEditingMemberId(null)
                              setStaffSearchQuery("")
                            }
                          }}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                Select
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[260px] p-0" align="end">
                              <Command>
                                <CommandInput 
                                  placeholder="Search by name or email..." 
                                  value={staffSearchQuery}
                                  onValueChange={setStaffSearchQuery}
                                />
                                <CommandList>
                                  <CommandEmpty>No staff found.</CommandEmpty>
                                  <CommandGroup>
                                    {allStaffMembers
                                      .filter(staff => 
                                        staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                                        staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase())
                                      )
                                      .map((staff) => (
                                        <CommandItem
                                          key={staff.id}
                                          value={`${staff.name} ${staff.email}`}
                                          onSelect={() => {
                                            setAssignedTeam(assignedTeam.map(m => 
                                              m.id === member.id 
                                                ? { ...m, name: staff.name, email: staff.email }
                                                : m
                                            ))
                                            setEditingMemberId(null)
                                            setStaffSearchQuery("")
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium">{staff.name}</span>
                                            <span className="text-xs text-muted-foreground">{staff.email}</span>
                                          </div>
                                          {member.name === staff.name && (
                                            <Check className="ml-auto h-4 w-4 text-teal-600" />
                                          )}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <button
                            type="button"
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            onClick={() => setEditingMemberId(member.id)}
                          >
                            Change
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setShowTeamModal(false)
              setEditingMemberId(null)
              setStaffSearchQuery("")
              setSelectedPropertyId(null)
            }} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                setShowTeamModal(false)
                setEditingMemberId(null)
                setStaffSearchQuery("")
                setSelectedPropertyId(null)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
