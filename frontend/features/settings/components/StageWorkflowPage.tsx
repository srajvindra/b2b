/* eslint-disable no-alert */
"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { StageStatus } from "../types"

import {
  ArrowLeft,
  Flag,
  Check,
  Zap,
  FileText,
  Hand,
  Asterisk,
  Timer,
  Network,
  Trash2,
  Settings,
  Mail,
  Phone,
  MessageSquare,
  CheckSquare,
  Video,
  Plus,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List,
  MoreVertical,
  AtSign,
} from "lucide-react"
import React, { useRef, useState } from "react"

type WorkflowStepType = "email" | "text" | "call" | "todo" | "meet" | "process"

interface WorkflowStep {
  id: string
  type: WorkflowStepType
  name: string
  timing: string
  day: number
  autoSend: boolean
  processName: string | null
}

export interface StageWorkflowPageProps {
  categoryName: string
  stage: StageStatus
  backHref: string
}

const defaultWorkflowSteps: WorkflowStep[] = [
  { id: "1", type: "email", name: "Banking", timing: "immediately", day: 1, autoSend: true, processName: null },
  { id: "2", type: "text", name: "W-9", timing: "immediately", day: 1, autoSend: false, processName: null },
  { id: "3", type: "call", name: "Insurance", timing: "immediately", day: 1, autoSend: false, processName: null },
  { id: "4", type: "todo", name: "Test banking info", timing: "immediately", day: 1, autoSend: false, processName: null },
  {
    id: "5",
    type: "meet",
    name: "Onboarding Meeting",
    timing: "1 day after previous step",
    day: 2,
    autoSend: false,
    processName: null,
  },
  {
    id: "6",
    type: "process",
    name: "Document Review",
    timing: "2 hours after previous step",
    day: 2,
    autoSend: false,
    processName: "Document Verification",
  },
]

function getTypeIcon(type: WorkflowStepType) {
  switch (type) {
    case "email":
      return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">E</span>
    case "text":
      return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600 text-xs font-semibold">T</span>
    case "call":
      return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">C</span>
    case "todo":
      return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">To</span>
    case "meet":
      return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-50 text-pink-600 text-xs font-semibold">M</span>
    case "process":
      return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-teal-600 text-xs font-semibold">P</span>
    default:
      return null
  }
}

export function StageWorkflowPage({ categoryName, stage, backHref }: StageWorkflowPageProps) {
  const router = useRouter()

  const [stageWorkflowSteps, setStageWorkflowSteps] = useState<WorkflowStep[]>(defaultWorkflowSteps)
  const [instructionsDialogOpen, setInstructionsDialogOpen] = useState(false)
  const [instructionsStepId, setInstructionsStepId] = useState<string | null>(null)
  const [instructionsText, setInstructionsText] = useState("")
  const [savedInstructions, setSavedInstructions] = useState<Record<string, string>>({})
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const availableFieldTags = [
    { tag: "unit_count", label: "No of Units" },
    { tag: "any_occupied_unit", label: "Any Occupied Units" },
    { tag: "any_vacant_unit", label: "Any Vacant Unit" },
    { tag: "owner_name", label: "Owner Name" },
    { tag: "property_address", label: "Property Address" },
    { tag: "existing_owner_or_new_owner", label: "Existing Owner or New Owner?" },
    { tag: "existing_tenant_moving_out", label: "Existing Tenant Moving Out?" },
    { tag: "walkthrough_scheduled", label: "Property Walkthrough Scheduled?" },
    { tag: "any_information_missing", label: "Any Information Missing?" },
    { tag: "property_condition_rating", label: "Property Condition Rating" },
  ]

  const handleOpenInstructions = (stepId: string) => {
    setInstructionsStepId(stepId)
    setInstructionsText(savedInstructions[stepId] ?? "")
    setInstructionsDialogOpen(true)
  }

  const handleDeleteStep = (stepId: string) => {
    setStageWorkflowSteps((prev) => prev.filter((s) => s.id !== stepId))
  }

  const handleSaveInstructions = () => {
    if (!instructionsStepId) return
    setSavedInstructions((prev) => ({
      ...prev,
      [instructionsStepId]: instructionsText,
    }))
    setInstructionsDialogOpen(false)
  }

  const handleInsertFieldTag = (tag: string) => {
    const textToInsert = `{{${tag}}}`
    const textarea = textareaRef.current
    if (!textarea) {
      setInstructionsText((prev) => prev + textToInsert)
      return
    }

    const { selectionStart, selectionEnd } = textarea
    setInstructionsText((prev) => prev.slice(0, selectionStart) + textToInsert + prev.slice(selectionEnd))

    // move cursor to just after inserted tag on next tick
    requestAnimationFrame(() => {
      const pos = selectionStart + textToInsert.length
      textarea.setSelectionRange(pos, pos)
      textarea.focus()
    })
  }

  const handleAddWorkflowStep = (type: WorkflowStepType, name: string) => {
    setStageWorkflowSteps((prev) => {
      const nextIndex = prev.length + 1
      const lastDay = prev[prev.length - 1]?.day ?? 1
      return [
        ...prev,
        {
          id: String(nextIndex),
          type,
          name,
          timing: "immediately",
          day: lastDay,
          autoSend: type === "email" || type === "text",
          processName: null,
        },
      ]
    })
  }

  return (
    <div className="p-6 bg-muted/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(backHref)}
            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Input
              defaultValue={stage.name}
              className="text-xl font-bold text-foreground border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <p className="text-sm text-muted-foreground mt-1">{categoryName}</p>
          </div>
        </div>
        <Button variant="outline" className="bg-foreground text-background hover:bg-foreground/90 border-foreground">
          <Settings className="h-4 w-4 mr-2" />
          Workflow Settings
        </Button>
      </div>

      {/* Process enters stage indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded bg-[#6B8E23] flex items-center justify-center">
          <Flag className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm text-foreground/80">
          Process enters stage <span className="text-primary font-medium">{stage.name}</span>.
        </span>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-0 mb-6">
        {stageWorkflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-start">
            {/* Timing column */}
            <div className="w-24 text-right pr-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium">{step.timing}</p>
              <p className="text-xs text-muted-foreground/70">day {step.day}</p>
            </div>

            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              {index < stageWorkflowSteps.length - 1 && <div className="w-0.5 h-12 bg-border" />}
            </div>

            {/* Step content */}
            <div className="flex-1 ml-4">
              <div className="bg-card border border-border rounded-lg p-3 flex items-center justify-between shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-2">
                  {/* Type Icon */}
                  <span title={step.type.charAt(0).toUpperCase() + step.type.slice(1)}>{getTypeIcon(step.type)}</span>
                  {/* Auto-send lightning icon for email/text */}
                  {(step.type === "email" || step.type === "text") && step.autoSend && (
                    <span title="Auto-send enabled" className="text-chart-4">
                      <Zap className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
                    onClick={() => {
                      alert(`Edit step: ${step.name}`)
                    }}
                  >
                    {step.name}
                  </button>
                  {/* Process name badge aligned to the right of step name */}
                  {step.processName && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                      {step.processName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary hover:bg-primary/10"
                    title="Instructions"
                    onClick={() => handleOpenInstructions(step.id)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    title="Manual Action"
                  >
                    <Hand className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    title="Required"
                  >
                    <Asterisk className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    title="Set Timer"
                  >
                    <Timer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    title="Delete Step"
                    onClick={() => handleDeleteStep(step.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Action Controls */}
      <div className="flex items-start mb-8">
        <div className="w-24" />
        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-foreground text-foreground hover:bg-muted bg-transparent"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 ml-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-foreground/80 border-border hover:bg-muted"
              onClick={() => handleAddWorkflowStep("email", "New Email")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-foreground/80 border-border hover:bg-muted"
              onClick={() => handleAddWorkflowStep("call", "New Call")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-foreground/80 border-border hover:bg-muted"
              onClick={() => handleAddWorkflowStep("text", "New Text Message")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Text Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-foreground/80 border-border hover:bg-muted"
              onClick={() => handleAddWorkflowStep("todo", "New Todo")}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Todo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-foreground/80 border-border hover:bg-muted"
              onClick={() => handleAddWorkflowStep("meet", "New Meeting")}
            >
              <Video className="h-4 w-4 mr-2" />
              Meet
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-primary border-primary/30 hover:bg-primary/10"
              onClick={() => handleAddWorkflowStep("process", "New Process")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Create Process
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent text-primary border-primary/30 hover:bg-primary/10"
            >
              <Flag className="h-4 w-4 mr-2" />
              Stage Change
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions dialog */}
      <Dialog open={instructionsDialogOpen} onOpenChange={setInstructionsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Step instructions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between rounded-md border bg-muted/60 px-2 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">Instructions</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="More options"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              rows={6}
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              placeholder="Enter instructions here. Use tags below to reference custom fields..."
            />

            {/* Insert Field Tag */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AtSign className="h-4 w-4" />
                Insert Field Tag
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableFieldTags.map((field) => (
                  <Button
                    key={field.tag}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary"
                    onClick={() => handleInsertFieldTag(field.tag)}
                  >
                    {field.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Click a tag to insert it at the cursor position. Tags will be replaced with actual values when the
                process runs.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setInstructionsDialogOpen(false)
                setInstructionsStepId(null)
                setInstructionsText("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveInstructions} disabled={!instructionsStepId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

