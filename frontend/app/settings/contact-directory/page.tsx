"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Users, Mail, Phone, MessageSquare } from "lucide-react"
// Contacts Directory Page Component

export default function ContactsDirectoryPage() {
    const [activeTab, setActiveTab] = useState<"owners" | "tenants">("owners")
    const [searchQuery, setSearchQuery] = useState("")
  
    // Mock data for inactive owners
    const inactiveOwners = [
      { id: "1", name: "James Wilson", email: "james.wilson@email.com", phone: "(555) 123-4567", propertyType: "Multi Family", createdDate: "2023-06-15", lastContact: "2024-01-10", status: "Inactive" },
      { id: "2", name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(555) 234-5678", propertyType: "Single Family", createdDate: "2023-04-22", lastContact: "2023-12-05", status: "Inactive" },
      { id: "3", name: "Robert Chen", email: "r.chen@email.com", phone: "(555) 345-6789", propertyType: "Apartment", createdDate: "2023-08-10", lastContact: "2024-02-15", status: "Inactive" },
      { id: "4", name: "Emily Parker", email: "emily.p@email.com", phone: "(555) 456-7890", propertyType: "Multi Family", createdDate: "2023-03-18", lastContact: "2023-11-20", status: "Inactive" },
      { id: "5", name: "Michael Brown", email: "m.brown@email.com", phone: "(555) 567-8901", propertyType: "Single Family", createdDate: "2023-09-05", lastContact: "2024-01-25", status: "Inactive" },
      { id: "6", name: "Jennifer Davis", email: "j.davis@email.com", phone: "(555) 678-9012", propertyType: "Apartment", createdDate: "2023-05-30", lastContact: "2023-10-15", status: "Inactive" },
    ]
  
    // Mock data for inactive tenants
    const inactiveTenants = [
      { id: "1", name: "David Thompson", email: "david.t@email.com", phone: "(555) 111-2222", propertyType: "Apartment", createdDate: "2023-07-12", lastContact: "2024-01-05", status: "Inactive" },
      { id: "2", name: "Lisa Anderson", email: "l.anderson@email.com", phone: "(555) 222-3333", propertyType: "Single Family", createdDate: "2023-05-20", lastContact: "2023-12-18", status: "Inactive" },
      { id: "3", name: "Kevin Martinez", email: "k.martinez@email.com", phone: "(555) 333-4444", propertyType: "Multi Family", createdDate: "2023-08-25", lastContact: "2024-02-01", status: "Inactive" },
      { id: "4", name: "Amanda White", email: "a.white@email.com", phone: "(555) 444-5555", propertyType: "Apartment", createdDate: "2023-04-10", lastContact: "2023-11-30", status: "Inactive" },
      { id: "5", name: "Chris Taylor", email: "c.taylor@email.com", phone: "(555) 555-6666", propertyType: "Single Family", createdDate: "2023-09-15", lastContact: "2024-01-20", status: "Inactive" },
    ]
  
    const currentData = activeTab === "owners" ? inactiveOwners : inactiveTenants
  
    const filteredData = currentData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery)
    )
  
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Contacts Directory</h1>
          <p className="text-muted-foreground">View and manage inactive prospects for potential re-engagement</p>
        </div>
  
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("owners")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === "owners"
                ? "text-teal-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Owners
            {activeTab === "owners" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("tenants")}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === "tenants"
                ? "text-teal-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tenants
            {activeTab === "tenants" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
            )}
          </button>
        </div>
  
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="text-sm">
                {filteredData.length} {activeTab === "owners" ? "Owners" : "Tenants"}
              </Badge>
            </div>
          </CardContent>
        </Card>
  
        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Property Type</TableHead>
                  <TableHead className="font-semibold">Created Date</TableHead>
                  <TableHead className="font-semibold">Last Contact</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                            {item.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.email}</TableCell>
                    <TableCell className="text-muted-foreground">{item.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.propertyType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.lastContact).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
  
            {filteredData.length === 0 && (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No {activeTab} found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
  