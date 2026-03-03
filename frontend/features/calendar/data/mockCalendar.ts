import type { CalendarEvent, EventCategory } from "../types"

export const eventCategories: EventCategory[] = [
  { id: "move-in", label: "Move-In", color: "bg-blue-500" },
  { id: "move-out", label: "Move-Out", color: "bg-purple-500" },
  { id: "inspection", label: "Inspection", color: "bg-green-500" },
  { id: "work-order", label: "Work Order", color: "bg-red-500" },
  { id: "leasing", label: "Leasing", color: "bg-yellow-500" },
  { id: "meeting", label: "Meeting", color: "bg-gray-500" },
]

export const propertyCalendarEvents: CalendarEvent[] = [
  { id: 1, title: "Move-In: Unit 212 Pine St", date: "2025-11-23", time: "10:30 AM", category: "move-in", address: "212 Pine St", owner: "John Smith", staffMember: "Anthony Davis", notes: "New tenant move-in. Keys and walkthrough completed." },
  { id: 3, title: "Inspection: 14 Oak Ave", date: "2025-11-23", time: "9:00 AM", category: "inspection", address: "14 Oak Ave", owner: "Mike Chen", staffMember: "Anthony Davis", notes: "Annual property inspection. Check HVAC, plumbing, and electrical." },
  { id: 5, title: "Property Showing: 212 Pine St", date: "2025-11-28", time: "2:00 PM", category: "leasing", address: "212 Pine St", owner: "David Lee", staffMember: "Anthony Davis", notes: "First-time property showing to interested party." },
  { id: 8, title: "Move-Out: Unit 789 Oak St", date: "2025-11-15", time: "11:00 AM", category: "move-out", address: "789 Oak St", owner: "Jessica Brown", staffMember: "Anthony Davis", notes: "Tenant moving out. Final inspection and key return." },
  { id: 10, title: "Work Order: 456 Cedar Ln", date: "2025-11-12", time: "2:30 PM", category: "work-order", address: "456 Cedar Ln", owner: "Patricia Miller", staffMember: "Anthony Davis", notes: "Plumbing leak repair needed urgently." },
  { id: 13, title: "Leasing Appointment: 234 Willow Dr", date: "2025-11-18", time: "3:00 PM", category: "leasing", address: "234 Willow Dr", owner: "Mark Thompson", staffMember: "Anthony Davis", notes: "Showing property to prospective tenant." },
  { id: 16, title: "Inspection: 678 Maple Ave", date: "2025-11-20", time: "10:00 AM", category: "inspection", address: "678 Maple Ave", owner: "Linda Garcia", staffMember: "Anthony Davis", notes: "Quarterly inspection of rental property." },
  { id: 19, title: "Move-In: Unit 890 Birch Rd", date: "2025-11-27", time: "9:30 AM", category: "move-in", address: "890 Birch Rd", owner: "Steven King", staffMember: "Anthony Davis", notes: "New tenant orientation and key handover." },
  { id: 22, title: "Work Order: 345 Pine St", date: "2025-11-14", time: "1:00 PM", category: "work-order", address: "345 Pine St", owner: "Nancy White", staffMember: "Anthony Davis", notes: "Electrical outlet repair in kitchen." },
  { id: 6, title: "Team Standup", date: "2025-11-28", time: "9:00 AM", category: "meeting", address: "HQ", owner: "All Staff", staffMember: "All Staff", notes: "Weekly team meeting to review properties and priorities." },
  { id: 2, title: "Move-Out: Unit 500 Maple Dr", date: "2025-11-23", time: "3:00 PM", category: "move-out", address: "500 Maple Dr", owner: "Sarah Johnson", staffMember: "Tyler Anderson", notes: "Final walkthrough and deposit return processing." },
  { id: 7, title: "Lease Renewal: 45 Elm St", date: "2025-11-25", time: "11:00 AM", category: "leasing", address: "45 Elm St", owner: "Robert Wilson", staffMember: "Tyler Anderson", notes: "Discuss lease renewal terms with tenant." },
  { id: 9, title: "Inspection: 123 Main St", date: "2025-11-16", time: "10:00 AM", category: "inspection", address: "123 Main St", owner: "William Davis", staffMember: "Tyler Anderson", notes: "Move-out inspection with damage assessment." },
  { id: 11, title: "Leasing Appointment: 567 Elm Blvd", date: "2025-11-19", time: "4:00 PM", category: "leasing", address: "567 Elm Blvd", owner: "Jennifer Taylor", staffMember: "Tyler Anderson", notes: "Meet with potential tenant for property tour." },
  { id: 15, title: "Move-In: Unit 111 Park Ave", date: "2025-11-21", time: "1:30 PM", category: "move-in", address: "111 Park Ave", owner: "Charles Moore", staffMember: "Tyler Anderson", notes: "Welcome new tenant and provide building information." },
  { id: 4, title: "HVAC Repair: Unit 33 Birch", date: "2025-11-24", time: "1:00 PM", category: "work-order", address: "33 Birch Ln", owner: "Emily Davis", staffMember: "John Robinson", notes: "AC not cooling. Technician scheduled." },
  { id: 12, title: "Work Order: 901 Spruce St", date: "2025-11-17", time: "9:00 AM", category: "work-order", address: "901 Spruce St", owner: "Thomas Anderson", staffMember: "John Robinson", notes: "Water heater replacement needed." },
  { id: 17, title: "Inspection: 432 Redwood Ct", date: "2025-11-22", time: "11:30 AM", category: "inspection", address: "432 Redwood Ct", owner: "Barbara Martinez", staffMember: "John Robinson", notes: "Pre-listing inspection for sale preparation." },
  { id: 20, title: "Work Order: 765 Cypress Ln", date: "2025-11-26", time: "2:00 PM", category: "work-order", address: "765 Cypress Ln", owner: "Richard Lee", staffMember: "John Robinson", notes: "Roof leak inspection and repair estimate." },
  { id: 14, title: "Move-Out: Unit 222 Valley Rd", date: "2025-11-10", time: "12:00 PM", category: "move-out", address: "222 Valley Rd", owner: "Karen Wilson", staffMember: "Jennifer Scott", notes: "Tenant vacating. Complete move-out checklist." },
  { id: 18, title: "Leasing Appointment: 543 Forest Dr", date: "2025-11-11", time: "3:30 PM", category: "leasing", address: "543 Forest Dr", owner: "Joseph Harris", staffMember: "Jennifer Scott", notes: "First showing of newly renovated unit." },
  { id: 21, title: "Inspection: 987 Highland Ave", date: "2025-11-13", time: "10:30 AM", category: "inspection", address: "987 Highland Ave", owner: "Margaret Clark", staffMember: "Jennifer Scott", notes: "Annual safety inspection and smoke detector check." },
  { id: 23, title: "Move-In: Unit 654 Lake View", date: "2025-11-29", time: "11:00 AM", category: "move-in", address: "654 Lake View", owner: "Daniel Rodriguez", staffMember: "Joshua Davis", notes: "Move-in inspection and lease signing." },
  { id: 24, title: "Leasing Appointment: 876 River Rd", date: "2025-11-30", time: "2:30 PM", category: "leasing", address: "876 River Rd", owner: "Susan Lewis", staffMember: "Joshua Davis", notes: "Property tour for interested family." },
  { id: 25, title: "Work Order: 321 Beach St", date: "2025-11-09", time: "9:00 AM", category: "work-order", address: "321 Beach St", owner: "Christopher Walker", staffMember: "Joshua Davis", notes: "Broken window replacement scheduled." },
]

export type StaffCalendarUser = {
  id: string
  name: string
  color: string
  borderColor: string
  lightColor: string
}

export const staffCalendarUsers: StaffCalendarUser[] = [
  { id: "william", name: "William Khawaja", color: "bg-pink-500", borderColor: "border-pink-600", lightColor: "bg-pink-100" },
  { id: "alex", name: "Alex Rehman", color: "bg-blue-500", borderColor: "border-blue-600", lightColor: "bg-blue-100" },
  { id: "miguel", name: "Miguel Rendon", color: "bg-green-500", borderColor: "border-green-600", lightColor: "bg-green-100" },
  { id: "mina", name: "Mina Taylor", color: "bg-purple-500", borderColor: "border-purple-600", lightColor: "bg-purple-100" },
]

export const availabilityDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const

export const initialAvailabilityData: Record<string, string[]> = {
  Monday: ["9:00 AM - 5:00 PM"],
  Tuesday: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"],
  Wednesday: [],
  Thursday: ["10:00 AM - 6:00 PM"],
  Friday: ["9:00 AM - 4:00 PM"],
  Saturday: ["10:00 AM - 2:00 PM"],
  Sunday: [],
}
