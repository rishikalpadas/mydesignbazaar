"use client"
import { useState } from "react"
import { 
  X, 
  Download, 
  FileText, 
  ExternalLink, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Briefcase, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar
} from "lucide-react"

const DesignerDetailView = ({ designer, isOpen, onClose, onApprove, onReject }) => {
  const [activeTab, setActiveTab] = useState("personal")
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  if (!isOpen || !designer) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const downloadPDF = async () => {
    setDownloadingPDF(true)
    try {
      const response = await fetch(`/api/admin/designers/${designer.id || designer._id}/download-pdf`, {
        credentials: "include",
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `designer-${designer.profile?.fullName || designer.email}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to download PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Error downloading PDF')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const viewFile = (fileUrl) => {
    if (fileUrl) {
      // Check if it's already a full URL path (starts with /)
      if (fileUrl.startsWith('/') || fileUrl.startsWith('http')) {
        window.open(fileUrl, '_blank')
      } else {
        // For old records that only have filenames, show an alert
        alert('This file was uploaded before the file storage system was implemented and cannot be viewed. The file name is: ' + fileUrl)
      }
    }
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "identity", label: "Identity & Tax", icon: CreditCard },
    { id: "banking", label: "Banking", icon: Briefcase },
    { id: "portfolio", label: "Portfolio", icon: FileText },
    { id: "agreements", label: "Agreements", icon: CheckCircle },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Designer Registration Details</h2>
              <p className="text-gray-600 mt-1">
                {designer.profile?.fullName || designer.profile?.displayName || designer.email}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadPDF}
                disabled={downloadingPDF}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloadingPDF ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-1 p-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name (as per ID proof)</label>
                    <p className="text-gray-900 font-medium">{designer.profile?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Display Name / Brand Name</label>
                    <p className="text-gray-900">{designer.profile?.displayName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-900">{designer.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile Number (with WhatsApp)</label>
                    <p className="text-gray-900">{designer.profile?.mobileNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Alternative Contact</label>
                    <p className="text-gray-900">{designer.profile?.alternativeContact || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Registration Date</label>
                    <p className="text-gray-900">{formatDate(designer.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-6">
              {designer.profile?.address ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Street Address</label>
                      <p className="text-gray-900">{designer.profile.address.street}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-gray-900">{designer.profile.address.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-gray-900">{designer.profile.address.state}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Postal Code</label>
                      <p className="text-gray-900">{designer.profile.address.postalCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-gray-900">{designer.profile.address.country}</p>
                    </div>
                    {designer.profile.gstNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">GST Number</label>
                        <p className="text-gray-900">{designer.profile.gstNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No address information available</p>
              )}
            </div>
          )}

          {/* Identity & Tax Tab */}
          {activeTab === "identity" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Aadhaar Number</label>
                    <p className="text-gray-900">{designer.profile?.aadhaarNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">PAN Card Number</label>
                    <p className="text-gray-900">{designer.profile?.panNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Document Files */}
              <div className="space-y-4">
                {designer.profile?.aadhaarFiles && designer.profile.aadhaarFiles.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Aadhaar Card Documents</label>
                    <div className="flex flex-wrap gap-2">
                      {designer.profile.aadhaarFiles.map((file, index) => (
                        <button
                          key={index}
                          onClick={() => viewFile(file)}
                          className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Aadhaar {index + 1}
                          <Eye className="w-3 h-3 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {designer.profile?.panCardFile && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">PAN Card Document</label>
                    <button
                      onClick={() => viewFile(designer.profile.panCardFile)}
                      className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      PAN Card
                      <Eye className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banking Tab */}
          {activeTab === "banking" && (
            <div className="space-y-6">
              {designer.profile?.bankDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Account Holder Name</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.accountHolderName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Account Number</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.accountNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bank Name</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.bankName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Branch</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.branch || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">IFSC/SWIFT Code</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.ifscCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">UPI ID</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.upiId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">PayPal ID</label>
                      <p className="text-gray-900">{designer.profile.bankDetails.paypalId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No banking information available</p>
              )}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              {/* Specializations */}
              {designer.profile?.specializations && designer.profile.specializations.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Design Specialization</label>
                  <div className="flex flex-wrap gap-2">
                    {designer.profile.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {designer.profile?.otherSpecialization && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Other Specialization</label>
                  <p className="text-gray-900">{designer.profile.otherSpecialization}</p>
                </div>
              )}

              {/* Portfolio Links */}
              {designer.profile?.portfolioLinks && designer.profile.portfolioLinks.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Link to Online Portfolio</label>
                  <div className="space-y-2">
                    {designer.profile.portfolioLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Portfolio Link {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Designs */}
              {designer.profile?.sampleDesigns && designer.profile.sampleDesigns.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Sample Designs</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {designer.profile.sampleDesigns.map((design, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={design}
                          alt={`Sample design ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => viewFile(design)}
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all rounded-lg"
                        >
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agreements Tab */}
          {activeTab === "agreements" && (
            <div className="space-y-6">
              {designer.profile?.agreements ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions Agreements</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">Original Work Declaration</p>
                          <p className="text-sm text-gray-600">I certify that all designs I upload are my original work</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          designer.profile.agreements.originalWork 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designer.profile.agreements.originalWork ? '✓ Agreed' : '✗ Not Agreed'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">Platform Responsibility Clause</p>
                          <p className="text-sm text-gray-600">I understand that MyDesignBazaar is not responsible for design copyright issues</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          designer.profile.agreements.noResponsibility 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designer.profile.agreements.noResponsibility ? '✓ Agreed' : '✗ Not Agreed'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">Monetization Policy</p>
                          <p className="text-sm text-gray-600">I agree to the platform's revenue sharing and monetization terms</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          designer.profile.agreements.monetizationPolicy 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designer.profile.agreements.monetizationPolicy ? '✓ Agreed' : '✗ Not Agreed'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">Platform Pricing</p>
                          <p className="text-sm text-gray-600">I agree to follow platform pricing guidelines and policies</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          designer.profile.agreements.platformPricing 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designer.profile.agreements.platformPricing ? '✓ Agreed' : '✗ Not Agreed'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">Design Removal Rights</p>
                          <p className="text-sm text-gray-600">I understand the platform's right to remove designs that violate policies</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          designer.profile.agreements.designRemoval 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designer.profile.agreements.designRemoval ? '✓ Agreed' : '✗ Not Agreed'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-gray-900">Minimum Uploads Commitment</p>
                          <p className="text-sm text-gray-600">I commit to maintaining regular design uploads as per platform requirements</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          designer.profile.agreements.minimumUploads 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {designer.profile.agreements.minimumUploads ? '✓ Agreed' : '✗ Not Agreed'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No agreement information available</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {(onApprove || onReject) && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              {onReject && (
                <button
                  onClick={() => onReject(designer)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => onApprove(designer.id || designer._id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DesignerDetailView