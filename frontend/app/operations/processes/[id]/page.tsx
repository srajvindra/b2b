"use client"

import { useParams, useRouter } from "next/navigation"
import { ContactProcessDetailView } from "@/features/contacts/components/ContactProcessDetail"
import { initialProcessInstances } from "@/features/operations/data/processes"
import type { ProcessData, ProcessTask } from "@/features/contacts/types"

function mapInstanceToProcessData(instance: (typeof initialProcessInstances)[number]): ProcessData {
  const primaryStaff = instance.assignee || "Process Owner"
  const tasks: ProcessTask[] = [
    {
      id: `${instance.id}-1`,
      name: `Current stage: ${instance.stage}`,
      startDate: instance.createdAt,
      completedDate: null,
      staffName: primaryStaff,
      staffEmail: "staff@example.com",
    },
    {
      id: `${instance.id}-2`,
      name: "Review related documents",
      startDate: null,
      completedDate: null,
      staffName: primaryStaff,
      staffEmail: "staff@example.com",
    },
    {
      id: `${instance.id}-3`,
      name: "Confirm next steps with team",
      startDate: null,
      completedDate: null,
      staffName: primaryStaff,
      staffEmail: "staff@example.com",
    },
  ]

  return {
    id: instance.id,
    name: instance.processType,
    prospectingStage: instance.stage,
    startedOn: instance.createdAt,
    status: instance.status,
    tasks,
  }
}

export default function OperationProcessDetailRoutePage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const instance = initialProcessInstances.find((p) => p.id === id)

  if (!instance) {
    return (
      <div className="p-6 space-y-3">
        <button
          type="button"
          className="text-sm text-muted-foreground underline"
          onClick={() => router.push("/operations/processes")}
        >
          Back to Processes
        </button>
        <p className="text-muted-foreground">Process not found.</p>
      </div>
    )
  }

  const process = mapInstanceToProcessData(instance)
  const contactName = instance.relatedEntity?.name ?? instance.name

  return (
    <ContactProcessDetailView
      process={process}
      contactName={contactName}
      onBack={() => router.push("/operations/processes")}
    />
  )
}
