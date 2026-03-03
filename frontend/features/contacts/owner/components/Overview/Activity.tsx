"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bell, Mail, MessageSquare, FileText } from "lucide-react"
import type { CommunicationItem } from "../../types"

export interface OwnerOverviewActivitySummary {
  all: number
  emailsTotal: number
  smsTotal: number
  notes: number
}

export interface OwnerOverviewActivityProps {
  pinnedItems: CommunicationItem[]
  unpinnedItems: CommunicationItem[]
  renderItem: (item: CommunicationItem, index: number, isPinned?: boolean) => React.ReactNode
  tileFilter: "all" | "emails" | "sms" | "notes"
  onTileFilterChange: (v: "all" | "emails" | "sms" | "notes") => void
  radioFilter: "all" | "unread" | "unresponded"
  onRadioFilterChange: (v: "all" | "unread" | "unresponded") => void
  chatTab: "private" | "group"
  onChatTabChange: (v: "private" | "group") => void
  summary: OwnerOverviewActivitySummary
  hasUnreadPrivate?: boolean
  hasUnreadGroup?: boolean
}

function Tile({
  active,
  onClick,
  icon: Icon,
  count,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  count: number
  label: string
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
        active ? "bg-slate-800 text-white" : "bg-white border border-slate-200 hover:border-slate-300"
      }`}
      onClick={onClick}
    >
      <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-500"}`} />
      <div className="flex flex-col">
        <span className={`text-lg font-bold leading-none ${active ? "text-white" : "text-slate-900"}`}>{count}</span>
        <span className={`text-[10px] uppercase tracking-wide ${active ? "text-slate-300" : "text-slate-500"}`}>{label}</span>
      </div>
    </div>
  )
}

export function OwnerOverviewActivity(props: OwnerOverviewActivityProps) {
  const {
    pinnedItems,
    unpinnedItems,
    renderItem,
    tileFilter,
    onTileFilterChange,
    radioFilter,
    onRadioFilterChange,
    chatTab,
    onChatTabChange,
    summary,
    hasUnreadPrivate,
    hasUnreadGroup,
  } = props

  return (
    <>
      <div id="activity-section">
        <h3 className="font-semibold text-slate-800 mb-1">Pinned Activity</h3>
        {pinnedItems.length > 0 ? (
          <div className="divide-y border rounded-lg overflow-hidden">
            {pinnedItems.map((item, index) => renderItem(item, index, true))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Click the pin icon on the activities below to keep them here at the top.
          </p>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Activity</h3>

          <div className="flex items-center gap-1 mb-4 border-b border-slate-200">
            <button
              type="button"
              onClick={() => onChatTabChange("private")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                chatTab === "private" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Private Chat
              {hasUnreadPrivate && <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1.5" />}
            </button>
            <button
              type="button"
              onClick={() => onChatTabChange("group")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                chatTab === "group" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Group Chat
              {hasUnreadGroup && <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-1.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Tile active={tileFilter === "all"} onClick={() => onTileFilterChange("all")} icon={Bell} count={summary.all} label="All" />
            <Tile active={tileFilter === "emails"} onClick={() => onTileFilterChange("emails")} icon={Mail} count={summary.emailsTotal} label="Emails" />
            <Tile active={tileFilter === "sms"} onClick={() => onTileFilterChange("sms")} icon={MessageSquare} count={summary.smsTotal} label="SMS" />
            <Tile active={tileFilter === "notes"} onClick={() => onTileFilterChange("notes")} icon={FileText} count={summary.notes} label="Notes" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="owner-activity-filter"
                checked={radioFilter === "all"}
                onChange={() => onRadioFilterChange("all")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700">All</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="owner-activity-filter"
                checked={radioFilter === "unread"}
                onChange={() => onRadioFilterChange("unread")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700">Unread</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="owner-activity-filter"
                checked={radioFilter === "unresponded"}
                onChange={() => onRadioFilterChange("unresponded")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700">Unresponded</span>
            </label>
          </div>

          <div className="divide-y border rounded-lg max-h-[500px] overflow-y-auto">
            {unpinnedItems.length > 0 ? (
              unpinnedItems.map((item, index) => renderItem(item, index))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No activities match the selected filters.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
