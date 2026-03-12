"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronDown,
  HelpCircle,
  Plus,
  Download,
  Pencil,
  Trash2,
  Upload,
  Info,
  FileBarChart,
  X as XIcon,
  CheckSquare,
  Circle,
  ChevronRight,
} from "lucide-react"
import type { TenantNote, TenantLetter } from "../types"

export interface TenantInformationTabProps {
  notes: TenantNote[]
  letters: TenantLetter[]
  onNoteClick?: (note: TenantNote) => void
}

type TenantCustomFieldType = "text" | "number" | "date" | "dropdown" | "yes_no"

interface TenantCustomField {
  id: string
  name: string
  type: TenantCustomFieldType
  section: string
  value: string
  isMandatory: boolean
  options?: string[]
}

const TENANT_AVAILABLE_SECTIONS: { id: string; name: string }[] = [
  { id: "status", name: "Status" },
  { id: "tags", name: "Tags" },
  { id: "contact", name: "Contact" },
  { id: "tenant-status", name: "Tenant Status" },
  { id: "screening", name: "Screening" },
  { id: "emergency-contact", name: "Emergency Contact" },
  { id: "insurance-coverage", name: "Insurance Coverage" },
  { id: "notes", name: "Notes" },
  { id: "letters", name: "Letters" },
  { id: "monthly-charges", name: "Monthly Charges" },
  { id: "lease-information", name: "Lease Information" },
  { id: "late-fee-policy", name: "Late Fee Policy" },
  { id: "animals", name: "Animals" },
  { id: "vehicles", name: "Vehicles" },
]

function InfoRow({
  label,
  value,
  isCustom,
  isMandatory,
  isReportable = true,
}: {
  label: React.ReactNode
  value: React.ReactNode
  isMandatory?: boolean
  isCustom?: boolean
  isReportable?: boolean
}) {
  return (
    <div className="flex justify-between py-2 border-b border-border/50 group">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">{label}</span>
        {isCustom && (
          <>
            {isMandatory ? (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">
                Required
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                Optional
              </span>
            )}
          </>
        )}
        {isReportable && isCustom && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <FileBarChart className="h-2.5 w-2.5" />
            Reportable
          </span>
        )}
      </div>
      <span className="text-foreground text-sm font-medium text-right">{value || "--"}</span>
    </div>
  )
}

export function TenantInformationTab({ notes, letters, onNoteClick }: TenantInformationTabProps) {
  const [screeningExpanded, setScreeningExpanded] = useState(true)
  const [emergencyContactExpanded, setEmergencyContactExpanded] = useState(true)

  const [insuranceCoverageExpanded, setInsuranceCoverageExpanded] = useState(true)

  const [customFields, setCustomFields] = useState<TenantCustomField[]>([])
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false)
  const [customFieldSection, setCustomFieldSection] = useState<string>("status")
  const [newCustomField, setNewCustomField] = useState({
    name: "",
    type: "text" as TenantCustomFieldType,
    isMandatory: false,
    options: "",
  })

  const availableSections = useMemo(() => TENANT_AVAILABLE_SECTIONS, [])

  const handleOpenAddField = (sectionId: string) => {
    setCustomFieldSection(sectionId)
    setShowCustomFieldModal(true)
  }

  const handleAddCustomField = () => {
    if (!newCustomField.name.trim() || !customFieldSection) return

    const field: TenantCustomField = {
      id: `tenant_cf_${Date.now()}`,
      name: newCustomField.name,
      type: newCustomField.type,
      section: customFieldSection,
      value: newCustomField.type === "yes_no" ? "No" : "",
      isMandatory: newCustomField.isMandatory,
      options:
        newCustomField.type === "dropdown"
          ? newCustomField.options
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
          : undefined,
    }

    setCustomFields((prev) => [...prev, field])
    setNewCustomField({ name: "", type: "text", isMandatory: false, options: "" })
    setShowCustomFieldModal(false)
  }

  const getFieldsForSection = (sectionId: string) =>
    customFields.filter((field) => field.section === sectionId)

  const hasDropdownOptions = newCustomField.type === "dropdown"

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Status</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                  onClick={() => handleOpenAddField("status")}
                >
                  <Plus className="h-3 w-3" />
                  Add Field
                </Button>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Balance</span>
                  <span className="font-medium text-teal-600">$2,325.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    Delinquency Notes <HelpCircle className="h-3 w-3" />
                  </span>
                  <span className="text-teal-600 cursor-pointer hover:underline">Add delinquency note</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Receipt</span>
                  <span className="font-medium text-teal-600">12/11/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Evicting</span>
                  <span className="font-medium">No</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">In Collections</span>
                  <span className="font-medium">No</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Eligible for Renewal</span>
                  <span className="font-medium">Yes</span>
                </div>
              </div>
              {getFieldsForSection("status").length > 0 && (
                <div className="mt-4 space-y-1">
                  {getFieldsForSection("status").map((field) => (
                    <InfoRow
                      key={field.id}
                      label={field.name}
                      value={field.value || "--"}
                      isCustom
                      isMandatory={field.isMandatory}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Tags</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                  onClick={() => handleOpenAddField("tags")}
                >
                  <Plus className="h-3 w-3" />
                  Add Field
                </Button>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-slate-50 rounded-lg p-4 border">
                <h4 className="font-semibold text-slate-800 mb-2">FolioGuard Smart Ensure</h4>
                <p className="text-sm text-slate-600 mb-3">Unlock new revenue streams with Smart Ensure while protecting your properties.</p>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Contact Me</Button>
              </div>
              {getFieldsForSection("tags").length > 0 && (
                <div className="mt-4 space-y-1">
                  {getFieldsForSection("tags").map((field) => (
                    <InfoRow
                      key={field.id}
                      label={field.name}
                      value={field.value || "--"}
                      isCustom
                      isMandatory={field.isMandatory}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Contact</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                  onClick={() => handleOpenAddField("contact")}
                >
                  <Plus className="h-3 w-3" />
                  Add Field
                </Button>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div><h4 className="text-sm font-medium text-slate-700 mb-2">Phone Numbers</h4><div className="flex items-center justify-between"><span className="text-sm"><span className="text-slate-500">Home</span> <span className="font-medium">987654321</span></span><Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">Text</Button></div></div>
              <div><h4 className="text-sm font-medium text-slate-700 mb-2">Emails</h4><p className="text-sm text-slate-500 italic">Click edit to add emails.</p></div>
              <div><h4 className="text-sm font-medium text-slate-700 mb-2">Addresses</h4><div className="text-sm space-y-1"><div className="flex"><span className="text-slate-500 w-28">Primary Address</span><span className="font-medium">1000 NELAVIEW RD CLEVELAND HEIGHTS, OH. 44112</span></div></div></div>
              {getFieldsForSection("contact").length > 0 && (
                <div className="pt-2 space-y-1 border-t border-border/50">
                  {getFieldsForSection("contact").map((field) => (
                    <InfoRow
                      key={field.id}
                      label={field.name}
                      value={field.value || "--"}
                      isCustom
                      isMandatory={field.isMandatory}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
              <CardTitle className="text-base font-semibold text-slate-800">Tenant Status</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                  onClick={() => handleOpenAddField("tenant-status")}
                >
                  <Plus className="h-3 w-3" />
                  Add Field
                </Button>
                <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="text-slate-500 w-36">Type</span>
                  <span className="font-medium text-teal-600">Financially Responsible</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-36">Status</span>
                  <span className="font-medium">Current</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-36">Move In</span>
                  <span className="font-medium text-teal-600">06/18/2024</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-36">Move Out</span>
                  <span className="font-medium">--</span>
                </div>
              </div>
              {getFieldsForSection("tenant-status").length > 0 && (
                <div className="mt-4 space-y-1">
                  {getFieldsForSection("tenant-status").map((field) => (
                    <InfoRow
                      key={field.id}
                      label={field.name}
                      value={field.value || "--"}
                      isCustom
                      isMandatory={field.isMandatory}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setScreeningExpanded(!screeningExpanded)}
        >
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <ChevronRight className={`h-4 w-4 transition-transform ${screeningExpanded ? "rotate-90" : ""}`} />
            Screening
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenAddField("screening")
              }}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button
              variant="link"
              className="text-teal-600 h-auto p-0 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        {screeningExpanded && (
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Date Of Birth</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">SSN</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Drivers License</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">State</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Credit Report Date</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Credit Score</span>
                <span className="font-medium">--</span>
              </div>
            </div>
            {getFieldsForSection("screening").length > 0 && (
              <div className="mt-4 space-y-1">
                {getFieldsForSection("screening").map((field) => (
                  <InfoRow
                    key={field.id}
                    label={field.name}
                    value={field.value || "--"}
                    isCustom
                    isMandatory={field.isMandatory}
                  />
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader
          className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setEmergencyContactExpanded(!emergencyContactExpanded)}
        >
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <ChevronRight
              className={`h-4 w-4 transition-transform ${emergencyContactExpanded ? "rotate-90" : ""}`}
            />
            Emergency Contact
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenAddField("emergency-contact")
              }}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button
              variant="link"
              className="text-teal-600 h-auto p-0 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        {emergencyContactExpanded && (
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Name</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Address</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Phone Number</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Email Address</span>
                <span className="font-medium">--</span>
              </div>
              <div className="flex">
                <span className="text-slate-500 w-36 text-right pr-4">Relationship</span>
                <span className="font-medium">--</span>
              </div>
            </div>
            {getFieldsForSection("emergency-contact").length > 0 && (
              <div className="mt-4 space-y-1">
                {getFieldsForSection("emergency-contact").map((field) => (
                  <InfoRow
                    key={field.id}
                    label={field.name}
                    value={field.value || "--"}
                    isCustom
                    isMandatory={field.isMandatory}
                  />
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>


      {/* Insurance Coverage Section */}
      <Card>
        <CardHeader
          className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setInsuranceCoverageExpanded(!insuranceCoverageExpanded)}
        >
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <ChevronRight className={`h-4 w-4 transition-transform ${insuranceCoverageExpanded ? "rotate-90" : ""}`} />
            Insurance Coverage
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={(e) => {
                e.stopPropagation()
                handleOpenAddField("insurance-coverage")
              }}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button
              variant="link"
              className="text-teal-600 h-auto p-0 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-teal-600">Insurance Requirement</span>
            <HelpCircle className="h-3 w-3 text-slate-400" />
            <span className="font-medium">No</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                <span className="text-sm font-medium">Insurance Policies</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                <Plus className="h-3 w-3 mr-1" />
                Add Policy
              </Button>
            </div>
            <p className="text-sm text-slate-500">No policies found.</p>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-1">Notes <HelpCircle className="h-4 w-4 text-slate-400" /></CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={() => handleOpenAddField("notes")}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Download className="h-3 w-3 mr-1" />
              Download Notes
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Plus className="h-3 w-3 mr-1" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="divide-y">
            {notes.map((note) => (
              <div key={note.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <button type="button" onClick={() => onNoteClick?.(note)} className="text-sm font-medium text-teal-600 hover:underline text-left">{note.title}</button>
                    <div className="text-xs text-slate-500 mt-1">Created by {note.createdBy} on {note.createdAt}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-teal-600"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {getFieldsForSection("notes").length > 0 && (
            <div className="mt-4 space-y-1">
              {getFieldsForSection("notes").map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.name}
                  value={field.value || "--"}
                  isCustom
                  isMandatory={field.isMandatory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Custom Field Modal */}
      <Dialog open={showCustomFieldModal} onOpenChange={setShowCustomFieldModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-teal-600" />
              Add Custom Field
            </DialogTitle>
            <p className="text-sm text-slate-500">
              Add a new custom field to the{" "}
              {availableSections.find((s) => s.id === customFieldSection)?.name || "selected"} section.
              All custom fields are available for reporting.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Section</Label>
              <Select value={customFieldSection} onValueChange={setCustomFieldSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Field Name</Label>
              <Input
                placeholder="Enter field name..."
                value={newCustomField.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCustomField({ ...newCustomField, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Field Type</Label>
              <Select
                value={newCustomField.type}
                onValueChange={(val: TenantCustomFieldType) =>
                  setNewCustomField({ ...newCustomField, type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="dropdown">Dropdown / Multi-select</SelectItem>
                  <SelectItem value="yes_no">Yes / No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasDropdownOptions && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Options (comma separated)</Label>
                <Input
                  placeholder="Option 1, Option 2, Option 3..."
                  value={newCustomField.options}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCustomField({ ...newCustomField, options: e.target.value })
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
              <div>
                <p className="text-sm font-medium">Required Field</p>
                <p className="text-xs text-slate-500">Mark this field as mandatory</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNewCustomField({ ...newCustomField, isMandatory: !newCustomField.isMandatory })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newCustomField.isMandatory ? "bg-teal-600" : "bg-slate-200"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newCustomField.isMandatory ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <FileBarChart className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700">
                This field will be available in Tenant Directory reports
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomFieldModal(false)
                setNewCustomField({ name: "", type: "text", isMandatory: false, options: "" })
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleAddCustomField}
              disabled={!newCustomField.name.trim() || !customFieldSection}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Letters</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={() => handleOpenAddField("letters")}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Upload className="h-3 w-3 mr-1" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="divide-y">
            {letters.map((letter) => (
              <div key={letter.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-sm text-teal-600 cursor-pointer hover:underline">{letter.title}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500 text-right text-xs">Created on: {letter.createdOn}<br />{letter.createdTime}</span>
                  <span className="text-teal-600 cursor-pointer hover:underline flex items-center gap-1 text-xs">Preview</span>
                </div>
              </div>
            ))}
          </div>
          {getFieldsForSection("letters").length > 0 && (
            <div className="mt-4 space-y-1">
              {getFieldsForSection("letters").map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.name}
                  value={field.value || "--"}
                  isCustom
                  isMandatory={field.isMandatory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Monthly Charges</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
            onClick={() => handleOpenAddField("monthly-charges")}
          >
            <Plus className="h-3 w-3" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-end">

            <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
              <Plus className="h-3 w-3 mr-1" />
              Add New Charge
            </Button>
          </div>
          <p className="text-center text-sm font-medium">Total Charges For February: $1,100.00</p>
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Recurring Charges</h4>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <span className="font-semibold text-sm">$500.00</span>
                <div className="text-sm">
                  <span className="font-medium">4101: Section 8 Income</span><br />
                  <span className="text-slate-500">08/01/2025 to (no end date)</span>
                </div>
              </div>
              <div className="text-right text-sm">
                <span className="text-slate-500">Next Charge</span><br />
                <span className="font-medium">$500.00 on 03/01/2026</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <span className="font-semibold text-sm">$600.00</span>
                <div className="text-sm">
                  <span className="font-medium">4100: Rent Income</span><br />
                  <span className="text-slate-500">08/01/2025 to (no end date)</span>
                </div>
              </div>
              <div className="text-right text-sm">
                <span className="text-slate-500">Next Charge</span><br />
                <span className="font-medium">$600.00 on 03/01/2026</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Lease Information</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={() => handleOpenAddField("lease-information")}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex">
              <span className="text-slate-500 w-36">Lease From</span>
              <span className="font-medium">06/18/2024</span>
            </div>
            <div className="flex">
              <span className="text-slate-500 w-36">Lease To</span>
              <span className="font-medium">06/17/2025</span>
            </div>
          </div>
          {getFieldsForSection("lease-information").length > 0 && (
            <div className="mt-4 space-y-1">
              {getFieldsForSection("lease-information").map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.name}
                  value={field.value || "--"}
                  isCustom
                  isMandatory={field.isMandatory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Late Fee Policy</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={() => handleOpenAddField("late-fee-policy")}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-sm text-blue-700">
              The late fee policy for this tenant is set by the property.
            </p>
          </div>
          {getFieldsForSection("late-fee-policy").length > 0 && (
            <div className="mt-4 space-y-1">
              {getFieldsForSection("late-fee-policy").map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.name}
                  value={field.value || "--"}
                  isCustom
                  isMandatory={field.isMandatory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Animals</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={() => handleOpenAddField("animals")}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-600">Name</TableHead>
                <TableHead className="font-medium text-slate-600">Type / Breed</TableHead>
                <TableHead className="font-medium text-slate-600">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Xerxes</TableCell>
                <TableCell>Dog/Labrador Retriever</TableCell>
                <TableCell>45.0 lbs</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {getFieldsForSection("animals").length > 0 && (
            <div className="px-4 pb-4 pt-2 space-y-1 border-t border-border/50">
              {getFieldsForSection("animals").map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.name}
                  value={field.value || "--"}
                  isCustom
                  isMandatory={field.isMandatory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Vehicles</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
              onClick={() => handleOpenAddField("vehicles")}
            >
              <Plus className="h-3 w-3" />
              Add Field
            </Button>
            <Button variant="link" className="text-teal-600 h-auto p-0 text-sm">
              Edit
            </Button>

          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-600">Make</TableHead>
                <TableHead className="font-medium text-slate-600">Model</TableHead>
                <TableHead className="font-medium text-slate-600">Color</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Ford</TableCell>
                <TableCell>1967</TableCell>
                <TableCell>Black</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {getFieldsForSection("vehicles").length > 0 && (
            <div className="px-4 pb-4 pt-2 space-y-1 border-t border-border/50">
              {getFieldsForSection("vehicles").map((field) => (
                <InfoRow
                  key={field.id}
                  label={field.name}
                  value={field.value || "--"}
                  isCustom
                  isMandatory={field.isMandatory}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
