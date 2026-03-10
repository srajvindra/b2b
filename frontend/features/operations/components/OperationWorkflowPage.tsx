"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Construction, Settings, ChevronDown } from "lucide-react"

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
    const processName = searchParams.get("name") ?? "Property Onboarding Process"
    const [activeTab, setActiveTab] = useState("overview")

    const currentTab = tabs.find((t) => t.id === activeTab)!

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header - sticky */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-gray-400" />
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900 leading-tight">
                                {processName}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 pl-8">Settings</p>
            </div>

            {/* Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Vertical Tabs - sticky */}
                <nav className="w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="py-2">
                        {tabs.map((tab, index) => {
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-5 py-3 text-[13px] transition-colors ${
                                        isActive
                                            ? "text-gray-900 font-medium bg-gray-100"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    } ${index === 0 ? "border-b border-gray-200" : ""}`}
                                >
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </nav>

                {/* Content Area - scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                    {currentTab.underProgress ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                                <Construction className="h-8 w-8 text-amber-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentTab.label} – Coming Soon</h2>
                        </div>
                    ) : activeTab === "overview" ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="w-full aspect-video bg-blue-100 border border-gray-200 rounded-lg mb-8" />

                            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
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
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">{currentTab.label}</h2>
                            <p className="text-sm text-gray-500">
                                Manage {currentTab.label.toLowerCase()} settings for this process.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
