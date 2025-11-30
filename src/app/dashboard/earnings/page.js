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
  const [transactions, setTransactions] = useState([])
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
  const [eligibility, setEligibility] = useState({
    isEligible: false,
    approvedDesigns: 0,
    requiredDesigns: 50,
    tier: 'not_eligible',
    earningRate: 0
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0
  })

  useEffect(() => {
    fetchWalletData()
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [filterPeriod, pagination.currentPage])

  const fetchWalletData = async () => {
    try {
      const response = await fetch('/api/designer/wallet', {
        credentials: 'include'
      })
      const data = await response.json()

      if (data.success) {
        setStats(prev => ({
          ...prev,
          totalEarnings: data.wallet.totalEarnings,
          availableBalance: data.wallet.balance,
          totalWithdrawn: data.wallet.totalWithdrawn
        }))
        setEligibility(data.eligibility)
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/designer/wallet/transactions?page=${pagination.currentPage}&limit=20`, {
        credentials: 'include'
      })
      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions)
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalTransactions: data.pagination.totalTransactions
        })

        // Calculate this month and last month earnings
        const now = new Date()
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        let thisMonth = 0
        let lastMonth = 0

        data.transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.createdAt)
          if (transaction.type === 'credit') {
            if (transactionDate >= thisMonthStart) {
              thisMonth += transaction.amount
            } else if (transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd) {
              lastMonth += transaction.amount
            }
          }
        })

        setStats(prev => ({
          ...prev,
          thisMonth,
          lastMonth
        }))
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
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
            {!eligibility.isEligible && (
              <p className="text-purple-100 text-sm mt-2">
                {eligibility.approvedDesigns}/{eligibility.requiredDesigns} approved designs (Need {eligibility.remainingDesigns} more to start earning)
              </p>
            )}
            {eligibility.isEligible && (
              <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                <p className="text-sm">
                  {eligibility.tier === 'premium' ? (
                    <span>🌟 Premium Tier - ₹25 per download</span>
                  ) : (
                    <span>⭐ Standard Tier - ₹10 per download</span>
                  )}
                </p>
              </div>
            )}
          </div>
          <Wallet className="w-16 h-16 text-white/30" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Total Earnings</p>
            <p className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Total Withdrawn</p>
            <p className="text-2xl font-bold">₹{stats.totalWithdrawn.toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={stats.availableBalance === 0 || !eligibility.isEligible}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            stats.availableBalance > 0 && eligibility.isEligible
              ? 'bg-white text-purple-600 hover:bg-purple-50 cursor-pointer'
              : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}
        >
          {!eligibility.isEligible 
            ? `Need ${eligibility.remainingDesigns} more approved designs`
            : stats.availableBalance > 0 
              ? 'Withdraw Funds' 
              : 'No funds available'}
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
          <div className="text-sm text-gray-600">
            Total: {pagination.totalTransactions} transactions
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {eligibility.isEligible ? 'No earnings yet' : 'Not eligible for earnings yet'}
            </h3>
            <p className="text-gray-500">
              {eligibility.isEligible 
                ? 'Your earnings from design downloads will appear here'
                : `You need ${eligibility.requiredDesigns} approved designs to start earning (Currently: ${eligibility.approvedDesigns})`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-3 ${
                        transaction.type === 'credit' ? 'bg-green-100' : 
                        transaction.type === 'debit' ? 'bg-red-100' : 
                        'bg-orange-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <DollarSign className="w-5 h-5 text-green-600" />
                        ) : transaction.type === 'withdrawal' ? (
                          <Download className="w-5 h-5 text-orange-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.designId?.title || 'Design Download'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {transaction.metadata?.tier && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {transaction.metadata.tier === 'premium' ? '⭐ Premium' : '⭐ Standard'}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: ₹{transaction.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
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

        <div className="text-center py-12">
          <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Withdrawal feature coming soon
          </h3>
          <p className="text-gray-500">
            You will be able to withdraw your earnings to your bank account
          </p>
        </div>
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
