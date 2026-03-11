'use client'
import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"
import { initialLeaseProspectCategories } from "@/features/settings/data/leaseProspectStages"

import { useParams } from "next/navigation"

export default function Page() {
  const paramsData = useParams()
  const category = initialLeaseProspectCategories.find((c) => c.id === paramsData?.categoryId as string)
  const stage = category?.statuses.find((s) => s.id === paramsData?.stageId as string)

  return (
    <StageWorkflowPage
      categoryName={category?.name ?? "Unknown category"}
      stage={
        stage ?? {
          id: paramsData?.stageId as string,
          name: "Unknown lead",
          steps: 0,
          days: 0,
          processes: 0,
        }
      }
      backHref="/settings/stages/tenants"
    />
  )
}

