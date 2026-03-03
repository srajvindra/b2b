"use client"
import { UserPlus, FileText, FolderOpen, DollarSign, Calendar, Eye } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const leasingAgentQuickActions: QuickActionGroup[] = [
  {
    id: "leasing-agents-main",
    actions: [
      { icon: UserPlus, label: "New LA" },
      { icon: FileText, label: "Request License" },
      { icon: FolderOpen, label: "LAs Directory" },
      { icon: DollarSign, label: "LAs Ledger" },
      { icon: Calendar, label: "LAs Availability" },
      { icon: Eye, label: "LAs Showings" },
    ],
  },
]

export function LeasingAgentQuickActions() {
  return <QuickActionSidebar subtitle="Leasing Agents" actions={leasingAgentQuickActions} />
}

