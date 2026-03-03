"use client"

import { useState } from "react"
import {
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Eye,
  Send,
  Type,
  Bold,
  Italic,
  Underline,
  Link,
  Smile,
  ImageIcon,
  MoreHorizontal,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CommunicationItem } from "../types"

const STAFF_NAME = "Richard Surovi"

export interface OwnerCommunicationTabContact {
  name: string
  email?: string | null
  phone?: string | null
}

export interface OwnerCommunicationTabProps {
  communications: CommunicationItem[]
  contact: OwnerCommunicationTabContact
}

export function OwnerCommunicationTab({ communications, contact }: OwnerCommunicationTabProps) {
  const [commSubTab, setCommSubTab] = useState<"private" | "group">("private")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [expandedCommEmails, setExpandedCommEmails] = useState<Set<string>>(new Set())
  const [commChannel, setCommChannel] = useState<"email" | "sms" | "call">("email")
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [emailComposeCc, setEmailComposeCc] = useState("")
  const [emailComposeBcc, setEmailComposeBcc] = useState("")
  const [emailComposeSubject, setEmailComposeSubject] = useState("")
  const [emailComposeBody, setEmailComposeBody] = useState("")
  const [commMessage, setCommMessage] = useState("")

  const handleSubTabChange = (v: "private" | "group") => {
    setCommSubTab(v)
    setSelectedGroupId(null)
  }

  const privateUnread = communications.filter((c) => !c.isGroupChat && !c.isRead && c.isIncoming).length
  const groupUnread = communications
    .filter((c) => c.isGroupChat && (c.unreadCount ?? 0) > 0)
    .reduce((sum, c) => sum + (c.unreadCount ?? 0), 0)

  const contactName = contact.name
  const contactEmail = contact.email ?? ""
  const contactPhone = contact.phone ?? ""

  const privateComms = communications
    .filter((c) => !c.isGroupChat && c.type !== "note")
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const groupComms = communications.filter((c) => c.isGroupChat)
  const groupMap = new Map<
    string,
    { name: string; participants: string[]; messages: CommunicationItem[]; unreadCount: number; lastMessage: CommunicationItem }
  >()
  groupComms.forEach((msg) => {
    const groupName = msg.to?.name || "Unknown Group"
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, {
        name: groupName,
        participants: msg.groupParticipants || [],
        messages: [],
        unreadCount: 0,
        lastMessage: msg,
      })
    }
    const group = groupMap.get(groupName)!
    group.messages.push(msg)
    if ((msg.unreadCount ?? 0) > 0) group.unreadCount += msg.unreadCount ?? 0
    if (msg.date > group.lastMessage.date) group.lastMessage = msg
  })
  const groups = Array.from(groupMap.values()).sort(
    (a, b) => b.lastMessage.date.getTime() - a.lastMessage.date.getTime()
  )
  const selectedGroup = selectedGroupId ? groups.find((g) => g.name === selectedGroupId) : null
  const groupMessages = selectedGroup
    ? [...selectedGroup.messages].sort((a, b) => a.date.getTime() - b.date.getTime())
    : []

  const toggleExpandedEmail = (id: string) => {
    setExpandedCommEmails((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const renderReplyComposer = (toDefault?: string, smsPlaceholder = "Type your SMS message...") => (
    <div className="border rounded-lg bg-white shrink-0 max-h-[320px] overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 sticky top-0 bg-white z-10">
        <span className="text-sm font-medium text-slate-700">Reply</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCommChannel("email")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "email" ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </button>
          <button
            type="button"
            onClick={() => setCommChannel("sms")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "sms" ? "bg-teal-100 text-teal-700 border border-teal-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> SMS
          </button>
          <button
            type="button"
            onClick={() => setCommChannel("call")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${commChannel === "call" ? "bg-green-100 text-green-700 border border-green-300" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}
          >
            <PhoneCall className="h-3.5 w-3.5" /> Call
          </button>
        </div>
      </div>

      {commChannel === "email" && (
        <div>
          <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
            <Label className="text-xs text-slate-500 w-12 shrink-0">To</Label>
            <input
              type="text"
              defaultValue={toDefault ?? contactEmail}
              className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowCcBcc(!showCcBcc)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cc Bcc
            </button>
          </div>
          {showCcBcc && (
            <>
              <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                <Label className="text-xs text-slate-500 w-12 shrink-0">Cc</Label>
                <input
                  type="text"
                  placeholder="Enter CC email addresses"
                  value={emailComposeCc}
                  onChange={(e) => setEmailComposeCc(e.target.value)}
                  className="flex-1 text-sm bg-transparent border-none outline-none"
                />
              </div>
              <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                <Label className="text-xs text-slate-500 w-12 shrink-0">Bcc</Label>
                <input
                  type="text"
                  placeholder="Enter BCC email addresses"
                  value={emailComposeBcc}
                  onChange={(e) => setEmailComposeBcc(e.target.value)}
                  className="flex-1 text-sm bg-transparent border-none outline-none"
                />
              </div>
            </>
          )}
          <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
            <Label className="text-xs text-slate-500 w-12 shrink-0">Subject</Label>
            <input
              type="text"
              placeholder="Enter subject"
              value={emailComposeSubject}
              onChange={(e) => setEmailComposeSubject(e.target.value)}
              className="flex-1 text-sm bg-transparent border-none outline-none"
            />
          </div>
          <textarea
            placeholder="Compose email..."
            value={emailComposeBody}
            onChange={(e) => setEmailComposeBody(e.target.value)}
            className="w-full min-h-[80px] p-3 text-sm resize-none focus:outline-none bg-white border-none"
          />
          <div className="flex items-center justify-between border-t border-slate-200 px-2 py-1.5">
            <div className="flex items-center gap-0.5">
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Formatting options">
                <Type className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Bold">
                <Bold className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Italic">
                <Italic className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Underline">
                <Underline className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert link">
                <Link className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert emoji">
                <Smile className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Insert image">
                <ImageIcon className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="Attach file">
                <Paperclip className="h-4 w-4" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="More options">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Discard">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-3 py-2 sticky bottom-0 bg-white">
            <Button variant="outline" size="sm" onClick={() => setCommChannel("sms")}>
              Close
            </Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 gap-1.5">
              <Send className="h-3.5 w-3.5" /> Send Email
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> View in Activity
            </Button>
          </div>
        </div>
      )}

      {commChannel === "sms" && (
        <div className="p-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                placeholder={smsPlaceholder}
                value={commMessage}
                onChange={(e) => setCommMessage(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-teal-600 hover:bg-teal-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {commChannel === "call" && (
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder={toDefault ? "Enter phone number..." : "Enter phone number or use contact's number..."}
                defaultValue={!toDefault ? contactPhone : undefined}
                className="text-sm"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <PhoneCall className="h-4 w-4" />
              Start Call
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const renderMessageBubble = (
    item: CommunicationItem,
    opts: { isOutgoing: boolean; senderLabel: string; isGroup?: boolean }
  ) => {
    const { isOutgoing, senderLabel, isGroup } = opts
    const isEmailExpanded = expandedCommEmails.has(item.id)
    return (
      <div key={item.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[75%] ${
            isOutgoing
              ? "bg-teal-600 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
              : "bg-white border border-slate-200 text-slate-900 rounded-tl-xl rounded-tr-xl rounded-br-xl"
          } p-3 shadow-sm`}
        >
          <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
            <span className={`text-xs font-medium ${isOutgoing ? "text-teal-100" : "text-slate-500"}`}>
              {senderLabel}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                item.type === "email"
                  ? isOutgoing
                    ? "bg-teal-500 text-teal-100"
                    : "bg-blue-100 text-blue-600"
                  : item.type === "sms"
                    ? isOutgoing
                      ? "bg-teal-500 text-teal-100"
                      : "bg-green-100 text-green-600"
                    : isOutgoing
                      ? "bg-teal-500 text-teal-100"
                      : "bg-orange-100 text-orange-600"
              }`}
            >
              {item.type === "email" ? "Email" : item.type === "sms" ? "SMS" : "Call"}
            </span>
          </div>

          {item.type === "email" ? (
            <div>
              {item.subject && (
                <button
                  onClick={() => toggleExpandedEmail(item.id)}
                  className={`text-sm font-medium mb-1 flex items-center gap-1 w-full text-left ${isOutgoing ? "text-white hover:text-teal-100" : "text-slate-800 hover:text-teal-600"}`}
                >
                  <ChevronDown
                    className={`h-3 w-3 shrink-0 transition-transform ${isEmailExpanded ? "rotate-0" : "-rotate-90"}`}
                  />
                  {item.subject}
                </button>
              )}
              {isEmailExpanded ? (
                <div className="space-y-2 mt-1">
                  {item.thread ? (
                    item.thread.map((threadItem, idx) => (
                      <div
                        key={threadItem.id}
                        className={
                          idx > 0
                            ? "pt-2 border-t border-dashed border-opacity-30 " +
                              (isOutgoing ? "border-teal-300" : "border-slate-300")
                            : ""
                        }
                      >
                        {idx > 0 && !isGroup && (
                          <div
                            className={`text-xs mb-1 ${isOutgoing ? "text-teal-200" : "text-slate-500"}`}
                          >
                            {threadItem.isIncoming ? contactName : STAFF_NAME} - {threadItem.timestamp}
                          </div>
                        )}
                        <p
                          className={`text-sm whitespace-pre-line ${isOutgoing ? "text-white" : "text-slate-700"}`}
                        >
                          {threadItem.content}
                        </p>
                        {threadItem.attachments && threadItem.attachments.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {threadItem.attachments.map(
                              (att: { name: string; size: string }, aIdx: number) => (
                                <span
                                  key={aIdx}
                                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${isOutgoing ? "bg-teal-500/50 text-teal-100" : "bg-slate-100 text-slate-600"}`}
                                >
                                  <Paperclip className="h-2.5 w-2.5" />
                                  {att.name} ({att.size})
                                </span>
                              )
                            )}
                          </div>
                        )}
                        {!threadItem.isIncoming &&
                          threadItem.emailOpens &&
                          threadItem.emailOpens.length > 0 && (
                            <div
                              className={`flex items-center gap-1 text-[10px] mt-1 ${isOutgoing ? "text-teal-200" : "text-green-600"}`}
                            >
                              <Eye className="h-3 w-3" />
                              Opened by owner at {threadItem.emailOpens[0].openedAt}
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm whitespace-pre-line ${isOutgoing ? "text-white" : "text-slate-700"}`}>
                      {item.content || item.preview}
                    </p>
                  )}
                </div>
              ) : (
                <p className={`text-xs mt-0.5 ${isOutgoing ? "text-teal-200" : "text-slate-400"}`}>
                  {item.preview || (item.content ? item.content.slice(0, 80) + "..." : "")}
                </p>
              )}
              {!item.isIncoming &&
                item.thread &&
                item.thread[0]?.emailOpens &&
                item.thread[0].emailOpens.length > 0 &&
                !isEmailExpanded && (
                  <div
                    className={`flex items-center gap-1 text-[10px] mt-1 ${isOutgoing ? "text-teal-200" : "text-green-600"}`}
                  >
                    <Eye className="h-3 w-3" />
                    Opened at {item.thread[0].emailOpens[0].openedAt}
                  </div>
                )}
            </div>
          ) : item.type === "call" ? (
            <div className="space-y-1">
              <div className={`flex items-center gap-2 ${isOutgoing ? "text-teal-100" : "text-slate-600"}`}>
                <Phone className="h-4 w-4" />
                <span className="text-sm">
                  {item.isIncoming ? "Incoming call" : "Outgoing call"} - {item.duration}
                </span>
              </div>
              {item.notes && (
                <p className={`text-sm ${isOutgoing ? "text-teal-50" : "text-slate-700"}`}>
                  <span className="font-medium">Notes:</span> {item.notes}
                </p>
              )}
            </div>
          ) : (
            <p className={`text-sm ${isOutgoing ? "text-white" : "text-slate-700"}`}>
              {item.content || item.preview}
            </p>
          )}

          <div
            className={`text-[10px] mt-2 ${isOutgoing ? "text-teal-200 text-right" : "text-slate-400"}`}
          >
            {item.timestamp}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="flex flex-col h-[900px]">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-1 mb-4 border-b">
            <button
              onClick={() => handleSubTabChange("private")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                commSubTab === "private"
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Private
              {privateUnread > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                  {privateUnread}
                </span>
              )}
            </button>
            <button
              onClick={() => handleSubTabChange("group")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                commSubTab === "group"
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Group
              {groupUnread > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                  {groupUnread}
                </span>
              )}
            </button>
          </div>

          {commSubTab === "private" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">Private Conversation</h3>
                <span className="text-xs text-muted-foreground">{privateComms.length} messages</span>
              </div>
              <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                <div className="flex flex-col gap-3">
                  {privateComms.length > 0 ? (
                    privateComms.map((item) =>
                      renderMessageBubble(item, {
                        isOutgoing: !item.isIncoming,
                        senderLabel: item.isIncoming ? contactName : STAFF_NAME,
                      })
                    )
                  ) : (
                    <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                      No private communications yet.
                    </div>
                  )}
                </div>
              </div>
              {renderReplyComposer()}
            </>
          )}

          {commSubTab === "group" &&
            (selectedGroup ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => setSelectedGroupId(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-slate-800">{selectedGroup.name}</h3>
                    <p className="text-xs text-slate-500">{selectedGroup.participants.join(", ")}</p>
                  </div>
                </div>
                <div className="min-h-[250px] flex-1 overflow-y-auto space-y-3 mb-4 pr-2 border rounded-lg p-4 bg-slate-50 flex flex-col-reverse">
                  <div className="flex flex-col gap-3">
                    {groupMessages.map((item) =>
                      renderMessageBubble(item, {
                        isOutgoing: !item.isIncoming,
                        senderLabel: item.from?.name || "Unknown",
                        isGroup: true,
                      })
                    )}
                  </div>
                </div>
                {renderReplyComposer(contactEmail, "Type a message to the group...")}
              </>
            ) : (
              <>
                <h3 className="font-semibold text-slate-800 mb-3">Communication Groups</h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {groups.length > 0 ? (
                    groups.map((group) => (
                      <button
                        key={group.name}
                        onClick={() => setSelectedGroupId(group.name)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left"
                      >
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm shrink-0">
                          {group.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-800 truncate">{group.name}</span>
                            {group.unreadCount > 0 && (
                              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full shrink-0 ml-2">
                                {group.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{group.participants.length} participants</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{group.lastMessage.preview}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                      </button>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                      No group communications yet.
                    </div>
                  )}
                </div>
              </>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
