"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Show login/register immediately — no auth check needed
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname?.startsWith(p + "/"))) {
    return <>{children}</>;
  }

  useEffect(() => {
    // Must match what login sets: localStorage.setItem("isAuthenticated", "true")
    const isAuthenticated =
      typeof window !== "undefined" &&
      localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      setAuthenticated(true);
    } else {
      router.replace("/login");
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
