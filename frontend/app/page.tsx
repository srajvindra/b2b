"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginPage } from "@/features/auth/components/loginPage"

export default function Page() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(storedAuth === "true")
  }, [])

  useEffect(() => {
    if (isAuthenticated === true) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true")
    setIsAuthenticated(true)
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  router.push("/login")
}
