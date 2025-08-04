"use client";
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import HeroSlider from "@/components/HeroSlider";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedDesigns from "@/components/FeaturedDesigns";
import FeaturedDesigners from "@/components/FeaturedDesigners";
import HowItWorks from "@/components/HowItWorks";
import CTABanners from "@/components/CTABanners";
import Testimonials from "@/components/Testimonials";
import AppPromo from "@/components/AppPromo";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            setIsAuthenticated(true);
            setUser(parsedUserData);
          } catch (error) {
            console.error('Error parsing user data:', error);
            // Clear invalid data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    // Handle successful login/signup
    setIsAuthenticated(true);
    setUser(userData);
    setIsAuthModalOpen(false);
    
    // Store auth data in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    // Optional: Show success message
    console.log('Authentication successful:', userData);
  };

  const handleLogout = () => {
    // Handle logout
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear auth data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }

    // Optional: Show logout message
    console.log('User logged out');
  };

  return (
    <main>
      <Navbar 
        onAuthClick={handleAuthClick}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <HeroSlider />
      <CategoriesSection />
      <FeaturedDesigns />
      <FeaturedDesigners />
      <HowItWorks />
      <CTABanners />
      <Testimonials />
      <AppPromo />
      <Newsletter />
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose}
        onAuthSuccess={handleLoginSuccess}
      />
    </main>
  );
}