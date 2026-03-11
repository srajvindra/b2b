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

export type OwnerTileFilter = "none" | "collections" | "income-expenses" | "properties-status" | "maintenance"
export type OwnerCollectionsSubFilter = "all" | "rent-collected" | "delinquent"
export type OwnerIncomeExpenseSubFilter = "all" | "income" | "expenses"
export type OwnerPropertiesStatusSubFilter = "all" | "occupied" | "vacant"
export type OwnerMaintenanceSubFilter = "all" | "approved-wos" | "pending-approval"

export type TenantTileFilter = "all" | "active" | "pending" | "moveout" | "evictions" | "type"

export type ContactTabsStatsOwnersProps = {
  variant: "owners"
  owners: Contact[]
  ownerTileFilter: OwnerTileFilter
  setOwnerTileFilter: (v: OwnerTileFilter) => void
  collectionsSubFilter: OwnerCollectionsSubFilter
  setCollectionsSubFilter: (v: OwnerCollectionsSubFilter) => void
  incomeExpenseSubFilter: OwnerIncomeExpenseSubFilter
  setIncomeExpenseSubFilter: (v: OwnerIncomeExpenseSubFilter) => void
  propertiesStatusSubFilter: OwnerPropertiesStatusSubFilter
  setPropertiesStatusSubFilter: (v: OwnerPropertiesStatusSubFilter) => void
  maintenanceSubFilter: OwnerMaintenanceSubFilter
  setMaintenanceSubFilter: (v: OwnerMaintenanceSubFilter) => void
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
  collectionsSubFilter,
  setCollectionsSubFilter,
  incomeExpenseSubFilter,
  setIncomeExpenseSubFilter,
  propertiesStatusSubFilter,
  setPropertiesStatusSubFilter,
  maintenanceSubFilter,
  setMaintenanceSubFilter,
  onPageReset,
}: ContactTabsStatsOwnersProps) {
  const allOwners = owners

  const totalRentCollected = allOwners.reduce((sum, c) => sum + (c.rentCollected || 0), 0)
  const totalDelinquent = allOwners.reduce((sum, c) => sum + (c.delinquentAmount || 0), 0)
  const ownersWithRent = allOwners.filter((c) => (c.rentCollected || 0) > 0).length
  const ownersWithDelinquent = allOwners.filter((c) => (c.delinquentAmount || 0) > 0).length

  const totalIncome = allOwners.reduce((sum, c) => sum + (c.ownerIncome || 0), 0)
  const totalExpense = allOwners.reduce((sum, c) => sum + (c.ownerExpense || 0), 0)
  const ownersWithIncome = allOwners.filter((c) => (c.ownerIncome || 0) > 0).length
  const ownersWithExpense = allOwners.filter((c) => (c.ownerExpense || 0) > 0).length

  const totalOccupied = allOwners.reduce((sum, c) => sum + (c.occupiedUnits || 0), 0)
  const totalVacant = allOwners.reduce((sum, c) => sum + (c.vacantUnits || 0), 0)
  const ownersWithOccupied = allOwners.filter((c) => (c.occupiedUnits || 0) > 0).length
  const ownersWithVacant = allOwners.filter((c) => (c.vacantUnits || 0) > 0).length

  const totalApprovedWOs = allOwners.reduce((sum, c) => sum + (c.approvedWOs || 0), 0)
  const totalPendingWOs = allOwners.reduce((sum, c) => sum + (c.pendingApprovalWOs || 0), 0)
  const ownersWithApprovedWOs = allOwners.filter((c) => (c.approvedWOs || 0) > 0).length
  const ownersWithPendingWOs = allOwners.filter((c) => (c.pendingApprovalWOs || 0) > 0).length

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const apply = (fn: () => void) => {
    fn()
    onPageReset()
  }

  const subBtnCls = (active: boolean) =>
    `w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80 text-muted-foreground"
    }`

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Collections */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "collections" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-emerald-500/5">
          <div className="p-1 rounded bg-emerald-500/10">
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-foreground">Collections</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "collections" && collectionsSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("collections"); setCollectionsSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{fmt(totalRentCollected + totalDelinquent)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "collections" && collectionsSubFilter === "rent-collected")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("collections"); setCollectionsSubFilter("rent-collected") }) }}
          >
            <span className="text-left">Rent Collected</span>
            <span className="font-semibold">{fmt(totalRentCollected)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "collections" && collectionsSubFilter === "delinquent")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("collections"); setCollectionsSubFilter("delinquent") }) }}
          >
            <span className="text-left">Delinquent Amount</span>
            <span className="font-semibold">{fmt(totalDelinquent)}</span>
          </button>
        </div>
      </div>

      {/* Income & Expense */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "income-expenses" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-blue-500/5">
          <div className="p-1 rounded bg-blue-500/10">
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-foreground">Income & Expenses</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "income-expenses" && incomeExpenseSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("income-expenses"); setIncomeExpenseSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{fmt(totalIncome + totalExpense)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "income-expenses" && incomeExpenseSubFilter === "income")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("income-expenses"); setIncomeExpenseSubFilter("income") }) }}
          >
            <span className="text-left">Income</span>
            <span className="font-semibold">{fmt(totalIncome)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "income-expenses" && incomeExpenseSubFilter === "expenses")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("income-expenses"); setIncomeExpenseSubFilter("expenses") }) }}
          >
            <span className="text-left">Expenses</span>
            <span className="font-semibold">{fmt(totalExpense)}</span>
          </button>
        </div>
      </div>

      {/* Properties Status */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "properties-status" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
          <div className="p-1 rounded bg-info/10">
            <Home className="h-4 w-4 text-info" />
          </div>
          <span className="text-xs font-medium text-foreground">Properties Status</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "properties-status" && propertiesStatusSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("properties-status"); setPropertiesStatusSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{totalOccupied + totalVacant}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "properties-status" && propertiesStatusSubFilter === "occupied")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("properties-status"); setPropertiesStatusSubFilter("occupied") }) }}
          >
            <span className="text-left">Occupied Units</span>
            <span className="font-semibold">{totalOccupied}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "properties-status" && propertiesStatusSubFilter === "vacant")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("properties-status"); setPropertiesStatusSubFilter("vacant") }) }}
          >
            <span className="text-left">Vacant Units</span>
            <span className="font-semibold">{totalVacant}</span>
          </button>
        </div>
      </div>

      {/* Maintenance */}
      <div className={`${CARD_BASE} ${ownerTileFilter === "maintenance" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Wrench className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Maintenance</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "maintenance" && maintenanceSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("maintenance"); setMaintenanceSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{totalApprovedWOs + totalPendingWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "maintenance" && maintenanceSubFilter === "approved-wos")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("maintenance"); setMaintenanceSubFilter("approved-wos") }) }}
          >
            <span className="text-left">Approved WOs</span>
            <span className="font-semibold">{totalApprovedWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerTileFilter === "maintenance" && maintenanceSubFilter === "pending-approval")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setOwnerTileFilter("maintenance"); setMaintenanceSubFilter("pending-approval") }) }}
          >
            <span className="text-left">Pending for Approval</span>
            <span className="font-semibold">{totalPendingWOs}</span>
          </button>
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

  const subBtnCls = (active: boolean) =>
    `w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80 text-muted-foreground"}`

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

      {/* Pending */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "pending" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Pending</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "pending" && tenantPendingSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("pending"); setTenantPendingSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{tenantPendingTasksTotal + tenantPendingProcessesTotal}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "pending" && tenantPendingSubFilter === "tasks")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("pending"); setTenantPendingSubFilter("tasks") }) }}
          >
            <span className="text-left">Pending Tasks</span>
            <span className="font-semibold">{tenantPendingTasksTotal}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "pending" && tenantPendingSubFilter === "processes")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("pending"); setTenantPendingSubFilter("processes") }) }}
          >
            <span className="text-left">Pending Processes</span>
            <span className="font-semibold">{tenantPendingProcessesTotal}</span>
          </button>
        </div>
      </div>

      {/* Move-out */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "moveout" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <LogOut className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Move-out</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "moveout" && tenantMoveoutSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("moveout"); setTenantMoveoutSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{pendingMoveouts + completedMoveouts}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "moveout" && tenantMoveoutSubFilter === "pending")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("moveout"); setTenantMoveoutSubFilter("pending") }) }}
          >
            <span className="text-left">Pending Move-outs</span>
            <span className="font-semibold">{pendingMoveouts}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "moveout" && tenantMoveoutSubFilter === "completed")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("moveout"); setTenantMoveoutSubFilter("completed") }) }}
          >
            <span className="text-left">Completed Move-outs</span>
            <span className="font-semibold">{completedMoveouts}</span>
          </button>
        </div>
      </div>

      {/* Evictions */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "evictions" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-destructive/5">
          <div className="p-1 rounded bg-destructive/10">
            <Gavel className="h-4 w-4 text-destructive" />
          </div>
          <span className="text-xs font-medium text-foreground">Evictions</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "evictions" && tenantEvictionSubFilter === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("evictions"); setTenantEvictionSubFilter("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{pendingEvictions + completedEvictions}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "evictions" && tenantEvictionSubFilter === "pending")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("evictions"); setTenantEvictionSubFilter("pending") }) }}
          >
            <span className="text-left">Pending Evictions</span>
            <span className="font-semibold">{pendingEvictions}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "evictions" && tenantEvictionSubFilter === "completed")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("evictions"); setTenantEvictionSubFilter("completed") }) }}
          >
            <span className="text-left">Completed Evictions</span>
            <span className="font-semibold">{completedEvictions}</span>
          </button>
        </div>
      </div>

      {/* Type */}
      <div className={`${CARD_BASE} ${tenantTileFilter === "type" ? CARD_ACTIVE : "bg-background"}`}>
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
          <div className="p-1 rounded bg-accent">
            <Layers className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">Type</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "type" && selectedTenantType === "all")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("type"); setSelectedTenantType("all") }) }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{allTenants.length}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "type" && selectedTenantType === "Self Paying")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("type"); setSelectedTenantType("Self Paying") }) }}
          >
            <span className="text-left">Self Paying</span>
            <span className="font-semibold">{selfPayingCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantTileFilter === "type" && selectedTenantType === "Section 8")}
            onClick={(e) => { e.stopPropagation(); apply(() => { setTenantTileFilter("type"); setSelectedTenantType("Section 8") }) }}
          >
            <span className="text-left">Section 8</span>
            <span className="font-semibold">{section8Count}</span>
          </button>
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
