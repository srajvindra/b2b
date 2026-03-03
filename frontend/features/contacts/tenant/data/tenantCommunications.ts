import type { CommunicationItem } from "@/features/contacts/types"

export function getTenantCommunications(
  tenantName: string,
  tenantPhone: string,
  tenantEmail: string
): CommunicationItem[] {
  const staffName = "Richard Surovi"
  const staffPhone = "(216) 810-2564"
  const staffEmail = "richard@b2bpm.com"

  return [
    { id: "s1", type: "sms", from: { name: staffName, contact: staffPhone }, to: { name: tenantName, contact: tenantPhone }, preview: "Sounds good. Let me know what we can do to move forward.", content: "Sounds good. Let me know what we can do to move forward. Reply STOP to opt out.", timestamp: "12/4/2025, 12:24 PM", fullDate: "12/4/2025, 12:24 PM", date: new Date("2025-12-04T12:24:00"), isRead: true, isIncoming: false },
    { id: "s2", type: "sms", from: { name: tenantName, contact: tenantPhone }, to: { name: staffName, contact: staffPhone }, preview: "Hi Richard. Thanks for following up.", content: "Hi Richard. Thanks for following up. I'm speaking to a few other companies and will get back soon.", timestamp: "12/4/2025, 12:22 PM", fullDate: "12/4/2025, 12:22 PM", date: new Date("2025-12-04T12:22:00"), isRead: false, isIncoming: true },
    { id: "e1", type: "email", from: { name: staffName, contact: staffEmail }, to: { name: tenantName, contact: tenantEmail }, subject: "Follow-up: Lease Renewal Options", preview: "Sent follow-up email regarding lease renewal.", timestamp: "11/28/2025, 3:15 PM", fullDate: "11/28/2025, 3:15 PM", date: new Date("2025-11-28T15:15:00"), isRead: true, isIncoming: false },
    { id: "g1", type: "sms", from: { name: "Mike Davis", contact: "(216) 555-4567" }, to: { name: "Building Residents", contact: "" }, preview: "Building maintenance notice.", content: "Building maintenance notice: Water will be shut off on Monday 9-11 AM.", timestamp: "12/6/2025, 9:00 AM", fullDate: "12/6/2025, 9:00 AM", date: new Date("2025-12-06T09:00:00"), isRead: true, isIncoming: false, isGroupChat: true, groupParticipants: ["Mike Davis", tenantName, "John Smith"], unreadCount: 3 },
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
}
