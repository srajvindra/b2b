// import { StageWorkflowPage } from "@/features/settings/components/StageWorkflowPage"
// import { initialProcessTypes } from "@/features/operations/data/processes"

// interface PageProps {
//   params: {
//     id: string
//   }
// }

// export default function Page({ params }: PageProps) {
//   const process = initialProcessTypes.find((p) => p.id === params.id)

//   return (
//     <StageWorkflowPage
//       categoryName={process?.name ?? "Unknown process"}
//       stage={process ?? {
//         id: params.id,
//         name: "Unknown process",
//         steps: 0,
//         days: 0,
//         processes: 0,
//       }}
//       backHref="/operations/processes"
//     />
//   )
// }
import { OperationWorkflowPage } from "@/features/settings/components/OperationWorkflowPage"

export default function Page() {
  return (
    <OperationWorkflowPage />
  )
}