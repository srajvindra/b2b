"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Mail, Phone, Calendar, Eye, UserX, UserCheck } from "lucide-react"
import { LoadMorePagination } from "@/components/shared/LoadMorePagination"
import { STAFF_MEMBERS_DATA } from "../data/staffMembers"

function getRoleBadgeColor(role: string): string {
  const roleColors: Record<string, string> = {
    "Property Manager": "bg-slate-700 text-white",
    "Leasing Agent": "bg-teal-600 text-white",
    Admin: "bg-slate-800 text-white",
    "Maintenance Coordinator": "bg-slate-600 text-white",
    Accountant: "bg-slate-500 text-white",
  }
  return roleColors[role] ?? "bg-primary text-primary-foreground"
}

export function StaffMemberTab() {
  const [staffMembers, setStaffMembers] = useState(STAFF_MEMBERS_DATA)
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)

  const handleStatusToggle = (staffId: string) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === staffId
          ? { ...staff, status: staff.status === "Active" ? "Inactive" : "Active" }
          : staff
      )
    )
  }

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(staffSearchQuery.toLowerCase())
  )

  const paginatedStaff = filteredStaff.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(10)
  }, [staffSearchQuery])

  return (
    <div className="space-y-4">
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, email, or role..."
              className="pl-10"
              value={staffSearchQuery}
              onChange={(e) => setStaffSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Staff Member</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Date Added</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStaff.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{staff.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{staff.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {staff.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {staff.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(staff.role)}>{staff.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {staff.dateAdded}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      staff.status === "Active"
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-muted-foreground text-muted-foreground"
                    }
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/settings/staff/${staff.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusToggle(staff.id)}>
                        {staff.status === "Active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Terminate Access
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Resume Access
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredStaff.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p>No staff members found matching your search.</p>
          </div>
        )}
      </Card>
      <LoadMorePagination
        total={filteredStaff.length}
        visibleCount={visibleCount}
        label="staff members"
        onLoadMore={() => setVisibleCount((prev) => Math.min(prev + 10, filteredStaff.length))}
      />
    </div>
  )
}
