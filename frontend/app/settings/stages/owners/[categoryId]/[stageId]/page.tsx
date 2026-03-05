import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"
import { initialOwnerCategories } from "@/features/settings/data/ownerStages"

interface PageProps {
  params: {
    categoryId: string
    stageId: string
  }
}

export default function Page({ params }: PageProps) {
  const category = initialOwnerCategories.find((c) => c.id === params.categoryId)
  const stage = category?.statuses.find((s) => s.id === params.stageId)

  return (
    <StageWorkflowPage
      categoryName={category?.name ?? "Unknown category"}
      stage={
        stage ?? {
          id: params.stageId,
          name: "Unknown stage",
          steps: 0,
          days: 0,
          processes: 0,
        }
      }
      backHref="/settings/stages/owners"
    />
  )
}
