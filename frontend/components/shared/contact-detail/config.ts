import type { Tab, QuickAction, Stage, Alert } from "./types"

// Shared type re‑exports so callers can import from a single place.
export type { Tab, QuickAction, Stage, Alert } from "./types"

// Example tab / action configs.
// These are intentionally minimal; real apps should provide their own
// data structures per screen while reusing the same shapes.

export const OWNER_DEFAULT_STAGES: Stage[] = [
  { id: "new-lead", label: "New lead" },
  { id: "attempting-contact", label: "Attempting to contact" },
  { id: "scheduled-intro-call", label: "Scheduled Intro call" },
  { id: "working", label: "Working" },
  { id: "under-review", label: "Under review" },
  { id: "closing", label: "Closing" },
  { id: "new-client", label: "New client" },
]

export const OWNER_ALERT_KEYS: Alert[] = [
  { id: "pending-comms", title: "Pending Communications", tone: "warning" },
  { id: "pending-actions", title: "Pending Actions", tone: "warning" },
  { id: "tasks", title: "Tasks", tone: "warning" },
]

export const EMPTY_TABS: Tab[] = []

export const EMPTY_QUICK_ACTIONS: QuickAction[] = []

