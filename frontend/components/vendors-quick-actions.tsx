"use client"

import { UserPlus, CreditCard, FolderOpen, FileCheck, FileText, Receipt, FileSpreadsheet } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const vendorsQuickActions: QuickActionGroup[] = [
  {
    id: "vendors-main",
    actions: [
      { icon: UserPlus, label: "New Vendor" },
      { icon: CreditCard, label: "Request Payment Info" },
      { icon: FolderOpen, label: "Request Documents" },
      { icon: FileCheck, label: "Request W-9" },
      { icon: FileText, label: "Vendor Directory" },
      { icon: Receipt, label: "Vendor Ledger" },
      { icon: FileSpreadsheet, label: "Vendor Ledger (Enhanced)" },
    ],
  },
]

export function VendorsQuickActions() {
  return <QuickActionSidebar subtitle="Vendors" actions={vendorsQuickActions} />
}

