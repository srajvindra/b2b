"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Home } from "lucide-react"
import type { TenantPropertyInfo } from "../types"

export interface TenantUnitInformationTabProps {
  propertyInfo: TenantPropertyInfo
  onNavigateToUnitDetail?: (unitId: string, propertyId: string) => void
}

export function TenantUnitInformationTab({
  propertyInfo,
  onNavigateToUnitDetail,
}: TenantUnitInformationTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Home className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold text-slate-800">Property Details</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-muted-foreground text-xs">Property Name</Label>
              <p className="font-medium">{propertyInfo.name}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground text-xs">Address</Label>
              <p className="font-medium">{propertyInfo.address}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Type</Label>
              <p className="font-medium">{propertyInfo.type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Bedrooms</Label>
              <p className="font-medium">{propertyInfo.bedrooms}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Bathrooms</Label>
              <p className="font-medium">{propertyInfo.bathrooms}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Square Feet</Label>
              <p className="font-medium">{propertyInfo.sqft} sq ft</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Year Built</Label>
              <p className="font-medium">{propertyInfo.yearBuilt}</p>
            </div>
          </div>
          {onNavigateToUnitDetail && (
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                className="text-teal-600 border-teal-200 hover:bg-teal-50 bg-transparent"
                onClick={() => onNavigateToUnitDetail("unit-204", "prop-1")}
              >
                View Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
