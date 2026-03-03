"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, MoreVertical, Pencil, Trash2, Copy, Download, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Letter {
  id: string
  name: string
  category: string
  lastModified: string
  usedCount: number
}

export default function LettersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [letters] = useState<Letter[]>([
    {
      id: "1",
      name: "Lease Renewal Notice",
      category: "Lease",
      lastModified: "2 days ago",
      usedCount: 45,
    },
    {
      id: "2",
      name: "Welcome Letter",
      category: "Onboarding",
      lastModified: "1 week ago",
      usedCount: 128,
    },
    {
      id: "3",
      name: "Late Payment Notice",
      category: "Payment",
      lastModified: "3 days ago",
      usedCount: 23,
    },
    {
      id: "4",
      name: "Move-Out Instructions",
      category: "Move-Out",
      lastModified: "5 days ago",
      usedCount: 67,
    },
    {
      id: "5",
      name: "Maintenance Request Confirmation",
      category: "Maintenance",
      lastModified: "1 day ago",
      usedCount: 89,
    },
  ])

  const filteredLetters = letters.filter((letter) => letter.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Letters</h1>
            <p className="text-sm text-muted-foreground">Manage letter templates</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Letter
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search letters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Letters Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{letter.name}</h3>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {letter.category}
                    </Badge>
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
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Modified {letter.lastModified}</span>
                <span>{letter.usedCount} uses</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
