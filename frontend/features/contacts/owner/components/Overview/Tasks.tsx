"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Workflow, Eye, Edit, Check } from "lucide-react"
import type { OwnerTask } from "../../types"

export interface OwnerOverviewTasksProps {
  tasks: OwnerTask[]
  onNewTask: () => void
  onViewTask: (task: OwnerTask) => void
  onEditTask: (task: OwnerTask) => void
  onMarkComplete: (taskId: string) => void
  getStatusBadgeStyle: (status: OwnerTask["status"]) => string
  getPriorityBadgeStyle: (priority: OwnerTask["priority"]) => string
}

export function OwnerOverviewTasks({
  tasks,
  onNewTask,
  onViewTask,
  onEditTask,
  onMarkComplete,
  getStatusBadgeStyle,
  getPriorityBadgeStyle,
}: OwnerOverviewTasksProps) {
  return (
    <Card id="tasks-section">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-teal-600" />
            Tasks ({tasks.length})
          </h3>
          <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700" onClick={onNewTask}>
            <Plus className="h-3 w-3 mr-1" />
            New Task
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[320px] overflow-y-auto">
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
                {tasks.map((task) => (
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
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          task.priority === "High"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : task.priority === "Medium"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Task" onClick={() => onViewTask(task)}>
                          <Eye className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Task" onClick={() => onEditTask(task)}>
                          <Edit className="h-4 w-4 text-slate-500" />
                        </Button>
                        {task.status !== "Completed" && task.status !== "Skipped" && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Mark Complete" onClick={() => onMarkComplete(task.id)}>
                            <Check className="h-4 w-4 text-slate-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-sm text-muted-foreground">
                      No tasks yet. Click "New Task" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
