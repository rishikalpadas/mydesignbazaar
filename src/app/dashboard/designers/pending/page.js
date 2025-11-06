"use client"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import DashboardPageWrapper from '../../../../components/dashboard/DashboardPageWrapper'
import DesignerDetailView from '../../../../components/dashboard/DesignerDetailView'
import { Search, Users, Clock, CheckCircle, XCircle, Mail, User, Calendar, Eye, Phone, MapPin, CreditCard, FileText, ExternalLink, Download, X } from "lucide-react"

const PendingDesignersContent = () => {
  const [loading, setLoading] = useState(true)
  const [designers, setDesigners] = useState([])
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedDesigner, setSelectedDesigner] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    thisWeek: 0,
  })

  const fetchDesigners = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        search: searchTerm,
        sortBy: sortBy,
      })

      const res = await fetch(`/api/admin/designers/pending?${params}`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setDesigners(data.designers || [])
      setStats(data.stats || { total: 0, pending: 0, thisWeek: 0 })
    } catch (e) {
      console.error("Error fetching designers:", e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, sortBy])

  useEffect(() => {
    fetchDesigners()
  }, [fetchDesigners])

  const viewDesignerDetails = (designer) => {
    setSelectedDesigner(designer)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDesigner(null)
  }

  const openRejectModal = (designer) => {
    setSelectedDesigner(designer)
    setShowRejectModal(true)
    setRejectionReason("")
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setSelectedDesigner(null)
    setRejectionReason("")
  }

  const approveDesigner = async (userId) => {
    try {
      const res = await fetch("/api/admin/designers/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, approve: true }),
      })

      if (res.ok) {
        setDesigners((prev) => prev.filter((designer) => designer.id !== userId))
        setStats((prev) => ({ ...prev, pending: prev.pending - 1 }))
        setSuccessMessage("Designer application approved successfully")
        if (selectedDesigner && selectedDesigner.id === userId) {
          closeModal()
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000)
      }
    } catch (error) {
      console.error("Error approving designer:", error)
    }
  }

  const rejectDesigner = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      alert("Please provide a rejection reason (minimum 10 characters)")
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/designers/reject", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          userId: selectedDesigner.id,
          rejectionReason: rejectionReason.trim()
        }),
      })

      if (res.ok) {
        setDesigners((prev) => prev.filter((designer) => designer.id !== selectedDesigner.id))
        setStats((prev) => ({ ...prev, pending: prev.pending - 1 }))
        setSuccessMessage("Designer application rejected and notification email sent successfully")
        closeRejectModal()
        if (selectedDesigner && selectedDesigner.id === selectedDesigner.id) {
          closeModal()
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        const data = await res.json()
        alert(data.error || "Failed to reject designer")
      }
    } catch (error) {
      console.error("Error rejecting designer:", error)
      alert("Failed to reject designer")
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredDesigners = designers.filter((designer) => {
    const searchText = searchTerm.toLowerCase()
    const fullName = designer.profile?.fullName?.toLowerCase() || ''
    const displayName = designer.profile?.displayName?.toLowerCase() || ''
    const email = designer.email?.toLowerCase() || ''
    const mobile = designer.profile?.mobileNumber?.toLowerCase() || ''
    
    return fullName.includes(searchText) || 
           displayName.includes(searchText) || 
           email.includes(searchText) || 
           mobile.includes(searchText)
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pending Designers</h1>
            <p className="text-blue-100 text-lg">Review and approve designer applications</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700">
              <strong>Success:</strong> {successMessage}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600">{stats.thisWeek}</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search designers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading designers...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">Error: {error}</p>
            </div>
          </div>
        )}

        {!loading && filteredDesigners.length === 0 && !error && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending designers</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "No designers match your search criteria."
                : "All designer applications have been reviewed."}
            </p>
          </div>
        )}

        {!loading && filteredDesigners.length > 0 && (
          <div className="grid gap-4">
            {filteredDesigners.map((designer) => (
              <div
                key={designer.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3">
                      <User className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {designer.profile?.displayName || designer.profile?.fullName || "Unnamed Designer"}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{designer.email}</span>
                      </div>

                      {designer.createdAt && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Applied on {formatDate(designer.createdAt)}</span>
                        </div>
                      )}

                      {designer.profile?.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{designer.profile.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => viewDesignerDetails(designer)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>

                    <button
                      onClick={() => approveDesigner(designer.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>

                    <button
                      onClick={() => openRejectModal(designer)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Designer Details Modal */}
      {showModal && selectedDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Designer Registration Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-6 md:space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{selectedDesigner.profile?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Display Name</label>
                    <p className="text-gray-900">{selectedDesigner.profile?.displayName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedDesigner.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                    <p className="text-gray-900">{selectedDesigner.profile?.mobileNumber || 'N/A'}</p>
                  </div>
                  {selectedDesigner.profile?.alternativeContact && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Alternative Contact</label>
                      <p className="text-gray-900">{selectedDesigner.profile.alternativeContact}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Registration Date</label>
                    <p className="text-gray-900">{formatDate(selectedDesigner.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {selectedDesigner.profile?.address && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Street Address</label>
                      <p className="text-gray-900">{selectedDesigner.profile.address.street}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-gray-900">{selectedDesigner.profile.address.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-gray-900">{selectedDesigner.profile.address.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Postal Code</label>
                      <p className="text-gray-900">{selectedDesigner.profile.address.postalCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="text-gray-900">{selectedDesigner.profile.address.country}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Identity & Tax Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Identity & Tax Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDesigner.profile?.aadhaarNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Aadhaar Number</label>
                      <p className="text-gray-900">{selectedDesigner.profile.aadhaarNumber}</p>
                    </div>
                  )}
                  {selectedDesigner.profile?.panNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">PAN Number</label>
                      <p className="text-gray-900">{selectedDesigner.profile.panNumber}</p>
                    </div>
                  )}
                  {selectedDesigner.profile?.gstNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">GST Number</label>
                      <p className="text-gray-900">{selectedDesigner.profile.gstNumber}</p>
                    </div>
                  )}
                </div>

                {/* Document Files */}
                <div className="mt-6 space-y-4">
                  {selectedDesigner.profile?.aadhaarFiles && selectedDesigner.profile.aadhaarFiles.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Aadhaar Card Documents</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedDesigner.profile.aadhaarFiles.map((file, index) => {
                          const isValidUrl = file.startsWith('/') || file.startsWith('http')
                          return isValidUrl ? (
                            <a
                              key={index}
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Aadhaar {index + 1}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          ) : (
                            <button
                              key={index}
                              onClick={() => alert('This file was uploaded before the file storage system was implemented and cannot be viewed. The file name is: ' + file)}
                              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors cursor-not-allowed"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Aadhaar {index + 1} (unavailable)
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {selectedDesigner.profile?.panCardFile && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">PAN Card Document</label>
                      {(() => {
                        const file = selectedDesigner.profile.panCardFile
                        const isValidUrl = file.startsWith('/') || file.startsWith('http')
                        return isValidUrl ? (
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            PAN Card
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <button
                            onClick={() => alert('This file was uploaded before the file storage system was implemented and cannot be viewed. The file name is: ' + file)}
                            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors cursor-not-allowed"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            PAN Card (unavailable)
                          </button>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Details */}
              {selectedDesigner.profile?.bankDetails && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                    Bank Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDesigner.profile.bankDetails.accountHolderName && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Holder Name</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.accountHolderName}</p>
                      </div>
                    )}
                    {selectedDesigner.profile.bankDetails.accountNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Account Number</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.accountNumber}</p>
                      </div>
                    )}
                    {selectedDesigner.profile.bankDetails.bankName && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Bank Name</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.bankName}</p>
                      </div>
                    )}
                    {selectedDesigner.profile.bankDetails.branch && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Branch</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.branch}</p>
                      </div>
                    )}
                    {selectedDesigner.profile.bankDetails.ifscCode && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">IFSC Code</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.ifscCode}</p>
                      </div>
                    )}
                    {selectedDesigner.profile.bankDetails.upiId && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">UPI ID</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.upiId}</p>
                      </div>
                    )}
                    {selectedDesigner.profile.bankDetails.paypalId && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">PayPal ID</label>
                        <p className="text-gray-900">{selectedDesigner.profile.bankDetails.paypalId}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Portfolio & Specializations */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  Portfolio & Specializations
                </h3>
                
                {selectedDesigner.profile?.specializations && selectedDesigner.profile.specializations.length > 0 && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Specializations</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesigner.profile.specializations.map((spec, index) => (
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

                {selectedDesigner.profile?.otherSpecialization && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600">Other Specialization</label>
                    <p className="text-gray-900">{selectedDesigner.profile.otherSpecialization}</p>
                  </div>
                )}

                {selectedDesigner.profile?.portfolioLinks && selectedDesigner.profile.portfolioLinks.length > 0 && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Portfolio Links</label>
                    <div className="space-y-2">
                      {selectedDesigner.profile.portfolioLinks.map((link, index) => (
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

                {selectedDesigner.profile?.sampleDesigns && selectedDesigner.profile.sampleDesigns.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Sample Designs</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedDesigner.profile.sampleDesigns.map((design, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={design}
                            alt={`Sample design ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <a
                            href={design}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all rounded-lg"
                          >
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Conditions Agreements */}
              {selectedDesigner.profile?.agreements && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Terms & Conditions Agreements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Original Work Declaration</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDesigner.profile.agreements.originalWork 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDesigner.profile.agreements.originalWork ? '✓ Agreed' : '✗ Not Agreed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">No Responsibility Clause</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDesigner.profile.agreements.noResponsibility 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDesigner.profile.agreements.noResponsibility ? '✓ Agreed' : '✗ Not Agreed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Monetization Policy</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDesigner.profile.agreements.monetizationPolicy 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDesigner.profile.agreements.monetizationPolicy ? '✓ Agreed' : '✗ Not Agreed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Platform Pricing</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDesigner.profile.agreements.platformPricing 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDesigner.profile.agreements.platformPricing ? '✓ Agreed' : '✗ Not Agreed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Design Removal Rights</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDesigner.profile.agreements.designRemoval 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDesigner.profile.agreements.designRemoval ? '✓ Agreed' : '✗ Not Agreed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Minimum Uploads Commitment</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDesigner.profile.agreements.minimumUploads 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDesigner.profile.agreements.minimumUploads ? '✓ Agreed' : '✗ Not Agreed'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => openRejectModal(selectedDesigner)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => approveDesigner(selectedDesigner.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedDesigner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <XCircle className="w-6 h-6 mr-2 text-red-600" />
                  Reject Designer Application
                </h2>
                <button
                  onClick={closeRejectModal}
                  disabled={actionLoading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-red-900 mb-2">Designer Information</h3>
                <div className="space-y-1 text-sm text-red-800">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedDesigner.profile?.fullName || selectedDesigner.profile?.displayName || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedDesigner.email}
                  </p>
                  <p>
                    <span className="font-medium">Applied:</span>{" "}
                    {formatDate(selectedDesigner.createdAt)}
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <div className="flex">
                  <XCircle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-orange-800 mb-2">
                      This action will:
                    </p>
                    <ul className="list-disc list-inside text-orange-700 space-y-1">
                      <li>Permanently delete the designer application</li>
                      <li>Remove all uploaded documents and information</li>
                      <li>Send a rejection notification email to the applicant</li>
                      <li>Allow them to create a new account with the same credentials</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="rejectionReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a detailed reason for rejecting this designer application..."
                  rows="4"
                  disabled={actionLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 10 characters required. This reason will be included in the rejection email.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  disabled={actionLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={rejectDesigner}
                  disabled={
                    actionLoading ||
                    !rejectionReason.trim() ||
                    rejectionReason.trim().length < 10
                  }
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {actionLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Use New Designer Detail View Component */}
      <DesignerDetailView
        designer={selectedDesigner}
        isOpen={showModal}
        onClose={closeModal}
        onApprove={approveDesigner}
        onReject={openRejectModal}
      />
    </div>
  )
}

const PendingDesignersPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <PendingDesignersContent />
    </DashboardPageWrapper>
  )
}


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default PendingDesignersPage
