import type { KPIData } from "../types"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function generateKPIData(roleMultiplier: number = 1): KPIData {
  const base = roleMultiplier
  return {
    sales: {
      newLeads: 24 * base,
      conversionRate: 32,
      newUnitAdditions: 8 * base,
      avgResponseTime: "2.4 hrs",
      history: MONTHS.map((month, i) => ({
        month,
        leads: Math.floor((20 + Math.random() * 15) * base),
        conversion: Math.floor(25 + Math.random() * 15),
      })),
    },
    leasing: {
      newLeads: 45 * base,
      conversionRate: 28,
      newApplications: 18 * base,
      newLeasesSigned: 12 * base,
      avgDaysOnMarket: 21,
      avgResponseTime: "1.8 hrs",
      history: MONTHS.map((month) => ({
        month,
        leads: Math.floor((35 + Math.random() * 20) * base),
        leases: Math.floor((8 + Math.random() * 8) * base),
      })),
    },
    operations: {
      totalUnits: 156 * base,
      churnRate: 8.5,
      occupancyRate: 94.2,
      rentCollections: 98.1,
      leasesRenewed: 15 * base,
      openComplaints: 7 * base,
      openTerminations: 3 * base,
      newWorkOrders: 23 * base,
      completedWorkOrders: 19 * base,
      avgResponseTime: "4.2 hrs",
      history: MONTHS.map((month) => ({
        month,
        occupancy: Math.floor(90 + Math.random() * 8),
        collections: Math.floor(95 + Math.random() * 4),
      })),
    },
    maintenance: {
      inspectionSpeed: "1.2 days",
      makeReadySpeed: "4.5 days",
      makeReadyConversionRate: 87,
      avgResponseTime: "3.1 hrs",
      history: MONTHS.map((month) => ({
        month,
        inspectionDays: Number((1 + Math.random() * 0.5).toFixed(1)),
        makeReadyDays: Number((4 + Math.random() * 1.5).toFixed(1)),
      })),
    },
  }
}

export function getMockKPIData(userRole: "associate" | "manager" | "leader" = "manager"): KPIData {
  const baseMultiplier = userRole === "leader" ? 5 : userRole === "manager" ? 2 : 1
  return generateKPIData(baseMultiplier)
}
