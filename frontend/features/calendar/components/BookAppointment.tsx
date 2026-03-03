"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle2, Plus, Search, User, X } from "lucide-react"

export interface BookAppointmentProps {
  onClose: () => void
}

export function BookAppointment({ onClose }: BookAppointmentProps) {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm bg-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Book Appointment</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b">
        <div className="flex gap-8">
          <div className="py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600">Appointment</div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column */}
        <div className="w-1/2 p-6 border-r overflow-y-auto space-y-6">
          {/* Calendar Select */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Calendar</Label>
            <Select defaultValue="william">
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="william">William Khawaja's Personal Calendar</SelectItem>
                <SelectItem value="alex">Alex Rehman's Personal Calendar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Appointment Title</Label>
            <Input placeholder="(eg) Appointment with Bob" />
            <Button variant="link" className="text-blue-600 h-auto p-0 text-sm font-medium">
              Add Description
            </Button>
          </div>

          {/* Team Member */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Team Member</Label>
            <Select defaultValue="william">
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="william">William Khawaja</SelectItem>
                <SelectItem value="alex">Alex Rehman</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-50/80 p-4 rounded-lg space-y-4 border">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Showing slots in this timezone:</Label>
              <Select defaultValue="cst">
                <SelectTrigger className="bg-white h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cst">GMT-06:00 America/Chicago (CST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex bg-gray-200/50 p-1 rounded-md w-fit">
              <button className="px-3 py-1 bg-white rounded shadow-sm text-sm font-medium text-blue-600">
                Default
              </button>
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">Custom</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Date</Label>
                <div className="relative">
                  <Input defaultValue="Mon, Nov 17th, 2025" className="bg-white" />
                  <Calendar className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Slot</Label>
                <Select defaultValue="300">
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">3:00 pm - 3:30 pm</SelectItem>
                    <SelectItem value="330">3:30 pm - 4:00 pm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/2 p-6 overflow-y-auto space-y-6">
          <div className="bg-gray-50/80 p-4 rounded-lg border space-y-4">
            <Label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <User className="h-4 w-4" /> Select Contact <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input className="pl-9 bg-white" placeholder="Search by name, email or phone" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Internal Notes</Label>
            <div>
              <Button variant="outline" className="gap-2 bg-white">
                <Plus className="h-4 w-4" />
                Add Internal Note
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Status :</span>
          <Select defaultValue="confirmed">
            <SelectTrigger className="w-[150px] bg-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={onClose}>
            Book Appointment
          </Button>
        </div>
      </div>
    </Card>
  )
}
