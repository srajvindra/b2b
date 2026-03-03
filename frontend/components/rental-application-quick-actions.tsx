"use client"

import { FileText, Users, Home, ClipboardList, Mail, UserCheck, TrendingUp, Building2, Megaphone } from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const rentalApplicationQuickActions: QuickActionGroup[] = [
  {
    id: "rental-applications-main",
    actions: [
      { icon: FileText, label: "New Rental Application" },
      { icon: Mail, label: "Email Rental Application" },
      { icon: ClipboardList, label: "Rental Applications" },
      { icon: Users, label: "Tenant Directory" },
      { icon: Home, label: "Unit Vacancy Detail" },
      { icon: Megaphone, label: "Prospect Source Tracking" },
      { icon: Building2, label: "Owner Leasing" },
      { icon: UserCheck, label: "Leasing Agent Performance" },
      { icon: TrendingUp, label: "Leasing Funnel Performance" },
    ],
  },
]

export function RentalApplicationQuickActions() {
  return (
    <QuickActionSidebar
      className="hidden lg:block bg-card max-h-none static border-border"
      subtitle="Rental Applications"
      actions={rentalApplicationQuickActions}
    />
  )
}

