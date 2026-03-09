"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Users, ClipboardList, Home, Mail, Phone, Calendar } from "lucide-react"
import type { StaffMember } from "../types"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"

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

export interface StaffMemberDetailPageProps {
  staff: StaffMember
}

export function StaffMemberDetailPage({ staff }: StaffMemberDetailPageProps) {
  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
        <Link href="/settings/staff">
          <ArrowLeft className="h-4 w-4" />
          Back to Staff Members
        </Link>
      </Button>

      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={staff.avatar || "/placeholder.svg"} alt={staff.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{staff.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{staff.name}</h2>
                <Badge className={getRoleBadgeColor(staff.role)}>{staff.role}</Badge>
                <Badge variant={staff.status === "Active" ? "outline" : "secondary"} className={staff.status === "Active" ? "border-green-500 text-green-600" : ""}>
                  {staff.status}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {staff.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {staff.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Added: {staff.dateAdded}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.ownersHandling.length}</p>
                <p className="text-sm text-muted-foreground">Owners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-teal-100">
                <Home className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.tenantsHandling.length}</p>
                <p className="text-sm text-muted-foreground">Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.propertiesManaging.length}</p>
                <p className="text-sm text-muted-foreground">Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <ClipboardList className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{staff.tasksAssigned.length}</p>
                <p className="text-sm text-muted-foreground">Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Owners Handling
            </h3>
            {staff.ownersHandling.length > 0 ? (
              <div className="space-y-2">
                {staff.ownersHandling.map((owner) => (
                  <div key={owner.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {owner.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{owner.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No owners assigned</p>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Home className="h-4 w-4 text-teal-600" />
              Tenants Handling
            </h3>
            {staff.tenantsHandling.length > 0 ? (
              <div className="space-y-2">
                {staff.tenantsHandling.map((tenant) => (
                  <div key={tenant.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                        {tenant.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{tenant.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tenants assigned</p>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Properties Managing
            </h3>
            {staff.propertiesManaging.length > 0 ? (
              <div className="space-y-2">
                {staff.propertiesManaging.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">{property.name}</span>
                    <Badge variant="secondary">{property.units} units</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No properties assigned</p>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-amber-600" />
              Tasks Assigned
            </h3>
            {staff.tasksAssigned.length > 0 ? (
              <div className="space-y-2">
                {staff.tasksAssigned.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">{task.title}</span>
                    <Badge
                      variant="outline"
                      className={
                        task.status === "Completed" ? "border-green-500 text-green-600" :
                          task.status === "In Progress" ? "border-blue-500 text-blue-600" :
                            task.status === "Urgent" ? "border-red-500 text-red-600" :
                              "border-amber-500 text-amber-600"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tasks assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
        {/* Permissions Section */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Permissions
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Module</TableHead>
                  <TableHead className="font-semibold text-center">View</TableHead>
                  <TableHead className="font-semibold text-center">Read</TableHead>
                  <TableHead className="font-semibold text-center">Write</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(["Leads", "Properties", "Messages", "Settings"] as const).map((mod) => (
                  <TableRow key={mod} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{mod}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          id={`${staff.id}-${mod}-view`}
                          defaultChecked={mod === "Leads" || mod === "Properties"}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          id={`${staff.id}-${mod}-read`}
                          defaultChecked={mod === "Leads"}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          id={`${staff.id}-${mod}-write`}
                          defaultChecked={false}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}
