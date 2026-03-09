"use client"

import UnitDetailPage  from "@/features/properties/components/UnitDetails"
import { useRouter } from "next/navigation"
export default function UnitDetailRoutePage({ params }: { params: { id: string, unitid: string } }) {
  const router = useRouter()
  return <UnitDetailPage onBack={() => router.push(`/properties/${params.id}`)} />
}