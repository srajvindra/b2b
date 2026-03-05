"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageSquare, Users, CheckSquare, Workflow, LayoutList } from "lucide-react"
import type { Communication, Task } from "../types"

export type CombinedItem =
  | { kind: "comm"; sortDate: Date; comm: Communication }
  | { kind: "task"; sortDate: Date; task: Task }

export interface CombinedProps {
  combinedItems: CombinedItem[]
  onCommunicationClick?: (comm: Communication) => void
  onTaskClick?: (task: Task) => void
  onProcessClick?: (task: Task) => void
  getPriorityStyles?: (priority: string) => string
  getStatusStyles?: (status: string) => string
}

const defaultPriorityStyles = (_priority: string) => "bg-gray-100 text-gray-700 border-gray-200"
const defaultStatusStyles = (_status: string) => "bg-gray-50 text-gray-600 border-gray-200"

export function Combined({
  combinedItems,
  onCommunicationClick,
  onTaskClick,
  onProcessClick,
  getPriorityStyles = defaultPriorityStyles,
  getStatusStyles = defaultStatusStyles,
}: CombinedProps) {
  return (
    <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-800 rounded">
              <LayoutList className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-base font-semibold text-slate-900">All Activity</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">{combinedItems.length} items</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="max-h-[500px] overflow-y-auto pr-1">
          <div className="flex flex-col gap-2">
            {combinedItems.length > 0 ? (
              combinedItems.map((item) => {
                if (item.kind === "comm") {
                  const comm = item.comm
                  return (
                    <div
                      key={`comm-${comm.id}`}
                      onClick={() => onCommunicationClick?.(comm)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onCommunicationClick?.(comm)
                        }
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all hover:shadow-sm rounded-lg border"
                      style={{
                        backgroundColor: comm.type === "email" ? "#E6F4EA" : comm.type === "call" ? "#E0F7F6" : "#E3F2FD",
                        borderColor: comm.type === "email" ? "#c8e6cc" : comm.type === "call" ? "#b3e8e5" : "#BBDEFB",
                      }}
                    >
                      <div
                        className="p-2 rounded-full relative shrink-0"
                        style={{
                          backgroundColor: comm.type === "email" ? "#c8e6cc" : comm.type === "call" ? "#b3e8e5" : "#BBDEFB",
                        }}
                      >
                        {comm.type === "email" ? (
                          <Mail className="h-4 w-4 text-green-800" />
                        ) : comm.type === "call" ? (
                          <Phone className="h-4 w-4 text-teal-800" />
                        ) : comm.isGroupSms ? (
                          <Users className="h-4 w-4 text-blue-800" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-blue-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 w-[160px] shrink-0 min-w-0">
                          {!comm.read && <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />}
                          <p className="text-sm font-medium truncate text-slate-800">{comm.from}</p>
                          {comm.type === "text" && comm.isGroupSms && (
                            <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full shrink-0">
                              Group
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 truncate flex-1 min-w-0">{comm.preview}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-slate-500 whitespace-nowrap">{comm.timestamp}</span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap">{comm.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                const task = item.task
                return (
                  <div
                    key={`task-${task.id}`}
                    onClick={() => onTaskClick?.(task)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onTaskClick?.(task)
                      }
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all hover:shadow-sm rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="p-2 rounded-full shrink-0 bg-slate-100">
                      <CheckSquare className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      <div className="flex flex-col gap-0.5 w-[200px] shrink-0 min-w-0">
                        <p className="text-sm font-medium truncate text-slate-800">{task.title}</p>
                        {task.processName && onProcessClick && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onProcessClick(task)
                            }}
                            className="flex items-center gap-1 text-[10px] text-teal-600 hover:text-teal-700 hover:underline w-fit"
                          >
                            <Workflow className="h-3 w-3" />
                            {task.processName}
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate flex-1 min-w-0">{task.entity}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[11px] whitespace-nowrap ${task.overdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                          {task.dueDate}{task.overdue ? " (Overdue)" : ""}
                        </span>
                        <Badge variant="outline" className={`text-[10px] font-medium capitalize ${getPriorityStyles(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] font-medium ${getStatusStyles(task.status)}`}>
                          {task.status}
                        </Badge>
                        <span className="text-[11px] text-slate-500 whitespace-nowrap">{task.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-slate-500">
                No activity found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
