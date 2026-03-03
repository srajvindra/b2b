"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Search,
  Mail,
  MessageSquare,
  Phone,
  Paperclip,
  Send,
  MoreVertical,
  Building,
  User,
  X,
  FileText,
  ImageIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import type { Contact, MessageType } from "../types"
import { CONTACTS, getMessagesForContact } from "../data/messages"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(CONTACTS[0])
  const [messageText, setMessageText] = useState("")
  const [sendAsSms, setSendAsSms] = useState(true)
  const [sendAsEmail, setSendAsEmail] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [filterType, setFilterType] = useState<"all" | "owners" | "tenants">("all")

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

  const messages = selectedContact ? getMessagesForContact(selectedContact) : []

  const handleSendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return
    // In a real app, this would send the message
    console.log("Sending message:", {
      text: messageText,
      sms: sendAsSms,
      email: sendAsEmail,
      attachments: attachments.map((f) => f.name),
    })
    setMessageText("")
    setAttachments([])
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "sms":
        return <MessageSquare className="h-3.5 w-3.5" />
      case "email":
        return <Mail className="h-3.5 w-3.5" />
      case "call":
        return <Phone className="h-3.5 w-3.5" />
    }
  }

  const getMessageIconBg = (type: MessageType) => {
    switch (type) {
      case "sms":
        return "bg-green-100 text-green-600"
      case "email":
        return "bg-blue-100 text-blue-600"
      case "call":
        return "bg-purple-100 text-purple-600"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500">Communications with owners and tenants</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Contacts List */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          {/* Search and Filter */}
          <div className="p-4 space-y-3 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-gray-900" : ""}
              >
                All
              </Button>
              <Button
                variant={filterType === "owners" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("owners")}
                className={filterType === "owners" ? "bg-gray-900" : ""}
              >
                <Building className="h-3.5 w-3.5 mr-1" />
                Owners
              </Button>
              <Button
                variant={filterType === "tenants" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("tenants")}
                className={filterType === "tenants" ? "bg-gray-900" : ""}
              >
                <User className="h-3.5 w-3.5 mr-1" />
                Tenants
              </Button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? "bg-white border-l-2 border-l-gray-900" : "hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900 truncate">{contact.name}</span>
                      <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
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
                      {contact.property && <span className="text-xs text-gray-500 truncate">{contact.property}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{contact.lastMessage}</p>
                  </div>
                  {contact.unreadCount && contact.unreadCount > 0 && (
                    <Badge className="bg-gray-900 text-white h-5 min-w-5 flex items-center justify-center text-xs">
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Conversation */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Contact Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
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
                  <div className="flex items-center gap-3 text-xs text-gray-500">
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

            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {messages.map((message, index) => {
                const showDateHeader = index === 0 || messages[index - 1].date !== message.date
                return (
                  <div key={message.id}>
                    {showDateHeader && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{message.date}</span>
                      </div>
                    )}
                    <div className={`flex ${message.from.isStaff ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${message.from.isStaff ? "order-2" : "order-1"}`}>
                        <Card
                          className={`p-3 ${
                            message.from.isStaff
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-gray-100 border-gray-200"
                          }`}
                        >
                          {/* Message Type Badge and Contact Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                                message.from.isStaff ? "bg-gray-800 text-gray-300" : getMessageIconBg(message.type)
                              }`}
                            >
                              {getMessageIcon(message.type)}
                              {message.type.toUpperCase()}
                            </span>
                            <span className={`text-xs ${message.from.isStaff ? "text-gray-400" : "text-gray-500"}`}>
                              {message.type === "email" ? message.from.contact : message.from.contact}
                            </span>
                          </div>

                          {/* Message Content */}
                          {message.type === "call" ? (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Phone className="h-4 w-4" />
                                <span className="font-medium text-sm">
                                  {message.from.isStaff ? "Outgoing Call" : "Incoming Call"}
                                </span>
                                <span className={`text-xs ${message.from.isStaff ? "text-gray-400" : "text-gray-500"}`}>
                                  {message.callDuration}
                                </span>
                              </div>
                              <p
                                className={`text-sm whitespace-pre-wrap ${
                                  message.from.isStaff ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {message.callNotes || message.content}
                              </p>
                            </div>
                          ) : (
                            <p
                              className={`text-sm whitespace-pre-wrap ${
                                message.from.isStaff ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {message.content}
                            </p>
                          )}

                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    message.from.isStaff ? "bg-gray-800" : "bg-white"
                                  }`}
                                >
                                  {attachment.type === "pdf" ? (
                                    <FileText className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <ImageIcon className="h-4 w-4 text-blue-500" />
                                  )}
                                  <span className="text-xs flex-1 truncate">{attachment.name}</span>
                                  <span
                                    className={`text-xs ${message.from.isStaff ? "text-gray-400" : "text-gray-500"}`}
                                  >
                                    {attachment.size}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                            message.from.isStaff ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Compose Area */}
            <div className="border-t p-4 bg-gray-50">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white border rounded-lg px-3 py-1.5">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 truncate max-w-32">{file.name}</span>
                      <button onClick={() => removeAttachment(index)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Input */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Textarea
                    placeholder={`Type a message to ${selectedContact.name}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[80px] resize-none bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4">
                      {/* Attachment Button */}
                      <label className="cursor-pointer">
                        <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                        <div className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">Attach</span>
                        </div>
                      </label>

                      {/* Send Options */}
                      <div className="flex items-center gap-4 pl-4 border-l">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="send-sms"
                            checked={sendAsSms}
                            onCheckedChange={(checked) => setSendAsSms(checked as boolean)}
                          />
                          <Label
                            htmlFor="send-sms"
                            className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            SMS
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="send-email"
                            checked={sendAsEmail}
                            onCheckedChange={(checked) => setSendAsEmail(checked as boolean)}
                          />
                          <Label
                            htmlFor="send-email"
                            className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            Email
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Send Button */}
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() && attachments.length === 0}
                      className="bg-gray-900 hover:bg-gray-800"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                      {(sendAsSms || sendAsEmail) && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({[sendAsSms && "SMS", sendAsEmail && "Email"].filter(Boolean).join(" + ")})
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a contact to view conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
