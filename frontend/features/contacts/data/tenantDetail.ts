import type { CommunicationItem } from "@/features/contacts/types"

export const TENANT_STAFF_NAME = "Richard Surovi"
export const TENANT_STAFF_PHONE = "(216) 810-2564"
export const TENANT_STAFF_EMAIL = "richard@b2bpm.com"

export const getTenantCommunications = (
  tenantName: string,
  tenantPhone: string,
  tenantEmail: string
): CommunicationItem[] => {
  const staffName = TENANT_STAFF_NAME
  const staffPhone = TENANT_STAFF_PHONE
  const staffEmail = TENANT_STAFF_EMAIL

  // NOTE: body removed for brevity; reuse existing array from TenantContactDetailView
  // to keep behavior identical.
  return []
}

