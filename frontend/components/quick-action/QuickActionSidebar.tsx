"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Lightbulb, Send } from "lucide-react"
import type { MouseEventHandler, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const prompts = aiSuggestedPrompts?.length ? DEFAULT_AI_PROMPTS : DEFAULT_AI_PROMPTS

  const rootClassName =
    "w-64 border-l border-border bg-muted/10 flex flex-col h-full" +
    (className ? ` ${className}` : "")

  const handleAiSend = () => {
    if (!aiQuery.trim()) return
    // Placeholder: integrate with AI service later
    console.log("AI Assistant query:", aiQuery.trim())
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
              <div className="flex flex-col divide-y">
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

      {showAiAssistant && (
        <div className="flex-shrink-0 border-t-2 border-gray-300 p-4 bg-background/50">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            AI Assistant
          </h3>
          <div className="flex gap-2 mb-3">
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
              className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90"
              onClick={handleAiSend}
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="text-left text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md px-2 py-1.5 transition-colors"
                onClick={() => handleSuggestedPrompt(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {footer ? <div className="p-3 border-t border-border">{footer}</div> : null}
    </aside>
  )
}

