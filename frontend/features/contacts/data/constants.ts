import type { ContactActivity, ContactPayment, ContactNote } from "../types"

export const PROPERTY_UNIT_MAP: Record<string, { propertyId: string; unitId: string }> = {
  "123 Main St, Apt 4B": { propertyId: "123-main-st", unitId: "apt-4b" },
  "456 Elm St": { propertyId: "456-elm-st", unitId: "unit-1" },
  "654 Cedar Blvd": { propertyId: "654-cedar-blvd", unitId: "unit-1" },
  "789 Pine Rd": { propertyId: "789-pine-rd", unitId: "unit-1" },
  "321 Oak Ln": { propertyId: "321-oak-ln", unitId: "unit-1" },
  "1200 Broadway": { propertyId: "1200-broadway", unitId: "unit-1" },
  "450 Park Ave": { propertyId: "450-park-ave", unitId: "unit-1" },
  "890 River St": { propertyId: "890-river-st", unitId: "unit-1" },
  "14 Oak Ave": { propertyId: "14-oak-ave", unitId: "unit-1" },
  "221 Lakeview": { propertyId: "221-lakeview", unitId: "unit-1" },
  "500 Maple Dr": { propertyId: "500-maple-dr", unitId: "unit-1" },
  "778 Walnut Ave": { propertyId: "778-walnut-ave", unitId: "unit-1" },
  "889 Birch Ln": { propertyId: "889-birch-ln", unitId: "unit-1" },
  "333 Fifth Ave": { propertyId: "333-fifth-ave", unitId: "unit-1" },
  "555 Harbor Dr": { propertyId: "555-harbor-dr", unitId: "unit-1" },
  "120 Sunset Blvd": { propertyId: "120-sunset-blvd", unitId: "unit-1" },
  "880 Ocean Ave": { propertyId: "880-ocean-ave", unitId: "unit-1" },
  "432 Valley Rd": { propertyId: "432-valley-rd", unitId: "unit-1" },
  "900 Mountain View": { propertyId: "900-mountain-view", unitId: "unit-1" },
  "611 Forest Lane": { propertyId: "611-forest-lane", unitId: "unit-1" },
  "222 Bay St": { propertyId: "222-bay-st", unitId: "unit-1" },
  "444 River View": { propertyId: "444-river-view", unitId: "unit-1" },
  "788 Hill Crest": { propertyId: "788-hill-crest", unitId: "unit-1" },
  "999 Parkway": { propertyId: "999-parkway", unitId: "unit-1" },
  "345 Elm Grove": { propertyId: "345-elm-grove", unitId: "unit-1" },
  "567 Cedar Heights": { propertyId: "567-cedar-heights", unitId: "unit-1" },
  "111 Spring St": { propertyId: "111-spring-st", unitId: "unit-1" },
  "890 Oak Villa": { propertyId: "890-oak-villa", unitId: "unit-1" },
  "234 Pine Garden": { propertyId: "234-pine-garden", unitId: "unit-1" },
  "456 Maple Court": { propertyId: "456-maple-court", unitId: "unit-1" },
  "678 Birch Way": { propertyId: "678-birch-way", unitId: "unit-1" },
  "321 Willow Dr": { propertyId: "321-willow-dr", unitId: "unit-1" },
  "900 Cherry Lane": { propertyId: "900-cherry-lane", unitId: "unit-1" },
  "123 Laurel Ave": { propertyId: "123-laurel-ave", unitId: "unit-1" },
  "345 Aspen St": { propertyId: "345-aspen-st", unitId: "unit-1" },
  "567 Redwood Blvd": { propertyId: "567-redwood-blvd", unitId: "unit-1" },
  "760 Lake Shore": { propertyId: "760-lake-shore", unitId: "unit-1" },
  "890 Willow Lane": { propertyId: "890-willow-lane", unitId: "unit-1" },
  "234 Oak Terrace": { propertyId: "234-oak-terrace", unitId: "unit-1" },
  "567 Maple Heights": { propertyId: "567-maple-heights", unitId: "unit-1" },
}

export const MOCK_ACTIVITIES: ContactActivity[] = [
  {
    id: 1,
    type: "call",
    description: "Outbound call regarding lease renewal",
    date: "Today, 10:30 AM",
    user: "Nina Patel",
  },
  { id: 2, type: "email", description: "Sent monthly statement", date: "Yesterday, 2:15 PM", user: "System" },
  { id: 3, type: "document", description: "Uploaded signed lease agreement", date: "Nov 18, 2025", user: "Raj Patel" },
  {
    id: 4,
    type: "note",
    description: "Client requested maintenance for HVAC",
    date: "Nov 15, 2025",
    user: "Luis Rodriguez",
  },
]

export const MOCK_PAYMENTS: ContactPayment[] = [
  { id: 1, date: "Nov 01, 2025", amount: "$2,450.00", type: "Rent Payment", status: "Paid" },
  { id: 2, date: "Oct 01, 2025", amount: "$2,450.00", type: "Rent Payment", status: "Paid" },
  { id: 3, date: "Sep 01, 2025", amount: "$2,450.00", type: "Rent Payment", status: "Paid" },
  { id: 4, date: "Aug 15, 2025", amount: "$150.00", type: "Late Fee", status: "Waived" },
]

export const MOCK_NOTES: ContactNote[] = [
  {
    id: 1,
    content: "Prefer to be contacted via email during work hours (9-5).",
    author: "Nina Patel",
    date: "Oct 10, 2025",
  },
  {
    id: 2,
    content: "Planning to expand portfolio next year, keep updated on new listings.",
    author: "Raj Patel",
    date: "Sep 22, 2025",
  },
]
