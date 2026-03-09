"use client"

import {
  Building2,
  Users,
  UserCheck,
  Clock,
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
import type { Contact, Vendor } from "@/features/contacts/types"

const CARD_BASE = "flex flex-col border rounded-lg shadow-sm cursor-pointer transition-colors"
const CARD_ACTIVE = "ring-2 ring-primary bg-primary/5"
const CARD_INACTIVE = "bg-background hover:bg-muted/50"

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
    <div className="grid grid-cols-5 gap-3">
      {/* Total Owners */}
      <div
        className={`${CARD_BASE} ${ownerTileFilter === "all" ? CARD_ACTIVE : CARD_INACTIVE}`}
        onClick={() => apply(() => setOwnerTileFilter("all"))}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-success/5">
          <div className="p-1 rounded bg-success/10">
            <Building2 className="h-4 w-4 text-success" />
          </div>
          <span className="text-xs font-medium text-foreground">Total Owners</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-3 py-3">
          <span className="text-muted-foreground text-2xl font-extrabold">{allOwners.length}</span>
        </div>
      </div>

      {/* Active Owners */}
      <div
        className={`${CARD_BASE} ${ownerTileFilter === "active" ? CARD_ACTIVE : CARD_INACTIVE}`}
        onClick={() => apply(() => setOwnerTileFilter("active"))}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
          <div className="p-1 rounded bg-info/10">
            <UserCheck className="h-4 w-4 text-info" />
          </div>
          <span className="text-xs font-medium text-foreground">Active Owners</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-3 py-3">
          <span className="text-muted-foreground font-extrabold text-2xl">{activeOwnerCount}</span>
        </div>
      </div>

      {/* Pending (Expanded) */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "pending" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Pending</span>
          <span className="text-lg font-bold ml-auto">{getPendingCount()}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
              ownerTileFilter === "pending" && pendingSubFilter === "tasks"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-muted-foreground"
            }`}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("pending"); setPendingSubFilter("tasks") }) }}
          >
            <span className="text-left">Pending Tasks</span>
            <span className="font-semibold">{ownerPendingTasks}</span>
          </button>
          <button
            type="button"
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
              ownerTileFilter === "pending" && pendingSubFilter === "processes"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-muted-foreground"
            }`}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("pending"); setPendingSubFilter("processes") }) }}
          >
            <span className="text-left">Pending Processes</span>
            <span className="font-semibold">{ownerPendingProcesses}</span>
          </button>
        </div>
      </div>

      {/* Terminations (Expanded) */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "terminations" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-destructive/5">
          <div className="p-1 rounded bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <span className="text-xs font-medium text-foreground">Terminations</span>
          <span className="text-lg font-bold ml-auto">{getTerminationCount()}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
              ownerTileFilter === "terminations" && terminationSubFilter === "under"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-muted-foreground"
            }`}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("terminations"); setTerminationSubFilter("under") }) }}
          >
            <span className="text-left">Under Termination</span>
            <span className="font-semibold">{underTermination}</span>
          </button>
          <button
            type="button"
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
              ownerTileFilter === "terminations" && terminationSubFilter === "hidden"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-muted-foreground"
            }`}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("terminations"); setTerminationSubFilter("hidden") }) }}
          >
            <span className="text-left">Termination Hidden</span>
            <span className="font-semibold">{terminatedHidden}</span>
          </button>
        </div>
      </div>

      {/* Tags (Expanded with scroll) */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "tag" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
          <div className="p-1 rounded bg-accent">
            <Tag className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">Tags</span>
          <span className="text-lg font-bold ml-auto">{getTagCount()}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1 max-h-[90px] overflow-y-auto">
          <button
            type="button"
            className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors shrink-0 ${
              ownerTileFilter === "tag" && selectedTag === "all"
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/80 text-muted-foreground"
            }`}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("tag"); setSelectedTag("all") }) }}
          >
            <span>All Owners</span>
            <span className="font-semibold">{allOwners.length}</span>
          </button>
          {allTags.map((tag) => {
            const tagOwnerCount = allOwners.filter((c) => c.tags?.includes(tag)).length
            return (
              <button
                key={tag}
                type="button"
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors shrink-0 ${
                  ownerTileFilter === "tag" && selectedTag === tag
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("tag"); setSelectedTag(tag) }) }}
              >
                <span>{tag}</span>
                <span className="font-semibold">{tagOwnerCount}</span>
              </button>
            )
          })}
        </div>
      </div>
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

  const selfPayingCount = allTenants.filter((c) => c.tenantType === "Self Paying").length
  const section8Count = allTenants.filter((c) => c.tenantType === "Section 8").length

  return (
    <div className="grid grid-cols-6 gap-3">
      {/* Total Tenants */}
      <div
        className={`${CARD_BASE} ${tenantTileFilter === "all" ? CARD_ACTIVE : CARD_INACTIVE}`}
        onClick={() => apply(() => setTenantTileFilter("all"))}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-success/5">
          <div className="p-1 rounded bg-success/10">
            <Users className="h-4 w-4 text-success" />
          </div>
          <span className="text-xs font-medium text-foreground">Total Tenants</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-3 py-3">
          <span className="text-muted-foreground font-extrabold text-2xl">{allTenants.length}</span>
        </div>
      </div>

      {/* Active Tenants */}
      <div
        className={`${CARD_BASE} ${tenantTileFilter === "active" ? CARD_ACTIVE : CARD_INACTIVE}`}
        onClick={() => apply(() => setTenantTileFilter("active"))}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
          <div className="p-1 rounded bg-info/10">
            <UserCheck className="h-4 w-4 text-info" />
          </div>
          <span className="text-xs font-medium text-foreground">Active Tenants</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-3 py-3">
          <span className="text-muted-foreground font-extrabold text-2xl">{activeTenantCount}</span>
        </div>
      </div>

      {/* Pending (Expanded) */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "pending" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Pending</span>
          <span className="text-lg font-bold ml-auto">{getTenantPendingCount()}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          {[
            { label: "Pending Tasks", value: "tasks" as const, count: tenantPendingTasksTotal },
            { label: "Pending Processes", value: "processes" as const, count: tenantPendingProcessesTotal },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                tenantTileFilter === "pending" && tenantPendingSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-muted-foreground"
              }`}
              onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("pending"); setTenantPendingSubFilter(item.value) }) }}
            >
              <span>{item.label}</span>
              <span className="font-semibold">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Move-out (Expanded) */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "moveout" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <LogOut className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Move-out</span>
          <span className="text-lg font-bold ml-auto">{pendingMoveouts + completedMoveouts}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          {[
            { label: "Pending Move-outs", value: "pending" as const, count: pendingMoveouts },
            { label: "Completed Move-outs", value: "completed" as const, count: completedMoveouts },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                tenantTileFilter === "moveout" && tenantMoveoutSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-muted-foreground"
              }`}
              onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("moveout"); setTenantMoveoutSubFilter(item.value) }) }}
            >
              <span>{item.label}</span>
              <span className="font-semibold">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Evictions (Expanded) */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "evictions" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-destructive/5">
          <div className="p-1 rounded bg-destructive/10">
            <Gavel className="h-4 w-4 text-destructive" />
          </div>
          <span className="text-xs font-medium text-foreground">Evictions</span>
          <span className="text-lg font-bold ml-auto">{pendingEvictions + completedEvictions}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          {[
            { label: "Pending Evictions", value: "pending" as const, count: pendingEvictions },
            { label: "Completed Evictions", value: "completed" as const, count: completedEvictions },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                tenantTileFilter === "evictions" && tenantEvictionSubFilter === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-muted-foreground"
              }`}
              onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("evictions"); setTenantEvictionSubFilter(item.value) }) }}
            >
              <span>{item.label}</span>
              <span className="font-semibold">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Type (Expanded) */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "type" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
          <div className="p-1 rounded bg-accent">
            <Layers className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">Type</span>
          <span className="text-lg font-bold ml-auto">{allTenants.length}</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          {[
            { label: "Self Paying", value: "Self Paying" as const, count: selfPayingCount },
            { label: "Section 8", value: "Section 8" as const, count: section8Count },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                tenantTileFilter === "type" && selectedTenantType === item.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/80 text-muted-foreground"
              }`}
              onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("type"); setSelectedTenantType(item.value) }) }}
            >
              <span>{item.label}</span>
              <span className="font-semibold">{item.count}</span>
            </button>
          ))}
        </div>
      </div>
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
