import { useMemo, useState } from "react"
import type { Task, TaskSummary } from "../types"
import type { StaffMember } from "../components/TasksCard"

const DEFAULT_STAFF_MEMBERS: StaffMember[] = [
  { id: 1, name: "Nina Patel", role: "Leasing Manager" },
  { id: 2, name: "Richard Surovi", role: "Property Manager" },
  { id: 3, name: "Mike Johnson", role: "Maintenance Tech" },
  { id: 4, name: "Sarah Chen", role: "Leasing Agent" },
  { id: 5, name: "David Wilson", role: "Operations Manager" },
]

const DEFAULT_ESCALATION_STAFF: StaffMember[] = [
  { id: 1, name: "David Wilson", role: "CSM" },
  { id: 2, name: "Oliver Torres", role: "VP" },
  { id: 3, name: "Taylor Johnson", role: "GM" },
  { id: 4, name: "Kimberly Johnson", role: "Executive/MD" },
  { id: 5, name: "David Kim", role: "CSM" },
]

interface UseTasksCardStateOptions {
  tasks: Task[]
  staffMembers?: StaffMember[]
  escalatedToStaffMembers?: StaffMember[]
}

export function useTasksCardState({
  tasks,
  staffMembers = DEFAULT_STAFF_MEMBERS,
  escalatedToStaffMembers = DEFAULT_ESCALATION_STAFF,
}: UseTasksCardStateOptions) {
  const [searchQuery, setSearchQuery] = useState("")
  const [assignmentOverrides, setAssignmentOverrides] = useState<Record<number, string>>({})
  const [riskOverrides, setRiskOverrides] = useState<Record<number, string>>({})
  const [escalatedTo, setEscalatedTo] = useState<Record<number, string>>({})
  const [noteOverrides, setNoteOverrides] = useState<Record<number, string>>({})

  const handleAssignTask = (taskId: number, staffName: string) => {
    setAssignmentOverrides((prev) => ({ ...prev, [taskId]: staffName }))
  }

  const handleUpdateRisk = (taskId: number, risk: string) => {
    setRiskOverrides((prev) => ({ ...prev, [taskId]: risk }))
  }

  const handleEscalateTask = (taskId: number, staffName: string) => {
    setEscalatedTo((prev) => ({ ...prev, [taskId]: staffName }))
  }

  const handleUpdateNote = (taskId: number, note: string) => {
    setNoteOverrides((prev) => ({ ...prev, [taskId]: note }))
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (!searchQuery) return true
        return t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      })
      .map((t) => ({
        ...t,
        ...(assignmentOverrides[t.id] && { assignedTo: assignmentOverrides[t.id] }),
        ...(riskOverrides[t.id] && { risk: riskOverrides[t.id] }),
        ...(escalatedTo[t.id] && { escalatedTo: escalatedTo[t.id] }),
        ...(noteOverrides[t.id] !== undefined && { notes: noteOverrides[t.id] }),
      }))
  }, [tasks, searchQuery, assignmentOverrides, riskOverrides, escalatedTo, noteOverrides])

  const taskSummary = useMemo(
    (): TaskSummary => ({
      total: filteredTasks.length,
      overdue: filteredTasks.filter((t) => t.overdue).length,
      dueToday: filteredTasks.filter((t) => t.dueDate === new Date().toISOString().slice(0, 10)).length,
      dueThisWeek: filteredTasks.filter((t) => !t.overdue).length,
    }),
    [filteredTasks],
  )

  return {
    filteredTasks,
    taskSummary,
    searchQuery,
    setSearchQuery,
    staffMembers,
    escalatedToStaffMembers,
    escalatedTo,
    onAssignTask: handleAssignTask,
    onUpdateRisk: handleUpdateRisk,
    onEscalateTask: handleEscalateTask,
    onUpdateNote: handleUpdateNote,
  }
}
