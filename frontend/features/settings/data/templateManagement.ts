import type { EmailTemplate, SmsTemplate } from "../types"

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: "e1",
    name: "Welcome Email",
    type: "email",
    subject: "Welcome to Our Property Management Services",
    content: "Dear {{name}},\n\nWelcome to Hero PM! We're excited to have you as part of our community...",
    createdBy: { name: "Nina Patel", role: "Admin" },
    createdOn: "2025-01-15",
  },
  {
    id: "e2",
    name: "Follow-up Email",
    type: "email",
    subject: "Following Up on Your Inquiry",
    content: "Hi {{name}},\n\nI wanted to follow up on our recent conversation about...",
    createdBy: { name: "John Smith", role: "Property Manager" },
    createdOn: "2025-01-10",
  },
  {
    id: "e3",
    name: "Document Request",
    type: "email",
    subject: "Required Documents for Your Application",
    content: "Dear {{name}},\n\nTo proceed with your application, we need the following documents...",
    createdBy: { name: "Sarah Johnson", role: "Leasing Agent" },
    createdOn: "2025-01-08",
  },
  {
    id: "e4",
    name: "Meeting Confirmation",
    type: "email",
    subject: "Your Meeting is Confirmed",
    content: "Hi {{name}},\n\nThis is to confirm your meeting scheduled for {{date}} at {{time}}...",
    createdBy: { name: "Nina Patel", role: "Admin" },
    createdOn: "2025-01-05",
  },
  {
    id: "e5",
    name: "Lease Renewal Notice",
    type: "email",
    subject: "Your Lease Renewal is Coming Up",
    content: "Dear {{name}},\n\nYour current lease agreement will expire on {{date}}. We would like to offer you...",
    createdBy: { name: "Mike Davis", role: "Property Manager" },
    createdOn: "2024-12-20",
  },
]

export const initialSmsTemplates: SmsTemplate[] = [
  {
    id: "s1",
    name: "Appointment Reminder",
    type: "sms",
    content: "Hi {{name}}, this is a reminder for your appointment tomorrow at {{time}}. Reply Y to confirm or call us to reschedule.",
    createdBy: { name: "Nina Patel", role: "Admin" },
    createdOn: "2025-01-14",
  },
  {
    id: "s2",
    name: "Quick Check-in",
    type: "sms",
    content: "Hi {{name}}, just checking in to see if you have any questions about your property. Feel free to reach out!",
    createdBy: { name: "John Smith", role: "Property Manager" },
    createdOn: "2025-01-12",
  },
  {
    id: "s3",
    name: "Document Received",
    type: "sms",
    content: "Hi {{name}}, we've received your documents. Our team will review them and get back to you within 24-48 hours.",
    createdBy: { name: "Sarah Johnson", role: "Leasing Agent" },
    createdOn: "2025-01-09",
  },
  {
    id: "s4",
    name: "Maintenance Update",
    type: "sms",
    content: "Hi {{name}}, your maintenance request #{{ticketId}} has been completed. Please let us know if you have any issues.",
    createdBy: { name: "Mike Davis", role: "Property Manager" },
    createdOn: "2025-01-06",
  },
]
