"use client"
import { LoginPage } from "@/features/auth/components/loginPage";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter()
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true")
    router.push("/dashboard")
  }
  return <LoginPage onLogin={handleLogin} />
}
