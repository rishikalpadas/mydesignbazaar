"use client";
import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

const Navbar = ({ onAuthClick, isAuthenticated = false, user = null }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const mobileSearchRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen && mobileSearchRef.current) {
      setTimeout(() => {
        mobileSearchRef.current.focus();
      }, 100);
    }
  }, [mobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      setUserDropdownOpen(!userDropdownOpen);
    } else {
      onAuthClick(); // This will open the auth modal/page
    }
  };

  const categories = [
    "Kidswear",
    "Menswear",
    "Womenswear",
    "Typography",
    "Floral",
    "AI-Generated",
  ];

  const UserDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
        <p className="text-xs text-gray-500">{user?.email || 'user@email.com'}</p>
      </div>
      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
        <User className="w-4 h-4 mr-2" />
        My Profile
      </button>
      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
        <Package className="w-4 h-4 mr-2" />
        My Orders
      </button>
      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </button>
      <hr className="my-1" />
      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>
  );

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
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
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center: Enhanced Search */}
          <div className="flex-1 max-w-2xl mx-6 hidden lg:block">
            <div
              className={`relative transition-all duration-300 ${
                searchFocused ? "transform scale-105" : ""
              }`}
            >
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
            <button
              onClick={toggleMenu}
              className="lg:hidden text-gray-700 hover:text-amber-500 transition-colors p-2"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <button className="hidden sm:flex text-gray-700 hover:text-amber-500 transition-colors p-2 relative">
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                3
              </span>
            </button>

            {/* User account - Updated with dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={handleUserClick}
                className="text-gray-700 hover:text-amber-500 transition-colors p-2 flex items-center gap-1"
              >
                <User size={20} />
                <ChevronDown size={14} className="hidden sm:block" />
              </button>
              {isAuthenticated && userDropdownOpen && <UserDropdown />}
            </div>

            {/* Shopping cart */}
            <button className="relative text-gray-700 hover:text-amber-500 transition-colors p-2 group">
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
                  <button className="text-gray-700 hover:text-amber-500 font-medium text-sm transition-colors duration-200 py-2 px-3 rounded-md hover:bg-amber-50">
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
                  <button className="w-full text-left px-3 py-3 text-gray-700 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors duration-200 font-medium text-sm">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile account actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-around">
              <button 
                onClick={handleUserClick}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors"
              >
                <User size={20} />
                <span className="text-xs font-medium">
                  {isAuthenticated ? 'Account' : 'Login'}
                </span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors relative">
                <Heart size={20} />
                <span className="text-xs font-medium">Wishlist</span>
                <span className="absolute -top-1 -right-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors relative">
                <ShoppingCart size={20} />
                <span className="text-xs font-medium">Cart</span>
                <span className="absolute -top-1 -right-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;