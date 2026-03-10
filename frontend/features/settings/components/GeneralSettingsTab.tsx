"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Trash2, Search, X, Trophy, Code } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MERGE_TAGS = [
    "Property.Name",
    "Property.Street",
    "Existing Tenant.First Name",
    "Existing Tenant.Full Name",
    "Owners.First Name",
    "Owners.Full Name",
    "Tenants.First Name",
    "Tenants.Full Name",
    "Future Tenants.First Name",
    "Future Tenants.Full Name",
]

const CATEGORY_OPTIONS: { value: string; label: string; prefix: string }[] = [
    { value: "property-onboarding", label: "Property Onboarding", prefix: "Property Onboarding" },
    { value: "lease-renewal", label: "Lease Renewal", prefix: "Lease Renewal" },
    { value: "make-ready", label: "Make Ready", prefix: "Make Ready" },
    { value: "delinquency", label: "Delinquency", prefix: "Delinquency" },
    { value: "eviction", label: "Eviction", prefix: "Eviction" },
]

const PIPELINE_OPTIONS = [
    "New Owner Leads",
    "AppFolio Tenant Applicants",
    "Guest Card",
    "AppFolio Tenants",
    "AppFolio Owner Contracts",
]

interface ContactRoleMapping {
    id: string
    contactRole: string
    pipeline: string
    pullFrom: string
}

const INITIAL_CONTACT_ROLES: ContactRoleMapping[] = [
    { id: "1", contactRole: "Owners", pipeline: "New Owner Leads", pullFrom: "All Current" },
    { id: "2", contactRole: "Future tenants", pipeline: "AppFolio Tenant Applicants", pullFrom: "All Current" },
    { id: "3", contactRole: "Tenants", pipeline: "Guest Card", pullFrom: "All Current" },
    { id: "4", contactRole: "Existing Tenant", pipeline: "AppFolio Tenants", pullFrom: "All Current" },
    { id: "5", contactRole: "Owners", pipeline: "AppFolio Owner Contracts", pullFrom: "All Current" },
]

/* ------------------------------------------------------------------ */
/*  Merge Tag Picker                                                   */
/* ------------------------------------------------------------------ */

function MergeTagPicker({ onSelect }: { onSelect: (tag: string) => void }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const filtered = MERGE_TAGS.filter((t) =>
        t.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    title="Insert merge tag"
                >
                    <Code className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-72 p-0 z-[60]"
                align="end"
                sideOffset={4}
                onWheel={(e) => e.stopPropagation()}
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (target.closest("[role='dialog']")) e.preventDefault()
                }}
            >
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Type to search available merge tags"
                        className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch("")}>
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                    )}
                </div>
                <div
                    className="max-h-64 overflow-y-auto py-1"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {filtered.length > 0 ? (
                        filtered.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    onSelect(`{{${tag}}}`)
                                    setOpen(false)
                                    setSearch("")
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                            >
                                {tag}
                            </button>
                        ))
                    ) : (
                        <p className="px-3 py-3 text-sm text-muted-foreground">No tags found</p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function GeneralSettingsTab() {
    const [processName, setProcessName] = useState("2 Property Onboarding Process")
    const [category, setCategory] = useState("property-onboarding")
    const [mergeTag, setMergeTag] = useState("{{property.street}}")
    const [contactRoles, setContactRoles] = useState<ContactRoleMapping[]>(INITIAL_CONTACT_ROLES)

    const categoryPrefix = CATEGORY_OPTIONS.find((c) => c.value === category)?.prefix ?? ""
    const singularName = `${categoryPrefix} for ${mergeTag}`

    // Default Due Date
    const [dueDays, setDueDays] = useState("22")
    const [dueDaysType, setDueDaysType] = useState("weekdays")
    const [dueBeforeAfter, setDueBeforeAfter] = useState("after")
    const [dueDate, setDueDate] = useState("process-creation")

    // Default Start Date
    const [showStartDate, setShowStartDate] = useState(false)
    const [startDays, setStartDays] = useState("0")
    const [startDaysType, setStartDaysType] = useState("weekdays")
    const [startBeforeAfter, setStartBeforeAfter] = useState("after")
    const [startDate, setStartDate] = useState("process-creation")

    // Edit Name dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editProcessTypeName, setEditProcessTypeName] = useState(processName)
    const [editCategory, setEditCategory] = useState(category)
    const [editMergeTag, setEditMergeTag] = useState(mergeTag)

    const editCategoryPrefix = CATEGORY_OPTIONS.find((c) => c.value === editCategory)?.prefix ?? ""
    const editItemName = `${editCategoryPrefix} for ${editMergeTag}`

    const openEditDialog = () => {
        setEditProcessTypeName(processName)
        setEditCategory(category)
        setEditMergeTag(mergeTag)
        setEditDialogOpen(true)
    }

    const saveEditDialog = () => {
        setProcessName(editProcessTypeName)
        setCategory(editCategory)
        setMergeTag(editMergeTag)
        setEditDialogOpen(false)
    }

    const handleSelectMergeTag = (tag: string) => {
        setEditMergeTag(tag)
    }

    const updateContactRole = (id: string, field: keyof ContactRoleMapping, value: string) => {
        setContactRoles((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
        )
    }

    const removeContactRole = (id: string) => {
        setContactRoles((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <div className="max-w-4xl space-y-8">
            {/* General Settings Card */}
            <div className="bg-card border border-border rounded-lg">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Customize the general settings for the <strong>{processName}</strong> process.
                    </p>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Process Name */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-blue-600">Process Name</Label>
                        <Input
                            value={processName}
                            onClick={openEditDialog}
                            readOnly
                            className="cursor-pointer hover:border-blue-300"
                        />
                    </div>

                    {/* Singular Name */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-blue-600">Singular Name</Label>
                        <Input
                            value={singularName}
                            onClick={openEditDialog}
                            readOnly
                            className="cursor-pointer hover:border-blue-300"
                        />
                        <p className="text-xs text-muted-foreground">
                            What you call each individual instance of this process.
                        </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-blue-600">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Categories are used to provide you with contextual information about how to make better use of your process types.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Role Mapping */}
            <div className="bg-card border border-border rounded-lg">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">
                        What contacts (external to your company) are involved in this process?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        LeadSimple can automatically populate relevant contacts on each process, based on the contact's relationship to the property. Configure this below, or{" "}
                        <button type="button" className="text-primary underline">learn more</button>.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Contact Role</th>
                                <th className="px-2 py-3" />
                                <th className="text-left px-2 py-3 text-xs font-medium text-muted-foreground uppercase">Pipeline</th>
                                <th className="text-left px-2 py-3 text-xs font-medium text-muted-foreground uppercase" />
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {contactRoles.map((role) => (
                                <tr key={role.id} className="border-b border-border/50">
                                    <td className="px-6 py-3">
                                        <div className="border border-blue-200 bg-blue-50 rounded px-2.5 py-1 text-xs font-medium text-blue-700 inline-block">
                                            {role.contactRole}
                                        </div>
                                    </td>
                                    <td className="px-2 py-3 text-xs text-muted-foreground">maps to</td>
                                    <td className="px-2 py-3">
                                        <Select
                                            value={role.pipeline}
                                            onValueChange={(v) => updateContactRole(role.id, "pipeline", v)}
                                        >
                                            <SelectTrigger className="h-8 text-xs w-52">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PIPELINE_OPTIONS.map((p) => (
                                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-2 py-3">
                                        <span className="text-xs text-gray-500">
                                            Pull contacts from <button type="button" className="text-blue-600 underline">{role.pullFrom}</button> stages
                                            {" · "}
                                            <button type="button" className="text-blue-600 underline">change</button>
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-gray-400 hover:text-red-500"
                                            onClick={() => removeContactRole(role.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Default Due Date */}
            <div className="bg-card border border-border rounded-lg">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-base font-semibold text-foreground">Default Due Date</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        To save you time, you can set a default due date below. It will automatically be applied to every new process you create in this process type.
                    </p>
                </div>

                <div className="px-6 py-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-blue-600">Days</Label>
                            <Input
                                type="number"
                                value={dueDays}
                                onChange={(e) => setDueDays(e.target.value)}
                                className="w-20 h-9"
                                min="0"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-blue-600">Days To Use</Label>
                            <Select value={dueDaysType} onValueChange={setDueDaysType}>
                                <SelectTrigger className="w-44 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekdays">Week Days (M-F)</SelectItem>
                                    <SelectItem value="calendar">Calendar Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-blue-600">Before/After</Label>
                            <Select value={dueBeforeAfter} onValueChange={setDueBeforeAfter}>
                                <SelectTrigger className="w-28 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="before">Before</SelectItem>
                                    <SelectItem value="after">After</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-blue-600">Date</Label>
                            <Select value={dueDate} onValueChange={setDueDate}>
                                <SelectTrigger className="w-48 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="process-creation">Process Creation Date</SelectItem>
                                    <SelectItem value="lease-start">Lease Start Date</SelectItem>
                                    <SelectItem value="lease-end">Lease End Date</SelectItem>
                                    <SelectItem value="move-in">Move In Date</SelectItem>
                                    <SelectItem value="move-out">Move Out Date</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                        The <strong>due time</strong> will always default to 6pm on the due date.
                    </p>
                </div>
            </div>

            {/* Default Start Date */}

            <div className="bg-card border border-border rounded-lg">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-foreground">Default Start Date</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Set a default start date that will be applied to every new process you create.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setShowStartDate(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="px-6 py-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-primary">Days</Label>
                            <Input
                                type="number"
                                value={startDays}
                                onChange={(e) => setStartDays(e.target.value)}
                                className="w-20 h-9"
                                min="0"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-primary">Days To Use</Label>
                            <Select value={startDaysType} onValueChange={setStartDaysType}>
                                <SelectTrigger className="w-44 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekdays">Week Days (M-F)</SelectItem>
                                    <SelectItem value="calendar">Calendar Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-primary">Before/After</Label>
                            <Select value={startBeforeAfter} onValueChange={setStartBeforeAfter}>
                                <SelectTrigger className="w-28 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="before">Before</SelectItem>
                                    <SelectItem value="after">After</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-primary">Date</Label>
                            <Select value={startDate} onValueChange={setStartDate}>
                                <SelectTrigger className="w-48 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="process-creation">Process Creation Date</SelectItem>
                                    <SelectItem value="lease-start">Lease Start Date</SelectItem>
                                    <SelectItem value="lease-end">Lease End Date</SelectItem>
                                    <SelectItem value="move-in">Move In Date</SelectItem>
                                    <SelectItem value="move-out">Move Out Date</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>


            {/* ─── Edit Name Dialog ─── */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Name</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 py-2">
                        {/* Process Type Name */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-blue-600">Process Type Name *</Label>
                            <Input
                                value={editProcessTypeName}
                                onChange={(e) => setEditProcessTypeName(e.target.value)}
                            />
                        </div>

                        {/* Item Name — dynamic: prefix from category + merge tag */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-blue-600">Item Name</Label>
                            <div className="flex gap-2 items-center">
                                <div className="flex-1 flex items-center h-9 px-3 border border-input rounded-md bg-muted/30 text-sm">
                                    <span className="text-muted-foreground shrink-0">{editCategoryPrefix} for&nbsp;</span>
                                    <span className="text-foreground font-medium">{editMergeTag}</span>
                                </div>
                                <MergeTagPicker onSelect={handleSelectMergeTag} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                The name of individual processes in this process type. Use the <Code className="inline h-3 w-3" /> button to select a merge tag. The prefix updates automatically based on the category.
                            </p>
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-blue-600">Category</Label>
                            <Select value={editCategory} onValueChange={setEditCategory}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Categories are used to provide you with contextual information about how to make better use of your process types. We'll try to infer the best category for you, but you can also choose a different category and override our choice.
                            </p>
                        </div>

                        {/* Info card */}
                        <div className="border border-border rounded-lg p-4 text-center space-y-2">
                            <div className="flex justify-center">
                                <Trophy className="h-10 w-10 text-warning" />
                            </div>
                            <h4 className="text-sm font-semibold text-blue-700">Building Processes in LeadSimple</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Want to build BETTER processes? A mere SOP isn't enough if you want to scale. This course will show you how to convert your SOPs into automated and predictable processes so you can give awesome service to your customers.
                            </p>
                            <div className="pt-1">
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "0%" }} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">0% complete</p>
                            </div>
                            <a href="#" className="text-xs text-blue-600 underline">Learn more</a>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="bg-transparent">
                            Cancel
                        </Button>
                        <Button onClick={saveEditDialog} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
