"use client"

import type { ReactNode } from "react"

export type ContactDetailType = "owner" | "tenant" | "lead-owner" | "lead-tenant"

export interface Stage {
  id: string
  label: string
  /** Optional color token or hex used for the segment background. */
  color?: string
}

export type AlertTone = "info" | "warning" | "danger"

export interface Alert {
  id: string
  title: string
  description?: string
  tone?: AlertTone
}

export interface Tab {
  id: string
  label: string
  /** Optional small badge count next to the label (e.g. open tasks). */
  badgeCount?: number
  /** Static content for the tab body. */
  content?: ReactNode
  /** Render prop alternative when content must be computed by caller. */
  render?: () => ReactNode
}

export interface QuickAction {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
}

export interface ContactDetailViewProps {
  // Header
  name: string
  email: string
  phone: string
  source?: string
  assignee?: string

  // Stage bar
  stages?: Stage[]
  currentStage?: string

  // Alert banners
  alerts?: Alert[]

  // Tabs config
  tabs: Tab[]
  defaultTab?: string

  // Right panel
  quickActions?: QuickAction[]

  // Navigation
  backLabel?: string
  backHref?: string

  // Page type controls what shows/hides
  type: ContactDetailType
}

