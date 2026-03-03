"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { QuickActionGroup } from "@/components/quick-action/QuickActionSidebar"

export type QuickActionsContextValue = {
  /** Currently registered quick action groups (empty when no page has registered). */
  actions: QuickActionGroup[]
  /** Optional subtitle for the quick actions panel (e.g. "Dashboard"). */
  subtitle: string | undefined
  /** Register quick actions for the current page. Call with [] to clear. */
  setQuickActions: (actions: QuickActionGroup[], subtitle?: string) => void
}

const QuickActionsContext = createContext<QuickActionsContextValue | null>(null)

export function QuickActionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    actions: QuickActionGroup[]
    subtitle: string | undefined
  }>({ actions: [], subtitle: undefined })

  const setQuickActions = useCallback(
    (actions: QuickActionGroup[], subtitle?: string) => {
      setState({ actions: actions ?? [], subtitle })
    },
    []
  )

  return (
    <QuickActionsContext.Provider
      value={{
        actions: state.actions,
        subtitle: state.subtitle,
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
 */
export function useQuickActions(
  actions: QuickActionGroup[],
  options?: { subtitle?: string }
) {
  const { setQuickActions } = useQuickActionsContext()

  useEffect(() => {
    setQuickActions(actions, options?.subtitle)
    return () => {
      setQuickActions([], undefined)
    }
  }, [actions, options?.subtitle, setQuickActions])
}
