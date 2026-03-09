"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, LayoutGrid, List, UserPlus, Settings, ChevronRight, ArrowLeft, FolderOpen, Plus, Users, TrendingUp, Filter, CalendarIcon, ChevronDown, X, RotateCcw, Workflow, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useNav, useView } from "@/components/dashboard-app"
import { BulkActionBar } from "@/components/bulk-action-bar"
import { TenantApplicationDetailView } from "@/components/leads-page/tenant-application-detail"
import OwnerDetailPage from "@/components/owner-detail-page"
import {
  type Lead,
  initialLeadsData,
  ownerStages,
  ownerType1Stages,
  ownerType2Stages,
  ownerType3Stages,
  ownerType4Stages,
  prospectType1Stages,
  prospectType2Stages,
  prospectType3Stages,
  prospectType4Stages,
  getStageCardStyle,
  getStageBadgeStyle,
} from "./leads-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// List of assignees for filter
const ASSIGNEES = [
  { id: "sarah-johnson", name: "Sarah Johnson" },
  { id: "mike-davis", name: "Mike Davis" },
  { id: "richard-surovi", name: "Richard Surovi" },
  { id: "emily-brown", name: "Emily Brown" },
  { id: "nina-patel", name: "Nina Patel" },
  { id: "laura-taylor", name: "Laura Taylor" },
]

// List of sources for filter
const SOURCES = [
  "Website",
  "Referral",
  "Cold Call",
  "LinkedIn",
  "Agent Network",
  "AppFolio Import",
  "AppFolio",
  "Database",
  "Global Investments",
]

// Email sent ranges for filter
const EMAIL_SENT_RANGES = [
  { id: "0", name: "0 emails" },
  { id: "1-5", name: "1-5 emails" },
  { id: "6-10", name: "6-10 emails" },
  { id: "10+", name: "10+ emails" },
]

// Units values for filter (specific values, not ranges)
const UNITS_VALUES = [
  { id: "1", name: "1", value: 1 },
  { id: "2", name: "2", value: 2 },
  { id: "4", name: "4", value: 4 },
  { id: "8", name: "8", value: 8 },
  { id: "12", name: "12", value: 12 },
]

// Last Touch date ranges for filter
const LAST_TOUCH_RANGES = [
  { id: "today", name: "Today" },
  { id: "last-7-days", name: "Last 7 Days" },
  { id: "last-month", name: "Last Month" },
  { id: "last-3-months", name: "Last 3 Months" },
]

// Created date ranges for filter
const CREATED_RANGES = [
  { id: "today", name: "Today" },
  { id: "last-7-days", name: "Last 7 Days" },
  { id: "last-month", name: "Last Month" },
  { id: "last-3-months", name: "Last 3 Months" },
]

const OWNER_CATEGORIES = [
  { id: "acquisition-leads", name: "Acquisition Leads", count: 12, color: "bg-teal-600" },
  { id: "acquisition-owners", name: "Acquisition Owners", count: 8, color: "bg-teal-600" },
  { id: "agents-referral", name: "Agents Referral", count: 5, color: "bg-teal-600" },
  { id: "appfolio-owner-contracts", name: "AppFolio Owner Contracts", count: 15, color: "bg-teal-600" },
  { id: "appfolio-tenant-applicants", name: "AppFolio Tenant Applicants", count: 23, color: "bg-teal-600" },
  { id: "appfolio-tenants", name: "AppFolio Tenants", count: 45, color: "bg-teal-600" },
  { id: "appfolio-vendors", name: "AppFolio Vendors", count: 18, color: "bg-teal-600" },
  { id: "global-investments-leads", name: "Global Investments Leads", count: 7, color: "bg-teal-600" },
  { id: "new-owner-leads", name: "New Owner Leads", count: 34, color: "bg-teal-600" },
  { id: "new-tenant-leads", name: "New Tenant Leads", count: 28, color: "bg-teal-600" },
  { id: "new-tenants", name: "NEW TENANTS", count: 19, color: "bg-teal-600" },
  { id: "new-tenants-leads", name: "NEW TENANTS LEADS", count: 16, color: "bg-teal-600" },
  { id: "new-vendor-leads", name: "New Vendor Leads", count: 9, color: "bg-teal-600" },
  { id: "pmc-leads", name: "PMC Leads", count: 11, color: "bg-teal-600" },
  { id: "realty-buyer-leads", name: "Realty Buyer Leads", count: 14, color: "bg-teal-600" },
  { id: "realty-seller-leads", name: "Realty Seller Leads", count: 21, color: "bg-teal-600" },
]

// Lease Prospect Categories - mirrors Owner Categories
const PROSPECT_CATEGORIES = [
  { id: "acquisition-leads", name: "Acquisition Leads", count: 10, color: "bg-teal-600" },
  { id: "acquisition-prospects", name: "Acquisition Prospects", count: 6, color: "bg-teal-600" },
  { id: "agents-referral", name: "Agents Referral", count: 4, color: "bg-teal-600" },
  { id: "appfolio-owner-contracts", name: "AppFolio Owner Contracts", count: 12, color: "bg-teal-600" },
  { id: "appfolio-tenant-applicants", name: "AppFolio Tenant Applicants", count: 18, color: "bg-teal-600" },
  { id: "appfolio-tenants", name: "AppFolio Tenants", count: 35, color: "bg-teal-600" },
  { id: "appfolio-vendors", name: "AppFolio Vendors", count: 14, color: "bg-teal-600" },
  { id: "global-investments-leads", name: "Global Investments Leads", count: 5, color: "bg-teal-600" },
  { id: "new-prospect-leads", name: "New Prospect Leads", count: 28, color: "bg-teal-600" },
  { id: "new-tenant-leads", name: "New Tenant Leads", count: 22, color: "bg-teal-600" },
  { id: "new-tenants", name: "NEW TENANTS", count: 15, color: "bg-teal-600" },
  { id: "new-tenants-leads", name: "NEW TENANTS LEADS", count: 12, color: "bg-teal-600" },
  { id: "new-vendor-leads", name: "New Vendor Leads", count: 7, color: "bg-teal-600" },
  { id: "pmc-leads", name: "PMC Leads", count: 9, color: "bg-teal-600" },
  { id: "realty-buyer-leads", name: "Realty Buyer Leads", count: 11, color: "bg-teal-600" },
  { id: "realty-seller-leads", name: "Realty Seller Leads", count: 17, color: "bg-teal-600" },
]

const CATEGORY_LEADS: Record<string, Lead[]> = {
  "acquisition-leads": [
    {
      id: 1001,
      name: "Robert Chen",
      userType: "Property Owner",
      property: "456 Oak Avenue",
      stage: "New lead",
      assignedTo: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "robert.chen@email.com",
      createdAt: "01/10/2026",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Voicemail",
      nextFollowUp: "01/15/2026",
      category: "acquisition-leads",
      emailsSent: 3,
      deals: 0,
      nextAction: "Follow-up call",
      source: "Website",
      lastTouch: "01/12/2026",
    },
    {
      id: 1002,
      name: "Amanda Foster",
      userType: "Investor",
      property: "789 Pine Street",
      stage: "Attempting to contact",
      assignedTo: "Mike Davis",
      phone: "(555) 234-5678",
      email: "amanda.f@email.com",
      createdAt: "01/08/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 4,
      lastCallStatus: "Connected",
      nextFollowUp: "01/14/2026",
      category: "acquisition-leads",
      emailsSent: 5,
      deals: 1,
      nextAction: "Send proposal",
      source: "Referral",
      lastTouch: "01/11/2026",
    },
    {
      id: 1003,
      name: "David Martinez",
      userType: "Property Owner",
      property: "321 Elm Drive",
      stage: "Scheduled Intro call",
      assignedTo: "Sarah Johnson",
      phone: "(555) 345-6789",
      email: "d.martinez@email.com",
      createdAt: "01/05/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Scheduled",
      nextFollowUp: "01/13/2026",
      category: "acquisition-leads",
      emailsSent: 2,
      deals: 0,
      nextAction: "Intro call",
      source: "Cold Call",
      lastTouch: "01/10/2026",
    },
    {
      id: 1004,
      name: "Lisa Thompson",
      userType: "Investor",
      property: "555 Maple Lane",
      stage: "Working",
      assignedTo: "Richard Surovi",
      phone: "(555) 456-7890",
      email: "lisa.t@email.com",
      createdAt: "01/02/2026",
      unitDetails: "Commercial",
      numberOfUnits: 2,
      lastCallStatus: "Follow-up needed",
      nextFollowUp: "01/12/2026",
      category: "acquisition-leads",
      emailsSent: 8,
      deals: 2,
      nextAction: "Contract review",
      source: "LinkedIn",
      lastTouch: "01/09/2026",
    },
    {
      id: 1005,
      name: "James Wilson",
      userType: "Property Owner",
      property: "888 Cedar Court",
      stage: "Closing",
      assignedTo: "Mike Davis",
      phone: "(555) 567-8901",
      email: "j.wilson@email.com",
      createdAt: "12/28/2025",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Closing call",
      nextFollowUp: "01/11/2026",
      category: "acquisition-leads",
      emailsSent: 12,
      deals: 1,
      nextAction: "Sign contract",
      source: "Website",
      lastTouch: "01/08/2026",
    },
    // Additional Owner Prospect leads (1006-1055) to reach ~50 total
    { id: 1006, name: "Patricia Moore", userType: "Property Owner", property: "234 Birch Lane", stage: "New lead", assignedTo: "Sarah Johnson", phone: "(555) 678-9012", email: "p.moore@email.com", createdAt: "01/11/2026", unitDetails: "Multi-Family", numberOfUnits: 3, lastCallStatus: "New inquiry", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Initial contact", source: "Website", lastTouch: "01/11/2026" },
    { id: 1007, name: "Michael Rodriguez", userType: "Investor", property: "567 Oak Street", stage: "Attempting to contact", assignedTo: "Mike Davis", phone: "(555) 789-0123", email: "m.rodriguez@email.com", createdAt: "01/09/2026", unitDetails: "Commercial", numberOfUnits: 2, lastCallStatus: "Left voicemail", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Second call", source: "Referral", lastTouch: "01/12/2026" },
    { id: 1008, name: "Jennifer Lee", userType: "Property Owner", property: "890 Pine Avenue", stage: "Scheduled Intro call", assignedTo: "Richard Surovi", phone: "(555) 890-1234", email: "j.lee@email.com", createdAt: "01/07/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Scheduled", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Intro call", source: "Cold Call", lastTouch: "01/10/2026" },
    { id: 1009, name: "William Brown", userType: "Investor", property: "123 Maple Drive", stage: "Working", assignedTo: "Sarah Johnson", phone: "(555) 901-2345", email: "w.brown@email.com", createdAt: "01/05/2026", unitDetails: "Multi-Family", numberOfUnits: 6, lastCallStatus: "In progress", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 7, deals: 1, nextAction: "Site visit", source: "LinkedIn", lastTouch: "01/09/2026" },
    { id: 1010, name: "Elizabeth Taylor", userType: "Property Owner", property: "456 Cedar Road", stage: "Closing", assignedTo: "Mike Davis", phone: "(555) 012-3456", email: "e.taylor@email.com", createdAt: "01/02/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Final review", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 10, deals: 1, nextAction: "Sign contract", source: "Website", lastTouch: "01/08/2026" },
    { id: 1011, name: "Christopher Davis", userType: "Investor", property: "789 Walnut Lane", stage: "New lead", assignedTo: "Richard Surovi", phone: "(555) 123-4568", email: "c.davis@email.com", createdAt: "01/12/2026", unitDetails: "Commercial", numberOfUnits: 4, lastCallStatus: "New inquiry", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "First call", source: "Referral", lastTouch: "01/12/2026" },
    { id: 1012, name: "Jessica Miller", userType: "Property Owner", property: "321 Spruce Court", stage: "Attempting to contact", assignedTo: "Sarah Johnson", phone: "(555) 234-5679", email: "j.miller@email.com", createdAt: "01/10/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "No answer", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Follow up call", source: "Cold Call", lastTouch: "01/13/2026" },
    { id: 1013, name: "Matthew Wilson", userType: "Investor", property: "654 Elm Boulevard", stage: "Scheduled Intro call", assignedTo: "Mike Davis", phone: "(555) 345-6780", email: "m.wilson@email.com", createdAt: "01/08/2026", unitDetails: "Multi-Family", numberOfUnits: 8, lastCallStatus: "Call scheduled", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Discovery call", source: "LinkedIn", lastTouch: "01/11/2026" },
    { id: 1014, name: "Ashley Anderson", userType: "Property Owner", property: "987 Ash Street", stage: "Working", assignedTo: "Richard Surovi", phone: "(555) 456-7891", email: "a.anderson@email.com", createdAt: "01/06/2026", unitDetails: "Condo", numberOfUnits: 2, lastCallStatus: "Engaged", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Send proposal", source: "Website", lastTouch: "01/10/2026" },
    { id: 1015, name: "Daniel Thomas", userType: "Investor", property: "246 Hickory Lane", stage: "Closing", assignedTo: "Sarah Johnson", phone: "(555) 567-8902", email: "d.thomas@email.com", createdAt: "01/03/2026", unitDetails: "Commercial", numberOfUnits: 3, lastCallStatus: "Contract review", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 11, deals: 2, nextAction: "Final signature", source: "Referral", lastTouch: "01/09/2026" },
    { id: 1016, name: "Sarah Jackson", userType: "Property Owner", property: "135 Willow Way", stage: "New lead", assignedTo: "Mike Davis", phone: "(555) 678-9013", email: "s.jackson@email.com", createdAt: "01/11/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "New", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Initial outreach", source: "Cold Call", lastTouch: "01/11/2026" },
    { id: 1017, name: "Andrew White", userType: "Investor", property: "468 Poplar Drive", stage: "Attempting to contact", assignedTo: "Richard Surovi", phone: "(555) 789-0124", email: "a.white@email.com", createdAt: "01/09/2026", unitDetails: "Multi-Family", numberOfUnits: 5, lastCallStatus: "Voicemail left", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Third attempt", source: "LinkedIn", lastTouch: "01/12/2026" },
    { id: 1018, name: "Emily Harris", userType: "Property Owner", property: "791 Beech Circle", stage: "Scheduled Intro call", assignedTo: "Sarah Johnson", phone: "(555) 890-1235", email: "e.harris@email.com", createdAt: "01/07/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Appointment set", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Conduct call", source: "Website", lastTouch: "01/10/2026" },
    { id: 1019, name: "Joshua Martin", userType: "Investor", property: "024 Cypress Road", stage: "Working", assignedTo: "Mike Davis", phone: "(555) 901-2346", email: "j.martin@email.com", createdAt: "01/05/2026", unitDetails: "Commercial", numberOfUnits: 2, lastCallStatus: "Active discussion", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 8, deals: 1, nextAction: "Property tour", source: "Referral", lastTouch: "01/09/2026" },
    { id: 1020, name: "Amanda Garcia", userType: "Property Owner", property: "357 Redwood Lane", stage: "Closing", assignedTo: "Richard Surovi", phone: "(555) 012-3457", email: "a.garcia@email.com", createdAt: "01/02/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Pending signature", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 9, deals: 1, nextAction: "Close deal", source: "Cold Call", lastTouch: "01/08/2026" },
    { id: 1021, name: "Ryan Thompson", userType: "Investor", property: "680 Sequoia Blvd", stage: "New lead", assignedTo: "Sarah Johnson", phone: "(555) 123-4569", email: "r.thompson@email.com", createdAt: "01/12/2026", unitDetails: "Multi-Family", numberOfUnits: 10, lastCallStatus: "Incoming inquiry", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "Qualify lead", source: "Website", lastTouch: "01/12/2026" },
    { id: 1022, name: "Megan Robinson", userType: "Property Owner", property: "913 Palm Avenue", stage: "Attempting to contact", assignedTo: "Mike Davis", phone: "(555) 234-5680", email: "m.robinson@email.com", createdAt: "01/10/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Busy", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Retry call", source: "LinkedIn", lastTouch: "01/13/2026" },
    { id: 1023, name: "Kevin Clark", userType: "Investor", property: "246 Magnolia Court", stage: "Scheduled Intro call", assignedTo: "Richard Surovi", phone: "(555) 345-6781", email: "k.clark@email.com", createdAt: "01/08/2026", unitDetails: "Commercial", numberOfUnits: 3, lastCallStatus: "Confirmed", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Introduction", source: "Referral", lastTouch: "01/11/2026" },
    { id: 1024, name: "Stephanie Lewis", userType: "Property Owner", property: "579 Dogwood Lane", stage: "Working", assignedTo: "Sarah Johnson", phone: "(555) 456-7892", email: "s.lewis@email.com", createdAt: "01/06/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Negotiating", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 7, deals: 0, nextAction: "Send terms", source: "Cold Call", lastTouch: "01/10/2026" },
    { id: 1025, name: "Brandon Walker", userType: "Investor", property: "802 Juniper Street", stage: "Closing", assignedTo: "Mike Davis", phone: "(555) 567-8903", email: "b.walker@email.com", createdAt: "01/03/2026", unitDetails: "Multi-Family", numberOfUnits: 4, lastCallStatus: "Final steps", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 12, deals: 2, nextAction: "Finalize", source: "Website", lastTouch: "01/09/2026" },
    { id: 1026, name: "Nicole Hall", userType: "Property Owner", property: "135 Sycamore Road", stage: "New lead", assignedTo: "Richard Surovi", phone: "(555) 678-9014", email: "n.hall@email.com", createdAt: "01/11/2026", unitDetails: "Condo", numberOfUnits: 2, lastCallStatus: "Fresh lead", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "First contact", source: "LinkedIn", lastTouch: "01/11/2026" },
    { id: 1027, name: "Justin Allen", userType: "Investor", property: "468 Chestnut Drive", stage: "Attempting to contact", assignedTo: "Sarah Johnson", phone: "(555) 789-0125", email: "j.allen@email.com", createdAt: "01/09/2026", unitDetails: "Commercial", numberOfUnits: 5, lastCallStatus: "Attempting", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Continue outreach", source: "Referral", lastTouch: "01/12/2026" },
    { id: 1028, name: "Rachel Young", userType: "Property Owner", property: "791 Alder Lane", stage: "Scheduled Intro call", assignedTo: "Mike Davis", phone: "(555) 890-1236", email: "r.young@email.com", createdAt: "01/07/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Meeting set", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Prep for call", source: "Cold Call", lastTouch: "01/10/2026" },
    { id: 1029, name: "Tyler King", userType: "Investor", property: "024 Laurel Boulevard", stage: "Working", assignedTo: "Richard Surovi", phone: "(555) 901-2347", email: "t.king@email.com", createdAt: "01/05/2026", unitDetails: "Multi-Family", numberOfUnits: 7, lastCallStatus: "In progress", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 6, deals: 1, nextAction: "Review docs", source: "Website", lastTouch: "01/09/2026" },
    { id: 1030, name: "Lauren Wright", userType: "Property Owner", property: "357 Cottonwood Ave", stage: "Closing", assignedTo: "Sarah Johnson", phone: "(555) 012-3458", email: "l.wright@email.com", createdAt: "01/02/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Almost done", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 10, deals: 1, nextAction: "Complete", source: "LinkedIn", lastTouch: "01/08/2026" },
    { id: 1031, name: "Aaron Scott", userType: "Investor", property: "680 Olive Street", stage: "New lead", assignedTo: "Mike Davis", phone: "(555) 123-4570", email: "a.scott@email.com", createdAt: "01/12/2026", unitDetails: "Commercial", numberOfUnits: 2, lastCallStatus: "New", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "Reach out", source: "Referral", lastTouch: "01/12/2026" },
    { id: 1032, name: "Heather Green", userType: "Property Owner", property: "913 Hazel Court", stage: "Attempting to contact", assignedTo: "Richard Surovi", phone: "(555) 234-5681", email: "h.green@email.com", createdAt: "01/10/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "No response", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Email follow up", source: "Cold Call", lastTouch: "01/13/2026" },
    { id: 1033, name: "Patrick Adams", userType: "Investor", property: "246 Linden Lane", stage: "Scheduled Intro call", assignedTo: "Sarah Johnson", phone: "(555) 345-6782", email: "p.adams@email.com", createdAt: "01/08/2026", unitDetails: "Multi-Family", numberOfUnits: 6, lastCallStatus: "Booked", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Host call", source: "Website", lastTouch: "01/11/2026" },
    { id: 1034, name: "Christina Baker", userType: "Property Owner", property: "579 Mulberry Road", stage: "Working", assignedTo: "Mike Davis", phone: "(555) 456-7893", email: "c.baker@email.com", createdAt: "01/06/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Active", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Discuss terms", source: "LinkedIn", lastTouch: "01/10/2026" },
    { id: 1035, name: "Derek Nelson", userType: "Investor", property: "802 Locust Avenue", stage: "Closing", assignedTo: "Richard Surovi", phone: "(555) 567-8904", email: "d.nelson@email.com", createdAt: "01/03/2026", unitDetails: "Commercial", numberOfUnits: 3, lastCallStatus: "Wrapping up", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 11, deals: 1, nextAction: "Sign papers", source: "Referral", lastTouch: "01/09/2026" },
    { id: 1036, name: "Michelle Carter", userType: "Property Owner", property: "135 Buckeye Blvd", stage: "New lead", assignedTo: "Sarah Johnson", phone: "(555) 678-9015", email: "m.carter@email.com", createdAt: "01/11/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Just added", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Call", source: "Cold Call", lastTouch: "01/11/2026" },
    { id: 1037, name: "Eric Mitchell", userType: "Investor", property: "468 Aspen Way", stage: "Attempting to contact", assignedTo: "Mike Davis", phone: "(555) 789-0126", email: "e.mitchell@email.com", createdAt: "01/09/2026", unitDetails: "Multi-Family", numberOfUnits: 4, lastCallStatus: "Trying", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Keep trying", source: "Website", lastTouch: "01/12/2026" },
    { id: 1038, name: "Amber Perez", userType: "Property Owner", property: "791 Basswood Lane", stage: "Scheduled Intro call", assignedTo: "Richard Surovi", phone: "(555) 890-1237", email: "a.perez@email.com", createdAt: "01/07/2026", unitDetails: "Condo", numberOfUnits: 2, lastCallStatus: "Set", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Call prep", source: "LinkedIn", lastTouch: "01/10/2026" },
    { id: 1039, name: "Sean Roberts", userType: "Investor", property: "024 Catalpa Court", stage: "Working", assignedTo: "Sarah Johnson", phone: "(555) 901-2348", email: "s.roberts@email.com", createdAt: "01/05/2026", unitDetails: "Commercial", numberOfUnits: 5, lastCallStatus: "Progressing", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 7, deals: 0, nextAction: "Send info", source: "Referral", lastTouch: "01/09/2026" },
    { id: 1040, name: "Tiffany Turner", userType: "Property Owner", property: "357 Hackberry Ave", stage: "Closing", assignedTo: "Mike Davis", phone: "(555) 012-3459", email: "t.turner@email.com", createdAt: "01/02/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Final", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 9, deals: 1, nextAction: "Complete deal", source: "Cold Call", lastTouch: "01/08/2026" },
    { id: 1041, name: "Greg Phillips", userType: "Investor", property: "680 Yellowwood Dr", stage: "New lead", assignedTo: "Richard Surovi", phone: "(555) 123-4571", email: "g.phillips@email.com", createdAt: "01/12/2026", unitDetails: "Multi-Family", numberOfUnits: 8, lastCallStatus: "New inquiry", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "Qualify", source: "Website", lastTouch: "01/12/2026" },
    { id: 1042, name: "Kimberly Campbell", userType: "Property Owner", property: "913 Blackgum Lane", stage: "Attempting to contact", assignedTo: "Sarah Johnson", phone: "(555) 234-5682", email: "k.campbell@email.com", createdAt: "01/10/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Attempting", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Try again", source: "LinkedIn", lastTouch: "01/13/2026" },
    { id: 1043, name: "Nathan Parker", userType: "Investor", property: "246 Sweetgum Road", stage: "Scheduled Intro call", assignedTo: "Mike Davis", phone: "(555) 345-6783", email: "n.parker@email.com", createdAt: "01/08/2026", unitDetails: "Commercial", numberOfUnits: 2, lastCallStatus: "Scheduled", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Intro", source: "Referral", lastTouch: "01/11/2026" },
    { id: 1044, name: "Danielle Evans", userType: "Property Owner", property: "579 Sourwood Blvd", stage: "Working", assignedTo: "Richard Surovi", phone: "(555) 456-7894", email: "d.evans@email.com", createdAt: "01/06/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "In discussions", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Proposal", source: "Cold Call", lastTouch: "01/10/2026" },
    { id: 1045, name: "Marcus Edwards", userType: "Investor", property: "802 Serviceberry Ave", stage: "Closing", assignedTo: "Sarah Johnson", phone: "(555) 567-8905", email: "m.edwards@email.com", createdAt: "01/03/2026", unitDetails: "Multi-Family", numberOfUnits: 6, lastCallStatus: "Closing", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 10, deals: 2, nextAction: "Finalize", source: "Website", lastTouch: "01/09/2026" },
    { id: 1046, name: "Vanessa Collins", userType: "Property Owner", property: "135 Persimmon Court", stage: "New lead", assignedTo: "Mike Davis", phone: "(555) 678-9016", email: "v.collins@email.com", createdAt: "01/11/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Fresh", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Contact", source: "LinkedIn", lastTouch: "01/11/2026" },
    { id: 1047, name: "Timothy Stewart", userType: "Investor", property: "468 Redbud Lane", stage: "Attempting to contact", assignedTo: "Richard Surovi", phone: "(555) 789-0127", email: "t.stewart@email.com", createdAt: "01/09/2026", unitDetails: "Commercial", numberOfUnits: 3, lastCallStatus: "Reaching out", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Follow up", source: "Referral", lastTouch: "01/12/2026" },
    { id: 1048, name: "Rebecca Sanchez", userType: "Property Owner", property: "791 Pawpaw Drive", stage: "Scheduled Intro call", assignedTo: "Sarah Johnson", phone: "(555) 890-1238", email: "r.sanchez@email.com", createdAt: "01/07/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Booked", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Call", source: "Cold Call", lastTouch: "01/10/2026" },
    { id: 1049, name: "Charles Morris", userType: "Investor", property: "024 Spicebush Blvd", stage: "Working", assignedTo: "Mike Davis", phone: "(555) 901-2349", email: "c.morris@email.com", createdAt: "01/05/2026", unitDetails: "Multi-Family", numberOfUnits: 9, lastCallStatus: "Active", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 8, deals: 1, nextAction: "Review", source: "Website", lastTouch: "01/09/2026" },
    { id: 1050, name: "Angela Rogers", userType: "Property Owner", property: "357 Viburnum Ave", stage: "Closing", assignedTo: "Richard Surovi", phone: "(555) 012-3460", email: "a.rogers@email.com", createdAt: "01/02/2026", unitDetails: "Condo", numberOfUnits: 2, lastCallStatus: "Finalizing", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 11, deals: 1, nextAction: "Close", source: "LinkedIn", lastTouch: "01/08/2026" },
    { id: 1051, name: "Keith Reed", userType: "Investor", property: "680 Ninebark Lane", stage: "New lead", assignedTo: "Sarah Johnson", phone: "(555) 123-4572", email: "k.reed@email.com", createdAt: "01/12/2026", unitDetails: "Commercial", numberOfUnits: 4, lastCallStatus: "New", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "Outreach", source: "Referral", lastTouch: "01/12/2026" },
    { id: 1052, name: "Diana Cook", userType: "Property Owner", property: "913 Sumac Road", stage: "Attempting to contact", assignedTo: "Mike Davis", phone: "(555) 234-5683", email: "d.cook@email.com", createdAt: "01/10/2026", unitDetails: "Single Family", numberOfUnits: 1, lastCallStatus: "Trying", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Call back", source: "Cold Call", lastTouch: "01/13/2026" },
    { id: 1053, name: "Raymond Morgan", userType: "Investor", property: "246 Elderberry Court", stage: "Scheduled Intro call", assignedTo: "Richard Surovi", phone: "(555) 345-6784", email: "r.morgan@email.com", createdAt: "01/08/2026", unitDetails: "Multi-Family", numberOfUnits: 5, lastCallStatus: "Set", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Prepare", source: "Website", lastTouch: "01/11/2026" },
    { id: 1054, name: "Katherine Bell", userType: "Property Owner", property: "579 Chokeberry Blvd", stage: "Working", assignedTo: "Sarah Johnson", phone: "(555) 456-7895", email: "k.bell@email.com", createdAt: "01/06/2026", unitDetails: "Condo", numberOfUnits: 1, lastCallStatus: "Engaged", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Discuss", source: "LinkedIn", lastTouch: "01/10/2026" },
    { id: 1055, name: "Howard Murphy", userType: "Investor", property: "802 Buttonbush Ave", stage: "Closing", assignedTo: "Mike Davis", phone: "(555) 567-8906", email: "h.murphy@email.com", createdAt: "01/03/2026", unitDetails: "Commercial", numberOfUnits: 7, lastCallStatus: "Almost done", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 12, deals: 2, nextAction: "Sign", source: "Referral", lastTouch: "01/09/2026" },
  ],
  "acquisition-owners": [
    {
      id: 2001,
      name: "Patricia Brown",
      userType: "Current Owner",
      property: "123 Harbor View",
      stage: "Initial Contact",
      assignedTo: "Sarah Johnson",
      phone: "(555) 111-2222",
      email: "p.brown@email.com",
      createdAt: "01/09/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 6,
      lastCallStatus: "Left message",
      nextFollowUp: "01/14/2026",
      category: "acquisition-owners",
      emailsSent: 2,
      deals: 0,
      nextAction: "Call back",
      source: "Database",
      lastTouch: "01/11/2026",
    },
    {
      id: 2002,
      name: "Michael Scott",
      userType: "Current Owner",
      property: "456 Downtown Plaza",
      stage: "Qualification",
      assignedTo: "Mike Davis",
      phone: "(555) 222-3333",
      email: "m.scott@email.com",
      createdAt: "01/07/2026",
      unitDetails: "Commercial",
      numberOfUnits: 1,
      lastCallStatus: "Qualified",
      nextFollowUp: "01/13/2026",
      category: "acquisition-owners",
      emailsSent: 4,
      deals: 1,
      nextAction: "Site visit",
      source: "Referral",
      lastTouch: "01/10/2026",
    },
    {
      id: 2003,
      name: "Jennifer Adams",
      userType: "Current Owner",
      property: "789 Sunset Blvd",
      stage: "Property Assessment",
      assignedTo: "Richard Surovi",
      phone: "(555) 333-4444",
      email: "j.adams@email.com",
      createdAt: "01/04/2026",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Assessment scheduled",
      nextFollowUp: "01/12/2026",
      category: "acquisition-owners",
      emailsSent: 6,
      deals: 0,
      nextAction: "Complete assessment",
      source: "Website",
      lastTouch: "01/09/2026",
    },
    {
      id: 2004,
      name: "William Taylor",
      userType: "Current Owner",
      property: "321 Mountain View",
      stage: "Proposal Sent",
      assignedTo: "Sarah Johnson",
      phone: "(555) 444-5555",
      email: "w.taylor@email.com",
      createdAt: "01/01/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 8,
      lastCallStatus: "Reviewing proposal",
      nextFollowUp: "01/11/2026",
      category: "acquisition-owners",
      emailsSent: 9,
      deals: 2,
      nextAction: "Follow up on proposal",
      source: "LinkedIn",
      lastTouch: "01/08/2026",
    },
  ],
  "agents-referral": [
    {
      id: 3001,
      name: "Karen White",
      userType: "Agent Referral",
      property: "555 Realtor Way",
      stage: "New lead",
      assignedTo: "Mike Davis",
      phone: "(555) 555-6666",
      email: "k.white@realty.com",
      createdAt: "01/10/2026",
      unitDetails: "Various",
      numberOfUnits: 3,
      lastCallStatus: "New",
      nextFollowUp: "01/15/2026",
      category: "agents-referral",
      emailsSent: 1,
      deals: 0,
      nextAction: "Initial contact",
      source: "Agent Network",
      lastTouch: "01/10/2026",
    },
    {
      id: 3002,
      name: "Brian Johnson",
      userType: "Agent Referral",
      property: "777 Broker Street",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 666-7777",
      email: "b.johnson@realty.com",
      createdAt: "01/06/2026",
      unitDetails: "Single Family",
      numberOfUnits: 2,
      lastCallStatus: "In progress",
      nextFollowUp: "01/13/2026",
      category: "agents-referral",
      emailsSent: 5,
      deals: 1,
      nextAction: "Property showing",
      source: "Agent Network",
      lastTouch: "01/09/2026",
    },
    {
      id: 3003,
      name: "Nancy Davis",
      userType: "Agent Referral",
      property: "999 Commission Ave",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 777-8888",
      email: "n.davis@realty.com",
      createdAt: "12/30/2025",
      unitDetails: "Multi-Family",
      numberOfUnits: 4,
      lastCallStatus: "Closing",
      nextFollowUp: "01/11/2026",
      category: "agents-referral",
      emailsSent: 10,
      deals: 2,
      nextAction: "Finalize paperwork",
      source: "Agent Network",
      lastTouch: "01/08/2026",
    },
  ],
  "appfolio-owner-contracts": [
    {
      id: 4001,
      name: "Steven Clark",
      userType: "AppFolio Owner",
      property: "123 AppFolio Lane",
      stage: "New lead",
      assignedTo: "Sarah Johnson",
      phone: "(555) 888-9999",
      email: "s.clark@appfolio.com",
      createdAt: "01/09/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 12,
      lastCallStatus: "Imported",
      nextFollowUp: "01/14/2026",
      category: "appfolio-owner-contracts",
      emailsSent: 0,
      deals: 0,
      nextAction: "Initial outreach",
      source: "AppFolio Import",
      lastTouch: "01/09/2026",
    },
    {
      id: 4002,
      name: "Dorothy Lewis",
      userType: "AppFolio Owner",
      property: "456 Software Drive",
      stage: "Working",
      assignedTo: "Mike Davis",
      phone: "(555) 999-0000",
      email: "d.lewis@appfolio.com",
      createdAt: "01/05/2026",
      unitDetails: "Commercial",
      numberOfUnits: 3,
      lastCallStatus: "Active",
      nextFollowUp: "01/12/2026",
      category: "appfolio-owner-contracts",
      emailsSent: 4,
      deals: 1,
      nextAction: "Contract renewal",
      source: "AppFolio Import",
      lastTouch: "01/07/2026",
    },
    {
      id: 4003,
      name: "George Miller",
      userType: "AppFolio Owner",
      property: "789 Integration Blvd",
      stage: "New client",
      assignedTo: "Richard Surovi",
      phone: "(555) 000-1111",
      email: "g.miller@appfolio.com",
      createdAt: "12/28/2025",
      unitDetails: "Single Family",
      numberOfUnits: 5,
      lastCallStatus: "Onboarded",
      nextFollowUp: "01/10/2026",
      category: "appfolio-owner-contracts",
      emailsSent: 8,
      deals: 2,
      nextAction: "Quarterly review",
      source: "AppFolio Import",
      lastTouch: "01/05/2026",
    },
  ],
  "appfolio-tenant-applicants": [
    {
      id: 5001,
      name: "Emily Rodriguez",
      userType: "Tenant Applicant",
      property: "321 Rental Court",
      stage: "New lead",
      assignedTo: "Sarah Johnson",
      phone: "(555) 112-2334",
      email: "e.rodriguez@email.com",
      createdAt: "01/10/2026",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "Application received",
      nextFollowUp: "01/12/2026",
      category: "appfolio-tenant-applicants",
      emailsSent: 2,
      deals: 0,
      nextAction: "Review application",
      source: "AppFolio",
      lastTouch: "01/10/2026",
    },
    {
      id: 5002,
      name: "Carlos Hernandez",
      userType: "Tenant Applicant",
      property: "654 Lease Lane",
      stage: "Working",
      assignedTo: "Mike Davis",
      phone: "(555) 223-3445",
      email: "c.hernandez@email.com",
      createdAt: "01/08/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Screening",
      nextFollowUp: "01/11/2026",
      category: "appfolio-tenant-applicants",
      emailsSent: 3,
      deals: 0,
      nextAction: "Background check",
      source: "AppFolio",
      lastTouch: "01/09/2026",
    },
    {
      id: 5003,
      name: "Maria Garcia",
      userType: "Tenant Applicant",
      property: "987 Tenant Way",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 334-4556",
      email: "m.garcia@email.com",
      createdAt: "01/03/2026",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "Approved",
      nextFollowUp: "01/10/2026",
      category: "appfolio-tenant-applicants",
      emailsSent: 6,
      deals: 1,
      nextAction: "Sign lease",
      source: "AppFolio",
      lastTouch: "01/08/2026",
    },
  ],
  "appfolio-tenants": [
    {
      id: 6001,
      name: "Jason Park",
      userType: "Current Tenant",
      property: "111 Resident Blvd",
      stage: "New client",
      assignedTo: "Sarah Johnson",
      phone: "(555) 445-5667",
      email: "j.park@email.com",
      createdAt: "12/15/2025",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "Active tenant",
      nextFollowUp: "02/15/2026",
      category: "appfolio-tenants",
      emailsSent: 4,
      deals: 1,
      nextAction: "Lease renewal check",
      source: "AppFolio",
      lastTouch: "01/05/2026",
    },
    {
      id: 6002,
      name: "Ashley Kim",
      userType: "Current Tenant",
      property: "222 Occupant Street",
      stage: "New client",
      assignedTo: "Mike Davis",
      phone: "(555) 556-6778",
      email: "a.kim@email.com",
      createdAt: "11/20/2025",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Active tenant",
      nextFollowUp: "02/20/2026",
      category: "appfolio-tenants",
      emailsSent: 3,
      deals: 1,
      nextAction: "Maintenance follow-up",
      source: "AppFolio",
      lastTouch: "01/03/2026",
    },
  ],
  "appfolio-vendors": [
    {
      id: 7001,
      name: "ABC Plumbing",
      userType: "Vendor",
      property: "N/A",
      stage: "New client",
      assignedTo: "Richard Surovi",
      phone: "(555) 667-7889",
      email: "contact@abcplumbing.com",
      createdAt: "01/02/2026",
      unitDetails: "Service",
      numberOfUnits: 0,
      lastCallStatus: "Active",
      nextFollowUp: "01/15/2026",
      category: "appfolio-vendors",
      emailsSent: 2,
      deals: 3,
      nextAction: "Performance review",
      source: "AppFolio",
      lastTouch: "01/08/2026",
    },
    {
      id: 7002,
      name: "XYZ Electric",
      userType: "Vendor",
      property: "N/A",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 778-8990",
      email: "info@xyzelectric.com",
      createdAt: "12/20/2025",
      unitDetails: "Service",
      numberOfUnits: 0,
      lastCallStatus: "Onboarding",
      nextFollowUp: "01/12/2026",
      category: "appfolio-vendors",
      emailsSent: 4,
      deals: 2,
      nextAction: "Contract signing",
      source: "AppFolio",
      lastTouch: "01/06/2026",
    },
  ],
  "global-investments-leads": [
    {
      id: 8001,
      name: "Alexander Wright",
      userType: "Investor",
      property: "Global Tower 1",
      stage: "New lead",
      assignedTo: "Mike Davis",
      phone: "(555) 889-9001",
      email: "a.wright@globalinvest.com",
      createdAt: "01/10/2026",
      unitDetails: "Commercial",
      numberOfUnits: 20,
      lastCallStatus: "Initial inquiry",
      nextFollowUp: "01/14/2026",
      category: "global-investments-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "Discovery call",
      source: "Global Investments",
      lastTouch: "01/10/2026",
    },
    {
      id: 8002,
      name: "Victoria Hayes",
      userType: "Investor",
      property: "Global Tower 2",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 990-0112",
      email: "v.hayes@globalinvest.com",
      createdAt: "01/05/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 50,
      lastCallStatus: "Due diligence",
      nextFollowUp: "01/12/2026",
      category: "global-investments-leads",
      emailsSent: 7,
      deals: 1,
      nextAction: "Financial review",
      source: "Global Investments",
      lastTouch: "01/09/2026",
    },
    {
      id: 8003,
      name: "Christopher Lee",
      userType: "Investor",
      property: "Global Plaza",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 001-1223",
      email: "c.lee@globalinvest.com",
      createdAt: "12/20/2025",
      unitDetails: "Commercial",
      numberOfUnits: 15,
      lastCallStatus: "Final negotiations",
      nextFollowUp: "01/11/2026",
      category: "global-investments-leads",
      emailsSent: 15,
      deals: 3,
      nextAction: "Sign agreement",
      source: "Global Investments",
      lastTouch: "01/08/2026",
    },
  ],
  "new-owner-leads": [
    {
      id: 9001,
      name: "Rebecca Turner",
      userType: "New Owner",
      property: "567 First Property",
      stage: "New lead",
      assignedTo: "Sarah Johnson",
      phone: "(555) 112-3344",
      email: "r.turner@email.com",
      createdAt: "01/10/2026",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "First contact",
      nextFollowUp: "01/15/2026",
      category: "new-owner-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "Welcome call",
      source: "Website",
      lastTouch: "01/10/2026",
    },
    {
      id: 9002,
      name: "Daniel Cooper",
      userType: "New Owner",
      property: "890 Starter Home",
      stage: "Attempting to contact",
      assignedTo: "Mike Davis",
      phone: "(555) 223-4455",
      email: "d.cooper@email.com",
      createdAt: "01/08/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "No answer",
      nextFollowUp: "01/13/2026",
      category: "new-owner-leads",
      emailsSent: 3,
      deals: 0,
      nextAction: "Second attempt",
      source: "Referral",
      lastTouch: "01/11/2026",
    },
    {
      id: 9003,
      name: "Samantha Reed",
      userType: "New Owner",
      property: "234 Investment St",
      stage: "Working",
      assignedTo: "Richard Surovi",
      phone: "(555) 334-5566",
      email: "s.reed@email.com",
      createdAt: "01/04/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 2,
      lastCallStatus: "Interested",
      nextFollowUp: "01/12/2026",
      category: "new-owner-leads",
      emailsSent: 5,
      deals: 0,
      nextAction: "Property evaluation",
      source: "Cold Call",
      lastTouch: "01/09/2026",
    },
    {
      id: 9004,
      name: "Matthew Brooks",
      userType: "New Owner",
      property: "678 Growth Ave",
      stage: "Closing",
      assignedTo: "Sarah Johnson",
      phone: "(555) 445-6677",
      email: "m.brooks@email.com",
      createdAt: "12/28/2025",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Ready to close",
      nextFollowUp: "01/11/2026",
      category: "new-owner-leads",
      emailsSent: 10,
      deals: 1,
      nextAction: "Contract signing",
      source: "Website",
      lastTouch: "01/08/2026",
    },
  ],
  "new-tenant-leads": [
    {
      id: 10001,
      name: "Olivia Sanders",
      userType: "Prospective Tenant",
      property: "111 Rental Ave",
      stage: "New lead",
      assignedTo: "Mike Davis",
      phone: "(555) 556-7788",
      email: "o.sanders@email.com",
      createdAt: "01/10/2026",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "Inquiry received",
      nextFollowUp: "01/14/2026",
      category: "new-tenant-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "Schedule viewing",
      source: "Zillow",
      lastTouch: "01/10/2026",
    },
    {
      id: 10002,
      name: "Ethan Murphy",
      userType: "Prospective Tenant",
      property: "222 Lease Court",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 667-8899",
      email: "e.murphy@email.com",
      createdAt: "01/07/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Viewing scheduled",
      nextFollowUp: "01/12/2026",
      category: "new-tenant-leads",
      emailsSent: 4,
      deals: 0,
      nextAction: "Conduct viewing",
      source: "Apartments.com",
      lastTouch: "01/09/2026",
    },
    {
      id: 10003,
      name: "Sophia Bell",
      userType: "Prospective Tenant",
      property: "333 Move-in Blvd",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 778-9900",
      email: "s.bell@email.com",
      createdAt: "01/03/2026",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "Application approved",
      nextFollowUp: "01/11/2026",
      category: "new-tenant-leads",
      emailsSent: 7,
      deals: 1,
      nextAction: "Lease signing",
      source: "Website",
      lastTouch: "01/08/2026",
    },
  ],
  "new-tenants": [
    {
      id: 11001,
      name: "Jacob Foster",
      userType: "New Tenant",
      property: "444 Welcome Home",
      stage: "New client",
      assignedTo: "Sarah Johnson",
      phone: "(555) 889-0011",
      email: "j.foster@email.com",
      createdAt: "01/01/2026",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "Moved in",
      nextFollowUp: "01/15/2026",
      category: "new-tenants",
      emailsSent: 5,
      deals: 1,
      nextAction: "30-day check-in",
      source: "Website",
      lastTouch: "01/05/2026",
    },
    {
      id: 11002,
      name: "Emma Watson",
      userType: "New Tenant",
      property: "555 Fresh Start",
      stage: "New client",
      assignedTo: "Mike Davis",
      phone: "(555) 990-1122",
      email: "e.watson@email.com",
      createdAt: "12/28/2025",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Onboarding complete",
      nextFollowUp: "01/12/2026",
      category: "new-tenants",
      emailsSent: 4,
      deals: 1,
      nextAction: "Satisfaction survey",
      source: "Referral",
      lastTouch: "01/03/2026",
    },
  ],
  "new-tenants-leads": [
    {
      id: 12001,
      name: "Liam Johnson",
      userType: "Tenant Lead",
      property: "666 Prospect Lane",
      stage: "New lead",
      assignedTo: "Richard Surovi",
      phone: "(555) 001-2233",
      email: "l.johnson@email.com",
      createdAt: "01/10/2026",
      unitDetails: "Apartment",
      numberOfUnits: 1,
      lastCallStatus: "New inquiry",
      nextFollowUp: "01/14/2026",
      category: "new-tenants-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "Initial call",
      source: "Facebook",
      lastTouch: "01/10/2026",
    },
    {
      id: 12002,
      name: "Ava Williams",
      userType: "Tenant Lead",
      property: "777 Interest Ave",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 112-3344",
      email: "a.williams@email.com",
      createdAt: "01/06/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Following up",
      nextFollowUp: "01/12/2026",
      category: "new-tenants-leads",
      emailsSent: 4,
      deals: 0,
      nextAction: "Send listings",
      source: "Instagram",
      lastTouch: "01/09/2026",
    },
  ],
  "new-vendor-leads": [
    {
      id: 13001,
      name: "Pro Maintenance LLC",
      userType: "Vendor Lead",
      property: "N/A",
      stage: "New lead",
      assignedTo: "Mike Davis",
      phone: "(555) 223-4455",
      email: "contact@promaint.com",
      createdAt: "01/09/2026",
      unitDetails: "Service",
      numberOfUnits: 0,
      lastCallStatus: "Initial contact",
      nextFollowUp: "01/14/2026",
      category: "new-vendor-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "Service evaluation",
      source: "Industry Event",
      lastTouch: "01/09/2026",
    },
    {
      id: 13002,
      name: "CleanRight Services",
      userType: "Vendor Lead",
      property: "N/A",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 334-5566",
      email: "info@cleanright.com",
      createdAt: "01/05/2026",
      unitDetails: "Service",
      numberOfUnits: 0,
      lastCallStatus: "Reviewing services",
      nextFollowUp: "01/12/2026",
      category: "new-vendor-leads",
      emailsSent: 3,
      deals: 0,
      nextAction: "Pricing discussion",
      source: "Referral",
      lastTouch: "01/08/2026",
    },
    {
      id: 13003,
      name: "SecureGuard Co",
      userType: "Vendor Lead",
      property: "N/A",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 445-6677",
      email: "sales@secureguard.com",
      createdAt: "12/30/2025",
      unitDetails: "Service",
      numberOfUnits: 0,
      lastCallStatus: "Contract review",
      nextFollowUp: "01/11/2026",
      category: "new-vendor-leads",
      emailsSent: 6,
      deals: 1,
      nextAction: "Sign agreement",
      source: "Website",
      lastTouch: "01/07/2026",
    },
  ],
  "pmc-leads": [
    {
      id: 14001,
      name: "Sunrise Properties",
      userType: "PMC Lead",
      property: "Sunrise Portfolio",
      stage: "New lead",
      assignedTo: "Sarah Johnson",
      phone: "(555) 556-7788",
      email: "info@sunriseprop.com",
      createdAt: "01/10/2026",
      unitDetails: "Multi-Family",
      numberOfUnits: 100,
      lastCallStatus: "Initial inquiry",
      nextFollowUp: "01/15/2026",
      category: "pmc-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "Discovery meeting",
      source: "Conference",
      lastTouch: "01/10/2026",
    },
    {
      id: 14002,
      name: "Metro Management",
      userType: "PMC Lead",
      property: "Metro Portfolio",
      stage: "Working",
      assignedTo: "Mike Davis",
      phone: "(555) 667-8899",
      email: "contact@metromgmt.com",
      createdAt: "01/04/2026",
      unitDetails: "Commercial",
      numberOfUnits: 50,
      lastCallStatus: "In discussions",
      nextFollowUp: "01/12/2026",
      category: "pmc-leads",
      emailsSent: 5,
      deals: 0,
      nextAction: "Portfolio review",
      source: "LinkedIn",
      lastTouch: "01/09/2026",
    },
    {
      id: 14003,
      name: "Coastal Realty Group",
      userType: "PMC Lead",
      property: "Coastal Portfolio",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 778-9900",
      email: "deals@coastalrealty.com",
      createdAt: "12/25/2025",
      unitDetails: "Mixed Use",
      numberOfUnits: 75,
      lastCallStatus: "Final terms",
      nextFollowUp: "01/11/2026",
      category: "pmc-leads",
      emailsSent: 12,
      deals: 2,
      nextAction: "Contract execution",
      source: "Referral",
      lastTouch: "01/08/2026",
    },
  ],
  "realty-buyer-leads": [
    {
      id: 15001,
      name: "Thomas Anderson",
      userType: "Buyer",
      property: "Looking - Downtown",
      stage: "New lead",
      assignedTo: "Mike Davis",
      phone: "(555) 889-0011",
      email: "t.anderson@email.com",
      createdAt: "01/10/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "New buyer",
      nextFollowUp: "01/14/2026",
      category: "realty-buyer-leads",
      emailsSent: 2,
      deals: 0,
      nextAction: "Needs assessment",
      source: "Realtor.com",
      lastTouch: "01/10/2026",
    },
    {
      id: 15002,
      name: "Rachel Green",
      userType: "Buyer",
      property: "Looking - Suburbs",
      stage: "Working",
      assignedTo: "Sarah Johnson",
      phone: "(555) 990-1122",
      email: "r.green@email.com",
      createdAt: "01/06/2026",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Active search",
      nextFollowUp: "01/12/2026",
      category: "realty-buyer-leads",
      emailsSent: 6,
      deals: 0,
      nextAction: "Property tours",
      source: "Website",
      lastTouch: "01/09/2026",
    },
    {
      id: 15003,
      name: "Monica Geller",
      userType: "Buyer",
      property: "123 Dream Home",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 001-2233",
      email: "m.geller@email.com",
      createdAt: "12/28/2025",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Offer accepted",
      nextFollowUp: "01/11/2026",
      category: "realty-buyer-leads",
      emailsSent: 10,
      deals: 1,
      nextAction: "Close escrow",
      source: "Referral",
      lastTouch: "01/08/2026",
    },
  ],
  "realty-seller-leads": [
    {
      id: 16001,
      name: "Ross Geller",
      userType: "Seller",
      property: "456 Selling St",
      stage: "New lead",
      assignedTo: "Sarah Johnson",
      phone: "(555) 112-3344",
      email: "r.geller@email.com",
      createdAt: "01/09/2026",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Listing inquiry",
      nextFollowUp: "01/14/2026",
      category: "realty-seller-leads",
      emailsSent: 1,
      deals: 0,
      nextAction: "CMA presentation",
      source: "Website",
      lastTouch: "01/09/2026",
    },
    {
      id: 16002,
      name: "Chandler Bing",
      userType: "Seller",
      property: "789 Market Ave",
      stage: "Working",
      assignedTo: "Mike Davis",
      phone: "(555) 223-4455",
      email: "c.bing@email.com",
      createdAt: "01/05/2026",
      unitDetails: "Single Family",
      numberOfUnits: 1,
      lastCallStatus: "Listed",
      nextFollowUp: "01/12/2026",
      category: "realty-seller-leads",
      emailsSent: 5,
      deals: 0,
      nextAction: "Open house",
      source: "Cold Call",
      lastTouch: "01/08/2026",
    },
    {
      id: 16003,
      name: "Joey Tribbiani",
      userType: "Seller",
      property: "321 Sold Blvd",
      stage: "Closing",
      assignedTo: "Richard Surovi",
      phone: "(555) 334-5566",
      email: "j.tribbiani@email.com",
      createdAt: "12/20/2025",
      unitDetails: "Condo",
      numberOfUnits: 1,
      lastCallStatus: "Under contract",
      nextFollowUp: "01/11/2026",
      category: "realty-seller-leads",
      emailsSent: 9,
      deals: 1,
      nextAction: "Closing coordination",
      source: "Referral",
      lastTouch: "01/07/2026",
    },
  ],
}

// Lease Prospect Category Leads Data - mirrors CATEGORY_LEADS structure
const PROSPECT_CATEGORY_LEADS: Record<string, Lead[]> = {
  "acquisition-leads": [
    { id: 20001, name: "Alex Rivera", userType: "Tenant", property: "Downtown Apt 4B", stage: "New Prospects", assignedTo: "Sarah Johnson", phone: "(555) 111-2233", email: "alex.rivera@email.com", createdAt: "01/10/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "New inquiry", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Initial call", source: "Zillow", lastTouch: "01/10/2026", interestedUnits: [{ address: "456 Downtown Ave, San Diego, CA 92101", unit: "Unit 4B" }] },
    { id: 20002, name: "Morgan Lee", userType: "Tenant", property: "Sunset Studios", stage: "Scheduled Showing", assignedTo: "Mike Davis", phone: "(555) 222-3344", email: "morgan.lee@email.com", createdAt: "01/08/2026", unitDetails: "Studio", numberOfUnits: 3, lastCallStatus: "Scheduled viewing", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Property tour", source: "Website", lastTouch: "01/09/2026", interestedUnits: [{ address: "123 Sunset Blvd, Los Angeles, CA 90028", unit: "Unit 101" }, { address: "123 Sunset Blvd, Los Angeles, CA 90028", unit: "Unit 205" }, { address: "789 Ocean Dr, Santa Monica, CA 90401", unit: "Unit 3A" }] },
    { id: 20003, name: "Taylor Smith", userType: "Tenant", property: "Harbor View 2A", stage: "Application Approved – Lease Sent", assignedTo: "Richard Surovi", phone: "(555) 333-4455", email: "t.smith@email.com", createdAt: "01/05/2026", unitDetails: "2BR/2BA", numberOfUnits: 2, lastCallStatus: "Application submitted", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 6, deals: 1, nextAction: "Lease signing", source: "Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "321 Harbor Dr, San Diego, CA 92101", unit: "Unit 2A" }, { address: "890 Main St, Boston, MA 02108", unit: "Unit 302" }] },
    { id: 20004, name: "Jordan Kim", userType: "Tenant", property: "Metro Lofts", stage: "New Prospects", assignedTo: "Emily Brown", phone: "(555) 444-5566", email: "j.kim@email.com", createdAt: "01/12/2026", unitDetails: "1BR/1BA", numberOfUnits: 5, lastCallStatus: "Left voicemail", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Follow up call", source: "Apartments.com", lastTouch: "01/12/2026", interestedUnits: [{ address: "100 Metro Way, Chicago, IL 60601", unit: "Unit 8A" }, { address: "100 Metro Way, Chicago, IL 60601", unit: "Unit 12B" }, { address: "250 Lake Shore Dr, Chicago, IL 60611", unit: "Unit 3C" }, { address: "450 Michigan Ave, Chicago, IL 60605", unit: "Unit 501" }, { address: "450 Michigan Ave, Chicago, IL 60605", unit: "Unit 702" }] },
    { id: 20005, name: "Casey Brown", userType: "Tenant", property: "Garden Terrace", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Sarah Johnson", phone: "(555) 555-6677", email: "c.brown@email.com", createdAt: "01/06/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Tour completed", nextFollowUp: "01/10/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Send application", source: "Walk-in", lastTouch: "01/07/2026", interestedUnits: [{ address: "567 Garden Way, Portland, OR 97201", unit: "Unit 7C" }] },
    // Additional Lease Prospect records (20006-20055) to reach ~50 total
    { id: 20006, name: "Riley Martinez", userType: "Tenant", property: "Skyline Tower 5C", stage: "New Prospects", assignedTo: "Mike Davis", phone: "(555) 666-7789", email: "r.martinez@email.com", createdAt: "01/11/2026", unitDetails: "1BR/1BA", numberOfUnits: 2, lastCallStatus: "New inquiry", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Initial contact", source: "Zillow", lastTouch: "01/11/2026", interestedUnits: [{ address: "200 Skyline Blvd, Denver, CO 80202", unit: "Unit 5C" }, { address: "200 Skyline Blvd, Denver, CO 80202", unit: "Unit 7A" }] },
    { id: 20007, name: "Avery Thompson", userType: "Tenant", property: "Parkview Estates", stage: "Appointment Booked with LC", assignedTo: "Sarah Johnson", phone: "(555) 777-8890", email: "a.thompson@email.com", createdAt: "01/09/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Appointment set", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Confirm appointment", source: "Apartments.com", lastTouch: "01/10/2026", interestedUnits: [{ address: "88 Parkview Dr, Austin, TX 73301", unit: "Unit 12" }] },
    { id: 20008, name: "Drew Garcia", userType: "Tenant", property: "Riverside Lofts", stage: "Scheduled Showing", assignedTo: "Richard Surovi", phone: "(555) 888-9901", email: "d.garcia@email.com", createdAt: "01/07/2026", unitDetails: "2BR/2BA", numberOfUnits: 4, lastCallStatus: "Tour scheduled", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Property tour", source: "Website", lastTouch: "01/09/2026", interestedUnits: [{ address: "50 River Rd, Seattle, WA 98101", unit: "Unit 3B" }, { address: "50 River Rd, Seattle, WA 98101", unit: "Unit 4D" }, { address: "120 Lakeview Ave, Seattle, WA 98102", unit: "Unit 8A" }, { address: "120 Lakeview Ave, Seattle, WA 98102", unit: "Unit 9C" }] },
    { id: 20009, name: "Quinn Wilson", userType: "Tenant", property: "Urban Heights", stage: "No Show – Prospect", assignedTo: "Emily Brown", phone: "(555) 999-0012", email: "q.wilson@email.com", createdAt: "01/05/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "No show", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Reschedule", source: "Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "777 Urban Way, Miami, FL 33101", unit: "Unit 22B" }] },
    { id: 20010, name: "Blake Anderson", userType: "Tenant", property: "Metro Square", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Mike Davis", phone: "(555) 000-1123", email: "b.anderson@email.com", createdAt: "01/04/2026", unitDetails: "2BR/1BA", numberOfUnits: 2, lastCallStatus: "Tour completed", nextFollowUp: "01/10/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Get feedback", source: "Walk-in", lastTouch: "01/07/2026", interestedUnits: [{ address: "300 Metro Sq, Phoenix, AZ 85001", unit: "Unit 15A" }, { address: "300 Metro Sq, Phoenix, AZ 85001", unit: "Unit 18C" }] },
    { id: 20011, name: "Sydney Thomas", userType: "Tenant", property: "Ocean View Apts", stage: "Interested – Application Sent", assignedTo: "Sarah Johnson", phone: "(555) 111-2234", email: "s.thomas@email.com", createdAt: "01/03/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Interested", nextFollowUp: "01/09/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Follow up app", source: "Zillow", lastTouch: "01/06/2026", interestedUnits: [{ address: "990 Ocean View Blvd, San Diego, CA 92109", unit: "Unit 6B" }] },
    { id: 20012, name: "Jamie Jackson", userType: "Tenant", property: "Downtown Plaza", stage: "Application Received – Under Review", assignedTo: "Richard Surovi", phone: "(555) 222-3345", email: "j.jackson@email.com", createdAt: "01/02/2026", unitDetails: "1BR/1BA", numberOfUnits: 3, lastCallStatus: "App received", nextFollowUp: "01/08/2026", category: "acquisition-leads", emailsSent: 7, deals: 0, nextAction: "Review app", source: "Apartments.com", lastTouch: "01/05/2026", interestedUnits: [{ address: "400 Downtown Plz, Dallas, TX 75201", unit: "Unit 2A" }, { address: "400 Downtown Plz, Dallas, TX 75201", unit: "Unit 5C" }, { address: "550 Commerce St, Dallas, TX 75202", unit: "Unit 9D" }] },
    { id: 20013, name: "Cameron White", userType: "Tenant", property: "Sunset Residences", stage: "Application Approved – Lease Sent", assignedTo: "Emily Brown", phone: "(555) 333-4456", email: "c.white2@email.com", createdAt: "12/28/2025", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/07/2026", category: "acquisition-leads", emailsSent: 8, deals: 1, nextAction: "Lease signing", source: "Website", lastTouch: "01/04/2026", interestedUnits: [{ address: "700 Sunset Way, Los Angeles, CA 90046", unit: "Unit 14A" }] },
    { id: 20014, name: "Reese Harris", userType: "Tenant", property: "Lakefront Condos", stage: "Lease Signed – Schedule Move In", assignedTo: "Mike Davis", phone: "(555) 444-5567", email: "r.harris@email.com", createdAt: "12/25/2025", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Signed", nextFollowUp: "01/05/2026", category: "acquisition-leads", emailsSent: 9, deals: 1, nextAction: "Schedule move", source: "Referral", lastTouch: "01/02/2026", interestedUnits: [{ address: "155 Lakefront Dr, Minneapolis, MN 55401", unit: "Unit 3A" }] },
    { id: 20015, name: "Parker Martin", userType: "Tenant", property: "Hillside Manor", stage: "Move In – Completed and Feedback", assignedTo: "Sarah Johnson", phone: "(555) 555-6678", email: "p.martin@email.com", createdAt: "12/20/2025", unitDetails: "Studio", numberOfUnits: 2, lastCallStatus: "Moved in", nextFollowUp: "01/20/2026", category: "acquisition-leads", emailsSent: 10, deals: 1, nextAction: "Satisfaction survey", source: "Walk-in", lastTouch: "01/10/2026", interestedUnits: [{ address: "60 Hillside Ln, Nashville, TN 37201", unit: "Unit 11B" }, { address: "60 Hillside Ln, Nashville, TN 37201", unit: "Unit 14D" }] },
    { id: 20016, name: "Hayden Rodriguez", userType: "Tenant", property: "Central Park Apts", stage: "New Prospects", assignedTo: "Richard Surovi", phone: "(555) 666-7790", email: "h.rodriguez@email.com", createdAt: "01/12/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "New lead", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "First contact", source: "Zillow", lastTouch: "01/12/2026", interestedUnits: [{ address: "220 Central Park W, New York, NY 10024", unit: "Unit 8F" }] },
    { id: 20017, name: "Skyler Lee", userType: "Tenant", property: "Maple Grove", stage: "Appointment Booked with LC", assignedTo: "Emily Brown", phone: "(555) 777-8891", email: "s.lee2@email.com", createdAt: "01/10/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Booked", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Prepare for call", source: "Apartments.com", lastTouch: "01/11/2026", interestedUnits: [{ address: "45 Maple Grove Rd, Portland, OR 97205", unit: "Unit 2C" }] },
    { id: 20018, name: "Emerson Walker", userType: "Tenant", property: "Pine Valley Apts", stage: "Scheduled Showing", assignedTo: "Mike Davis", phone: "(555) 888-9902", email: "e.walker@email.com", createdAt: "01/08/2026", unitDetails: "2BR/2BA", numberOfUnits: 2, lastCallStatus: "Showing set", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Conduct tour", source: "Website", lastTouch: "01/09/2026", interestedUnits: [{ address: "330 Pine Valley Dr, Atlanta, GA 30301", unit: "Unit 4A" }, { address: "330 Pine Valley Dr, Atlanta, GA 30301", unit: "Unit 6B" }] },
    { id: 20019, name: "Finley Hall", userType: "Tenant", property: "Birch Lane Condos", stage: "Showing Agent – No Show", assignedTo: "Sarah Johnson", phone: "(555) 999-0013", email: "f.hall@email.com", createdAt: "01/06/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Agent no show", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Reschedule", source: "Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "78 Birch Ln, San Jose, CA 95101", unit: "Unit 1D" }] },
    { id: 20020, name: "Dakota Young", userType: "Tenant", property: "Cedar Heights", stage: "Not Interested / Disliked Property", assignedTo: "Richard Surovi", phone: "(555) 000-1124", email: "d.young@email.com", createdAt: "01/04/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Not interested", nextFollowUp: "02/01/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Archive", source: "Walk-in", lastTouch: "01/07/2026", interestedUnits: [{ address: "92 Cedar Heights Blvd, Raleigh, NC 27601", unit: "Unit 3E" }] },
    { id: 20021, name: "Morgan King", userType: "Tenant", property: "Oak Park Towers", stage: "New Prospects", assignedTo: "Emily Brown", phone: "(555) 111-2235", email: "m.king@email.com", createdAt: "01/11/2026", unitDetails: "2BR/1BA", numberOfUnits: 2, lastCallStatus: "Fresh lead", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Call", source: "Zillow", lastTouch: "01/11/2026", interestedUnits: [{ address: "500 Oak Park Ave, Sacramento, CA 95814", unit: "Unit 10A" }, { address: "500 Oak Park Ave, Sacramento, CA 95814", unit: "Unit 12C" }] },
    { id: 20022, name: "Jordan Wright", userType: "Tenant", property: "Elm Street Apts", stage: "Appointment Booked with LC", assignedTo: "Mike Davis", phone: "(555) 222-3346", email: "j.wright@email.com", createdAt: "01/09/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Call scheduled", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Host call", source: "Apartments.com", lastTouch: "01/10/2026", interestedUnits: [{ address: "180 Elm St, Philadelphia, PA 19101", unit: "Unit 5F" }] },
    { id: 20023, name: "Taylor Scott", userType: "Tenant", property: "Willow Creek", stage: "Scheduled Showing", assignedTo: "Sarah Johnson", phone: "(555) 333-4457", email: "t.scott@email.com", createdAt: "01/07/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Tour pending", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Tour property", source: "Website", lastTouch: "01/08/2026", interestedUnits: [{ address: "67 Willow Creek Dr, Charlotte, NC 28201", unit: "Unit 7B" }] },
    { id: 20024, name: "Alex Green", userType: "Tenant", property: "Spruce Manor", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Richard Surovi", phone: "(555) 444-5568", email: "a.green@email.com", createdAt: "01/05/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Toured", nextFollowUp: "01/10/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Collect feedback", source: "Referral", lastTouch: "01/07/2026", interestedUnits: [{ address: "240 Spruce Manor Way, Tampa, FL 33601", unit: "Unit 9A" }] },
    { id: 20025, name: "Casey Adams", userType: "Tenant", property: "Aspen Ridge", stage: "Interested – Application Sent", assignedTo: "Emily Brown", phone: "(555) 555-6679", email: "c.adams@email.com", createdAt: "01/03/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "App sent", nextFollowUp: "01/09/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Wait for app", source: "Walk-in", lastTouch: "01/06/2026", interestedUnits: [{ address: "115 Aspen Ridge Rd, Boulder, CO 80301", unit: "Unit 2D" }] },
    { id: 20026, name: "Riley Baker", userType: "Tenant", property: "Magnolia Court", stage: "Application Received – Under Review", assignedTo: "Mike Davis", phone: "(555) 666-7791", email: "r.baker@email.com", createdAt: "01/02/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Reviewing", nextFollowUp: "01/08/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Process app", source: "Zillow", lastTouch: "01/05/2026", interestedUnits: [{ address: "88 Magnolia Ct, Savannah, GA 31401", unit: "Unit 4C" }] },
    { id: 20027, name: "Avery Nelson", userType: "Tenant", property: "Cherry Blossom Apts", stage: "Application Rejected", assignedTo: "Sarah Johnson", phone: "(555) 777-8892", email: "a.nelson@email.com", createdAt: "12/30/2025", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Rejected", nextFollowUp: "02/15/2026", category: "acquisition-leads", emailsSent: 7, deals: 0, nextAction: "Send notice", source: "Apartments.com", lastTouch: "01/04/2026", interestedUnits: [{ address: "333 Cherry Blossom Ave, Washington, DC 20001", unit: "Unit 6A" }] },
    { id: 20028, name: "Drew Hill", userType: "Tenant", property: "Dogwood Lane", stage: "Application Approved – Lease Sent", assignedTo: "Richard Surovi", phone: "(555) 888-9903", email: "d.hill@email.com", createdAt: "12/28/2025", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/06/2026", category: "acquisition-leads", emailsSent: 8, deals: 1, nextAction: "Send lease", source: "Website", lastTouch: "01/03/2026", interestedUnits: [{ address: "47 Dogwood Ln, Asheville, NC 28801", unit: "Unit 1A" }] },
    { id: 20029, name: "Quinn Ramirez", userType: "Tenant", property: "Juniper Grove", stage: "Lease Signed – Schedule Move In", assignedTo: "Emily Brown", phone: "(555) 999-0014", email: "q.ramirez@email.com", createdAt: "12/25/2025", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Lease signed", nextFollowUp: "01/05/2026", category: "acquisition-leads", emailsSent: 9, deals: 1, nextAction: "Plan move-in", source: "Referral", lastTouch: "01/02/2026", interestedUnits: [{ address: "210 Juniper Grove St, Tucson, AZ 85701", unit: "Unit 8B" }] },
    { id: 20030, name: "Blake Campbell", userType: "Tenant", property: "Cypress Point", stage: "Tenant – Lost or Backed Out", assignedTo: "Mike Davis", phone: "(555) 000-1125", email: "b.campbell@email.com", createdAt: "12/20/2025", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Backed out", nextFollowUp: "03/01/2026", category: "acquisition-leads", emailsSent: 10, deals: 0, nextAction: "Archive lead", source: "Walk-in", lastTouch: "01/01/2026", interestedUnits: [{ address: "155 Cypress Point Dr, San Francisco, CA 94102", unit: "Unit 11C" }] },
    { id: 20031, name: "Sydney Mitchell", userType: "Tenant", property: "Redwood Terrace", stage: "New Prospects", assignedTo: "Sarah Johnson", phone: "(555) 111-2236", email: "s.mitchell@email.com", createdAt: "01/12/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "New", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "Reach out", source: "Zillow", lastTouch: "01/12/2026", interestedUnits: [{ address: "400 Redwood Terrace, Oakland, CA 94601", unit: "Unit 3A" }] },
    { id: 20032, name: "Jamie Roberts", userType: "Tenant", property: "Sequoia Place", stage: "Appointment Booked with LC", assignedTo: "Richard Surovi", phone: "(555) 222-3347", email: "j.roberts@email.com", createdAt: "01/10/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Appt set", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Prep call", source: "Apartments.com", lastTouch: "01/11/2026", interestedUnits: [{ address: "75 Sequoia Pl, Las Vegas, NV 89101", unit: "Unit 16D" }] },
    { id: 20033, name: "Cameron Turner", userType: "Tenant", property: "Palm Gardens", stage: "Scheduled Showing", assignedTo: "Emily Brown", phone: "(555) 333-4458", email: "c.turner@email.com", createdAt: "01/08/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Scheduled", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Show unit", source: "Website", lastTouch: "01/09/2026", interestedUnits: [{ address: "555 Palm Garden Way, Honolulu, HI 96801", unit: "Unit 2B" }] },
    { id: 20034, name: "Reese Phillips", userType: "Tenant", property: "Olive Branch Apts", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Mike Davis", phone: "(555) 444-5569", email: "r.phillips@email.com", createdAt: "01/06/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Tour done", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Get response", source: "Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "190 Olive Branch Rd, Omaha, NE 68101", unit: "Unit 7F" }] },
    { id: 20035, name: "Parker Evans", userType: "Tenant", property: "Catalpa Commons", stage: "Interested – Application Sent", assignedTo: "Sarah Johnson", phone: "(555) 555-6680", email: "p.evans@email.com", createdAt: "01/04/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Interested", nextFollowUp: "01/10/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Track app", source: "Walk-in", lastTouch: "01/07/2026", interestedUnits: [{ address: "320 Catalpa Commons, Kansas City, MO 64101", unit: "Unit 5A" }] },
    { id: 20036, name: "Hayden Edwards", userType: "Tenant", property: "Basswood Heights", stage: "Application Received – Under Review", assignedTo: "Richard Surovi", phone: "(555) 666-7792", email: "h.edwards@email.com", createdAt: "01/02/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Under review", nextFollowUp: "01/08/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Review", source: "Zillow", lastTouch: "01/05/2026", interestedUnits: [{ address: "140 Basswood Heights Dr, Cleveland, OH 44101", unit: "Unit 10B" }] },
    { id: 20037, name: "Skyler Collins", userType: "Tenant", property: "Mulberry Manor", stage: "Application Approved – Lease Sent", assignedTo: "Emily Brown", phone: "(555) 777-8893", email: "s.collins@email.com", createdAt: "12/29/2025", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/07/2026", category: "acquisition-leads", emailsSent: 8, deals: 1, nextAction: "Finalize lease", source: "Apartments.com", lastTouch: "01/04/2026", interestedUnits: [{ address: "260 Mulberry Manor Ln, Pittsburgh, PA 15201", unit: "Unit 4E" }] },
    { id: 20038, name: "Emerson Stewart", userType: "Tenant", property: "Locust Lane", stage: "Lease Signed – Schedule Move In", assignedTo: "Mike Davis", phone: "(555) 888-9904", email: "e.stewart@email.com", createdAt: "12/26/2025", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Signed", nextFollowUp: "01/05/2026", category: "acquisition-leads", emailsSent: 9, deals: 1, nextAction: "Coordinate move", source: "Website", lastTouch: "01/02/2026", interestedUnits: [{ address: "85 Locust Ln, Columbus, OH 43201", unit: "Unit 13A" }] },
    { id: 20039, name: "Finley Sanchez", userType: "Tenant", property: "Sycamore Square", stage: "Move In – Completed and Feedback", assignedTo: "Sarah Johnson", phone: "(555) 999-0015", email: "f.sanchez@email.com", createdAt: "12/18/2025", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Moved in", nextFollowUp: "01/18/2026", category: "acquisition-leads", emailsSent: 11, deals: 1, nextAction: "Check-in call", source: "Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "480 Sycamore Sq, Indianapolis, IN 46201", unit: "Unit 6C" }] },
    { id: 20040, name: "Dakota Morris", userType: "Tenant", property: "Chestnut Court", stage: "New Prospects", assignedTo: "Richard Surovi", phone: "(555) 000-1126", email: "d.morris@email.com", createdAt: "01/11/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "New lead", nextFollowUp: "01/16/2026", category: "acquisition-leads", emailsSent: 1, deals: 0, nextAction: "Initial outreach", source: "Walk-in", lastTouch: "01/11/2026", interestedUnits: [{ address: "370 Chestnut Ct, Milwaukee, WI 53201", unit: "Unit 2A" }] },
    { id: 20041, name: "Morgan Rogers", userType: "Tenant", property: "Alder Avenue", stage: "Appointment Booked with LC", assignedTo: "Emily Brown", phone: "(555) 111-2237", email: "m.rogers@email.com", createdAt: "01/09/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Booked", nextFollowUp: "01/13/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Call prep", source: "Zillow", lastTouch: "01/10/2026", interestedUnits: [{ address: "95 Alder Ave, Salt Lake City, UT 84101", unit: "Unit 8D" }] },
    { id: 20042, name: "Jordan Reed", userType: "Tenant", property: "Laurel Park", stage: "Scheduled Showing", assignedTo: "Mike Davis", phone: "(555) 222-3348", email: "j.reed2@email.com", createdAt: "01/07/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Tour set", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Conduct tour", source: "Apartments.com", lastTouch: "01/08/2026", interestedUnits: [{ address: "220 Laurel Park Blvd, Richmond, VA 23219", unit: "Unit 5B" }] },
    { id: 20043, name: "Taylor Cook", userType: "Tenant", property: "Spicebush Suites", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Sarah Johnson", phone: "(555) 333-4459", email: "t.cook@email.com", createdAt: "01/05/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Toured", nextFollowUp: "01/10/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Await feedback", source: "Website", lastTouch: "01/07/2026", interestedUnits: [{ address: "160 Spicebush Way, Louisville, KY 40201", unit: "Unit 12E" }] },
    { id: 20044, name: "Alex Morgan", userType: "Tenant", property: "Cottonwood Creek", stage: "Interested – Application Sent", assignedTo: "Richard Surovi", phone: "(555) 444-5570", email: "a.morgan@email.com", createdAt: "01/03/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Very interested", nextFollowUp: "01/09/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Follow up", source: "Referral", lastTouch: "01/06/2026", interestedUnits: [{ address: "430 Cottonwood Creek Dr, Boise, ID 83701", unit: "Unit 3C" }] },
    { id: 20045, name: "Casey Bell", userType: "Tenant", property: "Hackberry Heights", stage: "Application Received – Under Review", assignedTo: "Emily Brown", phone: "(555) 555-6681", email: "c.bell@email.com", createdAt: "01/01/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "App received", nextFollowUp: "01/07/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Process", source: "Walk-in", lastTouch: "01/04/2026", interestedUnits: [{ address: "99 Hackberry Heights Dr, Memphis, TN 38101", unit: "Unit 1A" }] },
    { id: 20046, name: "Riley Murphy", userType: "Tenant", property: "Yellowwood Way", stage: "Application Approved – Lease Sent", assignedTo: "Mike Davis", phone: "(555) 666-7793", email: "r.murphy@email.com", createdAt: "12/28/2025", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/06/2026", category: "acquisition-leads", emailsSent: 7, deals: 1, nextAction: "Send lease", source: "Zillow", lastTouch: "01/03/2026", interestedUnits: [{ address: "205 Yellowwood Way, Albuquerque, NM 87101", unit: "Unit 6D" }] },
    { id: 20047, name: "Avery Bailey", userType: "Tenant", property: "Buckeye Boulevard", stage: "Lease Signed – Schedule Move In", assignedTo: "Sarah Johnson", phone: "(555) 777-8894", email: "a.bailey@email.com", createdAt: "12/24/2025", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Lease signed", nextFollowUp: "01/04/2026", category: "acquisition-leads", emailsSent: 9, deals: 1, nextAction: "Move-in date", source: "Apartments.com", lastTouch: "01/01/2026", interestedUnits: [{ address: "340 Buckeye Blvd, Cincinnati, OH 45201", unit: "Unit 9B" }] },
    { id: 20048, name: "Drew Rivera", userType: "Tenant", property: "Ninebark Nook", stage: "Move In – Completed and Feedback", assignedTo: "Richard Surovi", phone: "(555) 888-9905", email: "d.rivera@email.com", createdAt: "12/15/2025", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Moved in", nextFollowUp: "01/15/2026", category: "acquisition-leads", emailsSent: 12, deals: 1, nextAction: "Satisfaction check", source: "Website", lastTouch: "01/05/2026", interestedUnits: [{ address: "18 Ninebark Nook, Fresno, CA 93701", unit: "Unit 4F" }] },
    { id: 20049, name: "Quinn Cooper", userType: "Tenant", property: "Sumac Street", stage: "New Prospects", assignedTo: "Emily Brown", phone: "(555) 999-0016", email: "q.cooper@email.com", createdAt: "01/12/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Brand new", nextFollowUp: "01/17/2026", category: "acquisition-leads", emailsSent: 0, deals: 0, nextAction: "Call", source: "Referral", lastTouch: "01/12/2026", interestedUnits: [{ address: "510 Sumac St, Tulsa, OK 74101", unit: "Unit 2E" }] },
    { id: 20050, name: "Blake Richardson", userType: "Tenant", property: "Elderberry Estates", stage: "Appointment Booked with LC", assignedTo: "Mike Davis", phone: "(555) 000-1127", email: "b.richardson@email.com", createdAt: "01/10/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Confirmed", nextFollowUp: "01/14/2026", category: "acquisition-leads", emailsSent: 2, deals: 0, nextAction: "Host call", source: "Walk-in", lastTouch: "01/11/2026", interestedUnits: [{ address: "680 Elderberry Estates Rd, Omaha, NE 68102", unit: "Unit 7A" }] },
    { id: 20051, name: "Sydney Cox", userType: "Tenant", property: "Chokeberry Chase", stage: "Scheduled Showing", assignedTo: "Sarah Johnson", phone: "(555) 111-2238", email: "s.cox@email.com", createdAt: "01/08/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Showing booked", nextFollowUp: "01/12/2026", category: "acquisition-leads", emailsSent: 3, deals: 0, nextAction: "Tour unit", source: "Zillow", lastTouch: "01/09/2026", interestedUnits: [{ address: "125 Chokeberry Chase, Birmingham, AL 35201", unit: "Unit 11C" }] },
    { id: 20052, name: "Jamie Howard", userType: "Tenant", property: "Buttonbush Bay", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Richard Surovi", phone: "(555) 222-3349", email: "j.howard@email.com", createdAt: "01/06/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Tour complete", nextFollowUp: "01/11/2026", category: "acquisition-leads", emailsSent: 4, deals: 0, nextAction: "Get decision", source: "Apartments.com", lastTouch: "01/08/2026", interestedUnits: [{ address: "444 Buttonbush Bay, Jacksonville, FL 32201", unit: "Unit 5B" }] },
    { id: 20053, name: "Cameron Ward", userType: "Tenant", property: "Viburnum Vista", stage: "Interested – Application Sent", assignedTo: "Emily Brown", phone: "(555) 333-4460", email: "c.ward@email.com", createdAt: "01/04/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "App sent", nextFollowUp: "01/10/2026", category: "acquisition-leads", emailsSent: 5, deals: 0, nextAction: "Track status", source: "Website", lastTouch: "01/07/2026", interestedUnits: [{ address: "270 Viburnum Vista Dr, Hartford, CT 06101", unit: "Unit 8E" }] },
    { id: 20054, name: "Reese Torres", userType: "Tenant", property: "Persimmon Place", stage: "Application Received – Under Review", assignedTo: "Mike Davis", phone: "(555) 444-5571", email: "r.torres@email.com", createdAt: "01/02/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "In review", nextFollowUp: "01/08/2026", category: "acquisition-leads", emailsSent: 6, deals: 0, nextAction: "Complete review", source: "Referral", lastTouch: "01/05/2026", interestedUnits: [{ address: "390 Persimmon Pl, Lexington, KY 40501", unit: "Unit 3D" }] },
    { id: 20055, name: "Parker Peterson", userType: "Tenant", property: "Serviceberry Suites", stage: "Application Approved – Lease Sent", assignedTo: "Sarah Johnson", phone: "(555) 555-6682", email: "p.peterson@email.com", createdAt: "12/30/2025", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/07/2026", category: "acquisition-leads", emailsSent: 8, deals: 1, nextAction: "Finalize", source: "Walk-in", lastTouch: "01/04/2026", interestedUnits: [{ address: "520 Serviceberry St, Spokane, WA 99201", unit: "Unit 10A" }] },
  ],
  "acquisition-prospects": [
    { id: 20101, name: "Riley Cooper", userType: "Tenant", property: "Oak Street Apts", stage: "New Prospects", assignedTo: "Mike Davis", phone: "(555) 666-7788", email: "riley.c@email.com", createdAt: "01/11/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "New inquiry", nextFollowUp: "01/14/2026", category: "acquisition-prospects", emailsSent: 1, deals: 0, nextAction: "Initial contact", source: "Zillow", lastTouch: "01/11/2026", interestedUnits: [{ address: "100 Oak St, San Diego, CA 92101", unit: "Unit 4A" }] },
    { id: 20102, name: "Avery Johnson", userType: "Tenant", property: "Pine Valley", stage: "Scheduled Showing", assignedTo: "Sarah Johnson", phone: "(555) 777-8899", email: "avery.j@email.com", createdAt: "01/09/2026", unitDetails: "Studio", numberOfUnits: 2, lastCallStatus: "Viewing scheduled", nextFollowUp: "01/13/2026", category: "acquisition-prospects", emailsSent: 3, deals: 0, nextAction: "Property tour", source: "Website", lastTouch: "01/10/2026", interestedUnits: [{ address: "250 Pine Valley Rd, Denver, CO 80201", unit: "Unit 7B" }, { address: "250 Pine Valley Rd, Denver, CO 80201", unit: "Unit 9D" }] },
    { id: 20103, name: "Drew Martinez", userType: "Tenant", property: "Riverside Condos", stage: "Application Received – Under Review", assignedTo: "Richard Surovi", phone: "(555) 888-9900", email: "d.martinez@email.com", createdAt: "01/04/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Background check", nextFollowUp: "01/12/2026", category: "acquisition-prospects", emailsSent: 7, deals: 1, nextAction: "Lease prep", source: "Referral", lastTouch: "01/09/2026", interestedUnits: [{ address: "675 Riverside Dr, Austin, TX 73301", unit: "Unit 2C" }] },
  ],
  "agents-referral": [
    { id: 20201, name: "Blake Wilson", userType: "Tenant", property: "Central Heights", stage: "Appointment Booked with LC", assignedTo: "Emily Brown", phone: "(555) 999-0011", email: "b.wilson@email.com", createdAt: "01/10/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Agent referral", nextFollowUp: "01/13/2026", category: "agents-referral", emailsSent: 2, deals: 0, nextAction: "Schedule call", source: "Agent Referral", lastTouch: "01/10/2026", interestedUnits: [{ address: "800 Central Heights Blvd, Chicago, IL 60601", unit: "Unit 5E" }] },
    { id: 20202, name: "Quinn Davis", userType: "Tenant", property: "Maple Court", stage: "Scheduled Showing", assignedTo: "Mike Davis", phone: "(555) 000-1122", email: "q.davis@email.com", createdAt: "01/07/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Tour scheduled", nextFollowUp: "01/11/2026", category: "agents-referral", emailsSent: 4, deals: 0, nextAction: "Property showing", source: "Agent Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "350 Maple Ct, Portland, OR 97201", unit: "Unit 11F" }] },
  ],
  "appfolio-owner-contracts": [
    { id: 20301, name: "Sydney Miller", userType: "Tenant", property: "Lakeside Manor", stage: "New Prospects", assignedTo: "Sarah Johnson", phone: "(555) 112-2334", email: "s.miller@email.com", createdAt: "01/09/2026", unitDetails: "3BR/2BA", numberOfUnits: 1, lastCallStatus: "New import", nextFollowUp: "01/12/2026", category: "appfolio-owner-contracts", emailsSent: 1, deals: 0, nextAction: "Welcome call", source: "AppFolio Import", lastTouch: "01/09/2026", interestedUnits: [{ address: "900 Lakeside Manor Dr, Tampa, FL 33601", unit: "Unit 8A" }] },
    { id: 20302, name: "Jamie Garcia", userType: "Tenant", property: "Hillcrest Apts", stage: "Interested – Application Sent", assignedTo: "Richard Surovi", phone: "(555) 223-3445", email: "j.garcia@email.com", createdAt: "01/06/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Active", nextFollowUp: "01/10/2026", category: "appfolio-owner-contracts", emailsSent: 5, deals: 0, nextAction: "Renewal discussion", source: "AppFolio Import", lastTouch: "01/07/2026", interestedUnits: [{ address: "440 Hillcrest Ave, Nashville, TN 37201", unit: "Unit 3B" }] },
    { id: 20303, name: "Cameron White", userType: "Tenant", property: "Valley View", stage: "Move In – Completed and Feedback", assignedTo: "Emily Brown", phone: "(555) 334-4556", email: "c.white@email.com", createdAt: "01/03/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Lease signed", nextFollowUp: "02/01/2026", category: "appfolio-owner-contracts", emailsSent: 8, deals: 1, nextAction: "Move-in prep", source: "AppFolio Import", lastTouch: "01/08/2026", interestedUnits: [{ address: "160 Valley View Ln, Raleigh, NC 27601", unit: "Unit 6D" }] },
  ],
  "appfolio-tenant-applicants": [
    { id: 20401, name: "Reese Thompson", userType: "Tenant", property: "Parkside Place", stage: "Application Received – Under Review", assignedTo: "Mike Davis", phone: "(555) 445-5667", email: "r.thompson@email.com", createdAt: "01/11/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Application received", nextFollowUp: "01/13/2026", category: "appfolio-tenant-applicants", emailsSent: 2, deals: 0, nextAction: "Background check", source: "AppFolio", lastTouch: "01/11/2026", interestedUnits: [{ address: "75 Parkside Pl, Sacramento, CA 95814", unit: "Unit 1C" }] },
    { id: 20402, name: "Parker Anderson", userType: "Tenant", property: "Sunset Terrace", stage: "Application Received – Under Review", assignedTo: "Sarah Johnson", phone: "(555) 556-6778", email: "p.anderson@email.com", createdAt: "01/08/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Credit check pending", nextFollowUp: "01/12/2026", category: "appfolio-tenant-applicants", emailsSent: 4, deals: 0, nextAction: "Review application", source: "AppFolio", lastTouch: "01/09/2026", interestedUnits: [{ address: "310 Sunset Terrace, Miami, FL 33101", unit: "Unit 14B" }] },
    { id: 20403, name: "Hayden Clark", userType: "Tenant", property: "Ocean Breeze", stage: "Application Approved – Lease Sent", assignedTo: "Richard Surovi", phone: "(555) 667-7889", email: "h.clark@email.com", createdAt: "01/05/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/10/2026", category: "appfolio-tenant-applicants", emailsSent: 7, deals: 1, nextAction: "Lease signing", source: "AppFolio", lastTouch: "01/08/2026", interestedUnits: [{ address: "580 Ocean Breeze Way, Honolulu, HI 96801", unit: "Unit 9E" }] },
    { id: 20404, name: "Skyler Wright", userType: "Tenant", property: "Mountain View", stage: "Interested – Application Sent", assignedTo: "Emily Brown", phone: "(555) 778-8990", email: "s.wright@email.com", createdAt: "01/10/2026", unitDetails: "3BR/2BA", numberOfUnits: 1, lastCallStatus: "Documents pending", nextFollowUp: "01/14/2026", category: "appfolio-tenant-applicants", emailsSent: 3, deals: 0, nextAction: "Request docs", source: "AppFolio", lastTouch: "01/10/2026", interestedUnits: [{ address: "720 Mountain View Dr, Boulder, CO 80301", unit: "Unit 7A" }] },
  ],
  "appfolio-tenants": [
    { id: 20501, name: "Emerson Hall", userType: "Tenant", property: "Cedar Ridge", stage: "Move In – Completed and Feedback", assignedTo: "Mike Davis", phone: "(555) 889-9001", email: "e.hall@email.com", createdAt: "12/15/2025", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Active tenant", nextFollowUp: "01/15/2026", category: "appfolio-tenants", emailsSent: 10, deals: 1, nextAction: "Satisfaction check", source: "AppFolio", lastTouch: "01/05/2026", interestedUnits: [{ address: "200 Cedar Ridge Rd, Asheville, NC 28801", unit: "Unit 4F" }] },
    { id: 20502, name: "Finley Scott", userType: "Tenant", property: "Willow Creek", stage: "Move In – Completed and Feedback", assignedTo: "Sarah Johnson", phone: "(555) 990-0112", email: "f.scott@email.com", createdAt: "12/20/2025", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Active tenant", nextFollowUp: "01/20/2026", category: "appfolio-tenants", emailsSent: 8, deals: 1, nextAction: "30-day check-in", source: "AppFolio", lastTouch: "01/08/2026", interestedUnits: [{ address: "67 Willow Creek Dr, Charlotte, NC 28201", unit: "Unit 2A" }] },
    { id: 20503, name: "Dakota Lee", userType: "Tenant", property: "Elm Street Apts", stage: "Move In – Completed and Feedback", assignedTo: "Richard Surovi", phone: "(555) 001-1223", email: "d.lee@email.com", createdAt: "11/01/2025", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Active tenant", nextFollowUp: "02/01/2026", category: "appfolio-tenants", emailsSent: 15, deals: 1, nextAction: "Renewal notice", source: "AppFolio", lastTouch: "01/02/2026", interestedUnits: [{ address: "180 Elm St, Philadelphia, PA 19101", unit: "Unit 12B" }] },
  ],
  "appfolio-vendors": [
    { id: 20601, name: "Morgan Price", userType: "Tenant", property: "North Commons", stage: "Scheduled Showing", assignedTo: "Emily Brown", phone: "(555) 112-2345", email: "m.price@email.com", createdAt: "01/07/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Vendor referral", nextFollowUp: "01/11/2026", category: "appfolio-vendors", emailsSent: 3, deals: 0, nextAction: "Property tour", source: "Vendor Referral", lastTouch: "01/08/2026", interestedUnits: [{ address: "450 North Commons Way, Minneapolis, MN 55401", unit: "Unit 6C" }] },
    { id: 20602, name: "Jordan Reed", userType: "Tenant", property: "South Plaza", stage: "New Prospects", assignedTo: "Mike Davis", phone: "(555) 223-3456", email: "j.reed@email.com", createdAt: "01/10/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "New inquiry", nextFollowUp: "01/13/2026", category: "appfolio-vendors", emailsSent: 1, deals: 0, nextAction: "Initial call", source: "Vendor Referral", lastTouch: "01/10/2026", interestedUnits: [{ address: "330 South Plaza St, Kansas City, MO 64101", unit: "Unit 8D" }] },
  ],
  "global-investments-leads": [
    { id: 20701, name: "Taylor Bennett", userType: "Tenant", property: "Executive Suites", stage: "Appointment Booked with LC", assignedTo: "Sarah Johnson", phone: "(555) 334-4567", email: "t.bennett@email.com", createdAt: "01/09/2026", unitDetails: "3BR/2BA", numberOfUnits: 1, lastCallStatus: "Corporate inquiry", nextFollowUp: "01/12/2026", category: "global-investments-leads", emailsSent: 2, deals: 0, nextAction: "Corporate tour", source: "Global Investments", lastTouch: "01/09/2026", interestedUnits: [{ address: "1000 Executive Way, New York, NY 10001", unit: "Suite 15A" }] },
    { id: 20702, name: "Casey Morgan", userType: "Tenant", property: "Business Center", stage: "Interested – Application Sent", assignedTo: "Richard Surovi", phone: "(555) 445-5678", email: "c.morgan@email.com", createdAt: "01/06/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Corporate approval", nextFollowUp: "01/10/2026", category: "global-investments-leads", emailsSent: 5, deals: 0, nextAction: "Send proposal", source: "Global Investments", lastTouch: "01/07/2026", interestedUnits: [{ address: "500 Business Center Blvd, Houston, TX 77001", unit: "Suite 8B" }] },
  ],
  "new-prospect-leads": [
    { id: 20801, name: "Riley Adams", userType: "Tenant", property: "Sunrise Apartments", stage: "New Prospects", assignedTo: "Emily Brown", phone: "(555) 556-6789", email: "r.adams@email.com", createdAt: "01/11/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "New inquiry", nextFollowUp: "01/14/2026", category: "new-prospect-leads", emailsSent: 1, deals: 0, nextAction: "Initial contact", source: "Website", lastTouch: "01/11/2026", interestedUnits: [{ address: "75 Sunrise Ave, Phoenix, AZ 85001", unit: "Unit 3D" }] },
    { id: 20802, name: "Avery Collins", userType: "Tenant", property: "Moonlight Terrace", stage: "Scheduled Showing", assignedTo: "Mike Davis", phone: "(555) 667-7890", email: "a.collins@email.com", createdAt: "01/08/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Tour scheduled", nextFollowUp: "01/12/2026", category: "new-prospect-leads", emailsSent: 3, deals: 0, nextAction: "Property showing", source: "Zillow", lastTouch: "01/09/2026", interestedUnits: [{ address: "290 Moonlight Terrace, Las Vegas, NV 89101", unit: "Unit 6A" }] },
    { id: 20803, name: "Drew Foster", userType: "Tenant", property: "Starlight Complex", stage: "Application Approved – Lease Sent", assignedTo: "Sarah Johnson", phone: "(555) 778-8901", email: "d.foster@email.com", createdAt: "01/04/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Application approved", nextFollowUp: "01/10/2026", category: "new-prospect-leads", emailsSent: 7, deals: 1, nextAction: "Lease signing", source: "Apartments.com", lastTouch: "01/08/2026", interestedUnits: [{ address: "410 Starlight Complex Dr, San Jose, CA 95101", unit: "Unit 11E" }] },
    { id: 20804, name: "Quinn Hayes", userType: "Tenant", property: "Cloud Nine Apts", stage: "New Prospects", assignedTo: "Richard Surovi", phone: "(555) 889-9012", email: "q.hayes@email.com", createdAt: "01/12/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Left message", nextFollowUp: "01/15/2026", category: "new-prospect-leads", emailsSent: 2, deals: 0, nextAction: "Follow up", source: "Walk-in", lastTouch: "01/12/2026", interestedUnits: [{ address: "880 Cloud Nine Way, Tucson, AZ 85701", unit: "Unit 2B" }] },
  ],
  "new-tenant-leads": [
    { id: 20901, name: "Blake Turner", userType: "Tenant", property: "Evergreen Place", stage: "New Prospects", assignedTo: "Emily Brown", phone: "(555) 990-0123", email: "b.turner@email.com", createdAt: "01/10/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "New inquiry", nextFollowUp: "01/13/2026", category: "new-tenant-leads", emailsSent: 1, deals: 0, nextAction: "Initial call", source: "Website", lastTouch: "01/10/2026", interestedUnits: [{ address: "560 Evergreen Pl, Salt Lake City, UT 84101", unit: "Unit 7C" }] },
    { id: 20902, name: "Sydney Baker", userType: "Tenant", property: "Autumn Ridge", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Mike Davis", phone: "(555) 001-1234", email: "s.baker@email.com", createdAt: "01/07/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Viewing completed", nextFollowUp: "01/11/2026", category: "new-tenant-leads", emailsSent: 4, deals: 0, nextAction: "Send application", source: "Zillow", lastTouch: "01/08/2026", interestedUnits: [{ address: "145 Autumn Ridge Dr, Richmond, VA 23219", unit: "Unit 5A" }] },
    { id: 20903, name: "Jamie Nelson", userType: "Tenant", property: "Spring Valley", stage: "Lease Signed – Schedule Move In", assignedTo: "Sarah Johnson", phone: "(555) 112-2345", email: "j.nelson@email.com", createdAt: "01/03/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/10/2026", category: "new-tenant-leads", emailsSent: 8, deals: 1, nextAction: "Move-in prep", source: "Referral", lastTouch: "01/07/2026", interestedUnits: [{ address: "330 Spring Valley Ln, Louisville, KY 40201", unit: "Unit 10F" }] },
  ],
  "new-tenants": [
    { id: 21001, name: "Cameron Brooks", userType: "Tenant", property: "Winter Park", stage: "Move In – Completed and Feedback", assignedTo: "Richard Surovi", phone: "(555) 223-3456", email: "c.brooks@email.com", createdAt: "12/28/2025", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Moved in", nextFollowUp: "01/28/2026", category: "new-tenants", emailsSent: 12, deals: 1, nextAction: "30-day check-in", source: "Website", lastTouch: "01/05/2026" },
    { id: 21002, name: "Reese Campbell", userType: "Tenant", property: "Summer Heights", stage: "Move In – Completed and Feedback", assignedTo: "Emily Brown", phone: "(555) 334-4567", email: "r.campbell@email.com", createdAt: "01/02/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Onboarding", nextFollowUp: "01/15/2026", category: "new-tenants", emailsSent: 9, deals: 1, nextAction: "Welcome packet", source: "Zillow", lastTouch: "01/08/2026" },
    { id: 21003, name: "Parker Hughes", userType: "Tenant", property: "Lakefront Apts", stage: "Move In – Completed and Feedback", assignedTo: "Mike Davis", phone: "(555) 445-5678", email: "p.hughes@email.com", createdAt: "01/05/2026", unitDetails: "Studio", numberOfUnits: 1, lastCallStatus: "Active tenant", nextFollowUp: "02/05/2026", category: "new-tenants", emailsSent: 6, deals: 1, nextAction: "Satisfaction survey", source: "Walk-in", lastTouch: "01/10/2026" },
  ],
  "new-tenants-leads": [
    { id: 21101, name: "Hayden Ross", userType: "Tenant", property: "Riverfront Plaza", stage: "New Prospects", assignedTo: "Sarah Johnson", phone: "(555) 556-6789", email: "h.ross@email.com", createdAt: "01/11/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "New inquiry", nextFollowUp: "01/14/2026", category: "new-tenants-leads", emailsSent: 1, deals: 0, nextAction: "Initial contact", source: "Apartments.com", lastTouch: "01/11/2026" },
    { id: 21102, name: "Skyler Ward", userType: "Tenant", property: "Harborside", stage: "Scheduled Showing", assignedTo: "Richard Surovi", phone: "(555) 667-7890", email: "s.ward@email.com", createdAt: "01/08/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Tour scheduled", nextFollowUp: "01/12/2026", category: "new-tenants-leads", emailsSent: 3, deals: 0, nextAction: "Property showing", source: "Zillow", lastTouch: "01/09/2026" },
  ],
  "new-vendor-leads": [
    { id: 21201, name: "Emerson Cox", userType: "Tenant", property: "Vendor Referral Unit", stage: "Appointment Booked with LC", assignedTo: "Emily Brown", phone: "(555) 778-8901", email: "e.cox@email.com", createdAt: "01/09/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Vendor referral", nextFollowUp: "01/12/2026", category: "new-vendor-leads", emailsSent: 2, deals: 0, nextAction: "Thank vendor", source: "Vendor", lastTouch: "01/09/2026" },
    { id: 21202, name: "Finley Diaz", userType: "Tenant", property: "Service Partner Unit", stage: "Interested – Application Sent", assignedTo: "Mike Davis", phone: "(555) 889-9012", email: "f.diaz@email.com", createdAt: "01/06/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Following up", nextFollowUp: "01/10/2026", category: "new-vendor-leads", emailsSent: 4, deals: 0, nextAction: "Send listings", source: "Vendor", lastTouch: "01/07/2026" },
  ],
  "pmc-leads": [
    { id: 21301, name: "Dakota Perry", userType: "Tenant", property: "PMC Portfolio A", stage: "Appointment Booked with LC", assignedTo: "Sarah Johnson", phone: "(555) 990-0123", email: "d.perry@email.com", createdAt: "01/10/2026", unitDetails: "3BR/2BA", numberOfUnits: 1, lastCallStatus: "PMC referral", nextFollowUp: "01/13/2026", category: "pmc-leads", emailsSent: 2, deals: 0, nextAction: "Corporate intro", source: "PMC Partner", lastTouch: "01/10/2026" },
    { id: 21302, name: "Morgan Gray", userType: "Tenant", property: "PMC Portfolio B", stage: "Scheduled Showing", assignedTo: "Richard Surovi", phone: "(555) 001-1234", email: "m.gray@email.com", createdAt: "01/07/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "In discussion", nextFollowUp: "01/11/2026", category: "pmc-leads", emailsSent: 5, deals: 0, nextAction: "Property tour", source: "PMC Partner", lastTouch: "01/08/2026" },
    { id: 21303, name: "Jordan Bell", userType: "Tenant", property: "PMC Portfolio C", stage: "Application Approved – Lease Sent", assignedTo: "Emily Brown", phone: "(555) 112-2345", email: "j.bell@email.com", createdAt: "01/04/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/10/2026", category: "pmc-leads", emailsSent: 8, deals: 1, nextAction: "Lease prep", source: "PMC Partner", lastTouch: "01/07/2026" },
  ],
  "realty-buyer-leads": [
    { id: 21401, name: "Taylor Stone", userType: "Tenant", property: "Buyer Inquiry Unit", stage: "New Prospects", assignedTo: "Mike Davis", phone: "(555) 223-3456", email: "t.stone@email.com", createdAt: "01/11/2026", unitDetails: "2BR/1BA", numberOfUnits: 1, lastCallStatus: "Buyer inquiry", nextFollowUp: "01/14/2026", category: "realty-buyer-leads", emailsSent: 1, deals: 0, nextAction: "Rental options", source: "Realty Partner", lastTouch: "01/11/2026" },
    { id: 21402, name: "Casey Ford", userType: "Tenant", property: "Cross-sell Unit", stage: "Interested – Application Sent", assignedTo: "Sarah Johnson", phone: "(555) 334-4567", email: "c.ford@email.com", createdAt: "01/08/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Interested in rental", nextFollowUp: "01/12/2026", category: "realty-buyer-leads", emailsSent: 4, deals: 0, nextAction: "Show rentals", source: "Realty Partner", lastTouch: "01/09/2026" },
  ],
  "realty-seller-leads": [
    { id: 21501, name: "Riley Grant", userType: "Tenant", property: "Seller Transition Unit", stage: "New Prospects", assignedTo: "Richard Surovi", phone: "(555) 445-5678", email: "r.grant@email.com", createdAt: "01/10/2026", unitDetails: "3BR/2BA", numberOfUnits: 1, lastCallStatus: "Seller transition", nextFollowUp: "01/13/2026", category: "realty-seller-leads", emailsSent: 2, deals: 0, nextAction: "Discuss timeline", source: "Realty Partner", lastTouch: "01/10/2026" },
    { id: 21502, name: "Avery Wells", userType: "Tenant", property: "Bridge Rental Unit", stage: "Showing Completed – Awaiting Feedback", assignedTo: "Emily Brown", phone: "(555) 556-6789", email: "a.wells@email.com", createdAt: "01/07/2026", unitDetails: "2BR/2BA", numberOfUnits: 1, lastCallStatus: "Needs temporary housing", nextFollowUp: "01/11/2026", category: "realty-seller-leads", emailsSent: 5, deals: 0, nextAction: "Short-term options", source: "Realty Partner", lastTouch: "01/08/2026" },
    { id: 21503, name: "Drew Mitchell", userType: "Tenant", property: "Post-sale Rental", stage: "Application Approved – Lease Sent", assignedTo: "Mike Davis", phone: "(555) 667-7890", email: "d.mitchell@email.com", createdAt: "01/03/2026", unitDetails: "1BR/1BA", numberOfUnits: 1, lastCallStatus: "Approved", nextFollowUp: "01/09/2026", category: "realty-seller-leads", emailsSent: 9, deals: 1, nextAction: "Lease signing", source: "Realty Partner", lastTouch: "01/06/2026" },
  ],
}

const getCategoryStages = (categoryId: string) => {
  switch (categoryId) {
    case "acquisition-leads":
    case "acquisition-prospects":
    case "agents-referral":
    case "appfolio-owner-contracts":
    case "appfolio-tenant-applicants":
    case "appfolio-tenants":
    case "appfolio-vendors":
    case "global-investments-leads":
    case "new-prospect-leads":
    case "new-tenant-leads":
    case "new-tenants":
    case "new-tenants-leads":
    case "new-vendor-leads":
    case "pmc-leads":
    case "realty-buyer-leads":
    case "realty-seller-leads":
      return prospectType1Stages
    case "acquisition-owners":
      return [
        "New lead",
        "Attempting to contact",
        "Scheduled Intro call",
        "Working",
        "Proposal Sent",
        "Closing",
        "Won",
        "Lost",
      ]
    case "new-owner-leads":
      return ownerType1Stages
    default:
      return ownerType1Stages
  }
}

export default function LeadsPage({ params }: { params?: { view?: string } }) {
  const { view } = useView()
  const nav = useNav()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [showColumnSettingsDialog, setShowColumnSettingsDialog] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    emailsSent: true,
    units: true,
    nextAction: true,
    stage: true,
    assignee: true,
    source: true,
    lastTouch: true,
    createdAt: true,
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProspectCategory, setSelectedProspectCategory] = useState<string | null>(null)
  const [categorySearchQuery, setCategorySearchQuery] = useState("")

  const [ownerType, setOwnerType] = useState<string>("type1")
  const [prospectType, setProspectType] = useState<string>("type1")
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all")
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState<string>("")
  const [tileStaffFilter, setTileStaffFilter] = useState<string>("all")
  const [tileStaffSearch, setTileStaffSearch] = useState<string>("")
  const [tileStaffOpen, setTileStaffOpen] = useState(false)
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([])
  const [stageSearchQuery, setStageSearchQuery] = useState<string>("")
  const [sourceSearchQuery, setSourceSearchQuery] = useState<string>("")
  const [unitsSearchQuery, setUnitsSearchQuery] = useState<string>("")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [customDateFrom, setCustomDateFrom] = useState<string>("")
  const [customDateTo, setCustomDateTo] = useState<string>("")

  const getInitialType = () => {
    if (params?.view === "owners") return "owner"
    if (params?.view === "tenants") return "tenant"
    return "all"
  }

  const [selectedType, setSelectedType] = useState<"all" | "owner" | "tenant">(getInitialType())
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [filterUnitType, setFilterUnitType] = useState<string>("all")
  const [filterNumUnits, setFilterNumUnits] = useState<string>("all")
  const [filterCallStatus, setFilterCallStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [selectedLead, setSelectedLead] = useState<number | null>(null)
  const [selectedLeadDefaultTab, setSelectedLeadDefaultTab] = useState<string | undefined>(undefined)
  const [draggedLead, setDraggedLead] = useState<number | null>(null)

  // New multi-select filters
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedEmailsSent, setSelectedEmailsSent] = useState<string[]>([])
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [selectedLastTouch, setSelectedLastTouch] = useState<string[]>([])
  const [selectedCreated, setSelectedCreated] = useState<string[]>([])
  const [lastTouchDateFilter, setLastTouchDateFilter] = useState<string>("all")
  const [createdDateFilter, setCreatedDateFilter] = useState<string>("all")
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState<number>(20)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData)
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  // Owner Prospect advanced filter modal states
  const [showOwnerProspectFilterModal, setShowOwnerProspectFilterModal] = useState(false)
  const [ownerProspectModalFilterField, setOwnerProspectModalFilterField] = useState("")
  const [ownerProspectModalFilterValues, setOwnerProspectModalFilterValues] = useState<string[]>([])
  const [ownerProspectModalOptionSearch, setOwnerProspectModalOptionSearch] = useState("")
  const [ownerProspectModalFieldSearch, setOwnerProspectModalFieldSearch] = useState("")
  const [showOwnerProspectFieldDropdown, setShowOwnerProspectFieldDropdown] = useState(false)
  const [ownerProspectAppliedFilters, setOwnerProspectAppliedFilters] = useState<{ field: string; values: string[] }[]>([])

  // Filter fields for owner prospect filter modal (same as All Properties page)
  const OWNER_PROSPECT_FILTER_FIELDS = [
    "Integration", "Status", "Property Group(s)", "In Relationship(s)", "In Relationship Status",
    "Tagged With Any", "Tagged With All", "Created At", "Updated At", "Owner Move Out Date",
    "Have we received the signed management agreement yet?", "HOA?", "HOA Name", "Utility Region",
    "Do we have the HOA documents/contact info?", "Pet's Allowed?", "Power Company", "Gas Company",
    "Available By Date", "Section 8?", "Trash Company", "Water/Sewer Company", "Oil (Heat or Hot Water)",
    "Available", "Water Company", "Sewer Company", "Start Marketing", "Does the owner allow for pets?",
    "Microwave Included?", "Dishwasher Included?", "Stove/Oven Included?", "Refrigerator Included?",
    "Listing Price", "Sold Price", "Washer Included?", "Date Ratified", "Dryer Included?", "Listing Date",
    "Pool?", "Send Seller Brokerage Fee Form", "Community Center?", "House keys", "PICRA RECEIVED",
    "Lockbox Code", "Mailbox keys", "PICRA RATIFIED", "Closing Date", "Community keys", "Walkthrough Date",
    "Garage door remotes", "Ceiling fan remotes", "Listing Agreement Signed", "Power Company Contact",
    "Key Fobs (for HOA)", "Termite & Moisture Inspection Date", "Air conditioning", "Inspection Date",
    "Security Code", "Decision on applying to Guarantors", "Guarantors results on renewal",
    "Satisfaction follow-up email response", "Funds Received?",
  ]

  const OWNER_PROSPECT_FIELDS_WITH_SELECT_ALL = ["Property Group(s)", "In Relationship(s)", "Tagged With Any", "Tagged With All"]

  const getOwnerProspectFilterOptions = (field: string): string[] => {
    if (field === "Status") return ["Active", "Inactive"]
    if (field === "Property Group(s)") return [
      "CSR - Abby Portfolio", "CSR - Aiden Portfolio", "CSR - Alyssa Portfolio", "CSR - Amanda Portfolio",
      "CSR - Ashton Portfolio", "CSR - Ayesha Portfolio", "CSR - Brett Portfolio", "CSR - Colin Portfolio",
      "CSR - Devin Portfolio", "CSR - Elena Portfolio", "CSR - Fiona Portfolio", "CSR - Grant Portfolio",
      "CSR - Hannah Portfolio", "CSR - Isaac Portfolio", "CSR - Julia Portfolio", "CSR - Kevin Portfolio",
      "CSR - Liam Portfolio", "CSR - Maya Portfolio", "CSR - Noah Portfolio", "CSR - Olivia Portfolio",
    ]
    if (field === "In Relationship(s)") return [
      "New Tenant Leads", "NEW TENANTS LEADS", "New Vendor Leads", "PMC Leads",
      "Realty Buyer Leads", "Realty Seller Leads", "Recruiting", "Referral Partners",
      "Scott PMC Acquisitions", "Strategic Property Owner Leads",
    ]
    if (field === "Tagged With Any" || field === "Tagged With All") return ["Commercial", "Corporate", "Residential", "VIP", "New", "Priority"]
    if (field === "Integration") return ["AppFolio", "Buildium", "RentManager", "Yardi", "None"]
    if (field === "In Relationship Status") return ["Active", "Inactive", "Pending"]
    if (field.includes("Included?") || field.includes("Allowed?") || field === "HOA?" || field === "Pool?" || field === "Community Center?" || field === "Section 8?" || field === "Available" || field === "Funds Received?" || field === "Does the owner allow for pets?") return ["Yes", "No"]
    if (field === "Utility Region") return ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast", "Pacific Northwest"]
    return ["Option A", "Option B", "Option C"]
  }

  const applyOwnerProspectModalFilter = () => {
    if (!ownerProspectModalFilterField || ownerProspectModalFilterValues.length === 0) return
    setOwnerProspectAppliedFilters([...ownerProspectAppliedFilters, { field: ownerProspectModalFilterField, values: ownerProspectModalFilterValues }])
    setOwnerProspectModalFilterField("")
    setOwnerProspectModalFilterValues([])
    setOwnerProspectModalOptionSearch("")
    setShowOwnerProspectFilterModal(false)
    setPage(1)
  }

  const closeOwnerProspectFilterModal = () => {
    setShowOwnerProspectFilterModal(false)
    setOwnerProspectModalFilterField("")
    setOwnerProspectModalFilterValues([])
    setOwnerProspectModalOptionSearch("")
    setOwnerProspectModalFieldSearch("")
    setShowOwnerProspectFieldDropdown(false)
  }

  const removeOwnerProspectFilter = (index: number) => {
    setOwnerProspectAppliedFilters(ownerProspectAppliedFilters.filter((_, i) => i !== index))
    setPage(1)
  }

  const skipStepDialogInitialState = {
    open: false,
    leadId: null,
    leadName: "",
    currentStage: "",
    newStage: "",
    incompleteSteps: [],
  }
  const [skipStepDialog, setSkipStepDialog] = useState<{
    open: boolean
    leadId: number | null
    leadName: string
    currentStage: string
    newStage: string
    incompleteSteps: string[]
  }>(skipStepDialogInitialState)
  const [skipReason, setSkipReason] = useState<string>("")
  const [skipComments, setSkipComments] = useState<string>("")

  // Reset all filters to default values
  const resetAllFilters = () => {
    setSelectedAssignee("all")
    setSelectedAssignees([])
    setSelectedStages([])
    setSelectedSources([])
    setSelectedEmailsSent([])
    setSelectedUnits([])
    setSelectedLastTouch([])
    setSelectedCreated([])
    setLastTouchDateFilter("all")
    setCreatedDateFilter("all")
    setSelectedStage("all")
    setFilterUnitType("all")
    setFilterNumUnits("all")
    setFilterCallStatus("all")
    setAssigneeSearchQuery("")
    setStageSearchQuery("")
    setSourceSearchQuery("")
    setUnitsSearchQuery("")
    setTileStaffFilter("all")
    setTileStaffSearch("")
    setPage(1)
  }

  // Check if any filter is active (not at default value)
  const hasActiveFilters =
    tileStaffFilter !== "all" ||
    selectedAssignee !== "all" ||
    selectedAssignees.length > 0 ||
    selectedStages.length > 0 ||
    selectedSources.length > 0 ||
    selectedEmailsSent.length > 0 ||
    selectedUnits.length > 0 ||
    selectedLastTouch.length > 0 ||
    selectedCreated.length > 0 ||
    lastTouchDateFilter !== "all" ||
    createdDateFilter !== "all" ||
    selectedStage !== "all" ||
    filterUnitType !== "all" ||
    filterNumUnits !== "all" ||
    filterCallStatus !== "all"

  // Update leads when selectedCategory or params.view changes
  useEffect(() => {
    if (params?.view === "owners" && selectedCategory) {
      const categoryData = CATEGORY_LEADS[selectedCategory] || []
      setLeads(categoryData)
    } else if (params?.view === "tenants" && selectedProspectCategory) {
      const categoryData = PROSPECT_CATEGORY_LEADS[selectedProspectCategory] || []
      setLeads(categoryData)
    } else {
      setLeads(initialLeadsData)
    }
    // Reset filters when category changes
    setPage(1)
    setSelectedStage("all")
    setSearchQuery("")
  }, [selectedCategory, selectedProspectCategory, params?.view])

  const filteredSortedLeads = leads
    .filter((lead) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        (lead.property && lead.property.toLowerCase().includes(q)) ||
        lead.assignedTo.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.toLowerCase().includes(q)) ||
        (lead.interestedUnits && lead.interestedUnits.some((u: { address: string; unit: string }) =>
          u.address.toLowerCase().includes(q) || u.unit.toLowerCase().includes(q)
        ))

      // Skip type filter when viewing a specific category in owners or tenants view
      const matchesType = selectedType === "all" || selectedCategory || selectedProspectCategory || lead.userType.toLowerCase() === selectedType.toLowerCase()
      const matchesStage = selectedStage === "all" || lead.stage.toLowerCase() === selectedStage.toLowerCase()
      const matchesUnitType = filterUnitType === "all" || (lead.unitDetails && lead.unitDetails === filterUnitType)
      const matchesNumUnits =
        filterNumUnits === "all" || (lead.numberOfUnits !== undefined && lead.numberOfUnits === Number(filterNumUnits))
      const matchesCallStatus =
        filterCallStatus === "all" || (lead.lastCallStatus && lead.lastCallStatus === filterCallStatus)

      // Skip ownerType/prospectType filters when viewing a specific category
      const matchesOwnerType = params?.view !== "owners" || selectedCategory || !lead.ownerType || lead.ownerType === ownerType
      const matchesProspectType = params?.view !== "tenants" || selectedProspectCategory || !lead.prospectType || lead.prospectType === prospectType

      // Assignee filter for tenants view
      const matchesAssignee = selectedAssignee === "all" ||
        (lead.assignedTo && lead.assignedTo.toLowerCase().replace(/\s+/g, "-") === selectedAssignee)

      // Tile staff filter
      const matchesTileStaff = tileStaffFilter === "all" ||
        (lead.assignedTo && lead.assignedTo.toLowerCase().replace(/\s+/g, "-") === tileStaffFilter)

      // Units multi-select filter
      const matchesUnitsFilter = selectedUnits.length === 0 ||
        (lead.numberOfUnits !== undefined && selectedUnits.includes(String(lead.numberOfUnits)))

      if (view === "staff" && lead.assignedTo !== "Nina") return false

      return (
        matchesSearch &&
        matchesType &&
        matchesStage &&
        matchesUnitType &&
        matchesNumUnits &&
        matchesCallStatus &&
        matchesOwnerType &&
        matchesProspectType &&
        matchesAssignee &&
        matchesUnitsFilter &&
        matchesTileStaff
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "az") return a.name.localeCompare(b.name)
      return 0
    })

  const totalItems = filteredSortedLeads.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const pagedLeads = filteredSortedLeads.slice((page - 1) * pageSize, page * pageSize)
  const visibleLeads = filteredSortedLeads.slice(0, visibleCount)
  const hasMoreLeads = visibleCount < totalItems

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, totalItems))
      setIsLoadingMore(false)
    }, 300)
  }

  useEffect(() => {
    setPage(1)
  }, [
    searchQuery,
    selectedType,
    selectedStage,
    filterUnitType,
    filterNumUnits,
    filterCallStatus,
    sortBy,
    selectedCategory, // Re-render on category change
  ])

  const exportCSV = () => {
    const header = [
      "Name",
      "Type",
      "Property",
      "Stage",
      "Assigned",
      "Phone",
      "Email",
      "Created",
      "Unit Type",
      "# Units",
      "Last Call",
      "Next Follow-Up",
      "Emails Sent",
      "Deals",
      "Next Action",
      "Source",
      "Last Touch",
    ]
    const rows = filteredSortedLeads.map((l) => [
      l.name,
      l.userType,
      l.property,
      l.stage,
      l.assignedTo,
      l.phone,
      l.email,
      l.createdAt,
      l.unitDetails,
      l.numberOfUnits,
      l.lastCallStatus,
      l.nextFollowUp,
      l.emailsSent,
      l.deals,
      l.nextAction,
      l.source,
      l.lastTouch,
    ])
    const csvContent =
      header.join(",") +
      "\n" +
      rows
        .map((r) =>
          r
            .map((cell) => {
              const s = String(cell ?? "")
              return `"${s.replace(/"/g, '""')}"`
            })
            .join(","),
        )
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Export started", description: `Exporting ${filteredSortedLeads.length} rows` })
  }

  if (selectedLead !== null) {
    const lead = leads.find((l) => l.id === selectedLead)
    if (lead) {
      // Use OwnerDetailPage for owners view
      if (params?.view === "owners") {
        return (
          <OwnerDetailPage
            lead={lead}
            onBack={() => setSelectedLead(null)}
            onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
          />
        )
      }
      // Use TenantApplicationDetailView for other views
      return (
        <TenantApplicationDetailView
          lead={lead}
          onBack={() => { setSelectedLead(null); setSelectedLeadDefaultTab(undefined) }}
          defaultTab={selectedLeadDefaultTab}
          onNavigateToProperty={(propertyName) => nav.go("propertyDetail", { id: propertyName })}
          onConvertToTenant={(convertedLead, finalizedProperty) => {
            // Remove the lead from the leads list (prospect is now a tenant)
            setLeads((prevLeads) => prevLeads.filter((l) => l.id !== convertedLead.id))
            // Show success toast
            toast({
              title: "Prospect Converted to Tenant",
              description: `${convertedLead.name} has been moved to Tenants with ${finalizedProperty.name} as their assigned property.`,
            })
            setSelectedLead(null)
          }}
        />
      )
    }
  }

  const getOwnerStagesByType = (type: string) => {
    switch (type) {
      case "type1":
        return ownerType1Stages
      case "type2":
        return ownerType2Stages
      case "type3":
        return ownerType3Stages
      case "type4":
        return ownerType4Stages
      default:
        return ownerType1Stages
    }
  }

  const getProspectStagesByType = (type: string) => {
    switch (type) {
      case "type1":
        return prospectType1Stages
      case "type2":
        return prospectType2Stages
      case "type3":
        return prospectType3Stages
      case "type4":
        return prospectType4Stages
      default:
        return prospectType1Stages
    }
  }

  const kanbanStages =
    params?.view === "owners" && selectedCategory
      ? getCategoryStages(selectedCategory)
      : params?.view === "tenants"
        ? getProspectStagesByType(prospectType)
        : params?.view === "owners"
          ? getOwnerStagesByType(ownerType)
          : ownerStages

  const leadsByStage = kanbanStages.reduce(
    (acc, stage) => {
      acc[stage] = filteredSortedLeads.filter((lead) => lead.stage === stage)
      return acc
    },
    {} as Record<string, Lead[]>,
  )

  const handleStageChange = (leadId: number, newStage: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return

    const isOwner = lead.userType === "Owner" || lead.userType.includes("Owner") // Handle variations
    const stages = isOwner
      ? getOwnerStagesByType(lead.ownerType || "type1")
      : getProspectStagesByType(lead.prospectType || "type1")

    const currentStageIndex = stages.indexOf(lead.stage)
    const newStageIndex = stages.indexOf(newStage)

    if (newStageIndex > currentStageIndex + 1) {
      const skippedStages = stages.slice(currentStageIndex + 1, newStageIndex)
      setSkipStepDialog({
        open: true,
        leadId,
        leadName: lead.name,
        currentStage: lead.stage,
        newStage,
        incompleteSteps: skippedStages,
      })
      return
    }

    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)))
  }

  const handleConfirmSkip = () => {
    if (skipStepDialog.leadId) {
      setLeads((prev) =>
        prev.map((l) => (l.id === skipStepDialog.leadId ? { ...l, stage: skipStepDialog.newStage } : l)),
      )
      toast({
        title: "Stage Updated",
        description: `${skipStepDialog.leadName} moved to ${skipStepDialog.newStage}. Reason: ${skipReason || skipComments || "Not specified"}`,
      })
    }
    setSkipStepDialog(skipStepDialogInitialState)
    setSkipReason("")
    setSkipComments("")
  }

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    setDraggedLead(leadId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    setDragOverStage(stage)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault()
    if (draggedLead !== null) {
      handleStageChange(draggedLead, stage)
    }
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const filteredCategories = OWNER_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  if (params?.view === "owners" && !selectedCategory) {
    return (
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Owner Categories</h1>
              <p className="text-sm text-muted-foreground">Select a category to view and manage leads</p>
            </div>

          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Category Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Lead Count</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="p-4 font-medium text-muted-foreground text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${category.color}`}>
                              <FolderOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium text-foreground">{category.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="font-normal">
                            {category.count} leads
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCategory(category.id)
                            }}
                          >
                            View Leads
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCategories.length === 0 && (
                <div className="p-8 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="w-56 flex-shrink-0">
          <Card>
            <CardContent className="p-0">
              <div className="p-3 border-b bg-muted/30">
                <h2 className="font-semibold text-base text-gray-800">Quick Actions</h2>
              </div>
              <div className="flex flex-col">
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 border-b border-gray-100 last:border-b-0"
                >
                  <Workflow className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Add Process/Pipeline</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const filteredProspectCategories = PROSPECT_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  // Lease Prospects Category View - mirrors Owner Categories
  if (params?.view === "tenants" && !selectedProspectCategory) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lease Prospect Categories</h1>
            <p className="text-sm text-muted-foreground">Select a category to view and manage lease prospects</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Category Name</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Lead Count</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="p-4 font-medium text-muted-foreground text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProspectCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedProspectCategory(category.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <FolderOpen className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-foreground">{category.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="font-normal">
                          {category.count} leads
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProspectCategory(category.id)
                          }}
                        >
                          View Leads
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProspectCategories.length === 0 && (
              <div className="p-8 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No categories found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCategory = OWNER_CATEGORIES.find((c) => c.id === selectedCategory)
  const currentProspectCategory = PROSPECT_CATEGORIES.find((c) => c.id === selectedProspectCategory)

  // Quick Actions for Owner Prospects Listing
  const ownerProspectsQuickActions = [
    { icon: UserPlus, label: "Add New Owner" },
    { icon: FolderOpen, label: "Import List" },
    { icon: FolderOpen, label: "Export List" },
    { icon: Users, label: "Bulk Email" },
    { icon: Users, label: "Bulk SMS" },
    { icon: Users, label: "Bulk Assignment" },
    { icon: Settings, label: "Bulk Stage change" },
  ]

  return (
    <div className={params?.view === "owners" && selectedCategory ? "flex gap-6" : ""}>
      <div className={params?.view === "owners" && selectedCategory ? "flex-1 space-y-6" : "space-y-6"}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {params?.view === "owners" && selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedCategory(null); setSelectedLeadIds([]) }}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            )}
            {params?.view === "tenants" && selectedProspectCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProspectCategory(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {params?.view === "owners" && currentCategory
                  ? currentCategory.name
                  : params?.view === "tenants" && currentProspectCategory
                    ? currentProspectCategory.name
                    : params?.view === "owners"
                      ? "Owners"
                      : params?.view === "tenants"
                        ? "Lease Prospects"
                        : "All Leads"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {params?.view === "owners" && currentCategory
                  ? `Manage leads in ${currentCategory.name}`
                  : params?.view === "tenants" && currentProspectCategory
                    ? `Manage lease prospects in ${currentProspectCategory.name}`
                    : "Manage and track leads"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportCSV}>
              Export
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Add {params?.view === "owners" ? "Owner" : params?.view === "tenants" ? "Prospect" : "Lead"}
            </Button>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Leads Card with Filter */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-teal-600"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                {/* Left side: Title and number */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{filteredSortedLeads.length.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">All active leads</p>
                </div>

                {/* Right side: Staff Filter */}
                <div className="flex-1 min-w-[220px]">
                  <Popover open={tileStaffOpen} onOpenChange={setTileStaffOpen}>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground hover:bg-muted/50 transition-colors w-full">
                        <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate flex-1 text-left">
                          {tileStaffFilter === "all"
                            ? "Filter by staff..."
                            : ASSIGNEES.find(a => a.id === tileStaffFilter)?.name}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[260px] p-0" align="end">
                      <div className="p-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Staff Members</span>
                          {tileStaffFilter !== "all" && (
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs ml-auto" onClick={() => { setTileStaffFilter("all"); setTileStaffSearch(""); setTileStaffOpen(false) }}>
                              Clear
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Search staff..."
                          value={tileStaffSearch}
                          onChange={(e) => setTileStaffSearch(e.target.value)}
                          className="h-8 mt-2 text-xs"
                        />
                      </div>
                      <div className="max-h-[240px] overflow-y-auto p-1">
                        <button
                          className={`w-full text-left px-2 py-2 rounded text-xs hover:bg-muted/50 transition-colors flex items-center justify-between ${tileStaffFilter === "all" ? "bg-teal-50 text-teal-700 font-medium" : ""}`}
                          onClick={() => { setTileStaffFilter("all"); setTileStaffSearch(""); setTileStaffOpen(false) }}
                        >
                          <span>All Staff Members</span>
                        </button>
                        {ASSIGNEES
                          .filter(a => a.name.toLowerCase().includes(tileStaffSearch.toLowerCase()))
                          .map((assignee) => {
                            const staffLeadCount = leads.filter(lead => lead.assignedTo === assignee.name).length;
                            return (
                              <button
                                key={assignee.id}
                                className={`w-full text-left px-2 py-2 rounded text-xs hover:bg-muted/50 transition-colors flex items-center justify-between ${tileStaffFilter === assignee.id ? "bg-teal-50 text-teal-700 font-medium" : ""}`}
                                onClick={() => { setTileStaffFilter(assignee.id); setTileStaffSearch(""); setTileStaffOpen(false); setPage(1) }}
                              >
                                <span>{assignee.name}</span>
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold ml-2 shrink-0">
                                  {staffLeadCount}
                                </span>
                              </button>
                            );
                          })
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Ratio Card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-emerald-500"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">Conversion Ratio</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {filteredSortedLeads.length > 0
                      ? `${Math.round((filteredSortedLeads.filter(l => l.stage === "Converted" || l.stage === "Client Won" || l.stage === "Closed Won").length / filteredSortedLeads.length) * 100)}%`
                      : "0%"}
                  </p>
                  <p className="text-xs text-muted-foreground">Leads converted to Owners / Clients</p>
                  {/* Visual Progress Indicator */}
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: filteredSortedLeads.length > 0 ? `${Math.round((filteredSortedLeads.filter(l => l.stage === "Converted" || l.stage === "Client Won" || l.stage === "Closed Won").length / filteredSortedLeads.length) * 100)}%` : "0%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar + View Toggle Row */}
        <div className="flex items-center gap-3">
          {/* Prospect Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by prospect name, property address, or staff name..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="pl-9 pr-9 h-10 w-full text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Button and View Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOwnerProspectFilterModal(true)}
              className="h-9 px-3"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </Button>
            {/* View Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="rounded-l-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            {/* Settings Button - Column Visibility */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettingsDialog(true)}
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Applied Filters Display - Owner Prospects */}
        {ownerProspectAppliedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {ownerProspectAppliedFilters.map((filter, index) => (
              <div key={`${filter.field}-${index}`} className="flex items-center gap-1 h-7 px-2.5 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-medium">
                <span>{filter.field}:</span>
                <span className="max-w-[150px] truncate">{filter.values.join(", ")}</span>
                <button
                  type="button"
                  onClick={() => removeOwnerProspectFilter(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setOwnerProspectAppliedFilters([])}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedLeadIds.length}
          totalCount={filteredSortedLeads.length}
          onClearSelection={() => setSelectedLeadIds([])}
          onSelectAll={() => setSelectedLeadIds(filteredSortedLeads.map(l => l.id))}
          selectedNames={filteredSortedLeads.filter(l => selectedLeadIds.includes(l.id)).map(l => l.name)}
          selectedEmails={filteredSortedLeads.filter(l => selectedLeadIds.includes(l.id)).map(l => l.email)}
        />

        {/* Content */}
        {viewMode === "table" ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {/* Select All Checkbox */}
                      <th className="w-10 p-3">
                        <Checkbox
                          checked={visibleLeads.length > 0 && visibleLeads.every(l => selectedLeadIds.includes(l.id))}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLeadIds(prev => [...new Set([...prev, ...visibleLeads.map(l => l.id)])])
                            } else {
                              const visibleIds = new Set(visibleLeads.map(l => l.id))
                              setSelectedLeadIds(prev => prev.filter(id => !visibleIds.has(id)))
                            }
                          }}
                        />
                      </th>
                      {/* Name Column - Plain Header */}
                      {visibleColumns.name && (
                        <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                      )}

                      {/* Emails Sent Column Filter */}
                      {visibleColumns.emailsSent && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                Emails Sent
                                <ChevronDown className={`h-3 w-3 ${selectedEmailsSent.length > 0 ? 'text-teal-600' : ''}`} />
                                {selectedEmailsSent.length > 0 && (
                                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                    {selectedEmailsSent.length}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Emails Sent</span>
                                  {selectedEmailsSent.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedEmailsSent([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {EMAIL_SENT_RANGES.map((range) => (
                                  <div key={range.id} className="flex items-center space-x-2 py-1.5">
                                    <Checkbox
                                      id={`th-email-${range.id}`}
                                      checked={selectedEmailsSent.includes(range.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedEmailsSent([...selectedEmailsSent, range.id])
                                        } else {
                                          setSelectedEmailsSent(selectedEmailsSent.filter((e) => e !== range.id))
                                        }
                                      }}
                                    />
                                    <label htmlFor={`th-email-${range.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                      {range.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Units Column Filter - For Owners and Tenants (Lease Prospects) views */}
                      {visibleColumns.units && (params?.view === "owners" || params?.view === "tenants") && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                {selectedUnits.length > 0 ? (
                                  <span>{params?.view === "tenants" ? "Unit Address" : "Units"}: {selectedUnits.join(", ")}</span>
                                ) : (
                                  <span>{params?.view === "tenants" ? "Unit Address" : "Units"}</span>
                                )}
                                <ChevronDown className={`h-3 w-3 ${selectedUnits.length > 0 ? 'text-teal-600' : ''}`} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[180px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Units</span>
                                  {selectedUnits.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedUnits([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  placeholder="Search units..."
                                  value={unitsSearchQuery}
                                  onChange={(e) => setUnitsSearchQuery(e.target.value)}
                                  className="h-8"
                                />
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {UNITS_VALUES
                                  .filter(unit => unit.name.includes(unitsSearchQuery))
                                  .map((unit) => (
                                    <div key={unit.id} className="flex items-center space-x-2 py-1.5">
                                      <Checkbox
                                        id={`th-units-${unit.id}`}
                                        checked={selectedUnits.includes(unit.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedUnits([...selectedUnits, unit.id])
                                          } else {
                                            setSelectedUnits(selectedUnits.filter((u) => u !== unit.id))
                                          }
                                        }}
                                      />
                                      <label htmlFor={`th-units-${unit.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                        {unit.name}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Next Action Column - Plain Header */}
                      {visibleColumns.nextAction && (
                        <th className="text-left p-3 font-medium text-muted-foreground">Next Action</th>
                      )}

                      {/* Stage Column Filter */}
                      {visibleColumns.stage && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                Stage
                                <ChevronDown className={`h-3 w-3 ${selectedStages.length > 0 ? 'text-teal-600' : ''}`} />
                                {selectedStages.length > 0 && (
                                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                    {selectedStages.length}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Stage</span>
                                  {selectedStages.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedStages([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  placeholder="Search stages..."
                                  value={stageSearchQuery}
                                  onChange={(e) => setStageSearchQuery(e.target.value)}
                                  className="h-8"
                                />
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {kanbanStages
                                  .filter(stage => stage.toLowerCase().includes(stageSearchQuery.toLowerCase()))
                                  .map((stage) => (
                                    <div key={stage} className="flex items-center space-x-2 py-1.5">
                                      <Checkbox
                                        id={`th-stage-${stage}`}
                                        checked={selectedStages.includes(stage)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedStages([...selectedStages, stage])
                                          } else {
                                            setSelectedStages(selectedStages.filter((s) => s !== stage))
                                          }
                                        }}
                                      />
                                      <label htmlFor={`th-stage-${stage}`} className="text-sm leading-none cursor-pointer flex-1">
                                        {stage}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Assignee Column Filter */}
                      {visibleColumns.assignee && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                Assignee
                                <ChevronDown className={`h-3 w-3 ${selectedAssignees.length > 0 ? 'text-teal-600' : ''}`} />
                                {selectedAssignees.length > 0 && (
                                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                    {selectedAssignees.length}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Assignee</span>
                                  {selectedAssignees.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedAssignees([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  placeholder="Search assignee..."
                                  value={assigneeSearchQuery}
                                  onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                                  className="h-8"
                                />
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {ASSIGNEES
                                  .filter(assignee => assignee.name.toLowerCase().includes(assigneeSearchQuery.toLowerCase()))
                                  .map((assignee) => (
                                    <div key={assignee.id} className="flex items-center space-x-2 py-1.5">
                                      <Checkbox
                                        id={`th-assignee-${assignee.id}`}
                                        checked={selectedAssignees.includes(assignee.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedAssignees([...selectedAssignees, assignee.id])
                                          } else {
                                            setSelectedAssignees(selectedAssignees.filter((a) => a !== assignee.id))
                                          }
                                        }}
                                      />
                                      <label htmlFor={`th-assignee-${assignee.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                        {assignee.name}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Source Column Filter */}
                      {visibleColumns.source && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                Source
                                <ChevronDown className={`h-3 w-3 ${selectedSources.length > 0 ? 'text-teal-600' : ''}`} />
                                {selectedSources.length > 0 && (
                                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                    {selectedSources.length}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Source</span>
                                  {selectedSources.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedSources([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  placeholder="Search source..."
                                  value={sourceSearchQuery}
                                  onChange={(e) => setSourceSearchQuery(e.target.value)}
                                  className="h-8"
                                />
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {SOURCES
                                  .filter(source => source.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
                                  .map((source) => (
                                    <div key={source} className="flex items-center space-x-2 py-1.5">
                                      <Checkbox
                                        id={`th-source-${source}`}
                                        checked={selectedSources.includes(source)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedSources([...selectedSources, source])
                                          } else {
                                            setSelectedSources(selectedSources.filter((s) => s !== source))
                                          }
                                        }}
                                      />
                                      <label htmlFor={`th-source-${source}`} className="text-sm leading-none cursor-pointer flex-1">
                                        {source}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Last Touch Column Filter */}
                      {visibleColumns.lastTouch && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                Last Touch
                                <ChevronDown className={`h-3 w-3 ${selectedLastTouch.length > 0 ? 'text-teal-600' : ''}`} />
                                {selectedLastTouch.length > 0 && (
                                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                    {selectedLastTouch.length}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Last Touch</span>
                                  {selectedLastTouch.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedLastTouch([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {LAST_TOUCH_RANGES.map((range) => (
                                  <div key={range.id} className="flex items-center space-x-2 py-1.5">
                                    <Checkbox
                                      id={`th-lasttouch-${range.id}`}
                                      checked={selectedLastTouch.includes(range.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedLastTouch([...selectedLastTouch, range.id])
                                        } else {
                                          setSelectedLastTouch(selectedLastTouch.filter((l) => l !== range.id))
                                        }
                                      }}
                                    />
                                    <label htmlFor={`th-lasttouch-${range.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                      {range.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Created At Column Filter */}
                      {visibleColumns.createdAt && (
                        <th className="text-left p-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground hover:bg-transparent flex items-center gap-1">
                                Created At
                                <ChevronDown className={`h-3 w-3 ${selectedCreated.length > 0 ? 'text-teal-600' : ''}`} />
                                {selectedCreated.length > 0 && (
                                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-teal-100 text-teal-700">
                                    {selectedCreated.length}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <div className="p-2 border-b">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Created</span>
                                  {selectedCreated.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectedCreated([])}>
                                      Clear
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-2">
                                {CREATED_RANGES.map((range) => (
                                  <div key={range.id} className="flex items-center space-x-2 py-1.5">
                                    <Checkbox
                                      id={`th-created-${range.id}`}
                                      checked={selectedCreated.includes(range.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedCreated([...selectedCreated, range.id])
                                        } else {
                                          setSelectedCreated(selectedCreated.filter((c) => c !== range.id))
                                        }
                                      }}
                                    />
                                    <label htmlFor={`th-created-${range.id}`} className="text-sm leading-none cursor-pointer flex-1">
                                      {range.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </th>
                      )}

                      {/* Actions Column with Reset Button */}
                      <th className="text-left p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">Actions</span>
                          {hasActiveFilters && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={resetAllFilters}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reset
                            </Button>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`border-b hover:bg-muted/50 cursor-pointer h-16 ${selectedLeadIds.includes(lead.id) ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedLead(lead.id)}
                      >
                        <td className="p-4 w-10" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedLeadIds.includes(lead.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLeadIds(prev => [...prev, lead.id])
                              } else {
                                setSelectedLeadIds(prev => prev.filter(id => id !== lead.id))
                              }
                            }}
                          />
                        </td>
                        {visibleColumns.name && (
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                                  {lead.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{lead.name}</p>
                                <p className="text-xs text-muted-foreground">{lead.email}</p>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.emailsSent && (
                          <td className="p-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {lead.emailsSent || 0}
                            </Badge>
                          </td>
                        )}
                        {visibleColumns.units && (params?.view === "owners" || params?.view === "tenants") && (
                          <td className="p-4">
                            {params?.view === "tenants" && lead.interestedUnits && lead.interestedUnits.length > 0 ? (
                              (() => {
                                const grouped: Record<string, string[]> = {}
                                lead.interestedUnits.forEach((u: { address: string; unit: string }) => {
                                  const shortAddr = u.address.split(",")[0]
                                  if (!grouped[shortAddr]) grouped[shortAddr] = []
                                  grouped[shortAddr].push(u.unit.replace(/^Unit\s*/i, ""))
                                })
                                const entries = Object.entries(grouped)
                                const visible = entries.slice(0, 2)
                                const remaining = entries.length - 2
                                return (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedLeadDefaultTab("property")
                                      setSelectedLead(lead.id)
                                    }}
                                    className="text-left hover:underline"
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      {visible.map(([addr, units], idx) => (
                                        <div key={idx} className="text-xs leading-snug">
                                          <span className="text-foreground font-medium">{addr}</span>
                                          <span className="text-muted-foreground">{", Unit "}{units.join(", ")}</span>
                                        </div>
                                      ))}
                                      {remaining > 0 && (
                                        <span className="text-xs font-semibold text-teal-700">+{remaining}</span>
                                      )}
                                    </div>
                                  </button>
                                )
                              })()
                            ) : (
                              <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                                {lead.numberOfUnits || 1}
                              </Badge>
                            )}
                          </td>
                        )}
                        {visibleColumns.nextAction && (
                          <td className="p-4 text-sm text-muted-foreground">{lead.nextAction || lead.nextFollowUp}</td>
                        )}
                        {visibleColumns.stage && (
                          <td className="p-4">
                            <Badge variant="outline" className={getStageBadgeStyle(lead.stage)}>
                              {lead.stage}
                            </Badge>
                          </td>
                        )}
                        {visibleColumns.assignee && (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                  {lead.assignedTo
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{lead.assignedTo}</span>
                            </div>
                          </td>
                        )}
                        {visibleColumns.source && (
                          <td className="p-4">
                            <Badge variant="secondary" className="text-xs">
                              {lead.source || "N/A"}
                            </Badge>
                          </td>
                        )}
                        {visibleColumns.lastTouch && (
                          <td className="p-4 text-sm text-muted-foreground">{lead.lastTouch || "N/A"}</td>
                        )}
                        {visibleColumns.createdAt && (
                          <td className="p-4 text-sm text-muted-foreground">{lead.createdAt}</td>
                        )}
                        <td className="p-4">
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col items-center gap-2 p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {Math.min(visibleCount, totalItems)} of {totalItems} leads
                </p>
                {hasMoreLeads && (
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="min-w-[120px] bg-transparent"
                  >
                    {isLoadingMore ? "Loading..." : "View More"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Kanban View */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanStages.map((stage) => (
              <div
                key={stage}
                className={`flex-shrink-0 w-[300px] rounded-lg border bg-card ${dragOverStage === stage ? "border-teal-500 bg-teal-50" : ""
                  }`}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="p-3 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-foreground">{stage}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {leadsByStage[stage]?.length || 0}
                    </Badge>
                  </div>
                </div>
                <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
                  {leadsByStage[stage]?.map((lead) => (
                    <Card
                      key={lead.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${getStageCardStyle(lead.stage)}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLead(lead.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">
                              {lead.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm text-foreground">{lead.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{lead.property}</p>
                        <p className="text-xs text-muted-foreground">Assigned: {lead.assignedTo}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {(!leadsByStage[stage] || leadsByStage[stage].length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-4">No leads in this stage</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skip Step Dialog */}
        <Dialog
          open={skipStepDialog.open}
          onOpenChange={(open) => !open && setSkipStepDialog({ ...skipStepDialog, open: false })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Skip Steps Confirmation</DialogTitle>
              <DialogDescription>
                You are moving {skipStepDialog.leadName} from "{skipStepDialog.currentStage}" to "
                {skipStepDialog.newStage}". This will skip the following steps:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <ul className="list-disc list-inside text-sm text-amber-800">
                  {skipStepDialog.incompleteSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <Label>Reason for skipping</Label>
                <Select value={skipReason} onValueChange={setSkipReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client-request">Client Request</SelectItem>
                    <SelectItem value="expedited">Expedited Process</SelectItem>
                    <SelectItem value="already-completed">Steps Already Completed Offline</SelectItem>
                    <SelectItem value="not-applicable">Steps Not Applicable</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Additional Comments</Label>
                <Textarea
                  placeholder="Add any additional notes..."
                  value={skipComments}
                  onChange={(e) => setSkipComments(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSkipStepDialog({ ...skipStepDialog, open: false })}>
                Cancel
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleConfirmSkip}>
                Confirm Skip
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Column Settings Dialog */}
        <Dialog open={showColumnSettingsDialog} onOpenChange={setShowColumnSettingsDialog}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Column Settings</DialogTitle>
              <DialogDescription>
                Select which columns to display in the table
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {[
                { id: "name", label: "Name" },
                { id: "emailsSent", label: "Emails Sent" },
                { id: "units", label: "Units" },
                { id: "nextAction", label: "Next Action" },
                { id: "stage", label: "Stage" },
                { id: "assignee", label: "Assignee" },
                { id: "source", label: "Source" },
                { id: "lastTouch", label: "Last Touch" },
                { id: "createdAt", label: "Created At" },
              ].map((column) => (
                <div
                  key={column.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`col-${column.id}`}
                    checked={visibleColumns[column.id]}
                    onCheckedChange={(checked) => {
                      setVisibleColumns(prev => ({
                        ...prev,
                        [column.id]: !!checked
                      }))
                    }}
                  />
                  <label
                    htmlFor={`col-${column.id}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowColumnSettingsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Owner Prospect Filter Modal */}
        {showOwnerProspectFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-lg shadow-xl w-[480px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 pt-5 pb-4">
                <h2 className="text-lg font-bold text-foreground">Add Filter</h2>
                <button type="button" onClick={closeOwnerProspectFilterModal} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 pb-2 flex flex-col gap-4">
                {/* Filter Field Dropdown - Searchable */}
                <div className="relative">
                  <label className="text-xs font-medium text-primary mb-1 block">What do you want to filter by?</label>
                  <div className="border rounded-md w-full">
                    <div
                      className="flex items-center gap-2 h-10 px-3 cursor-pointer"
                      onClick={() => setShowOwnerProspectFieldDropdown(!showOwnerProspectFieldDropdown)}
                    >
                      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className={`text-sm flex-1 truncate ${ownerProspectModalFilterField ? "text-foreground" : "text-muted-foreground"}`}>
                        {ownerProspectModalFilterField || "Select a filter field"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${showOwnerProspectFieldDropdown ? "rotate-180" : ""}`} />
                    </div>
                    {showOwnerProspectFieldDropdown && (
                      <>
                        <div className="border-t px-2 py-1.5">
                          <Input
                            placeholder="Search fields..."
                            value={ownerProspectModalFieldSearch}
                            onChange={(e) => setOwnerProspectModalFieldSearch(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto border-t">
                          {OWNER_PROSPECT_FILTER_FIELDS
                            .filter((f) => f.toLowerCase().includes(ownerProspectModalFieldSearch.toLowerCase()))
                            .map((field) => (
                              <div
                                key={field}
                                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 border-b border-border last:border-b-0"
                                onClick={() => {
                                  setOwnerProspectModalFilterField(field)
                                  setOwnerProspectModalFilterValues([])
                                  setOwnerProspectModalOptionSearch("")
                                  setOwnerProspectModalFieldSearch("")
                                  setShowOwnerProspectFieldDropdown(false)
                                }}
                              >
                                <span className="truncate">{field}</span>
                              </div>
                            ))}
                          {OWNER_PROSPECT_FILTER_FIELDS.filter((f) => f.toLowerCase().includes(ownerProspectModalFieldSearch.toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">No matching fields</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Filter Options Dropdown - Searchable */}
                <div>
                  <div className="border rounded-md w-full">
                    <Input
                      placeholder="Select filter option(s)"
                      value={ownerProspectModalOptionSearch}
                      onChange={(e) => setOwnerProspectModalOptionSearch(e.target.value)}
                      className="border-0 border-b rounded-b-none h-10 focus-visible:ring-0 w-full"
                    />
                    {ownerProspectModalFilterField && (() => {
                      const allOptions = getOwnerProspectFilterOptions(ownerProspectModalFilterField)
                      const filtered = allOptions.filter((opt) => opt.toLowerCase().includes(ownerProspectModalOptionSearch.toLowerCase()))
                      const allSelected = filtered.length > 0 && filtered.every((opt) => ownerProspectModalFilterValues.includes(opt))
                      const showSelectAll = OWNER_PROSPECT_FIELDS_WITH_SELECT_ALL.includes(ownerProspectModalFilterField) && !ownerProspectModalOptionSearch
                      return (
                        <div className="max-h-[180px] overflow-y-auto">
                          {showSelectAll && (
                            <div className="flex items-center space-x-2 py-2 px-3 border-b border-border hover:bg-muted/50">
                              <Checkbox
                                id="owner-prospect-modal-opt-select-all"
                                checked={allSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) setOwnerProspectModalFilterValues([...new Set([...ownerProspectModalFilterValues, ...allOptions])])
                                  else setOwnerProspectModalFilterValues(ownerProspectModalFilterValues.filter((v) => !allOptions.includes(v)))
                                }}
                              />
                              <label htmlFor="owner-prospect-modal-opt-select-all" className="text-sm leading-none cursor-pointer flex-1 font-medium">Select All</label>
                            </div>
                          )}
                          {filtered.map((option) => (
                            <div key={option} className="flex items-center space-x-2 py-2 px-3 border-b border-border last:border-b-0 hover:bg-muted/50">
                              <Checkbox
                                id={`owner-prospect-modal-opt-${option}`}
                                checked={ownerProspectModalFilterValues.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) setOwnerProspectModalFilterValues([...ownerProspectModalFilterValues, option])
                                  else setOwnerProspectModalFilterValues(ownerProspectModalFilterValues.filter((v) => v !== option))
                                }}
                              />
                              <label htmlFor={`owner-prospect-modal-opt-${option}`} className="text-sm leading-none cursor-pointer flex-1 truncate">{option}</label>
                            </div>
                          ))}
                          {filtered.length === 0 && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">No matching options</div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2">
                <Button variant="outline" onClick={closeOwnerProspectFilterModal} className="h-9 px-4">
                  Cancel <span className="text-xs text-muted-foreground ml-1.5">(esc)</span>
                </Button>
                <Button
                  onClick={applyOwnerProspectModalFilter}
                  disabled={!ownerProspectModalFilterField || ownerProspectModalFilterValues.length === 0}
                  className="h-9 px-4"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Sidebar for Owner Prospects Listing */}
      {params?.view === "owners" && selectedCategory && (
        <div className="w-56 flex-shrink-0">
          <div className="sticky top-4">
            <Card>
              <CardContent className="p-0">
                {/* Upper Half - Quick Actions */}
                <div>
                  <div className="p-3 border-b bg-muted/30">
                    <h2 className="font-semibold text-base text-gray-800">Quick Actions</h2>
                  </div>
                  <div className="flex flex-col">
                    {ownerProspectsQuickActions.map((action, index) => (
                      <button
                        key={index}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 border-b border-gray-100 last:border-b-0"
                      >
                        <action.icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lower Half - AI Assistant */}
                <div className="border-t border-gray-200 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask..."
                      className="flex-1 h-8 text-sm"
                    />
                    <Button size="sm" className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600">
                      <Send className="h-3.5 w-3.5 text-white" />
                    </Button>
                  </div>
                  <div className="space-y-0.5">
                    <button className="w-full text-left text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded transition-colors">
                      What's the owner's property portfolio?
                    </button>
                    <button className="w-full text-left text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded transition-colors">
                      Show recent owner communications
                    </button>
                    <button className="w-full text-left text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded transition-colors">
                      What are the pending action items?
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
