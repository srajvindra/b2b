"use client"

import type { ReactNode } from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import type { KPITableRow, KPIHistoryPoint } from "../types"
import type { KPIViewMode } from "../hooks/useKPIs"

interface KPISectionProps {
  title: string
  icon: ReactNode
  expanded: boolean
  onToggle: () => void
  view: KPIViewMode
  tableData: KPITableRow[]
  chartData: KPIHistoryPoint[]
  chartKeys: string[]
}

export function KPISection({
  title,
  icon,
  expanded,
  onToggle,
  view,
  tableData,
  chartData,
  chartKeys,
}: KPISectionProps) {
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
            {view === "table" ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left font-medium text-slate-700 py-2 px-3">Metric</th>
                      <th className="text-right font-medium text-slate-700 py-2 px-3">Value</th>
                      <th className="text-right font-medium text-slate-700 py-2 px-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 px-3 text-slate-700">{row.label}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-900">
                          {row.value}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-600">{row.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      labelStyle={{ color: "#334155" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {chartKeys.map((key, i) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={key.charAt(0).toUpperCase() + key.slice(1)}
                        stroke={i === 0 ? "#3b82f6" : "#22c55e"}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4 }}
                      />
                    ))}
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
