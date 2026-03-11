import { initialProcessTypes } from "@/features/operations/data/processes"
import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"
import { initialOwnerCategories } from "@/features/settings/data/ownerStages"

interface PageProps {
  params: {
    categoryId: string
    stageId: string
  }
}

export default function Page({ params }: PageProps) {
  const process = initialProcessTypes.find((p) => p.id === params.categoryId)
  const stage = process?.stagesList.find((s) => s.id === params.stageId)

  return (
    <StageWorkflowPage
      categoryName={process?.name ?? "Unknown process"}
      stage={
        stage ?? {
          id: params.stageId,
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
