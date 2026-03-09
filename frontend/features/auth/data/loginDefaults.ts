export const DEMO_CREDENTIALS = {
  email: "csr.nina@heropm.com",
  password: "Passw0rd!23",
} as const

export const SUPPORT_SUBJECT_OPTIONS = [
  { value: "login-issue", label: "Login Issue" },
  { value: "account-locked", label: "Account Locked" },
  { value: "2fa-problem", label: "2FA Problem" },
  { value: "password-reset", label: "Password Reset" },
  { value: "other", label: "Other" },
] as const
