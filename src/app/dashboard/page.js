"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import DesignerDashboard from "@/components/dashboard/DesignerDashboard"
import BuyerDashboard from "@/components/dashboard/BuyerDashboard"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setError("Failed to load dashboard")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const renderDashboard = () => {
    // Check if user is admin (based on email domain or specific admin emails)
    const adminEmails = ["admin@mydesignbazaar.com", "designer@mydesignbazaar.com", "buyer@mydesignbazaar.com"]

    const isAdmin = adminEmails.includes(user.email)

    if (isAdmin) {
      return <AdminDashboard user={user} />
    }

    switch (user.userType) {
      case "designer":
        return <DesignerDashboard user={user} />
      case "buyer":
        return <BuyerDashboard user={user} />
      default:
        return (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Invalid user type</p>
          </div>
        )
    }
  }

  return <DashboardLayout user={user}>{renderDashboard()}</DashboardLayout>
}

export default Dashboard
