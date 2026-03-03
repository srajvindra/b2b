"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Plus, CalendarIcon, Upload, User, Home, FileText, Paperclip } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface NewTenantPageProps {
  onBack: () => void
}

export function NewTenantPage({ onBack }: NewTenantPageProps) {
  const [date, setDate] = React.useState<Date>()

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">New Tenant Application</h1>
            <p className="text-sm text-muted-foreground">Enter the details for the new tenant prospect.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={onBack}>Save Application</Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Contact Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            <Card className="border-none shadow-sm ring-1 ring-border/50">
              <CardContent className="p-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-5 space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="firstName" placeholder="e.g. Jane" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="middleInitial">Middle</Label>
                    <Input id="middleInitial" placeholder="M" />
                  </div>
                  <div className="md:col-span-5 space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="lastName" placeholder="e.g. Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="jane.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 000-0000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="source">
                      Source <span className="text-destructive">*</span>
                    </Label>
                    <Select defaultValue="google">
                      <SelectTrigger id="source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Select>
                      <SelectTrigger id="tags" className="text-muted-foreground">
                        <SelectValue placeholder="Select tags..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Add New...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assign">Assign To</Label>
                    <Select>
                      <SelectTrigger id="assign" className="text-muted-foreground">
                        <SelectValue placeholder="Select agent..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent1">Agent 1</SelectItem>
                        <SelectItem value="agent2">Agent 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Interests */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Home className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Interests</h2>
            </div>
            <Card className="border-none shadow-sm ring-1 ring-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-end">
                  <div className="space-y-2">
                    <Label>
                      Property, Unit, or Campaign <span className="text-destructive">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prop1">Sunset Apartments - Unit 101</SelectItem>
                        <SelectItem value="prop2">Downtown Lofts - Unit 4B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Profile */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Profile Details</h2>
            </div>
            <Card className="border-none shadow-sm ring-1 ring-border/50">
              <CardContent className="p-6 grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="3">3+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Rent</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input className="pl-7" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Move In Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Monthly Income</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input className="pl-7" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Credit Score</Label>
                    <Input placeholder="e.g. 720" />
                  </div>
                  <div className="space-y-2">
                    <Label>Occupants</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Person</SelectItem>
                        <SelectItem value="2">2 People</SelectItem>
                        <SelectItem value="3">3+ People</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Pets</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cat" />
                      <Label htmlFor="cat" className="font-normal cursor-pointer">
                        Cat
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dog" />
                      <Label htmlFor="dog" className="font-normal cursor-pointer">
                        Dog
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other" />
                      <Label htmlFor="other" className="font-normal cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Comments */}
          <section className="space-y-4">
            <Card className="border-none shadow-sm ring-1 ring-border/50">
              <CardHeader>
                <CardTitle className="text-base">Additional Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[100px] resize-none"
                  placeholder="Add any specific requirements or notes about the tenant..."
                />
              </CardContent>
            </Card>
          </section>

          {/* Notes & Attachments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes */}
            <Card className="border-none shadow-sm ring-1 ring-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  Notes
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">0</span>
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md bg-muted/30">
                  No notes added yet
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="border-none shadow-sm ring-1 ring-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Upload className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[120px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center space-y-1 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium">Drag files here</p>
                  <p className="text-xs text-muted-foreground">or click to upload</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 pb-8">
            <Button variant="outline" size="lg" onClick={onBack} className="min-w-[100px] bg-transparent">
              Cancel
            </Button>
            <Button size="lg" onClick={onBack} className="min-w-[140px]">
              Save Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
