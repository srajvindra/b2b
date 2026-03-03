export type ContactType = "owner" | "tenant"

export type MessageType = "sms" | "email" | "call"

export interface Contact {
  id: string
  name: string
  type: ContactType
  phone: string
  email: string
  avatar?: string
  property?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

export interface Message {
  id: string
  type: MessageType
  from: {
    name: string
    contact: string // phone or email
    isStaff: boolean
  }
  to: {
    name: string
    contact: string
  }
  content: string
  timestamp: string
  date: string
  attachments?: { name: string; type: string; size: string }[]
  callDuration?: string
  callNotes?: string
}

