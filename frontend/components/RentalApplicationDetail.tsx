"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Printer,
  Plus,
  User,
  FileText,
  Home,
  Briefcase,
  DollarSign,
  Users,
  PawPrint,
  Car,
  Phone,
  Calendar,
  MessageSquare,
  Mail,
  Clock,
  Paperclip,
  Shield,
  CreditCard,
  Building,
  CheckCircle,
  Activity,
  ArrowLeft,
} from "lucide-react"

interface RentalApplicationDetailProps {
  application: any
  applicant: any
  onBack: () => void
}

const sectionColors = {
  applicantInfo: {
    bg: "from-blue-50 via-indigo-50 to-blue-50",
    border: "border-l-4 border-l-blue-500",
    icon: "bg-blue-100 text-blue-600",
    header: "bg-gradient-to-r from-blue-100 to-indigo-100",
  },
  applicantSummary: {
    bg: "from-teal-50 via-cyan-50 to-teal-50",
    border: "border-l-4 border-l-teal-500",
    icon: "bg-teal-100 text-teal-600",
    header: "bg-gradient-to-r from-teal-100 to-cyan-100",
  },
  screening: {
    bg: "from-amber-50 via-yellow-50 to-amber-50",
    border: "border-l-4 border-l-amber-500",
    icon: "bg-amber-100 text-amber-600",
    header: "bg-gradient-to-r from-amber-100 to-yellow-100",
  },
  fees: {
    bg: "from-emerald-50 via-green-50 to-emerald-50",
    border: "border-l-4 border-l-emerald-500",
    icon: "bg-emerald-100 text-emerald-600",
    header: "bg-gradient-to-r from-emerald-100 to-green-100",
  },
  residential: {
    bg: "from-purple-50 via-violet-50 to-purple-50",
    border: "border-l-4 border-l-purple-500",
    icon: "bg-purple-100 text-purple-600",
    header: "bg-gradient-to-r from-purple-100 to-violet-100",
  },
  income: {
    bg: "from-green-50 via-emerald-50 to-green-50",
    border: "border-l-4 border-l-green-500",
    icon: "bg-green-100 text-green-600",
    header: "bg-gradient-to-r from-green-100 to-emerald-100",
  },
  employment: {
    bg: "from-sky-50 via-blue-50 to-sky-50",
    border: "border-l-4 border-l-sky-500",
    icon: "bg-sky-100 text-sky-600",
    header: "bg-gradient-to-r from-sky-100 to-blue-100",
  },
  personal: {
    bg: "from-rose-50 via-pink-50 to-rose-50",
    border: "border-l-4 border-l-rose-500",
    icon: "bg-rose-100 text-rose-600",
    header: "bg-gradient-to-r from-rose-100 to-pink-100",
  },
  financial: {
    bg: "from-indigo-50 via-purple-50 to-indigo-50",
    border: "border-l-4 border-l-indigo-500",
    icon: "bg-indigo-100 text-indigo-600",
    header: "bg-gradient-to-r from-indigo-100 to-purple-100",
  },
  dependents: {
    bg: "from-orange-50 via-amber-50 to-orange-50",
    border: "border-l-4 border-l-orange-500",
    icon: "bg-orange-100 text-orange-600",
    header: "bg-gradient-to-r from-orange-100 to-amber-100",
  },
  household: {
    bg: "from-cyan-50 via-teal-50 to-cyan-50",
    border: "border-l-4 border-l-cyan-500",
    icon: "bg-cyan-100 text-cyan-600",
    header: "bg-gradient-to-r from-cyan-100 to-teal-100",
  },
  pets: {
    bg: "from-lime-50 via-green-50 to-lime-50",
    border: "border-l-4 border-l-lime-500",
    icon: "bg-lime-100 text-lime-600",
    header: "bg-gradient-to-r from-lime-100 to-green-100",
  },
  references: {
    bg: "from-fuchsia-50 via-pink-50 to-fuchsia-50",
    border: "border-l-4 border-l-fuchsia-500",
    icon: "bg-fuchsia-100 text-fuchsia-600",
    header: "bg-gradient-to-r from-fuchsia-100 to-pink-100",
  },
  vehicles: {
    bg: "from-slate-50 via-gray-50 to-slate-50",
    border: "border-l-4 border-l-slate-500",
    icon: "bg-slate-100 text-slate-600",
    header: "bg-gradient-to-r from-slate-100 to-gray-100",
  },
  emergency: {
    bg: "from-red-50 via-rose-50 to-red-50",
    border: "border-l-4 border-l-red-500",
    icon: "bg-red-100 text-red-600",
    header: "bg-gradient-to-r from-red-100 to-rose-100",
  },
  activities: {
    bg: "from-violet-50 via-purple-50 to-violet-50",
    border: "border-l-4 border-l-violet-500",
    icon: "bg-violet-100 text-violet-600",
    header: "bg-gradient-to-r from-violet-100 to-purple-100",
  },
  notes: {
    bg: "from-yellow-50 via-amber-50 to-yellow-50",
    border: "border-l-4 border-l-yellow-500",
    icon: "bg-yellow-100 text-yellow-600",
    header: "bg-gradient-to-r from-yellow-100 to-amber-100",
  },
  texts: {
    bg: "from-blue-50 via-sky-50 to-blue-50",
    border: "border-l-4 border-l-blue-400",
    icon: "bg-blue-100 text-blue-600",
    header: "bg-gradient-to-r from-blue-100 to-sky-100",
  },
  emails: {
    bg: "from-teal-50 via-emerald-50 to-teal-50",
    border: "border-l-4 border-l-teal-400",
    icon: "bg-teal-100 text-teal-600",
    header: "bg-gradient-to-r from-teal-100 to-emerald-100",
  },
  audit: {
    bg: "from-gray-50 via-slate-50 to-gray-50",
    border: "border-l-4 border-l-gray-500",
    icon: "bg-gray-100 text-gray-600",
    header: "bg-gradient-to-r from-gray-100 to-slate-100",
  },
  attachments: {
    bg: "from-pink-50 via-rose-50 to-pink-50",
    border: "border-l-4 border-l-pink-500",
    icon: "bg-pink-100 text-pink-600",
    header: "bg-gradient-to-r from-pink-100 to-rose-100",
  },
}

export default function RentalApplicationDetail({ application, applicant, onBack }: RentalApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 -mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Rental Applications
      </Button>

      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
              {applicant.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold">Rental Application</h1>
              <h2 className="text-base text-white/90">{applicant.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-sm font-medium">
              {application.status}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 bg-gradient-to-r from-teal-100 to-cyan-100 p-1 rounded-lg h-auto">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-md rounded-md transition-all"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="background"
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-md transition-all"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Background</span>
          </TabsTrigger>
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-md rounded-md transition-all"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger
            value="additional"
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-lime-700 data-[state=active]:shadow-md rounded-md transition-all"
          >
            <PawPrint className="h-4 w-4" />
            <span className="hidden sm:inline">Additional</span>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-md rounded-md transition-all"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB: Applicant Info, Summary, Screening, Fees */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Applicant Information */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.applicantInfo.bg} ${sectionColors.applicantInfo.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.applicantInfo.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.applicantInfo.icon} flex items-center justify-center`}
                  >
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-blue-800">Applicant Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-600 text-xs font-medium">Name</p>
                    <p className="font-medium text-gray-800">{applicant.name}</p>
                  </div>
                  <div>
                    <p className="text-blue-600 text-xs font-medium">Type</p>
                    <p className="text-gray-700">{applicant.type || "Individual Responsible"}</p>
                  </div>
                  <div>
                    <p className="text-blue-600 text-xs font-medium">Phone</p>
                    <p className="text-gray-700">{applicant.phone}</p>
                  </div>
                  <div>
                    <p className="text-blue-600 text-xs font-medium">Email</p>
                    <p className="text-gray-700 truncate">{applicant.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tenant Screening */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.screening.bg} ${sectionColors.screening.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.screening.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.screening.icon} flex items-center justify-center`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-amber-800">Tenant Screening</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3">
                <div className="bg-amber-100/50 border border-amber-200 rounded-lg p-3 text-sm">
                  <p className="text-amber-800">
                    Tenant Screening report will be shown here.
                  </p>
                  
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applicant Summary - Full Width */}
          <Card
            className={`bg-gradient-to-br ${sectionColors.applicantSummary.bg} ${sectionColors.applicantSummary.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardHeader
              className={`flex flex-row items-center justify-between py-2 ${sectionColors.applicantSummary.header} rounded-t-lg`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full ${sectionColors.applicantSummary.icon} flex items-center justify-center`}
                >
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-sm font-semibold text-teal-800">Applicant Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-3 pb-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-teal-600 text-xs font-medium">Status</p>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                    {application.status}
                  </span>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Unit</p>
                  <p className="font-medium text-gray-800">{application.unit}</p>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Desired Move In</p>
                  <p className="text-gray-700">{application.desiredMoveIn}</p>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Received</p>
                  <p className="text-gray-700">{application.received}</p>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Deposit Status</p>
                  <p className="text-gray-700">Not yet received</p>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Requirements</p>
                  <p className="text-gray-700">All items provided</p>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Pets</p>
                  <p className="text-gray-700">No</p>
                </div>
                <div>
                  <p className="text-teal-600 text-xs font-medium">Background</p>
                  <p className="text-gray-700">Cleared</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Fees */}
          <Card
            className={`bg-gradient-to-br ${sectionColors.fees.bg} ${sectionColors.fees.border} shadow-sm hover:shadow-md transition-shadow`}
          >
            <CardHeader
              className={`flex flex-row items-center justify-between py-2 ${sectionColors.fees.header} rounded-t-lg`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full ${sectionColors.fees.icon} flex items-center justify-center`}>
                  <CreditCard className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-sm font-semibold text-emerald-800">Application Fees</CardTitle>
              </div>
              <span className="text-emerald-600 font-semibold text-sm">$ Stripe Application Fee</span>
            </CardHeader>
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center justify-between bg-emerald-100/50 rounded-lg p-3">
                <span className="text-emerald-800 font-medium text-sm">Application Fee Paid</span>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BACKGROUND TAB: Residential History, Employment, Income */}
        <TabsContent value="background" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Residential History */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.residential.bg} ${sectionColors.residential.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.residential.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.residential.icon} flex items-center justify-center`}
                  >
                    <Home className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-purple-800">Residential History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-purple-600 text-xs font-medium">Residence Type</p>
                    <p className="text-gray-700">Owner</p>
                  </div>
                  <div>
                    <p className="text-purple-600 text-xs font-medium">Residents</p>
                    <p className="text-gray-700">Tyler Rockey, Bill P, Roger</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-purple-600 text-xs font-medium">Current Address</p>
                    <p className="text-gray-700">2614 Erin Dome Springfield, Cambridge, AL 23456</p>
                  </div>
                  <div>
                    <p className="text-purple-600 text-xs font-medium">Monthly Rent</p>
                    <p className="text-gray-700">$1,200</p>
                  </div>
                  <div>
                    <p className="text-purple-600 text-xs font-medium">Landlord</p>
                    <p className="text-gray-700">N/A - Owner at this address</p>
                  </div>
                </div>
                <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0 h-auto text-xs">
                  + Add Previous Address
                </Button>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.employment.bg} ${sectionColors.employment.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.employment.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.employment.icon} flex items-center justify-center`}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-sky-800">Employment Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sky-600 text-xs font-medium">Current Employer</p>
                    <p className="text-gray-700">Tech Solutions Inc</p>
                  </div>
                  <div>
                    <p className="text-sky-600 text-xs font-medium">Employment Length</p>
                    <p className="text-gray-700">3 years, 2 months</p>
                  </div>
                  <div>
                    <p className="text-sky-600 text-xs font-medium">Position</p>
                    <p className="text-gray-700">Senior Software Engineer</p>
                  </div>
                  <div>
                    <p className="text-sky-600 text-xs font-medium">Monthly Income</p>
                    <p className="text-gray-700 font-semibold">$8,500.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Income & Additional Income - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card
              className={`bg-gradient-to-br ${sectionColors.income.bg} ${sectionColors.income.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.income.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full ${sectionColors.income.icon} flex items-center justify-center`}>
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-green-800">Income Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-green-100/50 rounded p-2">
                    <span className="text-green-700">Employment Income</span>
                    <span className="font-semibold text-green-800">$8,500.00/mo</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-100/50 rounded p-2">
                    <span className="text-green-700">Additional Income</span>
                    <span className="font-semibold text-green-800">$1,200.00/mo</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-200/50 rounded p-2 border border-green-300">
                    <span className="text-green-800 font-medium">Total Monthly Income</span>
                    <span className="font-bold text-green-900">$9,700.00/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${sectionColors.dependents.bg} ${sectionColors.dependents.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.dependents.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.dependents.icon} flex items-center justify-center`}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-orange-800">Additional Income</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-orange-600 text-xs font-medium">Source</p>
                    <p className="text-gray-700">Freelance Consulting</p>
                  </div>
                  <div>
                    <p className="text-orange-600 text-xs font-medium">Monthly Amount</p>
                    <p className="text-gray-700 font-semibold">$1,200.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PERSONAL TAB: Personal Info, Financial, Dependents, Household */}
        <TabsContent value="personal" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Personal Information */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.personal.bg} ${sectionColors.personal.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.personal.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.personal.icon} flex items-center justify-center`}
                  >
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-rose-800">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-rose-600 text-xs font-medium">Date of Birth</p>
                    <p className="text-gray-700">08/15/1985</p>
                  </div>
                  <div>
                    <p className="text-rose-600 text-xs font-medium">Government Issued ID</p>
                    <p className="text-gray-700">Drivers License</p>
                  </div>
                  <div>
                    <p className="text-rose-600 text-xs font-medium">SSN (Last 4)</p>
                    <p className="text-gray-700">XXX-XX-5864</p>
                  </div>
                  <div>
                    <p className="text-rose-600 text-xs font-medium">Smoking Habits</p>
                    <p className="text-gray-700">Non-Smoker</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.financial.bg} ${sectionColors.financial.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.financial.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.financial.icon} flex items-center justify-center`}
                  >
                    <Building className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-indigo-800">Financial Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 bg-indigo-100/50 rounded p-2 text-xs">
                    <div>
                      <p className="text-indigo-600 font-medium">Bank</p>
                      <p className="text-gray-700">Chase Bank</p>
                    </div>
                    <div>
                      <p className="text-indigo-600 font-medium">Type</p>
                      <p className="text-gray-700">Savings</p>
                    </div>
                    <div>
                      <p className="text-indigo-600 font-medium">Balance</p>
                      <p className="text-gray-700 font-semibold">$24,000</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-indigo-600 text-xs font-medium">Credit Liabilities</p>
                    <p className="text-gray-700">$8,500.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dependents & Household - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card
              className={`bg-gradient-to-br ${sectionColors.dependents.bg} ${sectionColors.dependents.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.dependents.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.dependents.icon} flex items-center justify-center`}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-orange-800">Dependents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-100/50">
                      <TableHead className="text-orange-700 text-xs py-2">Name</TableHead>
                      <TableHead className="text-orange-700 text-xs py-2">Relationship</TableHead>
                      <TableHead className="text-orange-700 text-xs py-2">DOB</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-2 text-xs">Jane Brown</TableCell>
                      <TableCell className="py-2 text-xs">Daughter</TableCell>
                      <TableCell className="py-2 text-xs">08/15/2019</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${sectionColors.household.bg} ${sectionColors.household.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.household.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.household.icon} flex items-center justify-center`}
                  >
                    <Home className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-cyan-800">Household Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-cyan-100/50 rounded">
                    <p className="text-lg font-bold text-cyan-700">0</p>
                    <p className="text-xs text-cyan-600">Cars at Property</p>
                  </div>
                  <div className="text-center p-2 bg-cyan-100/50 rounded">
                    <p className="text-lg font-bold text-cyan-700">0</p>
                    <p className="text-xs text-cyan-600">Sig. Others</p>
                  </div>
                  <div className="text-center p-2 bg-cyan-100/50 rounded">
                    <p className="text-lg font-bold text-cyan-700">0</p>
                    <p className="text-xs text-cyan-600">Under 18</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-cyan-50 rounded text-xs">
                  <p className="text-cyan-700">
                    <strong>Sex Offender Registry:</strong> Has everyone been registered as a sex offender and is
                    offense?
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ADDITIONAL TAB: Pets, References, Vehicles, Emergency Contact */}
        <TabsContent value="additional" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pets */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.pets.bg} ${sectionColors.pets.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.pets.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full ${sectionColors.pets.icon} flex items-center justify-center`}>
                    <PawPrint className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-lime-800">Pets</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-lime-100/50">
                      <TableHead className="text-lime-700 text-xs py-2">Name</TableHead>
                      <TableHead className="text-lime-700 text-xs py-2">Type</TableHead>
                      <TableHead className="text-lime-700 text-xs py-2">Breed</TableHead>
                      <TableHead className="text-lime-700 text-xs py-2">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-2 text-xs">Max</TableCell>
                      <TableCell className="py-2 text-xs">Dog</TableCell>
                      <TableCell className="py-2 text-xs">Golden Retriever</TableCell>
                      <TableCell className="py-2 text-xs">65 lbs</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Vehicles */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.vehicles.bg} ${sectionColors.vehicles.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.vehicles.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.vehicles.icon} flex items-center justify-center`}
                  >
                    <Car className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-slate-800">Vehicles</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100/50">
                      <TableHead className="text-slate-700 text-xs py-2">Make</TableHead>
                      <TableHead className="text-slate-700 text-xs py-2">Model</TableHead>
                      <TableHead className="text-slate-700 text-xs py-2">Year</TableHead>
                      <TableHead className="text-slate-700 text-xs py-2">License</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-2 text-xs">Toyota</TableCell>
                      <TableCell className="py-2 text-xs">Camry</TableCell>
                      <TableCell className="py-2 text-xs">2022</TableCell>
                      <TableCell className="py-2 text-xs">ABC-1234</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* References */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.references.bg} ${sectionColors.references.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.references.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.references.icon} flex items-center justify-center`}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-fuchsia-800">References</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="space-y-2">
                  <div className="p-2 bg-fuchsia-100/50 rounded">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-fuchsia-800">Sarah Wilson</p>
                        <p className="text-xs text-fuchsia-600">Previous Landlord</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-gray-700">(555) 123-4567</p>
                        <p className="text-gray-600">sarah.wilson@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.emergency.bg} ${sectionColors.emergency.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.emergency.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.emergency.icon} flex items-center justify-center`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-red-800">Emergency Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-red-600 text-xs font-medium">Name</p>
                    <p className="text-gray-700">Mary Brown</p>
                  </div>
                  <div>
                    <p className="text-red-600 text-xs font-medium">Relationship</p>
                    <p className="text-gray-700">Spouse</p>
                  </div>
                  <div>
                    <p className="text-red-600 text-xs font-medium">Phone</p>
                    <p className="text-gray-700">(555) 987-6543</p>
                  </div>
                  <div>
                    <p className="text-red-600 text-xs font-medium">Email</p>
                    <p className="text-gray-700 truncate">m.brown@example.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ACTIVITY TAB: Activities, Notes, Tasks, Emails, Audit, Attachments */}
        <TabsContent value="activity" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Upcoming Activities */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.activities.bg} ${sectionColors.activities.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.activities.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.activities.icon} flex items-center justify-center`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-violet-800">Upcoming Activities</CardTitle>
                </div>
                <Button size="sm" variant="ghost" className="text-violet-600 text-xs h-7">
                  <Plus className="h-3 w-3 mr-1" /> Add Activity
                </Button>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="p-2 bg-violet-100/50 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium text-violet-800">Lease Signing Meeting</p>
                    <p className="text-xs text-violet-600">Schedule with Property Manager</p>
                  </div>
                  <span className="text-xs text-violet-700 font-medium">Nov 25, 2025</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.notes.bg} ${sectionColors.notes.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.notes.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full ${sectionColors.notes.icon} flex items-center justify-center`}>
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-yellow-800">Notes</CardTitle>
                </div>
                <Button size="sm" variant="ghost" className="text-yellow-600 text-xs h-7">
                  <Plus className="h-3 w-3 mr-1" /> Add Note
                </Button>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="p-2 bg-yellow-100/50 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-yellow-800">George Groove</p>
                    <span className="text-xs text-yellow-600">11/18/2025</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Applicant's credit excellent. Income meets 3x rent requirement. Ready for final review.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tasks */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.texts.bg} ${sectionColors.texts.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.texts.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full ${sectionColors.texts.icon} flex items-center justify-center`}>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-blue-800">Tasks</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="p-2 bg-blue-100/50 rounded">
                  <p className="text-blue-800">
                    No outstanding tasks for this applicant. Let me know if you want to start anything new.
                  </p>
                  <Button variant="link" className="text-blue-600 p-0 h-auto text-xs mt-1">
                    View all tasks →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emails */}
            <Card
              className={`bg-gradient-to-br ${sectionColors.emails.bg} ${sectionColors.emails.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.emails.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full ${sectionColors.emails.icon} flex items-center justify-center`}>
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-teal-800">Emails</CardTitle>
                </div>
                <Button size="sm" variant="ghost" className="text-teal-600 text-xs h-7">
                  <Plus className="h-3 w-3 mr-1" /> Compose
                </Button>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="p-2 bg-teal-100/50 rounded">
                  <p className="font-medium text-teal-800">Application Received</p>
                  <p className="text-xs text-gray-600">Re: Your rental application at Oak St...</p>
                  <span className="text-xs text-teal-600">11/19/2025</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log & Attachments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card
              className={`bg-gradient-to-br ${sectionColors.audit.bg} ${sectionColors.audit.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.audit.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-7 w-7 rounded-full ${sectionColors.audit.icon} flex items-center justify-center`}>
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-gray-800">Audit Log</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-gray-500 whitespace-nowrap">11/19/2025</span>
                    <span>
                      Changed Status from New to Decision Pending - <span className="text-blue-600">George Groove</span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-gray-500 whitespace-nowrap">11/18/2025</span>
                    <span>
                      Created Rental Application for Diana Prince - <span className="text-blue-600">George Groove</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${sectionColors.attachments.bg} ${sectionColors.attachments.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader
                className={`flex flex-row items-center justify-between py-2 ${sectionColors.attachments.header} rounded-t-lg`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${sectionColors.attachments.icon} flex items-center justify-center`}
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-pink-800">Attachments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 pb-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-pink-100/50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-pink-600" />
                      <div>
                        <p className="text-xs font-medium text-pink-800">PayStubs_Oct2025.pdf</p>
                        <p className="text-xs text-pink-600">2.1MB • Uploaded Oct 2025</p>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-pink-600 cursor-pointer hover:text-pink-800" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-pink-100/50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-pink-600" />
                      <div>
                        <p className="text-xs font-medium text-pink-800">DriversLicense_Front.jpg</p>
                        <p className="text-xs text-pink-600">1.3MB</p>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-pink-600 cursor-pointer hover:text-pink-800" />
                  </div>
                </div>
                <div className="mt-3 border-2 border-dashed border-pink-300 rounded-lg p-3 text-center">
                  <p className="text-xs text-pink-600">Drag files here</p>
                  <Button variant="link" className="text-pink-600 text-xs p-0 h-auto">
                    Choose Files to Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
