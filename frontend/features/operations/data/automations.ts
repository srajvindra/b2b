import type { AutomationDetail } from "../types"

export const allStaff = [
  "Sarah Johnson",
  "Mike Davis",
  "Emily Brown",
  "John Smith",
  "Lisa Chen",
]

export const leadsOwnersAutomations: AutomationDetail[] = [
  {
    id: "lo1",
    name: "New Lead Welcome Email",
    description: "Send welcome email when a new owner lead is created",
    trigger: "New Lead Created",
    status: "active",
    lastRun: "2 hours ago",
    runCount: 234,
    leadSource: "Website",
    campaignGroup: "New Lead Campaigns",
    assignedStaff: ["Sarah Johnson", "Mike Davis"],
    smsOptIn: true,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Good News! - You Have A New Prospect!",
        subject: "Good News! - You Have A New Prospect!",
        content:
          "Please call your new prospect asap. We will be emailing and texting them shortly on your behalf as well.",
      },
      {
        id: "s2",
        type: "email",
        timing: "5 Minutes",
        title: "New Lead F/U Email #1, Day 1",
        subject: "RE: Saving {contact.firstName} Money on Property Management",
        content:
          "Hey {contact.firstName}, we're following up about your request for property management services from {Lead.source}.\n\nI want to reach out to say hello and let you know that we are getting to work for you!\n\nWe have helped a lot of property owners in {agency.state} already with their management needs.\n\nWe work with the best vendors, and we have competitive rates while ALSO having the strongest service (most companies can't do that). This way you {agency.email} can relax and we can take it from here.\n\nDo you prefer text, email or a phone call to get started?\n\nLooking forward to helping you have a more secure investment.",
      },
      {
        id: "s3",
        type: "sms",
        timing: "10 Minutes",
        title: "New Lead F/U SMS #1, Day 1",
        content:
          "Hey {contact.name}, {agent.name} here, following up for your request for property management. To help with the proposal, what is your zip code?",
      },
      {
        id: "s4",
        type: "email",
        timing: "1 Day",
        title: "New Lead F/U Email #2, Day 2",
        subject: "{contact.name} - Let's Connect",
        content:
          "Hi {contact.firstName},\n\nI wanted to follow up on my previous email. Have you had a chance to think about your property management needs?\n\nI'd love to schedule a quick call to discuss how we can help you maximize your investment returns.\n\nBest regards,\n{agent.name}",
      },
    ],
  },
  {
    id: "lo2",
    name: "Follow-up Reminder",
    description: "Send reminder to agent if no contact in 48 hours",
    trigger: "No Activity (48h)",
    status: "active",
    lastRun: "1 day ago",
    runCount: 156,
    leadSource: "Referral",
    campaignGroup: "Follow-up Campaigns",
    assignedStaff: ["John Smith"],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Reminder: Follow up with lead",
        subject: "Action Required: Lead needs follow-up",
        content:
          "Hi {agent.name},\n\nThis is a reminder that {contact.name} has not been contacted in 48 hours. Please reach out to them soon.\n\nLead Details:\nName: {contact.name}\nPhone: {contact.phone}\nEmail: {contact.email}",
      },
    ],
  },
  {
    id: "lo3",
    name: "Lead Qualification Alert",
    description: "Notify manager when lead is qualified",
    trigger: "Stage Changed to Qualified",
    status: "active",
    lastRun: "5 hours ago",
    runCount: 89,
    leadSource: "All Sources",
    campaignGroup: "Qualification Alerts",
    assignedStaff: ["Emily Brown", "Richard Surovi"],
    smsOptIn: true,
    smsPermission: true,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Lead Qualified Notification",
        subject: "New Qualified Lead: {contact.name}",
        content:
          "A lead has been qualified and is ready for the next step.\n\nLead: {contact.name}\nProperty Interest: {property.type}\nQualified by: {agent.name}",
      },
      {
        id: "s2",
        type: "task",
        timing: "Immediately",
        title: "Schedule intro call with qualified lead",
        content: "Create task for manager to schedule intro call with {contact.name}",
      },
    ],
  },
  {
    id: "lo4",
    name: "Lost Lead Survey",
    description: "Send feedback survey when lead is marked as lost",
    trigger: "Stage Changed to Lost",
    status: "paused",
    lastRun: "1 week ago",
    runCount: 45,
    leadSource: "All Sources",
    campaignGroup: "Feedback Campaigns",
    assignedStaff: [],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "1 Day",
        title: "Feedback Survey",
        subject: "We'd love your feedback",
        content:
          "Hi {contact.firstName},\n\nWe noticed you decided not to move forward with us. We'd appreciate if you could take a moment to share your feedback so we can improve.\n\n[Survey Link]\n\nThank you for considering us.",
      },
    ],
  },
]

export const leadsProspectsAutomations: AutomationDetail[] = [
  {
    id: "lp1",
    name: "Guest Card Confirmation",
    description: "Send confirmation when guest card is submitted",
    trigger: "Guest Card Created",
    status: "active",
    lastRun: "30 minutes ago",
    runCount: 567,
    leadSource: "Website",
    campaignGroup: "Leasing Campaigns",
    assignedStaff: ["Lisa Chen"],
    smsOptIn: true,
    smsPermission: true,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Thank you for your interest!",
        subject: "Thank you for your interest in {property.name}",
        content:
          "Hi {contact.firstName},\n\nThank you for submitting your guest card for {property.name}. A leasing agent will be in touch with you shortly to schedule a showing.\n\nProperty Details:\nAddress: {property.address}\nBedrooms: {unit.bedrooms}\nRent: {unit.rent}/month",
      },
      {
        id: "s2",
        type: "sms",
        timing: "5 Minutes",
        title: "Quick follow-up SMS",
        content:
          "Hi {contact.firstName}! Thanks for your interest in {property.name}. When would be a good time for a showing? - {agent.name}",
      },
    ],
  },
  {
    id: "lp2",
    name: "Showing Reminder",
    description: "Send reminder 24 hours before scheduled showing",
    trigger: "24h Before Showing",
    status: "active",
    lastRun: "3 hours ago",
    runCount: 432,
    leadSource: "All Sources",
    campaignGroup: "Showing Reminders",
    assignedStaff: ["Sarah Johnson", "Mike Davis"],
    smsOptIn: true,
    smsPermission: true,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "24 Hours Before",
        title: "Showing Reminder",
        subject: "Reminder: Your showing tomorrow at {property.name}",
        content:
          "Hi {contact.firstName},\n\nThis is a friendly reminder about your scheduled showing tomorrow.\n\nDetails:\nProperty: {property.name}\nAddress: {property.address}\nDate: {showing.date}\nTime: {showing.time}\n\nSee you there!",
      },
      {
        id: "s2",
        type: "sms",
        timing: "24 Hours Before",
        title: "SMS Reminder",
        content:
          "Reminder: Your showing at {property.name} is tomorrow at {showing.time}. See you there! - {agent.name}",
      },
    ],
  },
  {
    id: "lp3",
    name: "Application Follow-up",
    description: "Follow up if application not completed in 72 hours",
    trigger: "Application Incomplete (72h)",
    status: "active",
    lastRun: "1 day ago",
    runCount: 123,
    leadSource: "All Sources",
    campaignGroup: "Application Follow-ups",
    assignedStaff: ["Emily Brown"],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "72 Hours",
        title: "Complete your application",
        subject: "Your application for {property.name} is waiting",
        content:
          "Hi {contact.firstName},\n\nWe noticed you started an application for {property.name} but haven't completed it yet.\n\nDon't miss out on this great property! Complete your application today.\n\n[Continue Application]",
      },
    ],
  },
  {
    id: "lp4",
    name: "No-Show Notification",
    description: "Notify leasing agent when prospect doesn't show",
    trigger: "Showing Missed",
    status: "draft",
    runCount: 0,
    leadSource: "All Sources",
    campaignGroup: "No-Show Alerts",
    assignedStaff: [],
    smsOptIn: false,
    smsPermission: false,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Prospect No-Show Alert",
        subject: "No-Show: {contact.name} missed showing",
        content:
          "Hi {agent.name},\n\n{contact.name} did not show up for their scheduled showing at {property.name}.\n\nYou may want to follow up with them to reschedule.",
      },
    ],
  },
]

export const contactsOwnersAutomations: AutomationDetail[] = [
  {
    id: "co1",
    name: "Monthly Statement",
    description: "Send monthly owner statement automatically",
    trigger: "1st of Month",
    status: "active",
    lastRun: "5 days ago",
    runCount: 1240,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "1st of Month",
        title: "Monthly Statement",
        subject: "Your Monthly Statement for {property.name}",
        content:
          "Dear {owner.name},\n\nPlease find attached your monthly statement for {property.name}.\n\nSummary:\nRent Collected: {statement.rentCollected}\nExpenses: {statement.expenses}\nNet Income: {statement.netIncome}\n\nThank you for choosing us.",
      },
    ],
  },
  {
    id: "co2",
    name: "Maintenance Update",
    description: "Notify owner when maintenance work is completed",
    trigger: "Work Order Completed",
    status: "active",
    lastRun: "4 hours ago",
    runCount: 356,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Maintenance Completed",
        subject: "Maintenance completed at {property.name}",
        content:
          "Dear {owner.name},\n\nThe maintenance work at {property.name} has been completed.\n\nWork Order: {workOrder.id}\nDescription: {workOrder.description}\nCost: {workOrder.cost}\n\nPlease let us know if you have any questions.",
      },
    ],
  },
  {
    id: "co3",
    name: "Lease Renewal Notice",
    description: "Send notice 90 days before lease renewal date",
    trigger: "90 Days Before Renewal",
    status: "active",
    lastRun: "2 days ago",
    runCount: 78,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "90 Days Before",
        title: "Lease Renewal Notice",
        subject: "Upcoming Lease Renewal at {property.name}",
        content:
          "Dear {owner.name},\n\nThe lease at {property.name} is due for renewal in 90 days.\n\nCurrent Tenant: {tenant.name}\nLease End Date: {lease.endDate}\n\nPlease let us know if you'd like to proceed with the renewal.",
      },
    ],
  },
  {
    id: "co4",
    name: "Vacancy Alert",
    description: "Alert owner when unit becomes vacant",
    trigger: "Unit Vacated",
    status: "paused",
    lastRun: "2 weeks ago",
    runCount: 34,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Vacancy Alert",
        subject: "Unit Vacated at {property.name}",
        content:
          "Dear {owner.name},\n\nThe unit at {property.name} is now vacant.\n\nWe will begin marketing the property immediately to find a new tenant.",
      },
    ],
  },
]

export const contactsTenantsAutomations: AutomationDetail[] = [
  {
    id: "ct1",
    name: "Welcome Email - New Tenant",
    description: "Send welcome email when a new tenant signs a lease",
    trigger: "Lease Signed",
    status: "active",
    lastRun: "2 hours ago",
    runCount: 156,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Welcome to Your New Home!",
        subject: "Welcome to {property.name}!",
        content:
          "Dear {tenant.name},\n\nWelcome to your new home at {property.name}!\n\nYour move-in date is: {lease.startDate}\n\nPlease find attached important information about your new home.",
      },
    ],
  },
  {
    id: "ct2",
    name: "Rent Reminder - 5 Days Before",
    description: "Send reminder email 5 days before rent is due",
    trigger: "Scheduled (Monthly)",
    status: "active",
    lastRun: "1 day ago",
    runCount: 2340,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "5 Days Before Due",
        title: "Rent Reminder",
        subject: "Rent Due Reminder - {property.name}",
        content:
          "Hi {tenant.firstName},\n\nThis is a friendly reminder that your rent of {rent.amount} is due on {rent.dueDate}.\n\nPay online: {payment.link}",
      },
    ],
  },
  {
    id: "ct3",
    name: "Late Payment Notice",
    description: "Send late payment notice after grace period",
    trigger: "Payment Overdue",
    status: "active",
    lastRun: "3 days ago",
    runCount: 178,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "After Grace Period",
        title: "Late Payment Notice",
        subject: "Late Payment Notice - {property.name}",
        content:
          "Dear {tenant.name},\n\nYour rent payment is past due. Please submit payment immediately to avoid late fees.\n\nAmount Due: {rent.amount}\nLate Fee: {rent.lateFee}",
      },
    ],
  },
  {
    id: "ct4",
    name: "Lease Renewal Reminder",
    description: "Notify tenants 90 days before lease expiration",
    trigger: "90 Days Before Lease End",
    status: "paused",
    lastRun: "1 week ago",
    runCount: 45,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "90 Days Before",
        title: "Lease Renewal Opportunity",
        subject: "Your Lease Renewal at {property.name}",
        content:
          "Dear {tenant.name},\n\nYour lease at {property.name} will expire in 90 days.\n\nWe'd love to have you stay! Please let us know if you'd like to renew.",
      },
    ],
  },
  {
    id: "ct5",
    name: "Move-Out Instructions",
    description: "Send move-out checklist when notice is submitted",
    trigger: "Move-Out Notice Submitted",
    status: "active",
    lastRun: "4 days ago",
    runCount: 67,
    sequence: [
      {
        id: "s1",
        type: "email",
        timing: "Immediately",
        title: "Move-Out Instructions",
        subject: "Move-Out Instructions for {property.name}",
        content:
          "Dear {tenant.name},\n\nWe've received your move-out notice. Here's what you need to know:\n\n1. Final walkthrough date: {moveout.date}\n2. Keys return location: {office.address}\n3. Cleaning checklist attached\n\nThank you for being a great tenant!",
      },
    ],
  },
]
