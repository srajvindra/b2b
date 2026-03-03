/**
 * Paths that render as full-page (no Topbar/Sidebar).
 * Add any route that should look like the login page (e.g. forgot-password, signup).
 */
export const FULL_PAGE_PATHS = ["/"] as const

export function isFullPagePath(pathname: string): boolean {
  return FULL_PAGE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  )
}
