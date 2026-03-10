"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useMemo } from "react"
import { ArrowLeft, Construction } from "lucide-react"
import { PortfolioTab } from "@/features/settings/components/PortfolioTab"
import { GeneralSettingsTab } from "@/features/settings/components/GeneralSettingsTab"
import ManageProcessPage from "@/features/settings/components/ManageProcessPage"
import { TemplateManagementPage } from "@/features/settings/components/TemplateManagementPage"
import { CustomFieldsPage } from "@/features/settings/components/CustomFieldPage"
import { initialProcessInstances } from "@/features/operations/data/processes"

interface TabItem {
    id: string
    label: string
    underProgress?: boolean
}

const tabs: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "general", label: "General" },
    { id: "users-roles", label: "Users, Roles & Assignment" },
    { id: "autopilot-rules", label: "Autopilot Rules", underProgress: true },
    { id: "stages-workflows", label: "Stages & Workflows" },
    { id: "email-templates", label: "Email Templates" },
    { id: "text-templates", label: "Text Messages Templates" },
    { id: "custom-fields", label: "Custom Fields" },
    { id: "version-history", label: "Version History", underProgress: true },
]

export function OperationWorkflowPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const processId = searchParams.get("processId")
    const nameParam = searchParams.get("name")

    const process = useMemo(
        () => initialProcessInstances.find((p) => p.id === processId) ?? null,
        [processId],
    )

    const processName = process?.processType ?? nameParam ?? "Property Onboarding Process"
    const [activeTab, setActiveTab] = useState("overview")

    const currentTab = tabs.find((t) => t.id === activeTab)!

    return (
        <div className="-mx-4 -my-6 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
            {/* Sidebar */}
            <nav className="w-60 shrink-0 bg-card border-r border-border flex flex-col overflow-hidden">
                <div className="px-5 py-5 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="p-1.5 hover:bg-accent rounded-md transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div className="min-w-0">
                            <span className="text-base font-semibold text-foreground leading-snug">
                                {processName}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="py-2 flex-1 overflow-hidden ">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer ${
                                    isActive
                                        ? "text-foreground font-medium bg-accent"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </nav>

            {/* Right column */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <div className="flex items-center justify-end px-4 py-2 shrink-0 bg-background" />

                <main className="flex-1 overflow-auto px-6 pb-6">
                    {currentTab.underProgress ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="h-16 w-16 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center mb-4">
                                <Construction className="h-8 w-8 text-warning" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">{currentTab.label} – Coming Soon</h2>
                        </div>
                    ) : activeTab === "overview" ? (
                        <div className="max-w-6xl mx-auto">
                            <div className="w-full aspect-video bg-blue-100 border border-border rounded-lg mb-8" />
                            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                <p>
                                    Property Onboarding is the second major process in property management, where you will collect all
                                    needed documents and property information, add the property to your pm software, and onboard
                                    existing tenants.
                                </p>
                                <p>
                                    Watch the video above to get a quick overview of this template, but remember, it is completely
                                    customizable to fit your property onboarding process!
                                </p>
                            </div>
                        </div>
                    ) : activeTab === "general" ? (
                        <div className="max-w-6xl mx-auto">
                            <GeneralSettingsTab />
                        </div>
                    ) : activeTab === "users-roles" ? (
                        <div className="max-w-6xl mx-auto">
                            <PortfolioTab />
                        </div>
                    ) : activeTab === "stages-workflows" ? (
                        <div className="max-w-6xl mx-auto">
                            <ManageProcessPage />
                        </div>
                    ) : activeTab === "email-templates" ? (
                        <div className="max-w-6xl mx-auto">
                            <TemplateManagementPage key="email" defaultTab="email" hideTabs hideHeader />
                        </div>
                    ) : activeTab === "text-templates" ? (
                        <div className="max-w-6xl mx-auto">
                            <TemplateManagementPage key="sms" defaultTab="sms" hideTabs hideHeader />
                        </div>
                    ) : activeTab === "custom-fields" ? (
                        <div className="max-w-6xl mx-auto">
                            <CustomFieldsPage />
                        </div>
                    ) : activeTab === "version-history" ? (
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-1">{currentTab.label}</h2>
                            <p className="text-sm text-muted-foreground">
                                Manage {currentTab.label.toLowerCase()} settings for this process.
                            </p>
                        </div>
                    ) : null}
                </main>
            </div>
        </div>
    )
}
