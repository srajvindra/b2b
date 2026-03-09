"use client"

import { useMemo } from "react"
import { useQuickActions } from "@/context/QuickActionsContext"
import { getLeadQuickActions } from "@/lib/quickActions"

type LeadQuickActionsProps = {
  subtitle?: string
  onSendEmail?: () => void
  onSendSMS?: () => void
  onLogCall?: () => void
  onAddNote?: () => void
  onScheduleMeeting?: () => void
  onReassign?: () => void
}

/**
 * Registers Lead quick actions into the global right sidebar.
 * This component intentionally renders nothing.
 */
export function LeadQuickActions({
  subtitle,
  onSendEmail,
  onSendSMS,
  onLogCall,
  onAddNote,
  onScheduleMeeting,
  onReassign,
}: LeadQuickActionsProps) {
  const actions = useMemo(
    () =>
      getLeadQuickActions({
        onSendEmail,
        onSendSMS,
        onLogCall,
        onAddNote,
        onScheduleMeeting,
        onReassign,
      }),
    [onAddNote, onLogCall, onReassign, onScheduleMeeting, onSendEmail, onSendSMS],
  )

  useQuickActions(actions, {
    subtitle,
    aiSuggestedPrompts: [
      "Summarize this lead",
      "Next steps for this application",
      "Compare applicants for this unit",
    ],
    aiPlaceholder: "Ask about this lead...",
  })

  return null
}
