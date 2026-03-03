"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import type { ContactDetailViewProps, AlertTone } from "./types"

const toneClasses: Record<AlertTone, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
}

export function ContactDetailView({
  name,
  email,
  phone,
  source,
  assignee,
  stages,
  currentStage,
  alerts,
  tabs,
  defaultTab,
  quickActions,
  backLabel = "Back",
  backHref,
}: ContactDetailViewProps) {
  const activeTab = defaultTab ?? tabs[0]?.id

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header row */}
      <div className="flex items-start justify-between border-b px-6 pt-4 pb-3">
        <div className="space-y-2">
          {backHref && (
            <Link href={backHref} className="inline-flex items-center text-xs text-muted-foreground mb-1">
              <ArrowLeft className="mr-1 h-3 w-3" />
              {backLabel}
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{name}</h1>
            <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{email}</span>
              <span>{phone}</span>
              {source && <span>Source: {source}</span>}
              {assignee && <span>Assignee: {assignee}</span>}
            </div>
          </div>
          {stages && stages.length > 0 && (
            <div className="mt-3 flex gap-1">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`h-2 flex-1 rounded ${
                    currentStage === stage.id ? "bg-primary" : "bg-muted"
                  }`}
                  style={stage.color ? { backgroundColor: stage.color } : undefined}
                  title={stage.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alert banners */}
      {alerts && alerts.length > 0 && (
        <div className="grid grid-cols-1 gap-3 border-b bg-muted/40 px-6 py-3 md:grid-cols-3">
          {alerts.map((alert) => {
            const tone = alert.tone ?? "warning"
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${toneClasses[tone]}`}
              >
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <div>
                  <div className="font-medium">{alert.title}</div>
                  {alert.description && (
                    <p className="mt-0.5 text-xs opacity-90">{alert.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Main content + right panel */}
      <div className="flex flex-1 gap-4 overflow-hidden px-6 py-4">
        {/* Tabs + body */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Tabs defaultValue={activeTab} className="flex min-h-0 flex-1 flex-col">
            <TabsList className="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent px-3 py-1 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <span>{tab.label}</span>
                  {typeof tab.badgeCount === "number" && tab.badgeCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                      {tab.badgeCount}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-4 flex-1 overflow-auto"
              >
                {tab.render ? tab.render() : tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Quick actions column */}
        {quickActions && quickActions.length > 0 && (
          <aside className="w-64 shrink-0">
            <Card className="shadow-sm">
              <CardContent className="py-4">
                <h3 className="mb-3 text-sm font-semibold">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  {quickActions.map((qa) => {
                    const content = (
                      <Button
                        key={qa.id}
                        variant="outline"
                        size="sm"
                        className="flex w-full justify-start"
                        onClick={qa.onClick}
                      >
                        {qa.icon && <span className="mr-2 inline-flex h-4 w-4">{qa.icon}</span>}
                        <span className="truncate">{qa.label}</span>
                      </Button>
                    )
                    return qa.href ? (
                      <Link key={qa.id} href={qa.href} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>
        )}
      </div>
    </div>
  )
}

