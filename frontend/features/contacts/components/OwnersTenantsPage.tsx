/* Owners & Tenants page extracted from ContactsPage.tsx */
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Phone,
  Mail,
  Building2,
  Users,
  UserCheck,
  Clock,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  LogOut,
  Gavel,
  Layers,
  MoreHorizontal,
  UserPlus,
  Settings,
  FileText,
  Send,
  Star,
  Home,
  ClipboardList,
  BarChart3,
  LayoutGrid,
  List,
  Filter,
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
import { BulkActionBar } from "@/components/bulk-action-bar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import type {
  Contact,
  ContactStatus,
  ContactPageType,
  ContactActivity,
  ContactPayment,
  ContactNote,
} from "@/features/contacts/types"
import { MOCK_CONTACTS } from "@/features/contacts/data/mockContacts"
import {
  PROPERTY_UNIT_MAP,
  MOCK_ACTIVITIES,
  MOCK_PAYMENTS,
  MOCK_NOTES,
} from "@/features/contacts/data/constants"
import { OWNER_CONTACT_FILTER_FIELDS, TENANT_CONTACT_FILTER_FIELDS, getOwnerContactFilterOptions, getTenantContactFilterOptions, OWNER_CONTACT_FIELDS_WITH_SELECT_ALL, TENANT_CONTACT_FIELDS_WITH_SELECT_ALL } from "@/features/contacts/data/filters"
import { useQuickActions } from "@/context/QuickActionsContext"
import {
  contactsOwnersQuickActions,
  contactsTenantsQuickActions,
} from "@/lib/quickActions"
import { ContactTabsStats } from "@/components/shared/contact-tabs"
import type { OwnerStatsKey, TenantStatsKey } from "@/components/shared/contact-tabs/ContactTabsStats"

interface OwnersTenantsPageProps {
  type: Extract<ContactPageType, "owner" | "tenant">
}

const ITEMS_PER_PAGE = 20

const uniqueArray = <T,>(values: T[]) => Array.from(new Set(values))

export default function OwnersTenantsPage({ type }: OwnersTenantsPageProps) {
  const router = useRouter()
  const activeTab = type === "owner" ? "owners" : "tenants"

  const quickActions = useMemo(
    () => (type === "owner" ? contactsOwnersQuickActions : contactsTenantsQuickActions),
    [type]
  )
  useQuickActions(quickActions, {
    subtitle: type === "owner" ? "Contacts - Owners" : "Contacts - Tenants",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Pending">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedContactIds([])
    setCurrentPage(1)
  }, [activeTab])

  const [ownersViewMode, setOwnersViewMode] = useState<"list" | "grid">("list")
  const [tenantsViewMode, setTenantsViewMode] = useState<"list" | "grid">("list")

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

  // Owner stats multi-select filters
  const [ownerStatsFilters, setOwnerStatsFilters] = useState<OwnerStatsKey[]>([])

  // Tenant stats multi-select filters
  const [tenantStatsFilters, setTenantStatsFilters] = useState<TenantStatsKey[]>([])

  // Get unique values for filter options
  const ownerTenantContacts = MOCK_CONTACTS.filter(
    (c) => c.type === "Owner" || c.type === "Tenant",
  )
  const uniqueStatuses = uniqueArray(ownerTenantContacts.map((c) => c.status))
  const uniqueAssignees = uniqueArray(ownerTenantContacts.map((c) => c.assignedStaff).filter(Boolean))
  const uniqueLocations = uniqueArray(ownerTenantContacts.map((c) => c.location).filter(Boolean))
  const uniqueLastActive = ["Less than 1 hour", "1-6 hours", "1 day", "2-7 days", "More than 1 week"]
  const uniqueUnits = uniqueArray(
    ownerTenantContacts.filter((c) => c.units !== undefined).map((c) => c.units!),
  ).sort((a, b) => a - b)
  const uniqueCompanyLlc = uniqueArray(
    MOCK_CONTACTS.filter((c) => c.type === "Owner" && c.companyLlc).map((c) => c.companyLlc!),
  ).sort()
  const uniqueCsm = uniqueArray(
    MOCK_CONTACTS.filter((c) => c.type === "Owner" && c.csm).map((c) => c.csm!),
  ).sort()

  // Advanced filter modal configuration (UI-only, mirrors LeadsPageContent behavior)
  const advancedFilterFields: string[] = type === "owner" ? OWNER_CONTACT_FILTER_FIELDS : TENANT_CONTACT_FILTER_FIELDS
  const advancedFieldsWithSelectAll: string[] = type === "owner" ? OWNER_CONTACT_FIELDS_WITH_SELECT_ALL : TENANT_CONTACT_FIELDS_WITH_SELECT_ALL

  const getAdvancedFilterOptions = type === "owner" ? getOwnerContactFilterOptions : getTenantContactFilterOptions

  const showAdvancedFilterButton = true

  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false)
  const [modalFilterField, setModalFilterField] = useState("")
  const [modalFilterValues, setModalFilterValues] = useState<string[]>([])
  const [modalOptionSearch, setModalOptionSearch] = useState("")
  const [modalFieldSearch, setModalFieldSearch] = useState("")
  const [showFieldDropdown, setShowFieldDropdown] = useState(false)

  const closeAdvancedFilterModal = () => {
    setShowAdvancedFilterModal(false)
    setModalFilterField("")
    setModalFilterValues([])
    setModalOptionSearch("")
    setModalFieldSearch("")
    setShowFieldDropdown(false)
  }

  const applyAdvancedFilter = () => {
    if (!modalFilterField || modalFilterValues.length === 0) return
    // For now this only closes the modal; column popover filters remain the primary filtering mechanism.
    setShowAdvancedFilterModal(false)
    setModalFilterField("")
    setModalFilterValues([])
    setModalOptionSearch("")
    setModalFieldSearch("")
  }

  const hasActiveColumnFilters =
    selectedStatuses.length > 0 ||
    selectedAssignees.length > 0 ||
    selectedLocations.length > 0 ||
    selectedLastActive.length > 0 ||
    selectedUnits.length > 0 ||
    selectedCompanyLlc.length > 0 ||
    selectedCsm.length > 0

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

  const getLastActiveCategory = (lastActive: string): string => {
    const lower = lastActive.toLowerCase()
    if (lower.includes("hour") && !lower.includes("hours")) return "Less than 1 hour"
    if (lower.includes("hours")) return "1-6 hours"
    if (lower === "1 day ago" || lower.includes("1 day")) return "1 day"
    if (lower.includes("day") && !lower.includes("week")) return "2-7 days"
    return "More than 1 week"
  }

  // First apply base filters (tab, status, column filters, search)
  const baseContacts = MOCK_CONTACTS.filter((contact) => {
    if (activeTab === "owners" && contact.type !== "Owner") return false
    if (activeTab === "tenants" && contact.type !== "Tenant") return false

    if (statusFilter !== "all" && contact.status !== statusFilter) return false

    // Column filters
    // Status
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(contact.status)) return false
    // Assignee/CSR
    if (selectedAssignees.length > 0 && !selectedAssignees.includes(contact.assignedStaff)) return false
    // Company/LLC (owners only)
    if (selectedCompanyLlc.length > 0 && !selectedCompanyLlc.includes(contact.companyLlc || "")) return false
    // CSM (owners only)
    if (selectedCsm.length > 0 && !selectedCsm.includes(contact.csm || "")) return false
    // Location
    if (selectedLocations.length > 0 && !selectedLocations.includes(contact.location)) return false
    // Last active
    if (selectedLastActive.length > 0) {
      const category = getLastActiveCategory(contact.lastActive)
      if (!selectedLastActive.includes(category)) return false
    }
    // Units
    if (selectedUnits.length > 0 && (contact.units === undefined || !selectedUnits.includes(contact.units))) {
      return false
    }

    const searchLower = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.properties.some((p) => p.toLowerCase().includes(searchLower)) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.companyLlc && contact.companyLlc.toLowerCase().includes(searchLower)) ||
      (contact.csm && contact.csm.toLowerCase().includes(searchLower))
    )
  })

  // Then apply stats-based filters on top of baseContacts
  const filteredContacts = baseContacts.filter((contact) => {
    // Owner stats filters (multi-select, OR across selected keys)
    if (activeTab === "owners" && contact.type === "Owner" && ownerStatsFilters.length > 0) {
      const matchesAnyOwnerStat = ownerStatsFilters.some((key) => {
        const rentCollected = contact.rentCollected || 0
        const delinquentAmount = contact.delinquentAmount || 0
        const income = contact.ownerIncome || 0
        const expense = contact.ownerExpense || 0
        const occupiedUnits = contact.occupiedUnits || 0
        const vacantUnits = contact.vacantUnits || 0
        const approvedWOs = contact.approvedWOs || 0
        const pendingApprovalWOs = contact.pendingApprovalWOs || 0

        switch (key) {
          case "collections-all":
            return rentCollected > 0 || delinquentAmount > 0
          case "collections-rent-collected":
            return rentCollected > 0
          case "collections-delinquent":
            return delinquentAmount > 0
          case "income-expenses-all":
            return income > 0 || expense > 0
          case "income-expenses-income":
            return income > 0
          case "income-expenses-expenses":
            return expense > 0
          case "properties-status-all":
            return occupiedUnits > 0 || vacantUnits > 0
          case "properties-status-occupied":
            return occupiedUnits > 0
          case "properties-status-vacant":
            return vacantUnits > 0
          case "maintenance-all":
            return approvedWOs > 0 || pendingApprovalWOs > 0
          case "maintenance-approved-wos":
            return approvedWOs > 0
          case "maintenance-pending-approval":
            return pendingApprovalWOs > 0
          default:
            return false
        }
      })

      if (!matchesAnyOwnerStat) return false
    }

    // Tenant stats filters (multi-select, OR across selected keys)
    if (activeTab === "tenants" && contact.type === "Tenant" && tenantStatsFilters.length > 0) {
      const hasPendingTask = (contact.tenantPendingTasks || 0) > 0
      const hasPendingProcess = (contact.tenantPendingProcesses || 0) > 0
      const hasMoveout = !!contact.moveOutStatus
      const hasEviction = !!contact.evictionStatus

      const matchesAnyTenantStat = tenantStatsFilters.some((key) => {
        switch (key) {
          case "tenant-total":
            return true
          case "tenant-active":
            return contact.status === "Active"
          case "pending-all":
            return hasPendingTask || hasPendingProcess
          case "pending-tasks":
            return hasPendingTask
          case "pending-processes":
            return hasPendingProcess
          case "moveout-all":
            return hasMoveout
          case "moveout-pending":
            return contact.moveOutStatus === "Pending"
          case "moveout-completed":
            return contact.moveOutStatus === "Completed"
          case "evictions-all":
            return hasEviction
          case "evictions-pending":
            return contact.evictionStatus === "Pending"
          case "evictions-completed":
            return contact.evictionStatus === "Completed"
          case "type-all":
            return true
          case "type-self-paying":
            return contact.tenantType === "Self Paying"
          case "type-section-8":
            return contact.tenantType === "Section 8"
          default:
            return false
        }
      })

      if (!matchesAnyTenantStat) return false
    }

    return true
  })

  const totalOwners = MOCK_CONTACTS.filter((c) => c.type === "Owner").length
  const totalTenants = MOCK_CONTACTS.filter((c) => c.type === "Tenant").length
  const activeContacts = MOCK_CONTACTS.filter((c) => c.status === "Active").length
  const pendingContacts = MOCK_CONTACTS.filter((c) => c.status === "Pending").length

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const visibleContacts = filteredContacts.slice(startIndex, endIndex)
  const totalContacts = filteredContacts.length
  const hasMoreContacts = endIndex < filteredContacts.length

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, totalContacts))
      setIsLoadingMore(false)
    }, 300)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

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

  const getTypeColor = (contactType: Contact["type"]) => {
    switch (contactType) {
      case "Owner":
        return "bg-success/10 text-success"
      case "Tenant":
        return "bg-chart-4/10 text-chart-4"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleRowClick = (contact: Contact) => {
    if (contact.type === "Owner") {
      router.push(`/contacts/owners/${contact.id}`)
      return
    }

    if (contact.type === "Tenant") {
      router.push(`/contacts/tenants/${contact.id}`)
      return
    }
  }

  const getPageTitle = () => (activeTab === "owners" ? "Owners" : "Tenants")

  const getPageDescription = () =>
    activeTab === "owners"
      ? "Manage property owner relationships and communications."
      : "View and manage tenant information and lease details."

  const renderContent = () => {
    // Grid view
    if (
      (activeTab === "owners" && ownersViewMode === "grid") ||
      (activeTab === "tenants" && tenantsViewMode === "grid")
    ) {
      let cardBorderClass = ""
      if (activeTab === "owners") cardBorderClass = "border-l-4 border-l-primary"
      if (activeTab === "tenants") cardBorderClass = "border-l-4 border-l-info"

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
                  {/* Selection checkbox (matches table + original UI) */}
                  <div
                    className="pt-1"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Checkbox
                      checked={selectedContactIds.includes(contact.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedContactIds((prev) => [...prev, contact.id])
                        } else {
                          setSelectedContactIds((prev) => prev.filter((id) => id !== contact.id))
                        }
                      }}
                    />
                  </div>
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
                      <Badge
                        variant="secondary"
                        className={getTypeColor(contact.type)}
                      >
                        {contact.type}
                      </Badge>
                    </div>
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
                  {contact.units !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Units:</span>
                      <span>{contact.units}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                    <span className="text-xs text-muted-foreground">{contact.lastActive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    // List view
    return (
      <Card className="flex-1 overflow-hidden bg-muted/30 border-border">
        <div className="rounded-md border border-border h-full overflow-auto bg-background/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted border-b-2 border-border">
                {(activeTab === "owners" || activeTab === "tenants") && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        visibleContacts.length > 0 &&
                        visibleContacts.every((c) => selectedContactIds.includes(c.id))
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedContactIds((prev) => [
                            ...new Set([...prev, ...visibleContacts.map((c) => c.id)]),
                          ])
                        } else {
                          const visibleIds = new Set(visibleContacts.map((c) => c.id))
                          setSelectedContactIds((prev) => prev.filter((id) => !visibleIds.has(id)))
                        }
                      }}
                    />
                  </TableHead>
                )}
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Properties / Company</TableHead>
                <TableHead className="font-semibold text-foreground">Contact Info</TableHead>
                <TableHead className="font-semibold text-foreground">Units</TableHead>
                <TableHead className="font-semibold text-foreground">
                  {activeTab === "owners" ? "CSR / CSM" : "Assignee"}
                </TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Last Active</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
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
                    className={`cursor-pointer hover:bg-secondary/80 transition-colors ${selectedContactIds.includes(contact.id) ? "bg-primary/5" : ""
                      }`}
                    onClick={() => handleRowClick(contact)}
                  >
                    {(activeTab === "owners" || activeTab === "tenants") && (
                      <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedContactIds.includes(contact.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedContactIds((prev) => [...prev, contact.id])
                            } else {
                              setSelectedContactIds((prev) => prev.filter((id) => id !== contact.id))
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
                    <TableCell>
                      {activeTab === "owners" ? (
                        <span className="text-sm text-muted-foreground">{contact.companyLlc || "-"}</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {contact.properties.slice(0, 2).map((prop, idx) => {
                            const mapping = PROPERTY_UNIT_MAP[prop]
                            const isTenant = contact.type === "Tenant"
                            if (isTenant && mapping) {
                              return (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs bg-primary/5 border-primary/30 text-primary"
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
                            <Badge
                              variant="outline"
                              className="text-xs bg-secondary border-border text-muted-foreground"
                            >
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
                    <TableCell className="tabular-nums text-center">
                      <span className="text-sm text-muted-foreground">{contact.units ?? "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{contact.assignedStaff}</span>
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
      </div>

      {activeTab === "owners" ? (
        <ContactTabsStats
          variant="owners"
          owners={baseContacts.filter((c) => c.type === "Owner")}
          ownerStatsFilters={ownerStatsFilters}
          setOwnerStatsFilters={setOwnerStatsFilters}
          onPageReset={() => setCurrentPage(1)}
        />
      ) : (
        <ContactTabsStats
          variant="tenants"
          tenants={baseContacts.filter((c) => c.type === "Tenant")}
          tenantStatsFilters={tenantStatsFilters}
          setTenantStatsFilters={setTenantStatsFilters}
          onPageReset={() => setCurrentPage(1)}
        />
      )}

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
          {showAdvancedFilterButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilterModal(true)}
              className="h-9 px-3"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </Button>
          )}
          {(activeTab === "owners" ? ownerStatsFilters.length > 0 : tenantStatsFilters.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (activeTab === "owners") {
                  setOwnerStatsFilters([])
                } else {
                  setTenantStatsFilters([])
                }
                setCurrentPage(1)
              }}
              className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {(activeTab === "owners" || activeTab === "tenants") && (
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant={
                  activeTab === "owners"
                    ? ownersViewMode === "grid"
                      ? "default"
                      : "ghost"
                    : tenantsViewMode === "grid"
                      ? "default"
                      : "ghost"
                }
                size="icon"
                className={`rounded-none border-r ${(activeTab === "owners" ? ownersViewMode : tenantsViewMode) === "grid"
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : ""
                  }`}
                onClick={() =>
                  activeTab === "owners" ? setOwnersViewMode("grid") : setTenantsViewMode("grid")
                }
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  activeTab === "owners"
                    ? ownersViewMode === "list"
                      ? "default"
                      : "ghost"
                    : tenantsViewMode === "list"
                      ? "default"
                      : "ghost"
                }
                size="icon"
                className={`rounded-none ${(activeTab === "owners" ? ownersViewMode : tenantsViewMode) === "list"
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : ""
                  }`}
                onClick={() =>
                  activeTab === "owners" ? setOwnersViewMode("list") : setTenantsViewMode("list")
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main content area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <BulkActionBar
            selectedCount={selectedContactIds.length}
            totalCount={filteredContacts.length}
            onClearSelection={() => setSelectedContactIds([])}
            onSelectAll={() => setSelectedContactIds(filteredContacts.map((c) => c.id))}
            selectedNames={filteredContacts.filter((c) => selectedContactIds.includes(c.id)).map((c) => c.name)}
            selectedEmails={filteredContacts.filter((c) => selectedContactIds.includes(c.id)).map((c) => c.email)}
          />
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
      </div>

      {/* Advanced Filter Dialog (single category pages) */}
      <Dialog
        open={showAdvancedFilterButton && showAdvancedFilterModal}
        onOpenChange={(open) => {
          if (!open) closeAdvancedFilterModal()
          else setShowAdvancedFilterModal(true)
        }}
      >
        <DialogContent className="w-[480px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Add Filter</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Filter Field Dropdown - Searchable */}
            <div className="relative">
              <Label className="text-xs font-medium text-primary mb-1 block">
                What do you want to filter by?
              </Label>
              <div className="border rounded-md w-full">
                <div
                  className="flex items-center gap-2 h-10 px-3 cursor-pointer"
                  onClick={() => setShowFieldDropdown(!showFieldDropdown)}
                >
                  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span
                    className={`text-sm flex-1 truncate ${modalFilterField ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {modalFilterField || "Select a filter field"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${showFieldDropdown ? "rotate-180" : ""}`}
                  />
                </div>
                {showFieldDropdown && (
                  <>
                    <div className="border-t px-2 py-1.5">
                      <Input
                        placeholder="Search fields..."
                        value={modalFieldSearch}
                        onChange={(e) => setModalFieldSearch(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto border-t">
                      {advancedFilterFields
                        .filter((f) => f.toLowerCase().includes(modalFieldSearch.toLowerCase()))
                        .map((field) => (
                          <div
                            key={field}
                            className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 border-b border-border last:border-b-0"
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
                      {advancedFilterFields.filter((f) => f.toLowerCase().includes(modalFieldSearch.toLowerCase()))
                        .length === 0 && (
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
                  value={modalOptionSearch}
                  onChange={(e) => setModalOptionSearch(e.target.value)}
                  className="border-0 border-b rounded-b-none h-10 focus-visible:ring-0 w-full"
                />
                {modalFilterField && (() => {
                  const allOptions = getAdvancedFilterOptions(modalFilterField)
                  const filtered = allOptions.filter((opt) =>
                    opt.toLowerCase().includes(modalOptionSearch.toLowerCase()),
                  )
                  const allSelected = filtered.length > 0 && filtered.every((opt) => modalFilterValues.includes(opt))
                  const showSelectAll = advancedFieldsWithSelectAll.includes(modalFilterField) && !modalOptionSearch
                  return (
                    <div className="max-h-[180px] overflow-y-auto">
                      {showSelectAll && (
                        <div className="flex items-center space-x-2 py-2 px-3 border-b border-border hover:bg-muted/50">
                          <Checkbox
                            id="advanced-filter-modal-opt-select-all"
                            checked={allSelected}
                            onCheckedChange={(checked) => {
                              if (checked) setModalFilterValues([...new Set([...modalFilterValues, ...allOptions])])
                              else setModalFilterValues(modalFilterValues.filter((v) => !allOptions.includes(v)))
                            }}
                          />
                          <label
                            htmlFor="advanced-filter-modal-opt-select-all"
                            className="text-sm leading-none cursor-pointer flex-1 font-medium"
                          >
                            Select All
                          </label>
                        </div>
                      )}
                      {filtered.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2 py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`advanced-filter-modal-opt-${option}`}
                            checked={modalFilterValues.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked) setModalFilterValues([...modalFilterValues, option])
                              else setModalFilterValues(modalFilterValues.filter((v) => v !== option))
                            }}
                          />
                          <label
                            htmlFor={`advanced-filter-modal-opt-${option}`}
                            className="text-sm leading-none cursor-pointer flex-1 truncate"
                          >
                            {option}
                          </label>
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
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeAdvancedFilterModal} className="h-9 px-4">
              Cancel <span className="text-xs text-muted-foreground ml-1.5">(esc)</span>
            </Button>
            <Button
              onClick={applyAdvancedFilter}
              disabled={!modalFilterField || modalFilterValues.length === 0}
              className="h-9 px-4"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                      {MOCK_ACTIVITIES.map((activity: ContactActivity) => (
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
                          {MOCK_PAYMENTS.map((payment: ContactPayment) => (
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
                      {MOCK_NOTES.map((note: ContactNote) => (
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

