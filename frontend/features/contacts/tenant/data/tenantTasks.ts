import type { OwnerTask } from "@/features/contacts/types"

export function getTenantTasks(): OwnerTask[] {
  return [
    { id: "task1", title: "Follow up with tenant - Unit 204 lease renewal", processName: "Lease Renewal Process", relatedEntityType: "Tenant", relatedEntityName: "John Smith", assignee: "Nina Patel", status: "Pending", priority: "High", dueDate: "2025-12-20", isOverdue: true },
    { id: "task2", title: "Finish Move-out tenant in Appfolio and update property", processName: "Move Out for 123 Oak Street", relatedEntityType: "Property", relatedEntityName: "Maple Heights", assignee: "Richard Surovi", status: "In Progress", priority: "High", dueDate: "2025-12-21", isOverdue: true },
    { id: "task3", title: "Review rental application - Sarah Johnson", processName: "Lease Prospect Onboarding", relatedEntityType: "Lease Prospect", relatedEntityName: "Sarah Johnson", assignee: "Nina Patel", status: "Pending", priority: "High", dueDate: "2025-12-23" },
    { id: "task4", title: "Schedule maintenance for HVAC - Oak Manor", relatedEntityType: "Property", relatedEntityName: "Oak Manor", assignee: "Mike Johnson", status: "Pending", priority: "Medium", dueDate: "2025-12-23" },
    { id: "task5", title: "Send lease agreement - Unit 305", processName: "New Lease Signing", relatedEntityType: "Lease Prospect", relatedEntityName: "Unit 305", assignee: "Sarah Chen", status: "In Progress", priority: "Medium", dueDate: "2025-12-24" },
    { id: "task6", title: "Inspect unit condition - Unit 108", processName: "Move Out for 456 Elm Ave", relatedEntityType: "Property", relatedEntityName: "Elm Court", assignee: "Mike Johnson", status: "Pending", priority: "Medium", dueDate: "2025-12-26" },
    { id: "task7", title: "Process security deposit return - Unit 204", processName: "Move Out for 123 Oak Street", relatedEntityType: "Tenant", relatedEntityName: "John Smith", assignee: "Nina Patel", status: "Pending", priority: "Low", dueDate: "2025-12-28" },
    { id: "task8", title: "Update tenant contact info in system", relatedEntityType: "Tenant", relatedEntityName: "Lisa Chen", assignee: "Richard Surovi", status: "Pending", priority: "Low", dueDate: "2025-12-30" },
  ]
}
