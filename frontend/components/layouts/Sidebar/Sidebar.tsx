"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/useAppStore"
import { ROUTES, type RouteItem, type SidebarChild } from "./sidebar.config"

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname.startsWith(href)
}

function isParentActive(pathname: string, item: RouteItem): boolean {
  if (item.href && isActivePath(pathname, item.href)) return true
  if (!item.children) return false
  return item.children.some((sub) => {
    if (sub.href && isActivePath(pathname, sub.href)) return true
    return sub.children?.some((nested) => nested.href && isActivePath(pathname, nested.href)) ?? false
  })
}

const TOP_LEVEL_KEYS = new Set(ROUTES.map((r) => r.key))

function isDescendantOf(childKey: string, parentKey: string): boolean {
  const parent = ROUTES.find((r) => r.key === parentKey)
  if (!parent?.children) return false
  for (const sub of parent.children) {
    if (sub.key === childKey) return true
    if (sub.children?.some((n) => n.key === childKey)) return true
  }
  return false
}

/** Only the single active route branch: one parent + nested keys that contain the current path. */
function getExpandedKeysForPathname(pathname: string): string[] {
  const keys: string[] = []
  for (const r of ROUTES) {
    if (!r.children?.length) continue
    const childMatches = r.children.some((sub) => {
      if (sub.href && isActivePath(pathname, sub.href)) return true
      return sub.children?.some((n) => n.href && isActivePath(pathname, n.href)) ?? false
    })
    if (childMatches) {
      keys.push(r.key)
      for (const sub of r.children ?? []) {
        if (!sub.children?.length) continue
        const nestedMatches = sub.children.some((n) => n.href && isActivePath(pathname, n.href))
        if (nestedMatches) keys.push(sub.key)
      }
      break
    }
  }
  return keys
}

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  // Multiple keys can be expanded (e.g. Settings + Stages); synced with current route
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set(getExpandedKeysForPathname(pathname)))

  // When route changes, expand all sections that contain the current route (parent + nested)
  useEffect(() => {
    setExpandedKeys(new Set(getExpandedKeysForPathname(pathname)))
  }, [pathname])

  const toggle = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        return next
      }
      if (TOP_LEVEL_KEYS.has(key)) {
        next.clear()
        next.add(key)
        for (const k of prev) {
          if (k !== key && isDescendantOf(k, key)) next.add(k)
        }
        return next
      }
      next.add(key)
      return next
    })
  }

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 hidden lg:flex flex-col border-r bg-card/40 transition-all ${collapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      <nav className="px-2 py-2 space-y-1 flex-1 overflow-y-auto overflow-x-hidden bg-[rgba(248,245,245,1)]">
        {ROUTES.map((r) => {
          const Icon = r.icon
          const hasSubItems = r.children && r.children.length > 0
          const isExpandedKey = expandedKeys.has(r.key)
          const active = !hasSubItems && r.href ? isActivePath(pathname, r.href) : isParentActive(pathname, r)

          return (
            <div key={r.key}>
              {hasSubItems && !collapsed ? (
                <button
                  type="button"
                  onClick={() => toggle(r.key)}
                  className={`w-full text-left flex items-center justify-between px-2 py-2 rounded-md transition-colors ${
                    active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 text-foreground ${active ? "text-primary" : ""}`} />
                    <span className="text-foreground">{r.label}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpandedKey ? "rotate-180" : ""}`} />
                </button>
              ) : r.href ? (
                <Link
                  href={r.href}
                  className={`w-full text-left flex items-center justify-between px-2 py-2 rounded-md transition-colors ${
                    active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 text-foreground ${active ? "text-primary" : ""}`} />
                    {!collapsed && <span className="text-foreground">{r.label}</span>}
                  </div>
                </Link>
              ) : (
                <div
                  className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-md ${
                    active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 text-foreground" />
                  {!collapsed && <span className="text-foreground">{r.label}</span>}
                </div>
              )}

              {!collapsed && hasSubItems && isExpandedKey && (
                <div className="ml-6 mt-1 space-y-1 border-l pl-2">
                  {(r.children ?? []).map((sub) => (
                    <SidebarSubItems
                      key={sub.key}
                      sub={sub}
                      pathname={pathname}
                      onToggleNested={() => toggle(sub.key)}
                      expanded={expandedKeys.has(sub.key)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="p-2 border-t">
        <Button variant="ghost" size="sm" className="w-full" onClick={toggleSidebar}>
          {collapsed ? (
            <>
              <ChevronRight className="h-4 w-4 mr-1" /> Expand
            </>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" /> Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

function SidebarSubItems({
  sub,
  pathname,
  onToggleNested,
  expanded,
}: {
  sub: SidebarChild
  pathname: string
  onToggleNested: () => void
  expanded: boolean
}) {
  const hasNested = sub.children && sub.children.length > 0
  const isSubActive = sub.href
    ? pathname === sub.href
    : sub.children?.some((n) => n.href && pathname === n.href)

  if (hasNested) {
    return (
      <div>
        <button
          type="button"
          onClick={onToggleNested}
          className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between ${
            isSubActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <span>{sub.label}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && sub.children && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-2">
            {sub.children.map((nested) => {
              const isNestedActive = pathname === nested.href
              return (
                <Link
                  key={nested.key}
                  href={nested.href}
                  className={`block w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                    isNestedActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {nested.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (sub.href) {
    return (
      <Link
        href={sub.href}
        className={`block w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
          isSubActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      >
        {sub.label}
      </Link>
    )
  }

  return null
}
