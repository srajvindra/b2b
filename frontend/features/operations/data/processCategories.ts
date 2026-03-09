import type { ProcessType } from "../types"

export interface ProcessCategoryConfig {
  id: string
  name: string
  matcher: (p: ProcessType) => boolean
}

export const processCategoryConfigs: ProcessCategoryConfig[] = [
  {
    id: "onboarding",
    name: "Onboarding Processes",
    matcher: (p: ProcessType) => p.name.toLowerCase().includes("onboarding"),
  },
  {
    id: "lease-renewal",
    name: "Lease Renewal Processes",
    matcher: (p: ProcessType) => p.name.toLowerCase().includes("lease renewal"),
  },
  {
    id: "termination",
    name: "Termination / Offboarding",
    matcher: (p: ProcessType) =>
      p.name.toLowerCase().includes("termination") || p.name.toLowerCase().includes("termination process"),
  },
  {
    id: "eviction",
    name: "Eviction / Delinquency",
    matcher: (p: ProcessType) =>
      p.name.toLowerCase().includes("eviction") || p.name.toLowerCase().includes("delinquency"),
  },
  {
    id: "accounting",
    name: "Accounting / Month End",
    matcher: (p: ProcessType) => p.name.toLowerCase().includes("accounting"),
  },
  {
    id: "people",
    name: "People / HR Processes",
    matcher: (p: ProcessType) =>
      p.name.toLowerCase().includes("employee") || p.name.toLowerCase().includes("hiring"),
  },
  {
    id: "make-ready",
    name: "Make Ready / Turns",
    matcher: (p: ProcessType) => p.name.toLowerCase().includes("make ready"),
  },
]
