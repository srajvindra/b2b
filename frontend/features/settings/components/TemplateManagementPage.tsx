"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Trash2, Mail, MessageSquare, Search, Eye, Pencil, AlertTriangle } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import type { DateFilterType, EmailTemplate, SmsTemplate, Template } from "../types"
import { initialEmailTemplates, initialSmsTemplates } from "../data/templateManagement"

export function TemplateManagementPage() {
    const [activeTab, setActiveTab] = useState<"email" | "sms">("email")
    const [searchQuery, setSearchQuery] = useState("")
    const [creatorFilter, setCreatorFilter] = useState("all-creators")
    const [dateFilter, setDateFilter] = useState<DateFilterType>("all")
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
    const [isViewMode, setIsViewMode] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(initialEmailTemplates)
    const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>(initialSmsTemplates)
  
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Template Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create and manage email and SMS templates for your workflows.
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
  
        {/* Tabs */}
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
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(activeTab === "email" ? filteredEmailTemplates : filteredSmsTemplates).map((template) => (
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
                  <td colSpan={4} className="px-4 py-12 text-center">
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
                  <textarea
                    value={editingTemplate.content}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, content: e.target.value })
                    }
                    disabled={isViewMode}
                    className={`w-full min-h-[200px] p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      isViewMode ? "bg-muted" : ""
                    }`}
                  />
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