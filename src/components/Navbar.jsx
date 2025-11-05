"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  Heart,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
  UserCircle,
} from "lucide-react"
import { getSlugFromCategory } from "../lib/category-map"
import NoContextMenu from "../components/NoContextMenu"
import AuthModal from "../components/AuthModal"

const Navbar = ({ onAuthClick: externalOnAuthClick, isAuthenticated: externalIsAuthenticated, user: externalUser, onLogout: externalOnLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [internalAuthModalOpen, setInternalAuthModalOpen] = useState(false)
  const [internalIsAuthenticated, setInternalIsAuthenticated] = useState(false)
  const [internalUser, setInternalUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const router = useRouter()

  const mobileSearchRef = useRef(null)
  const userDropdownRef = useRef(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Determine if we should use external auth (when callback is provided)
  const hasExternalAuth = externalOnAuthClick !== undefined

  // Use external props if provided, otherwise use internal state
  const isAuthenticated = hasExternalAuth ? externalIsAuthenticated : internalIsAuthenticated
  const user = hasExternalAuth ? externalUser : internalUser

  // Fetch auth state if not provided via props
  useEffect(() => {
    if (!hasExternalAuth && !authChecked) {
      checkAuthStatus()
    }
  }, [hasExternalAuth, authChecked])

  // Fetch subscription status when user changes (for both internal and external auth)
  useEffect(() => {
    if (user?.userType === 'buyer') {
      fetchSubscriptionStatus()
    }
  }, [user])

  // Fetch cart and wishlist counts when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount()
      fetchWishlistCount()
    } else {
      setCartCount(0)
      setWishlistCount(0)
    }
  }, [isAuthenticated])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setInternalIsAuthenticated(true)
        setInternalUser(data.user)

        // If user is a buyer, fetch subscription status
        if (data.user.userType === 'buyer') {
          fetchSubscriptionStatus()
        }
      } else {
        setInternalIsAuthenticated(false)
        setInternalUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setInternalIsAuthenticated(false)
      setInternalUser(null)
    } finally {
      setAuthChecked(true)
    }
  }

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription/status", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Navbar - Subscription data fetched:", data)
        setSubscription(data)
      } else {
        console.error("Failed to fetch subscription, status:", response.status)
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    }
  }

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.count || 0)
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error)
    }
  }

  const fetchWishlistCount = async () => {
    try {
      const response = await fetch("/api/wishlist/count", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setWishlistCount(data.count || 0)
      }
    } catch (error) {
      console.error("Failed to fetch wishlist count:", error)
    }
  }

  const handleAuthClick = () => {
    if (externalOnAuthClick) {
      externalOnAuthClick()
    } else {
      setInternalAuthModalOpen(true)
    }
  }

  const handleLogout = async () => {
    if (externalOnLogout) {
      await externalOnLogout()
    } else {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        })
        setInternalIsAuthenticated(false)
        setInternalUser(null)
        router.push("/")
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
  }

  const handleAuthSuccess = () => {
    setInternalAuthModalOpen(false)
    checkAuthStatus()
  }

  useEffect(() => {
    if (mobileMenuOpen && mobileSearchRef.current) {
      setTimeout(() => {
        mobileSearchRef.current.focus()
      }, 100)
    }
  }, [mobileMenuOpen])

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

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleUserClick = () => {
    if (isAuthenticated) {
      setUserDropdownOpen(!userDropdownOpen)
    } else {
      handleAuthClick()
    }
  }

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      router.push("/wishlist")
    } else {
      handleAuthClick()
    }
  }

  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart")
    } else {
      handleAuthClick()
    }
  }

  const handleDashboardClick = () => {
    setUserDropdownOpen(false)
    router.push("/dashboard")
  }

  const handleLogoutClick = async () => {
    setUserDropdownOpen(false)
    await handleLogout()
  }

  const getUserDisplayName = () => {
    if (!user) return "User"
    return user.profile?.fullName || user.name || user.email?.split("@")[0] || "User"
  }

  const getUserRole = () => {
    if (!user) return ""
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

  const categories = ["Infantwear", "Kidswear", "Menswear", "Womenswear", "Typography", "Floral", "AI-Generated"]

  const titleToSlug = (title) => getSlugFromCategory(title)

  const UserDropdown = () => {
    console.log("Rendering UserDropdown - user.userType:", user?.userType, "subscription:", subscription)
    return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=f97316&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full ring-2 ring-orange-200"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
            <p className="text-xs text-orange-600">{getUserRole()}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={handleDashboardClick}
          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-3 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-3 transition-colors">
          <UserCircle className="w-4 h-4" />
          My Profile
        </button>

        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-3 transition-colors">
          <Package className="w-4 h-4" />
          {user?.userType === "designer" ? "My Designs" : "My Orders"}
        </button>

        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center gap-3 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Credits Display (Buyers Only) */}
      {user?.userType === 'buyer' && subscription && (
        <div className="border-t border-gray-100 py-2">
          {subscription.isValid ? (
            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 mx-2 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-700 font-medium">Available Credits</p>
                  <p className="text-lg font-bold text-green-900">{subscription.subscription?.creditsRemaining || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">{subscription.subscription?.planName}</p>
                  <p className="text-xs text-green-700">{subscription.subscription?.daysRemaining} days left</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 mx-2 rounded-lg border border-orange-200">
              <div className="text-center">
                <p className="text-xs text-orange-700 font-medium mb-1">No Active Subscription</p>
                <a
                  href="/pricing"
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline"
                >
                  View Plans →
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout */}
      <div className="border-t border-gray-100 pt-2">
        <button
          onClick={handleLogoutClick}
          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
    )
  }

  return (
    <>
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Mount no-context-menu listener once via navbar (client component) */}
      <NoContextMenu />
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-medium">
        Made in India, Loved Worldwide
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main navbar */}
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="lg:hidden text-gray-700 hover:text-amber-500 transition-colors p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Go to homepage"
              >
                <div className="relative">
                  <img
                    src="/logo.png"
                    alt="MyDesignBazaar Logo"
                    className="h-14 w-auto sm:h-16 lg:h-14 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Center: Enhanced Search */}
          <div className="flex-1 max-w-2xl mx-6 hidden lg:block">
            <div className={`relative transition-all duration-300 ${searchFocused ? "transform scale-105" : ""}`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search from thousands of unique Indian designs..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Pricing Button - Desktop */}
            <button
              onClick={() => router.push('/pricing')}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Package size={16} />
              <span>View Plans</span>
            </button>

            {/* Search icon for mobile */}
            <button onClick={toggleMenu} className="lg:hidden text-gray-700 hover:text-amber-500 transition-colors p-2">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="hidden sm:flex text-gray-700 hover:text-amber-500 transition-colors p-2 relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>

            {/* User account with dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={handleUserClick}
                className={`text-gray-700 hover:text-amber-500 transition-colors p-2 flex items-center gap-1 rounded-lg ${
                  isAuthenticated ? "hover:bg-orange-50" : ""
                }`}
              >
                <User size={20} />
                <ChevronDown size={14} className="hidden sm:block" />
              </button>
              {isAuthenticated && userDropdownOpen && <UserDropdown />}
            </div>

            {/* Shopping cart */}
            <button
              onClick={handleCartClick}
              className="relative text-gray-700 hover:text-amber-500 transition-colors p-2 group"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium group-hover:scale-110 transition-transform">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Categories Navigation */}
        <nav className="hidden lg:block border-t border-gray-100 bg-gray-50/50">
          <div className="px-6 py-3">
            <ul className="flex items-center justify-center gap-8">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      const slug = titleToSlug(category)
                      if (slug) router.push(`/category/${slug}`)
                    }}
                    className="text-gray-700 hover:text-amber-500 font-medium text-sm transition-colors duration-200 py-2 px-3 rounded-md hover:bg-amber-50 cursor-pointer"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          {/* Mobile search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Search from thousands of unique Indian designs..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile categories */}
          <div className="p-4">
            <ul className="space-y-1">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      const slug = titleToSlug(category)
                      if (slug) {
                        router.push(`/category/${slug}`)
                        setMobileMenuOpen(false)
                      }
                    }}
                    className="w-full text-left px-3 py-3 text-gray-700 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile account actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getUserDisplayName())}&background=f97316&color=fff`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full ring-2 ring-orange-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-orange-600">{getUserRole()}</p>
                  </div>
                </div>
                <button
                  onClick={handleDashboardClick}
                  className="w-full text-left p-3 text-gray-700 hover:bg-white rounded-lg transition-colors flex items-center gap-3"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-around">
                <button
                  onClick={handleUserClick}
                  className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors"
                >
                  <User size={20} />
                  <span className="text-xs font-medium">Login</span>
                </button>
                <button
                  onClick={handleWishlistClick}
                  className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors relative"
                >
                  <div className="relative">
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">Wishlist</span>
                </button>
                <button
                  onClick={handleCartClick}
                  className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors relative"
                >
                  <div className="relative">
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    {/* Internal Auth Modal - only shown when not using external auth */}
    {!hasExternalAuth && internalAuthModalOpen && (
      <AuthModal
        isOpen={internalAuthModalOpen}
        onClose={() => setInternalAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    )}
  </>
  )
}

export default Navbar
