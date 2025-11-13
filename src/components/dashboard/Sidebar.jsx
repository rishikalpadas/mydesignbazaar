"use client"
import { useRouter, usePathname } from "next/navigation"
import {
  X,
  Home,
  User,
  Settings,
  LogOut,
  Upload,
  ShoppingBag,
  BarChart3,
  Users,
  Palette,
  CreditCard,
  FileText,
  Package,
  TrendingUp,
  Heart,
  Download,
  Image as ImageIcon,
  Layers,
} from "lucide-react"

const Sidebar = ({ user, isOpen, onClose }) => {
  const router = useRouter()
  const pathname = usePathname()

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
      return "admin"
    }
    return user.userType
  }

  const getNavigationItems = () => {
    const role = getUserRole()

    const commonItems = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ]

    switch (role) {
      case "admin":
        return [
          ...commonItems,
          { name: "Users Management", href: "/dashboard/users", icon: Users },
          { name: "Designers", href: "/dashboard/designers", icon: Palette },
          { name: "Pending Designers", href: "/dashboard/designers/pending", icon: User },
          { name: "Buyers", href: "/dashboard/buyers", icon: ShoppingBag },
          { name: "Designs", href: "/dashboard/designs", icon: FileText },
          { name: "Pending Designs", href: "/dashboard/designs/pending", icon: FileText },
          { name: "Orders", href: "/dashboard/orders", icon: Package },
          { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
          { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
          { name: "Hero Sliders", href: "/dashboard/hero-sliders", icon: Layers },
          { name: "Add Slider", href: "/dashboard/slider-addition", icon: ImageIcon },
          { name: "System Settings", href: "/dashboard/settings", icon: Settings },
        ]

      case "designer":
        return [
          ...commonItems,
          { name: "My Designs", href: "/dashboard/my-designs", icon: Palette },
          { name: "Upload Design", href: "/dashboard/upload", icon: Upload },
          { name: "Sales", href: "/dashboard/sales", icon: TrendingUp },
          { name: "Earnings", href: "/dashboard/earnings", icon: CreditCard },
          { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
          { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ]

      case "buyer":
        return [
          ...commonItems,
          { name: "Browse Designs", href: "/dashboard/browse", icon: Palette },
          { name: "My Purchases", href: "/dashboard/purchases", icon: ShoppingBag },
          { name: "Downloads", href: "/dashboard/downloads", icon: Download },
          { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
          { name: "Order History", href: "/dashboard/orders", icon: Package },
          { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
          { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ]

      default:
        return commonItems
    }
  }

  const navigationItems = getNavigationItems()

  const getDisplayName = () => {
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

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white/90 backdrop-blur-sm border-r border-orange-100 shadow-lg">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-orange-100 bg-gradient-to-r">
            <button
              onClick={() => router.push('/')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Go to homepage"
            >
              <img src="/logo.png" alt="MyDesignBazaar" className="h-8 w-auto" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 space-y-1 px-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500"
                      }`}
                    />
                    {item.name}
                  </button>
                )
              })}
            </nav>

            {/* User info and logout */}
            <div className="flex-shrink-0 border-t border-orange-100 p-4">
              <div className="flex items-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile?.fullName || user.name || user.email)}&background=f97316&color=fff`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full ring-2 ring-orange-200"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.profile?.fullName || user.name || user.email}
                  </p>
                  <p className="text-xs text-orange-600">{getDisplayName()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white/95 backdrop-blur-sm border-r border-orange-100 shadow-xl">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-orange-100 bg-gradient-to-r from-orange-500 to-amber-500">
            <button
              onClick={() => {
                router.push('/')
                onClose()
              }}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Go to homepage"
            >
              <img src="/logo.png" alt="MyDesignBazaar" className="h-8 w-auto" />
            </button>
            <button onClick={onClose} className="p-2 rounded-md text-white hover:bg-white/20 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 space-y-1 px-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href)
                      onClose()
                    }}
                    className={`group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-700"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500"
                      }`}
                    />
                    {item.name}
                  </button>
                )
              })}
            </nav>

            {/* User info and logout */}
            <div className="flex-shrink-0 border-t border-orange-100 p-4">
              <div className="flex items-center bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile?.fullName || user.name || user.email)}&background=f97316&color=fff`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full ring-2 ring-orange-200"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.profile?.fullName || user.name || user.email}
                  </p>
                  <p className="text-xs text-orange-600">{getDisplayName()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
