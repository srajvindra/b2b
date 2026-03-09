"use client"

import { usePathname } from "next/navigation"
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { QuickActionGroup } from "@/components/quick-action/QuickActionSidebar"

function getQuickActionsSubtitleFromPathname(pathname: string | null): string | undefined {
  if (!pathname) return undefined

  // Calendar
  if (pathname === "/calendar" || pathname.startsWith("/calendar/")) return "Calendar"

  // Contacts
  if (pathname === "/contacts/owners" || pathname.startsWith("/contacts/owners/")) return "Contacts - Owners"
  if (pathname === "/contacts/tenants" || pathname.startsWith("/contacts/tenants/")) return "Contacts - Tenants"
  if (pathname === "/contacts/vendors" || pathname.startsWith("/contacts/vendors/")) return "Contacts - Vendors"
  if (pathname === "/contacts/property-technicians" || pathname.startsWith("/contacts/property-technicians/"))
    return "Contacts - Property Technicians"
  if (pathname === "/contacts/leasing-agents" || pathname.startsWith("/contacts/leasing-agents/"))
    return "Contacts - Leasing Agents"

  // Leads
  if (pathname === "/leads/owner-prospects" || pathname.startsWith("/leads/owner-prospects/"))
    return "Leads - Owner Prospects"
  if (pathname === "/leads/lease-prospects" || pathname.startsWith("/leads/lease-prospects/"))
    return "Leads - Lease Prospects"

  // Properties
  if (pathname === "/properties" || pathname.startsWith("/properties/")) return "Properties"

  // Dashboard
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return "Dashboard"

  return undefined
}

export type QuickActionsOptions = {
  /** Optional label for the quick actions panel (e.g. "Dashboard"). */
  subtitle?: string
  /** Page-specific prompts for the AI Assistant. Shown as quick-suggest buttons. */
  aiSuggestedPrompts?: string[]
  /** Placeholder for the AI Assistant input (e.g. "Ask about this property..."). */
  aiPlaceholder?: string
}

export type QuickActionsContextValue = {
  /** Currently registered quick action groups (empty when no page has registered). */
  actions: QuickActionGroup[]
  /** Optional subtitle for the quick actions panel (e.g. "Dashboard"). */
  subtitle: string | undefined
  /** AI Assistant: page-specific suggested prompts. */
  aiSuggestedPrompts: string[] | undefined
  /** AI Assistant: input placeholder. */
  aiPlaceholder: string | undefined
  /** Register quick actions for the current page. Call with [] to clear. */
  setQuickActions: (actions: QuickActionGroup[], options?: QuickActionsOptions) => void
}

const QuickActionsContext = createContext<QuickActionsContextValue | null>(null)

export function QuickActionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    actions: QuickActionGroup[]
    subtitle: string | undefined
    aiSuggestedPrompts: string[] | undefined
    aiPlaceholder: string | undefined
  }>({ actions: [], subtitle: undefined, aiSuggestedPrompts: undefined, aiPlaceholder: undefined })

  const setQuickActions = useCallback(
    (actions: QuickActionGroup[], options?: QuickActionsOptions) => {
      setState({
        actions: actions ?? [],
        subtitle: options?.subtitle,
        aiSuggestedPrompts: options?.aiSuggestedPrompts,
        aiPlaceholder: options?.aiPlaceholder,
      })
    },
    []
  )

  return (
    <QuickActionsContext.Provider
      value={{
        actions: state.actions,
        subtitle: state.subtitle,
        aiSuggestedPrompts: state.aiSuggestedPrompts,
        aiPlaceholder: state.aiPlaceholder,
        setQuickActions,
      }}
    >
      {children}
    </QuickActionsContext.Provider>
  )
}

export function useQuickActionsContext() {
  const ctx = useContext(QuickActionsContext)
  if (!ctx) {
    throw new Error("useQuickActionsContext must be used within QuickActionsProvider")
  }
  return ctx
}

/**
 * Register this page's quick actions with the global header/panel.
 * Actions are cleared automatically when the component unmounts (e.g. on navigation).
 *
 * @param actions - Quick action groups to show. Pass a stable reference (e.g. constant or useMemo).
 * @param options.subtitle - Optional label for the quick actions panel (e.g. "Dashboard").
 * @param options.aiSuggestedPrompts - Page-specific prompts for the AI Assistant.
 * @param options.aiPlaceholder - Placeholder for the AI Assistant input.
 */
export function useQuickActions(
  actions: QuickActionGroup[],
  options?: QuickActionsOptions
) {
  const { setQuickActions } = useQuickActionsContext()
  const pathname = usePathname()
  const subtitle = options?.subtitle ?? getQuickActionsSubtitleFromPathname(pathname)

  useEffect(() => {
    setQuickActions(actions, {
      subtitle,
      aiSuggestedPrompts: options?.aiSuggestedPrompts,
      aiPlaceholder: options?.aiPlaceholder,
    })
    return () => {
      setQuickActions([], undefined)
    }
    // Intentionally omit options?.aiSuggestedPrompts and options?.aiPlaceholder so inline
    // array/object literals don't cause infinite re-runs (new reference every render).
  }, [actions, setQuickActions, subtitle])
}
