"use client"
import { useState, useEffect } from "react"
import {
  BarChart3,
  TrendingUp,
  Eye,
  Download,
  Heart,
  Star,
  Users,
  Calendar,
  Palette,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"

const AnalyticsContent = () => {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30days")
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 0,
      totalDownloads: 0,
      totalLikes: 0,
      totalShares: 0,
      avgRating: 0
    },
    topDesigns: [],
    viewsByCategory: [],
    performance: {
      viewsChange: 0,
      downloadsChange: 0,
      likesChange: 0
    }
  })

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual API call
      // const response = await fetch(`/api/designer/analytics?period=${period}`)
      // const data = await response.json()

      // Mock data for now
      setAnalytics({
        overview: {
          totalViews: 0,
          totalDownloads: 0,
          totalLikes: 0,
          totalShares: 0,
          avgRating: 0
        },
        topDesigns: [],
        viewsByCategory: [],
        performance: {
          viewsChange: 0,
          downloadsChange: 0,
          likesChange: 0
        }
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
            <p className="text-indigo-100">Track your design performance and engagement</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <BarChart3 className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Time Period</h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Eye className="w-6 h-6 text-blue-500" />}
          label="Total Views"
          value={analytics.overview.totalViews.toLocaleString()}
          change={analytics.performance.viewsChange}
          color="blue"
        />
        <MetricCard
          icon={<Download className="w-6 h-6 text-green-500" />}
          label="Downloads"
          value={analytics.overview.totalDownloads.toLocaleString()}
          change={analytics.performance.downloadsChange}
          color="green"
        />
        <MetricCard
          icon={<Heart className="w-6 h-6 text-pink-500" />}
          label="Likes"
          value={analytics.overview.totalLikes.toLocaleString()}
          change={analytics.performance.likesChange}
          color="pink"
        />
        <MetricCard
          icon={<Star className="w-6 h-6 text-yellow-500" />}
          label="Avg Rating"
          value={analytics.overview.avgRating.toFixed(1)}
          color="yellow"
        />
      </div>

      {/* Top Performing Designs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Top Performing Designs
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : analytics.topDesigns.length === 0 ? (
          <div className="text-center py-12">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data available
            </h3>
            <p className="text-gray-500">
              Upload designs to start tracking performance
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Design
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.topDesigns.map((design) => (
                  <tr key={design._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={design.thumbnail}
                            alt={design.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {design.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {design.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {design.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {design.downloads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {design.likes.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {design.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Views by Category */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Views by Category
          </h2>
        </div>

        {analytics.viewsByCategory.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No category data
            </h3>
            <p className="text-gray-500">
              Data will appear once you have designs in multiple categories
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {analytics.viewsByCategory.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.views.toLocaleString()} views ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Key Insights
          </h3>
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                💡 Your designs in <strong>Womenswear</strong> category get the most views
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                📈 Your engagement rate has increased by <strong>15%</strong> this month
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                ⭐ Average rating across all designs: <strong>4.5/5</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Recommendations
          </h3>
          <div className="space-y-3">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800">
                🎯 Consider uploading more designs in your top-performing categories
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                🔍 Add relevant tags to improve discoverability
              </p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <p className="text-sm text-pink-800">
                💬 Respond to buyer feedback to improve ratings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component with Change Indicator
const MetricCard = ({ icon, label, value, change, color }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-6`}>
    <div className="flex items-center justify-between mb-2">
      {icon}
      {change !== undefined && change !== 0 && (
        <span className={`flex items-center text-sm font-medium ${
          change > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className={`text-sm text-${color}-600 font-medium mb-1`}>{label}</p>
    <p className={`text-3xl font-bold text-${color}-900`}>{value}</p>
  </div>
)

const AnalyticsPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="designer">
      <AnalyticsContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default AnalyticsPage
