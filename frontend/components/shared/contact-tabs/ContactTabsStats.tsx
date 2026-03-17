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
  | "collections-all"
  | "collections-received-rent"
  | "collections-delinquent-amount"
  | "tenants-stats-all"
  | "tenants-stats-active-tenants"
  | "tenants-stats-delinquent-tenants"
  | "tenants-stats-under-move-out"
  | "tenants-stats-under-move-in"
  | "maintenance-all"
  | "maintenance-total-wos"
  | "maintenance-unassigned-wos"
  | "maintenance-in-progress"
  | "processes-all"
  | "processes-open"
  | "processes-overdue"
  | "tasks-all"
  | "tasks-open"
  | "tasks-overdue"
  | "lease-status-all"
  | "lease-status-active"
  | "lease-status-expired"
  | "lease-status-month-to-month"
  | "lease-status-expiring-in-90-days"

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
  const totalReceivedRent = allTenants.reduce((sum, c) => sum + (c.rentCollected || 0), 0)
  const totalDelinquentAmount = allTenants.reduce((sum, c) => sum + (c.delinquentAmount || 0), 0)

  const activeTenantCount = allTenants.filter((c) => c.status === "Active").length
  const delinquentTenantCount = allTenants.filter((c) => (c.delinquentAmount || 0) > 0).length
  const underMoveOutCount = allTenants.filter((c) => c.moveOutStatus === "Pending").length
  const underMoveInCount = allTenants.filter((c) => c.status === "Pending").length

  const totalWOs = allTenants.reduce((sum, c) => sum + (c.approvedWOs || 0) + (c.pendingApprovalWOs || 0), 0)
  const unassignedWOs = 0
  const inProgressWOs = 0

  const openProcesses = allTenants.reduce((sum, c) => sum + (c.tenantPendingProcesses || 0), 0)
  const overdueProcesses = 0

  const openTasks = allTenants.reduce((sum, c) => sum + (c.tenantPendingTasks || 0), 0)
  const overdueTasks = 0

  const leaseActiveCount = allTenants.filter((c) => c.status === "Active").length
  const leaseExpiredCount = allTenants.filter((c) => c.status === "Inactive").length
  const leaseMonthToMonthCount = allTenants.filter((c) => (c.tenantTags || []).includes("Month-to-Month")).length
  const leaseExpiring90Count = 0

  const apply = (updater: (prev: TenantStatsKey[]) => TenantStatsKey[]) => {
    setTenantStatsFilters(updater)
    onPageReset()
  }

  const subBtnCls = (active: boolean) =>
    `w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/80 text-muted-foreground"}`

  const hasAny = (keys: TenantStatsKey[]) => tenantStatsFilters.some((k) => keys.includes(k))

  const COLLECTIONS_KEYS: TenantStatsKey[] = [
    "collections-all",
    "collections-received-rent",
    "collections-delinquent-amount",
  ]
  const TENANTS_STATS_KEYS: TenantStatsKey[] = [
    "tenants-stats-all",
    "tenants-stats-active-tenants",
    "tenants-stats-delinquent-tenants",
    "tenants-stats-under-move-out",
    "tenants-stats-under-move-in",
  ]
  const MAINTENANCE_KEYS: TenantStatsKey[] = [
    "maintenance-all",
    "maintenance-total-wos",
    "maintenance-unassigned-wos",
    "maintenance-in-progress",
  ]
  const PROCESSES_KEYS: TenantStatsKey[] = ["processes-all", "processes-open", "processes-overdue"]
  const TASKS_KEYS: TenantStatsKey[] = ["tasks-all", "tasks-open", "tasks-overdue"]
  const LEASE_STATUS_KEYS: TenantStatsKey[] = [
    "lease-status-all",
    "lease-status-active",
    "lease-status-expired",
    "lease-status-month-to-month",
    "lease-status-expiring-in-90-days",
  ]

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
      {/* Collections */}
      <div
        className={`${CARD_BASE} ${hasAny(COLLECTIONS_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("collections-all", COLLECTIONS_KEYS, "collections-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-emerald-500/5">
          <div className="p-1 rounded bg-emerald-500/10">
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-xs font-medium text-foreground">Collections</span>
        </div>
        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[90px] overflow-y-auto pr-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("collections-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("collections-all", COLLECTIONS_KEYS, "collections-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{totalReceivedRent + totalDelinquentAmount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("collections-received-rent"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "collections-received-rent",
                COLLECTIONS_KEYS,
                "collections-all",
              )
            }}
          >
            <span className="text-left">Received Rent</span>
            <span className="font-semibold">{totalReceivedRent}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("collections-delinquent-amount"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "collections-delinquent-amount",
                COLLECTIONS_KEYS,
                "collections-all",
              )
            }}
          >
            <span className="text-left">Delinquent Amount</span>
            <span className="font-semibold">{totalDelinquentAmount}</span>
          </button>
        </div>
      </div>

      {/* Tenants Stats */}
      <div
        className={`${CARD_BASE} ${hasAny(TENANTS_STATS_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("tenants-stats-all", TENANTS_STATS_KEYS, "tenants-stats-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-success/5">
          <div className="p-1 rounded bg-success/10">
            <Users className="h-4 w-4 text-success" />
          </div>
          <span className="text-xs font-medium text-foreground">Tenants Stats</span>
        </div>
        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[90px] overflow-y-auto pr-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tenants-stats-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("tenants-stats-all", TENANTS_STATS_KEYS, "tenants-stats-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{allTenants.length}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tenants-stats-active-tenants"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "tenants-stats-active-tenants",
                TENANTS_STATS_KEYS,
                "tenants-stats-all",
              )
            }}
          >
            <span className="text-left">Active Tenants</span>
            <span className="font-semibold">{activeTenantCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tenants-stats-delinquent-tenants"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "tenants-stats-delinquent-tenants",
                TENANTS_STATS_KEYS,
                "tenants-stats-all",
              )
            }}
          >
            <span className="text-left">Delinquent Tenants</span>
            <span className="font-semibold">{delinquentTenantCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tenants-stats-under-move-out"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "tenants-stats-under-move-out",
                TENANTS_STATS_KEYS,
                "tenants-stats-all",
              )
            }}
          >
            <span className="text-left">Under Move-out</span>
            <span className="font-semibold">{underMoveOutCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tenants-stats-under-move-in"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "tenants-stats-under-move-in",
                TENANTS_STATS_KEYS,
                "tenants-stats-all",
              )
            }}
          >
            <span className="text-left">Under Move-In</span>
            <span className="font-semibold">{underMoveInCount}</span>
          </button>
        </div>
      </div>

      {/* Maintenance */}
      <div
        className={`${CARD_BASE} ${hasAny(MAINTENANCE_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("maintenance-all", MAINTENANCE_KEYS, "maintenance-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-info/5">
          <div className="p-1 rounded bg-info/10">
            <Wrench className="h-4 w-4 text-info" />
          </div>
          <span className="text-xs font-medium text-foreground">Maintenance</span>
        </div>
        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[90px] overflow-y-auto pr-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("maintenance-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("maintenance-all", MAINTENANCE_KEYS, "maintenance-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{totalWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("maintenance-total-wos"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("maintenance-total-wos", MAINTENANCE_KEYS, "maintenance-all")
            }}
          >
            <span className="text-left">Total WOs</span>
            <span className="font-semibold">{totalWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("maintenance-unassigned-wos"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "maintenance-unassigned-wos",
                MAINTENANCE_KEYS,
                "maintenance-all",
              )
            }}
          >
            <span className="text-left">Unassigned WOs</span>
            <span className="font-semibold">{unassignedWOs}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("maintenance-in-progress"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "maintenance-in-progress",
                MAINTENANCE_KEYS,
                "maintenance-all",
              )
            }}
          >
            <span className="text-left">In Progress</span>
            <span className="font-semibold">{inProgressWOs}</span>
          </button>
        </div>
      </div>

      {/* Processes */}
      <div
        className={`${CARD_BASE} ${hasAny(PROCESSES_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("processes-all", PROCESSES_KEYS, "processes-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-accent/30">
          <div className="p-1 rounded bg-accent">
            <Layers className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">Processes</span>
        </div>
        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[90px] overflow-y-auto pr-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("processes-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("processes-all", PROCESSES_KEYS, "processes-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{openProcesses + overdueProcesses}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("processes-open"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("processes-open", PROCESSES_KEYS, "processes-all")
            }}
          >
            <span className="text-left">Open</span>
            <span className="font-semibold">{openProcesses}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("processes-overdue"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("processes-overdue", PROCESSES_KEYS, "processes-all")
            }}
          >
            <span className="text-left">Overdue</span>
            <span className="font-semibold">{overdueProcesses}</span>
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div
        className={`${CARD_BASE} ${hasAny(TASKS_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("tasks-all", TASKS_KEYS, "tasks-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-warning/5">
          <div className="p-1 rounded bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs font-medium text-foreground">Tasks</span>
        </div>
        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[90px] overflow-y-auto pr-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tasks-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("tasks-all", TASKS_KEYS, "tasks-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{openTasks + overdueTasks}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tasks-open"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("tasks-open", TASKS_KEYS, "tasks-all")
            }}
          >
            <span className="text-left">Open</span>
            <span className="font-semibold">{openTasks}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("tasks-overdue"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("tasks-overdue", TASKS_KEYS, "tasks-all")
            }}
          >
            <span className="text-left">Overdue</span>
            <span className="font-semibold">{overdueTasks}</span>
          </button>
        </div>
      </div>

      {/* Lease Status */}
      <div
        className={`${CARD_BASE} ${hasAny(LEASE_STATUS_KEYS) ? CARD_ACTIVE : "bg-background"}`}
        onClick={() => toggleCategoryKey("lease-status-all", LEASE_STATUS_KEYS, "lease-status-all")}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
          <div className="p-1 rounded bg-muted">
            <Tag className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">Lease Status</span>
        </div>
        <div className="flex flex-col px-2 py-2 gap-0.5 max-h-[90px] overflow-y-auto pr-1">
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("lease-status-all"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("lease-status-all", LEASE_STATUS_KEYS, "lease-status-all")
            }}
          >
            <span className="text-left">All</span>
            <span className="font-semibold">{allTenants.length}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("lease-status-active"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("lease-status-active", LEASE_STATUS_KEYS, "lease-status-all")
            }}
          >
            <span className="text-left">Active</span>
            <span className="font-semibold">{leaseActiveCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("lease-status-expired"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey("lease-status-expired", LEASE_STATUS_KEYS, "lease-status-all")
            }}
          >
            <span className="text-left">Expired</span>
            <span className="font-semibold">{leaseExpiredCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("lease-status-month-to-month"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "lease-status-month-to-month",
                LEASE_STATUS_KEYS,
                "lease-status-all",
              )
            }}
          >
            <span className="text-left">Month to Month</span>
            <span className="font-semibold">{leaseMonthToMonthCount}</span>
          </button>
          <button
            type="button"
            className={subBtnCls(tenantStatsFilters.includes("lease-status-expiring-in-90-days"))}
            onClick={(e) => {
              e.stopPropagation()
              toggleCategoryKey(
                "lease-status-expiring-in-90-days",
                LEASE_STATUS_KEYS,
                "lease-status-all",
              )
            }}
          >
            <span className="text-left">Expiring in 90 Days</span>
            <span className="font-semibold">{leaseExpiring90Count}</span>
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
