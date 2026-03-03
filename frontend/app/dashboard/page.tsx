"use client"

import { User, Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useQuickActions } from "@/context/QuickActionsContext"
import { dashboardQuickActions } from "@/lib/quickActions"
import { useTasks } from "@/features/dashboard/hooks/useTasks"
import { useCommunications } from "@/features/dashboard/hooks/useCommunications"
import { useKPIs } from "@/features/dashboard/hooks/useKPIs"
import { CommunicationsCard } from "@/features/dashboard/components/CommunicationsCard"
import { TasksCard } from "@/features/dashboard/components/TasksCard"
import { KPIsCard } from "@/features/dashboard/components/KPIsCard"
import { DashboardPanel } from "@/features/dashboard/components/DashboardPanel"

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
    go: (_route: string, _params?: unknown) => {},
  }
}

export default function Page() {
  useQuickActions(dashboardQuickActions, { subtitle: "Dashboard" })
  const {
    filteredTasks,
    taskSummary,
    selectedStaff,
    setSelectedStaff,
    searchQuery: tasksSearchQuery,
    setSearchQuery: setTasksSearchQuery,
    staffMembers,
    filteredStaffMembers,
  } = useTasks()

  const {
    filteredCommunications,
    selectedTile,
    setSelectedTile,
    subFilter,
    setSubFilter,
    commSummary,
    emailComms,
    smsComms,
    callComms,
    isUnresponded,
    isPending,
  } = useCommunications(selectedStaff)

  const {
    kpiData,
    kpiView,
    setKpiView,
    expandedSection,
    setExpandedSection,
    kpisSearchQuery,
    setKpisSearchQuery,
    userRole,
  } = useKPIs()

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Popover>
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
        </Popover>
      </div>

      {selectedStaff && (
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
      )}

      <div className="space-y-4">
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
        <TasksCard
          filteredTasks={filteredTasks}
          taskSummary={taskSummary}
          searchQuery={tasksSearchQuery}
          setSearchQuery={setTasksSearchQuery}
          selectedStaff={selectedStaff}
        />
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
      </div>
    </div>
  )
}
