"use client"

import { useState, useMemo } from "react"
import { getMockKPIData } from "../data/mockKPIs"
import type { KPIData } from "../types"

export type KPIViewMode = "table" | "chart"

export function useKPIs() {
  const [userRole] = useState<"associate" | "manager" | "leader">("manager")
  const [kpiView, setKpiView] = useState<KPIViewMode>("table")
  const [expandedSection, setExpandedSection] = useState<string | null>("sales")
  const [kpisSearchQuery, setKpisSearchQuery] = useState("")

  const kpiData = useMemo(() => getMockKPIData(userRole), [userRole])

  return {
    kpiData,
    kpiView,
    setKpiView,
    expandedSection,
    setExpandedSection,
    kpisSearchQuery,
    setKpisSearchQuery,
    userRole,
  }
}
