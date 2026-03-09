"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertTriangle, Info, HelpCircle } from "lucide-react"
import type { LoginScreenProps } from "@/features/auth/types"
import { DEMO_CREDENTIALS, SUPPORT_SUBJECT_OPTIONS } from "@/features/auth/data/loginDefaults"

export function LoginPage({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.email)
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.password)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  const [showTOSModal, setShowTOSModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [supportSubject, setSupportSubject] = useState("")
  const [supportMessage, setSupportMessage] = useState("")

  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong">("medium")

  useEffect(() => {
    const strength = calculatePasswordStrength(password)
    setPasswordStrength(strength)
  }, [password])

  function calculatePasswordStrength(pwd: string): "weak" | "medium" | "strong" {
    if (pwd.length < 6) return "weak"
    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecial = /[!@#$%^&*]/.test(pwd)
    const count = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    if (count >= 3 && pwd.length >= 10) return "strong"
    if (count >= 2 && pwd.length >= 8) return "medium"
    return "weak"
  }

  function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage("")
    setSessionExpired(false)

    if (isLocked) {
      setErrorMessage("Account is locked due to too many failed attempts. Please contact support.")
      return
    }

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.")
      return
    }

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      onLogin()
    } else {
      setErrorMessage("Invalid credentials. Please try again.")
    }
  }

  function handlePasswordReset() {
    if (!resetEmail) {
      alert("Please enter your email address.")
      return
    }
    alert(`Password reset link sent to ${resetEmail}`)
    setShowResetModal(false)
    setResetEmail("")
  }

  function handleSupportSubmit() {
    if (!supportSubject || !supportMessage) {
      alert("Please fill in all fields.")
      return
    }
    alert(`Support ticket created: ${supportSubject}`)
    setShowSupportModal(false)
    setSupportSubject("")
    setSupportMessage("")
  }

  const strengthColor =
    passwordStrength === "strong" ? "bg-green-500" : passwordStrength === "medium" ? "bg-amber-500" : "bg-red-500"
  const strengthWidth = passwordStrength === "strong" ? "w-full" : passwordStrength === "medium" ? "w-2/3" : "w-1/3"

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md space-y-4">
        {sessionExpired && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Your session has expired. Please sign in again.</AlertDescription>
          </Alert>
        )}

        {isLocked && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Account locked due to multiple failed login attempts.{" "}
              <button onClick={() => setShowSupportModal(true)} className="underline">
                Contact support
              </button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-ftdWdBL2xxMoll1wrH8tjkwhd2XDOo.png" alt="HERO PM" className="h-16 w-auto mx-auto" />
            </div>
            <CardTitle className="text-2xl font-bold">HERO PM</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@heropm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span
                        className={`font-medium ${passwordStrength === "strong" ? "text-green-600" : passwordStrength === "medium" ? "text-amber-600" : "text-red-600"}`}
                      >
                        {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${strengthColor} ${strengthWidth} transition-all duration-300`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLocked}>
                Sign in
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">Demo credentials:</p>
                <p className="font-mono text-xs bg-muted p-2 rounded">{DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}</p>
              </div>
            </form>

            <div className="pt-4 border-t text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <button onClick={() => setShowTOSModal(true)} className="hover:underline">
                  Terms of Service
                </button>
                <span>•</span>
                <button onClick={() => setShowPrivacyModal(true)} className="hover:underline">
                  Privacy Policy
                </button>
                <span>•</span>
                <button onClick={() => setShowSupportModal(true)} className="hover:underline flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  Support
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 HERO PM. All rights reserved.</p>
        </div>
      </div>

      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Enter your email address and we'll send you a password reset link.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="your.email@heropm.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordReset}>Send Reset Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTOSModal} onOpenChange={setShowTOSModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert">
            <p>Last updated: January 2025</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing HERO PM, you agree to be bound by these Terms of Service...</p>
            <h3>2. User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials...</p>
            <h3>3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data...</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTOSModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert">
            <p>Last updated: January 2025</p>
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly, such as account details and property data...</p>
            <h3>2. How We Use Your Information</h3>
            <p>Your information is used to provide and improve our services...</p>
            <h3>3. Data Sharing</h3>
            <p>We do not sell your personal information to third parties...</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPrivacyModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSupportModal} onOpenChange={setShowSupportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>Having trouble signing in? We're here to help.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Select value={supportSubject} onValueChange={setSupportSubject}>
                <SelectTrigger id="support-subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
<SelectContent>
                {SUPPORT_SUBJECT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea
                id="support-message"
                placeholder="Describe your issue..."
                rows={4}
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>Average response time: 2-4 hours during business hours</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSupportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSupportSubmit}>Submit Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
