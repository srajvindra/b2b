"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Zap,
  Clock,
  Users,
  Building2,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { AutomationsPageProps, AutomationDetail } from "../types"
import {
  leadsOwnersAutomations,
  leadsProspectsAutomations,
  contactsOwnersAutomations,
  contactsTenantsAutomations,
} from "../data/automations"

function AutomationTable({
  automations,
  searchQuery,
  onViewAutomation,
}: {
  automations: AutomationDetail[]
  searchQuery: string
  onViewAutomation: (automation: AutomationDetail) => void
}) {
  const filteredAutomations = automations.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-gray-100 bg-gray-50/50">
          <TableHead className="text-gray-600 font-medium pl-6">Automation Name</TableHead>
          <TableHead className="text-gray-600 font-medium">Trigger</TableHead>
          <TableHead className="text-gray-600 font-medium">Last Run</TableHead>
          <TableHead className="text-gray-600 font-medium">Runs</TableHead>
          <TableHead className="text-gray-600 font-medium">Status</TableHead>
          <TableHead className="text-gray-600 font-medium text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAutomations.map((automation) => (
          <TableRow key={automation.id} className="border-b border-gray-50 hover:bg-gray-50/50">
            <TableCell className="pl-6">
              <div>
                <p className="font-medium text-gray-900">{automation.name}</p>
                <p className="text-sm text-gray-500">{automation.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Zap className="h-3.5 w-3.5" />
                <span className="text-sm">{automation.trigger}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm">{automation.lastRun || "Never"}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">{automation.runCount.toLocaleString()}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch checked={automation.status === "active"} className="data-[state=checked]:bg-gray-900" />
                <Badge
                  variant="outline"
                  className={
                    automation.status === "active"
                      ? "bg-gray-100 text-gray-700 border-gray-300"
                      : automation.status === "paused"
                        ? "bg-gray-100 text-gray-500 border-gray-200"
                        : "bg-white text-gray-400 border-gray-200"
                  }
                >
                  {automation.status}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-right pr-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewAutomation(automation)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {filteredAutomations.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No automations found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default function AutomationsPage({ onNewAutomation }: AutomationsPageProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"leads" | "contacts">("leads")
  const [showNewAutomationDialog, setShowNewAutomationDialog] = useState(false)
  const [automationDialogActiveTab, setAutomationDialogActiveTab] = useState("basics")
  const [expandedSections, setExpandedSections] = useState({
    leadsOwners: true,
    leadsProspects: true,
    contactsOwners: true,
    contactsTenants: true,
  })
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    category: "",
    trigger: "",
    // Targets
    propertyTypes: [] as string[],
    userTypes: [] as string[],
    userJourney: [] as string[],
    tags: [] as string[],
    timezone: "America/New_York",
    // Content
    subject: "",
    messageContent: "",
    // Attachments
    attachments: [] as string[],
    // Schedule
    frequency: "once",
    scheduleTime: "",
    scheduleDay: "",
    startDate: "",
    endDate: "",
  })

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item)
    }
    return [...array, item]
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCreateAutomation = () => {
    console.log("Creating automation:", newAutomation)
    setShowNewAutomationDialog(false)
    setNewAutomation({
      name: "",
      description: "",
      category: "",
      trigger: "",
      propertyTypes: [],
      userTypes: [],
      userJourney: [],
      tags: [],
      timezone: "America/New_York",
      subject: "",
      messageContent: "",
      attachments: [],
      frequency: "once",
      scheduleTime: "",
      scheduleDay: "",
      startDate: "",
      endDate: "",
    })
    setAutomationDialogActiveTab("basics")
  }

  const handleViewAutomation = (automation: AutomationDetail) => {
    router.push(`/operations/automations/${automation.id}`)
  }

  return (
    <div className="p-8 space-y-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-500 mt-1">Automate repetitive tasks and workflows</p>
        </div>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={() => setShowNewAutomationDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Automation
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search automations..."
          className="pl-10 bg-white border-gray-200 focus-visible:ring-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-1 pb-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "leads"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="h-4 w-4" />
          Leads
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-1 pb-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "contacts"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Contacts
        </button>
      </div>

      {/* Leads Tab Content */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          {/* Owners Section */}
          <Collapsible open={expandedSections.leadsOwners} onOpenChange={() => toggleSection("leadsOwners")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Owners</h3>
                      <p className="text-sm text-gray-500">Automations for owner leads</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{leadsOwnersAutomations.length} automations</span>
                    {expandedSections.leadsOwners ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={leadsOwnersAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={handleViewAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Leasing Prospects Section */}
          <Collapsible open={expandedSections.leadsProspects} onOpenChange={() => toggleSection("leadsProspects")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Leasing Prospects</h3>
                      <p className="text-sm text-gray-500">Automations for leasing prospects</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{leadsProspectsAutomations.length} automations</span>
                    {expandedSections.leadsProspects ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={leadsProspectsAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={handleViewAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      )}

      {/* Contacts Tab Content */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          {/* Owners Section */}
          <Collapsible open={expandedSections.contactsOwners} onOpenChange={() => toggleSection("contactsOwners")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Owners</h3>
                      <p className="text-sm text-gray-500">Automations for owner contacts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{contactsOwnersAutomations.length} automations</span>
                    {expandedSections.contactsOwners ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={contactsOwnersAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={handleViewAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Tenants Section */}
          <Collapsible open={expandedSections.contactsTenants} onOpenChange={() => toggleSection("contactsTenants")}>
            <Card className="border-gray-200 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between px-6 py-3 bg-white cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Tenants</h3>
                      <p className="text-sm text-gray-500">Automations for tenant contacts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{contactsTenantsAutomations.length} automations</span>
                    {expandedSections.contactsTenants ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="p-0 border-t border-gray-100">
                  <AutomationTable
                    automations={contactsTenantsAutomations}
                    searchQuery={searchQuery}
                    onViewAutomation={handleViewAutomation}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      )}

      {/* New Automation Dialog */}
      <Dialog open={showNewAutomationDialog} onOpenChange={setShowNewAutomationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-bold">Create New Automation</DialogTitle>

          {/* Dialog tabs */}
          <div className="flex gap-1 border-b border-gray-200 mt-4">
            {["basics", "targets", "content", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setAutomationDialogActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                  automationDialogActiveTab === tab
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {/* Basics Tab */}
            {automationDialogActiveTab === "basics" && (
              <div className="space-y-4">
                <div>
                  <Label>Automation Name</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="e.g., Welcome Email Sequence"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    className="mt-1.5"
                    placeholder="Describe what this automation does..."
                    value={newAutomation.description}
                    onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newAutomation.category}
                      onValueChange={(value) => setNewAutomation({ ...newAutomation, category: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="communications">Communications</SelectItem>
                        <SelectItem value="leasing">Leasing</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="payments">Payments</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Trigger</Label>
                    <Select
                      value={newAutomation.trigger}
                      onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger: value })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_lead">New Lead Created</SelectItem>
                        <SelectItem value="stage_change">Stage Changed</SelectItem>
                        <SelectItem value="lease_signed">Lease Signed</SelectItem>
                        <SelectItem value="payment_received">Payment Received</SelectItem>
                        <SelectItem value="work_order">Work Order Created</SelectItem>
                        <SelectItem value="scheduled">Scheduled Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Targets Tab */}
            {automationDialogActiveTab === "targets" && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold">Property Types</Label>
                  <p className="text-sm text-gray-500 mb-3">Select which property types this automation applies to</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Single Family", "Multi-Family", "Commercial", "Condo", "Townhouse", "Apartment"].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={type}
                          checked={newAutomation.propertyTypes.includes(type)}
                          onCheckedChange={() =>
                            setNewAutomation({
                              ...newAutomation,
                              propertyTypes: toggleArrayItem(newAutomation.propertyTypes, type),
                            })
                          }
                        />
                        <Label htmlFor={type} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold">User Types</Label>
                  <p className="text-sm text-gray-500 mb-3">Select which user types will receive this automation</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Owners", "Tenants", "Prospects", "Vendors", "Staff"].map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox
                          id={type}
                          checked={newAutomation.userTypes.includes(type)}
                          onCheckedChange={() =>
                            setNewAutomation({
                              ...newAutomation,
                              userTypes: toggleArrayItem(newAutomation.userTypes, type),
                            })
                          }
                        />
                        <Label htmlFor={type} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={newAutomation.timezone}
                    onValueChange={(value) => setNewAutomation({ ...newAutomation, timezone: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {automationDialogActiveTab === "content" && (
              <div className="space-y-4">
                <div>
                  <Label>Subject Line</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="Email subject..."
                    value={newAutomation.subject}
                    onChange={(e) => setNewAutomation({ ...newAutomation, subject: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available variables: {"{contact.firstName}"}, {"{property.name}"}, {"{company.name}"}
                  </p>
                </div>
                <div>
                  <Label>Message Content</Label>
                  <Textarea
                    className="mt-1.5 min-h-[200px]"
                    placeholder="Write your message here..."
                    value={newAutomation.messageContent}
                    onChange={(e) => setNewAutomation({ ...newAutomation, messageContent: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Attachments</Label>
                  <div className="mt-1.5 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {automationDialogActiveTab === "schedule" && (
              <div className="space-y-4">
                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={newAutomation.frequency}
                    onValueChange={(value) => setNewAutomation({ ...newAutomation, frequency: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once (on trigger)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={newAutomation.startDate}
                      onChange={(e) => setNewAutomation({ ...newAutomation, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date (Optional)</Label>
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={newAutomation.endDate}
                      onChange={(e) => setNewAutomation({ ...newAutomation, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Send Time</Label>
                  <Input
                    type="time"
                    className="mt-1.5"
                    value={newAutomation.scheduleTime}
                    onChange={(e) => setNewAutomation({ ...newAutomation, scheduleTime: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowNewAutomationDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white" onClick={handleCreateAutomation}>
              Create Automation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
