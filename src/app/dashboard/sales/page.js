"use client"
import { useState, useEffect } from "react"
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Download,
  Calendar,
  Filter,
  Search,
  FileText,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  Package
} from "lucide-react"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"

const SalesContent = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    thisMonthSales: 0,
    pendingPayouts: 0
  })

  useEffect(() => {
    fetchSales()
  }, [filterStatus])

  const fetchSales = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual API call
      // const response = await fetch(`/api/designer/sales?status=${filterStatus}`)
      // const data = await response.json()

      // Mock data for now
      setSales([])
      setStats({
        totalSales: 0,
        totalRevenue: 0,
        thisMonthSales: 0,
        pendingPayouts: 0
      })
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSales = sales.filter(sale =>
    sale.designTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sales & Orders</h1>
            <p className="text-green-100">Track your design sales and order history</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <ShoppingCart className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
          label="Total Sales"
          value={stats.totalSales}
          color="blue"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-green-500" />}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
          label="This Month"
          value={stats.thisMonthSales}
          color="purple"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          label="Pending Payouts"
          value={`₹${stats.pendingPayouts.toLocaleString()}`}
          color="orange"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by design, buyer, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Sales History
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sales yet
            </h3>
            <p className="text-gray-500">
              Your design sales will appear here once buyers start purchasing
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Design
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.designTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.buyerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ₹{sale.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
    <div className="flex items-center justify-between mb-2">
      {icon}
    </div>
    <p className={`text-sm text-${color}-600 font-medium mb-1`}>{label}</p>
    <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
  </div>
)

const SalesPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="designer">
      <SalesContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default SalesPage
