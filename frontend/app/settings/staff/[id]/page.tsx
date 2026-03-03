import { notFound } from "next/navigation"
import { StaffMemberDetailPage } from "@/features/settings/components/StaffMemberDetailPage"
import { getStaffMemberById } from "@/features/settings/data/staffMembers"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function StaffMemberPage({ params }: PageProps) {
  const { id } = await params
  const staff = getStaffMemberById(id)
  if (!staff) notFound()
  return <StaffMemberDetailPage staff={staff} />
}
