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
      <div className="bg-gradient-to-br from-yellow-50 via-lime-50 to-green-50 rounded-2xl shadow-2xl border-2 border-yellow-200 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-100 to-lime-100 px-8 py-6 border-b-2 border-yellow-300">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">My Design Bazaar Partner Program Eligibility</h2>
            <p className="text-base text-gray-700 font-medium">Earn commission on sold designs once eligible</p>
          </div>
        </div>

        <div className="p-8">
          {/* Milestone Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* First Milestone - 50 Designs (Highlighted) */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-pink-400 ring-4 ring-pink-300 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-full p-4 shadow-lg">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-6xl font-black text-gray-900 mb-2">50</div>
                  <div className="text-xl font-bold text-gray-600 mb-4">Designs</div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-700 ease-out rounded-full"
                      style={{ width: `${Math.min((profile.stats.approvedDesigns / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-2">₹10/Design</div>
                </div>
                <div className="text-center text-sm text-gray-500 font-medium">
                  Progress: {Math.min(profile.stats.approvedDesigns, 50)}/50 designs
                </div>
              </div>
            </div>

            {/* Two Small Milestone Cards */}
            <div className="space-y-6">
              {/* 100 Designs Milestone */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-3 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-4xl font-black text-gray-900">100</div>
                        <div className="text-sm font-bold text-gray-600">Designs</div>
                      </div>
                    </div>
                    {profile.stats.approvedDesigns >= 100 && (
                      <div className="bg-blue-500 text-white rounded-full p-2">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 ease-out rounded-full"
                      style={{ width: `${Math.min((profile.stats.approvedDesigns / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">₹25/Design</div>
                  <div className="text-xs text-gray-500 mt-1">Current Progress: {profile.stats.approvedDesigns}/100 designs</div>
                </div>
              </div>

              {/* 500 Designs Milestone */}
              <div className={`bg-white rounded-xl shadow-lg border-2 ${profile.stats.approvedDesigns >= 500 ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-gray-200'} p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-bl-full opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full p-3 shadow-lg">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-4xl font-black text-gray-900">500</div>
                        <div className="text-sm font-bold text-gray-600">Designs</div>
                      </div>
                    </div>
                    {profile.stats.approvedDesigns >= 500 && (
                      <div className="bg-emerald-500 text-white rounded-full p-2">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out rounded-full"
                      style={{ width: `${Math.min((profile.stats.approvedDesigns / 500) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">6 month free Featured Designer</div>
                  <div className="text-xs text-gray-500 mt-1">Current Progress: {profile.stats.approvedDesigns}/500 designs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {profile.stats.approvedDesigns < 100 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500 rounded-full p-3 flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-lg mb-2">Keep Creating Amazing Designs!</h4>
                  <p className="text-amber-800 font-medium">
                    You need <strong className="text-2xl">{100 - profile.stats.approvedDesigns}</strong> more approved designs to reach the base threshold of 100 designs.
                    Unlock earning potential of <strong>₹25 per design sold</strong>!
                  </p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900">Next: 50 designs → ₹10/design</span>
                      </div>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 border border-amber-200">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900">Goal: 500 designs → Featured!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {profile.stats.approvedDesigns >= 100 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 rounded-full p-3 flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-lg mb-2">🎉 Congratulations! You&apos;re Eligible for Monetization!</h4>
                  <p className="text-green-800 font-medium mb-4">
                    You&apos;ve reached <strong className="text-xl">{profile.stats.approvedDesigns}</strong> approved designs! 
                    You now earn <strong>₹25 per design sold</strong>. Your earnings will be tracked in your wallet.
                  </p>
                  {profile.stats.approvedDesigns < 500 && (
                    <div className="bg-white/70 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-900">
                          Keep going! {500 - profile.stats.approvedDesigns} more designs to become a Featured Designer for 6 months FREE!
                        </span>
                      </div>
                    </div>
                  )}
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
