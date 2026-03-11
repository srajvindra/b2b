"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Home, Landmark, Handshake, ChevronRight, ExternalLink, MoreHorizontal } from "lucide-react"
import type { OwnerProperty } from "../types"

export interface OwnerPropertyTabProps {
  properties: OwnerProperty[]
  getPropertyStatusBadge: (status: OwnerProperty["status"]) => string
  onNavigateToProperty?: (propertyName: string) => void
}

export function OwnerPropertyTab({
  properties,
  getPropertyStatusBadge,
  onNavigateToProperty,
}: OwnerPropertyTabProps) {
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(() => {
    const ids = new Set<string>()
    for (const prop of properties) {
      const oType = prop.ownershipType || "Personal"
      if (oType === "Personal" || !prop.ownershipEntity) {
        ids.add(`personal-${prop.id}`)
      } else {
        ids.add(prop.ownershipEntity)
      }
    }
    return ids
  })
  const [expandedOwnershipTypes, setExpandedOwnershipTypes] = useState<Set<string>>(new Set())

  const toggleEntity = (entityId: string) => {
    setExpandedEntities((prev) => {
      const next = new Set(prev)
      if (next.has(entityId)) next.delete(entityId)
      else next.add(entityId)
      return next
    })
  }

  const toggleProperty = (key: string) => {
    setExpandedOwnershipTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const entities: { entityName: string; entityId: string; ownershipType: string; properties: OwnerProperty[] }[] = []
  for (const prop of properties) {
    const oType = prop.ownershipType || "Personal"
    const entityName = prop.ownershipEntity || ""
    const entityId = oType === "Personal" ? `personal-${prop.id}` : prop.ownershipEntity || `personal-${prop.id}`

    if (oType === "Personal" || !prop.ownershipEntity) {
      entities.push({ entityName: prop.address, entityId: `personal-${prop.id}`, ownershipType: "Personal", properties: [prop] })
    } else {
      const existing = entities.find((e) => e.entityId === entityId)
      if (existing) {
        existing.properties.push(prop)
      } else {
        entities.push({ entityName, entityId, ownershipType: oType, properties: [prop] })
      }
    }
  }

  const getOwnershipIcon = (type: string) => {
    switch (type) {
      case "LLC":
        return <Landmark className="h-4 w-4 text-blue-600" />
      case "Partnership":
        return <Handshake className="h-4 w-4 text-violet-600" />
      default:
        return <Home className="h-4 w-4 text-amber-600" />
    }
  }

  const getOwnershipColor = (type: string) => {
    switch (type) {
      case "LLC":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-100 text-blue-700 border-blue-200" }
      case "Partnership":
        return { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", badge: "bg-violet-100 text-violet-700 border-violet-200" }
      default:
        return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-100 text-amber-700 border-amber-200" }
    }
  }

  return (
    <div className="mt-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-teal-600" />
              Properties Owned ({properties.length})
            </h3>
          </div>

          <div className="space-y-3">
            {entities.map((entity, entityIndex) => {
              const colors = getOwnershipColor(entity.ownershipType)
              const isExpanded = expandedEntities.has(entity.entityId)

              return (
                <div key={entity.entityId} className={`rounded-lg border ${colors.border} overflow-hidden`}>
                  <button
                    type="button"
                    onClick={() => toggleEntity(entity.entityId)}
                    className={`flex items-center gap-2.5 px-4 py-3 w-full text-left ${colors.bg} hover:brightness-95 transition-all`}
                  >
                    <ChevronRight
                      className={`h-4 w-4 ${colors.text} shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    />
                    {getOwnershipIcon(entity.ownershipType)}
                    <span className={`font-semibold text-sm ${colors.text}`}>
                      {entityIndex + 1}. {entity.entityName}
                    </span>
                    {entity.ownershipType !== "Personal" && (
                      <Badge variant="outline" className={`text-xs ml-1 ${colors.badge}`}>
                        {entity.properties.length} {entity.properties.length === 1 ? "Property" : "Properties"}
                      </Badge>
                    )}
                  </button>

                  <div
                    className={`transition-all duration-200 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="divide-y divide-border/40">
                      {entity.properties.map((property) => {
                        const isPropertyExpanded = expandedOwnershipTypes.has(`prop-${property.id}`)
                        return (
                          <div key={property.id} className="bg-white">
                            {entity.ownershipType !== "Personal" && (
                              <button
                                type="button"
                                onClick={() => toggleProperty(`prop-${property.id}`)}
                                className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-gray-50 transition-colors"
                              >
                                <ChevronRight
                                  className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                                    isPropertyExpanded ? "rotate-90" : ""
                                  }`}
                                />
                                <Home className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <span className="text-sm font-medium text-foreground">{property.name}</span>
                                <span className="text-xs text-muted-foreground ml-1">{property.address}</span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs shrink-0 ml-auto ${getPropertyStatusBadge(property.status)}`}
                                >
                                  {property.status}
                                </Badge>
                              </button>
                            )}

                            <div
                              className={`transition-all duration-200 ease-in-out overflow-hidden ${
                                entity.ownershipType === "Personal" || isPropertyExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="border-t border-border/40 bg-white">
                                <div className="flex gap-0">
                                  <div className="w-72 shrink-0 border-r border-border/40">
                                    <div className="h-44 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                      <Building2 className="h-12 w-12 text-slate-400" />
                                    </div>
                                    <div className="p-3 space-y-1.5">
                                      <button
                                        type="button"
                                        className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline w-full"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Matterport Scan
                                      </button>
                                      <button
                                        type="button"
                                        className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline w-full"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Rental Comps
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex-1 p-4">
                                    <div className="flex items-start justify-between mb-1">
                                      <div>
                                        <h4 className="text-lg font-semibold text-slate-800">{property.name}</h4>
                                        <p className="text-sm text-muted-foreground">{property.address}</p>
                                        {property.units > 1 && (
                                          <p className="text-sm text-muted-foreground mt-0.5">{property.units} Units</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={`text-xs ${getPropertyStatusBadge(property.status)}`}>
                                          {property.status}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1.5">
                                        <Home className="h-3.5 w-3.5" />
                                        <span>{property.type}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span>Available Now</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-3 px-4 py-2.5 rounded-lg border border-amber-200 bg-amber-50/60">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm text-amber-800">Monthly Rent:</span>
                                        <span className="text-sm font-bold text-amber-900">
                                          ${property.monthlyRent.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm text-amber-800">Security Deposit:</span>
                                        <span className="text-sm font-bold text-amber-900">
                                          ${property.monthlyRent.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <p className="text-sm font-medium text-slate-700 mb-2">Amenities</p>
                                      <div className="flex flex-wrap gap-2">
                                        {["Pool", "Gym", "Parking", "Laundry"].map((a) => (
                                          <Badge key={a} variant="outline" className="text-xs font-normal">
                                            {a}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="flex items-center gap-1.5 mt-4 text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors"
                                      onClick={() => onNavigateToProperty?.(property.name)}
                                    >
                                      View Property Details
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
