"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  Filter,
  ListTodo,
  Plus,
  RefreshCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  UserPlus,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { useAppStore } from "@/store/useAppStore"

const seedUser = {
  name: "Nina Patel",
  email: "csr.nina@heropm.com",
  role: "Super Admin",
}

export function Topbar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  const runSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return
    toast({ title: "AI Search", description: `Interpreted: ${query}` })
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-card/95 backdrop-blur">
      <div className="px-4 py-3 flex items-center gap-3">
        <div className={`flex items-center gap-2 ${collapsed ? "w-[72px]" : "w-[208px]"} transition-all shrink-0`}>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <img
              src="/images/logo.png"
              alt="HERO PM"
              className={`${collapsed ? "h-8 w-8" : "h-10 w-auto"} object-contain transition-all`}
            />
            {!collapsed && <span className="font-semibold">HERO PM</span>}
          </Link>
        </div>

        <form onSubmit={runSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

        <Button variant="ghost" size="icon" title="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Sync">
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
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ title: `Role: ${seedUser.role}` })}>
              Role: {seedUser.role}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
