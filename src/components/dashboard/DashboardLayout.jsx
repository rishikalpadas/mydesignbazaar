"use client"
import { useState, useEffect, useRef } from "react"
import { Menu, Bell, Search, ChevronDown, User, Settings, Package, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Sidebar from "./Sidebar"

const DashboardLayout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const router = useRouter()
  const userDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserRole = () => {
    if (user.isAdmin) {
      switch (user.role) {
        case "super_admin":
          return "Super Admin"
        case "designer_admin":
          return "Designer Admin"
        case "buyer_admin":
          return "Buyer Admin"
        default:
          return "Admin"
      }
    }

    return user.userType === "designer" ? "Designer" : "Buyer"
  }

  const UserDropdown = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 backdrop-blur-sm bg-white/95">
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 mx-2 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile?.fullName || user.name || user.email)}&background=f97316&color=fff`}
            alt="Profile"
            className="h-10 w-10 rounded-full ring-2 ring-orange-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.profile?.fullName || user.name || user.email}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
              {getUserRole()}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 flex items-center transition-all duration-200 group">
          <User className="w-4 h-4 mr-3 group-hover:text-orange-600" />
          <span className="font-medium">My Profile</span>
        </button>

        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 flex items-center transition-all duration-200 group">
          <Package className="w-4 h-4 mr-3 group-hover:text-orange-600" />
          <span className="font-medium">My Orders</span>
        </button>

        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700 flex items-center transition-all duration-200 group">
          <Settings className="w-4 h-4 mr-3 group-hover:text-orange-600" />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 pt-2 mt-2">
        <button
          onClick={() => {
            setUserDropdownOpen(false)
            handleLogout()
          }}
          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>

                <div className="hidden lg:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {getUserRole()} Dashboard
                  </h1>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-orange-500 relative bg-white/80 backdrop-blur-sm rounded-xl hover:bg-orange-50 transition-colors">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors"
                  >
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.profile?.fullName || user.name || user.email}
                      </p>
                      <p className="text-xs text-orange-600">{getUserRole()}</p>
                    </div>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile?.fullName || user.name || user.email)}&background=f97316&color=fff`}
                      alt="Profile"
                      className="h-8 w-8 rounded-full ring-2 ring-orange-200"
                    />
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {userDropdownOpen && <UserDropdown />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout