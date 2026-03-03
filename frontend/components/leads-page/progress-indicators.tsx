import { Check } from "lucide-react"

// Progress step calculation for owners based on stage
export function getOwnerProgressStep(stage: string, ownerType?: string): number {
  const stageMap: Record<string, number> = {
    "New lead": 0,
    "Attempting to contact": 0,
    "Scheduled Intro call": 1,
    Working: 2,
    Closing: 3,
    "New client": 4,
    Lost: 0,
  }
  return stageMap[stage] ?? 0
}

// Progress step calculation for prospects/tenants based on stage
export function getProspectProgressStep(stage: string): number {
  const stageMap: Record<string, number> = {
    "New lead": 0,
    "Attempting to contact": 0,
    "Scheduled Intro call": 1,
    Working: 2,
    Closing: 3,
    "New client": 4,
    Lost: 0,
  }
  return stageMap[stage] ?? 0
}

// Progress indicator component
interface OwnerProgressIndicatorProps {
  currentStep: number
  variant?: "default" | "mini"
}

export function OwnerProgressIndicator({ currentStep, variant = "default" }: OwnerProgressIndicatorProps) {
  const steps = ["Initial Contact", "Documentation", "Agreement", "Onboarded"]

  if (variant === "mini") {
    return (
      <div className="flex items-center gap-0.5">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              index < currentStep ? "bg-emerald-500" : index === currentStep ? "bg-emerald-300" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center flex-1">
          <div className="flex items-center w-full">
            {/* Line before */}
            {index > 0 && <div className={`flex-1 h-0.5 ${index <= currentStep ? "bg-emerald-500" : "bg-gray-200"}`} />}

            {/* Circle */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                index < currentStep
                  ? "bg-emerald-500 text-white"
                  : index === currentStep
                    ? "bg-emerald-500 text-white ring-2 ring-emerald-200"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentStep ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </div>

            {/* Line after */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 ${index < currentStep ? "bg-emerald-500" : "bg-gray-200"}`} />
            )}
          </div>

          {/* Label */}
          <span
            className={`text-[10px] mt-1 text-center ${
              index <= currentStep ? "text-emerald-700 font-medium" : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}
