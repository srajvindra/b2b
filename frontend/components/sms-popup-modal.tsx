"use client"

import React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Paperclip,
  X,
  ExternalLink,
  FileText,
  ImageIcon,
} from "lucide-react"

interface SMSMessage {
  id: number
  sender: "user" | "contact"
  senderName: string
  senderInitials: string
  message: string
  timestamp: string
  isCurrentMessage?: boolean
}

interface AttachedFile {
  id: string
  name: string
  type: string
  size: string
}

interface SMSPopupModalProps {
  isOpen: boolean
  onClose: () => void
  contactName: string
  contactPhone: string
  currentMessage: string
  currentTimestamp: string
  onViewDetails?: () => void
}

// Helper function to get initials from a name string
const getInitials = (name: string | undefined | null): string => {
  if (!name || typeof name !== "string") return "?"
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

// Helper function to ensure name is a string
const ensureString = (value: unknown): string => {
  if (typeof value === "string") return value
  if (value && typeof value === "object" && "name" in value) return String((value as { name: unknown }).name)
  return "Unknown"
}

// Sample conversation thread data
const getSampleThread = (contactName: string, currentMessage: string, currentTimestamp: string): SMSMessage[] => {
  const safeName = ensureString(contactName)
  const initials = getInitials(safeName)
  
  return [
    {
      id: 1,
      sender: "user",
      senderName: "Richard Surovi",
      senderInitials: "RS",
      message: "Hi! I wanted to follow up regarding your property inquiry.",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      sender: "contact",
      senderName: safeName,
      senderInitials: initials,
      message: "Yes, I'm still interested. Can we schedule a call this week?",
      timestamp: "2 days ago",
    },
    {
      id: 3,
      sender: "user",
      senderName: "Richard Surovi",
      senderInitials: "RS",
      message: "Absolutely! What time works best for you?",
      timestamp: "Yesterday",
    },
    {
      id: 4,
      sender: "contact",
      senderName: safeName,
      senderInitials: initials,
      message: currentMessage || "No message content",
      timestamp: currentTimestamp || "Just now",
      isCurrentMessage: true,
    },
  ]
}

export function SMSPopupModal({
  isOpen,
  onClose,
  contactName,
  contactPhone,
  currentMessage,
  currentTimestamp,
  onViewDetails,
}: SMSPopupModalProps) {
  const [replyText, setReplyText] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  // Safely extract string values from potentially object props
  const safeContactName = ensureString(contactName)
  const safeContactPhone = ensureString(contactPhone)
  const safeMessage = ensureString(currentMessage)
  const safeTimestamp = ensureString(currentTimestamp)

  const thread = getSampleThread(safeContactName, safeMessage, safeTimestamp)

  const handleSendReply = () => {
    if (replyText.trim() || attachedFiles.length > 0) {
      // In a real app, this would send the reply
      console.log("Sending SMS reply:", replyText, "Files:", attachedFiles)
      setReplyText("")
      setAttachedFiles([])
      onClose()
    }
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: AttachedFile[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      }))
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }
    e.target.value = ""
  }

  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-teal-600" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-slate-800">
                SMS Conversation
              </DialogTitle>
              <p className="text-sm text-slate-500 truncate">
                {safeContactName} • {safeContactPhone}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Message Thread */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full max-h-[300px]">
            <div className="px-6 py-4 space-y-4">
              {thread.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback
                      className={`text-xs ${
                        msg.sender === "user"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {msg.senderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] min-w-0 ${msg.sender === "user" ? "text-right" : ""}`}
                  >
                    <div className={`flex items-center gap-2 mb-1 flex-wrap ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "user" ? (
                        <>
                          <span className="text-xs text-slate-400">{msg.timestamp}</span>
                          <span className="text-xs font-medium text-slate-600">{msg.senderName}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-medium text-slate-600">{msg.senderName}</span>
                          <span className="text-xs text-slate-400">{msg.timestamp}</span>
                        </>
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 text-sm break-words ${
                        msg.isCurrentMessage
                          ? "bg-teal-50 border-2 border-teal-300 text-slate-800"
                          : msg.sender === "user"
                            ? "bg-teal-500 text-white"
                            : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {msg.message}
                      {msg.isCurrentMessage && (
                        <div className="mt-2 pt-2 border-t border-teal-200">
                          <span className="text-xs text-teal-600 font-medium">Current Message</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Reply Composer */}
        <div className="border-t px-6 py-4 bg-white flex-shrink-0">
          <div className="space-y-3">
            <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] resize-none border-0 focus-visible:ring-0 w-full"
              />
              
              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="px-3 py-2 border-t bg-slate-50">
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 bg-white border rounded-md px-2 py-1 text-xs max-w-full"
                      >
                        {getFileIcon(file.type)}
                        <span className="max-w-[80px] truncate">{file.name}</span>
                        <span className="text-slate-400 flex-shrink-0">({file.size})</span>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-slate-400 hover:text-red-500 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Attachment Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-t bg-slate-50">
                <label className="cursor-pointer flex-shrink-0">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileAttach}
                  />
                  <div className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 transition-colors">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-xs">Attach files</span>
                  </div>
                </label>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {replyText.length} characters
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="bg-transparent flex-shrink-0">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSendReply}
                disabled={!replyText.trim() && attachedFiles.length === 0}
                className="bg-teal-600 hover:bg-teal-700 gap-2 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
