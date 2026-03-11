"use client"

import {
  Wrench,
  Home,
  Building2,
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
  headerBg: string
  iconBg: string
  iconColor: string
  items: SubItem[]
  scrollable?: boolean
}

const CATEGORIES: CategoryTile[] = [
  {
    id: "work-orders",
    title: "Work Orders",
    icon: <Wrench className="w-4 h-4" />,
    total: 48,
    headerBg: "bg-blue-500/10",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    scrollable: true,
    items: [
      { key: "wo-all", label: "All", value: 48 },
      { key: "wo-unassigned", label: "Unassigned", value: 6, highlight: true },
      { key: "wo-done", label: "Work Done", value: 11 },
      { key: "wo-bill", label: "Ready to Bill", value: 7 },
    ],
  },
  {
    id: "occupied-units",
    title: "Occupied Units",
    icon: <Home className="w-4 h-4" />,
    total: 157,
    headerBg: "bg-green-500/10",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    scrollable: true,
    items: [
      { key: "occ-all", label: "All", value: 157 },
      { key: "occ-delinquent", label: "Delinquent", value: 8, highlight: true },
      { key: "occ-eviction", label: "Under Eviction", value: 2, highlight: true },
      { key: "occ-moveout", label: "Move-Out", value: 5 },
    ],
  },
  {
    id: "vacant-units",
    title: "Vacant Units",
    icon: <Building2 className="w-4 h-4" />,
    total: 15,
    headerBg: "bg-orange-500/10",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    scrollable: true,
    items: [
      { key: "vac-all", label: "All", value: 15 },
      { key: "vac-owner", label: "Make Ready by Owner", value: 3 },
      { key: "vac-hold", label: "On Hold", value: 2 },
      { key: "vac-market", label: "Posted on Market", value: 6 },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    icon: <DollarSign className="w-4 h-4" />,
    total: "94%",
    headerBg: "bg-teal-500/10",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    items: [
      { key: "col-all", label: "All", value: "94%" },
      { key: "col-pct", label: "Percentage", value: "94%" },
      { key: "col-delinquency", label: "Delinquency Amt", value: "$12,450", highlight: true },
    ],
  },
  {
    id: "processes",
    title: "Processes",
    icon: <CheckSquare className="w-4 h-4" />,
    total: 15,
    headerBg: "bg-purple-500/10",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    items: [
      { key: "proc-all", label: "All", value: 15 },
      { key: "proc-open", label: "Open", value: 12 },
      { key: "proc-overdue", label: "Overdue", value: 3, highlight: true },
    ],
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: <ListTodo className="w-4 h-4" />,
    total: 37,
    headerBg: "bg-orange-500/10",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    items: [
      { key: "task-all", label: "All", value: 37 },
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

  return (
    <div className="bg-background px-6 py-4 border-b border-border">
      <div className="grid grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => {
          const isCategoryActive = cat.items.some((i) => i.key === activeFilter)

          return (
            <div
              key={cat.id}
              className={`flex flex-col border rounded-lg shadow-sm bg-card overflow-hidden transition-colors ${
                isCategoryActive ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
            >
              {/* Header */}
              <div className={`flex items-center gap-2 px-3 py-2 border-b ${cat.headerBg}`}>
                <div className={`p-1 rounded ${cat.iconBg}`}>
                  <span className={cat.iconColor}>{cat.icon}</span>
                </div>
                <span className="text-xs font-medium text-foreground truncate">{cat.title}</span>
                <span className="text-lg font-bold ml-auto tabular-nums text-foreground">{cat.total}</span>
              </div>
              {/* Body: sub-metrics */}
              <div
                className={`flex-1 flex flex-col gap-0.5 px-2 py-2 ${cat.scrollable ? "max-h-[90px] overflow-y-auto" : ""}`}
              >
                {cat.items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleItemClick(item.key)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors text-left ${
                      activeFilter === item.key
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <span
                      className={`font-semibold tabular-nums shrink-0 ml-2 ${
                        item.highlight ? "text-red-600" : "text-foreground"
                      }`}
                    >
                      {item.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
