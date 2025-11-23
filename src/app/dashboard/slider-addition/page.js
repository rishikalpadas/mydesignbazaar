"use client"
import { useState, useRef } from "react"
import { Upload, X, Loader2, CheckCircle, XCircle } from "lucide-react"
import DashboardPageWrapper from "../../../components/dashboard/DashboardPageWrapper"

const SliderAdditionContent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    trending: false,
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const fileInputRef = useRef(null)

  // Predefined themes - same as in HeroSlider
  const themes = [
    {
      name: "Heritage Orange",
      primary: "from-orange-500 to-amber-600",
      accent: "text-orange-600",
      bg: "from-orange-50/80 to-amber-50/80",
      badge: "bg-orange-100 text-orange-800",
    },
    {
      name: "Modern Blue",
      primary: "from-blue-500 to-indigo-600",
      accent: "text-blue-600",
      bg: "from-blue-50/80 to-indigo-50/80",
      badge: "bg-blue-100 text-blue-800",
    },
    {
      name: "Festival Pink",
      primary: "from-pink-500 to-rose-600",
      accent: "text-pink-600",
      bg: "from-pink-50/80 to-rose-50/80",
      badge: "bg-pink-100 text-pink-800",
    },
    {
      name: "Corporate Slate",
      primary: "from-slate-600 to-gray-700",
      accent: "text-slate-600",
      bg: "from-slate-50/80 to-gray-50/80",
      badge: "bg-slate-100 text-slate-800",
    },
    {
      name: "Custom Emerald",
      primary: "from-emerald-500 to-teal-600",
      accent: "text-emerald-600",
      bg: "from-emerald-50/80 to-teal-50/80",
      badge: "bg-emerald-100 text-emerald-800",
    },
  ]

  const getRandomTheme = () => {
    return themes[Math.floor(Math.random() * themes.length)]
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setPreview(null)
    fileInputRef.current.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Please enter a title" })
      return
    }

    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Please enter a description" })
      return
    }

    if (!formData.image) {
      setMessage({ type: "error", text: "Please select an image" })
      return
    }

    setLoading(true)

    try {
      // Get random theme
      const randomTheme = getRandomTheme()

      // Create FormData for file upload
      const uploadFormData = new FormData()
      uploadFormData.append("title", formData.title.trim())
      uploadFormData.append("description", formData.description.trim())
      uploadFormData.append("image", formData.image)
      uploadFormData.append("theme", JSON.stringify(randomTheme))
      uploadFormData.append("trending", formData.trending.toString())

      // Upload to server
      const response = await fetch("/api/sliders/add-slider", {
        method: "POST",
        body: uploadFormData,
      })

      if (response.ok) {
        await response.json()

        // Reset form
        setFormData({ title: "", description: "", image: null, trending: false })
        setPreview(null)
        fileInputRef.current.value = ""

        // Show success modal
        setShowSuccessModal(true)

        // Redirect after 3 seconds
        setTimeout(() => {
          window.location.href = "/dashboard/hero-sliders"
        }, 3000)
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.message || "Failed to add slider" })
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage({ type: "error", text: error.message || "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
          Add New Slider
        </h1>
        <p className="text-gray-600">
          Create a new hero slider slide. Theme will be randomly assigned from our predefined collection.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{message.text}</span>
          </div>
        )}

        {/* Image Upload */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">Image</label>

          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
            >
              <Upload className="h-12 w-12 text-orange-500 mx-auto mb-3" />
              <p className="text-gray-900 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Title */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Authentic Indian Designs"
            maxLength={100}
            className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white/50 transition-all duration-300"
          />
          <p className="text-xs text-gray-500 mt-2">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Description */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="e.g., Discover premium traditional patterns crafted by master artisans"
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white/50 transition-all duration-300 resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Trending Checkbox */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="trending"
              checked={formData.trending}
              onChange={handleInputChange}
              className="w-5 h-5 accent-orange-500 cursor-pointer"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              Mark as trending
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-2 ml-8">
            Shows a trending badge on the slider
          </p>
        </div>

        {/* Theme Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Theme Preview</h3>
          <p className="text-xs text-gray-600 mb-4">
            A random theme will be assigned from these options when you submit:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map((theme, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 border-transparent bg-gradient-to-br ${theme.bg}`}
              >
                <div className={`h-8 rounded-md bg-gradient-to-r ${theme.primary} shadow-md`}></div>
                <p className="text-xs text-gray-700 mt-2 font-medium">{theme.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Slider"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({ title: "", description: "", image: null, trending: false })
              setPreview(null)
              fileInputRef.current.value = ""
            }}
            className="px-6 py-3 border border-orange-200 rounded-xl font-semibold text-orange-600 hover:bg-orange-50 transition-all duration-300"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-[scale-in_0.3s_ease-out]">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-4">
                  <CheckCircle className="h-16 w-16 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Slider Added Successfully!
              </h3>
              <p className="text-gray-600 mb-2">
                Your new slider has been created with a random theme.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to sliders management...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-[progress_3s_ease-in-out]"></div>
              </div>
            </div>

            {/* Manual Navigation Button */}
            <button
              onClick={() => window.location.href = "/dashboard/hero-sliders"}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Go to Sliders Now
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

const SliderAddition = () => {
  return (
    <DashboardPageWrapper requiredUserType="admin">
      <SliderAdditionContent />
    </DashboardPageWrapper>
  )
}

export const dynamic = 'force-dynamic'

export default SliderAddition
