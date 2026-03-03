"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Zap, Users, Megaphone, Target, FileText, User } from "lucide-react"

interface NewAutomationPageProps {
  onBack: () => void
}

export default function NewAutomationPage({ onBack }: NewAutomationPageProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [automationData, setAutomationData] = useState({
    automationType: "new-lead" as "new-lead" | "general",
    isReferralPartner: false,
    automationName: "",
    leadSource: "",
    lineOfBusiness: "",
    contentSource: "",
    owner: "",
  })

  const handleCreateAutomation = async () => {
    if (!automationData.automationName.trim()) {
      toast({
        title: "Validation Error",
        description: "Automation name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Automation Created",
      description: `"${automationData.automationName}" has been created successfully.`,
    })

    setIsSubmitting(false)
    onBack()
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-primary shadow-lg">
        <div className="px-6 py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              <span className="text-xl font-bold text-primary-foreground">New Custom Personal Automation</span>
            </div>
          </button>
          <p className="mt-2 ml-12 text-primary-foreground/70 text-sm">
            Create targeted automations to engage your leads and tenants
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="border border-border shadow-xl bg-card rounded-2xl overflow-hidden">
          <div className="bg-accent px-6 py-4">
            <h2 className="text-lg font-semibold text-accent-foreground flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Custom Automation Details
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Configure your automation settings below</p>
          </div>

          <CardContent className="p-6 space-y-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="automation-name"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Target className="h-4 w-4 text-primary" />
                  Automation Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="automation-name"
                  placeholder="Enter automation name"
                  value={automationData.automationName}
                  onChange={(e) => setAutomationData({ ...automationData, automationName: e.target.value })}
                  className="border-input focus:border-primary h-12 rounded-xl"
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Lead Source */}
                <div className="space-y-2">
                  <Label htmlFor="lead-source" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-info" />
                    Lead Source
                  </Label>
                  <Select
                    value={automationData.leadSource}
                    onValueChange={(value) => setAutomationData({ ...automationData, leadSource: value })}
                  >
                    <SelectTrigger id="lead-source" className="border-input h-12 rounded-xl">
                      <SelectValue placeholder="Select lead source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="walk-in">Walk-in</SelectItem>
                      <SelectItem value="apartments-com">Apartments.com</SelectItem>
                      <SelectItem value="zillow">Zillow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Line of Business */}
                <div className="space-y-2">
                  <Label
                    htmlFor="line-of-business"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-chart-1" />
                    Line of Business
                  </Label>
                  <Select
                    value={automationData.lineOfBusiness}
                    onValueChange={(value) => setAutomationData({ ...automationData, lineOfBusiness: value })}
                  >
                    <SelectTrigger id="line-of-business" className="border-input h-12 rounded-xl">
                      <SelectValue placeholder="Select line of business" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Source */}
                <div className="space-y-2">
                  <Label
                    htmlFor="content-source"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4 text-success" />
                    Content Source
                  </Label>
                  <Select
                    value={automationData.contentSource}
                    onValueChange={(value) => setAutomationData({ ...automationData, contentSource: value })}
                  >
                    <SelectTrigger id="content-source" className="border-input h-12 rounded-xl">
                      <SelectValue placeholder="Select content source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template-1">Welcome Template</SelectItem>
                      <SelectItem value="template-2">Follow-up Template</SelectItem>
                      <SelectItem value="template-3">Promotional Template</SelectItem>
                      <SelectItem value="custom">Custom Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Owner */}
                <div className="space-y-2">
                  <Label htmlFor="owner" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-warning" />
                    Owner
                  </Label>
                  <Select
                    value={automationData.owner}
                    onValueChange={(value) => setAutomationData({ ...automationData, owner: value })}
                  >
                    <SelectTrigger id="owner" className="border-input h-12 rounded-xl">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nina-patel">Nina Patel</SelectItem>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="sarah-miller">Sarah Miller</SelectItem>
                      <SelectItem value="michael-chen">Michael Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={onBack}
                className="px-6 h-11 rounded-xl border-border hover:bg-muted bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAutomation}
                disabled={isSubmitting || !automationData.automationName.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-11 rounded-xl shadow-lg font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    CREATE CUSTOM AUTOMATION
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
