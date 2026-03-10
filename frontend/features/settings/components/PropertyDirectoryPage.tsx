"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Search } from "lucide-react"

// Property Directory Page Component

export default function PropertyDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for properties related to inactive owners
  const properties = [
    { id: "1", name: "Sunset Apartments", address: "123 Sunset Blvd, Los Angeles, CA 90028", type: "Apartment", units: 24, owner: "James Wilson", status: "Inactive", createdDate: "2023-06-15" },
    { id: "2", name: "Oak Street Residence", address: "456 Oak Street, San Francisco, CA 94102", type: "Single Family", units: 1, owner: "Sarah Mitchell", status: "Inactive", createdDate: "2023-04-22" },
    { id: "3", name: "Harbor View Complex", address: "789 Harbor Way, San Diego, CA 92101", type: "Multi Family", units: 8, owner: "Robert Chen", status: "Inactive", createdDate: "2023-08-10" },
    { id: "4", name: "Maple Gardens", address: "321 Maple Ave, Sacramento, CA 95814", type: "Apartment", units: 32, owner: "Emily Parker", status: "Inactive", createdDate: "2023-03-18" },
    { id: "5", name: "Pine Valley Home", address: "654 Pine Valley Rd, Fresno, CA 93720", type: "Single Family", units: 1, owner: "Michael Brown", status: "Inactive", createdDate: "2023-09-05" },
    { id: "6", name: "Downtown Lofts", address: "987 Main Street, Oakland, CA 94612", type: "Apartment", units: 16, owner: "Jennifer Davis", status: "Inactive", createdDate: "2023-05-30" },
    { id: "7", name: "Riverside Duplex", address: "147 River Road, Riverside, CA 92501", type: "Multi Family", units: 4, owner: "James Wilson", status: "Inactive", createdDate: "2023-07-20" },
    { id: "8", name: "Coastal Retreat", address: "258 Beach Blvd, Santa Monica, CA 90401", type: "Single Family", units: 1, owner: "Sarah Mitchell", status: "Inactive", createdDate: "2023-02-14" },
  ]

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case "Apartment":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Multi Family":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Single Family":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Property Directory</h1>
        <p className="text-muted-foreground">View properties associated with inactive owner prospects</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties by name, address, owner, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredProperties.length} Properties
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Property Name</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold text-center">Units</TableHead>
                <TableHead className="font-semibold">Owner</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-teal-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-teal-600" />
                      </div>
                      <span className="font-medium text-foreground">{property.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {property.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getPropertyTypeColor(property.type)}`}>
                      {property.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {property.units}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                          {property.owner.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{property.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(property.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      {property.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProperties.length === 0 && (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No properties found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}