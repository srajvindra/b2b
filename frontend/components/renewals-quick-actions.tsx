"use client"

import { FileText, FileCheck, RefreshCw, CalendarDays, ClipboardList } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const renewalsQuickActions: QuickActionGroup[] = [
  {
    id: "renewals-main",
    actions: [
      { icon: FileText, label: "Lease Templates" },
      { icon: FileCheck, label: "PDF Form Templates" },
      { icon: RefreshCw, label: "Bulk Lease Renewals" },
      { icon: CalendarDays, label: "Lease Expiration By Month" },
      { icon: ClipboardList, label: "Renewal Summary" },
    ],
  },
]

export function RenewalsQuickActions() {
  return <QuickActionSidebar subtitle="Renewals" actions={renewalsQuickActions} />
}
