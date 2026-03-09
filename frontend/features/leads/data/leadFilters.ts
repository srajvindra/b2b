export const OWNER_PROSPECT_FILTER_FIELDS = [
  "Integration",
  "Status",
  "Property Group(s)",
  "In Relationship(s)",
  "In Relationship Status",
  "Tagged With Any",
  "Tagged With All",
  "Created At",
  "Updated At",
  "Owner Move Out Date",
  "Have we received the signed management agreement yet?",
  "HOA?",
  "HOA Name",
  "Utility Region",
  "Do we have the HOA documents/contact info?",
  "Pet's Allowed?",
  "Power Company",
  "Gas Company",
  "Available By Date",
  "Section 8?",
  "Trash Company",
  "Water/Sewer Company",
  "Oil (Heat or Hot Water)",
  "Available",
  "Water Company",
  "Sewer Company",
  "Start Marketing",
  "Does the owner allow for pets?",
  "Microwave Included?",
  "Dishwasher Included?",
  "Stove/Oven Included?",
  "Refrigerator Included?",
  "Listing Price",
  "Sold Price",
  "Washer Included?",
  "Date Ratified",
  "Dryer Included?",
  "Listing Date",
  "Pool?",
  "Send Seller Brokerage Fee Form",
  "Community Center?",
  "House keys",
  "PICRA RECEIVED",
  "Lockbox Code",
  "Mailbox keys",
  "PICRA RATIFIED",
  "Closing Date",
  "Community keys",
  "Walkthrough Date",
  "Garage door remotes",
  "Ceiling fan remotes",
  "Listing Agreement Signed",
  "Power Company Contact",
  "Key Fobs (for HOA)",
  "Termite & Moisture Inspection Date",
  "Air conditioning",
  "Inspection Date",
  "Security Code",
  "Decision on applying to Guarantors",
  "Guarantors results on renewal",
  "Satisfaction follow-up email response",
  "Funds Received?",
]

export const OWNER_PROSPECT_FIELDS_WITH_SELECT_ALL = [
  "Property Group(s)",
  "In Relationship(s)",
  "Tagged With Any",
  "Tagged With All",
]

export function getOwnerProspectFilterOptions(field: string): string[] {
  if (field === "Status") return ["Active", "Inactive"]
  if (field === "Property Group(s)")
    return [
      "CSR - Abby Portfolio",
      "CSR - Aiden Portfolio",
      "CSR - Alyssa Portfolio",
      "CSR - Amanda Portfolio",
      "CSR - Ashton Portfolio",
      "CSR - Ayesha Portfolio",
      "CSR - Brett Portfolio",
      "CSR - Colin Portfolio",
      "CSR - Devin Portfolio",
      "CSR - Elena Portfolio",
      "CSR - Fiona Portfolio",
      "CSR - Grant Portfolio",
      "CSR - Hannah Portfolio",
      "CSR - Isaac Portfolio",
      "CSR - Julia Portfolio",
      "CSR - Kevin Portfolio",
      "CSR - Liam Portfolio",
      "CSR - Maya Portfolio",
      "CSR - Noah Portfolio",
      "CSR - Olivia Portfolio",
    ]
  if (field === "In Relationship(s)")
    return [
      "New Tenant Leads",
      "NEW TENANTS LEADS",
      "New Vendor Leads",
      "PMC Leads",
      "Realty Buyer Leads",
      "Realty Seller Leads",
      "Recruiting",
      "Referral Partners",
      "Scott PMC Acquisitions",
      "Strategic Property Owner Leads",
    ]
  if (field === "Tagged With Any" || field === "Tagged With All")
    return ["Commercial", "Corporate", "Residential", "VIP", "New", "Priority"]
  if (field === "Integration") return ["AppFolio", "Buildium", "RentManager", "Yardi", "None"]
  if (field === "In Relationship Status") return ["Active", "Inactive", "Pending"]
  if (
    field.includes("Included?") ||
    field.includes("Allowed?") ||
    field === "HOA?" ||
    field === "Pool?" ||
    field === "Community Center?" ||
    field === "Section 8?" ||
    field === "Available" ||
    field === "Funds Received?" ||
    field === "Does the owner allow for pets?"
  )
    return ["Yes", "No"]
  if (field === "Utility Region")
    return ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast", "Pacific Northwest"]
  return ["Option A", "Option B", "Option C"]
}

// Lease prospects: keep a focused list for the listing screen.
export const LEASE_PROSPECT_FILTER_FIELDS = [
  "Integration",
  "Status",
  "Property Group(s)",
  "In Relationship(s)",
  "In Relationship Status",
  "Tagged With Any",
  "Tagged With All",
  "Created At",
  "Updated At",
  "Owner Move Out Date",
  "Have we received the signed management agreement yet?",
  "HOA?",
  "HOA Name",
  "Utility Region",
  "Do we have the HOA documents/contact info?",
  "Pet's Allowed?",
  "Power Company",
  "Gas Company",
  "Available By Date",
  "Section 8?",
  "Trash Company",
  "Water/Sewer Company",
  "Oil (Heat or Hot Water)",
  "Available",
  "Water Company",
  "Sewer Company",
  "Start Marketing",
  "Does the owner allow for pets?",
  "Microwave Included?",
  "Dishwasher Included?",
  "Stove/Oven Included?",
  "Refrigerator Included?",
  "Listing Price",
  "Sold Price",
  "Washer Included?",
  "Date Ratified",
  "Dryer Included?",
  "Listing Date",
  "Pool?",
  "Send Seller Brokerage Fee Form",
  "Community Center?",
  "House keys",
  "PICRA RECEIVED",
  "Lockbox Code",
  "Mailbox keys",
  "PICRA RATIFIED",
  "Closing Date",
  "Community keys",
  "Walkthrough Date",
  "Garage door remotes",
  "Ceiling fan remotes",
  "Listing Agreement Signed",
  "Power Company Contact",
  "Key Fobs (for HOA)",
  "Termite & Moisture Inspection Date",
  "Air conditioning",
  "Inspection Date",
  "Security Code",
  "Decision on applying to Guarantors",
  "Guarantors results on renewal",
  "Satisfaction follow-up email response",
  "Funds Received?",
]

export const LEASE_PROSPECT_FIELDS_WITH_SELECT_ALL = ["Stage", "Source", "Tagged With Any", "Tagged With All"]

export function getLeaseProspectFilterOptions(field: string): string[] {
  if (field === "Status") return ["Active", "Inactive"]
  if (field === "Integration") return ["AppFolio", "Buildium", "RentManager", "Yardi", "None"]
  if (field === "Stage") return ["New", "Contacted", "Applied", "Approved", "Denied", "Moved In", "Closed"]
  if (field === "Source") return ["Website", "Referral", "Zillow", "Apartments.com", "Craigslist", "Other"]
  if (field === "Tagged With Any" || field === "Tagged With All")
    return ["Urgent", "High Intent", "Co-signer", "Pet", "Voucher", "Follow-up"]
  return ["Option A", "Option B", "Option C"]
}

