"use client"
import { UserPlus, FileText, Users, DollarSign, Calendar, Eye } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const propertyTechnicianQuickActions: QuickActionGroup[] = [
  {
    id: "property-technicians-main",
    actions: [
      { icon: UserPlus, label: "New PT" },
      { icon: FileText, label: "Request Document" },
      { icon: Users, label: "PTs Directory" },
      { icon: DollarSign, label: "PTs Ledger" },
      { icon: Calendar, label: "PTs Availability" },
      { icon: Eye, label: "PTs Showings" },
    ],
  },
]

export function PropertyTechnicianQuickActions() {
  return <QuickActionSidebar subtitle="Property Technicians" actions={propertyTechnicianQuickActions} />
}

