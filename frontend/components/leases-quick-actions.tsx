"use client"

import { FileText, FileCheck } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const leasesQuickActions: QuickActionGroup[] = [
  {
    id: "leases-main",
    actions: [
      { icon: FileText, label: "Lease Templates" },
      { icon: FileCheck, label: "PDF Form Templates" },
    ],
  },
]

export function LeasesQuickActions() {
  return <QuickActionSidebar subtitle="Leases" actions={leasesQuickActions} />
}
