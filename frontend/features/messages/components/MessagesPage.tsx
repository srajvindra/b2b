"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  Paperclip,
  Send,
  MoreVertical,
  Building,
  User,
  X,
  FileText,
  ImageIcon,
  ChevronDown,
  ChevronLeft,
  Eye,
  Type,
  Bold,
  Italic,
  Underline,
  Link,
  Smile,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarWidget } from "@/components/ui/calendar"
import { format, isWithinInterval, startOfDay, endOfDay, parse } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CalendarDays } from "lucide-react"
import type { Contact, CommChannel, CommMessage, MessageType } from "@/features/messages/types"
import {
  MESSAGES_PAGE_CONTACTS as CONTACTS,
  getPrivateMessagesForContact,
  getGroupMessagesForContact,
} from "@/features/messages/data/messagesPage"


export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(CONTACTS[0])
  const [filterType, setFilterType] = useState<"all" | "owners" | "tenants">("all")
  const [commSubTab, setCommSubTab] = useState<"private" | "group">("private")
  const [commChannel, setCommChannel] = useState<CommChannel>("email")
  const [commMessage, setCommMessage] = useState("")
  const [emailComposeSubject, setEmailComposeSubject] = useState("")
  const [emailComposeBody, setEmailComposeBody] = useState("")
  const [emailComposeCc, setEmailComposeCc] = useState("")
  const [emailComposeBcc, setEmailComposeBcc] = useState("")
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [expandedCommEmails, setExpandedCommEmails] = useState<Set<string>>(new Set())
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  // Conversation filters
  const [msgTypeFilter, setMsgTypeFilter] = useState<"all" | "email" | "sms" | "call">("all")
  const [msgDateRange, setMsgDateRange] = useState<DateRange | undefined>(undefined)
  const [msgDatePopoverOpen, setMsgDatePopoverOpen] = useState(false)
  const [msgSearchQuery, setMsgSearchQuery] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const filteredContacts = CONTACTS.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery)
    const matchesFilter =
      filterType === "all" ||
      (filterType === "owners" && contact.type === "owner") ||
      (filterType === "tenants" && contact.type === "tenant")
    return matchesSearch && matchesFilter
  })

  const privateMessages = selectedContact ? getPrivateMessagesForContact(selectedContact) : []
  const groupChats = selectedContact ? getGroupMessagesForContact(selectedContact) : []
  const privateUnreadCount = privateMessages.filter(m => !m.isRead && m.isIncoming).length
  const groupUnreadCount = groupChats.reduce((sum, g) => sum + g.unreadCount, 0)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedContact, commSubTab, selectedGroupId])

  const handleSendMessage = () => {
    if (commChannel === "email") {
      if (!emailComposeBody.trim()) return
      setEmailComposeBody("")
      setEmailComposeSubject("")
    } else {
      if (!commMessage.trim()) return
      setCommMessage("")
    }
  }

  const toggleEmailExpand = (id: string) => {
    setExpandedCommEmails(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const getTypeBadgeStyle = (type: MessageType, isOutgoing?: boolean) => {
    if (type === "email") return "bg-[#c8e6cf] text-green-800"
    if (type === "sms") {
      // Outgoing SMS uses Sky Blue (#90CAF9), Incoming SMS uses lighter blue
      return isOutgoing ? "bg-[#90CAF9] text-blue-900" : "bg-[#E3F2FD] text-blue-800"
    }
    return "bg-[#b8e8e6] text-teal-800"
  }

  // Parse the "date" field (e.g. "Today", "Yesterday", "Nov 20, 2025") into a Date object
  const parseMsgDate = (dateStr: string): Date => {
    const now = new Date()
    if (dateStr === "Today") return now
    if (dateStr === "Yesterday") return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    try {
      return new Date(dateStr)
    } catch {
      return now
    }
  }

  // Filter messages by type and date range
  const filterMessages = (messages: CommMessage[]): CommMessage[] => {
    return messages.filter((msg) => {
      if (msgTypeFilter !== "all" && msg.type !== msgTypeFilter) return false
      if (msgDateRange?.from) {
        const msgDate = parseMsgDate(msg.date)
        const from = startOfDay(msgDateRange.from)
        const to = msgDateRange.to ? endOfDay(msgDateRange.to) : endOfDay(msgDateRange.from)
        if (!isWithinInterval(msgDate, { start: from, end: to })) return false
      }
      return true
    })
  }

  // Highlight matching search terms in text
  const highlightText = (text: string | undefined | null): ReactNode => {
    if (!text) return text
    const q = msgSearchQuery.trim()
    if (!q) return text
    try {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const regex = new RegExp(`(${escaped})`, "gi")
      const parts = text.split(regex)
      if (parts.length <= 1) return text
      return parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark>
          : part
      )
    } catch {
      return text
    }
  }

  const getBubbleStyle = (type: MessageType, isOutgoing: boolean) => {
    const rounding = isOutgoing
      ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl"
      : "rounded-tl-xl rounded-tr-xl rounded-br-xl"
    if (type === "email") return `bg-[#E6F4EA] border border-[#c8e6cf] text-slate-900 ${rounding}`
    if (type === "sms") {
      // Outgoing SMS uses Sky Blue (#90CAF9), Incoming SMS uses lighter blue
      return isOutgoing 
        ? `bg-[#90CAF9] border border-[#64B5F6] text-slate-900 ${rounding}`
        : `bg-[#E3F2FD] border border-[#bbdefb] text-slate-900 ${rounding}`
    }
    return `bg-[#E0F7F6] border border-[#b8e8e6] text-slate-900 ${rounding}`
  }

  const renderMessageBubble = (msg: CommMessage, contactName: string) => {
    const isOutgoing = !msg.isIncoming
    const staffName = "Richard Surovi"
    const isEmailExpanded = expandedCommEmails.has(msg.id)

    return (
      <div key={msg.id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[75%] ${getBubbleStyle(msg.type, isOutgoing)} p-3 shadow-sm`}>
          {/* Sender & Channel Badge */}
          <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? "justify-end" : "justify-start"}`}>
            <span className="text-xs font-medium text-slate-500">
              {msg.isGroupChat ? msg.senderName : (isOutgoing ? staffName : contactName)}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getTypeBadgeStyle(msg.type, isOutgoing)}`}>
              {msg.type === "email" ? "Email" : msg.type === "sms" ? "SMS" : "Call"}
            </span>
          </div>

          {/* Email - collapsed by default with subject header */}
          {msg.type === "email" ? (
            <div>
              <button
                onClick={() => toggleEmailExpand(msg.id)}
                className="w-full text-left flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-green-700" />
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {highlightText(msg.subject || "Email")}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600 transition-transform ${isEmailExpanded ? "rotate-180" : "rotate-0"}`} />
              </button>

              {!isEmailExpanded && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {highlightText(msg.preview || (msg.content ? msg.content.slice(0, 80) + "..." : ""))}
                </p>
              )}

              {/* Expanded: email content + attachments + thread */}
              {isEmailExpanded && (
                <div className="mt-2">
                  {/* Main email content */}
                  <p className="text-base whitespace-pre-line text-slate-700 leading-relaxed">
                    {highlightText(msg.thread ? msg.thread[0]?.content : msg.content)}
                  </p>
                  {msg.thread && msg.thread[0]?.attachments && msg.thread[0].attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.thread[0].attachments.map((att, ai) => (
                        <span key={ai} className="inline-flex items-center gap-1 text-xs bg-white/70 border border-[#c8e6cf] rounded px-2 py-1 text-slate-600">
                          <Paperclip className="h-3 w-3" />{att.name} ({att.size})
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.thread && !msg.thread[0]?.isIncoming && msg.thread[0]?.emailOpens && msg.thread[0].emailOpens.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] mt-1.5 text-green-600">
                      <Eye className="h-3 w-3" />
                      Opened at {msg.thread[0].emailOpens[0].openedAt}
                    </div>
                  )}

                  {/* Email thread at bottom */}
                  {msg.thread && msg.thread.length > 1 && (
                    <div className="mt-3 pt-2 border-t border-[#c8e6cf]">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Thread ({msg.thread.length - 1} earlier)</p>
                      <div className="space-y-1">
                        {msg.thread.slice(1).map((threadItem) => {
                          const isThreadExp = expandedCommEmails.has(`thread-${threadItem.id}`)
                          return (
                            <div key={threadItem.id} className="rounded-md bg-white/60 border border-[#c8e6cf]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setExpandedCommEmails(prev => {
                                    const next = new Set(prev)
                                    const key = `thread-${threadItem.id}`
                                    next.has(key) ? next.delete(key) : next.add(key)
                                    return next
                                  })
                                }}
                                className="w-full text-left px-2.5 py-1.5 flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0">
                                  <span className="text-xs font-medium text-slate-700">{threadItem.isIncoming ? contactName : staffName}</span>
                                  <span className="text-[10px] text-slate-400 ml-2">{threadItem.timestamp}</span>
                                </div>
                                <ChevronDown className={`h-3 w-3 shrink-0 text-slate-400 transition-transform ${isThreadExp ? "rotate-180" : "rotate-0"}`} />
                              </button>
                              {isThreadExp && (
                                <div className="px-2.5 pb-2">
                                  <p className="text-base whitespace-pre-line text-slate-700 leading-relaxed">{highlightText(threadItem.content)}</p>
                                  {threadItem.attachments && threadItem.attachments.length > 0 && (
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                      {threadItem.attachments.map((att, ai) => (
                                        <span key={ai} className="inline-flex items-center gap-1 text-xs bg-white/70 border border-[#c8e6cf] rounded px-2 py-1 text-slate-600">
                                          <Paperclip className="h-3 w-3" />{att.name} ({att.size})
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {!threadItem.isIncoming && threadItem.emailOpens && threadItem.emailOpens.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] mt-1 text-green-600">
                                      <Eye className="h-3 w-3" />
                                      Opened at {threadItem.emailOpens[0].openedAt}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : msg.type === "call" ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">
                  {msg.isIncoming ? "Incoming call" : "Outgoing call"} - {msg.callDuration}
                </span>
              </div>
              {msg.callNotes && (
                <p className="text-sm whitespace-pre-line text-slate-700">
                  <span className="font-medium">Notes:</span> {highlightText(msg.callNotes)}
                </p>
              )}
            </div>
) : (
          <p className="text-base whitespace-pre-line text-slate-700 leading-relaxed">
            {highlightText(msg.content)}
          </p>
          )}

          {/* Timestamp */}
          <div className={`text-[10px] mt-2 text-slate-400 ${isOutgoing ? "text-right" : ""}`}>
            {msg.timestamp}
          </div>
        </div>
      </div>
    )
  }

  const renderReplyComposer = () => {
    if (!selectedContact) return null

    return (
      <div className="border rounded-lg bg-white shrink-0">
        {/* Reply label + Channel Selector */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 bg-white">
          <span className="text-xs font-medium text-slate-700">Reply</span>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setCommChannel("email")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${commChannel === "email" ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
              <Mail className="h-3 w-3" /> Email
            </button>
            <button type="button" onClick={() => setCommChannel("sms")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${commChannel === "sms" ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
              <MessageSquare className="h-3 w-3" /> SMS
            </button>
            <button type="button" onClick={() => setCommChannel("call")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${commChannel === "call" ? "bg-[#E0F7F6] text-teal-800 border border-[#b8e8e6]" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
              <PhoneCall className="h-3 w-3" /> Call
            </button>
          </div>
        </div>

        {/* Email inline composer */}
        {commChannel === "email" && (
          <div>
            <div className="flex items-center border-b border-slate-200 px-3 py-1">
              <Label className="text-xs text-slate-500 w-10 shrink-0">To</Label>
              <input type="text" defaultValue={selectedContact.email} className="flex-1 text-xs bg-transparent border-none outline-none text-slate-700" />
              <button type="button" onClick={() => setShowCcBcc(!showCcBcc)} className="text-xs text-slate-500 hover:text-slate-700">Cc Bcc</button>
            </div>
            {showCcBcc && (
              <>
                <div className="flex items-center border-b border-slate-200 px-3 py-1">
                  <Label className="text-xs text-slate-500 w-10 shrink-0">Cc</Label>
                  <input type="text" placeholder="CC addresses" value={emailComposeCc} onChange={(e) => setEmailComposeCc(e.target.value)} className="flex-1 text-xs bg-transparent border-none outline-none" />
                </div>
                <div className="flex items-center border-b border-slate-200 px-3 py-1">
                  <Label className="text-xs text-slate-500 w-10 shrink-0">Bcc</Label>
                  <input type="text" placeholder="BCC addresses" value={emailComposeBcc} onChange={(e) => setEmailComposeBcc(e.target.value)} className="flex-1 text-xs bg-transparent border-none outline-none" />
                </div>
              </>
            )}
            <div className="flex items-center border-b border-slate-200 px-3 py-1">
              <Label className="text-xs text-slate-500 w-10 shrink-0">Subj</Label>
              <input type="text" placeholder="Enter subject" value={emailComposeSubject} onChange={(e) => setEmailComposeSubject(e.target.value)} className="flex-1 text-xs bg-transparent border-none outline-none" />
            </div>
            <textarea placeholder="Compose email..." value={emailComposeBody} onChange={(e) => setEmailComposeBody(e.target.value)} className="w-full min-h-[40px] max-h-[60px] px-3 py-2 text-xs resize-none focus:outline-none bg-white border-none" />
            <div className="flex items-center justify-between border-t border-slate-200 px-2 py-1">
              <div className="flex items-center gap-0">
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Underline"><Underline className="h-3.5 w-3.5" /></button>
                <div className="w-px h-3 bg-slate-200 mx-0.5" />
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Attach"><Paperclip className="h-3.5 w-3.5" /></button>
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Link"><Link className="h-3.5 w-3.5" /></button>
                <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" title="Emoji"><Smile className="h-3.5 w-3.5" /></button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setCommChannel("sms")}>Close</Button>
                <Button size="sm" className="h-7 text-xs px-2.5 bg-teal-600 hover:bg-teal-700 gap-1" onClick={handleSendMessage}>
                  <Send className="h-3 w-3" /> Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SMS inline composer */}
        {commChannel === "sms" && (
          <div className="flex items-end gap-2 p-2">
            <Textarea placeholder="Type SMS..." value={commMessage} onChange={(e) => setCommMessage(e.target.value)} className="min-h-[36px] max-h-[50px] text-xs resize-none flex-1" />
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent"><Paperclip className="h-3.5 w-3.5" /></Button>
              <Button size="icon" className="h-7 w-7 bg-teal-600 hover:bg-teal-700" onClick={handleSendMessage}><Send className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        )}

        {/* Call inline composer */}
        {commChannel === "call" && (
          <div className="flex items-center gap-2 p-2">
            <Input placeholder="Phone number..." defaultValue={selectedContact?.phone || ""} className="text-xs h-8 flex-1" />
            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white gap-1.5 text-xs">
              <PhoneCall className="h-3.5 w-3.5" /> Call
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Pre-compute filtered message lists for the conversation panel
  const filteredPrivateMsgs = filterMessages(privateMessages)
  const msgSelectedGroup = selectedGroupId ? groupChats.find(g => g.name === selectedGroupId) : null
  const filteredGroupMsgs = msgSelectedGroup ? filterMessages(msgSelectedGroup.messages) : []

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
            <p className="text-sm text-slate-500">Communications with owners and tenants</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Contacts List */}
        <div className="w-80 border-r bg-slate-50 flex flex-col overflow-hidden shrink-0">
          {/* Search and Filter */}
          <div className="p-4 space-y-3 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {filterType === "all" ? "All Users" : filterType === "owners" ? "Owners" : "Tenants"}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    <Users className="h-3.5 w-3.5 mr-2" />
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("owners")}>
                    <Building className="h-3.5 w-3.5 mr-2" />
                    Owners
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("tenants")}>
                    <User className="h-3.5 w-3.5 mr-2" />
                    Tenants
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="h-4 w-px bg-slate-200" />
              <button
                onClick={() => { setCommSubTab("private"); setSelectedGroupId(null) }}
                className={`relative h-7 px-2.5 rounded-md text-xs font-medium transition-colors ${
                  commSubTab === "private"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Private
                {privateUnreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </button>
              <button
                onClick={() => { setCommSubTab("group"); setSelectedGroupId(null) }}
                className={`relative h-7 px-2.5 rounded-md text-xs font-medium transition-colors ${
                  commSubTab === "group"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Group
                {groupUnreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </button>
            </div>
          </div>

          {/* Contacts / Groups List */}
          <div className="flex-1 overflow-auto">
            {commSubTab === "group" ? (
              <>
                {filteredContacts.map((contact) => {
                  const groups = getGroupMessagesForContact(contact)
                  if (groups.length === 0) return null
                  return groups.map((group) => {
                    const lastMsg = group.messages[group.messages.length - 1]
                    const isSelected = selectedContact?.id === contact.id && selectedGroupId === group.name
                    return (
                      <div
                        key={`${contact.id}-${group.name}`}
                        onClick={() => { setSelectedContact(contact); setSelectedGroupId(group.name) }}
                        className={`p-3 border-b cursor-pointer transition-colors ${
                          isSelected ? "bg-white border-l-2 border-l-teal-600" : "hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-slate-900 truncate">{group.name}</span>
                              {group.unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold text-white bg-green-500 rounded-full">
                                  {group.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {group.participants.length <= 3
                                ? group.participants.join(", ")
                                : `${group.participants[0]} + ${group.participants.length - 1} others`}
                            </p>
                            {lastMsg && (
                              <p className="text-xs text-slate-400 mt-0.5 truncate">
                                <span className="font-medium text-slate-500">{lastMsg.senderName}:</span> {lastMsg.content.slice(0, 40)}...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                })}
              </>
            ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => { setSelectedContact(contact); setSelectedGroupId(null) }}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id && !selectedGroupId ? "bg-white border-l-2 border-l-teal-600" : "hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-slate-900 truncate">{contact.name}</span>
                      <span className="text-xs text-slate-500">{contact.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${
                          contact.type === "owner"
                            ? "border-blue-200 text-blue-700 bg-blue-50"
                            : "border-green-200 text-green-700 bg-green-50"
                        }`}
                      >
                        {contact.type === "owner" ? "Owner" : "Tenant"}
                      </Badge>
                      {contact.property && <span className="text-xs text-slate-500 truncate">{contact.property}</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{contact.lastMessage}</p>
                  </div>
                  {((contact.unreadCount ?? 0) > 0 || (contact.groupUnreadCount ?? 0) > 0) && (
                    <Badge className="bg-green-500 text-white h-5 min-w-5 flex items-center justify-center text-xs">
                      {(contact.unreadCount ?? 0) + (contact.groupUnreadCount ?? 0)}
                    </Badge>
                  )}
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Right Panel - Conversation */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Contact Header */}
            <div className="px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-200 text-slate-700">
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{selectedContact.name}</h2>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        selectedContact.type === "owner"
                          ? "border-blue-200 text-blue-700 bg-blue-50"
                          : "border-green-200 text-green-700 bg-green-50"
                      }`}
                    >
                      {selectedContact.type === "owner" ? "Owner" : "Tenant"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedContact.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedContact.email}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Contact Details</DropdownMenuItem>
                  <DropdownMenuItem>View Property</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Divider */}
            <div className="border-b" />

            {/* Conversation Area */}
            <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
              {/* ======= PRIVATE SUB-TAB ======= */}
              {commSubTab === "private" && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Private Conversation</h3>
                    <span className="text-xs text-slate-500">{filteredPrivateMsgs.length} messages</span>
                  </div>

                  {/* Type / Date / Search Filters */}
                  <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white">
                    {/* Type radio buttons */}
                    <div className="flex items-center gap-1">
                      {(["all", "email", "sms", "call"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setMsgTypeFilter(t)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            msgTypeFilter === t
                              ? t === "email"
                                ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]"
                                : t === "sms"
                                  ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]"
                                  : t === "call"
                                    ? "bg-[#E0F7F6] text-teal-800 border border-[#b8e8e6]"
                                    : "bg-teal-50 text-teal-700 border border-teal-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {t === "all" ? "All" : t === "email" ? "Emails" : t === "sms" ? "SMS" : "Call"}
                        </button>
                      ))}
                    </div>

                    <div className="h-5 w-px bg-slate-200" />

                    {/* Date range picker */}
                    <Popover open={msgDatePopoverOpen} onOpenChange={setMsgDatePopoverOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                            msgDateRange?.from
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <CalendarDays className="h-3 w-3" />
                          {msgDateRange?.from ? (
                            msgDateRange.to
                              ? `${format(msgDateRange.from, "MMM d")} - ${format(msgDateRange.to, "MMM d, yyyy")}`
                              : format(msgDateRange.from, "MMM d, yyyy")
                          ) : (
                            "Date"
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarWidget
                          mode="range"
                          selected={msgDateRange}
                          onSelect={(range) => {
                            setMsgDateRange(range)
                            if (range?.to) setMsgDatePopoverOpen(false)
                          }}
                          numberOfMonths={1}
                        />
                        {msgDateRange?.from && (
                          <div className="border-t p-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => { setMsgDateRange(undefined); setMsgDatePopoverOpen(false) }}
                              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>

                    <div className="h-5 w-px bg-slate-200" />

                    {/* Search bar */}
                    <div className="relative flex-1 min-w-[140px]">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                      <input
                        type="text"
                        value={msgSearchQuery}
                        onChange={(e) => setMsgSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                      {msgSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setMsgSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {(msgTypeFilter !== "all" || msgDateRange?.from || msgSearchQuery) && (
                      <button
                        type="button"
                        onClick={() => { setMsgTypeFilter("all"); setMsgDateRange(undefined); setMsgSearchQuery("") }}
                        className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-slate-50">
                    <div className="flex flex-col gap-3">
                      {filteredPrivateMsgs.length > 0 ? (
                        <>
                          {filteredPrivateMsgs.map((msg, index) => {
                            const showDateHeader = index === 0 || filteredPrivateMsgs[index - 1].date !== msg.date
                            return (
                              <div key={msg.id}>
                                {showDateHeader && (
                                  <div className="flex items-center justify-center my-3">
                                    <span className="text-[10px] text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{msg.date}</span>
                                  </div>
                                )}
                                {renderMessageBubble(msg, selectedContact.name)}
                              </div>
                            )
                          })}
                          <div ref={chatEndRef} />
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-32 text-sm text-slate-500">
                          {msgTypeFilter !== "all" || msgDateRange?.from
                            ? "No messages match the selected filters."
                            : "No private communications yet."}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Composer */}
                  {renderReplyComposer()}
                </>
              )}

              {/* ======= GROUP SUB-TAB ======= */}
              {commSubTab === "group" && !msgSelectedGroup && (
                  <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
                    Select a group from the list to view conversation.
                  </div>
              )}
              {commSubTab === "group" && msgSelectedGroup && (
                  <>
                    {/* Group conversation header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">{msgSelectedGroup.name}</h3>
                        <p className="text-xs text-slate-500">{msgSelectedGroup.participants.join(", ")}</p>
                      </div>
                      <span className="text-xs text-slate-500">{filteredGroupMsgs.length} messages</span>
                    </div>

                    {/* Type / Date / Search Filters */}
                    <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center gap-1">
                        {(["all", "email", "sms", "call"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setMsgTypeFilter(t)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                              msgTypeFilter === t
                                ? t === "email"
                                  ? "bg-[#E6F4EA] text-green-800 border border-[#c8e6cf]"
                                  : t === "sms"
                                    ? "bg-[#E3F2FD] text-blue-800 border border-[#bbdefb]"
                                    : t === "call"
                                      ? "bg-[#E0F7F6] text-teal-800 border border-[#b8e8e6]"
                                      : "bg-teal-50 text-teal-700 border border-teal-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {t === "all" ? "All" : t === "email" ? "Emails" : t === "sms" ? "SMS" : "Call"}
                          </button>
                        ))}
                      </div>
                      <div className="h-5 w-px bg-slate-200" />
                      <Popover open={msgDatePopoverOpen} onOpenChange={setMsgDatePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                              msgDateRange?.from
                                ? "bg-teal-50 text-teal-700 border-teal-200"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            <CalendarDays className="h-3 w-3" />
                            {msgDateRange?.from ? (
                              msgDateRange.to
                                ? `${format(msgDateRange.from, "MMM d")} - ${format(msgDateRange.to, "MMM d, yyyy")}`
                                : format(msgDateRange.from, "MMM d, yyyy")
                            ) : (
                              "Date"
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarWidget
                            mode="range"
                            selected={msgDateRange}
                            onSelect={(range) => {
                              setMsgDateRange(range)
                              if (range?.to) setMsgDatePopoverOpen(false)
                            }}
                            numberOfMonths={1}
                          />
                          {msgDateRange?.from && (
                            <div className="border-t p-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => { setMsgDateRange(undefined); setMsgDatePopoverOpen(false) }}
                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                      <div className="h-5 w-px bg-slate-200" />
                      <div className="relative flex-1 min-w-[140px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                        <input
                          type="text"
                          value={msgSearchQuery}
                          onChange={(e) => setMsgSearchQuery(e.target.value)}
                          placeholder="Search conversations..."
                          className="w-full pl-7 pr-7 py-1 rounded-md text-xs border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 transition-colors"
                        />
                        {msgSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setMsgSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      {(msgTypeFilter !== "all" || msgDateRange?.from || msgSearchQuery) && (
                        <button
                          type="button"
                          onClick={() => { setMsgTypeFilter("all"); setMsgDateRange(undefined); setMsgSearchQuery("") }}
                          className="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Group Chat Messages */}
                    <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-slate-50">
                      <div className="flex flex-col gap-3">
                        {filteredGroupMsgs.length > 0 ? filteredGroupMsgs.map((msg, index) => {
                          const showDateHeader = index === 0 || filteredGroupMsgs[index - 1].date !== msg.date
                          return (
                            <div key={msg.id}>
                              {showDateHeader && (
                                <div className="flex items-center justify-center my-3">
                                  <span className="text-[10px] text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{msg.date}</span>
                                </div>
                              )}
                              {renderMessageBubble(msg, selectedContact.name)}
                            </div>
                          )
                        }) : (
                          <div className="flex items-center justify-center h-32 text-sm text-slate-500">
                            No messages match the selected filters.
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    </div>

                    {/* Reply Composer */}
                    {renderReplyComposer()}
                  </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center text-slate-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>{commSubTab === "group" ? "Select a group to view conversation" : "Select a contact to view conversation"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
