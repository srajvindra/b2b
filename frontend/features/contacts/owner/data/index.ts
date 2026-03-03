/**
 * Owner contact feature data.
 * Re-exports from shared contacts data for a single import surface.
 */
export {
  ACCOUNTING_INFO,
  BANK_ACCOUNT_INFO,
  FEDERAL_TAX_INFO,
  OWNER_PACKET_INFO,
  OWNER_STATEMENT_INFO,
  STAFF_LIST,
} from "@/features/contacts/data/ownerDetail"

export {
  getOwnerCommunications,
  getDocuments,
  getTasks,
  teamMembers,
  getOwnerProperties,
  initialAssignedTeam,
  allStaffMembers,
  INITIAL_CUSTOM_FIELDS,
  AVAILABLE_SECTIONS,
  contactAuditLogs,
  OWNER_PROCESSES,
} from "@/features/contacts/data/ownerDetailData"
