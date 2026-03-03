"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Mail,
  MessageSquare,
  FileText,
  Bold,
  Underline,
  Link,
  ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  Paperclip,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AutomationDetail, SequenceItem } from "../types"
import { allStaff } from "../data/automations"

function SequenceItemEditForm({
  item,
  onSave,
  onCancel,
}: {
  item: SequenceItem
  onSave: (updatedItem: SequenceItem) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(item.title)
  const [content, setContent] = useState(item.content)
  const [subject, setSubject] = useState(item.subject || "")
  const [assignOwner, setAssignOwner] = useState("Follow Relationship Routing Rules")
  const [taskCategory, setTaskCategory] = useState("")
  const [minutes, setMinutes] = useState(item.timing.split(" ")[0] || "0")
  const [hours, setHours] = useState(item.timing.split(" ")[1] || "0")
  const [days, setDays] = useState(item.timing.split(" ")[2] || "0")
  const [months, setMonths] = useState(item.timing.split(" ")[3] || "0")

  const generateTimingLabel = () => {
    const min = Number.parseInt(minutes) || 0
    const hr = Number.parseInt(hours) || 0
    const d = Number.parseInt(days) || 0
    const mo = Number.parseInt(months) || 0

    if (min === 0 && hr === 0 && d === 0 && mo === 0) {
      return "Immediately"
    }

    const parts = []
    if (mo > 0) parts.push(`${mo} Month${mo > 1 ? "s" : ""}`)
    if (d > 0) parts.push(`${d} Day${d > 1 ? "s" : ""}`)
    if (hr > 0) parts.push(`${hr} Hour${hr > 1 ? "s" : ""}`)
    if (min > 0) parts.push(`${min} Min`)

    return parts.join(" ")
  }

  const handleSave = () => {
    onSave({
      ...item,
      title,
      content,
      subject: subject || undefined,
      timing: generateTimingLabel(),
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white" />
      </div>

      <div className="p-4 border-b border-gray-100">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Content</Label>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Underline className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Select defaultValue="sans-serif">
              <SelectTrigger className="h-7 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sans-serif">Sans-Se</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Mono</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="14">
              <SelectTrigger className="h-7 w-14 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7 bg-yellow-200">
              <span className="font-bold text-sm">A</span>
            </Button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <List className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Link className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ImageIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-0 rounded-none min-h-[100px] resize-none focus-visible:ring-0"
            placeholder="Enter content..."
          />
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm text-gray-600 whitespace-nowrap">Send at</span>
          <Select value={minutes} onValueChange={setMinutes}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 10, 15, 30, 45].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm whitespace-nowrap text-[rgba(18,18,18,1)]">min</span>
          <Select value={hours} onValueChange={setHours}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 4, 8, 12, 24].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">hr</span>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 7, 14, 30].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">days</span>
          <Select value={months} onValueChange={setMonths}>
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 6, 12].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">month</span>
          <span className="text-sm text-gray-600 whitespace-nowrap ml-2">Between</span>
          <Select defaultValue="08:00 AM">
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600 whitespace-nowrap">and</span>
          <Select defaultValue="05:00 PM">
            <SelectTrigger className="h-9 bg-white flex-1 min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Assign Owner</Label>
            <Select value={assignOwner} onValueChange={setAssignOwner}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Follow Relationship Routing Rules">Follow Relationship Routing Rules</SelectItem>
                <SelectItem value="Assigned Staff">Assigned Staff</SelectItem>
                <SelectItem value="Round Robin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Task Category</Label>
            <Select value={taskCategory} onValueChange={setTaskCategory}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Task Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="admin">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">Attachments</span>
          <Paperclip className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 p-4 bg-gray-50">
        <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
          Save
        </Button>
        <Button variant="ghost" onClick={onCancel} className="text-[rgba(255,255,255,1)] bg-[rgba(235,16,16,0.29)]">
          Cancel
        </Button>
      </div>
    </div>
  )
}

export interface AutomationDetailPageProps {
  automation: AutomationDetail
  onBack: () => void
}

export function AutomationDetailPage({ automation, onBack }: AutomationDetailPageProps) {
  const [isActive, setIsActive] = useState(automation.status === "active")
  const [sequenceItems, setSequenceItems] = useState<SequenceItem[]>(automation.sequence || [])
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [assignedStaff, setAssignedStaff] = useState(automation.assignedStaff?.[0] || "Sarah Johnson")
  const [staffSearch, setStaffSearch] = useState("")
  const [showStaffDropdown, setShowStaffDropdown] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(automation.smsOptIn || false)
  const newItemRef = useRef<HTMLDivElement>(null)
  const [newItemId, setNewItemId] = useState<string | null>(null)

  const filteredStaff = allStaff.filter((staff) => staff.toLowerCase().includes(staffSearch.toLowerCase()))

  const handleSaveSequenceItem = (updatedItem: SequenceItem) => {
    setSequenceItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setEditingItemId(null)
  }

  const handleAddStep = () => {
    const newId = `s${sequenceItems.length + 1}-${Date.now()}`
    const newItem: SequenceItem = {
      id: newId,
      type: "email",
      timing: "",
      title: "",
      subject: "",
      content: "",
    }
    setSequenceItems((prev) => [...prev, newItem])
    setEditingItemId(newId)
    setNewItemId(newId)
  }

  useEffect(() => {
    if (newItemId && newItemRef.current) {
      newItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      setNewItemId(null)
    }
  }, [newItemId, sequenceItems])

  return (
    <div className="p-6 space-y-4 bg-gray-50">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">{automation.name}</h1>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3">
              <Edit className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Turn Campaign On/Off</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-emerald-500" />
          </div>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-6">
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trigger Type</Label>
              <Select defaultValue={automation.trigger}>
                <SelectTrigger className="mt-1.5 bg-white h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={automation.trigger}>{automation.trigger}</SelectItem>
                  <SelectItem value="New Lead Created">New Lead Created</SelectItem>
                  <SelectItem value="Stage Changed">Stage Changed</SelectItem>
                  <SelectItem value="No Activity">No Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px] relative">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Staff</Label>
              <div className="relative mt-1.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={staffSearch || assignedStaff}
                    onChange={(e) => {
                      setStaffSearch(e.target.value)
                      setShowStaffDropdown(true)
                    }}
                    onFocus={() => setShowStaffDropdown(true)}
                    className="pl-8 h-9 bg-white"
                  />
                </div>
                {showStaffDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredStaff.map((staff) => (
                      <div
                        key={staff}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                          staff === assignedStaff ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => {
                          setAssignedStaff(staff)
                          setStaffSearch("")
                          setShowStaffDropdown(false)
                        }}
                      >
                        {staff}
                      </div>
                    ))}
                    {filteredStaff.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-400">No staff found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Campaign Group</Label>
              <Select defaultValue={automation.campaignGroup || "Default"}>
                <SelectTrigger className="mt-1.5 bg-white h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Lead Campaigns">New Lead Campaigns</SelectItem>
                  <SelectItem value="Follow-up Campaigns">Follow-up Campaigns</SelectItem>
                  <SelectItem value="Leasing Campaigns">Leasing Campaigns</SelectItem>
                  <SelectItem value="Default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-start min-w-[160px]">
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">SMS Campaign</Label>
              <div className="flex items-center gap-2 mt-2.5">
                <Switch
                  checked={smsEnabled}
                  onCheckedChange={setSmsEnabled}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <span className="text-sm text-gray-600">{smsEnabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-900 text-sm">Email/SMS/Task Details</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:text-gray-900 bg-[rgba(1,96,209,1)] text-[rgba(255,255,255,1)]"
              onClick={handleAddStep}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Step
            </Button>
          </div>

          <div className="p-5">
            <div className="relative">
              <div className="absolute left-[52px] top-4 bottom-4 w-px bg-gray-200" />

              <div className="space-y-4">
                {sequenceItems.map((item) => (
                  <div key={item.id} className="flex gap-4" ref={item.id === newItemId ? newItemRef : null}>
                    <div className="w-20 text-right pt-3 flex-shrink-0">
                      <span className={`text-xs font-medium ${item.timing ? "text-gray-500" : "text-gray-300 italic"}`}>
                        {item.timing || "Set timing"}
                      </span>
                    </div>

                    <div className="relative flex-shrink-0 pt-3">
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                          item.type === "email" ? "bg-amber-400" : item.type === "sms" ? "bg-blue-400" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {editingItemId === item.id ? (
                      <div className="flex-1">
                        <SequenceItemEditForm
                          item={item}
                          onSave={handleSaveSequenceItem}
                          onCancel={() => setEditingItemId(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {item.type === "email" ? (
                                <Mail className="h-3.5 w-3.5 text-amber-500" />
                              ) : item.type === "sms" ? (
                                <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 text-gray-500" />
                              )}
                              <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                            </div>
                            {item.subject && <p className="text-xs text-gray-500 mb-2">Subject: {item.subject}</p>}
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{item.content}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-gray-600"
                              onClick={() => setEditingItemId(item.id)}
                            >
                              <Edit className="h-3.5 w-3.5 text-[rgba(1,96,209,1)]" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500">
                              <Trash2 className="h-3.5 w-3.5 text-[rgba(247,7,7,1)]" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
