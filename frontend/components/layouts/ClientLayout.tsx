"use client"

import { usePathname } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RightPanelProvider } from "@/context/RightPanelContext"
import { QuickActionsProvider } from "@/context/QuickActionsContext"
import { isFullPagePath } from "@/lib/routes.config"
import { AuthGuard } from "./AuthGuard"
import { AppShell } from "./AppShell"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const fullPage = isFullPagePath(pathname)

  return (
    <TooltipProvider>
      <RightPanelProvider>
        <QuickActionsProvider>
          {fullPage ? (
            <div className="min-h-screen bg-background">{children}</div>
          ) : (
            <AuthGuard>
              <AppShell>{children}</AppShell>
            </AuthGuard>
          )}
        </QuickActionsProvider>
      </RightPanelProvider>
    </TooltipProvider>
  )
}
