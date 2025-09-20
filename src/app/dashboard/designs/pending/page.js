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
} from "lucide-react"
import Image from "next/image"
import DashboardPageWrapper from '../../../../components/dashboard/DashboardPageWrapper'

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

  useEffect(() => {
    load()
  }, [])

  const approveDesign = async (designId) => {
    setApproving((prev) => ({ ...prev, [designId]: true }))
    try {
      const res = await fetch("/api/admin/designs/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ designId }),
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

  const handleReject = (designId) => {
    const reason = window.prompt("Please provide a reason for rejection:")
    if (reason && reason.trim()) {
      rejectDesign(designId, reason.trim())
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
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-10">
                          <button
                            onClick={() => {
                              window.open(`/design/${design.id}`, "_blank")
                              setShowActions(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-3" />
                            View Details
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

export default PendingDesignsPage
