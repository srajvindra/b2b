import type { ProcessType, ProcessInstance, SavedView } from "../types"

export const initialProcessTypes: ProcessType[] = [
  { id: "1", name: "2 Property Onboarding Process", isDraft: false, stages: 7 },
  { id: "2", name: "Accounting Mistakes", isDraft: true, stages: 4 },
  { id: "3", name: "Applications screening process", isDraft: false, stages: 11 },
  { id: "4", name: "Delinquency Process", isDraft: false, stages: 10 },
  { id: "5", name: "Employee Onboarding Process", isDraft: false, stages: 5 },
  { id: "6", name: "Employee Termination Process", isDraft: true, stages: 3 },
  { id: "7", name: "Employee Training Process", isDraft: true, stages: 21 },
  { id: "8", name: "EOM Accounting Process for Month", isDraft: true, stages: 4 },
  { id: "9", name: "Escalated Owner Funds Collection Process", isDraft: true, stages: 5 },
  { id: "10", name: "Eviction Process", isDraft: false, stages: 10 },
  { id: "11", name: "Haro PM", isDraft: true, stages: 3 },
  { id: "12", name: "Hiring Requisition Process", isDraft: true, stages: 8 },
  { id: "13", name: "Lease Renewal Process", isDraft: false, stages: 10 },
  { id: "14", name: "Legal Cases Complaints and Notices", isDraft: true, stages: 8 },
  { id: "15", name: "Make Ready Process", isDraft: false, stages: 9 },
]

export const initialProcessInstances: ProcessInstance[] = [
  { id: "p1", name: "Property Onboarding for 1903 W Grand Ave", property: "1903 W Grand Ave, Dayton, OH, 45402", onTrack: "no_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Devin Clarke", dueAt: "3/4/26 8:00 PM", createdAt: "2/12/26 8:46 AM", relatedEntity: { type: "Owner", name: "John Martinez" }, processType: "Property Onboarding Process", status: "In-Progress", assignedTeam: "Daniel Team", lastTouched: "2/12/26 8:46 AM" },
  { id: "p2", name: "Make Ready for 3715 W 39th St - DN Unit", property: "3715 W 39th St, Cleveland, OH, 44109 - Unit #DN Unit", onTrack: "no_overdue", stage: "Inspection & Estimation", assignee: "Zam", dueAt: "2/27/26 6:00 PM", createdAt: "2/12/26 5:34 AM", relatedEntity: { type: "Property", name: "3715 W 39th St" }, processType: "Make Ready Process", status: "In-Progress", assignedTeam: "Tee Team", lastTouched: "2/12/26 5:34 AM" },
  { id: "p3", name: "Owner Onboarding Process for Gilbert Victorino", property: "3988 W 48th St., Cleveland Ohio 44102", onTrack: "tasks_overdue", stage: "Info Collection & Onboarding", assignee: "Monica Shaw", dueAt: "2/20/28 6:00 PM", createdAt: "1/30/26 4:37 PM", relatedEntity: { type: "Owner", name: "Gilbert Victorino" }, processType: "Owner Onboarding Process", status: "Overdue", assignedTeam: "Seth Team", lastTouched: "1/30/26 4:37 PM" },
  { id: "p4", name: "Eviction Process for 13701 CLAIBORNE RD - Down unit", property: "13701 CLAIBORNE RD - 13701 CLAIBORNE RD, East Cleveland, OH, 44112 - Unit...", onTrack: "tasks_overdue", stage: "Filing Fee Eviction", assignee: "Tabitha Allan", dueAt: "2/31/26 6:00 PM", createdAt: "1/30/26 10:19 AM", relatedEntity: { type: "Tenant", name: "James Wilson" }, processType: "Eviction Process", status: "Overdue", assignedTeam: "Bisma Team", lastTouched: "1/30/26 10:19 AM" },
  { id: "p5", name: "Property Onboarding for 10314 HARVARD AVE, CLEVELAND, OH 44105", property: "10314 HARVARD AVE, CLEVELAND, OH 44105", onTrack: "no_overdue", stage: "Information & Add Property In AF", assignee: "Tabitha Allan", dueAt: "3/31/26 6:00 PM", createdAt: "1/30/26 11:00 AM", relatedEntity: { type: "Owner", name: "Sarah Chen" }, processType: "Property Onboarding Process", status: "In-Progress", assignedTeam: "Daniel Team", lastTouched: "1/30/26 11:00 AM" },
  { id: "p6", name: "Lease Renewal for 4648 E. 173rd St.", property: "4648 E. 173rd St., Cleveland, OH, 44128 - 4648 E. 173rd St.., Cleveland., OH...", onTrack: "overdue_date", overdueDate: "Dec 9 '25", stage: "Upcoming", assignee: "Mason Ryan", dueAt: "12/5/25 6:00 PM", createdAt: "9/12/26 10:06 AM", relatedEntity: { type: "Tenant", name: "Emily Davis" }, processType: "Lease Renewal Process", status: "Overdue", assignedTeam: "Tee Team", lastTouched: "9/12/26 10:06 AM" },
  { id: "p7", name: "Lease Renewal for 10502 Lamontier Ave - DN unit", property: "10502 Lamontier Ave., Cleveland., OH, 44104 - Unit #DN unit", onTrack: "overdue_date", overdueDate: "Jan 18 '26", stage: "Upcoming", assignee: "Kevn Rojs", dueAt: "1/18/26 6:00 PM", createdAt: "1/29/26 4:45 PM", relatedEntity: { type: "Tenant", name: "Michael Brown" }, processType: "Lease Renewal Process", status: "Overdue", assignedTeam: "Seth Team", lastTouched: "1/29/26 4:45 PM" },
  { id: "p8", name: "Eviction Process for 1355-57 WEST BLVD - Unit 3 - Third Floor", property: "1355-57 WEST BLVD, OHIO CLEVELAND, OH, 44102 - Unit #Unit...", onTrack: "tasks_overdue", stage: "Filing For Eviction", assignee: "Jason Egerton", dueAt: "3/30/26 6:00 PM", createdAt: "1/28/26 4:40 PM", relatedEntity: { type: "Tenant", name: "Robert Johnson" }, processType: "Eviction Process", status: "Overdue", assignedTeam: "Bisma Team", lastTouched: "1/28/26 4:40 PM" },
  { id: "p9", name: "Property Onboarding for 10404 South Blvd, Cleveland, Ohio 44108", property: "10404 South Blvd, Cleveland, Ohio 44108", onTrack: "tasks_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Rose Avery", dueAt: "3/30/26 6:00 PM", createdAt: "1/29/26 3:53 PM", relatedEntity: { type: "Prospect", name: "David Lee" }, processType: "Property Onboarding Process", status: "Overdue", assignedTeam: "Daniel Team", lastTouched: "1/29/26 3:53 PM" },
  { id: "p10", name: "Lease Renewal for 8814 Vineyard Ave - 8814 Vineyard Ave - Up", property: "8814 Vineyard Ave, Cleveland., OH, 44105 - Unit #8814 Vineyard Ave - Up", onTrack: "overdue_date", overdueDate: "Jul 8 '25", stage: "Send Lease", assignee: "Kevn Rojs", dueAt: "7/8/25 6:00 PM", createdAt: "1/29/26 3:50 PM", relatedEntity: { type: "Tenant", name: "Jennifer White" }, processType: "Lease Renewal Process", status: "Overdue", assignedTeam: "Tee Team", lastTouched: "1/29/26 3:50 PM" },
  { id: "p11", name: "Property Onboarding for 6703 Elwell Ave, Cleveland, Ohio 44104", property: "9703 Elwell Ave, Cleveland, Ohio 44104", onTrack: "tasks_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Rose Avery", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 3:41 PM", relatedEntity: { type: "Owner", name: "Thomas Anderson" }, processType: "Property Onboarding Process", status: "Overdue", assignedTeam: "Seth Team", lastTouched: "1/29/26 3:41 PM" },
  { id: "p12", name: "Property Termination for 8010 CORY AVE", property: "8010 CORY AVE, Cleveland, OH, 44103", onTrack: "tasks_overdue", stage: "Owner Account", assignee: "Brett Anderson", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 2:42 PM", relatedEntity: { type: "Property", name: "8010 CORY AVE" }, processType: "Property Termination Process", status: "Overdue", assignedTeam: "Bisma Team", lastTouched: "1/29/26 2:42 PM" },
  { id: "p13", name: "Property Termination for 4 Privat Drive", property: "4 Privat Drive, Little Whinging, South Dakota, 57326", onTrack: "tasks_overdue", stage: "Tenants Accounts", assignee: "Amanda Harris", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 2:26 PM", relatedEntity: { type: "Property", name: "4 Privat Drive" }, processType: "Property Termination Process", status: "Overdue", assignedTeam: "Daniel Team", lastTouched: "1/29/26 2:26 PM" },
  { id: "p14", name: "Property Onboarding for 12003 SAYWELL AVE, CLEVELAND, OH 44108", property: "12003 SAYWELL AVE - 12003 SAYWELL AVE, CLEVELAND, OH 44108, Clevela...", onTrack: "tasks_overdue", stage: "Collecting Information & Add Property In AF", assignee: "Aiden Brooks", dueAt: "3/2/26 6:00 PM", createdAt: "1/29/26 1:18 PM", relatedEntity: { type: "Owner", name: "Lisa Garcia" }, processType: "Property Onboarding Process", status: "Overdue", assignedTeam: "Tee Team", lastTouched: "1/29/26 1:18 PM" },
  { id: "p15", name: "Delinquency Process for Unit 5A", property: "1234 Main St, Cleveland, OH 44101", onTrack: "tasks_overdue", stage: "Late Notice Sent", assignee: "Monica Shaw", dueAt: "2/15/26 6:00 PM", createdAt: "1/25/26 9:00 AM", relatedEntity: { type: "Tenant", name: "Chris Taylor" }, processType: "Delinquency Process", status: "In-Progress", assignedTeam: "Seth Team", lastTouched: "2/1/26 3:00 PM" },
  { id: "p16", name: "Owner Onboarding for Patricia Mills", property: "5678 Oak Ave, Cleveland, OH 44102", onTrack: "no_overdue", stage: "Welcome Call", assignee: "Devin Clarke", dueAt: "3/1/26 6:00 PM", createdAt: "2/10/26 2:00 PM", relatedEntity: { type: "Owner", name: "Patricia Mills" }, processType: "Owner Onboarding Process", status: "Open", assignedTeam: "Daniel Team", lastTouched: "2/10/26 2:00 PM" },
]

export const teamTabs = [
  { id: "assigned", label: "Active: Assigned To Me" },
  { id: "daniel", label: "Daniel Team" },
  { id: "tee", label: "Tee Team" },
  { id: "seth", label: "Seth Team" },
  { id: "bisma", label: "Bisma Team" },
  { id: "custom", label: "Custom" },
]

export const availableStages = [
  "Collecting Information & Add Property In AF",
  "Info Collection & Onboarding",
  "Inspection & Estimation",
  "Filing Fee Eviction",
  "Filing For Eviction",
  "Upcoming",
  "Send Lease",
  "Owner Account",
  "Tenants Accounts",
  "Communication For Funds Contribution - Active",
  "Start Process For Section 8/EDEN Residents",
  "Scheduling - Pre Move Out",
]

export const availableAssignees = [
  "Devin Clarke",
  "Zam",
  "Monica Shaw",
  "Tabitha Allan",
  "Mason Ryan",
  "Kevn Rojs",
  "Jason Egerton",
  "Rose Avery",
  "Brett Anderson",
  "Amanda Harris",
  "Aiden Brooks",
  "Michael Drew",
  "Ralph",
]

export const teams = [
  { id: "daniel", name: "Daniel Team" },
  { id: "tee", name: "Tee Team" },
  { id: "seth", name: "Seth Team" },
  { id: "bisma", name: "Bisma Team" },
]

export const folders = [
  { id: "onboarding", name: "Onboarding" },
  { id: "termination", name: "Termination" },
  { id: "renewal", name: "Lease Renewal" },
  { id: "eviction", name: "Eviction" },
]

export const initialSavedViews: SavedView[] = [
  { id: "v1", name: "My Overdue Processes", filters: [{ type: "status", value: "Overdue", label: "Overdue" }, { type: "assignee", value: "Devin Clarke", label: "Devin Clarke" }] },
  { id: "v2", name: "Leasing Team - In Progress", filters: [{ type: "assignedTeam", value: "Tee Team", label: "Tee Team" }, { type: "status", value: "In-Progress", label: "In-Progress" }] },
  { id: "v3", name: "All Open Tasks", filters: [{ type: "status", value: "Open", label: "Open" }] },
]

export const availableProcessTypes = [
  "Property Onboarding Process",
  "Owner Onboarding Process",
  "Lease Renewal Process",
  "Eviction Process",
  "Make Ready Process",
  "Property Termination Process",
  "Delinquency Process",
]

export const availableProperties = [
  "1903 W Grand Ave, Dayton, OH, 45402",
  "3715 W 39th St, Cleveland, OH, 44109",
  "3988 W 48th St., Cleveland Ohio 44102",
  "13701 CLAIBORNE RD, East Cleveland, OH, 44112",
  "10314 HARVARD AVE, CLEVELAND, OH 44105",
  "4648 E. 173rd St., Cleveland, OH, 44128",
  "10502 Lamontier Ave., Cleveland., OH, 44104",
  "8010 CORY AVE, Cleveland, OH, 44103",
]
