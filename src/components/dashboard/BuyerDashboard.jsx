"use client"
import { useState, useEffect } from "react"
import { ShoppingBag, Download, Heart, CreditCard, Search, Star, TrendingUp, Zap, Calendar } from "lucide-react"

const BuyerDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalDownloads: 0,
    wishlistItems: 0,
    totalSpent: 0,
    thisMonthSpent: 0,
    favoriteDesigners: 0,
  })

  const [subscription, setSubscription] = useState(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [userCredits, setUserCredits] = useState(null)
  const [basicPlan, setBasicPlan] = useState(null)
  const [premiumPlan, setPremiumPlan] = useState(null)
  const [elitePlan, setElitePlan] = useState(null)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription/status", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
        
        // Separate admin credits and subscription plans
        if (data.subscription?.adminCredits) {
          setUserCredits(data.subscription.adminCredits)
        }
        
        // Find and set individual plans from allSubscriptions
        if (data.subscription?.allSubscriptions && data.subscription.allSubscriptions.length > 0) {
          const basic = data.subscription.allSubscriptions.find(sub => sub.planId === 'basic' && sub.status === 'active')
          const premium = data.subscription.allSubscriptions.find(sub => sub.planId === 'premium' && sub.status === 'active')
          const elite = data.subscription.allSubscriptions.find(sub => sub.planId === 'elite' && sub.status === 'active')
          
          setBasicPlan(basic || null)
          setPremiumPlan(premium || null)
          setElitePlan(elite || null)
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
    } finally {
      setLoadingSubscription(false)
    }
  }

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

      {/* Subscription Cards */}
      {!loadingSubscription && (
        <div className="space-y-4">
          {/* Admin Credits Card - Emerald Green */}
          {userCredits && userCredits.remaining > 0 && (
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl border-2 border-emerald-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Admin Credits</h2>
                    <p className="text-emerald-100 text-sm">Bonus Credits Added</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-3xl font-bold">{userCredits.remaining}</p>
                    <p className="text-xs text-emerald-100">Credits Available</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-emerald-100 text-xs mb-1">Total Credits</p>
                  <p className="text-lg font-semibold">{userCredits.total}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs mb-1">Used</p>
                  <p className="text-lg font-semibold">{userCredits.used}</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Status
                  </p>
                  <p className="text-lg font-semibold">{userCredits.status}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-500"
                        style={{
                          width: `${(userCredits.remaining / userCredits.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-100 ml-4">
                    {Math.round((userCredits.remaining / userCredits.total) * 100)}% remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Plan Card - Pink */}
          {basicPlan && (
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl border-2 border-pink-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{basicPlan.planName} Plan</h2>
                    <p className="text-pink-100 text-sm">Active Subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-3xl font-bold">{basicPlan.creditsRemaining}</p>
                    <p className="text-xs text-pink-100">Credits Available</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-pink-100 text-xs mb-1">Total Credits</p>
                  <p className="text-lg font-semibold">{basicPlan.creditsTotal}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-xs mb-1">Used</p>
                  <p className="text-lg font-semibold">{basicPlan.creditsUsed}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-xs mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires in
                  </p>
                  <p className="text-lg font-semibold">
                    {Math.ceil((new Date(basicPlan.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-500"
                        style={{
                          width: `${(basicPlan.creditsRemaining / basicPlan.creditsTotal) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-pink-100 ml-4">
                    {Math.round((basicPlan.creditsRemaining / basicPlan.creditsTotal) * 100)}% remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Premium Plan Card - Blue */}
          {premiumPlan && (
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl border-2 border-blue-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{premiumPlan.planName} Plan</h2>
                    <p className="text-blue-100 text-sm">Active Subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-3xl font-bold">{premiumPlan.creditsRemaining}</p>
                    <p className="text-xs text-blue-100">Credits Available</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-blue-100 text-xs mb-1">Total Credits</p>
                  <p className="text-lg font-semibold">{premiumPlan.creditsTotal}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs mb-1">Used</p>
                  <p className="text-lg font-semibold">{premiumPlan.creditsUsed}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires in
                  </p>
                  <p className="text-lg font-semibold">
                    {Math.ceil((new Date(premiumPlan.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-500"
                        style={{
                          width: `${(premiumPlan.creditsRemaining / premiumPlan.creditsTotal) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-100 ml-4">
                    {Math.round((premiumPlan.creditsRemaining / premiumPlan.creditsTotal) * 100)}% remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Elite Plan Card - Purple */}
          {elitePlan && (
            <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl border-2 border-purple-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{elitePlan.planName} Plan</h2>
                    <p className="text-purple-100 text-sm">Active Subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-3xl font-bold">{elitePlan.creditsRemaining}</p>
                    <p className="text-xs text-purple-100">Credits Available</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-purple-100 text-xs mb-1">Total Credits</p>
                  <p className="text-lg font-semibold">{elitePlan.creditsTotal}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-xs mb-1">Used</p>
                  <p className="text-lg font-semibold">{elitePlan.creditsUsed}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-xs mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires in
                  </p>
                  <p className="text-lg font-semibold">
                    {Math.ceil((new Date(elitePlan.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-500"
                        style={{
                          width: `${(elitePlan.creditsRemaining / elitePlan.creditsTotal) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-purple-100 ml-4">
                    {Math.round((elitePlan.creditsRemaining / elitePlan.creditsTotal) * 100)}% remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* No Active Subscription Card */}
          {!userCredits && !basicPlan && !premiumPlan && !elitePlan && (
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 shadow-lg border-2 border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 rounded-full p-3">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">No Active Subscription</h2>
                    <p className="text-gray-600 text-sm">Subscribe to download unlimited designs</p>
                  </div>
                </div>
                <a
                  href="/pricing"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  View Plans
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-200 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">10</p>
                  <p className="text-xs text-gray-600">Basic - ₹600/mo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100</p>
                  <p className="text-xs text-gray-600">Premium - ₹5,000/mo</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1200</p>
                  <p className="text-xs text-gray-600">Elite - ₹50,000/mo</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
