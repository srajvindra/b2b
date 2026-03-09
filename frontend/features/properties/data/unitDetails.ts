export const accessOptions = [
  { id: "one-day", label: "One day" },
  { id: "multiple-days", label: "Multiple days" },
  { id: "multiple-months", label: "Multiple months" },
  { id: "one-hour", label: "One hour" },
  { id: "two-hours", label: "Two hours" },
  { id: "three-hours", label: "Three hours" },
  { id: "four-hours", label: "Four hours" },
  { id: "five-hours", label: "Five hours" },
  { id: "six-hours", label: "Six hours" },
] as const

export const shareLinksOptions = [
  { id: "leasing-prospect", label: "Leasing Prospect", color: "bg-green-500" },
  { id: "owner", label: "Owner", color: "bg-red-500" },
  { id: "csr", label: "CSR", color: "bg-gray-400" },
  { id: "csm", label: "CSM", color: "bg-yellow-500" },
  { id: "leasing-coordinator-1", label: "Leasing Coordinator", color: "bg-green-500" },
  { id: "leasing-coordinator-2", label: "Leasing Coordinator", color: "bg-red-500" },
  { id: "leasing-manager", label: "Leasing Manager", color: "bg-gray-400" },
] as const

export const unitAmenities = ["Cats Allowed", "Dogs Allowed"] as const

export const documentsData = [
  {
    name: "Management Agreement - Signed.pdf",
    property: "Oak Manor",
    address: "123 Oak Street, San Francisco, CA",
    receivedDate: "12/03/2025",
    receivedTime: "2:30 PM",
  },
  {
    name: "Property Inspection Report.pdf",
    property: "Maple Heights",
    address: "456 Maple Ave, San Francisco, CA",
    receivedDate: "11/28/2025",
    receivedTime: "10:15 AM",
  },
  {
    name: "Insurance Certificate 2025.pdf",
    property: "Pine View Apartments",
    address: "789 Pine Road, San Francisco, CA",
    receivedDate: "11/25/2025",
    receivedTime: "4:45 PM",
  },
  {
    name: "W-9 Form.pdf",
    property: "Oak Manor",
    address: "123 Oak Street, San Francisco, CA",
    receivedDate: "11/20/2025",
    receivedTime: "11:00 AM",
  },
] as const

export const missingFields = [
  { id: "1", name: "Banking Details", section: "Financials", tab: "rental-information" },
  { id: "2", name: "Tax ID / EIN", section: "Tax Information", tab: "rental-information" },
  { id: "3", name: "Mailing Address", section: "Contact Information", tab: "unit-information" },
  { id: "4", name: "Preferred Contact Method", section: "Contact Information", tab: "unit-information" },
] as const

export const missingDocuments = [
  { id: "1", name: "Lease Agreement", section: "Legal Documents" },
  { id: "2", name: "Move-in Inspection Report", section: "Inspection Documents" },
  { id: "3", name: "Renter's Insurance", section: "Insurance Documents" },
] as const

export const SHARE_RECIPIENTS = [
  { name: "Leasing Prospect", color: "bg-green-500" },
  { name: "Owner", color: "bg-red-500" },
  { name: "CSR", color: "bg-gray-400" },
  { name: "CSM", color: "bg-orange-500" },
  { name: "Leasing Coordinator", color: "bg-lime-500" },
  { name: "Leasing Coordinator", color: "bg-purple-500" },
  { name: "Leasing Manager", color: "bg-gray-400" },
] as const
