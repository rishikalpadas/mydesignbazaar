"use client"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import AuthModal from "../components/AuthModal"
import HeroSlider from "../components/HeroSlider"
import PricingSection from "../components/PricingSection"
import CategoriesSection from "../components/CategoriesSection"
import FeaturedDesigns from "../components/FeaturedDesigns"
import FeaturedDesigners from "../components/FeaturedDesigners"
import HowItWorks from "../components/HowItWorks"
import CTABanners from "../components/CTABanners"
import Testimonials from "../components/Testimonials"
import AppPromo from "../components/AppPromo"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false)
  }

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main>
      <Navbar onAuthClick={handleAuthClick} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <HeroSlider />
      <CategoriesSection />
      <FeaturedDesigns />
      <FeaturedDesigners />
      <HowItWorks />
      <PricingSection />
      <CTABanners />
      <Testimonials />
      <AppPromo />
      <Newsletter />
      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} onAuthSuccess={handleLoginSuccess} />
    </main>
  )
}
