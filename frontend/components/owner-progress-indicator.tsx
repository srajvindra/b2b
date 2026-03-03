"use client"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

// Define the 4 steps - you can customize these names with the client
const OWNER_ONBOARDING_STEPS = [
  { id: 1, name: "Initial Contact", shortName: "Contact" },
  { id: 2, name: "Documentation", shortName: "Docs" },
  { id: 3, name: "Agreement", shortName: "Agreement" },
  { id: 4, name: "Onboarded", shortName: "Active" },
]

interface OwnerProgressIndicatorProps {
  currentStep: number // 1-4
  variant?: "full" | "compact" | "mini"
  className?: string
  onStepChange?: (step: number, completed: boolean) => void
}

export function OwnerProgressIndicator({
  currentStep,
  variant = "full",
  className,
  onStepChange,
}: OwnerProgressIndicatorProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set(Array.from({ length: currentStep }, (_, i) => i + 1)),
  )

  const handleStepToggle = (stepId: number, checked: boolean) => {
    const newCompleted = new Set(completedSteps)
    if (checked) {
      // When checking a step, also check all previous steps
      for (let i = 1; i <= stepId; i++) {
        newCompleted.add(i)
      }
    } else {
      // When unchecking a step, also uncheck all following steps
      for (let i = stepId; i <= OWNER_ONBOARDING_STEPS.length; i++) {
        newCompleted.delete(i)
      }
    }
    setCompletedSteps(newCompleted)
    onStepChange?.(stepId, checked)
  }

  if (variant === "mini") {
    // Mini dots version for kanban cards
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {OWNER_ONBOARDING_STEPS.map((step) => (
          <div
            key={step.id}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              step.id <= currentStep ? "bg-teal-600" : "bg-muted-foreground/20",
            )}
            title={step.name}
          />
        ))}
      </div>
    )
  }

  if (variant === "compact") {
    // Compact bar version with labels
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Onboarding Progress</span>
          <span className="font-medium text-foreground">
            Step {currentStep} of {OWNER_ONBOARDING_STEPS.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {OWNER_ONBOARDING_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "h-2 w-full rounded-full transition-all",
                  step.id <= currentStep ? "bg-teal-600" : "bg-muted-foreground/20",
                )}
              />
              {index < OWNER_ONBOARDING_STEPS.length - 1 && <div className="w-1" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          {OWNER_ONBOARDING_STEPS.map((step) => (
            <span
              key={step.id}
              className={cn("flex-1 text-center", step.id <= currentStep && "text-foreground font-medium")}
            >
              {step.shortName}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Full stepper version for detail view with checkboxes
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {OWNER_ONBOARDING_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle with Checkbox */}
            <div className="flex flex-col items-center relative">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all relative z-10 cursor-pointer",
                  completedSteps.has(step.id) ? "bg-teal-600 border-teal-600" : "bg-white border-muted-foreground/30",
                )}
              >
                <Checkbox
                  checked={completedSteps.has(step.id)}
                  onCheckedChange={(checked) => handleStepToggle(step.id, checked as boolean)}
                  className={cn(
                    "h-6 w-6 rounded-full border-0 data-[state=checked]:bg-transparent",
                    completedSteps.has(step.id) ? "text-white" : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    completedSteps.has(step.id) ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.name}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < OWNER_ONBOARDING_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors",
                  completedSteps.has(step.id) ? "bg-teal-600" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to determine current step based on owner stage
export function getOwnerProgressStep(stage: string): number {
  const stageMap: Record<string, number> = {
    "New lead": 1,
    "Attempting to contact": 1,
    "Scheduled Intro call": 2,
    Working: 3,
    Closing: 3,
    "New client": 4,
    // Type 2 stages
    "Initial Contact": 1,
    Qualification: 2,
    "Property Assessment": 2,
    "Proposal Sent": 3,
    Negotiation: 3,
    "Agreement Signed": 4,
    // Type 3 stages
    "Inquiry Received": 1,
    "Documentation Review": 2,
    "Site Visit Scheduled": 2,
    "Due Diligence": 3,
    "Contract Phase": 3,
    Onboarded: 4,
    // Type 4 stages
    "Lead Generation": 1,
    "First Meeting": 1,
    "Needs Analysis": 2,
    "Solution Presentation": 3,
    "Final Review": 3,
    "Client Active": 4,
  }

  return stageMap[stage] || 1
}

// Helper function to determine current step based on lease prospect stage
export function getProspectProgressStep(stage: string): number {
  const stageMap: Record<string, number> = {
    // Prospect Type 1 stages
    "New Prospects": 1,
    "Appointment Booked with LC": 1,
    "Scheduled Showing": 2,
    "No Show – Prospect": 2,
    "Showing Agent – No Show": 2,
    "Showing Completed – Awaiting Feedback": 2,
    "Not Interested / Disliked Property": 2,
    "Interested – Application Sent": 3,
    "Application Received – Under Review": 3,
    "Application Rejected": 3,
    "Application Approved – Lease Sent": 3,
    "Lease Signed – Schedule Move In": 4,
    "Move In – Completed and Feedback": 4,
    "Tenant – Lost or Backed Out": 3,
    // Prospect Type 2 stages
    "Initial Inquiry": 1,
    "Qualifying Call Scheduled": 1,
    "Property Tour Booked": 2,
    "Tour Completed": 2,
    "Application Submitted": 3,
    "Application Processing": 3,
    "Approved – Lease Ready": 4,
    // Prospect Type 3 stages
    "Lead Received": 1,
    "First Contact Made": 1,
    "Showing Requested": 2,
    "Showing Confirmed": 2,
    "Post-Showing Follow-up": 2,
    "Offer Submitted": 3,
    "Lease Negotiation": 3,
    // Prospect Type 4 stages
    "Prospect Contacted": 1,
    "Interest Confirmed": 1,
    "Viewing Scheduled": 2,
    "Viewing Complete": 2,
    "Decision Pending": 3,
    "Lease Documents Sent": 3,
    "Move-in Scheduled": 4,
  }

  return stageMap[stage] || 1
}
