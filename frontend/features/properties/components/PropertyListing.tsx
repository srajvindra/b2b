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
import { useRouter } from "next/navigation"
import { MOCK_PROPERTIES } from "../data/mockProperties"

export default function AllPropertiesPage() {
  const router = useRouter()
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
    router.push(`/properties/${propertyId}`)
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
