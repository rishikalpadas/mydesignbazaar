"use client"
import { useState, useEffect } from "react"
import { Image as ImageIcon, Trash2, Eye, EyeOff, Plus, Loader2, RefreshCw } from "lucide-react"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"
import { useRouter } from "next/navigation"

const HeroSlidersContent = () => {
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [deletingId, setDeletingId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const router = useRouter()

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sliders/add-slider")

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched sliders:", data.sliders?.length || 0)
        if (data.sliders && data.sliders.length > 0) {
          console.log("Sample slider IDs:", data.sliders.map(s => s._id).slice(0, 3))
        }
        setSliders(data.sliders || [])
      } else {
        setMessage({ type: "error", text: "Failed to fetch sliders" })
      }
    } catch (error) {
      console.error("Error fetching sliders:", error)
      setMessage({ type: "error", text: "An error occurred while fetching sliders" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSliders()
  }, [])

  const handleDelete = async (sliderId) => {
    if (!confirm("⚠️ Are you sure you want to delete this slider?\n\nThis action cannot be undone and the image file will be permanently deleted.")) {
      return
    }

    // Convert to string to ensure correct format
    const sliderIdString = String(sliderId)

    console.log("Deleting slider with ID:", sliderIdString)
    console.log("ID type:", typeof sliderIdString)
    console.log("ID length:", sliderIdString?.length)

    // Clear any existing messages
    setMessage({ type: "", text: "" })
    setDeletingId(sliderId)

    try {
      const response = await fetch(`/api/sliders/${sliderIdString}`, {
        method: "DELETE",
      })

      console.log("Delete response status:", response.status)

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Slider and associated image deleted successfully!"
        })
        fetchSliders() // Refresh the list

        // Auto-clear message after 5 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" })
        }, 5000)
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to delete slider" })
      }
    } catch (error) {
      console.error("Error deleting slider:", error)
      setMessage({ type: "error", text: "An error occurred while deleting. Please try again." })
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (sliderId, currentStatus) => {
    // Convert to string to ensure correct format
    const sliderIdString = String(sliderId)

    console.log("Toggling slider:", sliderIdString, "Current status:", currentStatus)
    console.log("ID type:", typeof sliderIdString)
    console.log("ID length:", sliderIdString?.length)

    // Clear any existing messages
    setMessage({ type: "", text: "" })
    setTogglingId(sliderId)

    try {
      const response = await fetch(`/api/sliders/${sliderIdString}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      console.log("Toggle response status:", response.status)

      if (response.ok) {
        const action = !currentStatus ? "activated" : "deactivated"
        setMessage({
          type: "success",
          text: `Slider ${action} successfully! ${!currentStatus ? "It will now appear on the homepage." : "It is now hidden from the homepage."}`
        })
        fetchSliders() // Refresh the list

        // Auto-clear message after 5 seconds
        setTimeout(() => {
          setMessage({ type: "", text: "" })
        }, 5000)
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to update slider" })
      }
    } catch (error) {
      console.error("Error updating slider:", error)
      setMessage({ type: "error", text: "An error occurred while updating. Please try again." })
    } finally {
      setTogglingId(null)
    }
  }

  // Calculate stats
  const totalSliders = sliders.length
  const activeSliders = sliders.filter(s => s.isActive).length
  const inactiveSliders = totalSliders - activeSliders
  const trendingSliders = sliders.filter(s => s.trending).length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Hero Sliders Management
          </h1>
          <p className="text-gray-600">
            Manage hero sliders displayed on the homepage
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSliders}
            className="flex items-center gap-2 px-4 py-2 border border-orange-200 rounded-xl font-medium text-orange-600 hover:bg-orange-50 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => router.push("/dashboard/slider-addition")}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add New Slider
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && sliders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Sliders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalSliders}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeSliders}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Inactive</p>
                <p className="text-3xl font-bold text-gray-500 mt-1">{inactiveSliders}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl">
                <EyeOff className="h-6 w-6 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Trending</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{trendingSliders}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Alert */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        </div>
      ) : sliders.length === 0 ? (
        // Empty State
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-orange-100">
          <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Sliders Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first hero slider
          </p>
          <button
            onClick={() => router.push("/dashboard/slider-addition")}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Add Your First Slider
          </button>
        </div>
      ) : (
        // Sliders Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sliders.map((slider) => (
            <div
              key={slider._id}
              className={`bg-white rounded-2xl shadow-lg border ${
                slider.isActive ? "border-orange-200" : "border-gray-200"
              } overflow-hidden transition-all duration-300 hover:shadow-xl`}
            >
              {/* Slider Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                />
                {slider.trending && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Trending
                  </div>
                )}
                {!slider.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-lg font-semibold text-gray-900">
                      Inactive
                    </div>
                  </div>
                )}
              </div>

              {/* Slider Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {slider.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {slider.description}
                </p>

                {/* Theme Preview */}
                {slider.theme && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-6 w-20 rounded bg-gradient-to-r ${slider.theme.primary}`}></div>
                      <span className="text-xs text-gray-500">{slider.theme.name}</span>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>Order: #{slider.order}</span>
                  <span>
                    {new Date(slider.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleToggleActive(slider._id, slider.isActive)}
                    disabled={togglingId === slider._id}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      slider.isActive
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {togglingId === slider._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : slider.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(slider._id)}
                    disabled={deletingId === slider._id}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === slider._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const HeroSlidersPage = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <HeroSlidersContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default HeroSlidersPage
