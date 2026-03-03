"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileCheck, Plus, Search, MoreVertical, Pencil, Trash2, Copy, Eye, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Form {
  id: string
  name: string
  category: string
  status: "active" | "draft"
  responses: number
  lastModified: string
}

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [forms] = useState<Form[]>([
    {
      id: "1",
      name: "Rental Application",
      category: "Leasing",
      status: "active",
      responses: 234,
      lastModified: "1 week ago",
    },
    {
      id: "2",
      name: "Maintenance Request",
      category: "Maintenance",
      status: "active",
      responses: 567,
      lastModified: "2 days ago",
    },
    {
      id: "3",
      name: "Move-In Inspection",
      category: "Inspection",
      status: "active",
      responses: 89,
      lastModified: "3 days ago",
    },
    {
      id: "4",
      name: "Pet Agreement",
      category: "Lease",
      status: "active",
      responses: 45,
      lastModified: "1 week ago",
    },
    {
      id: "5",
      name: "Tenant Feedback Survey",
      category: "Survey",
      status: "draft",
      responses: 0,
      lastModified: "5 days ago",
    },
  ])

  const filteredForms = forms.filter((form) => form.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Forms</h1>
            <p className="text-sm text-muted-foreground">Create and manage digital forms</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Form
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Forms Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{form.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {form.category}
                      </Badge>
                      <Badge variant={form.status === "active" ? "default" : "outline"} className="text-xs">
                        {form.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Responses
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Modified {form.lastModified}</span>
                <span>{form.responses} responses</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
