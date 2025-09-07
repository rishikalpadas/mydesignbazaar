"use client"
import {
  UserPlus,
  Upload,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import AuthModal from "./AuthModal"
import { useRouter } from "next/navigation"
import Link from "next/link"

const steps = [
  {
    id: 1,
    title: "Sign Up & Get Started",
    description:
      "Create your account as a Designer or Buyer in under 2 minutes. Complete profile setup with portfolio showcase.",
    icon: <UserPlus className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    features: ["Quick registration", "Profile verification", "Portfolio setup"],
    time: "2 mins",
  },
  {
    id: 2,
    title: "Explore & Upload Designs",
    description:
      "Browse 10,000+ premium designs or upload your original artwork. Build your creative portfolio and reach buyers.",
    icon: <Upload className="w-8 h-8" />,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    features: ["Browse premium designs", "Upload artwork", "Build portfolio"],
    time: "5 mins",
  },
  {
    id: 3,
    title: "Buy or Start Earning",
    description:
      "Purchase designs instantly with secure payments or start earning ₹500-₹15,000 per design with every approved sale.",
    icon: <ShoppingCart className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    features: ["Instant purchases", "Secure payments", "Earn ₹500-₹15K"],
    time: "Instant",
  },
  {
    id: 4,
    title: "Secure & Protected",
    description:
      "All transactions are encrypted and safe. Retain full rights to your designs with protected licensing agreements.",
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    features: ["Encrypted transactions", "Rights protection", "Licensed designs"],
    time: "Always",
  },
]

const stats = [
  {
    label: "Active Designers",
    value: "2,500+",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Designs Sold",
    value: "50K+",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    label: "Happy Buyers",
    value: "10K+",
    icon: <CheckCircle className="w-5 h-5" />,
  },
]

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null)
  const { user } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showRolePrompt, setShowRolePrompt] = useState(false)

  const handleStartAsDesigner = () => {
    console.log("[v0] Button clicked, user:", user) // Added debug logging
    if (!user) {
      console.log("[v0] No user, opening auth modal")
      setShowAuthModal(true)
    } else if (user.userType === "designer") {
      console.log("[v0] User is designer, redirecting to dashboard")
      router.push("/dashboard")
    } else if (user.userType === "buyer") {
      console.log("[v0] User is buyer, showing role prompt")
      setShowRolePrompt(true)
    } else {
      console.log("[v0] Unknown user type:", user.userType)
    }
  }

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            How It
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Join India's fastest-growing design marketplace in 4 simple steps. Start buying or selling premium designs
            today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-300 rounded-full transform -translate-y-1/2 translate-x-1"></div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-4 text-white">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-12 md:mb-16 p-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative group cursor-pointer transition-all duration-500 ${
                activeStep === step.id ? "scale-105" : "hover:scale-102"
              }`}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {index < steps.length - 1 && (
                <div className="hidden xl:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                  <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-300 rounded-full transform -translate-y-1/2 translate-x-1"></div>
                </div>
              )}

              <div
                className={`relative bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-2xl border-2 transition-all duration-500 ${
                  activeStep === step.id ? "border-indigo-200 shadow-2xl" : "border-gray-100 hover:border-indigo-100"
                }`}
              >
                <div
                  className={`absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 ${
                    activeStep === step.id ? "scale-110" : "group-hover:scale-105"
                  } bg-gradient-to-r ${step.color}`}
                >
                  {step.id}
                </div>

                <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs px-2 md:px-3 py-1 rounded-full font-medium">
                  {step.time}
                </div>

                <div
                  className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl mb-4 md:mb-6 transition-all duration-300 bg-gradient-to-r ${
                    step.color
                  } ${activeStep === step.id ? "scale-110" : "group-hover:scale-105"}`}
                >
                  <div className="text-white">{step.icon}</div>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-indigo-600 transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6">{step.description}</p>

                <div className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-6 flex items-center text-indigo-600 font-medium transition-all duration-300 ${
                    activeStep === step.id
                      ? "opacity-100 translate-x-2"
                      : "opacity-0 group-hover:opacity-100 group-hover:translate-x-2"
                  }`}
                >
                  <span className="text-sm">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-gray-100 mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Complete Process Timeline</h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col md:flex-row items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-r ${step.color} shadow-lg`}
                >
                  {step.id}
                </div>

                <div className="text-center md:text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500">{step.time}</p>
                </div>

                {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-indigo-100 mb-6 md:mb-8 text-base md:text-lg">
              Join thousands of designers and buyers already using our platform
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleStartAsDesigner}
                className="bg-white text-indigo-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Start as Designer
              </button>
             <Link href="/categories"> 
              <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl border-2 border-indigo-400">
                Browse Designs
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(userData) => {
          console.log("[v0] Auth success, user data:", userData) // Added debug logging
          setShowAuthModal(false)
          if (userData && userData.userType === "designer") {
            router.push("/dashboard")
          } else {
            // If not a designer, just close modal and let them try again
            console.log("[v0] User is not a designer, staying on page")
          }
        }}
      />

      {showRolePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRolePrompt(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Switch Account Type</h3>
            <p className="text-gray-600 mb-6">
              You're currently logged in as a buyer. To start as a designer, please sign out and create a new designer
              account or log in with your designer credentials.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRolePrompt(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {/* <button
                onClick={() => {
                  setShowRolePrompt(false)
                  setShowAuthModal(true)
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Designer Account
              </button> */}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HowItWorks
