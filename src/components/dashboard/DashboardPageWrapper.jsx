"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import DashboardLayout from "./DashboardLayout"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import AuthModal from "../../components/AuthModal"

const DashboardPageWrapper = ({ children, requiredUserType = null }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        
        // Check if user has required type
        if (requiredUserType && !checkUserPermissions(data.user, requiredUserType)) {
          setError("Access denied. You don't have permission to view this page.")
          return
        }
        
        setUser(data.user)
        setShowAuthModal(false)
      } else {
        setShowAuthModal(true)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setError("Failed to load page")
      setShowAuthModal(true)
    } finally {
      setLoading(false)
    }
  }

  const checkUserPermissions = (user, requiredType) => {
    if (requiredType === 'admin') {
      return user.isAdmin || user.userType === 'admin'
    }
    if (requiredType === 'designer') {
      return user.userType === 'designer' || user.isAdmin
    }
    if (requiredType === 'buyer') {
      return user.userType === 'buyer' || user.isAdmin
    }
    return true
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setShowAuthModal(false)
    setError("")
  }

  const handleAuthModalClose = () => {
    router.push("/")
  }

  // Prevent SSR issues by only running on client
  useEffect(() => {
    setIsMounted(true)
    checkAuth()
  }, [])

  // Don't render anything until mounted on client
  if (!isMounted) {
    return <LoadingSpinner />
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (showAuthModal) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h2>
            <p className="text-gray-600">Please log in to access this page</p>
          </div>
        </div>
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
            className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  )
}

export default DashboardPageWrapper
