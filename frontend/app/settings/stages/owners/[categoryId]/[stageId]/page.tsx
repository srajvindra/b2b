'use client'
import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"
import { initialOwnerCategories } from "@/features/settings/data/ownerStages"
import { useParams } from "next/navigation"

export default function Page() {
  const paramsData = useParams()
  const category = initialOwnerCategories.find((c) => c.id === paramsData?.categoryId as string)
  const stage = category?.statuses.find((s) => s.id === paramsData?.stageId as string)

  return (
    <StageWorkflowPage
      categoryName={category?.name ?? "Unknown category"}
      stage={
        stage ?? {
          id: paramsData?.stageId as string,
          name: "Unknown leads",
          steps: 0,
          days: 0,
          processes: 0,
        }
      }
      backHref="/settings/stages/owners"
    />
  )
}
