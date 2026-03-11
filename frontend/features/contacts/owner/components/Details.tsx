"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Clipboard, CreditCard, FileBarChart, Package, Upload, HelpCircle, ChevronRight, Trash2 } from "lucide-react"
import type { CustomField } from "../types"

function InfoRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-border/50">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <span className="text-foreground text-sm font-medium text-right">{value || "--"}</span>
    </div>
  )
}

function CustomFieldRow({
  field,
  onDelete,
}: {
  field: { id: string; name: string; type: string; value: string; isMandatory: boolean; options?: string[] }
  onDelete: (id: string) => void
}) {
  const [value, setValue] = useState(field.value)

  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
        return <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm w-40" />
      case "number":
        return <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm w-40" />
      case "date":
        return <Input type="date" value={value} onChange={(e) => setValue(e.target.value)} className="h-7 text-sm w-40" />
      case "dropdown":
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="h-7 text-sm w-40">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "yes_no":
        return (
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="h-7 text-sm w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        )
      default:
        return <span className="text-sm font-medium">{value || "--"}</span>
    }
  }

  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 group">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">{field.name}</span>
        {field.isMandatory ? (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">Required</span>
        ) : (
          <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">Optional</span>
        )}
        <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded flex items-center gap-0.5">
          <FileBarChart className="h-2.5 w-2.5" />
          Reportable
        </span>
      </div>
      <div className="flex items-center gap-2">
        {renderFieldInput()}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
          onClick={() => onDelete(field.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  actions,
  sectionId,
  onAddField,
  customFieldCount = 0,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
  actions?: React.ReactNode
  sectionId?: string
  onAddField?: (sectionId: string) => void
  customFieldCount?: number
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <Card>
      <CardHeader
        className="py-3 px-4 flex flex-row items-center justify-between border-b cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
          <Icon className="h-4 w-4 text-teal-600" />
          <CardTitle className="text-base font-medium text-slate-800">{title}</CardTitle>
          {customFieldCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">
              +{customFieldCount} custom
            </span>
          )}
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {sectionId && onAddField && (
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onAddField(sectionId)}>
              + Add Field
            </Button>
          )}
          {actions}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="py-4 px-4">{children}</CardContent>}
    </Card>
  )
}

export interface OwnerDetailsSectionConfig {
  federalTax: Record<string, string>
  accounting: Record<string, string>
  bankAccount: Record<string, string>
  ownerStatement: Record<string, string>
  ownerPacket: Record<string, string>
}

export interface OwnerDetailsTabProps {
  sectionConfig: OwnerDetailsSectionConfig
  customFields: CustomField[]
  getFieldsForSection: (sectionId: string) => CustomField[]
  onAddField: (sectionId: string) => void
  onDeleteField: (id: string) => void
}

export function OwnerDetailsTab({
  sectionConfig,
  customFields,
  getFieldsForSection,
  onAddField,
  onDeleteField,
}: OwnerDetailsTabProps) {
  const { federalTax, accounting, bankAccount, ownerStatement, ownerPacket } = sectionConfig

  return (
    <div className="mt-4 space-y-4">
      {/* <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
        <FileBarChart className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">All fields are report-ready</p>
          <p className="text-xs text-blue-600">
            When generating the Owner Directory report, you can choose which mandatory and optional fields to include.
          </p>
        </div>
      </div> */}

      <CollapsibleSection
        title="Federal Tax"
        icon={FileText}
        defaultOpen={true}
        sectionId="federal-tax"
        onAddField={onAddField}
        customFieldCount={getFieldsForSection("federal-tax").length}
        actions={<Button variant="link" className="text-primary p-0 h-auto text-sm">Edit</Button>}
      >
        <div className="grid grid-cols-1 gap-x-8">
          <InfoRow label={<span className="flex items-center gap-1">Taxpayer Name <HelpCircle className="h-3 w-3 text-muted-foreground" /></span>} value={federalTax.taxpayerName} />
          <InfoRow label="Taxpayer ID" value={federalTax.taxpayerId} />
          <InfoRow label="Tax Form Account Number" value={federalTax.taxFormAccountNumber} />
          <InfoRow label="Send 1099?" value={federalTax.send1099} />
          <InfoRow label="Owner consented to receive electronic 1099?" value={federalTax.ownerConsentedElectronic1099} />
          <InfoRow label="1099 Sending Preference" value={federalTax.sending1099Preference} />
          {getFieldsForSection("federal-tax").map((field) => (
            <CustomFieldRow key={field.id} field={field} onDelete={onDeleteField} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Accounting Information"
        icon={Clipboard}
        defaultOpen={true}
        sectionId="accounting"
        onAddField={onAddField}
        customFieldCount={getFieldsForSection("accounting").length}
        actions={<Button variant="link" className="text-primary p-0 h-auto text-sm">Edit</Button>}
      >
        <div className="grid grid-cols-1 gap-x-8">
          <InfoRow label="Check Consolidation" value={accounting.checkConsolidation} />
          <InfoRow label="Check Stub Breakdown" value={accounting.checkStubBreakdown} />
          <InfoRow label="Hold Payments?" value={accounting.holdPayments} />
          <InfoRow label="Email eCheck Receipt?" value={accounting.emailECheckReceipt} />
          <InfoRow label="Default Check Memo" value={accounting.defaultCheckMemo} />
          {getFieldsForSection("accounting").map((field) => (
            <CustomFieldRow key={field.id} field={field} onDelete={onDeleteField} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Bank Account Information"
        icon={CreditCard}
        defaultOpen={true}
        sectionId="bank-account"
        onAddField={onAddField}
        customFieldCount={getFieldsForSection("bank-account").length}
        actions={<Button variant="link" className="text-primary p-0 h-auto text-sm">Edit</Button>}
      >
        <div className="grid grid-cols-1 gap-x-8">
          <InfoRow label="Owner Paid by ACH?" value={bankAccount.ownerPaidByACH} />
          <InfoRow label="Bank Routing Number" value={bankAccount.bankRoutingNumber} />
          <InfoRow label="Bank Account Number" value={bankAccount.bankAccountNumber} />
          <InfoRow label="Savings Account?" value={bankAccount.savingsAccount} />
          {getFieldsForSection("bank-account").map((field) => (
            <CustomFieldRow key={field.id} field={field} onDelete={onDeleteField} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Owner Statement (Enhanced)"
        icon={FileBarChart}
        defaultOpen={true}
        sectionId="owner-statement"
        onAddField={onAddField}
        customFieldCount={getFieldsForSection("owner-statement").length}
        actions={<Button variant="link" className="text-primary p-0 h-auto text-sm">Edit</Button>}
      >
        <div className="grid grid-cols-1 gap-x-8">
          <InfoRow label="Show Transactions Detail" value={ownerStatement.showTransactionsDetail} />
          <InfoRow label="Show Unpaid Bills Detail" value={ownerStatement.showUnpaidBillsDetail} />
          <InfoRow label="Show Tenant Names" value={ownerStatement.showTenantNames} />
          <InfoRow label="Show Summary" value={ownerStatement.showSummary} />
          <InfoRow label="Separate Management Fees from Cash Out" value={ownerStatement.separateManagementFeesFromCashOut} />
          <InfoRow label="Consolidate In-house Work Order Bill Line Items" value={ownerStatement.consolidateInHouseWorkOrderBillLineItems} />
          <InfoRow label="Notes for the Owner" value={ownerStatement.notesForTheOwner} />
          {getFieldsForSection("owner-statement").map((field) => (
            <CustomFieldRow key={field.id} field={field} onDelete={onDeleteField} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Owner Packet"
        icon={Package}
        defaultOpen={true}
        sectionId="owner-packet"
        onAddField={onAddField}
        customFieldCount={getFieldsForSection("owner-packet").length}
        actions={<Button variant="link" className="text-primary p-0 h-auto text-sm">Edit</Button>}
      >
        <div className="grid grid-cols-1 gap-x-8">
          <InfoRow label="Send via Email?" value={ownerPacket.sendViaEmail} />
          <InfoRow label="Include Paid Work Orders" value={ownerPacket.includePaidWorkOrders} />
          <InfoRow label="Include Paid Work Orders Attachments" value={ownerPacket.includePaidWorkOrdersAttachments} />
          <InfoRow label="Include Paid Bills Attachments" value={ownerPacket.includePaidBillsAttachments} />
          <InfoRow label="GL Account Map" value={ownerPacket.glAccountMap} />
          <InfoRow label="Included Reports" value={ownerPacket.includedReports} />
          {getFieldsForSection("owner-packet").map((field) => (
            <CustomFieldRow key={field.id} field={field} onDelete={onDeleteField} />
          ))}
        </div>
      </CollapsibleSection>

      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
          <CardTitle className="text-base font-medium text-slate-800">Management Agreements</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-sm bg-transparent">
            <Upload className="h-4 w-4 mr-1.5" />
            Upload Agreement
          </Button>
        </CardHeader>
        <CardContent className="py-8 px-4">
          <p className="text-sm text-slate-500 text-center">There are no management agreements at this time.</p>
        </CardContent>
      </Card>
    </div>
  )
}
