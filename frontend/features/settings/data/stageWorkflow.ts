import type { WorkflowStep } from "../types"

export const availableFieldTags = [
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
] as const

export const initialWorkflowSteps: WorkflowStep[] = [
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
