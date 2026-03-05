"use client"

import { useState, useRef, useEffect } from "react"
import {
  Wrench,
  Home,
  DoorOpen,
  DollarSign,
  CheckSquare,
  ListTodo,
  ChevronDown,
  X,
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleItemClick = (key: string) => {
    if (activeFilter === key) {
      onFilterChange?.(null)
    } else {
      onFilterChange?.(key)
    }
    setOpenDropdown(null)
  }

  const activeCategoryId = activeFilter
    ? CATEGORIES.find((c) => c.items.some((i) => i.key === activeFilter))?.id ?? null
    : null

  return (
    <div className="bg-background px-6 py-3 border-b" ref={dropdownRef}>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategoryId === cat.id
          const isOpen = openDropdown === cat.id
          const activeItem = cat.items.find((i) => i.key === activeFilter)

          return (
            <div key={cat.id} className="relative">
              {/* Collapsed Tile */}
              <button
                type="button"
                onClick={() => setOpenDropdown(isOpen ? null : cat.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-left ${
                  isActive
                    ? `${cat.activeBg} ${cat.activeBorder}`
                    : `${cat.color} hover:shadow-sm`
                }`}
              >
                <div className={`p-1 rounded-md ${cat.iconBg} shrink-0`}>
                  <span className={cat.iconColor}>{cat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-500 leading-tight truncate">{cat.title}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900">
                      {activeItem ? activeItem.value : cat.total}
                    </span>
                    {activeItem && (
                      <span className="text-[9px] text-slate-500 truncate">({activeItem.label})</span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`h-3 w-3 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-lg border border-slate-200 shadow-lg py-1 min-w-[180px]">
                  {cat.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleItemClick(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                        activeFilter === item.key
                          ? `${cat.activeBg} font-medium`
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs text-slate-700">{item.label}</span>
                      <span className={`text-xs font-bold tabular-nums ${item.highlight ? "text-red-600" : "text-slate-800"}`}>
                        {item.value}
                      </span>
                    </button>
                  ))}
                  {isActive && (
                    <div className="border-t border-slate-100 mt-1 pt-1 px-3 pb-1">
                      <button
                        type="button"
                        onClick={() => { onFilterChange?.(null); setOpenDropdown(null) }}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3 w-3" />
                        Clear filter
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
