import type { Contact, Message } from "../types"

export const CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Michael Chen",
    type: "owner",
    phone: "+1 (555) 123-4567",
    email: "michael.chen@email.com",
    property: "Riverside Heights",
    lastMessage: "Thanks for the update on the maintenance request.",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    type: "tenant",
    phone: "+1 (555) 234-5678",
    email: "sarah.j@email.com",
    property: "Cedar Point - Unit 304",
    lastMessage: "When will the AC repair be completed?",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
  },
  {
    id: "3",
    name: "Robert Taylor",
    type: "owner",
    phone: "+1 (555) 345-6789",
    email: "r.taylor@email.com",
    property: "Downtown Lofts",
    lastMessage: "I received the monthly statement. Looks good!",
    lastMessageTime: "Yesterday",
  },
  {
    id: "4",
    name: "Emily Davis",
    type: "tenant",
    phone: "+1 (555) 456-7890",
    email: "emily.davis@email.com",
    property: "Maple Ridge - Unit 12",
    lastMessage: "My lease renewal documents are attached.",
    lastMessageTime: "2 days ago",
  },
  {
    id: "5",
    name: "Linda Martinez",
    type: "owner",
    phone: "+1 (555) 567-8901",
    email: "linda.m@email.com",
    property: "Summit Place",
    lastMessage: "Can we schedule a call to discuss the new tenant?",
    lastMessageTime: "3 days ago",
  },
  {
    id: "6",
    name: "Jeff McJunkin",
    type: "tenant",
    phone: "+1 (555) 678-9012",
    email: "jeff.mcjunkin@email.com",
    property: "Riverside Heights - Unit UP",
    lastMessage: "Rent payment has been sent.",
    lastMessageTime: "4 days ago",
  },
]

export const getMessagesForContact = (contact: Contact): Message[] => {
  const staffName = "Richard Surovi"
  const staffPhone = "+1 (555) 999-0000"
  const staffEmail = "richard@heropm.com"

  return [
    {
      id: "m1",
      type: "sms",
      from: { name: staffName, contact: staffPhone, isStaff: true },
      to: { name: contact.name, contact: contact.phone },
      content: `Hi ${contact.name.split(" ")[0]}, this is Richard from Hero PM. Just wanted to follow up on your recent inquiry about ${contact.property}. Let me know if you have any questions!`,
      timestamp: "9:15 AM",
      date: "Today",
    },
    {
      id: "m2",
      type: "sms",
      from: { name: contact.name, contact: contact.phone, isStaff: false },
      to: { name: staffName, contact: staffPhone },
      content:
        "Thanks Richard! Yes, I had a question about the maintenance schedule. When will the team be coming by?",
      timestamp: "9:45 AM",
      date: "Today",
    },
    {
      id: "m3",
      type: "email",
      from: { name: staffName, contact: staffEmail, isStaff: true },
      to: { name: contact.name, contact: contact.email },
      content: `Dear ${contact.name},\n\nThank you for your patience regarding the maintenance request. Our team has scheduled the repair for this Thursday between 10 AM and 2 PM.\n\nPlease ensure someone is available to provide access to the unit. If this time doesn't work, please let us know and we'll reschedule.\n\nBest regards,\nRichard Surovi\nHero PM`,
      timestamp: "10:30 AM",
      date: "Today",
      attachments: [{ name: "maintenance_schedule.pdf", type: "pdf", size: "245 KB" }],
    },
    {
      id: "m4",
      type: "call",
      from: { name: staffName, contact: staffPhone, isStaff: true },
      to: { name: contact.name, contact: contact.phone },
      content: "Discussed property maintenance and upcoming inspection schedule.",
      timestamp: "2:00 PM",
      date: "Yesterday",
      callDuration: "5 min 23 sec",
      callNotes: `Called ${contact.name} to discuss:\n- Upcoming maintenance work\n- Property inspection scheduled for next month\n- Lease renewal options\n\n${contact.name} confirmed availability for the inspection and expressed interest in discussing lease renewal terms.`,
    },
    {
      id: "m5",
      type: "email",
      from: { name: contact.name, contact: contact.email, isStaff: false },
      to: { name: staffName, contact: staffEmail },
      content: `Hi Richard,\n\nThank you for the call earlier. I wanted to confirm that Thursday works for the maintenance visit.\n\nAlso, could you send me the lease renewal options you mentioned? I'd like to review them before our next conversation.\n\nThanks,\n${contact.name}`,
      timestamp: "3:15 PM",
      date: "Yesterday",
    },
    {
      id: "m6",
      type: "sms",
      from: { name: contact.name, contact: contact.phone, isStaff: false },
      to: { name: staffName, contact: staffPhone },
      content: "Quick question - is parking included in the lease renewal options?",
      timestamp: "4:30 PM",
      date: "Yesterday",
    },
  ]
}

