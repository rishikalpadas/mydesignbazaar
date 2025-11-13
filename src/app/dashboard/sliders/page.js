"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"

const SlidersRedirectContent = () => {
  const router = useRouter()

  useEffect(() => {
    // Redirect to hero-sliders page
    router.push("/dashboard/hero-sliders")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Redirecting to sliders management...</p>
      </div>
    </div>
  )
}

const SlidersPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <SlidersRedirectContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default SlidersPage
