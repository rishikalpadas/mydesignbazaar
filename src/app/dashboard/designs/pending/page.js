"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Palette,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  AlertTriangle,
  Shield,
  TrendingUp,
  Search,
  MoreVertical,
  Download,
  FileCheck,
  Image as ImageIcon,
  Expand,
  Globe,
  Monitor,
} from "lucide-react"
import Image from "next/image"
import DashboardPageWrapper from '../../../../components/dashboard/DashboardPageWrapper'
import JSZip from 'jszip'

const PendingDesignsContent = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [rejecting, setRejecting] = useState({}) // map of id->bool
  const [approving, setApproving] = useState({}) // map of id->bool
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showActions, setShowActions] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedDesignId, setSelectedDesignId] = useState(null)
  const [selectedReasons, setSelectedReasons] = useState([])
  const [otherReason, setOtherReason] = useState("")
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verifyingDesign, setVerifyingDesign] = useState(null)
  const [approveAsExclusive, setApproveAsExclusive] = useState(false)
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const [downloadingZip, setDownloadingZip] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/designs/pending", { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load")
      setItems(data.designs || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalPending: items.length,
    oldestPending:
      items.length > 0
        ? Math.max(...items.map((item) => Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24))))
        : 0,
    avgWaitTime:
      items.length > 0
        ? Math.round(
            items.reduce(
              (acc, item) => acc + Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24)),
              0,
            ) / items.length,
          )
        : 0,
  }

  useEffect(() => {
    load()
  }, [])

  const approveDesign = async (designId, isExclusive = false) => {
    setApproving((prev) => ({ ...prev, [designId]: true }))
    try {
      const res = await fetch("/api/admin/designs/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ designId, isExclusive }),
      })
      if (res.ok) {
        setItems((list) => list.filter((i) => i.id !== designId))
      } else {
        throw new Error("Failed to approve design")
      }
    } catch (error) {
      alert("Failed to approve design: " + error.message)
    } finally {
      setApproving((prev) => ({ ...prev, [designId]: false }))
    }
  }

  const rejectDesign = async (designId, reason) => {
    setRejecting((r) => ({ ...r, [designId]: true }))
    try {
      const res = await fetch("/api/admin/designs/reject", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ designId, reason }),
      })
      if (res.ok) {
        setItems((list) => list.filter((i) => i.id !== designId))
      } else {
        throw new Error("Failed to reject design")
      }
    } catch (error) {
      alert("Failed to reject design: " + error.message)
    } finally {
      setRejecting((r) => ({ ...r, [designId]: false }))
    }
  }

  const rejectionReasons = [
    "File is not a true vector graphic",
    "File does not match the preview images submitted",
    "File traced from raster/bitmap images (e.g., JPEG)",
    "File not properly formatted (ungrouped, disorganized layers, or incomplete)",
    "Low-resolution or pixelated elements",
    "Incorrect color profiles (not CMYK/RGB compliant)",
    "Fonts not converted to outlines or missing font files",
    "Use of unlicensed or copyrighted content",
    "Mandatory file formats missing or incomplete",
    "Excessive file size or unoptimized graphics",
    "Watermarks, logos, or personal branding present",
    "Design quality or originality below platform standards",
    "Incorrect or misleading tags, titles, or descriptions",
    "File fails to open or is corrupted",
    "Others (miscellaneous policy or technical issues)"
  ];

  const handleReject = (designId) => {
    setSelectedDesignId(designId)
    setShowRejectModal(true)
    setSelectedReasons([])
    setOtherReason("")
  }

  const handleReasonToggle = (reason) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason))
    } else {
      setSelectedReasons([...selectedReasons, reason])
    }
  }

  const handleConfirmReject = () => {
    if (selectedReasons.length === 0) {
      alert("Please select at least one reason for rejection")
      return
    }

    if (selectedReasons.includes("Others (miscellaneous policy or technical issues)") && !otherReason.trim()) {
      alert("Please provide details for 'Others' in the remarks section")
      return
    }

    let fullReason = selectedReasons.join("; ")
    if (otherReason.trim()) {
      fullReason += ` | Additional remarks: ${otherReason.trim()}`
    }

    rejectDesign(selectedDesignId, fullReason)
    setShowRejectModal(false)
  }

  const handleVerifyDesign = (design) => {
    setVerifyingDesign(design)
    setShowVerifyModal(true)
    setCurrentPreviewIndex(0)
  }

  const downloadRawFile = (design) => {
    const url = design.rawFileUrl || design.rawFileUrls?.[0]?.url
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = design.rawFileUrls?.[0]?.originalName || 'design-raw-file'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('No raw file available for download')
    }
  }

  const downloadPreviewImage = (design, index = 0) => {
    const previewUrl = design.previewImageUrls?.[index]?.url
    if (previewUrl) {
      const link = document.createElement('a')
      link.href = previewUrl
      link.download = design.previewImageUrls?.[index]?.originalName || `preview-${index + 1}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const downloadAllPreviews = async (design) => {
    if (!design.previewImageUrls || design.previewImageUrls.length === 0) {
      alert('No preview images available')
      return
    }

    setDownloadingZip(true)
    try {
      const zip = new JSZip()
      const folder = zip.folder('previews')

      // Fetch all preview images and add to zip
      const fetchPromises = design.previewImageUrls.map(async (preview, index) => {
        try {
          const response = await fetch(preview.url)
          const blob = await response.blob()
          const extension = preview.originalName.split('.').pop() || 'jpg'
          const filename = `preview-${index + 1}.${extension}`
          folder.file(filename, blob)
        } catch (error) {
          console.error(`Failed to fetch preview ${index + 1}:`, error)
        }
      })

      await Promise.all(fetchPromises)

      // Generate zip file
      const content = await zip.generateAsync({ type: 'blob' })

      // Create sanitized filename from design title
      const sanitizedTitle = design.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const zipFilename = `${sanitizedTitle}_previews.zip`

      // Download the zip
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = zipFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error creating zip:', error)
      alert('Failed to download previews as zip')
    } finally {
      setDownloadingZip(false)
    }
  }

  const filteredAndSortedItems = items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.uploadedBy?.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "title":
          return a.title.localeCompare(b.title)
        case "category":
          return a.category.localeCompare(b.category)
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24))
    return days === 0 ? "Today" : `${days} day${days === 1 ? "" : "s"} ago`
  }

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending designs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Clock className="w-8 h-8 mr-3" />
              Pending Designs
            </h1>
            <p className="text-orange-100 mb-4">Review and approve design submissions awaiting your decision</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/designs")}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 flex items-center shadow-lg cursor-pointer"
          >
            <Shield className="w-5 h-5 mr-2" />
            All Designs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-2 shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPending}</p>
            <p className="text-sm font-medium text-gray-700">Pending Designs</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting your decision</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-2 shadow-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.oldestPending}</p>
            <p className="text-sm font-medium text-gray-700">Oldest Pending</p>
            <p className="text-xs text-gray-500 mt-1">Days waiting</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-orange-100">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-2 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats.avgWaitTime}</p>
            <p className="text-sm font-medium text-gray-700">Avg Wait Time</p>
            <p className="text-xs text-gray-500 mt-1">Days on average</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search pending designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white/80 backdrop-blur-sm w-full sm:w-64"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedItems.length} of {items.length} pending designs
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No matching designs found" : "No pending designs"}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms." : "All designs have been reviewed!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedItems.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {design.previewImageUrl ? (
                    <Image
                      src={design.previewImageUrl || "/placeholder.svg"}
                      alt={design.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No Preview</p>
                      </div>
                    </div>
                  )}

                  {/* Pending Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </span>
                  </div>

                  {/* Exclusive Request Badge */}
                  {design.exclusiveRequest && (
                    <div className="absolute top-12 left-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-purple-100 text-purple-800 border-purple-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Exclusive Requested
                      </span>
                    </div>
                  )}

                  {/* Actions Menu */}
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === design.id ? null : design.id)}
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>

                      {showActions === design.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-10">
                          <button
                            onClick={() => {
                              handleVerifyDesign(design)
                              setShowActions(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center cursor-pointer font-medium"
                          >
                            <FileCheck className="w-4 h-4 mr-3" />
                            Verify Files
                          </button>
                          <button
                            onClick={() => {
                              downloadRawFile(design)
                              setShowActions(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
                          >
                            <Download className="w-4 h-4 mr-3" />
                            Download Raw File
                          </button>
                          <button
                            onClick={() => {
                              downloadAllPreviews(design)
                              setShowActions(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4 mr-3" />
                            Download All Previews
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={() => {
                              window.open(`/product/details/${design.id}`, "_blank")
                              setShowActions(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-3" />
                            View Details Page
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wait Time Indicator */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="flex justify-between items-center text-white text-sm">
                        <span className="text-xs">{getDaysAgo(design.createdAt)}</span>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs">{design.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">{design.title}</h3>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{design.description}</p>

                  {design.uploadedBy && (
                    <div className="flex items-center mb-3 text-xs text-gray-500">
                      <User className="w-3 h-3 mr-1" />
                      <span>by {design.uploadedBy.email}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(design.createdAt)}
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full font-medium">
                      {design.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveDesign(design.id)}
                        disabled={approving[design.id]}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                      >
                        {approving[design.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(design.id)}
                        disabled={rejecting[design.id]}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                      >
                        {rejecting[design.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setVerifyingDesign(design)
                        setShowVerifyModal(true)
                        setCurrentPreviewIndex(0)
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      View Tracking Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center">
                <XCircle className="w-6 h-6 mr-2" />
                Reject Design Submission
              </h3>
              <p className="text-red-100 text-sm mt-1">Select one or more reasons for rejection</p>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {rejectionReasons.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedReasons.includes(reason)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(reason)}
                      onChange={() => handleReasonToggle(reason)}
                      className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Remarks {selectedReasons.includes("Others (miscellaneous policy or technical issues)") && <span className="text-red-500">*</span>}
                  <span className={`font-normal ml-1 ${selectedReasons.includes("Others (miscellaneous policy or technical issues)") ? 'text-red-500' : 'text-gray-500'}`}>
                    ({selectedReasons.includes("Others (miscellaneous policy or technical issues)") ? 'Mandatory' : 'Optional'})
                  </span>
                </label>
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Provide additional details or context for the rejection..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {selectedReasons.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Selected Reasons:</p>
                  <ul className="text-sm text-yellow-700 list-disc list-inside">
                    {selectedReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={selectedReasons.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Verification Modal */}
      {showVerifyModal && verifyingDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center">
                    <FileCheck className="w-6 h-6 mr-2" />
                    Verify Design Files
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">{verifyingDesign.title}</p>
                </div>
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Preview Images */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Preview Images ({verifyingDesign.previewImageUrls?.length || 0})
                    </h4>

                    {/* Main Preview Display */}
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3" style={{aspectRatio: '1/1'}}>
                      {verifyingDesign.previewImageUrls?.[currentPreviewIndex] ? (
                        <Image
                          src={verifyingDesign.previewImageUrls[currentPreviewIndex].url}
                          alt={`Preview ${currentPreviewIndex + 1}`}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-400">No preview available</p>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentPreviewIndex + 1} / {verifyingDesign.previewImageUrls?.length || 0}
                      </div>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="grid grid-cols-5 gap-2">
                      {verifyingDesign.previewImageUrls?.map((preview, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPreviewIndex(idx)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            currentPreviewIndex === idx
                              ? 'border-blue-500 ring-2 ring-blue-300'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          <Image
                            src={preview.url}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => downloadPreviewImage(verifyingDesign, currentPreviewIndex)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Current Preview
                      </button>
                      <button
                        onClick={() => downloadAllPreviews(verifyingDesign)}
                        disabled={downloadingZip}
                        className="w-full px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingZip ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Creating ZIP...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Download All Previews
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Raw File Info & Actions */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Download className="w-5 h-5 mr-2 text-green-600" />
                      Raw Design File
                    </h4>

                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">File Name</p>
                        <p className="font-medium text-gray-900 break-all">
                          {verifyingDesign.rawFileUrls?.[0]?.originalName || 'N/A'}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">File Size</p>
                        <p className="font-medium text-gray-900">
                          {verifyingDesign.rawFileUrls?.[0]?.size
                            ? `${(verifyingDesign.rawFileUrls[0].size / (1024 * 1024)).toFixed(2)} MB`
                            : 'N/A'}
                        </p>
                      </div>

                      <button
                        onClick={() => downloadRawFile(verifyingDesign)}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center font-medium"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Raw File
                      </button>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                      Verification Checklist
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>Preview images match the raw file content</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>Raw file is a true vector graphic (not traced)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>File is properly formatted and organized</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>No watermarks or personal branding</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>Color profiles are correct (CMYK/RGB)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>Fonts converted to outlines (if applicable)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Design Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Design Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900">{verifyingDesign.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Designer:</span>
                        <span className="font-medium text-gray-900">{verifyingDesign.uploadedBy?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded:</span>
                        <span className="font-medium text-gray-900">{formatDate(verifyingDesign.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Tracking Info - Copyright Management */}
                  {verifyingDesign.uploadMetadata && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-purple-600" />
                        Upload Tracking (Copyright Management)
                      </h4>
                      <div className="space-y-3 text-sm">
                        {/* IP Address */}
                        {verifyingDesign.uploadMetadata.ipAddress && (
                          <div className="bg-white rounded-lg p-3 border border-purple-200">
                            <div className="flex items-start">
                              <Globe className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-gray-600 mb-1">IP Address</p>
                                <p className="font-mono font-medium text-gray-900 break-all">
                                  {verifyingDesign.uploadMetadata.ipAddress}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Device Information */}
                        {verifyingDesign.uploadMetadata.deviceInfo && (
                          <div className="bg-white rounded-lg p-3 border border-purple-200">
                            <div className="flex items-start">
                              <Monitor className="w-4 h-4 mr-2 text-purple-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-gray-600 mb-2">Device Information</p>
                                <div className="space-y-1">
                                  {verifyingDesign.uploadMetadata.deviceInfo.browser && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Browser:</span>
                                      <span className="font-medium text-gray-900">
                                        {verifyingDesign.uploadMetadata.deviceInfo.browser}
                                      </span>
                                    </div>
                                  )}
                                  {verifyingDesign.uploadMetadata.deviceInfo.os && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">OS:</span>
                                      <span className="font-medium text-gray-900">
                                        {verifyingDesign.uploadMetadata.deviceInfo.os}
                                      </span>
                                    </div>
                                  )}
                                  {verifyingDesign.uploadMetadata.deviceInfo.platform && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Platform:</span>
                                      <span className="font-medium text-gray-900">
                                        {verifyingDesign.uploadMetadata.deviceInfo.platform}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* User Agent (collapsed by default) */}
                        {verifyingDesign.uploadMetadata.userAgent && (
                          <details className="bg-white rounded-lg border border-purple-200">
                            <summary className="cursor-pointer p-3 text-gray-600 hover:text-gray-900 font-medium">
                              Full User Agent (Click to expand)
                            </summary>
                            <div className="px-3 pb-3">
                              <p className="font-mono text-xs text-gray-700 break-all leading-relaxed">
                                {verifyingDesign.uploadMetadata.userAgent}
                              </p>
                            </div>
                          </details>
                        )}

                        <div className="mt-3 pt-3 border-t border-purple-200">
                          <p className="text-xs text-gray-500 italic">
                            This information is logged for copyright verification and dispute resolution purposes.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleReject(verifyingDesign.id)
                  setShowVerifyModal(false)
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-medium transition-all flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Design
              </button>
              <button
                onClick={() => {
                  approveDesign(verifyingDesign.id, approveAsExclusive)
                  setShowVerifyModal(false)
                  setApproveAsExclusive(false)
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-medium transition-all flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Design
              </button>
            </div>

            {/* Exclusive Mark Option - Always visible to admin */}
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-purple-900 mb-1">
                    {verifyingDesign?.exclusiveRequest ? 'Exclusive Design Request' : 'Mark as Exclusive'}
                  </h4>
                  <p className="text-xs text-purple-700 mb-3">
                    {verifyingDesign?.exclusiveRequest 
                      ? 'The designer has requested this design to be marked as exclusive. Exclusive designs will display a crown icon.'
                      : 'You can mark this design as exclusive. Exclusive designs will display a crown icon and be highlighted to buyers.'}
                  </p>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={approveAsExclusive}
                      onChange={(e) => setApproveAsExclusive(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-purple-900">
                      {verifyingDesign?.exclusiveRequest 
                        ? 'Accept exclusive request and mark as exclusive'
                        : 'Mark this design as exclusive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PendingDesignsPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <PendingDesignsContent />
    </DashboardPageWrapper>
  )
}

// Disable static generation for this page (requires authentication)

export default PendingDesignsPage
