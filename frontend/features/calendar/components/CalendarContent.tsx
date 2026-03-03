"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Filter,
  Plus,
  ChevronDown,
  X,
  Search,
  SlidersHorizontal,
  PlusCircle,
  LayoutGrid,
  List,
  Calendar,
  CheckCircle2,
  Share2,
  Copy,
  Check,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { CalendarEvent, AvailabilitySlot } from "@/features/calendar/types"
import {
  eventCategories,
  propertyCalendarEvents,
  staffCalendarUsers,
  availabilityDays,
  initialAvailabilityData,
} from "@/features/calendar/data/mockCalendar"
import { BookAppointment } from "./BookAppointment"

function AvailabilityEditor({
  day,
  initialSlots,
  onSave,
  onCancel,
}: {
  day: string
  initialSlots: string[]
  onSave: (slots: string[]) => void
  onCancel: () => void
}) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(() => {
    if (initialSlots.length === 0) {
      return [
        {
          id: Math.random().toString(),
          startTime: "",
          endTime: "",
          property: "Adam 3806 Highland Ave., - 3806 Highland Ave., Cleveland, OH 44111",
        },
      ]
    }
    return initialSlots.map((s) => {
      const [start, end] = s.split(" - ")
      return {
        id: Math.random().toString(),
        startTime: start || "",
        endTime: end || "",
        property: "Adam 3806 Highland Ave., - 3806 Highland Ave., Cleveland, OH 44111",
      }
    })
  })

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        id: Math.random().toString(),
        startTime: "",
        endTime: "",
        property: "Adam 3806 Highland Ave., - 3806 Highland Ave., Cleveland, OH 44111",
      },
    ])
  }

  const removeSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id))
  }

  const updateSlot = (id: string, field: keyof AvailabilitySlot, value: string) => {
    setSlots(slots.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSave = () => {
    // Convert back to string format for the parent component
    const newSlots = slots.filter((s) => s.startTime && s.endTime).map((s) => `${s.startTime} - ${s.endTime}`)
    onSave(newSlots)
  }

  return (
    <Card className="border shadow-sm bg-white">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900">{day}</h3>
      </div>
      <div className="p-6 space-y-6">
        {slots.map((slot) => (
          <div key={slot.id} className="flex gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-8">
                <span className="text-sm text-gray-500 mt-9 w-16">Available</span>
                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500">
                      Start Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={slot.startTime}
                        onChange={(e) => updateSlot(slot.id, "startTime", e.target.value)}
                        className="pr-8"
                        placeholder="12:15 AM"
                      />
                      <Clock className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-gray-500">
                      End Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={slot.endTime}
                        onChange={(e) => updateSlot(slot.id, "endTime", e.target.value)}
                        className="pr-8"
                        placeholder="1:15 AM"
                      />
                      <Clock className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <span className="w-16" /> {/* Spacer for alignment */}
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-medium text-gray-500">
                    Property or Property Group <span className="text-red-500">*</span>
                  </Label>
                  <Select value={slot.property} onValueChange={(val) => updateSlot(slot.id, "property", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adam 3806 Highland Ave., - 3806 Highland Ave., Cleveland, OH 44111">
                        Adam 3806 Highland Ave., - 3806 Highland Ave., Cleveland, OH 44111
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Delete Action */}
            <div
              className="w-12 border border-red-200 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer group"
              onClick={() => removeSlot(slot.id)}
            >
              <div className="bg-red-500 rounded-full p-0.5 group-hover:bg-red-600 transition-colors">
                <X className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-2"
            onClick={addSlot}
          >
            <PlusCircle className="h-4 w-4 fill-green-600 text-white" />
            Add More Availability
          </Button>
        </div>
      </div>
      <CardFooter className="border-t px-6 py-4 flex gap-3">
        <Button className="bg-[#006E9E] hover:bg-[#005a82] text-white px-6" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}

function StaffCalendar() {
  const [date, setDate] = useState(new Date(2025, 10, 16)) // Nov 16, 2025
  const [isManageViewOpen, setIsManageViewOpen] = useState(true)
  const [viewType, setViewType] = useState("blocked") // Default to blocked as per screenshot
  const [selectedUsers, setSelectedUsers] = useState<string[]>(["William Khawaja"])
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar")
  const [isBookingOpen, setIsBookingOpen] = useState(false) // Added booking state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [calendarLink, setCalendarLink] = useState("") // Declare calendarLink here

  const users = staffCalendarUsers

  // Helper to generate dates
  const getStartOfWeek = (d: Date) => {
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.getFullYear(), d.getMonth(), diff)
  }

  const startOfWeek = getStartOfWeek(date)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d,
    }
  })

  const hours = Array.from({ length: 9 }, (_, i) => i + 12) // 12 PM to 8 PM

  // Navigation
  const nextWeek = () => {
    const next = new Date(date)
    next.setDate(date.getDate() + 7)
    setDate(next)
  }

  const prevWeek = () => {
    const prev = new Date(date)
    prev.setDate(date.getDate() - 7)
    setDate(prev)
  }

  const goToToday = () => setDate(new Date())

  // Mock Data
  const generateEvents = () => {
    const events = []
    const baseDate = new Date(2025, 10, 16) // Anchor to the default week

    // Helper to create event
    const createEvent = (
      dayOffset: number,
      startHour: number,
      duration: number,
      userIdx: number,
      type: "appointment" | "blocked",
      title: string,
    ) => {
      const d = new Date(baseDate)
      d.setDate(baseDate.getDate() + dayOffset)
      return {
        id: Math.random().toString(36).substr(2, 9),
        title,
        date: d,
        startHour,
        duration, // in hours
        userId: users[userIdx].name,
        type,
      }
    }

    // William (Pink) - The active user in screenshot
    events.push(createEvent(1, 13, 1.5, 0, "appointment", "Leasing Tour: 212 Pine")) // Mon 1PM
    events.push(createEvent(1, 15, 1, 0, "blocked", "Lunch Break")) // Mon 3PM
    events.push(createEvent(2, 14, 2, 0, "appointment", "Contract Signing")) // Tue 2PM
    events.push(createEvent(3, 12, 1, 0, "blocked", "Team Meeting")) // Wed 12PM
    events.push(createEvent(4, 16, 1.5, 0, "appointment", "Property Inspection")) // Thu 4PM
    events.push(createEvent(5, 13, 2, 0, "blocked", "Admin Time")) // Fri 1PM

    // Alex (Blue)
    events.push(createEvent(1, 14, 1, 1, "appointment", "View: 500 Maple"))
    events.push(createEvent(2, 12, 1.5, 1, "blocked", "Dentist Appt"))
    events.push(createEvent(3, 15, 2, 1, "appointment", "Open House"))

    // Miguel (Green)
    events.push(createEvent(1, 16, 1, 2, "blocked", "Unavailable"))
    events.push(createEvent(4, 13, 1, 2, "appointment", "Key Handover"))

    // Mina (Purple)
    events.push(createEvent(2, 15, 1.5, 3, "appointment", "Client Meeting"))
    events.push(createEvent(5, 12, 2, 3, "blocked", "Training"))

    return events
  }

  const allEvents = generateEvents()

  // Filtering Logic
  const filteredEvents = allEvents.filter((event) => {
    // Filter by User
    if (!selectedUsers.includes(event.userId)) return false

    // Filter by Type
    if (viewType === "appointments" && event.type !== "appointment") return false
    if (viewType === "blocked" && event.type !== "blocked") return false

    return true
  })

  // Function to handle sharing calendar
  const handleShareCalendar = () => {
    const generatedLink = `https://example.com/staff-calendar/${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` // Replace with actual logic
    // In a real app, you might pass selectedUsers and viewType to the link
    // setCalendarLink(generatedLink + `?users=${selectedUsers.join(',')}&viewType=${viewType}`);
    setCalendarLink(generatedLink)
    setIsShareDialogOpen(true)
    setLinkCopied(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(calendarLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4">
      <div className="w-48 flex flex-col gap-1 pt-1">
        <Button
          variant={activeTab === "calendar" && !isBookingOpen ? "secondary" : "ghost"} // Updated active state logic
          className={cn(
            "justify-start gap-3 h-10",
            activeTab === "calendar" && !isBookingOpen
              ? "bg-white shadow-sm border font-medium text-blue-600"
              : "text-gray-600",
          )}
          onClick={() => {
            setActiveTab("calendar")
            setIsBookingOpen(false) // Close booking when switching tabs
          }}
        >
          <LayoutGrid className="h-4 w-4" />
          Calendar View
        </Button>
        <Button
          variant={activeTab === "list" && !isBookingOpen ? "secondary" : "ghost"} // Updated active state logic
          className={cn(
            "justify-start gap-3 h-10",
            activeTab === "list" && !isBookingOpen
              ? "bg-white shadow-sm border font-medium text-blue-600"
              : "text-gray-600",
          )}
          onClick={() => {
            setActiveTab("list")
            setIsBookingOpen(false) // Close booking when switching tabs
          }}
        >
          <List className="h-4 w-4" />
          Appointment List
        </Button>
      </div>

      {/* Main Content Area */}
      {isBookingOpen ? ( // Render BookAppointment if open
        <BookAppointment onClose={() => setIsBookingOpen(false)} />
      ) : activeTab === "calendar" ? (
        <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-[160px] text-center">
                  {weekDays[0].fullDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {weekDays[6].fullDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select defaultValue="week">
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={isManageViewOpen ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsManageViewOpen(!isManageViewOpen)}
                className={cn("gap-2", isManageViewOpen && "bg-slate-800 text-white hover:bg-slate-700")}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Manage View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                onClick={() => setIsBookingOpen(true)} // Open booking view
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header Row */}
            <div className="flex border-b">
              <div className="w-16 border-r bg-gray-50 flex-shrink-0">
                <div className="h-12 flex items-center justify-center text-xs text-muted-foreground">GMT -06:00</div>
              </div>
              <div className="flex-1 grid grid-cols-7">
                {weekDays.map((d, i) => {
                  const isToday = d.fullDate.toDateString() === new Date().toDateString()
                  return (
                    <div
                      key={d.day}
                      className={cn(
                        "h-12 flex items-center justify-center font-medium border-r last:border-r-0",
                        isToday ? "text-blue-600 bg-blue-50/30" : "text-gray-600",
                      )}
                    >
                      <span className="mr-1">{d.date}</span>
                      <span>{d.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* All Day Row */}
            <div className="flex border-b min-h-[40px]">
              <div className="w-16 border-r bg-gray-50 flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground p-2">
                All Day
              </div>
              <div className="flex-1 grid grid-cols-7">
                {weekDays.map((_, i) => (
                  <div key={i} className="border-r last:border-r-0" />
                ))}
              </div>
            </div>

            {/* Time Grid */}
            <ScrollArea className="flex-1">
              <div className="flex relative min-h-[600px]">
                {/* Time Labels */}
                <div className="w-16 border-r bg-gray-50 flex-shrink-0">
                  {hours.map((hour) => (
                    <div key={hour} className="h-20 border-b text-xs text-muted-foreground p-2 text-right relative">
                      <span className="-top-2 relative">{hour === 12 ? "12PM" : `${hour - 12}PM`}</span>
                    </div>
                  ))}
                </div>

                {/* Grid Cells */}
                <div className="flex-1 grid grid-cols-7 relative">
                  {/* Current Time Line (Mocked for 12:30 PM) */}
                  <div className="absolute left-0 right-0 top-[40px] h-px bg-red-500 z-10 pointer-events-none" />

                  {weekDays.map((day, dayIndex) => {
                    // Find events for this day
                    const dayEvents = filteredEvents.filter(
                      (ev) => ev.date.toDateString() === day.fullDate.toDateString(),
                    )

                    return (
                      <div key={dayIndex} className="border-r last:border-r-0 relative h-full">
                        {hours.map((_, hourIndex) => (
                          <div key={hourIndex} className="h-20 border-b border-gray-100" />
                        ))}

                        {/* Render Events */}
                        {dayEvents.map((ev) => {
                          const user = users.find((u) => u.name === ev.userId)
                          const top = (ev.startHour - 12) * 80 // 80px per hour
                          const height = ev.duration * 80

                          // Skip if out of bounds (simple check)
                          if (top < 0) return null

                          return (
                            <div
                              key={ev.id}
                              className={cn(
                                "absolute left-1 right-1 rounded px-2 py-1 text-xs border overflow-hidden cursor-pointer transition-all hover:brightness-95 hover:z-20",
                                ev.type === "blocked"
                                  ? "bg-gray-100 border-red-200 text-gray-600"
                                  : `${user?.lightColor} ${user?.borderColor} text-gray-800`,
                              )}
                              style={{ top: `${top}px`, height: `${height}px` }}
                            >
                              <div className="font-semibold truncate">{ev.title}</div>
                              <div className="truncate text-[10px] opacity-80">
                                {ev.startHour > 12 ? ev.startHour - 12 : ev.startHour}:00 -
                                {ev.startHour + ev.duration > 12
                                  ? ev.startHour + ev.duration - 12
                                  : ev.startHour + ev.duration}
                                :00
                              </div>
                              {ev.type === "blocked" && (
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-red-400" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Appointment List</h2>
            <div className="flex items-center gap-3">
              <Button
                variant={isManageViewOpen ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsManageViewOpen(!isManageViewOpen)}
                className={cn("gap-2", isManageViewOpen && "bg-slate-800 text-white hover:bg-slate-700")}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Manage View
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                onClick={() => setIsBookingOpen(true)} // Open booking view
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
              <Button variant="outline" size="sm" className="h-9 bg-transparent" onClick={handleShareCalendar}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No appointments found for this selection.</div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event) => {
                      const user = users.find((u) => u.name === event.userId)
                      return (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "h-12 w-12 rounded-lg flex items-center justify-center text-xs font-bold flex-col",
                                event.type === "blocked"
                                  ? "bg-gray-100 text-gray-600"
                                  : `${user?.lightColor} ${user?.borderColor} border text-gray-800`,
                              )}
                            >
                              <span>{event.date.getDate()}</span>
                              <span className="text-[10px] uppercase">
                                {event.date.toLocaleDateString("en-US", { month: "short" })}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{event.title}</h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {event.startHour > 12 ? event.startHour - 12 : event.startHour}:00 -
                                  {event.startHour + event.duration > 12
                                    ? event.startHour + event.duration - 12
                                    : event.startHour + event.duration}
                                  :00
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {event.userId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={event.type === "blocked" ? "secondary" : "default"}>
                            {event.type === "blocked" ? "Blocked" : "Appointment"}
                          </Badge>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Manage View Sidebar */}
      {isManageViewOpen &&
        !isBookingOpen && ( // Hide sidebar when booking is open
          <Card className="w-[300px] flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Manage View</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsManageViewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* View By Type */}
                <div className="bg-[#F8FAFC] p-4 rounded-lg space-y-3">
                  <Label className="text-sm font-medium text-gray-900">View By Type</Label>
                  <RadioGroup value={viewType} onValueChange={setViewType} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" className="text-blue-600 border-blue-600" />
                      <Label htmlFor="all" className="font-normal text-gray-700">
                        All
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="appointments" id="appointments" />
                      <Label htmlFor="appointments" className="font-normal text-gray-700">
                        Appointments
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="blocked" id="blocked" />
                      <Label htmlFor="blocked" className="font-normal text-gray-700">
                        Blocked Slots
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Filters */}
                <div className="space-y-3">
                  {/* Filters */}
                  {(viewType != "all" || selectedUsers.length > 0) && (
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-900">Filters</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-blue-600 hover:text-blue-700 font-normal"
                        onClick={() => {
                          setSelectedUsers([])
                          setViewType("all")
                        }}
                      >
                        <X className="h-3 w-3 mr-1" /> Clear all
                      </Button>
                    </div>
                  )}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search Users, Calendars or Groups" className="pl-8 bg-white" />
                  </div>
                </div>

                {/* Users */}
                <Collapsible defaultOpen className="space-y-2">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=closed]:-rotate-90 transition-transform" />
                      <span className="font-medium text-gray-900">Users</span>
                      <Badge
                        variant="secondary"
                        className="h-5 px-1.5 min-w-[20px] justify-center bg-blue-100 text-blue-600 hover:bg-blue-100"
                      >
                        {selectedUsers.length}
                      </Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pl-6 pt-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={user.id}
                          checked={selectedUsers.includes(user.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers([...selectedUsers, user.name])
                            } else {
                              setSelectedUsers(selectedUsers.filter((u) => u !== user.name))
                            }
                          }}
                          className={cn(
                            "data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500",
                            user.id === "alex" &&
                            "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
                            user.id === "miguel" &&
                            "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500",
                            user.id === "mina" &&
                            "data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500",
                          )}
                        />
                        <Label htmlFor={user.id} className="font-normal cursor-pointer text-gray-700">
                          {user.name}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Calendars */}
                <Collapsible className="space-y-2">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=closed]:-rotate-90 transition-transform" />
                      <span className="font-medium text-gray-900">Calendars</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-2">
                    <div className="text-sm text-muted-foreground">No calendars available</div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>
          </Card>
        )}

      {/* Share Calendar Modal (Staff Calendar) */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Calendar</DialogTitle>
            <DialogDescription>
              Anyone with the link can view this calendar. The link is specific to the current view and filters.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={calendarLink} // Use the state variable here
                readOnly
                className="bg-muted/40"
              />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </>
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ShowingAvailability({ onBack }: { onBack?: () => void }) {
  const days = availabilityDays

  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [availabilityData, setAvailabilityData] = useState<Record<string, string[]>>(initialAvailabilityData)

  const handleSave = (day: string, newSlots: string[]) => {
    setAvailabilityData((prev) => ({
      ...prev,
      [day]: newSlots,
    }))
    setEditingDay(null)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Showing Availability</h1>
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to calendar
          </Button>
        )}
      </div>

      {/* Sync Personal Calendar Section */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-gray-50/40 pb-4">
          <CardTitle className="text-lg font-medium">Sync Personal Calendar</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 italic">
                Select which personal calendar provider to connect to for up-to-date availability and synced events,
                like showings and move-ins.
              </p>
              <p className="text-sm font-medium text-gray-700">
                Sync with Google, Microsoft (Exchange, Outlook, or 365), and iCloud Calendars.
              </p>
            </div>
            <Button className="bg-[#006E9E] hover:bg-[#005a82] text-white px-6 shrink-0">Connect</Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Recurring Availability Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Weekly Recurring Availability for George Guraya</h2>
          <Button className="bg-[#006E9E] hover:bg-[#005a82] text-white gap-2">
            <Plus className="h-4 w-4" />
            Bulk Add Availability
          </Button>
        </div>

        {editingDay ? (
          <AvailabilityEditor
            day={editingDay}
            initialSlots={availabilityData[editingDay] || []}
            onSave={(slots) => handleSave(editingDay, slots)}
            onCancel={() => setEditingDay(null)}
          />
        ) : (
          <Card className="overflow-hidden border shadow-sm">
            <div className="divide-y">
              {days.map((day) => {
                const hasAvailability = availabilityData[day] && availabilityData[day].length > 0
                return (
                  <div
                    key={day}
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <span className="font-medium text-gray-900 w-32 shrink-0">{day}</span>
                      <div className="flex flex-wrap gap-2">
                        {hasAvailability ? (
                          availabilityData[day].map((slot, index) => (
                            <div
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium border border-blue-100"
                            >
                              {slot}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-sm">Not Available</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDay(day)}
                      className="text-[#006E9E] hover:text-[#005a82] hover:bg-blue-50 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Edit
                    </Button>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function PropertyCalendar({
  calendarType,
  onSetAvailability,
}: {
  calendarType?: string
  onSetAvailability?: () => void
}) {
  const showStaffInList = true
  const [date, setDate] = useState(new Date(2025, 10, 1)) // November 2025
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "move-in",
    "move-out",
    "inspection",
    "work-order",
    "leasing",
    "meeting",
  ])
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("monthly")
  // Added state for share calendar modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [calendarLink, setCalendarLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    if (calendarType === "property-calendar") {
      setSelectedCategories(["move-in", "move-out", "inspection", "work-order"])
    } else if (calendarType === "staff-calendar") {
      setSelectedCategories(["leasing", "meeting"])
    } else {
      // Default to all if no specific type
      setSelectedCategories(["move-in", "move-out", "inspection", "work-order", "leasing", "meeting"])
    }
  }, [calendarType])

  const allEvents = propertyCalendarEvents

  const permissionFilteredEvents =
    showStaffInList
      ? allEvents
      : allEvents.filter((ev) => ev.staffMember === "Anthony Davis" || ev.staffMember === "All Staff")

  const filteredEvents = permissionFilteredEvents.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.includes(ev.category)
    return matchesSearch && matchesCategory
  })

  const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate()

  const nextMonth = () => {
    const next = new Date(date)
    next.setMonth(date.getMonth() + 1)
    setDate(next)
  }

  const prevMonth = () => {
    const prev = new Date(date)
    prev.setMonth(date.getMonth() - 1)
    setDate(prev)
  }

  const goToToday = () => {
    setDate(new Date())
  }

  const getEventsForDay = (day: number): CalendarEvent[] => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    const dateStr = `${yyyy}-${mm}-${dd}`
    return filteredEvents.filter((e) => e.date === dateStr)
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const getCategoryColor = (categoryId: string) => {
    return eventCategories.find((c) => c.id === categoryId)?.color || "bg-gray-500"
  }

  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth())
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const monthName = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()

  // Function to handle sharing calendar
  const handleShareCalendar = () => {
    const generatedLink = `https://example.com/calendar/${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` // Replace with actual logic
    setCalendarLink(generatedLink)
    setIsShareModalOpen(true)
    setLinkCopied(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(calendarLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Main Content Area */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col gap-4 border-b pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              {calendarType === "staff-calendar"
                ? "Staff Calendar"
                : calendarType === "property-calendar"
                  ? "Property Calendar"
                  : "Calendar"}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 bg-transparent" onClick={handleShareCalendar}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Left: Search and Filter */}
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 border-dashed bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {selectedCategories.length < eventCategories.length && (
                      <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal h-5">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0" align="start">
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Event Types</div>
                    {eventCategories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                        onClick={() => toggleCategory(cat.id)}
                      >
                        <Checkbox checked={selectedCategories.includes(cat.id)} id={`filter-${cat.id}`} />
                        <label
                          htmlFor={`filter-${cat.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          {cat.label}
                        </label>
                        <div className={`h-2 w-2 rounded-full ${cat.color}`} />
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right: View Switcher and Date Nav */}
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border bg-muted p-1">
                <Button
                  variant={viewMode === "daily" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("daily")}
                  className="h-7 text-xs px-3 shadow-none"
                >
                  Daily
                </Button>
                <Button
                  variant={viewMode === "weekly" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("weekly")}
                  className="h-7 text-xs px-3 shadow-none"
                >
                  Weekly
                </Button>
                <Button
                  variant={viewMode === "monthly" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("monthly")}
                  className="h-7 text-xs px-3 shadow-none"
                >
                  Monthly
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold min-w-[140px] text-center">
                  {monthName} {year}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 bg-transparent" onClick={goToToday}>
                  Today
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Day Headers */}
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <div key={day} className="bg-white p-4 text-center font-semibold text-sm">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white p-4 min-h-[120px]" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const events = getEventsForDay(day)

                return (
                  <div key={day} className="bg-white p-2 min-h-[120px] hover:bg-gray-50">
                    <div className="text-sm font-semibold mb-2">{day}</div>
                    <div className="space-y-1">
                      {events.map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-xs p-1 rounded ${getCategoryColor(ev.category)} text-white truncate`}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Legend */}
        <div className="space-y-3">
          <h3 className="font-semibold">Event Legend</h3>
          <div className="grid grid-cols-3 gap-4">
            {eventCategories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${cat.color}`} />
                <span className="text-sm">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="outline" size="sm">
              All events
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredEvents.map((event) => {
              const category = eventCategories.find((c) => c.id === event.category)
              return (
                <div key={event.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className={`h-2 w-2 rounded-full ${category?.color} mt-2`} />
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Owner: {event.owner}
                      </div>
                      {showStaffInList && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Staff: {event.staffMember}
                        </div>
                      )}
                    </div>
                    {event.notes && <p className="text-sm text-muted-foreground">{event.notes}</p>}
                  </div>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Share Calendar Modal (Property Calendar) */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Calendar</DialogTitle>
            <DialogDescription>
              Anyone with the link can view this calendar. The link is specific to the current view and filters.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={calendarLink} readOnly className="bg-muted/40" />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </>
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export interface CalendarContentProps {
  calendarType?: string
  /** When provided (e.g. by property page), view is controlled so the right panel can open availability */
  viewMode?: "default" | "availability"
  onViewModeChange?: (mode: "default" | "availability") => void
}

export default function CalendarContent({ calendarType, viewMode, onViewModeChange }: CalendarContentProps) {
  const [internalView, setInternalView] = useState<"default" | "availability">("default")
  const isControlled = viewMode !== undefined && onViewModeChange !== undefined
  const currentView = isControlled ? viewMode! : internalView
  const setView = isControlled ? onViewModeChange! : setInternalView

  // Reset internal view when calendar type changes (e.g. switching from sidebar)
  useEffect(() => {
    if (!isControlled) setInternalView("default")
  }, [calendarType, isControlled])

  if (currentView === "availability") {
    return <ShowingAvailability onBack={isControlled ? () => setView("default") : undefined} />
  }

  if (calendarType === "staff-calendar") {
    return <StaffCalendar />
  }
  return <PropertyCalendar calendarType={calendarType} onSetAvailability={() => setView("availability")} />
}
