// Shared mock data for the property detail page

export const PROPERTY_DATA = {
  id: "21",
  name: "Seth Abman",
  address: "19501 FAIRPORT AVE",
  city: "Cleveland",
  state: "OH",
  zip: "44119",
  type: "Multifamily",
  status: "Renting",
  propertyInfo: {
    description: "Occupancy of 2 family 0 Commercial 0 Units",
    storyHeight: 2.5,
    yearBuilt: "1982",
    purchaseDate: "-",
    purchasePrice: "-",
    financeSource: "Quality 1... reoffice-s...",
    webListingDisplay: "-",
    heatType: "Gas, Landlord",
    yearRenovated: "-",
    maintenanceNotes: "heat",
    reserveAmount: "Type N/AREP/MSTR",
    reserveFloorSize: "1,688 SQ FT",
    depositBankAccount: "-",
    marketRent: "N/A",
    rentControl: "-",
    lotSize: "-",
    livingArea: "1,300",
    livingArea2: "1,450",
    averageRent: "887.50",
    taxAuthority: "-",
    accountNumber: "-",
    yearTaxBill: "NA",
    managementStartDate: "07/06/2024",
    managementEndDate: "-",
    screeningFeeRequired: "$40.00",
    petScreeningRequired: "Included ■",
    holdingDepositAmount: "-",
  },
  rentalInfo: {
    minLease: "60 mo",
    maxLease: "84 mo",
    priceRangeMin: "-",
    priceRangeMax: "-",
  },
  amenities: {
    catsAllowed: true,
    dogsAllowed: true,
  },
  units: [
    {
      unit: "DN",
      bdba: "-",
      tenant: "",
      status: "Occupied",
      monthlyRent: "$880.00",
      leaseEnd: "Month-to-Month, expiring 02/28/2078",
      rent: "$880.00",
    },
    {
      unit: "UP",
      bdba: "-",
      tenant: "Jeff Mcjunkin",
      status: "Occupied",
      monthlyRent: "$895.00",
      leaseEnd: "01/31/2025",
      rent: "$895.00",
    },
  ],
  marketingInfo: {
    propertyMarketingName: "-",
    propertyListingName: "-",
    webListingDisplay: "No",
    unitLevelMarketingEnabled: "No",
  },
  leaseSettings: {
    leaseGenerationMethod: "AppFolio Lease - templates",
    defaultNewLeaseTemplate: {
      leaseTemplate: "-",
      addendaTemplates: "-",
      leaseChargeDate: "-",
    },
    defaultRenewalTemplate: {
      leaseTemplate: "-",
      addendaTemplates: "-",
      leaseChargeDate: "-",
    },
    defaultRenewalMonthToMonth: {
      leaseTemplate: "-",
      leaseChargeDate: "-",
    },
    defaultRenewalRollover: {
      leaseTemplate: "→ Release Notice Label",
      renewalSignOrder: "None",
      daysUntilExpiry: "N/A",
      autoRenewFees: "N/A",
    },
  },
  ownersAndFinancials: {
    ownershipStartDate: "-",
    owners: [
      {
        name: "19501 Fairport Rd LLC",
        percentOwned: "100%",
        contactOwner: "",
        contractPayable: "✓",
        email: "irtaza@fairport.com",
        phone: "(310) 555-1234",
      },
    ],
    payoutType: "Net Income",
    reserve: "0.00",
    reserveWithheld: "-",
    balanceType: "Liable Management Company Owned Lien/Mortgage",
    creditLimit: "$0.00",
    applyToProperty: "-",
  },
  managementFees: [
    {
      label: "Jul 2024 - (No End Date)",
      managementFee: "8%",
      whenVacant: "Waived",
      minimumFee: "$130.00",
      maximumFee: "-",
    },
  ],
  additionalFees: {
    leaseFee: { type: "Flat(per)", perUnit: "$822.5" },
    moveOutFee: { type: "Flat(per)", perUnit: "—" },
    renewalFeeR: { type: "Flat(per)", perUnit: "$0.00" },
    additionalFeesList: [
      { account: "1040 - Additional Fee Income", type: "$0.00 % Application Fee Income", expenses: "Yes" },
    ],
  },
  lateFeePolicy: {
    currentPolicy: "Flat fee of $75.00",
    daysDue: "-",
    chargesOption: "Starting With Late",
    dailyAmount: "-",
    dueDate: "Late fees end of on 1 days",
    gracePeriod: "$5.00",
  },
  budgets: {
    budgetReference: "12/31/2024",
    annualizedYTD: "✓",
  },
  keys: [],
  maintenanceInfo: {
    maintenanceListLink: "900.00",
    requiredLicenses: "-",
    mailingAddress: "No",
    unitLaborReimbursementRate: "No",
  },
  fixedAssets: [],
  utilityBilling: {
    enabled: false,
    message: "None of the units have been enabled for utility billing.",
  },
  propertyGroups: {
    propertyGroups: "All",
  },
  statementSettings: {
    customStatementDescription: "N/A",
    includeOwnerInOppCharges: "Yes",
    includeReserveAccount: "No",
    excludeOwnerStatement: "No",
    combineUnitDetails: "—",
    textPreferences: "All Billable Changes",
    includePaymentVoid: "-",
    ownerStatementRuntTime: "-",
    showMissingRentBasedOnDaysOnUnitStatement: "Yes",
  },
  bankAccounts: [
    {
      type: "001 - Cash in Bank",
      account: "Operating Account (Wells Fargo)",
      payments: "0001 (04045)",
      primaryRestricted: "✓",
    },
    {
      type: "999 - Lienees Susp",
      account: "Operating Account (Wells Fargo)",
      payments: "0001 (XXXXXX5)",
      primaryRestricted: "-",
    },
  ],
  photos: [],
  marketingPhotos: [],
  notes: [],
  auditLog: [
    {
      date: "03/06/2024 8:26 PM",
      action: 'Created Property "Seth Abman" 19501 FAIRPORT AVE',
      user: "Change History",
    },
  ],
  attachments: [],
}

export const PROPERTY_TASKS = [
  {
    id: 1,
    title: "Schedule annual property inspection",
    description: "Coordinate with tenant for annual property inspection",
    assignedTo: "Sarah Johnson",
    dueDate: "2025-12-15",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Review lease renewal for Unit UP",
    description: "Review and prepare lease renewal documents for Jeff Mcjunkin",
    assignedTo: "Mike Davis",
    dueDate: "2025-01-15",
    status: "Pending",
  },
  {
    id: 3,
    title: "HVAC maintenance check",
    description: "Schedule routine HVAC maintenance before winter",
    assignedTo: "Richard Surovi",
    dueDate: "2025-12-10",
    status: "Completed",
  },
  {
    id: 4,
    title: "Update property insurance",
    description: "Review and update property insurance policy",
    assignedTo: "Sarah Johnson",
    dueDate: "2025-12-20",
    status: "Pending",
  },
]

export const STAFF_MEMBERS = [
  { id: "1", name: "Laura Taylor", role: "Property Manager" },
  { id: "2", name: "Mike Johnson", role: "Leasing Agent" },
  { id: "3", name: "Jane Doe", role: "Accountant" },
  { id: "4", name: "John Smith", role: "Maintenance Coordinator" },
  { id: "5", name: "Sarah Williams", role: "Admin Assistant" },
]

export const DOCUMENT_TYPES = [
  "Lease Agreement",
  "Insurance",
  "Financial Document",
  "Property Image",
  "Inspection Report",
  "Tax Document",
  "Other",
]

export const SAMPLE_DOCUMENTS = [
  {
    id: "1",
    name: "Lease_Agreement_Unit_UP.pdf",
    type: "Lease Agreement",
    uploadedDate: "Jan 15, 2026",
    uploadedBy: "Sarah Johnson",
    assignedTo: "Mike Johnson",
  },
  {
    id: "2",
    name: "Property_Insurance_2026.pdf",
    type: "Insurance",
    uploadedDate: "Jan 10, 2026",
    uploadedBy: "Mike Davis",
    assignedTo: null,
  },
  {
    id: "3",
    name: "Annual_Inspection_Report.pdf",
    type: "Inspection Report",
    uploadedDate: "Jan 8, 2026",
    uploadedBy: "Richard Surovi",
    assignedTo: "Laura Taylor",
  },
  {
    id: "4",
    name: "Tax_Assessment_2025.pdf",
    type: "Tax Document",
    uploadedDate: "Jan 5, 2026",
    uploadedBy: "Nina Patel",
    assignedTo: null,
  },
  {
    id: "5",
    name: "Property_Photos_Exterior.zip",
    type: "Property Image",
    uploadedDate: "Jan 3, 2026",
    uploadedBy: "Sarah Johnson",
    assignedTo: "Jane Doe",
  },
]

export const FEDERAL_TAX_INFO = {
  taxpayerName: "Irtaza Ali khan",
  taxpayerId: "XXX-XX-9999",
  taxFormAccountNumber: "T81908155614330 9062",
  send1099: "Yes",
  ownerConsentedElectronic1099: "No",
  sending1099Preference: "Paper & Electronic",
}

export const ACCOUNTING_INFO = {
  checkConsolidation: "All bills on single check (hide extra stub detail)",
  checkStubBreakdown: "List each bill detail line item (expanded view)",
  holdPayments: "No",
  emailECheckReceipt: "Yes",
  defaultCheckMemo: "--",
}

export const BANK_ACCOUNT_INFO = {
  ownerPaidByACH: "No",
  bankRoutingNumber: "--",
  bankAccountNumber: "--",
  savingsAccount: "No",
}

export const OWNER_STATEMENT_INFO = {
  showTransactionsDetail: "Yes",
  showUnpaidBillsDetail: "Yes",
  showTenantNames: "Yes",
  showSummary: "Yes",
  separateManagementFeesFromCashOut: "No",
  consolidateInHouseWorkOrderBillLineItems: "No",
  notesForTheOwner: "--",
}

export const OWNER_PACKET_INFO = {
  sendViaEmail: "Yes",
  includePaidWorkOrders: "No",
  includePaidWorkOrdersAttachments: "No",
  includePaidBillsAttachments: "No",
  glAccountMap: "None",
  includedReports: "Owner Statement (Enhanced)",
}

export const MAINTENANCE_INFO_EXTENDED = {
  ownerSpecificNotes: "Need fix technicians for each property",
}

export const PROPERTY_AUDIT_LOGS = [
  {
    id: "1",
    dateTime: "Jan 18, 2026 – 10:42 AM",
    user: "Sarah M",
    userRole: "CSR",
    actionType: "Updated",
    entity: "Property Info",
    description: "Updated heat type from 'Electric' to 'Gas, Landlord'",
    source: "Web App",
  },
  {
    id: "2",
    dateTime: "Jan 17, 2026 – 3:15 PM",
    user: "System",
    userRole: "Automation",
    actionType: "Status Changed",
    entity: "Property Status",
    description: "Property status changed from 'Available' to 'Renting'",
    source: "System Automation",
  },
  {
    id: "3",
    dateTime: "Jan 16, 2026 – 11:30 AM",
    user: "Mike D",
    userRole: "Property Manager",
    actionType: "Created",
    entity: "Attachments",
    description: "Uploaded insurance certificate document",
    source: "Web App",
  },
  {
    id: "4",
    dateTime: "Jan 15, 2026 – 2:45 PM",
    user: "Nina P",
    userRole: "Admin",
    actionType: "Updated",
    entity: "Owner Info",
    description: "Updated owner payout type to 'Direct Deposit'",
    source: "Web App",
  },
  {
    id: "5",
    dateTime: "Jan 14, 2026 – 9:20 AM",
    user: "Richard S",
    userRole: "Leasing Agent",
    actionType: "Assignment Changed",
    entity: "Tasks",
    description: "Reassigned task 'Schedule property inspection' to Sarah M",
    source: "Mobile App",
  },
  {
    id: "6",
    dateTime: "Jan 12, 2026 – 4:30 PM",
    user: "Sarah M",
    userRole: "CSR",
    actionType: "Created",
    entity: "Units",
    description: "Added new unit 'UP' to property",
    source: "Web App",
  },
  {
    id: "7",
    dateTime: "Jan 10, 2026 – 10:15 AM",
    user: "Mike D",
    userRole: "Property Manager",
    actionType: "Updated",
    entity: "Notes",
    description: "Edited maintenance notes for property",
    source: "Web App",
  },
  {
    id: "8",
    dateTime: "Jan 8, 2026 – 1:00 PM",
    user: "Nina P",
    userRole: "Admin",
    actionType: "Viewed",
    entity: "Property Profile",
    description: "Viewed property details page",
    source: "Web App",
  },
  {
    id: "9",
    dateTime: "Jan 5, 2026 – 11:45 AM",
    user: "System",
    userRole: "Automation",
    actionType: "Created",
    entity: "Property",
    description: "Property created via import from CSV file",
    source: "System Automation",
  },
  {
    id: "10",
    dateTime: "Jan 3, 2026 – 9:00 AM",
    user: "Richard S",
    userRole: "Leasing Agent",
    actionType: "Updated",
    entity: "Banking Info",
    description: "Added bank account ending in ****4521",
    source: "Web App",
  },
]

export const ACTIVITY_LABELS = [
  { id: "1", name: "MOVE IN", color: "blue" },
  { id: "2", name: "MOVE OUT", color: "red" },
  { id: "3", name: "INSPECTION", color: "amber" },
  { id: "4", name: "RENEWAL", color: "emerald" },
  { id: "5", name: "MAINTENANCE", color: "purple" },
]

