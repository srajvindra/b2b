"use client"

import { Sidebar } from "@/components/layouts/Sidebar/Sidebar"
import { Topbar } from "@/components/layouts/Topbar/Topbar"
import { QuickActionSidebar } from "@/components/quick-action/QuickActionSidebar"
import { useRightPanel } from "@/context/RightPanelContext"
import { useQuickActionsContext } from "@/context/QuickActionsContext"
import { useAppStore } from "@/store/useAppStore"

const TOPBAR_HEIGHT = "3.5rem" // 56px - match Topbar py-3 + content

export function AppShell({ children }: { children: React.ReactNode }) {
  const { panel } = useRightPanel()
  const { actions: quickActions, subtitle: quickActionsSubtitle } = useQuickActionsContext()
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const hasQuickActions = quickActions.length > 0
  const showPanel = panel !== null || hasQuickActions
  const panelContent =
    panel !== null ? (
      panel
    ) : hasQuickActions ? (
      <QuickActionSidebar
        className="w-full max-h-none static bg-[rgba(248,245,245,1)]"
        subtitle={quickActionsSubtitle}
        actions={quickActions}
      />
    ) : null

  return (
    <div className="h-screen w-full overflow-hidden bg-white dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 text-foreground">
      {/* Fixed topbar - full width */}
      <Topbar />

      {/* Fixed left sidebar - below topbar */}
      <Sidebar />

      {/* Main content - ONLY scrollable area; fixed insets so topbar + sidebars stay fixed */}
      <main
        className={`overflow-auto px-4 py-6 fixed bottom-0 top-14 ${
          sidebarCollapsed ? "left-0 lg:left-[72px]" : "left-0 lg:left-[260px]"
        } ${showPanel ? "right-0 lg:right-[224px]" : "right-0"}`}
      >
        {children}
      </main>

      {/* Fixed right sidebar - below topbar (driven by RightPanel or QuickActions context) */}
      {showPanel && panelContent && (
        <aside
          className="hidden lg:block fixed top-[3.5rem] right-0 bottom-0 w-[224px] z-40 border-l bg-muted/10 overflow-hidden flex flex-col"
          style={{ height: `calc(100vh - ${TOPBAR_HEIGHT})` }}
        >
          {panelContent}
        </aside>
      )}
    </div>
  )
}
