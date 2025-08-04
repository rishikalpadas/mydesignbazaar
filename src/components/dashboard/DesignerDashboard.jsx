"use client"
import { useState } from "react"
import { Palette, Upload, TrendingUp, DollarSign, Eye, Download, Star } from "lucide-react"

const DesignerDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalDesigns: 0,
    approvedDesigns: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
  })

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
            <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-left transition-all duration-300 hover:shadow-lg">
              <Upload className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Upload New Design</h3>
              <p className="text-sm text-gray-500">Share your latest creation</p>
            </button>

            <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-left transition-all duration-300 hover:shadow-lg">
              <Palette className="h-8 w-8 text-indigo-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Designs</h3>
              <p className="text-sm text-gray-500">Edit and organize your portfolio</p>
            </button>

            <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-left transition-all duration-300 hover:shadow-lg">
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Track your design performance</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Designs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recent Designs
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No designs uploaded yet</p>
            <button className="mt-2 text-purple-600 hover:text-purple-700 font-medium">Upload your first design</button>
          </div>
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
