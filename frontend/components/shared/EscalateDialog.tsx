"use client"

import { useEffect, useState } from "react"
import { TriangleAlert, ChevronsUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export type EscalateStaffMember = { id: number | string; name: string; role: string }

export interface EscalateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle?: string
  staffMembers: EscalateStaffMember[]
  value?: string
  onConfirm: (staffName: string) => void
  confirmLabel?: string
}

export function EscalateDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  staffMembers,
  value = "",
  onConfirm,
  confirmLabel = "Confirm Escalation",
}: EscalateDialogProps) {
  const [selectedStaff, setSelectedStaff] = useState(value)
  const [staffPopoverOpen, setStaffPopoverOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setSelectedStaff(value)
    }
  }, [open, value])

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedStaff("")
    }
    onOpenChange(nextOpen)
  }

  const handleConfirm = () => {
    if (!selectedStaff) return
    onConfirm(selectedStaff)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-amber-500" />
            {title}
          </DialogTitle>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Select a staff member to escalate this to:
          </p>
          <Popover open={staffPopoverOpen} onOpenChange={setStaffPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
              >
                {selectedStaff ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                      {selectedStaff
                        .replace(/\s*\(.*?\)\s*/g, " ")
                        .trim()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span>{selectedStaff}</span>
                  </div>
                ) : (
                  <span className="text-slate-400">Select staff member...</span>
                )}
                <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search staff..." />
                <CommandList>
                  <CommandEmpty>No staff found.</CommandEmpty>
                  <CommandGroup>
                    {staffMembers.map((staff) => {
                      const displayValue = `${staff.name} (${staff.role ?? "Staff"})`
                      const isSelected =
                        selectedStaff === displayValue || selectedStaff === staff.name
                      return (
                        <CommandItem
                          key={staff.id}
                          value={staff.name}
                          onSelect={() => {
                            setSelectedStaff(displayValue)
                            setStaffPopoverOpen(false)
                          }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-900">
                              {staff.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {staff.role}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white"
            disabled={!selectedStaff}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
