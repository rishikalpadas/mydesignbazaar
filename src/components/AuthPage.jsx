"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Building,
  CreditCard,
  Check,
  ArrowLeft,
  Palette,
  ShoppingBag,
  FileText,
  Loader2,
  Upload,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react"

// Validation helper functions (defined outside component for better performance)
const formatEmail = (value) => {
  return value.toLowerCase().trim()
}

const formatPAN = (value) => {
  // PAN format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)
  let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, "")

  if (formatted.length > 10) {
    formatted = formatted.slice(0, 10)
  }

  // Ensure first 5 are letters
  if (formatted.length <= 5) {
    formatted = formatted.replace(/[^A-Z]/g, "")
  } else if (formatted.length <= 9) {
    // Next 4 should be digits
    const letters = formatted.slice(0, 5).replace(/[^A-Z]/g, "")
    const digits = formatted.slice(5, 9).replace(/[^0-9]/g, "")
    formatted = letters + digits
  } else {
    // Last one should be a letter
    const letters = formatted.slice(0, 5).replace(/[^A-Z]/g, "")
    const digits = formatted.slice(5, 9).replace(/[^0-9]/g, "")
    const lastLetter = formatted.slice(9, 10).replace(/[^A-Z]/g, "")
    formatted = letters + digits + lastLetter
  }

  return formatted
}

const formatGST = (value) => {
  // GST format: 2 digits + 10 char PAN + 1 digit + Z + 1 digit (15 chars total)
  let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, "")

  if (formatted.length > 15) {
    formatted = formatted.slice(0, 15)
  }

  // First 2 must be digits (state code)
  if (formatted.length <= 2) {
    formatted = formatted.replace(/[^0-9]/g, "")
  } else if (formatted.length <= 12) {
    // Next 10 are PAN (5 letters + 4 digits + 1 letter)
    const stateCode = formatted.slice(0, 2).replace(/[^0-9]/g, "")
    let pan = formatted.slice(2, 12)

    // Format PAN part
    if (pan.length <= 5) {
      pan = pan.replace(/[^A-Z]/g, "")
    } else if (pan.length <= 9) {
      const letters = pan.slice(0, 5).replace(/[^A-Z]/g, "")
      const digits = pan.slice(5, 9).replace(/[^0-9]/g, "")
      pan = letters + digits
    } else {
      const letters = pan.slice(0, 5).replace(/[^A-Z]/g, "")
      const digits = pan.slice(5, 9).replace(/[^0-9]/g, "")
      const lastLetter = pan.slice(9, 10).replace(/[^A-Z]/g, "")
      pan = letters + digits + lastLetter
    }

    formatted = stateCode + pan
  } else if (formatted.length === 13) {
    // 13th char is entity number (digit)
    const base = formatted.slice(0, 12)
    const entity = formatted.slice(12, 13).replace(/[^0-9]/g, "")
    formatted = base + entity
  } else if (formatted.length === 14) {
    // 14th char is always 'Z'
    const base = formatted.slice(0, 13)
    formatted = base + 'Z'
  } else {
    // 15th char is checksum (digit)
    const base = formatted.slice(0, 14)
    const checksum = formatted.slice(14, 15).replace(/[^0-9]/g, "")
    formatted = base + checksum
  }

  return formatted
}

const formatIFSC = (value) => {
  // IFSC format: 4 letters + 0 + 6 alphanumeric (11 chars total)
  let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, "")

  if (formatted.length > 11) {
    formatted = formatted.slice(0, 11)
  }

  // First 4 must be letters
  if (formatted.length <= 4) {
    formatted = formatted.replace(/[^A-Z]/g, "")
  } else if (formatted.length === 5) {
    // 5th char must be 0
    const bankCode = formatted.slice(0, 4).replace(/[^A-Z]/g, "")
    formatted = bankCode + '0'
  } else {
    // Last 6 are alphanumeric
    const bankCode = formatted.slice(0, 4).replace(/[^A-Z]/g, "")
    const branch = formatted.slice(5, 11) // Keep alphanumeric
    formatted = bankCode + '0' + branch
  }

  return formatted
}

const formatLettersOnly = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, "")
}

const formatNumbersOnly = (value) => {
  return value.replace(/\D/g, "")
}

const validatePassword = (password) => {
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    return "Password must be at least 8 characters long"
  }
  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter"
  }
  if (!hasLowercase) {
    return "Password must contain at least one lowercase letter"
  }
  if (!hasNumber) {
    return "Password must contain at least one number"
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character"
  }

  return null
}

const validateEmail = (email) => {
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  return emailRegex.test(email)
}

const validateUPI = (upi) => {
  // UPI format: username@bankcode (e.g., rishikalpa1234@ybl)
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/
  return upiRegex.test(upi)
}

// Postal code validation patterns by country
const postalCodePatterns = {
  IN: { pattern: /^\d{6}$/, placeholder: "110001", label: "PIN Code" },
  US: { pattern: /^\d{5}(-\d{4})?$/, placeholder: "12345", label: "ZIP Code" },
  CA: { pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, placeholder: "A1A 1A1", label: "Postal Code" },
  GB: { pattern: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, placeholder: "SW1A 1AA", label: "Postcode" },
  AU: { pattern: /^\d{4}$/, placeholder: "2000", label: "Postcode" },
  default: { pattern: /^.+$/, placeholder: "Enter code", label: "Postal Code" }
}

// Countries with their states/provinces
const countriesData = {
  IN: { name: "India", states: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"] },
  US: { name: "United States", states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"] },
  CA: { name: "Canada", states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"] },
  GB: { name: "United Kingdom", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
  AU: { name: "Australia", states: ["Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"] },
  DE: { name: "Germany", states: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"] },
  FR: { name: "France", states: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"] },
  JP: { name: "Japan", states: ["Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa", "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"] },
  CN: { name: "China", states: ["Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hong Kong", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Macau", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"] },
  BR: { name: "Brazil", states: ["Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"] },
  MX: { name: "Mexico", states: ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico City", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"] },
  IT: { name: "Italy", states: ["Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Apulia", "Sardinia", "Sicily", "Tuscany", "Trentino-Alto Adige", "Umbria", "Aosta Valley", "Veneto"] },
  ES: { name: "Spain", states: ["Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and León", "Castile-La Mancha", "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencia"] },
  NL: { name: "Netherlands", states: ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"] },
  Other: { name: "Other Country", states: [] }
}

const validatePostalCode = (code, countryCode) => {
  const pattern = postalCodePatterns[countryCode] || postalCodePatterns.default
  return pattern.pattern.test(code)
}

const LoginForm = ({
  formData,
  handleInputChange,
  handleLogin,
  showPassword,
  setShowPassword,
  loading,
  error,
  success,
  setCurrentView,
}) => (
  <div className="max-w-md mx-auto">
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <User className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
      <p className="text-gray-600 mt-2">Sign in to your MyDesignBazaar account</p>
    </div>

    {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

    {success && (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
    )}

    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.rememberMe || false}
            onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => setCurrentView("forgot-password")}
          className="text-sm text-amber-600 hover:text-amber-700"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setCurrentView("signup-choice")}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Sign up here
          </button>
        </p>
      </div>
    </form>
  </div>
)

const ForgotPasswordForm = ({
  formData,
  handleInputChange,
  handleForgotPassword,
  loading,
  error,
  success,
  setCurrentView,
}) => (
  <div className="max-w-md mx-auto">
    <div className="text-center mb-8">
      <button
        onClick={() => setCurrentView("login")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Login
      </button>
      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <Lock className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
      <p className="text-gray-600 mt-2">No worries! We'll send you reset instructions.</p>
    </div>

    {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

    {success && (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
        {success}
        <p className="mt-2 text-xs">
          Check your email inbox (and spam folder) for the password reset link.
        </p>
      </div>
    )}

    <form onSubmit={handleForgotPassword} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.resetEmail || ""}
            onChange={(e) => handleInputChange("resetEmail", e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            placeholder="Enter your registered email"
            required
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending Reset Link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => setCurrentView("login")}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </form>
  </div>
)

const DesignerSignupForm = ({
  formData,
  handleInputChange,
  handleDesignerSignup,
  handleSendEmailOTP,
  handleVerifyEmailOTP,
  handleSendMobileOTP,
  handleVerifyMobileOTP,
  handleAadhaarFileUpload,
  handlePanFileUpload,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  error,
  success,
  setCurrentView,
}) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <button
        onClick={() => setCurrentView("signup-choice")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Account Type
      </button>
      <h2 className="text-2xl font-bold text-gray-900">Designer Application</h2>
      <p className="text-gray-600 mt-2">Join our creative community and start monetizing your designs</p>
    </div>

    {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

    {success && (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
    )}

    <form onSubmit={handleDesignerSignup} className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-amber-500" />
          Personal / Professional Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (as per ID proof) *</label>
            <input
              type="text"
              value={formData.fullName || ""}
              onChange={(e) => handleInputChange("fullName", formatLettersOnly(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter your full name"
              required
              pattern="[A-Za-z\s]+"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name / Brand Name</label>
            <input
              type="text"
              value={formData.displayName || ""}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Optional - shown on profile"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => {
                    handleInputChange("email", formatEmail(e.target.value))
                    handleInputChange("emailError", "")
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !validateEmail(e.target.value)) {
                      handleInputChange("emailError", "Please enter a valid email address")
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={formData.emailVerified}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                {formData.emailError && (
                  <p className="text-xs text-red-600 mt-1">{formData.emailError}</p>
                )}
              </div>
              {!formData.emailVerified && (
                <button
                  type="button"
                  onClick={() => handleSendEmailOTP()}
                  disabled={!formData.email || loading}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {formData.otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              )}
              {formData.emailVerified && (
                <div className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
            {formData.otpSent && !formData.emailVerified && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Enter the 6-digit OTP sent to your email
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.emailOtp || ""}
                    onChange={(e) => handleInputChange("emailOtp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center text-lg tracking-widest font-mono"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyEmailOTP()}
                    disabled={!formData.emailOtp || formData.emailOtp.length !== 6 || loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number (with WhatsApp) *
              {formData.mobileVerified && (
                <span className="ml-2 text-green-500 text-xs">✓ Verified</span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={formData.mobileNumber || ""}
                onChange={(e) => handleInputChange("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter 10-digit mobile number"
                required
                disabled={formData.mobileVerified}
                maxLength="10"
                pattern="[0-9]{10}"
              />
              {/* {!formData.mobileVerified && !formData.mobileOtpSent && (
                <button
                  type="button"
                  onClick={() => handleSendMobileOTP()}
                  disabled={!formData.mobileNumber || loading}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Send OTP
                </button>
              )} */}
            </div>
            {formData.mobileOtpSent && !formData.mobileVerified && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">
                  Enter the 6-digit OTP sent to your WhatsApp/mobile
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.mobileOtp || ""}
                    onChange={(e) => handleInputChange("mobileOtp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center text-lg tracking-widest font-mono"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyMobileOTP()}
                    disabled={!formData.mobileOtp || formData.mobileOtp.length !== 6 || loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter your password"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Min 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword || ""}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Confirm your password"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Contact</label>
            <input
              type="tel"
              value={formData.alternativeContact || ""}
              onChange={(e) => handleInputChange("alternativeContact", e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Optional 10-digit contact number"
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>

          {/* Aadhaar Number */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number *</label>
            <input
              type="text"
              value={formData.aadhaarNumber || ""}
              onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="12-digit Aadhaar number"
              required
              maxLength="12"
              pattern="[0-9]{12}"
            />
          </div>

          {/* PAN Card Number */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Number *</label>
            <input
              type="text"
              value={formData.panNumber || ""}
              onChange={(e) => handleInputChange("panNumber", formatPAN(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="ABCDE1234F"
              required
              maxLength="10"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 5 letters + 4 digits + 1 letter</p>
          </div>

          {/* Aadhaar Card Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar Card (Front & Back) *
            </label>
            <p className="text-xs text-gray-500 mb-3">Upload both sides of your Aadhaar card (max 2 files, PDF/JPG/PNG, max 5MB each)</p>

            <div className="space-y-3">
              {/* File Upload Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const files = Array.from(e.dataTransfer.files)
                  handleAadhaarFileUpload(files)
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('aadhaar-upload').click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Accepted formats: PDF, JPG, PNG (max 2 files)
                </p>
                <input
                  id="aadhaar-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleAadhaarFileUpload(Array.from(e.target.files))}
                  className="hidden"
                />
              </div>

              {/* Uploaded Files Display */}
              {formData.aadhaarFiles && formData.aadhaarFiles.length > 0 && (
                <div className="space-y-2">
                  {formData.aadhaarFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <FileText className="w-5 h-5 text-amber-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* Move Up */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const files = [...formData.aadhaarFiles]
                              const temp = files[index]
                              files[index] = files[index - 1]
                              files[index - 1] = temp
                              handleInputChange("aadhaarFiles", files)
                            }}
                            className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                        )}
                        {/* Move Down */}
                        {index < formData.aadhaarFiles.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const files = [...formData.aadhaarFiles]
                              const temp = files[index]
                              files[index] = files[index + 1]
                              files[index + 1] = temp
                              handleInputChange("aadhaarFiles", files)
                            }}
                            className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => {
                            const files = formData.aadhaarFiles.filter((_, i) => i !== index)
                            handleInputChange("aadhaarFiles", files)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PAN Card Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN Card Copy *
            </label>
            <p className="text-xs text-gray-500 mb-3">Upload your PAN card (1 file, PDF/JPG/PNG, max 5MB)</p>

            <div className="space-y-3">
              {/* File Upload Area */}
              {(!formData.panCardFile || formData.panCardFile.length === 0) && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const files = Array.from(e.dataTransfer.files)
                    handlePanFileUpload(files)
                  }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('pan-upload').click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag & drop file here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Accepted formats: PDF, JPG, PNG (max 1 file)
                  </p>
                  <input
                    id="pan-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handlePanFileUpload(Array.from(e.target.files))}
                    className="hidden"
                  />
                </div>
              )}

              {/* Uploaded File Display */}
              {formData.panCardFile && formData.panCardFile.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formData.panCardFile[0].name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formData.panCardFile[0].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange("panCardFile", [])}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-amber-500" />
          Address
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <textarea
              value={formData.streetAddress || ""}
              onChange={(e) => handleInputChange("streetAddress", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              rows="2"
              placeholder="Enter your street address"
              required
            />
          </div>

          {/* Country - First so state can depend on it */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <select
              value={formData.country || ""}
              onChange={(e) => {
                handleInputChange("country", e.target.value)
                handleInputChange("state", "") // Reset state when country changes
                handleInputChange("postalCode", "") // Reset postal code
                handleInputChange("postalCodeError", "")
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            >
              <option value="">Select Country</option>
              {Object.entries(countriesData).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>
          </div>

          {/* State/Province - Dynamic based on country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
            {formData.country && countriesData[formData.country]?.states.length > 0 ? (
              <select
                value={formData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                required
              >
                <option value="">Select State/Province</option>
                {countriesData[formData.country].states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder={formData.country ? "Enter state/province" : "Select country first"}
                required
                disabled={!formData.country}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter city name"
              required
            />
          </div>

          {/* Postal Code - Dynamic validation based on country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.country && postalCodePatterns[formData.country]
                ? postalCodePatterns[formData.country].label
                : "Postal Code"} *
            </label>
            <input
              type="text"
              value={formData.postalCode || ""}
              onChange={(e) => {
                handleInputChange("postalCode", e.target.value.toUpperCase())
                handleInputChange("postalCodeError", "")
              }}
              onBlur={(e) => {
                if (e.target.value && formData.country) {
                  if (!validatePostalCode(e.target.value, formData.country)) {
                    const pattern = postalCodePatterns[formData.country] || postalCodePatterns.default
                    handleInputChange("postalCodeError", `Invalid format. Example: ${pattern.placeholder}`)
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder={formData.country && postalCodePatterns[formData.country]
                ? postalCodePatterns[formData.country].placeholder
                : "Enter postal code"}
              required
              disabled={!formData.country}
            />
            {formData.postalCodeError && (
              <p className="text-xs text-red-600 mt-1">{formData.postalCodeError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Identity & Tax Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-amber-500" />
          Identity & Tax Information
        </h3>
        <div className="grid md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
            <input
              type="text"
              value={formData.gstNumber || ""}
              onChange={(e) => handleInputChange("gstNumber", formatGST(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="27ABCDE1234F1Z5"
              maxLength="15"
              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}"
            />
            <p className="text-xs text-gray-500 mt-1">Format: 2 digits + PAN (10 chars) + entity digit + Z + checksum digit (optional)</p>
          </div>
        </div>

        {/* Bank Details */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Bank Details (for payout)</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
              <input
                type="text"
                value={formData.accountHolderName || ""}
                onChange={(e) => handleInputChange("accountHolderName", formatLettersOnly(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Full name as per bank account"
                pattern="[A-Za-z\s]+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
              <input
                type="password"
                value={formData.accountNumber || ""}
                onChange={(e) => handleInputChange("accountNumber", formatNumbersOnly(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter your bank account number"
                required
                pattern="[0-9]+"
              />
              <p className="text-xs text-gray-500 mt-1">Account number will be masked for security (numbers only)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Account Number *</label>
              <input
                type="text"
                value={formData.confirmAccountNumber || ""}
                onChange={(e) => handleInputChange("confirmAccountNumber", formatNumbersOnly(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Re-enter your bank account number"
                required
                pattern="[0-9]+"
              />
              {formData.accountNumber && formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber && (
                <p className="text-xs text-red-600 mt-1">Account numbers do not match</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={formData.bankName || ""}
                onChange={(e) => handleInputChange("bankName", formatLettersOnly(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Bank name"
                pattern="[A-Za-z\s]+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <input
                type="text"
                value={formData.branch || ""}
                onChange={(e) => handleInputChange("branch", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Bank branch name or location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC/SWIFT Code</label>
              <input
                type="text"
                value={formData.ifscCode || ""}
                onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="SBIN0001234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID (India)</label>
              <input
                type="text"
                value={formData.upiId || ""}
                onChange={(e) => {
                  handleInputChange("upiId", e.target.value)
                  handleInputChange("upiError", "")
                }}
                onBlur={(e) => {
                  if (e.target.value && !validateUPI(e.target.value)) {
                    handleInputChange("upiError", "Please enter a valid UPI ID (e.g., username@bankcode)")
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="e.g., vivekkumar19@ybl"
              />
              {formData.upiError && (
                <p className="text-xs text-red-600 mt-1">{formData.upiError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PayPal ID (International)</label>
              <input
                type="email"
                value={formData.paypalId || ""}
                onChange={(e) => handleInputChange("paypalId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio & Work Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-amber-500" />
          Portfolio & Work Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link to Online Portfolio</label>
            <div className="space-y-2">
              {(formData.portfolioLinks || [""]).map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const links = [...(formData.portfolioLinks || [""])]
                      links[index] = e.target.value
                      handleInputChange("portfolioLinks", links)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="Behance, Instagram, Dribbble, etc."
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const links = (formData.portfolioLinks || [""]).filter((_, i) => i !== index)
                        handleInputChange("portfolioLinks", links.length > 0 ? links : [""])
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove link"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {index === (formData.portfolioLinks || [""]).length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const links = [...(formData.portfolioLinks || [""]), ""]
                        handleInputChange("portfolioLinks", links)
                      }}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Add another link"
                    >
                      <Check className="w-5 h-5 rotate-45" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Add multiple portfolio links (optional)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Design Specialization (select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Kidswear",
                "Menswear",
                "Womenswear",
                "Ethnic/Festival",
                "Floral Patterns",
                "Typography",
                "AI-Generated",
                "Others",
              ].map((spec) => (
                <label key={spec} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.specializations?.includes(spec) || false}
                    onChange={(e) => {
                      const current = formData.specializations || []
                      if (e.target.checked) {
                        handleInputChange("specializations", [...current, spec])
                      } else {
                        handleInputChange(
                          "specializations",
                          current.filter((s) => s !== spec),
                        )
                      }
                    }}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{spec}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              value={formData.otherSpecialization || ""}
              onChange={(e) => handleInputChange("otherSpecialization", e.target.value)}
              disabled={!formData.specializations?.includes("Others")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent mt-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={formData.specializations?.includes("Others") ? "Please specify your specialization" : "Select 'Others' to enable this field"}
            />
          </div>
        </div>
      </div>

      {/* Terms & Agreements */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Agreements</h3>
        <div className="space-y-3">
          {[
            {
              key: "originalWork",
              text: "I confirm that all uploaded designs are my original work and do not infringe any third-party copyrights.",
            },
            {
              key: "noResponsibility",
              text: "I agree that MyDesignBazaar.com is not responsible for any copyright violation due to my uploads.",
            },
            {
              key: "monetizationPolicy",
              text: "I accept the Monetization Policy, Revenue Share Agreement (50/50), and Design Review Terms.",
            },
            {
              key: "platformPricing",
              text: "I understand that pricing of designs is decided by the platform.",
            },
            {
              key: "designRemoval",
              text: "I acknowledge that designs may be removed if they violate platform rules or receive complaints.",
            },
            {
              key: "minimumUploads",
              text: "I agree to upload at least 10 original designs after approval and reach 100 for monetization.",
            },
          ].map(({ key, text }) => (
            <label key={key} className="flex items-start">
              <input
                type="checkbox"
                checked={formData[`agreement_${key}`] || false}
                onChange={(e) => handleInputChange(`agreement_${key}`, e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mt-0.5"
                required
              />
              <span className="ml-3 text-sm text-gray-700">{text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Application...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
        <p className="text-sm text-gray-600 mt-3">
          Confirmation email will be sent • Admin review within 3-7 working days
        </p>
      </div>
    </form>
  </div>
)

const BuyerSignupForm = ({
  formData,
  handleInputChange,
  handleBuyerSignup,
  handleSendEmailOTP,
  handleVerifyEmailOTP,
  handleSendMobileOTP,
  handleVerifyMobileOTP,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  error,
  success,
  setCurrentView,
}) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <button
        onClick={() => setCurrentView("signup-choice")}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Account Type
      </button>
      <h2 className="text-2xl font-bold text-gray-900">Buyer Registration</h2>
      <p className="text-gray-600 mt-2">Access thousands of unique, production-ready garment designs</p>
    </div>

    {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

    {success && (
      <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
    )}

    <form onSubmit={handleBuyerSignup} className="space-y-8">
      {/* Personal/Business Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2 text-amber-500" />
          Personal / Business Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name / Company Name *</label>
            <input
              type="text"
              value={formData.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => {
                    handleInputChange("email", formatEmail(e.target.value))
                    handleInputChange("emailError", "")
                  }}
                  onBlur={(e) => {
                    if (e.target.value && !validateEmail(e.target.value)) {
                      handleInputChange("emailError", "Please enter a valid email address")
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={formData.emailVerified}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
                {formData.emailError && (
                  <p className="text-xs text-red-600 mt-1">{formData.emailError}</p>
                )}
              </div>
              {!formData.emailVerified && (
                <button
                  type="button"
                  onClick={() => handleSendEmailOTP()}
                  disabled={!formData.email || loading}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {formData.otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              )}
              {formData.emailVerified && (
                <div className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
            {formData.otpSent && !formData.emailVerified && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Enter the 6-digit OTP sent to your email
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.emailOtp || ""}
                    onChange={(e) => handleInputChange("emailOtp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center text-lg tracking-widest font-mono"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyEmailOTP()}
                    disabled={!formData.emailOtp || formData.emailOtp.length !== 6 || loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number (with WhatsApp) *
              {formData.mobileVerified && (
                <span className="ml-2 text-green-500 text-xs">✓ Verified</span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={formData.mobileNumber || ""}
                onChange={(e) => handleInputChange("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter 10-digit mobile number"
                required
                disabled={formData.mobileVerified}
                maxLength="10"
                pattern="[0-9]{10}"
              />
              {!formData.mobileVerified && !formData.mobileOtpSent && (
                <button
                  type="button"
                  onClick={() => handleSendMobileOTP()}
                  disabled={!formData.mobileNumber || loading}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Send OTP
                </button>
              )}
            </div>
            {formData.mobileOtpSent && !formData.mobileVerified && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">
                  Enter the 6-digit OTP sent to your WhatsApp/mobile
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.mobileOtp || ""}
                    onChange={(e) => handleInputChange("mobileOtp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center text-lg tracking-widest font-mono"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyMobileOTP()}
                    disabled={!formData.mobileOtp || formData.mobileOtp.length !== 6 || loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
            <select
              value={formData.businessType || ""}
              onChange={(e) => handleInputChange("businessType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            >
              <option value="">Select Business Type</option>
              <option value="manufacturer">Garment Manufacturer</option>
              <option value="exporter">Exporter</option>
              <option value="boutique">Boutique Owner</option>
              <option value="freelancer">Freelancer</option>
              <option value="fashion-brand">Fashion Brand</option>
              <option value="student">Student / Hobbyist</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword || ""}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-amber-500" />
          Address for Billing / Invoicing
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <textarea
              value={formData.streetAddress || ""}
              onChange={(e) => handleInputChange("streetAddress", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              rows="2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City / Town *</label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State / Province *</label>
            <input
              type="text"
              value={formData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal / ZIP Code *</label>
            <input
              type="text"
              value={formData.postalCode || ""}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <select
              value={formData.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            >
              <option value="">Select Country</option>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number (India)</label>
            <input
              type="text"
              value={formData.gstNumber || ""}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Optional for Indian buyers"
            />
          </div>
        </div>
      </div>

      {/* Payment Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-amber-500" />
          Payment Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Payment Method (select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["UPI", "Razorpay", "PayPal", "Credit Card", "Debit Card", "Net Banking"].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods?.includes(method) || false}
                    onChange={(e) => {
                      const current = formData.paymentMethods || []
                      if (e.target.checked) {
                        handleInputChange("paymentMethods", [...current, method])
                      } else {
                        handleInputChange(
                          "paymentMethods",
                          current.filter((m) => m !== method),
                        )
                      }
                    }}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Currency</label>
            <select
              value={formData.billingCurrency || "INR"}
              onChange={(e) => handleInputChange("billingCurrency", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="INR">INR (Indian Rupee)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="GBP">GBP (British Pound)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Design Requirements */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-amber-500" />
          Design Requirements (Optional)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What design categories are you interested in? (Multi-select)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Kidswear",
                "Menswear",
                "Womenswear",
                "Festival & Ethnic",
                "Typography",
                "Floral / Nature",
                "Abstract / Geometric",
                "Minimal / Modern",
                "AI-Generated",
                "Custom Design Requests",
              ].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.interestedCategories?.includes(category) || false}
                    onChange={(e) => {
                      const current = formData.interestedCategories || []
                      if (e.target.checked) {
                        handleInputChange("interestedCategories", [...current, category])
                      } else {
                        handleInputChange(
                          "interestedCategories",
                          current.filter((c) => c !== category),
                        )
                      }
                    }}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency of Purchase</label>
            <select
              value={formData.purchaseFrequency || ""}
              onChange={(e) => handleInputChange("purchaseFrequency", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            >
              <option value="">Select Frequency</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="occasionally">Occasionally</option>
            </select>
          </div>
        </div>
      </div>

      {/* Terms & Agreements */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Agreements</h3>
        <div className="space-y-3">
          {[
            {
              key: "licensedUse",
              text: "I understand that all downloads are for licensed use only and resale of the files is strictly prohibited.",
            },
            {
              key: "noCopyright",
              text: "I agree not to claim copyright on designs downloaded from this platform.",
            },
            {
              key: "refundPolicy",
              text: "I acknowledge that refunds are only available in case of proven file defects or failed downloads.",
            },
            {
              key: "noIllegalDesigns",
              text: "I will not request or encourage illegal or plagiarized designs.",
            },
            {
              key: "compliance",
              text: "I agree to comply with all applicable copyright, usage, and payment terms as per MyDesignBazaar's policy.",
            },
          ].map(({ key, text }) => (
            <label key={key} className="flex items-start">
              <input
                type="checkbox"
                checked={formData[`agreement_${key}`] || false}
                onChange={(e) => handleInputChange(`agreement_${key}`, e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mt-0.5"
                required
              />
              <span className="ml-3 text-sm text-gray-700">{text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
        <p className="text-sm text-gray-600 mt-3">
          By signing up, you accept our Terms of Service & Privacy Policy.
          <br />A verification email will be sent for account activation.
        </p>
      </div>
    </form>
  </div>
)

const AuthPage = ({ onAuthSuccess, initialView = "login" }) => {
  const [currentView, setCurrentView] = useState(initialView)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({})

  // OTP Verification States
  const [emailOtp, setEmailOtp] = useState('')
  const [mobileOtp, setMobileOtp] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [mobileVerified, setMobileVerified] = useState(false)
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false)
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false)
  const [verifyingEmailOtp, setVerifyingEmailOtp] = useState(false)
  const [verifyingMobileOtp, setVerifyingMobileOtp] = useState(false)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Remember Me functionality now controls session duration via JWT cookies
  // No need for localStorage - cookies handle persistence automatically

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  // Aadhaar file upload handler (max 2 files)
  const handleAadhaarFileUpload = (files) => {
    if (!files || files.length === 0) return

    const validFormats = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    const maxSize = 5 * 1024 * 1024 // 5MB
    const maxFiles = 2

    const currentFiles = formData.aadhaarFiles || []
    const remainingSlots = maxFiles - currentFiles.length

    if (remainingSlots <= 0) {
      setError("You can only upload a maximum of 2 Aadhaar card files")
      return
    }

    const validFiles = []
    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i]

      if (!validFormats.includes(file.type)) {
        setError(`${file.name} is not a valid format. Only PDF, JPG, and PNG are allowed.`)
        continue
      }

      if (file.size > maxSize) {
        setError(`${file.name} exceeds 5MB size limit.`)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      handleInputChange("aadhaarFiles", [...currentFiles, ...validFiles])
      setError("")
    }
  }

  // PAN card file upload handler (max 1 file)
  const handlePanFileUpload = (files) => {
    if (!files || files.length === 0) return

    const validFormats = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    const file = files[0] // Only take the first file

    if (!validFormats.includes(file.type)) {
      setError(`${file.name} is not a valid format. Only PDF, JPG, and PNG are allowed.`)
      return
    }

    if (file.size > maxSize) {
      setError(`${file.name} exceeds 5MB size limit.`)
      return
    }

    handleInputChange("panCardFile", [file])
    setError("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe || false,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Remember Me is now handled by cookie/JWT expiry on the server
        setSuccess("Login successful!")
        // Call the success callback if provided
        if (onAuthSuccess) {
          onAuthSuccess(data.user)
        }
        // Redirect or close modal
        setTimeout(() => {
          window.location.reload() // Or handle navigation as needed
        }, 1000)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.resetEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || "Password reset link has been sent to your email!")
        // Clear the email field after successful submission
        handleInputChange("resetEmail", "")
      } else {
        setError(data.error || "Failed to send reset link")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmailOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          userName: formData.fullName || formData.displayName || "User"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("OTP sent to your email! Please check your inbox.")
        handleInputChange("otpSent", true)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmailOTP = async () => {
    if (!formData.emailOtp || formData.emailOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.emailOtp
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Email verified successfully!")
        handleInputChange("emailVerified", true)
        handleInputChange("otpSent", false)
        handleInputChange("emailOtp", "")
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Invalid OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMobileOTP = async () => {
    if (!formData.mobileNumber) {
      setError("Please enter your mobile number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-mobile-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.mobileNumber,
          userName: formData.fullName || formData.displayName || "User",
          email: formData.email // Pass email to find the temporary user
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("OTP sent to your WhatsApp/mobile! Please check your messages.")
        handleInputChange("mobileOtpSent", true)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyMobileOTP = async () => {
    if (!formData.mobileOtp || formData.mobileOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-mobile-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.mobileNumber,
          otp: formData.mobileOtp
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Mobile number verified successfully!")
        handleInputChange("mobileVerified", true)
        handleInputChange("mobileOtpSent", false)
        handleInputChange("mobileOtp", "")
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Invalid OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDesignerSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate email verification
    if (!formData.emailVerified) {
      setError("Please verify your email address before submitting")
      setLoading(false)
      return
    }

    // Validate mobile verification
    if (!formData.mobileVerified) {
      setError("Please verify your mobile number before submitting")
      setLoading(false)
      return
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate account number confirmation
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account numbers do not match")
      setLoading(false)
      return
    }

    // Validate Aadhaar files (must have 2 files)
    if (!formData.aadhaarFiles || formData.aadhaarFiles.length !== 2) {
      setError("Please upload both front and back sides of your Aadhaar card (2 files required)")
      setLoading(false)
      return
    }

    // Validate PAN card file (must have 1 file)
    if (!formData.panCardFile || formData.panCardFile.length === 0) {
      setError("Please upload your PAN card")
      setLoading(false)
      return
    }

    // Validate required agreements
    const requiredAgreements = [
      "originalWork",
      "noResponsibility",
      "monetizationPolicy",
      "platformPricing",
      "designRemoval",
      "minimumUploads",
    ]

    for (const agreement of requiredAgreements) {
      if (!formData[`agreement_${agreement}`]) {
        setError("Please accept all terms and agreements")
        setLoading(false)
        return
      }
    }

    try {
      // TODO: Handle file uploads to cloud storage (Cloudinary/AWS S3)
      // For now, we'll pass the file metadata
      const aadhaarFileNames = formData.aadhaarFiles.map(f => f.name)
      const panCardFileName = formData.panCardFile[0].name

      const signupData = {
        userType: "designer",
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        displayName: formData.displayName,
        mobileNumber: formData.mobileNumber,
        alternativeContact: formData.alternativeContact,
        aadhaarNumber: formData.aadhaarNumber,
        aadhaarFiles: aadhaarFileNames, // TODO: Upload files and store paths
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        panNumber: formData.panNumber,
        panCardFile: panCardFileName, // TODO: Upload file and store path
        gstNumber: formData.gstNumber,
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          branch: formData.branch,
          ifscCode: formData.ifscCode,
          upiId: formData.upiId,
          paypalId: formData.paypalId,
        },
        portfolioLinks: (formData.portfolioLinks || [""]).filter(link => link.trim() !== ""),
        specializations: formData.specializations || [],
        otherSpecialization: formData.otherSpecialization,
        agreements: {
          originalWork: formData.agreement_originalWork,
          noResponsibility: formData.agreement_noResponsibility,
          monetizationPolicy: formData.agreement_monetizationPolicy,
          platformPricing: formData.agreement_platformPricing,
          designRemoval: formData.agreement_designRemoval,
          minimumUploads: formData.agreement_minimumUploads,
        },
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setTimeout(() => {
          setCurrentView("login")
        }, 3000)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBuyerSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate email verification
    if (!formData.emailVerified) {
      setError("Please verify your email address before submitting")
      setLoading(false)
      return
    }

    // Validate mobile verification
    if (!formData.mobileVerified) {
      setError("Please verify your mobile number before submitting")
      setLoading(false)
      return
    }

    // Validate password strength
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate required agreements
    const requiredAgreements = ["licensedUse", "noCopyright", "refundPolicy", "noIllegalDesigns", "compliance"]

    for (const agreement of requiredAgreements) {
      if (!formData[`agreement_${agreement}`]) {
        setError("Please accept all terms and agreements")
        setLoading(false)
        return
      }
    }

    try {
      const signupData = {
        userType: "buyer",
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        businessType: formData.businessType,
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          gstNumber: formData.gstNumber,
        },
        paymentMethods: formData.paymentMethods || [],
        billingCurrency: formData.billingCurrency || "INR",
        interestedCategories: formData.interestedCategories || [],
        purchaseFrequency: formData.purchaseFrequency,
        agreements: {
          licensedUse: formData.agreement_licensedUse,
          noCopyright: formData.agreement_noCopyright,
          refundPolicy: formData.agreement_refundPolicy,
          noIllegalDesigns: formData.agreement_noIllegalDesigns,
          compliance: formData.agreement_compliance,
        },
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setTimeout(() => {
          setCurrentView("login")
        }, 3000)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const SignupChoice = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <button
          onClick={() => setCurrentView("login")}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Join MyDesignBazaar</h2>
        <p className="text-gray-600 mt-2">Choose your account type to get started</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Designer Card */}
        <div
          className="border-2 border-gray-200 rounded-xl p-6 hover:border-amber-400 transition-colors cursor-pointer group"
          onClick={() => setCurrentView("designer-signup")}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Designer</h3>
            <p className="text-gray-600 mb-4">Sell your unique designs and earn from your creativity</p>
            <ul className="text-sm text-gray-500 space-y-2 text-left">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Upload and monetize designs
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                50/50 revenue sharing
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Global marketplace reach
              </li>
            </ul>
          </div>
        </div>

        {/* Buyer Card */}
        <div
          className="border-2 border-gray-200 rounded-xl p-6 hover:border-amber-400 transition-colors cursor-pointer group"
          onClick={() => setCurrentView("buyer-signup")}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Buyer</h3>
            <p className="text-gray-600 mb-4">Access thousands of unique, production-ready designs</p>
            <ul className="text-sm text-gray-500 space-y-2 text-left">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Licensed design downloads
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Multiple payment options
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Instant download access
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {currentView === "login" && (
          <LoginForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogin={handleLogin}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            error={error}
            success={success}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "forgot-password" && (
          <ForgotPasswordForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleForgotPassword={handleForgotPassword}
            loading={loading}
            error={error}
            success={success}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "signup-choice" && <SignupChoice />}
        {currentView === "designer-signup" && (
          <DesignerSignupForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDesignerSignup={handleDesignerSignup}
            handleSendEmailOTP={handleSendEmailOTP}
            handleVerifyEmailOTP={handleVerifyEmailOTP}
            handleSendMobileOTP={handleSendMobileOTP}
            handleVerifyMobileOTP={handleVerifyMobileOTP}
            handleAadhaarFileUpload={handleAadhaarFileUpload}
            handlePanFileUpload={handlePanFileUpload}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            loading={loading}
            error={error}
            success={success}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === "buyer-signup" && (
          <BuyerSignupForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleBuyerSignup={handleBuyerSignup}
            handleSendEmailOTP={handleSendEmailOTP}
            handleVerifyEmailOTP={handleVerifyEmailOTP}
            handleSendMobileOTP={handleSendMobileOTP}
            handleVerifyMobileOTP={handleVerifyMobileOTP}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            loading={loading}
            error={error}
            success={success}
            setCurrentView={setCurrentView}
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage
