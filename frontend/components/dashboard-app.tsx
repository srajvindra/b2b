"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import { TooltipContent } from "@/components/ui/tooltip"

import { TooltipTrigger } from "@/components/ui/tooltip"

import { TooltipProvider } from "@/components/ui/tooltip"

import { Label } from "@/components/ui/label"

import { useRef } from "react"

import type React from "react"
import { useEffect, useState, useContext, createContext, useMemo, type ReactNode } from "react"
import {
  Bell,
  Filter,
  ListTodo,
  Plus,
  RefreshCcw,
  Search,
  Home,
  CalendarIcon,
  Building,
  Building2,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  FileText,
  UserPlus,
  ChevronDown,
  CheckSquare,
  Mail,
  Phone,
  TrendingUp,
  FileKey,
  Settings2,
  Wrench,
  LineChart,
  AlertCircle,
  Clock,
  MessageCircle,
  ArrowUpRight,
  Target,
  Cog,
  Eye,
  Pencil,
  Check,
  X,
  Workflow,
  Paperclip,
  Send,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  Link,
  ImageIcon,
  Smile,
  Type,
  MoreHorizontal,
  Trash2,
  LayoutList,
  DollarSign,
  ShieldAlert,
  LogOut,
  OctagonAlert,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { toast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ContactOwnerDetailPage from "@/components/contact-owner-detail-page"
import ContactTenantDetailPage from "@/components/contact-tenant-detail-page"

// Page Components
import ContactsPage from "@/components/ContactsPage"
// import CalendarPage from "@/components/calendar-page"
import LeasingPage from "./LeasingPage"
import { NewOwnerPage } from "./new-owner-page"
import { NewTenantPage } from "./new-tenant-page"
import OwnerDetailPage from "./owner-detail-page"
import PropertiesPage from "./PropertiesPage"
import PropertyDetailPage from "./property-detail-page"
import UnitDetailPage from "./unit-detail-page"
import { ProcessesPage } from "./processes-page"
import SettingsPage from "./settings-page"
import ReportsPage from "./reports-page"
import LeadsPage from "./leads-page/leads-page"
import AutomationsPage from "./automations-page" // <NEW> Import AutomationsPage
import { RentalApplicationQuickActions } from "./rental-application-quick-actions" // Add import for RentalApplicationQuickActions
import { LeasesQuickActions } from "./leases-quick-actions" // Add LeasesQuickActions import
import { RenewalsQuickActions } from "./renewals-quick-actions" // Add import for RenewalsQuickActions
import PropertiesQuickActions from "./properties-quick-actions" // Add import for PropertiesQuickActions
import AllPropertiesPage from "./all-properties-page" // Import new property pages
import PropertyGroupsPage from "./property-groups-page"
import NewAutomationPage from "@/components/new-automation-page" // <NEW> Import NewAutomationPage
import GuestCardDetailPage from "./guest-card-detail-page" // <NEW> Import GuestCardDetailPage
import { VacanciesQuickActions } from "./vacancies-quick-actions"
import { GuestCardsQuickActions } from "./guest-cards-quick-actions"
// import { DashboardQuickActions } from "@/components/dashboard-quick-actions"
import ProcessDetailPage from "@/components/process-detail-page" // <NEW> Import ProcessDetailPage
import { ContactProcessDetailView } from "@/components/contact-process-detail-view"
import ProjectsPage from "@/components/projects-page"
import MessagesPage from "@/components/messages-page"
import { StaffManagementPage } from "@/components/staff-management-page"
import ProfilePage from "@/components/profile-page" // <NEW> Import ProfilePage

// Recharts imports for KPI charts
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// UI Dialog imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// =====================
// Page Keys and Route Types
// =====================

export type PageKey =
  | "dashboard"
  | "calendar"
  | "leads"
  | "newOwner"
  | "newTenant"
  | "contacts"
  | "properties"
  | "all-properties"
  | "property-groups"
  | "propertyDetail"
  | "units"
  | "unitDetail"
  | "processes"
  | "processDetail" // Added processDetail route
  | "contactProcessDetail"
  | "projects" // Changed route name from 'tasks' to 'projects'
  | "automations"
  | "new-automation" // Added new route
  | "reports"
  | "settings"
  | "user-roles"
  | "login"
  | "leasing"
  | "vacancies"
  | "guest-cards"
  | "guest-card-detail" // New route for guest card detail page
  | "rental-application"
  | "leases"
  | "renewals"
  | "metrics"
  | "property-calendar"
  | "staff-calendar"
  | "owners"
  | "tenants"
  | "ownerDetail"
  | "stages-owners"
  | "stages-tenants"
  | "property-tags"
  | "owners-contact"
  | "tenants-contact"
  | "vendors-contact"
  | "property-technician-contact"
  | "leasing-agent-contact"
  | "contactOwnerDetail" // Add new route for Contact Owner detail
  | "contactTenantDetail" // Add new route for Contact Tenant detail
  | "operations" // Added new route
  | "messages" // Added 'messages' page key
  | "staff-management"
  | "template-management"
  | "custom-fields"
  | "profile" // Added profile page route

export type RouteState = { name: PageKey; params?: Record<string, any> }

export type NavContextType = {
  route: RouteState
  go: (name: PageKey, params?: Record<string, any>, replace?: boolean) => void
  back: () => void
  onLogout: () => void
  toggleSidebar: () => void
}

// =====================
// Navigation Context
// =====================

const NavContext = createContext<NavContextType | null>(null)

export const useNav = () => {
  const ctx = useContext(NavContext)
  if (!ctx) {
    // Return a safe fallback during SSR or initial render
    console.warn("[v0] useNav called outside NavProvider, returning safe defaults")
    return {
      route: { name: "dashboard" as PageKey },
      go: () => {},
      back: () => {},
      onLogout: () => {},
      toggleSidebar: () => {},
    } as NavContextType
  }
  return ctx
}

export const NavigationContext = NavContext // Export NavContext so it can be used elsewhere if needed

function NavProvider({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const [history, setHistory] = useState<RouteState[]>([{ name: "dashboard" }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("navHistory")
      const savedIndex = localStorage.getItem("navHistoryIndex")
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
      if (savedIndex) {
        setHistoryIndex(Number.parseInt(savedIndex, 10))
      }
    } catch (error) {
      console.error("[v0] Error loading navigation history:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("navHistory", JSON.stringify(history))
      localStorage.setItem("navHistoryIndex", String(historyIndex))
    } catch (error) {
      console.error("[v0] Error saving navigation history:", error)
    }
  }, [history, historyIndex])

  const route = history[historyIndex]

  const go = (name: PageKey, params?: Record<string, any>, replace = false) => {
    const next: RouteState = { name, params }
    setHistory((prev) => {
      let updated: RouteState[]
      if (replace) {
        updated = [...prev.slice(0, historyIndex), next]
      } else {
        updated = [...prev.slice(0, historyIndex + 1), next]
      }
      setHistoryIndex(updated.length - 1)
      return updated
    })
  }
  const back = () => setHistoryIndex((prev) => Math.max(0, prev - 1))
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)

  return (
    <NavContext.Provider value={{ route, go, back, onLogout, toggleSidebar }}>
      <TooltipProvider>{children}</TooltipProvider>
    </NavContext.Provider>
  )
}

// =====================
// Routes Configuration
// =====================

type RouteItem = {
  key: PageKey
  label: string
  icon: any
  children?: { key: string; label: string; children?: { key: string; label: string }[] }[]
}

const ROUTES: RouteItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  {
    key: "calendar",
    label: "Calendar",
    icon: CalendarIcon,
    children: [
      { key: "property-calendar", label: "Property Calendar" },
      { key: "staff-calendar", label: "Staff Calendar" },
    ],
  },
  {
    key: "leads",
    label: "Leads",
    icon: Users,
    children: [
      { key: "owners", label: "Owner Prospects" },
      { key: "tenants", label: "Lease Prospects" },
    ],
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: Users,
    children: [
      { key: "owners-contact", label: "Owners" },
      { key: "tenants-contact", label: "Tenants" },
      { key: "vendors-contact", label: "Vendors" },
      { key: "property-technician-contact", label: "Property Technician" },
      { key: "leasing-agent-contact", label: "Leasing Agent" },
    ],
  },
  {
    key: "properties",
    label: "Properties",
    icon: Building2,
    children: [
      { key: "all-properties", label: "All Properties" },
      { key: "property-groups", label: "Property Groups" },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    icon: Cog,
    children: [
      { key: "processes", label: "Processes" },
      { key: "projects", label: "Projects" },
      { key: "automations", label: "Automations" },
    ],
  },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "reports", label: "Reports", icon: BarChart3 },
  {
    key: "settings",
    label: "Settings",
    icon: Settings2,
    children: [
      { key: "user-roles", label: "Staff Management" },
      {
        key: "stages",
        label: "Stages",
        children: [
          { key: "stages-owners", label: "Owners" },
{ key: "stages-tenants", label: "Lease Prospects" },
          ],
        },
        { key: "template-management", label: "Template Management" },
        { key: "property-tags", label: "Property Tags" },
        { key: "custom-fields", label: "Custom Fields" },
      ],
    },
  // Profile route is no longer in the sidebar, only accessible from user dropdown
]

// =====================
// Seed User Data
// =====================

const seedUser = {
  name: "Nina Patel",
  email: "csr.nina@heropm.com",
  role: "Super Admin" as "CSR" | "CSM" | "AGM" | "Super Admin",
  groups: ["North Portfolio", "Downtown SFR"],
}

// =====================
// Route Stubs
// =====================

const RouteStub = ({ title, params }: { title: string; params?: Record<string, any> }) => (
  <Card className="h-full flex items-center justify-center">
    <CardContent>
      <div className="text-center text-muted-foreground">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p>This page is currently under development.</p>
        {params && (
          <pre className="mt-4 text-left text-xs">
            <code>{JSON.stringify(params, null, 2)}</code>
          </pre>
        )}
      </div>
    </CardContent>
  </Card>
)

const LoginStub = () => (
  <Card className="h-full flex items-center justify-center">
    <CardContent>
      <div className="text-center text-muted-foreground">
        <h2 className="text-xl font-semibold mb-2">Login</h2>
        <p>Please log in to access the application.</p>
      </div>
    </CardContent>
  </Card>
)

// =====================
// App Topbar Component
// =====================

function AppTopbar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const nav = useNav()
  const [query, setQuery] = useState("")

  const runSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return
    toast({ title: "AI Search", description: `Interpreted: ${query}` })
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-card/95 backdrop-blur">
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Logo and collapse button */}
        <div className={`flex items-center gap-2 ${collapsed ? "w-[72px]" : "w-[208px]"} transition-all shrink-0`}>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <img
            src="/images/logo.png"
            alt="HERO PM"
            className={`${collapsed ? "h-8 w-8" : "h-10 w-auto"} object-contain transition-all`}
          />
          {!collapsed && <div className="font-semibold">HERO PM</div>}
        </div>

        {/* Global AI search */}
        <form onSubmit={runSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 !-translate-x-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... e.g. show vacant units this week in North Portfolio"
              className="pl-9"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="text-sm text-muted-foreground">
                Demo: the AI will parse natural language filters from your query.
              </div>
            </PopoverContent>
          </Popover>
          <Button type="submit">Search</Button>
        </form>

        {/* Quick add */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Quick add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => toast({ title: "New Task" })}>
                <ListTodo className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button variant="ghost" onClick={() => toast({ title: "New Lead" })}>
                <UserPlus className="h-4 w-4 mr-2" />
                New Lead
              </Button>
              <Button variant="ghost" onClick={() => toast({ title: "New Owner" })}>
                <UserPlus className="h-4 w-4 mr-2" />
                New Owner
              </Button>
              <Button variant="ghost" onClick={() => toast({ title: "New Note" })}>
                <FileText className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Right side icons + user menu */}
        <Button variant="ghost" title="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" title="Sync">
          <RefreshCcw className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">{seedUser.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{seedUser.name}</DropdownMenuLabel>
            <DropdownMenuItem disabled>{seedUser.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => nav.go("profile")}>Profile</DropdownMenuItem>{" "}
            {/* Navigate to profile page */}
            <DropdownMenuItem onClick={() => toast({ title: `Role: ${seedUser.role}` })}>
              Role: {seedUser.role}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={nav.onLogout} className="text-red-500 focus:text-red-500">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// =====================
// Sidebar Component
// =====================

function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const nav = useNav()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside
      className={`border-r bg-card/40 transition-all ${collapsed ? "w-[72px]" : "w-[260px]"} hidden lg:flex flex-col pt-14 h-full overflow-hidden`}
    >
      <nav className="px-2 py-2 space-1 flex-1 overflow-auto bg-[rgba(248,245,245,1)]">
        {ROUTES.map((r) => {
          const Icon = r.icon
          const isActive = nav.route.name === r.key
          const hasSubItems = r.children && r.children.length > 0
          const isExpanded = expanded[r.key]

          return (
            <div key={r.key}>
              <button
                onClick={() => {
                  if (hasSubItems && !collapsed) {
                    toggle(r.key)
                  } else {
                    nav.go(r.key)
                  }
                }}
                className={`w-full text-left flex items-center justify-between px-2 py-2 rounded-md transition-colors ${
                  isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 text-foreground ${isActive ? "text-primary" : ""}`} />
                  {!collapsed && <span className="text-foreground">{r.label}</span>}
                </div>
                {!collapsed && hasSubItems && (
                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                )}
              </button>

              {!collapsed && hasSubItems && isExpanded && (
                <div className="ml-6 mt-1 space-y-1 border-l pl-2">
                  {r.children!.map((sub) => {
                    const hasNestedChildren = sub.children && sub.children.length > 0
                    const isNestedExpanded = expanded[sub.key]
                    const isSubActive = nav.route.name === r.key && nav.route.params?.view === sub.key

                    return (
                      <div key={sub.key}>
                        <button
                          onClick={() => {
                            if (hasNestedChildren) {
                              toggle(sub.key)
                            } else {
                              nav.go(r.key, { view: sub.key })
                            }
                          }}
                          className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between ${
                            isSubActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <span>{sub.label}</span>
                          {hasNestedChildren && (
                            <ChevronDown
                              className={`h-3 w-3 transition-transform ${isNestedExpanded ? "rotate-180" : ""}`}
                            />
                          )}
                        </button>

                        {hasNestedChildren && isNestedExpanded && (
                          <div className="ml-4 mt-1 space-y-1 border-l pl-2">
                            {sub.children!.map((nested) => {
                              const isNestedActive = nav.route.name === r.key && nav.route.params?.view === nested.key
                              return (
                                <button
                                  key={nested.key}
                                  onClick={() => nav.go(r.key, { view: nested.key })}
                                  className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                                    isNestedActive
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  {nested.label}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="p-2 border-t">
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setCollapsed(!collapsed)}>
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

// =====================
// View Context
// =====================

export const ViewContext = createContext<{
  view: "staff" | "admin"
  setView: React.Dispatch<React.SetStateAction<"staff" | "admin">>
}>({ view: "admin", setView: () => {} })

export const useView = () => useContext(ViewContext)

// =====================
// App Layout Component
// =====================

function AppLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const [view, setView] = useState<"staff" | "admin">("admin")
  const [contactFilter, setContactFilter] = useState<
    "all" | "owners" | "tenants" | "vendors" | "property-technician" | "leasing-agent"
  >("all")

  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem("collapsed")
      if (savedCollapsed !== null) {
        setCollapsed(savedCollapsed === "true")
      }
    } catch (error) {
      console.error("[v0] Error loading collapsed state:", error)
    }
  }, [])

  useEffect(() => {
    try {
      const savedView = localStorage.getItem("view")
      if (savedView === "staff" || savedView === "admin") {
        setView(savedView)
      }
    } catch (error) {
      console.error("[v0] Error loading view state:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("collapsed", String(collapsed))
    } catch (error) {
      console.error("[v0] Error saving collapsed state:", error)
    }
  }, [collapsed])

  useEffect(() => {
    try {
      localStorage.setItem("view", view)
    } catch (error) {
      console.error("[v0] Error saving view state:", error)
    }
  }, [view])

  const nav = useNav()
  const showDashboardQuickActions = nav.route.name === "dashboard"
  const showVacanciesQuickActions = nav.route.name === "leasing" && nav.route.params?.view === "vacancies"
  const showGuestCardsQuickActions = nav.route.name === "leasing" && nav.route.params?.view === "guest-cards"
  const showRentalApplicationQuickActions =
    nav.route.name === "leasing" && nav.route.params?.view === "rental-application" // Add condition for showing Rental Application Quick Actions
  const showLeasesQuickActions = nav.route.name === "leasing" && nav.route.params?.view === "leases" // Add condition for showing Leases Quick Actions
  const showRenewalsQuickActions = nav.route.name === "leasing" && nav.route.params?.view === "renewals" // Add condition for showing Renewals Quick Actions
  const showAutomationsQuickActions = nav.route.name === "automations"
  const showPropertiesQuickActions =
    nav.route.name === "properties" &&
    nav.route.params?.view !== "all-properties" &&
    nav.route.params?.view !== "property-groups" &&
    nav.route.name !== "all-properties"
  const showGuestCardDetailQuickActions = nav.route.name === "guest-card-detail" // Add condition for showing Guest Card Detail Quick Actions

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <div
        className={`h-screen w-full max-w-full overflow-hidden grid grid-cols-1 ${
          showDashboardQuickActions ||
          showVacanciesQuickActions ||
          showGuestCardsQuickActions ||
          showRentalApplicationQuickActions ||
          showLeasesQuickActions ||
          showRenewalsQuickActions ||
          showAutomationsQuickActions ||
          showPropertiesQuickActions ||
          showGuestCardDetailQuickActions
            ? "lg:grid-cols-[auto_1fr_auto]"
            : "lg:grid-cols-[auto_1fr]"
        } bg-white dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 text-foreground`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex flex-col h-full overflow-hidden min-w-0">
          <AppTopbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className="flex-1 px-4 py-6 overflow-auto max-w-full pt-16">
            <AppContent
              route={nav.route}
              view={view}
              setView={setView}
              contactFilter={contactFilter}
              setContactFilter={setContactFilter}
            />
          </main>
        </div>
        <div className="h-full overflow-y-auto pt-16">
          {showDashboardQuickActions && <DashboardQuickActions />}
          {showVacanciesQuickActions && <VacanciesQuickActions />}
          {showGuestCardsQuickActions && <GuestCardsQuickActions />}
          {showRentalApplicationQuickActions && <RentalApplicationQuickActions />}
          {showLeasesQuickActions && <LeasesQuickActions />}
          {showRenewalsQuickActions && <RenewalsQuickActions />}
          {showAutomationsQuickActions && <RouteStub title="Automations" />}
          {showPropertiesQuickActions && <PropertiesQuickActions />}
          {showGuestCardDetailQuickActions && <RouteStub title="Guest Card Detail" />}
        </div>
      </div>
    </ViewContext.Provider>
  )
}

// =====================
// App Content Router
// =====================

function AppContent({
  route,
  view,
  setView,
  contactFilter,
  setContactFilter,
}: {
  route: RouteState
  view: "staff" | "admin"
  setView: React.Dispatch<React.SetStateAction<"staff" | "admin">>
  contactFilter: "all" | "owners" | "tenants" | "vendors" | "property-technician" | "leasing-agent"
  setContactFilter: React.Dispatch<
    React.SetStateAction<"all" | "owners" | "tenants" | "vendors" | "property-technician" | "leasing-agent">
  >
}) {
  const nav = useNav()

  // Routing
  if (route.name === "dashboard") {
    return <Dashboard />
  }
  if (route.name === "profile") {
    return <ProfilePage /> // Render ProfilePage
  }
  if (route.name === "calendar") {
    return <CalendarPage calendarType={route.params?.view} />
  }
  if (route.name === "leads") {
    return <LeadsPage params={route.params} />
  }
  if (route.name === "newOwner") {
    return <NewOwnerPage onBack={() => nav.back()} />
  }
  if (route.name === "newTenant") {
    return <NewTenantPage onBack={() => nav.back()} />
  }
  if (route.name === "contacts") {
    const contactType =
      route.params?.view === "owners-contact"
        ? "owners"
        : route.params?.view === "tenants-contact"
          ? "tenants"
          : route.params?.view === "vendors-contact"
            ? "vendors"
            : route.params?.view === "property-technician-contact"
              ? "property-technician"
              : route.params?.view === "leasing-agent-contact"
                ? "leasing-agent"
                : "all"
    return (
      <ContactsPage
        filter={contactType}
        onFilterChange={setContactFilter}
        onContactClick={(contact) => nav.go("contactOwnerDetail", { contact })}
        onTenantClick={(contact) => nav.go("contactTenantDetail", { contact })}
        onNavigateToUnitDetail={(unitId, propertyId) => nav.go("unitDetail", { id: unitId, propertyId })}
      />
    )
  }
  if (route.name === "ownerDetail") {
    return <OwnerDetailPage onBack={() => nav.back()} />
  }
  if (route.name === "contactOwnerDetail") {
    const contact = route.params?.contact
    if (contact) {
      return (
        <ContactOwnerDetailPage
          contact={contact}
          onBack={() => nav.back()}
          onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
        />
      )
    }
    return <RouteStub title="Contact not found" />
  }
  if (route.name === "contactTenantDetail") {
    const contact = route.params?.contact
    if (contact) {
      return (
        <ContactTenantDetailPage
          contact={contact}
          onBack={() => nav.back()}
          onNavigateToUnitDetail={(unitId, propertyId) => nav.go("unitDetail", { id: unitId, propertyId })}
        />
      )
    }
    return <RouteStub title="Contact not found" />
  }
  if (route.name === "properties") {
    const viewParam = route.params?.view
    if (viewParam === "all-properties") {
      return <AllPropertiesPage />
    }
    if (viewParam === "property-groups") {
      return <PropertyGroupsPage />
    }
    if (viewParam === "property-tags") {
      // Add property-tags route handler
      return <RouteStub title="Property Tags" />
    }
    return <PropertiesPage />
  }
  if (route.name === "all-properties") {
    return <AllPropertiesPage />
  }
  if (route.name === "property-groups") {
    return <PropertyGroupsPage />
  }
  if (route.name === "property-tags") {
    // Add property-tags route handler
    return <RouteStub title="Property Tags" />
  }
  if (route.name === "propertyDetail") {
    return <PropertyDetailPage propertyId={route.params?.id} onBack={nav.back} />
  }
  if (route.name === "unitDetail") {
    return <UnitDetailPage unitId={route.params?.id} propertyId={route.params?.propertyId} onBack={nav.back} />
  }
  if (route.name === "units") {
    return <RouteStub title="Units" />
  }
  // Operations routes
  if (route.name === "operations") {
    const viewParam = route.params?.view
    if (viewParam === "processes") {
      return <ProcessesPage />
    }
    if (viewParam === "processDetail") {
      return <ProcessDetailPage processId={route.params?.id} onBack={() => nav.back()} />
    }
    if (viewParam === "projects") {
      return <ProjectsPage />
    }
    if (viewParam === "automations") {
      return <AutomationsPage onNewAutomation={() => nav.go("new-automation")} />
    }
    // Default to Processes if no view specified
    return <ProcessesPage />
  }
  if (route.name === "processes") {
    return <ProcessesPage />
  }
  if (route.name === "processDetail") {
    const processId = route.params?.id || "move-in"
    return <ProcessDetailPage processId={processId} onBack={() => nav.back()} />
  }
  if (route.name === "contactProcessDetail") {
    return (
      <ContactProcessDetailView
        process={route.params?.process}
        contactName={route.params?.contactName || "Contact"}
        onBack={() => nav.back()}
      />
    )
  }
  if (route.name === "projects") {
    return <ProjectsPage />
  }
  if (route.name === "automations") {
    return <AutomationsPage onNewAutomation={() => nav.go("new-automation")} /> // Updated to include onNewAutomation prop
  }
  if (route.name === "new-automation") {
    return <NewAutomationPage onBack={() => nav.go("automations")} /> // Added new route handler
  }
  // Reworked comms routing to 'messages'
  if (route.name === "messages") {
    return <MessagesPage />
  }
  if (route.name === "reports") {
    return <ReportsPage />
  }
  if (route.name === "settings") {
    const viewParam = route.params?.view
    if (viewParam === "user-roles") {
      return <StaffManagementPage />
    }
    // Handle nested stages routing
    if (route.params?.view === "stages-owners") {
      return <SettingsPage params={{ view: "stages-owners" }} />
    }
if (route.params?.view === "stages-tenants") {
        return <SettingsPage params={{ view: "stages-tenants" }} />
      }
      if (route.params?.view === "template-management") {
        return <SettingsPage params={{ view: "template-management" }} />
      }
      if (route.params?.view === "property-tags") {
      // Add property-tags route handler
      return <SettingsPage params={{ view: "property-tags" }} />
    }
    if (route.params?.view === "custom-fields") {
      return <SettingsPage params={{ view: "custom-fields" }} />
    }
    return <SettingsPage />
  }
  if (route.name === "user-roles") {
    return <StaffManagementPage />
  }
  if (route.name === "login") {
    return <LoginStub />
  }
  if (route.name === "leasing") {
    return (
      <LeasingPage
        params={route.params}
        onNavigateToGuestCardDetail={(guestCardId) => nav.go("guest-card-detail", { id: guestCardId })}
      />
    )
  }
  // Leasing sub-routes
  if (route.name === "vacancies") {
    return <RouteStub title="Vacancies" />
  }
  if (route.name === "guest-cards") {
    return <RouteStub title="Guest Cards" />
  }
  if (route.name === "guest-card-detail") {
    return (
      <GuestCardDetailPage guestCardId={route.params?.id} onBack={() => nav.go("leasing", { view: "guest-cards" })} />
    )
  }
  if (route.name === "rental-application") {
    return <RouteStub title="Rental Application" />
  }
  if (route.name === "leases") {
    return <RouteStub title="Leases" />
  }
  if (route.name === "renewals") {
    return <RouteStub title="Renewals" />
  }
  if (route.name === "metrics") {
    return <RouteStub title="Leasing Metrics" />
  }
  // Calendar sub-routes
  if (route.name === "property-calendar") {
    return <CalendarPage calendarType="property" />
  }
  if (route.name === "staff-calendar") {
    return <CalendarPage calendarType="staff" />
  }
  if (route.name === "owners") {
    return <LeadsPage params={{ view: "owners" }} />
  }
  if (route.name === "tenants") {
    return <LeadsPage params={{ view: "tenants" }} />
  }
  // Settings sub-routes
  if (route.name === "stages-owners") {
    return <SettingsPage params={{ view: "stages-owners" }} />
  }
if (route.name === "stages-tenants") {
      return <SettingsPage params={{ view: "stages-tenants" }} />
    }
    if (route.name === "template-management") {
      return <SettingsPage params={{ view: "template-management" }} />
    }
    if (route.name === "property-tags") {
    return <SettingsPage params={{ view: "property-tags" }} />
  }
  if (route.name === "custom-fields") {
    return <SettingsPage params={{ view: "custom-fields" }} />
  }
  // Contacts sub-routes
  if (route.name === "owners-contact") {
    return (
      <ContactsPage
        filter="owners"
        onFilterChange={setContactFilter}
        onContactClick={(contact) => nav.go("contactOwnerDetail", { contact })}
      />
    )
  }
  if (route.name === "tenants-contact") {
  return (
  <ContactsPage
  filter="tenants"
  onFilterChange={setContactFilter}
  onContactClick={(contact) => nav.go("contactTenantDetail", { contact })}
  onNavigateToUnitDetail={(unitId, propertyId) => nav.go("unitDetail", { id: unitId, propertyId })}
  />
  )
  }
  if (route.name === "vendors-contact") {
    return (
      <ContactsPage
        filter="vendors"
        onFilterChange={setContactFilter}
        onContactClick={(contact) => nav.go("contactOwnerDetail", { contact })}
      />
    )
  }
  if (route.name === "property-technician-contact") {
    return (
      <ContactsPage
        filter="property-technician"
        onFilterChange={setContactFilter}
        onContactClick={(contact) => nav.go("contactOwnerDetail", { contact })}
      />
    )
  }
  if (route.name === "leasing-agent-contact") {
    return (
      <ContactsPage
        filter="leasing-agent"
        onFilterChange={setContactFilter}
        onContactClick={(contact) => nav.go("contactOwnerDetail", { contact })}
      />
    )
  }
  if (route.name === "contactOwnerDetail") {
    return <OwnerDetailPage onBack={() => nav.back()} />
  }
  if (route.name === "tenants") {
    return <RouteStub title="Tenants" />
  }
  // Add Staff Management route
  if (route.name === "staff-management") {
    return <StaffManagementPage />
  }
  return <RouteStub title="Unknown" />
}

// =====================
// Dashboard Component
// =====================

function Dashboard() {
  const nav = useNav()
  const [userRole] = useState<"associate" | "manager" | "leader">("manager")
  const [kpiView, setKpiView] = useState<"table" | "chart">("table")
  const [expandedKpiSection, setExpandedKpiSection] = useState<string | null>(null)
  const [kpisSearchQuery, setKpisSearchQuery] = useState("") // Declare kpisSearchQuery
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  const [tasksSearchQuery, setTasksSearchQuery] = useState("")
  const [dashboardTab, setDashboardTab] = useState<"tasks" | "communications" | "combined">("tasks")
  const [showDashFilters, setShowDashFilters] = useState(false)
  const [dashFilter, setDashFilter] = useState<"all" | "myTasks" | "overdue" | "legalRisk" | "orgTasks">("all")
  const [commsSearchQuery, setCommsSearchQuery] = useState("")
  const [commFilter, setCommFilter] = useState<"all" | "unread" | "unresponded">("all")
  const [selectedCommunication, setSelectedCommunication] = useState<{
    id: number
    from: string
    type: "email" | "text" | "call"
    preview: string
    timestamp: string
    read: boolean
    assignedTo: string
    fullMessage?: string
  } | null>(null)
  const [showCommunicationModal, setShowCommunicationModal] = useState(false)
  const [smsReplyText, setSmsReplyText] = useState("")
  const [smsAttachments, setSmsAttachments] = useState<File[]>([])
  const smsFileInputRef = useRef<HTMLInputElement>(null)
  const conversationEndRef = useRef<HTMLDivElement>(null)
  const [localConversationHistory, setLocalConversationHistory] = useState<Array<{
    id: number
    sender: string
    direction: "incoming" | "outgoing"
    message: string
    timestamp: string
  }>>([])
  
  // Email reply state
  const [emailReplyText, setEmailReplyText] = useState("")
  const [emailAttachments, setEmailAttachments] = useState<File[]>([])
  const emailFileInputRef = useRef<HTMLInputElement>(null)
  const emailConversationEndRef = useRef<HTMLDivElement>(null)
  const [localEmailHistory, setLocalEmailHistory] = useState<Array<{
    id: number
    sender: string
    direction: "incoming" | "outgoing"
    subject?: string
    message: string
    timestamp: string
  }>>([])
  
  // Unified communication thread state
  const [unifiedThread, setUnifiedThread] = useState<Array<{
    id: number
    type: "email" | "text" | "call"
    sender: string
    direction: "incoming" | "outgoing"
    subject?: string
    message: string
    timestamp: string
    openedAt?: string
    notes?: string
    duration?: string
    attachments?: Array<{ name: string; size: string; type: string }>
  }>>([])
  const [expandedEmails, setExpandedEmails] = useState<Set<number>>(new Set())
  const [replyChannel, setReplyChannel] = useState<"sms" | "email">("sms")
  const unifiedThreadEndRef = useRef<HTMLDivElement>(null)
  
  // Email CC/BCC state
  const [emailCc, setEmailCc] = useState("")
  const [emailBcc, setEmailBcc] = useState("")
  const [emailReplySubject, setEmailReplySubject] = useState("")
  const [showCcBcc, setShowCcBcc] = useState(false)
  
  // RingCentral call notification state
  const [showRingCentralNotification, setShowRingCentralNotification] = useState(false)

  // Auto-scroll to bottom when conversation history changes or modal opens
  useEffect(() => {
    if (showCommunicationModal && selectedCommunication) {
      // Initialize unified communication thread
      if (selectedCommunication.communicationThread) {
        setUnifiedThread([...selectedCommunication.communicationThread])
        // Reset expanded emails - only expand the last email by default
        const lastEmailIndex = selectedCommunication.communicationThread
          .map((item, idx) => ({ type: item.type, idx }))
          .filter(item => item.type === "email")
          .pop()?.idx
        if (lastEmailIndex !== undefined) {
          setExpandedEmails(new Set([selectedCommunication.communicationThread[lastEmailIndex].id]))
        } else {
          setExpandedEmails(new Set())
        }
      } else if (selectedCommunication.type === "text" && selectedCommunication.conversationHistory) {
        // Fallback: convert conversation history to unified format
        const thread = selectedCommunication.conversationHistory.map(msg => ({
          ...msg,
          type: "text" as const
        }))
        setUnifiedThread(thread)
        setExpandedEmails(new Set())
      } else if (selectedCommunication.type === "email" && selectedCommunication.emailHistory) {
        // Fallback: convert email history to unified format
        const thread = selectedCommunication.emailHistory.map(email => ({
          ...email,
          type: "email" as const
        }))
        setUnifiedThread(thread)
        // Expand the last email by default
        if (thread.length > 0) {
          setExpandedEmails(new Set([thread[thread.length - 1].id]))
        }
      } else {
        // Create single entry from the communication
        setUnifiedThread([{
          id: 1,
          type: selectedCommunication.type,
          sender: selectedCommunication.from,
          direction: "incoming" as const,
          subject: selectedCommunication.type === "email" ? selectedCommunication.preview.substring(0, 50) : undefined,
          message: selectedCommunication.fullMessage || selectedCommunication.preview,
          timestamp: selectedCommunication.timestamp,
        }])
        if (selectedCommunication.type === "email") {
          setExpandedEmails(new Set([1]))
        }
      }
      
      // Set default reply channel based on communication type
      setReplyChannel(selectedCommunication.type === "email" ? "email" : "sms")
      
      // Legacy initialization for backwards compatibility
      if (selectedCommunication.type === "text" && selectedCommunication.conversationHistory) {
        setLocalConversationHistory([...selectedCommunication.conversationHistory])
      }
      if (selectedCommunication.type === "email" && selectedCommunication.emailHistory) {
        setLocalEmailHistory([...selectedCommunication.emailHistory])
      }
      
      setTimeout(() => {
        unifiedThreadEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [showCommunicationModal, selectedCommunication])
  const [showSkippedModal, setShowSkippedModal] = useState(false)
  const [selectedSkippedTask, setSelectedSkippedTask] = useState<{
    title: string
    skippedComment: string
  } | null>(null)

  // Mock Tasks Data - sorted by urgency (overdue first, then by due date)
  const tasks = [
    {
      id: 1,
      title: "Follow up with tenant - Unit 204 lease renewal",
      dueDate: "2025-12-20",
      priority: "high",
      entity: "Tenant: John Smith",
      entityType: "tenant" as const,
      overdue: true,
      assignedTo: "Nina Patel",
      status: "Pending" as const,
      processName: "Lease Renewal Process",
      processEntityType: "tenant" as const,
    },
    {
      id: 2,
      title: "Finish Move-out tenant in Appfolio and update property",
      dueDate: "2025-12-21",
      priority: "high",
      entity: "Property: Maple Heights",
      entityType: "property" as const,
      overdue: true,
      assignedTo: "Richard Surovi",
      status: "In Progress" as const,
      processName: "Move Out for 123 Oak Street",
      processEntityType: "tenant" as const,
    },
    {
      id: 3,
      title: "Review rental application - Sarah Johnson",
      dueDate: "2025-12-23",
      priority: "high",
      entity: "Lease Prospect: Sarah Johnson",
      entityType: "lead" as const,
      overdue: false,
      assignedTo: "Nina Patel",
      status: "Pending" as const,
      processName: "Lease Prospect Onboarding",
      processEntityType: "leaseProspect" as const,
    },
    {
      id: 4,
      title: "Schedule maintenance for HVAC - Oak Manor",
      dueDate: "2025-12-23",
      priority: "medium",
      entity: "Property: Oak Manor",
      entityType: "property" as const,
      overdue: false,
      assignedTo: "Mike Johnson",
      status: "Pending" as const,
      // No process - standalone task
    },
    {
      id: 5,
      title: "Send lease agreement - Unit 305",
      dueDate: "2025-12-24",
      priority: "medium",
      entity: "Lease Prospect: Unit 305",
      entityType: "lease" as const,
      overdue: false,
      assignedTo: "Sarah Chen",
      status: "In Progress" as const,
      processName: "New Lease Signing",
      processEntityType: "leaseProspect" as const,
    },
    {
      id: 6,
      title: "Call owner about property updates",
      dueDate: "2025-12-25",
      priority: "low",
      entity: "Owner: Mike Davis",
      entityType: "owner" as const,
      overdue: false,
      assignedTo: "Richard Surovi",
      status: "Skipped" as const,
      skippedComment: "Owner requested to postpone the call until after the holidays. Will follow up in January.",
      processName: "Owner Quarterly Review",
      processEntityType: "owner" as const,
    },
    {
      id: 7,
      title: "Process security deposit refund",
      dueDate: "2025-12-26",
      priority: "medium",
      entity: "Tenant: Emily Brown",
      entityType: "tenant" as const,
      overdue: false,
      assignedTo: "Nina Patel",
      status: "Pending" as const,
      processName: "Move Out Process",
      processEntityType: "tenant" as const,
    },
    {
      id: 8,
      title: "Update property listing photos",
      dueDate: "2025-12-27",
      priority: "low",
      entity: "Property: Pine View Apts",
      entityType: "property" as const,
      overdue: false,
      assignedTo: "Mike Johnson",
      status: "Pending" as const,
      // No process - standalone task
    },
    {
      id: 9,
      title: "Follow up on unread email",
      dueDate: "2025-12-23",
      priority: "medium",
      entity: "Owner Prospect: James Wilson",
      entityType: "prospectOwner" as const,
      overdue: false,
      assignedTo: "Sarah Chen",
      status: "Pending" as const,
      autoCreated: true,
      processName: "Owner Prospect Outreach",
      processEntityType: "prospectOwner" as const,
    },
    {
      id: 10,
      title: "Respond to SMS",
      dueDate: "2025-12-24",
      priority: "low",
      entity: "Tenant: Robert Garcia",
      entityType: "tenant" as const,
      overdue: false,
      assignedTo: "Nina Patel",
      status: "Pending" as const,
      autoCreated: true,
      // No process - auto-generated standalone
    },
  ]

  // Mock Communications Data - sorted oldest first
  // responded: true = replied to, false = not replied, receivedAt is used to track 24hr threshold
  // entityType: owner | tenant | prospectOwner | prospectTenant - used for navigation to Activity tab
  const communications = [
    {
      id: 1,
      from: "John Smith",
      type: "email" as const,
      entityType: "tenant" as const,
      preview: "Question about lease renewal terms and conditions...",
      fullMessage:
        "Hi,\n\nI wanted to reach out regarding my upcoming lease renewal. I have a few questions about the terms and conditions:\n\n1. Is there any flexibility on the monthly rent amount?\n2. Can I switch to a month-to-month lease after the initial term?\n3. Are there any planned maintenance or renovations for the building?\n\nPlease let me know when you have a moment to discuss.\n\nThank you,\nJohn Smith",
      timestamp: "2025-12-21 09:15 AM",
      read: true,
      responded: true,
      receivedAt: new Date("2025-12-21T09:15:00"),
      assignedTo: "Nina Patel",
      emailHistory: [
        {
          id: 1,
          sender: "John Smith",
          direction: "incoming" as const,
          subject: "Lease renewal inquiry",
          message: "Hi,\n\nMy lease is coming up for renewal next month. I wanted to know if there are any changes to the terms for the new lease period.\n\nThanks,\nJohn Smith",
          timestamp: "2025-12-18 02:30 PM",
        },
        {
          id: 2,
          sender: "Nina Patel",
          direction: "outgoing" as const,
          subject: "Re: Lease renewal inquiry",
          message: "Hello John,\n\nThank you for reaching out. Your current lease terms will remain the same for the renewal period. However, there will be a 3% rent increase as outlined in your original agreement.\n\nPlease let me know if you have any questions.\n\nBest regards,\nNina Patel\nB2B Property Management",
          timestamp: "2025-12-19 10:15 AM",
        },
        {
          id: 3,
          sender: "John Smith",
          direction: "incoming" as const,
          subject: "Re: Lease renewal inquiry",
          message: "Hi,\n\nI wanted to reach out regarding my upcoming lease renewal. I have a few questions about the terms and conditions:\n\n1. Is there any flexibility on the monthly rent amount?\n2. Can I switch to a month-to-month lease after the initial term?\n3. Are there any planned maintenance or renovations for the building?\n\nPlease let me know when you have a moment to discuss.\n\nThank you,\nJohn Smith",
          timestamp: "2025-12-21 09:15 AM",
        },
      ],
    },
    {
      id: 2,
      from: "Sarah Johnson",
      type: "text" as const,
      entityType: "prospectTenant" as const,
      preview: "Is the unit at 123 Oak St still available?",
      fullMessage:
        "Hi! I saw your listing for the 2BR unit at 123 Oak St. Is it still available? I'd love to schedule a tour this weekend if possible. Thanks!",
      timestamp: "2025-12-21 02:30 PM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-21T14:30:00"),
      assignedTo: "Richard Surovi",
      isGroupSms: false,
      contactId: "sarah-johnson-1",
      // Full communication thread including emails, SMS, and calls in chronological order
      communicationThread: [
        {
          id: 1,
          type: "email" as const,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          subject: "Inquiry about 2BR unit at 123 Oak St",
          message: "Hello,\n\nI found your listing online and I'm very interested in the 2BR unit at 123 Oak St. Could you please send me more information about the property?\n\nThank you,\nSarah Johnson",
          timestamp: "2025-12-18 02:00 PM",
          openedAt: "2025-12-18 03:15 PM",
        },
        {
          id: 2,
          type: "email" as const,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          subject: "Re: Inquiry about 2BR unit at 123 Oak St",
          message: "Dear Sarah,\n\nThank you for your interest! The 2BR unit features:\n- 950 sq ft\n- Updated kitchen with granite counters\n- In-unit washer/dryer\n- One covered parking space\n\nWould you like to schedule a tour?\n\nBest regards,\nRichard Surovi",
          timestamp: "2025-12-18 04:30 PM",
          openedAt: "2025-12-18 05:00 PM",
          attachments: [
            { name: "123_Oak_St_Floor_Plan.pdf", size: "245 KB", type: "pdf" },
            { name: "Unit_Photos.zip", size: "3.2 MB", type: "zip" },
          ],
        },
        {
          id: 3,
          type: "text" as const,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "Hi, I'm interested in the 2BR unit at 123 Oak St. What's the monthly rent?",
          timestamp: "2025-12-19 10:15 AM",
        },
        {
          id: 4,
          type: "text" as const,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          message: "Hello Sarah! Thank you for your interest. The monthly rent is $2,200 and includes water and trash. Would you like to schedule a tour?",
          timestamp: "2025-12-19 11:30 AM",
        },
        {
          id: 5,
          type: "call" as const,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "Missed call from Sarah Johnson",
          notes: "Left voicemail asking about pet policy",
          timestamp: "2025-12-19 02:00 PM",
          duration: "0:45",
        },
        {
          id: 6,
          type: "call" as const,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          message: "Return call to Sarah Johnson",
          notes: "Discussed pet policy - $300 pet deposit, $25/month pet rent. Dogs under 50lbs allowed.",
          timestamp: "2025-12-19 03:30 PM",
          duration: "5:23",
        },
        {
          id: 7,
          type: "text" as const,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "That sounds great! What are the move-in costs?",
          timestamp: "2025-12-20 09:45 AM",
        },
        {
          id: 8,
          type: "text" as const,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          message: "Move-in costs include first month's rent ($2,200) and a security deposit equal to one month's rent ($2,200). We also have a $50 application fee per adult.",
          timestamp: "2025-12-20 10:20 AM",
          attachments: [
            { name: "Move_In_Checklist.pdf", size: "128 KB", type: "pdf" },
          ],
        },
        {
          id: 9,
          type: "text" as const,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "Hi! I saw your listing for the 2BR unit at 123 Oak St. Is it still available? I'd love to schedule a tour this weekend if possible. Thanks!",
          timestamp: "2025-12-21 02:30 PM",
        },
      ],
      conversationHistory: [
        {
          id: 1,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "Hi, I'm interested in the 2BR unit at 123 Oak St. What's the monthly rent?",
          timestamp: "2025-12-19 10:15 AM",
        },
        {
          id: 2,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          message: "Hello Sarah! Thank you for your interest. The monthly rent is $2,200 and includes water and trash. Would you like to schedule a tour?",
          timestamp: "2025-12-19 11:30 AM",
        },
        {
          id: 3,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "That sounds great! What are the move-in costs?",
          timestamp: "2025-12-20 09:45 AM",
        },
        {
          id: 4,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          message: "Move-in costs include first month's rent ($2,200) and a security deposit equal to one month's rent ($2,200). We also have a $50 application fee per adult.",
          timestamp: "2025-12-20 10:20 AM",
        },
        {
          id: 5,
          sender: "Sarah Johnson",
          direction: "incoming" as const,
          message: "Hi! I saw your listing for the 2BR unit at 123 Oak St. Is it still available? I'd love to schedule a tour this weekend if possible. Thanks!",
          timestamp: "2025-12-21 02:30 PM",
        },
      ],
    },
    {
      id: 3,
      from: "Mike Davis",
      type: "call" as const,
      entityType: "owner" as const,
      preview: "Missed call - Voicemail about property inspection",
      fullMessage:
        "Voicemail transcript: 'Hi, this is Mike Davis calling about the property inspection scheduled for next week. I need to reschedule due to a conflict. Please call me back at your earliest convenience. Thank you.'",
      timestamp: "2025-12-22 10:00 AM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-22T10:00:00"),
      assignedTo: "Nina Patel",
    },
    {
      id: 4,
      from: "Emily Brown",
      type: "email" as const,
      entityType: "tenant" as const,
      preview: "Maintenance request for kitchen faucet leak",
      fullMessage:
        "Hello,\n\nI'm writing to report a maintenance issue in my apartment (Unit 305). The kitchen faucet has been leaking for the past two days and it's getting worse. Water is dripping constantly even when the faucet is completely turned off.\n\nCould you please send someone to take a look at it as soon as possible? I'm available Monday through Friday after 5 PM, or anytime on weekends.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nEmily Brown\nUnit 305",
      timestamp: "2025-12-22 11:45 AM",
      read: true,
      responded: false,
      receivedAt: new Date("2025-12-22T11:45:00"),
      assignedTo: "Mike Johnson",
      emailHistory: [
        {
          id: 1,
          sender: "Emily Brown",
          direction: "incoming" as const,
          subject: "Maintenance request for kitchen faucet leak",
          message: "Hello,\n\nI'm writing to report a maintenance issue in my apartment (Unit 305). The kitchen faucet has been leaking for the past two days and it's getting worse. Water is dripping constantly even when the faucet is completely turned off.\n\nCould you please send someone to take a look at it as soon as possible? I'm available Monday through Friday after 5 PM, or anytime on weekends.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nEmily Brown\nUnit 305",
          timestamp: "2025-12-22 11:45 AM",
        },
      ],
    },
    {
      id: 5,
      from: "Robert Wilson",
      type: "text" as const,
      entityType: "prospectTenant" as const,
      preview: "Confirming tour appointment for tomorrow",
      fullMessage:
        "Just confirming our tour appointment for tomorrow at 2pm for the Maple Heights apartment. See you then!",
      timestamp: "2025-12-22 03:20 PM",
      read: true,
      responded: true,
      receivedAt: new Date("2025-12-22T15:20:00"),
      assignedTo: "Sarah Chen",
      conversationHistory: [
        {
          id: 1,
          sender: "Robert Wilson",
          direction: "incoming" as const,
          message: "Hello, I'd like to schedule a tour for the Maple Heights apartment.",
          timestamp: "2025-12-20 04:00 PM",
        },
        {
          id: 2,
          sender: "Sarah Chen",
          direction: "outgoing" as const,
          message: "Hi Robert! I'd be happy to show you the apartment. How about tomorrow at 2pm?",
          timestamp: "2025-12-20 04:15 PM",
        },
        {
          id: 3,
          sender: "Robert Wilson",
          direction: "incoming" as const,
          message: "That works perfectly. What's the address again?",
          timestamp: "2025-12-21 09:00 AM",
        },
        {
          id: 4,
          sender: "Sarah Chen",
          direction: "outgoing" as const,
          message: "Great! The address is 456 Maple Heights Dr, Unit 12. I'll meet you in the lobby. Please bring a photo ID.",
          timestamp: "2025-12-21 09:30 AM",
        },
        {
          id: 5,
          sender: "Robert Wilson",
          direction: "incoming" as const,
          message: "Just confirming our tour appointment for tomorrow at 2pm for the Maple Heights apartment. See you then!",
          timestamp: "2025-12-22 03:20 PM",
        },
      ],
    },
    {
      id: 6,
      from: "Lisa Chen",
      type: "email" as const,
      entityType: "prospectTenant" as const,
      preview: "Application documents attached as requested",
      fullMessage:
        "Dear Property Manager,\n\nAs requested, please find attached the following documents for my rental application:\n\n- Employment verification letter\n- Last 3 months of pay stubs\n- Bank statements\n- Photo ID\n- References from previous landlords\n\nPlease let me know if you need any additional documentation.\n\nBest regards,\nLisa Chen",
      timestamp: "2025-12-23 08:00 AM",
      read: true,
      responded: false,
      receivedAt: new Date("2025-12-23T08:00:00"),
      assignedTo: "Richard Surovi",
      emailHistory: [
        {
          id: 1,
          sender: "Lisa Chen",
          direction: "incoming" as const,
          subject: "Rental Application - Lisa Chen",
          message: "Dear Property Manager,\n\nI am interested in renting the 2BR apartment at Oak Manor. I would like to submit my application. Could you please let me know what documents are required?\n\nThank you,\nLisa Chen",
          timestamp: "2025-12-20 03:00 PM",
        },
        {
          id: 2,
          sender: "Richard Surovi",
          direction: "outgoing" as const,
          subject: "Re: Rental Application - Lisa Chen",
          message: "Dear Lisa,\n\nThank you for your interest in Oak Manor! To process your application, we'll need:\n\n- Employment verification letter\n- Last 3 months of pay stubs\n- Bank statements\n- Photo ID\n- References from previous landlords\n\nPlease submit these at your earliest convenience.\n\nBest regards,\nRichard Surovi\nB2B Property Management",
          timestamp: "2025-12-21 09:00 AM",
        },
        {
          id: 3,
          sender: "Lisa Chen",
          direction: "incoming" as const,
          subject: "Re: Rental Application - Lisa Chen",
          message: "Dear Property Manager,\n\nAs requested, please find attached the following documents for my rental application:\n\n- Employment verification letter\n- Last 3 months of pay stubs\n- Bank statements\n- Photo ID\n- References from previous landlords\n\nPlease let me know if you need any additional documentation.\n\nBest regards,\nLisa Chen",
          timestamp: "2025-12-23 08:00 AM",
        },
      ],
    },
    // Additional communications for complete filter coverage
    {
      id: 7,
      from: "James Peterson",
      type: "email" as const,
      entityType: "tenant" as const,
      preview: "Urgent: Heating system not working in Unit 412",
      fullMessage:
        "Hello,\n\nI'm reaching out because the heating system in my unit (412) stopped working last night. The temperature inside has dropped significantly and it's becoming uncomfortable.\n\nCould someone please come take a look at it today? I'll be home all day.\n\nThank you,\nJames Peterson",
      timestamp: "2025-12-23 07:30 AM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-23T07:30:00"),
      assignedTo: "Mike Johnson",
      emailHistory: [
        {
          id: 1,
          sender: "James Peterson",
          direction: "incoming" as const,
          subject: "Urgent: Heating system not working in Unit 412",
          message: "Hello,\n\nI'm reaching out because the heating system in my unit (412) stopped working last night. The temperature inside has dropped significantly and it's becoming uncomfortable.\n\nCould someone please come take a look at it today? I'll be home all day.\n\nThank you,\nJames Peterson",
          timestamp: "2025-12-23 07:30 AM",
        },
      ],
    },
    {
      id: 8,
      from: "Amanda White",
      type: "text" as const,
      entityType: "tenant" as const,
      preview: "Can I pay rent a few days late this month?",
      fullMessage:
        "Hi, I wanted to ask if it's possible to pay my rent a few days late this month? I had an unexpected expense and my paycheck comes on the 5th. Let me know, thanks!",
      timestamp: "2025-12-22 04:45 PM",
      read: true,
      responded: false,
      receivedAt: new Date("2025-12-22T16:45:00"),
      assignedTo: "Nina Patel",
      isGroupSms: false,
      contactId: "amanda-white-1",
      communicationThread: [
        {
          id: 1,
          type: "text" as const,
          sender: "Amanda White",
          direction: "incoming" as const,
          message: "Hi, I wanted to ask if it's possible to pay my rent a few days late this month? I had an unexpected expense and my paycheck comes on the 5th. Let me know, thanks!",
          timestamp: "2025-12-22 04:45 PM",
        },
      ],
      conversationHistory: [
        {
          id: 1,
          sender: "Amanda White",
          direction: "incoming" as const,
          message: "Hi, I wanted to ask if it's possible to pay my rent a few days late this month? I had an unexpected expense and my paycheck comes on the 5th. Let me know, thanks!",
          timestamp: "2025-12-22 04:45 PM",
        },
      ],
    },
    {
      id: 9,
      from: "David Martinez",
      type: "call" as const,
      entityType: "tenant" as const,
      preview: "Missed call - Question about parking permit",
      fullMessage:
        "Voicemail transcript: 'Hi, this is David Martinez from Unit 208. I have a question about getting an additional parking permit for my spouse's car. Please call me back when you get a chance. Thanks!'",
      timestamp: "2025-12-22 02:15 PM",
      read: true,
      responded: false,
      receivedAt: new Date("2025-12-22T14:15:00"),
      assignedTo: "Sarah Chen",
    },
    {
      id: 10,
      from: "Karen Thompson",
      type: "email" as const,
      entityType: "tenant" as const,
      preview: "Move-out notice for Unit 118",
      fullMessage:
        "Dear Property Management,\n\nThis letter serves as my official 30-day notice to vacate Unit 118 at Pine View Apartments. My last day will be January 22, 2026.\n\nPlease let me know the move-out inspection schedule and any requirements for returning the unit.\n\nThank you,\nKaren Thompson",
      timestamp: "2025-12-22 09:00 AM",
      read: true,
      responded: false,
      receivedAt: new Date("2025-12-22T09:00:00"),
      assignedTo: "Richard Surovi",
      emailHistory: [
        {
          id: 1,
          sender: "Karen Thompson",
          direction: "incoming" as const,
          subject: "Move-out notice for Unit 118",
          message: "Dear Property Management,\n\nThis letter serves as my official 30-day notice to vacate Unit 118 at Pine View Apartments. My last day will be January 22, 2026.\n\nPlease let me know the move-out inspection schedule and any requirements for returning the unit.\n\nThank you,\nKaren Thompson",
          timestamp: "2025-12-22 09:00 AM",
        },
      ],
    },
    {
      id: 11,
      from: "Chris Lee",
      type: "text" as const,
      entityType: "tenant" as const,
      preview: "Package was left outside my door, thanks!",
      fullMessage: "Hey, just wanted to let you know my package was delivered and left outside my door. Thanks for the heads up about the delivery!",
      timestamp: "2025-12-23 10:30 AM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-23T10:30:00"),
      assignedTo: "Sarah Chen",
      isGroupSms: false,
      contactId: "chris-lee-1",
      communicationThread: [
        {
          id: 1,
          type: "text" as const,
          sender: "Sarah Chen",
          direction: "outgoing" as const,
          message: "Hi Chris, FedEx just dropped off a package for you. I had them leave it at your door.",
          timestamp: "2025-12-23 10:15 AM",
        },
        {
          id: 2,
          type: "text" as const,
          sender: "Chris Lee",
          direction: "incoming" as const,
          message: "Hey, just wanted to let you know my package was delivered and left outside my door. Thanks for the heads up about the delivery!",
          timestamp: "2025-12-23 10:30 AM",
        },
      ],
      conversationHistory: [
        {
          id: 1,
          sender: "Sarah Chen",
          direction: "outgoing" as const,
          message: "Hi Chris, FedEx just dropped off a package for you. I had them leave it at your door.",
          timestamp: "2025-12-23 10:15 AM",
        },
        {
          id: 2,
          sender: "Chris Lee",
          direction: "incoming" as const,
          message: "Hey, just wanted to let you know my package was delivered and left outside my door. Thanks for the heads up about the delivery!",
          timestamp: "2025-12-23 10:30 AM",
        },
      ],
    },
    {
      id: 12,
      from: "Patricia Garcia",
      type: "call" as const,
      entityType: "tenant" as const,
      preview: "Missed call - Complaint about noisy neighbors",
      fullMessage:
        "Voicemail transcript: 'Hello, this is Patricia Garcia in Unit 305. I need to report ongoing noise issues with the unit above me. They've been having loud parties almost every weekend. Please call me back to discuss what can be done. Thank you.'",
      timestamp: "2025-12-23 11:00 AM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-23T11:00:00"),
      assignedTo: "Nina Patel",
    },
    {
      id: 13,
      from: "Michael Brown",
      type: "email" as const,
      entityType: "prospectTenant" as const,
      preview: "Interest in 3BR unit at Oak Manor",
      fullMessage:
        "Hi,\n\nI found your listing for the 3-bedroom unit at Oak Manor on Zillow. I'm very interested and would like to schedule a viewing.\n\nMy family of 4 is looking to move in by February 1st. Could you please let me know:\n1. Is the unit still available?\n2. What are the pet policies? We have a small dog.\n3. What utilities are included?\n\nThank you,\nMichael Brown",
      timestamp: "2025-12-23 08:45 AM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-23T08:45:00"),
      assignedTo: "Sarah Chen",
      emailHistory: [
        {
          id: 1,
          sender: "Michael Brown",
          direction: "incoming" as const,
          subject: "Interest in 3BR unit at Oak Manor",
          message: "Hi,\n\nI found your listing for the 3-bedroom unit at Oak Manor on Zillow. I'm very interested and would like to schedule a viewing.\n\nMy family of 4 is looking to move in by February 1st. Could you please let me know:\n1. Is the unit still available?\n2. What are the pet policies? We have a small dog.\n3. What utilities are included?\n\nThank you,\nMichael Brown",
          timestamp: "2025-12-23 08:45 AM",
        },
      ],
    },
    {
      id: 14,
      from: "Jennifer Adams",
      type: "text" as const,
      entityType: "tenant" as const,
      preview: "When will the pool be open again?",
      fullMessage: "Hi! Quick question - when will the community pool be open again after the maintenance? Thanks!",
      timestamp: "2025-12-23 09:15 AM",
      read: true,
      responded: true,
      receivedAt: new Date("2025-12-23T09:15:00"),
      assignedTo: "Mike Johnson",
      conversationHistory: [
        {
          id: 1,
          sender: "Jennifer Adams",
          direction: "incoming" as const,
          message: "Hi! Quick question - when will the community pool be open again after the maintenance? Thanks!",
          timestamp: "2025-12-23 09:15 AM",
        },
        {
          id: 2,
          sender: "Mike Johnson",
          direction: "outgoing" as const,
          message: "Hi Jennifer! The pool maintenance should be completed by this Friday. We expect to reopen on Saturday morning. I'll send out a notice to all residents once it's ready!",
          timestamp: "2025-12-23 09:30 AM",
        },
      ],
    },
    {
      id: 15,
      from: "Thomas Wilson",
      type: "call" as const,
      entityType: "tenant" as const,
      preview: "Missed call - Lease renewal discussion",
      fullMessage:
        "Voicemail transcript: 'Hi, this is Thomas Wilson from Unit 210. My lease is coming up for renewal next month and I wanted to discuss the terms. Please give me a call back when you have a moment. Thanks!'",
      timestamp: "2025-12-21 03:30 PM",
      read: true,
      responded: true,
      receivedAt: new Date("2025-12-21T15:30:00"),
      assignedTo: "Richard Surovi",
    },
    // Group SMS examples
    {
      id: 16,
      from: "Building A Residents",
      type: "text" as const,
      entityType: "tenant" as const,
      preview: "Water shutoff notice - Dec 26th 9AM-12PM",
      fullMessage: "NOTICE: Water will be shut off on Dec 26th from 9AM-12PM for pipe maintenance in Building A. Please plan accordingly.",
      timestamp: "2025-12-23 08:00 AM",
      read: false,
      responded: false,
      receivedAt: new Date("2025-12-23T08:00:00"),
      assignedTo: "Mike Johnson",
      isGroupSms: true,
      groupParticipants: ["John Smith", "Emily Brown", "Robert Wilson", "Lisa Chen", "James Peterson", "+12 more"],
      contactId: "building-a-group",
      communicationThread: [
        {
          id: 1,
          type: "text" as const,
          sender: "Mike Johnson",
          direction: "outgoing" as const,
          message: "NOTICE: Water will be shut off on Dec 26th from 9AM-12PM for pipe maintenance in Building A. Please plan accordingly.",
          timestamp: "2025-12-23 08:00 AM",
        },
        {
          id: 2,
          type: "text" as const,
          sender: "John Smith",
          direction: "incoming" as const,
          message: "Thanks for the heads up!",
          timestamp: "2025-12-23 08:15 AM",
        },
        {
          id: 3,
          type: "text" as const,
          sender: "Emily Brown",
          direction: "incoming" as const,
          message: "Got it, thank you",
          timestamp: "2025-12-23 08:22 AM",
        },
        {
          id: 4,
          type: "text" as const,
          sender: "Lisa Chen",
          direction: "incoming" as const,
          message: "Will the water be restored by noon?",
          timestamp: "2025-12-23 08:30 AM",
        },
        {
          id: 5,
          type: "text" as const,
          sender: "Mike Johnson",
          direction: "outgoing" as const,
          message: "Yes, we expect everything to be back online by 12PM. We'll send an update once completed.",
          timestamp: "2025-12-23 08:35 AM",
        },
      ],
      conversationHistory: [
        {
          id: 1,
          sender: "Mike Johnson",
          direction: "outgoing" as const,
          message: "NOTICE: Water will be shut off on Dec 26th from 9AM-12PM for pipe maintenance in Building A. Please plan accordingly.",
          timestamp: "2025-12-23 08:00 AM",
        },
        {
          id: 2,
          sender: "John Smith",
          direction: "incoming" as const,
          message: "Thanks for the heads up!",
          timestamp: "2025-12-23 08:15 AM",
        },
        {
          id: 3,
          sender: "Emily Brown",
          direction: "incoming" as const,
          message: "Got it, thank you",
          timestamp: "2025-12-23 08:22 AM",
        },
      ],
    },
    {
      id: 17,
      from: "Oak Manor Tenants",
      type: "text" as const,
      entityType: "tenant" as const,
      preview: "Holiday office hours reminder",
      fullMessage: "Reminder: Office will be closed Dec 25-26 for the holidays. Emergency maintenance line available 24/7.",
      timestamp: "2025-12-22 04:00 PM",
      read: true,
      responded: false,
      receivedAt: new Date("2025-12-22T16:00:00"),
      assignedTo: "Nina Patel",
      isGroupSms: true,
      groupParticipants: ["Amanda White", "David Martinez", "Karen Thompson", "Chris Lee", "+8 more"],
      contactId: "oak-manor-group",
      communicationThread: [
        {
          id: 1,
          type: "email" as const,
          sender: "Nina Patel",
          direction: "outgoing" as const,
          subject: "Holiday Office Hours - Oak Manor",
          message: "Dear Oak Manor Residents,\n\nThis is a reminder that our office will be closed on December 25th and 26th for the Christmas holiday.\n\nFor emergencies, please call our 24/7 maintenance hotline at (555) 123-4567.\n\nHappy Holidays!\n\nNina Patel\nProperty Manager",
          timestamp: "2025-12-22 02:00 PM",
          openedAt: "2025-12-22 02:30 PM",
        },
        {
          id: 2,
          type: "text" as const,
          sender: "Nina Patel",
          direction: "outgoing" as const,
          message: "Reminder: Office will be closed Dec 25-26 for the holidays. Emergency maintenance line available 24/7.",
          timestamp: "2025-12-22 04:00 PM",
        },
        {
          id: 3,
          type: "text" as const,
          sender: "Amanda White",
          direction: "incoming" as const,
          message: "Thank you for the reminder! Happy holidays!",
          timestamp: "2025-12-22 04:15 PM",
        },
      ],
      conversationHistory: [
        {
          id: 1,
          sender: "Nina Patel",
          direction: "outgoing" as const,
          message: "Reminder: Office will be closed Dec 25-26 for the holidays. Emergency maintenance line available 24/7.",
          timestamp: "2025-12-22 04:00 PM",
        },
        {
          id: 2,
          sender: "Amanda White",
          direction: "incoming" as const,
          message: "Thank you for the reminder! Happy holidays!",
          timestamp: "2025-12-22 04:15 PM",
        },
      ],
    },
  ]

  const staffMembers = [
    { id: 1, name: "Nina Patel", role: "Leasing Manager" },
    { id: 2, name: "Richard Surovi", role: "Property Manager" },
    { id: 3, name: "Mike Johnson", role: "Maintenance Tech" },
    { id: 4, name: "Sarah Chen", role: "Leasing Agent" },
    { id: 5, name: "David Wilson", role: "Operations Manager" },
  ]

  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false)
  
  // Communication tile filter state: which tile is selected (null = show all, "emails" | "sms" | "calls")
  const [selectedCommTile, setSelectedCommTile] = useState<"emails" | "sms" | "calls" | null>(null)
  // Radio filter for All/Unread/Unresponded - applies to ALL tiles
  const [commSubFilter, setCommSubFilter] = useState<"all" | "unread" | "unresponded">("all")
  
  // Hierarchical filter state for Communications section
  const [isHierarchyDropdownOpen, setIsHierarchyDropdownOpen] = useState(false)
  const [hierarchySearchQuery, setHierarchySearchQuery] = useState("")
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)
  const [selectedHierarchy, setSelectedHierarchy] = useState<{
    type: "department" | "team" | "staff" | null
    value: string | null
    label: string
  }>({ type: null, value: null, label: "All Staff" })



  // Hierarchical organization data
  const organizationHierarchy = [
    {
      id: "dept-leasing",
      name: "Leasing Department",
      teams: [
        {
          id: "team-sales",
          name: "Sales Team",
          members: [
            { id: "staff-1", name: "Sarah Chen" },
            { id: "staff-2", name: "Richard Surovi" },
          ],
        },
        {
          id: "team-tours",
          name: "Tours Team",
          members: [
            { id: "staff-3", name: "Nina Patel" },
          ],
        },
      ],
    },
    {
      id: "dept-operations",
      name: "Operations Department",
      teams: [
        {
          id: "team-maintenance",
          name: "Maintenance Team",
          members: [
            { id: "staff-4", name: "Mike Johnson" },
          ],
        },
        {
          id: "team-admin",
          name: "Admin Team",
          members: [
            { id: "staff-5", name: "Emily Davis" },
          ],
        },
      ],
    },
    {
      id: "dept-finance",
      name: "Finance Department",
      teams: [
        {
          id: "team-accounting",
          name: "Accounting Team",
          members: [
            { id: "staff-6", name: "James Wilson" },
          ],
        },
      ],
    },
  ]

  // Get all staff names for filtering based on hierarchy selection
  const getHierarchyStaffNames = (): string[] => {
    if (!selectedHierarchy.type || !selectedHierarchy.value) {
      return [] // No filter - show all
    }
    
    if (selectedHierarchy.type === "department") {
      const dept = organizationHierarchy.find(d => d.id === selectedHierarchy.value)
      if (!dept) return []
      return dept.teams.flatMap(t => t.members.map(m => m.name))
    }
    
    if (selectedHierarchy.type === "team") {
      for (const dept of organizationHierarchy) {
        const team = dept.teams.find(t => t.id === selectedHierarchy.value)
        if (team) return team.members.map(m => m.name)
      }
      return []
    }
    
    if (selectedHierarchy.type === "staff") {
      return [selectedHierarchy.label]
    }
    
    return []
  }

  // Filter hierarchy items based on search
  const filterHierarchyBySearch = (query: string) => {
    if (!query) return organizationHierarchy
    const lowerQuery = query.toLowerCase()
    return organizationHierarchy
      .map(dept => ({
        ...dept,
        teams: dept.teams
          .map(team => ({
            ...team,
            members: team.members.filter(m => m.name.toLowerCase().includes(lowerQuery))
          }))
          .filter(team => 
            team.name.toLowerCase().includes(lowerQuery) || team.members.length > 0
          )
      }))
      .filter(dept => 
        dept.name.toLowerCase().includes(lowerQuery) || dept.teams.length > 0
      )
  }

  // Filter staff based on search query
  const filteredStaffMembers = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()),
  )

  // Filter tasks based on selected staff, search query, AND dashboard filter
  const currentUserName = "Nina Patel"
  const orgStaffNames = organizationHierarchy
    .flatMap(d => d.teams.flatMap(t => t.members.map(m => m.name)))
    .filter(n => n !== currentUserName)

  const filteredTasks = tasks.filter((t) => {
    const matchesStaff = selectedStaff ? t.assignedTo === selectedStaff : true
    const matchesSearch = tasksSearchQuery ? t.assignedTo.toLowerCase().includes(tasksSearchQuery.toLowerCase()) : true
    // Apply dashboard filter
    if (dashFilter === "myTasks") return matchesStaff && matchesSearch && t.assignedTo === currentUserName
    if (dashFilter === "overdue") return matchesStaff && matchesSearch && t.overdue
    if (dashFilter === "legalRisk") return matchesStaff && matchesSearch && (t.title.toLowerCase().includes("legal") || t.title.toLowerCase().includes("lease") || t.title.toLowerCase().includes("evict") || t.title.toLowerCase().includes("compliance") || t.priority === "high")
    if (dashFilter === "orgTasks") return matchesStaff && matchesSearch && orgStaffNames.includes(t.assignedTo)
    return matchesStaff && matchesSearch
  })

  // Filter communications based on selected staff, search query, AND hierarchical filter
  const hierarchyStaffNames = getHierarchyStaffNames()
  const baseFilteredCommunications = communications.filter((c) => {
    const matchesStaff = selectedStaff ? c.assignedTo === selectedStaff : true
    const matchesSearch = commsSearchQuery ? c.assignedTo.toLowerCase().includes(commsSearchQuery.toLowerCase()) : true
    const matchesHierarchy = hierarchyStaffNames.length === 0 || hierarchyStaffNames.includes(c.assignedTo)
    return matchesStaff && matchesSearch && matchesHierarchy
  })

  // Helper to check if communication is unresponded (read but not replied, over 24hr threshold)
  const isUnresponded = (c: (typeof communications)[0]) => {
    if (!c.read || c.responded) return false
    const now = new Date()
    const hoursSinceReceived = (now.getTime() - c.receivedAt.getTime()) / (1000 * 60 * 60)
    return hoursSinceReceived >= 24
  }

  // Helper to check if communication is pending (unread OR unresponded)
  const isPending = (c: (typeof communications)[0]) => {
    return !c.read || isUnresponded(c)
  }

  // Communication summary by type with unread + unresponded counts
  const emailComms = baseFilteredCommunications.filter((c) => c.type === "email")
  const smsComms = baseFilteredCommunications.filter((c) => c.type === "text")
  const callComms = baseFilteredCommunications.filter((c) => c.type === "call")

  const commSummary = {
    // Pending = Emails (unread + unresponded) + SMS (unread + unresponded) + Calls (unresponded only)
    pending: 
      emailComms.filter(isPending).length + 
      smsComms.filter(isPending).length + 
      callComms.filter(isUnresponded).length,
    // Emails tile count = unread + unresponded emails
    emails: emailComms.filter(isPending).length,
    emailsUnread: emailComms.filter((c) => !c.read).length,
    emailsUnresponded: emailComms.filter(isUnresponded).length,
    // SMS tile count = unread + unresponded SMS
    sms: smsComms.filter(isPending).length,
    smsUnread: smsComms.filter((c) => !c.read).length,
    smsUnresponded: smsComms.filter(isUnresponded).length,
    // Calls tile count = unresponded calls only
    calls: callComms.filter(isUnresponded).length,
  }

  // Apply tile and radio sub-filter to get final filtered list
  // Radio filter (All/Unread/Unresponded) applies to ALL tiles including "All" tile
  const filteredCommunications = baseFilteredCommunications.filter((c) => {
    // First, filter by tile type
    if (selectedCommTile === "emails" && c.type !== "email") return false
    if (selectedCommTile === "sms" && c.type !== "text") return false
    if (selectedCommTile === "calls" && c.type !== "call") return false
    
    // Then apply radio filter (works for all tiles)
    if (commSubFilter === "unread") return !c.read
    if (commSubFilter === "unresponded") return isUnresponded(c)
    
    // "all" filter - show all unread + unresponded for the selected type
    // For "All" tile (null), show all pending across all types
    if (!selectedCommTile) {
      if (c.type === "call") return isUnresponded(c) || !c.read
      return isPending(c)
    }
    
    // For specific tiles with "all" radio selected
    if (selectedCommTile === "calls") return isUnresponded(c) || !c.read
    return isPending(c)
  })

  // Update summaries based on filtered data
  const taskSummary = {
    total: filteredTasks.length,
    overdue: filteredTasks.filter((t) => t.overdue).length,
    dueToday: filteredTasks.filter((t) => t.dueDate === "2025-12-23").length,
    dueThisWeek: filteredTasks.filter((t) => !t.overdue && t.dueDate <= "2025-12-29").length,
  }

  // Combined items for the Combined tab - merge comms and tasks sorted by time (newest first)
  const combinedItems = useMemo(() => {
    const commItems = filteredCommunications.map((c) => ({
      kind: "comm" as const,
      sortDate: c.receivedAt,
      comm: c,
    }))
    const taskItems = filteredTasks.map((t) => ({
      kind: "task" as const,
      sortDate: new Date(t.dueDate + "T12:00:00"),
      task: t,
    }))
    return [...commItems, ...taskItems].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
  }, [filteredCommunications, filteredTasks])

  // KPI Data based on role
  const getKPIData = () => {
    const baseMultiplier = userRole === "leader" ? 5 : userRole === "manager" ? 2 : 1
    return {
      sales: {
        newLeads: 24 * baseMultiplier,
        conversionRate: 32,
        newUnitAdditions: 8 * baseMultiplier,
        avgResponseTime: "2.4 hrs",
        history: Array.from({ length: 12 }, (_, i) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
          leads: Math.floor(20 + Math.random() * 15) * baseMultiplier,
          conversion: Math.floor(25 + Math.random() * 15),
        })),
      },
      leasing: {
        newLeads: 45 * baseMultiplier,
        conversionRate: 28,
        newApplications: 18 * baseMultiplier,
        newLeasesSigned: 12 * baseMultiplier,
        avgDaysOnMarket: 21,
        avgResponseTime: "1.8 hrs",
        history: Array.from({ length: 12 }, (_, i) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
          leads: Math.floor(35 + Math.random() * 20) * baseMultiplier,
          leases: Math.floor(8 + Math.random() * 8) * baseMultiplier,
        })),
      },
      operations: {
        totalUnits: 156 * baseMultiplier,
        churnRate: 8.5,
        occupancyRate: 94.2,
        rentCollections: 98.1,
        leasesRenewed: 15 * baseMultiplier,
        openComplaints: 7 * baseMultiplier,
        openTerminations: 3 * baseMultiplier,
        newWorkOrders: 23 * baseMultiplier,
        completedWorkOrders: 19 * baseMultiplier,
        avgResponseTime: "4.2 hrs",
        history: Array.from({ length: 12 }, (_, i) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
          occupancy: Math.floor(90 + Math.random() * 8),
          collections: Math.floor(95 + Math.random() * 4),
        })),
      },
      maintenance: {
        inspectionSpeed: "1.2 days",
        makeReadySpeed: "4.5 days",
        makeReadyConversionRate: 87,
        avgResponseTime: "3.1 hrs",
        history: Array.from({ length: 12 }, (_, i) => ({
          month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
          inspectionDays: +(1 + Math.random() * 0.5).toFixed(1),
          makeReadyDays: +(4 + Math.random() * 1.5).toFixed(1),
        })),
      },
    }
  }

  const kpiData = getKPIData()

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    // Navigate based on entity type
    if (task.entityType === "tenant") nav.go("contacts", { view: "tenants-contact" })
    else if (task.entityType === "owner") nav.go("contacts", { view: "owners-contact" })
    else if (task.entityType === "property") nav.go("properties", { view: "all-properties" })
    else if (task.entityType === "lease") nav.go("leasing", { view: "leases" })
    else if (task.entityType === "lead") nav.go("leads")
    else if (task.entityType === "prospectOwner") nav.go("leads", { view: "prospect-owners" })
    else if (task.entityType === "leaseProspect") nav.go("leads", { view: "lease-prospects" })
  }

  // Handle clicking on process name to navigate to related detail page's Processes tab
  const handleProcessClick = (task: (typeof tasks)[0]) => {
    if (!task.processEntityType) return
    // Navigate to the detail page Processes tab based on entity type
    if (task.processEntityType === "tenant") nav.go("contacts", { view: "tenants-contact", tab: "processes" })
    else if (task.processEntityType === "owner") nav.go("contacts", { view: "owners-contact", tab: "processes" })
    else if (task.processEntityType === "prospectOwner") nav.go("leads", { view: "prospect-owner-detail", tab: "processes" })
    else if (task.processEntityType === "leaseProspect") nav.go("leads", { view: "lease-prospect-detail", tab: "processes" })
  }

  // Handle clicking on skipped status
  const handleSkippedClick = (task: (typeof tasks)[0]) => {
    if (task.status === "Skipped" && task.skippedComment) {
      setSelectedSkippedTask({
        title: task.title,
        skippedComment: task.skippedComment,
      })
      setShowSkippedModal(true)
    }
  }

  const handleCommunicationClick = (comm: (typeof communications)[0]) => {
    setSelectedCommunication(comm)
    setShowCommunicationModal(true)
  }

  const handleViewCommunicationDetails = () => {
    if (selectedCommunication) {
      setShowCommunicationModal(false)
      // Navigate to Contacts > Owners > Owner details > Overview tab > Activity Section
      const contactData = {
        name: selectedCommunication.from,
        id: selectedCommunication.contactId || selectedCommunication.id.toString(),
      }
      
      // Always navigate to Owner Detail page > Overview tab with scroll to Activity section
      nav.go("contactOwnerDetail", { contact: contactData, tab: "overview", scrollToActivity: true })
    }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Skipped":
        return "bg-purple-50 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const getCommTypeIcon = (type: "email" | "call" | "text") => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "text":
        return <MessageCircle className="h-4 w-4" /> // Changed from MessageSquare to MessageCircle for consistency
    }
  }

  const getCommTypeStyles = (type: "email" | "call" | "text") => {
    switch (type) {
      case "email":
        return { bg: "bg-blue-100", text: "text-blue-600", icon: <Mail className="h-4 w-4" /> }
      case "call":
        return { bg: "bg-green-100", text: "text-green-600", icon: <Phone className="h-4 w-4" /> }
      case "text":
        return { bg: "bg-purple-100", text: "text-purple-600", icon: <MessageCircle className="h-4 w-4" /> } // Changed from MessageSquare to MessageCircle for consistency
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="relative">
          <Popover open={isStaffDropdownOpen} onOpenChange={setIsStaffDropdownOpen}>
            <PopoverContent className="w-[240px] p-0" align="end">
              <div className="p-2 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search staff..."
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    className="pl-8 h-9 border-slate-200"
                  />
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto py-1">
                <button
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 ${
                    !selectedStaff ? "bg-slate-50 font-medium" : ""
                  }`}
                  onClick={() => {
                    setSelectedStaff(null)
                    setStaffSearchQuery("")
                    setIsStaffDropdownOpen(false)
                  }}
                >
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>All Staff Members</span>
                </button>
                {filteredStaffMembers.map((staff) => (
                  <button
                    key={staff.id}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 ${
                      selectedStaff === staff.name ? "bg-slate-50 font-medium" : ""
                    }`}
                    onClick={() => {
                      setSelectedStaff(staff.name)
                      setStaffSearchQuery("")
                      setIsStaffDropdownOpen(false)
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-900">{staff.name}</span>
                      <span className="text-xs text-slate-500">{staff.role}</span>
                    </div>
                  </button>
                ))}
                {filteredStaffMembers.length === 0 && (
                  <div className="px-3 py-2 text-sm text-slate-500 text-center">No staff found</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {selectedStaff && (
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <User className="h-4 w-4" />
          <span>
            Showing records for: <strong>{selectedStaff}</strong>
          </span>
          <button
            className="ml-auto text-slate-500 hover:text-slate-700 text-xs underline"
            onClick={() => setSelectedStaff(null)}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Summary Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Wrench className="h-4.5 w-4.5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">12</p>
            <p className="text-[11px] text-slate-500 leading-tight">Open Maintenance</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="h-4.5 w-4.5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">8</p>
            <p className="text-[11px] text-slate-500 leading-tight">Lease Renewals</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <LogOut className="h-4.5 w-4.5 text-orange-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">3</p>
            <p className="text-[11px] text-slate-500 leading-tight">Move-Outs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
            <DollarSign className="h-4.5 w-4.5 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">94%</p>
            <p className="text-[11px] text-slate-500 leading-tight">Rent Collected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200">
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900 leading-tight">2</p>
            <p className="text-[11px] text-slate-500 leading-tight">Legal / SLA Risk</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-red-200 bg-red-50/30">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <OctagonAlert className="h-4.5 w-4.5 text-red-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-red-700 leading-tight">5</p>
            <p className="text-[11px] text-red-600 leading-tight">Critical</p>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex items-center border-b border-slate-200 pb-0">
        <div className="flex items-center gap-1">
          {(["tasks", "communications", "combined"] as const).map((tab) => {
            const count = tab === "tasks" ? filteredTasks.length : tab === "communications" ? filteredCommunications.length : null
            return (
              <button
                key={tab}
                onClick={() => setDashboardTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors relative flex items-center gap-1.5 ${
                  dashboardTab === tab
                    ? "text-teal-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                {count !== null && (
                  <span className={`text-[10px] font-semibold min-w-[18px] h-[18px] inline-flex items-center justify-center rounded-full ${
                    dashboardTab === tab
                      ? "bg-teal-100 text-teal-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {count}
                  </span>
                )}
                {dashboardTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setShowDashFilters(!showDashFilters)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
            showDashFilters || dashFilter !== "all"
              ? "bg-teal-50 border-teal-200 text-teal-700"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {dashFilter !== "all" && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
          )}
        </button>
      </div>

      {/* Filter Section */}
      {showDashFilters && (
        <div className="flex items-center gap-2 px-1 py-2 bg-slate-50 rounded-lg border border-slate-200">
          {([
            { key: "all" as const, label: "All" },
            { key: "myTasks" as const, label: "My Tasks" },
            { key: "overdue" as const, label: "Overdue" },
            { key: "legalRisk" as const, label: "Legal Risk" },
            ...(userRole === "manager" || userRole === "leader" ? [{ key: "orgTasks" as const, label: "Org Tasks" }] : []),
          ]).map((f) => (
            <button
              key={f.key}
              onClick={() => setDashFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                dashFilter === f.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
          {dashFilter !== "all" && (
            <button
              onClick={() => setDashFilter("all")}
              className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Communications Section */}
        {dashboardTab === "communications" && (
        <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900">Communications</CardTitle>
                </div>
                {/* Summary tiles - 4 tiles as specified */}
                <div className="flex items-center gap-3">
                  {/* Tile 1: All Communications - clickable, shows all unread + unresponded */}
                  <div 
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedCommTile === null 
                        ? "bg-slate-800 border border-slate-800" 
                        : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => {
                      setSelectedCommTile(null)
                      setCommSubFilter("all")
                    }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedCommTile === null ? "bg-slate-700" : "bg-slate-100"
                    }`}>
                      <Bell className={`h-4.5 w-4.5 ${selectedCommTile === null ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${selectedCommTile === null ? "text-white" : "text-slate-900"}`}>{commSummary.pending}</span>
                      <span className={`text-[11px] uppercase tracking-wide font-medium ${selectedCommTile === null ? "text-slate-300" : "text-slate-500"}`}>All</span>
                    </div>
                  </div>
                  
                  {/* Tile 2: Emails - clickable, shows unread + unresponded */}
                  <div 
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedCommTile === "emails" 
                        ? "bg-teal-600 border border-teal-600" 
                        : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => {
                      if (selectedCommTile === "emails") {
                        setSelectedCommTile(null)
                        setCommSubFilter("all")
                      } else {
                        setSelectedCommTile("emails")
                        setCommSubFilter("all")
                      }
                    }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedCommTile === "emails" ? "bg-teal-500" : "bg-slate-100"
                    }`}>
                      <Mail className={`h-4.5 w-4.5 ${selectedCommTile === "emails" ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${selectedCommTile === "emails" ? "text-white" : "text-slate-900"}`}>{commSummary.emails}</span>
                      <span className={`text-[11px] uppercase tracking-wide font-medium ${selectedCommTile === "emails" ? "text-teal-100" : "text-slate-500"}`}>Emails</span>
                    </div>
                  </div>
                  
                  {/* Tile 3: SMS - clickable, shows unread + unresponded */}
                  <div 
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedCommTile === "sms" 
                        ? "bg-teal-600 border border-teal-600" 
                        : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => {
                      if (selectedCommTile === "sms") {
                        setSelectedCommTile(null)
                        setCommSubFilter("all")
                      } else {
                        setSelectedCommTile("sms")
                        setCommSubFilter("all")
                      }
                    }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedCommTile === "sms" ? "bg-teal-500" : "bg-slate-100"
                    }`}>
                      <MessageSquare className={`h-4.5 w-4.5 ${selectedCommTile === "sms" ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${selectedCommTile === "sms" ? "text-white" : "text-slate-900"}`}>{commSummary.sms}</span>
                      <span className={`text-[11px] uppercase tracking-wide font-medium ${selectedCommTile === "sms" ? "text-teal-100" : "text-slate-500"}`}>SMS</span>
                    </div>
                  </div>
                  
                  {/* Tile 4: Calls - clickable, shows unresponded only */}
                  <div 
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedCommTile === "calls" 
                        ? "bg-teal-600 border border-teal-600" 
                        : "bg-white border border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => {
                      if (selectedCommTile === "calls") {
                        setSelectedCommTile(null)
                      } else {
                        setSelectedCommTile("calls")
                      }
                    }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedCommTile === "calls" ? "bg-teal-500" : "bg-slate-100"
                    }`}>
                      <Phone className={`h-4.5 w-4.5 ${selectedCommTile === "calls" ? "text-white" : "text-slate-600"}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold leading-none ${selectedCommTile === "calls" ? "text-white" : "text-slate-900"}`}>{commSummary.calls}</span>
                      <span className={`text-[11px] uppercase tracking-wide font-medium ${selectedCommTile === "calls" ? "text-teal-100" : "text-slate-500"}`}>Calls</span>
                    </div>
                  </div>
                  
                  </div>
              </div>
              {/* Hierarchical Filter Dropdown + View All */}
              <div className="flex items-center gap-2">
                {/* Hierarchical Department/Team/Staff Filter */}
                <Popover open={isHierarchyDropdownOpen} onOpenChange={setIsHierarchyDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 bg-transparent"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {selectedHierarchy.label}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="end">
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search department, team, or staff..."
                          value={hierarchySearchQuery}
                          onChange={(e) => setHierarchySearchQuery(e.target.value)}
                          className="pl-8 h-9 border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto py-1">
                      {/* All Staff option */}
                      <button
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 ${
                          !selectedHierarchy.type ? "bg-slate-50 font-medium" : ""
                        }`}
                        onClick={() => {
                          setSelectedHierarchy({ type: null, value: null, label: "All Staff" })
                          setExpandedDepartment(null)
                          setExpandedTeam(null)
                          setHierarchySearchQuery("")
                          setIsHierarchyDropdownOpen(false)
                        }}
                      >
                        <Users className="h-4 w-4 text-slate-500" />
                        <span>All Staff</span>
                      </button>
                      
                      {/* Departments */}
                      {filterHierarchyBySearch(hierarchySearchQuery).map((dept) => (
                        <div key={dept.id}>
                          <button
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center justify-between ${
                              selectedHierarchy.type === "department" && selectedHierarchy.value === dept.id ? "bg-slate-50 font-medium" : ""
                            }`}
                            onClick={() => {
                              if (expandedDepartment === dept.id) {
                                // Select department
                                setSelectedHierarchy({ type: "department", value: dept.id, label: dept.name })
                                setHierarchySearchQuery("")
                                setIsHierarchyDropdownOpen(false)
                              } else {
                                setExpandedDepartment(dept.id)
                                setExpandedTeam(null)
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-slate-500" />
                              <span>{dept.name}</span>
                            </div>
                            <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${expandedDepartment === dept.id ? "rotate-90" : ""}`} />
                          </button>
                          
                          {/* Teams within department */}
                          {expandedDepartment === dept.id && (
                            <div className="ml-4 border-l border-slate-200">
                              {dept.teams.map((team) => (
                                <div key={team.id}>
                                  <button
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center justify-between ${
                                      selectedHierarchy.type === "team" && selectedHierarchy.value === team.id ? "bg-slate-50 font-medium" : ""
                                    }`}
                                    onClick={() => {
                                      if (expandedTeam === team.id) {
                                        // Select team
                                        setSelectedHierarchy({ type: "team", value: team.id, label: team.name })
                                        setHierarchySearchQuery("")
                                        setIsHierarchyDropdownOpen(false)
                                      } else {
                                        setExpandedTeam(team.id)
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-slate-500" />
                                      <span>{team.name}</span>
                                    </div>
                                    <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${expandedTeam === team.id ? "rotate-90" : ""}`} />
                                  </button>
                                  
                                  {/* Staff within team */}
                                  {expandedTeam === team.id && (
                                    <div className="ml-4 border-l border-slate-200">
                                      {team.members.map((member) => (
                                        <button
                                          key={member.id}
                                          className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-2 ${
                                            selectedHierarchy.type === "staff" && selectedHierarchy.value === member.id ? "bg-slate-50 font-medium" : ""
                                          }`}
                                          onClick={() => {
                                            setSelectedHierarchy({ type: "staff", value: member.id, label: member.name })
                                            setHierarchySearchQuery("")
                                            setIsHierarchyDropdownOpen(false)
                                          }}
                                        >
                                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                                            {member.name.split(" ").map((n) => n[0]).join("")}
                                          </div>
                                          <span>{member.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {filterHierarchyBySearch(hierarchySearchQuery).length === 0 && (
                        <div className="px-3 py-2 text-sm text-slate-500 text-center">No results found</div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* View All button */}
                
              </div>
            </div>
            
            {/* Radio Button Filters - All / Unread / Unresponded */}
            {(() => {
              // Compute counts for each radio filter based on the currently selected tile
              const tileComms = selectedCommTile === "emails" ? emailComms
                : selectedCommTile === "sms" ? smsComms
                : selectedCommTile === "calls" ? callComms
                : baseFilteredCommunications

              const allCount = selectedCommTile === "calls"
                ? tileComms.filter(c => isUnresponded(c) || !c.read).length
                : tileComms.filter(isPending).length

              const unreadCount = tileComms.filter(c => !c.read).length

              const unrespondedCount = tileComms.filter(isUnresponded).length

              return (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="filter-all"
                      name="comm-filter"
                      checked={commSubFilter === "all"}
                      onChange={() => setCommSubFilter("all")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="filter-all" className="text-sm text-slate-700 cursor-pointer ml-1">
                      {"All "}
                      <span className="text-xs font-medium text-slate-500">({allCount})</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="filter-unread"
                      name="comm-filter"
                      checked={commSubFilter === "unread"}
                      onChange={() => setCommSubFilter("unread")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="filter-unread" className="text-sm text-slate-700 cursor-pointer ml-1">
                      {"Unread "}
                      <span className="text-xs font-medium text-slate-500">({unreadCount})</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="filter-unresponded"
                      name="comm-filter"
                      checked={commSubFilter === "unresponded"}
                      onChange={() => setCommSubFilter("unresponded")}
                      className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <label htmlFor="filter-unresponded" className="text-sm text-slate-700 cursor-pointer ml-1">
                      {"Unresponded "}
                      <span className="text-xs font-medium text-slate-500">({unrespondedCount})</span>
                    </label>
                  </div>
                </div>
              )
            })()}
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="max-h-[260px] overflow-y-auto pr-1">
            <div className="flex flex-col gap-2">
              {filteredCommunications.length > 0 ? (
                filteredCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    onClick={() => handleCommunicationClick(comm)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all hover:shadow-sm rounded-lg border"
                    style={{
                      backgroundColor: comm.type === "email" ? "#E6F4EA" : comm.type === "call" ? "#E0F7F6" : "#E3F2FD",
                      borderColor: comm.type === "email" ? "#c8e6cc" : comm.type === "call" ? "#b3e8e5" : "#BBDEFB",
                    }}
                  >
                    <div
                      className="p-2 rounded-full relative shrink-0"
                      style={{
                        backgroundColor: comm.type === "email" ? "#c8e6cc" : comm.type === "call" ? "#b3e8e5" : "#BBDEFB",
                      }}
                    >
                      {comm.type === "email" ? (
                        <Mail className="h-4 w-4 text-green-800" />
                      ) : comm.type === "call" ? (
                        <Phone className="h-4 w-4 text-teal-800" />
                      ) : comm.isGroupSms ? (
                        <Users className="h-4 w-4 text-blue-800" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-blue-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 w-[160px] shrink-0 min-w-0">
                        {!comm.read && <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0"></span>}
                        <p className="text-sm font-medium truncate text-slate-800">{comm.from}</p>
                        {comm.type === "text" && comm.isGroupSms && (
                          <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full shrink-0" title={`Group SMS: ${comm.groupParticipants?.join(", ")}`}>
                            Group
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate flex-1 min-w-0">{comm.preview}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">{comm.timestamp}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">{comm.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No communications found for {selectedStaff}
                </div>
              )}
            </div>
            </div>
          </CardContent>
        </Card>

        )}

        {/* Tasks Module - Full Width */}
        {dashboardTab === "tasks" && (
        <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded">
                    <CheckSquare className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base font-semibold text-slate-900">Tasks</CardTitle>
                </div>
                {/* Summary tiles - white background, black text */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <CheckSquare className="h-4.5 w-4.5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-slate-900 leading-none">{taskSummary.total}</span>
                      <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">Open</span>
                    </div>
                  </div>
                  {taskSummary.overdue > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <AlertCircle className="h-4.5 w-4.5 text-slate-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 leading-none">{taskSummary.overdue}</span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">Overdue</span>
                      </div>
                    </div>
                  )}
                  {taskSummary.dueToday > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Clock className="h-4.5 w-4.5 text-slate-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 leading-none">{taskSummary.dueToday}</span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">Today</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative ml-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by staff name..."
                    className="h-9 w-48 border-slate-200 bg-white"
                    value={tasksSearchQuery}
                    onChange={(e) => setTasksSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              {/* Action button - teal styling matching design */}
              <Button
                size="sm"
                className="h-9 px-4 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => nav.go("projects")}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
              <div className="max-h-[260px] overflow-y-auto">
                <Table>
                <TableHeader className="sticky top-0 z-10 bg-slate-50">
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-medium text-slate-700">Task</TableHead>
                    <TableHead className="font-medium text-slate-700">Related Entity</TableHead>
                    <TableHead className="font-medium text-slate-700">Due Date</TableHead>
                    <TableHead className="font-medium text-slate-700">Priority</TableHead>
                    <TableHead className="font-medium text-slate-700">Status</TableHead>
                    <TableHead className="font-medium text-slate-700">Assigned To</TableHead>
                    <TableHead className="font-medium text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-slate-50">
                        <TableCell className="py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-slate-800">{task.title}</span>
                            {task.processName && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleProcessClick(task)
                                }}
                                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 hover:underline w-fit"
                              >
                                <Workflow className="h-3 w-3" />
                                {task.processName}
                              </button>
                            )}
                            {task.autoCreated && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                                Auto-created
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{task.entity}</TableCell>
                        <TableCell>
                          <span className={`text-sm ${task.overdue ? "text-red-600 font-medium" : "text-slate-600"}`}>
                            {task.dueDate}
                            {task.overdue && <span className="ml-1.5 text-xs text-red-500">(Overdue)</span>}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium capitalize ${getPriorityStyles(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium ${getStatusStyles(task.status)}`}
                            onClick={task.status === "Skipped" ? () => handleSkippedClick(task) : undefined}
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{task.assignedTo}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTaskClick(task)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {task.status !== "Completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-500 hover:text-emerald-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No tasks found for {selectedStaff}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </div>
            

          </CardContent>
        </Card>

        )}

        {/* Combined Tab - merged communications and tasks sorted by time */}
        {dashboardTab === "combined" && (
        <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded">
                  <LayoutList className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">All Activity</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">{combinedItems.length} items</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <div className="flex flex-col gap-2">
                {combinedItems.length > 0 ? (
                  combinedItems.map((item) => {
                    if (item.kind === "comm") {
                      const comm = item.comm
                      return (
                        <div
                          key={`comm-${comm.id}`}
                          onClick={() => handleCommunicationClick(comm)}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all hover:shadow-sm rounded-lg border"
                          style={{
                            backgroundColor: comm.type === "email" ? "#E6F4EA" : comm.type === "call" ? "#E0F7F6" : "#E3F2FD",
                            borderColor: comm.type === "email" ? "#c8e6cc" : comm.type === "call" ? "#b3e8e5" : "#BBDEFB",
                          }}
                        >
                          <div
                            className="p-2 rounded-full relative shrink-0"
                            style={{
                              backgroundColor: comm.type === "email" ? "#c8e6cc" : comm.type === "call" ? "#b3e8e5" : "#BBDEFB",
                            }}
                          >
                            {comm.type === "email" ? (
                              <Mail className="h-4 w-4 text-green-800" />
                            ) : comm.type === "call" ? (
                              <Phone className="h-4 w-4 text-teal-800" />
                            ) : comm.isGroupSms ? (
                              <Users className="h-4 w-4 text-blue-800" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-blue-800" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-4">
                            <div className="flex items-center gap-1.5 w-[160px] shrink-0 min-w-0">
                              {!comm.read && <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0"></span>}
                              <p className="text-sm font-medium truncate text-slate-800">{comm.from}</p>
                              {comm.type === "text" && comm.isGroupSms && (
                                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full shrink-0">
                                  Group
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 truncate flex-1 min-w-0">{comm.preview}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] text-slate-500 whitespace-nowrap">{comm.timestamp}</span>
                              <span className="text-[11px] text-slate-400">•</span>
                              <span className="text-[11px] text-slate-500 whitespace-nowrap">{comm.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      const task = item.task
                      return (
                        <div
                          key={`task-${task.id}`}
                          onClick={() => handleTaskClick(task)}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all hover:shadow-sm rounded-lg border border-slate-200 bg-white"
                        >
                          <div className="p-2 rounded-full shrink-0 bg-slate-100">
                            <CheckSquare className="h-4 w-4 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-4">
                            <div className="flex flex-col gap-0.5 w-[200px] shrink-0 min-w-0">
                              <p className="text-sm font-medium truncate text-slate-800">{task.title}</p>
                              {task.processName && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleProcessClick(task) }}
                                  className="flex items-center gap-1 text-[10px] text-teal-600 hover:text-teal-700 hover:underline w-fit"
                                >
                                  <Workflow className="h-3 w-3" />
                                  {task.processName}
                                </button>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 truncate flex-1 min-w-0">{task.entity}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[11px] whitespace-nowrap ${task.overdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                                {task.dueDate}{task.overdue && " (Overdue)"}
                              </span>
                              <Badge variant="outline" className={`text-[10px] font-medium capitalize ${getPriorityStyles(task.priority)}`}>
                                {task.priority}
                              </Badge>
                              <Badge variant="outline" className={`text-[10px] font-medium ${getStatusStyles(task.status)}`}>
                                {task.status}
                              </Badge>
                              <span className="text-[11px] text-slate-500 whitespace-nowrap">{task.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No activity found
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* KPI Dashboard */}
        <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
          <CardHeader className="pb-2 pt-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-slate-900">Key Performance Metrics</CardTitle>
                    <p className="text-xs text-slate-500">
                      {userRole === "associate"
                        ? "Your Performance"
                        : userRole === "manager"
                          ? "Team Performance"
                          : "Organization Overview"}
                    </p>
                  </div>
                </div>
                {/* KPI summary badges - white background, black text */}
                <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                    <TrendingUp className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">32% Conv. Rate</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                    <ArrowUpRight className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">48 New Leads</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200">
                    <Target className="h-5 w-5 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-900">94% Occupancy</span>
                  </div>
                </div>
                <div className="relative ml-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by staff name..."
                    className="h-9 w-48 border-slate-200 bg-white"
                    value={kpisSearchQuery}
                    onChange={(e) => setKpisSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={kpiView === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setKpiView("table")}
                  className={kpiView === "table" ? "bg-slate-800 hover:bg-slate-900" : ""}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-list h-4 w-4 mr-1"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                    <path d="M14 4h7"></path>
                    <path d="M14 9h7"></path>
                    <path d="M14 15h7"></path>
                    <path d="M14 20h7"></path>
                  </svg>
                  Grid
                </Button>
                <Button
                  variant={kpiView === "chart" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setKpiView("chart")}
                  className={kpiView === "chart" ? "bg-slate-800 hover:bg-slate-900" : ""}
                >
                  <LineChart className="h-4 w-4 mr-1" />
                  Chart
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {/* Search bar for KPIs */}
            <div className="relative flex items-center gap-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by staff name..."
                className="w-full pl-9 h-9 border-slate-200"
                value={kpisSearchQuery}
                onChange={(e) => setKpisSearchQuery(e.target.value)}
              />
            </div>

            {/* Sales KPIs - neutral grey */}
            <KPISection
              title="Sales KPIs"
              color="slate"
              icon={<TrendingUp className="h-4 w-4" />}
              expanded={expandedKpiSection === "sales"}
              onToggle={() => setExpandedKpiSection(expandedKpiSection === "sales" ? null : "sales")}
              view={kpiView}
              tableData={[
                { label: "New Leads", value: kpiData.sales.newLeads, trend: "+12%" },
                { label: "Conversion Rate", value: `${kpiData.sales.conversionRate}%`, trend: "+3%" },
                { label: "New Unit Additions", value: kpiData.sales.newUnitAdditions, trend: "+5%" },
                { label: "Avg Response Time", value: kpiData.sales.avgResponseTime, trend: "-15%" },
              ]}
              chartData={kpiData.sales.history}
              chartKeys={["leads", "conversion"]}
              searchQuery={kpisSearchQuery}
            />

            {/* Leasing KPIs - neutral grey */}
            <KPISection
              title="Leasing KPIs"
              color="slate"
              icon={<FileKey className="h-4 w-4" />}
              expanded={expandedKpiSection === "leasing"}
              onToggle={() => setExpandedKpiSection(expandedKpiSection === "leasing" ? null : "leasing")}
              view={kpiView}
              tableData={[
                { label: "New Leads", value: kpiData.leasing.newLeads, trend: "+8%" },
                { label: "Conversion Rate", value: `${kpiData.leasing.conversionRate}%`, trend: "+2%" },
                { label: "New Applications", value: kpiData.leasing.newApplications, trend: "+15%" },
                { label: "New Leases Signed", value: kpiData.leasing.newLeasesSigned, trend: "+10%" },
                { label: "Avg Days on Market", value: kpiData.leasing.avgDaysOnMarket, trend: "-8%" },
                { label: "Avg Response Time", value: kpiData.leasing.avgResponseTime, trend: "-12%" },
              ]}
              chartData={kpiData.leasing.history}
              chartKeys={["leads", "leases"]}
              searchQuery={kpisSearchQuery}
            />

            {/* Operations KPIs - neutral grey */}
            <KPISection
              title="Operations KPIs"
              color="slate"
              icon={<Settings2 className="h-4 w-4" />}
              expanded={expandedKpiSection === "operations"}
              onToggle={() => setExpandedKpiSection(expandedKpiSection === "operations" ? null : "operations")}
              view={kpiView}
              tableData={[
                { label: "Total Units", value: kpiData.operations.totalUnits, trend: "+3%" },
                { label: "Churn Rate", value: `${kpiData.operations.churnRate}%`, trend: "-2%" },
                { label: "Occupancy Rate", value: `${kpiData.operations.occupancyRate}%`, trend: "+1%" },
                { label: "Rent Collections", value: `${kpiData.operations.rentCollections}%`, trend: "+0.5%" },
                { label: "Leases Renewed", value: kpiData.operations.leasesRenewed, trend: "+12%" },
                { label: "Open Complaints", value: kpiData.operations.openComplaints, trend: "-18%" },
                { label: "Open Terminations", value: kpiData.operations.openTerminations, trend: "-25%" },
                { label: "New Work Orders", value: kpiData.operations.newWorkOrders, trend: "+5%" },
                { label: "Completed Work Orders", value: kpiData.operations.completedWorkOrders, trend: "+8%" },
                { label: "Avg Response Time", value: kpiData.operations.avgResponseTime, trend: "-10%" },
              ]}
              chartData={kpiData.operations.history}
              chartKeys={["occupancy", "collections"]}
              searchQuery={kpisSearchQuery}
            />

            {/* Maintenance KPIs - neutral grey */}
            <KPISection
              title="Maintenance KPIs"
              color="slate"
              icon={<Wrench className="h-4 w-4" />}
              expanded={expandedKpiSection === "maintenance"}
              onToggle={() => setExpandedKpiSection(expandedKpiSection === "maintenance" ? null : "maintenance")}
              view={kpiView}
              tableData={[
                { label: "Inspection Speed", value: kpiData.maintenance.inspectionSpeed, trend: "-20%" },
                { label: "Make-Ready Speed", value: kpiData.maintenance.makeReadySpeed, trend: "-15%" },
                {
                  label: "Make-Ready Conversion",
                  value: `${kpiData.maintenance.makeReadyConversionRate}%`,
                  trend: "+5%",
                },
                { label: "Avg Response Time", value: kpiData.maintenance.avgResponseTime, trend: "-8%" },
              ]}
              chartData={kpiData.maintenance.history}
              chartKeys={["inspectionDays", "makeReadyDays"]}
              searchQuery={kpisSearchQuery}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCommunicationModal} onOpenChange={(open) => {
        setShowCommunicationModal(open)
        if (!open) {
          setLocalConversationHistory([])
        }
      }}>
        <DialogContent className={selectedCommunication?.type === "call" ? "sm:max-w-[500px]" : "sm:max-w-[600px] max-h-[85vh] flex flex-col"}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  selectedCommunication?.isGroupSms
                    ? "bg-purple-100"
                    : selectedCommunication?.type === "email"
                      ? "bg-blue-100"
                      : selectedCommunication?.type === "call"
                        ? "bg-green-100"
                        : "bg-slate-100"
                }`}
              >
                {selectedCommunication?.isGroupSms ? (
                  <Users className={`h-5 w-5 text-purple-600`} />
                ) : selectedCommunication?.type === "email" ? (
                  <Mail className={`h-5 w-5 text-blue-600`} />
                ) : selectedCommunication?.type === "call" ? (
                  <Phone className={`h-5 w-5 text-green-600`} />
                ) : (
                  <MessageSquare className={`h-5 w-5 text-slate-600`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg">{selectedCommunication?.from}</DialogTitle>
                  {selectedCommunication?.isGroupSms && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      Group SMS
                    </span>
                  )}
                </div>
                <DialogDescription className="text-sm">
                  {selectedCommunication?.isGroupSms 
                    ? `Group SMS • ${selectedCommunication?.groupParticipants?.slice(0, 3).join(", ")}${selectedCommunication?.groupParticipants && selectedCommunication.groupParticipants.length > 3 ? ` +${selectedCommunication.groupParticipants.length - 3} more` : ""}`
                    : selectedCommunication?.type === "email"
                      ? "Email Thread"
                      : selectedCommunication?.type === "call"
                        ? "Phone Call"
                        : "Text Message"}{" "}
                  • {selectedCommunication?.timestamp}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Assigned to: {selectedCommunication?.assignedTo}</span>
                {!selectedCommunication?.read && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">
                    Unread
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>
          
          {/* Unified Communication Thread View - Shows SMS, Emails, and Calls in chronological order */}
          <div className="flex-1 flex flex-col min-h-0 mt-4">
            {/* Thread Timeline - Scrollable */}
            <div className="flex-1 overflow-y-auto max-h-[350px] space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              {unifiedThread.length > 0 ? (
                unifiedThread.map((item) => {
                  // Email Item - Collapsible
                  if (item.type === "email") {
                    const isExpanded = expandedEmails.has(item.id)
                    return (
                      <div
                        key={`email-${item.id}`}
                        className={`rounded-lg border transition-all ${
                          item.direction === "outgoing" ? "ml-4" : ""
                        }`}
                        style={{ backgroundColor: "#E6F4EA", borderColor: "#c8e6cc" }}
                      >
                        {/* Email Header - Always visible, clickable to expand */}
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedEmails(prev => {
                              const newSet = new Set(prev)
                              if (newSet.has(item.id)) {
                                newSet.delete(item.id)
                              } else {
                                newSet.add(item.id)
                              }
                              return newSet
                            })
                          }}
                          className="w-full p-3 flex items-center justify-between text-left rounded-t-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full" style={{ backgroundColor: "#c8e6cc" }}>
                              <Mail className="h-3.5 w-3.5 text-green-800" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-800">{item.sender}</p>
                                {item.direction === "outgoing" && (
                                  <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Sent</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{item.subject || "Email"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                              {item.direction === "outgoing" && item.openedAt && (
                                <p className="text-[9px] text-green-600">Opened: {item.openedAt}</p>
                              )}
                            </div>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </div>
                        </button>
                        {/* Email Body - Collapsible */}
                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-slate-100">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap mt-2">{item.message}</p>
                            {/* Email Attachments */}
                            {item.attachments && item.attachments.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-slate-100">
                                <p className="text-[10px] text-slate-500 mb-1.5">Attachments ({item.attachments.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.attachments.map((attachment, idx) => (
                                    <div 
                                      key={idx}
                                      className="flex items-center gap-1.5 bg-slate-100 rounded-md px-2 py-1.5 text-xs hover:bg-slate-200 cursor-pointer transition-colors"
                                    >
                                      <Paperclip className="h-3 w-3 text-slate-500" />
                                      <span className="text-slate-700 max-w-[150px] truncate">{attachment.name}</span>
                                      <span className="text-slate-400 text-[10px]">({attachment.size})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  }
                  
                  // SMS/Text Item
                  if (item.type === "text") {
                    return (
                      <div
                        key={`sms-${item.id}`}
                        className={`flex ${item.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 border`}
                          style={{
                            backgroundColor: "#FFE8CC",
                            borderColor: "#f5d5a8",
                            color: "#1e293b",
                          }}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageSquare className="h-3 w-3 text-orange-700" />
                            <span className="text-[10px] text-orange-700">SMS</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                          {/* SMS Attachments */}
                          {item.attachments && item.attachments.length > 0 && (
                            <div className="mt-2 pt-2" style={{ borderTop: "1px solid #f5d5a8" }}>
                              <div className="flex flex-wrap gap-1.5">
                                {item.attachments.map((attachment, idx) => (
                                  <div 
                                    key={idx}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs cursor-pointer transition-colors text-orange-900"
                                    style={{ backgroundColor: "#f5d5a8" }}
                                  >
                                    <Paperclip className="h-3 w-3" />
                                    <span className="max-w-[100px] truncate">{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div
                            className="flex items-center gap-2 mt-1 text-[10px] text-orange-800/70"
                          >
                            <span>{item.sender}</span>
                            <span>•</span>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  
                  // Call Log Item
                  if (item.type === "call") {
                    return (
                      <div
                        key={`call-${item.id}`}
                        className="rounded-lg border p-3"
                        style={{ backgroundColor: "#E0F7F6", borderColor: "#b3e8e5" }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 rounded-full mt-0.5" style={{ backgroundColor: "#b3e8e5" }}>
                            <Phone className="h-3.5 w-3.5 text-teal-800" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-800">{item.sender}</p>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                  item.direction === "incoming" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  {item.direction === "incoming" ? "Incoming" : "Outgoing"}
                                </span>
                                {item.duration && (
                                  <span className="text-[10px] text-slate-500">({item.duration})</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                            </div>
                            {item.notes && (
                              <p className="text-sm text-slate-600 mt-1">{item.notes}</p>
                            )}
                            {!item.notes && item.message && (
                              <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                            )}
                            <p className="text-[10px] text-blue-600 mt-1 cursor-pointer hover:underline">
                              Click to view full call details in RingCentral
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  
                  return null
                })
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedCommunication?.fullMessage || selectedCommunication?.preview}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {selectedCommunication?.from} • {selectedCommunication?.timestamp}
                  </div>
                </div>
              )}
              <div ref={unifiedThreadEndRef} />
            </div>

            {/* Reply Composer Section */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Reply</Label>
                {/* Channel Selector */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setReplyChannel("email")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      replyChannel === "email" 
                        ? "bg-white text-slate-800 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyChannel("sms")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      replyChannel === "sms" 
                        ? "bg-white text-slate-800 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <MessageSquare className="h-3 w-3" />
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRingCentralNotification(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  >
                    <Phone className="h-3 w-3" />
                    Call
                  </button>
                </div>
              </div>
              
              {/* Email Composer UI */}
              {replyChannel === "email" && (
                <div className="border rounded-lg overflow-hidden bg-white">
                  {/* To Field */}
                  <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                    <Label className="text-xs text-slate-500 w-8 shrink-0">To</Label>
                    <input
                      type="text"
                      value={selectedCommunication?.from || ""}
                      readOnly
                      className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCcBcc(!showCcBcc)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      {showCcBcc ? "Hide" : "Cc Bcc"}
                    </button>
                  </div>
                  {/* CC/BCC Fields */}
                  {showCcBcc && (
                    <>
                      <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                        <Label className="text-xs text-slate-500 w-8 shrink-0">Cc</Label>
                        <input
                          type="text"
                          placeholder="Enter CC email addresses"
                          value={emailCc}
                          onChange={(e) => setEmailCc(e.target.value)}
                          className="flex-1 text-sm bg-transparent border-none outline-none"
                        />
                      </div>
                      <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                        <Label className="text-xs text-slate-500 w-8 shrink-0">Bcc</Label>
                        <input
                          type="text"
                          placeholder="Enter BCC email addresses"
                          value={emailBcc}
                          onChange={(e) => setEmailBcc(e.target.value)}
                          className="flex-1 text-sm bg-transparent border-none outline-none"
                        />
                      </div>
                    </>
                  )}
                  {/* Subject Field */}
                  <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                    <Label className="text-xs text-slate-500 w-14 shrink-0">Subject</Label>
                    <input
                      type="text"
                      placeholder="Enter subject"
                      value={emailReplySubject}
                      onChange={(e) => setEmailReplySubject(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none"
                    />
                  </div>
                  {/* Email Body */}
                  <textarea
                    placeholder="Compose email..."
                    value={emailReplyText}
                    onChange={(e) => setEmailReplyText(e.target.value)}
                    className="w-full min-h-[120px] p-3 text-sm resize-none focus:outline-none bg-white border-none"
                  />
                  {/* Attachments Preview */}
                  {emailAttachments.length > 0 && (
                    <div className="px-3 pb-2 flex flex-wrap gap-2">
                      {emailAttachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-xs">
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setEmailAttachments((prev) => prev.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Formatting Toolbar */}
                  <div className="flex items-center justify-between border-t border-slate-200 px-2 py-1.5">
                    <div className="flex items-center gap-0.5">
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Formatting options">
                        <Type className="h-4 w-4" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Bold">
                        <Bold className="h-4 w-4" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Italic">
                        <Italic className="h-4 w-4" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Underline">
                        <Underline className="h-4 w-4" />
                      </button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert link">
                        <Link className="h-4 w-4" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert emoji">
                        <Smile className="h-4 w-4" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert image">
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <label className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer" title="Attach file">
                        <Paperclip className="h-4 w-4" />
                        <input
                          ref={emailFileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              setEmailAttachments(prev => [...prev, ...Array.from(e.target.files!)])
                            }
                          }}
                        />
                      </label>
                      <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="More options">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Discard">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* SMS Reply UI (unchanged) */}
              {replyChannel !== "email" && (
                <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
                  <textarea
                    placeholder="Type your SMS reply..."
                    value={smsReplyText}
                    onChange={(e) => setSmsReplyText(e.target.value)}
                    className="w-full min-h-[80px] p-3 text-sm resize-none focus:outline-none bg-background"
                  />
                  {/* SMS Attachments Preview */}
                  {smsAttachments.length > 0 && (
                    <div className="px-3 pb-2 flex flex-wrap gap-2">
                      {smsAttachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-xs">
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setSmsAttachments((prev) => prev.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                
                {/* SMS Attachment Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={smsFileInputRef}
                      onChange={(e) => {
                        const files = e.target.files
                        if (files) {
                          setSmsAttachments((prev) => [...prev, ...Array.from(files)])
                        }
                        if (smsFileInputRef.current) {
                          smsFileInputRef.current.value = ""
                        }
                      }}
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground bg-transparent"
                      onClick={() => smsFileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4 mr-1" />
                      <span className="text-xs">Attach files</span>
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {smsReplyText.length} characters
                  </span>
                </div>
              </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="bg-transparent" onClick={() => {
              setShowCommunicationModal(false)
              setSmsReplyText("")
              setSmsAttachments([])
              setLocalConversationHistory([])
              setEmailReplyText("")
              setEmailAttachments([])
              setLocalEmailHistory([])
              setUnifiedThread([])
              setExpandedEmails(new Set())
              setEmailCc("")
              setEmailBcc("")
              setShowCcBcc(false)
            }}>
              Close
            </Button>
            {/* Unified Reply Button - works with channel selector */}
            <Button 
              onClick={() => {
                const currentReplyText = replyChannel === "email" ? emailReplyText : smsReplyText
                const currentAttachments = replyChannel === "email" ? emailAttachments : smsAttachments
                
                if (currentReplyText.trim() || currentAttachments.length > 0) {
                  const timestamp = new Date().toLocaleString("en-US", { 
                    year: "numeric", 
                    month: "2-digit", 
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true 
                  })
                  
                  const newItem = {
                    id: unifiedThread.length + 1,
                    type: replyChannel as "email" | "text",
                    sender: selectedCommunication?.assignedTo || "Staff",
                    direction: "outgoing" as const,
                    subject: replyChannel === "email" ? `Re: ${selectedCommunication?.preview?.substring(0, 30)}...` : undefined,
                    message: currentReplyText + (currentAttachments.length > 0 ? `\n\n[${currentAttachments.length} attachment(s)]` : ""),
                    timestamp: timestamp,
                  }
                  
                  // Add to unified thread
                  setUnifiedThread(prev => [...prev, newItem])
                  
                  // If it's an email, auto-expand it
                  if (replyChannel === "email") {
                    setExpandedEmails(prev => new Set([...prev, newItem.id]))
                  }
                  
                  // Clear the appropriate inputs
                  if (replyChannel === "email") {
                    setEmailReplyText("")
                    setEmailAttachments([])
                  } else {
                    setSmsReplyText("")
                    setSmsAttachments([])
                  }
                  
                  // Auto-scroll to the new message
                  setTimeout(() => {
                    unifiedThreadEndRef.current?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }
              }}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={
                (replyChannel === "email" && !emailReplyText.trim() && emailAttachments.length === 0) ||
                (replyChannel === "sms" && !smsReplyText.trim() && smsAttachments.length === 0)
              }
            >
              <Send className="h-4 w-4 mr-2" />
              Send {replyChannel === "email" ? "Email" : "SMS"}
            </Button>
            <Button onClick={handleViewCommunicationDetails} className="bg-teal-600 hover:bg-teal-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skipped Task Modal */}
      <Dialog open={showSkippedModal} onOpenChange={setShowSkippedModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <X className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-lg">Task Skipped</DialogTitle>
                <DialogDescription className="text-sm">
                  {selectedSkippedTask?.title}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-500 mb-1 font-medium">Staff Comment:</p>
              <p className="text-sm text-slate-700">
                {selectedSkippedTask?.skippedComment}
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSkippedModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* RingCentral Call Notification */}
      <Dialog open={showRingCentralNotification} onOpenChange={setShowRingCentralNotification}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-green-100">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <DialogTitle>Continue in RingCentral</DialogTitle>
                <DialogDescription className="mt-1">
                  Phone calls are handled through RingCentral
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-700">
                To call <span className="font-medium">{selectedCommunication?.from}</span>, you will be redirected to RingCentral where you can initiate the call.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Make sure you are logged into RingCentral to complete this action.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="bg-transparent" onClick={() => setShowRingCentralNotification(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // In a real app, this would open RingCentral or initiate a call
                setShowRingCentralNotification(false)
                // Could add: window.open('ringcentral://call?number=...', '_blank')
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              Open RingCentral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// KPI Section Component
function KPISection({
  title,
  color,
  icon,
  expanded,
  onToggle,
  view,
  tableData,
  chartData,
  chartKeys,
  searchQuery, // Added searchQuery prop
}: {
  title: string
  color: string
  icon: React.ReactNode
  expanded: boolean
  onToggle: () => void
  view: "table" | "chart"
  tableData: { label: string; value: string | number; trend: string }[]
  chartData: { month: string; [key: string]: string | number }[]
  chartKeys: string[]
  searchQuery: string // Added searchQuery type
}) {
  const colorStyles: Record<string, { bg: string; border: string; text: string; light: string }> = {
    emerald: { bg: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-700", light: "bg-emerald-50" },
    blue: { bg: "bg-blue-500", border: "border-blue-200", text: "text-blue-700", light: "bg-blue-50" },
    amber: { bg: "bg-amber-500", border: "border-amber-200", text: "text-amber-700", light: "bg-amber-50" },
    purple: { bg: "bg-purple-500", border: "border-purple-200", text: "text-purple-700", light: "bg-purple-50" },
    slate: { bg: "bg-slate-800", border: "border-slate-200", text: "text-slate-900", light: "bg-slate-50" },
  }

  const styles = colorStyles[color] || colorStyles.emerald

  const filteredTableData = tableData.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.value).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trend.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={`rounded-lg border ${styles.border} overflow-hidden`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 ${styles.light} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-2">
          <div className={`p-1.5 ${styles.bg} rounded text-white`}>{icon}</div>
          <span className={`text-sm font-semibold ${styles.text}`}>{title}</span>
        </div>
        <ChevronDown className={`h-4 w-4 ${styles.text} transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="p-3 bg-white">
          {view === "table" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {filteredTableData.map((item) => (
                <div key={item.label} className="p-2 rounded border border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="text-lg font-bold text-slate-800">{item.value}</p>
                  <p
                    className={`text-xs font-medium ${item.trend.startsWith("+") ? (item.label.includes("Churn") || item.label.includes("Complaint") || item.label.includes("Termination") || item.label.includes("Time") || item.label.includes("Days") ? "text-red-500" : "text-emerald-500") : item.label.includes("Churn") || item.label.includes("Complaint") || item.label.includes("Termination") || item.label.includes("Time") || item.label.includes("Days") ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {item.trend}
                  </p>
                </div>
              ))}
              {filteredTableData.length === 0 && (
                <div className="col-span-full text-center py-4 text-slate-500">No KPIs found matching your search.</div>
              )}
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {chartKeys.map((key, idx) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={idx === 0 ? "#10b981" : "#6366f1"}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// =====================
// Main Export
// =====================

interface DashboardAppProps {
  onLogout: () => void
}

export default function DashboardApp({ onLogout }: DashboardAppProps) {
  return (
    <NavProvider onLogout={onLogout}>
      <AppLayout />
    </NavProvider>
  )
}
