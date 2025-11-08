"use client"
import { useState, useEffect } from "react"
import { Palette, Upload, TrendingUp, DollarSign, Eye, Download, Star, Clock, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const DesignerDashboard = ({ user }) => {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalDesigns: 0,
    approvedDesigns: 0,
    pendingDesigns: 0,
    rejectedDesigns: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
  })
  const [recentDesigns, setRecentDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/designs/my-designs?limit=5', {
        credentials: 'include'
      })
      const statsData = await statsRes.json()

      if (statsData.success) {
        setStats({
          totalDesigns: statsData.stats.totalDesigns || 0,
          approvedDesigns: statsData.stats.approvedDesigns || 0,
          pendingDesigns: statsData.stats.pendingDesigns || 0,
          rejectedDesigns: statsData.stats.rejectedDesigns || 0,
          totalViews: statsData.stats.totalViews || 0,
          totalDownloads: statsData.stats.totalDownloads || 0,
          totalEarnings: statsData.stats.totalEarnings || 0,
          thisMonthEarnings: statsData.stats.thisMonthEarnings || 0,
        })
        setRecentDesigns(statsData.designs || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const designerStats = [
    { name: "Total Designs", value: stats.totalDesigns, icon: Palette, color: "from-purple-500 to-pink-500" },
    { name: "Approved Designs", value: stats.approvedDesigns, icon: Star, color: "from-green-500 to-emerald-500" },
    { name: "Total Views", value: stats.totalViews, icon: Eye, color: "from-blue-500 to-indigo-500" },
    { name: "Downloads", value: stats.totalDownloads, icon: Download, color: "from-indigo-500 to-purple-500" },
    {
      name: "Total Earnings",
      value: `₹${stats.totalEarnings}`,
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
    },
    { name: "This Month", value: `₹${stats.thisMonthEarnings}`, icon: TrendingUp, color: "from-orange-500 to-red-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.profile?.fullName || "Designer"}!</h1>
        <p className="text-purple-100">Ready to create and share your amazing designs today?</p>
        {!user.isApproved && (
          <div className="mt-4 bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm">⏳ Your designer application is under review. You'll be notified once approved!</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designerStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center">
              <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              className={`p-4 border border-orange-200 rounded-xl text-left transition-all duration-300 ${
                user.isApproved
                  ? 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-lg cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!user.isApproved}
              onClick={() => user.isApproved && router.push('/dashboard/upload')}
            >
              <Upload className={`h-8 w-8 mb-2 ${user.isApproved ? 'text-purple-500' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-900">Upload New Design</h3>
              <p className="text-sm text-gray-500">
                {user.isApproved ? 'Share your latest creation' : 'Available after approval'}
              </p>
            </button>

            <button
              className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-left transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => router.push('/dashboard/my-designs')}
            >
              <Palette className="h-8 w-8 text-indigo-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Designs</h3>
              <p className="text-sm text-gray-500">Edit and organize your portfolio</p>
            </button>

            <button
              className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-left transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => router.push('/dashboard/analytics')}
            >
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Track your design performance</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Designs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recent Designs
          </h2>
          {recentDesigns.length > 0 && (
            <button
              onClick={() => router.push('/dashboard/my-designs')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View All
            </button>
          )}
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : recentDesigns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No designs uploaded yet</p>
              <button
                className={`mt-2 font-medium ${
                  user.isApproved
                    ? 'text-purple-600 hover:text-purple-700 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                disabled={!user.isApproved}
                onClick={() => user.isApproved && router.push('/dashboard/upload')}
              >
                {user.isApproved ? 'Upload your first design' : 'Upload available after approval'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDesigns.map((design) => (
                <div
                  key={design._id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push('/dashboard/my-designs')}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {design.previewImages?.[0]?.url && (
                      <img
                        src={`/api/uploads/${design.previewImages[0].url}`}
                        alt={design.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      {design.status === 'approved' && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {design.status === 'pending' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                      {design.status === 'rejected' && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 truncate">{design.title}</h3>
                    <p className="text-sm text-gray-500">{design.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Earnings Overview
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Earnings chart will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesignerDashboard
