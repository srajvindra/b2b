"use client"

import { QuickActionSidebar } from "@/components/quick-action/QuickActionSidebar"
import { dashboardQuickActions } from "@/lib/quickActions"

export function DashboardPanel() {
  return (
    <QuickActionSidebar
      className="w-full max-h-none static bg-[rgba(248,245,245,1)]"
      subtitle="Dashboard"
      actions={dashboardQuickActions}
    />
  )
}

