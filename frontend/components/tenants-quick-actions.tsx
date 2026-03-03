"use client"

import { UserPlus, Users, Truck, Mail, FileText, ScrollText, Shield } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const tenantsQuickActions: QuickActionGroup[] = [
  {
    id: "tenants-main",
    actions: [
      { icon: UserPlus, label: "Move-In Tenant" },
      { icon: Users, label: "New Owner" },
      { icon: Truck, label: "New Vendor" },
      { icon: Mail, label: "Email all tenants" },
      { icon: FileText, label: "Rent Roll" },
      { icon: ScrollText, label: "Tenant Ledger" },
      { icon: Shield, label: "Tenant Insurance Coverage" },
    ],
  },
]

export function TenantsQuickActions() {
  return <QuickActionSidebar subtitle="Tenants" actions={tenantsQuickActions} />
}

