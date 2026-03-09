"use client"

import { useState } from "react"
import { ArrowLeft, ChevronRight, Search, Settings, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Roles & Permissions Page Component
function RolesPermissionsPage() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [permissionSearch, setPermissionSearch] = useState("")
  
    const roles = [
      { id: "1", name: "Process Owner", description: "Manages and oversees business processes", usersCount: 4 },
      { id: "2", name: "Accountant", description: "Handles financial records and transactions", usersCount: 3 },
      { id: "3", name: "Acquisition Manager", description: "Manages property acquisition and owner prospects", usersCount: 2 },
      { id: "4", name: "Agent", description: "Handles leasing and tenant relations", usersCount: 8 },
      { id: "5", name: "AGM", description: "Assistant General Manager supporting operations", usersCount: 2 },
      { id: "6", name: "BC", description: "Business Coordinator managing day-to-day activities", usersCount: 3 },
      { id: "7", name: "CEO", description: "Chief Executive Officer with full system access", usersCount: 1 },
      { id: "8", name: "CSM", description: "Customer Success Manager for client relations", usersCount: 5 },
      { id: "9", name: "HR Executive", description: "Handles HR operations and employee management", usersCount: 2 },
      { id: "10", name: "HR Manager", description: "Oversees HR department and policies", usersCount: 1 },
      { id: "11", name: "Lead Coordinator", description: "Coordinates lead distribution and follow-ups", usersCount: 4 },
      { id: "12", name: "Lead Owner", description: "Owns and manages assigned leads", usersCount: 6 },
    ]
  
    const permissionCategories = [
      { id: "1", name: "Accounting - Advanced", isNew: false, sections: [
        { id: "1-1", name: "Bank Reconciliation" },
        { id: "1-2", name: "Budget Management" },
        { id: "1-3", name: "Financial Reports" },
      ]},
      { id: "2", name: "Accounting - Common Area Maintenance", isNew: false, sections: [
        { id: "2-1", name: "CAM Charges" },
        { id: "2-2", name: "CAM Reconciliation" },
      ]},
      { id: "3", name: "Accounting - Debt Collections", isNew: false, sections: [
        { id: "3-1", name: "Collection Letters" },
        { id: "3-2", name: "Payment Plans" },
        { id: "3-3", name: "Write-offs" },
      ]},
      { id: "4", name: "Accounting - General", isNew: false, sections: [
        { id: "4-1", name: "Chart of Accounts" },
        { id: "4-2", name: "General Ledger" },
        { id: "4-3", name: "Account Statements" },
      ]},
      { id: "5", name: "Accounting - Journal Entries", isNew: false, sections: [
        { id: "5-1", name: "Manual Entries" },
        { id: "5-2", name: "Recurring Entries" },
        { id: "5-3", name: "Adjusting Entries" },
      ]},
      { id: "6", name: "Accounting - Payables", isNew: false, sections: [
        { id: "6-1", name: "Vendor Bills" },
        { id: "6-2", name: "Bill Payments" },
        { id: "6-3", name: "Purchase Orders" },
      ]},
      { id: "7", name: "Accounting - Receivables", isNew: false, sections: [
        { id: "7-1", name: "Invoices" },
        { id: "7-2", name: "Payments Received" },
        { id: "7-3", name: "Credit Memos" },
      ]},
      { id: "8", name: "Accounting - Transactions", isNew: false, sections: [
        { id: "8-1", name: "Transaction History" },
        { id: "8-2", name: "Void Transactions" },
        { id: "8-3", name: "Transaction Reports" },
      ]},
      { id: "9", name: "Affordable Housing", isNew: false, sections: [
        { id: "9-1", name: "Compliance Reports" },
        { id: "9-2", name: "Income Certifications" },
        { id: "9-3", name: "HUD Forms" },
      ]},
      { id: "10", name: "Assigned Tasks", isNew: true, sections: [
        { id: "10-1", name: "Task List" },
        { id: "10-2", name: "Task Assignment" },
        { id: "10-3", name: "Task Templates" },
      ]},
      { id: "11", name: "Associations", isNew: false, sections: [
        { id: "11-1", name: "HOA Management" },
        { id: "11-2", name: "Meeting Minutes" },
        { id: "11-3", name: "Violation Tracking" },
      ]},
      { id: "12", name: "Bulk Workflows", isNew: false, sections: [
        { id: "12-1", name: "Bulk Communications" },
        { id: "12-2", name: "Bulk Updates" },
        { id: "12-3", name: "Import/Export" },
      ]},
      { id: "13", name: "Communication", isNew: false, sections: [
        { id: "13-1", name: "Email Templates" },
        { id: "13-2", name: "SMS Templates" },
        { id: "13-3", name: "Notification Settings" },
      ]},
      { id: "14", name: "Global", isNew: false, sections: [
        { id: "14-1", name: "System Settings" },
        { id: "14-2", name: "Company Profile" },
        { id: "14-3", name: "Integrations" },
      ]},
      { id: "15", name: "Information Security", isNew: false, sections: [
        { id: "15-1", name: "Audit Logs" },
        { id: "15-2", name: "Data Access" },
        { id: "15-3", name: "Security Settings" },
      ]},
      { id: "16", name: "Leasing", isNew: false, sections: [
        { id: "16-1", name: "Applications" },
        { id: "16-2", name: "Lease Agreements" },
        { id: "16-3", name: "Renewals" },
        { id: "16-4", name: "Move-in/Move-out" },
      ]},
      { id: "17", name: "Maintenance", isNew: false, sections: [
        { id: "17-1", name: "Work Orders" },
        { id: "17-2", name: "Vendor Management" },
        { id: "17-3", name: "Inspections" },
      ]},
      { id: "18", name: "Properties", isNew: false, sections: [
        { id: "18-1", name: "Property List" },
        { id: "18-2", name: "Unit Management" },
        { id: "18-3", name: "Amenities" },
      ]},
      { id: "19", name: "Reporting", isNew: true, sections: [
        { id: "19-1", name: "Financial Reports" },
        { id: "19-2", name: "Operational Reports" },
        { id: "19-3", name: "Custom Reports" },
      ]},
      { id: "20", name: "Tenant Management", isNew: false, sections: [
        { id: "20-1", name: "Tenant Profiles" },
        { id: "20-2", name: "Lease History" },
        { id: "20-3", name: "Tenant Communications" },
      ]},
    ]
  
    const getRoleColor = (index: number) => {
      const colors = [
        "bg-teal-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-orange-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-green-500",
        "bg-red-500",
        "bg-yellow-500",
        "bg-cyan-500",
        "bg-emerald-500",
        "bg-violet-500",
      ]
      return colors[index % colors.length]
    }
  
    const currentRole = roles.find((r) => r.id === selectedRole)
    const currentCategory = permissionCategories.find((c) => c.id === selectedCategory)
  
    const filteredCategories = permissionCategories.filter((category) =>
      category.name.toLowerCase().includes(permissionSearch.toLowerCase())
    )
  
    // Category Detail View (Permission Sections Table)
    if (selectedRole && currentRole && selectedCategory && currentCategory) {
      return (
        <div className="p-6">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to {currentRole.name} Permissions</span>
            </button>
            <h1 className="text-2xl font-bold text-foreground">{currentCategory.name}</h1>
            <p className="text-muted-foreground">Manage permissions for {currentCategory.name}</p>
          </div>
  
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
  
          {/* Permissions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-1/2">Permission</TableHead>
                    <TableHead className="font-semibold text-center">View/Read</TableHead>
                    <TableHead className="font-semibold text-center">Write</TableHead>
                    <TableHead className="font-semibold text-center">Delete</TableHead>
                    <TableHead className="font-semibold text-center">Add</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCategory.sections.map((section) => (
                    <TableRow key={section.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">{section.name}</TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          id={`${section.id}-view`}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          id={`${section.id}-write`}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          id={`${section.id}-delete`}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          id={`${section.id}-add`}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
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
  
    // Role Detail View (Permission Categories as Tiles)
    if (selectedRole && currentRole) {
      return (
        <div className="p-6">
          {/* Header with Back Button */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Roles</span>
            </button>
            <h1 className="text-2xl font-bold text-foreground">{currentRole.name} Access Permissions</h1>
            <p className="text-muted-foreground">{currentRole.name}</p>
          </div>
  
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                Review Changes
              </Button>
              <Button
                variant="link"
                className="text-teal-600 hover:text-teal-700"
                onClick={() => setSelectedRole(null)}
              >
                Cancel
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder="Search for Permissions"
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
                className="pl-3 pr-10 w-64"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
  
          {/* Permission Categories as Tiles */}
          <div className="border rounded-lg divide-y">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{category.name}</span>
                  {category.isNew && (
                    <Badge className="bg-teal-100 text-teal-700 text-xs ml-2">NEW</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{category.sections.length} permissions</span>
              </button>
            ))}
          </div>
  
          {filteredCategories.length === 0 && (
            <div className="p-8 text-center border rounded-lg">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No permissions found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </div>
      )
    }
  
    // Roles List View
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and their associated permissions</p>
        </div>

        {/* Roles List */}
        <div className="space-y-3">
          {roles.map((role, index) => (
            <Card
              key={role.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRole(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Role Icon/Color */}
                  <div
                    className={`w-12 h-12 rounded-lg ${getRoleColor(
                      index,
                    )} flex items-center justify-center flex-shrink-0`}
                  >
                    <Users className="h-6 w-6 text-white" />
                  </div>

                  {/* Role Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{role.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{role.description}</p>
                  </div>

                  {/* Users Count */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {role.usersCount} {role.usersCount === 1 ? "user" : "users"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRole(role.id)
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

export default function Page() {
  return <RolesPermissionsPage />
}