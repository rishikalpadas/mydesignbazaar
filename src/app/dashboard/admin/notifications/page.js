"use client"
import { useState, useEffect } from "react"
import { Bell, Send, Users, User, Check, AlertCircle, X, Search } from "lucide-react"
import DashboardPageWrapper from "../../../../components/dashboard/DashboardPageWrapper"

const SendNotificationContent = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    sendTo: 'all',
    specificUserIds: [],
    link: ''
  })

  // Fetch users when 'specific' is selected
  useEffect(() => {
    if (formData.sendTo === 'specific') {
      fetchUsers()
    }
  }, [formData.sendTo])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = allUsers.filter(user => 
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, allUsers])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('/api/admin/users/list', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setAllUsers(data.users)
        setFilteredUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const toggleUserSelection = (userId) => {
    setFormData(prev => {
      const isSelected = prev.specificUserIds.includes(userId)
      return {
        ...prev,
        specificUserIds: isSelected
          ? prev.specificUserIds.filter(id => id !== userId)
          : [...prev.specificUserIds, userId]
      }
    })
  }

  const removeUser = (userId) => {
    setFormData(prev => ({
      ...prev,
      specificUserIds: prev.specificUserIds.filter(id => id !== userId)
    }))
  }

  const getSelectedUsers = () => {
    return allUsers.filter(user => formData.specificUserIds.includes(user._id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`Notification sent to ${data.count} user(s) successfully!`)
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'info',
          sendTo: 'all',
          specificUserIds: [],
          link: ''
        })
        setSearchQuery('')
      } else {
        setError(data.error || 'Failed to send notification')
      }
    } catch (err) {
      console.error('Send notification error:', err)
      setError('Failed to send notification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Send Notifications</h1>
            <p className="text-blue-100">Send notifications to users across the platform</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Bell className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Notification Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipients Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Send To
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'all', label: 'Everyone', icon: Users },
                { value: 'all_buyers', label: 'All Buyers', icon: User },
                { value: 'all_designers', label: 'All Designers', icon: User },
                { value: 'specific', label: 'Specific User', icon: User }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, sendTo: option.value }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.sendTo === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <option.icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Specific User ID Input */}
          {formData.sendTo === 'specific' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Select Users <span className="text-red-500">*</span>
              </label>

              {/* Selected Users Display */}
              {formData.specificUserIds.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {getSelectedUsers().map(user => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      <span>{user.name || user.email}</span>
                      <span className="text-xs text-blue-500">({user.userType})</span>
                      <button
                        type="button"
                        onClick={() => removeUser(user._id)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Users Dropdown */}
              {loadingUsers ? (
                <div className="text-center py-4 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2">Loading users...</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredUsers.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">No users found</p>
                  ) : (
                    filteredUsers.map(user => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => toggleUserSelection(user._id)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          formData.specificUserIds.includes(user._id)
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.userType === 'buyer' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {user.userType}
                            </span>
                            {formData.specificUserIds.includes(user._id) && (
                              <Check className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              <p className="text-sm text-gray-500">
                {formData.specificUserIds.length} user(s) selected
              </p>
            </div>
          )}

          {/* Notification Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-2">
              Notification Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title"
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter notification message"
              maxLength={1000}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formData.message.length}/1000 characters</p>
          </div>

          {/* Link (Optional) */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-900 mb-2">
              Link (Optional)
            </label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="e.g., /dashboard or https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Users can click the notification to navigate to this link
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (formData.sendTo === 'specific' && formData.specificUserIds.length === 0)}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
              loading || (formData.sendTo === 'specific' && formData.specificUserIds.length === 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Notification
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

const SendNotificationPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <SendNotificationContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default SendNotificationPage
