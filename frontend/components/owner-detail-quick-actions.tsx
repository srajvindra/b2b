"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Mail, MessageSquare, Phone, Calendar, Users, StickyNote, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const teamMembers = [
  { id: 1, name: "Nina Patel", role: "Property Manager" },
  { id: 2, name: "Richard Surovi", role: "Leasing Agent" },
  { id: 3, name: "Suzanne Hall", role: "Account Manager" },
  { id: 4, name: "Mike Johnson", role: "Maintenance Lead" },
  { id: 5, name: "Sarah Chen", role: "Operations Director" },
]

const quickActions = [
  { icon: Mail, label: "Send Email", action: "email" },
  { icon: MessageSquare, label: "Send SMS", action: "sms" },
  { icon: Phone, label: "Log Call", action: "call" },
  { icon: StickyNote, label: "Add Note", action: "note" },
  { icon: Calendar, label: "Schedule Meeting", action: "meeting" },
  { icon: Users, label: "Reassign Lead", action: "reassign" },
]

export function OwnerDetailQuickActions() {
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const [taggedUsers, setTaggedUsers] = useState<typeof teamMembers>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(mentionQuery.toLowerCase()) && !taggedUsers.some((t) => t.id === member.id),
  )

  const handleActionClick = (action: string) => {
    if (action === "note") {
      setShowNoteModal(true)
    }
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    setNoteText(value)
    setCursorPosition(cursorPos)

    const textBeforeCursor = value.slice(0, cursorPos)
    const atIndex = textBeforeCursor.lastIndexOf("@")

    if (atIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(atIndex + 1)
      if (!textAfterAt.includes(" ")) {
        setMentionQuery(textAfterAt)
        setShowMentions(true)
        return
      }
    }
    setShowMentions(false)
  }

  const handleSelectMention = (member: (typeof teamMembers)[0]) => {
    const textBeforeCursor = noteText.slice(0, cursorPosition)
    const atIndex = textBeforeCursor.lastIndexOf("@")
    const textAfterCursor = noteText.slice(cursorPosition)

    const newText = noteText.slice(0, atIndex) + `@${member.name} ` + textAfterCursor
    setNoteText(newText)
    setTaggedUsers([...taggedUsers, member])
    setShowMentions(false)
    setMentionQuery("")

    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const handleRemoveTag = (memberId: number) => {
    const member = taggedUsers.find((t) => t.id === memberId)
    if (member) {
      setNoteText(noteText.replace(`@${member.name}`, "").trim())
      setTaggedUsers(taggedUsers.filter((t) => t.id !== memberId))
    }
  }

  const handleSaveNote = () => {
    console.log("Note saved:", noteText, "Tagged:", taggedUsers)
    setNoteText("")
    setTaggedUsers([])
    setShowNoteModal(false)
  }

  const handleCloseModal = () => {
    setNoteText("")
    setTaggedUsers([])
    setShowMentions(false)
    setShowNoteModal(false)
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-base text-gray-800">Quick Actions</h2>

      <div className="flex flex-col gap-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.action)}
            className="flex w-full items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:shadow-md hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <action.icon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>

      <Dialog open={showNoteModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-gray-600" />
              Add Note
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {taggedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {taggedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    @{user.name}
                    <button onClick={() => handleRemoveTag(user.id)} className="hover:text-gray-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={noteText}
                onChange={handleNoteChange}
                placeholder="Write a note... Use @ to tag colleagues"
                className="w-full min-h-[150px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
              />

              {showMentions && filteredMembers.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleSelectMention(member)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-medium">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500">Tip: Type @ to mention and notify a colleague</p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSaveNote} disabled={!noteText.trim()} className="bg-gray-900 hover:bg-gray-800">
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
