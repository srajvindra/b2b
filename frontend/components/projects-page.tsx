"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  Trash2,
  Calendar,
  User,
  Building,
  ClipboardList,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Task {
  id: string
  name: string
  description: string
  createdDate: string
  dueDate: string
  assignedTo: string
  assignedToRole: string
  property: string
  status: "upcoming" | "completed" | "overdue"
  notes: string
}

const staffMembers = [
  { id: "1", name: "Nina Patel", role: "Leasing Manager" },
  { id: "2", name: "Richard Surovi", role: "Property Manager" },
  { id: "3", name: "Mike Johnson", role: "Maintenance Tech" },
  { id: "4", name: "Sarah Chen", role: "Leasing Agent" },
  { id: "5", name: "David Wilson", role: "Operations Manager" },
]

const properties = [
  { id: "1", name: "Riverside Heights" },
  { id: "2", name: "Cedar Point" },
  { id: "3", name: "Downtown Lofts" },
  { id: "4", name: "Maple Ridge" },
  { id: "5", name: "Summit Place" },
]

const initialTasks: Task[] = [
  {
    id: "1",
    name: "Complete move-in inspection",
    description: "Perform detailed move-in inspection for new tenant",
    createdDate: "2025-01-03",
    dueDate: "2025-01-10",
    assignedTo: "Nina Patel",
    assignedToRole: "Leasing Manager",
    property: "Riverside Heights",
    status: "upcoming",
    notes: "Check all appliances and document any existing damage",
  },
  {
    id: "2",
    name: "Review lease renewal application",
    description: "Review and approve lease renewal for Unit 204",
    createdDate: "2025-01-01",
    dueDate: "2025-01-05",
    assignedTo: "Sarah Chen",
    assignedToRole: "Leasing Agent",
    property: "Cedar Point",
    status: "overdue",
    notes: "Tenant has been a good renter for 2 years",
  },
  {
    id: "3",
    name: "Schedule HVAC maintenance",
    description: "Coordinate annual HVAC system maintenance",
    createdDate: "2024-12-28",
    dueDate: "2025-01-08",
    assignedTo: "Mike Johnson",
    assignedToRole: "Maintenance Tech",
    property: "Downtown Lofts",
    status: "upcoming",
    notes: "Multiple units need filter replacement",
  },
  {
    id: "4",
    name: "Process security deposit refund",
    description: "Calculate and process deposit return for departed tenant",
    createdDate: "2024-12-20",
    dueDate: "2024-12-30",
    assignedTo: "Richard Surovi",
    assignedToRole: "Property Manager",
    property: "Maple Ridge",
    status: "completed",
    notes: "Deduct $150 for carpet cleaning",
  },
  {
    id: "5",
    name: "Update property listing photos",
    description: "Take new photos for vacant unit listing",
    createdDate: "2025-01-02",
    dueDate: "2025-01-12",
    assignedTo: "Sarah Chen",
    assignedToRole: "Leasing Agent",
    property: "Summit Place",
    status: "upcoming",
    notes: "Focus on updated kitchen renovations",
  },
  {
    id: "6",
    name: "Conduct quarterly property inspection",
    description: "Perform routine quarterly inspection",
    createdDate: "2024-12-15",
    dueDate: "2024-12-25",
    assignedTo: "David Wilson",
    assignedToRole: "Operations Manager",
    property: "Riverside Heights",
    status: "completed",
    notes: "All units passed inspection",
  },
  {
    id: "7",
    name: "Follow up on maintenance request",
    description: "Check status of plumbing repair in Unit 305",
    createdDate: "2025-01-04",
    dueDate: "2025-01-06",
    assignedTo: "Mike Johnson",
    assignedToRole: "Maintenance Tech",
    property: "Cedar Point",
    status: "upcoming",
    notes: "Tenant reported slow drain in bathroom",
  },
  {
    id: "8",
    name: "Prepare move-out checklist",
    description: "Create move-out documentation for departing tenant",
    createdDate: "2024-12-22",
    dueDate: "2025-01-02",
    assignedTo: "Nina Patel",
    assignedToRole: "Leasing Manager",
    property: "Downtown Lofts",
    status: "overdue",
    notes: "Schedule final walkthrough with tenant",
  },
]

export default function ProjectsPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    property: "",
    assignedTo: "",
    dueDate: "",
    notes: "",
  })

  // Filter tasks based on search query and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateTask = () => {
    const staffMember = staffMembers.find((s) => s.id === newTask.assignedTo)
    const newTaskObj: Task = {
      id: String(tasks.length + 1),
      name: newTask.name,
      description: newTask.description,
      createdDate: new Date().toISOString().split("T")[0],
      dueDate: newTask.dueDate,
      assignedTo: staffMember?.name || "",
      assignedToRole: staffMember?.role || "",
      property: properties.find((p) => p.id === newTask.property)?.name || "",
      status: "upcoming",
      notes: newTask.notes,
    }
    setTasks([...tasks, newTaskObj])
    setIsCreateDialogOpen(false)
    setNewTask({
      name: "",
      description: "",
      property: "",
      assignedTo: "",
      dueDate: "",
      notes: "",
    })
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "completed" as const } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleViewTask = (task: Task) => {
    setSelectedTask(task)
    setIsViewDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setNewTask({
      name: task.name,
      description: task.description,
      property: properties.find((p) => p.name === task.property)?.id || "",
      assignedTo: staffMembers.find((s) => s.name === task.assignedTo)?.id || "",
      dueDate: task.dueDate,
      notes: task.notes,
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedTask) return
    const staffMember = staffMembers.find((s) => s.id === newTask.assignedTo)
    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              name: newTask.name,
              description: newTask.description,
              property: properties.find((p) => p.id === newTask.property)?.name || task.property,
              assignedTo: staffMember?.name || task.assignedTo,
              assignedToRole: staffMember?.role || task.assignedToRole,
              dueDate: newTask.dueDate,
              notes: newTask.notes,
            }
          : task,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedTask(null)
    setNewTask({
      name: "",
      description: "",
      property: "",
      assignedTo: "",
      dueDate: "",
      notes: "",
    })
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">Manage tasks assigned to staff members</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by employee name or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`rounded-r-none ${viewMode === "grid" ? "bg-gray-100" : ""}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className={`rounded-l-none ${viewMode === "table" ? "bg-gray-100" : ""}`}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task Count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium text-[rgba(1,96,209,1)]">{task.name}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(task.createdDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{task.assignedTo}</p>
                        <p className="text-xs text-gray-500">{task.assignedToRole}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{formatDate(task.dueDate)}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewTask(task)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Task
                        </DropdownMenuItem>
                        {task.status !== "completed" && (
                          <DropdownMenuItem onClick={() => handleMarkComplete(task.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No tasks found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-1">{task.name}</h3>
                      <p className="text-xs text-gray-500">{task.property}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewTask(task)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditTask(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      {task.status !== "completed" && (
                        <DropdownMenuItem onClick={() => handleMarkComplete(task.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700">{task.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(task.dueDate)}
                  </div>
                  {getStatusBadge(task.status)}
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredTasks.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">No tasks found matching your criteria</div>
          )}
        </div>
      )}

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name</Label>
              <Input
                id="taskName"
                placeholder="Enter task name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select value={newTask.property} onValueChange={(value) => setNewTask({ ...newTask, property: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} - {staff.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Comments</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!newTask.name || !newTask.assignedTo || !newTask.dueDate}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Task Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedTask.name}</h3>
                {getStatusBadge(selectedTask.status)}
              </div>
              <p className="text-gray-600">{selectedTask.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Property</p>
                    <p className="text-sm font-medium">{selectedTask.property}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Assigned To</p>
                    <p className="text-sm font-medium">{selectedTask.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Created Date</p>
                    <p className="text-sm font-medium">{formatDate(selectedTask.createdDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">{formatDate(selectedTask.dueDate)}</p>
                  </div>
                </div>
              </div>
              {selectedTask.notes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTask.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editTaskName">Task Name</Label>
              <Input
                id="editTaskName"
                placeholder="Enter task name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProperty">Property</Label>
              <Select value={newTask.property} onValueChange={(value) => setNewTask({ ...newTask, property: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAssignedTo">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} - {staff.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDueDate">Due Date</Label>
              <Input
                id="editDueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNotes">Notes / Comments</Label>
              <Textarea
                id="editNotes"
                placeholder="Add any additional notes..."
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!newTask.name || !newTask.assignedTo || !newTask.dueDate}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
