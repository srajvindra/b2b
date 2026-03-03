export { TenantInformationTab, type TenantInformationTabProps } from "./TenantInformation"
export { TenantUnitInformationTab, type TenantUnitInformationTabProps } from "./UnitInformation"

// Re-export owner tab components so tenant page can use them without duplicate code
export {
  OwnerCommunicationTab,
  OwnerProcessesTab,
  OwnerDocumentTab,
  OwnerAuditLogTab,
} from "@/features/contacts/owner/components"
export type { OwnerCommunicationTabContact } from "@/features/contacts/owner/components"
