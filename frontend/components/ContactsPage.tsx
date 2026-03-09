"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  Clock,
  Wrench,
  Home,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Filter,
  MapPin,
  Briefcase,
  LayoutGrid,
  List,
  RotateCcw,
  Tag,
  AlertTriangle,
  XCircle,
  FileText,
  Settings,
  MessageSquare,
  PhoneCall,
  StickyNote,
  CalendarPlus,
  UserRoundCog,
  LogOut,
  Gavel,
  UserPlus,
  Send,
  Star,
  ClipboardList,
  BarChart3,
  ListChecks,
  CheckSquare,
  Layers,
  X,
} from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BulkActionBar } from "@/components/bulk-action-bar"
// --- Mock Data ---

type ContactType = "Owner" | "Tenant" | "Vendor" | "Property Technician" | "Leasing Agent"
type ContactStatus = "Active" | "Inactive" | "Pending"

export interface Contact {
  id: string
  name: string
  type: ContactType
  email: string
  phone: string
  avatar?: string
  properties: string[]
  status: ContactStatus
  lastActive: string
  assignedStaff: string
  location: string
  specialty?: string // For vendors and technicians
  company?: string // For vendors
  units?: number // Number of units for Owners/Tenants
  companyLlc?: string // Company / LLC for Owners
  csm?: string // CSM assigned to Owner
  tags?: string[] // Owner tags/groups
  pendingTasks?: number // Pending tasks count for Owners
  pendingProcesses?: number // Pending processes count for Owners
  terminationStatus?: "Under Termination" | "Terminated Hidden" // Termination status for Owners
  // Tenant-specific fields
  tenantTags?: string[]
  tenantPendingTasks?: number
  tenantPendingProcesses?: number
  moveOutStatus?: "Pending" | "Completed"
  evictionStatus?: "Pending" | "Completed"
  tenantType?: "Self Paying" | "Section 8"
}

interface Vendor {
  id: string
  name: string
  address: string
  trades: string
  phone: string
  email: string
}

const MOCK_VENDORS: Vendor[] = [
  { id: "v1", name: "2050 Breton LLC", address: "", trades: "", phone: "", email: "" },
  { id: "v2", name: "ABC LLC", address: "", trades: "General Contractor", phone: "", email: "" },
  {
    id: "v3",
    name: "ARC Roofing & Home Improve...",
    address: "13210 Beldon Ave, Cleveland O...",
    trades: "",
    phone: "(440) 212-2083",
    email: "leah@b2brealty.com",
  },
  { id: "v4", name: "AT&T", address: "", trades: "", phone: "", email: "" },
  {
    id: "v5",
    name: "Aby Zim",
    address: "4320 Ridge Rd Brooklyn OH 4...",
    trades: "Plumbing",
    phone: "(216) 353-0141",
    email: "abby@b2brealty.com",
  },
  {
    id: "v6",
    name: "Adam Adan LLC",
    address: "4320 Ridge Rd Brooklyn OH 4...",
    trades: "Plumbing, General Contractor",
    phone: "(216) 413-3008",
    email: "adam@b2brealty.com",
  },
  {
    id: "v7",
    name: "Alex Head",
    address: "121 Paxton Rd Cleveland OH 4...",
    trades: "",
    phone: "(111) 111-1111",
    email: "pmb2brealty@gmail.com",
  },
  {
    id: "v8",
    name: "Aria Mitchelle",
    address: "",
    trades: "Painting",
    phone: "+12162905971",
    email: "aria@b2brealty.com",
  },
  { id: "v9", name: "Ashton Blair", address: "", trades: "", phone: "(326) 220-4291", email: "ashton@b2brealty.com" },
  {
    id: "v10",
    name: "Atif Hussain",
    address: "1501 Lakeside Ave E Cleveland...",
    trades: "",
    phone: "(216) 373-1549",
    email: "arthur@b2brealty.com",
  },
  { id: "v11", name: "Avalon Hawaii", address: "", trades: "", phone: "", email: "" },
  {
    id: "v12",
    name: "AveryCleans",
    address: "78 Music Lane Clevealand OH ...",
    trades: "Plumbing",
    phone: "(440) 578-0181",
    email: "rose@b2brealty.com",
  },
  {
    id: "v13",
    name: "B2B Property Management",
    address: "4324 Ridge Rd Brooklyn OH 4...",
    trades: "Repairs And Maintenance: Inte...",
    phone: "(216) 404-4446",
    email: "arif@b2brealty.com",
  },
  {
    id: "v14",
    name: "Batman Kirk",
    address: "",
    trades: "Electrical",
    phone: "(216) 206-1515",
    email: "Ivan@b2brealty.com",
  },
  { id: "v15", name: "Blinds, Inc", address: "", trades: "", phone: "1234-4324", email: "abc@blinds.com" },
  {
    id: "v16",
    name: "Bojack Horsemen",
    address: "",
    trades: "",
    phone: "(216) 201-9979",
    email: "adrian@b2brealty.com",
  },
]

// List of unique trades for dropdown filter
const TRADE_OPTIONS = [
  "All Trades",
  "Electrical",
  "General Contractor",
  "Painting",
  "Plumbing",
  "Repairs And Maintenance: Inte...",
]

const STATE_OPTIONS = [
  "Select...",
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

const MOCK_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Emma Wilson",
    type: "Owner",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 606-0606",
    properties: ["14 Oak Ave", "221 Lakeview"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Raj Patel",
    location: "San Francisco, CA",
    source: "Referral",
    units: 8,
    companyLlc: "Wilson Properties LLC",
    csm: "Sarah Mitchell",
    tags: ["Premium", "Multi-Property"],
    pendingTasks: 2,
    pendingProcesses: 1,
  },
  {
    id: "2",
    name: "John Smith",
    type: "Tenant",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    properties: ["123 Main St, Apt 4B"],
    status: "Active",
    lastActive: "1 day ago",
    assignedStaff: "Nina Patel",
    location: "New York, NY",
    source: "Zillow",
    units: 1,
  },
  {
    id: "3",
    name: "Sarah Lee",
    type: "Owner",
    email: "sarah.lee@example.com",
    phone: "+1 (555) 202-0202",
    properties: ["500 Maple Dr"],
    status: "Pending",
    lastActive: "3 days ago",
    assignedStaff: "Nina Patel",
    location: "Austin, TX",
    units: 3,
    companyLlc: "Lee Realty Group",
    csm: "James Cooper",
    tags: ["New Owner"],
    pendingTasks: 3,
    pendingProcesses: 2,
  },
  {
    id: "4",
    name: "Michael Johnson",
    type: "Tenant",
    email: "michael.j@example.com",
    phone: "+1 (555) 234-5678",
    properties: ["456 Elm St"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Chicago, IL",
    units: 2,
  },
  {
    id: "5",
    name: "Robert Taylor",
    type: "Tenant",
    email: "robert.t@example.com",
    phone: "+1 (555) 567-8901",
    properties: ["654 Cedar Blvd"],
    status: "Inactive",
    lastActive: "1 week ago",
    assignedStaff: "Nina Patel",
    location: "Seattle, WA",
    units: 1,
  },
  {
    id: "6",
    name: "Linda Martinez",
    type: "Owner",
    email: "linda.m@example.com",
    phone: "+1 (555) 404-0404",
    properties: ["778 Walnut Ave", "889 Birch Ln"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Luis Rodriguez",
    location: "Miami, FL",
    units: 12,
    companyLlc: "Martinez Holdings LLC",
    csm: "Sarah Mitchell",
    tags: ["Premium", "VIP"],
    pendingTasks: 0,
    pendingProcesses: 1,
  },
  {
    id: "7",
    name: "David Brown",
    type: "Tenant",
    email: "david.brown@example.com",
    phone: "+1 (555) 345-6789",
    properties: ["789 Pine Rd"],
    status: "Active",
    lastActive: "2 days ago",
    assignedStaff: "Kim Chen",
    location: "Denver, CO",
    units: 1,
  },
  {
    id: "8",
    name: "James Wilson",
    type: "Tenant",
    email: "james.w@example.com",
    phone: "+1 (555) 456-7890",
    properties: ["321 Oak Ln"],
    status: "Pending",
    lastActive: "4 hours ago",
    assignedStaff: "Raj Patel",
    location: "Boston, MA",
    units: 3,
  },
  {
    id: "9",
    name: "Patricia Garcia",
    type: "Owner",
    email: "patricia.g@example.com",
    phone: "+1 (555) 678-9012",
    properties: ["1200 Broadway", "450 Park Ave"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Kim Chen",
    location: "Los Angeles, CA",
    units: 24,
    companyLlc: "Garcia & Sons Properties",
    csm: "James Cooper",
    tags: ["Multi-Property", "Commercial"],
    pendingTasks: 1,
    pendingProcesses: 0,
    terminationStatus: "Under Termination",
  },
  {
    id: "10",
    name: "Christopher Davis",
    type: "Tenant",
    email: "chris.davis@example.com",
    phone: "+1 (555) 789-0123",
    properties: ["890 River St"],
    status: "Active",
    lastActive: "6 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Portland, OR",
    units: 5,
  },
  {
    id: "41",
    name: "Carlos Mendez",
    type: "Property Technician",
    email: "carlos.m@heropm.com",
    phone: "+1 (555) 666-7777",
    properties: ["14 Oak Ave", "123 Main St", "456 Elm St"],
    status: "Active",
    lastActive: "30 mins ago",
    assignedStaff: "Nina Patel",
    location: "San Francisco, CA",
    specialty: "General Maintenance",
  },
  {
    id: "42",
    name: "Tony Russo",
    type: "Property Technician",
    email: "tony.r@heropm.com",
    phone: "+1 (555) 777-8888",
    properties: ["500 Maple Dr", "778 Walnut Ave"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Raj Patel",
    location: "Los Angeles, CA",
    specialty: "Appliance Repair",
  },
  {
    id: "43",
    name: "Derek Williams",
    type: "Property Technician",
    email: "derek.w@heropm.com",
    phone: "+1 (555) 888-9999",
    properties: ["789 Pine Rd", "321 Oak Ln"],
    status: "Pending",
    lastActive: "1 day ago",
    assignedStaff: "Luis Rodriguez",
    location: "Denver, CO",
    specialty: "Plumbing & Electrical",
  },
  {
    id: "44",
    name: "Marcus Thompson",
    type: "Property Technician",
    email: "marcus.t@heropm.com",
    phone: "+1 (555) 999-0000",
    properties: ["1200 Broadway", "450 Park Ave", "890 River St"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Kim Chen",
    location: "Chicago, IL",
    specialty: "HVAC & Heating",
  },
  {
    id: "51",
    name: "Jessica Palmer",
    type: "Leasing Agent",
    email: "jessica.p@heropm.com",
    phone: "+1 (555) 111-2223",
    properties: ["14 Oak Ave", "221 Lakeview", "123 Main St"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Nina Patel",
    location: "San Francisco, CA",
    specialty: "Residential Leasing",
  },
  {
    id: "52",
    name: "Amanda Foster",
    type: "Leasing Agent",
    email: "amanda.f@heropm.com",
    phone: "+1 (555) 222-3334",
    properties: ["500 Maple Dr", "778 Walnut Ave", "889 Birch Ln"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Raj Patel",
    location: "Los Angeles, CA",
    specialty: "Commercial & Residential",
  },
  {
    id: "53",
    name: "Ryan Mitchell",
    type: "Leasing Agent",
    email: "ryan.m@heropm.com",
    phone: "+1 (555) 333-4445",
    properties: ["456 Elm St", "654 Cedar Blvd"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Chicago, IL",
    specialty: "Student Housing",
  },
  {
    id: "11",
    name: "Elizabeth White",
    type: "Owner",
    email: "elizabeth.w@example.com",
    phone: "+1 (555) 890-1234",
    properties: ["333 Fifth Ave"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Nina Patel",
    location: "Phoenix, AZ",
    companyLlc: "White Capital Partners",
    csm: "Sarah Mitchell",
  },
  {
    id: "12",
    name: "Thomas Anderson",
    type: "Tenant",
    email: "thomas.a@example.com",
    phone: "+1 (555) 901-2345",
    properties: ["555 Harbor Dr"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Raj Patel",
    location: "San Diego, CA",
  },
  {
    id: "13",
    name: "Nancy Clark",
    type: "Owner",
    email: "nancy.c@example.com",
    phone: "+1 (555) 012-3456",
    properties: ["120 Sunset Blvd", "880 Ocean Ave"],
    status: "Pending",
    lastActive: "2 days ago",
    assignedStaff: "Luis Rodriguez",
    location: "Dallas, TX",
    companyLlc: "Clark Estates LLC",
    csm: "James Cooper",
  },
  {
    id: "14",
    name: "Steven Harris",
    type: "Tenant",
    email: "steven.h@example.com",
    phone: "+1 (555) 123-4568",
    properties: ["432 Valley Rd"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Kim Chen",
    location: "Atlanta, GA",
  },
  {
    id: "15",
    name: "Karen Lewis",
    type: "Owner",
    email: "karen.l@example.com",
    phone: "+1 (555) 234-5670",
    properties: ["900 Mountain View"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Nina Patel",
    location: "Nashville, TN",
    companyLlc: "Lewis Property Group",
  },
  {
    id: "16",
    name: "Daniel Young",
    type: "Tenant",
    email: "daniel.y@example.com",
    phone: "+1 (555) 345-6780",
    properties: ["611 Forest Lane"],
    status: "Inactive",
    lastActive: "3 days ago",
    assignedStaff: "Raj Patel",
    location: "Charlotte, NC",
  },
  {
    id: "17",
    name: "Michelle Scott",
    type: "Owner",
    email: "michelle.s@example.com",
    phone: "+1 (555) 456-7891",
    properties: ["222 Bay St", "444 River View"],
    status: "Active",
    lastActive: "6 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Philadelphia, PA",
    companyLlc: "Scott Ventures LLC",
    csm: "Sarah Mitchell",
  },
  {
    id: "18",
    name: "Paul Walker",
    type: "Tenant",
    email: "paul.w@example.com",
    phone: "+1 (555) 567-8902",
    properties: ["788 Hill Crest"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Kim Chen",
    location: "Las Vegas, NV",
  },
  {
    id: "19",
    name: "Lisa King",
    type: "Owner",
    email: "lisa.k@example.com",
    phone: "+1 (555) 678-9013",
    properties: ["999 Parkway"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Nina Patel",
    location: "Columbus, OH",
    companyLlc: "King Real Estate Inc",
    csm: "James Cooper",
  },
  {
    id: "20",
    name: "Kevin Wright",
    type: "Tenant",
    email: "kevin.w@example.com",
    phone: "+1 (555) 789-0124",
    properties: ["345 Elm Grove"],
    status: "Pending",
    lastActive: "1 day ago",
    assignedStaff: "Raj Patel",
    location: "Indianapolis, IN",
  },
  {
    id: "21",
    name: "Jennifer Moore",
    type: "Owner",
    email: "jennifer.m@example.com",
    phone: "+1 (555) 890-1235",
    properties: ["567 Cedar Heights", "111 Spring St"],
    status: "Active",
    lastActive: "30 mins ago",
    assignedStaff: "Luis Rodriguez",
    location: "San Jose, CA",
    companyLlc: "Moore Capital LLC",
    csm: "Sarah Mitchell",
  },
  {
    id: "22",
    name: "Andrew Hall",
    type: "Tenant",
    email: "andrew.h@example.com",
    phone: "+1 (555) 901-2346",
    properties: ["890 Oak Villa"],
    status: "Active",
    lastActive: "7 hours ago",
    assignedStaff: "Kim Chen",
    location: "Fort Worth, TX",
  },
  {
    id: "23",
    name: "Laura Allen",
    type: "Owner",
    email: "laura.a@example.com",
    phone: "+1 (555) 012-3457",
    properties: ["234 Pine Garden"],
    status: "Pending",
    lastActive: "2 days ago",
    assignedStaff: "Nina Patel",
    location: "Austin, TX",
    companyLlc: "Allen Investments",
  },
  {
    id: "24",
    name: "George Robinson",
    type: "Tenant",
    email: "george.r@example.com",
    phone: "+1 (555) 123-4569",
    properties: ["456 Maple Court"],
    status: "Active",
    lastActive: "8 hours ago",
    assignedStaff: "Raj Patel",
    location: "Jacksonville, FL",
  },
  {
    id: "25",
    name: "Betty Adams",
    type: "Owner",
    email: "betty.a@example.com",
    phone: "+1 (555) 234-5671",
    properties: ["678 Birch Way", "321 Willow Dr"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Luis Rodriguez",
    location: "San Antonio, TX",
    companyLlc: "Adams Property Management",
    csm: "James Cooper",
  },
  {
    id: "26",
    name: "Jason Turner",
    type: "Tenant",
    email: "jason.t@example.com",
    phone: "+1 (555) 345-6781",
    properties: ["900 Cherry Lane"],
    status: "Active",
    lastActive: "45 mins ago",
    assignedStaff: "Kim Chen",
    location: "Houston, TX",
  },
  {
    id: "27",
    name: "Deborah Hill",
    type: "Owner",
    email: "deborah.h@example.com",
    phone: "+1 (555) 456-7892",
    properties: ["123 Laurel Ave"],
    status: "Inactive",
    lastActive: "1 week ago",
    assignedStaff: "Nina Patel",
    location: "San Francisco, CA",
    companyLlc: "Hill & Associates",
    csm: "Sarah Mitchell",
  },
  {
    id: "28",
    name: "Ryan Brooks",
    type: "Tenant",
    email: "ryan.b@example.com",
    phone: "+1 (555) 567-8903",
    properties: ["345 Aspen St"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Raj Patel",
    location: "Dallas, TX",
  },
  {
    id: "29",
    name: "Sandra Sanders",
    type: "Owner",
    email: "sandra.s@example.com",
    phone: "+1 (555) 678-9014",
    properties: ["567 Redwood Blvd"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Phoenix, AZ",
    companyLlc: "Sanders Realty LLC",
    csm: "James Cooper",
  },
  {
    id: "30",
    name: "Jessica West",
    type: "Owner",
    email: "jessica.w@example.com",
    phone: "+1 (555) 234-5679",
    properties: ["760 Lake Shore"],
    status: "Pending",
    lastActive: "5 hours ago",
    assignedStaff: "Raj Patel",
    location: "Minneapolis, MN",
    companyLlc: "West Investments Group",
    csm: "Sarah Mitchell",
  },
  // Additional Owners (31-55) to reach ~50 total
  {
    id: "31",
    name: "Gregory Foster",
    type: "Owner",
    email: "gregory.f@example.com",
    phone: "+1 (555) 111-2234",
    properties: ["890 Willow Lane", "234 Oak Terrace"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Kim Chen",
    location: "Denver, CO",
    companyLlc: "Foster & Associates",
    csm: "James Cooper",
  },
  {
    id: "32",
    name: "Rachel Morgan",
    type: "Owner",
    email: "rachel.m@example.com",
    phone: "+1 (555) 222-3345",
    properties: ["567 Maple Heights"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Nina Patel",
    location: "Seattle, WA",
    companyLlc: "Morgan Properties Inc",
    csm: "Sarah Mitchell",
  },
  {
    id: "33",
    name: "Vincent Price",
    type: "Owner",
    email: "vincent.p@example.com",
    phone: "+1 (555) 333-4456",
    properties: ["789 Cedar Point", "321 Pine View"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Raj Patel",
    location: "Portland, OR",
    companyLlc: "Price Realty Group",
    csm: "James Cooper",
  },
  {
    id: "34",
    name: "Diana Ross",
    type: "Owner",
    email: "diana.r@example.com",
    phone: "+1 (555) 444-5567",
    properties: ["456 Sunset Blvd"],
    status: "Pending",
    lastActive: "1 day ago",
    assignedStaff: "Luis Rodriguez",
    location: "Miami, FL",
    companyLlc: "Ross Estates LLC",
    csm: "Sarah Mitchell",
  },
  {
    id: "35",
    name: "Edward Blake",
    type: "Owner",
    email: "edward.b@example.com",
    phone: "+1 (555) 555-6678",
    properties: ["123 Harbor View"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Kim Chen",
    location: "San Diego, CA",
    companyLlc: "Blake Holdings LLC",
    csm: "James Cooper",
  },
  {
    id: "36",
    name: "Monica Bell",
    type: "Owner",
    email: "monica.b@example.com",
    phone: "+1 (555) 666-7789",
    properties: ["890 Mountain View", "567 Valley Rd"],
    status: "Active",
    lastActive: "30 mins ago",
    assignedStaff: "Nina Patel",
    location: "Austin, TX",
    companyLlc: "Bell Capital Partners",
    csm: "Sarah Mitchell",
  },
  {
    id: "37",
    name: "Charles Dixon",
    type: "Owner",
    email: "charles.d@example.com",
    phone: "+1 (555) 777-8890",
    properties: ["234 River Bend"],
    status: "Inactive",
    lastActive: "1 week ago",
    assignedStaff: "Raj Patel",
    location: "Chicago, IL",
    companyLlc: "Dixon Property Management",
  },
  {
    id: "38",
    name: "Angela Stone",
    type: "Owner",
    email: "angela.s@example.com",
    phone: "+1 (555) 888-9901",
    properties: ["678 Beach Blvd", "901 Ocean Ave"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Los Angeles, CA",
    companyLlc: "Stone Ventures LLC",
    csm: "James Cooper",
  },
  {
    id: "39",
    name: "Marcus Webb",
    type: "Owner",
    email: "marcus.w@example.com",
    phone: "+1 (555) 999-0012",
    properties: ["345 Parkside Dr"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Kim Chen",
    location: "Atlanta, GA",
    companyLlc: "Webb Realty Inc",
    csm: "Sarah Mitchell",
  },
  {
    id: "40",
    name: "Stephanie Cruz",
    type: "Owner",
    email: "stephanie.c@example.com",
    phone: "+1 (555) 000-1123",
    properties: ["789 Forest Lane"],
    status: "Pending",
    lastActive: "6 hours ago",
    assignedStaff: "Nina Patel",
    location: "Houston, TX",
    companyLlc: "Cruz Properties LLC",
    csm: "James Cooper",
  },
  {
    id: "60",
    name: "Harold Grant",
    type: "Owner",
    email: "harold.g@example.com",
    phone: "+1 (555) 101-2234",
    properties: ["123 Lakeview Dr", "456 Summit Ave"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Raj Patel",
    location: "Boston, MA",
    companyLlc: "Grant Holdings LLC",
    csm: "Sarah Mitchell",
  },
  {
    id: "61",
    name: "Virginia Palmer",
    type: "Owner",
    email: "virginia.p@example.com",
    phone: "+1 (555) 202-3345",
    properties: ["789 Hillside Rd"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Philadelphia, PA",
    companyLlc: "Palmer Realty Group",
    csm: "James Cooper",
  },
  {
    id: "62",
    name: "Walter Hughes",
    type: "Owner",
    email: "walter.h@example.com",
    phone: "+1 (555) 303-4456",
    properties: ["234 Meadow Lane", "567 Garden Way"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Kim Chen",
    location: "Phoenix, AZ",
    companyLlc: "Hughes Property Trust",
    csm: "Sarah Mitchell",
  },
  {
    id: "63",
    name: "Dorothy Fields",
    type: "Owner",
    email: "dorothy.f@example.com",
    phone: "+1 (555) 404-5567",
    properties: ["890 Creek Side"],
    status: "Pending",
    lastActive: "3 days ago",
    assignedStaff: "Nina Patel",
    location: "San Antonio, TX",
    companyLlc: "Fields Capital LLC",
  },
  {
    id: "64",
    name: "Raymond Pierce",
    type: "Owner",
    email: "raymond.p@example.com",
    phone: "+1 (555) 505-6678",
    properties: ["345 Spring St"],
    status: "Active",
    lastActive: "7 hours ago",
    assignedStaff: "Raj Patel",
    location: "Dallas, TX",
    companyLlc: "Pierce Investments",
    csm: "James Cooper",
  },
  {
    id: "65",
    name: "Evelyn Shaw",
    type: "Owner",
    email: "evelyn.s@example.com",
    phone: "+1 (555) 606-7789",
    properties: ["678 Autumn Ave", "901 Winter Blvd"],
    status: "Active",
    lastActive: "45 mins ago",
    assignedStaff: "Luis Rodriguez",
    location: "San Jose, CA",
    companyLlc: "Shaw Properties Inc",
    csm: "Sarah Mitchell",
  },
  {
    id: "66",
    name: "Arthur Coleman",
    type: "Owner",
    email: "arthur.c@example.com",
    phone: "+1 (555) 707-8890",
    properties: ["123 Summer Lane"],
    status: "Inactive",
    lastActive: "2 weeks ago",
    assignedStaff: "Kim Chen",
    location: "Jacksonville, FL",
    companyLlc: "Coleman Estates",
  },
  {
    id: "67",
    name: "Frances Murphy",
    type: "Owner",
    email: "frances.m@example.com",
    phone: "+1 (555) 808-9901",
    properties: ["456 Birch Grove"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Nina Patel",
    location: "Columbus, OH",
    companyLlc: "Murphy Realty LLC",
    csm: "James Cooper",
  },
  {
    id: "68",
    name: "Philip Barnes",
    type: "Owner",
    email: "philip.b@example.com",
    phone: "+1 (555) 909-0012",
    properties: ["789 Elm Court", "234 Oak Plaza"],
    status: "Active",
    lastActive: "1 day ago",
    assignedStaff: "Raj Patel",
    location: "Fort Worth, TX",
    companyLlc: "Barnes & Co Properties",
    csm: "Sarah Mitchell",
  },
  {
    id: "69",
    name: "Catherine Reed",
    type: "Owner",
    email: "catherine.r@example.com",
    phone: "+1 (555) 010-1123",
    properties: ["567 Pine Ridge"],
    status: "Pending",
    lastActive: "8 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Charlotte, NC",
    companyLlc: "Reed Capital Partners",
    csm: "James Cooper",
  },
  {
    id: "70",
    name: "Howard Nelson",
    type: "Owner",
    email: "howard.n@example.com",
    phone: "+1 (555) 121-2234",
    properties: ["890 Maple Terrace"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Kim Chen",
    location: "Indianapolis, IN",
    companyLlc: "Nelson Property Group",
    csm: "Sarah Mitchell",
  },
  {
    id: "71",
    name: "Ruth Mitchell",
    type: "Owner",
    email: "ruth.m@example.com",
    phone: "+1 (555) 232-3345",
    properties: ["345 Cedar Heights", "678 Spruce Way"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Nina Patel",
    location: "Seattle, WA",
    companyLlc: "Mitchell Realty Inc",
    csm: "James Cooper",
  },
  {
    id: "72",
    name: "Douglas Carter",
    type: "Owner",
    email: "douglas.c@example.com",
    phone: "+1 (555) 343-4456",
    properties: ["901 Willow Park"],
    status: "Active",
    lastActive: "30 mins ago",
    assignedStaff: "Raj Patel",
    location: "Denver, CO",
    companyLlc: "Carter Holdings LLC",
    csm: "Sarah Mitchell",
  },
  {
    id: "73",
    name: "Helen Peterson",
    type: "Owner",
    email: "helen.p@example.com",
    phone: "+1 (555) 454-5567",
    properties: ["123 Aspen Grove"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Portland, OR",
    companyLlc: "Peterson Estates LLC",
    csm: "James Cooper",
  },
  {
    id: "74",
    name: "Eugene Roberts",
    type: "Owner",
    email: "eugene.r@example.com",
    phone: "+1 (555) 565-6678",
    properties: ["456 Dogwood Lane", "789 Magnolia Dr"],
    status: "Pending",
    lastActive: "2 days ago",
    assignedStaff: "Kim Chen",
    location: "Nashville, TN",
    companyLlc: "Roberts Property Trust",
  },
  {
    id: "75",
    name: "Margaret Stewart",
    type: "Owner",
    email: "margaret.s@example.com",
    phone: "+1 (555) 676-7789",
    properties: ["234 Juniper Way"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Nina Patel",
    location: "Las Vegas, NV",
    companyLlc: "Stewart Ventures LLC",
    csm: "Sarah Mitchell",
  },
  // Additional Tenants (80-130) to reach ~50 total
  {
    id: "80",
    name: "Timothy Grant",
    type: "Tenant",
    email: "timothy.g@example.com",
    phone: "+1 (555) 787-8890",
    properties: ["Unit 4A, 890 Oak Ave"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Raj Patel",
    location: "San Francisco, CA",
    source: "Apartments.com",
  },
  {
    id: "81",
    name: "Samantha Hill",
    type: "Tenant",
    email: "samantha.h@example.com",
    phone: "+1 (555) 898-9901",
    properties: ["Unit 2B, 567 Pine St"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Nina Patel",
    location: "Los Angeles, CA",
  },
  {
    id: "82",
    name: "Brandon Cooper",
    type: "Tenant",
    email: "brandon.c@example.com",
    phone: "+1 (555) 909-0012",
    properties: ["Apt 12, 234 Maple Blvd"],
    status: "Pending",
    lastActive: "3 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Chicago, IL",
  },
  {
    id: "83",
    name: "Melissa Rivera",
    type: "Tenant",
    email: "melissa.r@example.com",
    phone: "+1 (555) 010-1123",
    properties: ["Unit 8C, 789 Cedar Lane"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Kim Chen",
    location: "Houston, TX",
  },
  {
    id: "84",
    name: "Derek Woods",
    type: "Tenant",
    email: "derek.w@example.com",
    phone: "+1 (555) 121-2234",
    properties: ["Apt 5, 456 Elm Court"],
    status: "Active",
    lastActive: "30 mins ago",
    assignedStaff: "Raj Patel",
    location: "Phoenix, AZ",
  },
  {
    id: "85",
    name: "Vanessa Long",
    type: "Tenant",
    email: "vanessa.l@example.com",
    phone: "+1 (555) 232-3345",
    properties: ["Unit 3A, 901 Birch Ave"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Nina Patel",
    location: "Philadelphia, PA",
  },
  {
    id: "86",
    name: "Cody Barnes",
    type: "Tenant",
    email: "cody.b@example.com",
    phone: "+1 (555) 343-4456",
    properties: ["Apt 7B, 345 Oak Ridge"],
    status: "Inactive",
    lastActive: "1 week ago",
    assignedStaff: "Luis Rodriguez",
    location: "San Antonio, TX",
  },
  {
    id: "87",
    name: "Natalie Price",
    type: "Tenant",
    email: "natalie.p@example.com",
    phone: "+1 (555) 454-5567",
    properties: ["Unit 10D, 678 Pine Heights"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Kim Chen",
    location: "San Diego, CA",
  },
  {
    id: "88",
    name: "Justin Howard",
    type: "Tenant",
    email: "justin.h@example.com",
    phone: "+1 (555) 565-6678",
    properties: ["Apt 1A, 123 Maple View"],
    status: "Active",
    lastActive: "6 hours ago",
    assignedStaff: "Raj Patel",
    location: "Dallas, TX",
  },
  {
    id: "89",
    name: "Whitney Sanders",
    type: "Tenant",
    email: "whitney.s@example.com",
    phone: "+1 (555) 676-7789",
    properties: ["Unit 6B, 567 Cedar Point"],
    status: "Pending",
    lastActive: "1 day ago",
    assignedStaff: "Nina Patel",
    location: "San Jose, CA",
  },
  {
    id: "90",
    name: "Trevor Mitchell",
    type: "Tenant",
    email: "trevor.m@example.com",
    phone: "+1 (555) 787-8891",
    properties: ["Apt 9C, 890 Elm Grove"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Austin, TX",
  },
  {
    id: "91",
    name: "Courtney Fisher",
    type: "Tenant",
    email: "courtney.f@example.com",
    phone: "+1 (555) 898-9902",
    properties: ["Unit 2D, 234 Oak Lane"],
    status: "Active",
    lastActive: "45 mins ago",
    assignedStaff: "Kim Chen",
    location: "Jacksonville, FL",
  },
  {
    id: "92",
    name: "Dylan Porter",
    type: "Tenant",
    email: "dylan.p@example.com",
    phone: "+1 (555) 909-0013",
    properties: ["Apt 4A, 789 Pine Court"],
    status: "Active",
    lastActive: "7 hours ago",
    assignedStaff: "Raj Patel",
    location: "Fort Worth, TX",
  },
  {
    id: "93",
    name: "Brittany Cox",
    type: "Tenant",
    email: "brittany.c@example.com",
    phone: "+1 (555) 010-1124",
    properties: ["Unit 11B, 456 Maple Ridge"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Nina Patel",
    location: "Columbus, OH",
  },
  {
    id: "94",
    name: "Cameron Ward",
    type: "Tenant",
    email: "cameron.w@example.com",
    phone: "+1 (555) 121-2235",
    properties: ["Apt 3C, 901 Cedar View"],
    status: "Inactive",
    lastActive: "2 weeks ago",
    assignedStaff: "Luis Rodriguez",
    location: "Charlotte, NC",
  },
  {
    id: "95",
    name: "Amber Russell",
    type: "Tenant",
    email: "amber.r@example.com",
    phone: "+1 (555) 232-3346",
    properties: ["Unit 8A, 345 Elm Heights"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Kim Chen",
    location: "Indianapolis, IN",
  },
  {
    id: "96",
    name: "Kyle Griffin",
    type: "Tenant",
    email: "kyle.g@example.com",
    phone: "+1 (555) 343-4457",
    properties: ["Apt 5B, 678 Oak Park"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Raj Patel",
    location: "Seattle, WA",
  },
  {
    id: "97",
    name: "Heather Hayes",
    type: "Tenant",
    email: "heather.h@example.com",
    phone: "+1 (555) 454-5568",
    properties: ["Unit 7D, 123 Pine Plaza"],
    status: "Pending",
    lastActive: "8 hours ago",
    assignedStaff: "Nina Patel",
    location: "Denver, CO",
  },
  {
    id: "98",
    name: "Austin Bryant",
    type: "Tenant",
    email: "austin.b@example.com",
    phone: "+1 (555) 565-6679",
    properties: ["Apt 2A, 567 Maple Square"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Portland, OR",
  },
  {
    id: "99",
    name: "Kayla Bell",
    type: "Tenant",
    email: "kayla.b@example.com",
    phone: "+1 (555) 676-7790",
    properties: ["Unit 9B, 890 Cedar Court"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Kim Chen",
    location: "Nashville, TN",
  },
  {
    id: "100",
    name: "Ian Murphy",
    type: "Tenant",
    email: "ian.m@example.com",
    phone: "+1 (555) 787-8892",
    properties: ["Apt 6C, 234 Elm Terrace"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Raj Patel",
    location: "Las Vegas, NV",
  },
  {
    id: "101",
    name: "Megan Foster",
    type: "Tenant",
    email: "megan.f@example.com",
    phone: "+1 (555) 898-9903",
    properties: ["Unit 1B, 789 Oak Vista"],
    status: "Active",
    lastActive: "1 hour ago",
    assignedStaff: "Nina Patel",
    location: "Miami, FL",
  },
  {
    id: "102",
    name: "Eric Sanders",
    type: "Tenant",
    email: "eric.s@example.com",
    phone: "+1 (555) 909-0014",
    properties: ["Apt 10A, 456 Pine Crest"],
    status: "Pending",
    lastActive: "6 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "Atlanta, GA",
  },
  {
    id: "103",
    name: "Lauren Kelly",
    type: "Tenant",
    email: "lauren.k@example.com",
    phone: "+1 (555) 010-1125",
    properties: ["Unit 4C, 901 Maple Grove"],
    status: "Active",
    lastActive: "4 hours ago",
    assignedStaff: "Kim Chen",
    location: "Boston, MA",
  },
  {
    id: "104",
    name: "Ethan Reed",
    type: "Tenant",
    email: "ethan.r@example.com",
    phone: "+1 (555) 121-2236",
    properties: ["Apt 8B, 345 Cedar Lane"],
    status: "Active",
    lastActive: "30 mins ago",
    assignedStaff: "Raj Patel",
    location: "San Francisco, CA",
  },
  {
    id: "105",
    name: "Morgan Butler",
    type: "Tenant",
    email: "morgan.b@example.com",
    phone: "+1 (555) 232-3347",
    properties: ["Unit 12D, 678 Elm Point"],
    status: "Active",
    lastActive: "7 hours ago",
    assignedStaff: "Nina Patel",
    location: "Los Angeles, CA",
  },
  {
    id: "106",
    name: "Tyler Ross",
    type: "Tenant",
    email: "tyler.r@example.com",
    phone: "+1 (555) 343-4458",
    properties: ["Apt 3A, 123 Oak Summit"],
    status: "Inactive",
    lastActive: "3 days ago",
    assignedStaff: "Luis Rodriguez",
    location: "Chicago, IL",
  },
  {
    id: "107",
    name: "Alexandra Simmons",
    type: "Tenant",
    email: "alexandra.s@example.com",
    phone: "+1 (555) 454-5569",
    properties: ["Unit 5D, 567 Pine View"],
    status: "Active",
    lastActive: "2 hours ago",
    assignedStaff: "Kim Chen",
    location: "Houston, TX",
  },
  {
    id: "108",
    name: "Jacob Perry",
    type: "Tenant",
    email: "jacob.p@example.com",
    phone: "+1 (555) 565-6680",
    properties: ["Apt 7A, 890 Maple Lane"],
    status: "Active",
    lastActive: "5 hours ago",
    assignedStaff: "Raj Patel",
    location: "Phoenix, AZ",
  },
  {
    id: "109",
    name: "Madison Powell",
    type: "Tenant",
    email: "madison.p@example.com",
    phone: "+1 (555) 676-7791",
    properties: ["Unit 2C, 234 Cedar Ridge"],
    status: "Pending",
    lastActive: "1 day ago",
    assignedStaff: "Nina Patel",
    location: "Philadelphia, PA",
  },
  {
    id: "110",
    name: "Connor Long",
    type: "Tenant",
    email: "connor.l@example.com",
    phone: "+1 (555) 787-8893",
    properties: ["Apt 11A, 789 Elm Court"],
    status: "Active",
    lastActive: "3 hours ago",
    assignedStaff: "Luis Rodriguez",
    location: "San Antonio, TX",
  },
]

// Augment owner records with tags, pendingTasks, pendingProcesses, terminationStatus
const OWNER_TAGS = ["Premium", "Multi-Property", "VIP", "New Owner", "Commercial", "Residential", "International", "Corporate"]
const TERMINATION_STATUSES: Array<"Under Termination" | "Terminated Hidden" | undefined> = ["Under Termination", "Terminated Hidden", undefined]

MOCK_CONTACTS.forEach((contact, idx) => {
  if (contact.type !== "Owner") return
  // Only augment if not already set (first 4 owners already have data)
  if (!contact.tags) {
    const tagCount = (idx % 3) + 1
    contact.tags = OWNER_TAGS.filter((_, i) => i < tagCount).slice(0, tagCount)
    // Rotate through tags by index for variety
    const offset = idx % OWNER_TAGS.length
    contact.tags = Array.from({ length: tagCount }, (_, i) => OWNER_TAGS[(offset + i) % OWNER_TAGS.length])
  }
  if (contact.pendingTasks === undefined) {
    contact.pendingTasks = idx % 5 === 0 ? 0 : (idx % 4) + 1
  }
  if (contact.pendingProcesses === undefined) {
    contact.pendingProcesses = idx % 3 === 0 ? 0 : (idx % 3)
  }
  if (!contact.terminationStatus) {
    // ~5 owners Under Termination, ~3 Terminated Hidden, rest undefined
    if (idx % 9 === 0) contact.terminationStatus = "Under Termination"
    else if (idx % 13 === 0) contact.terminationStatus = "Terminated Hidden"
  }
})

// Augment tenant records with tags, pendingTasks, pendingProcesses, moveOutStatus, evictionStatus
const TENANT_TAGS = ["Month-to-Month", "Long-term", "Section 8", "Corporate", "Student", "Senior", "Pet Owner", "Sublease"]
MOCK_CONTACTS.forEach((contact, idx) => {
  if (contact.type !== "Tenant") return
  if (!contact.tenantTags) {
    const tagCount = (idx % 3) + 1
    const offset = idx % TENANT_TAGS.length
    contact.tenantTags = Array.from({ length: tagCount }, (_, i) => TENANT_TAGS[(offset + i) % TENANT_TAGS.length])
  }
  if (contact.tenantPendingTasks === undefined) {
    contact.tenantPendingTasks = idx % 4 === 0 ? 0 : (idx % 3) + 1
  }
  if (contact.tenantPendingProcesses === undefined) {
    contact.tenantPendingProcesses = idx % 3 === 0 ? 0 : (idx % 2) + 1
  }
  if (!contact.moveOutStatus) {
    if (idx % 7 === 0) contact.moveOutStatus = "Pending"
    else if (idx % 11 === 0) contact.moveOutStatus = "Completed"
  }
  if (!contact.evictionStatus) {
    if (idx % 13 === 0) contact.evictionStatus = "Pending"
    else if (idx % 17 === 0) contact.evictionStatus = "Completed"
  }
  if (!contact.tenantType) {
    contact.tenantType = idx % 3 === 0 ? "Section 8" : "Self Paying"
  }
})

const MOCK_ACTIVITIES = [
  {
    id: 1,
    type: "call",
    description: "Outbound call regarding lease renewal",
    date: "Today, 10:30 AM",
    user: "Nina Patel",
  },
  { id: 2, type: "email", description: "Sent monthly statement", date: "Yesterday, 2:15 PM", user: "System" },
  { id: 3, type: "document", description: "Uploaded signed lease agreement", date: "Nov 18, 2025", user: "Raj Patel" },
  {
    id: 4,
    type: "note",
    description: "Client requested maintenance for HVAC",
    date: "Nov 15, 2025",
    user: "Luis Rodriguez",
  },
]

const MOCK_PAYMENTS = [
  { id: 1, date: "Nov 01, 2025", amount: "$2,450.00", type: "Rent Payment", status: "Paid" },
  { id: 2, date: "Oct 01, 2025", amount: "$2,450.00", type: "Rent Payment", status: "Paid" },
  { id: 3, date: "Sep 01, 2025", amount: "$2,450.00", type: "Rent Payment", status: "Paid" },
  { id: 4, date: "Aug 15, 2025", amount: "$150.00", type: "Late Fee", status: "Waived" },
]

const MOCK_NOTES = [
  {
    id: 1,
    content: "Prefer to be contacted via email during work hours (9-5).",
    author: "Nina Patel",
    date: "Oct 10, 2025",
  },
  {
    id: 2,
    content: "Planning to expand portfolio next year, keep updated on new listings.",
    author: "Raj Patel",
    date: "Sep 22, 2025",
  },
]

// --- Components ---

interface ContactsPageProps {
  filter?: "all" | "owners" | "tenants" | "vendors" | "property-technician" | "leasing-agent"
  onFilterChange?: (filter: "all" | "owners" | "tenants" | "vendors" | "property-technician" | "leasing-agent") => void
  onContactClick?: (contact: Contact) => void
  onTenantClick?: (contact: Contact) => void
  onNavigateToUnitDetail?: (unitId: string, propertyId: string) => void
}

// Mapping from property display names (used in tenant data) to propertyId + unitId for deep linking
const PROPERTY_UNIT_MAP: Record<string, { propertyId: string; unitId: string }> = {
  "123 Main St, Apt 4B": { propertyId: "123-main-st", unitId: "apt-4b" },
  "456 Elm St": { propertyId: "456-elm-st", unitId: "unit-1" },
  "654 Cedar Blvd": { propertyId: "654-cedar-blvd", unitId: "unit-1" },
  "789 Pine Rd": { propertyId: "789-pine-rd", unitId: "unit-1" },
  "321 Oak Ln": { propertyId: "321-oak-ln", unitId: "unit-1" },
  "1200 Broadway": { propertyId: "1200-broadway", unitId: "unit-1" },
  "450 Park Ave": { propertyId: "450-park-ave", unitId: "unit-1" },
  "890 River St": { propertyId: "890-river-st", unitId: "unit-1" },
  "14 Oak Ave": { propertyId: "14-oak-ave", unitId: "unit-1" },
  "221 Lakeview": { propertyId: "221-lakeview", unitId: "unit-1" },
  "500 Maple Dr": { propertyId: "500-maple-dr", unitId: "unit-1" },
  "778 Walnut Ave": { propertyId: "778-walnut-ave", unitId: "unit-1" },
  "889 Birch Ln": { propertyId: "889-birch-ln", unitId: "unit-1" },
  "333 Fifth Ave": { propertyId: "333-fifth-ave", unitId: "unit-1" },
  "555 Harbor Dr": { propertyId: "555-harbor-dr", unitId: "unit-1" },
  "120 Sunset Blvd": { propertyId: "120-sunset-blvd", unitId: "unit-1" },
  "880 Ocean Ave": { propertyId: "880-ocean-ave", unitId: "unit-1" },
  "432 Valley Rd": { propertyId: "432-valley-rd", unitId: "unit-1" },
  "900 Mountain View": { propertyId: "900-mountain-view", unitId: "unit-1" },
  "611 Forest Lane": { propertyId: "611-forest-lane", unitId: "unit-1" },
  "222 Bay St": { propertyId: "222-bay-st", unitId: "unit-1" },
  "444 River View": { propertyId: "444-river-view", unitId: "unit-1" },
  "788 Hill Crest": { propertyId: "788-hill-crest", unitId: "unit-1" },
  "999 Parkway": { propertyId: "999-parkway", unitId: "unit-1" },
  "345 Elm Grove": { propertyId: "345-elm-grove", unitId: "unit-1" },
  "567 Cedar Heights": { propertyId: "567-cedar-heights", unitId: "unit-1" },
  "111 Spring St": { propertyId: "111-spring-st", unitId: "unit-1" },
  "890 Oak Villa": { propertyId: "890-oak-villa", unitId: "unit-1" },
  "234 Pine Garden": { propertyId: "234-pine-garden", unitId: "unit-1" },
  "456 Maple Court": { propertyId: "456-maple-court", unitId: "unit-1" },
  "678 Birch Way": { propertyId: "678-birch-way", unitId: "unit-1" },
  "321 Willow Dr": { propertyId: "321-willow-dr", unitId: "unit-1" },
  "900 Cherry Lane": { propertyId: "900-cherry-lane", unitId: "unit-1" },
  "123 Laurel Ave": { propertyId: "123-laurel-ave", unitId: "unit-1" },
  "345 Aspen St": { propertyId: "345-aspen-st", unitId: "unit-1" },
  "567 Redwood Blvd": { propertyId: "567-redwood-blvd", unitId: "unit-1" },
  "760 Lake Shore": { propertyId: "760-lake-shore", unitId: "unit-1" },
  "890 Willow Lane": { propertyId: "890-willow-lane", unitId: "unit-1" },
  "234 Oak Terrace": { propertyId: "234-oak-terrace", unitId: "unit-1" },
  "567 Maple Heights": { propertyId: "567-maple-heights", unitId: "unit-1" },
}

export default function ContactsPage({ filter, onFilterChange, onContactClick, onTenantClick, onNavigateToUnitDetail }: ContactsPageProps) {
  const activeTab = filter || "all"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isAdmin, setIsAdmin] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Pending">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])

  // Clear selection when tab changes
  useEffect(() => {
    setSelectedContactIds([])
  }, [activeTab])

  const [ownersViewMode, setOwnersViewMode] = useState<"list" | "grid">("list")
  const [tenantsViewMode, setTenantsViewMode] = useState<"list" | "grid">("list")
  const [vendorsViewMode, setVendorsViewMode] = useState<"list" | "grid">("list")

  // AI Chat state for Owners
  const [ownersAiChatInput, setOwnersAiChatInput] = useState("")

  const handleOwnersAiChatSubmit = (query: string) => {
    // Handle AI chat submission - this would integrate with an AI service
    console.log("Owners AI Chat query:", query)
    setOwnersAiChatInput("")
    // In a real implementation, this would call an AI API and display the response
  }

  // AI Chat state for Tenants
  const [tenantsAiChatInput, setTenantsAiChatInput] = useState("")

  const handleTenantsAiChatSubmit = (query: string) => {
    // Handle AI chat submission - this would integrate with an AI service
    console.log("Tenants AI Chat query:", query)
    setTenantsAiChatInput("")
    // In a real implementation, this would call an AI API and display the response
  }
  const [techniciansViewMode, setTechniciansViewMode] = useState<"list" | "grid">("list")
  const [leasingAgentsViewMode, setLeasingAgentsViewMode] = useState<"list" | "grid">("list")

  const [vendorSearchQuery, setVendorSearchQuery] = useState("")
  const [vendorTradeFilter, setVendorTradeFilter] = useState("All Trades")
  const [vendorSortColumn, setVendorSortColumn] = useState<keyof Vendor>("name")
  const [vendorSortDirection, setVendorSortDirection] = useState<"asc" | "desc">("asc")

  const [isMoreFiltersDialogOpen, setIsMoreFiltersDialogOpen] = useState(false)
  const [vendorCityFilter, setVendorCityFilter] = useState("")
  const [vendorStateFilter, setVendorStateFilter] = useState("Select...")
  const [vendorZipFilter, setVendorZipFilter] = useState("")

  // Column filter states for Owners/Tenants tables
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedLastActive, setSelectedLastActive] = useState<string[]>([])
  const [selectedUnits, setSelectedUnits] = useState<number[]>([])
  const [statusSearchQuery, setStatusSearchQuery] = useState("")
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState("")
  const [locationSearchQuery, setLocationSearchQuery] = useState("")
  const [lastActiveSearchQuery, setLastActiveSearchQuery] = useState("")
  const [unitsSearchQuery, setUnitsSearchQuery] = useState("")
  const [selectedCompanyLlc, setSelectedCompanyLlc] = useState<string[]>([])
  const [companyLlcSearchQuery, setCompanyLlcSearchQuery] = useState("")
  const [selectedCsm, setSelectedCsm] = useState<string[]>([])
  const [csmSearchQuery, setCsmSearchQuery] = useState("")

  // Owner tile filter states
  const [ownerTileFilter, setOwnerTileFilter] = useState<"all" | "active" | "pending" | "terminations" | "tag">("all")
  const [pendingSubFilter, setPendingSubFilter] = useState<"all" | "tasks" | "processes">("all")
  const [terminationSubFilter, setTerminationSubFilter] = useState<"all" | "under" | "hidden">("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")

  // Owner advanced filter modal states
  const [showOwnerFilterModal, setShowOwnerFilterModal] = useState(false)
  const [ownerModalFilterField, setOwnerModalFilterField] = useState("")
  const [ownerModalFilterValues, setOwnerModalFilterValues] = useState<string[]>([])
  const [ownerModalOptionSearch, setOwnerModalOptionSearch] = useState("")
  const [ownerModalFieldSearch, setOwnerModalFieldSearch] = useState("")
  const [showOwnerFieldDropdown, setShowOwnerFieldDropdown] = useState(false)
  const [ownerAppliedFilters, setOwnerAppliedFilters] = useState<{ field: string; values: string[] }[]>([])

  // Filter fields for owner filter modal (same as All Properties page)
  const OWNER_FILTER_FIELDS = [
    "Integration", "Status", "Property Group(s)", "In Relationship(s)", "In Relationship Status",
    "Tagged With Any", "Tagged With All", "Created At", "Updated At", "Owner Move Out Date",
    "Have we received the signed management agreement yet?", "HOA?", "HOA Name", "Utility Region",
    "Do we have the HOA documents/contact info?", "Pet's Allowed?", "Power Company", "Gas Company",
    "Available By Date", "Section 8?", "Trash Company", "Water/Sewer Company", "Oil (Heat or Hot Water)",
    "Available", "Water Company", "Sewer Company", "Start Marketing", "Does the owner allow for pets?",
    "Microwave Included?", "Dishwasher Included?", "Stove/Oven Included?", "Refrigerator Included?",
    "Listing Price", "Sold Price", "Washer Included?", "Date Ratified", "Dryer Included?", "Listing Date",
    "Pool?", "Send Seller Brokerage Fee Form", "Community Center?", "House keys", "PICRA RECEIVED",
    "Lockbox Code", "Mailbox keys", "PICRA RATIFIED", "Closing Date", "Community keys", "Walkthrough Date",
    "Garage door remotes", "Ceiling fan remotes", "Listing Agreement Signed", "Power Company Contact",
    "Key Fobs (for HOA)", "Termite & Moisture Inspection Date", "Air conditioning", "Inspection Date",
    "Security Code", "Decision on applying to Guarantors", "Guarantors results on renewal",
    "Satisfaction follow-up email response", "Funds Received?",
  ]

  const OWNER_FIELDS_WITH_SELECT_ALL = ["Property Group(s)", "In Relationship(s)", "Tagged With Any", "Tagged With All"]

  const getOwnerFilterOptions = (field: string): string[] => {
    if (field === "Status") return ["Active", "Inactive"]
    if (field === "Property Group(s)") return [
      "CSR - Abby Portfolio", "CSR - Aiden Portfolio", "CSR - Alyssa Portfolio", "CSR - Amanda Portfolio",
      "CSR - Ashton Portfolio", "CSR - Ayesha Portfolio", "CSR - Brett Portfolio", "CSR - Colin Portfolio",
      "CSR - Devin Portfolio", "CSR - Elena Portfolio", "CSR - Fiona Portfolio", "CSR - Grant Portfolio",
      "CSR - Hannah Portfolio", "CSR - Isaac Portfolio", "CSR - Julia Portfolio", "CSR - Kevin Portfolio",
      "CSR - Liam Portfolio", "CSR - Maya Portfolio", "CSR - Noah Portfolio", "CSR - Olivia Portfolio",
    ]
    if (field === "In Relationship(s)") return [
      "New Tenant Leads", "NEW TENANTS LEADS", "New Vendor Leads", "PMC Leads",
      "Realty Buyer Leads", "Realty Seller Leads", "Recruiting", "Referral Partners",
      "Scott PMC Acquisitions", "Strategic Property Owner Leads",
    ]
    if (field === "Tagged With Any" || field === "Tagged With All") return ["Commercial", "Corporate", "Residential", "VIP", "New", "Priority"]
    if (field === "Integration") return ["AppFolio", "Buildium", "RentManager", "Yardi", "None"]
    if (field === "In Relationship Status") return ["Active", "Inactive", "Pending"]
    if (field.includes("Included?") || field.includes("Allowed?") || field === "HOA?" || field === "Pool?" || field === "Community Center?" || field === "Section 8?" || field === "Available" || field === "Funds Received?" || field === "Does the owner allow for pets?") return ["Yes", "No"]
    if (field === "Utility Region") return ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast", "Pacific Northwest"]
    return ["Option A", "Option B", "Option C"]
  }

  const applyOwnerModalFilter = () => {
    if (!ownerModalFilterField || ownerModalFilterValues.length === 0) return
    setOwnerAppliedFilters([...ownerAppliedFilters, { field: ownerModalFilterField, values: ownerModalFilterValues }])
    setOwnerModalFilterField("")
    setOwnerModalFilterValues([])
    setOwnerModalOptionSearch("")
    setShowOwnerFilterModal(false)
    setCurrentPage(1)
  }

  const closeOwnerFilterModal = useCallback(() => {
    setShowOwnerFilterModal(false)
    setOwnerModalFilterField("")
    setOwnerModalFilterValues([])
    setOwnerModalOptionSearch("")
    setOwnerModalFieldSearch("")
    setShowOwnerFieldDropdown(false)
  }, [])

  const removeOwnerFilter = (index: number) => {
    setOwnerAppliedFilters(ownerAppliedFilters.filter((_, i) => i !== index))
    setCurrentPage(1)
  }

  // Tenant tile filter states
  const [tenantTileFilter, setTenantTileFilter] = useState<"all" | "active" | "pending" | "moveout" | "evictions" | "type">("all")
  const [tenantPendingSubFilter, setTenantPendingSubFilter] = useState<"all" | "tasks" | "processes">("all")
  const [tenantMoveoutSubFilter, setTenantMoveoutSubFilter] = useState<"all" | "pending" | "completed">("all")
  const [tenantEvictionSubFilter, setTenantEvictionSubFilter] = useState<"all" | "pending" | "completed">("all")
  const [selectedTenantType, setSelectedTenantType] = useState<"all" | "Self Paying" | "Section 8">("all")

  // Tenant advanced filter modal states
  const [showTenantFilterModal, setShowTenantFilterModal] = useState(false)
  const [tenantModalFilterField, setTenantModalFilterField] = useState("")
  const [tenantModalFilterValues, setTenantModalFilterValues] = useState<string[]>([])
  const [tenantModalOptionSearch, setTenantModalOptionSearch] = useState("")
  const [tenantModalFieldSearch, setTenantModalFieldSearch] = useState("")
  const [showTenantFieldDropdown, setShowTenantFieldDropdown] = useState(false)
  const [tenantAppliedFilters, setTenantAppliedFilters] = useState<{ field: string; values: string[] }[]>([])

  // Filter fields for tenant filter modal (same as All Properties page)
  const TENANT_FILTER_FIELDS = [
    "Integration", "Status", "Property Group(s)", "In Relationship(s)", "In Relationship Status",
    "Tagged With Any", "Tagged With All", "Created At", "Updated At", "Owner Move Out Date",
    "Have we received the signed management agreement yet?", "HOA?", "HOA Name", "Utility Region",
    "Do we have the HOA documents/contact info?", "Pet's Allowed?", "Power Company", "Gas Company",
    "Available By Date", "Section 8?", "Trash Company", "Water/Sewer Company", "Oil (Heat or Hot Water)",
    "Available", "Water Company", "Sewer Company", "Start Marketing", "Does the owner allow for pets?",
    "Microwave Included?", "Dishwasher Included?", "Stove/Oven Included?", "Refrigerator Included?",
    "Listing Price", "Sold Price", "Washer Included?", "Date Ratified", "Dryer Included?", "Listing Date",
    "Pool?", "Send Seller Brokerage Fee Form", "Community Center?", "House keys", "PICRA RECEIVED",
    "Lockbox Code", "Mailbox keys", "PICRA RATIFIED", "Closing Date", "Community keys", "Walkthrough Date",
    "Garage door remotes", "Ceiling fan remotes", "Listing Agreement Signed", "Power Company Contact",
    "Key Fobs (for HOA)", "Termite & Moisture Inspection Date", "Air conditioning", "Inspection Date",
    "Security Code", "Decision on applying to Guarantors", "Guarantors results on renewal",
    "Satisfaction follow-up email response", "Funds Received?",
  ]

  const TENANT_FIELDS_WITH_SELECT_ALL = ["Property Group(s)", "In Relationship(s)", "Tagged With Any", "Tagged With All"]

  const getTenantFilterOptions = (field: string): string[] => {
    if (field === "Status") return ["Active", "Inactive"]
    if (field === "Property Group(s)") return [
      "CSR - Abby Portfolio", "CSR - Aiden Portfolio", "CSR - Alyssa Portfolio", "CSR - Amanda Portfolio",
      "CSR - Ashton Portfolio", "CSR - Ayesha Portfolio", "CSR - Brett Portfolio", "CSR - Colin Portfolio",
      "CSR - Devin Portfolio", "CSR - Elena Portfolio", "CSR - Fiona Portfolio", "CSR - Grant Portfolio",
      "CSR - Hannah Portfolio", "CSR - Isaac Portfolio", "CSR - Julia Portfolio", "CSR - Kevin Portfolio",
      "CSR - Liam Portfolio", "CSR - Maya Portfolio", "CSR - Noah Portfolio", "CSR - Olivia Portfolio",
    ]
    if (field === "In Relationship(s)") return [
      "New Tenant Leads", "NEW TENANTS LEADS", "New Vendor Leads", "PMC Leads",
      "Realty Buyer Leads", "Realty Seller Leads", "Recruiting", "Referral Partners",
      "Scott PMC Acquisitions", "Strategic Property Owner Leads",
    ]
    if (field === "Tagged With Any" || field === "Tagged With All") return ["Commercial", "Corporate", "Residential", "VIP", "New", "Priority"]
    if (field === "Integration") return ["AppFolio", "Buildium", "RentManager", "Yardi", "None"]
    if (field === "In Relationship Status") return ["Active", "Inactive", "Pending"]
    if (field.includes("Included?") || field.includes("Allowed?") || field === "HOA?" || field === "Pool?" || field === "Community Center?" || field === "Section 8?" || field === "Available" || field === "Funds Received?" || field === "Does the owner allow for pets?") return ["Yes", "No"]
    if (field === "Utility Region") return ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast", "Pacific Northwest"]
    return ["Option A", "Option B", "Option C"]
  }

  const applyTenantModalFilter = () => {
    if (!tenantModalFilterField || tenantModalFilterValues.length === 0) return
    setTenantAppliedFilters([...tenantAppliedFilters, { field: tenantModalFilterField, values: tenantModalFilterValues }])
    setTenantModalFilterField("")
    setTenantModalFilterValues([])
    setTenantModalOptionSearch("")
    setShowTenantFilterModal(false)
    setCurrentPage(1)
  }

  const closeTenantFilterModal = useCallback(() => {
    setShowTenantFilterModal(false)
    setTenantModalFilterField("")
    setTenantModalFilterValues([])
    setTenantModalOptionSearch("")
    setTenantModalFieldSearch("")
    setShowTenantFieldDropdown(false)
  }, [])

  const removeTenantFilter = (index: number) => {
    setTenantAppliedFilters(tenantAppliedFilters.filter((_, i) => i !== index))
    setCurrentPage(1)
  }

  // Get unique values for filter options
  const uniqueStatuses = Array.from(new Set(MOCK_CONTACTS.map(c => c.status)))
  const uniqueAssignees = Array.from(new Set(MOCK_CONTACTS.map(c => c.assignedStaff).filter(Boolean)))
  const uniqueLocations = Array.from(new Set(MOCK_CONTACTS.map(c => c.location).filter(Boolean)))
  const uniqueLastActive = ["Less than 1 hour", "1-6 hours", "1 day", "2-7 days", "More than 1 week"]
  const uniqueUnits = Array.from(new Set(MOCK_CONTACTS.filter(c => (c.type === "Owner" || c.type === "Tenant") && c.units !== undefined).map(c => c.units!))).sort((a, b) => a - b)
  const uniqueCompanyLlc = Array.from(new Set(MOCK_CONTACTS.filter(c => c.type === "Owner" && c.companyLlc).map(c => c.companyLlc!))).sort()
  const uniqueCsm = Array.from(new Set(MOCK_CONTACTS.filter(c => c.type === "Owner" && c.csm).map(c => c.csm!))).sort()

  // Check if any column filter is active
  const hasActiveColumnFilters = 
    selectedStatuses.length > 0 ||
    selectedAssignees.length > 0 ||
    selectedLocations.length > 0 ||
    selectedLastActive.length > 0 ||
    selectedUnits.length > 0 ||
    selectedCompanyLlc.length > 0 ||
    selectedCsm.length > 0

  // Reset all column filters
  const resetColumnFilters = () => {
    setSelectedStatuses([])
    setSelectedAssignees([])
    setSelectedLocations([])
    setSelectedLastActive([])
    setSelectedUnits([])
    setStatusSearchQuery("")
    setAssigneeSearchQuery("")
    setLocationSearchQuery("")
    setLastActiveSearchQuery("")
    setUnitsSearchQuery("")
    setSelectedCompanyLlc([])
    setCompanyLlcSearchQuery("")
    setSelectedCsm([])
    setCsmSearchQuery("")
  }

  const filteredVendors = MOCK_VENDORS.filter((vendor) => {
    const matchesSearch =
      vendorSearchQuery === "" || vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
    const matchesTrade =
      vendorTradeFilter === "All Trades" || vendor.trades.toLowerCase().includes(vendorTradeFilter.toLowerCase())
    const matchesCity = vendorCityFilter === "" || vendor.address.toLowerCase().includes(vendorCityFilter.toLowerCase())
    const matchesState =
      vendorStateFilter === "Select..." || vendor.address.toLowerCase().includes(vendorStateFilter.toLowerCase())
    const matchesZip = vendorZipFilter === "" || vendor.address.toLowerCase().includes(vendorZipFilter.toLowerCase())
    return matchesSearch && matchesTrade && matchesCity && matchesState && matchesZip
  }).sort((a, b) => {
    const aValue = a[vendorSortColumn] || ""
    const bValue = b[vendorSortColumn] || ""
    if (vendorSortDirection === "asc") {
      return aValue.localeCompare(bValue)
    }
    return bValue.localeCompare(aValue)
  })

  const handleVendorSort = (column: keyof Vendor) => {
    if (vendorSortColumn === column) {
      setVendorSortDirection(vendorSortDirection === "asc" ? "desc" : "asc")
    } else {
      setVendorSortColumn(column)
      setVendorSortDirection("asc")
    }
  }

  const clearVendorFilters = () => {
    setVendorSearchQuery("")
    setVendorTradeFilter("All Trades")
    setVendorCityFilter("")
    setVendorStateFilter("Select...")
    setVendorZipFilter("")
    setIsMoreFiltersDialogOpen(false)
  }

  const getVendorSortIcon = (column: keyof Vendor) => {
    if (vendorSortColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 ml-1" />
    }
    return vendorSortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    )
  }

  // Helper function to categorize last active time
  const getLastActiveCategory = (lastActive: string): string => {
    const lower = lastActive.toLowerCase()
    if (lower.includes("hour") && !lower.includes("hours")) return "Less than 1 hour"
    if (lower.includes("hours")) return "1-6 hours"
    if (lower === "1 day ago" || lower.includes("1 day")) return "1 day"
    if (lower.includes("day") && !lower.includes("week")) return "2-7 days"
    return "More than 1 week"
  }

  const filteredContacts = MOCK_CONTACTS.filter((contact) => {
    // Role filter
    if (activeTab === "owners" && contact.type !== "Owner") return false
    // Owner tile filters
    if (activeTab === "owners" && contact.type === "Owner") {
      if (ownerTileFilter === "active" && contact.status !== "Active") return false
      if (ownerTileFilter === "pending") {
        const hasPendingTask = (contact.pendingTasks || 0) > 0
        const hasPendingProcess = (contact.pendingProcesses || 0) > 0
        if (pendingSubFilter === "all" && !hasPendingTask && !hasPendingProcess) return false
        if (pendingSubFilter === "tasks" && !hasPendingTask) return false
        if (pendingSubFilter === "processes" && !hasPendingProcess) return false
      }
      if (ownerTileFilter === "terminations") {
        if (terminationSubFilter === "all" && !contact.terminationStatus) return false
        if (terminationSubFilter === "under" && contact.terminationStatus !== "Under Termination") return false
        if (terminationSubFilter === "hidden" && contact.terminationStatus !== "Terminated Hidden") return false
      }
      if (ownerTileFilter === "tag" && selectedTag !== "all") {
        if (!contact.tags || !contact.tags.includes(selectedTag)) return false
      }
    }
    if (activeTab === "tenants" && contact.type !== "Tenant") return false
    // Tenant tile filters
    if (activeTab === "tenants" && contact.type === "Tenant") {
      if (tenantTileFilter === "active" && contact.status !== "Active") return false
      if (tenantTileFilter === "pending") {
        const hasPendingTask = (contact.tenantPendingTasks || 0) > 0
        const hasPendingProcess = (contact.tenantPendingProcesses || 0) > 0
        if (tenantPendingSubFilter === "all" && !hasPendingTask && !hasPendingProcess) return false
        if (tenantPendingSubFilter === "tasks" && !hasPendingTask) return false
        if (tenantPendingSubFilter === "processes" && !hasPendingProcess) return false
      }
      if (tenantTileFilter === "moveout") {
        if (tenantMoveoutSubFilter === "all" && !contact.moveOutStatus) return false
        if (tenantMoveoutSubFilter === "pending" && contact.moveOutStatus !== "Pending") return false
        if (tenantMoveoutSubFilter === "completed" && contact.moveOutStatus !== "Completed") return false
      }
      if (tenantTileFilter === "evictions") {
        if (tenantEvictionSubFilter === "all" && !contact.evictionStatus) return false
        if (tenantEvictionSubFilter === "pending" && contact.evictionStatus !== "Pending") return false
        if (tenantEvictionSubFilter === "completed" && contact.evictionStatus !== "Completed") return false
      }
      if (tenantTileFilter === "type" && selectedTenantType !== "all") {
        if (contact.tenantType !== selectedTenantType) return false
      }
    }
    if (activeTab === "vendors" && contact.type !== "Vendor") return false
    if (activeTab === "property-technician" && contact.type !== "Property Technician") return false
    if (activeTab === "leasing-agent" && contact.type !== "Leasing Agent") return false

    // Admin access control simulation
    if (!isAdmin && contact.type === "Owner") return false

    if (statusFilter !== "all" && contact.status !== statusFilter) return false

    // Column filters for owners/tenants only
    if (activeTab === "owners" || activeTab === "tenants") {
      // Status column filter (multi-select)
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(contact.status)) return false
      
      // Assignee/CSR column filter (multi-select)
      if (selectedAssignees.length > 0 && !selectedAssignees.includes(contact.assignedStaff)) return false
      
      // Company/LLC column filter (multi-select, owners only)
      if (selectedCompanyLlc.length > 0 && !selectedCompanyLlc.includes(contact.companyLlc || "")) return false
      
      // CSM column filter (multi-select, owners only)
      if (selectedCsm.length > 0 && !selectedCsm.includes(contact.csm || "")) return false
      
      // Location column filter (multi-select)
      if (selectedLocations.length > 0 && !selectedLocations.includes(contact.location)) return false
      
      // Last Active column filter (multi-select by category)
      if (selectedLastActive.length > 0) {
        const category = getLastActiveCategory(contact.lastActive)
        if (!selectedLastActive.includes(category)) return false
      }
      
      // Units column filter (multi-select)
      if (selectedUnits.length > 0 && (contact.units === undefined || !selectedUnits.includes(contact.units))) return false
    }

    // Search filter
    const searchLower = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.properties.some((p) => p.toLowerCase().includes(searchLower)) ||
      (contact.specialty && contact.specialty.toLowerCase().includes(searchLower)) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.companyLlc && contact.companyLlc.toLowerCase().includes(searchLower)) ||
      (contact.csm && contact.csm.toLowerCase().includes(searchLower))
    )
  })

  const totalOwners = MOCK_CONTACTS.filter((c) => c.type === "Owner").length
  const totalTenants = MOCK_CONTACTS.filter((c) => c.type === "Tenant").length
  const totalVendors = MOCK_CONTACTS.filter((c) => c.type === "Vendor").length
  const totalTechnicians = MOCK_CONTACTS.filter((c) => c.type === "Property Technician").length
  const totalLeasingAgents = MOCK_CONTACTS.filter((c) => c.type === "Leasing Agent").length
  const activeContacts = MOCK_CONTACTS.filter((c) => c.status === "Active").length
  const pendingContacts = MOCK_CONTACTS.filter((c) => c.status === "Pending").length

  // Pagination calculations
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleContacts = filteredContacts.slice(startIndex, endIndex)
  const totalContacts = filteredContacts.length
  const hasMoreContacts = endIndex < filteredContacts.length

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, totalContacts))
      setIsLoadingMore(false)
    }, 300)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setVisibleCount(20)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success hover:bg-success/15"
      case "Inactive":
        return "bg-muted text-muted-foreground hover:bg-muted/80/80"
      case "Pending":
        return "bg-warning/10 text-warning-foreground hover:bg-warning/15"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeColor = (type: ContactType) => {
    switch (type) {
      case "Owner":
        return "bg-success/10 text-success"
      case "Tenant":
        return "bg-chart-4/10 text-chart-4"
      case "Vendor":
        return "bg-chart-3/10 text-chart-3"
      case "Property Technician":
        return "bg-info/10 text-info"
      case "Leasing Agent":
        return "bg-chart-5/10 text-chart-5"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleRowClick = (contact: Contact) => {
    if (contact.type === "Owner") {
      if (onContactClick) {
        onContactClick(contact)
      }
    } else if (contact.type === "Tenant") {
      if (onTenantClick) {
        onTenantClick(contact)
      }
    } else {
      // For other types, show the sheet
      setSelectedContact(contact)
      setIsSheetOpen(true)
    }
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "owners":
        return "Owners"
      case "tenants":
        return "Tenants"
      case "vendors":
        return "Vendors"
      case "property-technician":
        return "Property Technicians"
      case "leasing-agent":
        return "Leasing Agents"
      default:
        return "All Contacts"
    }
  }

  const getPageDescription = () => {
    switch (activeTab) {
      case "owners":
        return "Manage property owner relationships and communications."
      case "tenants":
        return "View and manage tenant information and lease details."
      case "vendors":
        return "Manage your vendor relationships and service providers."
      case "property-technician":
        return "Manage your in-house property technicians and maintenance staff."
      case "leasing-agent":
        return "Manage your leasing agents and their property assignments."
      default:
        return "View and manage all your contacts in one place."
    }
  }

  // Get stats cards based on active tab
  const getStatsCards = () => {
    if (activeTab === "vendors") {
      const totalVendors = MOCK_VENDORS.length
      const uniqueTrades = [...new Set(MOCK_VENDORS.filter((v) => v.trades).flatMap((v) => v.trades.split(",")))].length
      const vendorsWithEmail = MOCK_VENDORS.filter((v) => v.email).length
      const vendorsWithPhone = MOCK_VENDORS.filter((v) => v.phone).length

      return (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Vendors</span>
            <span className="text-xl font-bold">{totalVendors}</span>
            <span className="text-xs text-muted-foreground">Service providers</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-success/10">
              <Wrench className="h-4 w-4 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Trades</span>
            <span className="text-xl font-bold">{uniqueTrades}</span>
            <span className="text-xs text-muted-foreground">Categories</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-info/10">
              <Mail className="h-4 w-4 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">With Email</span>
            <span className="text-xl font-bold">{vendorsWithEmail}</span>
            <span className="text-xs text-muted-foreground">Contactable</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-accent">
              <Phone className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">With Phone</span>
            <span className="text-xl font-bold">{vendorsWithPhone}</span>
            <span className="text-xs text-muted-foreground">Reachable</span>
          </div>
        </div>
      )
    }

    if (activeTab === "property-technician") {
      const activeTechs = MOCK_CONTACTS.filter((c) => c.type === "Property Technician" && c.status === "Active").length
      const pendingTechs = MOCK_CONTACTS.filter(
        (c) => c.type === "Property Technician" && c.status === "Pending",
      ).length
      const specialties = new Set(
        MOCK_CONTACTS.filter((c) => c.type === "Property Technician" && c.specialty).map((c) => c.specialty),
      ).size

      return (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-info/10">
              <Wrench className="h-4 w-4 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Total Technicians</span>
            <span className="text-xl font-bold">{totalTechnicians}</span>
            <span className="text-xs text-muted-foreground">Maintenance staff</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-success/10">
              <UserCheck className="h-4 w-4 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Active</span>
            <span className="text-xl font-bold">{activeTechs}</span>
            <span className="text-xs text-success">Available</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-accent">
              <Wrench className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Specialties</span>
            <span className="text-xl font-bold">{specialties}</span>
            <span className="text-xs text-muted-foreground">Skill sets</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="text-xl font-bold">{pendingTechs}</span>
            <span className="text-xs text-warning">Awaiting</span>
          </div>
        </div>
      )
    }

    if (activeTab === "leasing-agent") {
      const activeAgents = MOCK_CONTACTS.filter((c) => c.type === "Leasing Agent" && c.status === "Active").length
      const totalProperties = MOCK_CONTACTS.filter((c) => c.type === "Leasing Agent").reduce(
        (acc, c) => acc + c.properties.length,
        0,
      )

      return (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-destructive/10">
              <Home className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Total Agents</span>
            <span className="text-xl font-bold">{totalLeasingAgents}</span>
            <span className="text-xs text-muted-foreground">Professionals</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-success/10">
              <UserCheck className="h-4 w-4 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Active</span>
            <span className="text-xl font-bold">{activeAgents}</span>
            <span className="text-xs text-success">Currently active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-info/10">
              <Building2 className="h-4 w-4 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Properties</span>
            <span className="text-xl font-bold">{totalProperties}</span>
            <span className="text-xs text-muted-foreground">Assigned</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
            <div className="p-1 rounded bg-warning/10">
              <Home className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Avg Properties</span>
            <span className="text-xl font-bold">
              {totalLeasingAgents > 0 ? (totalProperties / totalLeasingAgents).toFixed(1) : 0}
            </span>
            <span className="text-xs text-muted-foreground">Per agent</span>
          </div>
        </div>
      )
    }

    // Owner-specific tiles
    if (activeTab === "owners") {
      const allOwners = MOCK_CONTACTS.filter(c => c.type === "Owner")
      const activeOwnerCount = allOwners.filter(c => c.status === "Active").length
      const ownerPendingTasks = allOwners.reduce((sum, c) => sum + (c.pendingTasks || 0), 0)
      const ownerPendingProcesses = allOwners.reduce((sum, c) => sum + (c.pendingProcesses || 0), 0)
      const underTermination = allOwners.filter(c => c.terminationStatus === "Under Termination").length
      const terminatedHidden = allOwners.filter(c => c.terminationStatus === "Terminated Hidden").length
      const allTags = Array.from(new Set(allOwners.flatMap(c => c.tags || []))).sort()

      const getPendingCount = () => {
        if (pendingSubFilter === "tasks") return ownerPendingTasks
        if (pendingSubFilter === "processes") return ownerPendingProcesses
        return ownerPendingTasks + ownerPendingProcesses
      }

      const getTerminationCount = () => {
        if (terminationSubFilter === "under") return underTermination
        if (terminationSubFilter === "hidden") return terminatedHidden
        return underTermination + terminatedHidden
      }

      const getTagCount = () => {
        if (selectedTag === "all") return allOwners.length
        return allOwners.filter(c => c.tags?.includes(selectedTag)).length
      }

      return (
        <div className="grid grid-cols-5 gap-3">
          {/* Total Owners */}
          <div
            className={`flex flex-col border rounded-lg shadow-sm cursor-pointer transition-colors ${ownerTileFilter === "all" ? "ring-2 ring-primary bg-primary/5" : "bg-background hover:bg-muted/50"}`}
            onClick={() => { setOwnerTileFilter("all"); setCurrentPage(1) }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-success/5">
              <div className="p-1 rounded bg-success/10">
                <Building2 className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs font-medium text-foreground">Total Owners</span>
              
            </div>
            <div className="flex-1 flex items-center justify-center px-3 py-3">
              <span className="text-muted-foreground text-2xl font-extrabold">41</span>
            </div>
          </div>

          {/* Active Owners */}
          <div
            className={`flex flex-col border rounded-lg shadow-sm cursor-pointer transition-colors ${ownerTileFilter === "active" ? "ring-2 ring-primary bg-primary/5" : "bg-background hover:bg-muted/50"}`}
            onClick={() => { setOwnerTileFilter("active"); setCurrentPage(1) }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
              <div className="p-1 rounded bg-info/10">
                <UserCheck className="h-4 w-4 text-info" />
              </div>
              <span className="text-xs font-medium text-foreground">Active Owners</span>
              
            </div>
            <div className="flex-1 flex items-center justify-center px-3 py-3">
              <span className="text-muted-foreground font-extrabold text-2xl">29</span>
            </div>
          </div>

          {/* Pending (Expanded) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${ownerTileFilter === "pending" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
              <div className="p-1 rounded bg-warning/10">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <span className="text-xs font-medium text-foreground">Pending</span>
              <span className="text-lg font-bold ml-auto">{getPendingCount()}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1">
              <button
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                  ownerTileFilter === "pending" && pendingSubFilter === "tasks"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => {
                  setOwnerTileFilter("pending")
                  setPendingSubFilter("tasks")
                  setCurrentPage(1)
                }}
              >
                <span className="text-left">Pending Tasks</span>
                <span className="font-semibold">{ownerPendingTasks}</span>
              </button>
              <button
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                  ownerTileFilter === "pending" && pendingSubFilter === "processes"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => {
                  setOwnerTileFilter("pending")
                  setPendingSubFilter("processes")
                  setCurrentPage(1)
                }}
              >
                <span className="text-left">Pending Processes</span>
                <span className="font-semibold">{ownerPendingProcesses}</span>
              </button>
            </div>
          </div>

          {/* Terminations (Expanded) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${ownerTileFilter === "terminations" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-destructive/5">
              <div className="p-1 rounded bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-xs font-medium text-foreground">Terminations</span>
              <span className="text-lg font-bold ml-auto">{getTerminationCount()}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1">
              <button
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                  ownerTileFilter === "terminations" && terminationSubFilter === "under"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => {
                  setOwnerTileFilter("terminations")
                  setTerminationSubFilter("under")
                  setCurrentPage(1)
                }}
              >
                <span className="text-left">Under Termination</span>
                <span className="font-semibold">{underTermination}</span>
              </button>
              <button
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                  ownerTileFilter === "terminations" && terminationSubFilter === "hidden"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => {
                  setOwnerTileFilter("terminations")
                  setTerminationSubFilter("hidden")
                  setCurrentPage(1)
                }}
              >
                <span className="text-left">Termination Hidden</span>
                <span className="font-semibold">{terminatedHidden}</span>
              </button>
            </div>
          </div>

          {/* Tags (Expanded with scroll) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${ownerTileFilter === "tag" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
              <div className="p-1 rounded bg-accent">
                <Tag className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">Tags</span>
              <span className="text-lg font-bold ml-auto">{getTagCount()}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1 max-h-[90px] overflow-y-auto">
              <button
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors shrink-0 ${
                  ownerTileFilter === "tag" && selectedTag === "all"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => {
                  setOwnerTileFilter("tag")
                  setSelectedTag("all")
                  setCurrentPage(1)
                }}
              >
                <span>All Owners</span>
                <span className="font-semibold">{allOwners.length}</span>
              </button>
              {allTags.map((tag) => {
                const tagOwnerCount = allOwners.filter(c => c.tags?.includes(tag)).length
                return (
                  <button
                    key={tag}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors shrink-0 ${
                      ownerTileFilter === "tag" && selectedTag === tag
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/80 text-muted-foreground"
                    }`}
                    onClick={() => {
                      setOwnerTileFilter("tag")
                      setSelectedTag(tag)
                      setCurrentPage(1)
                    }}
                  >
                    <span>{tag}</span>
                    <span className="font-semibold">{tagOwnerCount}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // Tenant-specific tiles
    if (activeTab === "tenants") {
      const allTenants = MOCK_CONTACTS.filter(c => c.type === "Tenant")
      const activeTenantCount = allTenants.filter(c => c.status === "Active").length
      const tenantPendingTasksTotal = allTenants.reduce((sum, c) => sum + (c.tenantPendingTasks || 0), 0)
      const tenantPendingProcessesTotal = allTenants.reduce((sum, c) => sum + (c.tenantPendingProcesses || 0), 0)
      const pendingMoveouts = allTenants.filter(c => c.moveOutStatus === "Pending").length
      const completedMoveouts = allTenants.filter(c => c.moveOutStatus === "Completed").length
      const pendingEvictions = allTenants.filter(c => c.evictionStatus === "Pending").length
      const completedEvictions = allTenants.filter(c => c.evictionStatus === "Completed").length
      const allTenantTags = Array.from(new Set(allTenants.flatMap(c => c.tenantTags || []))).sort()

      const getTenantPendingCount = () => {
        if (tenantPendingSubFilter === "tasks") return tenantPendingTasksTotal
        if (tenantPendingSubFilter === "processes") return tenantPendingProcessesTotal
        return tenantPendingTasksTotal + tenantPendingProcessesTotal
      }

      const getMoveoutCount = () => {
        if (tenantMoveoutSubFilter === "pending") return pendingMoveouts
        if (tenantMoveoutSubFilter === "completed") return completedMoveouts
        return pendingMoveouts + completedMoveouts
      }

      const getEvictionCount = () => {
        if (tenantEvictionSubFilter === "pending") return pendingEvictions
        if (tenantEvictionSubFilter === "completed") return completedEvictions
        return pendingEvictions + completedEvictions
      }

      const getTenantTypeCount = () => {
        if (selectedTenantType === "all") return allTenants.length
        return allTenants.filter(c => c.tenantType === selectedTenantType).length
      }

      return (
        <div className="grid grid-cols-6 gap-3">
          {/* Total Tenants */}
          <div
            className={`flex flex-col border rounded-lg shadow-sm cursor-pointer transition-colors ${tenantTileFilter === "all" ? "ring-2 ring-primary bg-primary/5" : "bg-background hover:bg-muted/50"}`}
            onClick={() => { setTenantTileFilter("all"); setCurrentPage(1) }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-success/5">
              <div className="p-1 rounded bg-success/10">
                <Users className="h-4 w-4 text-success" />
              </div>
              <span className="text-xs font-medium text-foreground">Total Tenants</span>
              
            </div>
            <div className="flex-1 flex items-center justify-center px-3 py-3">
              <span className="text-muted-foreground font-extrabold text-2xl">46</span>
            </div>
          </div>

          {/* Active Tenants */}
          <div
            className={`flex flex-col border rounded-lg shadow-sm cursor-pointer transition-colors ${tenantTileFilter === "active" ? "ring-2 ring-primary bg-primary/5" : "bg-background hover:bg-muted/50"}`}
            onClick={() => { setTenantTileFilter("active"); setCurrentPage(1) }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
              <div className="p-1 rounded bg-info/10">
                <UserCheck className="h-4 w-4 text-info" />
              </div>
              <span className="text-xs font-medium text-foreground">Active Tenants</span>
              
            </div>
            <div className="flex-1 flex items-center justify-center px-3 py-3">
              <span className="text-muted-foreground font-extrabold text-2xl">{activeTenantCount}</span>
            </div>
          </div>

          {/* Pending (Expanded) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${tenantTileFilter === "pending" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
              <div className="p-1 rounded bg-warning/10">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <span className="text-xs font-medium text-foreground">Pending</span>
              <span className="text-lg font-bold ml-auto">{getTenantPendingCount()}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1">
              {[
                { label: "Pending Tasks", value: "tasks" as const, count: tenantPendingTasksTotal },
                { label: "Pending Processes", value: "processes" as const, count: tenantPendingProcessesTotal },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                    tenantTileFilter === "pending" && tenantPendingSubFilter === item.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/80 text-muted-foreground"
                  }`}
                  onClick={() => {
                    setTenantTileFilter("pending")
                    setTenantPendingSubFilter(item.value)
                    setCurrentPage(1)
                  }}
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Move-out (Expanded) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${tenantTileFilter === "moveout" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
              <div className="p-1 rounded bg-warning/10">
                <LogOut className="h-4 w-4 text-warning" />
              </div>
              <span className="text-xs font-medium text-foreground">Move-out</span>
              <span className="text-lg font-bold ml-auto">{pendingMoveouts + completedMoveouts}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1">
              {[
                { label: "Pending Move-outs", value: "pending" as const, count: pendingMoveouts },
                { label: "Completed Move-outs", value: "completed" as const, count: completedMoveouts },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                    tenantTileFilter === "moveout" && tenantMoveoutSubFilter === item.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/80 text-muted-foreground"
                  }`}
                  onClick={() => {
                    setTenantTileFilter("moveout")
                    setTenantMoveoutSubFilter(item.value)
                    setCurrentPage(1)
                  }}
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Evictions (Expanded) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${tenantTileFilter === "evictions" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-destructive/5">
              <div className="p-1 rounded bg-destructive/10">
                <Gavel className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-xs font-medium text-foreground">Evictions</span>
              <span className="text-lg font-bold ml-auto">{pendingEvictions + completedEvictions}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1">
              {[
                { label: "Pending Evictions", value: "pending" as const, count: pendingEvictions },
                { label: "Completed Evictions", value: "completed" as const, count: completedEvictions },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                    tenantTileFilter === "evictions" && tenantEvictionSubFilter === item.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/80 text-muted-foreground"
                  }`}
                  onClick={() => {
                    setTenantTileFilter("evictions")
                    setTenantEvictionSubFilter(item.value)
                    setCurrentPage(1)
                  }}
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type (Expanded) */}
          <div className={`flex flex-col border rounded-lg shadow-sm ${tenantTileFilter === "type" ? "ring-2 ring-primary bg-primary/5" : "bg-background"}`}>
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
              <div className="p-1 rounded bg-accent">
                <Layers className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">Type</span>
              <span className="text-lg font-bold ml-auto">{allTenants.length}</span>
            </div>
            <div className="flex-1 flex flex-col px-2 py-2 gap-1">
              {[
                { label: "Self Paying", value: "Self Paying" as const, count: allTenants.filter(c => c.tenantType === "Self Paying").length },
                { label: "Section 8", value: "Section 8" as const, count: allTenants.filter(c => c.tenantType === "Section 8").length },
              ].map((item) => (
                <button
                  key={item.value}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                    tenantTileFilter === "type" && selectedTenantType === item.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/80 text-muted-foreground"
                  }`}
                  onClick={() => {
                    setTenantTileFilter("type")
                    setSelectedTenantType(item.value)
                    setCurrentPage(1)
                  }}
                >
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Default stats for all contacts
    return (
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
          <div className="p-1 rounded bg-success/10">
            <Building2 className="h-4 w-4 text-success" />
          </div>
          <span className="text-sm text-muted-foreground">Total Owners</span>
          <span className="text-xl font-bold">{totalOwners}</span>
          <span className="text-xs text-muted-foreground">In system</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
          <div className="p-1 rounded bg-accent">
            <Users className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Total Tenants</span>
          <span className="text-xl font-bold">{totalTenants}</span>
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
          <div className="p-1 rounded bg-info/10">
            <UserCheck className="h-4 w-4 text-info" />
          </div>
          <span className="text-sm text-muted-foreground">Active Contacts</span>
          <span className="text-xl font-bold">{activeContacts}</span>
          <span className="text-xs text-info">Currently active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm">
          <div className="p-1 rounded bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-sm text-muted-foreground">Pending</span>
          <span className="text-xl font-bold">{pendingContacts}</span>
          <span className="text-xs text-warning">Awaiting action</span>
        </div>
      </div>
    )
  }

  // START: CHANGE -> Move owner detail check to the TOP before any other returns
  // This must be checked first so clicking an owner shows detail view regardless of activeTab
  // Removed this conditional rendering block, replaced by parent component handling routing
  // if (showOwnerDetail && selectedContact && selectedContact.type === "Owner") {
  //   console.log("[v0] Rendering ContactOwnerDetailPage for:", selectedContact.name)
  //   return <ContactOwnerDetailPage contact={selectedContact} onBack={handleBackFromDetail} />
  // }
  // END: CHANGE
  // Removed console log

  // START: CHANGE -> Remove the custom vendors section and use shared layout instead
  if (activeTab === "vendors") {
    return (
      <div className="flex flex-col h-full space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
            <p className="text-muted-foreground">Manage your vendor relationships and service providers.</p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </div>

        {/* Stats Cards */}
        {getStatsCards()}

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              className="pl-9"
              value={vendorSearchQuery}
              onChange={(e) => setVendorSearchQuery(e.target.value)}
            />
          </div>
          <Select value={vendorTradeFilter} onValueChange={setVendorTradeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Trades" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_OPTIONS.map((trade) => (
                <SelectItem key={trade} value={trade}>
                  {trade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button
              variant={vendorsViewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className={`rounded-r-none ${vendorsViewMode === "grid" ? "bg-primary hover:bg-primary-hover" : ""}`}
              onClick={() => setVendorsViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={vendorsViewMode === "list" ? "default" : "ghost"}
              size="icon"
              className={`rounded-l-none ${vendorsViewMode === "list" ? "bg-primary hover:bg-primary-hover" : ""}`}
              onClick={() => setVendorsViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setIsMoreFiltersDialogOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
          {(vendorSearchQuery ||
            vendorTradeFilter !== "All Trades" ||
            vendorCityFilter ||
            vendorStateFilter !== "Select..." ||
            vendorZipFilter) && (
            <Button variant="ghost" onClick={clearVendorFilters}>
              Clear Filters
            </Button>
          )}
          <span className="text-sm text-muted-foreground ml-auto">
            Showing {filteredVendors.length} of {MOCK_VENDORS.length} vendors
          </span>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted/80">
                <TableHead
                  className="font-semibold cursor-pointer select-none"
                  onClick={() => handleVendorSort("name")}
                >
                  <div className="flex items-center">Name {getVendorSortIcon("name")}</div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none"
                  onClick={() => handleVendorSort("address")}
                >
                  <div className="flex items-center">Address {getVendorSortIcon("address")}</div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none"
                  onClick={() => handleVendorSort("trades")}
                >
                  <div className="flex items-center">Trades {getVendorSortIcon("trades")}</div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none"
                  onClick={() => handleVendorSort("phone")}
                >
                  <div className="flex items-center">Phone {getVendorSortIcon("phone")}</div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer select-none"
                  onClick={() => handleVendorSort("email")}
                >
                  <div className="flex items-center">Email {getVendorSortIcon("email")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-8 w-8 text-muted-foreground/50" />
                      <span>No vendors found.</span>
                      <Button variant="link" className="text-primary" onClick={clearVendorFilters}>
                        Clear filters to see all vendors
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor, index) => (
                  <TableRow
                    key={vendor.id}
                    className={`cursor-pointer hover:bg-muted/80 ${index % 2 === 0 ? "bg-background" : "bg-muted/50"}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {vendor.name.charAt(0)}
                        </div>
                        <span className="text-primary font-medium hover:underline cursor-pointer">{vendor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {vendor.address}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor.trades && (
                        <Badge variant="outline" className="bg-success/5 text-success border-success/20">
                          {vendor.trades}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {vendor.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {vendor.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                          {vendor.email}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* More Filters Dialog */}
        <Dialog open={isMoreFiltersDialogOpen} onOpenChange={setIsMoreFiltersDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>More Filters</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="Enter city..."
                  value={vendorCityFilter}
                  onChange={(e) => setVendorCityFilter(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">State</label>
                <Select value={vendorStateFilter} onValueChange={setVendorStateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select...">Select...</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">ZIP Code</label>
                <Input
                  placeholder="Enter ZIP code..."
                  value={vendorZipFilter}
                  onChange={(e) => setVendorZipFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsMoreFiltersDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-hover" onClick={() => setIsMoreFiltersDialogOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
  // END: CHANGE

  const renderContent = () => {
    // Grid view for owners, tenants, technicians, leasing agents
    if (
      (activeTab === "owners" && ownersViewMode === "grid") ||
      (activeTab === "tenants" && tenantsViewMode === "grid") ||
      (activeTab === "property-technician" && techniciansViewMode === "grid") ||
      (activeTab === "leasing-agent" && leasingAgentsViewMode === "grid")
    ) {
      let cardBorderClass = ""
      if (activeTab === "owners") cardBorderClass = "border-l-4 border-l-primary"
      if (activeTab === "tenants") cardBorderClass = "border-l-4 border-l-info"
      if (activeTab === "property-technician") cardBorderClass = "border-l-4 border-l-warning"
      if (activeTab === "leasing-agent") cardBorderClass = "border-l-4 border-l-accent-foreground"

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleContacts.map((contact) => (
            <Card
              key={contact.id}
              className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${cardBorderClass} bg-background ${selectedContactIds.includes(contact.id) ? "ring-2 ring-primary/30" : ""}`}
              onClick={() => handleRowClick(contact)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {(activeTab === "owners" || activeTab === "tenants") && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedContactIds.includes(contact.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedContactIds(prev => [...prev, contact.id])
                            } else {
                              setSelectedContactIds(prev => prev.filter(id => id !== contact.id))
                            }
                          }}
                        />
                      </div>
                    )}
                    <Avatar className="h-12 w-12 border-2 border-info/20">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback className={`bg-info/10 text-info font-semibold`}>
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.location}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      contact.status === "Active"
                        ? "bg-success/10 text-success border-success/20"
                        : contact.status === "Pending"
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {contact.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  {contact.specialty && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {(activeTab === "property-technician" || activeTab === "leasing-agent") && (
                        <Wrench className="h-4 w-4 text-info" />
                      )}
                      <span className="truncate">{contact.specialty}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-info" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4 text-info" />
                    <span>{contact.phone}</span>
                  </div>
                  {activeTab === "owners" && contact.companyLlc && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4 text-info" />
                      <span className="truncate">{contact.companyLlc}</span>
                    </div>
                  )}
                  {activeTab !== "owners" && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4 text-info" />
                      <span className="truncate">
                        {contact.properties.length} {contact.properties.length === 1 ? "Property" : "Properties"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  {activeTab === "owners" ? (
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {contact.assignedStaff && <span>CSR: {contact.assignedStaff}</span>}
                      {contact.csm && <span>CSM: {contact.csm}</span>}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {contact.properties.slice(0, 2).map((prop, idx) => {
                        const mapping = PROPERTY_UNIT_MAP[prop]
                        const isTenant = contact.type === "Tenant"
                        if (isTenant && mapping && onNavigateToUnitDetail) {
                          return (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-primary/5 border-primary/30 text-primary cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                onNavigateToUnitDetail(mapping.unitId, mapping.propertyId)
                              }}
                            >
                              {prop}
                            </Badge>
                          )
                        }
                        return (
                          <Badge key={idx} variant="outline" className="text-xs bg-secondary text-muted-foreground">
                            {prop}
                          </Badge>
                        )
                      })}
                      {contact.properties.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-secondary text-muted-foreground">
                          +{contact.properties.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                  {activeTab !== "owners" && (
                    <span className="text-xs text-muted-foreground">{contact.lastActive}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
    // List view for owners, tenants, technicians, leasing agents
    else if (
      (activeTab === "owners" && ownersViewMode === "list") ||
      (activeTab === "tenants" && tenantsViewMode === "list") ||
      (activeTab === "property-technician" && techniciansViewMode === "list") ||
      (activeTab === "leasing-agent" && leasingAgentsViewMode === "list")
    ) {
      return (
        <Card className="flex-1 overflow-hidden bg-muted/30 border-border">
          <div className="rounded-md border border-border h-full overflow-auto bg-background/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted border-b-2 border-border">
                  {/* Select All Checkbox */}
                  {(activeTab === "owners" || activeTab === "tenants") && (
                    <TableHead className="w-10">
                      <Checkbox
                        checked={visibleContacts.length > 0 && visibleContacts.every(c => selectedContactIds.includes(c.id))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedContactIds(prev => [...new Set([...prev, ...visibleContacts.map(c => c.id)])])
                          } else {
                            const visibleIds = new Set(visibleContacts.map(c => c.id))
                            setSelectedContactIds(prev => prev.filter(id => !visibleIds.has(id)))
                          }
                        }}
                      />
                    </TableHead>
                  )}
                  {/* Name Column - Plain Header */}
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  
                  {activeTab !== "owners" && activeTab !== "tenants" && (
                    <TableHead className="font-semibold text-foreground">Type</TableHead>
                  )}
                  {(activeTab === "property-technician" || activeTab === "leasing-agent") && (
                    <TableHead className="font-semibold text-foreground">Specialty</TableHead>
                  )}
                  
                  {/* Properties / Company LLC Column */}
                  {activeTab === "owners" ? (
                    <TableHead className="p-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-1 font-semibold text-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Company / LLC
                            <ChevronDown className={`h-3 w-3 ${selectedCompanyLlc.length > 0 ? 'text-primary' : ''}`} />
                            {selectedCompanyLlc.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                {selectedCompanyLlc.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[240px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Company / LLC</span>
                              {selectedCompanyLlc.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedCompanyLlc([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search company..."
                              value={companyLlcSearchQuery}
                              onChange={(e) => setCompanyLlcSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {uniqueCompanyLlc
                              .filter(company => company.toLowerCase().includes(companyLlcSearchQuery.toLowerCase()))
                              .map((company) => (
                                <div key={company} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-company-${company}`}
                                    checked={selectedCompanyLlc.includes(company)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedCompanyLlc([...selectedCompanyLlc, company])
                                      } else {
                                        setSelectedCompanyLlc(selectedCompanyLlc.filter((c) => c !== company))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-company-${company}`} className="text-sm leading-none cursor-pointer flex-1 truncate">
                                    {company}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  ) : (
                    <TableHead className="font-semibold text-foreground">Properties</TableHead>
                  )}
                  
                  {/* Contact Info Column - Plain Header */}
                  <TableHead className="font-semibold text-foreground">Contact Info</TableHead>
                  
                  {/* Units Column Filter - Only for Owners/Tenants */}
                  {(activeTab === "owners" || activeTab === "tenants") && (
                    <TableHead className="p-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-1 font-semibold text-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Total Units
                            <ChevronDown className={`h-3 w-3 ${selectedUnits.length > 0 ? 'text-primary' : ''}`} />
                            {selectedUnits.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                {selectedUnits.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Units</span>
                              {selectedUnits.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedUnits([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search units..."
                              value={unitsSearchQuery}
                              onChange={(e) => setUnitsSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {uniqueUnits
                              .filter(unit => unit.toString().includes(unitsSearchQuery))
                              .map((unit) => (
                                <div key={unit} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-units-${unit}`}
                                    checked={selectedUnits.includes(unit)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedUnits([...selectedUnits, unit])
                                      } else {
                                        setSelectedUnits(selectedUnits.filter((u) => u !== unit))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-units-${unit}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {unit}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  )}
                  
                  {/* CSR Column Filter (was Assignee) - Only for Owners/Tenants */}
                  {(activeTab === "owners" || activeTab === "tenants") && (
                    <TableHead className="p-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-1 font-semibold text-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            {activeTab === "owners" ? "CSR" : "Assignee"}
                            <ChevronDown className={`h-3 w-3 ${selectedAssignees.length > 0 ? 'text-primary' : ''}`} />
                            {selectedAssignees.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                {selectedAssignees.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{activeTab === "owners" ? "CSR" : "Assignee"}</span>
                              {selectedAssignees.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedAssignees([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder={activeTab === "owners" ? "Search CSR..." : "Search assignee..."}
                              value={assigneeSearchQuery}
                              onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {uniqueAssignees
                              .filter(assignee => assignee.toLowerCase().includes(assigneeSearchQuery.toLowerCase()))
                              .map((assignee) => (
                                <div key={assignee} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-assignee-${assignee}`}
                                    checked={selectedAssignees.includes(assignee)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedAssignees([...selectedAssignees, assignee])
                                      } else {
                                        setSelectedAssignees(selectedAssignees.filter((a) => a !== assignee))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-assignee-${assignee}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {assignee}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  )}

                  {/* CSM Column Filter - Only for Owners */}
                  {activeTab === "owners" && (
                    <TableHead className="p-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-1 font-semibold text-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            CSM
                            <ChevronDown className={`h-3 w-3 ${selectedCsm.length > 0 ? 'text-primary' : ''}`} />
                            {selectedCsm.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                {selectedCsm.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">CSM</span>
                              {selectedCsm.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedCsm([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search CSM..."
                              value={csmSearchQuery}
                              onChange={(e) => setCsmSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {uniqueCsm
                              .filter(csm => csm.toLowerCase().includes(csmSearchQuery.toLowerCase()))
                              .map((csm) => (
                                <div key={csm} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-csm-${csm}`}
                                    checked={selectedCsm.includes(csm)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedCsm([...selectedCsm, csm])
                                      } else {
                                        setSelectedCsm(selectedCsm.filter((c) => c !== csm))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-csm-${csm}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {csm}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  )}
                  
                  {/* Status Column Filter - Only for Owners/Tenants */}
                  {(activeTab === "owners" || activeTab === "tenants") ? (
                    <TableHead className="p-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-1 font-semibold text-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Status
                            <ChevronDown className={`h-3 w-3 ${selectedStatuses.length > 0 ? 'text-primary' : ''}`} />
                            {selectedStatuses.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                {selectedStatuses.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Status</span>
                              {selectedStatuses.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedStatuses([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search status..."
                              value={statusSearchQuery}
                              onChange={(e) => setStatusSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {uniqueStatuses
                              .filter(status => status.toLowerCase().includes(statusSearchQuery.toLowerCase()))
                              .map((status) => (
                                <div key={status} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-status-${status}`}
                                    checked={selectedStatuses.includes(status)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedStatuses([...selectedStatuses, status])
                                      } else {
                                        setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-status-${status}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {status}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  ) : (
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                  )}
                  
                  {/* Last Active Column Filter - Only for Tenants (removed from Owners) */}
                  {activeTab === "tenants" && (
                    <TableHead className="p-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" className="h-auto p-1 font-semibold text-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                            Last Active
                            <ChevronDown className={`h-3 w-3 ${selectedLastActive.length > 0 ? 'text-primary' : ''}`} />
                            {selectedLastActive.length > 0 && (
                              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                {selectedLastActive.length}
                              </Badge>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <div className="p-2 border-b">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Last Active</span>
                              {selectedLastActive.length > 0 && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedLastActive([])}>
                                  Clear
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Search..."
                              value={lastActiveSearchQuery}
                              onChange={(e) => setLastActiveSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto p-2">
                            {uniqueLastActive
                              .filter(range => range.toLowerCase().includes(lastActiveSearchQuery.toLowerCase()))
                              .map((range) => (
                                <div key={range} className="flex items-center space-x-2 py-1.5">
                                  <Checkbox
                                    id={`th-lastactive-${range}`}
                                    checked={selectedLastActive.includes(range)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedLastActive([...selectedLastActive, range])
                                      } else {
                                        setSelectedLastActive(selectedLastActive.filter((l) => l !== range))
                                      }
                                    }}
                                  />
                                  <label htmlFor={`th-lastactive-${range}`} className="text-sm leading-none cursor-pointer flex-1">
                                    {range}
                                  </label>
                                </div>
                              ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  )}
                  {activeTab !== "owners" && activeTab !== "tenants" && (
                    <TableHead className="font-semibold text-foreground">Last Active</TableHead>
                  )}
                  
                  {/* Actions Column with Reset Button */}
                  <TableHead className="text-right p-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold text-foreground">Actions</span>
                      {(activeTab === "owners" || activeTab === "tenants") && hasActiveColumnFilters && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={resetColumnFilters}
                          className="h-6 px-2 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/5"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                      No {getPageTitle().toLowerCase()} found.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className={`cursor-pointer hover:bg-secondary/80 transition-colors ${selectedContactIds.includes(contact.id) ? "bg-primary/5" : ""}`}
                      onClick={() => handleRowClick(contact)}
                    >
                      {(activeTab === "owners" || activeTab === "tenants") && (
                        <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedContactIds.includes(contact.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedContactIds(prev => [...prev, contact.id])
                              } else {
                                setSelectedContactIds(prev => prev.filter(id => id !== contact.id))
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-[rgba(1,96,209,1)]">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.location}</div>
                          </div>
                        </div>
                      </TableCell>
                      {activeTab !== "owners" && activeTab !== "tenants" && (
                        <TableCell>
                          <Badge variant="secondary" className={getTypeColor(contact.type)}>
                            {contact.type}
                          </Badge>
                        </TableCell>
                      )}
                      {(activeTab === "property-technician" || activeTab === "leasing-agent") && (
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{contact.specialty || "-"}</span>
                        </TableCell>
                      )}
                      <TableCell>
                        {activeTab === "owners" ? (
                          <span className="text-sm text-muted-foreground">{contact.companyLlc || "-"}</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {contact.properties.slice(0, 2).map((prop, idx) => {
                              const mapping = PROPERTY_UNIT_MAP[prop]
                              const isTenant = contact.type === "Tenant"
                              if (isTenant && mapping && onNavigateToUnitDetail) {
                                return (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs bg-primary/5 border-primary/30 text-primary cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onNavigateToUnitDetail(mapping.unitId, mapping.propertyId)
                                    }}
                                  >
                                    {prop}
                                  </Badge>
                                )
                              }
                              return (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs bg-secondary border-border text-muted-foreground"
                                >
                                  {prop}
                                </Badge>
                              )
                            })}
                            {contact.properties.length > 2 && (
                              <Badge variant="outline" className="text-xs bg-secondary border-border text-muted-foreground">
                                +{contact.properties.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground truncate max-w-[150px]">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{contact.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      {/* Units Column Cell - Only for Owners/Tenants */}
                      {(activeTab === "owners" || activeTab === "tenants") && (
                        <TableCell className="tabular-nums text-center">
                          <span className="text-sm text-muted-foreground">{contact.units ?? "-"}</span>
                        </TableCell>
                      )}
                      {(activeTab === "owners" || activeTab === "tenants") && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-border">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {contact.assignedStaff?.split(" ").map((n) => n[0]).join("") || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{contact.assignedStaff}</span>
                          </div>
                        </TableCell>
                      )}
                      {/* CSM Column Cell - Only for Owners */}
                      {activeTab === "owners" && (
                        <TableCell>
                          {contact.csm ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 border border-border">
                                <AvatarFallback className="bg-info/10 text-info text-xs">
                                  {contact.csm.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{contact.csm}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge
                          className={
                            contact.status === "Active"
                              ? "bg-success/10 text-success hover:bg-success/10"
                              : contact.status === "Pending"
                                ? "bg-warning/10 text-warning hover:bg-warning/15"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }
                        >
                          {contact.status}
                        </Badge>
                      </TableCell>
                      {activeTab !== "owners" && (
                        <TableCell className="text-muted-foreground">{contact.lastActive}</TableCell>
                      )}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )
    }
    // Default to table view for 'all' contacts
    return (
      <Card className="flex-1 overflow-hidden bg-muted/30 border-border">
        <div className="rounded-md border border-border h-full overflow-auto bg-background/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted border-b-2 border-border">
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Type</TableHead>
                {(activeTab === "property-technician" || activeTab === "leasing-agent") && (
                  <TableHead className="font-semibold text-foreground">Specialty</TableHead>
                )}
                <TableHead className="font-semibold text-foreground">Properties</TableHead>
                <TableHead className="font-semibold text-foreground">Contact Info</TableHead>
                <TableHead className="font-semibold text-foreground">Assignee</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Last Active</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No {getPageTitle().toLowerCase()} found.
                  </TableCell>
                </TableRow>
              ) : (
                visibleContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => handleRowClick(contact)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[rgba(1,96,209,1)]">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getTypeColor(contact.type)}>
                        {contact.type}
                      </Badge>
                    </TableCell>
                    {(activeTab === "property-technician" || activeTab === "leasing-agent") && (
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{contact.specialty || "-"}</span>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {contact.properties.slice(0, 2).map((prop, idx) => {
                          const mapping = PROPERTY_UNIT_MAP[prop]
                          const isTenant = contact.type === "Tenant"
                          if (isTenant && mapping && onNavigateToUnitDetail) {
                            return (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-primary/5 border-primary/30 text-primary cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onNavigateToUnitDetail(mapping.unitId, mapping.propertyId)
                                }}
                              >
                                {prop}
                              </Badge>
                            )
                          }
                          return (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs bg-secondary border-border text-muted-foreground"
                            >
                              {prop}
                            </Badge>
                          )
                        })}
                        {contact.properties.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-secondary border-border text-muted-foreground">
                            +{contact.properties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground truncate max-w-[150px]">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{contact.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {contact.assignedStaff?.split(" ").map(n => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{contact.assignedStaff}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          contact.status === "Active"
                            ? "bg-success/10 text-success hover:bg-success/10"
                            : contact.status === "Pending"
                              ? "bg-warning/10 text-warning hover:bg-warning/15"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }
                      >
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contact.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        <div className="flex items-center gap-2">
          
        </div>
      </div>

      {/* Main Layout with Quick Actions on the right */}
      <div className="flex gap-4">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Stats Cards */}
          {getStatsCards()}

          {/* Filters & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${getPageTitle().toLowerCase()}...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "Active" | "Pending") => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          {activeTab === "owners" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOwnerFilterModal(true)}
                className="h-9 px-3"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filter
              </Button>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={ownersViewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className={`rounded-r-none ${ownersViewMode === "grid" ? "bg-primary hover:bg-primary-hover" : ""}`}
                  onClick={() => setOwnersViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={ownersViewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className={`rounded-l-none ${ownersViewMode === "list" ? "bg-primary hover:bg-primary-hover" : ""}`}
                  onClick={() => setOwnersViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {activeTab === "tenants" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTenantFilterModal(true)}
                className="h-9 px-3"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filter
              </Button>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={tenantsViewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className={`rounded-r-none ${tenantsViewMode === "grid" ? "bg-primary hover:bg-primary-hover" : ""}`}
                  onClick={() => setTenantsViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={tenantsViewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className={`rounded-l-none ${tenantsViewMode === "list" ? "bg-primary hover:bg-primary-hover" : ""}`}
                  onClick={() => setTenantsViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {activeTab === "property-technician" && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={techniciansViewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className={`rounded-r-none ${techniciansViewMode === "grid" ? "bg-primary hover:bg-primary-hover" : ""}`}
                onClick={() => setTechniciansViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={techniciansViewMode === "list" ? "default" : "ghost"}
                size="icon"
                className={`rounded-l-none ${techniciansViewMode === "list" ? "bg-primary hover:bg-primary-hover" : ""}`}
                onClick={() => setTechniciansViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
          {activeTab === "leasing-agent" && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={leasingAgentsViewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className={`rounded-r-none ${leasingAgentsViewMode === "grid" ? "bg-primary hover:bg-primary-hover" : ""}`}
                onClick={() => setLeasingAgentsViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={leasingAgentsViewMode === "list" ? "default" : "ghost"}
                size="icon"
                className={`rounded-l-none ${leasingAgentsViewMode === "list" ? "bg-primary hover:bg-primary-hover" : ""}`}
                onClick={() => setLeasingAgentsViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

          {/* Applied Filters Display - Owners */}
          {activeTab === "owners" && ownerAppliedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {ownerAppliedFilters.map((filter, index) => (
                <div key={`${filter.field}-${index}`} className="flex items-center gap-1 h-7 px-2.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-medium">
                  <span>{filter.field}:</span>
                  <span className="max-w-[150px] truncate">{filter.values.join(", ")}</span>
                  <button
                    type="button"
                    onClick={() => removeOwnerFilter(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setOwnerAppliedFilters([])}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Applied Filters Display - Tenants */}
          {activeTab === "tenants" && tenantAppliedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {tenantAppliedFilters.map((filter, index) => (
                <div key={`${filter.field}-${index}`} className="flex items-center gap-1 h-7 px-2.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-medium">
                  <span>{filter.field}:</span>
                  <span className="max-w-[150px] truncate">{filter.values.join(", ")}</span>
                  <button
                    type="button"
                    onClick={() => removeTenantFilter(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTenantAppliedFilters([])}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}
          </div>

          {/* Bulk Actions */}
          {(activeTab === "owners" || activeTab === "tenants") && (
            <BulkActionBar
              selectedCount={selectedContactIds.length}
              totalCount={filteredContacts.length}
              onClearSelection={() => setSelectedContactIds([])}
              onSelectAll={() => setSelectedContactIds(filteredContacts.map(c => c.id))}
              selectedNames={filteredContacts.filter(c => selectedContactIds.includes(c.id)).map(c => c.name)}
              selectedEmails={filteredContacts.filter(c => selectedContactIds.includes(c.id)).map(c => c.email)}
            />
          )}

          {/* Table/Grid Content */}
          {renderContent()}

          {/* Pagination */}
          {hasMoreContacts && (
            <div className="flex flex-col items-center gap-2 py-4">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(visibleCount, totalContacts)} of {totalContacts} contacts
              </p>
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[120px] bg-transparent"
              >
                {isLoadingMore ? "Loading..." : "View More"}
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions Panel - Owners */}
        {activeTab === "owners" && (
          <div className="hidden lg:flex w-[200px] shrink-0 flex-col">
            <Card className="sticky top-4 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
              {/* Upper Section - 55% - Quick Actions */}
              <div className="flex flex-col" style={{ height: '55%' }}>
                <h3 className="text-sm font-semibold text-foreground px-4 py-3 border-b border-gray-100 flex-shrink-0">Quick Actions</h3>
                <div className="flex flex-col overflow-y-auto flex-1">
                  {[
                    { icon: UserPlus, label: "New Owner" },
                    { icon: Building2, label: "Owner ACH Setup" },
                    { icon: Settings, label: "Owner Portal Activation" },
                    { icon: Mail, label: "Send Owner Packets" },
                    { icon: FileText, label: "New Management Agreement" },
                    { icon: FileText, label: "Management Agreements" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-muted/50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                    >
                      <Icon className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lower Section - 45% - AI Chat */}
              <div className="flex flex-col border-t border-gray-200" style={{ height: '45%' }}>
                <div className="px-3 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask..."
                      value={ownersAiChatInput}
                      onChange={(e) => setOwnersAiChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && ownersAiChatInput.trim()) {
                          handleOwnersAiChatSubmit(ownersAiChatInput)
                        }
                      }}
                      className="flex-1 h-9 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-9 w-9 p-0 flex-shrink-0 transition-colors ${
                        ownersAiChatInput.trim() 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        if (ownersAiChatInput.trim()) {
                          handleOwnersAiChatSubmit(ownersAiChatInput)
                        }
                      }}
                    >
                      <Send className={`h-4 w-4 ${ownersAiChatInput.trim() ? "text-white" : "text-blue-400"}`} />
                    </Button>
                  </div>
                </div>
                <div className="px-3 pb-3 flex flex-col gap-1.5 overflow-y-auto flex-1">
                  <button
                    className="text-left text-sm text-primary hover:underline"
                    onClick={() => handleOwnersAiChatSubmit("What's the owner's property portfolio?")}
                  >
                    {"What's the owner's property portfolio?"}
                  </button>
                  <button
                    className="text-left text-sm text-primary hover:underline"
                    onClick={() => handleOwnersAiChatSubmit("Show recent owner communications")}
                  >
                    Show recent owner communications
                  </button>
                  <button
                    className="text-left text-sm text-primary hover:underline"
                    onClick={() => handleOwnersAiChatSubmit("What are the pending action items?")}
                  >
                    What are the pending action items?
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions Panel - Tenants */}
        {activeTab === "tenants" && (
          <div className="hidden lg:flex w-[200px] shrink-0 flex-col">
            <Card className="sticky top-4 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
              {/* Upper Section - 55% - Quick Actions */}
              <div className="flex flex-col" style={{ height: '55%' }}>
                <h3 className="text-sm font-semibold text-foreground px-4 py-3 border-b border-gray-100 flex-shrink-0">Quick Actions</h3>
                <div className="flex flex-col overflow-y-auto flex-1">
                  {[
                    { icon: Home, label: "Move In Tenant" },
                    { icon: UserPlus, label: "New Tenant" },
                    { icon: Mail, label: "Email All Tenants" },
                    { icon: BarChart3, label: "Rent Roll" },
                    { icon: FileText, label: "Tenant Ledger" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-muted/50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                    >
                      <Icon className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lower Section - 45% - AI Chat */}
              <div className="flex flex-col border-t border-gray-200" style={{ height: '45%' }}>
                <div className="px-3 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask..."
                      value={tenantsAiChatInput}
                      onChange={(e) => setTenantsAiChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tenantsAiChatInput.trim()) {
                          handleTenantsAiChatSubmit(tenantsAiChatInput)
                        }
                      }}
                      className="flex-1 h-9 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-9 w-9 p-0 flex-shrink-0 transition-colors ${
                        tenantsAiChatInput.trim() 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        if (tenantsAiChatInput.trim()) {
                          handleTenantsAiChatSubmit(tenantsAiChatInput)
                        }
                      }}
                    >
                      <Send className={`h-4 w-4 ${tenantsAiChatInput.trim() ? "text-white" : "text-blue-400"}`} />
                    </Button>
                  </div>
                </div>
                <div className="px-3 pb-3 flex flex-col gap-1.5 overflow-y-auto flex-1">
                  <button
                    className="text-left text-sm text-primary hover:underline"
                    onClick={() => handleTenantsAiChatSubmit("What's the tenant's lease status?")}
                  >
                    {"What's the tenant's lease status?"}
                  </button>
                  <button
                    className="text-left text-sm text-primary hover:underline"
                    onClick={() => handleTenantsAiChatSubmit("Show tenants with overdue rent")}
                  >
                    Show tenants with overdue rent
                  </button>
                  <button
                    className="text-left text-sm text-primary hover:underline"
                    onClick={() => handleTenantsAiChatSubmit("What are the upcoming lease renewals?")}
                  >
                    What are the upcoming lease renewals?
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Owner Filter Modal */}
      {showOwnerFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-lg shadow-xl w-[480px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <h2 className="text-lg font-bold text-foreground">Add Filter</h2>
              <button type="button" onClick={closeOwnerFilterModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-2 flex flex-col gap-4">
              {/* Filter Field Dropdown - Searchable */}
              <div className="relative">
                <label className="text-xs font-medium text-primary mb-1 block">What do you want to filter by?</label>
                <div className="border rounded-md w-full">
                  <div
                    className="flex items-center gap-2 h-10 px-3 cursor-pointer"
                    onClick={() => setShowOwnerFieldDropdown(!showOwnerFieldDropdown)}
                  >
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={`text-sm flex-1 truncate ${ownerModalFilterField ? "text-foreground" : "text-muted-foreground"}`}>
                      {ownerModalFilterField || "Select a filter field"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${showOwnerFieldDropdown ? "rotate-180" : ""}`} />
                  </div>
                  {showOwnerFieldDropdown && (
                    <>
                      <div className="border-t px-2 py-1.5">
                        <Input
                          placeholder="Search fields..."
                          value={ownerModalFieldSearch}
                          onChange={(e) => setOwnerModalFieldSearch(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto border-t">
                        {OWNER_FILTER_FIELDS
                          .filter((f) => f.toLowerCase().includes(ownerModalFieldSearch.toLowerCase()))
                          .map((field) => (
                          <div
                            key={field}
                            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 border-b border-border last:border-b-0"
                            onClick={() => {
                              setOwnerModalFilterField(field)
                              setOwnerModalFilterValues([])
                              setOwnerModalOptionSearch("")
                              setOwnerModalFieldSearch("")
                              setShowOwnerFieldDropdown(false)
                            }}
                          >
                            <span className="truncate">{field}</span>
                          </div>
                        ))}
                        {OWNER_FILTER_FIELDS.filter((f) => f.toLowerCase().includes(ownerModalFieldSearch.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching fields</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Filter Options Dropdown - Searchable */}
              <div>
                <div className="border rounded-md w-full">
                  <Input
                    placeholder="Select filter option(s)"
                    value={ownerModalOptionSearch}
                    onChange={(e) => setOwnerModalOptionSearch(e.target.value)}
                    className="border-0 border-b rounded-b-none h-10 focus-visible:ring-0 w-full"
                  />
                  {ownerModalFilterField && (() => {
                    const allOptions = getOwnerFilterOptions(ownerModalFilterField)
                    const filtered = allOptions.filter((opt) => opt.toLowerCase().includes(ownerModalOptionSearch.toLowerCase()))
                    const allSelected = filtered.length > 0 && filtered.every((opt) => ownerModalFilterValues.includes(opt))
                    const showSelectAll = OWNER_FIELDS_WITH_SELECT_ALL.includes(ownerModalFilterField) && !ownerModalOptionSearch
                    return (
                      <div className="max-h-[180px] overflow-y-auto">
                        {showSelectAll && (
                          <div className="flex items-center space-x-2 py-2 px-3 border-b border-border hover:bg-muted/50">
                            <Checkbox
                              id="owner-modal-opt-select-all"
                              checked={allSelected}
                              onCheckedChange={(checked) => {
                                if (checked) setOwnerModalFilterValues([...new Set([...ownerModalFilterValues, ...allOptions])])
                                else setOwnerModalFilterValues(ownerModalFilterValues.filter((v) => !allOptions.includes(v)))
                              }}
                            />
                            <label htmlFor="owner-modal-opt-select-all" className="text-sm leading-none cursor-pointer flex-1 font-medium">Select All</label>
                          </div>
                        )}
                        {filtered.map((option) => (
                          <div key={option} className="flex items-center space-x-2 py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50">
                            <Checkbox
                              id={`owner-modal-opt-${option}`}
                              checked={ownerModalFilterValues.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) setOwnerModalFilterValues([...ownerModalFilterValues, option])
                                else setOwnerModalFilterValues(ownerModalFilterValues.filter((v) => v !== option))
                              }}
                            />
                            <label htmlFor={`owner-modal-opt-${option}`} className="text-sm leading-none cursor-pointer flex-1 truncate">{option}</label>
                          </div>
                        ))}
                        {filtered.length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching options</div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2">
              <Button variant="outline" onClick={closeOwnerFilterModal} className="h-9 px-4">
                Cancel <span className="text-xs text-muted-foreground ml-1.5">(esc)</span>
              </Button>
              <Button
                onClick={applyOwnerModalFilter}
                disabled={!ownerModalFilterField || ownerModalFilterValues.length === 0}
                className="h-9 px-4"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Filter Modal */}
      {showTenantFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-lg shadow-xl w-[480px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <h2 className="text-lg font-bold text-foreground">Add Filter</h2>
              <button type="button" onClick={closeTenantFilterModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-2 flex flex-col gap-4">
              {/* Filter Field Dropdown - Searchable */}
              <div className="relative">
                <label className="text-xs font-medium text-primary mb-1 block">What do you want to filter by?</label>
                <div className="border rounded-md w-full">
                  <div
                    className="flex items-center gap-2 h-10 px-3 cursor-pointer"
                    onClick={() => setShowTenantFieldDropdown(!showTenantFieldDropdown)}
                  >
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className={`text-sm flex-1 truncate ${tenantModalFilterField ? "text-foreground" : "text-muted-foreground"}`}>
                      {tenantModalFilterField || "Select a filter field"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${showTenantFieldDropdown ? "rotate-180" : ""}`} />
                  </div>
                  {showTenantFieldDropdown && (
                    <>
                      <div className="border-t px-2 py-1.5">
                        <Input
                          placeholder="Search fields..."
                          value={tenantModalFieldSearch}
                          onChange={(e) => setTenantModalFieldSearch(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto border-t">
                        {TENANT_FILTER_FIELDS
                          .filter((f) => f.toLowerCase().includes(tenantModalFieldSearch.toLowerCase()))
                          .map((field) => (
                          <div
                            key={field}
                            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 border-b border-border last:border-b-0"
                            onClick={() => {
                              setTenantModalFilterField(field)
                              setTenantModalFilterValues([])
                              setTenantModalOptionSearch("")
                              setTenantModalFieldSearch("")
                              setShowTenantFieldDropdown(false)
                            }}
                          >
                            <span className="truncate">{field}</span>
                          </div>
                        ))}
                        {TENANT_FILTER_FIELDS.filter((f) => f.toLowerCase().includes(tenantModalFieldSearch.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching fields</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Filter Options Dropdown - Searchable */}
              <div>
                <div className="border rounded-md w-full">
                  <Input
                    placeholder="Select filter option(s)"
                    value={tenantModalOptionSearch}
                    onChange={(e) => setTenantModalOptionSearch(e.target.value)}
                    className="border-0 border-b rounded-b-none h-10 focus-visible:ring-0 w-full"
                  />
                  {tenantModalFilterField && (() => {
                    const allOptions = getTenantFilterOptions(tenantModalFilterField)
                    const filtered = allOptions.filter((opt) => opt.toLowerCase().includes(tenantModalOptionSearch.toLowerCase()))
                    const allSelected = filtered.length > 0 && filtered.every((opt) => tenantModalFilterValues.includes(opt))
                    const showSelectAll = TENANT_FIELDS_WITH_SELECT_ALL.includes(tenantModalFilterField) && !tenantModalOptionSearch
                    return (
                      <div className="max-h-[180px] overflow-y-auto">
                        {showSelectAll && (
                          <div className="flex items-center space-x-2 py-2 px-3 border-b border-border hover:bg-muted/50">
                            <Checkbox
                              id="tenant-modal-opt-select-all"
                              checked={allSelected}
                              onCheckedChange={(checked) => {
                                if (checked) setTenantModalFilterValues([...new Set([...tenantModalFilterValues, ...allOptions])])
                                else setTenantModalFilterValues(tenantModalFilterValues.filter((v) => !allOptions.includes(v)))
                              }}
                            />
                            <label htmlFor="tenant-modal-opt-select-all" className="text-sm leading-none cursor-pointer flex-1 font-medium">Select All</label>
                          </div>
                        )}
                        {filtered.map((option) => (
                          <div key={option} className="flex items-center space-x-2 py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50">
                            <Checkbox
                              id={`tenant-modal-opt-${option}`}
                              checked={tenantModalFilterValues.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) setTenantModalFilterValues([...tenantModalFilterValues, option])
                                else setTenantModalFilterValues(tenantModalFilterValues.filter((v) => v !== option))
                              }}
                            />
                            <label htmlFor={`tenant-modal-opt-${option}`} className="text-sm leading-none cursor-pointer flex-1 truncate">{option}</label>
                          </div>
                        ))}
                        {filtered.length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">No matching options</div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2">
              <Button variant="outline" onClick={closeTenantFilterModal} className="h-9 px-4">
                Cancel <span className="text-xs text-muted-foreground ml-1.5">(esc)</span>
              </Button>
              <Button
                onClick={applyTenantModalFilter}
                disabled={!tenantModalFilterField || tenantModalFilterValues.length === 0}
                className="h-9 px-4"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedContact && (
            <>
              <SheetHeader className="text-left pb-4 border-b">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                      {getInitials(selectedContact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-xl">{selectedContact.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getTypeColor(selectedContact.type)}>
                        {selectedContact.type}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(selectedContact.status)}>
                        {selectedContact.status}
                      </Badge>
                    </SheetDescription>
                    <p className="text-sm text-muted-foreground mt-2">{selectedContact.location}</p>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedContact.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {selectedContact.properties.length > 0
                            ? selectedContact.properties.join(", ")
                            : "No properties assigned"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned Staff</span>
                        <span>{selectedContact.assignedStaff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Active</span>
                        <span>{selectedContact.lastActive}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact ID</span>
                        <span>#{selectedContact.id}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {MOCK_ACTIVITIES.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 text-sm">
                          <div className="h-2 w-2 rounded-full bg-info mt-2" />
                          <div className="flex-1">
                            <p>{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.date} • {activity.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Date</TableHead>
                            <TableHead className="text-xs">Type</TableHead>
                            <TableHead className="text-xs">Amount</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {MOCK_PAYMENTS.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="text-xs">{payment.date}</TableCell>
                              <TableCell className="text-xs">{payment.type}</TableCell>
                              <TableCell className="text-xs">{payment.amount}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    payment.status === "Paid"
                                      ? "bg-success/10 text-success"
                                      : "bg-muted text-muted-foreground"
                                  }
                                >
                                  {payment.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-medium">Notes</CardTitle>
                      <Button variant="outline" size="sm">
                        Add Note
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {MOCK_NOTES.map((note) => (
                        <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {note.author} • {note.date}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" /> Send Email
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" /> Call
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
