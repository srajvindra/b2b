"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CheckSquare,
  Workflow,
  Eye,
  Edit,
  Check,
  Search,
  Filter,
  Plus,
  X,
} from "lucide-react"
import { getTasks } from "@/features/contacts/data/ownerDetailData"
import type { OwnerTask } from "@/features/contacts/types"

type EntityType = "Tenant" | "Owner" | "Prospect Owner" | "Lease Prospect" | "Property"

const ENTITY_OPTIONS: EntityType[] = ["Tenant", "Owner", "Prospect Owner", "Lease Prospect", "Property"]

const ALL_STAFF = [
  "Nina Patel",
  "Richard Surovi",
  "Mike Johnson",
  "Sarah Chen",
  "Raj Patel",
  "James Cooper",
]

const getStatusBadgeStyle = (status: OwnerTask["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Skipped":
      return "bg-orange-100 text-orange-700 border-orange-200"
    case "Pending":
      return "bg-gray-100 text-gray-700 border-gray-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

const getPriorityBadgeStyle = (priority: OwnerTask["priority"]) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 border-red-200"
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "Low":
      return "bg-slate-100 text-slate-700 border-slate-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export function AllTaskPage() {
  const [tasks, setTasks] = useState<OwnerTask[]>(getTasks())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntities, setSelectedEntities] = useState<EntityType[]>([])
  const [selectedStaff, setSelectedStaff] = useState<string[]>([])
  const [entityPopoverOpen, setEntityPopoverOpen] = useState(false)
  const [staffPopoverOpen, setStaffPopoverOpen] = useState(false)

  const [viewTaskModalOpen, setViewTaskModalOpen] = useState(false)
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<OwnerTask | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    relatedEntityType: "" as string,
    relatedEntityName: "",
  })

  const toggleEntity = (entity: EntityType) => {
    setSelectedEntities((prev) =>
      prev.includes(entity) ? prev.filter((e) => e !== entity) : [...prev, entity],
    )
  }

  const toggleStaff = (staff: string) => {
    setSelectedStaff((prev) =>
      prev.includes(staff) ? prev.filter((s) => s !== staff) : [...prev, staff],
    )
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          task.title.toLowerCase().includes(q) ||
          (task.processName && task.processName.toLowerCase().includes(q)) ||
          task.assignee.toLowerCase().includes(q) ||
          (task.relatedEntityName && task.relatedEntityName.toLowerCase().includes(q))
        if (!matchesSearch) return false
      }

      if (selectedEntities.length > 0 && task.relatedEntityType) {
        if (!selectedEntities.includes(task.relatedEntityType as EntityType)) return false
      }

      if (selectedStaff.length > 0) {
        if (!selectedStaff.includes(task.assignee)) return false
      }

      return true
    })
  }, [tasks, searchQuery, selectedEntities, selectedStaff])

  const hasActiveFilters = selectedEntities.length > 0 || selectedStaff.length > 0

  const clearFilters = () => {
    setSelectedEntities([])
    setSelectedStaff([])
    setSearchQuery("")
  }

  const handleViewTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setViewTaskModalOpen(true)
  }

  const handleEditTask = (task: OwnerTask) => {
    setSelectedTask(task)
    setEditTaskModalOpen(true)
  }

  const handleMarkComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "Completed" as const } : task)))
  }

  const handleSaveTask = () => {
    if (selectedTask) {
      setTasks(tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)))
      setEditTaskModalOpen(false)
      setViewTaskModalOpen(false)
      setSelectedTask(null)
    }
  }

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return
    const task: OwnerTask = {
      id: `t${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      status: "Pending",
      priority: newTask.priority,
      relatedEntityType: (newTask.relatedEntityType as OwnerTask["relatedEntityType"]) || undefined,
      relatedEntityName: newTask.relatedEntityName || undefined,
      createdDate: new Date().toLocaleDateString(),
    }
    setTasks([...tasks, task])
    setShowNewTaskModal(false)
    setNewTask({ title: "", description: "", assignee: "", dueDate: "", priority: "Medium", relatedEntityType: "", relatedEntityName: "" })
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-teal-600" />
              All Tasks ({filteredTasks.length})
            </h3>
            {/* <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-1" onClick={() => setShowNewTaskModal(true)}>
              <Plus className="h-4 w-4" />
              New Task
            </Button> */}
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            {/* Staff Filter */}
            <Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={`h-9 gap-1.5 ${selectedStaff.length > 0 ? "border-teal-500 text-teal-700 bg-teal-50" : ""}`}>
                  <Filter className="h-3.5 w-3.5" />
                  Staff
                  {selectedStaff.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                      {selectedStaff.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="space-y-1">
                  {ALL_STAFF.map((staff) => (
                    <label key={staff} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-sm">
                      <Checkbox
                        checked={selectedStaff.includes(staff)}
                        onCheckedChange={() => toggleStaff(staff)}
                      />
                      {staff}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Entity Filter */}
            <Popover open={entityPopoverOpen} onOpenChange={setEntityPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={`h-9 gap-1.5 ${selectedEntities.length > 0 ? "border-teal-500 text-teal-700 bg-teal-50" : ""}`}>
                  <Filter className="h-3.5 w-3.5" />
                  Entities
                  {selectedEntities.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                      {selectedEntities.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="space-y-1">
                  {ENTITY_OPTIONS.map((entity) => (
                    <label key={entity} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-sm">
                      <Checkbox
                        checked={selectedEntities.includes(entity)}
                        onCheckedChange={() => toggleEntity(entity)}
                      />
                      {entity}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground gap-1" onClick={clearFilters}>
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedStaff.map((staff) => (
                <Badge key={staff} variant="secondary" className="text-xs gap-1 bg-teal-50 text-teal-700 border border-teal-200">
                  {staff}
                  <button onClick={() => toggleStaff(staff)} className="hover:text-teal-900">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedEntities.map((entity) => (
                <Badge key={entity} variant="secondary" className="text-xs gap-1 bg-blue-50 text-blue-700 border border-blue-200">
                  {entity}
                  <button onClick={() => toggleEntity(entity)} className="hover:text-blue-900">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Tasks Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Task</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Related Entity</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Due Date</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Priority</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Assigned To</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-slate-800">{task.title}</span>
                          {task.processName && (
                            <div className="flex items-center gap-1">
                              <Workflow className="h-3 w-3 text-teal-600" />
                              <span className="text-xs text-teal-600">{task.processName}</span>
                            </div>
                          )}
                          {task.autoCreated && <span className="text-xs text-muted-foreground">Auto-created</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-slate-600">
                          {task.relatedEntityType}: {task.relatedEntityName}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <span className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-slate-600"}`}>{task.dueDate}</span>
                          {task.isOverdue && <span className="text-xs text-red-500">(Overdue)</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-xs ${getPriorityBadgeStyle(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeStyle(task.status)}`}>
                          {task.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-slate-600">{task.assignee}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Task" onClick={() => handleViewTask(task)}>
                            <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Task" onClick={() => handleEditTask(task)}>
                            <Edit className="h-4 w-4 text-slate-500" />
                          </Button>
                          {task.status !== "Completed" && task.status !== "Skipped" && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Mark Complete" onClick={() => handleMarkComplete(task.id)}>
                              <Check className="h-4 w-4 text-slate-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                        {hasActiveFilters || searchQuery
                          ? "No tasks match your filters."
                          : "No tasks yet. Click \"New Task\" to create one."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Task Dialog */}
      <Dialog open={viewTaskModalOpen} onOpenChange={setViewTaskModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-slate-600" />
              Task Details
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Task Title</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{selectedTask.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <p className="text-sm text-slate-600 mt-1">{selectedTask.description || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                      {selectedTask.assignee.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm text-slate-700">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`text-xs ${getStatusBadgeStyle(selectedTask.status)}`}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                  <p className="text-sm text-slate-700 mt-1">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={`text-xs ${getPriorityBadgeStyle(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedTask.relatedEntityType && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Related Entity</label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTask.relatedEntityType}: {selectedTask.relatedEntityName}
                  </p>
                </div>
              )}
              {selectedTask.createdDate && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Created Date</label>
                  <p className="text-sm text-slate-700 mt-1">{selectedTask.createdDate}</p>
                </div>
              )}
              {selectedTask.propertyName && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Property</label>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedTask.propertyName}{selectedTask.propertyAddress ? ` - ${selectedTask.propertyAddress}` : ""}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTaskModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editTaskModalOpen} onOpenChange={setEditTaskModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-slate-600" />
              Edit Task
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter task title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                <Textarea
                  className="mt-1"
                  value={selectedTask.description || ""}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                  <Input
                    type="date"
                    className="mt-1"
                    value={selectedTask.dueDate}
                    onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, status: value as OwnerTask["status"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Skipped">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
                  <Select
                    value={selectedTask.priority}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, priority: value as OwnerTask["priority"] })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Assignee</Label>
                  <Input
                    className="mt-1"
                    placeholder="Enter assignee"
                    value={selectedTask.assignee}
                    onChange={(e) => setSelectedTask({ ...selectedTask, assignee: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} className="bg-slate-800 hover:bg-slate-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-teal-600" />
              Create New Task
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
              <Input
                className="mt-1"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <Textarea
                className="mt-1"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Related Entity Type</Label>
                <Select value={newTask.relatedEntityType} onValueChange={(value) => setNewTask({ ...newTask, relatedEntityType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tenant">Tenant</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Prospect Owner">Prospect Owner</SelectItem>
                    <SelectItem value="Lease Prospect">Lease Prospect</SelectItem>
                    <SelectItem value="Property">Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Entity Name</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter name"
                  value={newTask.relatedEntityName}
                  onChange={(e) => setNewTask({ ...newTask, relatedEntityName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Assignee</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter assignee name"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "High" | "Medium" | "Low") => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateTask} disabled={!newTask.title.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
