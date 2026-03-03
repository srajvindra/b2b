"use client"

import {
  BarChart3,
  Search,
  TrendingUp,
  ArrowUpRight,
  Target,
  LineChart,
  FileKey,
  Settings2,
  Wrench,
  LayoutGrid,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { KPIGridOrChart } from "./KPIGridOrChart"
import type { KPIData } from "../types"
import type { KPIViewMode } from "../hooks/useKPIs"

interface KPIsCardProps {
  kpiData: KPIData
  kpiView: KPIViewMode
  setKpiView: (v: KPIViewMode) => void
  expandedSection: string | null
  setExpandedSection: (s: string | null) => void
  kpisSearchQuery: string
  setKpisSearchQuery: (q: string) => void
  userRole: "associate" | "manager" | "leader"
}

function KPIAccordionSection({
  id,
  title,
  icon,
  expanded,
  onToggle,
  kpiView,
  tableData,
  chartData,
  chartKeys,
}: {
  id: string
  title: string
  icon: React.ReactNode
  expanded: boolean
  onToggle: () => void
  kpiView: KPIViewMode
  tableData: { label: string; value: number | string; trend: string }[]
  chartData: { month: string; [key: string]: string | number }[]
  chartKeys: string[]
}) {
  return (
    <Collapsible open={expanded} onOpenChange={onToggle}>
      <div className="rounded-lg border border-slate-200 bg-white">
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 rounded-t-lg transition-colors">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-slate-100 text-slate-600">{icon}</div>
            <span className="font-semibold text-slate-900">{title}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0">
            <KPIGridOrChart
              view={kpiView}
              tableData={tableData}
              chartData={chartData}
              chartKeys={chartKeys}
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export function KPIsCard({
  kpiData,
  kpiView,
  setKpiView,
  expandedSection,
  setExpandedSection,
  kpisSearchQuery,
  setKpisSearchQuery,
  userRole,
}: KPIsCardProps) {
  const roleLabel =
    userRole === "associate"
      ? "Your Performance"
      : userRole === "manager"
        ? "Team Performance"
        : "Organization Overview"

  return (
    <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-800 rounded">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Key Performance Metrics
                </CardTitle>
                <p className="text-xs text-slate-500">{roleLabel}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  32% Conv. Rate
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                <ArrowUpRight className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  48 New Leads
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                <Target className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">
                  94% Occupancy
                </span>
              </div>
            </div>
            <div className="relative ml-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by staff name..."
                className="h-9 w-48 border-slate-200 bg-white pl-8"
                value={kpisSearchQuery}
                onChange={(e) => setKpisSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={kpiView === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setKpiView("table")}
              className={kpiView === "table" ? "bg-slate-800 hover:bg-slate-900" : ""}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={kpiView === "chart" ? "default" : "outline"}
              size="sm"
              onClick={() => setKpiView("chart")}
              className={kpiView === "chart" ? "bg-slate-800 hover:bg-slate-900" : ""}
            >
              <LineChart className="h-4 w-4 mr-1" />
              Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Search bar below header */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by staff name..."
            className="w-full pl-9 h-9 border-slate-200 bg-white"
            value={kpisSearchQuery}
            onChange={(e) => setKpisSearchQuery(e.target.value)}
          />
        </div> */}

        {/* Accordion sections - not tabs */}
        <KPIAccordionSection
          id="sales"
          title="Sales KPIs"
          icon={<TrendingUp className="h-4 w-4" />}
          expanded={expandedSection === "sales"}
          onToggle={() => setExpandedSection(expandedSection === "sales" ? null : "sales")}
          kpiView={kpiView}
          tableData={[
            { label: "New Leads", value: kpiData.sales.newLeads, trend: "+12%" },
            {
              label: "Conversion Rate",
              value: `${kpiData.sales.conversionRate}%`,
              trend: "+3%",
            },
            {
              label: "New Unit Additions",
              value: kpiData.sales.newUnitAdditions,
              trend: "+5%",
            },
            {
              label: "Avg Response Time",
              value: kpiData.sales.avgResponseTime,
              trend: "-15%",
            },
          ]}
          chartData={kpiData.sales.history}
          chartKeys={["leads", "conversion"]}
        />
        <KPIAccordionSection
          id="leasing"
          title="Leasing KPIs"
          icon={<FileKey className="h-4 w-4" />}
          expanded={expandedSection === "leasing"}
          onToggle={() => setExpandedSection(expandedSection === "leasing" ? null : "leasing")}
          kpiView={kpiView}
          tableData={[
            { label: "New Leads", value: kpiData.leasing.newLeads, trend: "+8%" },
            {
              label: "Conversion Rate",
              value: `${kpiData.leasing.conversionRate}%`,
              trend: "+2%",
            },
            {
              label: "New Applications",
              value: kpiData.leasing.newApplications,
              trend: "+15%",
            },
            {
              label: "New Leases Signed",
              value: kpiData.leasing.newLeasesSigned,
              trend: "+10%",
            },
            {
              label: "Avg Days on Market",
              value: kpiData.leasing.avgDaysOnMarket,
              trend: "-8%",
            },
            {
              label: "Avg Response Time",
              value: kpiData.leasing.avgResponseTime,
              trend: "-12%",
            },
          ]}
          chartData={kpiData.leasing.history}
          chartKeys={["leads", "leases"]}
        />
        <KPIAccordionSection
          id="operations"
          title="Operations KPIs"
          icon={<Settings2 className="h-4 w-4" />}
          expanded={expandedSection === "operations"}
          onToggle={() =>
            setExpandedSection(expandedSection === "operations" ? null : "operations")
          }
          kpiView={kpiView}
          tableData={[
            {
              label: "Total Units",
              value: kpiData.operations.totalUnits,
              trend: "+3%",
            },
            {
              label: "Churn Rate",
              value: `${kpiData.operations.churnRate}%`,
              trend: "-2%",
            },
            {
              label: "Occupancy Rate",
              value: `${kpiData.operations.occupancyRate}%`,
              trend: "+1%",
            },
            {
              label: "Rent Collections",
              value: `${kpiData.operations.rentCollections}%`,
              trend: "+0.5%",
            },
            {
              label: "Leases Renewed",
              value: kpiData.operations.leasesRenewed,
              trend: "+12%",
            },
            {
              label: "Open Complaints",
              value: kpiData.operations.openComplaints,
              trend: "-18%",
            },
            {
              label: "Open Terminations",
              value: kpiData.operations.openTerminations,
              trend: "-25%",
            },
            {
              label: "New Work Orders",
              value: kpiData.operations.newWorkOrders,
              trend: "+5%",
            },
            {
              label: "Completed Work Orders",
              value: kpiData.operations.completedWorkOrders,
              trend: "+8%",
            },
            {
              label: "Avg Response Time",
              value: kpiData.operations.avgResponseTime,
              trend: "-10%",
            },
          ]}
          chartData={kpiData.operations.history}
          chartKeys={["occupancy", "collections"]}
        />
        <KPIAccordionSection
          id="maintenance"
          title="Maintenance KPIs"
          icon={<Wrench className="h-4 w-4" />}
          expanded={expandedSection === "maintenance"}
          onToggle={() =>
            setExpandedSection(expandedSection === "maintenance" ? null : "maintenance")
          }
          kpiView={kpiView}
          tableData={[
            {
              label: "Inspection Speed",
              value: kpiData.maintenance.inspectionSpeed,
              trend: "-20%",
            },
            {
              label: "Make-Ready Speed",
              value: kpiData.maintenance.makeReadySpeed,
              trend: "-15%",
            },
            {
              label: "Make-Ready Conversion",
              value: `${kpiData.maintenance.makeReadyConversionRate}%`,
              trend: "+5%",
            },
            {
              label: "Avg Response Time",
              value: kpiData.maintenance.avgResponseTime,
              trend: "-8%",
            },
          ]}
          chartData={kpiData.maintenance.history}
          chartKeys={["inspectionDays", "makeReadyDays"]}
        />
      </CardContent>
    </Card>
  )
}
