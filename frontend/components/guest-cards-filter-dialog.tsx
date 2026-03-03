"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, CalendarIcon, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GuestCardsFilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters?: (filters: GuestCardFilters) => void
}

export interface GuestCardFilters {
  propertySearch: string
  status: string[]
  source: string
  leadType: string
  contactInfo: string
  assignedTo: string
  interestReceivedStart: Date | undefined
  interestReceivedEnd: Date | undefined
}

const statusOptions = ["Active", "Pre-Qualified", "Lead", "Tour Scheduled"]
const contactOptions = ["Sarah Miller", "Michael Chen", "Jessica Davis", "David Wilson", "Emily Rodriguez"]
const assignedToOptions = ["Nina Patel", "John Doe", "Jane Smith", "Robert Johnson"]

export function GuestCardsFilterDialog({ open, onOpenChange, onApplyFilters }: GuestCardsFilterDialogProps) {
  const [propertySearch, setPropertySearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["Pre-Qualified", "Active"])
  const [source, setSource] = useState("")
  const [leadType, setLeadType] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2025, 11, 4))
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const handleRemoveStatus = (status: string) => {
    setSelectedStatus(selectedStatus.filter((s) => s !== status))
  }

  const handleToggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== status))
    } else {
      setSelectedStatus([...selectedStatus, status])
    }
  }

  const handleSearch = () => {
    onApplyFilters?.({
      propertySearch,
      status: selectedStatus,
      source,
      leadType,
      contactInfo,
      assignedTo,
      interestReceivedStart: startDate,
      interestReceivedEnd: endDate,
    })
    onOpenChange(false)
  }

  const handleClearAll = () => {
    setPropertySearch("")
    setSelectedStatus([])
    setSource("")
    setLeadType("")
    setContactInfo("")
    setAssignedTo("")
    setStartDate(undefined)
    setEndDate(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-xl border-0 shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">Filter Guest Cards</DialogTitle>
            <DialogDescription className="text-teal-100">
              Use the search filters below to find specific guest cards
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Properties, Units or Campaigns */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Properties, Units or Campaigns</Label>
            <Input
              placeholder="Search by unit, property, group, campaign or portfolio"
              value={propertySearch}
              onChange={(e) => setPropertySearch(e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="min-h-11 w-full border border-gray-300 rounded-md px-3 py-2 flex flex-wrap gap-2 items-center cursor-pointer hover:border-teal-400 transition-colors">
                  {selectedStatus.length > 0 ? (
                    selectedStatus.map((status) => (
                      <Badge
                        key={status}
                        variant="secondary"
                        className={`
                          px-3 py-1 text-sm font-medium flex items-center gap-1.5
                          ${status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}
                          ${status === "Pre-Qualified" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : ""}
                          ${status === "Lead" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : ""}
                          ${status === "Tour Scheduled" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}
                        `}
                      >
                        {status}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-red-200 p-0.5 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleRemoveStatus(status)
                          }}
                        >
                          <X className="h-3.5 w-3.5 cursor-pointer hover:text-red-500 transition-colors" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">Select status...</span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {statusOptions.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={selectedStatus.includes(status)}
                    onCheckedChange={() => handleToggleStatus(status)}
                  >
                    <span
                      className={`
                        ${status === "Active" ? "text-emerald-700" : ""}
                        ${status === "Pre-Qualified" ? "text-purple-700" : ""}
                        ${status === "Lead" ? "text-amber-700" : ""}
                        ${status === "Tour Scheduled" ? "text-blue-700" : ""}
                      `}
                    >
                      {status}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Source</Label>
            <Input
              placeholder="Search by source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
            />
          </div>

          {/* Lead Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Lead Type</Label>
            <Input
              placeholder="Search by lead type"
              value={leadType}
              onChange={(e) => setLeadType(e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 h-11"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Contact Info</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-11 border-gray-300 hover:border-teal-400 font-normal bg-transparent"
                >
                  {contactInfo || <span className="text-gray-500">Search by name, email address, or phone</span>}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[300px]">
                {contactOptions.map((contact) => (
                  <DropdownMenuCheckboxItem
                    key={contact}
                    checked={contactInfo === contact}
                    onCheckedChange={(checked) => setContactInfo(checked ? contact : "")}
                  >
                    {contact}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-11 border-gray-300 hover:border-teal-400 font-normal bg-transparent"
                >
                  {assignedTo || <span className="text-gray-500">Search by assigned user</span>}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[300px]">
                {assignedToOptions.map((user) => (
                  <DropdownMenuCheckboxItem
                    key={user}
                    checked={assignedTo === user}
                    onCheckedChange={(checked) => setAssignedTo(checked ? user : "")}
                  >
                    {user}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Interest Received Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Interest Received</Label>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal h-11 border-gray-300 hover:border-teal-400 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-teal-500" />
                    {startDate ? format(startDate, "MM/dd/yyyy") : <span className="text-gray-500">Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>

              <span className="text-gray-500 font-medium">to</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal h-11 border-gray-300 hover:border-teal-400 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-teal-500" />
                    {endDate ? format(endDate, "MM/dd/yyyy") : <span className="text-gray-500">End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
          <Button variant="ghost" onClick={handleClearAll} className="text-gray-600 hover:text-gray-800">
            Clear All
          </Button>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 shadow-md hover:shadow-lg transition-all"
          >
            Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
