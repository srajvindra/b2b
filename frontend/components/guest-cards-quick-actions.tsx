"use client"

import {
  CheckSquare,
  CalendarIcon,
  BarChart3,
  Users,
  Key,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  Filter,
  Home,
} from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const guestCardsQuickActions: QuickActionGroup[] = [
  {
    id: "guest-cards-main",
    actions: [
      { icon: Users, label: "New Guest Card" },
      { icon: Users, label: "Bulk Guest Cards" },
      { icon: Clock, label: "Set Showing Availability" },
      { icon: Key, label: "Manage Lockboxes" },
      { icon: Key, label: "Showings With CodeBox" },
      { icon: CalendarIcon, label: "View Calendar" },
      { icon: Users, label: "Guest Card Interests" },
      { icon: FileText, label: "Guest Card Inquiries" },
      { icon: Filter, label: "Prospect Source Tracking" },
      { icon: Home, label: "Owner Leasing" },
      { icon: DollarSign, label: "Premium Listing Billing" },
      { icon: TrendingUp, label: "Leasing Agent Performance" },
      { icon: BarChart3, label: "Leasing Funnel Performance" },
    ],
  },
]

export function GuestCardsQuickActions() {
  return <QuickActionSidebar subtitle="Guest Cards" actions={guestCardsQuickActions} />
}

