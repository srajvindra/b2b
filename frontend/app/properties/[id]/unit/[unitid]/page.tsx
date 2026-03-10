"use client"

import UnitDetailPage from "@/features/properties/components/UnitDetails"
import { useParams, useRouter } from "next/navigation"

export default function UnitDetailRoutePage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params?.id as string
  const unitId = params?.unitid as string

  return (
    <UnitDetailPage
      unitId={unitId}
      propertyId={propertyId}
      onBack={() => router.push(`/properties/${propertyId}`)}
    />
  )
}