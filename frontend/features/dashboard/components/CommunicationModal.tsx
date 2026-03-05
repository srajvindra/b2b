"use client"

import { useState, useRef, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  MessageSquare,
  Users,
  ChevronDown,
  Paperclip,
  X,
  Type,
  Bold,
  Italic,
  Underline,
  Link,
  Smile,
  Image as ImageIcon,
  MoreHorizontal,
  Trash2,
  Send,
  ExternalLink,
} from "lucide-react"
import type { Communication, CommunicationThreadItem } from "../types"

interface CommunicationModalProps {
  communication: Communication | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewInActivity?: () => void
}

export function CommunicationModal({
  communication,
  open,
  onOpenChange,
  onViewInActivity,
}: CommunicationModalProps) {
  const [unifiedThread, setUnifiedThread] = useState<CommunicationThreadItem[]>([])
  const [expandedEmails, setExpandedEmails] = useState<Set<number>>(new Set())
  const [replyChannel, setReplyChannel] = useState<"email" | "sms">("email")
  const [showRingCentralNotification, setShowRingCentralNotification] = useState(false)
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [emailCc, setEmailCc] = useState("")
  const [emailBcc, setEmailBcc] = useState("")
  const [emailReplySubject, setEmailReplySubject] = useState("")
  const [emailReplyText, setEmailReplyText] = useState("")
  const [emailAttachments, setEmailAttachments] = useState<File[]>([])
  const [smsReplyText, setSmsReplyText] = useState("")
  const [smsAttachments, setSmsAttachments] = useState<File[]>([])
  const unifiedThreadEndRef = useRef<HTMLDivElement>(null)
  const emailFileInputRef = useRef<HTMLInputElement>(null)
  const smsFileInputRef = useRef<HTMLInputElement>(null)

  const threadToShow = useMemo(() => {
    if (!communication) return []
    if (communication.communicationThread?.length) return communication.communicationThread
    return [
      {
        id: communication.id,
        type: communication.type,
        sender: communication.from,
        direction: "incoming" as const,
        message: communication.fullMessage ?? communication.preview,
        timestamp: communication.timestamp,
        subject: communication.type === "email" ? communication.preview?.slice(0, 50) : undefined,
      },
    ]
  }, [communication])

  const displayThread = unifiedThread.length > 0 ? unifiedThread : threadToShow

  function handleClose() {
    onOpenChange(false)
    setSmsReplyText("")
    setSmsAttachments([])
    setEmailReplyText("")
    setEmailAttachments([])
    setUnifiedThread([])
    setExpandedEmails(new Set())
    setEmailCc("")
    setEmailBcc("")
    setEmailReplySubject("")
    setShowCcBcc(false)
  }

  function handleViewCommunicationDetails() {
    onViewInActivity?.()
    onOpenChange(false)
  }

  if (!communication) return null

  const Icon =
    communication.type === "email"
      ? Mail
      : communication.type === "call"
        ? Phone
        : communication.isGroupSms
          ? Users
          : MessageSquare

  return (
    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <DialogContent
    //     className={
    //       communication.type === "call"
    //         ? "sm:max-w-[500px]"
    //         : "sm:max-w-[600px] max-h-[85vh] flex flex-col"
    //     }
    //   >
    //     <DialogHeader>
    //       <div className="flex items-center gap-3">
    //         <div
    //           className={`p-2 rounded-full ${
    //             communication.isGroupSms
    //               ? "bg-purple-100"
    //               : communication.type === "email"
    //                 ? "bg-blue-100"
    //                 : communication.type === "call"
    //                   ? "bg-green-100"
    //                   : "bg-slate-100"
    //           }`}
    //         >
    //           <Icon
    //             className={`h-5 w-5 ${
    //               communication.isGroupSms
    //                 ? "text-purple-600"
    //                 : communication.type === "email"
    //                   ? "text-blue-600"
    //                   : communication.type === "call"
    //                     ? "text-green-600"
    //                     : "text-slate-600"
    //             }`}
    //           />
    //         </div>
    //         <div className="flex-1">
    //           <div className="flex items-center gap-2">
    //             <DialogTitle className="text-lg">
    //               {communication.from}
    //             </DialogTitle>
    //             {communication.isGroupSms && (
    //               <Badge
    //                 variant="secondary"
    //                 className="text-[10px] bg-purple-100 text-purple-700"
    //               >
    //                 Group SMS
    //               </Badge>
    //             )}
    //           </div>
    //           <DialogDescription className="text-sm">
    //             {communication.type === "email"
    //               ? "Email Thread"
    //               : communication.type === "call"
    //                 ? "Phone Call"
    //                 : "Text Message"}{" "}
    //             • {communication.timestamp}
    //           </DialogDescription>
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-slate-500">
    //           <span>Assigned to: {communication.assignedTo}</span>
    //           {!communication.read && (
    //             <Badge
    //               variant="secondary"
    //               className="bg-blue-100 text-blue-700 text-[10px]"
    //             >
    //               Unread
    //             </Badge>
    //           )}
    //         </div>
    //       </div>
    //     </DialogHeader>
    //     <div className="flex-1 overflow-y-auto mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
    //       <p className="text-sm text-slate-700 whitespace-pre-wrap">
    //         {communication.fullMessage || communication.preview}
    //       </p>
    //     </div>
    //   </DialogContent>
    // </Dialog>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={communication?.type === "call" ? "sm:max-w-[500px]" : "sm:max-w-[600px] max-h-[85vh] flex flex-col"}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                communication?.isGroupSms
                  ? "bg-purple-100"
                  : communication?.type === "email"
                    ? "bg-blue-100"
                    : communication?.type === "call"
                      ? "bg-green-100"
                      : "bg-slate-100"
              }`}
            >
              {communication?.isGroupSms ? (
                <Users className={`h-5 w-5 text-purple-600`} />
              ) : communication?.type === "email" ? (
                <Mail className={`h-5 w-5 text-blue-600`} />
              ) : communication?.type === "call" ? (
                <Phone className={`h-5 w-5 text-green-600`} />
              ) : (
                <MessageSquare className={`h-5 w-5 text-slate-600`} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg">{communication?.from}</DialogTitle>
                {communication?.isGroupSms && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Group SMS
                  </span>
                )}
              </div>
              <DialogDescription className="text-sm">
                {communication?.isGroupSms 
                  ? `Group SMS • ${communication?.groupParticipants?.slice(0, 3).join(", ")}${communication?.groupParticipants && communication.groupParticipants.length > 3 ? ` +${communication.groupParticipants.length - 3} more` : ""}`
                  : communication?.type === "email"
                    ? "Email Thread"
                    : communication?.type === "call"
                      ? "Phone Call"
                      : "Text Message"}{" "}
                • {communication?.timestamp}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Assigned to: {communication?.assignedTo}</span>
              {!communication?.read && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">
                  Unread
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        
        {/* Unified Communication Thread View - Shows SMS, Emails, and Calls in chronological order */}
        <div className="flex-1 flex flex-col min-h-0 mt-4">
          {/* Thread Timeline - Scrollable */}
          <div className="flex-1 overflow-y-auto max-h-[350px] space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            {displayThread.length > 0 ? (
              displayThread.map((item) => {
                // Email Item - Collapsible
                if (item.type === "email") {
                  const isExpanded = expandedEmails.has(item.id)
                  return (
                    <div
                      key={`email-${item.id}`}
                      className={`rounded-lg border transition-all ${
                        item.direction === "outgoing" ? "ml-4" : ""
                      }`}
                      style={{ backgroundColor: "#E6F4EA", borderColor: "#c8e6cc" }}
                    >
                      {/* Email Header - Always visible, clickable to expand */}
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedEmails(prev => {
                            const newSet = new Set(prev)
                            if (newSet.has(item.id)) {
                              newSet.delete(item.id)
                            } else {
                              newSet.add(item.id)
                            }
                            return newSet
                          })
                        }}
                        className="w-full p-3 flex items-center justify-between text-left rounded-t-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full" style={{ backgroundColor: "#c8e6cc" }}>
                            <Mail className="h-3.5 w-3.5 text-green-800" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800">{item.sender}</p>
                              {item.direction === "outgoing" && (
                                <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Sent</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{item.subject || "Email"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                            {item.direction === "outgoing" && item.openedAt && (
                              <p className="text-[9px] text-green-600">Opened: {item.openedAt}</p>
                            )}
                          </div>
                          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>
                      {/* Email Body - Collapsible */}
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-slate-100">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap mt-2">{item.message}</p>
                          {/* Email Attachments */}
                          {item.attachments && item.attachments.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-100">
                              <p className="text-[10px] text-slate-500 mb-1.5">Attachments ({item.attachments.length})</p>
                              <div className="flex flex-wrap gap-2">
                                {item.attachments.map((attachment, idx) => (
                                  <div 
                                    key={idx}
                                    className="flex items-center gap-1.5 bg-slate-100 rounded-md px-2 py-1.5 text-xs hover:bg-slate-200 cursor-pointer transition-colors"
                                  >
                                    <Paperclip className="h-3 w-3 text-slate-500" />
                                    <span className="text-slate-700 max-w-[150px] truncate">{attachment.name}</span>
                                    <span className="text-slate-400 text-[10px]">({attachment.size})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }
                
                // SMS/Text Item
                if (item.type === "text") {
                  return (
                    <div
                      key={`sms-${item.id}`}
                      className={`flex ${item.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 border`}
                        style={{
                          backgroundColor: "#FFE8CC",
                          borderColor: "#f5d5a8",
                          color: "#1e293b",
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <MessageSquare className="h-3 w-3 text-orange-700" />
                          <span className="text-[10px] text-orange-700">SMS</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                        {/* SMS Attachments */}
                        {item.attachments && item.attachments.length > 0 && (
                          <div className="mt-2 pt-2" style={{ borderTop: "1px solid #f5d5a8" }}>
                            <div className="flex flex-wrap gap-1.5">
                              {item.attachments.map((attachment, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs cursor-pointer transition-colors text-orange-900"
                                  style={{ backgroundColor: "#f5d5a8" }}
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <span className="max-w-[100px] truncate">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div
                          className="flex items-center gap-2 mt-1 text-[10px] text-orange-800/70"
                        >
                          <span>{item.sender}</span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                
                // Call Log Item
                if (item.type === "call") {
                  return (
                    <div
                      key={`call-${item.id}`}
                      className="rounded-lg border p-3"
                      style={{ backgroundColor: "#E0F7F6", borderColor: "#b3e8e5" }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-full mt-0.5" style={{ backgroundColor: "#b3e8e5" }}>
                          <Phone className="h-3.5 w-3.5 text-teal-800" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800">{item.sender}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                item.direction === "incoming" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-blue-100 text-blue-700"
                              }`}>
                                {item.direction === "incoming" ? "Incoming" : "Outgoing"}
                              </span>
                              {item.duration && (
                                <span className="text-[10px] text-slate-500">({item.duration})</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-slate-600 mt-1">{item.notes}</p>
                          )}
                          {!item.notes && item.message && (
                            <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                          )}
                          <p className="text-[10px] text-blue-600 mt-1 cursor-pointer hover:underline">
                            Click to view full call details in RingCentral
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }
                
                return null
              })
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {communication?.fullMessage || communication?.preview}
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  {communication?.from} • {communication?.timestamp}
                </div>
              </div>
            )}
            <div ref={unifiedThreadEndRef} />
          </div>

          {/* Reply Composer Section */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Reply</Label>
              {/* Channel Selector */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setReplyChannel("email")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    replyChannel === "email" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Mail className="h-3 w-3" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setReplyChannel("sms")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    replyChannel === "sms" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  SMS
                </button>
                <button
                  type="button"
                  onClick={() => setShowRingCentralNotification(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors text-slate-500 hover:text-slate-700 hover:bg-white/50"
                >
                  <Phone className="h-3 w-3" />
                  Call
                </button>
              </div>
            </div>
            
            {/* Email Composer UI */}
            {replyChannel === "email" && (
              <div className="border rounded-lg overflow-hidden bg-white">
                {/* To Field */}
                <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                  <Label className="text-xs text-slate-500 w-8 shrink-0">To</Label>
                  <input
                    type="text"
                    value={communication?.from || ""}
                    readOnly
                    className="flex-1 text-sm bg-transparent border-none outline-none text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    {showCcBcc ? "Hide" : "Cc Bcc"}
                  </button>
                </div>
                {/* CC/BCC Fields */}
                {showCcBcc && (
                  <>
                    <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                      <Label className="text-xs text-slate-500 w-8 shrink-0">Cc</Label>
                      <input
                        type="text"
                        placeholder="Enter CC email addresses"
                        value={emailCc}
                        onChange={(e) => setEmailCc(e.target.value)}
                        className="flex-1 text-sm bg-transparent border-none outline-none"
                      />
                    </div>
                    <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                      <Label className="text-xs text-slate-500 w-8 shrink-0">Bcc</Label>
                      <input
                        type="text"
                        placeholder="Enter BCC email addresses"
                        value={emailBcc}
                        onChange={(e) => setEmailBcc(e.target.value)}
                        className="flex-1 text-sm bg-transparent border-none outline-none"
                      />
                    </div>
                  </>
                )}
                {/* Subject Field */}
                <div className="flex items-center border-b border-slate-200 px-3 py-1.5">
                  <Label className="text-xs text-slate-500 w-14 shrink-0">Subject</Label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    value={emailReplySubject}
                    onChange={(e) => setEmailReplySubject(e.target.value)}
                    className="flex-1 text-sm bg-transparent border-none outline-none"
                  />
                </div>
                {/* Email Body */}
                <textarea
                  placeholder="Compose email..."
                  value={emailReplyText}
                  onChange={(e) => setEmailReplyText(e.target.value)}
                  className="w-full min-h-[120px] p-3 text-sm resize-none focus:outline-none bg-white border-none"
                />
                {/* Attachments Preview */}
                {emailAttachments.length > 0 && (
                  <div className="px-3 pb-2 flex flex-wrap gap-2">
                    {emailAttachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-xs">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                        <span className="max-w-[120px] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setEmailAttachments((prev) => prev.filter((_, i) => i !== index))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Formatting Toolbar */}
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
                    <label className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer" title="Attach file">
                      <Paperclip className="h-4 w-4" />
                      <input
                        ref={emailFileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setEmailAttachments(prev => [...prev, ...Array.from(e.target.files!)])
                          }
                        }}
                      />
                    </label>
                    <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-500" title="More options">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <button type="button" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600" title="Discard">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SMS Reply UI (unchanged) */}
            {replyChannel !== "email" && (
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
                <textarea
                  placeholder="Type your SMS reply..."
                  value={smsReplyText}
                  onChange={(e) => setSmsReplyText(e.target.value)}
                  className="w-full min-h-[80px] p-3 text-sm resize-none focus:outline-none bg-background"
                />
                {/* SMS Attachments Preview */}
                {smsAttachments.length > 0 && (
                  <div className="px-3 pb-2 flex flex-wrap gap-2">
                    {smsAttachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-1.5 bg-muted rounded-md px-2 py-1 text-xs">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                        <span className="max-w-[120px] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setSmsAttachments((prev) => prev.filter((_, i) => i !== index))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              
              {/* SMS Attachment Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-t">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={smsFileInputRef}
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        setSmsAttachments((prev) => [...prev, ...Array.from(files)])
                      }
                      if (smsFileInputRef.current) {
                        smsFileInputRef.current.value = ""
                      }
                    }}
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground bg-transparent"
                    onClick={() => smsFileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4 mr-1" />
                    <span className="text-xs">Attach files</span>
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  {smsReplyText.length} characters
                </span>
              </div>
            </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" className="bg-transparent" onClick={handleClose}>
            Close
          </Button>
          {/* Unified Reply Button - works with channel selector */}
          <Button 
            onClick={() => {
              const currentReplyText = replyChannel === "email" ? emailReplyText : smsReplyText
              const currentAttachments = replyChannel === "email" ? emailAttachments : smsAttachments
              
              if (currentReplyText.trim() || currentAttachments.length > 0) {
                const timestamp = new Date().toLocaleString("en-US", { 
                  year: "numeric", 
                  month: "2-digit", 
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true 
                })
                
                const newItem = {
                  id: displayThread.length + unifiedThread.length + 1,
                  type: replyChannel as "email" | "text",
                  sender: communication?.assignedTo || "Staff",
                  direction: "outgoing" as const,
                  subject: replyChannel === "email" ? `Re: ${communication?.preview?.substring(0, 30)}...` : undefined,
                  message: currentReplyText + (currentAttachments.length > 0 ? `\n\n[${currentAttachments.length} attachment(s)]` : ""),
                  timestamp: timestamp,
                }
                
                // Add to unified thread
                setUnifiedThread(prev => [...prev, newItem as CommunicationThreadItem])
                
                if (replyChannel === "email") {
                  setExpandedEmails(prev => new Set([...prev, newItem.id]))
                }
                if (replyChannel === "email") {
                  setEmailReplyText("")
                  setEmailAttachments([])
                } else {
                  setSmsReplyText("")
                  setSmsAttachments([])
                }
                setTimeout(() => {
                  unifiedThreadEndRef.current?.scrollIntoView({ behavior: "smooth" })
                }, 100)
              }
            }}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={
              (replyChannel === "email" && !emailReplyText.trim() && emailAttachments.length === 0) ||
              (replyChannel === "sms" && !smsReplyText.trim() && smsAttachments.length === 0)
            }
          >
            <Send className="h-4 w-4 mr-2" />
            Send {replyChannel === "email" ? "Email" : "SMS"}
          </Button>
          <Button onClick={handleViewCommunicationDetails} className="bg-teal-600 hover:bg-teal-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            View in Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
