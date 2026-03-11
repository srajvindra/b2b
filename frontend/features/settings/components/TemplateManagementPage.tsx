"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Trash2, Mail, MessageSquare, Search, Eye, Pencil, AlertTriangle, Send, Code, Bold, Italic, Underline, Strikethrough, AlignLeft, List, ListOrdered, Link, ImageIcon, Smartphone, Video, Printer, Copy } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import type { DateFilterType, EmailTemplate, SmsTemplate, Template } from "../types"
import { initialEmailTemplates, initialSmsTemplates } from "../data/templateManagement"
import { LoadMorePagination } from "@/components/shared/LoadMorePagination"

interface TemplateManagementPageProps {
    defaultTab?: "email" | "sms"
    hideTabs?: boolean
    hideHeader?: boolean
}

export function TemplateManagementPage({ defaultTab = "email", hideTabs = false, hideHeader = false }: TemplateManagementPageProps) {
    const [activeTab, setActiveTab] = useState<"email" | "sms">(defaultTab)
    const [searchQuery, setSearchQuery] = useState("")
    const [creatorFilter, setCreatorFilter] = useState("all-creators")
    const [dateFilter, setDateFilter] = useState<DateFilterType>("all")
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

    const [isCreating, setIsCreating] = useState(false)
    const [newName, setNewName] = useState("")
    const [newSubject, setNewSubject] = useState("")
    const [newContent, setNewContent] = useState("")

    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(initialEmailTemplates)
    const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>(initialSmsTemplates)

    const [visibleEmailCount, setVisibleEmailCount] = useState(10)
    const [visibleSmsCount, setVisibleSmsCount] = useState(10)
  
    // Get unique creators for filter
    const allCreators = [...new Set([...emailTemplates, ...smsTemplates].map((t) => t.createdBy.name))]
  
    // Filter templates
    const filterTemplates = (templates: Template[]) => {
      return templates.filter((template) => {
        // Search query filter
        const matchesSearch =
          searchQuery === "" ||
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
  
        // Creator filter
        const matchesCreator = creatorFilter === "all-creators" || template.createdBy.name === creatorFilter
  
        // Date filter
        let matchesDate = true
        if (dateFilter !== "all") {
          const templateDate = new Date(template.createdOn)
          const now = new Date()
          if (dateFilter === "today") {
            matchesDate = templateDate.toDateString() === now.toDateString()
          } else if (dateFilter === "week") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = templateDate >= weekAgo
          } else if (dateFilter === "month") {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            matchesDate = templateDate >= monthAgo
          }
        }
  
        return matchesSearch && matchesCreator && matchesDate
      })
    }
  
    const filteredEmailTemplates = filterTemplates(emailTemplates)
    const filteredSmsTemplates = filterTemplates(smsTemplates)

    const visibleEmailTemplates = filteredEmailTemplates.slice(0, visibleEmailCount)
    const visibleSmsTemplates = filteredSmsTemplates.slice(0, visibleSmsCount)

    useEffect(() => {
      setVisibleEmailCount(10)
      setVisibleSmsCount(10)
    }, [searchQuery, creatorFilter, dateFilter])
  
const handleViewTemplate = (template: Template) => {
      setEditingTemplate(template)
      setIsViewMode(true)
    }

    const handleEditTemplate = (template: Template) => {
      setEditingTemplate(template)
      setIsViewMode(false)
    }
  
    const handleSaveTemplate = () => {
      if (!editingTemplate) return
  
      if (editingTemplate.type === "email") {
        setEmailTemplates((prev) =>
          prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)),
        )
      } else {
        setSmsTemplates((prev) =>
          prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t)),
        )
      }
      setEditingTemplate(null)
    }
  
    const handleDeleteTemplate = (id: string) => {
      setTemplateToDelete(id)
      setDeleteConfirmOpen(true)
    }
  
    const confirmDelete = () => {
      if (!templateToDelete) return
  
      if (activeTab === "email") {
        setEmailTemplates((prev) => prev.filter((t) => t.id !== templateToDelete))
      } else {
        setSmsTemplates((prev) => prev.filter((t) => t.id !== templateToDelete))
      }
      setDeleteConfirmOpen(false)
      setTemplateToDelete(null)
    }
  
    const resetCreateForm = () => {
      setNewName("")
      setNewSubject("")
      setNewContent("")
      setIsCreating(false)
    }

    const handleCreateTemplate = () => {
      if (!newName.trim()) return
      const createdOn = new Date().toISOString().slice(0, 10)
      if (activeTab === "email") {
        setEmailTemplates((prev) => [...prev, {
          id: `e-${Date.now()}`, name: newName, type: "email", subject: newSubject,
          content: newContent, createdBy: { name: "Nina Patel", role: "Admin" },
          createdOn, files: 0, sends: 0, opened: 0, clicked: 0,
        }])
      } else {
        setSmsTemplates((prev) => [...prev, {
          id: `s-${Date.now()}`, name: newName, type: "sms",
          content: newContent, createdBy: { name: "Nina Patel", role: "Admin" },
          createdOn, sends: 0,
        }])
      }
      resetCreateForm()
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  
    return (
      <div className="p-6">
        {/* Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Template Management</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create and manage email and SMS templates for your workflows.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        )}
  
        {/* Tabs */}
        {!hideTabs && (
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "email"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Templates
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                    {emailTemplates.length}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sms")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "sms"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS Templates
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                    {smsTemplates.length}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
  
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by template name or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={creatorFilter} onValueChange={setCreatorFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-creators">All Creators</SelectItem>
              {allCreators.map((creator) => (
                <SelectItem key={creator} value={creator}>
                  {creator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(v: "all" | "today" | "week" | "month") => setDateFilter(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || creatorFilter !== "all-creators" || dateFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setCreatorFilter("all-creators")
                setDateFilter("all")
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
  
        {/* Templates Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Template Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Created On
                </th>
                {activeTab === "email" && (
                  <>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Files</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sends</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opened</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clicked</th>
                  </>
                )}
                {activeTab === "sms" && (
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sends</th>
                )}
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(activeTab === "email" ? visibleEmailTemplates : visibleSmsTemplates).map((template) => (
                <tr key={template.id} className="hover:bg-muted transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activeTab === "email" ? "bg-chart-1/20" : "bg-chart-2/20"
                      }`}>
                        {activeTab === "email" ? (
                          <Mail className="h-4 w-4 text-chart-1" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-chart-2" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{template.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <span className="text-foreground">{template.createdBy.name}</span>
                      <span className="text-muted-foreground"> - {template.createdBy.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(template.createdOn)}
                  </td>
                  {activeTab === "email" && template.type === "email" && (
                    <>
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-foreground">{template.files}</div>
                        <div className="text-xs text-muted-foreground">files</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-foreground">{template.sends}</div>
                        <div className="text-xs text-muted-foreground">sends</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-foreground">{template.opened} %</div>
                        <div className="text-xs text-muted-foreground">opened</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="text-sm font-semibold text-foreground">{template.clicked} %</div>
                        <div className="text-xs text-muted-foreground">clicked</div>
                      </td>
                    </>
                  )}
                  {activeTab === "sms" && (
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm font-semibold text-foreground">{template.sends}</div>
                      <div className="text-xs text-muted-foreground">sends</div>
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTemplate(template)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {activeTab === "email" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(activeTab === "email" ? filteredEmailTemplates : filteredSmsTemplates).length === 0 && (
                <tr>
                  <td colSpan={activeTab === "email" ? 8 : 5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {activeTab === "email" ? (
                        <Mail className="h-8 w-8 text-muted-foreground/30" />
                      ) : (
                        <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                      )}
                      <p className="text-muted-foreground">No templates found</p>
                      <p className="text-muted-foreground/70 text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <LoadMorePagination
          total={activeTab === "email" ? filteredEmailTemplates.length : filteredSmsTemplates.length}
          visibleCount={activeTab === "email" ? visibleEmailCount : visibleSmsCount}
          label="templates"
          onLoadMore={() => {
            if (activeTab === "email") {
              setVisibleEmailCount((prev) => Math.min(prev + 10, filteredEmailTemplates.length))
            } else {
              setVisibleSmsCount((prev) => Math.min(prev + 10, filteredSmsTemplates.length))
            }
          }}
        />
  
        {/* Create Template Dialog */}
        <Dialog open={isCreating} onOpenChange={(open) => { if (!open) resetCreateForm() }}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {activeTab === "email" ? (
                  <Mail className="h-5 w-5 text-chart-1" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-chart-2" />
                )}
                Create {activeTab === "email" ? "Email" : "SMS"} Template
              </DialogTitle>
              <DialogDescription>
                Fill in the details for your new {activeTab === "email" ? "email" : "SMS"} template.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">Template Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter template name..."
                />
              </div>
              {activeTab === "email" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Subject Line</Label>
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Enter subject..."
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground/80">
                  {activeTab === "email" ? "Content" : "Message Content"}
                </Label>
                <div className="border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent overflow-hidden">
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full min-h-[200px] p-3 text-sm resize-none focus:outline-none border-none"
                    placeholder={activeTab === "email" ? "Write your email content..." : "Write your SMS content..."}
                  />
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
                  <p className="text-xs text-muted-foreground">
                    Use {"{{variable}}"} syntax for dynamic content.
                  </p>
                  {activeTab === "sms" && (
                    <p className="text-xs text-muted-foreground">{newContent.length}/160 characters</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetCreateForm} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View/Edit Template Dialog */}
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingTemplate?.type === "email" ? (
                  <Mail className="h-5 w-5 text-chart-1" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-chart-2" />
                )}
                {isViewMode ? "View Template" : "Edit Template"}
              </DialogTitle>
              <DialogDescription>
                {isViewMode ? "Template details" : "Make changes to your template below."}
              </DialogDescription>
            </DialogHeader>
  
            {editingTemplate && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Template Name</Label>
                  <Input
                    value={editingTemplate.name}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, name: e.target.value })
                    }
                    disabled={isViewMode}
                    className={isViewMode ? "bg-muted" : ""}
                  />
                </div>
  
                {editingTemplate.type === "email" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground/80">Subject Line</Label>
                    <Input
                      value={editingTemplate.subject || ""}
                      onChange={(e) =>
                        setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                      }
                      disabled={isViewMode}
                      className={isViewMode ? "bg-muted" : ""}
                    />
                  </div>
                )}
  
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground/80">Content</Label>
                  <div className={`border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent overflow-hidden ${isViewMode ? "bg-muted" : ""}`}>
                    <textarea
                      value={editingTemplate.content}
                      onChange={(e) =>
                        setEditingTemplate({ ...editingTemplate, content: e.target.value })
                      }
                      disabled={isViewMode}
                      className={`w-full min-h-[200px] p-3 text-sm resize-none focus:outline-none border-none ${
                        isViewMode ? "bg-muted" : ""
                      }`}
                    />
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
                    <p className="text-xs text-muted-foreground">
                      Use {"{{variable}}"} syntax for dynamic content. E.g., {"{{name}}"}, {"{{date}}"}, {"{{time}}"}
                    </p>
                  )}
                </div>
  
                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground/70">Created by:</span>{" "}
                    <span className="text-foreground/80">{editingTemplate.createdBy.name}</span>
                    <span className="text-muted-foreground/70"> ({editingTemplate.createdBy.role})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground/70">Created on:</span>{" "}
                    <span className="text-foreground/80">{formatDate(editingTemplate.createdOn)}</span>
                  </div>
                </div>
              </div>
            )}
  
            <DialogFooter>
              {isViewMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditingTemplate(null)} className="bg-transparent">
                    Close
                  </Button>
                  <Button
                    onClick={() => setIsViewMode(false)}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Template
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setEditingTemplate(null)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTemplate}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Template
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this template? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }