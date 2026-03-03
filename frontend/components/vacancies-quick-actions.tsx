"use client"

import {
  FileText,
  Building2,
  Users,
  DollarSign,
  Home,
  ClipboardList,
  FileSignature,
  Upload,
  Megaphone,
  Star,
  MapPin,
} from "lucide-react"

import {
  QuickActionSidebar,
  type QuickActionGroup,
} from "@/components/quick-action/QuickActionSidebar"

const vacanciesQuickActions: QuickActionGroup[] = [
  {
    id: "vacancies-main",
    actions: [
      { icon: ClipboardList, label: "Create Vacancies List" },
      { icon: FileText, label: "New Rental Application" },
      { icon: Users, label: "New Guest Card" },
      { icon: FileSignature, label: "Lease Templates" },
      { icon: Building2, label: "Unit Vacancy Detail" },
      { icon: FileText, label: "Rental Applications" },
      { icon: Users, label: "Guest Card Interests" },
      { icon: Home, label: "Owner Leasing" },
      { icon: DollarSign, label: "Premium Listing Billing" },
      { icon: Upload, label: "Post & Unpost Vacancies" },
      { icon: Megaphone, label: "Marketing Campaigns" },
      { icon: Star, label: "Premium Listing" },
      { icon: MapPin, label: "Zillow Listing Spotlight" },
    ],
  },
]

export function VacanciesQuickActions() {
  return <QuickActionSidebar subtitle="Vacancies" actions={vacanciesQuickActions} />
}

