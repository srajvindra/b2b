"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Users,
  Home,
  CalendarDays,
  CheckCircle,
  XCircle,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNav } from "./dashboard-app"

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
]

export default function PropertiesPage() {
  const nav = useNav()
  const [searchQuery, setSearchQuery] = useState("")
  const [unitsFilter, setUnitsFilter] = useState<string>("all")
  const [vacancyFilter, setVacancyFilter] = useState<string>("all")
  const [dateSort, setDateSort] = useState<string>("newest")
  const [visibleCount, setVisibleCount] = useState(12)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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
  const hasMoreProperties = totalProperties > endIndex

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
            <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
            <p className="text-sm text-muted-foreground">Manage your property portfolio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProperties.map((property) => (
            <Card
              key={property.id}
              onClick={() => handlePropertyClick(property.id)}
              className={`flex flex-col overflow-hidden border-2 transition-all duration-200 hover:shadow-xl group cursor-pointer ${
                property.type === "Multi-Family"
                  ? "bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 border-teal-200 hover:border-teal-400"
                  : "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-purple-200 hover:border-purple-400"
              }`}
            >
              <div
                className={`p-5 border-b relative overflow-hidden ${
                  property.type === "Multi-Family"
                    ? "bg-gradient-to-br from-teal-100/50 via-cyan-100/30 to-transparent border-teal-200"
                    : "bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-transparent border-purple-200"
                }`}
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="space-y-2 flex-1">
                    <h3
                      className={`font-bold text-lg leading-tight transition-colors ${
                        property.type === "Multi-Family" ? "group-hover:text-teal-700" : "group-hover:text-purple-700"
                      }`}
                    >
                      {property.name}
                    </h3>
                    <div
                      className={`flex items-start text-sm gap-1.5 ${
                        property.type === "Multi-Family" ? "text-teal-700" : "text-purple-700"
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          property.type === "Multi-Family" ? "text-teal-600" : "text-purple-600"
                        }`}
                      />
                      <span className="line-clamp-2">{property.address}</span>
                    </div>
                  </div>
                  {property.hasVacancy ? (
                    <div className="p-2 rounded-full bg-emerald-500/20">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                  ) : (
                    <div
                      className={`p-2 rounded-full ${
                        property.type === "Multi-Family" ? "bg-teal-100" : "bg-purple-100"
                      }`}
                    >
                      <XCircle
                        className={`h-5 w-5 ${property.type === "Multi-Family" ? "text-teal-400" : "text-purple-400"}`}
                      />
                    </div>
                  )}
                </div>
                <Badge
                  variant={property.type === "Multi-Family" ? "default" : "secondary"}
                  className={`text-xs font-semibold ${
                    property.type === "Multi-Family"
                      ? "bg-teal-500 hover:bg-teal-600 text-white"
                      : "bg-purple-500 text-white hover:bg-purple-600"
                  }`}
                >
                  {property.type}
                </Badge>
              </div>

              <CardContent className="p-5 space-y-4 flex-1">
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      property.type === "Multi-Family"
                        ? "bg-teal-100/50 border-teal-200"
                        : "bg-purple-100/50 border-purple-200"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                        property.type === "Multi-Family" ? "text-teal-700" : "text-purple-700"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded ${
                          property.type === "Multi-Family" ? "bg-teal-500" : "bg-purple-500"
                        }`}
                      >
                        <Home className="w-3.5 h-3.5 text-white" />
                      </div>
                      Units
                    </span>
                    <p
                      className={`font-bold text-lg ${
                        property.type === "Multi-Family" ? "text-teal-700" : "text-purple-700"
                      }`}
                    >
                      {property.units}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                      <div className="bg-emerald-500 p-1.5 rounded">
                        <Building2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      Vacancy
                    </span>
                    <Badge
                      variant={property.hasVacancy ? "default" : "secondary"}
                      className={`text-xs font-semibold ${
                        property.hasVacancy
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {property.hasVacancy ? "Yes" : "No"}
                    </Badge>
                  </div>

                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      property.type === "Multi-Family"
                        ? "bg-cyan-100/50 border-cyan-200"
                        : "bg-pink-100/50 border-pink-200"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                        property.type === "Multi-Family" ? "text-cyan-700" : "text-pink-700"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded ${property.type === "Multi-Family" ? "bg-cyan-500" : "bg-pink-500"}`}
                      >
                        <Users className="w-3.5 h-3.5 text-white" />
                      </div>
                      Owner
                    </span>
                    <p
                      className={`font-semibold text-sm truncate max-w-[150px] ${
                        property.type === "Multi-Family" ? "text-cyan-900" : "text-pink-900"
                      }`}
                      title={property.ownerName}
                    >
                      {property.ownerName}
                    </p>
                  </div>

                  <div
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      property.type === "Multi-Family"
                        ? "bg-sky-100/50 border-sky-200"
                        : "bg-rose-100/50 border-rose-200"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                        property.type === "Multi-Family" ? "text-sky-700" : "text-rose-700"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded ${property.type === "Multi-Family" ? "bg-sky-500" : "bg-rose-500"}`}
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-white" />
                      </div>
                      Added
                    </span>
                    <p
                      className={`font-semibold text-sm ${
                        property.type === "Multi-Family" ? "text-sky-900" : "text-rose-900"
                      }`}
                    >
                      {new Date(property.dateAdded).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>

              <div
                className={`px-5 py-4 border-t mt-auto ${
                  property.type === "Multi-Family"
                    ? "bg-gradient-to-r from-teal-100 via-cyan-100 to-sky-100 border-teal-200"
                    : "bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 border-purple-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-full ${property.type === "Multi-Family" ? "bg-teal-500" : "bg-purple-500"}`}
                  >
                    <UserCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wide ${
                        property.type === "Multi-Family" ? "text-teal-600" : "text-purple-600"
                      }`}
                    >
                      Handling Staff
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        property.type === "Multi-Family" ? "text-teal-900" : "text-purple-900"
                      }`}
                    >
                      {property.staffName}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
