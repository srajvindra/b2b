"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Flag, 
  Check, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckSquare, 
  Video, 
  Settings, 
  Zap,
  FileText,
  Hand,
  Star,
  Ban,
  Users,
  Trash2,
  Plus
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface WorkflowStep {
  id: string
  name: string
  type: "email" | "call" | "text" | "todo" | "meet" | "process" | "stage_change"
  timing: {
    type: "immediately" | "after_previous" | "specific_time"
    value?: number
    unit?: "hours" | "days"
  }
  day: number
  badge?: string
  isAutomated?: boolean
}

interface StageWorkflowPageProps {
  stageName: string
  processName: string
  onBack: () => void
}

const initialWorkflowSteps: WorkflowStep[] = [
  {
    id: "step-1",
    name: "Banking",
    type: "email",
    timing: { type: "immediately" },
    day: 1,
    isAutomated: true,
  },
  {
    id: "step-2",
    name: "W-9",
    type: "text",
    timing: { type: "immediately" },
    day: 1,
  },
  {
    id: "step-3",
    name: "Insurance",
    type: "call",
    timing: { type: "immediately" },
    day: 1,
  },
  {
    id: "step-4",
    name: "Test banking info",
    type: "todo",
    timing: { type: "immediately" },
    day: 1,
  },
  {
    id: "step-5",
    name: "Onboarding Meeting",
    type: "meet",
    timing: { type: "after_previous", value: 1, unit: "days" },
    day: 2,
  },
  {
    id: "step-6",
    name: "Document Review",
    type: "process",
    timing: { type: "after_previous", value: 2, unit: "hours" },
    day: 2,
    badge: "Document Verification",
  },
]

export function StageWorkflowPage({ stageName, processName, onBack }: StageWorkflowPageProps) {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(initialWorkflowSteps)
  const [showAddStepModal, setShowAddStepModal] = useState(false)
  const [showEditStepModal, setShowEditStepModal] = useState(false)
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null)
  const [newStepName, setNewStepName] = useState("")
  const [newStepType, setNewStepType] = useState<WorkflowStep["type"]>("email")
  const [newStepTiming, setNewStepTiming] = useState<"immediately" | "after_previous">("immediately")
  const [newStepTimingValue, setNewStepTimingValue] = useState("1")
  const [newStepTimingUnit, setNewStepTimingUnit] = useState<"hours" | "days">("days")

  const getStepIcon = (type: WorkflowStep["type"], isAutomated?: boolean) => {
    const icons: Record<WorkflowStep["type"], React.ReactNode> = {
      email: (
        <div className="flex items-center gap-1">
          <Mail className="h-4 w-4 text-gray-600" />
          {isAutomated && <Zap className="h-3 w-3 text-amber-500" />}
        </div>
      ),
      call: <Phone className="h-4 w-4 text-green-600" />,
      text: <MessageSquare className="h-4 w-4 text-blue-500" />,
      todo: <CheckSquare className="h-4 w-4 text-green-600" />,
      meet: <Video className="h-4 w-4 text-red-500" />,
      process: <Settings className="h-4 w-4 text-gray-600" />,
      stage_change: <Flag className="h-4 w-4 text-gray-600" />,
    }
    return icons[type]
  }

  const getTimingText = (timing: WorkflowStep["timing"]) => {
    if (timing.type === "immediately") {
      return "immediately"
    }
    if (timing.type === "after_previous") {
      return `${timing.value} ${timing.unit === "hours" ? "hours" : timing.value === 1 ? "day" : "days"} after\nprevious step`
    }
    return "specific time"
  }

  const handleAddStep = (type: WorkflowStep["type"]) => {
    setNewStepType(type)
    setNewStepName("")
    setNewStepTiming("immediately")
    setNewStepTimingValue("1")
    setNewStepTimingUnit("days")
    setShowAddStepModal(true)
  }

  const handleCreateStep = () => {
    if (newStepName.trim()) {
      const lastStep = workflowSteps[workflowSteps.length - 1]
      const newStep: WorkflowStep = {
        id: `step-${Date.now()}`,
        name: newStepName.trim(),
        type: newStepType,
        timing: newStepTiming === "immediately" 
          ? { type: "immediately" }
          : { type: "after_previous", value: parseInt(newStepTimingValue), unit: newStepTimingUnit },
        day: lastStep ? (newStepTiming === "immediately" ? lastStep.day : lastStep.day + 1) : 1,
      }
      setWorkflowSteps([...workflowSteps, newStep])
      setShowAddStepModal(false)
      setNewStepName("")
    }
  }

  const handleEditStep = (step: WorkflowStep) => {
    setSelectedStep(step)
    setNewStepName(step.name)
    setNewStepType(step.type)
    setNewStepTiming(step.timing.type === "immediately" ? "immediately" : "after_previous")
    setNewStepTimingValue(step.timing.value?.toString() || "1")
    setNewStepTimingUnit(step.timing.unit || "days")
    setShowEditStepModal(true)
  }

  const handleUpdateStep = () => {
    if (selectedStep && newStepName.trim()) {
      setWorkflowSteps(workflowSteps.map(step => {
        if (step.id === selectedStep.id) {
          return {
            ...step,
            name: newStepName.trim(),
            type: newStepType,
            timing: newStepTiming === "immediately"
              ? { type: "immediately" as const }
              : { type: "after_previous" as const, value: parseInt(newStepTimingValue), unit: newStepTimingUnit },
          }
        }
        return step
      }))
      setShowEditStepModal(false)
      setSelectedStep(null)
    }
  }

  const handleDeleteStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId))
  }

  const handleDuplicateStep = (step: WorkflowStep) => {
    const newStep: WorkflowStep = {
      ...step,
      id: `step-${Date.now()}`,
      name: `${step.name} (Copy)`,
    }
    const stepIndex = workflowSteps.findIndex(s => s.id === step.id)
    const newSteps = [...workflowSteps]
    newSteps.splice(stepIndex + 1, 0, newStep)
    setWorkflowSteps(newSteps)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{stageName}</h1>
              <p className="text-sm text-gray-500">{processName}</p>
            </div>
          </div>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white gap-2">
            <Settings className="h-4 w-4" />
            Workflow Settings
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Stage Entry Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-olive-600 flex items-center justify-center" style={{ backgroundColor: '#6b7c4c' }}>
            <Flag className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm text-gray-700">
            Process enters stage <span className="font-medium text-gray-900">{stageName}</span>.
          </p>
        </div>

        {/* Workflow Steps Timeline */}
        <div className="relative">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center min-h-[60px]">
              {/* Timing Column - Right aligned text */}
              <div className="w-24 flex-shrink-0 flex flex-col justify-center items-end pr-4 text-right">
                <p className="text-xs text-gray-500 whitespace-pre-line leading-tight italic">
                  {getTimingText(step.timing)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">day {step.day}</p>
              </div>

              {/* Timeline Connector Column */}
              <div className="flex flex-col items-center flex-shrink-0 relative w-8 self-stretch">
                {/* Vertical line - runs through the entire height */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gray-300" style={{ top: '50%', height: '100%' }} />
                )}
                {/* Circle with checkmark */}
                <div className="h-7 w-7 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10 my-auto">
                  <Check className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              {/* Step Card - Stretches to fill available space */}
              <div className="flex-1 py-1.5 pl-4 pr-2">
                <div className="bg-white border border-gray-200 rounded-md px-4 py-3 hover:border-gray-300 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.type, step.isAutomated)}
                    <span 
                      className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => handleEditStep(step)}
                    >
                      {step.name}
                    </span>
                    {step.badge && (
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-300 ml-1">
                        {step.badge}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Icons - Always Visible */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                      <Hand className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                      <span className="text-xs font-medium">P</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                      <Ban className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-gray-50"
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

        {/* Bottom Action Bar */}
        <div className="flex items-center gap-2 mt-8 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-300">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleAddStep("email")}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddStep("call")}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddStep("text")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Text Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddStep("todo")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Todo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddStep("meet")}>
                <Video className="h-4 w-4 mr-2" />
                Meet
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAddStep("process")}>
                <Settings className="h-4 w-4 mr-2" />
                Create Process
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddStep("stage_change")}>
                <Flag className="h-4 w-4 mr-2" />
                Stage Change
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("email")}>
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("call")}>
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("text")}>
            <MessageSquare className="h-4 w-4" />
            Text Message
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("todo")}>
            <CheckSquare className="h-4 w-4" />
            Todo
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("meet")}>
            <Video className="h-4 w-4" />
            Meet
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("process")}>
            <Settings className="h-4 w-4" />
            Create Process
          </Button>
          <Button variant="outline" className="h-9 gap-2 border-gray-300" onClick={() => handleAddStep("stage_change")}>
            <Flag className="h-4 w-4" />
            Stage Change
          </Button>
        </div>
      </div>

      {/* Add Step Modal */}
      <Dialog open={showAddStepModal} onOpenChange={setShowAddStepModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Step Name</Label>
              <Input 
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder="Enter step name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Step Type</Label>
              <Select value={newStepType} onValueChange={(value: WorkflowStep["type"]) => setNewStepType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="meet">Meet</SelectItem>
                  <SelectItem value="process">Create Process</SelectItem>
                  <SelectItem value="stage_change">Stage Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timing</Label>
              <Select value={newStepTiming} onValueChange={(value: "immediately" | "after_previous") => setNewStepTiming(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="after_previous">After Previous Step</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newStepTiming === "after_previous" && (
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Delay</Label>
                  <Input 
                    type="number"
                    value={newStepTimingValue}
                    onChange={(e) => setNewStepTimingValue(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Unit</Label>
                  <Select value={newStepTimingUnit} onValueChange={(value: "hours" | "days") => setNewStepTimingUnit(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStepModal(false)}>Cancel</Button>
            <Button onClick={handleCreateStep} className="bg-teal-600 hover:bg-teal-700">Add Step</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Step Modal */}
      <Dialog open={showEditStepModal} onOpenChange={setShowEditStepModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Step Name</Label>
              <Input 
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                placeholder="Enter step name..."
              />
            </div>
            <div className="space-y-2">
              <Label>Step Type</Label>
              <Select value={newStepType} onValueChange={(value: WorkflowStep["type"]) => setNewStepType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="meet">Meet</SelectItem>
                  <SelectItem value="process">Create Process</SelectItem>
                  <SelectItem value="stage_change">Stage Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timing</Label>
              <Select value={newStepTiming} onValueChange={(value: "immediately" | "after_previous") => setNewStepTiming(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="after_previous">After Previous Step</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newStepTiming === "after_previous" && (
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Delay</Label>
                  <Input 
                    type="number"
                    value={newStepTimingValue}
                    onChange={(e) => setNewStepTimingValue(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Unit</Label>
                  <Select value={newStepTimingUnit} onValueChange={(value: "hours" | "days") => setNewStepTimingUnit(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditStepModal(false)}>Cancel</Button>
            <Button onClick={handleUpdateStep} className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StageWorkflowPage
