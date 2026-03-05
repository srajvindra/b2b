"use client"

import React from "react"
import { useState } from "react"
import {
  Search,
  Building2,
  MapPin,
  Users,
  Home,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Mail,
  Phone,
  Check,
  Plus,
  ArrowLeft,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import type {
  AssignedTeamMember,
  Department,
  DepartmentStaff,
  Property,
  SelectedTeamMember,
} from "../types"
import { MOCK_PROPERTIES } from "../data/mockProperties"
import { allStaffMembers, departments, initialAssignedTeam, MOCK_STAFF } from "../data/propertyGroups"
import { useRouter } from "next/navigation"

// Get area/city from address
const getAreaFromAddress = (address: string): string => {
  const parts = address.split(",")
  if (parts.length >= 2) {
    return parts[1].trim() // Return city name
  }
  return "Other"
}


// Helper to get initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function PropertyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStaff, setExpandedStaff] = useState<string[]>(MOCK_STAFF.map((s) => s.id))
  const router = useRouter()
  // Team management modal state
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [assignedTeam, setAssignedTeam] = useState<AssignedTeamMember[]>(initialAssignedTeam)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [staffSearchQuery, setStaffSearchQuery] = useState("")
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  
  // Create new group state
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [propertySearchQuery, setPropertySearchQuery] = useState("")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<SelectedTeamMember[]>([])
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [showTeamDropdown, setShowTeamDropdown] = useState(false)
  
  // Get unique areas from properties
  const getUniqueAreas = () => {
    const areas = new Set<string>()
    MOCK_PROPERTIES.forEach(p => {
      areas.add(getAreaFromAddress(p.address))
    })
    return Array.from(areas).sort()
  }
  
  // Get properties by area
  const getPropertiesByArea = (area: string) => {
    return MOCK_PROPERTIES.filter(p => getAreaFromAddress(p.address) === area)
  }
  
  // Expanded areas state
  const [expandedAreas, setExpandedAreas] = useState<string[]>(getUniqueAreas())
  
  const toggleAreaExpanded = (area: string) => {
    setExpandedAreas((prev) => 
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }
  
  const openTeamModal = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPropertyId(propertyId)
    setShowTeamModal(true)
  }

  const getPropertiesByStaff = (staffName: string) => {
    return MOCK_PROPERTIES.filter((p) => p.staffName === staffName)
  }

  const filteredStaff = MOCK_STAFF.filter((staff) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    const staffProperties = getPropertiesByStaff(staff.name)
    return (
      staff.name.toLowerCase().includes(searchLower) ||
      staff.email.toLowerCase().includes(searchLower) ||
      staffProperties.some(
        (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower),
      )
    )
  })

  const toggleExpanded = (staffId: string) => {
    setExpandedStaff((prev) => (prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]))
  }

  const totalProperties = MOCK_PROPERTIES.length
  const totalUnits = MOCK_PROPERTIES.reduce((sum, p) => sum + p.units, 0)
  const totalVacancies = MOCK_PROPERTIES.filter((p) => p.hasVacancy).length

  // Filter properties for the dropdown
  const filteredPropertiesForSelection = MOCK_PROPERTIES.filter((p) => {
    if (!propertySearchQuery) return true
    const searchLower = propertySearchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(searchLower) ||
      p.address.toLowerCase().includes(searchLower)
    )
  })

  // Filter departments and staff for the dropdown
  const filteredDepartments = departments.filter((dept) => {
    if (!departmentSearchQuery) return true
    const searchLower = departmentSearchQuery.toLowerCase()
    return (
      dept.name.toLowerCase().includes(searchLower) ||
      dept.staff.some((s) => s.name.toLowerCase().includes(searchLower))
    )
  })

  // Toggle property selection
  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  // Add team member
  const addTeamMember = (staff: DepartmentStaff, departmentName: string) => {
    if (!selectedTeamMembers.find((m) => m.id === staff.id)) {
      setSelectedTeamMembers((prev) => [
        ...prev,
        { ...staff, department: departmentName },
      ])
    }
    setShowTeamDropdown(false)
    setDepartmentSearchQuery("")
    setSelectedDepartment(null)
  }

  // Remove team member
  const removeTeamMember = (memberId: string) => {
    setSelectedTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  // Handle create group
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name")
      return
    }
    if (selectedProperties.length === 0) {
      alert("Please select at least one property")
      return
    }
    // In a real app, this would save to the backend
    alert(`Group "${newGroupName}" created with ${selectedProperties.length} properties and ${selectedTeamMembers.length} team members!`)
    setShowCreateGroup(false)
    setNewGroupName("")
    setSelectedProperties([])
    setSelectedTeamMembers([])
  }

  // Create Group View
  if (showCreateGroup) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowCreateGroup(false)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-xl font-semibold">Create New Property Group</h1>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                placeholder="Enter property group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="text-base"
              />
            </div>

            {/* Properties Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Properties</label>
              <p className="text-sm text-muted-foreground">Search and select properties to add to this group</p>
              
              {/* Selected Properties Tags */}
              {selectedProperties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedProperties.map((propId) => {
                    const property = MOCK_PROPERTIES.find((p) => p.id === propId)
                    return property ? (
                      <Badge key={propId} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                        {property.name}
                        <button
                          type="button"
                          onClick={() => togglePropertySelection(propId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}

              {/* Property Search Dropdown */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={propertySearchQuery}
                    onChange={(e) => setPropertySearchQuery(e.target.value)}
                    onFocus={() => setShowPropertyDropdown(true)}
                    className="pl-9"
                  />
                </div>
                {showPropertyDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-64 overflow-auto">
                    {filteredPropertiesForSelection.length > 0 ? (
                      filteredPropertiesForSelection.map((property) => (
                        <div
                          key={property.id}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent ${
                            selectedProperties.includes(property.id) ? "bg-accent/50" : ""
                          }`}
                          onClick={() => togglePropertySelection(property.id)}
                        >
                          <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                            selectedProperties.includes(property.id) 
                              ? "bg-primary border-primary text-primary-foreground" 
                              : "border-input"
                          }`}>
                            {selectedProperties.includes(property.id) && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{property.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{property.address}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{property.units} Units</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No properties found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {showPropertyDropdown && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowPropertyDropdown(false)}
                >
                  Close dropdown
                </button>
              )}
            </div>

            {/* Team Assignment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Team Members</label>
              <p className="text-sm text-muted-foreground">Select department and staff members to assign to this group</p>
              
              {/* Selected Team Members */}
              {selectedTeamMembers.length > 0 && (
                <div className="space-y-2 mb-3">
                  {selectedTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">{getInitials(member.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role} - {member.department}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Department/Staff Dropdown */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search departments or staff members..."
                    value={departmentSearchQuery}
                    onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                    onFocus={() => setShowTeamDropdown(true)}
                    className="pl-9"
                  />
                </div>
                {showTeamDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-80 overflow-auto">
                    {selectedDepartment ? (
                      // Show staff from selected department
                      <>
                        <div className="sticky top-0 bg-popover border-b px-3 py-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDepartment(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-medium">
                            {departments.find((d) => d.id === selectedDepartment)?.name}
                          </span>
                        </div>
                        {departments
                          .find((d) => d.id === selectedDepartment)
                          ?.staff.map((staff) => {
                            const isSelected = selectedTeamMembers.some((m) => m.id === staff.id)
                            return (
                              <div
                                key={staff.id}
                                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent ${
                                  isSelected ? "opacity-50" : ""
                                }`}
                                onClick={() => {
                                  if (!isSelected) {
                                    addTeamMember(staff, departments.find((d) => d.id === selectedDepartment)?.name || "")
                                  }
                                }}
                              >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">{getInitials(staff.name)}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{staff.name}</p>
                                  <p className="text-xs text-muted-foreground">{staff.role}</p>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                              </div>
                            )
                          })}
                      </>
                    ) : (
                      // Show departments
                      filteredDepartments.map((dept) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent"
                          onClick={() => setSelectedDepartment(dept.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{dept.name}</p>
                              <p className="text-xs text-muted-foreground">{dept.staff.length} members</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              {showTeamDropdown && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    setShowTeamDropdown(false)
                    setSelectedDepartment(null)
                  }}
                >
                  Close dropdown
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowCreateGroup(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} className="bg-teal-600 hover:bg-teal-700 text-white">
                Create Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Property Groups</h1>
            <p className="text-sm text-muted-foreground">Properties organized by area/location</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Create new Group</span>
            </Button>
            <Button variant="outline" onClick={() => setExpandedAreas(getUniqueAreas())} className="bg-transparent">
              Expand All
            </Button>
            <Button variant="outline" onClick={() => setExpandedAreas([])} className="bg-transparent">
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b bg-card p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members or properties..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="space-y-4">
          {getUniqueAreas().filter(area => {
            if (!searchQuery) return true
            const searchLower = searchQuery.toLowerCase()
            const areaProperties = getPropertiesByArea(area)
            return (
              area.toLowerCase().includes(searchLower) ||
              areaProperties.some(
                (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
              )
            )
          }).map((area) => {
            const areaProperties = getPropertiesByArea(area)
            const isExpanded = expandedAreas.includes(area)
            const areaUnits = areaProperties.reduce((sum, p) => sum + p.units, 0)
            const areaVacancies = areaProperties.filter((p) => p.hasVacancy).length

            return (
              <Card key={area} className="overflow-hidden bg-[rgba(248,245,245,1)]">
                <CardHeader
                  className="cursor-pointer bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 hover:from-gray-100 hover:via-gray-150 hover:to-gray-100 transition-colors bg-[rgba(255,255,255,1)]"
                  onClick={() => toggleAreaExpanded(area)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-teal-600 text-white">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{area}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-muted-foreground">{areaProperties.length} properties in this area</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => openTeamModal(area, e)}
                            className="h-7 gap-1.5 text-xs font-normal bg-transparent"
                          >
                            <Users className="h-3.5 w-3.5 text-teal-600" />
                            <span>Assigned Team</span>
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-teal-100 text-teal-700">
                              {assignedTeam.length}
                            </Badge>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex gap-4 text-center">
                        <div className="px-4 py-2 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground">Properties</p>
                          <p className="text-xl font-bold text-gray-900">{areaProperties.length}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground">Units</p>
                          <p className="text-xl font-bold text-gray-900">{areaUnits}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-background/80">
                          <p className="text-xs text-muted-foreground">Vacancies</p>
                          <p className="text-xl font-bold text-gray-900">{areaVacancies}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-4 bg-muted/30">
                    {areaProperties.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto mb-2 opacity-40" />
                        <p>No properties in this area</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {areaProperties.map((property) => (
                          <div
                            key={property.id}
                            onClick={() => router.push(`/properties/groups/${property.id}`)}
                            className="p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md bg-white border-gray-200 hover:border-gray-400"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{property.name}</h4>
                                <p className="text-xs flex items-center gap-1 text-gray-600 mt-1">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="line-clamp-1">{property.address}</span>
                                </p>
                              </div>
                              {property.hasVacancy ? (
                                <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 ml-2" />
                              ) : (
                                <XCircle className="h-5 w-5 shrink-0 text-gray-300 ml-2" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className="text-xs bg-gray-800 text-white hover:bg-gray-700">
                                {property.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Home className="h-3 w-3 mr-1" />
                                {property.units} {property.units === 1 ? "Unit" : "Units"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}

          {getUniqueAreas().filter(area => {
            if (!searchQuery) return true
            const searchLower = searchQuery.toLowerCase()
            const areaProperties = getPropertiesByArea(area)
            return (
              area.toLowerCase().includes(searchLower) ||
              areaProperties.some(
                (p) => p.name.toLowerCase().includes(searchLower) || p.address.toLowerCase().includes(searchLower)
              )
            )
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No areas found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Management Modal */}
      <Dialog open={showTeamModal} onOpenChange={(open) => {
        setShowTeamModal(open)
        if (!open) {
          setEditingMemberId(null)
          setStaffSearchQuery("")
          setSelectedPropertyId(null)
        }
      }}>
        <DialogContent className="w-[900px] max-w-[95vw] sm:max-w-[900px] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Assigned Team
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                <colgroup>
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "17%" }} />
                  <col style={{ width: "15%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">User Role</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Assigned On</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assignedTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-medium flex-shrink-0">
                            {getInitials(member.name)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-3 align-middle">
                        <span className="text-sm text-slate-600 block truncate">{member.email}</span>
                      </td>
                      <td className="p-3 align-middle">
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground align-middle">{member.assignedOn}</td>
                      <td className="p-3 text-right align-middle">
                        {editingMemberId === member.id ? (
                          <Popover open={true} onOpenChange={(open) => {
                            if (!open) {
                              setEditingMemberId(null)
                              setStaffSearchQuery("")
                            }
                          }}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                Select
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[260px] p-0" align="end">
                              <Command>
                                <CommandInput 
                                  placeholder="Search by name or email..." 
                                  value={staffSearchQuery}
                                  onValueChange={setStaffSearchQuery}
                                />
                                <CommandList>
                                  <CommandEmpty>No staff found.</CommandEmpty>
                                  <CommandGroup>
                                    {allStaffMembers
                                      .filter(staff => 
                                        staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                                        staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase())
                                      )
                                      .map((staff) => (
                                        <CommandItem
                                          key={staff.id}
                                          value={`${staff.name} ${staff.email}`}
                                          onSelect={() => {
                                            setAssignedTeam(assignedTeam.map(m => 
                                              m.id === member.id 
                                                ? { ...m, name: staff.name, email: staff.email }
                                                : m
                                            ))
                                            setEditingMemberId(null)
                                            setStaffSearchQuery("")
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium">{staff.name}</span>
                                            <span className="text-xs text-muted-foreground">{staff.email}</span>
                                          </div>
                                          {member.name === staff.name && (
                                            <Check className="ml-auto h-4 w-4 text-teal-600" />
                                          )}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <button
                            type="button"
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            onClick={() => setEditingMemberId(member.id)}
                          >
                            Change
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setShowTeamModal(false)
              setEditingMemberId(null)
              setStaffSearchQuery("")
              setSelectedPropertyId(null)
            }} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                setShowTeamModal(false)
                setEditingMemberId(null)
                setStaffSearchQuery("")
                setSelectedPropertyId(null)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
