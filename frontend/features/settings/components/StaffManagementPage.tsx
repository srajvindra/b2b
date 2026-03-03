"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"
import { StaffMemberTab } from "./StaffMemberTab"
import { PortfolioTab } from "./PortfolioTab"
import { STAFF_MEMBERS_DATA } from "../data/staffMembers"
import { INITIAL_CSR_DATA } from "../data/portfolio"

export function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState("staff-members")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground text-sm">Manage team members and portfolio assignments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="border-b border-border">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab("staff-members")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "staff-members" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              Staff Members
              <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-muted">
                {STAFF_MEMBERS_DATA.length}
              </Badge>
            </span>
            {activeTab === "staff-members" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "portfolio" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              Portfolio
              <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-muted">
                {INITIAL_CSR_DATA.length}
              </Badge>
            </span>
            {activeTab === "portfolio" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {activeTab === "staff-members" && <StaffMemberTab />}
      {activeTab === "portfolio" && <PortfolioTab />}
    </div>
  )
}
