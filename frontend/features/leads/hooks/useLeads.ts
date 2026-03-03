"use client"

import { useState, useEffect } from "react"
import {
  initialLeadsData,
  CATEGORY_LEADS,
  PROSPECT_CATEGORY_LEADS,
  OWNER_CATEGORIES,
  OWNER_PROSPECT_CATEGORIES,
  ASSIGNEES,
  getCategoryStages,
  getOwnerStagesByType,
  getProspectStagesByType,
  ownerStages,
} from "@/features/leads/data/mockLeads"
import type { Lead } from "@/features/leads/types"

export interface UseLeadsOptions {
  params?: { view?: string }
  /** From useView() - e.g. "admin" | "staff" for filtering by assignee */
  view?: string
  /** When set, syncs selected category from URL (for ID-based routing) */
  initialCategoryId?: string | null
}

const PAGE_SIZE = 10

export function useLeads({ params, view, initialCategoryId }: UseLeadsOptions) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => (params?.view === "owners" ? (initialCategoryId ?? null) : null)
  )
  const [selectedProspectCategory, setSelectedProspectCategory] = useState<string | null>(
    () => (params?.view === "lease-prospects" || params?.view === "tenants" ? (initialCategoryId ?? null) : null)
  )
  const [categorySearchQuery, setCategorySearchQuery] = useState("")
  const [ownerType, setOwnerType] = useState<string>("type1")
  const [prospectType, setProspectType] = useState<string>("type1")
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all")
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState<string>("")
  const [tileStaffFilter, setTileStaffFilter] = useState<string>("all")
  const [tileStaffSearch, setTileStaffSearch] = useState<string>("")
  const [tileStaffOpen, setTileStaffOpen] = useState(false)
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([])
  const [stageSearchQuery, setStageSearchQuery] = useState<string>("")
  const [sourceSearchQuery, setSourceSearchQuery] = useState<string>("")
  const [unitsSearchQuery, setUnitsSearchQuery] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [customDateFrom, setCustomDateFrom] = useState<string>("")
  const [customDateTo, setCustomDateTo] = useState<string>("")
  const getInitialType = (): "all" | "owner" | "tenant" => {
    if (params?.view === "owners") return "owner"
    if (params?.view === "lease-prospects" || params?.view === "tenants") return "tenant"
    return "all"
  }
  const [selectedType, setSelectedType] = useState<"all" | "owner" | "tenant">(getInitialType)
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [filterUnitType, setFilterUnitType] = useState<string>("all")
  const [filterNumUnits, setFilterNumUnits] = useState<string>("all")
  const [filterCallStatus, setFilterCallStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedEmailsSent, setSelectedEmailsSent] = useState<string[]>([])
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [selectedLastTouch, setSelectedLastTouch] = useState<string[]>([])
  const [selectedCreated, setSelectedCreated] = useState<string[]>([])
  const [lastTouchDateFilter, setLastTouchDateFilter] = useState<string>("all")
  const [createdDateFilter, setCreatedDateFilter] = useState<string>("all")
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(20)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData)
  const [page, setPage] = useState<number>(1)

  const isProspectView =
    params?.view === "lease-prospects" || params?.view === "tenants"

  useEffect(() => {
    if (initialCategoryId == null) return
    if (params?.view === "owners") {
      setSelectedCategory(initialCategoryId)
      setSelectedProspectCategory(null)
    } else if (isProspectView) {
      setSelectedProspectCategory(initialCategoryId)
      setSelectedCategory(null)
    }
  }, [initialCategoryId, params?.view, isProspectView])

  useEffect(() => {
    if (params?.view === "owners" && selectedCategory) {
      setLeads(CATEGORY_LEADS[selectedCategory] ?? [])
    } else if (isProspectView && selectedProspectCategory) {
      setLeads(PROSPECT_CATEGORY_LEADS[selectedProspectCategory] ?? [])
    } else {
      setLeads(initialLeadsData)
    }
    setPage(1)
    setSelectedStage("all")
    setSearchQuery("")
  }, [selectedCategory, selectedProspectCategory, params?.view, isProspectView])

  const filteredSortedLeads = leads
    .filter((lead) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        (lead.property && lead.property.toLowerCase().includes(q)) ||
        lead.assignedTo.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.toLowerCase().includes(q)) ||
        (lead.interestedUnits &&
          lead.interestedUnits.some(
            (u: { address: string; unit: string }) =>
              u.address.toLowerCase().includes(q) ||
              u.unit.toLowerCase().includes(q)
          ))

      const matchesType =
        selectedType === "all" ||
        selectedCategory ||
        selectedProspectCategory ||
        lead.userType.toLowerCase() === selectedType.toLowerCase()
      const matchesStage =
        selectedStage === "all" ||
        lead.stage.toLowerCase() === selectedStage.toLowerCase()
      const matchesUnitType =
        filterUnitType === "all" ||
        (lead.unitDetails && lead.unitDetails === filterUnitType)
      const matchesNumUnits =
        filterNumUnits === "all" ||
        (lead.numberOfUnits !== undefined &&
          lead.numberOfUnits === Number(filterNumUnits))
      const matchesCallStatus =
        filterCallStatus === "all" ||
        (lead.lastCallStatus && lead.lastCallStatus === filterCallStatus)
      const matchesOwnerType =
        params?.view !== "owners" ||
        selectedCategory ||
        !lead.ownerType ||
        lead.ownerType === ownerType
      const matchesProspectType =
        !isProspectView ||
        selectedProspectCategory ||
        !lead.prospectType ||
        lead.prospectType === prospectType
      const matchesAssignee =
        selectedAssignee === "all" ||
        (lead.assignedTo &&
          lead.assignedTo.toLowerCase().replace(/\s+/g, "-") === selectedAssignee)
      const matchesTileStaff =
        tileStaffFilter === "all" ||
        (lead.assignedTo &&
          lead.assignedTo.toLowerCase().replace(/\s+/g, "-") === tileStaffFilter)
      const matchesUnitsFilter =
        selectedUnits.length === 0 ||
        (lead.numberOfUnits !== undefined &&
          selectedUnits.includes(String(lead.numberOfUnits)))

      if (view === "staff" && lead.assignedTo !== "Nina") return false

      return (
        matchesSearch &&
        matchesType &&
        matchesStage &&
        matchesUnitType &&
        matchesNumUnits &&
        matchesCallStatus &&
        matchesOwnerType &&
        matchesProspectType &&
        matchesAssignee &&
        matchesUnitsFilter &&
        matchesTileStaff
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "az") return a.name.localeCompare(b.name)
      return 0
    })

  const totalItems = filteredSortedLeads.length
  const totalPages = Math.ceil(totalItems / PAGE_SIZE)
  const pagedLeads = filteredSortedLeads.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )
  const visibleLeads = filteredSortedLeads.slice(0, visibleCount)
  const hasMoreLeads = visibleCount < totalItems

  useEffect(() => {
    setPage(1)
  }, [
    searchQuery,
    selectedType,
    selectedStage,
    filterUnitType,
    filterNumUnits,
    filterCallStatus,
    sortBy,
    selectedCategory,
  ])

  const resetAllFilters = () => {
    setSelectedAssignee("all")
    setSelectedAssignees([])
    setSelectedStages([])
    setSelectedSources([])
    setSelectedEmailsSent([])
    setSelectedUnits([])
    setSelectedLastTouch([])
    setSelectedCreated([])
    setLastTouchDateFilter("all")
    setCreatedDateFilter("all")
    setSelectedStage("all")
    setFilterUnitType("all")
    setFilterNumUnits("all")
    setFilterCallStatus("all")
    setAssigneeSearchQuery("")
    setStageSearchQuery("")
    setSourceSearchQuery("")
    setUnitsSearchQuery("")
    setTileStaffFilter("all")
    setTileStaffSearch("")
    setPage(1)
  }

  const hasActiveFilters =
    tileStaffFilter !== "all" ||
    selectedAssignee !== "all" ||
    selectedAssignees.length > 0 ||
    selectedStages.length > 0 ||
    selectedSources.length > 0 ||
    selectedEmailsSent.length > 0 ||
    selectedUnits.length > 0 ||
    selectedLastTouch.length > 0 ||
    selectedCreated.length > 0 ||
    lastTouchDateFilter !== "all" ||
    createdDateFilter !== "all" ||
    selectedStage !== "all" ||
    filterUnitType !== "all" ||
    filterNumUnits !== "all" ||
    filterCallStatus !== "all"

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, totalItems))
      setIsLoadingMore(false)
    }, 300)
  }

  const kanbanStages =
    params?.view === "owners" && selectedCategory
      ? getCategoryStages(selectedCategory)
      : isProspectView
        ? getProspectStagesByType(prospectType)
        : params?.view === "owners"
          ? getOwnerStagesByType(ownerType)
          : ownerStages

  const leadsByStage = kanbanStages.reduce(
    (acc, stage) => {
      acc[stage] = filteredSortedLeads.filter((lead) => lead.stage === stage)
      return acc
    },
    {} as Record<string, Lead[]>
  )

  const handleStageChange = (leadId: number, newStage: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return
    const isOwner =
      lead.userType === "Owner" || lead.userType.includes("Owner")
    const stages = isOwner
      ? getOwnerStagesByType(lead.ownerType ?? "type1")
      : getProspectStagesByType(lead.prospectType ?? "type1")
    const currentStageIndex = stages.indexOf(lead.stage)
    const newStageIndex = stages.indexOf(newStage)
    if (newStageIndex > currentStageIndex + 1) {
      const skippedStages = stages.slice(currentStageIndex + 1, newStageIndex)
      return { skippedStages, newStage, lead }
    }
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    )
    return null
  }

  const filteredCategories = OWNER_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  )
  const filteredProspectCategories = OWNER_PROSPECT_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  )

  return {
    // Data
    leads,
    setLeads,
    filteredSortedLeads,
    pagedLeads,
    visibleLeads,
    totalItems,
    totalPages,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    visibleCount,
    setVisibleCount,
    hasMoreLeads,
    isLoadingMore,
    handleLoadMore,
    kanbanStages,
    leadsByStage,
    handleStageChange,
    filteredCategories,
    filteredProspectCategories,

    // Category state
    selectedCategory,
    setSelectedCategory,
    selectedProspectCategory,
    setSelectedProspectCategory,
    categorySearchQuery,
    setCategorySearchQuery,

    // Filter state
    searchQuery,
    setSearchQuery,
    ownerType,
    setOwnerType,
    prospectType,
    setProspectType,
    selectedAssignees,
    setSelectedAssignees,
    selectedAssignee,
    setSelectedAssignee,
    assigneeSearchQuery,
    setAssigneeSearchQuery,
    tileStaffFilter,
    setTileStaffFilter,
    tileStaffSearch,
    setTileStaffSearch,
    tileStaffOpen,
    setTileStaffOpen,
    selectedLeadIds,
    setSelectedLeadIds,
    stageSearchQuery,
    setStageSearchQuery,
    sourceSearchQuery,
    setSourceSearchQuery,
    unitsSearchQuery,
    setUnitsSearchQuery,
    dateFilter,
    setDateFilter,
    showCustomDatePicker,
    setShowCustomDatePicker,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
    selectedType,
    setSelectedType,
    selectedStage,
    setSelectedStage,
    filterUnitType,
    setFilterUnitType,
    filterNumUnits,
    setFilterNumUnits,
    filterCallStatus,
    setFilterCallStatus,
    sortBy,
    setSortBy,
    selectedStages,
    setSelectedStages,
    selectedSources,
    setSelectedSources,
    selectedEmailsSent,
    setSelectedEmailsSent,
    selectedUnits,
    setSelectedUnits,
    selectedLastTouch,
    setSelectedLastTouch,
    selectedCreated,
    setSelectedCreated,
    lastTouchDateFilter,
    setLastTouchDateFilter,
    createdDateFilter,
    setCreatedDateFilter,
    dragOverStage,
    setDragOverStage,

    resetAllFilters,
    hasActiveFilters,
    ASSIGNEES,
  }
}
