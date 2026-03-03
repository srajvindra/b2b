"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const AUTH_KEY = "isAuthenticated"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    const isAuthenticated = typeof window !== "undefined" && localStorage.getItem(AUTH_KEY) === "true"
    setStatus(isAuthenticated ? "authenticated" : "unauthenticated")
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/")
    }
  }, [status, router])

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
