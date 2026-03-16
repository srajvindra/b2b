"use client"

import { useMemo } from "react"
import type { OwnerTask } from "../../types"
import { TasksCard } from "@/features/dashboard/components/TasksCard"
import { useTasksCardState } from "@/features/dashboard/hooks/useTasksCardState"
import type { Task } from "@/features/dashboard/types"
import { useParams } from "next/navigation"
export interface OwnerOverviewTasksProps {
  tasks: OwnerTask[]
}

const ENTITY_TYPE_MAP: Record<string, Task["entityType"]> = {
  Tenant: "tenant",
  Property: "property",
  "Lease Prospect": "leaseProspect",
  Owner: "owner",
  "Prospect Owner": "prospectOwner",
}

export function OwnerOverviewTasks({ tasks }: OwnerOverviewTasksProps) {
  const params = useParams()
  const id = params.id as string
  const dashboardTasks = useMemo<Task[]>(
    () =>
      tasks.map((t, idx) => ({
        id: typeof t.id === "string" ? idx + 1 : Number(t.id),
        title: t.title,
        dueDate: t.dueDate,
        priority: t.priority.toLowerCase(),
        entity: t.relatedEntityName
          ? `${t.relatedEntityName} (${t.relatedEntityType})`
          : t.assignee,
        entityType: ENTITY_TYPE_MAP[t.relatedEntityType || "Owner"] || "owner",
        risk: "Operational",
        overdue: t.isOverdue || false,
        assignedTo: t.assignee,
        escalatedTo: t.escalatedTo || "",
        status: t.status,
        processName: t.processName || undefined,
        processEntityType: t.processName
          ? ENTITY_TYPE_MAP[t.relatedEntityType || "Owner"] || "owner"
          : undefined,
        autoCreated: t.autoCreated,
      })),
    [tasks],
  )

  const tasksCardState = useTasksCardState({ tasks: dashboardTasks })

  return (
    <div id="tasks-section">
      <TasksCard selectedStaff={null} {...tasksCardState} processRoute={{
        basePath: "contacts/owners",
        // categoryId: categoryId as string,
        leadId: id as string,
      }} />
    </div>
  )
}
