"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Search, Star, Archive, Trash2, Reply, Forward, MoreVertical, InboxIcon, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  category: "inbox" | "sent" | "archived"
  hasAttachment?: boolean
}

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "archived">("inbox")
  const [messages] = useState<Message[]>([
    {
      id: "1",
      from: "Diana Prince",
      subject: "Application Status Update",
      preview: "Thank you for the update on the application. I have reviewed the changes and...",
      timestamp: "10:30 AM",
      isRead: false,
      isStarred: true,
      category: "inbox",
    },
    {
      id: "2",
      from: "John Smith",
      subject: "Maintenance Request - Unit 304",
      preview: "The AC unit in apartment 304 is not cooling properly. Could you please...",
      timestamp: "Yesterday",
      isRead: true,
      isStarred: false,
      category: "inbox",
      hasAttachment: true,
    },
    {
      id: "3",
      from: "Sarah Johnson",
      subject: "Lease Renewal Question",
      preview: "I wanted to inquire about the lease renewal process for my unit...",
      timestamp: "2 days ago",
      isRead: true,
      isStarred: false,
      category: "inbox",
    },
    {
      id: "4",
      from: "You",
      subject: "Re: Welcome to Your New Home",
      preview: "Thank you for choosing our property. We're excited to have you...",
      timestamp: "3 days ago",
      isRead: true,
      isStarred: false,
      category: "sent",
    },
  ])

  const filteredMessages = messages.filter(
    (msg) =>
      msg.category === activeTab &&
      (msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const unreadCount = messages.filter((m) => !m.isRead && m.category === "inbox").length

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/40 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Inbox</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread messages` : "All caught up"}
            </p>
          </div>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="px-6 py-4 border-b bg-background space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="inbox" className="gap-2">
              <InboxIcon className="h-4 w-4" />
              Inbox
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <Send className="h-4 w-4" />
              Sent
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-2">
              <Archive className="h-4 w-4" />
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-auto">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Mail className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No messages found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer group ${
                  !message.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      {message.from
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm ${!message.isRead ? "font-semibold" : ""}`}>
                        {message.from}
                      </span>
                      {!message.isRead && (
                        <Badge variant="default" className="h-5 px-1.5 text-xs">
                          New
                        </Badge>
                      )}
                      {message.hasAttachment && (
                        <Badge variant="outline" className="h-5 px-1.5 text-xs">
                          Attachment
                        </Badge>
                      )}
                    </div>
                    <h4 className={`text-sm mb-1 ${!message.isRead ? "font-semibold" : "font-medium"}`}>
                      {message.subject}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{message.preview}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{message.timestamp}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${message.isStarred ? "text-yellow-500" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      <Star className={`h-4 w-4 ${message.isStarred ? "fill-yellow-500" : ""}`} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Reply className="h-4 w-4 mr-2" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward className="h-4 w-4 mr-2" />
                          Forward
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
