"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { CSRPortfolio } from "../types"
import { PORTFOLIO_STAFF } from "../data/staffMembers"
import { ROLE_COLUMNS, INITIAL_CSR_DATA } from "../data/portfolio"

function StaffSelectorCell({
  currentStaffId,
  onSelect,
}: {
  currentStaffId: string | null
  onSelect: (staffId: string | null) => void
}) {
  const selectedStaff = currentStaffId ? PORTFOLIO_STAFF.find((s) => s.id === currentStaffId) : null

  return (
    <Select value={currentStaffId ?? "unassigned"} onValueChange={(value) => onSelect(value === "unassigned" ? null : value)}>
      <SelectTrigger className="w-full min-w-[140px] h-9 border-border bg-background hover:bg-muted focus:ring-1 focus:ring-ring">
        {selectedStaff ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedStaff.avatar || "/placeholder.svg"} alt={selectedStaff.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {selectedStaff.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground truncate">{selectedStaff.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Select user</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">
          <span className="text-muted-foreground">Select user</span>
        </SelectItem>
        {PORTFOLIO_STAFF.map((staff) => (
          <SelectItem key={staff.id} value={staff.id}>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{staff.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{staff.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function PortfolioTab() {
  const [csrData, setCsrData] = useState<CSRPortfolio[]>(INITIAL_CSR_DATA)
  const [portfolioSearchQuery, setPortfolioSearchQuery] = useState("")

  const handleAssignmentChange = (csrId: string, role: string, staffId: string | null) => {
    setCsrData((prev) =>
      prev.map((csr) =>
        csr.id === csrId
          ? {
              ...csr,
              assignments: {
                ...csr.assignments,
                [role]: staffId,
              },
            }
          : csr
      )
    )
  }

  const filteredCSRs = csrData.filter((csr) =>
    csr.name.toLowerCase().includes(portfolioSearchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search CSR portfolios..."
              className="pl-10"
              value={portfolioSearchQuery}
              onChange={(e) => setPortfolioSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="sticky left-0 z-10 bg-muted px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px] border-r border-border">
                  CSR Portfolio
                </th>
                {ROLE_COLUMNS.map((role) => (
                  <th
                    key={role}
                    className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[160px]"
                  >
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCSRs.map((csr, index) => (
                <tr
                  key={csr.id}
                  className={`border-b border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/50"}`}
                >
                  <td
                    className={`sticky left-0 z-10 px-4 py-3 font-medium text-foreground min-w-[200px] border-r border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">=</span>
                      <span>{csr.name}</span>
                    </div>
                  </td>
                  {ROLE_COLUMNS.map((role) => (
                    <td key={role} className="px-3 py-2">
                      <StaffSelectorCell
                        currentStaffId={csr.assignments[role]}
                        onSelect={(staffId) => handleAssignmentChange(csr.id, role, staffId)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCSRs.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p>No CSR portfolios found matching your search.</p>
          </div>
        )}
      </Card>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredCSRs.length} of {csrData.length} CSR portfolios
        </span>
        <span>{ROLE_COLUMNS.length} roles configured</span>
      </div>
    </div>
  )
}
