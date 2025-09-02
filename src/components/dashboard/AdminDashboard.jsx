"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Users, Palette, ShoppingBag, TrendingUp, DollarSign, FileText, UserCheck, AlertCircle } from "lucide-react"

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDesigners: 0,
    totalBuyers: 0,
    totalDesigns: 0,
    totalSales: 0,
    pendingApprovals: 0,
  })

  const getAdminType = () => {
    switch (user.role) {
      case "super_admin":
        return "Super Admin"
      case "designer_admin":
        return "Designer Admin"
      case "buyer_admin":
        return "Buyer Admin"
      default:
        return "Admin"
    }
  }

  const getRelevantStats = () => {
    const adminType = getAdminType()

    if (adminType === "Super Admin") {
      return [
        { name: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-indigo-500" },
        { name: "Total Designers", value: stats.totalDesigners, icon: Palette, color: "from-purple-500 to-pink-500" },
        { name: "Total Buyers", value: stats.totalBuyers, icon: ShoppingBag, color: "from-green-500 to-emerald-500" },
        { name: "Total Designs", value: stats.totalDesigns, icon: FileText, color: "from-yellow-500 to-orange-500" },
        { name: "Total Sales", value: `₹${stats.totalSales}`, icon: DollarSign, color: "from-orange-500 to-red-500" },
        {
          name: "Pending Approvals",
          value: stats.pendingApprovals,
          icon: AlertCircle,
          color: "from-red-500 to-pink-500",
        },
      ]
    } else if (adminType === "Designer Admin") {
      return [
        { name: "Total Designers", value: stats.totalDesigners, icon: Palette, color: "from-purple-500 to-pink-500" },
        { name: "Total Designs", value: stats.totalDesigns, icon: FileText, color: "from-yellow-500 to-orange-500" },
        {
          name: "Pending Approvals",
          value: stats.pendingApprovals,
          icon: AlertCircle,
          color: "from-red-500 to-pink-500",
        },
      ]
    } else if (adminType === "Buyer Admin") {
      return [
        { name: "Total Buyers", value: stats.totalBuyers, icon: ShoppingBag, color: "from-green-500 to-emerald-500" },
        { name: "Total Sales", value: `₹${stats.totalSales}`, icon: DollarSign, color: "from-orange-500 to-red-500" },
      ]
    }

    return []
  }

  const relevantStats = getRelevantStats()

  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-orange-100">Here's what's happening with your platform today.</p>
        <div className="mt-2 text-sm bg-white/20 rounded-lg px-3 py-1 inline-block">
          {getAdminType()} • {user.permissions?.length || 0} Permissions
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relevantStats.map((stat, index) => (
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
          <h2 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAdminType() === "Super Admin" && (
              <>
                <button
                  onClick={() => router.push("/dashboard/designers/pending")}
                  className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg"
                >
                  <UserCheck className="h-8 w-8 text-orange-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Approve Designers</h3>
                  <p className="text-sm text-gray-500">Review pending designer applications</p>
                </button>
                <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg">
                  <Users className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-500">View and manage all users</p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/designs/pending")}
                  className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg"
                >
                  <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-500">Platform performance metrics</p>
                </button>
              </>
            )}

            {getAdminType() === "Designer Admin" && (
              <>
                <button
                  onClick={() => router.push("/dashboard/designers/pending")}
                  className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg"
                >
                  <UserCheck className="h-8 w-8 text-orange-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Approve Designers</h3>
                  <p className="text-sm text-gray-500">Review pending designer applications</p>
                </button>
                <button
                  onClick={() => router.push("/dashboard/designs/pending")}
                  className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg"
                >
                  <Palette className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Manage Designs</h3>
                  <p className="text-sm text-gray-500">Review and approve designs</p>
                </button>
              </>
            )}

            {getAdminType() === "Buyer Admin" && (
              <>
                <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg">
                  <ShoppingBag className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Manage Buyers</h3>
                  <p className="text-sm text-gray-500">View and manage buyer accounts</p>
                </button>
                <button className="p-4 border border-orange-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 text-left transition-all duration-300 hover:shadow-lg">
                  <DollarSign className="h-8 w-8 text-orange-500 mb-2" />
                  <h3 className="font-semibold text-gray-900">Payment Reports</h3>
                  <p className="text-sm text-gray-500">View payment and transaction reports</p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100">
        <div className="px-6 py-4 border-b border-orange-100">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New designer application received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New design uploaded for review</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New purchase completed</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
