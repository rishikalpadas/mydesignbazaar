"use client"
import { useState, useEffect } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building,
  Link as LinkIcon,
  Award,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Wallet,
  AlertCircle,
  Shield,
  FileText,
  Eye,
  Download,
  ShoppingBag,
  Package
} from "lucide-react"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"
import DocumentLightbox from "../../../components/dashboard/DocumentLightbox"

const DesignerProfileContent = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDocuments, setShowDocuments] = useState(false)
  const [documentIndex, setDocumentIndex] = useState(0)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/designer/profile", {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      if (data.success) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Designer Profile</h1>
            <p className="text-purple-100">View your profile information and track your progress</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <User className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Account Status Banner */}
      {!profile.isApproved && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900">Account Pending Approval</h3>
              <p className="text-sm text-orange-700">Your designer account is pending admin approval. You&apos;ll be notified once approved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Monetization Eligibility Progress */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Monetization Eligibility</h2>
                <p className="text-sm text-gray-600">Earn commission on sold designs once eligible</p>
              </div>
            </div>
            {profile.monetization.isEligible && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Eligible
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Approved Designs Progress
              </span>
              <span className="text-sm font-bold text-gray-900">
                {profile.monetization.currentApproved} / {profile.monetization.threshold}
              </span>
            </div>
            <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                  profile.monetization.isEligible
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-orange-500 to-amber-500"
                }`}
                style={{ width: `${profile.monetization.progress}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white drop-shadow">
                  {profile.monetization.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Designs</p>
                  <p className="text-2xl font-bold text-blue-900">{profile.stats.totalDesigns}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{profile.stats.approvedDesigns}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Remaining</p>
                  <p className="text-2xl font-bold text-orange-900">{profile.monetization.remainingDesigns}</p>
                </div>
                <Target className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Eligibility Message */}
          {!profile.monetization.isEligible && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Keep Going!</h4>
                  <p className="text-sm text-amber-700">
                    You need <strong>{profile.monetization.remainingDesigns} more approved design{profile.monetization.remainingDesigns !== 1 ? 's' : ''}</strong> to become eligible for monetization.
                    Once eligible, you&apos;ll earn commission on every design sale!
                  </p>
                </div>
              </div>
            </div>
          )}

          {profile.monetization.isEligible && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Congratulations!</h4>
                  <p className="text-sm text-green-700">
                    You&apos;re now eligible for monetization! You&apos;ll earn commission on every design sale.
                    Your earnings will be tracked in your wallet and can be redeemed to your bank account.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={<User className="w-5 h-5 text-gray-500" />}
            label="Full Name"
            value={profile.fullName}
          />
          <InfoField
            icon={<User className="w-5 h-5 text-gray-500" />}
            label="Display Name"
            value={profile.displayName || "Not set"}
          />
          <InfoField
            icon={<Mail className="w-5 h-5 text-gray-500" />}
            label="Email"
            value={profile.email}
            verified={profile.isVerified}
          />
          <InfoField
            icon={<Phone className="w-5 h-5 text-gray-500" />}
            label="Mobile Number"
            value={profile.mobileNumber}
          />
          <InfoField
            icon={<Phone className="w-5 h-5 text-gray-500" />}
            label="Alternative Contact"
            value={profile.alternativeContact || "Not provided"}
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Address
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <p className="text-gray-900">{profile.address.street}</p>
            <p className="text-gray-700">
              {profile.address.city}, {profile.address.state} {profile.address.postalCode}
            </p>
            <p className="text-gray-700">{profile.address.country}</p>
          </div>
        </div>
      </div>

      {/* Identity & Tax Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Identity & Tax Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={<CreditCard className="w-5 h-5 text-gray-500" />}
            label="Aadhaar Number"
            value={`****${profile.aadhaarNumber.slice(-4)}`}
            masked
          />
          <InfoField
            icon={<CreditCard className="w-5 h-5 text-gray-500" />}
            label="PAN Number"
            value={profile.panNumber}
          />
          <InfoField
            icon={<CreditCard className="w-5 h-5 text-gray-500" />}
            label="GST Number"
            value={profile.gstNumber || "Not provided"}
          />
        </div>
      </div>

      {/* Uploaded ID Documents */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Uploaded ID Documents
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aadhaar Documents */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                Aadhaar Card
              </h3>
              {profile.aadhaarFiles && profile.aadhaarFiles.length > 0 ? (
                <div className="space-y-2">
                  {profile.aadhaarFiles.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDocumentIndex(index)
                        setShowDocuments(true)
                      }}
                      className="flex items-center justify-between w-full p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-gray-700">
                          Aadhaar {profile.aadhaarFiles.length > 1 ? `(${index + 1}/${profile.aadhaarFiles.length})` : ''}
                        </span>
                      </div>
                      <Eye className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No Aadhaar documents uploaded</p>
              )}
            </div>

            {/* PAN Card Document */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                PAN Card
              </h3>
              {profile.panCardFile ? (
                <button
                  onClick={() => {
                    setDocumentIndex(profile.aadhaarFiles?.length || 0)
                    setShowDocuments(true)
                  }}
                  className="flex items-center justify-between w-full p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-gray-700">PAN Card</span>
                  </div>
                  <Eye className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <p className="text-gray-500 text-sm">No PAN card uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Bank Details
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={<User className="w-5 h-5 text-gray-500" />}
            label="Account Holder Name"
            value={profile.bankDetails.accountHolderName || "Not provided"}
          />
          <InfoField
            icon={<Building className="w-5 h-5 text-gray-500" />}
            label="Bank Name"
            value={profile.bankDetails.bankName || "Not provided"}
          />
          <InfoField
            icon={<MapPin className="w-5 h-5 text-gray-500" />}
            label="Branch"
            value={profile.bankDetails.branch || "Not provided"}
          />
          <InfoField
            icon={<CreditCard className="w-5 h-5 text-gray-500" />}
            label="IFSC Code"
            value={profile.bankDetails.ifscCode || "Not provided"}
          />
          <InfoField
            icon={<CreditCard className="w-5 h-5 text-gray-500" />}
            label="Account Number"
            value={profile.bankDetails.accountNumber || "Not provided"}
            masked
          />
          <InfoField
            icon={<DollarSign className="w-5 h-5 text-gray-500" />}
            label="UPI ID"
            value={profile.bankDetails.upiId || "Not provided"}
          />
        </div>
      </div>

      {/* Portfolio & Specializations */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-600" />
            Portfolio & Specializations
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Specializations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {profile.specializations && profile.specializations.length > 0 ? (
                profile.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No specializations added</span>
              )}
            </div>
            {profile.otherSpecialization && (
              <p className="mt-2 text-sm text-gray-600">
                <strong>Other:</strong> {profile.otherSpecialization}
              </p>
            )}
          </div>

          {/* Portfolio Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Portfolio Links</h3>
            {profile.portfolioLinks && profile.portfolioLinks.length > 0 ? (
              <div className="space-y-2">
                {profile.portfolioLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm">{link}</span>
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">No portfolio links added</span>
            )}
          </div>
        </div>
      </div>

      {/* Design Statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Design Statistics
          </h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText className="w-6 h-6 text-blue-500" />}
            label="Total Designs"
            value={profile.stats.totalDesigns}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-green-500" />}
            label="Approved"
            value={profile.stats.approvedDesigns}
            color="green"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-orange-500" />}
            label="Pending"
            value={profile.stats.pendingDesigns}
            color="orange"
          />
          <StatCard
            icon={<XCircle className="w-6 h-6 text-red-500" />}
            label="Rejected"
            value={profile.stats.rejectedDesigns}
            color="red"
          />
        </div>
      </div>

      {/* Document Lightbox */}
      {showDocuments && (
        <DocumentLightbox
          isOpen={showDocuments}
          onClose={() => setShowDocuments(false)}
          documents={[
            ...(profile.aadhaarFiles || []).map((file, index) => ({
              url: `/api/${file}`,
              label: `Aadhaar Card ${profile.aadhaarFiles.length > 1 ? `(${index + 1}/${profile.aadhaarFiles.length})` : ''}`,
              type: file.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
            })),
            ...(profile.panCardFile ? [{
              url: `/api/${profile.panCardFile}`,
              label: 'PAN Card',
              type: profile.panCardFile.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
            }] : [])
          ]}
          initialIndex={documentIndex}
        />
      )}
    </div>
  )
}

// Reusable Info Field Component
const InfoField = ({ icon, label, value, verified, masked }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {verified && (
        <CheckCircle className="w-4 h-4 text-green-500" title="Verified" />
      )}
    </div>
    <p className="text-gray-900 font-medium pl-7">
      {masked && <span className="text-gray-500 mr-1">🔒</span>}
      {value}
    </p>
  </div>
)

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
    <div className="flex items-center justify-between mb-2">
      {icon}
    </div>
    <p className={`text-sm text-${color}-600 font-medium mb-1`}>{label}</p>
    <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
  </div>
)

// Buyer Profile Content Component
const BuyerProfileContent = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/buyer/profile", {
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(errorData.message || "Failed to fetch profile")
      }

      const data = await response.json()
      if (data.success) {
        setProfile(data.profile)
      } else {
        throw new Error(data.message || "Failed to load profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError(error.message || "Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const getBusinessTypeLabel = (type) => {
    const labels = {
      manufacturer: "Manufacturer",
      exporter: "Exporter",
      boutique: "Boutique",
      freelancer: "Freelancer",
      "fashion-brand": "Fashion Brand",
      student: "Student",
      other: "Other",
    }
    return labels[type] || type
  }

  const getPurchaseFrequencyLabel = (freq) => {
    const labels = {
      weekly: "Weekly",
      monthly: "Monthly",
      quarterly: "Quarterly",
      occasionally: "Occasionally",
    }
    return labels[freq] || freq
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Buyer Profile</h1>
            <p className="text-blue-100">View your profile information and purchase history</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <ShoppingBag className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Profile Incomplete Notice */}
      {profile.isComplete === false && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900">Profile Incomplete</h3>
              <p className="text-sm text-amber-700">
                Your buyer profile hasn&apos;t been fully set up yet. Some information may be missing. Please contact support if you need assistance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Purchase Overview</h2>
              <p className="text-sm text-gray-600">Your shopping statistics</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Purchases</p>
                <p className="text-2xl font-bold text-blue-900">{profile.stats.totalPurchases}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-green-900">₹{profile.stats.totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Credit Points</p>
                <p className="text-2xl font-bold text-orange-900">{profile.creditPoints}</p>
              </div>
              <Wallet className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={<User className="w-5 h-5 text-gray-500" />}
            label="Full Name"
            value={profile.fullName}
          />
          <InfoField
            icon={<Mail className="w-5 h-5 text-gray-500" />}
            label="Email"
            value={profile.email}
            verified={profile.isVerified}
          />
          <InfoField
            icon={<Phone className="w-5 h-5 text-gray-500" />}
            label="Mobile Number"
            value={profile.mobileNumber}
          />
          <InfoField
            icon={<Building className="w-5 h-5 text-gray-500" />}
            label="Business Type"
            value={getBusinessTypeLabel(profile.businessType)}
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Address
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <p className="text-gray-900">{profile.address.street}</p>
            <p className="text-gray-700">
              {profile.address.city}, {profile.address.state} {profile.address.postalCode}
            </p>
            <p className="text-gray-700">{profile.address.country}</p>
            {profile.address.gstNumber && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <InfoField
                  icon={<CreditCard className="w-5 h-5 text-gray-500" />}
                  label="GST Number"
                  value={profile.address.gstNumber}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Preferences */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Purchase Preferences
          </h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Interested Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Interested Categories</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interestedCategories && profile.interestedCategories.length > 0 ? (
                profile.interestedCategories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No categories selected</span>
              )}
            </div>
          </div>

          {/* Purchase Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField
              icon={<Clock className="w-5 h-5 text-gray-500" />}
              label="Purchase Frequency"
              value={getPurchaseFrequencyLabel(profile.purchaseFrequency)}
            />
            <InfoField
              icon={<DollarSign className="w-5 h-5 text-gray-500" />}
              label="Billing Currency"
              value={profile.billingCurrency}
            />
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              {profile.paymentMethods && profile.paymentMethods.length > 0 ? (
                profile.paymentMethods.map((method, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {method}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No payment methods added</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Info */}
      {profile.currentSubscription && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Active Subscription
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">You have an active subscription</p>
          </div>
        </div>
      )}
    </div>
  )
}

const ProfilePage = () => {
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          credentials: "include",
        })
        
        if (response.ok) {
          const data = await response.json()
          setUserType(data.user.userType)
        }
      } catch (error) {
        console.error("Error fetching user type:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserType()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  // Route to appropriate profile based on user type
  if (userType === "buyer") {
    return (
      <DashboardPageWrapper requiredUserType="buyer">
        <BuyerProfileContent />
      </DashboardPageWrapper>
    )
  }

  if (userType === "designer") {
    return (
      <DashboardPageWrapper requiredUserType="designer">
        <DesignerProfileContent />
      </DashboardPageWrapper>
    )
  }

  return null
}


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default ProfilePage
