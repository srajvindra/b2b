"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CheckSquare, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Task, TaskEntityType, TaskStatus } from "../../features/dashboard/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"


export type StaffMember = { id: number; name: string; role: string }

function isOverdue(dueDate: string) {
  if (!dueDate) return false
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, "0")
  const d = String(today.getDate()).padStart(2, "0")
  const todayStr = `${y}-${m}-${d}`
  return dueDate < todayStr
}

export interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffMembers: StaffMember[]
  defaultAssignee?: string | null
  onAddTask: (task: Task) => void
}

export function AddTaskDialog({ open, onOpenChange, staffMembers, defaultAssignee, onAddTask }: AddTaskDialogProps) {
  const defaultAssignedTo = useMemo(() => defaultAssignee ?? "", [defaultAssignee])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [assignedTo, setAssignedTo] = useState(defaultAssignedTo)
  const [files, setFiles] = useState<File[]>([])
  const [dialogAssigneeOpen, setDialogAssigneeOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setAssignedTo((prev) => prev || defaultAssignedTo)
    }
  }, [open, defaultAssignedTo])

  const reset = () => {
    setTitle("")
    setDescription("")
    setDueDate("")
    setPriority("medium")
    setAssignedTo(defaultAssignedTo)
    setFiles([])
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  const handleSave = () => {
    if (!title.trim() || !assignedTo) return

    const status: TaskStatus = "Pending"
    const task: Task = {
      id: Date.now(),
      type: "task",
      title: title.trim(),
      dueDate,
      priority,
      entity: "—",
      entityType: "tenant" as TaskEntityType,
      risk: "Operational",
      overdue: isOverdue(dueDate),
      assignedTo: assignedTo || "—",
      escalatedTo: "",
      status,
      notes: description.trim() || undefined,
    }

    onAddTask(task)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-teal-600" />
            Add Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
            <Input className="mt-1" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
            <Textarea className="mt-1" placeholder="Enter task description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
              <Input type="date" className="mt-1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            {/* <div>
              <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
              <select
                className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div> */}
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Assignee</Label>
              <Popover open={dialogAssigneeOpen} onOpenChange={setDialogAssigneeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full mt-1 justify-between font-normal"
                  >
                    {assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                          {assignedTo.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="truncate">{assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select assignee...</span>
                    )}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search staff..." />
                    <CommandList>
                      <CommandEmpty>No staff found.</CommandEmpty>
                      <CommandGroup>
                        {staffMembers.map((staff) => (
                          <CommandItem
                            key={staff.id}
                            value={staff.name}
                            onSelect={() => {
                              setAssignedTo(staff.name)
                              setDialogAssigneeOpen(false)
                            }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-medium text-slate-600 shrink-0">
                              {staff.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-900">{staff.name}</span>
                              <span className="text-[10px] text-slate-500">{staff.role}</span>
                            </div>
                            {assignedTo === staff.name && (
                              <Check className="h-3.5 w-3.5 text-teal-600 ml-auto" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>


          <div>
            <Label className="text-xs font-medium text-muted-foreground">Upload Files</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setFiles(Array.from(e.dataTransfer.files ?? []))
              }}
              className="mt-2 w-full rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/30 px-4 py-7 text-center hover:bg-slate-50 transition-colors"
            >
              <div className="mx-auto w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Upload className="h-5 w-5 text-slate-500" />
              </div>
              <div className="mt-3 text-sm text-slate-600">Click to upload or drag & drop</div>
              <div className="mt-1 text-xs text-slate-400">PDF, DOC, XLS, JPG, PNG up to 10MB</div>
              {files.length > 0 && (
                <div className="mt-3 text-xs text-slate-500">
                  {files.length} file{files.length === 1 ? "" : "s"} selected
                </div>
              )}
            </button>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            disabled={!title.trim() || !assignedTo}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

