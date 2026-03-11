'use client'
import { unassignedProcesses } from "@/features/operations/data/processes"
import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"
import { useParams } from "next/navigation"

export default function Page() {
  const paramsData = useParams()
  const process = unassignedProcesses?.[0]?.processes.find((p) => p.id == paramsData?.categoryId as string)
  const stage = process?.stages.find((s) => s.id == paramsData?.stageId as string)

  return (
    <StageWorkflowPage
      categoryName={process?.name ?? "Unknown process"}
      stage={
        stage ?? {
          id: paramsData?.stageId as string,
          name: "Unknown stage",
          steps: 0,
          days: 0,
          processes: 0,
        }
      }
      backHref="/settings/manage-processes"
    />
  )
}
