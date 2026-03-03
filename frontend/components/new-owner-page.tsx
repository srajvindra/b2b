"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Plus } from "lucide-react"

interface NewOwnerPageProps {
  onBack: () => void
}

export function NewOwnerPage({ onBack }: NewOwnerPageProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b">
        <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Back to Leads
        </Button>
        <h1 className="text-2xl font-bold">New Owner</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-primary">Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Salutation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input placeholder="First Name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input placeholder="Last Name" />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Company Name" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="display-name" />
                  <Label htmlFor="display-name" className="font-normal">
                    Use company name as display name
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input placeholder="Tags" />
                  <Button variant="link" className="px-0 h-auto text-primary">
                    Manage Tags
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone Numbers */}
                <div className="space-y-4">
                  <Label>Phone Numbers</Label>
                  <div className="grid grid-cols-[1fr,120px] gap-2">
                    <Input placeholder="Phone Number" />
                    <Select defaultValue="mobile">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input placeholder="Additional Details" />
                  <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Phone Number
                  </Button>
                </div>

                {/* Emails */}
                <div className="space-y-4">
                  <Label>Emails</Label>
                  <Input placeholder="Email" />
                  <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Email
                  </Button>
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                  <Label>Addresses</Label>
                  <Input placeholder="Address 1" />
                  <Input placeholder="Address 2" />
                  <div className="grid grid-cols-[1fr,1fr,120px] gap-2">
                    <Input placeholder="City" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Zip" />
                  </div>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Address
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Payment Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox id="payment-address" defaultChecked />
                  <Label htmlFor="payment-address" className="font-normal">
                    Use owner address as payment address
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Accounting Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Accounting Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Consolidate Checks</Label>
                  <Select defaultValue="single">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">All bills on single check (hide extra stub detail)</SelectItem>
                      <SelectItem value="separate">Separate checks per property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Check Stub Breakdown</Label>
                  <Select defaultValue="detail">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detail">List each bill detail line item (separated view)</SelectItem>
                      <SelectItem value="summary">Summary view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="hold-payments" />
                  <Label htmlFor="hold-payments" className="font-normal">
                    Hold Payments
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-receipt" />
                  <Label htmlFor="email-receipt" className="font-normal">
                    Email eCheck Receipt?
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>Default Check Memo</Label>
                  <Input />
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Maintenance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>Owner-specific notes</Label>
                <Textarea className="min-h-[100px]" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Federal Tax */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Federal Tax</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Taxpayer Name</Label>
                  <div className="flex gap-4 items-center">
                    <Input className="flex-1" />
                    <div className="flex items-center space-x-2 shrink-0">
                      <Checkbox id="company-taxpayer" />
                      <Label htmlFor="company-taxpayer" className="font-normal text-sm">
                        Use company name as taxpayer name?
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Taxpayer ID</Label>
                  <Input />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="send-1099" />
                  <Label htmlFor="send-1099" className="font-normal">
                    Send 1099?
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="electronic-1099" />
                  <Label htmlFor="electronic-1099" className="font-normal">
                    Owner consented to receive electronic 1099?
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>1099 Sending Preference</Label>
                  <Select defaultValue="paper-electronic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paper-electronic">Paper & Electronic</SelectItem>
                      <SelectItem value="paper">Paper Only</SelectItem>
                      <SelectItem value="electronic">Electronic Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Owner Statement (Enhanced) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Owner Statement (Enhanced)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-transactions" defaultChecked />
                    <Label htmlFor="show-transactions" className="font-normal">
                      Show Transactions Detail
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-unpaid" defaultChecked />
                    <Label htmlFor="show-unpaid" className="font-normal">
                      Show Unpaid Bills Detail
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-tenant" defaultChecked />
                    <Label htmlFor="show-tenant" className="font-normal">
                      Show Tenant Names
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-summary" defaultChecked />
                    <Label htmlFor="show-summary" className="font-normal">
                      Show Summary
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="separate-fees" />
                    <Label htmlFor="separate-fees" className="font-normal">
                      Separate Management Fees from Cash Out
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="consolidate-work" />
                    <Label htmlFor="consolidate-work" className="font-normal">
                      Consolidate In-house Work Order Ref Line Items
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes for the Owner</Label>
                  <Textarea className="min-h-[100px]" />
                </div>
              </CardContent>
            </Card>

            {/* Owner Packet */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Owner Packet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="send-email" />
                    <Label htmlFor="send-email" className="font-normal">
                      Send via Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-work-orders" />
                    <Label htmlFor="include-work-orders" className="font-normal">
                      Include Paid Work Orders
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-bills" />
                    <Label htmlFor="include-bills" className="font-normal">
                      Include Paid Bills Attachments
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GL Account Map</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Map</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Included Reports</Label>
                  <Select defaultValue="statement">
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statement">Owner Statement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Report
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10">
                  <div className="text-muted-foreground">
                    <p className="font-medium">Drag Files Here</p>
                    <p className="text-sm">or</p>
                  </div>
                  <Button variant="outline" className="bg-background">
                    Choose Files to Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 mt-8 pb-8 max-w-[1600px] mx-auto">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={onBack}>Save</Button>
        </div>
      </div>
    </div>
  )
}
