"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Home,
  User,
  Phone,
  Mail,
  Building,
  DollarSign,
  Briefcase,
  Users,
  Heart,
  AlertCircle,
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface NewRentalApplicationProps {
  onBack: () => void
  onSave?: (data: any) => void
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon: Icon,
  color,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string
  icon: React.ElementType
  color: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", iconBg: "bg-emerald-100" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", iconBg: "bg-blue-100" },
    violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", iconBg: "bg-violet-100" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", iconBg: "bg-amber-100" },
    cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", iconBg: "bg-cyan-100" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", iconBg: "bg-green-100" },
    indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", iconBg: "bg-indigo-100" },
    fuchsia: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", iconBg: "bg-fuchsia-100" },
    rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", iconBg: "bg-rose-100" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", iconBg: "bg-yellow-100" },
    slate: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", iconBg: "bg-slate-100" },
    teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", iconBg: "bg-teal-100" },
  }

  const colors = colorClasses[color] || colorClasses.blue

  return (
    <div className={cn("rounded-lg border overflow-hidden", colors.border)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 transition-colors",
          colors.bg,
          "hover:opacity-90",
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-1.5 rounded-md", colors.iconBg)}>
            <Icon className={cn("h-4 w-4", colors.text)} />
          </div>
          <span className={cn("font-semibold text-sm", colors.text)}>{title}</span>
          {badge && <span className={cn("text-xs px-2 py-0.5 rounded-full", colors.iconBg, colors.text)}>{badge}</span>}
        </div>
        {isOpen ? (
          <ChevronDown className={cn("h-4 w-4", colors.text)} />
        ) : (
          <ChevronRight className={cn("h-4 w-4", colors.text)} />
        )}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  )
}

export default function NewRentalApplication({ onBack, onSave }: NewRentalApplicationProps) {
  // Form state
  const [formData, setFormData] = useState({
    unit: "",
    vacantDate: "",
    desiredMoveIn: "",
    salutation: "",
    firstName: "",
    middleName: "",
    noMiddleName: false,
    lastName: "",
    suffix: "",
    applicantType: "financially-responsible",
    companyName: "",
    useCompanyAsDisplayName: false,
    dateOfBirth: "",
    ssn: "",
    governmentId: "",
    issuingState: "",
  })

  // Dynamic arrays
  const [phoneNumbers, setPhoneNumbers] = useState([{ number: "", type: "mobile" }])
  const [emails, setEmails] = useState([{ email: "" }])
  const [residentialHistory, setResidentialHistory] = useState([
    {
      occupancyType: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      residentFrom: { month: "", year: "" },
      residentTo: { month: "", year: "" },
      monthlyPayment: "",
      landlordName: "",
      landlordPhone: "",
      landlordEmail: "",
      reasonForLeaving: "",
    },
  ])
  const [bankAccounts, setBankAccounts] = useState([{ name: "", type: "", accountNumber: "", balance: "" }])
  const [creditCards, setCreditCards] = useState([{ issuer: "", balance: "" }])
  const [employers, setEmployers] = useState([
    {
      employerName: "",
      employerPhone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      monthlySalary: "",
      positionHeld: "",
      yearsWorked: "",
      supervisorName: "",
      supervisorTitle: "",
      supervisorEmail: "",
    },
  ])
  const [additionalIncome, setAdditionalIncome] = useState([{ monthlyIncome: "", source: "" }])
  const [dependents, setDependents] = useState([{ firstName: "", lastName: "", dob: "", relationship: "" }])
  const [pets, setPets] = useState([{ name: "", type: "", weight: "", age: "" }])
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  })
  const [notes, setNotes] = useState("")

  // Stepper state
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: "unit", title: "Unit & Applicant", icon: Home },
    { id: "history", title: "History & Personal", icon: Building },
    { id: "financial", title: "Financial & Income", icon: DollarSign },
    { id: "additional", title: "Additional Info", icon: Users },
  ]

  // Handlers
  const addPhone = () => setPhoneNumbers([...phoneNumbers, { number: "", type: "mobile" }])
  const removePhone = (index: number) => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))

  const addEmail = () => setEmails([...emails, { email: "" }])
  const removeEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index))

  const addResidentialHistory = () =>
    setResidentialHistory([
      ...residentialHistory,
      {
        occupancyType: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
        residentFrom: { month: "", year: "" },
        residentTo: { month: "", year: "" },
        monthlyPayment: "",
        landlordName: "",
        landlordPhone: "",
        landlordEmail: "",
        reasonForLeaving: "",
      },
    ])
  const removeResidentialHistory = (index: number) =>
    setResidentialHistory(residentialHistory.filter((_, i) => i !== index))

  const addBankAccount = () =>
    setBankAccounts([...bankAccounts, { name: "", type: "", accountNumber: "", balance: "" }])
  const removeBankAccount = (index: number) => setBankAccounts(bankAccounts.filter((_, i) => i !== index))

  const addCreditCard = () => setCreditCards([...creditCards, { issuer: "", balance: "" }])
  const removeCreditCard = (index: number) => setCreditCards(creditCards.filter((_, i) => i !== index))

  const addEmployer = () =>
    setEmployers([
      ...employers,
      {
        employerName: "",
        employerPhone: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
        monthlySalary: "",
        positionHeld: "",
        yearsWorked: "",
        supervisorName: "",
        supervisorTitle: "",
        supervisorEmail: "",
      },
    ])
  const removeEmployer = (index: number) => setEmployers(employers.filter((_, i) => i !== index))

  const addIncome = () => setAdditionalIncome([...additionalIncome, { monthlyIncome: "", source: "" }])
  const removeIncome = (index: number) => setAdditionalIncome(additionalIncome.filter((_, i) => i !== index))

  const addDependent = () => setDependents([...dependents, { firstName: "", lastName: "", dob: "", relationship: "" }])
  const removeDependent = (index: number) => setDependents(dependents.filter((_, i) => i !== index))

  const addPet = () => setPets([...pets, { name: "", type: "", weight: "", age: "" }])
  const removePet = (index: number) => setPets(pets.filter((_, i) => i !== index))

  const handleSubmit = () => {
    onSave?.({
      ...formData,
      phoneNumbers,
      emails,
      residentialHistory,
      bankAccounts,
      creditCards,
      employers,
      additionalIncome,
      dependents,
      pets,
      emergencyContact,
      notes,
    })
    onBack()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">New Rental Application</h1>
            <p className="text-sm text-gray-500">Complete all required fields to submit an application</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Application
          </Button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium",
                currentStep === index
                  ? "bg-teal-600 text-white"
                  : currentStep > index
                    ? "bg-teal-100 text-teal-700"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                  currentStep === index
                    ? "bg-white/20 text-white"
                    : currentStep > index
                      ? "bg-teal-600 text-white"
                      : "bg-gray-300 text-gray-600",
                )}
              >
                {currentStep > index ? <Check className="h-3 w-3" /> : index + 1}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Step 1: Unit & Applicant */}
          {currentStep === 0 && (
            <>
              {/* Unit Selection */}
              <CollapsibleSection title="Unit Selection" icon={Home} color="emerald" defaultOpen>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="101">Unit 101 - Cedar Point</SelectItem>
                        <SelectItem value="102">Unit 102 - Cedar Point</SelectItem>
                        <SelectItem value="201">Unit 201 - Maple Ridge</SelectItem>
                      </SelectContent>
                    </Select>
                    <button className="text-emerald-600 text-sm mt-1 hover:underline">Browse Vacant Units</button>
                  </div>
                  <div>
                    <Label>Vacant Date</Label>
                    <Input type="date" placeholder="mm/dd/yyyy" />
                  </div>
                  <div>
                    <Label>
                      Desired Move In <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" placeholder="mm/dd/yyyy" />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Applicant Information */}
              <CollapsibleSection title="Applicant Information" icon={User} color="blue" defaultOpen>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Salutation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="ms">Ms.</SelectItem>
                          <SelectItem value="dr">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input placeholder="First name" />
                    </div>
                    <div>
                      <Label>
                        Middle Name <span className="text-red-500">*</span>
                      </Label>
                      <Input placeholder="Middle name" />
                      <div className="flex items-center gap-2 mt-1">
                        <Checkbox id="noMiddle" />
                        <label htmlFor="noMiddle" className="text-xs text-gray-500">
                          No middle name
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label>
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input placeholder="Last name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Suffixes</Label>
                      <Input placeholder="Jr, Sr, III, etc." />
                    </div>
                    <div>
                      <Label>Applicant Type</Label>
                      <Select defaultValue="financially-responsible">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financially-responsible">Financially Responsible</SelectItem>
                          <SelectItem value="occupant">Occupant</SelectItem>
                          <SelectItem value="guarantor">Guarantor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Company Name</Label>
                      <Input placeholder="If applicable" />
                      <div className="flex items-center gap-2 mt-1">
                        <Checkbox id="useCompany" />
                        <label htmlFor="useCompany" className="text-xs text-gray-500">
                          Use as display name
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Contact Information - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CollapsibleSection
                  title="Phone Numbers"
                  icon={Phone}
                  color="violet"
                  defaultOpen
                  badge={`${phoneNumbers.length}`}
                >
                  <div className="space-y-3">
                    {phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input placeholder="Phone number" />
                        </div>
                        <Select defaultValue="mobile">
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                          </SelectContent>
                        </Select>
                        {phoneNumbers.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removePhone(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPhone}
                      className="text-violet-600 border-violet-200 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Phone
                    </Button>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Email Addresses"
                  icon={Mail}
                  color="rose"
                  defaultOpen
                  badge={`${emails.length}`}
                >
                  <div className="space-y-3">
                    {emails.map((email, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input placeholder="Email address" type="email" />
                        </div>
                        {emails.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeEmail(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEmail}
                      className="text-rose-600 border-rose-200 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Email
                    </Button>
                  </div>
                </CollapsibleSection>
              </div>
            </>
          )}

          {/* Step 2: History & Personal */}
          {currentStep === 1 && (
            <>
              {/* Residential History */}
              <CollapsibleSection
                title="Residential History"
                icon={Building}
                color="amber"
                defaultOpen
                badge={`${residentialHistory.length} address(es)`}
              >
                <div className="space-y-4">
                  {residentialHistory.map((history, index) => (
                    <Card key={index} className="border-amber-100">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-amber-700">
                            {index === 0 ? "Current Address" : `Previous Address ${index}`}
                          </span>
                          {residentialHistory.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeResidentialHistory(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-xs">Occupancy Type</Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rent">Rent</SelectItem>
                                <SelectItem value="own">Own</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Address</Label>
                            <Input className="h-9" placeholder="Street address" />
                          </div>
                          <div>
                            <Label className="text-xs">City</Label>
                            <Input className="h-9" placeholder="City" />
                          </div>
                          <div>
                            <Label className="text-xs">State</Label>
                            <Input className="h-9" placeholder="State" />
                          </div>
                          <div>
                            <Label className="text-xs">ZIP</Label>
                            <Input className="h-9" placeholder="ZIP" />
                          </div>
                          <div>
                            <Label className="text-xs">Monthly Payment</Label>
                            <Input className="h-9" placeholder="$0.00" />
                          </div>
                          <div>
                            <Label className="text-xs">Landlord Name</Label>
                            <Input className="h-9" placeholder="Name" />
                          </div>
                          <div>
                            <Label className="text-xs">Landlord Phone</Label>
                            <Input className="h-9" placeholder="Phone" />
                          </div>
                          <div>
                            <Label className="text-xs">Landlord Email</Label>
                            <Input className="h-9" placeholder="Email" />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Resident From</Label>
                            <div className="flex gap-2">
                              <Select>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                  ].map((m) => (
                                    <SelectItem key={m} value={m.toLowerCase()}>
                                      {m}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input className="h-9 w-20" placeholder="Year" />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Resident To</Label>
                            <div className="flex gap-2">
                              <Select>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                  ].map((m) => (
                                    <SelectItem key={m} value={m.toLowerCase()}>
                                      {m}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input className="h-9 w-20" placeholder="Year" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Label className="text-xs">Reason for Leaving</Label>
                          <Textarea className="h-16" placeholder="Describe reason for leaving..." />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addResidentialHistory}
                    className="text-amber-600 border-amber-200 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Previous Address
                  </Button>
                </div>
              </CollapsibleSection>

              {/* Personal Information */}
              <CollapsibleSection title="Personal Information" icon={User} color="cyan" defaultOpen>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>
                      SSN (or ITIN) <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="XXX-XX-XXXX" />
                  </div>
                  <div>
                    <Label>Government Issued ID #</Label>
                    <Input placeholder="ID Number" />
                  </div>
                  <div>
                    <Label>Issuing State/Territory</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* Step 3: Financial & Income */}
          {currentStep === 2 && (
            <>
              {/* Financial Information */}
              <CollapsibleSection title="Financial Information" icon={DollarSign} color="green" defaultOpen>
                <div className="space-y-4">
                  {/* Bank Accounts */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Bank Accounts</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addBankAccount}
                        className="text-green-600 border-green-200 bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Account
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50">
                          <TableHead>Name *</TableHead>
                          <TableHead>Account Type</TableHead>
                          <TableHead>Account Number</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bankAccounts.map((account, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input className="h-8" placeholder="Bank name" />
                            </TableCell>
                            <TableCell>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="checking">Checking</SelectItem>
                                  <SelectItem value="savings">Savings</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input className="h-8" placeholder="XXXX" />
                            </TableCell>
                            <TableCell>
                              <Input className="h-8" placeholder="$ 0.00" />
                            </TableCell>
                            <TableCell>
                              {bankAccounts.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => removeBankAccount(index)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Credit Cards */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Credit Cards</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCreditCard}
                        className="text-green-600 border-green-200 bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Card
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-green-50">
                          <TableHead>Issuer *</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creditCards.map((card, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Input className="h-8" placeholder="Card issuer" />
                            </TableCell>
                            <TableCell>
                              <Input className="h-8" placeholder="$ 0.00" />
                            </TableCell>
                            <TableCell>
                              {creditCards.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => removeCreditCard(index)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Income */}
              <CollapsibleSection
                title="Income"
                icon={Briefcase}
                color="indigo"
                defaultOpen
                badge={`${employers.length} employer(s)`}
              >
                <div className="space-y-4">
                  {employers.map((employer, index) => (
                    <Card key={index} className="border-indigo-100">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-indigo-700">Employment {index + 1}</span>
                          {employers.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => removeEmployer(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="col-span-2">
                            <Label className="text-xs">Employer Name</Label>
                            <Input className="h-9" placeholder="Company name" />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Employer Phone</Label>
                            <Input className="h-9" placeholder="Phone number" />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Address</Label>
                            <Input className="h-9" placeholder="Street address" />
                          </div>
                          <div>
                            <Label className="text-xs">City</Label>
                            <Input className="h-9" placeholder="City" />
                          </div>
                          <div>
                            <Label className="text-xs">State</Label>
                            <Input className="h-9" placeholder="State" />
                          </div>
                          <div>
                            <Label className="text-xs">Monthly Salary</Label>
                            <Input className="h-9" placeholder="$ 0.00" />
                          </div>
                          <div>
                            <Label className="text-xs">Position Held</Label>
                            <Input className="h-9" placeholder="Job title" />
                          </div>
                          <div>
                            <Label className="text-xs">Years Worked</Label>
                            <Select>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {["< 1", "1-2", "2-5", "5-10", "10+"].map((y) => (
                                  <SelectItem key={y} value={y}>
                                    {y} years
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Supervisor Name</Label>
                            <Input className="h-9" placeholder="Name" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addEmployer}
                    className="text-indigo-600 border-indigo-200 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Employer
                  </Button>

                  {/* Additional Income */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-medium">Additional Income</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addIncome}
                        className="text-indigo-600 border-indigo-200 bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Income
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {additionalIncome.map((income, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label className="text-xs">Monthly Income</Label>
                            <Input className="h-9" placeholder="$ 0.00" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs">Source</Label>
                            <Input className="h-9" placeholder="Source of income" />
                          </div>
                          {additionalIncome.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeIncome(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </>
          )}

          {/* Step 4: Additional Info */}
          {currentStep === 3 && (
            <>
              {/* Dependents & Pets Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CollapsibleSection
                  title="Dependents"
                  icon={Users}
                  color="fuchsia"
                  defaultOpen
                  badge={`${dependents.length}`}
                >
                  <div className="space-y-3">
                    {dependents.map((dep, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end">
                        <Input className="h-9" placeholder="First name" />
                        <Input className="h-9" placeholder="Last name" />
                        <Input className="h-9" type="date" />
                        <div className="flex gap-1">
                          <Select>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Relation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {dependents.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeDependent(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addDependent}
                      className="text-fuchsia-600 border-fuchsia-200 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Dependent
                    </Button>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Pets" icon={Heart} color="rose" defaultOpen badge={`${pets.length}`}>
                  <div className="space-y-3">
                    {pets.map((pet, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end">
                        <Input className="h-9" placeholder="Name" />
                        <Input className="h-9" placeholder="Type/Breed" />
                        <Input className="h-9" placeholder="Weight" />
                        <div className="flex gap-1">
                          <Input className="h-9" placeholder="Age" />
                          {pets.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removePet(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPet}
                      className="text-rose-600 border-rose-200 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Pet
                    </Button>
                  </div>
                </CollapsibleSection>
              </div>

              {/* Emergency Contact */}
              <CollapsibleSection title="Emergency Contact" icon={AlertCircle} color="yellow" defaultOpen>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder="Full name" />
                  </div>
                  <div>
                    <Label>Relationship</Label>
                    <Input placeholder="e.g. Parent, Sibling" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input placeholder="Phone number" />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input placeholder="Email address" />
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <Label>Address</Label>
                    <Input placeholder="Full address" />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Notes & Attachments Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CollapsibleSection title="Notes" icon={FileText} color="slate" defaultOpen>
                  <Textarea
                    placeholder="Add any additional notes about this application..."
                    className="min-h-[100px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </CollapsibleSection>

                <CollapsibleSection title="Attachments" icon={Upload} color="teal" defaultOpen>
                  <div className="border-2 border-dashed border-teal-200 rounded-lg p-6 text-center bg-teal-50/50">
                    <Upload className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="text-teal-600 font-medium cursor-pointer hover:underline">Drag Files Here</span>{" "}
                      or{" "}
                      <span className="text-teal-600 font-medium cursor-pointer hover:underline">
                        Choose Files to Add
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB each)</p>
                  </div>
                </CollapsibleSection>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t px-6 py-4 flex items-center justify-between sticky bottom-0">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>
        {currentStep < steps.length - 1 ? (
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setCurrentStep(currentStep + 1)}>
            Next Step
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Application
          </Button>
        )}
      </div>
    </div>
  )
}
