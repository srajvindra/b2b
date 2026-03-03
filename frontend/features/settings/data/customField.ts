import type { CustomField } from "../types"

export const initialCustomFields: CustomField[] = [
  {
    id: 1,
    label: "Existing Tenant Moving Out?",
    dataType: "Multiple Choice",
    defaultValues: ["Yes", "No"],
    processTypes: ["2 Property Onboarding Process"],
  },
  {
    id: 2,
    label: "Existing Owner or New Owner?",
    dataType: "Multiple Choice",
    defaultValues: ["New Owner", "Existing Owner"],
    processTypes: ["2 Property Onboarding Process"],
  },
  {
    id: 3,
    label: "Walkthrough Scheduled?",
    dataType: "Date",
    defaultValues: [],
    processTypes: ["2 Property Onboarding Process"],
  },
  {
    id: 4,
    label: "Any Information Missing?",
    dataType: "Multiple Choice",
    defaultValues: ["Yes", "No"],
    processTypes: ["2 Property Onboarding Process", "Owner Onboarding Process"],
  },
  {
    id: 5,
    label: "Move-in Date Confirmed?",
    dataType: "Date",
    defaultValues: [],
    processTypes: ["Tenant Onboarding Process"],
  },
  {
    id: 6,
    label: "Lease Term Length",
    dataType: "Multiple Choice",
    defaultValues: ["6 Months", "12 Months", "24 Months", "Month-to-Month"],
    processTypes: ["Lease Renewal Process", "New Lease Process"],
  },
  {
    id: 7,
    label: "Pet Policy Acknowledgement",
    dataType: "Multiple Choice",
    defaultValues: ["Yes", "No", "N/A"],
    processTypes: ["Tenant Onboarding Process", "Lease Renewal Process"],
  },
  {
    id: 8,
    label: "Preferred Contact Time",
    dataType: "Time",
    defaultValues: [],
    processTypes: ["Owner Onboarding Process", "Tenant Onboarding Process"],
  },
  {
    id: 9,
    label: "Additional Notes",
    dataType: "Text",
    defaultValues: [],
    processTypes: ["2 Property Onboarding Process", "Owner Onboarding Process", "Tenant Onboarding Process"],
  },
  {
    id: 10,
    label: "Property Condition Rating",
    dataType: "Multiple Choice",
    defaultValues: ["Excellent", "Good", "Fair", "Poor"],
    processTypes: ["Property Inspection Process"],
  },
]

export const availableProcessTypes = [
  "2 Property Onboarding Process",
  "Owner Onboarding Process",
  "Tenant Onboarding Process",
  "Lease Renewal Process",
  "New Lease Process",
  "Property Inspection Process",
  "Maintenance Request Process",
  "Move-Out Process",
]
