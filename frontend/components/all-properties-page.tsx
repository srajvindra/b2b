"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
    name: "Spring Gardens",
    address: "987 Spring St, Atlanta, GA 30301",
    type: "Multi-Family",
    units: 22,
    hasVacancy: true,
    ownerName: "Sarah Lee",
    dateAdded: "2024-01-05",
    staffName: "Sarah Mitchell",
  },
  {
    id: "16",
    name: "Parkside Commons",
    address: "147 Park Ave, Minneapolis, MN 55401",
    type: "Multi-Family",
    units: 38,
    hasVacancy: false,
    ownerName: "Linda Martinez",
    dateAdded: "2023-11-28",
    staffName: "John Smith",
  },
  {
    id: "17",
    name: "Maple Ridge",
    address: "258 Maple Dr, Detroit, MI 48201",
    type: "Single-Family",
    units: 1,
    hasVacancy: true,
    ownerName: "Robert Taylor",
    dateAdded: "2024-05-30",
    staffName: "Jane Doe",
  },
  {
    id: "18",
    name: "Valley View Apartments",
    address: "369 Valley Rd, Las Vegas, NV 89101",
    type: "Multi-Family",
    units: 42,
    hasVacancy: true,
    ownerName: "Emma Wilson",
    dateAdded: "2024-02-08",
    staffName: "Mike Johnson",
  },
  {
    id: "19",
    name: "Riverside Heights",
    address: "741 River View, Portland, OR 97204",
    type: "Multi-Family",
    units: 26,
    hasVacancy: false,
    ownerName: "Michael Chen",
    dateAdded: "2024-12-12",
    staffName: "Sarah Mitchell",
  },
  {
    id: "20",
    name: "Broadway Plaza",
    address: "852 Broadway, New York, NY 10003",
    type: "Multi-Family",
    units: 58,
    hasVacancy: true,
    ownerName: "Sarah Lee",
    dateAdded: "2024-03-15",
    staffName: "John Smith",
  },
  {
    id: "21",
    name: "Cedar Point",
    address: "963 Cedar Ave, Charlotte, NC 28201",
    type: "Multi-Family",
    units: 30,
    hasVacancy: false,
    ownerName: "Linda Martinez",
    dateAdded: "2024-06-20",
    staffName: "Jane Doe",
  },
  {
    id: "22",
    name: "Hillside Residence",
    address: "159 Hill St, Salt Lake City, UT 84101",
    type: "Single-Family",
    units: 1,
    hasVacancy: true,
    ownerName: "Robert Taylor",
    dateAdded: "2024-04-25",
    staffName: "Mike Johnson",
  },
  {
    id: "23",
    name: "Bay Shore Complex",
    address: "357 Bay Shore Dr, Tampa, FL 33602",
    type: "Multi-Family",
    units: 48,
    hasVacancy: true,
    ownerName: "Emma Wilson",
    dateAdded: "2023-10-30",
    staffName: "Sarah Mitchell",
  },
  {
    id: "24",
    name: "Summit Place",
    address: "486 Summit Ave, Columbus, OH 43201",
    type: "Multi-Family",
    units: 34,
    hasVacancy: false,
    ownerName: "Michael Chen",
    dateAdded: "2024-05-08",
    staffName: "John Smith",
  },
  // Additional properties (25-55) to reach ~50 total
  {
    id: "25",
    name: "Pacific Heights Towers",
    address: "1200 Pacific Ave, San Francisco, CA 94115",
    type: "Multi-Family",
    units: 72,
    hasVacancy: true,
    ownerName: "William Park",
    dateAdded: "2024-01-10",
    staffName: "John Smith",
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
    staffName: "Jane Doe",
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
    staffName: "Mike Johnson",
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
    staffName: "Sarah Mitchell",
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
    staffName: "John Smith",
  },
  {
    id: "30",
    name: "Desert Oasis",
    address: "3300 Desert Springs Rd, Phoenix, AZ 85004",
    type: "Multi-Family",
    units: 32,
    hasVacancy: true,
    ownerName: "Maria Garcia",
    dateAdded: "2024-01-22",
    staffName: "Jane Doe",
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
    staffName: "Mike Johnson",
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
    staffName: "Sarah Mitchell",
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
    staffName: "John Smith",
  },
  {
    id: "34",
    name: "Manhattan Heights",
    address: "500 Park Ave, New York, NY 10022",
    type: "Multi-Family",
    units: 120,
    hasVacancy: true,
    ownerName: "Alexander Sterling",
    dateAdded: "2023-11-15",
    staffName: "Jane Doe",
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
    staffName: "Mike Johnson",
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
    staffName: "Sarah Mitchell",
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
    staffName: "John Smith",
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
    staffName: "Jane Doe",
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
    staffName: "Mike Johnson",
  },
  {
    id: "40",
    name: "Midwest Plaza",
    address: "800 Michigan Ave, Chicago, IL 60611",
    type: "Multi-Family",
    units: 38,
    hasVacancy: true,
    ownerName: "Thomas Baker",
    dateAdded: "2024-01-18",
    staffName: "Sarah Mitchell",
  },
  {
    id: "41",
    name: "Lakeshore Estates",
    address: "1500 Lake Shore Dr, Chicago, IL 60610",
    type: "Multi-Family",
    units: 62,
    hasVacancy: false,
    ownerName: "Katherine Wright",
    dateAdded: "2024-02-22",
    staffName: "John Smith",
  },
  {
    id: "42",
    name: "Wrigleyville Commons",
    address: "3600 Clark St, Chicago, IL 60613",
    type: "Multi-Family",
    units: 28,
    hasVacancy: true,
    ownerName: "Patrick Murphy",
    dateAdded: "2024-03-28",
    staffName: "Jane Doe",
  },
  {
    id: "43",
    name: "Lincoln Park Suites",
    address: "2200 Lincoln Ave, Chicago, IL 60614",
    type: "Multi-Family",
    units: 35,
    hasVacancy: true,
    ownerName: "Samantha Green",
    dateAdded: "2024-04-15",
    staffName: "Mike Johnson",
  },
  {
    id: "44",
    name: "Bucktown Residences",
    address: "1800 Damen Ave, Chicago, IL 60647",
    type: "Multi-Family",
    units: 22,
    hasVacancy: false,
    ownerName: "Christopher Lee",
    dateAdded: "2024-05-20",
    staffName: "Sarah Mitchell",
  },
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
    staffName: "John Smith",
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
    staffName: "Jane Doe",
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
    staffName: "Mike Johnson",
  },
]

export default function AllPropertiesPage() {
  const nav = useNav()
  const [searchQuery, setSearchQuery] = useState("")
  const [unitsFilter, setUnitsFilter] = useState<string>("all")
  const [vacancyFilter, setVacancyFilter] = useState<string>("all")
  const [dateSort, setDateSort] = useState<string>("newest")
  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreProperties, setHasMoreProperties] = useState(true)

  const filteredProperties = MOCK_PROPERTIES.filter((property) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      property.address.toLowerCase().includes(searchLower) ||
      property.ownerName.toLowerCase().includes(searchLower) ||
      property.staffName.toLowerCase().includes(searchLower) ||
      property.name.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    if (unitsFilter === "single" && property.units !== 1) return false
    if (unitsFilter === "small" && (property.units < 2 || property.units > 10)) return false
    if (unitsFilter === "medium" && (property.units < 11 || property.units > 25)) return false
    if (unitsFilter === "large" && property.units < 26) return false

    if (vacancyFilter === "yes" && !property.hasVacancy) return false
    if (vacancyFilter === "no" && property.hasVacancy) return false

    return true
  }).sort((a, b) => {
    if (dateSort === "newest") {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    } else {
      return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    }
  })

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

  const handleFilterChange = (filterSetter: (value: string) => void, value: string) => {
    filterSetter(value)
    setCurrentPage(1)
  }

  const handlePropertyClick = (propertyId: string) => {
    nav.go("propertyDetail", { id: propertyId })
  }

  return (
    <div className="h-full flex flex-col">
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

      <div className="border-b bg-card p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address, owner name, or staff name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
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
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={unitsFilter} onValueChange={(v) => handleFilterChange(setUnitsFilter, v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                <SelectItem value="single">Single Unit</SelectItem>
                <SelectItem value="small">2-10 Units</SelectItem>
                <SelectItem value="medium">11-25 Units</SelectItem>
                <SelectItem value="large">26+ Units</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vacancyFilter} onValueChange={(v) => handleFilterChange(setVacancyFilter, v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vacancy Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="yes">Has Vacancy</SelectItem>
                <SelectItem value="no">No Vacancy</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateSort} onValueChange={(v) => handleFilterChange(setDateSort, v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length}{" "}
              properties
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
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
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Property</TableHead>
                  <TableHead className="font-semibold">Address</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold text-center">Units</TableHead>
                  <TableHead className="font-semibold text-center">Vacancy</TableHead>
                  <TableHead className="font-semibold">Owner</TableHead>
                  <TableHead className="font-semibold">{"Assignee"}</TableHead>
                  <TableHead className="font-semibold">Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProperties.map((property) => (
                  <TableRow
                    key={property.id}
                    onClick={() => handlePropertyClick(property.id)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2 text-[rgba(1,96,209,1)]">
                        <div className="p-1.5 rounded bg-gray-100">
                          <Building2 className="h-4 w-4 text-[rgba(1,96,209,1)]" />
                        </div>
                        {property.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="max-w-[200px] truncate">{property.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">{property.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-gray-900">{property.units}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {property.hasVacancy ? (
                        <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="max-w-[120px] truncate">{property.ownerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="max-w-[120px] truncate">{property.staffName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(property.dateAdded).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
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
              Showing {Math.min(visibleCount, totalProperties)} of {totalProperties} properties
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
  )
}
