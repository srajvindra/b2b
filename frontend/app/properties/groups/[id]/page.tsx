"use client"

import { useParams, useRouter } from "next/navigation"
import { PropertyDetailPage } from "@/features/properties/components/PropertyDetails"

export default function PropertyDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  return (
    <PropertyDetailPage
      propertyId={id}
      onBack={() => router.push("/properties/groups")}
    />
  )
}
