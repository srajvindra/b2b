import type { CSRPortfolio } from "../types"

export const ROLE_COLUMNS = [
  "Process Owner",
  "Accountant",
  "Acquisition Manager",
  "Agent",
  "AGM",
  "BC",
  "CEO",
  "CSM",
  "HR Executive",
  "HR Manager",
  "Lead Coordinator",
  "Lead Owner",
]

export const INITIAL_CSR_DATA: CSRPortfolio[] = [
  { id: "csr1", name: "CSR - Kendra Portfolio", assignments: { "Process Owner": "10", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "8", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr2", name: "CSR - Jenna Portfolio", assignments: { "Process Owner": "11", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "9", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr3", name: "CSR - Henry Portfolio", assignments: { "Process Owner": "12", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "8", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr4", name: "CSR - Jace Portfolio", assignments: { "Process Owner": "13", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "8", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr5", name: "CSR - Ashton Portfolio", assignments: { "Process Owner": "14", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "8", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr6", name: "CSR - Legna Portfolio", assignments: { "Process Owner": "15", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "9", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr7", name: "CSR - Jason Portfolio", assignments: { "Process Owner": "16", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "9", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
  { id: "csr8", name: "PH - Seth Portfolio", assignments: { "Process Owner": "17", Accountant: "7", "Acquisition Manager": null, Agent: null, AGM: "9", BC: "7", CEO: null, CSM: null, "HR Executive": null, "HR Manager": null, "Lead Coordinator": null, "Lead Owner": null } },
]
