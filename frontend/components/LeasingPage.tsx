"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  X,
  Ruler,
  Clock,
  User,
  Building,
  CalendarDays,
  Upload,
  Building2,
  ArrowUpDown,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Send,
  CheckCircle,
  Bed,
  Cat,
  Dog,
  ArrowRight,
  RotateCcw,
  MoreHorizontal,
  XCircle,
  Megaphone,
  Trash2,
  ChevronUp,
  ChevronDown,
  Zap,
  LayoutGrid,
  List,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import RentalApplicationDetail from "./RentalApplicationDetail"
import NewRentalApplication from "./new-rental-application"
import NewGuestCard from "./new-guest-card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { GuestCardsFilterDialog } from "./guest-cards-filter-dialog"

interface LeasingPageProps {
  params?: Record<string, any>
  onNavigateToVacancyDetail?: (vacancyId: string) => void // Added navigation prop
  onNavigateToGuestCardDetail?: (guestCardId: string) => void // Add navigation prop
  onNavigateToApplicationDetail?: (applicationId: string) => void // Added navigation prop
}

const mockVacancies = [
  {
    id: 1,
    name: "Sunset Apartments - Unit 302",
    property: "Sunset Apartments",
    unit: "302",
    type: "2 Bed / 1 Bath",
    sqft: 950,
    rent: 1450,
    available: "Nov 1, 2024",
    status: "Ready",
    address: "123 Sunset Blvd, Los Angeles, CA",
    amenities: ["Parking", "Balcony", "Pool Access"],
    lastTenant: "Moved out Oct 15, 2024",
    vacantType: "created" as const,
    createdOn: "12/25/2024",
    vacantDays: null,
    automations: [
      { id: 1, name: "Welcome Email - New Tenant", status: "active" },
      { id: 2, name: "Follow-up After Showing", status: "active" },
    ],
    postingStatus: {
      website: false,
      internet: false,
      premium: false,
      zillowSpotlight: false,
    },
  },
  {
    id: 2,
    name: "Oakwood Residence - Unit A-5",
    property: "Oakwood Residence",
    unit: "A-5",
    type: "1 Bed / 1 Bath",
    sqft: 720,
    rent: 1200,
    available: "Available Now",
    status: "Ready",
    address: "456 Oak Street, Los Angeles, CA",
    amenities: ["Parking", "Pet Friendly", "Gym"],
    lastTenant: "Moved out Oct 1, 2024",
    vacantType: "vacant" as const,
    createdOn: null,
    vacantDays: 586,
    automations: [{ id: 3, name: "Price Drop Alert", status: "active" }],
    postingStatus: {
      website: false,
      internet: false,
      premium: false,
      zillowSpotlight: false,
    },
  },
  {
    id: 3,
    name: "Pine Street Homes - Unit 8B",
    property: "Pine Street Homes",
    unit: "8B",
    type: "3 Bed / 2 Bath",
    sqft: 1350,
    rent: 2100,
    available: "Dec 1, 2024",
    status: "Cleaning",
    address: "789 Pine Street, Los Angeles, CA",
    amenities: ["Parking", "In-unit Laundry", "Garden"],
    lastTenant: "Lease expires Nov 25, 2024",
    vacantType: "created" as const,
    createdOn: "11/15/2024",
    vacantDays: null,
    automations: [
      { id: 4, name: "Vacancy Marketing Campaign", status: "active" },
      { id: 5, name: "Application Reminder", status: "active" },
      { id: 6, name: "Showing Confirmation", status: "paused" },
    ],
    postingStatus: {
      website: true,
      internet: false,
      premium: false,
      zillowSpotlight: false,
    },
  },
  {
    id: 4,
    name: "Harbor View - Unit 1205",
    property: "Harbor View",
    unit: "1205",
    type: "2 Bed / 2 Bath",
    sqft: 1100,
    rent: 1800,
    available: "Available Now",
    status: "Ready",
    address: "321 Harbor Drive, Los Angeles, CA",
    amenities: ["Parking", "Balcony", "Pool Access", "Gym"],
    lastTenant: "Moved out Sep 28, 2024",
    vacantType: "vacant" as const,
    createdOn: null,
    vacantDays: 120,
    automations: [],
    postingStatus: {
      website: true,
      internet: true,
      premium: false,
      zillowSpotlight: false,
    },
  },
  {
    id: 5,
    name: "Metro Plaza - Unit 405",
    property: "Metro Plaza",
    unit: "405",
    type: "Studio",
    sqft: 580,
    rent: 950,
    available: "Nov 15, 2024",
    status: "Ready",
    address: "555 Metro Ave, Los Angeles, CA",
    amenities: ["Parking", "Rooftop Access"],
    lastTenant: "Moved out Oct 20, 2024",
    vacantType: "created" as const,
    createdOn: "10/30/2024",
    vacantDays: null,
    automations: [
      { id: 7, name: "Lead Nurturing Sequence", status: "active" },
      { id: 8, name: "Weekly Vacancy Report", status: "active" },
    ],
    postingStatus: {
      website: false,
      internet: false,
      premium: true,
      zillowSpotlight: false,
    },
  },
  {
    id: 6,
    name: "Riverside Apartments - Unit 12C",
    property: "Riverside Apartments",
    unit: "12C",
    type: "2 Bed / 1 Bath",
    sqft: 900,
    rent: 1350,
    available: "Available Now",
    status: "Ready",
    address: "888 River Road, Los Angeles, CA",
    amenities: ["Parking", "Pool Access", "Gym"],
    lastTenant: "Moved out Sep 15, 2024",
    vacantType: "vacant" as const,
    createdOn: null,
    vacantDays: 45,
    automations: [{ id: 9, name: "Auto-Response to Inquiries", status: "active" }],
    postingStatus: {
      website: true,
      internet: true,
      premium: true,
      zillowSpotlight: true,
    },
  },
]

const mockGuestCards = [
  {
    id: 1,
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    phone: "(555) 123-4567",
    status: "Active",
    budget: "$1,800 - $2,200",
    preferences: "2 Bed / 1 Bath",
    moveInDate: "Dec 1, 2024",
    lastContact: "2 days ago",
    assignedTo: "Nina Patel",
    source: "Apartments.com",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Looking for a quiet unit, preferably top floor. Has a cat.",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "(555) 987-6543",
    status: "Pre-Qualified",
    budget: "$2,500+",
    preferences: "2 Bed / 2 Bath",
    moveInDate: "ASAP",
    lastContact: "Yesterday",
    assignedTo: "Nina Patel",
    source: "Walk-in",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Needs parking for 2 cars. Interested in the gym amenities.",
  },
  {
    id: 3,
    name: "Jessica Davis",
    email: "j.davis@example.com",
    phone: "(555) 456-7890",
    status: "Lead",
    budget: "$1,500 max",
    preferences: "Studio or 1 Bed",
    moveInDate: "Jan 15, 2025",
    lastContact: "5 days ago",
    assignedTo: "John Doe",
    source: "Website",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Student at local university. Needs guarantor.",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "(555) 234-5678",
    status: "Tour Scheduled",
    budget: "$2,000 - $2,400",
    preferences: "2 Bed / 2 Bath",
    moveInDate: "Dec 15, 2024",
    lastContact: "Today",
    assignedTo: "Nina Patel",
    source: "Zillow",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Works from home, needs office space. Tour scheduled for tomorrow.",
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    phone: "(555) 345-6789",
    status: "Active",
    budget: "$1,600 - $1,900",
    preferences: "1 Bed / 1 Bath",
    moveInDate: "Jan 1, 2025",
    lastContact: "3 days ago",
    assignedTo: "John Doe",
    source: "Referral",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Recently relocated for work. Good credit score.",
  },
  {
    id: 6,
    name: "James Thompson",
    email: "james.t@example.com",
    phone: "(555) 456-7891",
    status: "Pre-Qualified",
    budget: "$3,000+",
    preferences: "3 Bed / 2 Bath",
    moveInDate: "Feb 1, 2025",
    lastContact: "1 week ago",
    assignedTo: "Nina Patel",
    source: "Apartments.com",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Looking for family-friendly unit with yard access.",
  },
  {
    id: 7,
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    phone: "(555) 567-8912",
    status: "Lead",
    budget: "$1,400 - $1,700",
    preferences: "Studio",
    moveInDate: "Dec 20, 2024",
    lastContact: "4 days ago",
    assignedTo: "John Doe",
    source: "Website",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "First-time renter. Prefers ground floor units.",
  },
  {
    id: 8,
    name: "Robert Garcia",
    email: "robert.g@example.com",
    phone: "(555) 678-9123",
    status: "Tour Scheduled",
    budget: "$2,200 - $2,600",
    preferences: "2 Bed / 2 Bath",
    moveInDate: "Jan 10, 2025",
    lastContact: "Today",
    assignedTo: "Nina Patel",
    source: "Zillow",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Interested in units with balconies. Has a small dog.",
  },
  {
    id: 9,
    name: "Sophia Anderson",
    email: "sophia.a@example.com",
    phone: "(555) 789-1234",
    status: "Active",
    budget: "$1,900 - $2,300",
    preferences: "1 Bed / 1 Bath",
    moveInDate: "Dec 5, 2024",
    lastContact: "Yesterday",
    assignedTo: "John Doe",
    source: "Walk-in",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Prefers modern finishes and in-unit washer/dryer.",
  },
  {
    id: 10,
    name: "William Brown",
    email: "william.b@example.com",
    phone: "(555) 891-2345",
    status: "Pre-Qualified",
    budget: "$2,800+",
    preferences: "3 Bed / 2 Bath",
    moveInDate: "Jan 20, 2025",
    lastContact: "2 days ago",
    assignedTo: "Nina Patel",
    source: "Apartments.com",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Executive relocating with family. Needs move-in flexibility.",
  },
  {
    id: 11,
    name: "Ava Taylor",
    email: "ava.t@example.com",
    phone: "(555) 912-3456",
    status: "Lead",
    budget: "$1,300 - $1,600",
    preferences: "Studio or 1 Bed",
    moveInDate: "Feb 15, 2025",
    lastContact: "6 days ago",
    assignedTo: "John Doe",
    source: "Website",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Healthcare worker with flexible schedule. Pet-friendly unit needed.",
  },
  {
    id: 12,
    name: "Ethan White",
    email: "ethan.w@example.com",
    phone: "(555) 123-4568",
    status: "Tour Scheduled",
    budget: "$2,400 - $2,800",
    preferences: "2 Bed / 2 Bath",
    moveInDate: "Dec 28, 2024",
    lastContact: "Today",
    assignedTo: "Nina Patel",
    source: "Referral",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Referred by current tenant. Tour scheduled for this Friday.",
  },
  {
    id: 13,
    name: "Isabella Harris",
    email: "isabella.h@example.com",
    phone: "(555) 234-5679",
    status: "Active",
    budget: "$1,700 - $2,000",
    preferences: "1 Bed / 1 Bath",
    moveInDate: "Jan 5, 2025",
    lastContact: "3 days ago",
    assignedTo: "John Doe",
    source: "Zillow",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Works night shifts, looking for quiet community.",
  },
  {
    id: 14,
    name: "Mason Clark",
    email: "mason.c@example.com",
    phone: "(555) 345-6780",
    status: "Pre-Qualified",
    budget: "$2,600+",
    preferences: "2 Bed / 2 Bath",
    moveInDate: "Feb 10, 2025",
    lastContact: "1 week ago",
    assignedTo: "Nina Patel",
    source: "Walk-in",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Tech professional, needs high-speed internet. Home office required.",
  },
  {
    id: 15,
    name: "Charlotte Lewis",
    email: "charlotte.l@example.com",
    phone: "(555) 456-7892",
    status: "Lead",
    budget: "$1,500 - $1,800",
    preferences: "1 Bed / 1 Bath",
    moveInDate: "Jan 25, 2025",
    lastContact: "5 days ago",
    assignedTo: "John Doe",
    source: "Website",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Recent college graduate starting new job. Clean rental history.",
  },
]

const mockRentalApplications = [
  {
    id: 1,
    unitCode: "8 SH - 2 - B",
    address: "100 Vista Del Monte, 2\nLas Cruces, NM 88001",
    marketRent: 500,
    vacantOn: "Not Vacant",
    image: "/placeholder.svg?height=150&width=200",
    applicants: [
      {
        id: 101,
        name: "Diana Prince",
        moveInDate: "12/01/2025",
        status: "Decision Pending",
        received: "11/19/2025 12:34 AM",
        type: "Financially Responsible",
        phone: "9876543210",
        email: "anilislearning@gmail.com",
        dob: "09/04/1995",
        ssn: "XXX-XX-9854",
      },
    ],
  },
  {
    id: 2,
    unitCode: "SUN - 302",
    address: "123 Sunset Blvd, 302\nLos Angeles, CA 90028",
    marketRent: 1450,
    vacantOn: "Nov 1, 2024",
    image: "/placeholder.svg?height=150&width=200",
    applicants: [
      {
        id: 201,
        name: "Sarah Miller",
        moveInDate: "11/15/2024",
        status: "Approved",
        received: "11/18/2025 09:15 AM",
      },
      {
        id: 202,
        name: "Mike Ross",
        moveInDate: "11/20/2024",
        status: "Screening",
        received: "11/18/2025 02:30 PM",
      },
    ],
  },
  {
    id: 3,
    unitCode: "OAK - A5",
    address: "456 Oak Street, A-5\nLos Angeles, CA 90012",
    marketRent: 1200,
    vacantOn: "Available Now",
    image: "/placeholder.svg?height=150&width=200",
    applicants: [
      {
        id: 301,
        name: "Emily Chen",
        moveInDate: "ASAP",
        status: "New",
        received: "11/19/2025 08:45 AM",
      },
    ],
  },
]

// Renewals data moved outside the component
const renewalsData = [
  {
    id: 1,
    property: "928 Paxton Rd - 2",
    tenant: "Julia Anderson",
    expiration: "--",
    currentRent: "$0.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 2,
    property: "12 Greenwich Park Road - MoonRise Rea...",
    tenant: "Kennisha Bryan",
    expiration: "--",
    currentRent: "$1,500.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 3,
    property: "1600 West Ave - Unit-2",
    tenant: "Jessi Pinkman",
    expiration: "--",
    currentRent: "$1,200.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 4,
    property: "12 Greenwich Park Road - Up Unit",
    tenant: "Kennisha Bryan",
    expiration: "--",
    currentRent: "$0.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 5,
    property: "3422 - 3424 Seymour Ave. Cleveland - ...",
    tenant: "aria m",
    expiration: "--",
    currentRent: "$1,000.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 6,
    property: "8 CM - 101",
    tenant: "EZ Nail Salon",
    expiration: "--",
    currentRent: "$1,200.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 7,
    property: "8 CM - 103",
    tenant: "The Farmer's Market",
    expiration: "--",
    currentRent: "$1,100.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 8,
    property: "8 CM - 201",
    tenant: "Little Bits Restaurant",
    expiration: "--",
    currentRent: "$1,500.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 9,
    property: "8 CM - 202",
    tenant: "Worldwide Express Shipping",
    expiration: "--",
    currentRent: "$1,300.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 10,
    property: "8 MF-A - Apt 01",
    tenant: "Michael Farah",
    expiration: "--",
    currentRent: "$1,495.00",
    newRent: "--",
    status: "Prepared not Sent",
    tabCategory: "all",
  },
  {
    id: 11,
    property: "8 MF-A - Apt 02",
    tenant: "Robert Loebl",
    expiration: "--",
    currentRent: "$500.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 12,
    property: "8 MF-A - Apt 03",
    tenants: ["Jazmin Gonzalez", "John Menzel"],
    expiration: "--",
    currentRent: "$400.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 13,
    property: "8 MF-A - Apt 04",
    tenants: ["John Payne", "Christina Riperetti"],
    expiration: "--",
    currentRent: "$1,995.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 14,
    property: "8 MF-A - Apt 09",
    tenant: "Asad Cheema",
    expiration: "--",
    currentRent: "$1,000.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 15,
    property: "8 MF-B - Apt 01",
    tenant: "Lewis Frank",
    expiration: "--",
    currentRent: "$1,100.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 16,
    property: "8 MF-B - Apt 02",
    tenant: "Bob Evans",
    expiration: "--",
    currentRent: "$1,750.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 17,
    property: "8 MF-B - Apt 03",
    tenant: "Stephan Erkelens",
    expiration: "--",
    currentRent: "$1,200.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 18,
    property: "8 MF-B - Apt 08",
    tenant: "Mike Shepard",
    expiration: "--",
    currentRent: "$1,100.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 19,
    property: "8 MF-B - Apt 10",
    tenant: "Terry Gniffke",
    expiration: "--",
    currentRent: "$1,200.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 20,
    property: "8 MF-B - Apt 15",
    tenant: "Jessica Johnson",
    expiration: "--",
    currentRent: "$1,750.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  // Additional records to reach 39 total
  {
    id: 21,
    property: "Oak Ridge - Unit 101",
    tenant: "David Martinez",
    expiration: "01/15/2025",
    currentRent: "$1,850.00",
    newRent: "$1,950.00",
    status: "Ready to Countersign",
    tabCategory: "countersign",
  },
  {
    id: 22,
    property: "Oak Ridge - Unit 205",
    tenant: "Sarah Williams",
    expiration: "02/01/2025",
    currentRent: "$2,100.00",
    newRent: "$2,200.00",
    status: "Ready to Countersign",
    tabCategory: "countersign",
  },
  {
    id: 23,
    property: "Maple Court - Apt 3A",
    tenant: "James Thompson",
    expiration: "01/31/2025",
    currentRent: "$1,650.00",
    newRent: "$1,750.00",
    status: "Ready to Countersign",
    tabCategory: "countersign",
  },
  {
    id: 24,
    property: "Pine Valley - Unit 12",
    tenant: "Emily Rodriguez",
    expiration: "02/15/2025",
    currentRent: "$1,400.00",
    newRent: "$1,475.00",
    status: "Out for Signing",
    tabCategory: "signing",
  },
  {
    id: 25,
    property: "Pine Valley - Unit 18",
    tenants: ["Michael Brown", "Jennifer Brown"],
    expiration: "02/28/2025",
    currentRent: "$1,900.00",
    newRent: "$2,000.00",
    status: "Out for Signing",
    tabCategory: "signing",
  },
  {
    id: 26,
    property: "Sunset Heights - 4B",
    tenant: "Christopher Lee",
    expiration: "03/01/2025",
    currentRent: "$2,300.00",
    newRent: "$2,400.00",
    status: "Out for Signing",
    tabCategory: "signing",
  },
  {
    id: 27,
    property: "Sunset Heights - 7A",
    tenant: "Amanda Garcia",
    expiration: "03/15/2025",
    currentRent: "$1,950.00",
    newRent: "$2,050.00",
    status: "Out for Signing",
    tabCategory: "signing",
  },
  {
    id: 28,
    property: "Riverside Plaza - Suite 301",
    tenant: "Daniel Wilson",
    expiration: "02/20/2025",
    currentRent: "$2,500.00",
    newRent: "$2,625.00",
    status: "Out for Signing",
    tabCategory: "signing",
  },
  {
    id: 29,
    property: "Harbor Point - Unit 5",
    tenant: "Michelle Taylor",
    expiration: "04/01/2025",
    currentRent: "$1,800.00",
    newRent: "$1,890.00",
    status: "Printed",
    tabCategory: "printed",
  },
  {
    id: 30,
    property: "Harbor Point - Unit 12",
    tenant: "Kevin Anderson",
    expiration: "04/15/2025",
    currentRent: "$1,650.00",
    newRent: "$1,730.00",
    status: "Printed",
    tabCategory: "printed",
  },
  {
    id: 31,
    property: "Lakeside Manor - Apt 2C",
    tenant: "Rachel Green",
    expiration: "--",
    currentRent: "$1,350.00",
    newRent: "--",
    status: "Pending",
    tabCategory: "all",
  },
  {
    id: 32,
    property: "Lakeside Manor - Apt 4D",
    tenant: "Mark Johnson",
    expiration: "--",
    currentRent: "$1,425.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 33,
    property: "Birch Wood - Unit 8",
    tenants: ["Lisa White", "Tom White"],
    expiration: "--",
    currentRent: "$1,575.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 34,
    property: "Birch Wood - Unit 15",
    tenant: "Nancy Davis",
    expiration: "--",
    currentRent: "$1,200.00",
    newRent: "--",
    status: "Pending",
    tabCategory: "all",
  },
  {
    id: 35,
    property: "Cedar Grove - Apt A1",
    tenant: "Paul Martinez",
    expiration: "--",
    currentRent: "$1,100.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 36,
    property: "Cedar Grove - Apt B3",
    tenant: "Sandra Moore",
    expiration: "--",
    currentRent: "$1,275.00",
    newRent: "--",
    status: "Prepared not Sent",
    tabCategory: "all",
  },
  {
    id: 37,
    property: "Willowbrook - Suite 100",
    tenant: "George Harris",
    expiration: "--",
    currentRent: "$2,200.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
  {
    id: 38,
    property: "Willowbrook - Suite 205",
    tenants: ["Karen Clark", "Steve Clark"],
    expiration: "--",
    currentRent: "$2,450.00",
    newRent: "--",
    status: "Pending",
    tabCategory: "all",
  },
  {
    id: 39,
    property: "Elmwood Estates - Unit 7",
    tenant: "Brian Lewis",
    expiration: "--",
    currentRent: "$1,800.00",
    newRent: "--",
    status: "Eligible",
    tabCategory: "all",
  },
]

const renewalTabs = [
  { id: "all", label: "All", count: 39 },
  { id: "countersign", label: "Ready to Countersign", count: 3 },
  { id: "signing", label: "Out for Signing", count: 5 },
  { id: "printed", label: "Printed", count: 2 },
]

const renewalStatusOptions = ["Eligible", "Pending", "Prepared not Sent"]

const tenantOptions = [
  "Julia Anderson",
  "Kennisha Bryan",
  "Jessi Pinkman",
  "aria m",
  "EZ Nail Salon",
  "The Farmer's Market",
  "Little Bits Restaurant",
  "Worldwide Express Shipping",
  "Michael Farah",
  "Robert Loebl",
  "Jazmin Gonzalez",
  "John Menzel",
  "John Payne",
  "Christina Riperetti",
  "Asad Cheema",
  "Lewis Frank",
  "Bob Evans",
  "Stephan Erkelens",
  "Mike Shepard",
  "Terry Gniffke",
  "Jessica Johnson",
  "David Martinez",
  "Sarah Williams",
  "James Thompson",
  "Emily Rodriguez",
  "Michael Brown",
  "Jennifer Brown",
  "Christopher Lee",
  "Amanda Garcia",
  "Daniel Wilson",
  "Michelle Taylor",
  "Kevin Anderson",
  "Rachel Green",
  "Mark Johnson",
  "Lisa White",
  "Tom White",
  "Nancy Davis",
  "Paul Martinez",
  "Sandra Moore",
  "George Harris",
  "Karen Clark",
  "Steve Clark",
  "Brian Lewis",
]

// RenewalsContent as a separate component outside LeasingPage
function RenewalsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [showRenewalFilters, setShowRenewalFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterProperty, setFilterProperty] = useState("")
  const [filterTenant, setFilterTenant] = useState("")
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [filterExpirationFrom, setFilterExpirationFrom] = useState("")
  const [filterExpirationTo, setFilterExpirationTo] = useState("")
  const [includeMonthToMonth, setIncludeMonthToMonth] = useState(true)
  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [prepareRenewalDialogOpen, setPrepareRenewalDialogOpen] = useState(false)
  const [selectedRenewal, setSelectedRenewal] = useState<(typeof renewalsData)[0] | null>(null)
  const [newRentAmount, setNewRentAmount] = useState("")
  const [renewalTerm, setRenewalTerm] = useState("12")
  const [renewalNotes, setRenewalNotes] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "tile">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

  const itemsPerPage = 20

  const activeFilterCount =
    [filterProperty, filterTenant, filterExpirationFrom, filterExpirationTo].filter(Boolean).length +
    filterStatus.length +
    (includeMonthToMonth ? 0 : 1)

  const toggleRenewalStatus = (status: string) => {
    setFilterStatus((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearRenewalFilters = () => {
    setFilterProperty("")
    setFilterTenant("")
    setFilterStatus([])
    setFilterExpirationFrom("")
    setFilterExpirationTo("")
    setIncludeMonthToMonth(true)
    setVisibleCount(20)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort data
  const filteredData = renewalsData.filter((item) => {
    // Tab filter
    if (activeTab !== "all") {
      if (activeTab === "countersign" && item.tabCategory !== "countersign") return false
      if (activeTab === "signing" && item.tabCategory !== "signing") return false
      if (activeTab === "printed" && item.tabCategory !== "printed") return false
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const tenantName = "tenants" in item ? item.tenants?.join(" ").toLowerCase() : (item.tenant || "").toLowerCase()
      if (!item.property.toLowerCase().includes(query) && !tenantName.includes(query)) {
        return false
      }
    }

    // Property filter
    if (filterProperty && !item.property.toLowerCase().includes(filterProperty.toLowerCase())) {
      return false
    }

    // Tenant filter
    if (filterTenant && filterTenant !== "all") {
      const tenantName = "tenants" in item ? item.tenants?.join(" ") : item.tenant
      if (!tenantName?.includes(filterTenant)) return false
    }

    // Status filter
    if (filterStatus.length > 0 && !filterStatus.includes(item.status)) {
      return false
    }

    // Expiration date filter - Note: This filter is not fully implemented in the original code for RenewalsContent
    // and requires careful handling of date formats and comparison.
    // For now, it's commented out to avoid breaking existing functionality.
    /*
    if (filterExpirationFrom && item.expiration !== "--") {
      const expirationDate = new Date(item.expiration);
      const filterFromDate = new Date(filterExpirationFrom);
      if (expirationDate < filterFromDate) return false;
    }
    if (filterExpirationTo && item.expiration !== "--") {
      const expirationDate = new Date(item.expiration);
      const filterToDate = new Date(filterExpirationTo);
      if (expirationDate > filterToDate) return false;
    }
    */

    return true
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0
    let aVal: string | number | Date | null = ""
    let bVal: string | number | Date | null = ""

    if (sortField === "property") {
      aVal = a.property
      bVal = b.property
    } else if (sortField === "expiration") {
      // Handle the "--" case for expiration dates
      const parseDate = (dateStr: string) => (dateStr === "--" ? null : new Date(dateStr))
      aVal = parseDate(a.expiration)
      bVal = parseDate(b.expiration)

      if (aVal === null && bVal === null) return 0
      if (aVal === null) return sortDirection === "asc" ? 1 : -1
      if (bVal === null) return sortDirection === "asc" ? -1 : 1
    } else if (sortField === "status") {
      aVal = a.status
      bVal = b.status
    } else if (sortField === "currentRent") {
      aVal = Number.parseFloat(a.currentRent.replace(/[$,]/g, "")) || 0
      bVal = Number.parseFloat(b.currentRent.replace(/[$,]/g, "")) || 0
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    }

    if (aVal instanceof Date && bVal instanceof Date) {
      return sortDirection === "asc" ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime()
    }

    return sortDirection === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
  })

  // Pagination
  const totalItems = sortedData.length
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const visibleData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const hasMoreData = visibleCount < totalItems

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, totalItems))
      setIsLoadingMore(false)
    }, 300)
  }

  // Tab counts
  const tabCounts = {
    all: renewalsData.length,
    countersign: renewalsData.filter((r) => r.tabCategory === "countersign").length,
    signing: renewalsData.filter((r) => r.tabCategory === "signing").length,
    printed: renewalsData.filter((r) => r.tabCategory === "printed").length,
  }

  const handlePrepareRenewal = (item: (typeof renewalsData)[0]) => {
    setSelectedRenewal(item)
    setNewRentAmount("")
    setRenewalTerm("12")
    setRenewalNotes("")
    setPrepareRenewalDialogOpen(true)
  }

  const handleSubmitRenewal = () => {
    if (!newRentAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter the new rent amount.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Renewal Offer Prepared",
      description: `Renewal offer for ${selectedRenewal?.property} has been prepared with new rent $${newRentAmount}/month.`,
    })
    setPrepareRenewalDialogOpen(false)
    // TODO: Implement actual renewal offer preparation and saving logic
  }

  const handleSearch = () => {
    setCurrentPage(1)
    // The toast for filters applied is now integrated into the search button click
    // toast({
    //   title: "Filters Applied",
    //   description: `Found ${filteredData.length} renewal records matching your criteria.`,
    // })
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${sortedData.length} renewal records to CSV...`,
    })
    // TODO: Implement actual export logic
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by property, unit, or tenant..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>
        {/* CHANGE> Added view toggle buttons */}
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            variant={viewMode === "tile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("tile")}
            className={`rounded-none ${viewMode === "tile" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`rounded-none ${viewMode === "list" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowRenewalFilters(!showRenewalFilters)}
          className={showRenewalFilters ? "bg-teal-50 border-teal-200 text-teal-700" : ""}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-teal-500 text-white text-xs px-1.5 py-0">{activeFilterCount}</Badge>
          )}
        </Button>
        <Button variant="outline" onClick={handleExport} className="bg-transparent">
          <Download className="h-4 w-4 mr-2 text-teal-700" />
          Export
        </Button>
      </div>

      {/* Filter Panel */}
      {showRenewalFilters && (
        <Card className="border-teal-100 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-teal-900">Filter your renewals with the options below:</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearRenewalFilters()
                    handleSearch()
                  }}
                  className="text-teal-600 hover:text-teal-700"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Properties Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Properties</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Search by property, group, or portfolio"
                    value={filterProperty}
                    onChange={(e) => setFilterProperty(e.target.value)}
                    className="pl-9 bg-white border-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>

              {/* Tenant Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Tenant</Label>
                <Select value={filterTenant} onValueChange={setFilterTenant}>
                  <SelectTrigger className="bg-white border-violet-100 focus:border-violet-300">
                    <SelectValue placeholder="Search by tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tenants</SelectItem>
                    {tenantOptions.map((tenant) => (
                      <SelectItem key={tenant} value={tenant}>
                        {tenant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Status</Label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-md border border-emerald-100 min-h-[38px]">
                  {renewalStatusOptions.map((status) => (
                    <Badge
                      key={status}
                      variant="outline"
                      className={`cursor-pointer transition-all text-xs ${
                        filterStatus.includes(status)
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                          : "hover:bg-emerald-50 border-slate-200"
                      }`}
                      onClick={() => toggleRenewalStatus(status)}
                    >
                      {filterStatus.includes(status) && <X className="h-3 w-3 mr-1" />}
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expiration Date Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Lease Expirations Eligible for Renewal</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                    <Input
                      type="date"
                      value={filterExpirationFrom}
                      onChange={(e) => setFilterExpirationFrom(e.target.value)}
                      className="pl-9 bg-white border-amber-100 focus:border-amber-300"
                    />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                    <Input
                      type="date"
                      value={filterExpirationTo}
                      onChange={(e) => setFilterExpirationTo(e.target.value)}
                      className="pl-9 bg-white border-amber-100 focus:border-amber-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-teal-100">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="monthToMonth"
                  checked={includeMonthToMonth}
                  onCheckedChange={(checked) => setIncludeMonthToMonth(checked as boolean)}
                  className="border-teal-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <Label htmlFor="monthToMonth" className="text-sm text-slate-600 cursor-pointer">
                  Include month to month tenants
                </Label>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl w-fit border border-slate-200">
        {[
          { id: "all", label: "All", count: tabCounts.all },
          { id: "countersign", label: "Ready to Countersign", count: tabCounts.countersign },
          { id: "signing", label: "Out for Signing", count: tabCounts.signing },
          { id: "printed", label: "Printed", count: tabCounts.printed },
        ].map((tab) => {
          const tabColors: Record<string, any> = {
            all: {
              activeBg: "bg-gradient-to-r from-teal-500 to-cyan-500",
              activeText: "text-white",
              activeBorder: "border-teal-400",
              activeBadgeBg: "bg-white/20",
              activeBadgeText: "text-white",
              inactiveText: "text-teal-700",
              inactiveHover: "hover:bg-teal-100",
              inactiveBadgeBg: "bg-teal-100",
              inactiveBadgeText: "text-teal-700",
            },
            countersign: {
              activeBg: "bg-gradient-to-r from-emerald-500 to-green-500",
              activeText: "text-white",
              activeBorder: "border-emerald-400",
              activeBadgeBg: "bg-white/20",
              activeBadgeText: "text-white",
              inactiveText: "text-emerald-700",
              inactiveHover: "hover:bg-emerald-100",
              inactiveBadgeBg: "bg-emerald-100",
              inactiveBadgeText: "text-emerald-700",
            },
            signing: {
              activeBg: "bg-gradient-to-r from-purple-500 to-violet-500",
              activeText: "text-white",
              activeBorder: "border-purple-400",
              activeBadgeBg: "bg-white/20",
              activeBadgeText: "text-white",
              inactiveText: "text-purple-700",
              inactiveHover: "hover:bg-purple-100",
              inactiveBadgeBg: "bg-purple-100",
              inactiveBadgeText: "text-purple-700",
            },
            printed: {
              activeBg: "bg-gradient-to-r from-amber-500 to-orange-500",
              activeText: "text-white",
              activeBorder: "border-amber-400",
              activeBadgeBg: "bg-white/20",
              activeBadgeText: "text-white",
              inactiveText: "text-amber-700",
              inactiveHover: "hover:bg-amber-100",
              inactiveBadgeBg: "bg-amber-100",
              inactiveBadgeText: "text-amber-700",
            },
          }

          const colors = tabColors[tab.id] || tabColors.all
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentPage(1)
              }}
              className={
                isActive
                  ? `${colors.activeBg} ${colors.activeText} shadow-md border ${colors.activeBorder} hover:opacity-90`
                  : `${colors.inactiveText} ${colors.inactiveHover} bg-white/50`
              }
            >
              {tab.label}
              <Badge
                variant="secondary"
                className={`ml-2 text-xs ${
                  isActive
                    ? `${colors.activeBadgeBg} ${colors.activeBadgeText}`
                    : `${colors.inactiveBadgeBg} ${colors.inactiveBadgeText}`
                }`}
              >
                {tab.count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* CHANGE> Added conditional rendering based on viewMode */}
      {viewMode === "list" ? (
        <Card className="border-teal-100 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-teal-100/80 hover:bg-teal-100/80 border-b border-teal-200">
                  <TableHead className="font-semibold text-teal-800">
                    <button
                      className="flex items-center gap-1 cursor-pointer hover:text-teal-900"
                      onClick={() => handleSort("property")}
                    >
                      Property – Unit
                      <ArrowUpDown className={`h-3 w-3 ${sortField === "property" ? "text-teal-600" : ""}`} />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold text-teal-800">Tenants</TableHead>
                  <TableHead className="font-semibold text-teal-800">
                    <button
                      className="flex items-center gap-1 cursor-pointer hover:text-teal-900"
                      onClick={() => handleSort("expiration")}
                    >
                      Expiration
                      <ArrowUpDown className={`h-3 w-3 ${sortField === "expiration" ? "text-teal-600" : ""}`} />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold text-teal-800">
                    <button
                      className="flex items-center gap-1 cursor-pointer hover:text-teal-900"
                      onClick={() => handleSort("currentRent")}
                    >
                      Current Rent
                      <ArrowUpDown className={`h-3 w-3 ${sortField === "currentRent" ? "text-teal-600" : ""}`} />
                    </button>
                  </TableHead>
                  <TableHead className="font-semibold text-teal-800">
                    <div className="flex items-center gap-1">
                      New Rent
                      <HelpCircle className="h-3 w-3 text-teal-500" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-teal-800">
                    <button
                      className="flex items-center gap-1 cursor-pointer hover:text-teal-900"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <ArrowUpDown className={`h-3 w-3 ${sortField === "status" ? "text-teal-600" : ""}`} />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`
                      ${index % 2 === 0 ? "bg-white/60" : "bg-teal-50/50"}
                      hover:bg-teal-100/50
                      border-b border-teal-100
                      transition-colors
                    `}
                  >
                    <TableCell>
                      <button className="hover:text-teal-800 hover:underline text-left font-medium text-[rgba(32,17,194,1)]">
                        {item.property}
                      </button>
                    </TableCell>
                    <TableCell>
                      {"tenants" in item && item.tenants ? (
                        <div className="space-y-0.5">
                          {item.tenants.map((t, i) => (
                            <button key={i} className="block text-teal-600 hover:text-teal-800 hover:underline">
                              {t}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button className="text-teal-600 hover:text-teal-800 hover:underline">
                          {"tenant" in item ? item.tenant : ""}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{item.expiration}</TableCell>
                    <TableCell className="font-medium text-slate-800">{item.currentRent}</TableCell>
                    <TableCell className="text-slate-500">{item.newRent}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span
                          className={`font-medium ${
                            item.status === "Eligible"
                              ? "text-emerald-600"
                              : item.status === "Pending"
                                ? "text-blue-600"
                                : item.status === "Ready to Countersign"
                                  ? "text-green-600"
                                  : item.status === "Out for Signing"
                                    ? "text-purple-600"
                                    : item.status === "Printed"
                                      ? "text-orange-600"
                                      : "text-amber-600"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.status === "Eligible" && (
                          <button
                            className="block text-teal-600 hover:text-teal-800 hover:underline text-sm"
                            onClick={() => handlePrepareRenewal(item)}
                          >
                            Prepare Renewal Offer
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleData.map((item) => {
            const statusColors: Record<string, { bg: string; text: string; border: string }> = {
              Eligible: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
              Pending: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
              "Ready to Countersign": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
              "Out for Signing": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
              Printed: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
              "Prepared not Sent": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
            }
            const colors = statusColors[item.status] || statusColors.Eligible

            return (
              <Card
                key={item.id}
                className={`border-l-4 ${colors.border} hover:shadow-lg transition-all duration-200 cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                        <Home className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight">{item.property}</h3>
                        <p className="text-xs text-slate-500">
                          {"tenants" in item && item.tenants
                            ? item.tenants.join(", ")
                            : "tenant" in item
                              ? item.tenant
                              : ""}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${colors.bg} ${colors.text} border ${colors.border} text-xs`}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-500 mb-0.5">Current Rent</p>
                      <p className="font-semibold text-teal-700">{item.currentRent}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-500 mb-0.5">New Rent</p>
                      <p className="font-semibold text-slate-600">{item.newRent}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Expires: {item.expiration}</span>
                    </div>
                    {item.status === "Eligible" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-2"
                        onClick={() => handlePrepareRenewal(item)}
                      >
                        Prepare Offer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* View More */}
      <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-lg border border-teal-100">
        <span className="text-sm text-teal-700 font-medium">
          Showing {Math.min(visibleCount, totalItems)} of {totalItems} renewals
        </span>
        {hasMoreData && (
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="min-w-[120px] border-teal-200 hover:bg-teal-50 hover:text-teal-800 bg-transparent"
          >
            {isLoadingMore ? "Loading..." : "View More"}
          </Button>
        )}
      </div>

      {/* Prepare Renewal Dialog */}
      <Dialog open={prepareRenewalDialogOpen} onOpenChange={setPrepareRenewalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Prepare Renewal Offer</DialogTitle>
            <DialogDescription>Create a renewal offer for {selectedRenewal?.property}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Rent</Label>
                <Input value={selectedRenewal?.currentRent || ""} disabled className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>
                  New Rent <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Enter new rent"
                    value={newRentAmount}
                    onChange={(e) => setNewRentAmount(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Renewal Term</Label>
              <Select value={renewalTerm} onValueChange={setRenewalTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="18">18 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tenant(s)</Label>
              <Input
                value={
                  selectedRenewal
                    ? "tenants" in selectedRenewal && selectedRenewal.tenants
                      ? selectedRenewal.tenants.join(", ")
                      : selectedRenewal.tenant || ""
                    : ""
                }
                disabled
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes for the renewal offer..."
                value={renewalNotes}
                onChange={(e) => setRenewalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrepareRenewalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRenewal} className="bg-teal-600 hover:bg-teal-700">
              Prepare Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function LeasingPage({ params, onNavigateToGuestCardDetail }: LeasingPageProps) {
  const view = (params?.view as string) || "vacancies"
  const [selectedVacancy, setSelectedVacancy] = useState<(typeof mockVacancies)[0] | null>(null)
  const [selectedGuestCard, setSelectedGuestCard] = useState<(typeof mockGuestCards)[0] | null>(null)
  const [isGuestCardSheetOpen, setIsGuestCardSheetOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<{
    application: (typeof mockRentalApplications)[0]
    applicant: (typeof mockRentalApplications)[0]["applicants"][0]
  } | null>(null)
  const [showNewApplication, setShowNewApplication] = useState(false)
  const [showFilters, setShowFilters] = useState(false) // This was the undeclared variable
  const [filters, setFilters] = useState({
    propertySearch: "",
    contactInfo: "",
    statuses: ["Approved", "Converting", "Decision Pending", "New"] as string[],
    dateFrom: "",
    dateTo: "",
  })

  const [showVacancyFilter, setShowVacancyFilter] = useState(false)
  const [vacancyFilters, setVacancyFilters] = useState({
    property: "",
    bedrooms: "",
    rentMin: "",
    rentMax: "",
    availableFrom: "",
    availableTo: "",
    catsAllowed: "",
    dogsAllowed: "",
  })

  const [vacancyPostingStatus, setVacancyPostingStatus] = useState<{
    [propertyId: number]: {
      website: boolean
      internet: boolean
      premium: boolean
      zillowSpotlight: boolean
    }
  }>(() => {
    // Initialize from mockVacancies
    const initial: { [key: number]: any } = {}
    mockVacancies.forEach((v) => {
      initial[v.id] = { ...v.postingStatus }
    })
    return initial
  })

  const handlePostWebsite = (propertyId: number) => {
    setVacancyPostingStatus((prev) => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        website: !prev[propertyId]?.website,
      },
    }))
  }

  const handlePostInternet = (propertyId: number) => {
    setVacancyPostingStatus((prev) => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        internet: !prev[propertyId]?.internet,
      },
    }))
  }

  const handleActivatePremium = (propertyId: number) => {
    setVacancyPostingStatus((prev) => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        premium: !prev[propertyId]?.premium,
      },
    }))
  }

  const handleLearnMoreZillow = (propertyId: number) => {
    // For now, toggle the status - in production this would open a modal or navigate
    setVacancyPostingStatus((prev) => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        zillowSpotlight: !prev[propertyId]?.zillowSpotlight,
      },
    }))
  }

  const handleVacancyFilterSearch = () => {
    // Apply filters logic here
    setShowVacancyFilter(false)
    setShowBoxScoreResults(true) // Show results after applying filters
  }

  const statusOptions = [
    { value: "New", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { value: "Screening", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { value: "Decision Pending", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { value: "Approved", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { value: "Converting", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
    { value: "Denied", color: "bg-red-100 text-red-700 border-red-200" },
  ]

  const toggleStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status) ? prev.statuses.filter((s) => s !== status) : [...prev.statuses, status],
    }))
  }

  const clearFilters = () => {
    setFilters({
      propertySearch: "",
      contactInfo: "",
      statuses: [],
      dateFrom: "",
      dateTo: "",
    })
  }

  const activeFilterCount = [
    filters.propertySearch,
    filters.contactInfo,
    filters.statuses.length > 0 && filters.statuses.length < statusOptions.length,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length

  const handleVacancyClick = (vacancy: (typeof mockVacancies)[0]) => {
    setSelectedVacancy(vacancy)
  }

  const handleGuestCardClick = (guestCard: (typeof mockGuestCards)[0]) => {
    if (onNavigateToGuestCardDetail) {
      onNavigateToGuestCardDetail(guestCard.id.toString())
    } else {
      setSelectedGuestCard(guestCard)
      setIsGuestCardSheetOpen(true)
    }
  }

  const handleApplicationClick = (
    application: (typeof mockRentalApplications)[0],
    applicant: (typeof mockRentalApplications)[0]["applicants"][0],
  ) => {
    setSelectedApplication({ application, applicant })
  }

  // Declare showNewGuestCard and handleSaveGuestCard here
  const [showNewGuestCard, setShowNewGuestCard] = useState(false)
  const [guestCardsViewMode, setGuestCardsViewMode] = useState<"grid" | "list">("grid") // Added state for view mode
  const [showGuestCardsFilter, setShowGuestCardsFilter] = useState(false)

  const handleNewApplicationClick = () => {
    if (view === "rental-application") {
      setShowNewApplication(true)
    } else if (view === "guest-cards") {
      setShowNewGuestCard(true)
    }
  }

  const handleSaveApplication = (data: any) => {
    console.log("New application data:", data)
    setShowNewApplication(false)
  }

  const handleSaveGuestCard = (data: any) => {
    console.log("New guest card data:", data)
    setShowNewGuestCard(false)
  }

  // Start of new state variables for Box Score
  const [fromDateOpen, setFromDateOpen] = useState(false)
  const [toDateOpen, setToDateOpen] = useState(false)
  const [showBoxScoreResults, setShowBoxScoreResults] = useState(false)
  const [expandedProperties, setExpandedProperties] = useState<string[]>([])
  const [boxScoreFilters, setBoxScoreFilters] = useState({
    property: "all",
    fromDate: new Date(),
    toDate: new Date(),
    groupBy: "unit-type",
  })

  const allBoxScoreData: Record<
    string,
    {
      id: string
      name: string
      propertyDetails?: Array<{
        // Add propertyDetails array
        unitType: string
        sqFt: number
        avgRent: number
        units: number
        occupied: number
        vacantRented: number
        vacantUnrented: number
        noticeRented: number
        noticeUnrented: number
        percentOccupied: number
      }>
      occupancies: Array<{
        unitType: string
        sqFt: number
        avgRent: number
        units: number
        occupied: number
        vacantRented: number
        vacantUnrented: number
        noticeRented: number
        noticeUnrented: number
        percentOccupied: number
      }>
      residentActivity: Array<{
        unitType: string
        moveIns: number
        moveOuts: number
        renewals: number
        monthToMonth: number
        evictions: number
      }>
      leasingActivity: Array<{
        unitType: string
        inquiries: number
        showings: number
        applied: number
        approved: number
        denied: number
        canceled: number
      }>
    }
  > = {
    sunset: {
      id: "sunset",
      name: "Sunset Apartments",
      propertyDetails: [
        // Add propertyDetails data
        {
          unitType: "1BR",
          sqFt: 750,
          avgRent: 1200.0,
          units: 10,
          occupied: 8,
          vacantRented: 1,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 80.0,
        },
        {
          unitType: "2BR",
          sqFt: 1050,
          avgRent: 1600.0,
          units: 8,
          occupied: 7,
          vacantRented: 0,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 87.5,
        },
      ],
      occupancies: [
        {
          unitType: "1BR",
          sqFt: 750,
          avgRent: 1200.0,
          units: 10,
          occupied: 8,
          vacantRented: 1,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 80.0,
        },
        {
          unitType: "2BR",
          sqFt: 1050,
          avgRent: 1600.0,
          units: 8,
          occupied: 7,
          vacantRented: 0,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 87.5,
        },
      ],
      residentActivity: [
        { unitType: "1BR", moveIns: 2, moveOuts: 1, renewals: 3, monthToMonth: 1, evictions: 0 },
        { unitType: "2BR", moveIns: 1, moveOuts: 0, renewals: 2, monthToMonth: 0, evictions: 0 },
      ],
      leasingActivity: [
        { unitType: "1BR", inquiries: 5, showings: 3, applied: 2, approved: 2, denied: 0, canceled: 0 },
        { unitType: "2BR", inquiries: 3, showings: 2, applied: 1, approved: 1, denied: 0, canceled: 0 },
      ],
    },
    oakwood: {
      id: "oakwood",
      name: "Oakwood Residence",
      propertyDetails: [
        // Add propertyDetails data
        {
          unitType: "Studio",
          sqFt: 500,
          avgRent: 900.0,
          units: 6,
          occupied: 5,
          vacantRented: 0,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 83.3,
        },
        {
          unitType: "1BR",
          sqFt: 720,
          avgRent: 1100.0,
          units: 12,
          occupied: 11,
          vacantRented: 1,
          vacantUnrented: 0,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 91.7,
        },
      ],
      occupancies: [
        {
          unitType: "Studio",
          sqFt: 500,
          avgRent: 900.0,
          units: 6,
          occupied: 5,
          vacantRented: 0,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 83.3,
        },
        {
          unitType: "1BR",
          sqFt: 720,
          avgRent: 1100.0,
          units: 12,
          occupied: 11,
          vacantRented: 1,
          vacantUnrented: 0,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 91.7,
        },
      ],
      residentActivity: [
        { unitType: "Studio", moveIns: 1, moveOuts: 1, renewals: 2, monthToMonth: 0, evictions: 0 },
        { unitType: "1BR", moveIns: 2, moveOuts: 0, renewals: 4, monthToMonth: 1, evictions: 0 },
      ],
      leasingActivity: [
        { unitType: "Studio", inquiries: 4, showings: 2, applied: 1, approved: 1, denied: 0, canceled: 0 },
        { unitType: "1BR", inquiries: 6, showings: 4, applied: 3, approved: 2, denied: 1, canceled: 0 },
      ],
    },
    pine: {
      id: "pine",
      name: "Pine Street Homes",
      propertyDetails: [
        // Add propertyDetails data
        {
          unitType: "2BR",
          sqFt: 1100,
          avgRent: 1800.0,
          units: 5,
          occupied: 4,
          vacantRented: 0,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 80.0,
        },
        {
          unitType: "3BR",
          sqFt: 1400,
          avgRent: 2200.0,
          units: 4,
          occupied: 4,
          vacantRented: 0,
          vacantUnrented: 0,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 100.0,
        },
      ],
      occupancies: [
        {
          unitType: "2BR",
          sqFt: 1100,
          avgRent: 1800.0,
          units: 5,
          occupied: 4,
          vacantRented: 0,
          vacantUnrented: 1,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 80.0,
        },
        {
          unitType: "3BR",
          sqFt: 1400,
          avgRent: 2200.0,
          units: 4,
          occupied: 4,
          vacantRented: 0,
          vacantUnrented: 0,
          noticeRented: 0,
          noticeUnrented: 0,
          percentOccupied: 100.0,
        },
      ],
      residentActivity: [
        { unitType: "2BR", moveIns: 1, moveOuts: 0, renewals: 1, monthToMonth: 0, evictions: 0 },
        { unitType: "3BR", moveIns: 0, moveOuts: 0, renewals: 2, monthToMonth: 0, evictions: 0 },
      ],
      leasingActivity: [
        { unitType: "2BR", inquiries: 2, showings: 1, applied: 1, approved: 0, denied: 0, canceled: 1 },
        { unitType: "3BR", inquiries: 1, showings: 1, applied: 0, approved: 0, denied: 0, canceled: 0 },
      ],
    },
    maple: {
      id: "maple",
      name: "Maple Gardens",
      propertyDetails: [
        // Add propertyDetails data
        {
          unitType: "No Unit Type",
          sqFt: 1277,
          avgRent: 0.0,
          units: 1,
          occupied: 0,
          vacantRented: 0,
          vacantUnrented: 0,
          noticeRented: 1,
          noticeUnrented: 0,
          percentOccupied: 0.0,
        },
      ],
      occupancies: [
        {
          unitType: "No Unit Type",
          sqFt: 1277,
          avgRent: 0.0,
          units: 1,
          occupied: 0,
          vacantRented: 0,
          vacantUnrented: 0,
          noticeRented: 1,
          noticeUnrented: 0,
          percentOccupied: 0.0,
        },
      ],
      residentActivity: [
        { unitType: "No Unit Type", moveIns: 0, moveOuts: 0, renewals: 0, monthToMonth: 0, evictions: 0 },
      ],
      leasingActivity: [
        { unitType: "No Unit Type", inquiries: 0, showings: 0, applied: 0, approved: 0, denied: 0, canceled: 0 },
      ],
    },
  }

  // Mock properties for dropdown
  const mockProperties = [
    { id: "all", name: "All Properties" },
    { id: "sunset", name: "Sunset Apartments" },
    { id: "oakwood", name: "Oakwood Residence" },
    { id: "pine", name: "Pine Street Homes" },
    { id: "maple", name: "Maple Gardens" },
  ]

  const getFilteredBoxScoreResults = () => {
    if (boxScoreFilters.property === "all") {
      return Object.values(allBoxScoreData)
    }
    const selectedData = allBoxScoreData[boxScoreFilters.property]
    return selectedData ? [selectedData] : []
  }

  const handleBoxScoreSearch = () => {
    console.log("Searching with filters:", boxScoreFilters)
    if (boxScoreFilters.property === "all") {
      setExpandedProperties(Object.keys(allBoxScoreData))
    } else {
      setExpandedProperties([boxScoreFilters.property])
    }
    setShowBoxScoreResults(true)
  }

  const togglePropertyExpanded = (propertyId: string) => {
    setExpandedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    )
  }

  const calculateOccupancyTotals = (occupancies: (typeof allBoxScoreData)["sunset"]["occupancies"]) => {
    return occupancies.reduce(
      (acc, row) => ({
        sqFt: acc.sqFt + row.sqFt,
        avgRent: acc.avgRent + row.avgRent,
        units: acc.units + row.units,
        occupied: acc.occupied + row.occupied,
        vacantRented: acc.vacantRented + row.vacantRented,
        vacantUnrented: acc.vacantUnrented + row.vacantUnrented,
        noticeRented: acc.noticeRented + row.noticeRented,
        noticeUnrented: acc.noticeUnrented + row.noticeUnrented,
        percentOccupied: acc.percentOccupied + row.percentOccupied,
      }),
      {
        sqFt: 0,
        avgRent: 0,
        units: 0,
        occupied: 0,
        vacantRented: 0,
        vacantUnrented: 0,
        noticeRented: 0,
        noticeUnrented: 0,
        percentOccupied: 0,
      },
    )
  }

  const calculateResidentTotals = (activity: (typeof allBoxScoreData)["sunset"]["residentActivity"]) => {
    return activity.reduce(
      (acc, row) => ({
        moveIns: acc.moveIns + row.moveIns,
        moveOuts: acc.moveOuts + row.moveOuts,
        renewals: acc.renewals + row.renewals,
        monthToMonth: acc.monthToMonth + row.monthToMonth,
        evictions: acc.evictions + row.evictions,
      }),
      { moveIns: 0, moveOuts: 0, renewals: 0, monthToMonth: 0, evictions: 0 },
    )
  }

  const calculateLeasingTotals = (activity: (typeof allBoxScoreData)["sunset"]["leasingActivity"]) => {
    return activity.reduce(
      (acc, row) => ({
        inquiries: acc.inquiries + row.inquiries,
        showings: acc.showings + row.showings,
        applied: acc.applied + row.applied,
        approved: acc.approved + row.approved,
        denied: acc.denied + row.denied,
        canceled: acc.canceled + row.canceled,
      }),
      { inquiries: 0, showings: 0, applied: 0, approved: 0, denied: 0, canceled: 0 },
    )
  }

  return (
    <div className="space-y-6">
      {view === "guest-cards" && showNewGuestCard ? (
        <NewGuestCard onBack={() => setShowNewGuestCard(false)} onSave={handleSaveGuestCard} />
      ) : view === "rental-application" && showNewApplication ? (
        <NewRentalApplication onBack={() => setShowNewApplication(false)} onSave={handleSaveApplication} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Leasing</h1>
              <p className="text-muted-foreground capitalize font-semibold">{view.replace("-", " ")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleNewApplicationClick}>
                <Plus className="h-4 w-4 mr-2" />
                New{" "}
                {view === "vacancies"
                  ? "Vacancy"
                  : view === "guest-cards"
                    ? "Guest Card"
                    : view === "rental-application"
                      ? "Application"
                      : "Lease"}
              </Button>
            </div>
          </div>

          {view === "metrics" && (
            <>
              <Card className="border-l-4 border-l-primary shadow-sm bg-gradient-to-r from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Box Score Summary
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Apply filters and search to retrieve data for the Box Score Summary.
                  </p>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {/* Property/Property Group Select */}
                    <div className="flex items-center gap-4">
                      <Label className="w-64 text-right text-sm font-medium">
                        Search by property or property group
                      </Label>
                      <Select
                        value={boxScoreFilters.property}
                        onValueChange={(value) => setBoxScoreFilters({ ...boxScoreFilters, property: value })}
                      >
                        <SelectTrigger className="w-80 border-primary/30 focus:ring-primary">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProperties.map((prop) => (
                            <SelectItem key={prop.id} value={prop.id}>
                              {prop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* From Date */}
                    <div className="flex items-center gap-4">
                      <Label className="w-64 text-right text-sm font-medium">
                        From <span className="text-destructive">*</span>
                      </Label>
                      <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-48 justify-start text-left font-normal border-primary/30 hover:bg-primary/5 bg-transparent"
                          >
                            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                            {format(boxScoreFilters.fromDate, "MM/dd/yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={boxScoreFilters.fromDate}
                            onSelect={(date) => {
                              if (date) {
                                setBoxScoreFilters({ ...boxScoreFilters, fromDate: date })
                                setFromDateOpen(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* To Date */}
                    <div className="flex items-center gap-4">
                      <Label className="w-64 text-right text-sm font-medium">
                        To <span className="text-destructive">*</span>
                      </Label>
                      <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-48 justify-start text-left font-normal border-primary/30 hover:bg-primary/5 bg-transparent"
                          >
                            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                            {format(boxScoreFilters.toDate, "MM/dd/yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={boxScoreFilters.toDate}
                            onSelect={(date) => {
                              if (date) {
                                setBoxScoreFilters({ ...boxScoreFilters, toDate: date })
                                setToDateOpen(false)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Group By */}
                    <div className="flex items-center gap-4">
                      <Label className="w-64 text-right text-sm font-medium">
                        Group By <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={boxScoreFilters.groupBy}
                        onValueChange={(value) => setBoxScoreFilters({ ...boxScoreFilters, groupBy: value })}
                      >
                        <SelectTrigger className="w-48 border-primary/30 focus:ring-primary">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit-type">Unit Type</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                          <SelectItem value="building">Building</SelectItem>
                          <SelectItem value="floor">Floor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={handleBoxScoreSearch}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Box Score Results Section */}
              {showBoxScoreResults && (
                <div className="space-y-4">
                  {getFilteredBoxScoreResults().map((property) => {
                    const isExpanded = expandedProperties.includes(property.id)
                    const occupancyTotals = calculateOccupancyTotals(property.occupancies)
                    const residentTotals = calculateResidentTotals(property.residentActivity)
                    const leasingTotals = calculateLeasingTotals(property.leasingActivity)

                    return (
                      <Card key={property.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="py-3 bg-gradient-to-r from-muted/50 to-transparent border-b">
                          <button
                            onClick={() => togglePropertyExpanded(property.id)}
                            className="flex items-center gap-2 text-left w-full group"
                          >
                            <div className="p-1 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-primary" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {property.name}
                            </CardTitle>
                          </button>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="space-y-6 pt-6">
                            {/* Property Details Table */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="font-semibold text-base text-[rgba(19,22,28,1)]">Property Details</h3>
                                <HelpCircle className="h-4 w-4 text-primary/60 hover:text-primary cursor-help" />
                              </div>
                              <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-primary hover:bg-primary">
                                      <TableHead className="font-semibold text-primary-foreground">Unit Type</TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Sq. Ft. <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Avg. Rent <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Units <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Occupied <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Vacant Rented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Vacant Unrented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Notice Rented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Notice Unrented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          % Occupied <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {property.propertyDetails?.map(
                                      (
                                        row,
                                        idx, // Use propertyDetails here
                                      ) => (
                                        <TableRow key={idx} className="hover:bg-muted/30">
                                          <TableCell className="font-medium">{row.unitType}</TableCell>
                                          <TableCell className="text-center">{row.sqFt.toLocaleString()}</TableCell>
                                          <TableCell className="text-center text-primary">
                                            {row.avgRent.toFixed(2)}
                                          </TableCell>
                                          <TableCell className="text-center">{row.units}</TableCell>
                                          <TableCell className="text-center">{row.occupied}</TableCell>
                                          <TableCell className="text-center">{row.vacantRented}</TableCell>
                                          <TableCell className="text-center">{row.vacantUnrented}</TableCell>
                                          <TableCell className="text-center text-primary font-medium">
                                            {row.noticeRented}
                                          </TableCell>
                                          <TableCell className="text-center">{row.noticeUnrented}</TableCell>
                                          <TableCell className="text-center">
                                            {row.percentOccupied.toFixed(1)}%
                                          </TableCell>
                                        </TableRow>
                                      ),
                                    )}
                                    <TableRow className="font-semibold bg-primary/5 border-t-2 border-primary/20">
                                      <TableCell className="font-bold">Total</TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.sqFt.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-center font-bold text-primary">
                                        {occupancyTotals.avgRent.toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">{occupancyTotals.units}</TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.occupied}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.vacantRented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.vacantUnrented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold text-primary">
                                        {occupancyTotals.noticeRented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.noticeUnrented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.percentOccupied.toFixed(1)}%
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Occupancies Table */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="font-semibold text-base text-[rgba(19,22,28,1)]">Occupancies</h3>
                                <HelpCircle className="h-4 w-4 text-primary/60 hover:text-primary cursor-help" />
                              </div>
                              <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-primary hover:bg-primary">
                                      <TableHead className="font-semibold text-primary-foreground">Unit Type</TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Sq. Ft. <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Avg. Rent <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Units <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Occupied <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Vacant Rented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Vacant Unrented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Notice Rented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          Notice Unrented <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="font-semibold text-center text-primary-foreground">
                                        <div className="flex items-center justify-center gap-1">
                                          % Occupied <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {property.occupancies.map((row, idx) => (
                                      <TableRow key={idx} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">{row.unitType}</TableCell>
                                        <TableCell className="text-center">{row.sqFt.toLocaleString()}</TableCell>
                                        <TableCell className="text-center text-primary">
                                          {row.avgRent.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-center">{row.units}</TableCell>
                                        <TableCell className="text-center">{row.occupied}</TableCell>
                                        <TableCell className="text-center">{row.vacantRented}</TableCell>
                                        <TableCell className="text-center">{row.vacantUnrented}</TableCell>
                                        <TableCell className="text-center text-primary font-medium">
                                          {row.noticeRented}
                                        </TableCell>
                                        <TableCell className="text-center">{row.noticeUnrented}</TableCell>
                                        <TableCell className="text-center">{row.percentOccupied.toFixed(1)}%</TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="font-semibold bg-primary/5 border-t-2 border-primary/20">
                                      <TableCell className="font-bold">Total</TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.sqFt.toLocaleString()}
                                      </TableCell>
                                      <TableCell className="text-center font-bold text-primary">
                                        {occupancyTotals.avgRent.toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">{occupancyTotals.units}</TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.occupied}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.vacantRented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.vacantUnrented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold text-primary">
                                        {occupancyTotals.noticeRented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.noticeUnrented}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {occupancyTotals.percentOccupied.toFixed(1)}%
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Resident Activity Table */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-foreground font-semibold text-base">Resident Activity</h3>
                                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                              </div>
                              <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-primary hover:bg-primary">
                                      <TableHead className="text-primary-foreground font-semibold">Unit Type</TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Move Ins <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Move Outs <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Renewals <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Month to Month <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Evictions <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {property.residentActivity.map((row, idx) => (
                                      <TableRow key={idx} className="hover:bg-muted/30">
                                        <TableCell className="font-medium text-foreground">{row.unitType}</TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.moveIns}
                                        </TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.moveOuts}
                                        </TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.renewals}
                                        </TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.monthToMonth}
                                        </TableCell>
                                        <TableCell className="text-center text-destructive font-medium">
                                          {row.evictions}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="font-semibold bg-muted/30 border-t-2 border-primary/20">
                                      <TableCell className="font-bold">Total</TableCell>
                                      <TableCell className="text-center font-bold">{residentTotals.moveIns}</TableCell>
                                      <TableCell className="text-center font-bold">{residentTotals.moveOuts}</TableCell>
                                      <TableCell className="text-center font-bold">{residentTotals.renewals}</TableCell>
                                      <TableCell className="text-center font-bold">
                                        {residentTotals.monthToMonth}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">
                                        {residentTotals.evictions}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Leasing Activity Table */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-foreground font-semibold text-base">Leasing Activity</h3>
                                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                              </div>
                              <div className="border rounded-lg overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-primary hover:bg-primary">
                                      <TableHead className="text-primary-foreground font-semibold">Unit Type</TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Inquiries <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Showings <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Applied <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Approved <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Denied <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                      <TableHead className="text-primary-foreground font-semibold text-center">
                                        <div className="flex items-center justify-center gap-1">
                                          Canceled <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {property.leasingActivity.map((row, idx) => (
                                      <TableRow key={idx} className="hover:bg-muted/30">
                                        <TableCell className="font-medium text-foreground">{row.unitType}</TableCell>
                                        <TableCell className="text-center">{row.inquiries}</TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.showings}
                                        </TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.applied}
                                        </TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.approved}
                                        </TableCell>
                                        <TableCell className="text-center text-destructive font-medium">
                                          {row.denied}
                                        </TableCell>
                                        <TableCell className="text-center text-teal-600 font-medium">
                                          {row.canceled}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="font-semibold bg-muted/30 border-t-2 border-primary/20">
                                      <TableCell className="font-bold">Total</TableCell>
                                      <TableCell className="text-center font-bold">{leasingTotals.inquiries}</TableCell>
                                      <TableCell className="text-center font-bold text-[rgba(10,10,10,1)]">
                                        {leasingTotals.showings}
                                      </TableCell>
                                      <TableCell className="text-center font-bold">{leasingTotals.applied}</TableCell>
                                      <TableCell className="text-center font-bold">{leasingTotals.approved}</TableCell>
                                      <TableCell className="text-center font-bold">{leasingTotals.denied}</TableCell>
                                      <TableCell className="text-center font-bold">{leasingTotals.canceled}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {view === "vacancies" && (
            <>
              {selectedVacancy ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl">{selectedVacancy.name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedVacancy.address}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedVacancy(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Property Details Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Unit Type</p>
                        <p className="text-lg font-semibold">{selectedVacancy.type}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Square Footage</p>
                        <p className="text-lg font-semibold">{selectedVacancy.sqft} sq ft</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Monthly Rent</p>
                        <p className="text-lg font-semibold text-green-600">${selectedVacancy.rent}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Available Date</p>
                        <p className="text-lg font-semibold">{selectedVacancy.available}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge
                          variant={selectedVacancy.status === "Ready" ? "default" : "secondary"}
                          className={selectedVacancy.status === "Ready" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {selectedVacancy.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Property</p>
                        <p className="text-lg font-semibold">{selectedVacancy.property}</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedVacancy.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Last Tenant Info */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Last Tenant</p>
                      <p className="text-base">{selectedVacancy.lastTenant}</p>
                    </div>

                    {/* Automations */}
                    {selectedVacancy.automations && selectedVacancy.automations.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Zap className="h-4 w-4 text-orange-500" /> Automations
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedVacancy.automations.map((automation) => (
                            <div
                              key={automation.id}
                              className="flex items-center justify-between p-2 border rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    automation.status === "active"
                                      ? "border-green-300 text-green-700 bg-green-50"
                                      : "border-gray-300 text-gray-600 bg-gray-50"
                                  }`}
                                >
                                  {automation.status === "active" ? "Active" : "Paused"}
                                </Badge>
                                <span className="text-sm font-medium">{automation.name}</span>
                              </div>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button>Schedule Showing</Button>
                      <Button variant="outline">Create Guest Card</Button>
                      <Button variant="outline">Edit Property</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">Leasing Overview</h2>
                      <p className="text-sm text-muted-foreground">Key metrics for your leasing pipeline</p>
                    </div>
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                      {/* Total Units on Market */}
                      <div className="rounded-lg bg-blue-500 p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 opacity-90" />
                          <span className="text-xs font-medium opacity-90">On Market</span>
                        </div>
                        <p className="text-2xl font-bold">12</p>
                      </div>

                      {/* Total Number of Prospects/Guest Cards */}
                      <div className="rounded-lg bg-purple-500 p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 opacity-90" />
                          <span className="text-xs font-medium opacity-90">Prospects</span>
                        </div>
                        <p className="text-2xl font-bold">45</p>
                      </div>

                      {/* Units Scheduled for Showings */}
                      <div className="rounded-lg bg-orange-500 p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 opacity-90" />
                          <span className="text-xs font-medium opacity-90">Showings</span>
                        </div>
                        <p className="text-2xl font-bold">8</p>
                      </div>

                      {/* Total Number of Applications */}
                      <div className="rounded-lg bg-cyan-500 p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 opacity-90" />
                          <span className="text-xs font-medium opacity-90">Applications</span>
                        </div>
                        <p className="text-2xl font-bold">23</p>
                      </div>

                      {/* Total Number of Leases Sent for Signatures */}
                      <div className="rounded-lg bg-indigo-500 p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Send className="h-4 w-4 opacity-90" />
                          <span className="text-xs font-medium opacity-90">Sent for Signing</span>
                        </div>
                        <p className="text-2xl font-bold">7</p>
                      </div>

                      {/* Signed Leases */}
                      <div className="rounded-lg bg-green-500 p-3 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 opacity-90" />
                          <span className="text-xs font-medium opacity-90">Signed</span>
                        </div>
                        <p className="text-2xl font-bold">5</p>
                      </div>
                    </div>
                  </div>
                  {/* End Leasing Overview section */}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search properties..." className="pl-9" />
                    </div>
                    <Button variant="outline" onClick={() => setShowVacancyFilter(true)}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {Object.values(vacancyFilters).filter(Boolean).length > 0 && (
                        <Badge className="ml-2 bg-teal-500 text-white text-xs px-1.5 py-0">
                          {Object.values(vacancyFilters).filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {mockVacancies.map((property) => (
                      <Card
                        key={property.id}
                        className="overflow-hidden border-muted hover:border-primary/50 transition-all duration-200 hover:shadow-lg group bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Left Section - Property Name & Address */}
                          <div className="flex-1 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-teal-200 bg-teal-100/60">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1.5">
                                <button
                                  onClick={() => handleVacancyClick(property)}
                                  className="text-left font-semibold text-lg leading-tight text-teal-800 group-hover:text-teal-600 transition-colors"
                                >
                                  {property.name}
                                </button>
                                <p className="text-xs text-teal-600/80 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {property.address}
                                </p>
                              </div>
                              <Badge
                                variant={property.status === "Ready" ? "default" : "secondary"}
                                className={
                                  property.status === "Ready"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-amber-500 text-white"
                                }
                              >
                                {property.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Middle Section - Property Details */}
                          <div className="flex-1 p-4 lg:p-5 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-6 w-full">
                              <div className="flex items-center gap-2">
                                <Home className="h-4 w-4 text-teal-500" />
                                <span className="text-sm text-slate-700">{property.type}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Ruler className="h-4 w-4 text-teal-500" />
                                <span className="text-sm text-slate-700">{property.sqft} sq ft</span>
                              </div>
                              <div className="border-l border-teal-200 pl-6">
                                <p className="text-xs text-teal-600">Monthly Rent</p>
                                <p className="text-xl font-bold text-emerald-600">${property.rent}</p>
                              </div>
                              <div className="border-l border-teal-200 pl-6">
                                <p className="text-xs text-teal-600">Available</p>
                                <p className="text-sm font-medium text-slate-700">{property.available}</p>
                              </div>
                            </div>

                            {property.automations && property.automations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-teal-200/50">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="flex items-center gap-1.5 text-xs text-teal-600 font-medium">
                                    <Zap className="h-3.5 w-3.5" />
                                    <span>Automations:</span>
                                  </div>
                                  {property.automations.map((automation) => (
                                    <Badge
                                      key={automation.id}
                                      variant="outline"
                                      className={`text-xs font-normal ${
                                        automation.status === "active"
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                      }`}
                                    >
                                      <span
                                        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                                          automation.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                                        }`}
                                      />
                                      {automation.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Show "No automations" if empty */}
                            {(!property.automations || property.automations.length === 0) && (
                              <div className="mt-3 pt-3 border-t border-teal-200/50">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Zap className="h-3.5 w-3.5" />
                                    <span>No automations running</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Section - Posting Status */}
                          <div className="p-0 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col min-w-[280px]">
                            {/* Header - Blue for "Created On" or Red for "Vacant For" */}
                            <div
                              className={`px-4 py-2 text-center text-white text-sm font-medium ${
                                property.vacantType === "created" ? "bg-[#1a73a7]" : "bg-[#c62828]"
                              }`}
                            >
                              {property.vacantType === "created"
                                ? `Created On: ${property.createdOn}`
                                : `Vacant For: ${property.vacantDays} days`}
                            </div>

                            {/* Posting Status Table */}
                            <div className="bg-white flex-1">
                              {/* Common option for both types */}
                              <div className="flex justify-end px-4 py-1.5 border-b border-gray-200">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <span className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                      Actions <MoreHorizontal className="h-3 w-3" />
                                    </span>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Download className="h-4 w-4 mr-2" />
                                      Download Marketing Flyer
                                    </DropdownMenuItem>

                                    {/* Blue ribbon (Created On) - show End Marketing Campaign */}
                                    {property.vacantType === "created" && (
                                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        End Marketing Campaign
                                      </DropdownMenuItem>
                                    )}

                                    {/* Red ribbon (Vacant For) - show Post Vacancy and Remove options */}
                                    {property.vacantType === "vacant" && (
                                      <>
                                        <DropdownMenuItem className="cursor-pointer">
                                          <Megaphone className="h-4 w-4 mr-2" />
                                          Post Vacancy Manually
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Remove from Vacancies List
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              {/* Status Rows */}
                              <div className="text-xs divide-y divide-gray-200">
                                <div className="flex items-center justify-between px-4 py-2">
                                  <span className="text-gray-700 font-medium">Website</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-500 min-w-[70px] text-right">
                                      {vacancyPostingStatus[property.id]?.website ? "Posted" : "Not Posted"}
                                    </span>
                                    <Button
                                      size="sm"
                                      className="h-6 px-4 text-xs bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1] transition-colors"
                                      onClick={() => handlePostWebsite(property.id)}
                                    >
                                      {vacancyPostingStatus[property.id]?.website ? "Unpost" : "Post"}
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-2">
                                  <span className="text-gray-700 font-medium">Internet</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-500 min-w-[70px] text-right">
                                      {vacancyPostingStatus[property.id]?.internet ? "Posted" : "Not Posted"}
                                    </span>
                                    <Button
                                      size="sm"
                                      className="h-6 px-4 text-xs bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1] transition-colors"
                                      onClick={() => handlePostInternet(property.id)}
                                    >
                                      {vacancyPostingStatus[property.id]?.internet ? "Unpost" : "Post"}
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between px-4 py-2">
                                  <span className="text-gray-700 font-medium">Premium</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-500 min-w-[70px] text-right">
                                      {vacancyPostingStatus[property.id]?.premium ? "On" : "Off"}
                                    </span>
                                    <Button
                                      size="sm"
                                      className="h-6 px-4 text-xs bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1] transition-colors"
                                      onClick={() => handleActivatePremium(property.id)}
                                    >
                                      {vacancyPostingStatus[property.id]?.premium ? "Deactivate" : "Activate"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Vacancy Filter Dialog - Complete redesign with better styling and subtle gradient background */}
          <Dialog open={showVacancyFilter} onOpenChange={setShowVacancyFilter}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-0 shadow-2xl">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-primary via-cyan-500 to-blue-500 p-6 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Filter className="h-5 w-5" />
                    </div>
                    Filter Vacancies
                  </DialogTitle>
                  <p className="text-sm mt-1 text-muted">Find the perfect property with the options below</p>
                </DialogHeader>
              </div>

              <div className="p-6 bg-gradient-to-br from-slate-50 to-primary/10">
                <div className="space-y-5">
                  {/* Property & Bedrooms Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Properties Card */}
                    <div className="bg-white rounded-xl p-4 border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Building className="h-4 w-4 text-primary" />
                        </div>
                        <Label className="font-semibold text-slate-700">Properties</Label>
                      </div>
                      <Select
                        value={vacancyFilters.property}
                        onValueChange={(value) => setVacancyFilters((prev) => ({ ...prev, property: value }))}
                      >
                        <SelectTrigger className="bg-primary/5 border-primary/20 focus:ring-primary">
                          <SelectValue placeholder="Select property..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          <SelectItem value="sunset">Sunset Apartments</SelectItem>
                          <SelectItem value="oakwood">Oakwood Residence</SelectItem>
                          <SelectItem value="pine">Pine Street Homes</SelectItem>
                          <SelectItem value="harbor">Harbor View</SelectItem>
                          <SelectItem value="metro">Metro Plaza</SelectItem>
                          <SelectItem value="riverside">Riverside Apartments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bedrooms Card */}
                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Bed className="h-4 w-4 text-blue-600" />
                        </div>
                        <Label className="font-semibold text-slate-700">Bedrooms</Label>
                      </div>
                      <Select
                        value={vacancyFilters.bedrooms}
                        onValueChange={(value) => setVacancyFilters((prev) => ({ ...prev, bedrooms: value }))}
                      >
                        <SelectTrigger className="bg-blue-50/50 border-blue-200 focus:ring-blue-500">
                          <SelectValue placeholder="Number of bedrooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="1">1 Bedroom</SelectItem>
                          <SelectItem value="2">2 Bedrooms</SelectItem>
                          <SelectItem value="3">3 Bedrooms</SelectItem>
                          <SelectItem value="4">4+ Bedrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Rent Range Card */}
                  <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <Label className="font-semibold text-slate-700">Rent Range</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center flex-1 rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50/50">
                        <span className="px-3 py-2 bg-emerald-100 text-emerald-700 font-medium">$</span>
                        <Input
                          type="number"
                          placeholder="Minimum"
                          value={vacancyFilters.rentMin}
                          onChange={(e) => setVacancyFilters((prev) => ({ ...prev, rentMin: e.target.value }))}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100">
                        <ArrowRight className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex items-center flex-1 rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50/50">
                        <span className="px-3 py-2 bg-emerald-100 text-emerald-700 font-medium">$</span>
                        <Input
                          type="number"
                          placeholder="Maximum"
                          value={vacancyFilters.rentMax}
                          onChange={(e) => setVacancyFilters((prev) => ({ ...prev, rentMax: e.target.value }))}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Availability Date Range Card */}
                  <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <Label className="font-semibold text-slate-700">Availability Period</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1.5">From</p>
                        <Input
                          type="date"
                          value={vacancyFilters.availableFrom}
                          onChange={(e) => setVacancyFilters((prev) => ({ ...prev, availableFrom: e.target.value }))}
                          className="bg-purple-50/50 border-purple-200 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mt-5">
                        <ArrowRight className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-1.5">To</p>
                        <Input
                          type="date"
                          value={vacancyFilters.availableTo}
                          onChange={(e) => setVacancyFilters((prev) => ({ ...prev, availableTo: e.target.value }))}
                          className="bg-purple-50/50 border-purple-200 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pet Policy Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cats Card */}
                    <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-amber-100 rounded-lg">
                          <Cat className="h-4 w-4 text-amber-600" />
                        </div>
                        <Label className="font-semibold text-slate-700">Cats Allowed</Label>
                      </div>
                      <Select
                        value={vacancyFilters.catsAllowed}
                        onValueChange={(value) => setVacancyFilters((prev) => ({ ...prev, catsAllowed: value }))}
                      >
                        <SelectTrigger className="bg-amber-50/50 border-amber-200 focus:ring-amber-500">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dogs Card */}
                    <div className="bg-white rounded-xl p-4 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                          <Dog className="h-4 w-4 text-orange-600" />
                        </div>
                        <Label className="font-semibold text-slate-700">Dogs Allowed</Label>
                      </div>
                      <Select
                        value={vacancyFilters.dogsAllowed}
                        onValueChange={(value) => setVacancyFilters((prev) => ({ ...prev, dogsAllowed: value }))}
                      >
                        <SelectTrigger className="bg-orange-50/50 border-orange-200 focus:ring-orange-500">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setVacancyFilters({
                        property: "",
                        bedrooms: "",
                        rentMin: "",
                        rentMax: "",
                        availableFrom: "",
                        availableTo: "",
                        catsAllowed: "",
                        dogsAllowed: "",
                      })
                    }}
                    className="px-6 border-slate-300 hover:bg-slate-100"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleVacancyFilterSearch}
                    className="px-8 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Vacancies
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {view === "guest-cards" && (
            <>
              {/* This is where the GuestCardsFilterDialog will be used */}
              {/* <GuestCardsFilterDialog onClose={() => setShowGuestCardsFilter(false)} /> */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search guest cards..." className="pl-9" />
                </div>
                <div className="flex gap-2">
                  <div className="flex border rounded-md">
                    <Button
                      variant={guestCardsViewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setGuestCardsViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={guestCardsViewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setGuestCardsViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setShowGuestCardsFilter(true)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <GuestCardsFilterDialog open={showGuestCardsFilter} onOpenChange={setShowGuestCardsFilter} />

              {guestCardsViewMode === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mockGuestCards.map((guestCard) => (
                    <Card
                      key={guestCard.id}
                      className="bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 border-teal-200 hover:border-teal-400 transition-all duration-200 hover:shadow-lg cursor-pointer"
                      onClick={() => handleGuestCardClick(guestCard)}
                    >
                      <CardHeader className="pb-3 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-t-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-teal-300">
                              <AvatarImage src={guestCard.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-teal-100 text-teal-700">
                                {guestCard.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base text-teal-900">{guestCard.name}</CardTitle>
                              <p className="text-xs text-[rgba(0,0,0,1)]">{guestCard.source}</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              guestCard.status === "Active"
                                ? "default"
                                : guestCard.status === "Pre-Qualified"
                                  ? "secondary"
                                  : guestCard.status === "Tour Scheduled"
                                    ? "outline"
                                    : "outline"
                            }
                            className={
                              guestCard.status === "Active"
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : guestCard.status === "Pre-Qualified"
                                  ? "bg-purple-100 text-purple-700 border-purple-300"
                                  : guestCard.status === "Tour Scheduled"
                                    ? "bg-blue-100 border-blue-400 text-blue-700"
                                    : "bg-gray-100 text-gray-600 border-gray-300"
                            }
                          >
                            {guestCard.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-3">
                        <div className="grid grid-cols-2 gap-2 text-sm text-[rgba(0,0,0,1)]">
                          <div className="flex items-center gap-2 text-teal-700">
                            <DollarSign className="h-3 w-3 text-teal-500" />
                            <span>{guestCard.budget}</span>
                          </div>
                          <div className="flex items-center gap-2 text-teal-700">
                            <Home className="h-3 w-3 text-teal-500" />
                            <span>{guestCard.preferences}</span>
                          </div>
                          <div className="flex items-center gap-2 text-teal-700">
                            <Calendar className="h-3 w-3 text-teal-500" />
                            <span>{guestCard.moveInDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-teal-700">
                            <User className="h-3 w-3 text-teal-500" />
                            <span>{guestCard.assignedTo}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-teal-200">
                          <p className="text-xs text-muted-foreground">Last Contact: {guestCard.lastContact}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-teal-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Preferences</TableHead>
                        <TableHead>Move-In Date</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockGuestCards.map((guestCard) => (
                        <TableRow
                          key={guestCard.id}
                          className="cursor-pointer hover:bg-teal-50/50"
                          onClick={() => handleGuestCardClick(guestCard)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={guestCard.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                                  {guestCard.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{guestCard.name}</div>
                                <div className="text-xs text-muted-foreground">{guestCard.source}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                guestCard.status === "Active"
                                  ? "default"
                                  : guestCard.status === "Pre-Qualified"
                                    ? "secondary"
                                    : guestCard.status === "Tour Scheduled"
                                      ? "outline"
                                      : "outline"
                              }
                              className={
                                guestCard.status === "Active"
                                  ? "bg-emerald-500 hover:bg-emerald-600"
                                  : guestCard.status === "Pre-Qualified"
                                    ? "bg-purple-100 text-purple-700 border-purple-300"
                                    : guestCard.status === "Tour Scheduled"
                                      ? "bg-blue-100 border-blue-400 text-blue-700"
                                      : "bg-gray-100 text-gray-600 border-gray-300"
                              }
                            >
                              {guestCard.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{guestCard.budget}</TableCell>
                          <TableCell>{guestCard.preferences}</TableCell>
                          <TableCell>{guestCard.moveInDate}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{guestCard.lastContact}</span>
                          </TableCell>
                          <TableCell>{guestCard.assignedTo}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleGuestCardClick(guestCard)
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}

          {view === "rental-application" && (
            <>
              {selectedApplication ? (
                <RentalApplicationDetail
                  application={selectedApplication.application}
                  applicant={selectedApplication.applicant}
                  onBack={() => setSelectedApplication(null)}
                />
              ) : (
                <>
                  {/* Search Bar with Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search applications..." className="pl-9" />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className={showFilters ? "bg-teal-50 border-teal-200 text-teal-700" : ""}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {activeFilterCount > 0 && (
                        <Badge className="ml-2 bg-teal-500 text-white text-xs px-1.5 py-0">{activeFilterCount}</Badge>
                      )}
                    </Button>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <Card className="border-teal-100 bg-gradient-to-r from-teal-50/50 to-cyan-50/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-teal-900">
                            Filter applications by using any of the search filters below:
                          </h4>
                          {activeFilterCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearFilters}
                              className="text-teal-600 hover:text-teal-700"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Properties, Units or Campaigns */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Properties, Units or Campaigns</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                              <Input
                                placeholder="Search by unit, property, group, campaign or portfolio"
                                value={filters.propertySearch}
                                onChange={(e) => setFilters({ ...filters, propertySearch: e.target.value })}
                                className="pl-9 bg-white border-blue-100 focus:border-blue-300"
                              />
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Contact Info</Label>
                            <Select
                              value={filters.contactInfo}
                              onValueChange={(value) => setFilters({ ...filters, contactInfo: value })}
                            >
                              <SelectTrigger className="bg-white border-violet-100 focus:border-violet-300">
                                <SelectValue placeholder="Search by name, email address, or phone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Contacts</SelectItem>
                                <SelectItem value="john">Diana Prince</SelectItem>
                                <SelectItem value="sarah">Sarah Miller</SelectItem>
                                <SelectItem value="mike">Mike Ross</SelectItem>
                                <SelectItem value="emily">Emily Chen</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Status */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Status</Label>
                            <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-md border border-emerald-100 min-h-[38px]">
                              {statusOptions.map((status) => (
                                <Badge
                                  key={status.value}
                                  variant="outline"
                                  className={`cursor-pointer transition-all text-xs ${
                                    filters.statuses.includes(status.value)
                                      ? status.color
                                      : "hover:bg-emerald-50 border-slate-200"
                                  }`}
                                  onClick={() => toggleStatus(status.value)}
                                >
                                  {filters.statuses.includes(status.value) && <X className="h-3 w-3 mr-1" />}
                                  {status.value}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Application Received Date Range */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Application Received</Label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                <Input
                                  type="date"
                                  value={filters.dateFrom}
                                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                  className="pl-9 bg-white border-amber-100 focus:border-amber-300"
                                />
                              </div>
                              <span className="text-muted-foreground text-sm">to</span>
                              <div className="relative flex-1">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                                <Input
                                  type="date"
                                  value={filters.dateTo}
                                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                  className="pl-9 bg-white border-amber-100 focus:border-amber-300"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button className="bg-teal-600 hover:bg-teal-700">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-6">
                    {mockRentalApplications.map((application) => (
                      <Card
                        key={application.id}
                        className="overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 border-teal-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Property Image/Info Section */}
                          <div className="w-full md:w-80 bg-gradient-to-b from-teal-100 to-cyan-100 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-teal-200">
                            <Badge
                              variant="outline"
                              className="mb-3 font-mono bg-white/80 border-teal-300 text-teal-700"
                            >
                              {application.unitCode.split(" ")[0]}
                            </Badge>
                            <div className="w-24 h-24 bg-gradient-to-br from-white to-teal-50 rounded-lg flex items-center justify-center mb-3 border border-teal-200 shadow-sm">
                              <Home className="h-10 w-10 text-teal-500" />
                            </div>
                            <h3 className="font-bold text-lg text-teal-700 text-center">{application.unitCode}</h3>
                            <p className="text-xs text-teal-600/80 text-center mt-1 whitespace-pre-line">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {application.address}
                            </p>
                          </div>

                          {/* Application Details */}
                          <div className="flex-1 p-0">
                            {/* Header with rent info */}
                            <div className="flex justify-end items-start p-4 pb-2 bg-gradient-to-r from-transparent to-teal-50/50">
                              <div className="text-right">
                                <p className="text-xs text-teal-600 font-medium">MARKET RENT</p>
                                <p className="font-bold text-lg text-teal-700">${application.marketRent}</p>
                                <p className="text-xs text-teal-600 font-medium mt-1">VACANT ON</p>
                                <p
                                  className={`text-sm font-medium ${application.vacantOn === "Available Now" ? "text-emerald-600" : application.vacantOn === "Not Vacant" ? "text-slate-500" : "text-amber-600"}`}
                                >
                                  {application.vacantOn}
                                </p>
                              </div>
                            </div>

                            {/* Applicants Table */}
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-teal-100/60 border-teal-200">
                                  <TableHead className="text-xs font-semibold text-teal-700">APPLICANT(S)</TableHead>
                                  <TableHead className="text-xs font-semibold text-teal-700">DESIRED MOVE IN</TableHead>
                                  <TableHead className="text-xs font-semibold text-teal-700">STATUS</TableHead>
                                  <TableHead className="text-xs font-semibold text-teal-700">RECEIVED</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {application.applicants.map((applicant) => (
                                  <TableRow
                                    key={applicant.id}
                                    className="cursor-pointer hover:bg-teal-100/50 border-teal-100 transition-colors"
                                    onClick={() => handleApplicationClick(application, applicant)}
                                  >
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-7 w-7 border border-teal-200">
                                          <AvatarFallback className="text-xs bg-teal-100 text-teal-700">
                                            {applicant.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-teal-700 hover:underline">
                                          {applicant.name}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-teal-600">{applicant.moveInDate}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={
                                          applicant.status === "Approved"
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : applicant.status === "Decision Pending"
                                              ? "bg-amber-100 text-amber-700 border-amber-200"
                                              : applicant.status === "Screening"
                                                ? "bg-purple-100 text-purple-700 border-purple-200"
                                                : "bg-sky-100 text-sky-700 border-sky-200"
                                        }
                                      >
                                        {applicant.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-teal-600/80">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {applicant.received}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {view === "leases" && (
            <div className="space-y-6">
              {/* Two Big Tiles */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload PDF Tile */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-800">Upload a PDF Document</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                        If you already have lease agreements in PDF format, you can upload them to create reusable,
                        paperless leasing templates with fillable form fields and merge fields. This allows you to
                        generate multiple template variations as needed and send online lease renewals or addenda to
                        existing residents at any time—independent of the move-in workflow. This approach is ideal when
                        working with multiple lease forms or when compliance with state, city, or association-specific
                        requirements is necessary.
                      </p>
                    </div>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 mt-4">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload PDF
                    </Button>
                  </CardContent>
                </Card>

                {/* Create New Tile */}
                <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/30">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-800">Create a New Lease Template</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                        Build your lease templates from scratch using our intuitive form editor. This method provides
                        maximum flexibility for creating custom lease agreements tailored to specific property types,
                        locations, or legal requirements. You can easily add, remove, or modify sections, ensuring that
                        your templates are always up-to-date and compliant.
                      </p>
                    </div>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Lease
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Lease Templates Table */}
              <Card className="border-teal-200 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 bg-teal-100/50 border-b border-teal-200">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-teal-700">Lease Templates</CardTitle>
                    <CardDescription className="text-xs text-teal-500">Manage your lease agreements</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 px-3 bg-transparent">
                      <Search className="h-3 w-3 mr-1" />
                      <span className="text-xs">Search</span>
                    </Button>
                    <Button variant="outline" className="h-8 px-3 bg-transparent">
                      <Filter className="h-3 w-3 mr-1" />
                      <span className="text-xs">Filter</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-teal-100 hover:bg-teal-100/50">
                        <TableHead className="font-semibold text-teal-700 text-xs">TEMPLATE NAME</TableHead>
                        <TableHead className="font-semibold text-teal-700 text-xs">LAST MODIFIED</TableHead>
                        <TableHead className="font-semibold text-teal-700 text-xs">CREATED BY</TableHead>
                        <TableHead className="font-semibold text-teal-700 text-xs text-center">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-teal-100 hover:bg-teal-100/50">
                        <TableCell className="font-medium text-teal-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-teal-500" />
                            <span>Standard Residential Lease</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-teal-600/80 text-xs">Oct 26, 2023</TableCell>
                        <TableCell className="text-teal-600/80 text-xs">Admin</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 px-1">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2" />
                                View Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Template
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-teal-100 hover:bg-teal-100/50">
                        <TableCell className="font-medium text-teal-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-teal-500" />
                            <span>Commercial Lease Agreement</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-teal-600/80 text-xs">Oct 20, 2023</TableCell>
                        <TableCell className="text-teal-600/80 text-xs">Admin</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 px-1">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2" />
                                View Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Template
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-teal-100 hover:bg-teal-100/50">
                        <TableCell className="font-medium text-teal-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-teal-500" />
                            <span>Sublease Agreement</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-teal-600/80 text-xs">Sep 15, 2023</TableCell>
                        <TableCell className="text-teal-600/80 text-xs">Maria Garcia</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 px-1">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2" />
                                View Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Template
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          {/* </CHANGE> Add renewals view rendering */}
          {view === "renewals" && <RenewalsContent />}
        </>
      )}
    </div>
  )
}
