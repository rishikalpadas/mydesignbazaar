"use client"
import { useEffect, useState, useCallback } from "react"
import DashboardPageWrapper from "@/components/dashboard/DashboardPageWrapper"
import { Search, Users, Clock, CheckCircle, XCircle, Mail, User, Calendar } from "lucide-react"

const PendingDesignersContent = () => {
  const [loading, setLoading] = useState(true)
  const [designers, setDesigners] = useState([])
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
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
      }
    } catch (error) {
      console.error("Error approving designer:", error)
    }
  }

  const rejectDesigner = async (userId) => {
    try {
      const res = await fetch("/api/admin/designers/reject", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        setDesigners((prev) => prev.filter((designer) => designer.id !== userId))
        setStats((prev) => ({ ...prev, pending: prev.pending - 1 }))
      }
    } catch (error) {
      console.error("Error rejecting designer:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredDesigners = designers.filter((designer) =>
    (designer.profile?.displayName || designer.profile?.fullName || designer.email)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  )

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
                      onClick={() => approveDesigner(designer.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>

                    <button
                      onClick={() => rejectDesigner(designer.id)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
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

export default PendingDesignersPage
