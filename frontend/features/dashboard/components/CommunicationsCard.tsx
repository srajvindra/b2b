"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Phone, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommunicationModal } from "./CommunicationModal"
import type { Communication, CommSummary } from "../types"

interface CommunicationsCardProps {
  filteredCommunications: Communication[]
  selectedTile: "emails" | "sms" | "calls" | null
  setSelectedTile: (tile: "emails" | "sms" | "calls" | null) => void
  subFilter: "all" | "unread" | "unresponded"
  setSubFilter: (f: "all" | "unread" | "unresponded") => void
  commSummary: CommSummary
  emailComms: Communication[]
  smsComms: Communication[]
  callComms: Communication[]
  isUnresponded: (c: Communication) => boolean
  isPending: (c: Communication) => boolean
  selectedStaff: string | null
}

export function CommunicationsCard({
  filteredCommunications,
  selectedTile,
  setSelectedTile,
  subFilter,
  setSubFilter,
  commSummary,
  emailComms,
  smsComms,
  callComms,
  isUnresponded,
  isPending,
  selectedStaff,
}: CommunicationsCardProps) {
  const [selectedCommunication, setSelectedCommunication] =
    useState<Communication | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleCommunicationClick = (comm: Communication) => {
    setSelectedCommunication(comm)
    setShowModal(true)
  }

  const tileComms =
    selectedTile === "emails"
      ? emailComms
      : selectedTile === "sms"
        ? smsComms
        : selectedTile === "calls"
          ? callComms
          : filteredCommunications

  const allCount =
    selectedTile === "calls"
      ? tileComms.filter((c) => isUnresponded(c) || !c.read).length
      : tileComms.filter(isPending).length
  const unreadCount = tileComms.filter((c) => !c.read).length
  const unrespondedCount = tileComms.filter(isUnresponded).length

  return (
    <>
      <Card className="border border-slate-200 bg-[rgba(248,245,245,1)]">
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800 rounded">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Communications
                </CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                    selectedTile === null
                      ? "bg-slate-800 border border-slate-800"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    setSelectedTile(null)
                    setSubFilter("all")
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedTile === null ? "bg-slate-700" : "bg-slate-100"
                    }`}
                  >
                    <Bell
                      className={`h-4.5 w-4.5 ${
                        selectedTile === null ? "text-white" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${
                        selectedTile === null ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {commSummary.pending}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${
                        selectedTile === null ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      All
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                    selectedTile === "emails"
                      ? "bg-teal-600 border border-teal-600"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    if (selectedTile === "emails") {
                      setSelectedTile(null)
                      setSubFilter("all")
                    } else {
                      setSelectedTile("emails")
                      setSubFilter("all")
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedTile === "emails" ? "bg-teal-500" : "bg-slate-100"
                    }`}
                  >
                    <Mail
                      className={`h-4.5 w-4.5 ${
                        selectedTile === "emails"
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${
                        selectedTile === "emails"
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {commSummary.emails}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${
                        selectedTile === "emails"
                          ? "text-teal-100"
                          : "text-slate-500"
                      }`}
                    >
                      Emails
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                    selectedTile === "sms"
                      ? "bg-teal-600 border border-teal-600"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    if (selectedTile === "sms") {
                      setSelectedTile(null)
                      setSubFilter("all")
                    } else {
                      setSelectedTile("sms")
                      setSubFilter("all")
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedTile === "sms" ? "bg-teal-500" : "bg-slate-100"
                    }`}
                  >
                    <MessageSquare
                      className={`h-4.5 w-4.5 ${
                        selectedTile === "sms" ? "text-white" : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${
                        selectedTile === "sms"
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {commSummary.sms}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${
                        selectedTile === "sms"
                          ? "text-teal-100"
                          : "text-slate-500"
                      }`}
                    >
                      SMS
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                    selectedTile === "calls"
                      ? "bg-teal-600 border border-teal-600"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    if (selectedTile === "calls") {
                      setSelectedTile(null)
                    } else {
                      setSelectedTile("calls")
                    }
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedTile === "calls" ? "bg-teal-500" : "bg-slate-100"
                    }`}
                  >
                    <Phone
                      className={`h-4.5 w-4.5 ${
                        selectedTile === "calls"
                          ? "text-white"
                          : "text-slate-600"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-lg font-bold leading-none ${
                        selectedTile === "calls"
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      {commSummary.calls}
                    </span>
                    <span
                      className={`text-[11px] uppercase tracking-wide font-medium ${
                        selectedTile === "calls"
                          ? "text-teal-100"
                          : "text-slate-500"
                      }`}
                    >
                      Calls
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="comm-filter"
                checked={subFilter === "all"}
                onChange={() => setSubFilter("all")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 ml-1">
                All <span className="text-xs font-medium text-slate-500">({allCount})</span>
              </span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="comm-filter"
                checked={subFilter === "unread"}
                onChange={() => setSubFilter("unread")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 ml-1">
                Unread{" "}
                <span className="text-xs font-medium text-slate-500">({unreadCount})</span>
              </span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="comm-filter"
                checked={subFilter === "unresponded"}
                onChange={() => setSubFilter("unresponded")}
                className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 ml-1">
                Unresponded{" "}
                <span className="text-xs font-medium text-slate-500">({unrespondedCount})</span>
              </span>
            </label>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="max-h-[240px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredCommunications.length > 0 ? (
                filteredCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCommunicationClick(comm)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCommunicationClick(comm)
                    }
                    className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-white border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full relative ${
                          comm.type === "text" && comm.isGroupSms
                            ? "bg-purple-100"
                            : "bg-slate-100"
                        }`}
                      >
                        {comm.type === "email" ? (
                          <Mail className="h-4 w-4 text-slate-600" />
                        ) : comm.type === "call" ? (
                          <Phone className="h-4 w-4 text-slate-600" />
                        ) : comm.isGroupSms ? (
                          <Users className="h-4 w-4 text-purple-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <p className="text-sm font-medium truncate text-slate-800">
                              {comm.from}
                            </p>
                            {comm.type === "text" && comm.isGroupSms && (
                              <span
                                className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full flex-shrink-0"
                                title={comm.groupParticipants?.join(", ")}
                              >
                                Group
                              </span>
                            )}
                          </div>
                          {!comm.read && (
                            <span className="w-2 h-2 rounded-full bg-slate-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          {comm.preview}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-400">
                            {comm.timestamp}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-slate-400">
                            {comm.assignedTo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-slate-500">
                  No communications found
                  {selectedStaff ? ` for ${selectedStaff}` : ""}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CommunicationModal
        communication={selectedCommunication}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  )
}
