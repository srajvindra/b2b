/* Vendors, Property Technicians & Leasing Agents page extracted from ContactsPage.tsx */
"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  ChevronUp,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Wrench,
  UserCheck,
  Home,
  Briefcase,
  MapPin,
  MoreHorizontal,
  ArrowUpDown,
  Clock,
} from "lucide-react"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import type { Contact, ContactPageType, Vendor } from "@/features/contacts/types"
import { MOCK_CONTACTS } from "@/features/contacts/data/mockContacts"
import { MOCK_VENDORS, TRADE_OPTIONS } from "@/features/contacts/data/mockVendors"
import { StaffContactDetailSheet } from "@/features/contacts/components/StaffContactDetailSheet"
import { ContactTabsStats } from "@/components/shared/contact-tabs"

interface StaffVendorsPageProps {
  type: Extract<ContactPageType, "vendor" | "property-technician" | "leasing-agent">
}

export default function StaffVendorsPage({ type }: StaffVendorsPageProps) {
  const activeTab: "vendors" | "property-technician" | "leasing-agent" =
    type === "vendor" ? "vendors" : type === "property-technician" ? "property-technician" : "leasing-agent"

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter] = useState<"all" | "Active" | "Pending">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const [vendorsViewMode, setVendorsViewMode] = useState<"list" | "grid">("list")
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

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const getTypeColor = (contactType: Contact["type"]) => {
    switch (contactType) {
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

  const getPageTitle = () => {
    switch (activeTab) {
      case "vendors":
        return "Vendors"
      case "property-technician":
        return "Property Technicians"
      case "leasing-agent":
        return "Leasing Agents"
      default:
        return "Contacts"
    }
  }

  const getPageDescription = () => {
    switch (activeTab) {
      case "vendors":
        return "Manage your vendor relationships and service providers."
      case "property-technician":
        return "Manage your in-house property technicians and maintenance staff."
      case "leasing-agent":
        return "Manage your leasing agents and their property assignments."
      default:
        return "View and manage your contacts."
    }
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
    const aValue = (a[vendorSortColumn] || "") as string
    const bValue = (b[vendorSortColumn] || "") as string
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

  const filteredContacts = MOCK_CONTACTS.filter((contact) => {
    if (activeTab === "vendors" && contact.type !== "Vendor") return false
    if (activeTab === "property-technician" && contact.type !== "Property Technician") return false
    if (activeTab === "leasing-agent" && contact.type !== "Leasing Agent") return false

    if (statusFilter !== "all" && contact.status !== statusFilter) return false

    const q = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.properties.some((p) => p.toLowerCase().includes(q)) ||
      (contact.specialty && contact.specialty.toLowerCase().includes(q))
    )
  })

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleContacts = filteredContacts.slice(startIndex, endIndex)

  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDetailOpen(true)
  }

  const renderStatsCards = () => {
    if (activeTab === "vendors") {
      return <ContactTabsStats variant="vendors" vendors={MOCK_VENDORS} />
    }
    if (activeTab === "property-technician") {
      return (
        <ContactTabsStats
          variant="property-technician"
          technicians={MOCK_CONTACTS.filter((c) => c.type === "Property Technician")}
        />
      )
    }
    if (activeTab === "leasing-agent") {
      return (
        <ContactTabsStats
          variant="leasing-agent"
          agents={MOCK_CONTACTS.filter((c) => c.type === "Leasing Agent")}
        />
      )
    }
    return null
  }

  const renderStaffContent = () => {
    if (
      (activeTab === "property-technician" && techniciansViewMode === "grid") ||
      (activeTab === "leasing-agent" && leasingAgentsViewMode === "grid")
    ) {
      let cardBorderClass = ""
      if (activeTab === "property-technician") cardBorderClass = "border-l-4 border-l-warning"
      if (activeTab === "leasing-agent") cardBorderClass = "border-l-4 border-l-accent-foreground"

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleContacts.map((contact) => (
            <Card
              key={contact.id}
              className={`overflow-hidden border-border bg-background/60 shadow-sm hover:shadow-md transition-shadow ${cardBorderClass}`}
              onClick={() => handleRowClick(contact)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-[rgba(1,96,209,1)] truncate">{contact.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <span>{contact.location}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getTypeColor(contact.type)}>
                        {contact.type}
                      </Badge>
                    </div>
                    {contact.specialty && (
                      <div className="mt-1 text-xs text-muted-foreground">{contact.specialty}</div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contact.properties.slice(0, 2).map((prop, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-secondary border-border text-muted-foreground"
                        >
                          {prop}
                        </Badge>
                      ))}
                      {contact.properties.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-secondary text-muted-foreground">
                          +{contact.properties.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{contact.lastActive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    // list view
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
                        {contact.properties.slice(0, 2).map((prop, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs bg-secondary border-border text-muted-foreground"
                          >
                            {prop}
                          </Badge>
                        ))}
                        {contact.properties.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-secondary border-border text-muted-foreground"
                          >
                            +{contact.properties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground truncate max-w-[150px]">
                            {contact.email}
                          </span>
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
                            {contact.assignedStaff?.split(" ").map((n) => n[0]).join("") || "?"}
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

  if (activeTab === "vendors") {
    return (
      <div className="flex flex-col h-full space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
            <p className="text-muted-foreground">{getPageDescription()}</p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

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
                    className={`cursor-pointer hover:bg-muted/80 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/50"
                    }`}
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

  return (
    <div className="flex flex-col h-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
      </div>

      {renderStatsCards()}

      {/* Filters & Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${getPageTitle().toLowerCase()}...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                className={`rounded-r-none ${
                  leasingAgentsViewMode === "grid" ? "bg-primary hover:bg-primary-hover" : ""
                }`}
                onClick={() => setLeasingAgentsViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={leasingAgentsViewMode === "list" ? "default" : "ghost"}
                size="icon"
                className={`rounded-l-none ${
                  leasingAgentsViewMode === "list" ? "bg-primary hover:bg-primary-hover" : ""
                }`}
                onClick={() => setLeasingAgentsViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {/* <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length}{" "}
          {getPageTitle().toLowerCase()}
        </div> */}
      </div>

      {renderStaffContent()}

      <StaffContactDetailSheet
        contact={selectedContact}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}

