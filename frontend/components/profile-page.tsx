"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  User,
  Lock,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Shield,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfileSettingsPage() {
  const { toast } = useToast()

  const [businessInfo, setBusinessInfo] = useState({
    companyName: "HERO PM",
    companyEmail: "contact@heropm.com",
    companyPhone: "(555) 123-4567",
    address: "123 Business Ave, Suite 100",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    website: "www.heropm.com",
    description: "Professional property management services for residential and commercial properties.",
  })

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Nina",
    lastName: "Patel",
    email: "csr.nina@heropm.com",
    phone: "(555) 987-6543",
    title: "Super Admin",
    department: "Administration",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [activeTab, setActiveTab] = useState("business")

  const handleSaveBusinessInfo = () => {
    toast({
      title: "Business Information Updated",
      description: "Your business information has been saved successfully.",
    })
  }

  const handleSavePersonalInfo = () => {
    toast({
      title: "Personal Information Updated",
      description: "Your personal information has been saved successfully.",
    })
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    })
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const getPasswordStrength = () => {
    const password = passwordData.newPassword
    if (!password) return null

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[!@#$%^&*]/.test(password)) strength++

    if (strength <= 1) return { label: "Weak", color: "text-red-500" }
    if (strength <= 2) return { label: "Medium", color: "text-amber-500" }
    return { label: "Strong", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  const hasMinLength = passwordData.newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(passwordData.newPassword)
  const hasNumber = /[0-9]/.test(passwordData.newPassword)
  const hasSpecial = /[!@#$%^&*]/.test(passwordData.newPassword)
  const passwordsMatch =
    passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword !== ""

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and business settings</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-teal-100">
            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg font-semibold">NP</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="font-semibold">Nina Patel</p>
            <Badge variant="outline" className="text-xs">
              Super Admin
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                Business Information
              </CardTitle>
              <CardDescription>Update your company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-xl bg-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                    HP
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold">Company Logo</h3>
                  <p className="text-sm text-muted-foreground">Upload a logo for your business</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Change Logo
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={businessInfo.companyName}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Company Email
                    </Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={businessInfo.companyEmail}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, companyEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Company Phone
                    </Label>
                    <Input
                      id="companyPhone"
                      value={businessInfo.companyPhone}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, companyPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                  />
                </div>

                <Separator />

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Business Address
                  </Label>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={businessInfo.address}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={businessInfo.city}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={businessInfo.state}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={businessInfo.zipCode}
                          onChange={(e) => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={businessInfo.description}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveBusinessInfo} className="bg-teal-600 hover:bg-teal-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Business Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-lg font-semibold">NP</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">Upload a photo for your profile</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={personalInfo.department}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, department: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePersonalInfo} className="bg-teal-600 hover:bg-teal-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Personal Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-teal-600" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Password Form - Left Column */}
                <div className="lg:col-span-3 space-y-5">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter your current password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter your new password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {/* Password Strength Indicator */}
                    {passwordData.newPassword && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Password Strength</span>
                          {passwordStrength && (
                            <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              passwordData.newPassword.length > 0
                                ? passwordStrength?.label === "Weak"
                                  ? "bg-red-500"
                                  : passwordStrength?.label === "Medium"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                : "bg-muted"
                            }`}
                          ></div>
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              passwordStrength?.label === "Medium" || passwordStrength?.label === "Strong"
                                ? passwordStrength?.label === "Medium"
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                                : "bg-muted"
                            }`}
                          ></div>
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              passwordStrength?.label === "Strong" ? "bg-green-500" : "bg-muted"
                            }`}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm your new password"
                        className={`pr-10 ${
                          passwordData.confirmPassword
                            ? passwordsMatch
                              ? "border-green-500 focus-visible:ring-green-500"
                              : "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordData.confirmPassword && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {passwordsMatch ? (
                          <React.Fragment>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Passwords match</span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-xs text-red-600 font-medium">Passwords do not match</span>
                          </React.Fragment>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Update Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleChangePassword}
                      className="bg-teal-700 hover:bg-teal-800 text-white w-full sm:w-auto"
                      disabled={
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword ||
                        !passwordsMatch
                      }
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Password Requirements - Right Column */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 sticky top-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-teal-600" />
                      </div>
                      <h4 className="font-semibold text-sm">Password Requirements</h4>
                    </div>
                    <ul className="space-y-3">
                      <li
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          hasMinLength ? "bg-green-50 dark:bg-green-900/20" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            hasMinLength ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        >
                          {hasMinLength ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs text-slate-500">1</span>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            hasMinLength ? "text-green-700 dark:text-green-400 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          At least 8 characters
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          hasUppercase ? "bg-green-50 dark:bg-green-900/20" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            hasUppercase ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        >
                          {hasUppercase ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs text-slate-500">2</span>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            hasUppercase ? "text-green-700 dark:text-green-400 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          One uppercase letter
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          hasNumber ? "bg-green-50 dark:bg-green-900/20" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            hasNumber ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        >
                          {hasNumber ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs text-slate-500">3</span>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            hasNumber ? "text-green-700 dark:text-green-400 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          One number
                        </span>
                      </li>
                      <li
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          hasSpecial ? "bg-green-50 dark:bg-green-900/20" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${
                            hasSpecial ? "bg-green-500 text-white" : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        >
                          {hasSpecial ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs text-slate-500">4</span>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            hasSpecial ? "text-green-700 dark:text-green-400 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {"One special character (!@#$%^&*)"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
