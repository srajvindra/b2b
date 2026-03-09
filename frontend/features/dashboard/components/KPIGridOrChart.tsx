"use client"

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
import type { KPITableRow, KPIHistoryPoint } from "../types"
import type { KPIViewMode } from "../types"

interface KPIGridOrChartProps {
  view: KPIViewMode
  tableData: KPITableRow[]
  chartData: KPIHistoryPoint[]
  chartKeys: string[]
}

export function KPIGridOrChart({
  view,
  tableData,
  chartData,
  chartKeys,
}: KPIGridOrChartProps) {
  if (view === "table") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {tableData.map((row, i) => {
          const isPositive = row.trend.startsWith("+")
          return (
            <div
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p className="text-xs text-slate-500 font-medium">{row.label}</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900">{row.value}</p>
              <p
                className={`mt-0.5 text-xs font-medium ${
                  isPositive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {row.trend}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-[280px] w-full bg-white rounded-lg border border-slate-200 p-2">
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
  )
}
