"use client"

import {
  Building2,
  Users,
  UserCheck,
  Clock,
  ChevronDown,
  Tag,
  AlertTriangle,
  LogOut,
  Gavel,
  Layers,
  Briefcase,
  Wrench,
  Mail,
  Phone,
  Home,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Contact, Vendor } from "@/features/contacts/types"

const TILE_BASE =
  "flex items-center gap-2 px-3 py-1.5 border rounded-lg shadow-sm cursor-pointer transition-colors"
const TILE_ACTIVE = "ring-2 ring-primary bg-primary/5"
const TILE_INACTIVE = "bg-background hover:bg-muted/50"

export type OwnerTileFilter = "all" | "active" | "pending" | "terminations" | "tag"
export type TenantTileFilter = "all" | "active" | "pending" | "moveout" | "evictions" | "type"

export type ContactTabsStatsOwnersProps = {
  variant: "owners"
  owners: Contact[]
  ownerTileFilter: OwnerTileFilter
  setOwnerTileFilter: (v: OwnerTileFilter) => void
  pendingSubFilter: "all" | "tasks" | "processes"
  setPendingSubFilter: (v: "all" | "tasks" | "processes") => void
  terminationSubFilter: "all" | "under" | "hidden"
  setTerminationSubFilter: (v: "all" | "under" | "hidden") => void
  selectedTag: string
  setSelectedTag: (v: string) => void
  onPageReset: () => void
}

export type ContactTabsStatsTenantsProps = {
  variant: "tenants"
  tenants: Contact[]
  tenantTileFilter: TenantTileFilter
  setTenantTileFilter: (v: TenantTileFilter) => void
  tenantPendingSubFilter: "all" | "tasks" | "processes"
  setTenantPendingSubFilter: (v: "all" | "tasks" | "processes") => void
  tenantMoveoutSubFilter: "all" | "pending" | "completed"
  setTenantMoveoutSubFilter: (v: "all" | "pending" | "completed") => void
  tenantEvictionSubFilter: "all" | "pending" | "completed"
  setTenantEvictionSubFilter: (v: "all" | "pending" | "completed") => void
  selectedTenantType: "all" | "Self Paying" | "Section 8"
  setSelectedTenantType: (v: "all" | "Self Paying" | "Section 8") => void
  onPageReset: () => void
}

export type ContactTabsStatsVendorsProps = {
  variant: "vendors"
  vendors: Vendor[]
}

export type ContactTabsStatsPropertyTechnicianProps = {
  variant: "property-technician"
  technicians: Contact[]
}

export type ContactTabsStatsLeasingAgentProps = {
  variant: "leasing-agent"
  agents: Contact[]
}

export type ContactTabsStatsProps =
  | ContactTabsStatsOwnersProps
  | ContactTabsStatsTenantsProps
  | ContactTabsStatsVendorsProps
  | ContactTabsStatsPropertyTechnicianProps
  | ContactTabsStatsLeasingAgentProps

export function ContactTabsStats(props: ContactTabsStatsProps) {
  if (props.variant === "owners") return <OwnerStatsCards {...props} />
  if (props.variant === "tenants") return <TenantStatsCards {...props} />
  if (props.variant === "vendors") return <VendorStatsCards {...props} />
  if (props.variant === "property-technician") return <PropertyTechnicianStatsCards {...props} />
  return <LeasingAgentStatsCards {...props} />
}
  
function OwnerStatsCards({
  owners,
  ownerTileFilter,
  setOwnerTileFilter,
  pendingSubFilter,
  setPendingSubFilter,
  terminationSubFilter,
  setTerminationSubFilter,
  selectedTag,
  setSelectedTag,
  onPageReset,
}: ContactTabsStatsOwnersProps) {
  const allOwners = owners
  const activeOwnerCount = allOwners.filter((c) => c.status === "Active").length
  const ownerPendingTasks = allOwners.reduce((sum, c) => sum + (c.pendingTasks || 0), 0)
  const ownerPendingProcesses = allOwners.reduce((sum, c) => sum + (c.pendingProcesses || 0), 0)
  const underTermination = allOwners.filter((c) => c.terminationStatus === "Under Termination").length
  const terminatedHidden = allOwners.filter((c) => c.terminationStatus === "Terminated Hidden").length
  const allTags = Array.from(new Set(allOwners.flatMap((c) => c.tags || []))).sort()

  const getPendingCount = () => {
    if (pendingSubFilter === "tasks") return ownerPendingTasks
    if (pendingSubFilter === "processes") return ownerPendingProcesses
    return ownerPendingTasks + ownerPendingProcesses
  }

  const getTerminationCount = () => {
    if (terminationSubFilter === "under") return underTermination
    if (terminationSubFilter === "hidden") return terminatedHidden
    return underTermination + terminatedHidden
  }

  const getTagCount = () => {
    if (selectedTag === "all") return allOwners.length
    return allOwners.filter((c) => c.tags?.includes(selectedTag)).length
  }

  const apply = (fn: () => void) => {
    fn()
    onPageReset()
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div
        className={`${TILE_BASE} ${ownerTileFilter === "all" ? TILE_ACTIVE : TILE_INACTIVE}`}
        onClick={() => apply(() => setOwnerTileFilter("all"))}
      >
        <div className="p-1 rounded bg-success/10">
          <Building2 className="h-4 w-4 text-success" />
        </div>
        <span className="text-sm text-muted-foreground">Total Owners</span>
        <span className="text-xl font-bold">{allOwners.length}</span>
      </div>

      <div
        className={`${TILE_BASE} ${ownerTileFilter === "active" ? TILE_ACTIVE : TILE_INACTIVE}`}
        onClick={() => apply(() => setOwnerTileFilter("active"))}
      >
        <div className="p-1 rounded bg-info/10">
          <UserCheck className="h-4 w-4 text-info" />
        </div>
        <span className="text-sm text-muted-foreground">Active Owners</span>
        <span className="text-xl font-bold">{activeOwnerCount}</span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${ownerTileFilter === "pending" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="text-xl font-bold">{getPendingCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1" align="start">
          {[
            { label: "All", value: "all" as const, count: ownerPendingTasks + ownerPendingProcesses },
            { label: "Pending Tasks", value: "tasks" as const, count: ownerPendingTasks },
            { label: "Pending Processes", value: "processes" as const, count: ownerPendingProcesses },
          ].map((item) => (
            <button
              key={item.value}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                ownerTileFilter === "pending" && pendingSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => apply(() => { setOwnerTileFilter("pending"); setPendingSubFilter(item.value) })}
            >
              <span>{item.label}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${ownerTileFilter === "terminations" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Terminations</span>
            <span className="text-xl font-bold">{getTerminationCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-1" align="start">
          {[
            { label: "All", value: "all" as const, count: underTermination + terminatedHidden },
            { label: "Under Termination", value: "under" as const, count: underTermination },
            { label: "Terminated Hidden", value: "hidden" as const, count: terminatedHidden },
          ].map((item) => (
            <button
              key={item.value}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                ownerTileFilter === "terminations" && terminationSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => apply(() => { setOwnerTileFilter("terminations"); setTerminationSubFilter(item.value) })}
            >
              <span>{item.label}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${ownerTileFilter === "tag" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-accent">
              <Tag className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Tag </span>
            <span className="text-xl font-bold">{getTagCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-1" align="start">
          <div className="max-h-[250px] overflow-y-auto">
            <button
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                ownerTileFilter === "tag" && selectedTag === "all"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => apply(() => { setOwnerTileFilter("tag"); setSelectedTag("all") })}
            >
              <span>All Owners</span>
              <Badge variant="secondary" className="text-xs">
                {allOwners.length}
              </Badge>
            </button>
            {allTags.map((tag) => {
              const tagOwnerCount = allOwners.filter((c) => c.tags?.includes(tag)).length
              return (
                <button
                  key={tag}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                    ownerTileFilter === "tag" && selectedTag === tag
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/80 text-foreground"
                  }`}
                  onClick={() => apply(() => { setOwnerTileFilter("tag"); setSelectedTag(tag) })}
                >
                  <span>{tag}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tagOwnerCount}
                  </Badge>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function TenantStatsCards({
  tenants,
  tenantTileFilter,
  setTenantTileFilter,
  tenantPendingSubFilter,
  setTenantPendingSubFilter,
  tenantMoveoutSubFilter,
  setTenantMoveoutSubFilter,
  tenantEvictionSubFilter,
  setTenantEvictionSubFilter,
  selectedTenantType,
  setSelectedTenantType,
  onPageReset,
}: ContactTabsStatsTenantsProps) {
  const allTenants = tenants
  const activeTenantCount = allTenants.filter((c) => c.status === "Active").length
  const tenantPendingTasksTotal = allTenants.reduce((sum, c) => sum + (c.tenantPendingTasks || 0), 0)
  const tenantPendingProcessesTotal = allTenants.reduce((sum, c) => sum + (c.tenantPendingProcesses || 0), 0)
  const pendingMoveouts = allTenants.filter((c) => c.moveOutStatus === "Pending").length
  const completedMoveouts = allTenants.filter((c) => c.moveOutStatus === "Completed").length
  const pendingEvictions = allTenants.filter((c) => c.evictionStatus === "Pending").length
  const completedEvictions = allTenants.filter((c) => c.evictionStatus === "Completed").length

  const getTenantPendingCount = () => {
    if (tenantPendingSubFilter === "tasks") return tenantPendingTasksTotal
    if (tenantPendingSubFilter === "processes") return tenantPendingProcessesTotal
    return tenantPendingTasksTotal + tenantPendingProcessesTotal
  }

  const getMoveoutCount = () => {
    if (tenantMoveoutSubFilter === "pending") return pendingMoveouts
    if (tenantMoveoutSubFilter === "completed") return completedMoveouts
    return pendingMoveouts + completedMoveouts
  }

  const getEvictionCount = () => {
    if (tenantEvictionSubFilter === "pending") return pendingEvictions
    if (tenantEvictionSubFilter === "completed") return completedEvictions
    return pendingEvictions + completedEvictions
  }

  const getTenantTypeCount = () => {
    if (selectedTenantType === "all") return allTenants.length
    return allTenants.filter((c) => c.tenantType === selectedTenantType).length
  }

  const apply = (fn: () => void) => {
    fn()
    onPageReset()
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div
        className={`${TILE_BASE} ${tenantTileFilter === "all" ? TILE_ACTIVE : TILE_INACTIVE}`}
        onClick={() => apply(() => setTenantTileFilter("all"))}
      >
        <div className="p-1 rounded bg-success/10">
          <Users className="h-4 w-4 text-success" />
        </div>
        <span className="text-sm text-muted-foreground">Total Tenants</span>
        <span className="text-xl font-bold">{allTenants.length}</span>
      </div>

      <div
        className={`${TILE_BASE} ${tenantTileFilter === "active" ? TILE_ACTIVE : TILE_INACTIVE}`}
        onClick={() => apply(() => setTenantTileFilter("active"))}
      >
        <div className="p-1 rounded bg-info/10">
          <UserCheck className="h-4 w-4 text-info" />
        </div>
        <span className="text-sm text-muted-foreground">Active Tenants</span>
        <span className="text-xl font-bold">{activeTenantCount}</span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${tenantTileFilter === "pending" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-warning/10">
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="text-xl font-bold">{getTenantPendingCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1" align="start">
          {[
            { label: "All", value: "all" as const, count: tenantPendingTasksTotal + tenantPendingProcessesTotal },
            { label: "Pending Tasks", value: "tasks" as const, count: tenantPendingTasksTotal },
            { label: "Pending Processes", value: "processes" as const, count: tenantPendingProcessesTotal },
          ].map((item) => (
            <button
              key={item.value}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                tenantTileFilter === "pending" && tenantPendingSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => apply(() => { setTenantTileFilter("pending"); setTenantPendingSubFilter(item.value) })}
            >
              <span>{item.label}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${tenantTileFilter === "moveout" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-warning/10">
              <LogOut className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Move-out</span>
            <span className="text-xl font-bold">{getMoveoutCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-1" align="start">
          {[
            { label: "All", value: "all" as const, count: pendingMoveouts + completedMoveouts },
            { label: "Pending Move-outs", value: "pending" as const, count: pendingMoveouts },
            { label: "Completed Move-outs", value: "completed" as const, count: completedMoveouts },
          ].map((item) => (
            <button
              key={item.value}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                tenantTileFilter === "moveout" && tenantMoveoutSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => apply(() => { setTenantTileFilter("moveout"); setTenantMoveoutSubFilter(item.value) })}
            >
              <span>{item.label}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${tenantTileFilter === "evictions" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-destructive/10">
              <Gavel className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Evictions</span>
            <span className="text-xl font-bold">{getEvictionCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-1" align="start">
          {[
            { label: "All", value: "all" as const, count: pendingEvictions + completedEvictions },
            { label: "Pending Evictions", value: "pending" as const, count: pendingEvictions },
            { label: "Completed Evictions", value: "completed" as const, count: completedEvictions },
          ].map((item) => (
            <button
              key={item.value}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                tenantTileFilter === "evictions" && tenantEvictionSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-foreground"
              }`}
              onClick={() => apply(() => { setTenantTileFilter("evictions"); setTenantEvictionSubFilter(item.value) })}
            >
              <span>{item.label}</span>
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className={`${TILE_BASE} ${tenantTileFilter === "type" ? TILE_ACTIVE : TILE_INACTIVE}`}>
            <div className="p-1 rounded bg-accent">
              <Layers className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-xl font-bold">{getTenantTypeCount()}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-1" align="start">
          <button
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
              tenantTileFilter === "type" && selectedTenantType === "all"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-foreground"
            }`}
            onClick={() => apply(() => { setTenantTileFilter("type"); setSelectedTenantType("all") })}
          >
            <span>All</span>
            <Badge variant="secondary" className="text-xs">
              {allTenants.length}
            </Badge>
          </button>
          <button
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
              tenantTileFilter === "type" && selectedTenantType === "Self Paying"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-foreground"
            }`}
            onClick={() => apply(() => { setTenantTileFilter("type"); setSelectedTenantType("Self Paying") })}
          >
            <span>Self Paying</span>
            <Badge variant="secondary" className="text-xs">
              {allTenants.filter((c) => c.tenantType === "Self Paying").length}
            </Badge>
          </button>
          <button
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
              tenantTileFilter === "type" && selectedTenantType === "Section 8"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-foreground"
            }`}
            onClick={() => apply(() => { setTenantTileFilter("type"); setSelectedTenantType("Section 8") })}
          >
            <span>Section 8</span>
            <Badge variant="secondary" className="text-xs">
              {allTenants.filter((c) => c.tenantType === "Section 8").length}
            </Badge>
          </button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const STAT_TILE_BASE = "flex items-center gap-2 px-3 py-1.5 bg-background border rounded-lg shadow-sm"

function VendorStatsCards({ vendors }: ContactTabsStatsVendorsProps) {
  const totalVendors = vendors.length
  const uniqueTrades = [...new Set(vendors.filter((v) => v.trades).flatMap((v) => v.trades.split(",")))].length
  const vendorsWithEmail = vendors.filter((v) => v.email).length
  const vendorsWithPhone = vendors.filter((v) => v.phone).length

  return (
    <div className="flex flex-wrap gap-3">
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-primary/10">
          <Briefcase className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">Total Vendors</span>
        <span className="text-xl font-bold">{totalVendors}</span>
        <span className="text-xs text-muted-foreground">Service providers</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-success/10">
          <Wrench className="h-4 w-4 text-success" />
        </div>
        <span className="text-sm text-muted-foreground">Trades</span>
        <span className="text-xl font-bold">{uniqueTrades}</span>
        <span className="text-xs text-muted-foreground">Categories</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-info/10">
          <Mail className="h-4 w-4 text-info" />
        </div>
        <span className="text-sm text-muted-foreground">With Email</span>
        <span className="text-xl font-bold">{vendorsWithEmail}</span>
        <span className="text-xs text-muted-foreground">Contactable</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-accent">
          <Phone className="h-4 w-4 text-accent-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">With Phone</span>
        <span className="text-xl font-bold">{vendorsWithPhone}</span>
        <span className="text-xs text-muted-foreground">Reachable</span>
      </div>
    </div>
  )
}

function PropertyTechnicianStatsCards({ technicians }: ContactTabsStatsPropertyTechnicianProps) {
  const totalTechnicians = technicians.length
  const activeTechs = technicians.filter((c) => c.status === "Active").length
  const pendingTechs = technicians.filter((c) => c.status === "Pending").length
  const specialties = new Set(technicians.filter((c) => c.specialty).map((c) => c.specialty)).size

  return (
    <div className="flex flex-wrap gap-3">
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-info/10">
          <Wrench className="h-4 w-4 text-info" />
        </div>
        <span className="text-sm text-muted-foreground">Total Technicians</span>
        <span className="text-xl font-bold">{totalTechnicians}</span>
        <span className="text-xs text-muted-foreground">Maintenance staff</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-success/10">
          <UserCheck className="h-4 w-4 text-success" />
        </div>
        <span className="text-sm text-muted-foreground">Active</span>
        <span className="text-xl font-bold">{activeTechs}</span>
        <span className="text-xs text-success">Available</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-accent">
          <Wrench className="h-4 w-4 text-accent-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">Specialties</span>
        <span className="text-xl font-bold">{specialties}</span>
        <span className="text-xs text-muted-foreground">Skill sets</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-warning/10">
          <Clock className="h-4 w-4 text-warning" />
        </div>
        <span className="text-sm text-muted-foreground">Pending</span>
        <span className="text-xl font-bold">{pendingTechs}</span>
        <span className="text-xs text-warning">Awaiting</span>
      </div>
    </div>
  )
}

function LeasingAgentStatsCards({ agents }: ContactTabsStatsLeasingAgentProps) {
  const totalLeasingAgents = agents.length
  const activeAgents = agents.filter((c) => c.status === "Active").length
  const totalProperties = agents.reduce((acc, c) => acc + c.properties.length, 0)

  return (
    <div className="flex flex-wrap gap-3">
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-destructive/10">
          <Home className="h-4 w-4 text-destructive" />
        </div>
        <span className="text-sm text-muted-foreground">Total Agents</span>
        <span className="text-xl font-bold">{totalLeasingAgents}</span>
        <span className="text-xs text-muted-foreground">Professionals</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-success/10">
          <UserCheck className="h-4 w-4 text-success" />
        </div>
        <span className="text-sm text-muted-foreground">Active</span>
        <span className="text-xl font-bold">{activeAgents}</span>
        <span className="text-xs text-success">Currently active</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-info/10">
          <Building2 className="h-4 w-4 text-info" />
        </div>
        <span className="text-sm text-muted-foreground">Properties</span>
        <span className="text-xl font-bold">{totalProperties}</span>
        <span className="text-xs text-muted-foreground">Assigned</span>
      </div>
      <div className={STAT_TILE_BASE}>
        <div className="p-1 rounded bg-warning/10">
          <Home className="h-4 w-4 text-warning" />
        </div>
        <span className="text-sm text-muted-foreground">Avg Properties</span>
        <span className="text-xl font-bold">
          {totalLeasingAgents > 0 ? (totalProperties / totalLeasingAgents).toFixed(1) : 0}
        </span>
        <span className="text-xs text-muted-foreground">Per agent</span>
      </div>
    </div>
  )
}
