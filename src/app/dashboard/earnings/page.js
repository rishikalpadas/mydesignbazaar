"use client"
import { useState, useEffect } from "react"
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  CreditCard,
  Building,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  FileText,
  IndianRupee
} from "lucide-react"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"

const EarningsContent = () => {
  const [earnings, setEarnings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [stats, setStats] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingClearance: 0,
    totalWithdrawn: 0,
    thisMonth: 0,
    lastMonth: 0
  })
  const [withdrawals, setWithdrawals] = useState([])

  useEffect(() => {
    fetchEarnings()
  }, [filterPeriod])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual API call
      // const response = await fetch(`/api/designer/earnings?period=${filterPeriod}`)
      // const data = await response.json()

      // Mock data for now
      setEarnings([])
      setWithdrawals([])
      setStats({
        totalEarnings: 0,
        availableBalance: 0,
        pendingClearance: 0,
        totalWithdrawn: 0,
        thisMonth: 0,
        lastMonth: 0
      })
    } catch (error) {
      console.error('Error fetching earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = () => {
    // TODO: Implement withdrawal request
    alert('Withdrawal feature coming soon!')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings & Wallet</h1>
            <p className="text-yellow-100">Manage your earnings and withdraw funds</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Wallet className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-100 mb-2">Available Balance</p>
            <h2 className="text-5xl font-bold">₹{stats.availableBalance.toLocaleString()}</h2>
          </div>
          <Wallet className="w-16 h-16 text-white/30" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Pending Clearance</p>
            <p className="text-2xl font-bold">₹{stats.pendingClearance.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Total Withdrawn</p>
            <p className="text-2xl font-bold">₹{stats.totalWithdrawn.toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={stats.availableBalance === 0}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            stats.availableBalance > 0
              ? 'bg-white text-purple-600 hover:bg-purple-50 cursor-pointer'
              : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}
        >
          {stats.availableBalance > 0 ? 'Withdraw Funds' : 'No funds available'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<IndianRupee className="w-6 h-6 text-green-500" />}
          label="Total Earnings"
          value={`₹${stats.totalEarnings.toLocaleString()}`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
          label="This Month"
          value={`₹${stats.thisMonth.toLocaleString()}`}
          trend={stats.thisMonth > stats.lastMonth ? 'up' : stats.thisMonth < stats.lastMonth ? 'down' : null}
          color="blue"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-purple-500" />}
          label="Last Month"
          value={`₹${stats.lastMonth.toLocaleString()}`}
          color="purple"
        />
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Withdrawal Bank Account
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Withdrawals will be transferred to the bank account registered in your profile.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/profile'}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View/Update Bank Details →
          </button>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Earnings History
          </h2>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : earnings.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No earnings yet
            </h3>
            <p className="text-gray-500">
              Your earnings from design sales will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {earnings.map((earning) => (
              <div key={earning._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{earning.designTitle}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(earning.createdAt).toLocaleDateString()} • Order #{earning.orderId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₹{earning.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{earning.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-600" />
            Withdrawal History
          </h2>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No withdrawals yet
            </h3>
            <p className="text-gray-500">
              Your withdrawal history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 rounded-full p-3">
                      <Download className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Withdrawal to Bank</p>
                      <p className="text-sm text-gray-500">
                        {new Date(withdrawal.createdAt).toLocaleDateString()} • {withdrawal.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">-₹{withdrawal.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                      withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {withdrawal.status}
                    </span>
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

// Stat Card Component
const StatCard = ({ icon, label, value, color, trend }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
    <div className="flex items-center justify-between mb-2">
      {icon}
      {trend && (
        <span className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </span>
      )}
    </div>
    <p className={`text-sm text-${color}-600 font-medium mb-1`}>{label}</p>
    <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
  </div>
)

const EarningsPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="designer">
      <EarningsContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default EarningsPage
