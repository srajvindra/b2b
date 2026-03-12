"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Lightbulb, Send } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface QuickActionItem {
  label: string
  icon: LucideIcon
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

export interface QuickActionGroup {
  /**
   * Stable id for React keys, e.g. \"tasks\", \"reports\"
   */
  id: string
  /**
   * Optional group label shown above the actions
   * (e.g. \"Tasks\", \"Reports\"). Omit for a single ungrouped list.
   */
  title?: string
  actions: QuickActionItem[]
}

export interface QuickActionSidebarProps {
  /**
   * Main heading text. Defaults to \"Quick Actions\".
   */
  title?: string
  /**
   * Optional secondary label under the title
   * (e.g. \"Owners\", \"Tenants\", \"Dashboard\").
   */
  subtitle?: string
  /**
   * Grouped quick actions displayed in the sidebar.
   * Pass a single group when you do not need sections.
   */
  actions: QuickActionGroup[]
  /**
   * Optional extra content rendered below the actions list
   * (for future extension without changing layout).
   */
  footer?: ReactNode
  /**
   * Show the AI Assistant section below Quick Actions. Default true.
   */
  showAiAssistant?: boolean
  /**
   * Page-specific prompts for the AI Assistant. Falls back to default prompts when empty/undefined.
   */
  aiSuggestedPrompts?: string[]
  /**
   * Placeholder for the AI Assistant input.
   */
  aiPlaceholder?: string
  /**
   * Optional root className extension while preserving base layout.
   */
  className?: string
}

const DEFAULT_AI_PROMPTS = [
  "How do I add a new property?",
  "What's my current occupancy rate?",
  "Show me delinquent accounts",
]

export function QuickActionSidebar({
  title = "Quick Actions",
  subtitle,
  actions,
  footer,
  showAiAssistant = true,
  aiSuggestedPrompts,
  aiPlaceholder = "Ask...",
  className,
}: QuickActionSidebarProps) {
  const [aiQuery, setAiQuery] = useState("")
  const prompts = aiSuggestedPrompts?.length ? aiSuggestedPrompts : DEFAULT_AI_PROMPTS
  const [aiChatHistory, setAiChatHistory] = useState<
    Array<{ id: string; role: "user" | "assistant"; text: string; createdAt: number }>
  >([])

  const rootClassName =
    "w-64 border-l border-border bg-muted/10 flex flex-col h-full" +
    (className ? ` ${className}` : "")

  const truncatePrompt = (prompt: string) => {
    const s = prompt.trim()
    if (s.length <= 4) return s
    return `${s.slice(0, 4)}...`
  }

  const getDayKey = (ts: number) => {
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }

  const formatChatDate = (ts: number) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).formatToParts(new Date(ts))

    const month = parts.find((p) => p.type === "month")?.value ?? ""
    const day = parts.find((p) => p.type === "day")?.value ?? ""
    const year = parts.find((p) => p.type === "year")?.value ?? ""
    return `${month} ${day} ${year}`.trim()
  }

  const handleAiSend = () => {
    if (!aiQuery.trim()) return
    // Placeholder: integrate with AI service later
    console.log("AI Assistant query:", aiQuery.trim())
    const userText = aiQuery.trim()
    const now = Date.now()
    setAiChatHistory((prev) => [
      ...prev,
      { id: `${now}-u`, role: "user", text: userText, createdAt: now },
      { id: `${now}-a`, role: "assistant", text: "Thanks — AI responses will be wired up soon.", createdAt: now },
    ])
    setAiQuery("")
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setAiQuery(prompt)
  }

  return (
    <aside className={rootClassName}>
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-base text-gray-800">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Quick Actions (fixed-height pane) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
          <div className="flex flex-col bg-white rounded-md">
            {actions.map((group) => (
              <div key={group.id} className="flex flex-col">
                {group.title ? (
                  <>
                    <div className="shrink-0" aria-hidden />
                    <div className="flex w-full items-center gap-3 px-2 py-2.5 text-left">
                      <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                        {group.title}
                      </span>
                    </div>
                  </>
                ) : null}
                <div className="flex flex-col divide-y-1">
                  {group.actions.map((action) => {
                    const Icon = action.icon
                    const sharedClasses =
                      "flex w-full items-center gap-3 px-2 py-2.5 text-left transition-colors hover:bg-muted/50"

                    if (action.href) {
                      return (
                        <a
                          key={action.label}
                          href={action.href}
                          onClick={action.onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
                          className={sharedClasses}
                        >
                          <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{action.label}</span>
                        </a>
                      )
                    }

                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick as MouseEventHandler<HTMLButtonElement> | undefined}
                        className={sharedClasses}
                      >
                        <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant (fixed-height pane) */}
        {showAiAssistant && (
          <div className="flex-1 min-h-0 border-t-2 border-gray-300 bg-background/50 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
              {/* AI Chat History (top of AI section) */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                 
                </div>
                {aiChatHistory.length === 0 ? (
                  <div>
                    
                  </div>
                ) : (
                  <div className="space-y-2">
                    {aiChatHistory.map((m, idx) => {
                      const prev = aiChatHistory[idx - 1]
                      const prevTs = typeof prev?.createdAt === "number" ? prev.createdAt : Date.now()
                      const safeTs = typeof m.createdAt === "number" ? m.createdAt : prevTs
                      const showDayDivider = idx === 0 || getDayKey(prevTs) !== getDayKey(safeTs)
                      return (
                        <div key={m.id} className="space-y-2">
                          {showDayDivider ? (
                            <div className="flex items-center gap-3 py-1">
                              <div className="h-px bg-border flex-1" />
                              <span className="text-[10px] font-medium text-muted-foreground">
                                {formatChatDate(safeTs)}
                              </span>
                              <div className="h-px bg-border flex-1" />
                            </div>
                          ) : null}
                          <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`relative text-xs rounded-lg px-3 py-2 border max-w-[85%] ${
                                m.role === "user"
                                  ? "bg-blue-50 border-blue-100 text-slate-800 after:content-[''] after:absolute after:top-3 after:right-[-6px] after:w-0 after:h-0 after:border-t-[6px] after:border-b-[6px] after:border-l-[6px] after:border-t-transparent after:border-b-transparent after:border-l-blue-50"
                                  : "bg-white border-border text-slate-700 after:content-[''] after:absolute after:top-3 after:left-[-6px] after:w-0 after:h-0 after:border-t-[6px] after:border-b-[6px] after:border-r-[6px] after:border-t-transparent after:border-b-transparent after:border-r-white"
                              }`}
                            >
                              {m.text}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Keep heading + input placement unchanged (below) */}
            <div className="p-4 pt-0 flex flex-col gap-2">
              <TooltipProvider delayDuration={150}>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {prompts.map((prompt) => (
                    <Tooltip key={prompt}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="shrink-0 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                          onClick={() => handleSuggestedPrompt(prompt)}
                        >
                          {truncatePrompt(prompt)}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px]">
                        <p className="text-xs">{prompt}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask..."
                  // placeholder={aiPlaceholder}
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
                  className="flex-1 h-9 text-sm"
                />
                <Button
                  type="button"
                  size="icon"
                  // className="h-9 w-9 shrink-0 bg-blue-500 hover:bg-blue-600"
                  className={`p-1.5 rounded transition-colors flex-shrink-0 ${
                    aiQuery.trim()
                      ? "bg-blue-700 hover:bg-blue-800 text-white"
                      : "bg-blue-100 text-blue-400 hover:bg-blue-200"
                  }`}
                  onClick={handleAiSend}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                AI Assistant
              </h3>
            </div>
          </div>
        )}
      </div>

      {footer ? <div className="p-3 border-t border-border">{footer}</div> : null}
    </aside>
  )
}

