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
import type { Property } from "../types"
import { MOCK_PROPERTIES, FILTER_FIELDS, FIELDS_WITH_SELECT_ALL, getFilterOptions, propertyColumns, unitColumns } from "../data/propertyListing"
import { useNav } from "@/components/dashboard-app"
import { PropertyMetricsSummary } from "@/features/properties/components/property-matrix"
import { useQuickActions } from "@/context/QuickActionsContext"
import { propertyListQuickActions } from "@/lib/quickActions"
import { useRouter } from "next/navigation"

export default function AllPropertiesPage() {
  const nav = useNav()
  const router = useRouter()
  useQuickActions(propertyListQuickActions, {
    subtitle: "Properties",
    aiSuggestedPrompts: [
      "How do I add a new property?",
      "Which properties have vacancies?",
      "Show me properties by portfolio",
    ],
    aiPlaceholder: "Ask about properties...",
  })
  const [visibleCount, setVisibleCount] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false)

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

  const filteredProperties: Property[] = MOCK_PROPERTIES.filter((property: Property) => {
    for (const filter of appliedFilters) {
      if (filter.field === "Status") {
        if (!property.propertyStatus || !filter.values.includes(property.propertyStatus)) return false
      }
      if (filter.field === "Property Group(s)") {
        if (!property.propertyGroup || !filter.values.includes(property.propertyGroup)) return false
      }
      if (filter.field === "Tagged With Any") {
        const tags = property.tags ?? []
        if (!filter.values.some((v) => tags.includes(v))) return false
      }
      if (filter.field === "Tagged With All") {
        const tags = property.tags ?? []
        if (!filter.values.every((v) => tags.includes(v))) return false
      }
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
    router.push(`/properties/${propertyId}`)
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

            <div className="flex items-center gap-4 shrink-0">
              {/* Properties View / Units View toggle */}
              {/* <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${viewToggle === "properties" ? "text-foreground" : "text-muted-foreground"}`}>
                  Properties View
                </span>
                <button
                  type="button"
                  onClick={() => { setViewToggle(viewToggle === "properties" ? "units" : "properties"); setCurrentPage(1) }}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 bg-muted"
                  aria-label="Toggle Properties or Units view"
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full shadow bg-primary transition-transform duration-200 ${
                      viewToggle === "units" ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${viewToggle === "units" ? "text-foreground" : "text-muted-foreground"}`}>
                  Units View
                </span>
              </div> */}

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

              {/* Column Settings */}
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

        <div className="flex items-center gap-2.5 mb-3 px-6 py-4 pb-0">
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
                        {/* <h3 className="font-bold text-lg leading-tight transition-colors text-gray-900 group-hover:text-gray-700">
                          {property.name}
                        </h3> */}
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
              <Card className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 shadow-sm">
                      {viewToggle === "properties" ? (
                        <>
                          {/* {visiblePropertyColumns.includes("propertyName") && <TableHead className="font-semibold">Property Name</TableHead>} */}
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
                          {/* {visibleUnitColumns.includes("propertyName") && <TableHead className="font-semibold">Property Name</TableHead>} */}
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
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        {viewToggle === "properties" ? (
                          <>
                            {/* {visiblePropertyColumns.includes("propertyName") && (
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2 text-[rgba(1,96,209,1)]">
                                  <div className="p-1.5 rounded bg-gray-100">
                                    <Building2 className="h-4 w-4 text-[rgba(1,96,209,1)]" />
                                  </div>
                                  <span className="whitespace-nowrap">{property.name}</span>
                                </div>
                              </TableCell>
                            )} */}
                            {visiblePropertyColumns.includes("propertyAddress") && (
                              <TableCell onClick={() => handlePropertyClick(property.id)}>
                                <div className="flex items-center gap-1.5 text-[rgba(1,96,209,1)] hover:underline">
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
                                <div className="flex flex-wrap gap-1">
                                  {(property.tags ?? []).map((t) => (
                                    <Badge key={t} variant="outline" className="text-[10px]">
                                      {t}
                                    </Badge>
                                  ))}
                                </div>
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
                                <Badge className={`text-xs whitespace-nowrap ${property.propertyStatus === "Active" ? "bg-green-100 text-green-700" :
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
                                  onClick={(e) => {router.push(`/properties/${property.id}/unit/${100 + (Number(property.id) % Math.max(property.units, 1))}`) }}
                                  className="flex items-center gap-1.5 text-[rgba(1,96,209,1)] hover:underline cursor-pointer"
                                >
                                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                                  <span className="max-w-[200px] truncate">{property.unitAddress}</span>
                                </button>
                              </TableCell>
                            )}
                            {/* {visibleUnitColumns.includes("propertyName") && (
                              <TableCell className="font-medium">
                                <span className="text-[rgba(1,96,209,1)] whitespace-nowrap">{property.name}</span>
                              </TableCell>
                            )} */}
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
                                <div className="flex flex-wrap gap-1">
                                  {(property.tags ?? []).map((t) => (
                                    <Badge key={t} variant="outline" className="text-[10px]">
                                      {t}
                                    </Badge>
                                  ))}
                                </div>
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
                                <Badge className={`text-xs whitespace-nowrap ${property.propertyStatus === "Active" ? "bg-green-100 text-green-700" :
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
    </div>
  )
}
