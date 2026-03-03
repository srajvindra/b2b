"use client"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Edit,
  MoreHorizontal,
  Calendar,
  Clock,
  Home,
  DollarSign,
  Cat,
  Dog,
  Plus,
  Download,
  Upload,
  Send,
  Eye,
  Trash2,
  FileText,
  AlertCircle,
  Building,
  CalendarDays,
  User,
  Paperclip,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GuestCardDetailPageProps {
  guestCardId?: string
  onBack?: () => void
}

// Mock data for the guest card
const INITIAL_GUEST_CARD_DATA = {
  id: "1",
  name: "John H. Brown",
  email: "johnjohnjohn@gmail.com",
  phone: "07719777197",
  status: "Active",
  source: "Apartments.com",
  assignedTo: "George Guraya",
  createdDate: "11/19/2025",
  avatar: "/placeholder.svg?height=80&width=80",
  actionsLog: [
    {
      id: 1,
      date: "11/19/2025 12:34 AM",
      action: "Rental Application Completed",
      by: "George Guraya",
      details: "Unit Applied For: 8 SH - 2 - B",
      link: "View Application",
    },
    {
      id: 2,
      date: "11/19/2025 12:34 AM",
      action: "Guest Card Created",
      by: "George Guraya",
      details: "Notes: Created automatically via new rental application",
      link: null,
    },
  ],
  inquiries: [
    {
      id: 1,
      property: "8 SH",
      unit: "2 - B",
      createdOn: "11/19/2025",
      latestInterest: "11/19/2025",
      status: "Application Completed",
      assignedTo: null,
      selected: false,
    },
  ],
  showings: [] as Array<{
    id: number
    property: string
    date: string
    time: string
    status: string
  }>,
  interests: [
    {
      id: 1,
      property: "8 SH - 2 - B",
      address: "100 Vista Del Monte 2 Las Cruces, NM 88001",
      image: "/modern-apartment-building.png",
      bedBath: "--",
      sqft: "--",
      rent: 500,
      available: "--",
      lastShowing: "--",
      type: "Student-Housing",
    },
  ],
  profile: {
    bedrooms: "",
    bathrooms: "",
    maxRent: "",
    moveIn: "",
    additionalOccupants: "",
    monthlyIncome: "",
    creditScore: "",
    pets: {
      cat: false,
      dog: false,
      other: false,
    },
  },
  notes: [
    {
      id: 1,
      content: "Test note",
      author: "George Guraya",
      date: "Thu, December 11, 2025 at 03:42:10 AM",
    },
  ],
  texts: [] as Array<{ id: number; content: string; date: string; direction: string }>,
  emails: [] as Array<{ id: number; subject: string; content: string; date: string }>,
  attachments: [
    {
      id: 1,
      name: "Untitled_Diagram.drawio.jpg",
      date: "12/11/2025",
    },
  ],
}

export default function GuestCardDetailPage({ guestCardId, onBack }: GuestCardDetailPageProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile-communications")
  const [guestData, setGuestData] = useState(INITIAL_GUEST_CARD_DATA)
  const [profile, setProfile] = useState(INITIAL_GUEST_CARD_DATA.profile)
  const [newNote, setNewNote] = useState("")
  const [newTextMessage, setNewTextMessage] = useState("")
  const [newEmailSubject, setNewEmailSubject] = useState("")
  const [newEmailContent, setNewEmailContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [editedContact, setEditedContact] = useState({
    name: INITIAL_GUEST_CARD_DATA.name,
    email: INITIAL_GUEST_CARD_DATA.email,
    phone: INITIAL_GUEST_CARD_DATA.phone,
  })
  const [selectedInquiries, setSelectedInquiries] = useState<number[]>([])
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showInvitationDialog, setShowInvitationDialog] = useState(false)
  const [showNewInquiryDialog, setShowNewInquiryDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showTextDialog, setShowTextDialog] = useState(false)
  const [newShowing, setNewShowing] = useState({ property: "", date: "", time: "" })
  const [newInquiry, setNewInquiry] = useState({ property: "", unit: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSaveProfile = () => {
    toast({
      title: "Profile Saved",
      description: "Guest card profile has been updated successfully.",
    })
    setIsEditing(false)
  }

  const handleSaveContact = () => {
    setGuestData({ ...guestData, ...editedContact })
    toast({
      title: "Contact Updated",
      description: "Contact information has been saved.",
    })
    setIsEditingContact(false)
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: guestData.notes.length + 1,
        content: newNote,
        author: "Nina Patel",
        date: new Date().toLocaleString(),
      }
      setGuestData({ ...guestData, notes: [note, ...guestData.notes] })
      toast({
        title: "Note Added",
        description: "Your note has been added to the guest card.",
      })
      setNewNote("")
    }
  }

  const handleDeleteNote = (noteId: number) => {
    setGuestData({
      ...guestData,
      notes: guestData.notes.filter((n) => n.id !== noteId),
    })
    toast({
      title: "Note Deleted",
      description: "The note has been removed.",
    })
  }

  const handleScheduleShowing = () => {
    if (newShowing.property && newShowing.date && newShowing.time) {
      const showing = {
        id: guestData.showings.length + 1,
        property: newShowing.property,
        date: newShowing.date,
        time: newShowing.time,
        status: "Scheduled",
      }
      setGuestData({ ...guestData, showings: [...guestData.showings, showing] })
      toast({
        title: "Showing Scheduled",
        description: `Showing scheduled for ${newShowing.date} at ${newShowing.time}`,
      })
      setNewShowing({ property: "", date: "", time: "" })
      setShowScheduleDialog(false)
    }
  }

  const handleSendInvitation = () => {
    toast({
      title: "Invitation Sent",
      description: "Showing invitation has been sent to the prospect.",
    })
    setShowInvitationDialog(false)
  }

  const handleAddInquiry = () => {
    if (newInquiry.property && newInquiry.unit) {
      const inquiry = {
        id: guestData.inquiries.length + 1,
        property: newInquiry.property,
        unit: newInquiry.unit,
        createdOn: new Date().toLocaleDateString(),
        latestInterest: new Date().toLocaleDateString(),
        status: "New",
        assignedTo: null,
        selected: false,
      }
      setGuestData({ ...guestData, inquiries: [...guestData.inquiries, inquiry] })
      toast({
        title: "Inquiry Added",
        description: "New inquiry has been created.",
      })
      setNewInquiry({ property: "", unit: "" })
      setShowNewInquiryDialog(false)
    }
  }

  const handleSendText = () => {
    if (newTextMessage.trim()) {
      const text = {
        id: guestData.texts.length + 1,
        content: newTextMessage,
        date: new Date().toLocaleString(),
        direction: "outbound",
      }
      setGuestData({ ...guestData, texts: [...guestData.texts, text] })
      toast({
        title: "Text Sent",
        description: "Your message has been sent.",
      })
      setNewTextMessage("")
      setShowTextDialog(false)
    }
  }

  const handleSendEmail = () => {
    if (newEmailSubject.trim() && newEmailContent.trim()) {
      const email = {
        id: guestData.emails.length + 1,
        subject: newEmailSubject,
        content: newEmailContent,
        date: new Date().toLocaleString(),
      }
      setGuestData({ ...guestData, emails: [...guestData.emails, email] })
      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
      })
      setNewEmailSubject("")
      setNewEmailContent("")
      setShowEmailDialog(false)
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newAttachments = Array.from(files).map((file, index) => ({
        id: guestData.attachments.length + index + 1,
        name: file.name,
        date: new Date().toLocaleDateString(),
      }))
      setGuestData({
        ...guestData,
        attachments: [...guestData.attachments, ...newAttachments],
      })
      toast({
        title: "Files Uploaded",
        description: `${files.length} file(s) have been uploaded.`,
      })
    }
  }

  const handleDeleteAttachment = (attachmentId: number) => {
    setGuestData({
      ...guestData,
      attachments: guestData.attachments.filter((a) => a.id !== attachmentId),
    })
    toast({
      title: "Attachment Deleted",
      description: "The file has been removed.",
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedInquiries.length === 0) {
      toast({
        title: "No Inquiries Selected",
        description: "Please select at least one inquiry.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: `${action}`,
      description: `Applied to ${selectedInquiries.length} inquiry(ies).`,
    })
    setSelectedInquiries([])
  }

  const handleStatusChange = (newStatus: string) => {
    setGuestData({ ...guestData, status: newStatus })
    toast({
      title: "Status Updated",
      description: `Guest card marked as ${newStatus}.`,
    })
  }

  const handleCall = () => {
    toast({
      title: "Initiating Call",
      description: `Calling ${guestData.phone}...`,
    })
  }

  const handleDownloadNotes = () => {
    toast({
      title: "Download Started",
      description: "Notes are being downloaded.",
    })
  }

  const handleDownloadEmails = () => {
    toast({
      title: "Download Started",
      description: "Emails are being downloaded.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Pre-Qualified":
        return "bg-blue-500"
      case "Application Completed":
        return "bg-teal-500"
      case "Lead":
        return "bg-gray-500"
      case "New":
        return "bg-purple-500"
      case "Scheduled":
        return "bg-orange-500"
      default:
        return "bg-gray-400"
    }
  }

  const toggleInquirySelection = (id: number) => {
    setSelectedInquiries((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleAllInquiries = () => {
    if (selectedInquiries.length === guestData.inquiries.length) {
      setSelectedInquiries([])
    } else {
      setSelectedInquiries(guestData.inquiries.map((i) => i.id))
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/30">
                <AvatarImage src={guestData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {guestData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{guestData.name}</h1>
                  <Badge className={`${getStatusColor(guestData.status)} text-white`}>{guestData.status}</Badge>
                </div>
                <p className="text-white/80 text-sm mt-1">
                  Source: {guestData.source} | Assigned to: {guestData.assignedTo}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => setIsEditingContact(true)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("Pre-Qualified")}>
                  Mark as Pre-Qualified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("Applicant")}>
                  Convert to Applicant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("Archived")}>Archive Guest Card</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    toast({
                      title: "Guest Card Deleted",
                      description: "The guest card has been removed.",
                      variant: "destructive",
                    })
                    onBack?.()
                  }}
                >
                  Delete Guest Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="flex items-center gap-6 bg-white/10 rounded-lg p-3 mt-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-white/70" />
            <a href={`mailto:${guestData.email}`} className="text-white hover:underline text-sm">
              {guestData.email}
            </a>
          </div>
          <Separator orientation="vertical" className="h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-white/70" />
            <span className="text-white text-sm">{guestData.phone}</span>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="secondary" className="gap-2" onClick={() => setShowTextDialog(true)}>
              <MessageSquare className="h-4 w-4" />
              Text
            </Button>
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleCall}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button size="sm" variant="secondary" className="gap-2" onClick={() => setShowEmailDialog(true)}>
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs - Reordered: Profile & Communications first, then Overview */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b bg-muted/30 px-6">
          <TabsList className="h-12 bg-transparent gap-2">
            <TabsTrigger value="profile-communications" className="data-[state=active]:bg-background">
              <User className="h-4 w-4 mr-2" />
              Profile & Communications
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              Overview
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-background">
              Inquiries & Showings
            </TabsTrigger>
            <TabsTrigger value="attachments" className="data-[state=active]:bg-background">
              Attachments
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-6">
          <TabsContent value="profile-communications" className="mt-0 space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-teal-600" />
                  Prospect Profile
                </CardTitle>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handleSaveProfile}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Select
                      disabled={!isEditing}
                      value={profile.bedrooms}
                      onValueChange={(v) => setProfile({ ...profile, bedrooms: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4+">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Select
                      disabled={!isEditing}
                      value={profile.bathrooms}
                      onValueChange={(v) => setProfile({ ...profile, bathrooms: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Bathroom</SelectItem>
                        <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                        <SelectItem value="2">2 Bathrooms</SelectItem>
                        <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                        <SelectItem value="3+">3+ Bathrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Rent</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        disabled={!isEditing}
                        placeholder="Enter max rent"
                        className="pl-9"
                        value={profile.maxRent}
                        onChange={(e) => setProfile({ ...profile, maxRent: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Move In Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        disabled={!isEditing}
                        type="date"
                        className="pl-9"
                        value={profile.moveIn}
                        onChange={(e) => setProfile({ ...profile, moveIn: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Occupants</Label>
                    <Select
                      disabled={!isEditing}
                      value={profile.additionalOccupants}
                      onValueChange={(v) => setProfile({ ...profile, additionalOccupants: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        disabled={!isEditing}
                        placeholder="Enter monthly income"
                        className="pl-9"
                        value={profile.monthlyIncome}
                        onChange={(e) => setProfile({ ...profile, monthlyIncome: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Credit Score</Label>
                    <Input
                      disabled={!isEditing}
                      placeholder="Enter credit score"
                      value={profile.creditScore}
                      onChange={(e) => setProfile({ ...profile, creditScore: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2 lg:col-span-3">
                    <Label>Pets</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="cat"
                          disabled={!isEditing}
                          checked={profile.pets.cat}
                          onCheckedChange={(checked) =>
                            setProfile({ ...profile, pets: { ...profile.pets, cat: checked as boolean } })
                          }
                        />
                        <Label htmlFor="cat" className="flex items-center gap-1 cursor-pointer">
                          <Cat className="h-4 w-4" />
                          Cat
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="dog"
                          disabled={!isEditing}
                          checked={profile.pets.dog}
                          onCheckedChange={(checked) =>
                            setProfile({ ...profile, pets: { ...profile.pets, dog: checked as boolean } })
                          }
                        />
                        <Label htmlFor="dog" className="flex items-center gap-1 cursor-pointer">
                          <Dog className="h-4 w-4" />
                          Dog
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="other"
                          disabled={!isEditing}
                          checked={profile.pets.other}
                          onCheckedChange={(checked) =>
                            setProfile({ ...profile, pets: { ...profile.pets, other: checked as boolean } })
                          }
                        />
                        <Label htmlFor="other" className="cursor-pointer">
                          Other
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  Notes
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleDownloadNotes}>
                    <Download className="h-4 w-4" />
                    Download Notes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Add a new note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddNote}>
                      Save
                    </Button>
                  </div>
                  <Separator />
                  {guestData.notes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No notes yet. Add the first note above.</p>
                    </div>
                  ) : (
                    guestData.notes.map((note) => (
                      <div key={note.id} className="border-l-4 border-teal-500 pl-4 py-2 bg-muted/30 rounded-r-lg">
                        <div className="flex items-start justify-between">
                          <p className="text-xs text-muted-foreground">
                            Posted by <span className="text-teal-600 font-medium">{note.author}</span> on {note.date}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs text-destructive"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Texts Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-teal-600" />
                  Texts
                </CardTitle>
                <Button
                  size="sm"
                  className="gap-2 bg-teal-600 hover:bg-teal-700"
                  onClick={() => setShowTextDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Send Text
                </Button>
              </CardHeader>
              <CardContent>
                
                {guestData.texts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No text messages have been sent.</p>
                    <Button variant="link" className="mt-2" onClick={() => setShowTextDialog(true)}>
                      Send a text message
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guestData.texts.map((text) => (
                      <div key={text.id} className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-sm">{text.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{text.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emails Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-teal-600" />
                  Emails
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleDownloadEmails}>
                    <Download className="h-4 w-4" />
                    Download Emails
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 bg-teal-600 hover:bg-teal-700"
                    onClick={() => setShowEmailDialog(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {guestData.emails.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No emails have been sent.</p>
                    <Button variant="link" className="mt-2" onClick={() => setShowEmailDialog(true)}>
                      Send an email
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guestData.emails.map((email) => (
                      <div key={email.id} className="p-4 border rounded-lg">
                        <h4 className="font-medium text-sm">{email.subject}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{email.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{email.date}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Actions Log */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                    Actions Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guestData.actionsLog.map((action, index) => (
                      <div
                        key={action.id}
                        className={`flex gap-4 ${index !== guestData.actionsLog.length - 1 ? "border-b pb-4" : ""}`}
                      >
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-teal-500" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {action.action}{" "}
                                <span className="font-normal text-muted-foreground">by {action.by}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{action.details}</p>
                              {action.link && (
                                <Button
                                  variant="link"
                                  className="h-auto p-0 text-xs text-teal-600 mt-1"
                                  onClick={() => toast({ title: "Opening", description: action.link })}
                                >
                                  {action.link}
                                </Button>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{action.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Inquiries</span>
                    </div>
                    <span className="font-semibold">{guestData.inquiries.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Showings</span>
                    </div>
                    <span className="font-semibold">{guestData.showings.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Interests</span>
                    </div>
                    <span className="font-semibold">{guestData.interests.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notes</span>
                    </div>
                    <span className="font-semibold">{guestData.notes.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interests Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-teal-600" />
                  Interests
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast({ title: "Edit Interests", description: "Opening interests editor..." })}
                >
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {guestData.interests.map((interest) => (
                    <Card
                      key={interest.id}
                      className="overflow-hidden border-2 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex">
                        <div className="w-24 h-24 bg-muted flex-shrink-0">
                          <img
                            src={interest.image || "/placeholder.svg"}
                            alt={interest.property}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm text-teal-700">{interest.property}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{interest.address}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {interest.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{interest.bedBath} BD/BA</span>
                            <span>{interest.sqft} SF</span>
                            <span className="font-medium text-teal-600">${interest.rent}</span>
                          </div>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs text-teal-600 mt-1"
                            onClick={() => setShowInvitationDialog(true)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send Showing Invitation
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries & Showings Tab */}
          <TabsContent value="inquiries" className="mt-0 space-y-6">
            {/* Inquiries Received */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Inquiries Received</CardTitle>
                <Button
                  size="sm"
                  className="gap-2 bg-teal-600 hover:bg-teal-700"
                  onClick={() => setShowNewInquiryDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Inquiry
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Bulk Actions Applied")}>
                    Bulk Actions
                  </Button>
                  <Button variant="outline" size="sm" onClick={toggleAllInquiries}>
                    {selectedInquiries.length === guestData.inquiries.length ? "Deselect All" : "Select All"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Marked Inactive")}>
                    Mark Inactive
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Marked Active")}>
                    Mark Active
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Marked Cold")}>
                    Mark Cold
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Marked Waitlisted")}>
                    Mark Waitlisted
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Marked Pre-Qualified")}>
                    Mark Pre-Qualified
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            selectedInquiries.length === guestData.inquiries.length && guestData.inquiries.length > 0
                          }
                          onCheckedChange={toggleAllInquiries}
                        />
                      </TableHead>
                      <TableHead>Inquired Property</TableHead>
                      <TableHead>Unit Interested</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Latest Interest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guestData.inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedInquiries.includes(inquiry.id)}
                            onCheckedChange={() => toggleInquirySelection(inquiry.id)}
                          />
                        </TableCell>
                        <TableCell className="text-teal-600 font-medium">{inquiry.property}</TableCell>
                        <TableCell className="text-teal-600">{inquiry.unit}</TableCell>
                        <TableCell>{inquiry.createdOn}</TableCell>
                        <TableCell>{inquiry.latestInterest}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                        </TableCell>
                        <TableCell>{inquiry.assignedTo || "--"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Assign Agent</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Showings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Showings</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => setShowScheduleDialog(true)}
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Showing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => setShowInvitationDialog(true)}
                  >
                    <Send className="h-4 w-4" />
                    Send Showing Invitation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {guestData.showings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No showings have been scheduled.</p>
                    <Button variant="link" className="mt-2" onClick={() => setShowScheduleDialog(true)}>
                      Schedule a showing
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestData.showings.map((showing) => (
                        <TableRow key={showing.id}>
                          <TableCell className="font-medium">{showing.property}</TableCell>
                          <TableCell>{showing.date}</TableCell>
                          <TableCell>{showing.time}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(showing.status)}>{showing.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-teal-600" />
                  Attachments
                </CardTitle>
                <Button
                  size="sm"
                  className="gap-2 bg-teal-600 hover:bg-teal-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </CardHeader>
              <CardContent>
                {/* Drop zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
                    isDragging ? "border-teal-500 bg-teal-50" : "border-muted-foreground/25 hover:border-teal-500/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleFileUpload(e.dataTransfer.files)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag files here to attach or click to browse</p>
                </div>

                {/* Attachments list */}
                {guestData.attachments.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guestData.attachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                          <TableCell className="text-teal-600 font-medium">{attachment.name}</TableCell>
                          <TableCell>{attachment.date}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              onClick={() => toast({ title: "Preview", description: `Opening ${attachment.name}...` })}
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteAttachment(attachment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditingContact} onOpenChange={setIsEditingContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>Update the guest card contact details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editedContact.name}
                onChange={(e) => setEditedContact({ ...editedContact, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editedContact.email}
                onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={editedContact.phone}
                onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingContact(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSaveContact}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Showing Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Showing</DialogTitle>
            <DialogDescription>Schedule a property showing for this prospect.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <Select value={newShowing.property} onValueChange={(v) => setNewShowing({ ...newShowing, property: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {guestData.interests.map((interest) => (
                    <SelectItem key={interest.id} value={interest.property}>
                      {interest.property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={newShowing.date}
                onChange={(e) => setNewShowing({ ...newShowing, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={newShowing.time}
                onChange={(e) => setNewShowing({ ...newShowing, time: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleScheduleShowing}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invitation Dialog */}
      <Dialog open={showInvitationDialog} onOpenChange={setShowInvitationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Showing Invitation</DialogTitle>
            <DialogDescription>Send an invitation to the prospect to schedule a showing.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              An email and/or text message will be sent to {guestData.name} with available showing times for the
              selected properties.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvitationDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSendInvitation}>
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Inquiry Dialog */}
      <Dialog open={showNewInquiryDialog} onOpenChange={setShowNewInquiryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Inquiry</DialogTitle>
            <DialogDescription>Add a new property inquiry for this guest.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <Input
                placeholder="Enter property name"
                value={newInquiry.property}
                onChange={(e) => setNewInquiry({ ...newInquiry, property: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                placeholder="Enter unit number"
                value={newInquiry.unit}
                onChange={(e) => setNewInquiry({ ...newInquiry, unit: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewInquiryDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddInquiry}>
              Add Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Text Dialog */}
      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Text Message</DialogTitle>
            <DialogDescription>Send a text message to {guestData.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
                <Textarea
                  placeholder="Type your message..."
                  value={newTextMessage}
                  onChange={(e) => setNewTextMessage(e.target.value)}
                  rows={4}
                  className="border-0 focus-visible:ring-0 resize-none"
                />
                {/* Attachment Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
                  <label className="cursor-pointer">
                    <input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx" />
                    <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-xs">Attach files</span>
                    </div>
                  </label>
                  <span className="text-xs text-muted-foreground">Attach documents, images, or PDFs</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTextDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSendText}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>Compose an email to {guestData.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Email subject"
                value={newEmailSubject}
                onChange={(e) => setNewEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
                <Textarea
                  placeholder="Type your email content..."
                  value={newEmailContent}
                  onChange={(e) => setNewEmailContent(e.target.value)}
                  rows={6}
                  className="border-0 focus-visible:ring-0 resize-none"
                />
                {/* Attachment Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
                  <label className="cursor-pointer">
                    <input type="file" multiple className="hidden" accept="image/*,.pdf,.doc,.docx" />
                    <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-xs">Attach files</span>
                    </div>
                  </label>
                  <span className="text-xs text-muted-foreground">Attach documents, images, or PDFs</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSendEmail}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
