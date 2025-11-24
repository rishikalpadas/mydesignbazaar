"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Palette,
  Eye,
  Download,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Search,
  Plus,
  Upload,
  TrendingUp,
  Star,
  Calendar,
  MoreVertical,
  ExternalLink,
  Share2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"

const MyDesignsContent = () => {
  const router = useRouter()
  const [designs, setDesigns] = useState([])
  const [stats, setStats] = useState({
    totalDesigns: 0,
    approvedDesigns: 0,
    pendingDesigns: 0,
    rejectedDesigns: 0,
    totalViews: 0,
    totalDownloads: 0,
  })
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDesigns: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "newest",
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [showActions, setShowActions] = useState(null)

  const fetchDesigns = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "12",
        status: filters.status,
        sortBy: filters.sortBy,
      })

      const response = await fetch(`/api/designs/my-designs?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setDesigns(data.designs)
        setStats(data.stats)
        setPagination(data.pagination)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching designs:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.currentPage])

  useEffect(() => {
    fetchDesigns()
  }, [fetchDesigns])

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending Review",
      },
      approved: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rejected",
      },
    }

    const badge = badges[status]
    const IconComponent = badge.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const statsCards = [
    {
      name: "Total Designs",
      value: stats.totalDesigns,
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      description: "All uploaded designs",
    },
    {
      name: "Approved",
      value: stats.approvedDesigns,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      description: "Live on marketplace",
    },
    {
      name: "Pending Review",
      value: stats.pendingDesigns,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      description: "Awaiting approval",
    },
    {
      name: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "from-blue-500 to-indigo-500",
      description: "Across all designs",
    },
    {
      name: "Downloads",
      value: stats.totalDownloads,
      icon: Download,
      color: "from-indigo-500 to-purple-500",
      description: "Total downloads",
    },
    {
      name: "Rejection Rate",
      value: stats.totalDesigns > 0 ? `${Math.round((stats.rejectedDesigns / stats.totalDesigns) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      description: "Quality metric",
    },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "mostViewed", label: "Most Viewed" },
    { value: "mostDownloaded", label: "Most Downloaded" },
    { value: "title", label: "Title A-Z" },
  ]

  const statusOptions = [
    { value: "all", label: "All Designs" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ]

  if (loading && designs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your designs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Palette className="w-8 h-8 mr-3" />
              My Designs
            </h1>
            <p className="text-purple-100 mb-4">Manage and track your creative portfolio</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/upload")}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 flex items-center shadow-lg cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload New Design
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 border border-orange-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-2 shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700">{stat.name}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-orange-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search designs..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 pr-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="px-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {designs.length} of {pagination.totalDesigns} designs
          </div>
        </div>
      </div>

      {/* Designs Grid */}
      {designs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((design) => (
            <div
              key={design._id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
             
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {(() => {
                  // Try to get primary image URL from multiple sources
                  let imageUrl = null

                  // First, try the previewImageUrl (backward compatibility)
                  if (design.previewImageUrl) {
                    imageUrl = design.previewImageUrl
                  }
                  // Then try to find primary image from previewImageUrls array
                  else if (design.previewImageUrls && design.previewImageUrls.length > 0) {
                    const primaryImage = design.previewImageUrls.find((img) => img.isPrimary)
                    imageUrl = primaryImage ? primaryImage.url : design.previewImageUrls[0].url
                  }
                  // Fallback to previewImages array (direct from database)
                  else if (design.previewImages && design.previewImages.length > 0) {
                    const primaryImage = design.previewImages.find((img) => img.isPrimary) || design.previewImages[0]
                    imageUrl = `/api/uploads/designs/${design._id}/preview/${primaryImage.filename}`
                  }

                  return imageUrl ? (
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={design.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log("[v0] Image failed to load:", imageUrl)
                        // Fallback to placeholder
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                  ) : null
                })()}
                <div
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                  style={{
                    display: (() => {
                      const hasImage =
                        design.previewImageUrl ||
                        (design.previewImageUrls && design.previewImageUrls.length > 0) ||
                        (design.previewImages && design.previewImages.length > 0)
                      return hasImage ? "none" : "flex"
                    })(),
                  }}
                >
                  <div className="text-center">
                    <Palette className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No Preview</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">{getStatusBadge(design.status)}</div>

                {/* Multiple Images Indicator */}
                {(() => {
                  let imageCount = 0
                  if (design.previewImageUrls && design.previewImageUrls.length > 1) {
                    imageCount = design.previewImageUrls.length
                  } else if (design.previewImages && design.previewImages.length > 1) {
                    imageCount = design.previewImages.length
                  }

                  return imageCount > 1 ? (
                    <div className="absolute bottom-3 left-3 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {imageCount}
                    </div>
                  ) : null
                })()}

                {/* Actions Menu */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(showActions === design._id ? null : design._id)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {showActions === design._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"  onClick={()=>router.push(`/product/details/${design._id}`)}>
                          <Eye className="w-4 h-4 mr-3" />
                          View Details
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                          <Edit3 className="w-4 h-4 mr-3 cursor-pointer" />
                          Edit Design
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                          <Share2 className="w-4 h-4 mr-3 cursor-pointer" />
                          Share
                        </button>
                        {design.status === "approved" && (
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer">
                            <ExternalLink className="w-4 h-4 mr-3 cursor-pointer" />
                            View on Store
                          </button>
                        )}
                        <hr className="my-2" />
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-3 cursor-pointer" />
                          Delete Design
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center text-white text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {design.views}
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {design.downloads}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {design.likes || 0}
                        </div>
                      </div>
                      {design.featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
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

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(design.createdAt)}
                  </span>
                  <span className="px-2 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full font-medium">
                    {design.category}
                  </span>
                </div>

                {design.status === "rejected" && design.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-xs text-red-700">{design.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-12">
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Palette className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-6">
              {filters.status !== "all" || filters.search
                ? "Try adjusting your filters to see more designs."
                : "You haven't uploaded any designs yet. Start by uploading your first creative work!"}
            </p>
            <button
              onClick={() => router.push("/dashboard/upload")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg flex items-center mx-auto cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your First Design
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="hidden md:flex space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + index
                  if (pageNum <= pagination.totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          pageNum === pagination.currentPage
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg cursor-pointer"
                            : "border border-orange-200 text-gray-700 hover:bg-orange-50 cursor-pointer"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  }
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const MyDesignsPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="designer">
      <MyDesignsContent />
    </DashboardPageWrapper>
  )
}


// Disable static generation for this page (requires authentication)
export const dynamic = 'force-dynamic'

export default MyDesignsPage
