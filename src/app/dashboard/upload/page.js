"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  X, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Palette,
  Tag,
  Type,
  FileImage
} from 'lucide-react'
import Image from "next/image"

const CATEGORIES = [
  'Infantwear',
  'Kidswear', 
  'Menswear',
  'Womenswear',
  'Typography',
  'Floral',
  'AI-Generated'
]

const UploadPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [previewImageUrl, setPreviewImageUrl] = useState(null)
  const [rawFiles, setRawFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePreviewImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type - check both MIME type and extension
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp']
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setErrors(prev => ({
        ...prev,
        previewImage: 'Please select a JPG, PNG, or WebP image'
      }))
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        previewImage: 'Image must be less than 5MB'
      }))
      return
    }

    setPreviewImage(file)
    setPreviewImageUrl(URL.createObjectURL(file))
    setErrors(prev => ({
      ...prev,
      previewImage: ''
    }))
  }

  const handleRawFilesChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = []
    const fileErrors = []

    files.forEach(file => {
      // Check file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        fileErrors.push(`${file.name} is too large (max 50MB)`)
        return
      }

      // Check file type by extension
      const allowedExtensions = ['psd', 'pdf', 'ai', 'cdr', 'eps', 'svg']
      const extension = file.name.split('.').pop().toLowerCase()
      
      if (!allowedExtensions.includes(extension)) {
        fileErrors.push(`${file.name} has an unsupported format`)
        return
      }

      validFiles.push(file)
    })

    if (fileErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        rawFiles: fileErrors.join(', ')
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        rawFiles: ''
      }))
    }

    setRawFiles(prev => [...prev, ...validFiles])
  }

  const removeRawFile = (index) => {
    setRawFiles(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!previewImage) newErrors.previewImage = 'Preview image is required'
    if (rawFiles.length === 0) newErrors.rawFiles = 'At least one raw file is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)
    
    return interval
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setSuccess(false)
    
    // Start progress simulation
    const progressInterval = simulateProgress()

    try {
      const submitData = new FormData()
      
      // Add text fields
      submitData.append('title', formData.title.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('category', formData.category)
      submitData.append('tags', formData.tags.trim())
      
      // Add preview image
      submitData.append('previewImage', previewImage)
      
      // Add raw files
      rawFiles.forEach(file => {
        submitData.append('rawFiles', file)
      })

      const response = await fetch('/api/designs/upload', {
        method: 'POST',
        body: submitData,
      })

      const result = await response.json()

      if (response.ok) {
        // Complete progress
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        setTimeout(() => {
          setSuccess(true)
          setTimeout(() => {
            router.push('/dashboard/my-designs')
          }, 2000)
        }, 500)
      } else {
        throw new Error(result.error || 'Upload failed')
      }

    } catch (error) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    const iconClass = "w-4 h-4"
    
    switch(ext) {
      case 'psd': return <Palette className={`${iconClass} text-blue-600`} />
      case 'pdf': return <FileText className={`${iconClass} text-red-600`} />
      case 'ai': return <Palette className={`${iconClass} text-orange-600`} />
      case 'cdr': return <Palette className={`${iconClass} text-green-600`} />
      case 'eps': return <FileImage className={`${iconClass} text-purple-600`} />
      case 'svg': return <FileImage className={`${iconClass} text-indigo-600`} />
      default: return <FileText className={`${iconClass} text-gray-600`} />
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
          <p className="text-gray-600 mb-4">Your design has been uploaded and is pending approval.</p>
          <p className="text-sm text-gray-500">Redirecting to your designs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Upload New Design</h1>
        <p className="text-purple-100">Share your creative work with our community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center">
            <Type className="w-5 h-5 mr-2 text-purple-600" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter design title"
                className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
                maxLength={100}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your design..."
              rows={4}
              className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              <p className="text-gray-500 text-sm">{formData.description.length}/1000</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="floral, vintage, elegant, modern..."
              className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
            <p className="text-gray-500 text-sm mt-1">Add relevant tags to help users find your design</p>
          </div>
        </div>

        {/* File Uploads */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-purple-600" />
            File Uploads
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Preview Image * (JPG, PNG, WebP - Max 5MB)
              </label>
              
              <div className="relative border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-orange-50 to-amber-50">
                {previewImageUrl ? (
                  <div className="space-y-4">
                    <Image
                      src={previewImageUrl}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">{previewImage?.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null)
                        setPreviewImageUrl(null)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload preview image</p>
                    <p className="text-sm text-gray-500">This will be shown to users browsing designs</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  onChange={handlePreviewImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {errors.previewImage && <p className="text-red-500 text-sm mt-1">{errors.previewImage}</p>}
            </div>

            {/* Raw Files */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <FileText className="w-4 h-4 inline mr-1" />
                Raw Files * (PSD, AI, PDF, CDR, EPS, SVG - Max 50MB each)
              </label>
              
              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gradient-to-br from-orange-50 to-amber-50">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Add Raw Files</p>
                  <p className="text-sm text-gray-500">Select multiple files if needed</p>
                  <input
                    type="file"
                    accept=".psd,.ai,.pdf,.cdr,.eps,.svg,application/x-photoshop,application/pdf,application/postscript,application/illustrator,image/svg+xml,application/x-coreldraw,application/eps"
                    onChange={handleRawFilesChange}
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Raw Files List */}
                {rawFiles.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {rawFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-3 border border-orange-200">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.name)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRawFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.rawFiles && <p className="text-red-500 text-sm mt-1">{errors.rawFiles}</p>}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading Design...</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Design
              </>
            )}
          </button>
        </div>
      </form>

      {/* Upload Guidelines */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
          Upload Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Preview Image Requirements:</h4>
            <ul className="space-y-1">
              <li>• Supported formats: JPG, PNG, WebP</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Recommended resolution: 1200x1200px</li>
              <li>• High quality and clear visibility</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Raw File Requirements:</h4>
            <ul className="space-y-1">
              <li>• Supported formats: PSD, AI, PDF, CDR, EPS, SVG</li>
              <li>• Maximum file size: 50MB per file</li>
              <li>• Include all layers and elements</li>
              <li>• Multiple file formats are welcome</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> All designs go through an approval process. You&apos;ll be notified once your design is reviewed. 
            Make sure your design is original and follows our quality standards.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UploadPage