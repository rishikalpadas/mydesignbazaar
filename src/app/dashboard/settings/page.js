"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"
import DesignerSettingsContent from "./designer-settings"
import AdminSettingsContent from "./admin-settings"

const SettingsPage = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser)
  const [loading, setLoading] = useState(!initialUser)
  const router = useRouter()

  useEffect(() => {
    // If user was not passed as prop, fetch it
    if (!initialUser) {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/user/profile', {
            credentials: 'include',
          })
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          router.push('/dashboard')
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    }
  }, [initialUser, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  // Check if user is admin
  if (user?.isAdmin && user?.role === 'super_admin') {
    return <AdminSettingsContent />
  }

  // Render designer/buyer settings for non-admin users
  return <DesignerSettingsContent />
}

const SettingsPageWrapper = () => {
  return (
    <DashboardPageWrapper requiredUserType="any">
      {({ user }) => <SettingsPage user={user} />}
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default SettingsPageWrapper
