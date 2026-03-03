"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  ArrowLeft,
  Building2,
  Users,
  ClipboardList,
  Home,
  Eye,
  UserX,
  UserCheck,
} from "lucide-react"

// Role columns for the portfolio matrix header
const ROLE_COLUMNS = [
  "Process Owner",
  "Accountant",
  "Acquisition Manager",
  "Agent",
  "AGM",
  "BC",
  "CEO",
  "CSM",
  "HR Executive",
  "HR Manager",
  "Lead Coordinator",
  "Lead Owner",
]

// Staff members data with full details
interface StaffMember {
  id: string
  name: string
  initials: string
  avatar: string
  email: string
  phone: string
  role: string
  dateAdded: string
  status: "Active" | "Inactive"
  ownersHandling: { id: string; name: string }[]
  tenantsHandling: { id: string; name: string }[]
  propertiesManaging: { id: string; name: string; units: number }[]
  tasksAssigned: { id: string; title: string; status: string }[]
}

const STAFF_MEMBERS_DATA: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: "",
    email: "sarah.johnson@heropm.com",
    phone: "+1 (555) 123-4567",
    role: "Property Manager",
    dateAdded: "1/15/2024",
    status: "Active",
    ownersHandling: [
      { id: "o1", name: "John Smith" },
      { id: "o2", name: "Mary Williams" },
      { id: "o3", name: "Robert Brown" },
    ],
    tenantsHandling: [
      { id: "t1", name: "Alice Cooper" },
      { id: "t2", name: "Bob Martin" },
    ],
    propertiesManaging: [
      { id: "p1", name: "Sunset Villa", units: 12 },
      { id: "p2", name: "Harbor View Apartments", units: 24 },
    ],
    tasksAssigned: [
      { id: "task1", title: "Lease Renewal - Unit 4B", status: "In Progress" },
      { id: "task2", title: "Maintenance Request - Plumbing", status: "Pending" },
    ],
  },
  {
    id: "2",
    name: "Mike Davis",
    initials: "MD",
    avatar: "",
    email: "mike.davis@heropm.com",
    phone: "+1 (555) 234-5678",
    role: "Leasing Agent",
    dateAdded: "2/20/2024",
    status: "Active",
    ownersHandling: [{ id: "o4", name: "David Lee" }],
    tenantsHandling: [
      { id: "t3", name: "Carol White" },
      { id: "t4", name: "Dan Green" },
      { id: "t5", name: "Eve Black" },
    ],
    propertiesManaging: [{ id: "p3", name: "Downtown Loft", units: 8 }],
    tasksAssigned: [
      { id: "task3", title: "New Tenant Screening", status: "In Progress" },
      { id: "task4", title: "Property Showing - Unit 2A", status: "Scheduled" },
    ],
  },
  {
    id: "3",
    name: "Richard Surovi",
    initials: "RS",
    avatar: "",
    email: "richard.surovi@heropm.com",
    phone: "+1 (216) 810-2564",
    role: "Admin",
    dateAdded: "11/5/2023",
    status: "Active",
    ownersHandling: [
      { id: "o5", name: "Frank Miller" },
      { id: "o6", name: "Grace Taylor" },
    ],
    tenantsHandling: [{ id: "t6", name: "Henry Adams" }],
    propertiesManaging: [
      { id: "p4", name: "Oakwood Estate", units: 16 },
      { id: "p5", name: "Pine Street Complex", units: 20 },
      { id: "p6", name: "Riverside Condos", units: 10 },
    ],
    tasksAssigned: [
      { id: "task5", title: "System Configuration Update", status: "Completed" },
      { id: "task6", title: "User Access Review", status: "In Progress" },
    ],
  },
  {
    id: "4",
    name: "Emily Brown",
    initials: "EB",
    avatar: "",
    email: "emily.brown@heropm.com",
    phone: "+1 (555) 345-6789",
    role: "Maintenance Coordinator",
    dateAdded: "3/10/2024",
    status: "Active",
    ownersHandling: [],
    tenantsHandling: [
      { id: "t7", name: "Ivan Wilson" },
      { id: "t8", name: "Julia Roberts" },
    ],
    propertiesManaging: [
      { id: "p7", name: "Lakeside Manor", units: 14 },
    ],
    tasksAssigned: [
      { id: "task7", title: "HVAC Inspection Schedule", status: "Pending" },
      { id: "task8", title: "Emergency Repair - Unit 7C", status: "Urgent" },
      { id: "task9", title: "Vendor Contract Renewal", status: "In Progress" },
    ],
  },
  {
    id: "5",
    name: "John Smith",
    initials: "JS",
    avatar: "",
    email: "john.smith@heropm.com",
    phone: "+1 (555) 456-7890",
    role: "Property Manager",
    dateAdded: "4/1/2024",
    status: "Inactive",
    ownersHandling: [{ id: "o7", name: "Karen Davis" }],
    tenantsHandling: [],
    propertiesManaging: [],
    tasksAssigned: [],
  },
  {
    id: "6",
    name: "Lisa Chen",
    initials: "LC",
    avatar: "",
    email: "lisa.chen@heropm.com",
    phone: "+1 (555) 567-8901",
    role: "Accountant",
    dateAdded: "5/15/2024",
    status: "Active",
    ownersHandling: [
      { id: "o8", name: "Larry King" },
      { id: "o9", name: "Monica Geller" },
    ],
    tenantsHandling: [{ id: "t9", name: "Nancy Drew" }],
    propertiesManaging: [],
    tasksAssigned: [
      { id: "task10", title: "Monthly Financial Report", status: "In Progress" },
      { id: "task11", title: "Owner Statement Processing", status: "Pending" },
    ],
  },
  {
    id: "7",
    name: "Simon Peters",
    initials: "SP",
    avatar: "",
    email: "simon.peters@heropm.com",
    phone: "+1 (555) 678-9012",
    role: "Accountant",
    dateAdded: "6/1/2024",
    status: "Active",
    ownersHandling: [{ id: "o10", name: "Tom Hardy" }],
    tenantsHandling: [],
    propertiesManaging: [],
    tasksAssigned: [{ id: "task12", title: "Quarterly Audit", status: "In Progress" }],
  },
  {
    id: "8",
    name: "Betty Maalouf",
    initials: "BM",
    avatar: "",
    email: "betty.maalouf@heropm.com",
    phone: "+1 (555) 789-0123",
    role: "AGM",
    dateAdded: "7/15/2024",
    status: "Active",
    ownersHandling: [{ id: "o11", name: "Chris Evans" }, { id: "o12", name: "Diana Prince" }],
    tenantsHandling: [{ id: "t10", name: "Peter Parker" }],
    propertiesManaging: [{ id: "p8", name: "Skyline Tower", units: 30 }],
    tasksAssigned: [{ id: "task13", title: "Budget Review", status: "Pending" }],
  },
  {
    id: "9",
    name: "Ralph Thompson",
    initials: "RT",
    avatar: "",
    email: "ralph.thompson@heropm.com",
    phone: "+1 (555) 890-1234",
    role: "AGM",
    dateAdded: "8/1/2024",
    status: "Active",
    ownersHandling: [],
    tenantsHandling: [{ id: "t11", name: "Bruce Wayne" }],
    propertiesManaging: [{ id: "p9", name: "Metro Plaza", units: 18 }],
    tasksAssigned: [],
  },
  {
    id: "10",
    name: "Kendra Jeffers",
    initials: "KJ",
    avatar: "",
    email: "kendra.jeffers@heropm.com",
    phone: "+1 (555) 901-2345",
    role: "Process Owner",
    dateAdded: "9/10/2024",
    status: "Active",
    ownersHandling: [{ id: "o13", name: "Clark Kent" }],
    tenantsHandling: [],
    propertiesManaging: [],
    tasksAssigned: [{ id: "task14", title: "Process Documentation", status: "In Progress" }],
  },
  {
    id: "11",
    name: "Jenna Vail",
    initials: "JV",
    avatar: "",
    email: "jenna.vail@heropm.com",
    phone: "+1 (555) 012-3456",
    role: "Process Owner",
    dateAdded: "10/5/2024",
    status: "Active",
    ownersHandling: [],
    tenantsHandling: [{ id: "t12", name: "Tony Stark" }],
    propertiesManaging: [],
    tasksAssigned: [],
  },
  {
    id: "12",
    name: "Henry Morgan",
    initials: "HM",
    avatar: "",
    email: "henry.morgan@heropm.com",
    phone: "+1 (555) 123-4568",
    role: "Process Owner",
    dateAdded: "10/20/2024",
    status: "Active",
    ownersHandling: [{ id: "o14", name: "Steve Rogers" }],
    tenantsHandling: [],
    propertiesManaging: [{ id: "p10", name: "Coastal Retreat", units: 8 }],
    tasksAssigned: [{ id: "task15", title: "Workflow Optimization", status: "Pending" }],
  },
  {
    id: "13",
    name: "Jace Ives",
    initials: "JI",
    avatar: "",
    email: "jace.ives@heropm.com",
    phone: "+1 (555) 234-5679",
    role: "Process Owner",
    dateAdded: "11/1/2024",
    status: "Active",
    ownersHandling: [],
    tenantsHandling: [],
    propertiesManaging: [],
    tasksAssigned: [],
  },
  {
    id: "14",
    name: "Ashton Blair",
    initials: "AB",
    avatar: "",
    email: "ashton.blair@heropm.com",
    phone: "+1 (555) 345-6790",
    role: "Process Owner",
    dateAdded: "11/15/2024",
    status: "Active",
    ownersHandling: [{ id: "o15", name: "Natasha Romanoff" }],
    tenantsHandling: [{ id: "t13", name: "Wanda Maximoff" }],
    propertiesManaging: [],
    tasksAssigned: [{ id: "task16", title: "Team Training", status: "Scheduled" }],
  },
  {
    id: "15",
    name: "Legna Lira",
    initials: "LL",
    avatar: "",
    email: "legna.lira@heropm.com",
    phone: "+1 (555) 456-7891",
    role: "Process Owner",
    dateAdded: "12/1/2024",
    status: "Active",
    ownersHandling: [],
    tenantsHandling: [],
    propertiesManaging: [{ id: "p11", name: "Garden Estates", units: 12 }],
    tasksAssigned: [],
  },
  {
    id: "16",
    name: "Jason Egerton",
    initials: "JE",
    avatar: "",
    email: "jason.egerton@heropm.com",
    phone: "+1 (555) 567-8902",
    role: "Process Owner",
    dateAdded: "12/15/2024",
    status: "Active",
    ownersHandling: [{ id: "o16", name: "Scott Lang" }],
    tenantsHandling: [],
    propertiesManaging: [],
    tasksAssigned: [{ id: "task17", title: "Quality Assurance Check", status: "In Progress" }],
  },
  {
    id: "17",
    name: "Seth Alden",
    initials: "SA",
    avatar: "",
    email: "seth.alden@heropm.com",
    phone: "+1 (555) 678-9013",
    role: "Process Owner",
    dateAdded: "1/5/2025",
    status: "Active",
    ownersHandling: [],
    tenantsHandling: [{ id: "t14", name: "Stephen Strange" }],
    propertiesManaging: [{ id: "p12", name: "Phoenix Heights", units: 22 }],
    tasksAssigned: [],
  },
]

// Derive simplified staff list for portfolio assignment from main staff data
const PORTFOLIO_STAFF = STAFF_MEMBERS_DATA.map(staff => ({
  id: staff.id,
  name: staff.name,
  avatar: staff.avatar,
  initials: staff.initials,
}))

// CSR Portfolio data with role assignments
interface RoleAssignment {
  [role: string]: string | null
}

interface CSRPortfolio {
  id: string
  name: string
  assignments: RoleAssignment
}

const INITIAL_CSR_DATA: CSRPortfolio[] = [
  {
    id: "csr1",
    name: "CSR - Kendra Portfolio",
    assignments: {
      "Process Owner": "10", // Kendra Jeffers
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "8", // Betty Maalouf
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr2",
    name: "CSR - Jenna Portfolio",
    assignments: {
      "Process Owner": "11", // Jenna Vail
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "9", // Ralph Thompson
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr3",
    name: "CSR - Henry Portfolio",
    assignments: {
      "Process Owner": "12", // Henry Morgan
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "8", // Betty Maalouf
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr4",
    name: "CSR - Jace Portfolio",
    assignments: {
      "Process Owner": "13", // Jace Ives
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "8", // Betty Maalouf
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr5",
    name: "CSR - Ashton Portfolio",
    assignments: {
      "Process Owner": "14", // Ashton Blair
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "8", // Betty Maalouf
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr6",
    name: "CSR - Legna Portfolio",
    assignments: {
      "Process Owner": "15", // Legna Lira
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "9", // Ralph Thompson
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr7",
    name: "CSR - Jason Portfolio",
    assignments: {
      "Process Owner": "16", // Jason Egerton
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "9", // Ralph Thompson
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
  {
    id: "csr8",
    name: "PH - Seth Portfolio",
    assignments: {
      "Process Owner": "17", // Seth Alden
      Accountant: "7", // Simon Peters
      "Acquisition Manager": null,
      Agent: null,
      AGM: "9", // Ralph Thompson
      BC: "7", // Simon Peters
      CEO: null,
      CSM: null,
      "HR Executive": null,
      "HR Manager": null,
      "Lead Coordinator": null,
      "Lead Owner": null,
    },
  },
]

// Role badge color mapping
const getRoleBadgeColor = (role: string) => {
  const roleColors: Record<string, string> = {
    "Property Manager": "bg-slate-700 text-white",
    "Leasing Agent": "bg-teal-600 text-white",
    Admin: "bg-slate-800 text-white",
    "Maintenance Coordinator": "bg-slate-600 text-white",
    Accountant: "bg-slate-500 text-white",
  }
  return roleColors[role] || "bg-primary text-primary-foreground"
}

// Staff selector cell component for portfolio tab
function StaffSelectorCell({
  currentStaffId,
  onSelect,
}: {
  currentStaffId: string | null
  onSelect: (staffId: string | null) => void
}) {
  const selectedStaff = currentStaffId ? PORTFOLIO_STAFF.find((s) => s.id === currentStaffId) : null

  return (
    <Select value={currentStaffId || "unassigned"} onValueChange={(value) => onSelect(value === "unassigned" ? null : value)}>
      <SelectTrigger className="w-full min-w-[140px] h-9 border-border bg-background hover:bg-muted focus:ring-1 focus:ring-ring">
        {selectedStaff ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedStaff.avatar || "/placeholder.svg"} alt={selectedStaff.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {selectedStaff.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground truncate">{selectedStaff.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Select user</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">
          <span className="text-muted-foreground">Select user</span>
        </SelectItem>
        {PORTFOLIO_STAFF.map((staff) => (
          <SelectItem key={staff.id} value={staff.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{staff.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{staff.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Staff Detail View Component
function StaffDetailView({
  staff,
  onBack,
}: {
  staff: StaffMember
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Staff Members
      </Button>

      {/* Staff Header */}
      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {staff.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{staff.name}</h2>
                <Badge className={getRoleBadgeColor(staff.role)}>{staff.role}</Badge>
                <Badge variant={staff.status === "Active" ? "outline" : "secondary"} className={staff.status === "Active" ? "border-green-500 text-green-600" : ""}>
                  {staff.status}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {staff.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {staff.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Added: {staff.dateAdded}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.ownersHandling.length}</p>
                <p className="text-sm text-muted-foreground">Owners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-teal-100">
                <Home className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.tenantsHandling.length}</p>
                <p className="text-sm text-muted-foreground">Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.propertiesManaging.length}</p>
                <p className="text-sm text-muted-foreground">Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <ClipboardList className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.tasksAssigned.length}</p>
                <p className="text-sm text-muted-foreground">Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Owners Handling */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Owners Handling
            </h3>
            {staff.ownersHandling.length > 0 ? (
              <div className="space-y-2">
                {staff.ownersHandling.map((owner) => (
                  <div key={owner.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {owner.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{owner.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No owners assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Tenants Handling */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Home className="h-4 w-4 text-teal-600" />
              Tenants Handling
            </h3>
            {staff.tenantsHandling.length > 0 ? (
              <div className="space-y-2">
                {staff.tenantsHandling.map((tenant) => (
                  <div key={tenant.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                        {tenant.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{tenant.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tenants assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Properties Managing */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Properties Managing
            </h3>
            {staff.propertiesManaging.length > 0 ? (
              <div className="space-y-2">
                {staff.propertiesManaging.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">{property.name}</span>
                    <Badge variant="secondary">{property.units} units</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No properties assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Tasks Assigned */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-amber-600" />
              Tasks Assigned
            </h3>
            {staff.tasksAssigned.length > 0 ? (
              <div className="space-y-2">
                {staff.tasksAssigned.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">{task.title}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        task.status === "Completed" ? "border-green-500 text-green-600" :
                        task.status === "In Progress" ? "border-blue-500 text-blue-600" :
                        task.status === "Urgent" ? "border-red-500 text-red-600" :
                        "border-amber-500 text-amber-600"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tasks assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState("staff-members")
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState("")
  const [staffMembers, setStaffMembers] = useState(STAFF_MEMBERS_DATA)
  const [csrData, setCsrData] = useState<CSRPortfolio[]>(INITIAL_CSR_DATA)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  // Handle staff status toggle
  const handleStatusToggle = (staffId: string) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === staffId
          ? { ...staff, status: staff.status === "Active" ? "Inactive" : "Active" }
          : staff
      )
    )
  }

  // Handle portfolio assignment change
  const handleAssignmentChange = (csrId: string, role: string, staffId: string | null) => {
    setCsrData((prev) =>
      prev.map((csr) =>
        csr.id === csrId
          ? {
              ...csr,
              assignments: {
                ...csr.assignments,
                [role]: staffId,
              },
            }
          : csr
      )
    )
  }

  // Filter staff members
  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(staffSearchQuery.toLowerCase())
  )

  // Filter CSR portfolios
  const filteredCSRs = csrData.filter((csr) =>
    csr.name.toLowerCase().includes(portfolioSearchQuery.toLowerCase())
  )

  // If a staff member is selected, show detail view
  if (selectedStaff) {
    return (
      <div className="p-6">
        <StaffDetailView staff={selectedStaff} onBack={() => setSelectedStaff(null)} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground text-sm">Manage team members and portfolio assignments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="border-b border-border">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("staff-members")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "staff-members"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                Staff Members
                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-muted">
                  {staffMembers.length}
                </Badge>
              </span>
              {activeTab === "staff-members" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "portfolio"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                Portfolio
                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-muted">
                  {csrData.length}
                </Badge>
              </span>
              {activeTab === "portfolio" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Staff Members Tab */}
        <TabsContent value="staff-members" className="space-y-4">
          {/* Search Filter */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff by name, email, or role..."
                  className="pl-10"
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Staff Table */}
          <Card className="border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Staff Member</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Date Added</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {staff.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{staff.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {staff.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(staff.role)}>{staff.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {staff.dateAdded}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          staff.status === "Active"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-muted-foreground text-muted-foreground"
                        }
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedStaff(staff)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusToggle(staff.id)}>
                            {staff.status === "Active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Terminate Access
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Resume Access
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStaff.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No staff members found matching your search.</p>
              </div>
            )}
          </Card>

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredStaff.length} of {staffMembers.length} staff members
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          {/* Search Filter */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search CSR portfolios..."
                  className="pl-10"
                  value={portfolioSearchQuery}
                  onChange={(e) => setPortfolioSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* CSR-to-Role Matrix Table */}
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="sticky left-0 z-10 bg-muted px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px] border-r border-border">
                      CSR Portfolio
                    </th>
                    {ROLE_COLUMNS.map((role) => (
                      <th
                        key={role}
                        className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[160px]"
                      >
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCSRs.map((csr, index) => (
                    <tr
                      key={csr.id}
                      className={`border-b border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/50"}`}
                    >
                      <td
                        className={`sticky left-0 z-10 px-4 py-3 font-medium text-foreground min-w-[200px] border-r border-border ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">=</span>
                          <span>{csr.name}</span>
                        </div>
                      </td>
                      {ROLE_COLUMNS.map((role) => (
                        <td key={role} className="px-3 py-2">
                          <StaffSelectorCell
                            currentStaffId={csr.assignments[role]}
                            onSelect={(staffId) => handleAssignmentChange(csr.id, role, staffId)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredCSRs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No CSR portfolios found matching your search.</p>
              </div>
            )}
          </Card>

          {/* Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredCSRs.length} of {csrData.length} CSR portfolios
            </span>
            <span>{ROLE_COLUMNS.length} roles configured</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
