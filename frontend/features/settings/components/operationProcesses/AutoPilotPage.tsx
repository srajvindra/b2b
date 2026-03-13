"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, X, Shield } from "lucide-react"
import { useState } from "react"

const autopilotTemplates = [
  {
    id: "lease-renewal",
    label: "Lease Renewal",
    iconBg: "bg-blue-100",
    iconEmoji: "📄",
  },
  {
    id: "delinquency",
    label: "Delinquency",
    iconBg: "bg-emerald-100",
    iconEmoji: "💵",
  },
  {
    id: "move-in",
    label: "Move In",
    iconBg: "bg-purple-100",
    iconEmoji: "🏠",
  },
  {
    id: "move-out",
    label: "Move Out",
    iconBg: "bg-amber-100",
    iconEmoji: "🏢",
  },
]

interface ConditionRow {
  id: number
  field: string
  operator: string
  value: string
}

const fieldOptions = [
  { value: "active-processes", label: "Active Processes" },
  { value: "delinquent-rent", label: "Delinquent Rent" },
  { value: "occupancy", label: "Occupancy" },
  { value: "amount-receivable", label: "Amount Receivable" },
  { value: "current-rent", label: "Current Rent" },
  { value: "market-rent", label: "Market Rent" },
  { value: "beds", label: "Beds" },
  { value: "baths", label: "Baths" },
  { value: "square-feet", label: "Square Feet" },
  { value: "estimated-rent", label: "Estimated Rent" },
  { value: "lease-start-date", label: "Lease Start Date" },
  { value: "lease-end-date", label: "Lease End Date" },
  { value: "current-lease-move-in-date", label: "Current Lease Move In Date" },
  { value: "current-lease-move-out-date", label: "Current Lease Move Out Date" },
]

const operatorOptions = [
  { value: "is-set", label: "is set" },
  { value: "is-empty", label: "is empty" },
  { value: "is-equal-to", label: "is equal to" },
  { value: "is-not-equal-to", label: "is not equal to" },
  { value: "is-greater-than", label: "is greater than" },
  { value: "is-less-than", label: "is less than" },
  { value: "includes", label: "includes" },
  { value: "does-not-include", label: "does not include" },
]

const processValueOptions = [
  { value: "eviction-process", label: "Eviction Process" },
  { value: "late-rent-process", label: "Late Rent Process" },
  { value: "move-out-process", label: "Move Out Process" },
]

const stageOptions = [
  { value: "late-rent", label: "Late Rent" },
  { value: "notice-sent", label: "Notice Sent" },
  { value: "collections", label: "Collections" },
]

function AutopilotRuleDialogContent() {
  const [scheduleFrequency, setScheduleFrequency] = useState("month")
  const [conditions, setConditions] = useState<ConditionRow[]>([
    { id: 1, field: "active-processes", operator: "does-not-include", value: "eviction-process" },
    { id: 2, field: "delinquent-rent", operator: "is-greater-than", value: "1000" },
  ])

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { id: Date.now(), field: "", operator: "", value: "" },
    ])
  }

  const removeCondition = (id: number) => {
    setConditions((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCondition = (id: number, key: keyof ConditionRow, val: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: val } : c)),
    )
  }

  const needsValueInput = (op: string) =>
    !["is-set", "is-empty"].includes(op)

  const isProcessField = (field: string) => field === "active-processes"

  return (
    <DialogContent className="max-w-[90vw] w-full xl:max-w-3xl p-0 gap-0 overflow-hidden">
      <div className="max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-8 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">Create Autopilot Rule</DialogTitle>
        </DialogHeader>

        {/* ── Schedule section ── */}
        <div className="border-b border-border bg-card px-8 pt-6 pb-6 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Start this process every
            </span>
            <div className="inline-flex rounded-full border border-border bg-muted p-0.5">
              {(["month", "week", "day"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setScheduleFrequency(freq)}
                  className={`px-5 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                    scheduleFrequency === freq
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {scheduleFrequency === "month" && (
              <div className="flex items-center gap-6">
                <Label className="w-28 shrink-0 text-sm text-muted-foreground">On day:</Label>
                <Input
                  className="w-44"
                  type="number"
                  min={1}
                  max={31}
                  placeholder="8"
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10)
                    if (num > 31) e.target.value = "31"
                    if (num < 1) e.target.value = "1"
                  }}
                />
              </div>
            )}

            {scheduleFrequency === "week" && (
              <div className="flex items-center gap-6">
                <Label className="w-28 shrink-0 text-sm text-muted-foreground">On:</Label>
                <Select defaultValue="monday">
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <SelectItem key={day.toLowerCase()} value={day.toLowerCase()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-start gap-6">
              <Label className="w-28 shrink-0 text-sm text-muted-foreground pt-2.5">At this time:</Label>
              <div className="flex items-start gap-4 flex-1">
                <Input className="w-44 shrink-0" placeholder="10 AM" />
                <p className="text-xs text-muted-foreground pt-2.5 leading-relaxed">
                  If a lot of processes are starting automatically at this time, some will be created after the specified time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <Label className="w-28 shrink-0 text-sm text-muted-foreground pt-2.5">In this stage:</Label>
              <div className="flex items-start gap-4 flex-1">
                <Select defaultValue="late-rent">
                  <SelectTrigger className="w-44 shrink-0 text-orange-500 font-medium">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stageOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pt-2.5 leading-relaxed">
                  This will override the default starting stage in your General Settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Green dot separator ── */}
        {/* <div className="flex justify-center -my-2.5 relative z-10">
          <div className="h-5 w-5 rounded-full bg-emerald-500 border-[3px] border-background" />
        </div> */}

        {/* ── Conditions section ── */}
        <div className="px-8 pt-5 pb-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Conditions</p>
              <p className="text-xs text-muted-foreground">
                Which Units should this process be started for?
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-foreground">For each</span>
              <span className="inline-flex items-center rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground">
                Property
              </span>
              <span className="text-foreground">that matches the following conditions:</span>
            </div>

            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className="flex items-center gap-2"
                >
                  <div className="grid flex-1 grid-cols-3 gap-3 rounded-lg border border-border bg-card p-3">
                    <Select
                      value={condition.field}
                      onValueChange={(v) => updateCondition(condition.id, "field", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldOptions.map((f) => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(v) => updateCondition(condition.id, "operator", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {needsValueInput(condition.operator) ? (
                      isProcessField(condition.field) ? (
                        <Select
                          value={condition.value}
                          onValueChange={(v) => updateCondition(condition.id, "value", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {processValueOptions.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={condition.value ? `$ ${condition.value}` : ""}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9.]/g, "")
                            updateCondition(condition.id, "value", raw)
                          }}
                          placeholder="$ 0"
                        />
                      )
                    ) : (
                      <div />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCondition(condition.id)}
                    className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label={`Remove condition ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {conditions.length === 0 && (
                <div className="rounded-lg border border-dashed border-border bg-card p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No conditions added yet. Click below to add one.
                  </p>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addCondition}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Condition
            </Button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            If the Unit or Property already has a process in an{" "}
            <span className="font-semibold text-primary underline underline-offset-2">Active</span>{" "}
            stage in this process type, LeadSimple won&apos;t create a new one.
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-col items-center gap-2 pb-8 pt-2">
          <Button type="button" size="lg" className="px-10 font-semibold">
            Save
          </Button>
          {/* <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
          >
            Cancel
          </button> */}
        </div>
      </div>
    </DialogContent>
  )
}

export function AutoPilotPage() {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Autopilot Rules</h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Automatically start this process to save loads of time and tedious data entry!{" "}
            <button
              type="button"
              className="underline underline-offset-4 text-primary hover:text-primary/80 font-medium"
            >
              Click here
            </button>{" "}
            to learn more about when you should automatically start a process, and how.
          </p>
        </div>
      </div>

      <div className="border border-dashed border-border rounded-xl p-6 mb-8 bg-muted/40">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Want the best results from Autopilot? Use one of our proven Autopilot Rule templates:
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {autopilotTemplates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-lg ${template.iconBg}`}
                >
                  <span aria-hidden="true">{template.iconEmoji}</span>
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Automatically start
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {template.label}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full justify-center text-xs font-medium"
              >
                <Plus className="mr-1.5 h-3 w-3" />
                Use this Template
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Or create a rule from scratch
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Create Blank Rule
              </Button>
            </DialogTrigger>
            <AutopilotRuleDialogContent />
          </Dialog>
        </div>
      </div>
    </div>
  )
}