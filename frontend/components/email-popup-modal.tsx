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
  Mail,
  Send,
  Paperclip,
  FileText,
  ImageIcon,
  X,
} from "lucide-react"

interface EmailMessage {
  id: number
  sender: "user" | "contact"
  senderName: string
  senderInitials: string
  senderEmail: string
  subject: string
  body: string
  timestamp: string
  isCurrentMessage?: boolean
}

interface AttachedFile {
  id: string
  name: string
  type: string
  size: string
}

interface EmailPopupModalProps {
  isOpen: boolean
  onClose: () => void
  contactName: string
  contactEmail: string
  currentSubject: string
  currentBody: string
  currentTimestamp: string
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

// Sample email thread data
const getSampleThread = (contactName: string, contactEmail: string, currentSubject: string, currentBody: string, currentTimestamp: string): EmailMessage[] => {
  const safeName = ensureString(contactName)
  const initials = getInitials(safeName)
  const safeEmail = ensureString(contactEmail)
  
  return [
    {
      id: 1,
      sender: "user",
      senderName: "Richard Surovi",
      senderInitials: "RS",
      senderEmail: "richard@heropm.com",
      subject: currentSubject || "Property Inquiry Follow-up",
      body: "Hi,\n\nThank you for your interest in our property management services. I wanted to follow up on your recent inquiry.\n\nPlease let me know if you have any questions or if there's anything else I can help you with.\n\nBest regards,\nRichard",
      timestamp: "3 days ago",
    },
    {
      id: 2,
      sender: "contact",
      senderName: safeName,
      senderInitials: initials,
      senderEmail: safeEmail,
      subject: `Re: ${currentSubject || "Property Inquiry Follow-up"}`,
      body: "Hi Richard,\n\nThank you for reaching out. I'm very interested in discussing this further. Could we schedule a call this week?\n\nLooking forward to hearing from you.",
      timestamp: "2 days ago",
    },
    {
      id: 3,
      sender: "user",
      senderName: "Richard Surovi",
      senderInitials: "RS",
      senderEmail: "richard@heropm.com",
      subject: `Re: ${currentSubject || "Property Inquiry Follow-up"}`,
      body: "Hi,\n\nAbsolutely! I'm available tomorrow afternoon or Friday morning. Please let me know which time works best for you.\n\nBest,\nRichard",
      timestamp: "Yesterday",
    },
    {
      id: 4,
      sender: "contact",
      senderName: safeName,
      senderInitials: initials,
      senderEmail: safeEmail,
      subject: `Re: ${currentSubject || "Property Inquiry Follow-up"}`,
      body: currentBody || "No message content",
      timestamp: currentTimestamp || "Just now",
      isCurrentMessage: true,
    },
  ]
}

export function EmailPopupModal({
  isOpen,
  onClose,
  contactName,
  contactEmail,
  currentSubject,
  currentBody,
  currentTimestamp,
}: EmailPopupModalProps) {
  const [replyText, setReplyText] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  // Safely extract string values from potentially object props
  const safeContactName = ensureString(contactName)
  const safeContactEmail = ensureString(contactEmail)
  const safeSubject = ensureString(currentSubject)
  const safeBody = ensureString(currentBody)
  const safeTimestamp = ensureString(currentTimestamp)

  const thread = getSampleThread(safeContactName, safeContactEmail, safeSubject, safeBody, safeTimestamp)

  const handleSendReply = () => {
    if (replyText.trim() || attachedFiles.length > 0) {
      // In a real app, this would send the reply
      console.log("Sending Email reply:", replyText, "Files:", attachedFiles)
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
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-slate-800">
                Email Conversation
              </DialogTitle>
              <p className="text-sm text-slate-500 truncate">
                {safeContactName} • {safeContactEmail}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Subject Line */}
        <div className="px-6 py-3 border-b bg-white flex-shrink-0">
          <p className="text-sm font-medium text-slate-700 truncate">
            Subject: <span className="font-normal">{safeSubject || "Property Inquiry Follow-up"}</span>
          </p>
        </div>

        {/* Email Thread */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full max-h-[300px]">
            <div className="px-6 py-4 space-y-4">
              {thread.map((email) => (
                <div
                  key={email.id}
                  className={`rounded-lg border p-4 ${
                    email.isCurrentMessage
                      ? "bg-blue-50 border-blue-200"
                      : email.sender === "user"
                      ? "bg-slate-50 border-slate-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback
                        className={`text-xs ${
                          email.sender === "user"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {email.senderInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          <span className="text-sm font-medium text-slate-800">
                            {email.senderName}
                          </span>
                          <span className="text-xs text-slate-400 truncate">
                            {"<"}{email.senderEmail}{">"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                          {email.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-2 whitespace-pre-line break-words">
                        {email.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Reply Section */}
        <div className="border-t bg-white px-6 py-4 flex-shrink-0">
          <div className="space-y-3">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm max-w-full"
                  >
                    {getFileIcon(file.type)}
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <span className="text-xs text-slate-400 flex-shrink-0">({file.size})</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-0.5 hover:bg-slate-200 rounded-full flex-shrink-0"
                    >
                      <X className="h-3 w-3 text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] resize-none w-full"
                />
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileAttach}
                  />
                  <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent" asChild>
                    <span>
                      <Paperclip className="h-4 w-4" />
                    </span>
                  </Button>
                </label>
                <Button
                  size="icon"
                  className="h-9 w-9 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() && attachedFiles.length === 0}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
