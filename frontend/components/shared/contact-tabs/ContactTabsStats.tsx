"use client"

import type { Dispatch, SetStateAction } from "react"
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

export type OwnerStatsKey =
  | "collections-all"
  | "collections-rent-collected"
  | "collections-delinquent"
  | "income-expenses-all"
  | "income-expenses-income"
  | "income-expenses-expenses"
  | "properties-status-all"
  | "properties-status-occupied"
  | "properties-status-vacant"
  | "maintenance-all"
  | "maintenance-approved-wos"
  | "maintenance-pending-approval"

export type TenantStatsKey =
  | "tenant-total"
  | "tenant-active"
  | "pending-all"
  | "pending-tasks"
  | "pending-processes"
  | "moveout-all"
  | "moveout-pending"
  | "moveout-completed"
  | "evictions-all"
  | "evictions-pending"
  | "evictions-completed"
  | "type-all"
  | "type-self-paying"
  | "type-section-8"

export type ContactTabsStatsOwnersProps = {
  variant: "owners"
  owners: Contact[]
  ownerStatsFilters: OwnerStatsKey[]
  setOwnerStatsFilters: Dispatch<SetStateAction<OwnerStatsKey[]>>
  onPageReset: () => void
}

export type ContactTabsStatsTenantsProps = {
  variant: "tenants"
  tenants: Contact[]
  tenantStatsFilters: TenantStatsKey[]
  setTenantStatsFilters: Dispatch<SetStateAction<TenantStatsKey[]>>
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
  ownerStatsFilters,
  setOwnerStatsFilters,
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

  const apply = (updater: (prev: OwnerStatsKey[]) => OwnerStatsKey[]) => {
    setOwnerStatsFilters(updater)
    onPageReset()
  }

  const subBtnCls = (active: boolean) =>
    `w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80 text-muted-foreground"
    }`

  const COLLECTION_KEYS: OwnerStatsKey[] = [
    "collections-all",
    "collections-rent-collected",
    "collections-delinquent",
  ]
  const INCOME_KEYS: OwnerStatsKey[] = [
    "income-expenses-all",
    "income-expenses-income",
    "income-expenses-expenses",
  ]
  const PROPERTIES_STATUS_KEYS: OwnerStatsKey[] = [
    "properties-status-all",
    "properties-status-occupied",
    "properties-status-vacant",
  ]
  const MAINTENANCE_KEYS: OwnerStatsKey[] = [
    "maintenance-all",
    "maintenance-approved-wos",
    "maintenance-pending-approval",
  ]

  const hasActiveInCategory = (keys: OwnerStatsKey[]) =>
    keys.some((k) => ownerStatsFilters.includes(k))

  const toggleCategoryKey = (
    key: OwnerStatsKey,
    categoryKeys: OwnerStatsKey[],
    allKey: OwnerStatsKey,
  ) =>
    apply((prev) => {
      const isAll = key === allKey
      if (isAll) {
        const hasAll = prev.includes(allKey)
        const hasOtherInCategory = prev.some(
          (k) => categoryKeys.includes(k) && k !== allKey,
        )

        // If only "All" is active, clicking it turns the whole category off
        if (hasAll && !hasOtherInCategory) {
          return prev.filter((k) => k !== allKey)
        }

        // Otherwise, select "All" and clear other options in this category
        const withoutCategory = prev.filter((k) => !categoryKeys.includes(k))
        return [...withoutCategory, allKey]
      }

      const hasKey = prev.includes(key)
      if (hasKey) {
        // Toggle off this specific option
        return prev.filter((k) => k !== key)
      }

      // Selecting a specific option removes "All" but keeps other specifics
      const withoutAll = prev.filter((k) => k !== allKey)
      return [...withoutAll, key]
    })

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Collections */}
      <div
        className={`${CARD_BASE} ${hasActiveInCategory(COLLECTION_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("collections-all", COLLECTION_KEYS, "collections-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-emerald-500/5">
          <div className="p-1 rounded bg-emerald-500/10">
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-foreground">Collections</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("collections-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("collections-all", COLLECTION_KEYS, "collections-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{fmt(totalRentCollected + totalDelinquent)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("collections-rent-collected"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("collections-rent-collected", COLLECTION_KEYS, "collections-all")
            }}
          >
            <span className="text-left">Rent Collected</span>
            <span className="font-semibold">{fmt(totalRentCollected)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("collections-delinquent"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("collections-delinquent", COLLECTION_KEYS, "collections-all")
            }}
          >
            <span className="text-left">Delinquent Amount</span>
            <span className="font-semibold">{fmt(totalDelinquent)}</span>
          </button>
        </div>
      </div>

      {/* Income & Expense */}
      <div
        className={`${CARD_BASE} ${hasActiveInCategory(INCOME_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("income-expenses-all", INCOME_KEYS, "income-expenses-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-blue-500/5">
          <div className="p-1 rounded bg-blue-500/10">
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-foreground">Income & Expenses</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("income-expenses-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("income-expenses-all", INCOME_KEYS, "income-expenses-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{fmt(totalIncome + totalExpense)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("income-expenses-income"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("income-expenses-income", INCOME_KEYS, "income-expenses-all")
            }}
          >
            <span className="text-left">Income</span>
            <span className="font-semibold">{fmt(totalIncome)}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("income-expenses-expenses"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("income-expenses-expenses", INCOME_KEYS, "income-expenses-all")
            }}
          >
            <span className="text-left">Expenses</span>
            <span className="font-semibold">{fmt(totalExpense)}</span>
          </button>
        </div>
      </div>

      {/* Properties Status */}
      <div
        className={`${CARD_BASE} ${hasActiveInCategory(PROPERTIES_STATUS_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() =>
          toggleCategoryKey("properties-status-all", PROPERTIES_STATUS_KEYS, "properties-status-all")
        }
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
          <div className="p-1 rounded bg-info/10">
            <Home className="h-4 w-4 text-info" />
          </div>
          <span className="text-xs font-medium text-foreground">Properties Status</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("properties-status-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("properties-status-all", PROPERTIES_STATUS_KEYS, "properties-status-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{totalOccupied + totalVacant}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("properties-status-occupied"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "properties-status-occupied",
                PROPERTIES_STATUS_KEYS,
                "properties-status-all",
              )
            }}
          >
            <span className="text-left">Occupied Units</span>
            <span className="font-semibold">{totalOccupied}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("properties-status-vacant"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "properties-status-vacant",
                PROPERTIES_STATUS_KEYS,
                "properties-status-all",
              )
            }}
          >
            <span className="text-left">Vacant Units</span>
            <span className="font-semibold">{totalVacant}</span>
          </button>
        </div>
      </div>

      {/* Maintenance */}
      <div
        className={`${CARD_BASE} ${hasActiveInCategory(MAINTENANCE_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("maintenance-all", MAINTENANCE_KEYS, "maintenance-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Wrench className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Maintenance</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("maintenance-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("maintenance-all", MAINTENANCE_KEYS, "maintenance-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{totalApprovedWOs + totalPendingWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("maintenance-approved-wos"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "maintenance-approved-wos",
                MAINTENANCE_KEYS,
                "maintenance-all",
              )
            }}
          >
            <span className="text-left">Approved WOs</span>
            <span className="font-semibold">{totalApprovedWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(ownerStatsFilters.includes("maintenance-pending-approval"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "maintenance-pending-approval",
                MAINTENANCE_KEYS,
                "maintenance-all",
              )
            }}
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
  tenantStatsFilters,
  setTenantStatsFilters,
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
    const hasTasks = tenantPendingTasksTotal
    const hasProcesses = tenantPendingProcessesTotal
    if (tenantStatsFilters.includes("pending-tasks") && !tenantStatsFilters.includes("pending-all")) {
      return tenantPendingTasksTotal
    }
    if (tenantStatsFilters.includes("pending-processes") && !tenantStatsFilters.includes("pending-all")) {
      return tenantPendingProcessesTotal
    }
    return tenantPendingTasksTotal + tenantPendingProcessesTotal
  }

  const getMoveoutCount = () => {
    if (tenantStatsFilters.includes("moveout-pending") && !tenantStatsFilters.includes("moveout-all")) {
      return pendingMoveouts
    }
    if (tenantStatsFilters.includes("moveout-completed") && !tenantStatsFilters.includes("moveout-all")) {
      return completedMoveouts
    }
    return pendingMoveouts + completedMoveouts
  }

  const getEvictionCount = () => {
    if (tenantStatsFilters.includes("evictions-pending") && !tenantStatsFilters.includes("evictions-all")) {
      return pendingEvictions
    }
    if (tenantStatsFilters.includes("evictions-completed") && !tenantStatsFilters.includes("evictions-all")) {
      return completedEvictions
    }
    return pendingEvictions + completedEvictions
  }

  const getTenantTypeCount = () => {
    if (tenantStatsFilters.includes("type-self-paying") && !tenantStatsFilters.includes("type-all")) {
      return allTenants.filter((c) => c.tenantType === "Self Paying").length
    }
    if (tenantStatsFilters.includes("type-section-8") && !tenantStatsFilters.includes("type-all")) {
      return allTenants.filter((c) => c.tenantType === "Section 8").length
    }
    return allTenants.length
  }

  const apply = (updater: (prev: TenantStatsKey[]) => TenantStatsKey[]) => {
    setTenantStatsFilters(updater)
    onPageReset()
  }

  const selfPayingCount = allTenants.filter((c) => c.tenantType === "Self Paying").length
  const section8Count = allTenants.filter((c) => c.tenantType === "Section 8").length

  const subBtnCls = (active: boolean) =>
    `w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80 text-muted-foreground"}`

  const hasAny = (keys: TenantStatsKey[]) => tenantStatsFilters.some((k) => keys.includes(k))

  const PENDING_KEYS: TenantStatsKey[] = ["pending-all", "pending-tasks", "pending-processes"]
  const MOVEOUT_KEYS: TenantStatsKey[] = ["moveout-all", "moveout-pending", "moveout-completed"]
  const EVICTION_KEYS: TenantStatsKey[] = ["evictions-all", "evictions-pending", "evictions-completed"]
  const TYPE_KEYS: TenantStatsKey[] = ["type-all", "type-self-paying", "type-section-8"]

  const toggleCategoryKey = (
    key: TenantStatsKey,
    categoryKeys: TenantStatsKey[],
    allKey: TenantStatsKey,
  ) =>
    apply((prev) => {
      const isAll = key === allKey
      if (isAll) {
        const hasAll = prev.includes(allKey)
        const hasOtherInCategory = prev.some(
          (k) => categoryKeys.includes(k) && k !== allKey,
        )

        // If only "All" is active, clicking it turns the whole category off
        if (hasAll && !hasOtherInCategory) {
          return prev.filter((k) => k !== allKey)
        }

        // Otherwise, select "All" and clear other options in this category
        const withoutCategory = prev.filter((k) => !categoryKeys.includes(k))
        return [...withoutCategory, allKey]
      }

      const hasKey = prev.includes(key)
      if (hasKey) {
        // Toggle off this specific option
        return prev.filter((k) => k !== key)
      }

      // Selecting a specific option removes "All" but keeps other specifics
      const withoutAll = prev.filter((k) => k !== allKey)
      return [...withoutAll, key]
    })

  return (
    <div className="grid grid-cols-6 gap-3">
      {/* Total Tenants */}
      <div
        className={`${CARD_BASE} ${tenantStatsFilters.includes("tenant-total") ? CARD_ACTIVE : CARD_INACTIVE}`}
        onClick={() =>
          apply((prev) =>
            prev.includes("tenant-total")
              ? prev.filter((k) => k !== "tenant-total")
              : [...prev, "tenant-total"],
          )
        }
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
        className={`${CARD_BASE} ${tenantStatsFilters.includes("tenant-active") ? CARD_ACTIVE : CARD_INACTIVE}`}
        onClick={() =>
          apply((prev) =>
            prev.includes("tenant-active")
              ? prev.filter((k) => k !== "tenant-active")
              : [...prev, "tenant-active"],
          )
        }
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
      <div
        className={`${CARD_BASE} ${hasAny(["pending-all", "pending-tasks", "pending-processes"]) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("pending-all", PENDING_KEYS, "pending-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Pending</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("pending-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("pending-all", PENDING_KEYS, "pending-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{tenantPendingTasksTotal + tenantPendingProcessesTotal}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("pending-tasks"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("pending-tasks", PENDING_KEYS, "pending-all")
            }}
          >
            <span className="text-left">Pending Tasks</span>
            <span className="font-semibold">{tenantPendingTasksTotal}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("pending-processes"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("pending-processes", PENDING_KEYS, "pending-all")
            }}
          >
            <span className="text-left">Pending Processes</span>
            <span className="font-semibold">{tenantPendingProcessesTotal}</span>
          </button>
        </div>
      </div>

      {/* Move-out */}
      <div
        className={`${CARD_BASE} ${hasAny(["moveout-all", "moveout-pending", "moveout-completed"]) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("moveout-all", MOVEOUT_KEYS, "moveout-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <LogOut className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Move-out</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("moveout-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("moveout-all", MOVEOUT_KEYS, "moveout-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{pendingMoveouts + completedMoveouts}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("moveout-pending"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("moveout-pending", MOVEOUT_KEYS, "moveout-all")
            }}
          >
            <span className="text-left">Pending Move-outs</span>
            <span className="font-semibold">{pendingMoveouts}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("moveout-completed"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("moveout-completed", MOVEOUT_KEYS, "moveout-all")
            }}
          >
            <span className="text-left">Completed Move-outs</span>
            <span className="font-semibold">{completedMoveouts}</span>
          </button>
        </div>
      </div>

      {/* Evictions */}
      <div
        className={`${CARD_BASE} ${hasAny(["evictions-all", "evictions-pending", "evictions-completed"]) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("evictions-all", EVICTION_KEYS, "evictions-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-destructive/5">
          <div className="p-1 rounded bg-destructive/10">
            <Gavel className="h-4 w-4 text-destructive" />
          </div>
          <span className="text-xs font-medium text-foreground">Evictions</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("evictions-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("evictions-all", EVICTION_KEYS, "evictions-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{pendingEvictions + completedEvictions}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("evictions-pending"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("evictions-pending", EVICTION_KEYS, "evictions-all")
            }}
          >
            <span className="text-left">Pending Evictions</span>
            <span className="font-semibold">{pendingEvictions}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("evictions-completed"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("evictions-completed", EVICTION_KEYS, "evictions-all")
            }}
          >
            <span className="text-left">Completed Evictions</span>
            <span className="font-semibold">{completedEvictions}</span>
          </button>
        </div>
      </div>

      {/* Type */}
      <div
        className={`${CARD_BASE} ${hasAny(["type-all", "type-self-paying", "type-section-8"]) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("type-all", TYPE_KEYS, "type-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
          <div className="p-1 rounded bg-accent">
            <Layers className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">Type</span>
        </div>
        <div className="flex-1 flex flex-col px-2 py-2 gap-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("type-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("type-all", TYPE_KEYS, "type-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{allTenants.length}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("type-self-paying"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("type-self-paying", TYPE_KEYS, "type-all")
            }}
          >
            <span className="text-left">Self Paying</span>
            <span className="font-semibold">{selfPayingCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("type-section-8"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("type-section-8", TYPE_KEYS, "type-all")
            }}
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
