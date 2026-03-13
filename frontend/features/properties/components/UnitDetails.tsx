"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  accessOptions,
  shareLinksOptions,
  unitAmenities,
  documentsData,
  missingFields,
  missingDocuments,
  SHARE_RECIPIENTS,
} from "../data/unitDetails"
import { UNIT_DATA } from "../data/unitData"
import {
  ArrowLeft,
  Building2,
  Edit2,
  Plus,
  Calendar,
  User,
  Home,
  DollarSign,
  Key,
  Wrench,
  FileText,
  Share2,
  Copy,
  Search,
  QrCode,
  ChevronRight,
  X,
  Clock,
  Tag,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Bed,
  Bath,
  Square,
  ImageIcon,
  Eye,
  Pencil,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  BarChart3,
  ToggleRight,
  ListTodo,
  RotateCcw,
  Info,
  Wand2,
  ExternalLink,
  Send,
  MoreHorizontal,
  MapPin,
  Users,
  Mail,
  MessageSquare,
} from "lucide-react"

const UNIT_CUSTOM_FIELD_SECTIONS = [
  { id: "overview-unit-information", name: "Unit Information" },
  { id: "overview-tags", name: "Tags" },
  { id: "overview-amenities", name: "Amenities" },
  { id: "overview-maintenance-information", name: "Maintenance Information" },
  { id: "overview-fixed-assets", name: "Fixed Assets" },
  { id: "overview-vacancy-analysis", name: "Vacancy Analysis" },
  { id: "rental-rental-information", name: "Rental Information" },
  { id: "rental-current-tenants", name: "Current Tenants" },
  { id: "rental-past-tenants", name: "Past Tenants" },
  { id: "rental-access-information", name: "Access Information" },
  { id: "rental-notes", name: "Notes" },
]

interface UnitCustomField {
  id: string
  sectionId: string
  name: string
  type: string
  options?: string[]
  required: boolean
}

interface UnitDetailsProps {
  unitId?: string
  propertyId?: string
  onBack: () => void
}

export function UnitDetails({ unitId, propertyId, onBack }: UnitDetailsProps) {
  const [activeTab, setActiveTab] = useState<"unit-information" | "rental-information" | "marketing" | "maintenance" | "documents" | "audit-logs">("unit-information")
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false)
  const [showAccessInfoDialog, setShowAccessInfoDialog] = useState(false)
  const [accessCodeType, setAccessCodeType] = useState<"lockbox" | "showmojo">("lockbox")
  const [showMojoStartDate, setShowMojoStartDate] = useState("")
  const [showMojoEndDate, setShowMojoEndDate] = useState("")
  const [showMojoAccessOption, setShowMojoAccessOption] = useState("one-day")
  const [showMojoCodeDate, setShowMojoCodeDate] = useState("Feb 23, 2026")

  const [showShareLinksDialog, setShowShareLinksDialog] = useState(false)
  const [shareLinksRecipients, setShareLinksRecipients] = useState<string[]>([])
  const [shareLinksMessage, setShareLinksMessage] = useState("")
  const [shareViaEmail, setShareViaEmail] = useState(false)
  const [shareViaSMS, setShareViaSMS] = useState(false)

  const toggleShareLinksRecipient = (id: string) => {
    setShareLinksRecipients(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }
  const [visibleTaskCount, setVisibleTaskCount] = useState(5)

  // Overview tab section expanded states
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(true)
  const [vacancyAnalysisExpanded, setVacancyAnalysisExpanded] = useState(true)
  const [showAddCustomFieldDialog, setShowAddCustomFieldDialog] = useState(false)
  const [customFieldSection, setCustomFieldSection] = useState(UNIT_CUSTOM_FIELD_SECTIONS[0]?.id || "")
  const [customFieldName, setCustomFieldName] = useState("")
  const [customFieldType, setCustomFieldType] = useState("dropdown-multi")
  const [customFieldOptions, setCustomFieldOptions] = useState("")
  const [customFieldRequired, setCustomFieldRequired] = useState(false)
  const [unitCustomFields, setUnitCustomFields] = useState<UnitCustomField[]>([])

  // Documents tab state
  const [showUploadDocumentDialog, setShowUploadDocumentDialog] = useState(false)
  const [uploadDocumentType, setUploadDocumentType] = useState("")
  const [uploadDocumentAssignee, setUploadDocumentAssignee] = useState("")
  const [uploadDocumentComments, setUploadDocumentComments] = useState("")

  // Marketing form state
  const [isEditingMarketing, setIsEditingMarketing] = useState(false)
  const [marketingForm, setMarketingForm] = useState({
    postedToWebsite: UNIT_DATA.marketingInfo.postedToWebsite,
    postedToInternet: UNIT_DATA.marketingInfo.postedToInternet,
    premiumListing: UNIT_DATA.marketingInfo.premiumListing,
    removedFromVacanciesList: UNIT_DATA.marketingInfo.removedFromVacanciesList,
    availableOn: UNIT_DATA.marketingInfo.availableOn || "",
    marketingTitle: UNIT_DATA.marketingInfo.marketingTitle || "",
    marketingDescription: UNIT_DATA.marketingInfo.marketingDescription || "",
    youtubeVideoUrl: UNIT_DATA.marketingInfo.youtubeVideoUrl || "",
  })
  const [savedMarketing, setSavedMarketing] = useState({ ...marketingForm })

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLinkType, setShareLinkType] = useState("")
  const [shareRecipients, setShareRecipients] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState("")

  // Missing Information modal state
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [missingInfoTab, setMissingInfoTab] = useState<"fields" | "documents">("fields")
  const [showUploadMissingDocDialog, setShowUploadMissingDocDialog] = useState(false)
  const [uploadMissingDocType, setUploadMissingDocType] = useState("")

  const handleGoToField = (field: { name: string; section: string; tab: string }) => {
    setActiveTab(field.tab as "unit-information" | "rental-information" | "marketing" | "maintenance" | "documents" | "audit-logs")
    setShowMissingInfoModal(false)
  }

  const handleUploadMissingDoc = (docName: string) => {
    setUploadMissingDocType(docName)
    setShowUploadMissingDocDialog(true)
  }


  const openShareModal = (linkType: string) => {
    setShareLinkType(linkType)
    setShareRecipients([])
    setShareMessage("")
    setShowShareModal(true)
  }

  const toggleRecipient = (name: string, index: number) => {
    const key = `${name}-${index}`
    setShareRecipients((prev) =>
      prev.includes(key) ? prev.filter((r) => r !== key) : [...prev, key]
    )
  }

  const handleShareSend = () => {
    setShowShareModal(false)
  }

  const handleMarketingSave = () => {
    setSavedMarketing({ ...marketingForm })
    setIsEditingMarketing(false)
  }

  const handleMarketingCancel = () => {
    setMarketingForm({ ...savedMarketing })
    setIsEditingMarketing(false)
  }

  // Task summary counts
  const taskActivities = UNIT_DATA.upcomingActivities
  const pendingTasks = taskActivities.filter(a => a.status === "Pending" && !a.workflow).length
  const pendingProcesses = taskActivities.filter(a => a.status === "Pending" && a.workflow).length
  const overdueTasks = taskActivities.filter(a => a.isOverdue && !a.workflow).length
  const overdueProcesses = taskActivities.filter(a => a.isOverdue && a.workflow).length
  const [activityForm, setActivityForm] = useState({
    date: "",
    allDay: false,
    time: "",
    ampm: "AM",
    description: "",
    label: "",
    assignTo: "",
    status: "Pending",
  })

  const handleSaveActivity = () => {
    setShowAddActivityDialog(false)
    setActivityForm({
      date: "",
      allDay: false,
      time: "",
      ampm: "AM",
      description: "",
      label: "",
      assignTo: "",
      status: "Pending",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="px-6 pt-4">
        {/* Back Link */}
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Units</span>
        </button>

        {/* Header Card */}
        <div className="bg-white border border-border rounded-lg px-5 py-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Circular Icon */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                {/* Title with Status Badge */}
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-slate-800">
                    "{UNIT_DATA.propertyName}" {UNIT_DATA.address}
                  </h1>
                  <Badge className={UNIT_DATA.status === "Occupied" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
                    {UNIT_DATA.status}
                  </Badge>
                </div>
                {/* Details Row */}
                <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="text-blue-600 hover:underline cursor-pointer">{UNIT_DATA.propertyName}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{UNIT_DATA.propertyAddress}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-3.5 w-3.5" />
                    <span>{UNIT_DATA.bedrooms} Bed</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5" />
                    <span>{UNIT_DATA.bathrooms} Bath</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <Square className="h-3.5 w-3.5" />
                    <span>{UNIT_DATA.squareFeet} sqft</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-teal-500 text-teal-700 hover:bg-teal-50">
                <Users className="h-4 w-4" />
                Assigned Team
                <Badge className="bg-teal-500 text-white ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">3</Badge>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Pending Actions Bar - Missing Information */}
        {(missingFields.length > 0 || missingDocuments.length > 0) && (
          <div
            className="flex items-center justify-between rounded-lg border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50/80 px-4 py-3 cursor-pointer hover:bg-amber-50 transition-colors"
            onClick={() => setShowMissingInfoModal(true)}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Pending Actions</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-700" />
                <span className="text-sm text-amber-800">Missing Fields: <span className="font-semibold">{missingFields.length}</span></span>
              </div>
              <div className="h-4 w-px bg-amber-300" />
              <div className="flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-amber-700" />
                <span className="text-sm text-amber-800">Missing Documents: <span className="font-semibold">{missingDocuments.length}</span></span>
              </div>
            </div>
          </div>
        )}

        {/* Task Overview Bar */}
        <div className="flex items-center justify-between rounded-lg border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Task Overview</span>
          </div>
          <div className="flex items-center gap-0">
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <ListTodo className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">Pending Tasks: <span className="font-semibold">{pendingTasks}</span></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-sm text-amber-800">Pending Processes: <span className="font-semibold">{pendingProcesses}</span></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 border-r border-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-sm text-red-700">Overdue Tasks: <span className="font-semibold">{overdueTasks}</span></span>
            </div>
            <div className="flex items-center gap-1.5 px-3">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-sm text-red-700">Overdue Processes: <span className="font-semibold">{overdueProcesses}</span></span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "unit-information" | "rental-information" | "marketing" | "maintenance" | "documents" | "audit-logs")} className="w-full">
          <TabsList className="bg-transparent border-b border-slate-200 rounded-none p-0 h-auto w-full justify-start gap-0">
            <TabsTrigger
              value="unit-information"
              className="px-6 py-3 rounded-none border-2 border-transparent bg-transparent text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-none data-[state=active]:font-medium -mb-px"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="rental-information"
              className="px-6 py-3 rounded-none border-2 border-transparent bg-transparent text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-none data-[state=active]:font-medium -mb-px"
            >
              Rental Information
            </TabsTrigger>
            <TabsTrigger
              value="marketing"
              className="px-6 py-3 rounded-none border-2 border-transparent bg-transparent text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-none data-[state=active]:font-medium -mb-px"
            >
              Marketing
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="px-6 py-3 rounded-none border-2 border-transparent bg-transparent text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-none data-[state=active]:font-medium -mb-px"
            >
              Maintenance
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="px-6 py-3 rounded-none border-2 border-transparent bg-transparent text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-none data-[state=active]:font-medium -mb-px"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="audit-logs"
              className="px-6 py-3 rounded-none border-2 border-transparent bg-transparent text-slate-600 data-[state=active]:border-teal-600 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-none data-[state=active]:font-medium -mb-px"
            >
              Audit Logs
              <span className="ml-2 text-slate-400 font-normal">{UNIT_DATA.auditLog.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* Unit Information Tab */}
          <TabsContent value="unit-information" className="space-y-6 mt-6">
            {/* Upcoming Activities */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b bg-slate-50 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    Task Summary
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    onClick={() => setShowAddActivityDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {UNIT_DATA.upcomingActivities.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 border-b">
                        <TableHead className="font-medium text-slate-600 py-3">Task</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Related Entity</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Due Date</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Priority</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Status</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3">Assigned To</TableHead>
                        <TableHead className="font-medium text-slate-600 py-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {UNIT_DATA.upcomingActivities.slice(0, visibleTaskCount).map((activity) => (
                        <TableRow key={activity.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <span className="text-sm font-medium text-slate-800 block">{activity.taskName}</span>
                              {activity.workflow && (
                                <span className="text-xs text-teal-600 cursor-pointer hover:underline block">
                                  % {activity.workflow}
                                </span>
                              )}
                              {activity.autoCreated && (
                                <span className="text-xs text-slate-400 block">Auto-created</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-slate-600">
                              {activity.relatedEntityType}: {activity.relatedEntityName}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${activity.isOverdue ? "text-red-600" : "text-slate-600"}`}>
                                {activity.dueDate}
                              </span>
                              {activity.isOverdue && (
                                <span className="text-xs text-red-500">(Overdue)</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${activity.priority === "High"
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : activity.priority === "Medium"
                                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                }`}
                            >
                              {activity.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${activity.status === "Pending"
                                  ? "bg-yellow-50 text-yellow-600 border-yellow-300"
                                  : activity.status === "In Progress"
                                    ? "bg-teal-50 text-teal-600 border-teal-300"
                                    : "bg-slate-50 text-slate-500 border-slate-300"
                                }`}
                            >
                              {activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-slate-600">{activity.assignedTo}</span>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-green-600 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>No upcoming activities</p>
                  </div>
                )}
                {/* View More / View Less Buttons */}
                <div className="flex items-center justify-center gap-3 py-3 border-t border-slate-100">
                  {visibleTaskCount < UNIT_DATA.upcomingActivities.length && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setVisibleTaskCount((prev) => Math.min(prev + 5, UNIT_DATA.upcomingActivities.length))}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" />
                      View More
                    </Button>
                  )}
                  {visibleTaskCount > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      onClick={() => setVisibleTaskCount((prev) => Math.max(prev - 5, 5))}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" />
                      View Less
                    </Button>
                  )}
                </div>
                {unitCustomFields.filter((field) => field.sectionId === "overview-task-summary").length > 0 && (
                  <div className="px-6 pb-4 space-y-1 border-t border-slate-100">
                    {unitCustomFields
                      .filter((field) => field.sectionId === "overview-task-summary")
                      .map((field) => (
                        <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                          <span className="text-slate-500 flex items-center gap-2">
                            {field.name}
                            {field.required && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">
                                Required
                              </span>
                            )}
                          </span>
                          <span className="font-medium text-slate-800">--</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Unit Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Home className="h-5 w-5 text-blue-600" />
                    Unit Information
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("overview-unit-information")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Status</span>
                    <Badge className="bg-emerald-100 text-emerald-700">{UNIT_DATA.status}</Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Rent Ready</span>
                    <span className="font-medium text-emerald-600">{UNIT_DATA.rentReady ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Ready For Showing On</span>
                    <span className="font-medium">{UNIT_DATA.readyForShowingOn || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Utility Billing (RUBS) Enabled</span>
                    <span className="font-medium">{UNIT_DATA.utilityBillingEnabled ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Lockbox</span>
                    <span className="text-blue-600 cursor-pointer hover:underline">{UNIT_DATA.lockbox || "— Add"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Description</span>
                    <span className="font-medium">{UNIT_DATA.description || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Tag className="h-5 w-5 text-purple-600" />
                    Tags
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                    onClick={() => {
                      setCustomFieldSection("overview-tags")
                      setShowAddCustomFieldDialog(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {UNIT_DATA.tags.length > 0 ? (
                    UNIT_DATA.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
                {unitCustomFields.filter((field) => field.sectionId === "overview-tags").length > 0 && (
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
                    {unitCustomFields
                      .filter((field) => field.sectionId === "overview-tags")
                      .map((field) => (
                        <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                          <span className="text-slate-500 flex items-center gap-2">
                            {field.name}
                            {field.required && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">
                                Required
                              </span>
                            )}
                          </span>
                          <span className="font-medium text-slate-800">--</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <CheckSquare className="h-5 w-5 text-slate-600" />
                    Amenities
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("overview-amenities")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50 h-8">
                      Edit
                    </Button>
                    <button
                      type="button"
                      onClick={() => setAmenitiesExpanded(!amenitiesExpanded)}
                      className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      {amenitiesExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>
              {amenitiesExpanded && (
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {unitAmenities.map((amenity, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white text-green-700 border-green-500 px-3 py-1 font-normal"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  {unitCustomFields.filter((field) => field.sectionId === "overview-amenities").length > 0 && (
                    <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
                      {unitCustomFields
                        .filter((field) => field.sectionId === "overview-amenities")
                        .map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-slate-500 flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">
                                  Required
                                </span>
                              )}
                            </span>
                            <span className="font-medium text-slate-800">--</span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Maintenance Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Wrench className="h-5 w-5 text-slate-600" />
                    Maintenance Information
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("overview-maintenance-information")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Unit Specific Notes</span>
                  <span className="font-medium">{UNIT_DATA.maintenanceNotes}</span>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Assets */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Fixed Assets</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("overview-fixed-assets")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Asset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-slate-500 py-4">Click Add Asset to add a fixed asset.</p>
                {unitCustomFields.filter((field) => field.sectionId === "overview-fixed-assets").length > 0 && (
                  <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
                    {unitCustomFields
                      .filter((field) => field.sectionId === "overview-fixed-assets")
                      .map((field) => (
                        <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                          <span className="text-slate-500 flex items-center gap-2">
                            {field.name}
                            {field.required && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">
                                Required
                              </span>
                            )}
                          </span>
                          <span className="font-medium text-slate-800">--</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vacancy Analysis */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                    Vacancy Analysis
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("overview-vacancy-analysis")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <button
                      type="button"
                      onClick={() => setVacancyAnalysisExpanded(!vacancyAnalysisExpanded)}
                      className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      {vacancyAnalysisExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>
              {vacancyAnalysisExpanded && (
                <CardContent className="p-6">
                  <p className="text-center text-slate-500 py-4">Click Add Custom Field to add custom fields for vacancy analysis.</p>
                  {unitCustomFields.filter((field) => field.sectionId === "overview-vacancy-analysis").length > 0 && (
                    <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
                      {unitCustomFields
                        .filter((field) => field.sectionId === "overview-vacancy-analysis")
                        .map((field) => (
                          <div key={field.id} className="flex justify-between items-center py-1 text-sm">
                            <span className="text-slate-500 flex items-center gap-2">
                              {field.name}
                              {field.required && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-50 text-red-600 rounded">
                                  Required
                                </span>
                              )}
                            </span>
                            <span className="font-medium text-slate-800">--</span>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

          </TabsContent>

          {/* Rental Information Tab */}
          <TabsContent value="rental-information" className="space-y-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Rental Information
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("rental-rental-information")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Bed className="h-4 w-4" /> Bedrooms
                    </span>
                    <span className="font-medium">{UNIT_DATA.bedrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Bath className="h-4 w-4" /> Bathrooms
                    </span>
                    <span className="font-medium">{UNIT_DATA.bathrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Square className="h-4 w-4" /> Square Feet
                    </span>
                    <span className="font-medium">{UNIT_DATA.squareFeet.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Market Rent</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${UNIT_DATA.marketRent.toLocaleString()}</span>
                      <span className="text-blue-600 text-sm cursor-pointer hover:underline">
                        View Nearby Advertised Units
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Use Market Rent on Ads?</span>
                    <span className="font-medium text-emerald-600">{UNIT_DATA.useMarketRentOnAds ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Application Fee</span>
                    <span className="font-medium">${UNIT_DATA.applicationFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Security Deposit</span>
                    <span className="font-medium">${UNIT_DATA.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Rent Status</span>
                    <span className="font-medium">{UNIT_DATA.rentStatus || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Legal Rent</span>
                    <span className="font-medium">
                      {UNIT_DATA.legalRent ? `$${UNIT_DATA.legalRent.toLocaleString()}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Preferential Rent</span>
                    <span className="font-medium">
                      {UNIT_DATA.preferentialRent ? `$${UNIT_DATA.preferentialRent}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Utilities Included</span>
                    <span className="font-medium">{UNIT_DATA.utilitiesIncluded.join(", ") || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Appliances Included</span>
                    <span className="font-medium">{UNIT_DATA.appliancesIncluded.join(", ") || "—"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 col-span-2">
                    <span className="text-slate-500">Additional Lease Information</span>
                    <span className="font-medium">{UNIT_DATA.additionalLeaseInfo || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Tenants */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <User className="h-5 w-5 text-blue-600" />
                    Current Tenants
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                    onClick={() => {
                      setCustomFieldSection("rental-current-tenants")
                      setShowAddCustomFieldDialog(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Type</TableHead>
                      <TableHead className="font-semibold text-slate-700">Move In</TableHead>
                      <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                      <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UNIT_DATA.currentTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-600 font-medium cursor-pointer hover:underline">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.type}</TableCell>
                        <TableCell>{tenant.moveIn}</TableCell>
                        <TableCell>
                          <span className="text-blue-600 cursor-pointer hover:underline">Home: {tenant.phone}</span>
                        </TableCell>
                        <TableCell className="text-blue-600 cursor-pointer hover:underline">{tenant.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {UNIT_DATA.currentTenants.length > 0 && (
                  <div className="p-4 border-t bg-slate-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Lease Terms</span>
                        <span className="ml-2 font-medium">{UNIT_DATA.currentTenants[0].leaseTerms}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Deposits Paid</span>
                        <span className="ml-2 font-medium">
                          ${UNIT_DATA.currentTenants[0].depositsPaid?.toLocaleString() || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Tenants */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Past Tenants</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                    onClick={() => {
                      setCustomFieldSection("rental-past-tenants")
                      setShowAddCustomFieldDialog(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Type</TableHead>
                      <TableHead className="font-semibold text-slate-700">Move In</TableHead>
                      <TableHead className="font-semibold text-slate-700">Move Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UNIT_DATA.pastTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="hover:bg-blue-50/50">
                        <TableCell className="text-blue-600 font-medium cursor-pointer hover:underline">
                          {tenant.name}
                        </TableCell>
                        <TableCell>{tenant.type}</TableCell>
                        <TableCell>{tenant.moveIn}</TableCell>
                        <TableCell>{tenant.moveOut}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Access Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Key className="h-5 w-5 text-amber-600" />
                    Access Information
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("rental-access-information")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <button
                      type="button"
                      className="flex items-center justify-center transition-colors cursor-pointer text-blue-600 hover:text-blue-700"
                      title="Share Access Information"
                      onClick={() => setShowShareLinksDialog(true)}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowAccessInfoDialog(true)}
                  >
                    <Search className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-blue-600">Lockbox Code</span>
                    <span className="text-sm font-semibold text-slate-900">5893 2474</span>
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 h-7"
                    onClick={() => {
                      navigator.clipboard.writeText("5893 2474")
                    }}
                  >
                    <Copy className="h-3 w-3" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Notes
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white border-slate-200 text-slate-800 hover:bg-slate-50 gap-1 px-3"
                      onClick={() => {
                        setCustomFieldSection("rental-notes")
                        setShowAddCustomFieldDialog(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                      Add Field
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-slate-600 border-slate-200 hover:bg-slate-50 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Notes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-slate-500 py-4">No notes yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6 mt-6">
            {/* Marketing Information */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Marketing Information</CardTitle>
                  {!isEditingMarketing && (
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setIsEditingMarketing(true)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="max-w-2xl space-y-4">
                  {/* Top row: short label+value pairs in 2 columns */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm text-slate-500">Posted to your Website</span>
                      <span className="text-sm font-medium text-slate-900">{marketingForm.postedToWebsite ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm text-slate-500">Posted to the Internet</span>
                      <span className="text-sm font-medium text-slate-900">{marketingForm.postedToInternet ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm text-slate-500 flex items-center gap-1">Premium Listing <Info className="h-3.5 w-3.5 text-blue-500" /></span>
                      <span className="text-sm font-medium text-slate-900">{marketingForm.premiumListing ? "On" : "Off"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm text-slate-500">Removed from Vacancies List</span>
                      {isEditingMarketing ? (
                        <Checkbox
                          checked={marketingForm.removedFromVacanciesList}
                          onCheckedChange={(checked) => setMarketingForm({ ...marketingForm, removedFromVacanciesList: !!checked })}
                        />
                      ) : (
                        <Checkbox checked={marketingForm.removedFromVacanciesList} disabled />
                      )}
                    </div>
                  </div>

                  {/* Available On */}
                  <div className="flex items-center gap-3">
                    <Label className="w-44 text-right text-sm text-slate-500 shrink-0">Available On</Label>
                    {isEditingMarketing ? (
                      <Input
                        type="date"
                        value={marketingForm.availableOn}
                        onChange={(e) => setMarketingForm({ ...marketingForm, availableOn: e.target.value })}
                        className="h-8 w-48"
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-900">{marketingForm.availableOn || "—"}</span>
                    )}
                  </div>

                  {/* Marketing Title */}
                  <div className="flex items-center gap-3">
                    <Label className="w-44 text-right text-sm text-slate-500 shrink-0">Marketing Title</Label>
                    {isEditingMarketing ? (
                      <Input
                        value={marketingForm.marketingTitle}
                        onChange={(e) => setMarketingForm({ ...marketingForm, marketingTitle: e.target.value })}
                        className="h-8 flex-1"
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-900">{marketingForm.marketingTitle || "—"}</span>
                    )}
                  </div>

                  {/* Marketing Description */}
                  <div className="flex items-start gap-3">
                    <Label className="w-44 text-right text-sm text-slate-500 shrink-0 pt-1.5">Marketing Description</Label>
                    <div className="flex-1">
                      {isEditingMarketing && (
                        <div className="flex items-center gap-1 mb-1.5">
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-slate-600">
                            <Wand2 className="h-3.5 w-3.5" />
                            Generate Description For Me
                          </Button>
                          <Info className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                      )}
                      {isEditingMarketing ? (
                        <Textarea
                          value={marketingForm.marketingDescription}
                          onChange={(e) => setMarketingForm({ ...marketingForm, marketingDescription: e.target.value })}
                          className="min-h-[120px] resize-y"
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-900">{marketingForm.marketingDescription || "—"}</span>
                      )}
                    </div>
                  </div>

                  {/* YouTube Video URL */}
                  <div className="flex items-center gap-3">
                    <Label className="w-44 text-right text-sm text-slate-500 shrink-0 flex items-center justify-end gap-1">
                      YouTube Video URL <Info className="h-3.5 w-3.5 text-blue-500" />
                    </Label>
                    {isEditingMarketing ? (
                      <Input
                        value={marketingForm.youtubeVideoUrl}
                        onChange={(e) => setMarketingForm({ ...marketingForm, youtubeVideoUrl: e.target.value })}
                        className="h-8 flex-1"
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-900">{marketingForm.youtubeVideoUrl || "—"}</span>
                    )}
                  </div>

                  {/* Save / Cancel */}
                  {isEditingMarketing && (
                    <div className="flex items-center gap-3 pt-1">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4" onClick={handleMarketingSave}>
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-4" onClick={handleMarketingCancel}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Unit Images */}
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Unit Images</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <ImageIcon className="h-10 w-10 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-600">
                    <span className="font-semibold text-blue-600">Drag images here</span>
                    <span className="mx-2">or</span>
                    <span className="font-semibold text-blue-600 hover:underline">Choose files to upload</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP up to 10MB each</p>
                </div>
              </CardContent>
            </Card>

            {/* Link Cards */}
            <div className="space-y-3">
              {[
                { label: "Application Link", key: "application" },
                { label: "Showing Link", key: "showing" },
                { label: "Matterport Scan", key: "matterport" },
                { label: "Rental Comps", key: "rental-comps" },
              ].map((item) => (
                <div key={item.key} className="flex items-center border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 flex-1 px-4 py-3">
                    <ExternalLink className="h-4 w-4 text-green-600 shrink-0" />
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2 text-left">
                      {item.label}
                    </button>
                  </div>
                  <button
                    onClick={() => openShareModal(item.label)}
                    className="px-4 py-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-r-lg transition-colors cursor-pointer"
                    aria-label={`Share ${item.label}`}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Share Links Modal */}
            {showShareModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Share Links</h3>
                    <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-500 tracking-wide mb-3">EMAIL TO:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SHARE_RECIPIENTS.map((recipient, index) => {
                        const key = `${recipient.name}-${index}`
                        const isSelected = shareRecipients.includes(key)
                        return (
                          <button
                            key={key}
                            onClick={() => toggleRecipient(recipient.name, index)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-colors ${isSelected
                                ? "border-green-400 bg-green-50"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                          >
                            <div className={`h-6 w-6 rounded-full ${recipient.color} flex items-center justify-center shrink-0`}>
                              <span className="text-white text-xs font-medium">{recipient.name.charAt(0)}</span>
                            </div>
                            <span className="text-sm text-slate-700 truncate flex-1">{recipient.name}</span>
                            <Checkbox
                              checked={isSelected}
                              className="shrink-0 pointer-events-none"
                              tabIndex={-1}
                            />
                          </button>
                        )
                      })}
                    </div>

                    {/* Message */}
                    <div className="mt-4">
                      <Textarea
                        placeholder="Add message..."
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        className="min-h-[60px] resize-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="h-9 px-5" onClick={() => setShowShareModal(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" className="h-9 px-5 bg-green-600 hover:bg-green-700 text-white gap-1.5" onClick={handleShareSend}>
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Wrench className="h-5 w-5 text-slate-600" />
                    Work Orders
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5">
                      <Plus className="h-4 w-4" />
                      New Work Order
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">Work Order</TableHead>
                      <TableHead className="font-semibold text-slate-700">Title</TableHead>
                      <TableHead className="font-semibold text-slate-700">Category</TableHead>
                      <TableHead className="font-semibold text-slate-700">Assigned To</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Priority</TableHead>
                      <TableHead className="font-semibold text-slate-700">Created</TableHead>
                      <TableHead className="font-semibold text-slate-700">Closed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: "WO-001", title: "HVAC System Repair", description: "Air conditioning unit not cooling properly", status: "In Progress", priority: "High", assignedTo: "John Martinez", category: "HVAC", createdDate: "2024-01-15", closedDate: null },
                      { id: "WO-002", title: "Plumbing Leak Fix", description: "Kitchen sink leak reported by tenant", status: "Completed", priority: "Medium", assignedTo: "Sarah Johnson", category: "Plumbing", createdDate: "2024-01-10", closedDate: "2024-01-12" },
                      { id: "WO-003", title: "Electrical Outlet Replacement", description: "Faulty outlet in living room", status: "Pending", priority: "Low", assignedTo: "Mike Chen", category: "Electrical", createdDate: "2024-01-18", closedDate: null },
                    ].map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm text-slate-800">{order.title}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{order.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {order.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-teal-700">
                                {order.assignedTo.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <span className="text-sm text-slate-700">{order.assignedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${order.status === "Completed"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : order.status === "In Progress"
                                  ? "border-blue-300 bg-blue-50 text-blue-700"
                                  : "border-amber-300 bg-amber-50 text-amber-700"
                              }`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${order.priority === "High"
                                ? "border-red-300 bg-red-50 text-red-700"
                                : order.priority === "Medium"
                                  ? "border-amber-300 bg-amber-50 text-amber-700"
                                  : "border-gray-300 bg-gray-50 text-gray-700"
                              }`}
                          >
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {new Date(order.createdDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {order.closedDate ? new Date(order.closedDate).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <FileText className="h-5 w-5 text-slate-600" />
                    Documents ({documentsData.length})
                  </CardTitle>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5"
                    onClick={() => setShowUploadDocumentDialog(true)}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b text-sm font-medium text-slate-600">
                  <div className="col-span-6">Document Name</div>
                  <div className="col-span-2">Received Date</div>
                  <div className="col-span-2">Received Time</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100">
                  {documentsData.map((doc, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
                      <div className="col-span-6 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">{doc.name}</span>
                      </div>
                      <div className="col-span-2 text-sm text-slate-600">{doc.receivedDate}</div>
                      <div className="col-span-2 text-sm text-slate-600">{doc.receivedTime}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit-logs" className="space-y-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-slate-50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Clock className="h-5 w-5 text-slate-600" />
                    Audit Log
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {UNIT_DATA.auditLog.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <div className="text-sm">
                        <span className="text-amber-600 font-medium">{entry.date}</span>
                        <span className="text-slate-600 ml-2">{entry.action}</span>
                        <span className="text-slate-400"> – </span>
                        <span className="text-blue-600">{entry.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Activity Dialog */}
        <Dialog open={showAddActivityDialog} onOpenChange={setShowAddActivityDialog}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-t-lg">
              <DialogTitle className="text-xl font-semibold">New Activity</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm">
                  <span className="text-slate-600">Unit:</span>{" "}
                  <span className="text-blue-600 font-medium">
                    "{UNIT_DATA.propertyName}" {UNIT_DATA.address}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={activityForm.date}
                  onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="allDay"
                  checked={activityForm.allDay}
                  onCheckedChange={(checked) => setActivityForm({ ...activityForm, allDay: checked as boolean })}
                />
                <Label htmlFor="allDay" className="text-sm text-slate-600">
                  All Day
                </Label>
              </div>

              {!activityForm.allDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Time</Label>
                    <Input
                      placeholder="HH:MM"
                      value={activityForm.time}
                      onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">AM/PM</Label>
                    <Select
                      value={activityForm.ampm}
                      onValueChange={(value) => setActivityForm({ ...activityForm, ampm: value })}
                    >
                      <SelectTrigger className="border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="e.g. Tenant Move Out & Walk-Through"
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value.slice(0, 500) })}
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                />
                <p className="text-xs text-slate-400">{activityForm.description.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Label</Label>
                  <Select
                    value={activityForm.label}
                    onValueChange={(value) => setActivityForm({ ...activityForm, label: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOVE IN">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-500" />
                          MOVE IN
                        </span>
                      </SelectItem>
                      <SelectItem value="MOVE OUT">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          MOVE OUT
                        </span>
                      </SelectItem>
                      <SelectItem value="INSPECTION">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          INSPECTION
                        </span>
                      </SelectItem>
                      <SelectItem value="RENEWAL">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          RENEWAL
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Assign To</Label>
                  <Select
                    value={activityForm.assignTo}
                    onValueChange={(value) => setActivityForm({ ...activityForm, assignTo: value })}
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Laura Taylor">Laura Taylor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Status</Label>
                <Select
                  value={activityForm.status}
                  onValueChange={(value) => setActivityForm({ ...activityForm, status: value })}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    </SelectItem>
                    <SelectItem value="In Progress">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        In Progress
                      </span>
                    </SelectItem>
                    <SelectItem value="Completed">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Completed
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t rounded-b-lg">
              <Button variant="outline" onClick={() => setShowAddActivityDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveActivity}
                disabled={!activityForm.date || !activityForm.description}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Access Information Dialog */}
        <Dialog open={showAccessInfoDialog} onOpenChange={setShowAccessInfoDialog}>
          <DialogContent className="sm:max-w-md p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <DialogTitle className="text-lg font-semibold">Access Information</DialogTitle>
              <button
                type="button"
                onClick={() => setShowAccessInfoDialog(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Lockbox Code Section */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${accessCodeType === "lockbox" ? "border-green-600" : "border-slate-300"
                      }`}
                    onClick={() => setAccessCodeType("lockbox")}
                  >
                    {accessCodeType === "lockbox" && (
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">Lockbox Code</span>
                </label>

                {accessCodeType === "lockbox" && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <div className="flex-1 px-3 py-2">
                        <span className="text-sm font-medium text-slate-900">5893 2474</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5 h-full rounded-none border-l border-slate-200 px-3"
                        onClick={() => navigator.clipboard.writeText("5893 2474")}
                      >
                        <Copy className="h-3 w-3" />
                        Copy Lockbox Code
                      </Button>
                    </div>
                    <div className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-slate-700" />
                    </div>
                  </div>
                )}

                {accessCodeType === "lockbox" && (
                  <Button
                    className="w-auto gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => navigator.clipboard.writeText("5893 2474")}
                  >
                    <Copy className="h-4 w-4" />
                    Copy Lockbox Code
                  </Button>
                )}
              </div>

              {/* ShowMojo Code Section */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${accessCodeType === "showmojo" ? "border-green-600" : "border-slate-300"
                      }`}
                    onClick={() => setAccessCodeType("showmojo")}
                  >
                    {accessCodeType === "showmojo" && (
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">ShowMojo Code</span>
                </label>

                {accessCodeType === "showmojo" && (
                  <div className="space-y-3 pl-6">
                    {/* Get a one-time-use code link */}
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Get a one-time-use code (in EST)
                    </button>

                    {/* Other Access Options dropdown */}
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Other access options</label>
                      <select
                        value={showMojoAccessOption}
                        onChange={(e) => setShowMojoAccessOption(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {accessOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Get a code for date */}
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Get a code (in EST) for</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={showMojoCodeDate}
                          onChange={(e) => setShowMojoCodeDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Clear All Access Codes link */}
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Clear All Access Codes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
              <Button
                variant="outline"
                onClick={() => setShowAccessInfoDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  navigator.clipboard.writeText("5893 2474")
                  setShowAccessInfoDialog(false)
                }}
              >
                <Copy className="h-4 w-4" />
                Copy Lockbox Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Links Dialog */}
        <Dialog open={showShareLinksDialog} onOpenChange={setShowShareLinksDialog}>
          <DialogContent className="sm:max-w-md p-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <DialogTitle className="text-lg font-semibold">Share Links</DialogTitle>
              <button
                type="button"
                onClick={() => setShowShareLinksDialog(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email To:</label>
                <div className="grid grid-cols-2 gap-3">
                  {shareLinksOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleShareLinksRecipient(option.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${shareLinksRecipients.includes(option.id)
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${option.color} flex items-center justify-center`}>
                          <User className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm text-slate-700 text-left">{option.label}</span>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${shareLinksRecipients.includes(option.id)
                          ? "border-green-500 bg-green-500"
                          : "border-slate-300"
                        }`}>
                        {shareLinksRecipients.includes(option.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Share Via Options */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Share Via:</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShareViaEmail(!shareViaEmail)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors cursor-pointer ${shareViaEmail
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <Mail className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Email</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${shareViaEmail
                        ? "border-green-500 bg-green-500"
                        : "border-slate-300"
                      }`}>
                      {shareViaEmail && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareViaSMS(!shareViaSMS)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors cursor-pointer ${shareViaSMS
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <MessageSquare className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">SMS</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${shareViaSMS
                        ? "border-green-500 bg-green-500"
                        : "border-slate-300"
                      }`}>
                      {shareViaSMS && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Add message..."
                  value={shareLinksMessage}
                  onChange={(e) => setShareLinksMessage(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg resize-none h-20 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowShareLinksDialog(false)
                  setShareLinksRecipients([])
                  setShareLinksMessage("")
                  setShareViaEmail(false)
                  setShareViaSMS(false)
                }}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  setShowShareLinksDialog(false)
                  setShareLinksRecipients([])
                  setShareLinksMessage("")
                  setShareViaEmail(false)
                  setShareViaSMS(false)
                }}
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Custom Field Dialog */}
        <Dialog open={showAddCustomFieldDialog} onOpenChange={setShowAddCustomFieldDialog}>
          <DialogContent className="sm:max-w-md p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-teal-600" />
                <DialogTitle className="text-lg font-semibold text-slate-900">Add Custom Field</DialogTitle>
              </div>
              {/* <button
                type="button"
                onClick={() => setShowAddCustomFieldDialog(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button> */}
            </div>

            <div className="px-6 pb-2">
              <p className="text-sm text-slate-400">
                Add a new custom field to the{" "}
                {UNIT_CUSTOM_FIELD_SECTIONS.find((s) => s.id === customFieldSection)?.name || "selected"}{" "}
                section. All custom fields are available for reporting.
              </p>
            </div>

            <div className="px-6 py-4 space-y-5">
              {/* Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Section</Label>
                <Select value={customFieldSection} onValueChange={setCustomFieldSection}>
                  <SelectTrigger className="w-48 border-teal-500 focus:ring-teal-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_CUSTOM_FIELD_SECTIONS.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Field Name</Label>
                <Input
                  placeholder="Enter field name..."
                  value={customFieldName}
                  onChange={(e) => setCustomFieldName(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Field Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Field Type</Label>
                <Select value={customFieldType} onValueChange={setCustomFieldType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dropdown-multi">Dropdown / Multi-select</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Options (for dropdown) */}
              {(customFieldType === "dropdown-multi") && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Options (comma separated)</Label>
                  <Input
                    placeholder="Option 1, Option 2, Option 3..."
                    value={customFieldOptions}
                    onChange={(e) => setCustomFieldOptions(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}

              {/* Required Field Toggle */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">Required Field</p>
                  <p className="text-xs text-teal-600">Mark this field as mandatory</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomFieldRequired(!customFieldRequired)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${customFieldRequired ? "bg-teal-600" : "bg-slate-300"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${customFieldRequired ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              {/* Info Box */}
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                <p className="text-sm text-blue-500">This field will be available in Owner Directory reports</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddCustomFieldDialog(false)
                  setCustomFieldName("")
                  setCustomFieldOptions("")
                  setCustomFieldRequired(false)
                }}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                disabled={!customFieldName.trim() || !customFieldSection}
                onClick={() => {
                  if (!customFieldName.trim() || !customFieldSection) return
                  const newField: UnitCustomField = {
                    id: `unit_cf_${Date.now()}`,
                    sectionId: customFieldSection,
                    name: customFieldName.trim(),
                    type: customFieldType,
                    options:
                      customFieldType === "dropdown-multi"
                        ? customFieldOptions
                          .split(",")
                          .map((opt) => opt.trim())
                          .filter(Boolean)
                        : undefined,
                    required: customFieldRequired,
                  }
                  setUnitCustomFields((prev) => [...prev, newField])
                  setShowAddCustomFieldDialog(false)
                  setCustomFieldName("")
                  setCustomFieldOptions("")
                  setCustomFieldRequired(false)
                }}
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Document Dialog */}
        <Dialog open={showUploadDocumentDialog} onOpenChange={setShowUploadDocumentDialog}>
          <DialogContent className="sm:max-w-md p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-slate-600" />
                <DialogTitle className="text-lg font-semibold text-slate-900">Upload Document</DialogTitle>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadDocumentDialog(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-5">
              {/* Upload File Area */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Upload File</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                </div>
              </div>

              {/* Document Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Document Type</Label>
                <Select value={uploadDocumentType} onValueChange={setUploadDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agreement">Agreement</SelectItem>
                    <SelectItem value="inspection">Inspection Report</SelectItem>
                    <SelectItem value="insurance">Insurance Certificate</SelectItem>
                    <SelectItem value="tax">Tax Form</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Assignee (Optional)</Label>
                <Select value={uploadDocumentAssignee} onValueChange={setUploadDocumentAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comments (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Comments (Optional)</Label>
                <textarea
                  placeholder="Add any comments about this document"
                  value={uploadDocumentComments}
                  onChange={(e) => setUploadDocumentComments(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadDocumentDialog(false)
                  setUploadDocumentType("")
                  setUploadDocumentAssignee("")
                  setUploadDocumentComments("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  setShowUploadDocumentDialog(false)
                  setUploadDocumentType("")
                  setUploadDocumentAssignee("")
                  setUploadDocumentComments("")
                }}
              >
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Missing Information Modal */}
        <Dialog open={showMissingInfoModal} onOpenChange={setShowMissingInfoModal}>
          <DialogContent className="sm:max-w-lg p-0">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-slate-900">Missing Information</DialogTitle>
                  <p className="text-sm text-muted-foreground">Complete these items to ensure accurate records</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMissingInfoModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setMissingInfoTab("fields")}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${missingInfoTab === "fields"
                      ? "bg-teal-50 text-teal-700 border border-b-0 border-teal-200"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                >
                  Missing Fields ({missingFields.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMissingInfoTab("documents")}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${missingInfoTab === "documents"
                      ? "bg-teal-50 text-teal-700 border border-b-0 border-teal-200"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                >
                  Missing Documents ({missingDocuments.length})
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
              {missingInfoTab === "fields" ? (
                <div className="space-y-3">
                  {missingFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{field.name}</p>
                        <p className="text-xs text-slate-500">{field.section}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-teal-700 border-teal-200 hover:bg-teal-50"
                        onClick={() => handleGoToField(field)}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                        Go to field
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {missingDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                        <p className="text-xs text-slate-500">{doc.section}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-teal-700 border-teal-200 hover:bg-teal-50"
                        onClick={() => handleUploadMissingDoc(doc.name)}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowMissingInfoModal(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Upload Missing Document Dialog */}
        <Dialog open={showUploadMissingDocDialog} onOpenChange={setShowUploadMissingDocDialog}>
          <DialogContent className="sm:max-w-md p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-slate-600" />
                <DialogTitle className="text-lg font-semibold text-slate-900">Upload {uploadMissingDocType}</DialogTitle>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadMissingDocDialog(false)
                  setUploadMissingDocType("")
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-5">
              {/* Upload File Area */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Upload File</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                </div>
              </div>

              {/* Comments (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Comments (Optional)</Label>
                <textarea
                  placeholder="Add any comments about this document"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadMissingDocDialog(false)
                  setUploadMissingDocType("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  setShowUploadMissingDocDialog(false)
                  setUploadMissingDocType("")
                }}
              >
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default UnitDetails
