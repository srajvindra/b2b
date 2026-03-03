"use client"

import type { LucideIcon } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"

export interface QuickActionItem {
  label: string
  icon: LucideIcon
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

export interface QuickActionGroup {
  /**
   * Stable id for React keys, e.g. \"tasks\", \"reports\"
   */
  id: string
  /**
   * Optional group label shown above the actions
   * (e.g. \"Tasks\", \"Reports\"). Omit for a single ungrouped list.
   */
  title?: string
  actions: QuickActionItem[]
}

export interface QuickActionSidebarProps {
  /**
   * Main heading text. Defaults to \"Quick Actions\".
   */
  title?: string
  /**
   * Optional secondary label under the title
   * (e.g. \"Owners\", \"Tenants\", \"Dashboard\").
   */
  subtitle?: string
  /**
   * Grouped quick actions displayed in the sidebar.
   * Pass a single group when you do not need sections.
   */
  actions: QuickActionGroup[]
  /**
   * Optional extra content rendered below the actions list
   * (for future extension without changing layout).
   */
  footer?: ReactNode
  /**
   * Optional root className extension while preserving base layout.
   */
  className?: string
}

export function QuickActionSidebar({
  title = "Quick Actions",
  subtitle,
  actions,
  footer,
  className,
}: QuickActionSidebarProps) {
  const rootClassName =
    "w-64 border-l border-border bg-muted/10 flex flex-col max-h-screen sticky top-0" +
    (className ? ` ${className}` : "")

  return (
    <aside className={rootClassName}>
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-base text-gray-800">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-4">
          {actions.map((group) => (
            <div key={group.id} className="flex flex-col gap-2">
              {group.title ? (
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                  {group.title}
                </h3>
              ) : null}

              {group.actions.map((action) => {
                const Icon = action.icon
                const sharedClasses =
                  "flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left transition-colors hover:bg-gray-50 hover:border-gray-400"

                if (action.href) {
                  return (
                    <a
                      key={action.label}
                      href={action.href}
                      onClick={action.onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
                      className={sharedClasses}
                    >
                      <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </a>
                  )
                }

                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick as MouseEventHandler<HTMLButtonElement> | undefined}
                    className={sharedClasses}
                  >
                    <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {footer ? <div className="p-3 border-t border-border">{footer}</div> : null}
    </aside>
  )
}

