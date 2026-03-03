"use client"

import {
  Building2,
  FolderPlus,
  Key,
  Building,
  FileText,
  Home,
  DollarSign,
  FileBarChart,
  BarChart3,
  Settings,
} from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const propertiesQuickActions: QuickActionGroup[] = [
  {
    id: "properties-main",
    actions: [
      { icon: Building2, label: "New Property" },
      { icon: FolderPlus, label: "New Property Group" },
      { icon: Key, label: "Manage Lockboxes" },
      { icon: Building, label: "New Association" },
      { icon: FileText, label: "Property Directory" },
      { icon: Home, label: "Unit Directory" },
      { icon: DollarSign, label: "Rent Roll" },
      { icon: FileBarChart, label: "Unit Vacancy Detail" },
      { icon: BarChart3, label: "General Ledger" },
      { icon: Settings, label: "Bulk Update Statements" },
    ],
  },
]

export default function PropertiesQuickActions() {
  return <QuickActionSidebar subtitle="Properties" actions={propertiesQuickActions} />
}

