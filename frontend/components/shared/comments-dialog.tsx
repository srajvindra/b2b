"use client"

import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface Comment {
    id: string
    author: string
    initials: string
    text: string
    timestamp: Date
}

interface CommentsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    comments: Comment[]
    onAddComment: (text: string) => void
    description?: string
}

export function CommentsDialog({ open, onOpenChange, comments, onAddComment, description }: CommentsDialogProps) {
    const [newCommentText, setNewCommentText] = useState("")

    const handleSubmit = () => {
        if (!newCommentText.trim()) return
        onAddComment(newCommentText.trim())
        setNewCommentText("")
    }

    let lastDateStr = ""

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] p-0 flex flex-col max-h-[85vh]">
                <DialogHeader className="px-5 pt-5 pb-3 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-teal-600" />
                        Comments
                        <Badge variant="secondary" className="ml-1 bg-teal-100 text-teal-700 text-xs">
                            {comments.length}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {description ?? "Internal comments and notes."}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-5 py-4 min-h-0" style={{ maxHeight: "calc(85vh - 200px)" }}>
                    <div className="space-y-1">
                        {comments.map((comment) => {
                            const dateStr = comment.timestamp.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })
                            const showDateSeparator = dateStr !== lastDateStr
                            lastDateStr = dateStr
                            const timeStr = comment.timestamp.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })

                            return (
                                <div key={comment.id}>
                                    {showDateSeparator && (
                                        <div className="flex items-center gap-3 my-4">
                                            <div className="flex-1 h-px bg-slate-200" />
                                            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                                                {dateStr}
                                            </span>
                                            <div className="flex-1 h-px bg-slate-200" />
                                        </div>
                                    )}
                                    <div className="flex gap-3 mb-4">
                                        <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                                            <AvatarFallback className="text-xs font-medium bg-teal-100 text-teal-700">
                                                {comment.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                                                <span className="text-[11px] text-slate-400">{timeStr}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                <div className="border-t px-5 py-3">
                    <div className="flex items-end gap-2">
                        <Textarea
                            placeholder="Write a comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSubmit()
                                }
                            }}
                            className="min-h-[44px] max-h-[120px] resize-none text-sm"
                            rows={1}
                        />
                        <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 h-[44px] px-3 shrink-0"
                            onClick={handleSubmit}
                            disabled={!newCommentText.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                        Press Enter to send, Shift+Enter for new line
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const OWNER_INITIAL_COMMENTS: Comment[] = [
    { id: "1", author: "Sarah Johnson", initials: "SJ", text: "Initial contact made. Owner expressed interest in property management services.", timestamp: new Date(2025, 11, 10, 9, 30) },
    { id: "2", author: "Richard Surovi", initials: "RS", text: "Followed up via phone. Scheduled a meeting for next week to discuss PMA terms.", timestamp: new Date(2025, 11, 10, 14, 15) },
    { id: "3", author: "Sarah Johnson", initials: "SJ", text: "Owner confirmed the meeting. They have 3 properties they want us to manage.", timestamp: new Date(2025, 11, 12, 10, 0) },
    { id: "4", author: "Richard Surovi", initials: "RS", text: "Meeting went well. Sending over the PMA draft today.", timestamp: new Date(2025, 11, 12, 16, 45) },
    { id: "5", author: "Sarah Johnson", initials: "SJ", text: "Owner had some questions about the fee structure. I've addressed them and they seem satisfied.", timestamp: new Date(2026, 2, 15, 11, 20) },
]

const TENANT_INITIAL_COMMENTS: Comment[] = [
    { id: "1", author: "Lisa Chen", initials: "LC", text: "Application received. Tenant has strong credit score and steady employment.", timestamp: new Date(2025, 11, 8, 10, 0) },
    { id: "2", author: "Richard Surovi", initials: "RS", text: "Background check cleared. Moving forward with lease preparation.", timestamp: new Date(2025, 11, 9, 15, 30) },
    { id: "3", author: "Lisa Chen", initials: "LC", text: "Tenant requested move-in date adjustment to the 15th. Coordinating with property team.", timestamp: new Date(2025, 11, 11, 9, 45) },
    { id: "4", author: "Richard Surovi", initials: "RS", text: "Lease signed. Security deposit received. Move-in confirmed.", timestamp: new Date(2026, 2, 14, 14, 0) },
]

export { OWNER_INITIAL_COMMENTS, TENANT_INITIAL_COMMENTS }

export function useComments(initialComments: Comment[]) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [showCommentDialog, setShowCommentDialog] = useState(false)

    const handleAddComment = (text: string) => {
        setComments(prev => [...prev, {
            id: String(Date.now()),
            author: "Richard Surovi",
            initials: "RS",
            text,
            timestamp: new Date(),
        }])
    }

    return { comments, showCommentDialog, setShowCommentDialog, handleAddComment }
}
