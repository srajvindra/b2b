"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  Users,
  Home,
  Edit2,
  Trash2,
  Plus,
  Power,
  PowerOff,
  Save,
  X,
  MoreVertical,
  Package,
  GripVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProcessStep {
  id: string
  name: string
  owners: number
  tenants: number
  isActive: boolean
}

interface ProcessDetailPageProps {
  processId: string
  onBack: () => void
}

// Mock data - in production this would come from a database
const getProcessData = (id: string) => {
  const processes: Record<
    string,
    { name: string; description: string; steps: ProcessStep[]; color: string; bgColor: string }
  > = {
    "move-in": {
      name: "Move In",
      description: "Manage tenant move-in procedures and checklists",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      steps: [
        { id: "1", name: "Application Review", owners: 3, tenants: 8, isActive: true },
        { id: "2", name: "Background Check", owners: 2, tenants: 5, isActive: true },
        { id: "3", name: "Lease Signing", owners: 4, tenants: 12, isActive: true },
        { id: "4", name: "Key Handover", owners: 1, tenants: 3, isActive: true },
        { id: "5", name: "Welcome Orientation", owners: 2, tenants: 6, isActive: true },
      ],
    },
    "move-out": {
      name: "Move Out",
      description: "Handle tenant departures and property turnover",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      steps: [
        { id: "1", name: "Notice Processing", owners: 2, tenants: 4, isActive: true },
        { id: "2", name: "Pre-Inspection", owners: 3, tenants: 4, isActive: true },
        { id: "3", name: "Final Walkthrough", owners: 2, tenants: 3, isActive: true },
        { id: "4", name: "Deposit Settlement", owners: 1, tenants: 3, isActive: true },
      ],
    },
    inspections: {
      name: "Inspections",
      description: "Schedule and manage property inspections",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      steps: [
        { id: "1", name: "Schedule Inspection", owners: 5, tenants: 15, isActive: true },
        { id: "2", name: "Conduct Inspection", owners: 3, tenants: 10, isActive: true },
        { id: "3", name: "Report Generation", owners: 2, tenants: 8, isActive: true },
        { id: "4", name: "Issue Resolution", owners: 4, tenants: 6, isActive: true },
        { id: "5", name: "Follow-up", owners: 2, tenants: 4, isActive: true },
        { id: "6", name: "Close Out", owners: 1, tenants: 2, isActive: true },
      ],
    },
    leasing: {
      name: "Leasing",
      description: "Manage lease renewals and new applications",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      steps: [
        { id: "1", name: "Lead Capture", owners: 2, tenants: 20, isActive: true },
        { id: "2", name: "Property Showing", owners: 4, tenants: 15, isActive: true },
        { id: "3", name: "Application Processing", owners: 3, tenants: 10, isActive: true },
        { id: "4", name: "Lease Preparation", owners: 2, tenants: 8, isActive: true },
        { id: "5", name: "Lease Execution", owners: 1, tenants: 5, isActive: true },
      ],
    },
    maintenance: {
      name: "Maintenance",
      description: "Track and resolve maintenance requests",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      steps: [
        { id: "1", name: "Request Submitted", owners: 6, tenants: 25, isActive: true },
        { id: "2", name: "Triage & Assign", owners: 4, tenants: 18, isActive: true },
        { id: "3", name: "Work In Progress", owners: 5, tenants: 12, isActive: true },
        { id: "4", name: "Quality Check", owners: 2, tenants: 8, isActive: true },
        { id: "5", name: "Completion", owners: 1, tenants: 5, isActive: true },
      ],
    },
    renovation: {
      name: "Renovation/Repairs",
      description: "Coordinate major repairs and unit renovations",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      steps: [
        { id: "1", name: "Scope Assessment", owners: 3, tenants: 0, isActive: true },
        { id: "2", name: "Vendor Selection", owners: 2, tenants: 0, isActive: true },
        { id: "3", name: "Work Execution", owners: 4, tenants: 2, isActive: true },
        { id: "4", name: "Final Inspection", owners: 2, tenants: 1, isActive: true },
      ],
    },
  }
  return processes[id] || processes["move-in"]
}

export function ProcessDetailPage({ processId, onBack }: ProcessDetailPageProps) {
  const processData = getProcessData(processId)
  const [steps, setSteps] = useState<ProcessStep[]>(processData.steps)
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [editingStepName, setEditingStepName] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newStepName, setNewStepName] = useState("")

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)

  const handleEditStep = (stepId: string, currentName: string) => {
    setEditingStepId(stepId)
    setEditingStepName(currentName)
  }

  const handleSaveEdit = (stepId: string) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, name: editingStepName } : step)))
    setEditingStepId(null)
    setEditingStepName("")
  }

  const handleCancelEdit = () => {
    setEditingStepId(null)
    setEditingStepName("")
  }

  const handleToggleActive = (stepId: string) => {
    setSteps(steps.map((step) => (step.id === stepId ? { ...step, isActive: !step.isActive } : step)))
  }

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId))
  }

  const handleAddNewStep = () => {
    if (newStepName.trim()) {
      const newStep: ProcessStep = {
        id: String(steps.length + 1),
        name: newStepName,
        owners: 0,
        tenants: 0,
        isActive: true,
      }
      setSteps([...steps, newStep])
      setNewStepName("")
      setIsAddingNew(false)
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    dragNodeRef.current = e.currentTarget
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(index))
    // Add a slight delay to allow the drag image to be captured
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.5"
      }
    }, 0)
  }

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1"
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
    dragNodeRef.current = null
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null)
      return
    }

    const newSteps = [...steps]
    const [draggedStep] = newSteps.splice(draggedIndex, 1)
    newSteps.splice(dropIndex, 0, draggedStep)
    setSteps(newSteps)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const getTotalUsers = (step: ProcessStep) => step.owners + step.tenants

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/80">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{processData.name}</h1>
            <p className="text-muted-foreground">{processData.description}</p>
          </div>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-white/80 backdrop-blur-sm leading-7">
          <CardContent className="px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full ${processData.bgColor} flex items-center justify-center`}>
                  <Package className={`h-5 w-5 ${processData.color}`} />
                </div>
                <p className="text-muted-foreground text-base">Total Steps</p>
              </div>
              <p className={`text-2xl font-bold ${processData.color}`}>{steps.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full ${processData.bgColor} flex items-center justify-center`}>
                  <Power className={`h-5 w-5 ${processData.color}`} />
                </div>
                <p className="text-muted-foreground text-base">Active Steps</p>
              </div>
              <p className={`text-2xl font-bold ${processData.color}`}>{steps.filter((s) => s.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="px-4 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full ${processData.bgColor} flex items-center justify-center`}>
                  <Users className={`h-5 w-5 ${processData.color}`} />
                </div>
                <p className="text-muted-foreground text-base">Total Users</p>
              </div>
              <p className={`text-2xl font-bold ${processData.color}`}>
                {steps.reduce((sum, s) => sum + getTotalUsers(s), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Steps List */}
      <Card className="bg-white/80 backdrop-blur-sm border-2">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Process Steps</h2>
              <p className="text-sm text-muted-foreground">Manage and configure workflow steps</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Owners</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Tenants</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing ${
                  dragOverIndex === index
                    ? "border-teal-500 bg-teal-50"
                    : step.isActive
                      ? "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                      : "bg-gray-50 border-gray-200 opacity-60"
                } ${draggedIndex === index ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Step Number */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      step.isActive
                        ? `${processData.color} ${processData.bgColor} border-current`
                        : "text-gray-400 bg-gray-100 border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Step Name */}
                  <div className="flex-1">
                    {editingStepId === step.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingStepName}
                          onChange={(e) => setEditingStepName(e.target.value)}
                          className="max-w-md"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(step.id)
                            if (e.key === "Escape") handleCancelEdit()
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(step.id)}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${step.isActive ? "text-foreground" : "text-gray-400"}`}>
                          {step.name}
                        </span>
                        {!step.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Counts */}
                  <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 ${step.isActive ? processData.color : "text-gray-400"}`}>
                      <Home className="h-4 w-4" />
                      <span className="font-semibold text-sm">{step.owners}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${step.isActive ? processData.color : "text-gray-400"}`}>
                      <Users className="h-4 w-4" />
                      <span className="font-semibold text-sm">{step.tenants}</span>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Total: {getTotalUsers(step)}</div>
                  </div>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleEditStep(step.id, step.name)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleActive(step.id)}>
                      {step.isActive ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          Reactivate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Step
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {/* Add New Step Form */}
            {isAddingNew && (
              <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-teal-300 bg-teal-50">
                <div className="text-gray-300">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${processData.color} ${processData.bgColor} border-2 border-current`}
                >
                  {steps.length + 1}
                </div>
                <Input
                  placeholder="Enter step name..."
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  className="flex-1 bg-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNewStep()
                    if (e.key === "Escape") {
                      setIsAddingNew(false)
                      setNewStepName("")
                    }
                  }}
                />
                <Button
                  onClick={handleAddNewStep}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={!newStepName.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAddingNew(false)
                    setNewStepName("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {steps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">No steps configured yet</p>
              <Button onClick={() => setIsAddingNew(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Step
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProcessDetailPage
