"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface TabItem {
  value: string
  label: string
  content: React.ReactNode
}

export interface LeadTabsProps {
  defaultValue?: string
  tabs: TabItem[]
}

export function LeadTabs({ defaultValue = "overview", tabs }: LeadTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value} className="mt-4">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
