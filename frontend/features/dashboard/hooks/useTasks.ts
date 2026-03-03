"use client"

import { useState, useMemo } from "react"
import { mockTasks } from "../data/mockTasks"
import type { Task, TaskSummary } from "../types"

const STAFF_MEMBERS = [
  { id: 1, name: "Nina Patel", role: "Leasing Manager" },
  { id: 2, name: "Richard Surovi", role: "Property Manager" },
  { id: 3, name: "Mike Johnson", role: "Maintenance Tech" },
  { id: 4, name: "Sarah Chen", role: "Leasing Agent" },
  { id: 5, name: "David Wilson", role: "Operations Manager" },
]

export function useTasks() {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [tasksSearchQuery, setTasksSearchQuery] = useState("")

  const filteredStaffMembers = useMemo(
    () =>
      STAFF_MEMBERS.filter((s) =>
        s.name.toLowerCase().includes(tasksSearchQuery.toLowerCase())
      ),
    [tasksSearchQuery]
  )

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((t) => {
      const matchesStaff = selectedStaff ? t.assignedTo === selectedStaff : true
      const matchesSearch = tasksSearchQuery
        ? t.assignedTo.toLowerCase().includes(tasksSearchQuery.toLowerCase())
        : true
      return matchesStaff && matchesSearch
    })
  }, [selectedStaff, tasksSearchQuery])

  const taskSummary = useMemo(
    (): TaskSummary => ({
      total: filteredTasks.length,
      overdue: filteredTasks.filter((t) => t.overdue).length,
      dueToday: filteredTasks.filter((t) => t.dueDate === "2025-12-23").length,
      dueThisWeek: filteredTasks.filter(
        (t) => !t.overdue && t.dueDate <= "2025-12-29"
      ).length,
    }),
    [filteredTasks]
  )

  return {
    filteredTasks,
    taskSummary,
    selectedStaff,
    setSelectedStaff,
    searchQuery: tasksSearchQuery,
    setSearchQuery: setTasksSearchQuery,
    staffMembers: STAFF_MEMBERS,
    filteredStaffMembers,
  }
}
