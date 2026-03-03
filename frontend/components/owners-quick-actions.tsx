"use client"

import {
  UserPlus,
  CreditCard,
  MonitorSmartphone,
  Send,
  FileText,
  FolderOpen,
  Mail,
  Settings,
} from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const ownersQuickActions: QuickActionGroup[] = [
  {
    id: "owners-main",
    actions: [
      { icon: UserPlus, label: "New Owner" },
      { icon: CreditCard, label: "Owner ACH Setup" },
      { icon: MonitorSmartphone, label: "Owner Portal Activation" },
      { icon: Send, label: "Send Owner Packets" },
      { icon: FileText, label: "New Management Agreement" },
      { icon: FolderOpen, label: "Management Agreements" },
      { icon: Mail, label: "Send Form to Owner" },
      { icon: Settings, label: "Owner Portal Bulk Settings" },
    ],
  },
]

export function OwnersQuickActions() {
  return <QuickActionSidebar subtitle="Owners" actions={ownersQuickActions} />
}

