"use client"

import {
  Mail,
  Phone,
  Building2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Contact } from "@/features/contacts/types"

interface StaffContactDetailSheetProps {
  contact: Contact | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Minimal mock data reused from ContactsPage behaviour
const MOCK_ACTIVITIES = [
  { id: 1, description: "Called contact about upcoming inspection", date: "Dec 10, 2025", user: "Nina Patel" },
  { id: 2, description: "Emailed maintenance report", date: "Dec 5, 2025", user: "System" },
]

const MOCK_PAYMENTS = [
  { id: 1, date: "Nov 30, 2025", type: "Invoice", amount: "$250.00", status: "Paid" },
  { id: 2, date: "Oct 15, 2025", type: "Invoice", amount: "$180.00", status: "Paid" },
]

const MOCK_NOTES = [
  { id: 1, content: "Great response times and reliable work.", author: "Nina Patel", date: "Nov 2, 2025" },
  { id: 2, content: "Specializes in HVAC and heating systems.", author: "System", date: "Oct 21, 2025" },
]

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

const getStatusColor = (status: Contact["status"]) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success hover:bg-success/15"
    case "Inactive":
      return "bg-muted text-muted-foreground hover:bg-muted/80"
    case "Pending":
      return "bg-warning/10 text-warning-foreground hover:bg-warning/15"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getTypeColor = (type: Contact["type"]) => {
  switch (type) {
    case "Vendor":
      return "bg-chart-3/10 text-chart-3"
    case "Property Technician":
      return "bg-info/10 text-info"
    case "Leasing Agent":
      return "bg-chart-5/10 text-chart-5"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function StaffContactDetailSheet({
  contact,
  open,
  onOpenChange,
}: StaffContactDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {contact && (
          <>
            <SheetHeader className="text-left pb-4 border-b">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg bg-muted text-muted-foreground">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <SheetTitle className="text-xl">{contact.name}</SheetTitle>
                  <SheetDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getTypeColor(contact.type)}>
                      {contact.type}
                    </Badge>
                    <Badge variant="secondary" className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </SheetDescription>
                  <p className="text-sm text-muted-foreground mt-2">{contact.location}</p>
                </div>
              </div>
            </SheetHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {contact.properties.length > 0
                          ? contact.properties.join(", ")
                          : "No properties assigned"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned Staff</span>
                      <span>{contact.assignedStaff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active</span>
                      <span>{contact.lastActive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact ID</span>
                      <span>#{contact.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {MOCK_ACTIVITIES.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div className="h-2 w-2 rounded-full bg-info mt-2" />
                        <div className="flex-1">
                          <p>{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.date} • {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs">Amount</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_PAYMENTS.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="text-xs">{payment.date}</TableCell>
                            <TableCell className="text-xs">{payment.type}</TableCell>
                            <TableCell className="text-xs">{payment.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  payment.status === "Paid"
                                    ? "bg-success/10 text-success"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {payment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                    <Button variant="outline" size="sm">
                      Add Note
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {MOCK_NOTES.map((note) => (
                      <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {note.author} • {note.date}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex gap-2">
              <Button className="flex-1">
                <Mail className="h-4 w-4 mr-2" /> Send Email
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Phone className="h-4 w-4 mr-2" /> Call
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

