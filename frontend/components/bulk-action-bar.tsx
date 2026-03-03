"use client"

import { useState } from "react"
import { X, Mail, MessageSquare, Trash2, Download, UserRoundCog, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface BulkActionBarProps {
  selectedCount: number
  totalCount: number
  onClearSelection: () => void
  onSelectAll: () => void
  selectedNames?: string[]
  selectedEmails?: string[]
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onSelectAll,
  selectedNames = [],
  selectedEmails = [],
}: BulkActionBarProps) {
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showSmsDialog, setShowSmsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [showReassignDialog, setShowReassignDialog] = useState(false)

  if (selectedCount === 0) return null

  const allSelected = selectedCount === totalCount && totalCount > 0

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span className="inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {selectedCount}
          </span>
          <span>selected</span>
        </div>

        <div className="h-5 w-px bg-border" />

        <button
          onClick={allSelected ? onClearSelection : onSelectAll}
          className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
        >
          {allSelected ? "Deselect all" : `Select all ${totalCount}`}
        </button>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={() => setShowEmailDialog(true)}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={() => setShowSmsDialog(true)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            SMS
          </Button>
          
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5"
            onClick={() => {
              // Export selected as CSV
              const csvContent = selectedNames.map((name, i) => `${name},${selectedEmails[i] || ""}`).join("\n")
              const blob = new Blob([`Name,Email\n${csvContent}`], { type: "text/csv" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = "selected-contacts.csv"
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onClearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedCount} selected contact{selectedCount > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-border bg-muted/30 max-h-24 overflow-y-auto">
                {selectedNames.slice(0, 10).map((name, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {name}
                  </span>
                ))}
                {selectedNames.length > 10 && (
                  <span className="text-xs text-muted-foreground">+{selectedNames.length - 10} more</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input id="email-subject" placeholder="Enter email subject..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea id="email-body" placeholder="Compose your message..." rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowEmailDialog(false)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send SMS Dialog */}
      <Dialog open={showSmsDialog} onOpenChange={setShowSmsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Bulk SMS</DialogTitle>
            <DialogDescription>
              Send an SMS to {selectedCount} selected contact{selectedCount > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-border bg-muted/30 max-h-24 overflow-y-auto">
                {selectedNames.slice(0, 10).map((name, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {name}
                  </span>
                ))}
                {selectedNames.length > 10 && (
                  <span className="text-xs text-muted-foreground">+{selectedNames.length - 10} more</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-message">Message</Label>
              <Textarea id="sms-message" placeholder="Type your SMS message..." rows={4} />
              <p className="text-xs text-muted-foreground text-right">0 / 160 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSmsDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowSmsDialog(false)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Selected</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected contact{selectedCount > 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setShowDeleteDialog(false); onClearSelection() }}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedCount} Contact{selectedCount > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
            <DialogDescription>
              Apply a tag to {selectedCount} selected contact{selectedCount > 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input id="tag-name" placeholder="Enter tag name..." />
            </div>
            <div className="flex flex-wrap gap-2">
              {["VIP", "Follow Up", "Hot Lead", "Needs Review", "Priority"].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 rounded-full border border-border text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowTagDialog(false)}>
              <Tags className="h-4 w-4 mr-2" />
              Apply Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reassign Contacts</DialogTitle>
            <DialogDescription>
              Reassign {selectedCount} selected contact{selectedCount > 1 ? "s" : ""} to a different team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reassign-to">Assign To</Label>
              <select
                id="reassign-to"
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a team member...</option>
                <option value="emily">Emily Brown</option>
                <option value="richard">Richard Surovi</option>
                <option value="sarah">Sarah Johnson</option>
                <option value="michael">Michael Chen</option>
                <option value="nina">Nina Patel</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassignDialog(false)}>Cancel</Button>
            <Button onClick={() => { setShowReassignDialog(false); onClearSelection() }}>
              <UserRoundCog className="h-4 w-4 mr-2" />
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
