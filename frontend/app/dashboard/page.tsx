"use client"

import { useMemo, useState } from "react"
import { User, Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useQuickActions } from "@/context/QuickActionsContext"
import { dashboardQuickActions } from "@/lib/quickActions"
import { CommunicationsCard } from "@/features/dashboard/components/CommunicationsCard"
import { TasksCard } from "@/features/dashboard/components/TasksCard"
import { KPIsCard } from "@/features/dashboard/components/KPIsCard"
import { DashboardPanel } from "@/features/dashboard/components/DashboardPanel"
import { Combined } from "@/features/dashboard/components/Combined"
import type { CombinedItem } from "@/features/dashboard/components/Combined"
import { CommunicationModal } from "@/features/dashboard/components/CommunicationModal"
import type { Communication } from "@/features/dashboard/types"
import { Wrench, FileText, LogOut, DollarSign, ShieldAlert, OctagonAlert } from "lucide-react"
import { Filter } from "lucide-react"
import { mockTasks } from "@/features/dashboard/data/mockTasks"
import { mockCommunications } from "@/features/dashboard/data/mockCommunications"
import { getMockKPIData } from "@/features/dashboard/data/mockKPIs"
import type { CommSummary, KPIData, KPIViewMode, TaskSummary } from "@/features/dashboard/types"

// Simple stubs for legacy hooks used by older components (e.g. leads pages).
// Currently we always treat the user as an admin view and do not navigate via this nav object.
export function useView() {
  // Legacy components expect `view` to sometimes be "admin" or "staff".
  return { view: "admin" as "admin" | "staff" }
}

export function useNav() {
  return {
    route: { name: "owners" as const },
    // Legacy navigation is no-op in the Next.js app; pages use real routes instead.
    go: (_route: string, _params?: unknown) => { },
  }
}

export default function Page() {
  useQuickActions(dashboardQuickActions, {
    subtitle: "Dashboard",
    aiSuggestedPrompts: [
      "What's my current occupancy rate?",
      "Show me delinquent accounts",
      "Upcoming tasks this week",
    ],
    aiPlaceholder: "Ask about your dashboard...",
  })
  // ----- Tasks (inlined from features/dashboard/hooks/useTasks.ts) -----
  const STAFF_MEMBERS = useMemo(
    () => [
      { id: 1, name: "Nina Patel", role: "Leasing Manager" },
      { id: 2, name: "Richard Surovi", role: "Property Manager" },
      { id: 3, name: "Mike Johnson", role: "Maintenance Tech" },
      { id: 4, name: "Sarah Chen", role: "Leasing Agent" },
      { id: 5, name: "David Wilson", role: "Operations Manager" },
    ],
    [],
  )
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [tasksSearchQuery, setTasksSearchQuery] = useState("")

  const filteredStaffMembers = useMemo(
    () => STAFF_MEMBERS.filter((s) => s.name.toLowerCase().includes(tasksSearchQuery.toLowerCase())),
    [STAFF_MEMBERS, tasksSearchQuery],
  )

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((t) => {
      const matchesStaff = selectedStaff ? t.assignedTo === selectedStaff : true
      const matchesSearch = tasksSearchQuery ? t.assignedTo.toLowerCase().includes(tasksSearchQuery.toLowerCase()) : true
      return matchesStaff && matchesSearch
    })
  }, [selectedStaff, tasksSearchQuery])

  const taskSummary = useMemo(
    (): TaskSummary => ({
      total: filteredTasks.length,
      overdue: filteredTasks.filter((t) => t.overdue).length,
      dueToday: filteredTasks.filter((t) => t.dueDate === "2025-12-23").length,
      dueThisWeek: filteredTasks.filter((t) => !t.overdue && t.dueDate <= "2025-12-29").length,
    }),
    [filteredTasks],
  )

  // ----- Communications (inlined from features/dashboard/hooks/useCommunications.ts) -----
  function isUnresponded(c: Communication): boolean {
    if (!c.read || c.responded) return false
    const now = new Date()
    const hoursSinceReceived = (now.getTime() - c.receivedAt.getTime()) / (1000 * 60 * 60)
    return hoursSinceReceived >= 24
  }

  function isPending(c: Communication): boolean {
    return !c.read || isUnresponded(c)
  }

  const [selectedTile, setSelectedTile] = useState<"emails" | "sms" | "calls" | null>(null)
  const [subFilter, setSubFilter] = useState<"all" | "unread" | "unresponded">("all")

  const baseFilteredCommunications = useMemo(() => {
    return mockCommunications.filter((c) => {
      const matchesStaff = selectedStaff ? c.assignedTo === selectedStaff : true
      return matchesStaff
    })
  }, [selectedStaff])

  const emailComms = useMemo(() => baseFilteredCommunications.filter((c) => c.type === "email"), [baseFilteredCommunications])
  const smsComms = useMemo(() => baseFilteredCommunications.filter((c) => c.type === "text"), [baseFilteredCommunications])
  const callComms = useMemo(() => baseFilteredCommunications.filter((c) => c.type === "call"), [baseFilteredCommunications])

  const commSummary = useMemo(
    (): CommSummary => ({
      pending: emailComms.filter(isPending).length + smsComms.filter(isPending).length + callComms.filter(isUnresponded).length,
      emails: emailComms.filter(isPending).length,
      emailsUnread: emailComms.filter((c) => !c.read).length,
      emailsUnresponded: emailComms.filter(isUnresponded).length,
      sms: smsComms.filter(isPending).length,
      smsUnread: smsComms.filter((c) => !c.read).length,
      smsUnresponded: smsComms.filter(isUnresponded).length,
      calls: callComms.filter(isUnresponded).length,
    }),
    [callComms, emailComms, smsComms],
  )

  const filteredCommunications = useMemo(() => {
    return baseFilteredCommunications.filter((c) => {
      if (selectedTile === "emails" && c.type !== "email") return false
      if (selectedTile === "sms" && c.type !== "text") return false
      if (selectedTile === "calls" && c.type !== "call") return false
      if (subFilter === "unread") return !c.read
      if (subFilter === "unresponded") return isUnresponded(c)
      if (!selectedTile) {
        if (c.type === "call") return isUnresponded(c) || !c.read
        return isPending(c)
      }
      if (selectedTile === "calls") return isUnresponded(c) || !c.read
      return isPending(c)
    })
  }, [baseFilteredCommunications, selectedTile, subFilter])

  // ----- KPIs (inlined from features/dashboard/hooks/useKPIs.ts) -----
  const [userRole] = useState<"associate" | "manager" | "leader">("manager")
  const [kpiView, setKpiView] = useState<KPIViewMode>("table")
  const [expandedSection, setExpandedSection] = useState<string | null>("sales")
  const [kpisSearchQuery, setKpisSearchQuery] = useState("")
  const kpiData = useMemo<KPIData>(() => getMockKPIData(userRole), [userRole])

  const [dashboardTab, setDashboardTab] = useState<"tasks" | "communications" | "combined">("tasks")
  const [showCommModal, setShowCommModal] = useState(false)
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null)

  const combinedItems = useMemo<CombinedItem[]>(() => {
    const commItems = filteredCommunications.map((c) => ({
      kind: "comm" as const,
      sortDate: c.receivedAt,
      comm: c,
    }))
    const taskItems = filteredTasks.map((t) => ({
      kind: "task" as const,
      sortDate: new Date(t.dueDate + "T12:00:00"),
      task: t,
    }))
    return [...commItems, ...taskItems].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
  }, [filteredCommunications, filteredTasks])

  const [showDashFilters, setShowDashFilters] = useState(false)
  const [dashFilter, setDashFilter] = useState<"all" | "myTasks" | "overdue" | "legalRisk" | "orgTasks">("all")
  const [dashFilterType, setDashFilterType] = useState<"all" | "myTasks" | "overdue" | "legalRisk" | "orgTasks">("all")
  const [dashFilterValue, setDashFilterValue] = useState<string>("")
  const [dashFilterDate, setDashFilterDate] = useState<string>("")
  const [dashFilterStatus, setDashFilterStatus] = useState<"all" | "open" | "closed">("all")
  const [dashFilterPriority, setDashFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [dashFilterAssignee, setDashFilterAssignee] = useState<string>("")
  const [dashFilterReporter, setDashFilterReporter] = useState<string>("")
  const [dashFilterCreatedAt, setDashFilterCreatedAt] = useState<string>("")

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-4 w-4" />
              {selectedStaff ?? "All Staff Members"}
              <span className="text-muted-foreground">▼</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-0" align="end">
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search staff..."
                  className="pl-8 h-9 border-slate-200"
                  value={tasksSearchQuery}
                  onChange={(e) => setTasksSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto py-1">
              <button
                type="button"
                className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 ${!selectedStaff ? "bg-slate-50 font-medium" : ""
                  }`}
                onClick={() => {
                  setSelectedStaff(null)
                  setTasksSearchQuery("")
                }}
              >
                <Users className="h-4 w-4 text-slate-500" />
                <span>All Staff Members</span>
              </button>
              {filteredStaffMembers.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 ${selectedStaff === staff.name ? "bg-slate-50 font-medium" : ""
                    }`}
                  onClick={() => {
                    setSelectedStaff(staff.name)
                    setTasksSearchQuery("")
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900">{staff.name}</span>
                    <span className="text-xs text-slate-500">{staff.role}</span>
                  </div>
                </button>
              ))}
              {filteredStaffMembers.length === 0 && (
                <div className="px-3 py-2 text-sm text-slate-500 text-center">
                  No staff found
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover> */}
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Wrench className="h-4.5 w-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">12</p>
            <p className="text-[11px] text-slate-500 leading-tight">Open Maintenance</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="h-4.5 w-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">8</p>
            <p className="text-[11px] text-slate-500 leading-tight">Lease Renewals</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <LogOut className="h-4.5 w-4.5 text-orange-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">3</p>
            <p className="text-[11px] text-slate-500 leading-tight">Move-Outs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <DollarSign className="h-4.5 w-4.5 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">94%</p>
            <p className="text-[11px] text-slate-500 leading-tight">Rent Collected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">2</p>
            <p className="text-[11px] text-slate-500 leading-tight">Legal / SLA Risk</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-red-200 bg-red-50/30">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <OctagonAlert className="h-4.5 w-4.5 text-red-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-red-700 leading-tight">5</p>
            <p className="text-[11px] text-red-600 leading-tight">Critical</p>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex items-center border-b border-slate-200 pb-0">
        <div className="flex items-center gap-1">
          {(["tasks", "communications", "combined"] as const).map((tab) => {
            const count = tab === "tasks" ? filteredTasks.length : tab === "communications" ? filteredCommunications.length : tab === "combined" ? combinedItems.length : null
            return (
              <button
                key={tab}
                onClick={() => setDashboardTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors relative flex items-center gap-1.5 ${dashboardTab === tab
                  ? "text-teal-700"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab}
                {count !== null && (
                  <span className={`text-[10px] font-semibold min-w-[18px] h-[18px] inline-flex items-center justify-center rounded-full ${dashboardTab === tab
                    ? "bg-teal-100 text-teal-700"
                    : "bg-slate-200 text-slate-600"
                    }`}>
                    {count}
                  </span>
                )}
                {dashboardTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setShowDashFilters(!showDashFilters)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${showDashFilters || dashFilter !== "all"
            ? "bg-teal-50 border-teal-200 text-teal-700"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {dashFilter !== "all" && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
          )}
        </button>
      </div>

      {/* Filter Section */}
      {showDashFilters && (
        <div className="flex items-center gap-2 px-1 py-2 bg-slate-50 rounded-lg border border-slate-200">
          {([
            { key: "all" as const, label: "All" },
            { key: "myTasks" as const, label: "My Tasks" },
            { key: "overdue" as const, label: "Overdue" },
            { key: "legalRisk" as const, label: "Legal Risk" },
            ...(userRole === "manager" || userRole === "leader" ? [{ key: "orgTasks" as const, label: "Org Tasks" }] : []),
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setDashFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${dashFilter === f.key
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
            >
              {f.label}
            </button>
          ))}
          {dashFilter !== "all" && (
            <button
              onClick={() => setDashFilter("all")}
              className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 underline"
            >
              Clear
            </button>
          )}
        </div>
      )}


      {/* {selectedStaff && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <User className="h-4 w-4" />
          <span>
            Showing records for: <strong>{selectedStaff}</strong>
          </span>
          <button
            type="button"
            className="ml-auto text-slate-500 hover:text-slate-700 text-xs underline"
            onClick={() => setSelectedStaff(null)}
          >
            Clear filter
          </button>
        </div>
      )} */}

      <div className="space-y-4">
        {dashboardTab === "communications" && (
          <CommunicationsCard
            filteredCommunications={filteredCommunications}
            selectedTile={selectedTile}
            setSelectedTile={setSelectedTile}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            commSummary={commSummary}
            emailComms={emailComms}
            smsComms={smsComms}
            callComms={callComms}
            isUnresponded={isUnresponded}
            isPending={isPending}
            selectedStaff={selectedStaff}
          />
        )}
        {dashboardTab === "tasks" && (
          <TasksCard
            filteredTasks={filteredTasks}
            taskSummary={taskSummary}
            searchQuery={tasksSearchQuery}
            setSearchQuery={setTasksSearchQuery}
            selectedStaff={selectedStaff}
          />
        )}
        {dashboardTab === "combined" && (
          <Combined
            combinedItems={combinedItems}
            onCommunicationClick={(comm) => {
              setSelectedCommunication(comm)
              setShowCommModal(true)
            }}
          />
        )}
        {/* <TasksCard
          filteredTasks={filteredTasks}
          taskSummary={taskSummary}
          searchQuery={tasksSearchQuery}
          setSearchQuery={setTasksSearchQuery}
          selectedStaff={selectedStaff}
        /> */}
        <KPIsCard
          kpiData={kpiData}
          kpiView={kpiView}
          setKpiView={setKpiView}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
          kpisSearchQuery={kpisSearchQuery}
          setKpisSearchQuery={setKpisSearchQuery}
          userRole={userRole}
        />

      <CommunicationModal
        communication={selectedCommunication}
        open={showCommModal}
        onOpenChange={setShowCommModal}
      />
      </div>
    </div>
  )
}
