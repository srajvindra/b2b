export type Lead = {
  id: number
  name: string
  userType: string
  property: string
  stage: string
  assignedTo: string
  phone: string
  email: string
  secondaryPhone?: string
  secondaryEmail?: string
  createdAt: string
  unitDetails: string
  numberOfUnits: number
  lastCallStatus: string
  nextFollowUp: string
  ownerType?: string // Owner type 1, 2, 3, or 4
  prospectType?: string // Prospect type 1, 2, 3, or 4
  completedSteps?: number // Number representing which step is completed (1-4)
  category?: string // Category for owner leads
  emailsSent?: number // Number of emails sent
  deals?: number // Number of deals
  nextAction?: string // Next action to take
  source?: string // Lead source
  lastTouch?: string // Last touch date
  interestedUnits?: { address: string; unit: string }[] // Unit addresses for lease prospects
}

