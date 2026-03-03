"use client"

import { OwnerOverviewTasks } from "./Tasks"
import { OwnerOverviewActivity, type OwnerOverviewActivitySummary } from "./Activity"
import { OwnerKPI } from "./OwnerKPI"
import type { OwnerTask, CommunicationItem } from "../../types"

export interface OwnerOverviewProps {
  // Tasks
  tasks: OwnerTask[]
  onNewTask: () => void
  onViewTask: (task: OwnerTask) => void
  onEditTask: (task: OwnerTask) => void
  onMarkComplete: (taskId: string) => void
  getStatusBadgeStyle: (status: OwnerTask["status"]) => string
  getPriorityBadgeStyle: (priority: OwnerTask["priority"]) => string
  // Activity
  pinnedCommunications: CommunicationItem[]
  unpinnedCommunications: CommunicationItem[]
  renderCommunicationItem: (item: CommunicationItem, index: number, isPinned?: boolean) => React.ReactNode
  activityTileFilter: "all" | "emails" | "sms" | "notes"
  setActivityTileFilter: (v: "all" | "emails" | "sms" | "notes") => void
  activityRadioFilter: "all" | "unread" | "unresponded"
  setActivityRadioFilter: (v: "all" | "unread" | "unresponded") => void
  activityChatTab: "private" | "group"
  setActivityChatTab: (v: "private" | "group") => void
  activitySummary: OwnerOverviewActivitySummary
  hasUnreadPrivate?: boolean
  hasUnreadGroup?: boolean
  // KPI (optional overrides)
  kpiProps?: Partial<React.ComponentProps<typeof OwnerKPI>>
}

export function OwnerOverview({
  tasks,
  onNewTask,
  onViewTask,
  onEditTask,
  onMarkComplete,
  getStatusBadgeStyle,
  getPriorityBadgeStyle,
  pinnedCommunications,
  unpinnedCommunications,
  renderCommunicationItem,
  activityTileFilter,
  setActivityTileFilter,
  activityRadioFilter,
  setActivityRadioFilter,
  activityChatTab,
  setActivityChatTab,
  activitySummary,
  hasUnreadPrivate,
  hasUnreadGroup,
  kpiProps,
}: OwnerOverviewProps) {
  return (
    <div className="mt-4 space-y-4">
      <OwnerOverviewTasks
        tasks={tasks}
        onNewTask={onNewTask}
        onViewTask={onViewTask}
        onEditTask={onEditTask}
        onMarkComplete={onMarkComplete}
        getStatusBadgeStyle={getStatusBadgeStyle}
        getPriorityBadgeStyle={getPriorityBadgeStyle}
      />

      <OwnerOverviewActivity
        pinnedItems={pinnedCommunications}
        unpinnedItems={unpinnedCommunications}
        renderItem={renderCommunicationItem}
        tileFilter={activityTileFilter}
        onTileFilterChange={setActivityTileFilter}
        radioFilter={activityRadioFilter}
        onRadioFilterChange={setActivityRadioFilter}
        chatTab={activityChatTab}
        onChatTabChange={setActivityChatTab}
        summary={activitySummary}
        hasUnreadPrivate={hasUnreadPrivate}
        hasUnreadGroup={hasUnreadGroup}
      />

      <OwnerKPI {...kpiProps} />
    </div>
  )
}
