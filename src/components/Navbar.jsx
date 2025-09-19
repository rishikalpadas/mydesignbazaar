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

const Navbar = ({ onAuthClick, isAuthenticated = false, user = null, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const router = useRouter()

  const mobileSearchRef = useRef(null)
  const userDropdownRef = useRef(null)

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
      onAuthClick()
    }
  }

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      router.push("/wishlist")
    } else {
      onAuthClick()
    }
  }

  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart")
    } else {
      onAuthClick()
    }
  }

  const handleDashboardClick = () => {
    setUserDropdownOpen(false)
    router.push("/dashboard")
  }

  const handleLogoutClick = async () => {
    setUserDropdownOpen(false)
    await onLogout()
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

  const UserDropdown = () => (
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

  return (
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
              <div className="flex items-center gap-3">
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
              </div>
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
            {/* Search icon for mobile */}
            <button onClick={toggleMenu} className="lg:hidden text-gray-700 hover:text-amber-500 transition-colors p-2">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="hidden sm:flex text-gray-700 hover:text-amber-500 transition-colors p-2 relative"
            >
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                3
              </span>
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
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium group-hover:scale-110 transition-transform">
                2
              </span>
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
                  <Heart size={20} />
                  <span className="text-xs font-medium">Wishlist</span>
                  {/* <span className="absolute -top-1 -right-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span> */}
                </button>
                <button
                  onClick={handleCartClick}
                  className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  <span className="text-xs font-medium">Cart</span>
                  {/* <span className="absolute -top-1 -right-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span> */}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
