"use client"

export function LeadAlerts() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded border bg-amber-50 p-4"><h3 className="font-medium">Pending Communications</h3></div>
      <div className="rounded border bg-amber-50 p-4"><h3 className="font-medium">Pending Actions</h3></div>
      <div className="rounded border bg-amber-50 p-4"><h3 className="font-medium">Task Overview</h3></div>
    </div>
  )
}
