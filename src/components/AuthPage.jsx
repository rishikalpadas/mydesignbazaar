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
} from "lucide-react"

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
          <input type="checkbox" className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-amber-600 hover:text-amber-700">
          Forgot password?
        </a>
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
const DesignerSignupForm = ({
  formData,
  handleInputChange,
  handleDesignerSignup,
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
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter your full name"
              required
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
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={formData.emailVerified}
              />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number (with WhatsApp) *</label>
            <input
              type="tel"
              value={formData.mobileNumber || ""}
              onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Enter mobile number"
              required
            />
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
                placeholder="Confirm your password"
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Contact</label>
            <input
              type="text"
              value={formData.alternativeContact || ""}
              onChange={(e) => handleInputChange("alternativeContact", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Optional alternative contact"
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
            <input
              type="text"
              value={formData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal/ZIP Code *</label>
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
        </div>
      </div>

      {/* Identity & Tax Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-amber-500" />
          Identity & Tax Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Number *</label>
            <input
              type="text"
              value={formData.panNumber || ""}
              onChange={(e) => handleInputChange("panNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="India only"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
            <input
              type="text"
              value={formData.gstNumber || ""}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Optional for Indian businesses"
            />
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
                onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber || ""}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={formData.bankName || ""}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC/SWIFT Code</label>
              <input
                type="text"
                value={formData.ifscCode || ""}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID (India)</label>
              <input
                type="text"
                value={formData.upiId || ""}
                onChange={(e) => handleInputChange("upiId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Optional"
              />
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
            <input
              type="url"
              value={formData.portfolioLink || ""}
              onChange={(e) => handleInputChange("portfolioLink", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              placeholder="Behance, Instagram, etc. (Optional)"
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent mt-3"
              placeholder="If others, please specify"
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
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={formData.emailVerified}
              />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number (with WhatsApp) *</label>
            <input
              type="tel"
              value={formData.mobileNumber || ""}
              onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              required
            />
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
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
        }),
      })

      const data = await response.json()

      if (response.ok) {
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

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
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
      const signupData = {
        userType: "designer",
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        displayName: formData.displayName,
        mobileNumber: formData.mobileNumber,
        alternativeContact: formData.alternativeContact,
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        panNumber: formData.panNumber,
        gstNumber: formData.gstNumber,
        bankDetails: {
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          ifscCode: formData.ifscCode,
          upiId: formData.upiId,
          paypalId: formData.paypalId,
        },
        portfolioLink: formData.portfolioLink,
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
        {currentView === "signup-choice" && <SignupChoice />}
        {currentView === "designer-signup" && (
          <DesignerSignupForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDesignerSignup={handleDesignerSignup}
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
