"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuth } from "@/hooks/useAuth"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
