"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Home,
  DollarSign,
  Calendar,
  Users,
  CreditCard,
  Cat,
  Dog,
  PawPrint,
  Plus,
  X,
  Upload,
  FileText,
  MessageSquare,
  Tag,
  UserPlus,
  Building,
  Save,
  Trash2,
  Download,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

interface NewGuestCardProps {
  onBack: () => void
  onSave: (data: any) => void
}

const sourceOptions = [
  { value: "apartments.com", label: "Apartments.com" },
  { value: "zillow", label: "Zillow" },
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "referral", label: "Referral" },
  { value: "walk-in", label: "Walk-in" },
  { value: "website", label: "Website" },
  { value: "craigslist", label: "Craigslist" },
  { value: "other", label: "Other" },
]

const staffMembers = [
  { value: "nina-patel", label: "Nina Patel" },
  { value: "john-doe", label: "John Doe" },
  { value: "sarah-wilson", label: "Sarah Wilson" },
  { value: "mike-johnson", label: "Mike Johnson" },
]

const propertiesAndUnits = [
  { value: "sunset-302", label: "Sunset Apartments - Unit 302" },
  { value: "oakwood-a5", label: "Oakwood Residence - Unit A-5" },
  { value: "pine-8b", label: "Pine Street Homes - Unit 8B" },
  { value: "harbor-1205", label: "Harbor View - Unit 1205" },
  { value: "metro-405", label: "Metro Plaza - Unit 405" },
  { value: "riverside-12c", label: "Riverside Apartments - Unit 12C" },
]

const bedroomOptions = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4+ Bedrooms" },
]

const bathroomOptions = [
  { value: "1", label: "1 Bathroom" },
  { value: "1.5", label: "1.5 Bathrooms" },
  { value: "2", label: "2 Bathrooms" },
  { value: "2.5", label: "2.5 Bathrooms" },
  { value: "3", label: "3+ Bathrooms" },
]

const occupantOptions = [
  { value: "0", label: "None" },
  { value: "1", label: "1 Person" },
  { value: "2", label: "2 People" },
  { value: "3", label: "3 People" },
  { value: "4", label: "4+ People" },
]

export default function NewGuestCard({ onBack, onSave }: NewGuestCardProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    tags: [] as string[],
    assignTo: "",
    interests: [""],
    bedrooms: "",
    bathrooms: "",
    maxRent: "",
    moveInDate: null as Date | null,
    additionalOccupants: "",
    monthlyIncome: "",
    creditScore: "",
    pets: {
      cat: false,
      dog: false,
      other: false,
    },
    comments: "",
    notes: [] as { id: number; text: string; date: string }[],
    attachments: [] as { id: number; name: string; size: string }[],
  })

  const [newTag, setNewTag] = useState("")
  const [newNote, setNewNote] = useState("")
  const [moveInDateOpen, setMoveInDateOpen] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const handleAddInterest = () => {
    setFormData({ ...formData, interests: [...formData.interests, ""] })
  }

  const handleRemoveInterest = (index: number) => {
    const newInterests = formData.interests.filter((_, i) => i !== index)
    setFormData({ ...formData, interests: newInterests.length ? newInterests : [""] })
  }

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...formData.interests]
    newInterests[index] = value
    setFormData({ ...formData, interests: newInterests })
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        date: new Date().toLocaleString(),
      }
      setFormData({ ...formData, notes: [...formData.notes, note] })
      setNewNote("")
    }
  }

  const handleRemoveNote = (id: number) => {
    setFormData({ ...formData, notes: formData.notes.filter((n) => n.id !== id) })
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-primary/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Guest Card</h1>
            <p className="text-sm text-muted-foreground">Add a new prospective tenant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="h-4 w-4 mr-2" />
            Save Guest Card
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information - Using primary semantic tokens */}
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className="mt-1.5 border-input focus:border-primary"
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="middleInitial" className="text-sm font-medium">
                    Middle Initial
                  </Label>
                  <Input
                    id="middleInitial"
                    value={formData.middleInitial}
                    onChange={(e) => setFormData({ ...formData, middleInitial: e.target.value.slice(0, 1) })}
                    placeholder="M"
                    maxLength={1}
                    className="mt-1.5 border-input focus:border-primary w-16"
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="mt-1.5 border-input focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-1.5 border-input focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="mt-1.5 border-input focus:border-primary"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="source" className="text-sm font-medium">
                    Source <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger className="mt-1.5 border-input focus:border-primary">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignTo" className="text-sm font-medium flex items-center gap-2">
                    <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                    Assign To
                  </Label>
                  <Select
                    value={formData.assignTo}
                    onValueChange={(value) => setFormData({ ...formData, assignTo: value })}
                  >
                    <SelectTrigger className="mt-1.5 border-input focus:border-primary">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((member) => (
                        <SelectItem key={member.value} value={member.value}>
                          {member.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags - Using semantic primary tokens */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Type to add a tag"
                    className="flex-1 border-input focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <button className="text-xs text-primary hover:underline mt-1">Manage Tags</button>
              </div>
            </CardContent>
          </Card>

          {/* Interests - Using success semantic tokens */}
          <Card className="border-l-4 border-l-success shadow-sm">
            <CardHeader className="bg-gradient-to-r from-success/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-success">
                <Building className="h-5 w-5" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {formData.interests.map((interest, index) => (
                <div key={index} className="flex gap-2">
                  <Select value={interest} onValueChange={(value) => handleInterestChange(index, value)}>
                    <SelectTrigger className="flex-1 border-input focus:border-success">
                      <SelectValue placeholder="Select property, unit, or campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertiesAndUnits.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.interests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInterest(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddInterest}
                className="w-full border-dashed border-success/50 text-success hover:bg-success/5 hover:border-success bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Interest
              </Button>
            </CardContent>
          </Card>

          {/* Profile - Using chart-1 semantic tokens for variation */}
          <Card className="border-l-4 border-l-chart-1 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-chart-1/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-chart-1">
                <Home className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Bedrooms</Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}
                  >
                    <SelectTrigger className="mt-1.5 border-input focus:border-chart-1">
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedroomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bathrooms</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => setFormData({ ...formData, bathrooms: value })}
                  >
                    <SelectTrigger className="mt-1.5 border-input focus:border-chart-1">
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      {bathroomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="maxRent" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Max Rent
                  </Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="maxRent"
                      type="number"
                      value={formData.maxRent}
                      onChange={(e) => setFormData({ ...formData, maxRent: e.target.value })}
                      placeholder="0.00"
                      className="pl-7 border-input focus:border-chart-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Move In Date
                  </Label>
                  <Popover open={moveInDateOpen} onOpenChange={setMoveInDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1.5 justify-start text-left font-normal border-input hover:bg-chart-1/5 bg-transparent"
                      >
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formData.moveInDate ? format(formData.moveInDate, "MMM d, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.moveInDate || undefined}
                        onSelect={(date) => {
                          setFormData({ ...formData, moveInDate: date || null })
                          setMoveInDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    Additional Occupants
                  </Label>
                  <Select
                    value={formData.additionalOccupants}
                    onValueChange={(value) => setFormData({ ...formData, additionalOccupants: value })}
                  >
                    <SelectTrigger className="mt-1.5 border-input focus:border-chart-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupantOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyIncome" className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    Monthly Income
                  </Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                      placeholder="0.00"
                      className="pl-7 border-input focus:border-chart-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="creditScore" className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                    Credit Score
                  </Label>
                  <Input
                    id="creditScore"
                    type="number"
                    value={formData.creditScore}
                    onChange={(e) => setFormData({ ...formData, creditScore: e.target.value })}
                    placeholder="650"
                    className="mt-1.5 border-input focus:border-chart-1"
                  />
                </div>
              </div>

              {/* Pets - Using chart-1 semantic tokens */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <PawPrint className="h-3.5 w-3.5 text-muted-foreground" />
                  Pets
                </Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cat"
                      checked={formData.pets.cat}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, pets: { ...formData.pets, cat: !!checked } })
                      }
                      className="border-chart-1/50 data-[state=checked]:bg-chart-1 data-[state=checked]:border-chart-1"
                    />
                    <label htmlFor="cat" className="text-sm flex items-center gap-1 cursor-pointer">
                      <Cat className="h-4 w-4 text-chart-1" />
                      Cat
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dog"
                      checked={formData.pets.dog}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, pets: { ...formData.pets, dog: !!checked } })
                      }
                      className="border-chart-1/50 data-[state=checked]:bg-chart-1 data-[state=checked]:border-chart-1"
                    />
                    <label htmlFor="dog" className="text-sm flex items-center gap-1 cursor-pointer">
                      <Dog className="h-4 w-4 text-chart-1" />
                      Dog
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="other-pet"
                      checked={formData.pets.other}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, pets: { ...formData.pets, other: !!checked } })
                      }
                      className="border-chart-1/50 data-[state=checked]:bg-chart-1 data-[state=checked]:border-chart-1"
                    />
                    <label htmlFor="other-pet" className="text-sm flex items-center gap-1 cursor-pointer">
                      <PawPrint className="h-4 w-4 text-chart-1" />
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Comments - Using warning semantic tokens */}
          <Card className="border-l-4 border-l-warning shadow-sm">
            <CardHeader className="bg-gradient-to-r from-warning/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-warning">
                <MessageSquare className="h-5 w-5" />
                Additional Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Add any additional comments or notes about this prospect..."
                className="min-h-[100px] border-input focus:border-warning resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notes & Attachments */}
        <div className="space-y-6">
          {/* Notes - Using info semantic tokens */}
          <Card className="border-l-4 border-l-info shadow-sm">
            <CardHeader className="bg-gradient-to-r from-info/5 to-transparent pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-info">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-info hover:text-info hover:bg-info/10">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                {formData.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-info/10 rounded-lg border border-info/20">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-foreground">{note.text}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveNote(note.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                  </div>
                ))}
                {formData.notes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No notes added yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="min-h-[80px] border-input focus:border-info resize-none"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddNote}
                className="w-full bg-info hover:bg-info/90 text-info-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Attachments - Using success semantic tokens */}
          <Card className="border-l-4 border-l-success shadow-sm">
            <CardHeader className="bg-gradient-to-r from-success/5 to-transparent pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-success">
                  <Upload className="h-5 w-5" />
                  Attachments
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-success hover:text-success hover:bg-success/10">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="border-2 border-dashed border-success/30 rounded-lg p-6 text-center hover:border-success hover:bg-success/5 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-success/60 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag files here to attach</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-success/10 rounded border border-success/20"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-success" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({file.size})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips - Using primary semantic tokens */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-primary mb-2">Quick Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Add interests to match prospects with available units
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Include credit score for faster qualification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use tags for easy filtering and organization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
