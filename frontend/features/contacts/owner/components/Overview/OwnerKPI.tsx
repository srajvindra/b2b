"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Home, FileText } from "lucide-react"

export interface OwnerKPIProps {
  totalProperties?: number
  totalUnits?: number
  activeLeases?: number
  occupiedPercent?: number
  rentCollected?: string
  rentCollectedPercent?: number
  openMaintenance?: number
  highPriorityMaintenance?: number
  mediumPriorityMaintenance?: number
  totalIncome?: string
  totalExpense?: string
  netIncome?: string
}

const defaultProps: Required<OwnerKPIProps> = {
  totalProperties: 3,
  totalUnits: 9,
  activeLeases: 9,
  occupiedPercent: 100,
  rentCollected: "$5,626.50",
  rentCollectedPercent: 77,
  openMaintenance: 5,
  highPriorityMaintenance: 2,
  mediumPriorityMaintenance: 3,
  totalIncome: "$12,450.00",
  totalExpense: "$3,125.00",
  netIncome: "$9,325.00",
}

export function OwnerKPI(props: OwnerKPIProps) {
  const p = { ...defaultProps, ...props }
  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Owner KPIs</h3>
        <span className="text-xs text-muted-foreground">As of {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-50/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Building2 className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Properties</p>
              <p className="text-lg font-semibold text-slate-800">{p.totalProperties}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Units</p>
              <p className="text-lg font-semibold text-slate-800">{p.totalUnits}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Leases</p>
              <p className="text-lg font-semibold text-slate-800">{p.activeLeases}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-700">% Occupied</h4>
              <span className="text-xs text-muted-foreground">See More</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {p.totalUnits - Math.round((p.totalUnits * (100 - p.occupiedPercent)) / 100)} of {p.totalUnits} units rented as of {new Date().toLocaleDateString()}
            </p>
            <div className="relative flex flex-col items-center">
              <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
                <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * p.occupiedPercent) / 100}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-20%] text-center">
                <span className="text-2xl font-bold text-slate-800">{p.occupiedPercent}%</span>
                <p className="text-[10px] text-sky-500 font-medium uppercase tracking-wide">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Rent Collected</h4>
            <p className="text-xs text-muted-foreground mb-3">{p.rentCollectedPercent}% of rent collected as of {new Date().toLocaleDateString()}</p>
            <div className="relative flex flex-col items-center">
              <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
                <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                <path
                  d="M 10 60 A 50 50 0 0 1 110 60"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * p.rentCollectedPercent) / 100}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-20%] text-center">
                <span className="text-xl font-bold text-slate-800">{p.rentCollected}</span>
                <p className="text-[10px] text-green-500 font-medium uppercase tracking-wide">Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Open Maintenance</h4>
            <p className="text-xs text-muted-foreground mb-3">Active maintenance requests</p>
            <div className="flex items-center justify-center py-4">
              <span className="text-4xl font-bold text-slate-800">{p.openMaintenance}</span>
              <p className="text-sm text-muted-foreground mt-1 ml-2">Open Requests</p>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">High Priority</span>
                </div>
                <span className="font-medium text-slate-700">{p.highPriorityMaintenance}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Medium Priority</span>
                </div>
                <span className="font-medium text-slate-700">{p.mediumPriorityMaintenance}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Income & Expense (Owner View)</h4>
            <p className="text-xs text-muted-foreground mb-3">Monthly snapshot</p>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Income</span>
                <span className="text-sm font-semibold text-green-600">{p.totalIncome}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="text-sm font-semibold text-red-500">{p.totalExpense}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Net Income</span>
                  <span className="text-sm font-bold text-slate-800">{p.netIncome}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
                <div className="bg-green-500 h-full" style={{ width: "75%" }} />
                <div className="bg-red-400 h-full" style={{ width: "25%" }} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>Income 75%</span>
                <span>Expenses 25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
