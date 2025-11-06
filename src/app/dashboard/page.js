"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import AdminDashboard from "../../components/dashboard/AdminDashboard"
import DesignerDashboard from "../../components/dashboard/DesignerDashboard"
import BuyerDashboard from "../../components/dashboard/BuyerDashboard"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import AuthModal from "../../components/AuthModal"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setShowAuthModal(false)
      } else {
        // User is not authenticated, show auth modal instead of redirecting
        setShowAuthModal(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setError("Failed to load dashboard")
      setShowAuthModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    setError("")
  }

  const handleAuthModalClose = () => {
    // If user closes modal without logging in, redirect to home
    router.push("/")
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  // Show auth modal if user is not authenticated
  if (showAuthModal) {
    return (
      <>
        {/* Background */}
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
            <p className="text-gray-600">Please log in to access your dashboard</p>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={true} onClose={handleAuthModalClose} onAuthSuccess={handleAuthSuccess} />
      </>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // This shouldn't happen now, but just in case
  }

  const renderDashboard = () => {
    // Check if user is admin
    if (user.isAdmin || user.userType === "admin") {
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

// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default Dashboard
