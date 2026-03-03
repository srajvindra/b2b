"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Building2,
  Edit2,
  Plus,
  Calendar,
  User,
  Home,
  DollarSign,
  Key,
  Wrench,
  FileText,
  Clock,
  Tag,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Bed,
  Bath,
  Square,
  ImageIcon,
  Eye,
  Pencil,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ListTodo,
  RotateCcw,
} from "lucide-react"

interface UnitDetailPageProps {
  unitId?: string
  propertyId?: string
  onBack: () => void
}

// Sample unit data
const UNIT_DATA = {
  id: "101",
  propertyName: "Cedar Point",
  propertyAddress: "963 Cedar Ave, Charlotte, NC 28201",
  address: "963 Cedar Ave - Unit 101",
  fullAddress: "CHARLOTTE, NC 28201",
  status: "Occupied",
  rentReady: true,
  readyForShowingOn: "12/10/2024",
  utilityBillingEnabled: false,
  lockbox: null,
  description: "Spacious corner unit with natural light",
  tags: ["Corner Unit", "Recently Renovated"],
  nonRevenueUnit: false,
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1200,
  marketRent: 2400,
  useMarketRentOnAds: true,
  applicationFee: 25.0,
  securityDeposit: 2400,
  rentStatus: "Current",
  legalRent: 2400,
  preferentialRent: null,
  utilitiesIncluded: ["Water", "Trash"],
  appliancesIncluded: ["Refrigerator", "Dishwasher", "Microwave"],
  additionalLeaseInfo: "Pet deposit required",
  upcomingActivities: [
    {
      id: "1",
      taskName: "Follow up with tenant - Unit 204 lease renewal",
      workflow: "Lease Renewal Process",
      relatedEntityType: "Tenant",
      relatedEntityName: "John Smith",
      dueDate: "2025-12-20",
      isOverdue: true,
      priority: "High",
      status: "Pending",
      assignedTo: "Nina Patel",
      autoCreated: false,
    },
    {
      id: "2",
      taskName: "Finish Move-out tenant in Appfolio and update property",
      workflow: "Move Out for 123 Oak Street",
      relatedEntityType: "Property",
      relatedEntityName: "Maple Heights",
      dueDate: "2025-12-21",
      isOverdue: true,
      priority: "High",
      status: "In Progress",
      assignedTo: "Richard Surovi",
      autoCreated: false,
    },
    {
      id: "3",
      taskName: "Review rental application - Sarah Johnson",
      workflow: "Lease Prospect Onboarding",
      relatedEntityType: "Lease Prospect",
      relatedEntityName: "Sarah Johnson",
      dueDate: "2025-12-23",
      isOverdue: false,
      priority: "High",
      status: "Pending",
      assignedTo: "Nina Patel",
      autoCreated: false,
    },
    {
      id: "4",
      taskName: "Schedule maintenance for HVAC - Oak Manor",
      workflow: null,
      relatedEntityType: "Property",
      relatedEntityName: "Oak Manor",
      dueDate: "2025-12-23",
      isOverdue: false,
      priority: "Medium",
      status: "Pending",
      assignedTo: "Mike Johnson",
      autoCreated: false,
    },
    {
      id: "5",
      taskName: "Send lease agreement - Unit 305",
      workflow: "New Lease Signing",
      relatedEntityType: "Lease Prospect",
      relatedEntityName: "Unit 305",
      dueDate: "2025-12-24",
      isOverdue: false,
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Sarah Chen",
      autoCreated: false,
    },
    {
      id: "6",
      taskName: "Call owner about property updates",
      workflow: "Owner Quarterly Review",
      relatedEntityType: "Owner",
      relatedEntityName: "Mike Davis",
      dueDate: "2025-12-25",
      isOverdue: false,
      priority: "Low",
      status: "Skipped",
      assignedTo: "Richard Surovi",
      autoCreated: false,
    },
    {
      id: "7",
      taskName: "Process security deposit refund",
      workflow: "Move Out Process",
      relatedEntityType: "Tenant",
      relatedEntityName: "Emily Brown",
      dueDate: "2025-12-26",
      isOverdue: false,
      priority: "Medium",
      status: "Pending",
      assignedTo: "Nina Patel",
      autoCreated: false,
    },
    {
      id: "8",
      taskName: "Update property listing photos",
      workflow: null,
      relatedEntityType: "Property",
      relatedEntityName: "Pine View Apts",
      dueDate: "2025-12-27",
      isOverdue: false,
      priority: "Low",
      status: "Pending",
      assignedTo: "Mike Johnson",
      autoCreated: false,
    },
    {
      id: "9",
      taskName: "Follow up on unread email",
      workflow: "Owner Prospect Outreach",
      relatedEntityType: "Prospect Owner",
      relatedEntityName: "James Wilson",
      dueDate: "2025-12-23",
      isOverdue: false,
      priority: "Medium",
      status: "Pending",
      assignedTo: "Sarah Chen",
      autoCreated: true,
    },
    {
      id: "10",
      taskName: "Respond to SMS",
      workflow: null,
      relatedEntityType: "Tenant",
      relatedEntityName: "Robert Garcia",
      dueDate: "2025-12-24",
      isOverdue: false,
      priority: "Low",
      status: "Pending",
      assignedTo: "Nina Patel",
      autoCreated: true,
    },
  ],
  currentTenants: [
    {
      id: "1",
      name: "adin LLC",
      type: "Financially Responsible",
      moveIn: "02/01/2025",
      phone: "12345678",
      email: "pmb2b@gmail.com",
      leaseTerms: "Month to Month, beginning 02/01/2019",
      depositsPaid: 2400,
    },
  ],
  pastTenants: [
    {
      id: "1",
      name: "Alif Hussain",
      type: "Financially Responsible",
      moveIn: "10/11/2024",
      moveOut: "11/30/2024",
    },
  ],
  marketingInfo: {
    postedToWebsite: false,
    postedToInternet: false,
    premiumListing: false,
    removedFromVacanciesList: false,
    availableOn: null,
    marketingTitle: null,
    marketingDescription: null,
    youtubeVideoUrl: null,
  },
  keys: [],
  maintenanceNotes: "None",
  fixedAssets: [],
  photos: [],
  notes: [],
  auditLog: [
    { date: "01/12/2025 11:27 AM", action: "Deleted Available On 12/10/2024", user: "George Guraya" },
    { date: "10/28/2024 09:32 AM", action: "Added Available On 12/10/2024", user: "George Guraya" },
    { date: "10/28/2024 09:32 AM", action: "Added Ready For Showing On 12/10/2024", user: "George Guraya" },
    { date: "09/12/2024 03:04 PM", action: 'Created "Cedar Point" 963 Cedar Ave - Unit 101', user: "George Guraya" },
  ],
}

export function UnitDetailPage({ unitId, propertyId, onBack }: UnitDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"unit-information" | "rental-information" | "documents" | "audit-logs">("unit-information")
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false)
  const [visibleTaskCount, setVisibleTaskCount] = useState(5)

  // Task summary counts
  const taskActivities = UNIT_DATA.upcomingActivities
  const pendingTasks = taskActivities.filter(a => a.status === "Pending" && !a.workflow).length
  const pendingProcesses = taskActivities.filter(a => a.status === "Pending" && a.workflow).length
  const overdueTasks = taskActivities.filter(a => a.isOverdue && !a.workflow).length
  const overdueProcesses = taskActivities.filter(a => a.isOverdue && a.workflow).length
  const [activityForm, setActivityForm] = useState({
    date: "",
    allDay: false,
    time: "",
    ampm: "AM",
    description: "",
    label: "",
    assignTo: "",
    status: "Pending",
  })

  const handleSaveActivity = () => {
    setShowAddActivityDialog(false)
    setActivityForm({
      date: "",
      allDay: false,
      time: "",
      ampm: "AM",
      description: "",
      label: "",
      assignTo: "",
      status: "Pending",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Home className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-800">
                      "{UNIT_DATA.propertyName}" {UNIT_DATA.address}
                    </h1>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{UNIT_DATA.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">
                      Property:{" "}
                      <span className="text-blue-600 hover:underline cursor-pointer">{UNIT_DATA.propertyName}</span> -{" "}
                      {UNIT_DATA.propertyAddress}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Address: {UNIT_DATA.address}, {UNIT_DATA.fullAddress}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "unit-information" | "rental-information" | "documents" | "audit-logs")} className="w-full">
          <TabsList className="bg-transparent border-b border-slate-200 rounded-none p-0 h-auto w-full justify-start gap-0">
            <TabsTrigger
              value="unit-information"
              className="px-6 py-3 rounded-none border border-transparent bg-transparent text-slate-600 data-[state=active]:border-slate-300 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="rental-information"
              className="px-6 py-3 rounded-none border border-transparent bg-transparent text-slate-600 data-[state=active]:border-slate-300 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:font-medium"
            >
              Rental Information
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="px-6 py-3 rounded-none border border-transparent bg-transparent text-slate-600 data-[state=active]:border-slate-300 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:font-medium"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="audit-logs"
              className="px-6 py-3 rounded-none border border-transparent bg-transparent text-slate-600 data-[state=active]:border-slate-300 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:font-medium"
            >
              Audit Logs
              <span className="ml-2 text-slate-400 font-normal">{UNIT_DATA.auditLog.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* Unit Information Tab */}
          <TabsContent value="unit-information" className="space-y-6 mt-6">
            {/* Upcoming Activities */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-slate-50 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    Task Summary 
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    onClick={() => setShowAddActivityDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Activity
                  </Button>
                </div>
                {/* Task Summary Status Bar */}
                <div className="mt-3 flex items-center justify-between rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Task Overview</span>
                  </div>
                  <div className="flex items-center gap-0">
                    <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                      <ListTodo className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-sm text-amber-800">{"Pending Tasks: "}<span className="font-semibold">{pendingTasks}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                      <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-sm text-amber-800">{"Pending Processes: "}<span className="font-semibold">{pendingProcesses}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-sm text-red-700">{"Overdue Tasks: "}<span className="font-semibold">{overdueTasks}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-sm text-red-700">{"Overdue Processes: "}<span className="font-semibold">{overdueProcesses}</span></span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {UNIT_DATA.upcomingActivities.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 border-b">
                        <TableHead className="font-medium text-slate-600 py-3">Task</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Related Entity</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Due Date</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Priority</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Status</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Assigned To</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {UNIT_DATA.upcomingActivities.slice(0, visibleTaskCount).map((activity) => (
                        <TableRow key={activity.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <span className="text-sm font-medium text-slate-800 block">{activity.taskName}</span>
                              {activity.workflow && (
                                <span className="text-xs text-teal-600 cursor-pointer hover:underline block">
                                  % {activity.workflow}
                                </span>
                              )}
                              {activity.autoCreated && (
                                <span className="text-xs text-slate-400 block">Auto-created</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-slate-600">
                              {activity.relatedEntityType}: {activity.relatedEntityName}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${activity.isOverdue ? "text-red-600" : "text-slate-600"}`}>
                                {activity.dueDate}
                              </span>
                              {activity.isOverdue && (
                                <span className="text-xs text-red-500">(Overdue)</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${
                                activity.priority === "High" 
                                  ? "bg-red-50 text-red-600 border-red-200" 
                                  : activity.priority === "Medium"
                                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}
                            >
                              {activity.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${
                                activity.status === "Pending" 
                                  ? "bg-yellow-50 text-yellow-600 border-yellow-300" 
                                  : activity.status === "In Progress"
                                    ? "bg-teal-50 text-teal-600 border-teal-300"
                                    : "bg-slate-50 text-slate-500 border-slate-300"
                              }`}
                            >
                              {activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-slate-600">{activity.assignedTo}</span>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-green-600 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>No upcoming activities</p>
                  </div>
                )}
                {/* View More / View Less Buttons */}
                <div className="flex items-center justify-center gap-3 py-3 border-t border-slate-100">
                  {visibleTaskCount < UNIT_DATA.upcomingActivities.length && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setVisibleTaskCount((prev) => Math.min(prev + 5, UNIT_DATA.upcomingActivities.length))}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" />
                      View More
                    </Button>
                  )}
                  {visibleTaskCount > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      onClick={() => setVisibleTaskCount((prev) => Math.max(prev - 5, 5))}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" />
                      View Less
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Unit Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Home className="h-5 w-5 text-blue-600" />
                    Unit Information
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Status</span>
                    <Badge className="bg-emerald-100 text-emerald-700">{UNIT_DATA.status}</Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Rent Ready</span>
                    <span className="font-medium text-emerald-600">{UNIT_DATA.rentReady ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Ready For Showing On</span>
                    <span className="font-medium">{UNIT_DATA.readyForShowingOn || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Utility Billing (RUBS) Enabled</span>
                    <span className="font-medium">{UNIT_DATA.utilityBillingEnabled ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Lockbox</span>
                    <span className="text-blue-600 cursor-pointer hover:underline">{UNIT_DATA.lockbox || "— Add"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Description</span>
                    <span className="font-medium">{UNIT_DATA.description || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <Tag className="h-5 w-5 text-purple-600" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {UNIT_DATA.tags.length > 0 ? (
                    UNIT_DATA.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Non-Revenue Status */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Non-Revenue Status</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-600 mb-2">Current</p>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">Non-Revenue Unit</span>
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{UNIT_DATA.nonRevenueUnit ? "Yes" : "No"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Wrench className="h-5 w-5 text-slate-600" />
                    Maintenance Information
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Unit Specific Notes</span>
                  <span className="font-medium">{UNIT_DATA.maintenanceNotes}</span>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Assets */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Fixed Assets</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Asset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-slate-500 py-4">Click Add Asset to add a fixed asset.</p>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Rental Information Tab */}
          <TabsContent value="rental-information" className="space-y-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Rental Information
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Bed className="h-4 w-4" /> Bedrooms
                    </span>
                    <span className="font-medium">{UNIT_DATA.bedrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Bath className="h-4 w-4" /> Bathrooms
                    </span>
                    <span className="font-medium">{UNIT_DATA.bathrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Square className="h-4 w-4" /> Square Feet
                    </span>
                    <span className="font-medium">{UNIT_DATA.squareFeet.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Market Rent</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${UNIT_DATA.marketRent.toLocaleString()}</span>
                      <span className="text-blue-600 text-sm cursor-pointer hover:underline">
                        View Nearby Advertised Units
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Use Market Rent on Ads?</span>
                    <span className="font-medium text-emerald-600">{UNIT_DATA.useMarketRentOnAds ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Application Fee</span>
                    <span className="font-medium">${UNIT_DATA.applicationFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Security Deposit</span>
                    <span className="font-medium">${UNIT_DATA.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Rent Status</span>
                    <span className="font-medium">{UNIT_DATA.rentStatus || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Legal Rent</span>
                    <span className="font-medium">
                      {UNIT_DATA.legalRent ? `$${UNIT_DATA.legalRent.toLocaleString()}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Preferential Rent</span>
                    <span className="font-medium">
                      {UNIT_DATA.preferentialRent ? `$${UNIT_DATA.preferentialRent}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Utilities Included</span>
                    <span className="font-medium">{UNIT_DATA.utilitiesIncluded.join(", ") || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Appliances Included</span>
                    <span className="font-medium">{UNIT_DATA.appliancesIncluded.join(", ") || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 col-span-2">
                    <span className="text-slate-500">Additional Lease Information</span>
                    <span className="font-medium">{UNIT_DATA.additionalLeaseInfo || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Tenants */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <User className="h-5 w-5 text-blue-600" />
                  Current Tenants
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Type</TableHead>
                      <TableHead className="font-semibold text-slate-700">Move In</TableHead>
                      <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                      <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UNIT_DATA.currentTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-600 font-medium cursor-pointer hover:underline">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.type}</TableCell>
                        <TableCell>{tenant.moveIn}</TableCell>
                        <TableCell>
                          <span className="text-blue-600 cursor-pointer hover:underline">Home: {tenant.phone}</span>
                        </TableCell>
                        <TableCell className="text-blue-600 cursor-pointer hover:underline">{tenant.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {UNIT_DATA.currentTenants.length > 0 && (
                  <div className="p-4 border-t bg-slate-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Lease Terms</span>
                        <span className="ml-2 font-medium">{UNIT_DATA.currentTenants[0].leaseTerms}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Deposits Paid</span>
                        <span className="ml-2 font-medium">
                          ${UNIT_DATA.currentTenants[0].depositsPaid?.toLocaleString() || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Tenants */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <CardTitle className="text-lg font-semibold text-slate-800">Past Tenants</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Type</TableHead>
                      <TableHead className="font-semibold text-slate-700">Move In</TableHead>
                      <TableHead className="font-semibold text-slate-700">Move Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UNIT_DATA.pastTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-600 font-medium cursor-pointer hover:underline">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.type}</TableCell>
                        <TableCell>{tenant.moveIn}</TableCell>
                        <TableCell>{tenant.moveOut}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Keys */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Key className="h-5 w-5 text-amber-600" />
                    Keys
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-slate-500 py-4">Click Add Key to add keys.</p>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Notes
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-slate-600 border-slate-200 hover:bg-slate-50 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Notes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-slate-500 py-4">No notes yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6 mt-6">
            {/* Marketing Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Marketing Information</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Posted to your Website</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.postedToWebsite ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Posted to the Internet</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.postedToInternet ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Premium Listing</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.premiumListing ? "On" : "Off"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Removed from Vacancies List</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.removedFromVacanciesList ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Available On</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.availableOn || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Marketing Title</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.marketingTitle || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Marketing Description</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.marketingDescription || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">YouTube Video URL</span>
                    <span className="font-medium">{UNIT_DATA.marketingInfo.youtubeVideoUrl || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <CardTitle className="text-lg font-semibold text-slate-800">Photos</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-slate-500 py-4">No photos yet.</p>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <CardTitle className="text-lg font-semibold text-slate-800">Attachments</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-600">
                    <span className="font-semibold text-blue-600">Drag Files Here</span>
                    <span className="mx-2">or</span>
                    <span className="font-semibold text-blue-600 hover:underline">Choose Files to Add</span>
                  </p>
                </div>
                <div className="mt-4">
                  <Button variant="link" className="text-blue-600 p-0">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Folder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit-logs" className="space-y-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Clock className="h-5 w-5 text-slate-600" />
                    Audit Log
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {UNIT_DATA.auditLog.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <div className="text-sm">
                        <span className="text-amber-600 font-medium">{entry.date}</span>
                        <span className="text-slate-600 ml-2">{entry.action}</span>
                        <span className="text-slate-400"> – </span>
                        <span className="text-blue-600">{entry.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Activity Dialog */}
        <Dialog open={showAddActivityDialog} onOpenChange={setShowAddActivityDialog}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-t-lg">
              <DialogTitle className="text-xl font-semibold">New Activity</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm">
                  <span className="text-slate-600">Unit:</span>{" "}
                  <span className="text-blue-600 font-medium">
                    "{UNIT_DATA.propertyName}" {UNIT_DATA.address}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={activityForm.date}
                  onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="allDay"
                  checked={activityForm.allDay}
                  onCheckedChange={(checked) => setActivityForm({ ...activityForm, allDay: checked as boolean })}
                />
                <Label htmlFor="allDay" className="text-sm text-slate-600">
                  All Day
                </Label>
              </div>

              {!activityForm.allDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Time</Label>
                    <Input
                      placeholder="HH:MM"
                      value={activityForm.time}
                      onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">AM/PM</Label>
                    <Select
                      value={activityForm.ampm}
                      onValueChange={(value) => setActivityForm({ ...activityForm, ampm: value })}
                    >
                      <SelectTrigger className="border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="e.g. Tenant Move Out & Walk-Through"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value.slice(0, 500) })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                />
                <p className="text-xs text-slate-400">{activityForm.description.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Label</Label>
                  <Select
                    value={activityForm.label}
                    onValueChange={(value) => setActivityForm({ ...activityForm, label: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOVE IN">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-500" />
                          MOVE IN
                        </span>
                      </SelectItem>
                      <SelectItem value="MOVE OUT">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          MOVE OUT
                        </span>
                      </SelectItem>
                      <SelectItem value="INSPECTION">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          INSPECTION
                        </span>
                      </SelectItem>
                      <SelectItem value="RENEWAL">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          RENEWAL
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Assign To</Label>
                  <Select
                    value={activityForm.assignTo}
                    onValueChange={(value) => setActivityForm({ ...activityForm, assignTo: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Laura Taylor">Laura Taylor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Status</Label>
                <Select
                  value={activityForm.status}
                  onValueChange={(value) => setActivityForm({ ...activityForm, status: value })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    </SelectItem>
                    <SelectItem value="In Progress">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        In Progress
                      </span>
                    </SelectItem>
                    <SelectItem value="Completed">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Completed
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t rounded-b-lg">
              <Button variant="outline" onClick={() => setShowAddActivityDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveActivity}
                disabled={!activityForm.date || !activityForm.description}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default UnitDetailPage
