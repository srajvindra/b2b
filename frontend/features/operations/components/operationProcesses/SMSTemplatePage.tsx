"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Trash2, MessageSquare, Search, Eye, Pencil, AlertTriangle, Code, Bold, Italic, Underline, Strikethrough, AlignLeft, List, ListOrdered, Link, ImageIcon, Smartphone, Video, Printer, Copy } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface TemplateCreatedBy {
  name: string
  role: string
}

interface SmsTemplate {
  id: string
  name: string
  content: string
  createdBy: TemplateCreatedBy
  createdOn: string
  sends: number
}

const initialTemplates: SmsTemplate[] = [
  {
    id: "s1",
    name: "Appointment Reminder",
    content: "Hi {{name}}, this is a reminder for your appointment tomorrow at {{time}}. Reply Y to confirm or call us to reschedule.",
    createdBy: { name: "Nina Patel", role: "Admin" },
    createdOn: "2025-01-14",
    sends: 0,
  },
  {
    id: "s2",
    name: "Quick Check-in",
    content: "Hi {{name}}, just checking in to see if you have any questions about your property. Feel free to reach out!",
    createdBy: { name: "John Smith", role: "Property Manager" },
    createdOn: "2025-01-12",
    sends: 0,
  },
  {
    id: "s3",
    name: "Document Received",
    content: "Hi {{name}}, we've received your documents. Our team will review them and get back to you within 24-48 hours.",
    createdBy: { name: "Sarah Johnson", role: "Leasing Agent" },
    createdOn: "2025-01-09",
    sends: 0,
  },
  {
    id: "s4",
    name: "Maintenance Update",
    content: "Hi {{name}}, your maintenance request #{{ticketId}} has been completed. Please let us know if you have any issues.",
    createdBy: { name: "Mike Davis", role: "Property Manager" },
    createdOn: "2025-01-06",
    sends: 0,
  },
]

type DateFilterType = "all" | "today" | "week" | "month"

export default function SMSTemplatePage() {
  const [templates, setTemplates] = useState<SmsTemplate[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [creatorFilter, setCreatorFilter] = useState("all-creators")
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all")
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null)
  const [isViewMode, setIsViewMode] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Omit<SmsTemplate, "id" | "createdOn">>({
    name: "", content: "", createdBy: { name: "Nina Patel", role: "Admin" }, sends: 0,
  })

  const allCreators = [...new Set(templates.map((t) => t.createdBy.name))]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCreator = creatorFilter === "all-creators" || template.createdBy.name === creatorFilter
    let matchesDate = true
    if (dateFilter !== "all") {
      const templateDate = new Date(template.createdOn)
      const now = new Date()
      if (dateFilter === "today") matchesDate = templateDate.toDateString() === now.toDateString()
      else if (dateFilter === "week") matchesDate = templateDate >= new Date(now.getTime() - 7 * 86400000)
      else if (dateFilter === "month") matchesDate = templateDate >= new Date(now.getTime() - 30 * 86400000)
    }
    return matchesSearch && matchesCreator && matchesDate
  })

  const handleCreate = () => {
    if (!newTemplate.name.trim()) return
    setTemplates((prev) => [...prev, {
      ...newTemplate, id: `s-${Date.now()}`, createdOn: new Date().toISOString().slice(0, 10), sends: 0,
    }])
    setNewTemplate({ name: "", content: "", createdBy: { name: "Nina Patel", role: "Admin" }, sends: 0 })
    setIsCreating(false)
  }

  const handleSave = () => {
    if (!editingTemplate) return
    setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)))
    setEditingTemplate(null)
  }

  const confirmDelete = () => {
    if (!templateToDelete) return
    setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete))
    setDeleteConfirmOpen(false)
    setTemplateToDelete(null)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SMS Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage SMS templates for your workflows.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by template name or creator..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={creatorFilter} onValueChange={setCreatorFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by creator" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all-creators">All Creators</SelectItem>
            {allCreators.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(v: DateFilterType) => setDateFilter(v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter by date" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        {(searchQuery || creatorFilter !== "all-creators" || dateFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setCreatorFilter("all-creators"); setDateFilter("all") }} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" /> Clear filters
          </Button>
        )}
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Template Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content Preview</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created By</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created On</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sends</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTemplates.map((t) => (
              <tr key={t.id} className="hover:bg-muted transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-foreground">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground truncate max-w-[250px]">{t.content.slice(0, 60)}...</td>
                <td className="px-4 py-4">
                  <span className="text-foreground">{t.createdBy.name}</span>
                  <span className="text-muted-foreground"> - {t.createdBy.role}</span>
                </td>
                <td className="px-4 py-4 text-muted-foreground">{formatDate(t.createdOn)}</td>
                <td className="px-4 py-4 text-center">
                  <div className="text-sm font-semibold text-foreground">{t.sends}</div>
                  <div className="text-xs text-muted-foreground">sends</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingTemplate(t); setIsViewMode(true) }} className="text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingTemplate(t); setIsViewMode(false) }} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { setTemplateToDelete(t.id); setDeleteConfirmOpen(true) }} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTemplates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No templates found</p>
                  <p className="text-muted-foreground/70 text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-green-600" /> Create SMS Template</DialogTitle>
            <DialogDescription>Fill in the details for your new SMS template.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} placeholder="Enter template name..." />
            </div>
            <div className="space-y-2">
              <Label>Message Content</Label>
              <div className="border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent overflow-hidden">
                <textarea value={newTemplate.content} onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })} className="w-full min-h-[150px] p-3 text-sm resize-none focus:outline-none border-none" placeholder="Write your SMS content..." />
                <div className="flex items-center gap-1 px-3 py-2 border-t border-border bg-muted/30">
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Code className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Bold className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Italic className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Underline className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Strikethrough className="h-4 w-4" /></button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><AlignLeft className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><List className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><ListOrdered className="h-4 w-4" /></button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Link className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><ImageIcon className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Smartphone className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Video className="h-4 w-4" /></button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Printer className="h-4 w-4" /></button>
                  <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Copy className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">Use {"{{variable}}"} syntax for dynamic content.</p>
                <p className="text-xs text-muted-foreground">{newTemplate.content.length}/160 characters</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)} className="bg-transparent">Cancel</Button>
            <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-green-600" /> {isViewMode ? "View Template" : "Edit Template"}</DialogTitle>
            <DialogDescription>{isViewMode ? "Template details" : "Make changes to your template below."}</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input value={editingTemplate.name} onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })} disabled={isViewMode} className={isViewMode ? "bg-muted" : ""} />
              </div>
              <div className="space-y-2">
                <Label>Message Content</Label>
                <div className={`border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent overflow-hidden ${isViewMode ? "bg-muted" : ""}`}>
                  <textarea value={editingTemplate.content} onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })} disabled={isViewMode} className={`w-full min-h-[150px] p-3 text-sm resize-none focus:outline-none border-none ${isViewMode ? "bg-muted" : ""}`} />
                  {!isViewMode && (
                    <div className="flex items-center gap-1 px-3 py-2 border-t border-border bg-muted/30">
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Code className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Bold className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Italic className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Underline className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Strikethrough className="h-4 w-4" /></button>
                      <div className="w-px h-5 bg-border mx-1" />
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><AlignLeft className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><List className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><ListOrdered className="h-4 w-4" /></button>
                      <div className="w-px h-5 bg-border mx-1" />
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Link className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><ImageIcon className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Smartphone className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Video className="h-4 w-4" /></button>
                      <div className="w-px h-5 bg-border mx-1" />
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Printer className="h-4 w-4" /></button>
                      <button type="button" className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Copy className="h-4 w-4" /></button>
                    </div>
                  )}
                </div>
                {!isViewMode && (
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Use {"{{variable}}"} syntax for dynamic content.</p>
                    <p className="text-xs text-muted-foreground">{editingTemplate.content.length}/160 characters</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t border-border">
                <div><span className="text-muted-foreground/70">Created by:</span> <span className="text-foreground/80">{editingTemplate.createdBy.name}</span> <span className="text-muted-foreground/70">({editingTemplate.createdBy.role})</span></div>
                <div><span className="text-muted-foreground/70">Created on:</span> <span className="text-foreground/80">{formatDate(editingTemplate.createdOn)}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            {isViewMode ? (
              <>
                <Button variant="outline" onClick={() => setEditingTemplate(null)} className="bg-transparent">Close</Button>
                <Button onClick={() => setIsViewMode(false)} className="bg-foreground text-background hover:bg-foreground/90"><Pencil className="h-4 w-4 mr-2" /> Edit Template</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditingTemplate(null)} className="bg-transparent">Cancel</Button>
                <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Delete Template</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this template? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
