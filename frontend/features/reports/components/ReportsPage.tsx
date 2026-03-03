"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  DollarSign,
  TrendingUp,
  Building2,
  Wrench,
  Download,
  Users,
  Calendar,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// Removed duplicate imports for: ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Download, CheckCircle2, Clock, DollarSign, Settings, Wrench, Calendar, User, Building, ChevronsUpDown, Check, cn
import { staffMembers, tasksData, salesData, operationsData, maintenanceData } from "../data/reports"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [selectedStaff, setSelectedStaff] = useState("all")
  const [staffOpen, setStaffOpen] = useState(false)

  const getFilteredStats = (data: {
    history: any[]
    total?: number
    totalOperations?: number
    completed?: number
    pending?: number
    overdue?: number
    leasesSigned?: number
    avgLeaseValue?: number
    conversionRate?: number
    inspections?: number
    moveIns?: number
    moveOuts?: number
    totalRequests?: number
    inProgress?: number
  }) => {
    if (selectedStaff === "all") {
      return {
        total: data.total || data.leasesSigned || data.totalOperations || data.totalRequests || 0,
        completed: data.completed || 0,
        pending: data.pending || data.inProgress || 0,
        overdue: data.overdue || data.moveOuts || 0, // Using moveOuts as a proxy for "lost" or "scheduled" if no other clear mapping
      }
    }

    const filteredHistory = data.history.filter((item) => item.staff === selectedStaff)
    return {
      total: filteredHistory.length,
      completed: filteredHistory.filter((item) => item.status === "Completed" || item.status === "Closed Won").length,
      pending: filteredHistory.filter((item) => item.status === "Pending" || item.status === "In Progress").length,
      overdue: filteredHistory.filter(
        (item) => item.status === "Overdue" || item.status === "Lost" || item.status === "Scheduled",
      ).length,
    }
  }

  const getFilteredChartData = (monthlyData: any[], staffName: string) => {
    if (staffName === "all") {
      return monthlyData
    }
    // When a staff is selected, scale down the chart data proportionally
    // This is a simplified approach - in a real app, you'd have per-staff monthly data
    const scaleFactor = 0.3 // Approximate portion for one staff member
    return monthlyData.map((item) => ({
      ...item,
      completed: Math.round(item.completed * scaleFactor),
      pending: Math.round(item.pending * scaleFactor),
      inProgress: item.inProgress ? Math.round(item.inProgress * scaleFactor) : undefined,
      revenue: item.revenue ? Math.round(item.revenue * scaleFactor) : undefined,
      leases: item.leases ? Math.round(item.leases * scaleFactor) : undefined,
      closed: item.closed ? Math.round(item.closed * scaleFactor) : undefined,
      inspections: item.inspections ? Math.round(item.inspections * scaleFactor) : undefined,
      moveIns: item.moveIns ? Math.round(item.moveIns * scaleFactor) : undefined,
      moveOuts: item.moveOuts ? Math.round(item.moveOuts * scaleFactor) : undefined,
    }))
  }

  const filteredTasksStats = getFilteredStats(tasksData)
  const filteredSalesStats = getFilteredStats(salesData)
  const filteredOperationsStats = getFilteredStats(operationsData)
  const filteredMaintenanceStats = getFilteredStats(maintenanceData)

  const filteredTasksChartData = getFilteredChartData(tasksData.monthlyData, selectedStaff)
  const filteredSalesChartData = getFilteredChartData(salesData.monthlyData, selectedStaff)
  const filteredOperationsChartData = getFilteredChartData(operationsData.monthlyData, selectedStaff)
  const filteredMaintenanceChartData = getFilteredChartData(maintenanceData.monthlyData, selectedStaff)

  const filterByStaff = <T extends { staff: string }>(data: T[]) => {
    console.log("[v0] filterByStaff called with selectedStaff:", selectedStaff, "data length:", data.length)
    if (selectedStaff === "all") return data
    const filtered = data.filter((item) => item.staff === selectedStaff)
    console.log("[v0] filtered length:", filtered.length)
    return filtered
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
            Completed
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-white text-gray-600 border-gray-300">
            Pending
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-400">
            In Progress
          </Badge>
        )
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-gray-800 text-white border-gray-800">
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return (
          <Badge variant="outline" className="bg-gray-800 text-white border-gray-800">
            Urgent
          </Badge>
        )
      case "High":
        return (
          <Badge variant="outline" className="bg-gray-600 text-white border-gray-600">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-gray-300 text-gray-700 border-gray-400">
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">View performance metrics and history by staff member</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Staff Filter */}
      <Card className="border-gray-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by Staff:</span>
            <Popover open={staffOpen} onOpenChange={setStaffOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={staffOpen}
                  className="w-[280px] justify-between bg-transparent"
                >
                  {selectedStaff === "all"
                    ? "All Staff Members"
                    : staffMembers.find((s) => s.name === selectedStaff)?.name || "Select staff member"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0">
                <Command>
                  <CommandInput placeholder="Search staff member..." />
                  <CommandList>
                    <CommandEmpty>No staff member found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setSelectedStaff("all")
                          setStaffOpen(false)
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedStaff === "all" ? "opacity-100" : "opacity-0")} />
                        All Staff Members
                      </CommandItem>
                      {staffMembers.map((staff) => (
                        <CommandItem
                          key={staff.id}
                          value={staff.name}
                          onSelect={(currentValue) => {
                            // Find the staff by comparing lowercase value since Command lowercases it
                            const selectedStaffMember = staffMembers.find(
                              (s) => s.name.toLowerCase() === currentValue.toLowerCase(),
                            )
                            if (selectedStaffMember) {
                              setSelectedStaff(selectedStaffMember.name)
                            }
                            setStaffOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedStaff === staff.name ? "opacity-100" : "opacity-0")}
                          />
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs bg-gray-200">{staff.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{staff.name}</span>
                            <span className="text-xs text-gray-500">{staff.role}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="tasks" className="gap-2 data-[state=active]:bg-white">
            <CheckCircle2 className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2 data-[state=active]:bg-white">
            <DollarSign className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-2 data-[state=active]:bg-white">
            <Building2 className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2 data-[state=active]:bg-white">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab Content */}
        {activeTab === "tasks" && (
          <div className="space-y-6 mt-6">
            {/* Summary Stats - Use filtered stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Tasks</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredTasksStats.total}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredTasksStats.completed}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Pending</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredTasksStats.pending}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Overdue</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredTasksStats.overdue}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart - Use filtered chart data */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Tasks Completed Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredTasksChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Bar dataKey="completed" fill="#374151" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#9ca3af" name="Pending" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task History */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Task History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {filterByStaff(tasksData.history).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-gray-800 text-white">
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {item.staff
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.task}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{item.staff}</span>
                            <span className="text-gray-300">|</span>
                            <Building2 className="h-3 w-3" />
                            <span>{item.property}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sales Tab Content */}
        {activeTab === "sales" && (
          <div className="space-y-6 mt-6">
            {/* Summary Stats - Use filtered stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Deals</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredSalesStats.total}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Closed Won</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredSalesStats.completed}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredSalesStats.pending}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Hourglass className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Lost</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredSalesStats.overdue}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart - Use filtered chart data */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Deals Closed Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredSalesChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Bar dataKey="closed" fill="#374151" name="Closed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" fill="#9ca3af" name="In Progress" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales History */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Sales History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {filterByStaff(salesData.history).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-gray-800 text-white">
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {item.staff
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{item.staff}</span>
                            <span className="text-gray-300">|</span>
                            <Building2 className="h-3 w-3" />
                            <span>{item.property}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${item.amount.toLocaleString()}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Operations Tab Content */}
        {activeTab === "operations" && (
          <div className="space-y-6 mt-6">
            {/* Summary Stats - Use filtered stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Operations</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredOperationsStats.total}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredOperationsStats.completed}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredOperationsStats.pending}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Hourglass className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Scheduled</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredOperationsStats.overdue}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart - Use filtered chart data */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Operations Completed Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredOperationsChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Bar dataKey="completed" fill="#374151" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" fill="#9ca3af" name="In Progress" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Operations History */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Operations History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {filterByStaff(operationsData.history).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-gray-800 text-white">
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {item.staff
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.operation}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{item.staff}</span>
                            <span className="text-gray-300">|</span>
                            <Building2 className="h-3 w-3" />
                            <span>
                              {item.property} - Unit {item.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Maintenance Tab Content */}
        {activeTab === "maintenance" && (
          <div className="space-y-6 mt-6">
            {/* Summary Stats - Use filtered stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total Requests</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredMaintenanceStats.total}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredMaintenanceStats.completed}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredMaintenanceStats.pending}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Hourglass className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Urgent</p>
                      <p className="text-2xl font-semibold text-gray-900">{filteredMaintenanceStats.overdue}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart - Use filtered chart data */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Maintenance Completed Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredMaintenanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Bar dataKey="completed" fill="#374151" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" fill="#9ca3af" name="In Progress" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Maintenance History */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Maintenance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {filterByStaff(maintenanceData.history).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 bg-gray-800 text-white">
                          <AvatarFallback className="bg-gray-800 text-white text-xs">
                            {item.staff
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.request}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{item.staff}</span>
                            <span className="text-gray-300">|</span>
                            <Building2 className="h-3 w-3" />
                            <span>
                              {item.property} - Unit {item.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                          {getPriorityBadge(item.priority)}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  )
}
