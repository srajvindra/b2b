"use client"

import {
  Wrench,
  Home,
  DoorOpen,
  DollarSign,
  CheckSquare,
  ListTodo,
} from "lucide-react"

interface SubItem {
  key: string
  label: string
  value: string | number
  highlight?: boolean
}

interface CategoryTile {
  id: string
  title: string
  icon: React.ReactNode
  total: number | string
  color: string
  iconBg: string
  iconColor: string
  activeBg: string
  activeBorder: string
  items: SubItem[]
}

const CATEGORIES: CategoryTile[] = [
  {
    id: "work-orders",
    title: "Work Orders",
    icon: <Wrench className="w-3.5 h-3.5" />,
    total: 48,
    color: "border-slate-200 bg-white",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-300",
    items: [
      { key: "wo-open", label: "Open", value: 24 },
      { key: "wo-unassigned", label: "Unassigned", value: 6, highlight: true },
      { key: "wo-done", label: "Work Done", value: 11 },
      { key: "wo-bill", label: "Ready to Bill", value: 7 },
    ],
  },
  {
    id: "occupied-units",
    title: "Occupied Units",
    icon: <Home className="w-3.5 h-3.5" />,
    total: 157,
    color: "border-slate-200 bg-white",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    activeBg: "bg-green-50",
    activeBorder: "border-green-300",
    items: [
      { key: "occ-good", label: "All Good", value: 142 },
      { key: "occ-delinquent", label: "Delinquent", value: 8, highlight: true },
      { key: "occ-eviction", label: "Under Eviction", value: 2, highlight: true },
      { key: "occ-moveout", label: "Move-Out", value: 5 },
    ],
  },
  {
    id: "vacant-units",
    title: "Vacant Units",
    icon: <DoorOpen className="w-3.5 h-3.5" />,
    total: 15,
    color: "border-slate-200 bg-white",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    activeBg: "bg-orange-50",
    activeBorder: "border-orange-300",
    items: [
      { key: "vac-b2b", label: "Make Ready by B2B", value: 4 },
      { key: "vac-owner", label: "Make Ready by Owner", value: 3 },
      { key: "vac-hold", label: "On Hold", value: 2 },
      { key: "vac-market", label: "Posted on Market", value: 6 },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    icon: <DollarSign className="w-3.5 h-3.5" />,
    total: "94%",
    color: "border-slate-200 bg-white",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    activeBg: "bg-teal-50",
    activeBorder: "border-teal-300",
    items: [
      { key: "col-pct", label: "Percentage", value: "94%" },
      { key: "col-delinquency", label: "Delinquency Amt", value: "$12,450", highlight: true },
    ],
  },
  {
    id: "processes",
    title: "Processes",
    icon: <CheckSquare className="w-3.5 h-3.5" />,
    total: 15,
    color: "border-slate-200 bg-white",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    activeBg: "bg-purple-50",
    activeBorder: "border-purple-300",
    items: [
      { key: "proc-open", label: "Open", value: 12 },
      { key: "proc-overdue", label: "Overdue", value: 3, highlight: true },
    ],
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: <ListTodo className="w-3.5 h-3.5" />,
    total: 37,
    color: "border-slate-200 bg-white",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    activeBg: "bg-red-50",
    activeBorder: "border-red-300",
    items: [
      { key: "task-open", label: "Open", value: 32 },
      { key: "task-overdue", label: "Overdue", value: 5, highlight: true },
    ],
  },
]

interface PropertyMetricsSummaryProps {
  activeFilter?: string | null
  onFilterChange?: (filterKey: string | null) => void
}

export function PropertyMetricsSummary({ activeFilter, onFilterChange }: PropertyMetricsSummaryProps) {
  const handleItemClick = (key: string) => {
    if (activeFilter === key) {
      onFilterChange?.(null)
    } else {
      onFilterChange?.(key)
    }
  }

  const activeCategoryId = activeFilter
    ? CATEGORIES.find((c) => c.items.some((i) => i.key === activeFilter))?.id ?? null
    : null

  return (
    <div className="bg-background px-6 py-3 border-b">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategoryId === cat.id

          return (
            <div
              key={cat.id}
              className={`flex flex-col rounded-lg border transition-colors overflow-hidden ${
                isActive ? `${cat.activeBg} ${cat.activeBorder}` : `${cat.color} hover:shadow-sm`
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
                <div className={`p-1 rounded-md ${cat.iconBg} shrink-0`}>
                  <span className={cat.iconColor}>{cat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-500 leading-tight truncate">{cat.title}</p>
                </div>
                <span className="text-sm font-bold text-slate-900 tabular-nums">{cat.total}</span>
              </div>

              {/* Sub-items (3 rows visible, rest via scroll) */}
              <div className="px-2 py-2">
                <div className="h-[96px] overflow-y-auto pr-1 flex flex-col gap-0.5">
                  {cat.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleItemClick(item.key)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors text-left ${
                        activeFilter === item.key
                          ? `${cat.activeBg} font-medium`
                          : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      <span
                        className={`text-xs font-bold tabular-nums shrink-0 ml-2 ${
                          item.highlight ? "text-red-600" : "text-slate-800"
                        }`}
                      >
                        {item.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
