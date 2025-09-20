"use client"
import { useState } from "react"
import { ShoppingBag, Download, Heart, CreditCard, Search, Star, TrendingUp } from "lucide-react"

const BuyerDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalDownloads: 0,
    wishlistItems: 0,
    totalSpent: 0,
    thisMonthSpent: 0,
    favoriteDesigners: 0,
  })

  const buyerStats = [
    { name: "Total Purchases", value: stats.totalPurchases, icon: ShoppingBag, color: "from-green-500 to-emerald-500" },
    { name: "Downloads", value: stats.totalDownloads, icon: Download, color: "from-blue-500 to-indigo-500" },
    { name: "Wishlist Items", value: stats.wishlistItems, icon: Heart, color: "from-red-500 to-pink-500" },
    { name: "Total Spent", value: `₹${stats.totalSpent}`, icon: CreditCard, color: "from-indigo-500 to-purple-500" },
    { name: "This Month", value: `₹${stats.thisMonthSpent}`, icon: TrendingUp, color: "from-purple-500 to-pink-500" },
    { name: "Favorite Designers", value: stats.favoriteDesigners, icon: Star, color: "from-yellow-500 to-orange-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.profile?.fullName || "Buyer"}!</h1>
        <p className="text-green-100">Discover amazing designs from talented creators around India.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buyerStats.map((stat, index) => (
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
          <h2 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 text-left transition-all duration-300 hover:shadow-lg cursor-pointer">
              <Search className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold text-gray-900">Browse Designs</h3>
              <p className="text-sm text-gray-500">Discover new creative works</p>
            </button>

            <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 text-left transition-all duration-300 hover:shadow-lg cursor-pointer">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="font-semibold text-gray-900">My Wishlist</h3>
              <p className="text-sm text-gray-500">View saved designs</p>
            </button>

            <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 text-left transition-all duration-300 hover:shadow-lg">
              <Download className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-900">My Downloads</h3>
              <p className="text-sm text-gray-500">Access purchased designs</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Recent Purchases
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No purchases yet</p>
            <button className="mt-2 text-green-600 hover:text-green-700 font-medium">
              Browse designs to get started
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Designs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Recommended for You
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Personalized recommendations will appear here</p>
            <p className="text-sm mt-1">Based on your preferences and purchase history</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerDashboard
