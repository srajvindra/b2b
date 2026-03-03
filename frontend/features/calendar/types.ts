export type CalendarEvent = {
  id: number
  title: string
  date: string
  time: string
  category: string
  address: string
  owner: string
  staffMember: string
  notes?: string
}

export type AvailabilitySlot = {
  id: string
  startTime: string
  endTime: string
  property: string
}

export type EventCategory = {
  id: string
  label: string
  color: string
}
