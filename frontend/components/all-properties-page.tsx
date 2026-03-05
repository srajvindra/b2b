"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Users,
  CalendarDays,
  CheckCircle,
  XCircle,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Star,
  ClipboardList,
  FolderPlus,
  Key,
  Building,
  FileText,
  Home,
  DollarSign,
  FileBarChart,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useNav } from "./dashboard-app"
import { PropertyMetricsSummary } from "./property-matrix"

type Property = {
  id: string
  name: string
  address: string
  unitAddress: string
  type: "Single" | "Multi" | "Apartment"
  units: number
  hasVacancy: boolean
  ownerName: string
  tenantName: string
  occupancyStatus: "Occupied" | "Vacant"
  csr: string
  csm: string
  agm: string
  lc: string
  fc: string
  mrs: string
  dateAdded: string
  staffName: string
  portfolioGroup: string
  propertyGroup: string
  tags: string[]
  assigneeRole: string
  propertyStatus: "Active" | "Under Termination" | "Hidden" | "Under Retention"
}

// Helper to generate new fields deterministically
const _staffCSR = ["Alex Rivera", "Emily Watson", "Marcus Lee", "Sarah Kim", "David Chen"]
const _staffCSM = ["Nina Patel", "James Rodriguez", "Amy Liu", "Tom Baker", "Rachel Green"]
const _staffAGM = ["Robert Taylor", "Lisa Chang", "Mark Davis", "Karen White", "Paul Scott"]
const _staffLC = ["John Smith", "Jane Doe", "Mike Johnson", "Sarah Mitchell", "Chris Evans"]
const _staffFC = ["Brian Walsh", "Maria Garcia", "Kevin Brown", "Laura Adams", "Sam Wilson"]
const _staffMRS = ["Tim Cooper", "Diana Prince", "Steve Rogers", "Natasha Blake", "Peter Park"]
const _tenants = ["James Wilson", "Anna Thompson", "Michael Davis", "Sarah Brown", "Chris Martin", "Emily Clark", "Robert Lee", "Jessica Taylor", "Daniel Harris", "Amanda White"]
const _propGroups = ["Group A - Premium", "Group B - Standard", "Group C - Economy", "Group D - Mixed"]
function _buildProp(id: number, name: string, address: string, origType: string, units: number, hasVacancy: boolean, ownerName: string, dateAdded: string, staffName: string, portfolioGroup: string, tags: string[], assigneeRole: string): Property {
  const n = id
  return {
    id: String(id), name, address,
    unitAddress: units === 1 ? address : `Unit ${100 + (n % units)}, ${address}`,
    type: origType === "Single-Family" ? "Single" : (n % 3 === 0 ? "Apartment" : "Multi") as Property["type"],
    units, hasVacancy, ownerName,
    tenantName: hasVacancy ? "-" : _tenants[n % _tenants.length],
    occupancyStatus: hasVacancy ? "Vacant" : "Occupied",
    csr: _staffCSR[n % 5], csm: _staffCSM[n % 5], agm: _staffAGM[n % 5],
    lc: _staffLC[n % 5], fc: _staffFC[n % 5], mrs: _staffMRS[n % 5],
    dateAdded, staffName, portfolioGroup,
    propertyGroup: _propGroups[n % 4],
    tags, assigneeRole,
    propertyStatus: (n % 7 === 0 ? "Under Termination" : n % 11 === 0 ? "Hidden" : n % 13 === 0 ? "Under Retention" : "Active") as Property["propertyStatus"],
  }
}

const MOCK_PROPERTIES: Property[] = [
  _buildProp(1, "Sunset Apartments", "1234 Sunset Blvd, Los Angeles, CA 90028", "Multi-Family", 24, true, "Emma Wilson", "2024-01-15", "John Smith", "West Coast Portfolio", ["Premium", "Pet Friendly"], "Property Manager"),
  _buildProp(2, "Oakwood Residence", "567 Oak Street, San Francisco, CA 94102", "Multi-Family", 12, true, "Sarah Lee", "2024-02-20", "Jane Doe", "West Coast Portfolio", ["Renovated", "Luxury"], "Leasing Agent"),
  _buildProp(3, "Pine Street Homes", "890 Pine Ave, Seattle, WA 98101", "Single-Family", 1, false, "Linda Martinez", "2024-03-10", "Mike Johnson", "Pacific Northwest", ["Single Unit", "Residential"], "Maintenance Lead"),
  _buildProp(4, "Harbor View Complex", "321 Harbor Dr, San Diego, CA 92101", "Multi-Family", 36, false, "Emma Wilson", "2023-11-05", "John Smith", "West Coast Portfolio", ["Waterfront", "Premium"], "Property Manager"),
  _buildProp(5, "Metro Plaza", "456 Metro Blvd, Portland, OR 97201", "Multi-Family", 18, true, "Sarah Lee", "2024-04-01", "Jane Doe", "Pacific Northwest", ["Urban", "Transit Friendly"], "Leasing Agent"),
  _buildProp(6, "Riverside Apartments", "789 River Rd, Austin, TX 78701", "Multi-Family", 28, true, "Linda Martinez", "2024-05-12", "Mike Johnson", "South Central Portfolio", ["Pet Friendly", "Renovated"], "Maintenance Lead"),
  _buildProp(7, "Lakeside Villas", "234 Lake Dr, Chicago, IL 60601", "Multi-Family", 45, true, "Robert Taylor", "2023-09-18", "Sarah Mitchell", "Midwest Portfolio", ["Luxury", "Waterfront"], "Regional Manager"),
  _buildProp(8, "Mountain View Estates", "567 Summit Rd, Denver, CO 80202", "Multi-Family", 32, false, "Emma Wilson", "2024-01-28", "John Smith", "Mountain West", ["Premium", "Scenic"], "Property Manager"),
  _buildProp(9, "Downtown Lofts", "890 Main St, Boston, MA 02108", "Multi-Family", 16, true, "Michael Chen", "2024-06-05", "Jane Doe", "East Coast Portfolio", ["Urban", "Luxury"], "Leasing Agent"),
  _buildProp(10, "Coastal Residences", "123 Beach Blvd, Miami, FL 33139", "Multi-Family", 52, false, "Sarah Lee", "2023-12-20", "Mike Johnson", "Southeast Portfolio", ["Waterfront", "Premium"], "Maintenance Lead"),
  _buildProp(11, "Garden Terrace", "456 Garden Way, Phoenix, AZ 85001", "Multi-Family", 20, true, "Linda Martinez", "2024-02-14", "Sarah Mitchell", "Mountain West", ["Pet Friendly", "Residential"], "Regional Manager"),
  _buildProp(12, "Heritage Manor", "789 Heritage Ave, Philadelphia, PA 19102", "Single-Family", 1, false, "Robert Taylor", "2024-03-22", "John Smith", "East Coast Portfolio", ["Single Unit", "Historic"], "Property Manager"),
  _buildProp(13, "Skyline Towers", "321 Sky Blvd, Dallas, TX 75201", "Multi-Family", 64, true, "Emma Wilson", "2023-10-10", "Jane Doe", "South Central Portfolio", ["Premium", "Urban"], "Leasing Agent"),
  _buildProp(14, "Willow Creek", "654 Willow Ln, Nashville, TN 37201", "Multi-Family", 14, false, "Michael Chen", "2024-04-18", "Mike Johnson", "Southeast Portfolio", ["Renovated", "Transit Friendly"], "Maintenance Lead"),
  _buildProp(15, "Spring Gardens", "987 Spring St, Atlanta, GA 30301", "Multi-Family", 22, true, "Sarah Lee", "2024-01-05", "Sarah Mitchell", "Southeast Portfolio", ["Pet Friendly", "Scenic"], "Regional Manager"),
  _buildProp(16, "Parkside Commons", "147 Park Ave, Minneapolis, MN 55401", "Multi-Family", 38, false, "Linda Martinez", "2023-11-28", "John Smith", "Midwest Portfolio", ["Urban", "Residential"], "Property Manager"),
  _buildProp(17, "Maple Ridge", "258 Maple Dr, Detroit, MI 48201", "Single-Family", 1, true, "Robert Taylor", "2024-05-30", "Jane Doe", "Midwest Portfolio", ["Single Unit", "Renovated"], "Leasing Agent"),
  _buildProp(18, "Valley View Apartments", "369 Valley Rd, Las Vegas, NV 89101", "Multi-Family", 42, true, "Emma Wilson", "2024-02-08", "Mike Johnson", "Mountain West", ["Luxury", "Scenic"], "Maintenance Lead"),
  _buildProp(19, "Riverside Heights", "741 River View, Portland, OR 97204", "Multi-Family", 26, false, "Michael Chen", "2024-12-12", "Sarah Mitchell", "Pacific Northwest", ["Waterfront", "Transit Friendly"], "Regional Manager"),
  _buildProp(20, "Broadway Plaza", "852 Broadway, New York, NY 10003", "Multi-Family", 58, true, "Sarah Lee", "2024-03-15", "John Smith", "East Coast Portfolio", ["Premium", "Urban", "Luxury"], "Property Manager"),
  _buildProp(21, "Cedar Point", "963 Cedar Ave, Charlotte, NC 28201", "Multi-Family", 30, false, "Linda Martinez", "2024-06-20", "Jane Doe", "Southeast Portfolio", ["Residential", "Pet Friendly"], "Leasing Agent"),
  _buildProp(22, "Hillside Residence", "159 Hill St, Salt Lake City, UT 84101", "Single-Family", 1, true, "Robert Taylor", "2024-04-25", "Mike Johnson", "Mountain West", ["Single Unit", "Scenic"], "Maintenance Lead"),
  _buildProp(23, "Bay Shore Complex", "357 Bay Shore Dr, Tampa, FL 33602", "Multi-Family", 48, true, "Emma Wilson", "2023-10-30", "Sarah Mitchell", "Southeast Portfolio", ["Waterfront", "Luxury"], "Regional Manager"),
  _buildProp(24, "Summit Place", "486 Summit Ave, Columbus, OH 43201", "Multi-Family", 34, false, "Michael Chen", "2024-05-08", "John Smith", "Midwest Portfolio", ["Urban", "Renovated"], "Property Manager"),
  _buildProp(25, "Pacific Heights Towers", "1200 Pacific Ave, San Francisco, CA 94115", "Multi-Family", 72, true, "William Park", "2024-01-10", "John Smith", "West Coast Portfolio", ["Premium", "Luxury"], "Property Manager"),
  _buildProp(26, "Marina Bay Condos", "450 Marina Blvd, San Diego, CA 92101", "Multi-Family", 56, false, "Jennifer Liu", "2024-02-15", "Jane Doe", "West Coast Portfolio", ["Waterfront", "Renovated"], "Leasing Agent"),
  _buildProp(27, "Golden Gate Apartments", "888 Golden Gate Ave, San Francisco, CA 94102", "Multi-Family", 40, true, "Robert Kim", "2024-03-20", "Mike Johnson", "West Coast Portfolio", ["Urban", "Transit Friendly"], "Maintenance Lead"),
  _buildProp(28, "Nob Hill Residence", "1500 Nob Hill Rd, San Francisco, CA 94109", "Multi-Family", 28, false, "Amanda Wong", "2024-04-05", "Sarah Mitchell", "West Coast Portfolio", ["Historic", "Luxury"], "Regional Manager"),
  _buildProp(29, "Silicon Valley Suites", "2200 Tech Park Dr, San Jose, CA 95110", "Multi-Family", 64, true, "Steven Zhang", "2024-05-12", "John Smith", "West Coast Portfolio", ["Premium", "Urban"], "Property Manager"),
  _buildProp(30, "Desert Oasis", "3300 Desert Springs Rd, Phoenix, AZ 85004", "Multi-Family", 32, true, "Maria Garcia", "2024-01-22", "Jane Doe", "Mountain West", ["Pet Friendly", "Scenic"], "Leasing Agent"),
  _buildProp(31, "Sonoran Vista", "1800 Sonoran Blvd, Scottsdale, AZ 85251", "Multi-Family", 24, false, "Carlos Mendez", "2024-02-28", "Mike Johnson", "Mountain West", ["Luxury", "Scenic"], "Maintenance Lead"),
  _buildProp(32, "Camelback Manor", "4500 Camelback Rd, Phoenix, AZ 85018", "Single-Family", 1, false, "Isabella Torres", "2024-03-15", "Sarah Mitchell", "Mountain West", ["Single Unit", "Historic"], "Regional Manager"),
  _buildProp(33, "Mesa Verde Apartments", "2100 Mesa Verde Way, Mesa, AZ 85201", "Multi-Family", 36, true, "Diego Ramirez", "2024-04-10", "John Smith", "Mountain West", ["Residential", "Pet Friendly"], "Property Manager"),
  _buildProp(34, "Manhattan Heights", "500 Park Ave, New York, NY 10022", "Multi-Family", 120, true, "Alexander Sterling", "2023-11-15", "Jane Doe", "East Coast Portfolio", ["Premium", "Luxury", "Urban"], "Leasing Agent"),
  _buildProp(35, "Brooklyn Bridge Lofts", "200 Water St, Brooklyn, NY 11201", "Multi-Family", 85, false, "Victoria Hayes", "2023-12-20", "Mike Johnson", "East Coast Portfolio", ["Waterfront", "Renovated"], "Maintenance Lead"),
  _buildProp(36, "Hudson River Towers", "100 Hudson St, Jersey City, NJ 07302", "Multi-Family", 96, true, "Benjamin Cole", "2024-01-25", "Sarah Mitchell", "East Coast Portfolio", ["Waterfront", "Premium"], "Regional Manager"),
  _buildProp(37, "Central Park View", "750 Central Park West, New York, NY 10025", "Multi-Family", 68, false, "Olivia Martin", "2024-02-10", "John Smith", "East Coast Portfolio", ["Luxury", "Scenic"], "Property Manager"),
  _buildProp(38, "SoHo Grand Apartments", "350 Broadway, New York, NY 10013", "Multi-Family", 44, true, "Daniel Foster", "2024-03-05", "Jane Doe", "East Coast Portfolio", ["Urban", "Historic"], "Leasing Agent"),
  _buildProp(39, "Tribeca Terrace", "180 Greenwich St, New York, NY 10007", "Multi-Family", 52, false, "Sophie Anderson", "2024-04-12", "Mike Johnson", "East Coast Portfolio", ["Luxury", "Urban"], "Maintenance Lead"),
  _buildProp(40, "Midwest Plaza", "800 Michigan Ave, Chicago, IL 60611", "Multi-Family", 38, true, "Thomas Baker", "2024-01-18", "Sarah Mitchell", "Midwest Portfolio", ["Urban", "Transit Friendly"], "Regional Manager"),
  _buildProp(41, "Lakeshore Estates", "1500 Lake Shore Dr, Chicago, IL 60610", "Multi-Family", 62, false, "Katherine Wright", "2024-02-22", "John Smith", "Midwest Portfolio", ["Waterfront", "Premium"], "Property Manager"),
  _buildProp(42, "Wrigleyville Commons", "3600 Clark St, Chicago, IL 60613", "Multi-Family", 28, true, "Patrick Murphy", "2024-03-28", "Jane Doe", "Midwest Portfolio", ["Residential", "Pet Friendly"], "Leasing Agent"),
  _buildProp(43, "Lincoln Park Suites", "2200 Lincoln Ave, Chicago, IL 60614", "Multi-Family", 35, true, "Samantha Green", "2024-04-15", "Mike Johnson", "Midwest Portfolio", ["Renovated", "Urban"], "Maintenance Lead"),
  _buildProp(44, "Bucktown Residences", "1800 Damen Ave, Chicago, IL 60647", "Multi-Family", 22, false, "Christopher Lee", "2024-05-20", "Sarah Mitchell", "Midwest Portfolio", ["Residential", "Renovated"], "Regional Manager"),
  _buildProp(45, "South Beach Towers", "500 Ocean Dr, Miami, FL 33139", "Multi-Family", 88, true, "Isabella Sanchez", "2024-01-08", "John Smith", "Southeast Portfolio", ["Waterfront", "Luxury", "Premium"], "Property Manager"),
  _buildProp(46, "Brickell Heights", "1100 Brickell Ave, Miami, FL 33131", "Multi-Family", 76, false, "Marcus Johnson", "2024-02-12", "Jane Doe", "Southeast Portfolio", ["Urban", "Premium"], "Leasing Agent"),
  _buildProp(47, "Coconut Grove Villas", "3400 Main Hwy, Miami, FL 33133", "Multi-Family", 32, true, "Victoria Lee", "2024-03-18", "Mike Johnson", "Southeast Portfolio", ["Scenic", "Pet Friendly"], "Maintenance Lead"),
  _buildProp(48, "Wynwood Lofts", "2500 NW 2nd Ave, Miami, FL 33127", "Multi-Family", 48, true, "David Rodriguez", "2024-04-22", "Sarah Mitchell", "Southeast Portfolio", ["Urban", "Renovated"], "Regional Manager"),
  _buildProp(49, "Capitol Hill Apartments", "1000 E Pike St, Seattle, WA 98122", "Multi-Family", 54, false, "Rachel Kim", "2024-01-30", "John Smith", "Pacific Northwest", ["Urban", "Transit Friendly"], "Property Manager"),
  _buildProp(50, "Belltown Residences", "2100 1st Ave, Seattle, WA 98121", "Multi-Family", 42, true, "Nathan Park", "2024-02-25", "Jane Doe", "Pacific Northwest", ["Renovated", "Pet Friendly"], "Leasing Agent"),
  _buildProp(51, "Fremont Flats", "3500 Fremont Ave N, Seattle, WA 98103", "Multi-Family", 26, true, "Amanda Chen", "2024-03-30", "Mike Johnson", "Pacific Northwest", ["Residential", "Pet Friendly"], "Maintenance Lead"),
  _buildProp(52, "Queen Anne Townhomes", "600 Queen Anne Ave N, Seattle, WA 98109", "Single-Family", 1, false, "Brian Walsh", "2024-04-28", "Sarah Mitchell", "Pacific Northwest", ["Single Unit", "Scenic"], "Regional Manager"),
  _buildProp(53, "Pearl District Lofts", "1200 NW Glisan St, Portland, OR 97209", "Multi-Family", 46, true, "Michelle Taylor", "2024-01-15", "John Smith", "Pacific Northwest", ["Urban", "Luxury"], "Property Manager"),
  _buildProp(54, "Alberta Arts Apartments", "2800 NE Alberta St, Portland, OR 97211", "Multi-Family", 30, false, "Kevin Brown", "2024-02-18", "Jane Doe", "Pacific Northwest", ["Renovated", "Residential"], "Leasing Agent"),
  _buildProp(55, "Hawthorne Commons", "3200 SE Hawthorne Blvd, Portland, OR 97214", "Multi-Family", 24, true, "Lisa Peterson", "2024-03-22", "Mike Johnson", "Pacific Northwest", ["Transit Friendly", "Pet Friendly"], "Maintenance Lead"),
]

export default function AllPropertiesPage() {
  const nav = useNav()
  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false)
  
  // Property view columns
  const propertyColumns = [
    { id: "propertyName", label: "Property Name" },
    { id: "propertyAddress", label: "Property Address" },
    { id: "unitCount", label: "Unit Count" },
    { id: "ownerName", label: "Owner Name" },
    { id: "occupancy", label: "Occupancy" },
    { id: "csr", label: "CSR" },
    { id: "csm", label: "CSM" },
    { id: "agm", label: "AGM" },
    { id: "lc", label: "LC" },
    { id: "fc", label: "FC" },
    { id: "mrs", label: "MRS" },
    { id: "type", label: "Type" },
    { id: "tags", label: "Tags" },
    { id: "portfolioGroup", label: "Portfolio Group" },
    { id: "propertyGroup", label: "Property Group" },
    { id: "dateAdded", label: "Date Added" },
    { id: "propertyStatus", label: "Property Status" },
  ]
  
  // Unit view columns
  const unitColumns = [
    { id: "unitAddress", label: "Unit Address" },
    { id: "propertyName", label: "Property Name" },
    { id: "ownerName", label: "Owner Name" },
    { id: "tenantName", label: "Tenant Name" },
    { id: "occupancy", label: "Occupancy" },
    { id: "csr", label: "CSR" },
    { id: "csm", label: "CSM" },
    { id: "agm", label: "AGM" },
    { id: "lc", label: "LC" },
    { id: "fc", label: "FC" },
    { id: "mrs", label: "MRS" },
    { id: "type", label: "Type" },
    { id: "tags", label: "Tags" },
    { id: "portfolioGroup", label: "Portfolio Group" },
    { id: "propertyGroup", label: "Property Group" },
    { id: "dateAdded", label: "Date Added" },
    { id: "propertyStatus", label: "Property Status" },
  ]
  
  const [visiblePropertyColumns, setVisiblePropertyColumns] = useState<string[]>(propertyColumns.map(c => c.id))
  const [visibleUnitColumns, setVisibleUnitColumns] = useState<string[]>(unitColumns.map(c => c.id))
  const [viewToggle, setViewToggle] = useState<"properties" | "units">("properties")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreProperties, setHasMoreProperties] = useState(true)

  // Filter states
  const [metricsFilter, setMetricsFilter] = useState<string | null>(null)
  const [appliedFilters, setAppliedFilters] = useState<{ field: string; values: string[] }[]>([])
  const [showAddFilterModal, setShowAddFilterModal] = useState(false)
  const [modalFilterField, setModalFilterField] = useState("")
  const [modalFilterValues, setModalFilterValues] = useState<string[]>([])
  const [modalOptionSearch, setModalOptionSearch] = useState("")
  const [modalFieldSearch, setModalFieldSearch] = useState("")
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)

  // All available filter fields
  const FILTER_FIELDS = [
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

  // Generate contextual options based on selected filter field
  const getFilterOptions = (field: string): string[] => {
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
    if (field === "Tagged With Any" || field === "Tagged With All") return [...new Set(MOCK_PROPERTIES.flatMap((p) => p.tags))].sort()
    if (field === "Integration") return ["AppFolio", "Buildium", "RentManager", "Yardi", "None"]
    if (field === "In Relationship Status") return ["Active", "Inactive", "Pending"]
    if (field.includes("Included?") || field.includes("Allowed?") || field === "HOA?" || field === "Pool?" || field === "Community Center?" || field === "Section 8?" || field === "Available" || field === "Funds Received?" || field === "Does the owner allow for pets?") return ["Yes", "No"]
    if (field === "Utility Region") return ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast", "Pacific Northwest"]
    return ["Option A", "Option B", "Option C"]
  }

  // Fields that support "Select All"
  const FIELDS_WITH_SELECT_ALL = ["Property Group(s)", "In Relationship(s)", "Tagged With Any", "Tagged With All"]

  const hasActiveFilters = appliedFilters.length > 0 || metricsFilter !== null

  const resetAllFilters = () => {
    setAppliedFilters([])
    setMetricsFilter(null)
    setCurrentPage(1)
  }

  const removeFilter = (index: number) => {
    setAppliedFilters(appliedFilters.filter((_, i) => i !== index))
    setCurrentPage(1)
  }

  const applyModalFilter = () => {
    if (!modalFilterField || modalFilterValues.length === 0) return
    setAppliedFilters([...appliedFilters, { field: modalFilterField, values: modalFilterValues }])
    setModalFilterField("")
    setModalFilterValues([])
    setModalOptionSearch("")
    setShowAddFilterModal(false)
    setCurrentPage(1)
  }

  const closeModal = useCallback(() => {
    setShowAddFilterModal(false)
    setModalFilterField("")
    setModalFilterValues([])
    setModalOptionSearch("")
    setModalFieldSearch("")
    setShowFieldDropdown(false)
  }, [])

  // Keyboard shortcuts for modal
  useEffect(() => {
    if (!showAddFilterModal) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeModal() }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { applyModalFilter() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  const filteredProperties = MOCK_PROPERTIES.filter((property) => {
    for (const filter of appliedFilters) {
      if (filter.field === "Status" && !filter.values.includes(property.propertyStatus)) return false
      if (filter.field === "Property Group(s)" && !filter.values.includes(property.propertyGroup)) return false
      if ((filter.field === "Tagged With Any") && !filter.values.some((v) => property.tags.includes(v))) return false
      if ((filter.field === "Tagged With All") && !filter.values.every((v) => property.tags.includes(v))) return false
    }

    // Metrics summary tile filters
    if (metricsFilter) {
      if (metricsFilter.startsWith("occ-") && property.hasVacancy) return false
      if (metricsFilter.startsWith("vac-") && !property.hasVacancy) return false
      if (metricsFilter === "occ-delinquent" && Number(property.id) % 5 !== 0) return false
      if (metricsFilter === "occ-eviction" && Number(property.id) % 7 !== 0) return false
      if (metricsFilter === "occ-moveout" && Number(property.id) % 4 !== 0) return false
      if (metricsFilter === "vac-market" && Number(property.id) % 3 !== 0) return false
      if (metricsFilter === "vac-hold" && Number(property.id) % 6 !== 0) return false
      if (metricsFilter === "wo-unassigned" && Number(property.id) % 4 !== 1) return false
      if (metricsFilter === "task-overdue" && Number(property.id) % 5 !== 2) return false
      if (metricsFilter === "proc-overdue" && Number(property.id) % 6 !== 1) return false
    }

    return true
  }).sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())

  const totalProperties = filteredProperties.length
  const startIndex = (currentPage - 1) * visibleCount
  const endIndex = startIndex + visibleCount
  const visibleProperties = filteredProperties.slice(startIndex, endIndex)
  const totalPages = Math.ceil(totalProperties / visibleCount)

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, totalProperties))
      setIsLoadingMore(false)
    }, 300)
  }

  const handlePropertyClick = (propertyId: string) => {
    nav.go("propertyDetail", { id: propertyId })
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Scrollable main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">All Properties</h1>
              <p className="text-sm text-muted-foreground">Manage your property portfolio</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                Export
              </Button>
              <Button>
                <Building2 className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </div>
          </div>
        </div>

        <PropertyMetricsSummary activeFilter={metricsFilter} onFilterChange={(key) => { setMetricsFilter(key); setCurrentPage(1) }} />

        <div className="border-b bg-card px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => setShowAddFilterModal(true)}
              >
                <Filter className="h-3.5 w-3.5" />
                Add Filter
              </Button>

              {appliedFilters.map((filter, index) => (
                <div key={`${filter.field}-${index}`} className="flex items-center gap-1 h-8 px-2.5 rounded-md border border-teal-300 bg-teal-50 text-teal-700 text-xs font-medium">
                  <span>{filter.field}:</span>
                  <span className="font-semibold max-w-[150px] truncate">{filter.values.join(", ")}</span>
                  <button type="button" onClick={() => removeFilter(index)} className="ml-1 hover:text-teal-900">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllFilters}
                  className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-r-none ${viewMode === "grid" ? "bg-gray-800 hover:bg-gray-900" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-l-none ${viewMode === "list" ? "bg-gray-800 hover:bg-gray-900" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Column Settings Popover */}
              <Popover open={columnSettingsOpen} onOpenChange={setColumnSettingsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="end">
                  <div className="px-4 py-3 border-b">
                    <h4 className="font-semibold text-sm">Column Settings</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Select columns to display in the table</p>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto p-2">
                    {viewToggle === "properties" ? (
                      propertyColumns.map((col) => (
                        <label
                          key={col.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={visiblePropertyColumns.includes(col.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setVisiblePropertyColumns([...visiblePropertyColumns, col.id])
                              } else {
                                setVisiblePropertyColumns(visiblePropertyColumns.filter(c => c !== col.id))
                              }
                            }}
                          />
                          <span className="text-sm">{col.label}</span>
                        </label>
                      ))
                    ) : (
                      unitColumns.map((col) => (
                        <label
                          key={col.id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                        >
                          <Checkbox
                            checked={visibleUnitColumns.includes(col.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setVisibleUnitColumns([...visibleUnitColumns, col.id])
                              } else {
                                setVisibleUnitColumns(visibleUnitColumns.filter(c => c !== col.id))
                              }
                            }}
                          />
                          <span className="text-sm">{col.label}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (viewToggle === "properties") {
                          setVisiblePropertyColumns([])
                        } else {
                          setVisibleUnitColumns([])
                        }
                      }}
                    >
                      Deselect All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (viewToggle === "properties") {
                          setVisiblePropertyColumns(propertyColumns.map(c => c.id))
                        } else {
                          setVisibleUnitColumns(unitColumns.map(c => c.id))
                        }
                      }}
                    >
                      Select All
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Add Filter Modal */}
        {showAddFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 pt-5 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Add Filter</h2>
                <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 pb-2 flex flex-col gap-4">
                {/* Filter Field Dropdown - Searchable */}
                <div className="relative">
                  <label className="text-xs font-medium text-blue-700 mb-1 block">What do you want to filter by?</label>
                  <div className="border rounded-md w-full">
                    <div
                      className="flex items-center gap-2 h-10 px-3 cursor-pointer"
                      onClick={() => setShowFieldDropdown(!showFieldDropdown)}
                    >
                      <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className={`text-sm flex-1 truncate ${modalFilterField ? "text-slate-900" : "text-slate-500"}`}>
                        {modalFilterField || "Select a filter field"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${showFieldDropdown ? "rotate-180" : ""}`} />
                    </div>
                    {showFieldDropdown && (
                      <>
                        <div className="border-t px-2 py-1.5">
                          <Input
                            placeholder="Search fields..."
                            value={modalFieldSearch}
                            onChange={(e) => setModalFieldSearch(e.target.value)}
                            className="h-8 text-sm border-slate-200"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto border-t">
                          {FILTER_FIELDS
                            .filter((f) => f.toLowerCase().includes(modalFieldSearch.toLowerCase()))
                            .map((field) => (
                            <div
                              key={field}
                              className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                              onClick={() => {
                                setModalFilterField(field)
                                setModalFilterValues([])
                                setModalOptionSearch("")
                                setModalFieldSearch("")
                                setShowFieldDropdown(false)
                              }}
                            >
                              <span className="truncate">{field}</span>
                            </div>
                          ))}
                          {FILTER_FIELDS.filter((f) => f.toLowerCase().includes(modalFieldSearch.toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-sm text-slate-400">No matching fields</div>
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
                      value={modalOptionSearch}
                      onChange={(e) => setModalOptionSearch(e.target.value)}
                      className="border-0 border-b rounded-b-none h-10 focus-visible:ring-0 w-full"
                    />
                    {modalFilterField && (() => {
                      const allOptions = getFilterOptions(modalFilterField)
                      const filtered = allOptions.filter((opt) => opt.toLowerCase().includes(modalOptionSearch.toLowerCase()))
                      const allSelected = filtered.length > 0 && filtered.every((opt) => modalFilterValues.includes(opt))
                      const showSelectAll = FIELDS_WITH_SELECT_ALL.includes(modalFilterField) && !modalOptionSearch
                      return (
                        <div className="max-h-[180px] overflow-y-auto">
                          {showSelectAll && (
                            <div className="flex items-center space-x-2 py-2 px-3 border-b border-slate-100 hover:bg-slate-50">
                              <Checkbox
                                id="modal-opt-select-all"
                                checked={allSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) setModalFilterValues([...new Set([...modalFilterValues, ...allOptions])])
                                  else setModalFilterValues(modalFilterValues.filter((v) => !allOptions.includes(v)))
                                }}
                              />
                              <label htmlFor="modal-opt-select-all" className="text-sm leading-none cursor-pointer flex-1 font-medium">Select All</label>
                            </div>
                          )}
                          {filtered.map((option) => (
                            <div key={option} className="flex items-center space-x-2 py-2 px-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                              <Checkbox
                                id={`modal-opt-${option}`}
                                checked={modalFilterValues.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) setModalFilterValues([...modalFilterValues, option])
                                  else setModalFilterValues(modalFilterValues.filter((v) => v !== option))
                                }}
                              />
                              <label htmlFor={`modal-opt-${option}`} className="text-sm leading-none cursor-pointer flex-1 truncate">{option}</label>
                            </div>
                          ))}
                          {filtered.length === 0 && (
                            <div className="px-3 py-2 text-sm text-slate-400">No matching options</div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2">
                <Button variant="outline" onClick={closeModal} className="h-9 px-4">
                  Cancel <span className="text-xs text-slate-400 ml-1.5">(esc)</span>
                </Button>
                <Button
                  onClick={applyModalFilter}
                  disabled={!modalFilterField || modalFilterValues.length === 0}
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-muted/20">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property) => (
              <Card
                key={property.id}
                onClick={() => handlePropertyClick(property.id)}
                className="flex flex-col overflow-hidden border transition-all duration-200 hover:shadow-xl group cursor-pointer bg-white border-gray-200 hover:border-gray-400"
              >
                <div className="p-5 border-b relative overflow-hidden bg-gray-50 border-gray-200">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-bold text-lg leading-tight transition-colors text-gray-900 group-hover:text-gray-700">
                        {property.name}
                      </h3>
                      <div className="flex items-start text-sm gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" />
                        <span className="line-clamp-2">{property.address}</span>
                      </div>
                    </div>
                    {property.hasVacancy ? (
                      <div className="p-2 rounded-full bg-gray-200">
                        <CheckCircle className="h-5 w-5 text-gray-700" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-full bg-gray-100">
                        <XCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <Badge className="text-xs font-semibold bg-gray-800 hover:bg-gray-900 text-white">
                    {property.type}
                  </Badge>
                </div>

                <CardContent className="p-5 space-y-4 flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 border-gray-200">
                      <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-gray-700">
                        <div className="p-1.5 rounded bg-gray-800">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        Total Units
                      </span>
                      <span className="text-2xl font-bold text-gray-900">{property.units}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-gray-600">
                          Occupied
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {property.units - (property.hasVacancy ? 1 : 0)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-gray-600">
                          Vacant
                        </div>
                        <div className="text-xl font-bold text-gray-900">{property.hasVacancy ? 1 : 0}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200">
                    <div className="p-2 rounded-full bg-gray-200">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Owner</span>
                      <span className="text-sm font-semibold text-gray-900">{property.ownerName}</span>
                    </div>
                  </div>
                </CardContent>

                <div className="px-5 py-4 border-t mt-auto bg-gray-100 border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-full bg-gray-800">
                      <UserCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                        Handling Staff
                      </span>
                      <span className="text-sm font-bold text-gray-900">{property.staffName}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
          {/* Properties / Units Toggle */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className={`text-sm font-medium transition-colors ${viewToggle === "properties" ? "text-slate-900" : "text-slate-400"}`}>Properties View</span>
            <button
              type="button"
              onClick={() => { setViewToggle(viewToggle === "properties" ? "units" : "properties"); setCurrentPage(1) }}
              className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
              style={{ backgroundColor: viewToggle === "units" ? "#1e40af" : "#93c5fd" }}
              aria-label="Toggle between Properties and Units view"
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200 bg-white border border-slate-200"
                style={{
                  transform: viewToggle === "units" ? "translateX(20px)" : "translateX(0px)",
                }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${viewToggle === "units" ? "text-slate-900" : "text-slate-400"}`}>Units View</span>
          </div>

          <Card className="overflow-x-auto overflow-y-auto max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 shadow-sm">
                  {viewToggle === "properties" ? (
                    <>
                      {visiblePropertyColumns.includes("propertyName") && <TableHead className="font-semibold">Property Name</TableHead>}
                      {visiblePropertyColumns.includes("propertyAddress") && <TableHead className="font-semibold">Property Address</TableHead>}
                      {visiblePropertyColumns.includes("unitCount") && <TableHead className="font-semibold text-center">Unit Count</TableHead>}
                      {visiblePropertyColumns.includes("ownerName") && <TableHead className="font-semibold">Owner Name</TableHead>}
                      {visiblePropertyColumns.includes("occupancy") && <TableHead className="font-semibold text-center">Occupancy</TableHead>}
                      {visiblePropertyColumns.includes("csr") && <TableHead className="font-semibold">CSR</TableHead>}
                      {visiblePropertyColumns.includes("csm") && <TableHead className="font-semibold">CSM</TableHead>}
                      {visiblePropertyColumns.includes("agm") && <TableHead className="font-semibold">AGM</TableHead>}
                      {visiblePropertyColumns.includes("lc") && <TableHead className="font-semibold">LC</TableHead>}
                      {visiblePropertyColumns.includes("fc") && <TableHead className="font-semibold">FC</TableHead>}
                      {visiblePropertyColumns.includes("mrs") && <TableHead className="font-semibold">MRS</TableHead>}
                      {visiblePropertyColumns.includes("type") && <TableHead className="font-semibold">Type</TableHead>}
                      {visiblePropertyColumns.includes("tags") && <TableHead className="font-semibold">Tags</TableHead>}
                      {visiblePropertyColumns.includes("portfolioGroup") && <TableHead className="font-semibold">Portfolio Group</TableHead>}
                      {visiblePropertyColumns.includes("propertyGroup") && <TableHead className="font-semibold">Property Group</TableHead>}
                      {visiblePropertyColumns.includes("dateAdded") && <TableHead className="font-semibold">Date Added</TableHead>}
                      {visiblePropertyColumns.includes("propertyStatus") && <TableHead className="font-semibold">Property Status</TableHead>}
                    </>
                  ) : (
                    <>
                      {visibleUnitColumns.includes("unitAddress") && <TableHead className="font-semibold">Unit Address</TableHead>}
                      {visibleUnitColumns.includes("propertyName") && <TableHead className="font-semibold">Property Name</TableHead>}
                      {visibleUnitColumns.includes("ownerName") && <TableHead className="font-semibold">Owner Name</TableHead>}
                      {visibleUnitColumns.includes("tenantName") && <TableHead className="font-semibold">Tenant Name</TableHead>}
                      {visibleUnitColumns.includes("occupancy") && <TableHead className="font-semibold text-center">Occupancy</TableHead>}
                      {visibleUnitColumns.includes("csr") && <TableHead className="font-semibold">CSR</TableHead>}
                      {visibleUnitColumns.includes("csm") && <TableHead className="font-semibold">CSM</TableHead>}
                      {visibleUnitColumns.includes("agm") && <TableHead className="font-semibold">AGM</TableHead>}
                      {visibleUnitColumns.includes("lc") && <TableHead className="font-semibold">LC</TableHead>}
                      {visibleUnitColumns.includes("fc") && <TableHead className="font-semibold">FC</TableHead>}
                      {visibleUnitColumns.includes("mrs") && <TableHead className="font-semibold">MRS</TableHead>}
                      {visibleUnitColumns.includes("type") && <TableHead className="font-semibold">Type</TableHead>}
                      {visibleUnitColumns.includes("tags") && <TableHead className="font-semibold">Tags</TableHead>}
                      {visibleUnitColumns.includes("portfolioGroup") && <TableHead className="font-semibold">Portfolio Group</TableHead>}
                      {visibleUnitColumns.includes("propertyGroup") && <TableHead className="font-semibold">Property Group</TableHead>}
                      {visibleUnitColumns.includes("dateAdded") && <TableHead className="font-semibold">Date Added</TableHead>}
                      {visibleUnitColumns.includes("propertyStatus") && <TableHead className="font-semibold">Property Status</TableHead>}
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProperties.map((property) => (
                  <TableRow
                    key={property.id}
                    onClick={() => handlePropertyClick(property.id)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {viewToggle === "properties" ? (
                      <>
                        {visiblePropertyColumns.includes("propertyName") && (
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2 text-[rgba(1,96,209,1)]">
                              <div className="p-1.5 rounded bg-gray-100">
                                <Building2 className="h-4 w-4 text-[rgba(1,96,209,1)]" />
                              </div>
                              <span className="whitespace-nowrap">{property.name}</span>
                            </div>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("propertyAddress") && (
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="max-w-[200px] truncate">{property.address}</span>
                            </div>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("unitCount") && (
                          <TableCell className="text-center">
                            <span className="font-semibold text-gray-900">{property.units}</span>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("ownerName") && (
                          <TableCell>
                            <span className="max-w-[120px] truncate block">{property.ownerName}</span>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("occupancy") && (
                          <TableCell className="text-center">
                            {property.occupancyStatus === "Vacant" ? (
                              <Badge className="bg-[#E46A5D]/15 text-[#E46A5D] hover:bg-[#E46A5D]/25"><XCircle className="h-3 w-3 mr-1" />Vacant</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Occupied</Badge>
                            )}
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("csr") && <TableCell><span className="text-xs whitespace-nowrap">{property.csr}</span></TableCell>}
                        {visiblePropertyColumns.includes("csm") && <TableCell><span className="text-xs whitespace-nowrap">{property.csm}</span></TableCell>}
                        {visiblePropertyColumns.includes("agm") && <TableCell><span className="text-xs whitespace-nowrap">{property.agm}</span></TableCell>}
                        {visiblePropertyColumns.includes("lc") && <TableCell><span className="text-xs whitespace-nowrap">{property.lc}</span></TableCell>}
                        {visiblePropertyColumns.includes("fc") && <TableCell><span className="text-xs whitespace-nowrap">{property.fc}</span></TableCell>}
                        {visiblePropertyColumns.includes("mrs") && <TableCell><span className="text-xs whitespace-nowrap">{property.mrs}</span></TableCell>}
                        {visiblePropertyColumns.includes("type") && (
                          <TableCell>
                            <Badge className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">{property.type}</Badge>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("tags") && (
                          <TableCell>
                            <div className="flex flex-wrap gap-1">{property.tags.map((t) => (<Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>))}</div>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("portfolioGroup") && <TableCell><span className="text-xs whitespace-nowrap">{property.portfolioGroup}</span></TableCell>}
                        {visiblePropertyColumns.includes("propertyGroup") && <TableCell><span className="text-xs whitespace-nowrap">{property.propertyGroup}</span></TableCell>}
                        {visiblePropertyColumns.includes("dateAdded") && (
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(property.dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          </TableCell>
                        )}
                        {visiblePropertyColumns.includes("propertyStatus") && (
                          <TableCell>
                            <Badge className={`text-xs whitespace-nowrap ${
                              property.propertyStatus === "Active" ? "bg-green-100 text-green-700" :
                              property.propertyStatus === "Under Termination" ? "bg-red-100 text-red-700" :
                              property.propertyStatus === "Hidden" ? "bg-slate-200 text-slate-600" :
                              "bg-amber-100 text-amber-700"
                            }`}>{property.propertyStatus}</Badge>
                          </TableCell>
                        )}
                      </>
                    ) : (
                      <>
                        {visibleUnitColumns.includes("unitAddress") && (
                          <TableCell>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); nav.go("unitDetail", { id: `${100 + (Number(property.id) % Math.max(property.units, 1))}`, propertyId: property.id }) }}
                              className="flex items-center gap-1.5 text-[rgba(1,96,209,1)] hover:underline"
                            >
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="max-w-[200px] truncate">{property.unitAddress}</span>
                            </button>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("propertyName") && (
                          <TableCell className="font-medium">
                            <span className="text-[rgba(1,96,209,1)] whitespace-nowrap">{property.name}</span>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("ownerName") && (
                          <TableCell>
                            <span className="max-w-[120px] truncate block">{property.ownerName}</span>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("tenantName") && (
                          <TableCell>
                            <span className="max-w-[120px] truncate block">{property.tenantName}</span>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("occupancy") && (
                          <TableCell className="text-center">
                            {property.occupancyStatus === "Vacant" ? (
                              <Badge className="bg-[#E46A5D]/15 text-[#E46A5D] hover:bg-[#E46A5D]/25"><XCircle className="h-3 w-3 mr-1" />Vacant</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Occupied</Badge>
                            )}
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("csr") && <TableCell><span className="text-xs whitespace-nowrap">{property.csr}</span></TableCell>}
                        {visibleUnitColumns.includes("csm") && <TableCell><span className="text-xs whitespace-nowrap">{property.csm}</span></TableCell>}
                        {visibleUnitColumns.includes("agm") && <TableCell><span className="text-xs whitespace-nowrap">{property.agm}</span></TableCell>}
                        {visibleUnitColumns.includes("lc") && <TableCell><span className="text-xs whitespace-nowrap">{property.lc}</span></TableCell>}
                        {visibleUnitColumns.includes("fc") && <TableCell><span className="text-xs whitespace-nowrap">{property.fc}</span></TableCell>}
                        {visibleUnitColumns.includes("mrs") && <TableCell><span className="text-xs whitespace-nowrap">{property.mrs}</span></TableCell>}
                        {visibleUnitColumns.includes("type") && (
                          <TableCell>
                            <Badge className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">{property.type}</Badge>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("tags") && (
                          <TableCell>
                            <div className="flex flex-wrap gap-1">{property.tags.map((t) => (<Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>))}</div>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("portfolioGroup") && <TableCell><span className="text-xs whitespace-nowrap">{property.portfolioGroup}</span></TableCell>}
                        {visibleUnitColumns.includes("propertyGroup") && <TableCell><span className="text-xs whitespace-nowrap">{property.propertyGroup}</span></TableCell>}
                        {visibleUnitColumns.includes("dateAdded") && (
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(property.dateAdded).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          </TableCell>
                        )}
                        {visibleUnitColumns.includes("propertyStatus") && (
                          <TableCell>
                            <Badge className={`text-xs whitespace-nowrap ${
                              property.propertyStatus === "Active" ? "bg-green-100 text-green-700" :
                              property.propertyStatus === "Under Termination" ? "bg-red-100 text-red-700" :
                              property.propertyStatus === "Hidden" ? "bg-slate-200 text-slate-600" :
                              "bg-amber-100 text-amber-700"
                            }`}>{property.propertyStatus}</Badge>
                          </TableCell>
                        )}
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          </>
        )}

        {filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {filteredProperties.length > 0 && hasMoreProperties && (
          <div className="flex flex-col items-center gap-2 mt-8 pb-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(visibleCount, totalProperties)} of {totalProperties} {viewToggle === "units" ? "units" : "properties"}
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
      </div>

      {/* Quick Actions Panel - fixed, scrolls independently */}
      <div className="hidden lg:flex w-[200px] shrink-0 flex-col h-full overflow-y-auto border-l border-border bg-background">
        <Card className="border-0 shadow-none rounded-none">
          <CardContent className="p-5">
            <h3 className="text-base font-semibold text-foreground mb-5">Quick Actions</h3>

            {/* Tasks subsection */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-semibold text-foreground">Tasks</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Building2, label: "New Property" },
                  { icon: FolderPlus, label: "New Property Group" },
                  { icon: Key, label: "Manage Lockboxes" },
                  { icon: Building, label: "New Association" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports subsection */}
            <div className="mb-5 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Reports</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: FileText, label: "Property Directory" },
                  { icon: Home, label: "Unit Directory" },
                  { icon: DollarSign, label: "Rent Roll" },
                  { icon: FileBarChart, label: "Unit Vacancy Detail" },
                  { icon: BarChart3, label: "General Ledger" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Statements subsection */}
            <div className="mb-5 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Statements</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Settings, label: "Bulk Update Statement Settings" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Help Topics subsection */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Help Topics</span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: "View, Edit & Add Properties" },
                  { label: "Managing Property Groups" },
                ].map(({ label }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/30 transition-colors text-left"
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
